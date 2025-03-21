from django.contrib import admin
from .models import (
    Equipments, Programs, Components, Consumables, Repairs, Movements,
    CustomAsset, CustomAssetDetails, ExportFile, HandbookConsumables, HandbookComponents, HandbookEquipments, HandbookPrograms, HandbookCompany
)


@admin.register(Equipments)
class EquipmentsAdmin(admin.ModelAdmin):
    list_display = ('pk', 'Серийный_Номер', 'Компания', 'Местоположение', 'Статус', 'Производитель')
    search_fields = ('Серийный_Номер', 'Компания', 'Производитель')
    list_filter = ('Статус', 'Компания')
    


@admin.register(Programs)
class ProgramsAdmin(admin.ModelAdmin):
    list_display = ('pk', 'Название', 'Версия', 'Ключ_Продукта', 'Лиценизя_До')
    search_fields = ('Название', 'Версия', 'Ключ_Продукта')
    list_filter = ('Лиценизя_До',)
    


@admin.register(Components)
class ComponentsAdmin(admin.ModelAdmin):
    list_display = ('pk', 'Серийный_Номер_Связанного_Объекта', 'Компания', 'Статус', 'Производитель')
    search_fields = ('Серийный_Номер_Связанного_Объекта', 'Компания', 'Производитель')
    list_filter = ('Статус', 'Компания')
    


@admin.register(Consumables)
class ConsumablesAdmin(admin.ModelAdmin):
    list_display = ('pk', 'Количество', 'Сумма', 'Компания', 'Местоположение')
    search_fields = ('Компания', 'Местоположение')
    list_filter = ('Компания',)
    


@admin.register(Repairs)
class RepairsAdmin(admin.ModelAdmin):
    list_display = ('pk', 'Номер', 'Дата_Поломки', 'Описание_Неисправности', 'Ремонт_Стоимость')
    search_fields = ('Номер', 'Описание_Неисправности')
    list_filter = ('Дата_Поломки', 'Ремонт_Стоимость')
    


@admin.register(Movements)
class MovementsAdmin(admin.ModelAdmin):
    list_display = ('Номер', 'Название', 'Статус', 'Дата_Отправки', 'Дата_Получения')
    search_fields = ('Номер', 'Название', 'Статус')
    list_filter = ('Статус', 'Дата_Отправки', 'Дата_Получения')
    


@admin.register(CustomAsset)
class CustomAssetAdmin(admin.ModelAdmin):
    list_display = ('Название',)
    search_fields = ('Название',)
    


@admin.register(CustomAssetDetails)
class CustomAssetDetailsAdmin(admin.ModelAdmin):
    list_display = ('Актив', 'Компания', 'Местоположение', 'Статус')
    search_fields = ('Актив__Название', 'Компания', 'Местоположение')
    list_filter = ('Статус', 'Компания')
    


@admin.register(ExportFile)
class ExportFileAdmin(admin.ModelAdmin):
    list_display = ('file',)
    

@admin.register(HandbookConsumables)
class HandbookConsumablesAdmin(admin.ModelAdmin):
    pass
    
@admin.register(HandbookComponents)
class HandbookComponentsAdmin(admin.ModelAdmin):
    pass
    
    
@admin.register(HandbookEquipments)
class HandbookEquipmentsAdmin(admin.ModelAdmin):
    pass
    
@admin.register(HandbookPrograms)
class HandbookProgramsAdmin(admin.ModelAdmin):
    pass


@admin.register(HandbookCompany)
class HandbookCompanyAdmin(admin.ModelAdmin):
    pass