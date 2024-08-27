from django.urls import path
from .views import SignupView, LoginView, CheckAuthView

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("check-auth/", CheckAuthView.as_view(), name="check-auth"),
]
