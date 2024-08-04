from .models import *
from .serializers import *
from datetime import datetime

def log_2(x):
    cnt = 0
    while x != 1:
        if x % 2 != 0:
            return -1
        x //= 2
        cnt += 1
    return cnt


def get_last_submission(user: User, problem: Problem) -> Submission:
    submissions = Submission.objects.filter(user=user, problem=problem).order_by("-id")
    for submission in submissions:
        if submission.status == SubmissionStatus.COMPILE_SUCCESS:
            return submission
    return None


def create_round(
    first_user: User,
    second_user: User,
    problem: Problem,
    num_match: int,
    group: Group,
    tournament: Tournament,
) -> Round:
    first_submission = get_last_submission(first_user, problem)
    second_submission = get_last_submission(second_user, problem)
    result = Round.objects.create(
        problem=problem,
        first_user=first_user,
        second_user=second_user,
        first_submission=first_submission,
        second_submission=second_submission,
        num_match=num_match,
    )
    result.group = group
    result.tournament = tournament
    result.save()
    return result


def group_summary(group: Group) -> dict:
    def point(x):
        return x["point"]

    rounds = group.round_set.all()
    result = dict()
    for participant in group.participants.all():
        result[participant.username] = {
            "username": participant.username,
            "name": participant.first_name,
            "num_round": 0,
            "win": 0,
            "draw": 0,
            "lose": 0,
            "point": 0,
        }
    for round in rounds:
        result[round.first_user.username]["num_round"] += 1
        result[round.second_user.username]["num_round"] += 1
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
    result = [result[participant] for participant in result]
    result.sort(key=point, reverse=True)
    result = {index: result[index] for index in range(len(result))}
    return result


def serialize_bracket(bracket):
    def serialize_id(id):
        if type(id) == str:
            if id == "N/A":
                return "N/A"
            if id.find("_"):
                tokens = id.split("_")
                group = Group.objects.get(pk=int(tokens[0]))
                group_id = chr(ord("A") + group.index - 1)
                top = "Nhất"
                if int(tokens[1]) == 2:
                    top = "Nhì"
                return f"{top} bảng {group_id}"
        user = User.objects.get(pk=int(id))
        return user.first_name

    for id in bracket["nodes"]:
        bracket["nodes"][id]["left_player"] = serialize_id(
            bracket["nodes"][id]["left_player"]
        )
        bracket["nodes"][id]["right_player"] = serialize_id(
            bracket["nodes"][id]["right_player"]
        )



def current_time_in_range(start, end):
    return start <= datetime.now() and datetime.now() <= end


def check_view_problem_permission(user: User, problem: Problem) -> bool:
    if problem.public_visible:
        return True
    if user.is_superuser:
        return True
    if user in problem.creator.all():
        return True
    tournaments = Tournament.objects.all()
    for tournament in tournaments:
        if tournament.problem == problem and user in tournament.participants.all():
            if current_time_in_range(tournament.start_submission_time, tournament.end_submission_time):
                return True
            if current_time_in_range(tournament.start_combat_time, tournament.end_combat_time):
                return True
    return True


def check_create_challenge_permission(user: User, problem: Problem):
    if user.is_superuser:
        return True
    if user in problem.creator.all():
        return True
    tournaments = Tournament.objects.all()
    for tournament in tournaments:
        if tournament.problem == problem and user in tournament.creators.all():
            if current_time_in_range(tournament.start_combat_time, tournament.end_combat_time):
                return True
    return False

def check_create_match_permission(user: User, round: Round):
    if user.is_superuser:
        return True
    if round.tournament is not None and round.group is not None:
        return False
    if round.first_user == user or round.second_user == user:
        return True
    return False

def check_view_tournament_permission(user: User, tournament: Tournament):
    if user.is_superuser:
        return True
    if user in tournament.creators.all():
        return True
    if tournament.participants.filter(pk=user.pk).exists() and datetime.now() >= tournament.start_submission_time:
        return True
    return False
