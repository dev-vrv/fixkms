from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model

class AuthTests(APITestCase):

    def setUp(self):
        # Создаём пользователя для теста
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='testpassword'
        )
        self.login_url = reverse('token_obtain_pair')
        self.refresh_url = reverse('token_refresh')

    def test_login(self):
        data = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_token_refresh(self):
        # Получаем токен
        data = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        login_response = self.client.post(self.login_url, data, format='json')
        refresh_token = login_response.data['refresh']

        # Используем refresh токен для получения нового access токена
        response = self.client.post(self.refresh_url, {'refresh': refresh_token}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)


class CurrentUserTests(APITestCase):

    def setUp(self):
        # Создаём пользователя и получаем его токен
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='testpassword'
        )
        self.login_url = reverse('token_obtain_pair')
        self.current_user_url = reverse('current-user')
        
        data = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        login_response = self.client.post(self.login_url, data, format='json')
        self.access_token = login_response.data['access']

    def test_get_current_user(self):
        # Используем access токен для запроса
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(self.current_user_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

    def test_get_current_user_unauthorized(self):
        # Без авторизации
        response = self.client.get(self.current_user_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserListTests(APITestCase):

    def setUp(self):
        # Создаём пользователя и получаем его токен
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='testpassword',
            Роль='admin'
        )
        self.login_url = reverse('token_obtain_pair')
        self.user_list_url = reverse('user-list')

        data = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        login_response = self.client.post(self.login_url, data, format='json')
        self.access_token = login_response.data['access']

    def test_user_list(self):
        # Запрашиваем список пользователей с авторизацией
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(self.user_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)  # Проверка, что список не пуст

