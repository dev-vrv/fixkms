from rest_framework.exceptions import NotFound, PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import UserCreateSerializer, UserSerializer, UserUpdateSerializer
from rest_framework_simplejwt.tokens import OutstandingToken
from django.contrib.auth import logout


class UserRetrieveView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            user = get_user_model().objects.get(id=pk)
        except get_user_model().DoesNotExist:
            raise NotFound("Пользователь не найден.")

        if request.user.Роль == "user" and request.user.id != user.id:
            raise PermissionDenied("Вы не можете просматривать чужой профиль.")

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.Роль == "admin" or user.Роль == "manager":
            users = get_user_model().objects.all()
        elif user.Роль == "user":
            users = get_user_model().objects.filter(Организация=user.Организация)
        else:
            return Response(
                {"detail": "Недостаточно прав для просмотра."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.Роль != "admin":
            raise PermissionDenied("У вас нет прав на создание пользователя.")

        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "status": "success",
                    "message": "Пользователь создан",
                    "data": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            user = get_user_model().objects.get(id=pk)
        except get_user_model().DoesNotExist:
            raise NotFound("Пользователь не найден.")

        if request.user.Роль == "user" and request.user.id != user.id:
            raise PermissionDenied("Вы не можете редактировать чужой профиль.")

        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        password = request.data.get("password")
        if password:
            user.set_password(password)
            user.save()
            
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "status": "success",
                    "message": "Пользователь обновлен",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            user = get_user_model().objects.get(id=pk)
        except get_user_model().DoesNotExist:
            raise NotFound("Пользователь не найден.")

        if request.user.Роль == "user":
            raise PermissionDenied("Вы не можете удалять пользователей.")

        user.delete()
        return Response(
            {"status": "success", "message": "Пользователь удален"},
            status=status.HTTP_204_NO_CONTENT,
        )
        
        
class UserLogout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            logout(request)

            return Response(
                {"message": "Successfully logged out"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
            
            
class UserChangePassword(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            data = request.data
            user = request.user

            old_password = data.get("old_password")
            new_password = data.get("new_password")

            if not old_password or not new_password:
                return Response(
                    {"error": "Both old and new passwords are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if not user.check_password(old_password):
                return Response(
                    {"error": "Incorrect old password"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user.set_password(new_password)
            user.save()
            
            logout(request)

            return Response(
                {"message": "Password changed successfully"},
                status=status.HTTP_200_OK
            )

        except KeyError as e:
            return Response(
                {"error": f"Missing field: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )