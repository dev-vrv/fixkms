from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from accounts.views import CurrentUserView, UserCreateView, UserListView, UserUpdateView, UserRetrieveView, UserLogout, UserChangePassword

urlpatterns = [
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/", TokenRefreshView.as_view(), name="token_refresh"),
    path("users/", UserListView.as_view(), name="user-list"),
    path("me/", CurrentUserView.as_view(), name="current-user"),
    path("users/create/", UserCreateView.as_view(), name="user-create"),
    path("users/<int:pk>/", UserUpdateView.as_view(), name="user-update"),
    path("user/<int:pk>/", UserRetrieveView.as_view(), name="user-retrieve"),
    path("logout/", UserLogout.as_view(), name="user-logout"),
    path("change-password/", UserChangePassword.as_view(), name="change-password"),
]
