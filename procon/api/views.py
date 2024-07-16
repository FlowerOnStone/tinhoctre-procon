from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from knox.models import AuthToken
from .serializers import *
from django.shortcuts import get_object_or_404
from django.http import JsonResponse


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
        serializer = ProblemSerializer(data = request.data)
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
    permission_classes = (IsAuthenticated, )

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
                    {"message": "You do not have permission to view submission of this problem!"},
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
        if (
            not self.request.user.is_superuser
            and self.request.user != submission.user
        ):
            serializer = SubmissionSerializer(submission)
        return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)
