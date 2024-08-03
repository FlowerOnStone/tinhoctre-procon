from .models import *
from .serializers import *


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
    result = {participant["username"]: participant for participant in result}
    return result


def serialize_bracket(bracket):
    if bracket["left"] != "N/A" and not bracket["left"].find("_"):
        bracket["left"] = User.objects.get(id=bracket["left"]).first_name
    if bracket["right"] != "N/A" and not bracket["right"].find("_"):
        bracket["right"] = User.objects.get(id=bracket["right"]).first_name
    if bracket["round"] != "N/A":
        bracket["round"] = RoundSerializer(Round.objects.get(id=bracket["round"])).data
    if bracket["type"] == "leaf":
        return None
    serialize_bracket(bracket["left_path"])
    serialize_bracket(bracket["right_path"])
