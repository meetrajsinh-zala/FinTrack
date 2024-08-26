from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User
from .models import Signup


class SignupSerializer(ModelSerializer):
    class Meta:
        model = Signup
        fields = [
            "id",
            "First_Name",
            "Last_Name",
            "Address",
            "State",
            "Zip_Code",
            "DOB",
            "username",
            "Email",
            "Password",
        ]
        extra_kwargs = {"Password": {"write_only": True}}

    from django.contrib.auth.models import User


from rest_framework.exceptions import ValidationError


def create(self, validated_data):
    # Check if the username already exists
    if User.objects.filter(username=validated_data.get("username")).exists():
        raise ValidationError("Username already exists.")

    # Hash the password before saving
    validated_data["Password"] = make_password(validated_data["Password"])

    # Create the user
    user = User.objects.create_user(
        username=validated_data["username"],
        email=validated_data["Email"],
        password=validated_data["Password"],
    )

    # Create the Signup instance
    signup = Signup.objects.create(user=user, **validated_data)

    return signup
