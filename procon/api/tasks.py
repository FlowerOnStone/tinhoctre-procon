from api.models import *
from celery import shared_task
import time
import os
import subprocess
import shutil
import signal
from api.referee_lib import Message
from .utils import create_round


def detect_danger_cpp(source):

    BANNED = [
        "pragma",
        "optimize",
        "target",
        "O3",
        "Ofast",
        "unroll-loops",
        "fast-math",
        "avx",
        "avx2",
        "sse",
        "sse2",
        "sse3",
        "system",
        "popen",
        "pclose",
        "_popen",
        "_pclose",
    ]
    ALLOW_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_"

    newCode = ""
    prevChar = ""
    lineComment = False
    blockComment = False

    words = []
    word = ""

    for ch in source:
        if ch == "\n":
            lineComment = False
            if not (lineComment or blockComment):
                newCode += ch
        elif ch == "*" and prevChar == "/":  # case /*
            if not (lineComment or blockComment):
                blockComment = True
        elif ch == "/":
            if prevChar == "/" and not (lineComment or blockComment):
                lineComment = True
            elif prevChar == "*" and not (lineComment):
                blockComment = False
        else:
            if not (lineComment or blockComment):
                if ch in ALLOW_CHARS:
                    word += ch
                else:
                    if word != "":
                        words.append(word)
                        word = ""
        prevChar = ch
    words.append(word)
    for word in words:
        if word in BANNED:
            return word
    return None


def detect_danger_py(source):
    keywords = ["system", "subprocess", " os.", "from os", "import os"]
    for keyword in keywords:
        if keyword in source:
            return keyword

    return None


def detect_danger_pas(source):
    return None


def detect_danger(submission: Submission):
    if submission.language.extension == "cpp":
        return detect_danger_cpp(source=submission.source)
    if submission.language.extension == "py":
        return detect_danger_py(source=submission.source)
    if submission.language.extension == "pas":
        return detect_danger_pas(source=submission.source)
    return False


def run_command(command):
    return subprocess.Popen(
        command,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )


def compile_code(filename, language):
    extension = language.extension
    compile_args = language.compile_args
    output = filename.split(".")[0]
    if extension == "cpp":
        compile_script = compile_args + f" {filename} -o {output}"
        compile_process = run_command(compile_script.split())
        stream_data = compile_process.stderr.readlines()
        compile_process.communicate()
        return_code = compile_process.returncode
        return return_code, stream_data
    if extension == "py":
        compile_script = compile_args + f" {filename}"
        compile_process = run_command(compile_script.split())
        stream_data = compile_process.stdout.readlines()
        compile_process.communicate()
        return_code = compile_process.returncode
        return return_code, stream_data
    if extension == "pas":
        compile_script = compile_args + f" {filename}"
        compile_process = run_command(compile_script.split())
        stream_data = compile_process.stderr.readlines()
        compile_process.communicate()
        return_code = compile_process.returncode
        return return_code, stream_data
    return None


def clear_file(filename, extension):
    output = filename.split(".")[0]
    if extension == "cpp":
        if output in os.listdir("."):
            os.remove(output)
    if extension == "py":
        if "__pycache__" in os.listdir("."):
            shutil.rmtree("__pycache__")
    if extension == "pas":
        if output in os.listdir("."):
            os.remove(output)
            os.remove(output + ".o")


@shared_task
def compile_submission(pk):
    submission = Submission.objects.get(pk=pk)

    if submission.status != SubmissionStatus.IN_QUEUE:
        return None
    submission.status = SubmissionStatus.PROCESSING
    submission.save()
    danger = detect_danger(submission)
    if danger != None:
        submission.log = f'You cannot use the word "{danger}" in code.'
        submission.status = SubmissionStatus.COMPILE_ERROR
        submission.save()
        return
    filename = str(pk) + "." + submission.language.extension
    with open(os.path.join("tmp/submission", filename), "w") as f:
        print(submission.source, file=f)
    os.chdir("tmp/submission")
    return_code, stream_data = compile_code(filename, submission.language)
    clear_file(filename, submission.language.extension)
    submission.log = "".join(stream_data)
    if return_code == 0:
        submission.status = SubmissionStatus.COMPILE_SUCCESS
    else:
        submission.status = SubmissionStatus.COMPILE_ERROR
    submission.save()
    os.remove(filename)
    os.chdir("../..")
    if submission.status == SubmissionStatus.COMPILE_ERROR:
        return None
    problem = submission.problem
    default_submission = DefaultSubmission.objects.get(problem=submission.problem)
    if default_submission != None and default_submission.submission != None:
        default_submission = default_submission.submission
        round = Round.objects.create(
            problem=submission.problem,
            first_user=default_submission.user,
            second_user=submission.user,
            first_submission=default_submission,
            second_submission=submission,
            num_match=1,
        )
        if round != None:
            match = Match.objects.create(
                round=round, testcase=0, status="Q", history=dict()
            )
            processing_match.delay_on_commit(match.pk)
    return None


class TimeoutException(Exception):
    pass


def timeout_handler(signum, frame):
    raise TimeoutException


def make_execute_command(file: str):
    if file.endswith(".py"):
        return ["python3", file]
    return ["./" + file]


def clear_msg(msg):
    return msg.replace("\n", "")


def read_from_player(player, timeout=5):
    """Get the response with a timeout using signal."""
    signal.signal(signal.SIGALRM, timeout_handler)
    signal.alarm(timeout)
    try:
        response = player.stdout.readline()
        response = clear_msg(response)
        signal.alarm(0)
        return response
    except TimeoutException:
        player.terminate()
        return Message.TIMEOUT
    except Exception as e:
        player.terminate()
        signal.alarm(0)
        return Message.ERROR


def write_to_process(proccess, msg):
    proccess.stdin.write(msg + "\n")
    proccess.stdin.flush()


def play_game(
    match: Match, player_1_file, player_2_file, referee, generator, seed_generator
):
    input_data = None
    seed = None
    if generator != None:
        seed_generator_proccess = run_command(["./" + seed_generator])
        seed = seed_generator_proccess.stdout.readline()
        seed_generator_proccess.terminate()
        seed_generator_proccess.wait()
        generator_command = ["/." + generator]
        generator_command.append(seed.split())
        generator_proccess = run_command(generator_command)
        input_data = generator_proccess.stdout.readlines()
        generator_proccess.terminate()
        generator_proccess.wait()
    referee_proccess = run_command(make_execute_command(referee))
    player_1_proccess = run_command(make_execute_command(player_1_file))
    player_2_proccess = run_command(make_execute_command(player_2_file))
    if input_data != None:
        write_to_process(referee_proccess, "".join(input_data))
    player_1_points = []
    player_2_points = []
    status = []
    inital_status = None
    tmp = ""
    errors = []
    while True:
        referee_message = clear_msg(referee_proccess.stdout.readline())
        if referee_message == Message.START_INITIAL_STATUS:
            tmp = ""
            write_to_process(proccess=referee_proccess, msg=Message.DONE)
            continue
        if referee_message == Message.WRITE_INITIAL_STATUS:
            msg = clear_msg(referee_proccess.stdout.readline())
            if msg != "":
                msg += "\n"
            tmp += msg
            write_to_process(proccess=referee_proccess, msg=Message.DONE)
            continue
        if referee_message == Message.END_INITIAL_STATUS:
            inital_status = tmp
            write_to_process(proccess=referee_proccess, msg=Message.DONE)
            continue
        if referee_message == Message.WRITE_TO_PLAYER_1:
            msg = clear_msg(referee_proccess.stdout.readline())
            write_to_process(proccess=player_1_proccess, msg=msg)
            write_to_process(proccess=referee_proccess, msg=Message.DONE)
            continue
        if referee_message == Message.WRITE_TO_PLAYER_2:
            msg = clear_msg(referee_proccess.stdout.readline())
            write_to_process(proccess=player_2_proccess, msg=msg)
            write_to_process(proccess=referee_proccess, msg=Message.DONE)
            continue
        if referee_message == Message.READ_FROM_PLAYER_1:
            msg = read_from_player(player_1_proccess)
            write_to_process(referee_proccess, msg=msg)
            continue
        if referee_message == Message.READ_FROM_PLAYER_2:
            msg = read_from_player(player_2_proccess)
            write_to_process(referee_proccess, msg=msg)
            continue
        if referee_message == Message.STEP_POINT:
            msg = clear_msg(referee_proccess.stdout.readline())
            point = list(map(int, msg.split()))
            player_1_points.append(point[0])
            player_2_points.append(point[1])
            write_to_process(proccess=referee_proccess, msg=Message.DONE)
            continue
        if referee_message == Message.FINAL_POINT:
            msg = clear_msg(referee_proccess.stdout.readline())
            tokens = msg.split()
            match.first_score = int(tokens[0])
            match.second_score = int(tokens[1])
            match.status = tokens[2]
            match.save()
            write_to_process(proccess=referee_proccess, msg=Message.DONE)
            break
        if referee_message == Message.START_STEP_STATUS:
            tmp = ""
            write_to_process(proccess=referee_proccess, msg=Message.DONE)
            continue
        if referee_message == Message.WRITE_STEP_STATUS:
            msg = clear_msg(referee_proccess.stdout.readline())
            if tmp != "":
                tmp += "\n"
            tmp += msg
            write_to_process(proccess=referee_proccess, msg=Message.DONE)
            continue
        if referee_message == Message.END_STEP_STATUS:
            status.append(tmp)
            write_to_process(proccess=referee_proccess, msg=Message.DONE)
            continue
        if referee_message == Message.ERROR:
            errors.append(clear_msg(referee_proccess.stdout.readline()))
            write_to_process(proccess=referee_proccess, msg=Message.DONE)
            continue

    referee_proccess.terminate()
    player_1_proccess.terminate()
    player_2_proccess.terminate()
    referee_proccess.wait()
    player_1_proccess.wait()
    player_2_proccess.wait()
    match.history = {
        "seed": seed,
        "inital_status": inital_status,
        "player_1_points": player_1_points,
        "player_2_points": player_2_points,
        "status": status,
    }
    if len(errors) > 0:
        match.history["errors"] = errors
    match.save()
    return match


def update_bracket_leaf(bracket, group: Group, result):
    for id in bracket["nodes"]:
        node = bracket["nodes"][id]
        if type(node["left_player"]) == str and node["left_player"] != "N/A":
            group_id, top = map(int, node["left_player"].split("_"))
            if group_id == group.id:
                node["left_player"] = result[top - 1][4]
        if type(node["right_player"]) == str and node["right_player"] != "N/A":
            group_id, top = map(int, node["right_player"].split("_"))
            if group_id == group.id:
                node["right_player"] = result[top - 1][4]
        if (
            type(node["left_player"]) == int
            and type(node["right_player"]) == int
            and node["round"] == -1
        ):
            left_player = User.objects.get(pk=node["left_player"])
            right_player = User.objects.get(pk=node["right_player"])
            round = create_round(
                first_user=left_player,
                second_user=right_player,
                problem=group.tournament.problem,
                num_match=node["num_match"],
                group=None,
                tournament=group.tournament,
                challenge=None,
            )
            node["round"] = round.pk


def update_group(group: Group):
    group_rounds = group.round_set.all()
    for round in group_rounds:
        if (
            round.status == Round.RoundStatus.NOT_STARTED
            or round.status == Round.RoundStatus.IN_PROGRESS
        ):
            return
    group.status = Group.GroupStatus.DONE
    result = dict()
    for participant in group.participants.all():
        result[participant.username] = {
            "id": participant.id,
            "win": 0,
            "draw": 0,
            "lose": 0,
            "point": 0,
        }
    for round in group_rounds:
        if round.status == "F":
            result[round.first_user.username]["win"] += 1
            result[round.second_user.username]["lose"] += 1
            result[round.first_user.username]["point"] += 3
        if round.status == "S":
            result[round.first_user.username]["lose"] += 1
            result[round.second_user.username]["win"] += 1
            result[round.second_user.username]["point"] += 3
        if round.status == "D":
            result[round.first_user.username]["draw"] += 1
            result[round.first_user.username]["point"] += 1
            result[round.second_user.username]["draw"] += 1
            result[round.second_user.username]["point"] += 1
    result = [
        (
            result[participant]["point"],
            result[participant]["win"],
            result[participant]["draw"],
            result[participant]["lose"],
            result[participant]["id"],
        )
        for participant in result
    ]
    result.sort(reverse=True)
    tournament = group.tournament
    bracket = tournament.tournament_table
    update_bracket_leaf(bracket, group, result)
    tournament.tournament_table = bracket
    tournament.save()


def update_tournament_round(round: Round):
    tournament = round.tournament
    bracket = tournament.tournament_table
    for id in bracket["nodes"]:
        node = bracket["nodes"][id]
        if node["round"] == round.pk:
            node["left_score"] = round.first_score
            node["right_score"] = round.second_score
            if node["parent"] != -1:
                parent = bracket["nodes"][str(node["parent"])]
                winner_id = round.first_user.id
                if round.status == Round.RoundStatus.SECOND_WIN:
                    winner_id = round.second_user.id
                if parent["left_child"] == int(id):
                    parent["left_player"] = winner_id
                else:
                    parent["right_player"] = winner_id
                if parent["left_player"] != "N/A" and parent["right_player"] != "N/A":
                    left_player = User.objects.get(pk=parent["left_player"])
                    right_player = User.objects.get(pk=parent["right_player"])
                    round = create_round(
                        first_user=left_player,
                        second_user=right_player,
                        problem=tournament.problem,
                        num_match=parent["num_match"],
                        group=None,
                        tournament=tournament,
                        challenge=None,
                    )
                    parent["round"] = round.pk
            break
    tournament.tournament_table = bracket
    tournament.save()


def update_challenge(round: Round):
    challenge = round.challenge
    challenge.status = Challenge.ChallengeStatus.DONE
    challenge.save()


def update_round(match: Match):
    round = match.round
    first_score = 0
    second_score = 0
    if match.status == Match.MatchStatus.DRAW:
        first_score = 1
        second_score = 1
    if match.status == Match.MatchStatus.FIRST_WIN:
        first_score = 3
        second_score = 0
    if match.status == Match.MatchStatus.SECOND_WIN:
        first_score = 0
        second_score = 3
    if match.type == 2:
        first_score, second_score = second_score, first_score
    round.first_score += first_score
    round.second_score += second_score
    round.save()
    if len(round.match_set.all()) == round.num_match:
        if round.first_score == round.second_score:
            round.status = Round.RoundStatus.DRAW
        elif round.first_score > round.second_score:
            round.status = Round.RoundStatus.FIRST_WIN
        else:
            round.status = Round.RoundStatus.SECOND_WIN
        round.save()
        if round.group is not None:
            update_group(round.group)
        if round.tournament is not None:
            update_tournament_round(round)
        if round.challenge is not None:
            update_challenge(round)


def start_group(group: Group):
    if group.status == Group.GroupStatus.NOT_STARTED:
        group.status = Group.GroupStatus.IN_PROGRESS
        group.save()


def start_round(round: Round):
    if round.status == Round.RoundStatus.NOT_STARTED:
        round.status = Round.RoundStatus.IN_PROGRESS
        round.save()
        if round.group is not None:
            start_group(round.group)


@shared_task
def processing_match(match_id):
    match = Match.objects.get(id=match_id)
    if match.status != Match.MatchStatus.IN_QUEUE:
        return None
    match.status = Match.MatchStatus.PROCESSING
    match.save()
    start_round(match.round)
    round = match.round
    first_submission = round.first_submission
    second_submission = round.second_submission
    if match.type == 2:
        first_submission, second_submission = second_submission, first_submission
    if first_submission is None and second_submission is None:
        match.status = Match.MatchStatus.DRAW
        match.first_score = 0
        match.second_score = 0
        match.save()
        update_round(match)
        return None
    if first_submission is None:
        match.status = Match.MatchStatus.SECOND_WIN
        match.first_score = 0
        match.second_score = 1
        match.save()
        update_round(match)
        return None
    if second_submission is None:
        match.status = Match.MatchStatus.FIRST_WIN
        match.first_score = 1
        match.second_score = 0
        match.save()
        update_round(match)
        return None
    problem = round.problem
    test_data = TestData.objects.get(problem=problem)
    folder = f"tmp/match/{match_id}"
    os.makedirs(folder)
    player_1_file = "player1." + first_submission.language.extension
    player_2_file = "player2." + second_submission.language.extension
    with open(os.path.join(folder, player_1_file), "w") as f:
        print(first_submission.source, file=f)
    with open(os.path.join(folder, player_2_file), "w") as f:
        print(second_submission.source, file=f)
    referee = test_data.referee.name.split("/")[-1]
    shutil.copy(test_data.referee.path, os.path.join(folder, referee))
    shutil.copy("api/referee_lib.py", os.path.join(folder, "referee_lib.py"))

    generator = None
    seed_generator = None
    if test_data.generator.name:
        generator = test_data.generator.name.split("/")[-1]
        seed_generator = test_data.generator.name.split("/")[-1]
        shutil.copy(test_data.generator.path, os.path.join(folder, generator))
        shutil.copy(test_data.seed_generator.path, os.path.join(folder, seed_generator))
    os.chdir(folder)
    if first_submission.language.extension != "py":
        compile_code(player_1_file, first_submission.language)
        player_1_file = player_1_file.split(".")[0]
    if second_submission.language.extension != "py":
        compile_code(player_2_file, second_submission.language)
        player_2_file = player_2_file.split(".")[0]
    result = play_game(
        match, player_1_file, player_2_file, referee, generator, seed_generator
    )
    update_round(match)
    os.chdir("../../..")
    shutil.rmtree(folder)
    return None
