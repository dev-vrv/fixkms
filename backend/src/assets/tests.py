from django.test import TestCase
from .models import Equipments, Programs, Components, Movements, Repairs
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model


class EquipmentsModelTest(TestCase):
    
    def setUp(self):
        self.equipment = Equipments.objects.create(
            Компания="Test Company",
            Местоположение="Test Location",
            Статус="Active",
            Производитель="Test Manufacturer",
            Серийный_Номер="SN12345",
            Сотрудник="John Doe",
            Стоимость=1500.50
        )

    def test_equipment_creation(self):
        """Тестируем создание объекта Equipments"""
        equipment = self.equipment
        self.assertEqual(equipment.Компания, "Test Company")
        self.assertEqual(equipment.Серийный_Номер, "SN12345")
        self.assertEqual(equipment.Сотрудник, "John Doe")
        self.assertEqual(equipment.Стоимость, 1500.50)

    def test_str_method(self):
        """Тестируем метод __str__"""
        equipment = self.equipment
        self.assertEqual(str(equipment), "SN12345")


class ProgramsModelTest(TestCase):

    def setUp(self):
        self.program = Programs.objects.create(
            Название="Test Program",
            Версия="1.0.0",
            Ключ_Продукта="ABC123XYZ",
            Код_Активации="ACT12345",
            Лиценизя_До="2025-12-31"
        )

    def test_program_creation(self):
        """Тестируем создание объекта Programs"""
        program = self.program
        self.assertEqual(program.Название, "Test Program")
        self.assertEqual(program.Ключ_Продукта, "ABC123XYZ")
        self.assertEqual(program.Лиценизя_До, "2025-12-31")

    def test_str_method(self):
        """Тестируем метод __str__"""
        program = self.program
        self.assertEqual(str(program), "Test Program")
        
        
class RepairsModelTest(TestCase):

    def setUp(self):
        self.repair = Repairs.objects.create(
            Номер="REP12345",
            Дата_Поломки="2025-03-04 14:00:00",
            Описание_Неисправности="Test Failure"
        )

    def test_repair_creation(self):
        """Тестируем создание объекта Repairs"""
        repair = self.repair
        self.assertEqual(repair.Номер, "REP12345")
        self.assertEqual(repair.Описание_Неисправности, "Test Failure")
        self.assertEqual(str(repair), "Test Failure")
        
        
class MovementsModelTest(TestCase):

    def setUp(self):
        self.movement = Movements.objects.create(
            Номер="MOV12345",
            Название="Test Movement",
            Статус="In Transit",
            Компания="Test Company",
            Количество=5
        )

    def test_movement_creation(self):
        """Тестируем создание объекта Movements"""
        movement = self.movement
        self.assertEqual(movement.Компания, "Test Company")
        self.assertEqual(movement.Количество, 5)

    def test_str_method(self):
        """Тестируем метод __str__"""
        movement = self.movement
        self.assertEqual(str(movement), "Test Movement")
        
        
class AssetsListTests(APITestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='testpassword'
        )
        self.login_url = reverse('token_obtain_pair')
        self.assets_url = reverse('assets-list')

        # Получаем токен для авторизации
        data = {
            'username': 'testuser',
            'password': 'testpassword'
        }
        login_response = self.client.post(self.login_url, data, format='json')
        self.access_token = login_response.data['access']

    def test_assets_list_authenticated(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.get(self.assets_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Проверка на наличие данных в ответе
        self.assertGreater(len(response.data), 0)

    def test_assets_list_unauthenticated(self):
        response = self.client.get(self.assets_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class EquipmentsTests(APITestCase):

    def setUp(self):
        # Создаём пользователя с правами администратора
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='testpassword',
            Роль='admin'
        )
        self.user.is_staff = True  # Назначаем пользователя администратором
        self.user.is_superuser = True  # Если нужно, можно назначить суперпользователем
        self.user.save()

        self.login_url = reverse('token_obtain_pair')
        self.equipment_url = reverse('equipment-list')

        # Получаем токен для авторизации
        data = {
            'username': 'testuser',
            'password': 'testpassword',
        }
        login_response = self.client.post(self.login_url, data, format='json')
        self.access_token = login_response.data['access']

    def test_create_equipment(self):
        data = {
            'Сотрудник': 'John Doe',
            'name': 'New Equipment',
            'model': 'Model 1',
            'serial_number': '123456'
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')
        response = self.client.post(self.equipment_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
