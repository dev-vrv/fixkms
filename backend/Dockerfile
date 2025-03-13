# Используем официальный Python образ
FROM python:3.10

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app/src

# Устанавливаем зависимости системы и поддержку локалей
RUN apt-get update && apt-get install -y \
    netcat-openbsd \
    locales \
    && rm -rf /var/lib/apt/lists/*

# Генерируем локаль ru_RU.UTF-8
RUN locale-gen ru_RU.UTF-8 && \
    update-locale LANG=ru_RU.UTF-8 LC_ALL=ru_RU.UTF-8

# Устанавливаем переменные окружения, чтобы локаль применялась внутри контейнера
ENV LANG=ru_RU.UTF-8 \
    LC_ALL=ru_RU.UTF-8

# Копируем зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем код приложения
COPY . .

# Открываем порт для Django
EXPOSE 8000

# Указываем команду запуска через entrypoint
ENTRYPOINT ["/app/src/entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
