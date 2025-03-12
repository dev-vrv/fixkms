# Используем официальный Python образ
FROM python:3.10

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app/src

# Устанавливаем зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Устанавливаем netcat (nc) для ожидания базы данных
RUN apt-get update && apt-get install -y netcat-openbsd

# Копируем код приложения
COPY . .

# Открываем порт для Django
EXPOSE 8000

# Указываем команду запуска через entrypoint
ENTRYPOINT ["/app/src/entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
