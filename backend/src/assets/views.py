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
)
from accounts.serializers import UserSerializer
from accounts.models import User
import csv
import os
from faker import Faker
from django.http import JsonResponse

faker = Faker('ru_RU')


model_mapping = {
    "equipments": Equipments,
    "movements": Movements,
    "repairs": Repairs,
    "components": Components,
    "consumables": Consumables,
    "programs": Programs,
}

handbook_mapping = {
    "components": HandbookComponents,
    "consumables": HandbookConsumables,
    "equipments": HandbookEquipments,
    "programs": HandbookPrograms,
}

handbook_serializer_mapping = {
    "components": HandbookComponentsSerializer,
    "consumables": HandbookConsumablesSerializer,
    "equipments": HandbookEquipmentsSerializer,
    "programs": HandbookProgramsSerializer,
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

        custom_assets_data = CustomAssetSerializer(custom_assets, many=True).data
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
        if user.Роль == "admin":
            data['users'] = UserSerializer(User.objects.all(), many=True).data
            data['handbooks'] = {
                "equipments": HandbookEquipmentsSerializer(HandbookEquipments.objects.all(), many=True).data,
                "programs": HandbookProgramsSerializer(HandbookPrograms.objects.all(), many=True).data,
                "components": HandbookComponentsSerializer(HandbookComponents.objects.all(), many=True).data,
                "consumables": HandbookConsumablesSerializer(HandbookConsumables.objects.all(), many=True).data,
            }

        return Response(data, status=status.HTTP_200_OK)
    
# utils for convert and download .csv
def export_assets_to_csv(file_path, model_name):
    model = model_mapping.get(model_name.lower())
    if model:
        data = model.objects.all()

        if not data.exists():
            return f"В '{model_name}' нет данных."

        with open(file_path, mode="w", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            field_names = [field.name for field in model._meta.fields]
            writer.writerow(field_names)

            for item in data:
                writer.writerow([getattr(item, field)
                                for field in field_names])

        return file_path

    else:
        custom_assets = CustomAsset.objects.filter(Название=model_name)

        if not custom_assets.exists():
            return f"'{model_name}' не существует."

        custom_assets_details = CustomAssetDetails.objects.filter(
            Актив__in=custom_assets
        )

        if not custom_assets_details.exists():
            return f"В '{model_name}' нет данных."

        with open(file_path, mode="w", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            field_names = [
                field.name for field in CustomAssetDetails._meta.fields]
            writer.writerow(field_names)

            for item in custom_assets_details:
                writer.writerow([getattr(item, field)
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
class ImportDBView(APIView):
    def post(self, request, *args, **kwargs):
        model_name = request.data.get("name")

        if not model_name:
            return Response({"error": "Название актива не указано."}, status=400)

        file_path = os.path.join(
            settings.MEDIA_ROOT, "databases", f"{model_name}.csv")
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        exported_file_path = export_assets_to_csv(file_path, model_name)

        if isinstance(exported_file_path, str) and exported_file_path.endswith(".csv"):
            try:
                return send_file_to_user(exported_file_path, f"{model_name}.csv")
            except Http404 as e:
                return Response({"error": str(e)}, status=404)
        else:
            return Response({"detail": exported_file_path}, status=200)


# utlis for write to db from .csv
def import_csv_to_db(file_path, model_name):
    model = model_mapping.get(model_name.lower())

    if model:

        try:
            model.objects.all().delete()

            with open(file_path, mode="r", encoding="utf-8") as file:
                reader = csv.DictReader(file)
                instances = []

                for row in reader:
                    for field in row:
                        # date_string = (
                        #     row[field].strip() if isinstance(row[field], str) else None
                        # )

                        # if "дата" in field.lower() and date_string:
                        #     try:
                        #         input_datetime = parser.parse(date_string)
                        #         new_datetime = input_datetime + timedelta(days=4)
                        #         new_datetime = new_datetime.replace(
                        #             hour=10,
                        #             minute=58,
                        #             second=38,
                        #             microsecond=275780,
                        #             tzinfo=None,
                        #         )
                        #         row[field] = new_datetime

                        #     except Exception as e:
                        #         print(
                        #             f"Ошибка формата даты в строке '{date_string}': {str(e)}."
                        #         )
                        #         row[field] = None
                        # else:
                        #     row[field] = None if date_string == "" else row[field]

                        date_string = (
                            row[field].strip() if isinstance(
                                row[field], str) else None
                        )

                        if "Дата" in field and isinstance(row[field], str):
                            row[field] = row[field] if row[field].strip() else None
                        else:
                            row[field] = None if date_string == "" else row[field]

                        if "Стоимость" in field or "Номер" in field:
                            if row[field] == "" or row[field] is None:
                                row[field] = None
                            else:
                                try:
                                    row[field] = float(row[field])
                                except ValueError:
                                    print(
                                        f"Ошибка формата числа в строке: {row}. Ожидается числовое значение."
                                    )
                                    row[field] = None
                    try:
                        instance = model(**row)
                        instances.append(instance)
                    except Exception as e:
                        print(
                            f"Ошибка при создании экземпляра модели: {str(e)} для строки: {row}"
                        )

                model.objects.bulk_create(instances)

            return f"Импорт данных '{model_name}' завершен."

        except Exception as e:
            return f"Произошла ошибка при импорте данных: {str(e)}."

    else:
        asset_name = os.path.splitext(os.path.basename(file_path))[0]
        custom_asset, created = CustomAsset.objects.get_or_create(
            Название=asset_name)

        if created:
            print(f"Создан новый актив: {asset_name}")
        else:
            print(f"Найден существующий актив: {asset_name}")

        try:
            CustomAssetDetails.objects.filter(Актив=custom_asset).delete()

            with open(file_path, mode="r", encoding="utf-8") as file:
                reader = csv.DictReader(file)
                instances = []

                for row in reader:
                    for field in row:
                        date_string = (
                            row[field].strip() if isinstance(
                                row[field], str) else None
                        )

                        if "Дата" in field and isinstance(row[field], str):
                            row[field] = row[field] if row[field].strip() else None
                        else:
                            row[field] = None if date_string == "" else row[field]

                        if "Стоимость" in field or "Номер" in field:
                            if row[field] == "" or row[field] is None:
                                row[field] = None
                            else:
                                try:
                                    row[field] = float(row[field])
                                except ValueError:
                                    print(
                                        f"Ошибка формата числа в строке: {row[id]}. Ожидается числовое значение."
                                    )
                                    row[field] = None

                    if "Не_Инвент" not in row or row["Не_Инвент"] in [None, ""]:
                        row["Не_Инвент"] = False

                    try:
                        asset_value = row.pop("Актив", None)
                        instance = CustomAssetDetails(
                            Актив=custom_asset, **row)
                        instances.append(instance)
                    except Exception as e:
                        print(
                            f"Ошибка при создании экземпляра модели: {str(e)} для строки: {row}"
                        )

                CustomAssetDetails.objects.bulk_create(instances)

            return f"Импорт данных для актива '{asset_name}' завершен."

        except Exception as e:
            return f"Произошла ошибка при импорте данных: {str(e)}."


# export database
class ExportDBView(APIView):
    queryset = ExportFile.objects.all()
    serializer_class = ExportFileSerializer
    parser_classes = (MultiPartParser, FormParser)
    model_name = ""

    def post(self, request, *args, **kwargs):
        model_name = request.data.get("name")
        file = request.FILES.get("file")

        if not model_name:
            return Response(
                {"error": "Название актива не указано."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not file:
            return Response(
                {"error": "Файл не был загружен."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        self.model_name = model_name

        return self.perform_create(file, model_name)

    def perform_create(self, file, model_name):
        file_path = os.path.join(
            settings.MEDIA_ROOT, "uploads", f"{model_name}.csv")
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        with open(file_path, "wb") as f:
            for chunk in file.chunks():
                f.write(chunk)

        imported_file_path = import_csv_to_db(file_path, model_name)

        try:
            os.remove(file_path)
        except Exception as e:
            print(f"Ошибка при удалении файла: {str(e)}.")

        return Response(
            {"detail": imported_file_path},
            status=status.HTTP_201_CREATED,
        )


class HandbookView(APIView):
    def get(self, request, asset, pk=None):

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

        result = defaultdict(set)
        for item in serializer.data:
            for key, value in item.items():
                if value:
                    result[key].add(value)

        result = {key: list(value) for key, value in result.items()}

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
