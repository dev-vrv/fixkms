import React, { useState, useEffect } from "react";
import { fetchForm } from "../../../utils/fetchData";
import MyButton from "../Button/MyButton";
import SelectField from "../Select/Select";
import Loader from "../Loader/Loader";
import "./Form.css";


const baseFieldsMap = {
    equipments: {
        admin: [
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
            "Гарантия_До"
        ],
        standard: [
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
            "Гарантия_До"
        ]
    },
    programs: {
        admin: [
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
            "Лиценизя_До"
        ],
        standard: [
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
            "Лиценизя_До"
        ]
    },
    components: {
        admin: [
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
            "Гарантия_До"
        ],
        standard: [
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
            "Гарантия_До"
        ]
    },
    consumables: {
        admin: [
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
            "Изменил"
        ],
        standard: [
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
            "Изменил"
        ]
    },
    repairs: {
        admin: [
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
            "Сервисная_Организация"
        ],
        standard: [
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
            "Сервисная_Организация"
        ]
    },
    movements: {
        admin: [
            "Номер", "Название", "Статус", "Филиал_Отправитель", "Подразделение_Отправитель_Описание",
            "Подразделение_Отправитель_Телефон", "Подразделение_Отправитель_Адрес", "Подразделение_Получатель",
            "Подразделение_Получатель_Описание", "Подразделение_Получатель_Телефон", "Подразделение_Получатель_Адрес",
            "Сотрудник_Отправитель", "Сотрудник_Отправитель_Отдел", "Сотрудник_Отправитель_Должность",
            "Сотрудник_Отправитель_Описание", "Сотрудник_Получатель", "Сотрудник_Получатель_Отдел",
            "Сотрудник_Получатель_Должность", "Сотрудник_Получатель_Описание", "Компания", "Количество",
            "Описание", "Дата_Отправки", "Пользователь_Отправитель", "Дата_Получения", "Пользователь_Получатель",
            "Дата_Изменения", "Изменил", "Дополнительные_Поля"
        ],
        standard: [
            "Номер", "Название", "Статус", "Филиал_Отправитель", "Подразделение_Отправитель_Описание",
            "Подразделение_Отправитель_Телефон", "Подразделение_Отправитель_Адрес", "Подразделение_Получатель",
            "Подразделение_Получатель_Описание", "Подразделение_Получатель_Телефон", "Подразделение_Получатель_Адрес",
            "Сотрудник_Отправитель", "Сотрудник_Отправитель_Отдел", "Сотрудник_Отправитель_Должность",
            "Сотрудник_Отправитель_Описание", "Сотрудник_Получатель", "Сотрудник_Получатель_Отдел",
            "Сотрудник_Получатель_Должность", "Сотрудник_Получатель_Описание", "Количество",
            "Описание", "Дата_Отправки", "Пользователь_Отправитель", "Дата_Получения", "Пользователь_Получатель",
            "Дата_Изменения", "Изменил", "Дополнительные_Поля"
        ]
    },
    users: {
        admin: [
            "username",
            'email',
            "password",
            "Фамилия",
            "Имя",
            "Отчество",
            "Роль",
            "Организация",
            "Подразделение",
            "Телефон"
        ],
        standard: [
            "username",
            'email',
            "password",
            "Фамилия",
            "Имя",
            "Отчество",
            "Роль",
            "Организация",
            "Подразделение",
            "Телефон"
        ]
    }
}

const handbookFieldsMap = {
    equipments: {
        admin: [
            "Производитель",
            "Тип",
            "Модель",
        ],
        standard: [
            "Производитель",
            "Тип",
            "Модель",
        ]
    },
    programs: {
        admin: [
            "Название",
            "Версия",
            "Дистрибутив",
        ],
        standard: [
            "Название",
            "Версия",
            "Дистрибутив",
        ]
    },
    components: {
        admin: [
            "Название",
            "Тип",
            "Модель",
        ],
        standard: [
            "Название",
            "Тип",
            "Модель",
        ]
    },
    consumables: {
        admin: [
            "Название",
            "Тип",
            "Модель",
        ],
        standard: [
            "Название",
            "Тип",
            "Модель",
        ]
    },
    company: {
        admin: [
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
        ],
        standard: [
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
    }
};


const fieldsTypesMap = {
    date: ["Гарантия_До", "Лиценизя_До", "Дата_Изменения", "Дата_Отправки", "Дата_Возврата", "Дата_Поломки", "Дата_Получения", "Ремонт_Дата_Изменения"],
    number: [
        "Стоимость",
        "Количество_пользователей",
        "Ремонт_Стоимость"
    ],
    tel: [
        "Сотрудник_Телефон",
        "Телефон",
    ],
    email: [
        "email"
    ]
}

const AssetFormGenerator = ({ onClose, title, asset, options, endPoint, data, method = 'post', continueButtonText = 'Добавить', isHandbook = false }) => {
    const [formData, setFormData] = useState({});
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertStatus, setAlertStatus] = useState("");
    const [userRole, setUserRole] = useState(null);
    const [formFields, setFormFields] = useState([]);

    const fieldsMap = isHandbook ? handbookFieldsMap : baseFieldsMap;

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserRole(parsedUser.role);
        }

        if (data) {
            setFormData(data);
        }
    }, [data, setFormData]);

    useEffect(() => {
        setFormFields(userRole === "admin" ? fieldsMap[asset]['admin'] : fieldsMap[asset]['standard']);
    }, [userRole, asset, fieldsMap]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => {
            if (prev[name] === value) return prev; // Исключаем лишние обновления
            return {
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            };
        });
    };

    const handleSelectChange = (name, event) => {
        const value = event.target.value;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const { status, data } = await fetchForm(endPoint, method, formData);
            if (status >= 200 && status < 300) {
                setAlertMessage("✅ Запись успешно добавлена!");
                setAlertStatus("success");
                setTimeout(() => {
                    setAlertMessage(null);
                    window.location.reload();
                }, 3000);
            } else {
                let errorMessages = [];
                if (data.detail) {
                    errorMessages.push(`<strong>Ошибка:</strong> ${data.detail}`);
                } else {
                    for (const field in data) {
                        if (Array.isArray(data[field])) {
                            errorMessages.push(`<strong>${field}</strong>: ${data[field].join(", ")}`);
                        }
                    }
                }
                setAlertMessage(errorMessages.length ? errorMessages.join("<br>").replace(/_/g, ' ') : "❌ Неизвестная ошибка.");
                setAlertStatus("error");
            }
        } catch (error) {
            setAlertMessage("❌ Ошибка при отправке запроса.");
            setAlertStatus("error");
        }
    };

    const closeAlert = () => {
        setAlertMessage(null);
    };

    if (!formFields.length) return <Loader />;

    return (
        <div className={'formContainer p-3'}>
            <h2>{title}</h2>
            {alertMessage && (
                <div className={`alertBox ${alertStatus}`}>
                    <span dangerouslySetInnerHTML={{ __html: alertMessage }}></span>
                    <MyButton className="closeAlert" onClick={closeAlert} text={"x"} />
                </div>
            )}
            <form onSubmit={(e) => e.preventDefault()} className="formObject" action={endPoint}>
                <div className="d-flex gap-2 w-100 justify-content-between">
                    <div className="d-flex gap-2">
                        <MyButton text={continueButtonText} onClick={handleSubmit} style={{ width: "fit-content" }} />
                        <MyButton text="Отмена" onClick={onClose} style={{ width: "fit-content" }} />
                    </div>
                    {data && (
                        <MyButton text="Удалить" onClick={() => {
                            fetchForm(`${endPoint}`, "delete");
                            window.location.reload();
                        }} style={{ width: "fit-content" }} className="table-danger" />
                    )}
                </div>
                {formFields.map((name) => (
                    <div key={name} className="d-flex flex-column gap-1">
                        <label className="p-1 text-capitalize">
                            {name.replace(/_/g, " ").replace("id", "ID").replace("username", "Логин").replace("email", "Почта").replace("password", "Пароль")}
                        </label>
                        {options && options[name] ? (
                            <SelectField
                                name={name}
                                options={options[name]}
                                value={formData[name] || data?.[name] || ""} // Добавил data?.[name]
                                onChange={(event) => handleSelectChange(name, event)}
                            />
                        ) : (
                            <input
                                type={
                                    fieldsTypesMap.date.includes(name)
                                        ? "date"
                                        : fieldsTypesMap.number.includes(name)
                                            ? "number"
                                            : fieldsTypesMap.tel.includes(name)
                                                ? "tel"
                                                : fieldsTypesMap.email.includes(name)
                                                    ? "email"
                                                    : name === "password"
                                                        ? "password"
                                                        : "text"
                                }
                                name={name}
                                value={formData[name] || data?.[name] || ""}
                                onChange={handleChange}
                                className="form-control"
                            />
                        )}
                    </div>
                ))}
            </form>
        </div>
    );
};

export default AssetFormGenerator;
