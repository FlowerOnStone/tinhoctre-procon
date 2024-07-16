from django.db import models
from django.conf import Settings
from django.contrib.auth.models import User

# Create your models here.


class ProgramLanguage(models.Model):
    def __str__(self) -> str:
        return self.name
    name = models.CharField(max_length=16)
    compile_args = models.CharField(max_length=64)


class Timezone(models.Model):
    def __str__(self) -> str:
        return self.zone + "/" + self.location
    zone = models.CharField(max_length=16)
    location = models.CharField(max_length=32, null=True, blank=True)
    offset = models.IntegerField()
    offset_dst = models.IntegerField()


class UserProfile(models.Model):
    def __str__(self) -> str:
        return self.user.username
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=False, null=False)
    timezone = models.ForeignKey(
        Timezone, on_delete=models.CASCADE, blank=False, null=True
    )
    preferred_language = models.ForeignKey(
        ProgramLanguage, on_delete=models.DO_NOTHING, blank=False, null=True
    )
    last_access_time = models.TimeField(null=True)
    last_ip = models.BinaryField(null=True)


class Problem(models.Model):
    def __str__(self) -> str:
        return self.name + " (" + self.slug + ")"

    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=128)
    public_visible = models.BooleanField()
    creator = models.ManyToManyField(User)
    body = models.CharField(max_length=65536)
    pdf = models.FileField(null=True)
    time_limit = models.IntegerField()
    memory_limit = models.IntegerField()
    allow_language = models.BinaryField()
    test_data = models.FileField(null=True, blank=True)


class TestCase(models.Model):
    problem = models.ForeignKey(
        Problem, on_delete=models.CASCADE, blank=False, null=False
    )
    sequence_number = models.IntegerField()
    input_path = models.CharField(max_length=256)
    output_path = models.CharField(max_length=256)
    point = models.IntegerField()


class LanguageSpecificTemplates(models.Model):
    problem = models.ForeignKey(
        Problem, on_delete=models.CASCADE, blank=False, null=False
    )
    language = models.CharField(max_length=10)
    code = models.CharField(max_length=65536)


class SubmissionStatus(models.TextChoices):
    ACCEPTED = "AC"
    WRONG_ANSWER = "WA"
    RUNTIME_EXCEPTION = "RTE"
    INVALID_RETURN = "IR"
    OUTPUT_LIMIT_EXCEEDED = "OLE"
    MEMORY_LIMIT_EXCEEDED = "MLE"
    TIME_LIMIT_EXCEEDED = "TLE"
    INTERNAL_ERROR = "IE"
    COMPILE_ERROR = "CE"
    ABORTED = "AB"


class Submission(models.Model):
    def __str__(self) -> str:
        return self.id
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=False, null=False)
    problem = models.ForeignKey(
        Problem, on_delete=models.CASCADE, blank=False, null=False
    )
    language = models.ForeignKey(
        ProgramLanguage, on_delete=models.DO_NOTHING, blank=False, null=True
    )
    code = models.CharField(max_length=65536)
    status = models.CharField(
        max_length=3, choices=SubmissionStatus.choices, default="AB"
    )
    total_point = models.IntegerField(default=0)
    time = models.IntegerField(default=0)
    memory = models.IntegerField(default=0)


class TestCaseResult(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, blank=False)
    input_text = models.CharField(max_length=256)
    output_text = models.CharField(max_length=256)
    answer_text = models.CharField(max_length=256)
    time = models.IntegerField()
    memory = models.IntegerField()
    status = models.CharField(
        max_length=3, choices=SubmissionStatus.choices, default="AB"
    )
    log = models.CharField(max_length=256)


class Tournament(models.Model):
    creators = models.ManyToManyField(User, related_name="tournament_creators")
    participant = models.ManyToManyField(User, related_name="tournament_participant")
    tournament_table = models.JSONField()


class Group(models.Model):
    creators = models.ManyToManyField(User, related_name="creators")
    participants = models.ManyToManyField(User, related_name="participants")


class Round(models.Model):
    tournament = models.ForeignKey(
        Tournament, on_delete=models.SET_NULL, blank=True, null=True
    )
    group = models.ForeignKey(Group, on_delete=models.SET_NULL, blank=True, null=True)
    first_submission = models.ForeignKey(
        Submission,
        on_delete=models.CASCADE,
        blank=False,
        null=False,
        related_name="round_first_submission",
    )
    second_submission = models.ForeignKey(
        Submission,
        on_delete=models.CASCADE,
        blank=False,
        null=False,
        related_name="round_second_submission",
    )
    num_match = models.IntegerField()


class Match(models.Model):
    class MatchStatus(models.TextChoices):
        FIRST_WIN = "F"
        SECOND_WIN = "S"
        DRAW = "D"

    round = models.ForeignKey(Round, on_delete=models.CASCADE, blank=False, null=False)
    first_submission = models.ForeignKey(
        Submission,
        on_delete=models.CASCADE,
        blank=False,
        null=False,
        related_name="match_first_submission",
    )
    second_submission = models.ForeignKey(
        Submission,
        on_delete=models.CASCADE,
        blank=False,
        null=False,
        related_name="match_second_submission",
    )
    status = models.CharField(max_length=1, choices=MatchStatus.choices, default="D")
    history = models.JSONField()
