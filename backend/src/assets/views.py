from django.conf import settings
from django.http import FileResponse, Http404
from rest_framework import status, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from collections import defaultdict
from django.db import IntegrityError
from .models import (
    CustomAsset,
    CustomAssetDetails,
    Equipments,
    ExportFile,
    Programs,
    Components,
    Consumables,
    Repairs,
    Movements,
    HandbookComponents,
    HandbookConsumables,
    HandbookEquipments,
    HandbookPrograms,
    HandbookCompany
)
from assets.serializers import (
    CustomAssetDetailsSerializer,
    CustomAssetSerializer,
    EquipmentsSerializer,
    ExportFileSerializer,
    ProgramsSerializer,
    ComponentsSerializer,
    ConsumablesSerializer,
    RepairsSerializer,
    MovementsSerializer,
    HandbookComponentsSerializer,
    HandbookConsumablesSerializer,
    HandbookEquipmentsSerializer,
    HandbookProgramsSerializer,
    HandbookCompanySerializer,
)
from accounts.serializers import UserSerializer
from accounts.models import User
from datetime import datetime
import csv
import os
import chardet
import traceback

def detect_encoding(file_path):
    with open(file_path, 'rb') as f:
        raw_data = f.read(50000)
        result = chardet.detect(raw_data)
        return result['encoding']


def is_valid_date(value, date_formats=["%Y-%m-%d"]):
    for date_format in date_formats:
        try:
            datetime.strptime(value, date_format)
            return True
        except ValueError:
            continue
    print(f"Invalid date: {value}")
    return False

def convert_to_date(value):
    if isinstance(value, str):
        try:
            # Пробуем сначала разобрать как ISO 8601
            dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
            return dt.strftime("%Y-%m-%d")
        except ValueError:
            # Если не получилось, пробуем другие форматы
            for fmt in ("%d %m %y", "%d-%m-%Y", "%d/%m/%Y", "%m/%d/%Y", "%Y-%m-%d"):
                try:
                    return datetime.strptime(value, fmt).strftime("%Y-%m-%d")
                except ValueError:
                    continue
    print(f"Invalid date: {value}")
    return value

def is_date(field, value):
    if "Дата" in field and isinstance(value, str) or "Гарантия_До" in field and isinstance(value, str) or "Лиценизя_До" in field and isinstance(value, str) or "Ремонт_Дата_Изменения" in field and isinstance(value, str):
        return True
    else:
        return False



model_mapping = {
    "equipments": Equipments,
    "movements": Movements,
    "repairs": Repairs,
    "components": Components,
    "consumables": Consumables,
    "programs": Programs,
}

serializer_mapping = {
    "equipments": EquipmentsSerializer,
    "movements": MovementsSerializer,
    "repairs": RepairsSerializer,
    "components": ComponentsSerializer,
    "consumables": ConsumablesSerializer,
    "programs": ProgramsSerializer,
}

handbook_mapping = {
    "components": HandbookComponents,
    "consumables": HandbookConsumables,
    "equipments": HandbookEquipments,
    "programs": HandbookPrograms,
    "company": HandbookCompany,
}

handbook_serializer_mapping = {
    "components": HandbookComponentsSerializer,
    "consumables": HandbookConsumablesSerializer,
    "equipments": HandbookEquipmentsSerializer,
    "programs": HandbookProgramsSerializer,
    "company": HandbookCompanySerializer,
}

fields_mapping = {
    "equipments": [
        "id",
        "Компания",
        "Местоположение",
        "Статус",
        "Производитель",
        "Тип",
        "Модель",
        "Серийный_Номер",
        "Инв_Номер_Бухгалтерии",
        "Стоимость",
        "Сотрудник",
        "Сотрудник_Компания",
        "Сотрудник_Подразделение",
        "Сотрудник_Офис",
        "Сотрудник_Должность",
        "Сотрудник_Телефон",
        "Примечания",
        "Дата_Изменения",
        "Изменил",
        "Гарантия_До",
    ],
    "programs": [
        "id",
        "Компания",
        "Местоположение",
        "Статус",
        "Производитель",
        "Название",
        "Версия",
        "Серийный_Номер",
        "Инв_Номер_Бухгалтерии",
        "Ключ_Продукта",
        "Код_Активации",
        "Количество_пользователей",
        "Стоимость",
        "Сотрудник",
        "Сотрудник_Компания",
        "Сотрудник_Подразделение",
        "Сотрудник_Офис",
        "Сотрудник_Должность",
        "Сотрудник_Телефон",
        "Примечания",
        "Дата_Изменения",
        "Изменил",
        "Лиценизя_До",
    ],
    "components": [
        "id",
        "Компания",
        "Местоположение",
        "Статус",
        "Производитель",
        "Тип",
        "Модель",
        "Серийный_Номер",
        "Инв_Номер_Бухгалтерии",
        "Стоимость",
        "Сотрудник",
        "Сотрудник_Компания",
        "Сотрудник_Подразделение",
        "Сотрудник_Офис",
        "Сотрудник_Должность",
        "Сотрудник_Телефон",
        "Примечания",
        "Дата_Изменения",
        "Изменил",
        "Гарантия_До",
    ],
    "consumables": [
        "id",
        "Компания",
        "Местоположение",
        "Статус",
        "Производитель",
        "Тип",
        "Модель",
        "Серийный_Номер",
        "Инв_Номер_Бухгалтерии",
        "Стоимость",
        "Сотрудник",
        "Сотрудник_Компания",
        "Сотрудник_Подразделение",
        "Сотрудник_Офис",
        "Сотрудник_Должность",
        "Сотрудник_Телефон",
        "Примечания",
        "Дата_Изменения",
        "Изменил",
    ],
    "repairs": [
        "id",
        "Сотрудник",
        "Дата_Поломки",
        "Дата_Отправки",
        "Дата_Возврата",
        "Описание_Неисправности",
        "Ремонт_Сервисная_Организация",
        "Ремонт_Стоимость",
        "Создал",
        "Отправил",
        "Принял",
        "Ремонт_Дата_Изменения",
        "Ремонт_Изменил",
        "Вид_Учётных_Единиц",
        "ID_Объекта",
        "Подразделение",
        "Сервисная_Организация",
    ],
}

# base view


class BaseViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(
            {"detail": "Актив успешно добавлен."},
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        if request.user.Роль != "admin":
            raise PermissionDenied("Вы не можете редактировать записи.")

        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        message = (
            "Актив успешно обновлен."
            if not partial
            else "Частичное обновление выполнено."
        )

        return Response(
            {"detail": message, "data": serializer.data},
            status=status.HTTP_200_OK,
        )

    def destroy(self, request, *args, **kwargs):
        if request.user.Роль != "admin":
            raise PermissionDenied("Вы не можете удалять записи.")

        instance = self.get_object()
        instance.delete()

        return Response({"detail": "Объект удалён"}, status=status.HTTP_204_NO_CONTENT)


# standart assets
class EquipmentsViewSet(BaseViewSet):
    queryset = Equipments.objects.all()
    serializer_class = EquipmentsSerializer

    def get_queryset(self):
        user = self.request.user

        if user.Роль == "admin":
            return Equipments.objects.all()

        elif user.Роль == "manager":
            return Equipments.objects.filter(Сотрудник_Компания=user.Организация)

        else:
            return Equipments.objects.filter(Сотрудник_Логин=user.username)


class ProgramsViewSet(BaseViewSet):
    queryset = Programs.objects.all()
    serializer_class = ProgramsSerializer

    def get_queryset(self):
        user = self.request.user

        if user.Роль == "admin":
            return Programs.objects.all()

        elif user.Роль == "manager":
            return Programs.objects.filter(Сотрудник_Компания=user.Организация)

        else:
            return Programs.objects.filter(Сотрудник_Логин=user.username)


class ComponentsViewSet(BaseViewSet):
    queryset = Components.objects.all()
    serializer_class = ComponentsSerializer

    def get_queryset(self):
        user = self.request.user

        if user.Роль == "admin":
            return Components.objects.all()

        elif user.Роль == "manager":
            return Components.objects.filter(Сотрудник_Компания=user.Организация)

        else:
            return Components.objects.filter(Сотрудник_Логин=user.username)


class ConsumablesViewSet(BaseViewSet):
    queryset = Consumables.objects.all()
    serializer_class = ConsumablesSerializer

    def get_queryset(self):
        user = self.request.user

        if user.Роль == "admin":
            return Consumables.objects.all()

        elif user.Роль == "manager":
            return Consumables.objects.filter(Сотрудник_Компания=user.Организация)

        else:
            return Consumables.objects.filter(Сотрудник_Логин=user.username)


class RepairsViewSet(BaseViewSet):
    queryset = Repairs.objects.all()
    serializer_class = RepairsSerializer

    def get_queryset(self):
        user = self.request.user

        if user.Роль == "admin":
            return Repairs.objects.all()

        elif user.Роль == "manager":
            return Repairs.objects.filter(Сотрудник_Компания=user.Организация)

        else:
            return Repairs.objects.filter(Сотрудник_Логин=user.username)


class MovementsViewSet(BaseViewSet):
    queryset = Movements.objects.all()
    serializer_class = MovementsSerializer

    # def get_queryset(self):
    #     user = self.request.user

    #     if user.Роль == "admin":
    #         return Movements.objects.all()

    #     # elif user.Роль == "manager":
    #     #     return Movements.objects.filter(Сотрудник_Организация=user.Организация)

    #     else:
    #         return Movements.objects.filter(Сотрудник_Логин=user.username)


# custom assets
class CustomAssetViewSet(BaseViewSet):
    queryset = CustomAsset.objects.all()
    serializer_class = CustomAssetSerializer


class CustomAssetDetailsViewSet(BaseViewSet):
    queryset = CustomAssetDetails.objects.all()
    serializer_class = CustomAssetDetailsSerializer

    def get_queryset(self):
        user = self.request.user

        if user.Роль == "admin":
            return CustomAssetDetails.objects.all()

        elif user.Роль == "manager":
            return CustomAssetDetails.objects.filter(
                Сотрудник_Компания=user.Организация
            )

        else:
            return CustomAssetDetails.objects.filter(Сотрудник_Логин=user.username)


# all assets
class AssetsListView(APIView):
    def get_queryset(self, model, user):
        """Возвращает QuerySet в зависимости от роли пользователя."""
        if user.Роль == "admin":
            return model.objects.all()
        elif user.Роль == "manager":
            return model.objects.filter(Сотрудник_Компания=user.Организация)
        else:
            return model.objects.filter(Сотрудник_Логин=user.username)

    def get(self, request):
        user = request.user

        # Определяем список моделей и их сериализаторы
        asset_models = {
            "equipments": (Equipments, EquipmentsSerializer),
            "programs": (Programs, ProgramsSerializer),
            "components": (Components, ComponentsSerializer),
            "consumables": (Consumables, ConsumablesSerializer),
            "repairs": (Repairs, RepairsSerializer),
        }

        # Формируем данные по активам
        data = {}
        for key, (model, serializer) in asset_models.items():
            queryset = self.get_queryset(model, user)
            data[key] = serializer(queryset, many=True).data

        # Обрабатываем кастомные активы
        custom_assets_detail = self.get_queryset(CustomAssetDetails, user)
        custom_assets = CustomAsset.objects.filter(
            id__in=custom_assets_detail.values_list("Актив", flat=True)
        )

        custom_assets_data = CustomAssetSerializer(
            custom_assets, many=True).data
        custom_assets_detail_data = CustomAssetDetailsSerializer(
            custom_assets_detail, many=True
        ).data

        # Убираем пустые строки в None
        for category in data.values():
            for item in category:
                for key, value in item.items():
                    if isinstance(value, str) and value == "":
                        item[key] = None

        # Добавляем кастомные активы
        for asset_data in custom_assets_data:
            asset_name = asset_data.get("Название")
            data[asset_name] = custom_assets_detail_data

        # Добавляем данные пользователя
        data['user'] = {
            'username': user.username,
            'role': user.Роль,
            'company': user.Организация
        }

        # Добавляем справочники и пользователей для администратора
        if user.Роль == "admin" or user.Роль == 'manager':
            data['handbooks'] = {
                "equipments": HandbookEquipmentsSerializer(HandbookEquipments.objects.all(), many=True).data,
                "programs": HandbookProgramsSerializer(HandbookPrograms.objects.all(), many=True).data,
                "components": HandbookComponentsSerializer(HandbookComponents.objects.all(), many=True).data,
                "consumables": HandbookConsumablesSerializer(HandbookConsumables.objects.all(), many=True).data,
                "company": HandbookCompanySerializer(HandbookCompany.objects.all(), many=True).data,
            }
        if user.Роль == "admin":
            data['users'] = UserSerializer(User.objects.all(), many=True).data
        elif user.Роль == "manager":
            data['users'] = UserSerializer(User.objects.filter(Организация=user.Организация), many=True).data
        return Response(data, status=status.HTTP_200_OK)

# utils for convert and download .csv


def export_assets_to_csv(file_path, model_name, pks=None):
    model = model_mapping.get(model_name.lower())
    field_names = fields_mapping.get(model_name.lower())

    if model and field_names:
        if pks and len(pks) > 0:
            data = model.objects.filter(pk__in=pks)
        else:
            data = model.objects.all()

        if not data.exists():
            return f"В '{model_name}' нет данных."

        with open(file_path, mode="w", newline="", encoding="utf-8-sig") as file:
            # Разделитель — точка с запятой
            writer = csv.writer(file, delimiter=";")
            writer.writerow(field_names)  # Заголовки

            for item in data:
                writer.writerow([getattr(item, field, "")
                                for field in field_names])

        return file_path

    else:
        custom_assets = CustomAsset.objects.filter(Название=model_name)

        if not custom_assets.exists():
            return f"'{model_name}' не существует."

        custom_assets_details = CustomAssetDetails.objects.filter(
            Актив__in=custom_assets)

        if not custom_assets_details.exists():
            return f"В '{model_name}' нет данных."

        field_names = fields_mapping.get(
            "custom_assets", [field.name for field in CustomAssetDetails._meta.fields])

        with open(file_path, mode="w", newline="", encoding="utf-8-sig") as file:
            # Разделитель — точка с запятой
            writer = csv.writer(file, delimiter=";")
            writer.writerow(field_names)  # Заголовки

            for item in custom_assets_details:
                writer.writerow([getattr(item, field, "")
                                for field in field_names])

        return file_path


def send_file_to_user(file_path, filename):
    if not os.path.exists(file_path):
        raise Http404("Файл не найден.")

    response = FileResponse(open(file_path, "rb"), as_attachment=True)
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    response["Content-Type"] = "text/csv"

    return response


# import database
class ExportDBView(APIView):
    def post(self, request, *args, **kwargs):
        model_name = request.data.get("name")
        pks = request.data.get("pks")
        if not model_name:
            return Response({"error": "Название актива не указано."}, status=400)

        file_path = os.path.join(
            settings.MEDIA_ROOT, "databases", f"{model_name}.csv")
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        exported_file_path = export_assets_to_csv(file_path, model_name, pks)

        if isinstance(exported_file_path, str) and exported_file_path.endswith(".csv"):
            try:
                return send_file_to_user(exported_file_path, f"{model_name}.csv")
            except Http404 as e:
                return Response({"error": str(e)}, status=404)
        else:
            return Response({"error": exported_file_path}, status=400)


# Функция импорта данных из CSV в БД
def import_csv_to_db(file_path, model_name):
    model = model_mapping.get(model_name.lower())
    errors = []
    created = 0
    exist = 0
    pks = []
    encoding = detect_encoding(file_path)

    if model:
        try:
            with open(file_path, mode="r", encoding=encoding) as file:
                reader = csv.DictReader(file, delimiter=";")
                instances = []

                for row in reader:
                    for field in row:
                        pks.append(row.get("id"))
                        value = row[field].strip() if isinstance(
                            row[field], str) else None

                        if is_date(field, value):
                            if not value.strip():  # Если строка пустая, пропускаем
                                row[field] = None
                                continue

                            converted_date = convert_to_date(value)

                            if is_valid_date(converted_date):
                                row[field] = converted_date
                            else:
                                errors.append(f'Ошибка формата даты: "{value}"')
                                row[field] = None

                        # Обработка числовых значений
                        if "Стоимость" in field:
                            if value in [None, ""]:
                                row[field] = None
                            else:
                                try:
                                    row[field] = float(value)
                                except ValueError:
                                    errors.append(
                                        f'Ошибка формата числа \n'
                                    )
                                    row[field] = None

                    try:
                        instance = model(**row)
                        instances.append(instance)
                    except Exception as e:
                        pass
                
                print(instances)
                model.objects.bulk_create(instances, ignore_conflicts=True)
            founded = model.objects.filter(id__in=pks)
            created = founded.count()
        except IntegrityError as e:
            founded = model.objects.filter(id__in=pks)
            exist = founded.count()
        except Exception as e:
            error_message = traceback.format_exc()
            print(error_message)

            errors.append(f"Ошибка импорта данных: {str(e)}. \n")

    return {
        "imported_file_path": file_path,
        "errors": set(errors),
        "created": created,
        "exist": exist
    }


# APIView для импорта CSV
class ImportDBView(APIView):
    queryset = ExportFile.objects.all()
    serializer_class = ExportFileSerializer
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        model_name = request.data.get("name")
        file = request.FILES.get("file")

        if not model_name:
            return Response({"error": "Название актива не указано."}, status=status.HTTP_400_BAD_REQUEST)

        if not file:
            return Response({"error": "Файл не был загружен."}, status=status.HTTP_400_BAD_REQUEST)

        return self.perform_create(file, model_name)

    def perform_create(self, file, model_name):
        file_path = os.path.join(
            settings.MEDIA_ROOT, "uploads", f"{model_name}.csv")
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        try:
            with open(file_path, "wb") as f:
                for chunk in file.chunks():
                    f.write(chunk)

            import_result = import_csv_to_db(file_path, model_name)
            imported_file_path = import_result.get("imported_file_path")
            import_errors = import_result.get("errors")
            import_created = import_result.get("created")
            import_exist = import_result.get("exist")

            # Удаляем файл после импорта
            try:
                os.remove(file_path)
            except Exception as e:
                print(f"Ошибка при удалении файла: {str(e)}.")

            if (import_created == 0 and import_exist == 0):
                return Response(
                    {"error": import_errors,
                        'message': f'Ошибка при импорте данных. {set(import_errors)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            else:
                return Response(
                    {
                        "message": f"Файл успешно импортирован.",
                        "errors": import_errors,
                        "imported_file_path": imported_file_path,
                    },
                    status=status.HTTP_201_CREATED
                )

        except Exception as e:
            return Response(
                {"error": f"Ошибка при импорте: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class HandbookView(APIView):
    def get(self, request, asset, pk=None):
        if asset != 'users':
            model = handbook_mapping.get(asset)

            if not model:
                return Response({"error": "Такого справочника не существует."}, status=400)

            if not pk:
                queryset = model.objects.all()
            else:
                queryset = model.objects.filter(pk=pk)
                if not queryset.exists():
                    return Response({"error": "Запись не найдена."}, status=404)

            serializer_class = handbook_serializer_mapping.get(asset)
            if not serializer_class:
                return Response({"error": "Нет подходящего сериализатора."}, status=400)

            serializer = serializer_class(queryset, many=True)

            # Используем defaultdict(set) для сбора уникальных значений
            result = defaultdict(set)
            for item in serializer.data:
                for key, value in item.items():
                    if value:
                        result[key].add(value)

            # Получаем данные из HandbookCompany
            company_queryset = HandbookCompany.objects.all()
            company_serializer = HandbookCompanySerializer(
                company_queryset, many=True)

            # Добавляем данные из HandbookCompany в result
            for item in company_serializer.data:
                for key, value in item.items():
                    if value:
                        result[key].add(value)

            # Преобразуем множества в списки
            result = {key: list(value) for key, value in result.items()}
            if request.user.Роль == "manager":
                users = User.objects.filter(
                    Организация=request.user.Организация)
                result['Сотрудник_Компания'] = [request.user.Организация]
                result['Сотрудник'] = [request.user.username]
                result['Сотрудник_Логин'] = [request.user.username]
            else:
                result['Сотрудник_Логин'] = [item['username'] for item in User.objects.all().values()]
        else:
            result = {
                'Роль': ['admin', 'manager', 'user'],
                'Организация': [item['Компания'] for item in HandbookCompany.objects.all().values()]
            }
        return Response(result, status=status.HTTP_200_OK)

    def post(self, request, asset):
        data = request.data
        model = handbook_mapping.get(asset)
        serializer_class = handbook_serializer_mapping.get(asset)
        if not model:
            return Response({"error": "Такого справочника не существует."}, status=400)

        if not data:
            return Response({"error": "Данные не были переданы."}, status=400)

        if not serializer_class:
            return Response({"error": "Нет подходящего сериализатора."}, status=400)

        serializer = serializer_class(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, asset, pk):
        model = handbook_mapping.get(asset)
        serializer_class = handbook_serializer_mapping.get(asset)

        if not model:
            return Response({"error": "Такого справочника не существует."}, status=status.HTTP_400_BAD_REQUEST)

        if not serializer_class:
            return Response({"error": "Нет подходящего сериализатора."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            instance = model.objects.get(pk=pk)
        except model.DoesNotExist:
            return Response({"error": "Запись не найдена."}, status=status.HTTP_404_NOT_FOUND)

        serializer = serializer_class(
            instance, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, asset, pk):
        model = handbook_mapping.get(asset)

        if not model:
            return Response({"error": "Такого справочника не существует."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            instance = model.objects.get(pk=pk)
        except model.DoesNotExist:
            return Response({"error": "Запись не найдена."}, status=status.HTTP_404_NOT_FOUND)

        instance.delete()
        return Response({"message": "Запись удалена."}, status=status.HTTP_204_NO_CONTENT)
