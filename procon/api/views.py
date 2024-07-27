from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from knox.models import AuthToken
from .serializers import *
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .utils import *
import random
from datetime import datetime
from django.utils import timezone
from django.conf import settings


class ListTimezoneAPI(generics.ListAPIView):
    model = Timezone
    serializer_class = TimezoneSerializer

    def get(self, request, *args, **kwargs):
        timezones = Timezone.objects.all()
        timezones_serializer = TimezoneSerializer(timezones, many=True)
        return JsonResponse(timezones_serializer.data, safe=False)


class ListProgramLanguageAPI(generics.ListAPIView):
    model = ProgramLanguage
    serializer_class = ProgramLanguageSerializer

    def get(self, request, *args, **kwargs):
        program_languages = ProgramLanguage.objects.all()
        program_languages_serializer = ProgramLanguageSerializer(
            program_languages, many=True
        )
        return JsonResponse(program_languages_serializer.data, safe=False)


class RegisterAPI(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        timezone = get_object_or_404(Timezone, id=request.data["timezone"])
        preferred_language = get_object_or_404(
            ProgramLanguage, id=request.data["preferred_language"]
        )
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        user_profile = UserProfile.objects.create(
            user=user, timezone=timezone, preferred_language=preferred_language
        )
        user_profile.save()

        return Response(
            {
                "user": UserSerializer(
                    user, context=self.get_serializer_context()
                ).data,
                "token": AuthToken.objects.create(user)[1],
            }
        )


class UpdateUserProfileAPI(generics.UpdateAPIView):
    model = User
    serializer_class = UserProfileSerializer
    permission_classes = (IsAuthenticated,)

    def update(self, request, *args, **kwargs):
        timezone = get_object_or_404(Timezone, id=request.data["timezone"])
        preferred_language = get_object_or_404(
            ProgramLanguage, id=request.data["preferred_language"]
        )
        serializer = ChangeUserInfoSerializer(self.request.user, data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        user_profile = UserProfile.objects.get(user=user)
        user_profile.timezone = timezone
        user_profile.preferred_language = preferred_language
        user_profile.save()
        return Response(
            {
                "user": UserSerializer(
                    user, context=self.get_serializer_context()
                ).data,
            }
        )


class UpdatePasswordAPI(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated,)

    def update(self, request, *args, **kwargs):
        user = self.request.user
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            if not user.check_password(serializer.data.get("old_password")):
                return Response(
                    {"old_password": ["Wrong password."]},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # set_password also hashes the password that the user will get
            user.set_password(serializer.data.get("new_password"))
            user.save()
            return JsonResponse(
                {
                    "message": "Password updated successfully",
                },
                status=status.HTTP_200_OK,
            )

        return JsonResponse(
            {"error": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


class ListUserAPI(generics.ListAPIView):
    model = User
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        users = User.objects.all()
        users_serializer = UserSerializer(users, many=True)
        return JsonResponse(users_serializer.data, safe=False)


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response(
            {
                "user": UserSerializer(
                    user, context=self.get_serializer_context()
                ).data,
                "token": AuthToken.objects.create(user)[1],
            }
        )


class ListCreateProblemAPI(generics.ListCreateAPIView):
    model = Problem
    serializer_class = ListProblemSerializer

    def get(self, request, *args, **kwargs):
        problems = []
        if self.request.user.is_superuser:
            problems = Problem.objects.all()
        else:
            problems = Problem.objects.filter(public_visible=True)
        problems_serializer = ListProblemSerializer(problems, many=True)
        return JsonResponse(problems_serializer.data, safe=False)

    def create(self, request, *args, **kwargs):
        if not self.request.user.is_superuser and not self.request.user.is_staff:
            return JsonResponse(
                {"message": "You don't have permision to create a new Problem!"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = ProblemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(
                {"message": "Create a new Problem successful!"},
                status=status.HTTP_201_CREATED,
            )

        return JsonResponse(
            {
                "message": "Create a new Problem unsuccessful!",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class RetrieveUpdateDestroyProblemAPI(generics.RetrieveUpdateDestroyAPIView):
    model = Problem
    serializer_class = ProblemSerializer

    def get(self, request, *args, **kwargs):
        problem = get_object_or_404(Problem, slug=kwargs.get("problem_slug"))
        if problem.public_visible == False:
            if (
                not self.request.user.is_superuser
                and self.request.user not in problem.creator.all()
            ):
                return JsonResponse(
                    {"message": "You do not have permission to view this problem!"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        serializer = ProblemSerializer(problem)
        return JsonResponse({"problem": serializer.data}, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        problem = get_object_or_404(Problem, slug=kwargs.get("problem_slug"))
        if (
            not self.request.user.is_superuser
            and self.request.user not in problem.creator.all()
        ):
            return JsonResponse(
                {"message": "You do not have permission to update this problem!"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer = ProblemSerializer(problem, request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(
                {"message": "Update problem successful!"}, status=status.HTTP_200_OK
            )
        return JsonResponse(
            {"message": "Update problem unsuccessful!"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete(self, request, *args, **kwargs):
        problem = get_object_or_404(Problem, slug=kwargs.get("problem_slug"))
        if (
            not self.request.user.is_superuser
            and self.request.user not in problem.creator.all()
        ):
            return JsonResponse(
                {"message": "You do not have permission to delete this problem!"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        problem.delete()
        return JsonResponse(
            {"message": "Delete problem successful!"}, status=status.HTTP_200_OK
        )


class RetrieveUpdateDestroyTestcaseAPI(generics.RetrieveUpdateDestroyAPIView):
    pass


class ListSubmissionAPI(generics.ListAPIView):
    model = Submission
    serializer_class = ListSubmissionSerializer

    def get(self, request, *args, **kwargs):
        submissions = Submission.objects.all()
        submissions_serializer = ListSubmissionSerializer(submissions, many=True)
        return JsonResponse(
            submissions_serializer.data, safe=False, status=status.HTTP_200_OK
        )


class SubmitProblemAPI(generics.CreateAPIView):
    models = Submission
    serializer_class = CreateSubmissionSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        data = dict()
        problem = get_object_or_404(Problem, slug=kwargs.get("problem_slug"))
        if problem.public_visible == False:
            if (
                not self.request.user.is_superuser
                and self.request.user not in problem.creator.all()
            ):
                return JsonResponse(
                    {"message": "You do not have permission to submit this problem!"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        data["problem"] = problem.id
        data["user"] = self.request.user.id
        data["code"] = request.data["code"]
        data["language"] = self.request.data["language"]
        serializer = CreateSubmissionSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return JsonResponse({"status": "success"}, status=status.HTTP_201_CREATED)
        return JsonResponse({"status": "error"}, status=status.HTTP_400_BAD_REQUEST)


class ListProblemSubmissionAPI(generics.ListAPIView):
    model = Submission
    serializer_class = ListSubmissionSerializer

    def get(self, request, *args, **kwargs):
        problem = get_object_or_404(Problem, slug=kwargs.get("problem_slug"))
        if problem.public_visible == False:
            if (
                not self.request.user.is_superuser
                and self.request.user not in problem.creator.all()
            ):
                return JsonResponse(
                    {
                        "message": "You do not have permission to view submission of this problem!"
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        submissions = Submission.objects.filter(problem=problem)
        submissions_serializer = ListSubmissionSerializer(submissions, many=True)
        return JsonResponse(
            submissions_serializer.data, safe=False, status=status.HTTP_200_OK
        )


class RetrieveSubmissionAPI(generics.RetrieveAPIView):
    model = Submission
    serializer_class = SubmissionSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        submission = get_object_or_404(Submission, id=kwargs.get("pk"))
        serializer = SubmissionSerializer(submission)
        if not self.request.user.is_superuser and self.request.user != submission.user:
            serializer = SubmissionSerializer(submission)
        return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)


class ListCreateTournamentAPI(generics.ListCreateAPIView):
    model = Tournament

    def log_num_group(self, num_group):
        cnt = 0
        while num_group != 1:
            if num_group % 2 != 0:
                return -1
            num_group //= 2
            cnt += 1
        return cnt

    def create_group(self, tournament, users, problem, num_match, index):
        group = Group.objects.create(
            tournament=tournament, index=index, num_match=num_match
        )
        for user in users:
            group.participants.add(user)
        for i in range(len(users)):
            for j in range(i + 1, len(users)):
                create_round(
                    first_user=users[i],
                    second_user=users[j],
                    problem=problem,
                    num_match=num_match,
                    group=group,
                    tourament=None,
                )
        return group

    def create_tournament_table(self, id, level, left, right, bracket_seed, num_match):
        if level == 0:
            return {
                "id": id,
                "type": "leaf",
                "left": bracket_seed[left],
                "right": bracket_seed[right],
                "num_match": num_match[level],
                "round": "N/A",
            }
        mid = (left + right) // 2
        left_path = self.create_tournament_table(
            id * 2, level - 1, left, mid, bracket_seed, num_match
        )
        right_path = self.create_tournament_table(
            id * 2 + 1, level - 1, mid + 1, right, bracket_seed, num_match
        )
        return {
            "id": id,
            "type": "node",
            "left": "N/A",
            "right": "N/A",
            "left_path": left_path,
            "right_path": right_path,
            "num_match": num_match[level],
            "round": "N/A",
        }

    def create(self, request, *args, **kwargs):
        if not self.request.user.is_superuser:
            return JsonResponse(
                {"message": "You don't have permission to create tourament"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        num_group = int(self.request.data["num_group"])
        num_matchs = request.data.getlist("num_match")
        log_num_group = self.log_num_group(num_group)
        if log_num_group == -1:
            return JsonResponse(
                {"message": "The number of groups is not power of 2"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if len(num_matchs) != log_num_group + 1:
            return JsonResponse(
                {"message": "Does not enough num_match"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if len(self.request.data.getlist("participants")) % num_group != 0:
            return JsonResponse(
                {
                    "message": "The number of participants is not divisible by the number of groups"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        data = dict(request.data)
        data["tournament_table"] = dict()
        data["creators"] = [self.request.user.id]
        data["name"] = data["name"][0]
        data["num_group"] = num_group
        data["start_submission_time"] = data["start_submission_time"][0]
        data["end_submission_time"] = data["end_submission_time"][0]
        data["start_combat_time"] = data["start_combat_time"][0]
        data["end_combat_time"] = data["end_combat_time"][0]
        serializer = TournamentSerializer(data=data)
        if not serializer.is_valid():
            return JsonResponse(
                {"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )
        tournament = serializer.save()
        tournament.problem = get_object_or_404(Problem, pk=data["problem"][0])
        participants = tournament.participants.all()
        num_user_per_group = len(participants) // num_group
        groups = []
        for index in range(0, len(participants), num_user_per_group):
            groups.append(
                self.create_group(
                    tournament=tournament,
                    users=participants[index : index + num_user_per_group],
                    problem=tournament.problem,
                    num_match=int(self.request.data["num_match_of_group"]),
                    index=index + 1,
                )
            )
        bracket_seed = []
        for index in range(0, num_group, 2):
            bracket_seed.append(str(groups[index].id) + "_1")
            bracket_seed.append(str(groups[index + 1].id) + "_2")
            bracket_seed.append(str(groups[index + 1].id) + "_1")
            bracket_seed.append(str(groups[index].id) + "_2")
        num_matchs = [int(num_match) for num_match in num_matchs]
        tournament.tournament_table = self.create_tournament_table(
            1, len(num_matchs) - 1, 0, len(bracket_seed) - 1, bracket_seed, num_matchs
        )
        tournament.save()
        return JsonResponse(
            {"message": "create tournament success"}, status=status.HTTP_201_CREATED
        )

    def get(self, request, *args, **kwargs):
        tournaments = Tournament.objects.all()
        tournaments_serializer = ListTournamentSerializer(tournaments, many=True)
        return JsonResponse(
            {"touraments": tournaments_serializer.data}, status=status.HTTP_200_OK
        )


class RetrieveTouramentGroupAPI(generics.RetrieveAPIView):
    model = Group
    serializer_class = GroupSerializer

    def get(self, request, *args, **kwargs):
        tournament = Tournament.objects.get(id=kwargs.get("id"))
        if (
            not self.request.user.is_superuser
            and self.request.user not in tournament.creators.all()
            and self.request.user not in tournament.participants.all()
        ):
            return JsonResponse(
                {
                    "message": "you don't have permission to view groups of this tournament"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        groups = tournament.group_set.all()
        groups_serializer = GroupSerializer(groups, many=True)
        return JsonResponse(
            {"groups": groups_serializer.data}, status=status.HTTP_200_OK
        )


class RetrieveTournamentAPI(generics.RetrieveAPIView):
    model = Tournament
    serializer_class = TournamentSerializer

    def get(self, request, *args, **kwargs):
        tournament = get_object_or_404(Tournament, pk=kwargs.get("id"))
        if (
            not self.request.user.is_superuser
            and self.request.user not in tournament.creators.all()
            and self.request.user not in tournament.participants.all()
        ):
            return JsonResponse(
                {"message": "you don't have permission to view rounds of this group"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        tournament_serializer = TournamentSerializer(tournament)
        return JsonResponse(
            {"tourament": tournament_serializer.data},
            status=status.HTTP_200_OK,
        )


class RetrieveGroupRoundAPI(generics.RetrieveAPIView):
    model = Round
    serializer_class = RoundSerializer

    def get(self, request, *args, **kwargs):
        group = Group.objects.get(pk=kwargs.get("id"))
        if (
            not self.request.user.is_superuser
            and self.request.user not in group.tournament.creators.all()
            and self.request.user not in group.tournament.participants.all()
        ):
            return JsonResponse(
                {"message": "you don't have permission to view rounds of this group"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        rounds = group.round_set.all()
        rounds_serializer = RoundSerializer(rounds, many=True)
        return JsonResponse(
            {"rounds": rounds_serializer.data}, status=status.HTTP_200_OK
        )


class ListCreateRoundAPI(generics.ListCreateAPIView):
    model = Round
    serializer_class = RoundSerializer

    def create(self, request, *args, **kwargs):
        if self.request.user.is_anonymous:
            return JsonResponse(
                {"message": "you don't have permission to create round"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        data = request.data
        second_user = get_object_or_404(User, pk=data["user"])
        problem = get_object_or_404(Problem, pk=data["problem"])
        round = create_round(
            first_user=self.request.user,
            second_user=second_user,
            problem=problem,
            num_match=int(data["num_match"]),
            group=None,
            tourament=None,
        )
        return JsonResponse(
            {"message": "create round success", "round": RoundSerializer(round).data},
            status=status.HTTP_201_CREATED,
        )

    def get(self, request, *args, **kwargs):
        rounds = Round.objects.all()
        rounds_serializer = RoundSerializer(rounds, many=True)
        return JsonResponse(
            {"rounds": rounds_serializer.data}, status=status.HTTP_200_OK
        )


class ListCreateMatchAPI(generics.ListCreateAPIView):
    model = Match
    serializer_class = MatchSerializer

    def create(self, request, *args, **kwargs):
        round = get_object_or_404(Round, pk=kwargs.get("id"))
        if (
            not self.request.user.is_superuser
            and self.request.user != round.first_user
            and self.request.user != round.second_user
        ):
            return JsonResponse(
                {"message": "you don't have permission to create match"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        num_match = len(round.match_set.all())
        if num_match == round.num_match:
            return JsonResponse(
                {"message": "round is full match"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        match = Match.objects.create(
            round=round, testcase=0, status="D", history=dict()
        )
        return JsonResponse(
            {"match": MatchSerializer(match).data}, status=status.HTTP_201_CREATED
        )

    def get(self, request, *args, **kwargs):
        round = get_object_or_404(Round, pk=kwargs.get("id"))
        if (
            not self.request.user.is_superuser
            and self.request.user != round.first_user
            and self.request.user != round.second_user
        ):
            return JsonResponse(
                {"message": "you don't have permission to view matchs of round"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        matchs = round.match_set.all()
        matchs_serializer = MatchSerializer(matchs, many=True)
        return JsonResponse(
            {"matchs": matchs_serializer.data}, status=status.HTTP_200_OK
        )


class RetrieveMatchAPI(generics.RetrieveAPIView):
    model = Match
    serializer_class = MatchSerializer

    def get(self, request, *args, **kwargs):
        match = get_object_or_404(Match, pk=kwargs.get("id"))
        if (
            not self.request.user.is_superuser
            and self.request.user != match.round.first_user
            and self.request.user != match.round.second_user
        ):
            return JsonResponse(
                {"message": "you don't have permission to view this match"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        match_serializer = MatchSerializer(match)
        return JsonResponse({"match": match_serializer.data}, status=status.HTTP_200_OK)
