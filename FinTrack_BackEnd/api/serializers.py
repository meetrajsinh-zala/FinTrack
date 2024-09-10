from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserDetails
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "first_name", "last_name"]


class UserDetailsSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Nested serializer to include user details

    class Meta:
        model = UserDetails
        fields = ["user", "address", "state", "zip_code", "date_of_birth"]

    def create(self, validated_data):
        user_data = validated_data.pop("user")
        user = User.objects.create(**user_data)
        user.set_password(user_data.get("password"))
        user.save()

        user_details = UserDetails.objects.create(user=user, **validated_data)
        return user_details

    def update(self, instance, validated_data):
        # Update nested User object
        user_data = validated_data.pop("user")
        user = instance.user

        instance.address = validated_data.get("address", instance.address)
        instance.state = validated_data.get("state", instance.state)
        instance.zip_code = validated_data.get("zip_code", instance.zip_code)
        instance.date_of_birth = validated_data.get(
            "date_of_birth", instance.date_of_birth
        )
        instance.save()

        user.username = user_data.get("username", user.username)
        user.email = user_data.get("email", user.email)
        user.first_name = user_data.get("first_name", user.first_name)
        user.last_name = user_data.get("last_name", user.last_name)
        user.save()

        return instance


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        if username and password:
            user = authenticate(username=username, password=password)
            if user:
                if not user.is_active:
                    raise AuthenticationFailed("This account is disabled.")
            else:
                raise AuthenticationFailed("Invalid login credentials.")
        else:
            raise serializers.ValidationError(
                "Both username and password are required."
            )

        # Add the user object to the validated data for token generation
        data["user"] = user
        return data

    def create(self, validated_data):
        user = validated_data["user"]

        # Generate JWT tokens for the authenticated user
        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "username": user.username,
                "email": user.email,
            },
        }
