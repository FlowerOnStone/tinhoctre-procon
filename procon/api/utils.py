from .models import *


def get_last_submission(user: User, problem: Problem) -> Submission:
    submissions = Submission.objects.filter(user=user, problem=problem).order_by("-id")
    if len(submissions) == 0:
        return None
    return submissions[0]


def create_round(
    first_user: User,
    second_user: User,
    problem: Problem,
    num_match: int,
    group: Group,
    tourament: Tournament,
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
    result.tournament = tourament
    result.save()
    return result
