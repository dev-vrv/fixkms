from django.db import models


# base assets

class BaseAssetA(models.Model):
    Компания = models.CharField(max_length=255, blank=True, null=True)
    Местоположение = models.CharField(max_length=255, blank=True, null=True)
    Статус = models.CharField(max_length=255, blank=True, null=True)
    Производитель = models.CharField(max_length=255, blank=True, null=True)
    Серийный_Номер = models.CharField(max_length=255, blank=True, null=True)
    Инв_Номер_Бухгалтерии = models.CharField(max_length=255, blank=True, null=True)
    Стоимость = models.FloatField(blank=True, null=True)
    Сотрудник = models.CharField(max_length=255)
    Сотрудник_Компания = models.CharField(max_length=255, blank=True, null=True)
    Сотрудник_Подразделение = models.CharField(max_length=255, blank=True, null=True)
    Сотрудник_Отдел = models.CharField(max_length=255, blank=True, null=True)
    Сотрудник_Офис = models.CharField(max_length=255, blank=True, null=True)
    Сотрудник_Должность = models.CharField(max_length=255, blank=True, null=True)
    Сотрудник_Телефон = models.CharField(max_length=255, blank=True, null=True)
    Сотрудник_Мобильный_Телефон = models.CharField(
        max_length=255, blank=True, null=True
    )
    Сотрудник_EMail = models.CharField(max_length=255, blank=True, null=True)
    Сотрудник_Логин = models.CharField(max_length=255, blank=True, null=True)
    Сотрудник_Пасспорт = models.CharField(max_length=255, blank=True, null=True)
    Описание = models.CharField(max_length=255, blank=True, null=True)
    Поставщик = models.CharField(max_length=255, blank=True, null=True)
    Примечания = models.CharField(max_length=255, blank=True, null=True)

    Дополнительные_Поля = models.JSONField(blank=True, null=True)

    def __str__(self):
        return self.Серийный_Номер if self.Серийный_Номер else 'Серийный номер не указан'
    
    class Meta:
        abstract = True


class BaseAssetB(models.Model):
    Стоимость_с_содержимым = models.FloatField(blank=True, null=True)
    Дата_Инвертаризации = models.DateField(blank=True, null=True)
    Содержимое = models.CharField(max_length=255, blank=True, null=True)
    Инвентарный_Номер_Связанного_Объекта = models.CharField(
        max_length=255, blank=True, null=True
    )
    Тип_Связанного_Объекта = models.CharField(max_length=255, blank=True, null=True)
    Модель_Связанного_Объекта = models.CharField(max_length=255, blank=True, null=True)
    Номер_Заказа = models.CharField(max_length=255, blank=True, null=True)
    Не_Инвент = models.BooleanField(default=False)
    # create_date = models.DateField(auto_now_add=True)
    Дата_Изменения = models.DateField(blank=True, null=True)
    Изменил = models.CharField(max_length=255, blank=True, null=True)
    Дата_последней_проверки = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.Инвентарный_Номер_Связанного_Объекта if self.Инвентарный_Номер_Связанного_Объекта else 'Инвентарный номер не указан'
    
    class Meta:
        abstract = True


class BaseAssetC(models.Model):
    Адрес = models.CharField(max_length=255, blank=True, null=True)
    Широта = models.FloatField(blank=True, null=True)
    Долгота = models.FloatField(blank=True, null=True)
    Город = models.CharField(max_length=255, blank=True, null=True)
    Индекс = models.IntegerField(blank=True, null=True)
    Сетевое_Имя = models.CharField(max_length=255, blank=True, null=True)
    IP_Адрес = models.CharField(
        max_length=255, blank=True, null=True
    )  # сделать валидацию ххх.ххх.ххх.ххх
    Домен = models.CharField(max_length=255, blank=True, null=True)
    MAC_Адрес = models.CharField(
        max_length=255, blank=True, null=True
    )  # сделать валидацию ХХ-ХХ-ХХ-ХХ-ХХ-ХХ

    def __str__(self):
        return self.Сетевое_Имя if self.Сетевое_Имя else 'Сетевое имя не указано'
    
    class Meta:
        abstract = True


class BaseAssetTMPN(models.Model):
    Тип = models.CharField(max_length=255, blank=True, null=True)
    Модель = models.CharField(max_length=255, blank=True, null=True)
    Номер_Партии = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.Тип if self.Тип else 'Тип не указан'
    
    class Meta:
        abstract = True


class BaseAssetWrranty(models.Model):
    Гарантия_До = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.Гарантия_До if self.Гарантия_До else 'Гарантия не указана'

    class Meta:
        abstract = True


# standart assets

class Equipments(BaseAssetA, BaseAssetB, BaseAssetC, BaseAssetWrranty, BaseAssetTMPN):
    Серисная_Организация = models.CharField(max_length=255, blank=True, null=True)
    Диагональ = models.FloatField(blank=True, null=True)
    Количество_Мегапикселей = models.FloatField(blank=True, null=True)
    Количество_портов = models.IntegerField(blank=True, null=True)
    Отпечатано_страниц = models.IntegerField(blank=True, null=True)
    
    def __str__(self):
        return self.Серийный_Номер if self.Серийный_Номер else 'Серийный номер не указан'

    class Meta:
        verbose_name_plural = "Оборудование"
        ordering = ["-pk"]

class Programs(BaseAssetA, BaseAssetB, BaseAssetC):
    Название = models.CharField(max_length=255, blank=True, null=True)
    Версия = models.CharField(max_length=255, blank=True, null=True)
    Ключ_Продукта = models.CharField(max_length=255, blank=True, null=True)
    Код_Активации = models.CharField(max_length=255, blank=True, null=True)
    Номер_Мульти_Лицензии = models.CharField(max_length=255, blank=True, null=True)
    Количество_Мульти_Лицензий = models.IntegerField(blank=True, null=True)
    Лиценизя_До = models.DateField(blank=True, null=True)
    Дистрибутив = models.CharField(max_length=255, blank=True, null=True)
    Количество_пользователей = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.Название if self.Название else 'Название не указано'

    class Meta:
        verbose_name_plural = "Программы"
        ordering = ["-pk"]

class Components(BaseAssetA, BaseAssetB, BaseAssetC, BaseAssetWrranty, BaseAssetTMPN):
    Серийный_Номер_Связанного_Объекта = models.CharField(
        max_length=255, blank=True, null=True
    )
    Инв_Номер_Бухгалтерии_Связанного_Объекта = models.CharField(
        max_length=255, blank=True, null=True
    )
    Заправлен = models.BooleanField(default=False)
    Дата_последней_заправки = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.Серийный_Номер_Связанного_Объекта if self.Серийный_Номер_Связанного_Объекта else 'Серийный номер не указан'

    class Meta:
        verbose_name_plural = "Комплектующие"
        ordering = ["-pk"]

class Consumables(BaseAssetA, BaseAssetB, BaseAssetC, BaseAssetTMPN):
    Количество = models.IntegerField(blank=True, null=True)
    Сумма = models.FloatField(blank=True, null=True)
    Серийный_Номер_Связанного_Объекта = models.CharField(
        max_length=255, blank=True, null=True
    )
    Инв_Номер_Бухгалтерии_Связанного_Объекта = models.CharField(
        max_length=255, blank=True, null=True
    )

    def __str__(self):
        return 'Серийный номер не указан' if not self.Серийный_Номер_Связанного_Объекта else self.Серийный_Номер_Связанного_Объекта

    class Meta:
        verbose_name_plural = "Расходные материалы"
        ordering = ["-pk"]

class Repairs(BaseAssetA, BaseAssetWrranty, BaseAssetTMPN):
    Номер = models.CharField(max_length=255, blank=True, null=True)
    Дата_Поломки = models.DateField(blank=True, null=True)
    Дата_Отправки = models.DateField(blank=True, null=True)
    Дата_Возврата = models.DateField(blank=True, null=True)
    Описание_Неисправности = models.CharField(max_length=255, blank=True, null=True)
    Ремонт_Примечания = models.CharField(max_length=255, blank=True, null=True)
    Ремонт_Сервисная_Организация = models.CharField(
        max_length=255, blank=True, null=True
    )
    Ремонт_Стоимость = models.FloatField(blank=True, null=True)
    Создал = models.CharField(max_length=255, blank=True, null=True)
    Отправил = models.CharField(max_length=255, blank=True, null=True)
    Принял = models.CharField(max_length=255, blank=True, null=True)
    Ремонт_Дата_Изменения = models.DateField(blank=True, null=True)
    Ремонт_Изменил = models.CharField(max_length=255, blank=True, null=True)
    Вид_Учётных_Единиц = models.CharField(max_length=255, blank=True, null=True)
    ID_Объекта = models.CharField(max_length=255, blank=True, null=True)
    Подразделение = models.CharField(max_length=255, blank=True, null=True)
    Сервисная_Организация = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.Описание_Неисправности if self.Описание_Неисправности else 'Описание неисправности не указано'

    class Meta:
        verbose_name_plural = "Ремонты"
        ordering = ["-pk"]

class Movements(models.Model):
    Номер = models.CharField(max_length=255, blank=True, null=True)
    Название = models.CharField(max_length=255, blank=True, null=True)
    Статус = models.CharField(max_length=255, blank=True, null=True)
    Филиал_Отправитель = models.CharField(max_length=255, blank=True, null=True)
    Подразделение_Отправитель_Описание = models.CharField(
        max_length=255, blank=True, null=True
    )
    Подразделение_Отправитель_Телефон = models.CharField(
        max_length=255, blank=True, null=True
    )
    Подразделение_Отправитель_Адрес = models.CharField(
        max_length=255, blank=True, null=True
    )
    Подразделение_Получатель = models.CharField(max_length=255, blank=True, null=True)
    Подразделение_Получатель_Описание = models.CharField(
        max_length=255, blank=True, null=True
    )
    Подразделение_Получатель_Телефон = models.CharField(
        max_length=255, blank=True, null=True
    )
    Подразделение_Получатель_Адрес = models.CharField(
        max_length=255, blank=True, null=True
    )
    Сотрудник_Отправитель = models.CharField(max_length=255, blank=True, null=True)
    Сотрудник_Отправитель_Отдел = models.CharField(
        max_length=255, blank=True, null=True
    )
    Сотрудник_Отправитель_Должность = models.CharField(
        max_length=255, blank=True, null=True
    )
    Сотрудник_Отправитель_Описание = models.CharField(
        max_length=255, blank=True, null=True
    )
    Сотрудник_Получатель = models.CharField(max_length=255, blank=True, null=True)
    Сотрудник_Получатель_Отдел = models.CharField(max_length=255, blank=True, null=True)
    Сотрудник_Получатель_Должность = models.CharField(
        max_length=255, blank=True, null=True
    )
    Сотрудник_Получатель_Описание = models.CharField(
        max_length=255, blank=True, null=True
    )
    Компания = models.CharField(max_length=255, blank=True, null=True)
    Количество = models.IntegerField(blank=True, null=True)
    Описание = models.CharField(max_length=255, blank=True, null=True)
    # Дата_Создания = models.DateField(auto_now_add=True)
    Создал = models.CharField(max_length=255, blank=True, null=True)
    Дата_Отправки = models.DateField(blank=True, null=True)
    Пользователь_Отправитель = models.CharField(max_length=255, blank=True, null=True)
    Дата_Получения = models.DateField(blank=True, null=True)
    Пользователь_Получатель = models.CharField(max_length=255, blank=True, null=True)
    Дата_Изменения = models.DateField(blank=True, null=True)
    Изменил = models.CharField(max_length=255, blank=True, null=True)

    Дополнительные_Поля = models.JSONField(blank=True, null=True)

    def __str__(self):
        return self.Название if self.Название else 'Название не указано'

    class Meta:
        verbose_name_plural = "Перемещения"
        ordering = ["-pk"]

# custom assets

class CustomAsset(models.Model):
    Название = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.Название if self.Название else 'Название не указано'


class CustomAssetDetails(
    BaseAssetA, BaseAssetB, BaseAssetC, BaseAssetWrranty, BaseAssetTMPN
):
    Актив = models.ForeignKey(
        CustomAsset, on_delete=models.CASCADE, related_name="details"
    )

    def __str__(self):
        return self.Актив if self.Актив else 'Актив не указан'

class ExportFile(models.Model):
    file = models.FileField(upload_to="uploads/")

    def __str__(self):
        return self.file.name if self.file.name else 'Имя файла не указано'

    class Meta:
        verbose_name_plural = "Экспортные файлы"
        ordering = ["-pk"]

# handbooks


class HandbookEquipments(models.Model):
    Название = models.CharField(max_length=255, blank=True, null=True)
    Производитель = models.CharField(max_length=255, blank=True, null=True)
    Тип = models.CharField(max_length=255, blank=True, null=True)
    Модель = models.CharField(max_length=255, blank=True, null=True)
    Серисная_Организация = models.CharField(max_length=255, blank=True, null=True)
    Диагональ = models.FloatField(blank=True, null=True)
    Количество_Мегапикселей = models.FloatField(blank=True, null=True)
    Количество_портов = models.IntegerField(blank=True, null=True)
    Стоимость_с_содержимым = models.FloatField(blank=True, null=True)
    Дата_Инвертаризации = models.DateField(blank=True, null=True)
    Содержимое = models.CharField(max_length=255, blank=True, null=True)
    Инвентарный_Номер_Связанного_Объекта = models.CharField(max_length=255, blank=True, null=True)
    Тип_Связанного_Объекта = models.CharField(max_length=255, blank=True, null=True)
    Модель_Связанного_Объекта = models.CharField(max_length=255, blank=True, null=True)
    Гарантия_До = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.Название if self.Название else 'Название не указано'

    class Meta:
        verbose_name_plural = "Справочники Оборудование"
        ordering = ["-pk"]
    
class HandbookPrograms(models.Model):
    Название = models.CharField(max_length=255, blank=True, null=True)
    Версия = models.CharField(max_length=255, blank=True, null=True)
    Ключ_Продукта = models.CharField(max_length=255, blank=True, null=True)
    Код_Активации = models.CharField(max_length=255, blank=True, null=True)
    Дистрибутив = models.CharField(max_length=255, blank=True, null=True)
    Производитель = models.CharField(max_length=255, blank=True, null=True)
    Номер_Мульти_Лицензии = models.CharField(max_length=255, blank=True, null=True)
    Количество_Мульти_Лицензий = models.IntegerField(blank=True, null=True)
    Лиценизя_До = models.DateField(blank=True, null=True)
    Количество_пользователей = models.IntegerField(blank=True, null=True)
    Дата_Инвертаризации = models.DateField(blank=True, null=True)
    Инвентарный_Номер_Связанного_Объекта = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.Название if self.Название else 'Название не указано'

    class Meta:
        verbose_name_plural = "Справочники Программы"
        ordering = ["-pk"]

class HandbookComponents(models.Model):
    Название = models.CharField(max_length=255, blank=True, null=True)
    Производитель = models.CharField(max_length=255, blank=True, null=True)
    Серийный_Номер_Связанного_Объекта = models.CharField(max_length=255, blank=True, null=True)
    Инв_Номер_Бухгалтерии_Связанного_Объекта = models.CharField(max_length=255, blank=True, null=True)
    Стоимость = models.FloatField(blank=True, null=True)
    Дата_Инвертаризации = models.DateField(blank=True, null=True)
    Гарантия_До = models.DateField(blank=True, null=True)
    Тип = models.CharField(max_length=255, blank=True, null=True)
    Модель = models.CharField(max_length=255, blank=True, null=True)
    Номер_Партии = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.Название if self.Название else 'Название не указано'

    class Meta:
        verbose_name_plural = "Справочники Комплектующие"
        ordering = ["-pk"]
    

class HandbookConsumables(models.Model):
    Название = models.CharField(max_length=255, blank=True, null=True)
    Производитель = models.CharField(max_length=255, blank=True, null=True)
    Количество = models.IntegerField(blank=True, null=True)
    Сумма = models.FloatField(blank=True, null=True)
    Серийный_Номер_Связанного_Объекта = models.CharField(max_length=255, blank=True, null=True)
    Инв_Номер_Бухгалтерии_Связанного_Объекта = models.CharField(max_length=255, blank=True, null=True)
    Стоимость = models.FloatField(blank=True, null=True)
    Дата_Инвертаризации = models.DateField(blank=True, null=True)
    Тип = models.CharField(max_length=255, blank=True, null=True)
    Модель = models.CharField(max_length=255, blank=True, null=True)
    Номер_Партии = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.Название if self.Название else 'Название не указано'

    class Meta:
        verbose_name_plural = "Справочники Расходные материалы"
        ordering = ["-pk"]
    

class HandbookCompany(models.Model):
    Компания = models.CharField(max_length=255, blank=True, null=True)
    Местоположение = models.CharField(max_length=255, blank=True, null=True)
    Статус = models.CharField(max_length=255, blank=True, null=True)
    Сотрудник = models.CharField(max_length=255, blank=True, null=True)
    Сотрудник_Компания = models.CharField(max_length=255, blank=True, null=True)
    Сотрудник_Подразделение = models.CharField(max_length=255, blank=True, null=True)
    Сотрудник_Офис = models.CharField(max_length=255, blank=True, null=True)
    Сотрудник_Должность = models.CharField(max_length=255, blank=True, null=True)
    Сотрудник_Телефон = models.CharField(max_length=255, blank=True, null=True)
    Стоимость = models.FloatField(blank=True, null=True)
    Описание = models.CharField(max_length=255, blank=True, null=True)
    Поставщик = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.Компания if self.Компания else 'Компания не указана'
    
    class Meta:
        verbose_name_plural = "Справочники Компании"
        ordering = ["-pk"]