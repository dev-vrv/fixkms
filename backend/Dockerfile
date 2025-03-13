# Используем официальный Python образ
FROM python:3.10

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app/src

# Устанавливаем системные зависимости
RUN apt-get update && apt-get install -y \
    apt-utils \
    netcat-openbsd \
    locales \
    && rm -rf /var/lib/apt/lists/*

# Генерируем локаль ru_RU.UTF-8 и устанавливаем по умолчанию
RUN echo "ru_RU.UTF-8 UTF-8" > /etc/locale.gen && \
    locale-gen && \
    dpkg-reconfigure -f noninteractive locales && \
    update-locale LANG=ru_RU.UTF-8 LC_ALL=ru_RU.UTF-8

# Устанавливаем переменные окружения для использования русской локали
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
