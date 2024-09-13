from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserDetailsSerializer, LoginSerializer
from .models import UserDetails


class SignupView(APIView):
    def post(self, request):
        serializer = UserDetailsSerializer(data=request.data)
        print(serializer)
        if serializer.is_valid():
            user_details = serializer.save()
            response_data = {
                "message": "Signup successful",
                "user": {
                    "id": user_details.user.id,
                    "username": user_details.user.username,
                    "email": user_details.user.email,
                    "first_name": user_details.user.first_name,
                    "last_name": user_details.user.last_name,
                    "address": user_details.address,
                    "state": user_details.state,
                    "zip_code": user_details.zip_code,
                    "date_of_birth": user_details.date_of_birth,
                },
            }

            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            token_data = serializer.save()  # Get JWT tokens
            return Response(token_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetailsView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request):
        try:
            user_details = UserDetails.objects.get(user=request.user)
            serializer = UserDetailsSerializer(user_details)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserDetails.DoesNotExist:
            return Response(
                {"detail": "User details not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request):
        try:
            user_details = UserDetails.objects.get(user=request.user)
            serializer = UserDetailsSerializer(user_details, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserDetails.DoesNotExist:
            return Response(
                {"detail": "User details not found"}, status=status.HTTP_404_NOT_FOUND
            )
