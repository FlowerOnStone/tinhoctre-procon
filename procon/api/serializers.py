from rest_framework import serializers
from api.models import *
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from django.utils.text import slugify


class ProgramLanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramLanguage
        fields = ("id", "name")


class ProgramLanguageInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramLanguage
        fields = ("id", "name", "compile_args")


class TimezoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Timezone
        fields = ("id", "zone", "location", "offset", "offset_dst")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "first_name")


class ChangePasswordSerializer(serializers.Serializer):
    model = User

    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid Details.")


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["user", "timezone", "preferred_language"]


class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "password", "first_name", "last_name", "email")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data["username"],
            validated_data["email"],
            validated_data["password"],
        )
        user.first_name = validated_data["first_name"]
        user.last_name = validated_data["last_name"]
        user.save()
        return user


class ChangeUserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "first_name", "last_name")


class ListProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = (
            "id",
            "slug",
            "name",
            "public_visible",
        )


class ProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = (
            "id",
            "slug",
            "name",
            "public_visible",
            "creator",
            "body",
            "pdf",
            "time_limit",
            "memory_limit",
            "allow_language",
        )

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)


class ListSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = (
            "user",
            "problem",
            "language",
            "status",
            "total_point",
            "time",
            "memory",
        )


class CreateSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = (
            "user",
            "problem",
            "language",
            "code",
        )


class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = (
            "user",
            "problem",
            "language",
            "code",
            "status",
            "total_point",
            "time",
            "memory",
        )
