from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
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


# base serializers
class BaseSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        user = self.context["request"].user

        if user.Роль == "user":
            raise PermissionDenied("Вы не можете создавать записи.")

        return super().create(validated_data)

    def validate_Дополнительные_Поля(self, value):
        user = self.context["request"].user

        if user.Роль != "admin":
            raise PermissionDenied("Вы не можете изменять дополнительные поля.")

        return value


# standart assets

class EquipmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipments
        fields = [
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
        ]


class ProgramsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Programs
        fields = [
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
        ]


class ComponentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Components
        fields = [
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
        ]


class ConsumablesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consumables
        fields = [
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
        ]
        
        
class RepairsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repairs
        fields = [
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
        ]


class MovementsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movements
        fields = "__all__"


# custom assets
class CustomAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomAsset
        fields = "__all__"

    def create(self, validated_data):
        user = self.context["request"].user

        if user.Роль != "admin":
            raise PermissionDenied("Вы не можете создавать записи.")

        return super().create(validated_data)


class CustomAssetDetailsSerializer(BaseSerializer):
    class Meta:
        model = CustomAssetDetails
        fields = "__all__"


class ExportFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExportFile
        fields = "__all__"


class HandbookEquipmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = HandbookEquipments
        fields = [
            "id",
            "Производитель",
            "Тип",
            "Модель",
        ]


class HandbookProgramsSerializer(serializers.ModelSerializer):
    class Meta:
        model = HandbookPrograms
        fields = [
            "id",
            "Название",
            "Версия",
            "Дистрибутив",
        ]


class HandbookComponentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = HandbookComponents
        fields = [
            "id",
            "Название",
            "Тип",
            "Модель",
        ]


class HandbookConsumablesSerializer(serializers.ModelSerializer):
    class Meta:
        model = HandbookConsumables
        fields = [
            "id",
            "Название",
            "Тип",
            "Модель",
        ]


class HandbookCompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = HandbookCompany
        fields = [
            "id",
            "Компания",
            "Местоположение",
            "Статус",
            "Сотрудник",
            "Сотрудник_Компания",
            "Сотрудник_Подразделение",
            "Сотрудник_Офис",
            "Сотрудник_Должность",
            "Сотрудник_Телефон",
            "Стоимость",
            "Поставщик"
        ]