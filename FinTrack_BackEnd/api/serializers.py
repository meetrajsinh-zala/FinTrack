from rest_framework import serializers
from .models import CustomUser


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # Ensures password is write-only

    class Meta:
        model = CustomUser
        fields = [
            "first_name",
            "last_name",
            "address",
            "state",
            "zip_code",
            "username",
            "email",
            "password",
            "date_of_birth",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = CustomUser(**validated_data)
        if password:
            user.set_password(password)  # Hash the password
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)
