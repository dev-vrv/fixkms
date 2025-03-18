import React, { useState, useEffect, useRef  } from "react";
import { fetchForm } from "../../../utils/fetchData";
import MyButton from "../Button/MyButton";
import SelectInput from "../Select/Select";

import "./Form.css";

const fieldsTypesMap = {
    date: [
        "Гарантия_До", "Лиценизя_До", "Дата_Изменения", "Дата_Отправки", "Дата_Возврата", "Дата_Поломки", "Дата_Получения", "Ремонт_Дата_Изменения"
    ],
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
    ],
    password: [
        "password"
    ]
}

const baseFieldsMap = {
    equipments: [
        "Компания",
        "Местоположение",
        "Статус",
        "Тип",
        "Производитель",
        "Модель",
        "Серийный_Номер",
        "Инв_Номер_Бухгалтерии",
        "Стоимость",
        "Сотрудник",
        "Сотрудник_Логин",
        "Сотрудник_Компания",
        "Сотрудник_Подразделение",
        "Сотрудник_Офис",
        "Сотрудник_Должность",
        "Сотрудник_Телефон",
        "Примечания",
        "Гарантия_До"
    ],
    programs: [
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
        "Сотрудник_Логин",
        "Сотрудник_Компания",
        "Сотрудник_Подразделение",
        "Сотрудник_Офис",
        "Сотрудник_Должность",
        "Сотрудник_Телефон",
        "Примечания",
        "Лиценизя_До"
    ],
    components: [
        "Компания",
        "Местоположение",
        "Статус",
        "Тип",
        "Производитель",
        "Модель",
        "Серийный_Номер",
        "Инв_Номер_Бухгалтерии",
        "Стоимость",
        "Сотрудник",
        "Сотрудник_Логин",
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
    consumables: [
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
        "Сотрудник_Логин",
        "Сотрудник_Компания",
        "Сотрудник_Подразделение",
        "Сотрудник_Офис",
        "Сотрудник_Должность",
        "Сотрудник_Телефон",
        "Примечания",
        "Дата_Изменения",
        "Изменил"
    ],
    repairs: [
        "Сотрудник",
        "Сотрудник_Логин",
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
    users: [
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
}

const handbookFieldsMap = {
    equipments: [
        "Тип",
        "Производитель",
        "Модель",
    ],
    components: [
        "Тип",
        "Производитель",
        "Модель",
    ],
    programs: [
        "Название",
        "Версия",
        "Производитель",
    ],
    consumables: [
        "Тип",
        "Производитель",
        "Модель",
    ],
    company: [
        "Компания",
        "Местоположение",
        "Статус",
        "Сотрудник",
        "Сотрудник_Компания",
        "Сотрудник_Подразделение",
        "Сотрудник_Офис",
        "Сотрудник_Должность",
        "Сотрудник_Телефон",
        "Поставщик"
    ],
};

const relationsMaps = {
    default: {
        Тип: ['Производитель', 'Модель'],
        Производитель: ['Модель'],
        Компания: ['Сотрудник', 'Сотрудник_Логин', 'Сотрудник_Компания', 'Сотрудник_Подразделение', 'Сотрудник_Офис', 'Сотрудник_Должность', 'Сотрудник_Телефон', 'Местоположение']
    },
    programs: {
        Производитель: ['Модель', 'Название'],
        Название: ['Версия'],
        Компания: ['Сотрудник', 'Сотрудник_Логин', 'Сотрудник_Компания', 'Сотрудник_Подразделение', 'Сотрудник_Офис', 'Сотрудник_Должность', 'Сотрудник_Телефон', 'Местоположение']
    }
};

const getBlockingField = (field, formData, asset, relationsFieldsMaps) => {

    for (const [parent, children] of Object.entries(relationsFieldsMaps)) {
        if (children.includes(field)) {
            if (parent === "Категория" && field === 'Название' && asset === 'programs') {
                return null;
            }
            if (!formData[parent] || formData[parent] === '') {
                return parent;
            }
            return getBlockingField(parent, formData, asset, relationsFieldsMaps);
        }
    }
    return null;
};

const BaseField = ({ name, value, onChange }) => {

    let inputType = "text";

    Object.keys(fieldsTypesMap).forEach((key) => {
        if (fieldsTypesMap[key].includes(name)) {
            inputType = key;
        }
    })

    return (
        <div className="d-flex flex-column gap-1">
            <label className="p-1 text-capitalize">
                {name.replace(/_/g, " ").replace("id", "ID").replace("username", "Логин").replace("email", "Почта").replace("password", "Пароль")}
            </label>
            <input type={inputType} className="form-control" onChange={onChange} defaultValue={value ? value : ''} name={name} />
        </div>
    )
}

const isMustBeBlocked = (key, name, formData, relationsFieldsMaps) => {
    if (!formData[key] || formData[key] === '') {
        return true;
    }

    if (Object.keys(relationsFieldsMaps).includes(key) && formData[key] === '') {
        return true;
    }
};

const initRelationsChanged = (relationsFieldsMaps, formData, prevFormData, name, setFormData) => {
    Object.entries(relationsFieldsMaps).forEach(([key, values]) => {
        if (values.includes(name) && formData[key] !== prevFormData[key]) {
            values.forEach((value) => {
                if (value === name) {
                    return;
                }
                setFormData((prev) => ({
                    ...prev,
                    [value]: '',
                }));
                console.log('changed', name, value);
            })
            return true;
        }
    });
}

const SelectField = ({ name, options, onChange, defaultValue, fullData, formData, asset, setFormData }) => {
    const [disabled, setDisabled] = useState(false);
    const [relationOptions, setRelationOptions] = useState(null);
    const [defaultText, setDefaultText] = useState('Выберите значение');
    const user = JSON.parse(localStorage.getItem("user"));
    const relationsFieldsMaps = relationsMaps[asset] || relationsMaps.default;
    const prevFormData = useRef(formData);


    useEffect(() => {
        if (user.role === "manager" && formData["Компания"] !== user.company) {
            setFormData((prev) => ({
                ...prev,
                "Компания": user.company,
            }));
        }
    }, [user, formData, setFormData]);

    useEffect(() => {
        const blockingField = getBlockingField(name, formData, asset, relationsFieldsMaps);
        if (blockingField) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }

        const optionsFromRelation = [];
        let shouldDisable = false;

        Object.entries(relationsFieldsMaps).forEach(([key, values]) => {
            if (!values.includes(name)) {
                return;
            }

            if (isMustBeBlocked(key, name, formData, relationsFieldsMaps)) {
                shouldDisable = true;
                return;
            } 
            else {
                setDefaultText('Выберите значение');
            }

            if (key !== 'Компания' && !relationsFieldsMaps['Компания']?.includes(name)) {
                fullData['handbooks'][asset]?.forEach((item) => {
                    if (item[key] === formData[key]) {
                        optionsFromRelation.push(item[name]);
                    }
                });
            } 
            else {
                if (name === 'Сотрудник_Логин') {
                    fullData['users'].forEach((user) => {
                        if (user['Организация'] === formData['Компания']) {
                            optionsFromRelation.push(user['username']);
                        }
                    });
                } 
                else if (name === 'Сотрудник') {
                    fullData['users'].forEach((user) => {
                        if (user['Организация'] === formData['Компания']) {
                            optionsFromRelation.push(user['Фамилия'] ? `${user['Фамилия']} ${user['Имя']} ${user['Отчество']}` : user['username']);
                        }
                    });
                } 
                else {
                    fullData['handbooks']['company'].forEach((item) => {
                        if (item['Компания'] === formData['Компания'] && item[name] !== '') {
                            optionsFromRelation.push(item[name]);
                        }
                    });
                }
            }
            setRelationOptions(optionsFromRelation);
        });

        setDisabled(shouldDisable);

        initRelationsChanged(relationsFieldsMaps, formData, prevFormData.current, name, setFormData)

        prevFormData.current = formData;
    }, [name, formData, fullData, asset, setFormData, relationsFieldsMaps]);


    
    return (
        <div className="d-flex flex-column gap-1">
            <label className="p-1 text-capitalize">
                {name.replace(/_/g, " ").replace("id", "ID").replace("username", "Логин").replace("email", "Почта")}
            </label>
            <SelectInput
                name={name}
                options={relationOptions ? relationOptions : options}
                onChange={onChange}
                defaultValue={defaultValue}
                disabled={disabled}
                defaultText={defaultText}
            />
        </div>
    );
};


const AssetFormGenerator = ({
    title,
    onClose,
    asset,
    options,
    endPoint,
    fullData,
    editingRow,
    isHandbook = false,
    method = 'post',
    continueButtonText = 'Добавить',
}) => {

    const [formData, setFormData] = useState(editingRow ? editingRow : {});
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertStatus, setAlertStatus] = useState("");
    const formFields = isHandbook ? handbookFieldsMap[asset] : baseFieldsMap[asset]
    const optionsFormFields = options ? options : {}
    const user = JSON.parse(localStorage.getItem("user"));
    const onlyAdminFields = ["Компания"]

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
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDelete = async () => {
        try {
            const { status, data } = await fetchForm(`${endPoint}`, "delete");
            if (status >= 200 && status < 300) {
                setAlertMessage("✅ Запись успешно удалена!");
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

    return (
        <div className="form-container p-3">
            <div className="d-flex align-items-center justify-content-between">
                <h2>{title}</h2>
                {editingRow && (
                    <MyButton text="Удалить" onClick={handleDelete} className="table-danger w-fit" />
                )}
            </div>

            {alertMessage && (
                <div className={`alertBox ${alertStatus}`}>
                    <span dangerouslySetInnerHTML={{ __html: alertMessage }}></span>
                    <MyButton text={"x"} className="closeAlert" onClick={() => setAlertMessage(null)} />
                </div>
            )}

            <form className="p-2 d-flex gap-2 flex-wrap" onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}>
                {formFields.map((name) => {
                    if (Object.keys(optionsFormFields).includes(name)) {

                        if (onlyAdminFields.includes(name) && user.role !== "admin") {
                            return null;
                        }

                        return (
                            <SelectField
                                key={name}
                                name={name}
                                options={optionsFormFields[name]}
                                onChange={(e) => handleChange(e)}
                                defaultValue={editingRow ? editingRow[name] : ''}
                                fullData={fullData}
                                formData={formData}
                                asset={asset}
                                setFormData={setFormData}
                            />
                        )
                    }
                    return <BaseField key={name} name={name} value={formData ? formData[name] : ''} onChange={(e) => handleChange(e)} />
                })}

                <div className="d-flex gap-2 w-100">
                    <MyButton text={continueButtonText} onClick={() => console.log('submit')} style={{ width: "fit-content" }} />
                    <MyButton text="Отмена" onClick={onClose} style={{ width: "fit-content" }} />
                </div>
            </form>
        </div>
    )
}

export default AssetFormGenerator;