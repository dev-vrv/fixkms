#!/bin/sh

set -e

echo "Waiting for PostgreSQL to start..."
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "db" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q' > /dev/null 2>&1; do
  sleep 1
done
echo "PostgreSQL is up - executing command"

echo  "Make migrations"
python manage.py makemigrations

echo  "Migrate"
python manage.py migrate

echo  "Collect static"
python manage.py collectstatic --noinput

# Переходим в папку `src`, где лежит `core.wsgi`
cd /app/src

# Запускаем Gunicorn с правильным путем
exec gunicorn --bind 0.0.0.0:8000 core.wsgi:application --workers 3
