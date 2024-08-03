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
from django.db.models import Q
from .tasks import *


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
        user_data = UserSerializer(user).data
        user_data["is_admin"] = user.is_superuser
        user_data["preferred_language"] = ProgramLanguageSerializer(
            user_profile.preferred_language
        ).data
        return Response(
            {
                "user": user_data,
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
                    "message": "Password updated successful",
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
        user_data = UserSerializer(user, context=self.get_serializer_context()).data
        user_data["is_admin"] = user.is_superuser
        user_profile = UserProfile.objects.get(user=user)
        user_data["preferred_language"] = ProgramLanguageSerializer(
            user_profile.preferred_language
        ).data
        return Response(
            {"user": user_data, "token": AuthToken.objects.create(user)[1]},
            status=status.HTTP_200_OK,
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
            problem = serializer.save()
            test_data = TestData.objects.create(problem=problem)
            test_data.save()
            default_submission = DefaultSubmission.objects.create(problem=problem)
            default_submission.save()
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
                    status=status.HTTP_403_FORBIDDEN,
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
                status=status.HTTP_403_FORBIDDEN,
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
                status=status.HTTP_403_FORBIDDEN,
            )
        problem.delete()
        return JsonResponse(
            {"message": "Delete problem successful!"}, status=status.HTTP_200_OK
        )


class RetrieveUpdateTestdataAPI(generics.RetrieveUpdateAPIView):
    model = TestData
    serializer_class = TestDataSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        problem = get_object_or_404(Problem, slug=kwargs.get("problem_slug"))
        if (
            not self.request.user.is_superuser
            and self.request.user not in problem.creator.all()
        ):
            return JsonResponse(
                {
                    "message": "You do not have permission to view test data of this problem!"
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        testdata = TestData.objects.get(problem=problem)
        return JsonResponse(
            {"testdata": TestDataSerializer(testdata).data}, status=status.HTTP_200_OK
        )

    def update(self, request, *args, **kwargs):
        problem = get_object_or_404(Problem, slug=kwargs.get("problem_slug"))
        if (
            not self.request.user.is_superuser
            and self.request.user not in problem.creator.all()
        ):
            return JsonResponse(
                {
                    "message": "You do not have permission to update test data of this problem!"
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        testdata = TestData.objects.get(problem=problem)
        serializer = TestDataSerializer(testdata, request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(
                {"message": "Update testdata successful!"}, status=status.HTTP_200_OK
            )
        return JsonResponse(
            {"message": "Update testdata unsuccessful!"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class RetrieveUpdateDefaultSubmissionAPI(generics.RetrieveUpdateAPIView):
    model = DefaultSubmission
    serializer_class = DefaultSubmissionSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        problem = get_object_or_404(Problem, slug=kwargs.get("problem_slug"))
        if (
            not self.request.user.is_superuser
            and self.request.user not in problem.creator.all()
        ):
            return JsonResponse(
                {
                    "message": "You do not have permission to view default submission of this problem!"
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        default_submission = DefaultSubmission.objects.get(problem=problem)
        return JsonResponse(
            {
                "default_submission": DefaultSubmissionSerializer(
                    default_submission
                ).data
            },
            status=status.HTTP_200_OK,
        )

    def update(self, request, *args, **kwargs):
        problem = get_object_or_404(Problem, slug=kwargs.get("problem_slug"))
        if (
            not self.request.user.is_superuser
            and self.request.user not in problem.creator.all()
        ):
            return JsonResponse(
                {
                    "message": "You do not have permission to update default submission of this problem!"
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        submission = get_object_or_404(Submission, pk=request.data["submission"])
        if submission.problem != problem:
            return JsonResponse(
                {"message": "this submission is not submission of this problem!"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if submission.status != SubmissionStatus.COMPILE_SUCCESS:
            return JsonResponse(
                {"message": "submission need to compile success!"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        default_submission = DefaultSubmission.objects.get(problem=problem)
        default_submission.submission = submission
        default_submission.save()
        return JsonResponse(
            {
                "message": "Update default submission successful!",
                "default_submission": DefaultSubmissionSerializer(
                    default_submission
                ).data,
            },
            status=status.HTTP_200_OK,
        )


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
                    status=status.HTTP_403_FORBIDDEN,
                )

        data["problem"] = problem.id
        data["user"] = self.request.user.id
        data["source"] = request.data["source"]
        data["language"] = self.request.data["language"]
        serializer = CreateSubmissionSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            submission = serializer.save()
            print(submission.pk)
            compile_submission.delay_on_commit(submission.pk)
            return JsonResponse(
                {"status": "successful"}, status=status.HTTP_201_CREATED
            )
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
                    status=status.HTTP_403_FORBIDDEN,
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

    def create(self, request, *args, **kwargs):
        if not self.request.user.is_superuser:
            return JsonResponse(
                {"message": "You don't have permission to create tournament"},
                status=status.HTTP_403_FORBIDDEN,
            )
        num_group = int(self.request.data["num_group"])
        log_num_group = log_2(num_group)
        if log_num_group == -1:
            return JsonResponse(
                {"message": "The number of groups is not power of 2"},
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
        tournament.save()
        return JsonResponse(
            {"message": "create tournament successful"}, status=status.HTTP_201_CREATED
        )

    def get(self, request, *args, **kwargs):
        tournaments = Tournament.objects.all()
        tournaments_serializer = ListTournamentSerializer(tournaments, many=True)
        return JsonResponse(
            {"tournaments": tournaments_serializer.data}, status=status.HTTP_200_OK
        )


class ListCreateTournamentGroupAPI(generics.ListCreateAPIView):
    model = Group
    serializer_class = GroupSerializer
    permission_classes = (IsAuthenticated,)

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
                    tournament=None,
                )
        return group

    def create_tournament_table(
        self, nodes, level, left, right, bracket_seed, num_match
    ):
        if right - left == 1:
            self.cnt += 1
            nodes[str(self.cnt)] = {
                "parent": -1,
                "left_child": -1,
                "right_child": -1,
                "left_player": bracket_seed[left],
                "right_player": bracket_seed[right],
                "left_score": -1,
                "right_score": -1,
                "round": -1,
                "knockout": 2 ** (level + 1),
            }
            return self.cnt
        mid = (left + right) // 2
        node = {
            "parent": -1,
            "left_child": -1,
            "right_child": -1,
            "left_player": "N/A",
            "right_player": "N/A",
            "left_score": -1,
            "right_score": -1,
            "round": -1,
            "knockout": 2 ** (level + 1),
        }
        left_node = self.create_tournament_table(
            nodes, level + 1, left, mid, bracket_seed, num_match
        )
        self.cnt += 1
        id = self.cnt
        nodes[str(left_node)]["parent"] = id
        node["left_child"] = left_node
        nodes[str(id)] = node
        right_node = self.create_tournament_table(
            nodes, level + 1, mid + 1, right, bracket_seed, num_match
        )
        nodes[str(right_node)]["parent"] = id
        node["right_child"] = right_node
        return id

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
                status=status.HTTP_403_FORBIDDEN,
            )
        groups = tournament.group_set.all()
        groups_data = GroupSerializer(groups, many=True).data
        for index in range(len(groups)):
            groups_data[index]["summary"] = group_summary(groups[index])
        return JsonResponse({"groups": groups_data}, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        tournament = Tournament.objects.get(id=kwargs.get("id"))
        if (
            not self.request.user.is_superuser
            and self.request.user not in tournament.creators.all()
        ):
            return JsonResponse(
                {
                    "message": "you don't have permission to create groups of this tournament"
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        groups = request.data["groups"]
        num_matchs = request.data["num_matchs"]
        group_num_match = request.data["group_num_match"]
        if len(num_matchs) != log_2(tournament.num_group) + 1:
            return JsonResponse(
                {"message": "Does not enough num_match"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if len(groups) != tournament.num_group:
            return JsonResponse(
                {"message": "num group doesn't equal tourament num group"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        participants = tournament.participants.all()
        num_user_per_group = len(participants) // tournament.num_group
        for index in range(tournament.num_group):
            groups[index] = [
                get_object_or_404(User, pk=member) for member in groups[index]
            ]
            if len(groups[index]) != num_user_per_group:
                return JsonResponse(
                    {"message": f"group {index} doesn't enough member"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            for member in groups[index]:
                if member not in participants:
                    return JsonResponse(
                        {"message": f"member {member.username} isn't in tournament"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                for i in range(index):
                    if member in groups[i]:
                        return JsonResponse(
                            {
                                "message": f"member {member.username} in two groups {i} and {index}"
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )

        for index in range(tournament.num_group):
            groups[index] = self.create_group(
                tournament=tournament,
                users=groups[index],
                problem=tournament.problem,
                num_match=int(group_num_match),
                index=index + 1,
            )
        bracket_seed = []
        for index in range(0, tournament.num_group, 2):
            bracket_seed.append(str(groups[index].id) + "_1")
            bracket_seed.append(str(groups[index + 1].id) + "_2")
            bracket_seed.append(str(groups[index + 1].id) + "_1")
            bracket_seed.append(str(groups[index].id) + "_2")
        num_matchs = [int(num_match) for num_match in num_matchs]
        num_matchs.reverse()
        nodes = dict()
        self.cnt = 0
        root = self.create_tournament_table(
            nodes, 0, 0, len(bracket_seed) - 1, bracket_seed, num_matchs
        )
        tournament.tournament_table = {
            "root": root,
            "nodes": nodes,
        }
        tournament.save()
        return JsonResponse(
            {"message": "create tournament group"}, status=status.HTTP_201_CREATED
        )


class RetrieveTournamentAPI(generics.RetrieveAPIView):
    model = Tournament
    serializer_class = TournamentSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        tournament = get_object_or_404(Tournament, pk=kwargs.get("id"))
        if (
            not self.request.user.is_superuser
            and self.request.user not in tournament.creators.all()
            and self.request.user not in tournament.participants.all()
        ):
            return JsonResponse(
                {"message": "you don't have permission to view this tournament"},
                status=status.HTTP_403_FORBIDDEN,
            )
        tournament_data = TournamentSerializer(tournament).data
        serialize_bracket(tournament_data["tournament_table"])
        return JsonResponse(
            {"tournament": tournament_data},
            status=status.HTTP_200_OK,
        )


class RetrieveTournamentProblemAPI(generics.RetrieveAPIView):
    model = Problem
    serializer_class = TournamentSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        tournament = get_object_or_404(Tournament, pk=kwargs.get("id"))
        if (
            not self.request.user.is_superuser
            and self.request.user not in tournament.creators.all()
            and self.request.user not in tournament.participants.all()
        ):
            return JsonResponse(
                {
                    "message": "you don't have permission to view problem of this tournament"
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        problem_serializer = ProblemSerializer(tournament.problem)
        return JsonResponse(
            {"problem": problem_serializer.data},
            status=status.HTTP_200_OK,
        )


class RetrieveGroupAPI(generics.RetrieveAPIView):
    model = Round
    serializer_class = RoundSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        group = Group.objects.get(pk=kwargs.get("id"))
        if (
            not self.request.user.is_superuser
            and self.request.user not in group.tournament.creators.all()
            and self.request.user not in group.tournament.participants.all()
        ):
            return JsonResponse(
                {"message": "you don't have permission to view rounds of this group"},
                status=status.HTTP_403_FORBIDDEN,
            )
        rounds = group.round_set.all()
        rounds_serializer = RoundSerializer(rounds, many=True)
        return JsonResponse(
            {
                "group": GroupSerializer(group).data,
                "summary": group_summary(group),
                "rounds": rounds_serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class RetrieveTournamentParticipantAPI(generics.RetrieveAPIView):
    model = User
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        tournament = get_object_or_404(Tournament, pk=kwargs.get("id"))
        if (
            not self.request.user.is_superuser
            and self.request.user not in tournament.creators.all()
            and self.request.user not in tournament.participants.all()
        ):
            return JsonResponse(
                {"message": "you don't have permission to view problem of this group"},
                status=status.HTTP_403_FORBIDDEN,
            )
        user_serializer = UserSerializer(tournament.participants.all(), many=True)
        return JsonResponse(
            {"participants": user_serializer.data},
            status=status.HTTP_200_OK,
        )


class ListCreateRoundAPI(generics.ListCreateAPIView):
    model = Round
    serializer_class = RoundSerializer

    def create(self, request, *args, **kwargs):
        if self.request.user.is_anonymous:
            return JsonResponse(
                {"message": "you don't have permission to create round"},
                status=status.HTTP_403_FORBIDDEN,
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
            tournament=None,
        )
        return JsonResponse(
            {
                "message": "create round successful",
                "round": RoundSerializer(round).data,
            },
            status=status.HTTP_201_CREATED,
        )

    def get(self, request, *args, **kwargs):
        rounds = Round.objects.all()
        rounds_serializer = RoundSerializer(rounds, many=True)
        return JsonResponse(
            {"rounds": rounds_serializer.data}, status=status.HTTP_200_OK
        )


class RetrieveRoundAPI(generics.RetrieveAPIView):
    model = Match
    serializer_class = MatchSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        round = get_object_or_404(Round, pk=kwargs.get("id"))
        if (
            not self.request.user.is_superuser
            and self.request.user != round.first_user
            and self.request.user != round.second_user
        ):
            return JsonResponse(
                {"message": "you don't have permission to view matchs of round"},
                status=status.HTTP_403_FORBIDDEN,
            )
        matchs = round.match_set.all()
        round_data = RoundSerializer(round).data
        round_data["first_user"] = UserSerializer(round.first_user).data
        round_data["second_user"] = UserSerializer(round.second_user).data
        matchs_serializer = MatchSerializer(matchs, many=True)
        return JsonResponse(
            {
                "round": round_data,
                "matchs": matchs_serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class CreateMatchAPI(generics.ListCreateAPIView):
    model = Match
    serializer_class = MatchSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        round = get_object_or_404(Round, pk=kwargs.get("id"))
        if (
            not self.request.user.is_superuser
            and self.request.user != round.first_user
            and self.request.user != round.second_user
        ):
            return JsonResponse(
                {"message": "you don't have permission to create match"},
                status=status.HTTP_403_FORBIDDEN,
            )
        num_match = len(round.match_set.all())
        if num_match == round.num_match:
            return JsonResponse(
                {"message": "round is full match"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        match_type = 1
        if num_match % 2 == 1:
            match_type = 2
        match = Match.objects.create(
            round=round, type=match_type, testcase=0, status="Q", history=dict()
        )
        processing_match.delay_on_commit(match.pk)
        return JsonResponse(
            {"match": MatchSerializer(match).data}, status=status.HTTP_201_CREATED
        )


class RetrieveMatchAPI(generics.RetrieveAPIView):
    model = Match
    serializer_class = MatchSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        match = get_object_or_404(Match, pk=kwargs.get("id"))
        if (
            not self.request.user.is_superuser
            and self.request.user != match.round.first_user
            and self.request.user != match.round.second_user
        ):
            return JsonResponse(
                {"message": "you don't have permission to view this match"},
                status=status.HTTP_403_FORBIDDEN,
            )
        match_serializer = MatchSerializer(match)
        return JsonResponse({"match": match_serializer.data}, status=status.HTTP_200_OK)


class ListCreateChallengeAPI(generics.ListCreateAPIView):
    model = Challenge
    serializer_class = ChallengeSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        challenges = None
        if self.request.user.is_superuser:
            challenges = Challenge.objects.all()
        else:
            challenges = Challenge.objects.filter(
                Q(first_user=self.request.user) | Q(second_user=self.request.user)
            )
        serializer = ChallengeSerializer(challenges, many=True)
        return JsonResponse({"challenges": serializer.data}, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        problem = get_object_or_404(Problem, pk=self.request.data["problem"])
        second_user = get_object_or_404(User, pk=self.request.data["user"])
        if self.request.user == second_user:
            JsonResponse(
                {
                    "message": "you can't challenge yourself",
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        if (
            len(
                Submission.objects.filter(
                    Q(user=self.request.user) & Q(problem=problem)
                )
            )
            == 0
        ):
            JsonResponse(
                {
                    "message": f"you have no submission of problem {problem.id}",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if (
            len(Submission.objects.filter(Q(user=second_user) & Q(problem=problem)))
            == 0
        ):
            JsonResponse(
                {
                    "message": f"user {second_user.first_name} have no submission of problem {problem.id}",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        challenge = Challenge.objects.create(
            first_user=self.request.user, second_user=second_user, problem=problem
        )
        return JsonResponse(
            {
                "message": "create challenge successful",
                "challenge": ChallengeSerializer(challenge).data,
            },
            status=status.HTTP_201_CREATED,
        )


class UpdateChallengeAPI(generics.UpdateAPIView):
    model = Challenge
    serializer_class = ChallengeSerializer
    permission_classes = (IsAuthenticated,)

    def update(self, request, *args, **kwargs):
        challenge = get_object_or_404(Challenge, pk=kwargs.get("id"))
        if challenge.status != Challenge.ChallengeStatus.REQUEST:
            return JsonResponse(
                {
                    "message": "can't change this challenge",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        if self.request.user == challenge.first_user:
            if request.data["status"] == "CANCEL":
                challenge.status = Challenge.ChallengeStatus.CANCEL
                challenge.save()
                return JsonResponse(
                    {
                        "message": "change challenge successful",
                        "challenge": ChallengeSerializer(challenge).data,
                    },
                    status=status.HTTP_200_OK,
                )
        if self.request.user == challenge.second_user:
            if request.data["status"] == "REJECT":
                challenge.status = Challenge.ChallengeStatus.REJECT
                challenge.save()
                return JsonResponse(
                    {
                        "message": "change challenge successful",
                        "challenge": ChallengeSerializer(challenge).data,
                    },
                    status=status.HTTP_200_OK,
                )
            if request.data["status"] == "ACCEPT":
                challenge.status = Challenge.ChallengeStatus.ACCEPT
                challenge.save()
                round = create_round(
                    first_user=challenge.first_user,
                    second_user=challenge.second_user,
                    problem=challenge.problem,
                    num_match=3,
                    group=None,
                    tournament=None,
                )
                return JsonResponse(
                    {
                        "message": "change challenge successful",
                        "challenge": ChallengeSerializer(challenge).data,
                        "round": RoundSerializer(round).data,
                    },
                    status=status.HTTP_200_OK,
                )
        return JsonResponse(
            {
                "message": "can't change this challenge",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
