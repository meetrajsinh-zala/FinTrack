from django.urls import path
from .views import (
    SignupView,
    LoginView,
    UserDetailsView,
)

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("check-auth/", UserDetailsView.as_view(), name="check-auth"),
]
