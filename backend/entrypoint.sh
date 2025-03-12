#!/bin/sh

# Ожидаем, пока база данных станет доступной
echo "Ждём доступности базы данных..."
while ! nc -z db 5432; do   
  sleep 1
done
echo "База данных доступна!"

# Выполняем миграции
echo "Выполняем миграции..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

# Запускаем тесты
echo "Запускаем тесты..."
python manage.py test || exit 1  # Выход с кодом 1, если тесты не прошли

# Запускаем Django сервер
echo "Запускаем Django сервер..."
exec python manage.py runserver 0.0.0.0:8000
