import React, { useState, useEffect } from "react";
import { fetchForm } from "../../../utils/fetchData";
import MyButton from "../Button/MyButton";
import SelectInput from "../Select/Select";
import Loader from "../Loader/Loader";
import "./Form.css";


// const baseFieldsMap = {
//     equipments: {
//         admin: [
//             "Компания",
//             "Местоположение",
//             "Статус",
//             "Производитель",
//             "Тип",
//             "Модель",
//             "Серийный_Номер",
//             "Инв_Номер_Бухгалтерии",
//             "Стоимость",
//             "Сотрудник",
//             "Сотрудник_Логин",
//             "Сотрудник_Компания",
//             "Сотрудник_Подразделение",
//             "Сотрудник_Офис",
//             "Сотрудник_Должность",
//             "Сотрудник_Телефон",
//             "Примечания",
//             "Гарантия_До"
//         ],
//         standard: [
//             "Местоположение",
//             "Статус",
//             "Производитель",
//             "Тип",
//             "Модель",
//             "Серийный_Номер",
//             "Инв_Номер_Бухгалтерии",
//             "Стоимость",
//             "Сотрудник",
//             "Сотрудник_Логин",
//             "Сотрудник_Компания",
//             "Сотрудник_Подразделение",
//             "Сотрудник_Офис",
//             "Сотрудник_Должность",
//             "Сотрудник_Телефон",
//             "Примечания",
//             "Гарантия_До"
//         ]
//     },
//     programs: {
//         admin: [
//             "Компания",
//             "Местоположение",
//             "Статус",
//             "Производитель",
//             "Название",
//             "Версия",
//             "Серийный_Номер",
//             "Инв_Номер_Бухгалтерии",
//             "Ключ_Продукта",
//             "Код_Активации",
//             "Количество_пользователей",
//             "Стоимость",
//             "Сотрудник",
//             "Сотрудник_Логин",
//             "Сотрудник_Компания",
//             "Сотрудник_Подразделение",
//             "Сотрудник_Офис",
//             "Сотрудник_Должность",
//             "Сотрудник_Телефон",
//             "Примечания",
//             "Лиценизя_До"
//         ],
//         standard: [
//             "Компания",
//             "Местоположение",
//             "Статус",
//             "Производитель",
//             "Название",
//             "Версия",
//             "Серийный_Номер",
//             "Инв_Номер_Бухгалтерии",
//             "Ключ_Продукта",
//             "Код_Активации",
//             "Количество_пользователей",
//             "Стоимость",
//             "Сотрудник",
//             "Сотрудник_Логин",
//             "Сотрудник_Компания",
//             "Сотрудник_Подразделение",
//             "Сотрудник_Офис",
//             "Сотрудник_Должность",
//             "Сотрудник_Телефон",
//             "Примечания",
//             "Лиценизя_До"
//         ]
//     },
//     components: {
//         admin: [
//             "Компания",
//             "Местоположение",
//             "Статус",
//             "Производитель",
//             "Тип",
//             "Модель",
//             "Серийный_Номер",
//             "Инв_Номер_Бухгалтерии",
//             "Стоимость",
//             "Сотрудник",
//             "Сотрудник_Логин",
//             "Сотрудник_Компания",
//             "Сотрудник_Подразделение",
//             "Сотрудник_Офис",
//             "Сотрудник_Должность",
//             "Сотрудник_Телефон",
//             "Примечания",
//             "Дата_Изменения",
//             "Изменил",
//             "Гарантия_До"
//         ],
//         standard: [
//             "Местоположение",
//             "Статус",
//             "Производитель",
//             "Тип",
//             "Модель",
//             "Серийный_Номер",
//             "Инв_Номер_Бухгалтерии",
//             "Стоимость",
//             "Сотрудник",
//             "Сотрудник_Логин",
//             "Сотрудник_Компания",
//             "Сотрудник_Подразделение",
//             "Сотрудник_Офис",
//             "Сотрудник_Должность",
//             "Сотрудник_Телефон",
//             "Примечания",
//             "Дата_Изменения",
//             "Изменил",
//             "Гарантия_До"
//         ]
//     },
//     consumables: {
//         admin: [
//             "Компания",
//             "Местоположение",
//             "Статус",
//             "Производитель",
//             "Тип",
//             "Модель",
//             "Серийный_Номер",
//             "Инв_Номер_Бухгалтерии",
//             "Стоимость",
//             "Сотрудник",
//             "Сотрудник_Логин",
//             "Сотрудник_Компания",
//             "Сотрудник_Подразделение",
//             "Сотрудник_Офис",
//             "Сотрудник_Должность",
//             "Сотрудник_Телефон",
//             "Примечания",
//             "Дата_Изменения",
//             "Изменил"
//         ],
//         standard: [
//             "Местоположение",
//             "Статус",
//             "Производитель",
//             "Тип",
//             "Модель",
//             "Серийный_Номер",
//             "Инв_Номер_Бухгалтерии",
//             "Стоимость",
//             "Сотрудник",
//             "Сотрудник_Логин",
//             "Сотрудник_Компания",
//             "Сотрудник_Подразделение",
//             "Сотрудник_Офис",
//             "Сотрудник_Должность",
//             "Сотрудник_Телефон",
//             "Примечания",
//             "Дата_Изменения",
//             "Изменил"
//         ]
//     },
//     repairs: {
//         admin: [
//             "Сотрудник",
//             "Сотрудник_Логин",
//             "Дата_Поломки",
//             "Дата_Отправки",
//             "Дата_Возврата",
//             "Описание_Неисправности",
//             "Ремонт_Сервисная_Организация",
//             "Ремонт_Стоимость",
//             "Создал",
//             "Отправил",
//             "Принял",
//             "Ремонт_Дата_Изменения",
//             "Ремонт_Изменил",
//             "Вид_Учётных_Единиц",
//             "ID_Объекта",
//             "Подразделение",
//             "Сервисная_Организация"
//         ],
//         standard: [
//             "Сотрудник",
//             "Сотрудник_Логин",
//             "Дата_Поломки",
//             "Дата_Отправки",
//             "Дата_Возврата",
//             "Описание_Неисправности",
//             "Ремонт_Сервисная_Организация",
//             "Ремонт_Стоимость",
//             "Создал",
//             "Отправил",
//             "Принял",
//             "Ремонт_Дата_Изменения",
//             "Ремонт_Изменил",
//             "Вид_Учётных_Единиц",
//             "ID_Объекта",
//             "Подразделение",
//             "Сервисная_Организация"
//         ]
//     },
//     movements: {
//         admin: [
//             "Номер", "Название", "Статус", "Филиал_Отправитель", "Подразделение_Отправитель_Описание",
//             "Подразделение_Отправитель_Телефон", "Подразделение_Отправитель_Адрес", "Подразделение_Получатель",
//             "Подразделение_Получатель_Описание", "Подразделение_Получатель_Телефон", "Подразделение_Получатель_Адрес",
//             "Сотрудник_Отправитель", "Сотрудник_Отправитель_Отдел", "Сотрудник_Отправитель_Должность",
//             "Сотрудник_Отправитель_Описание", "Сотрудник_Получатель", "Сотрудник_Получатель_Отдел",
//             "Сотрудник_Получатель_Должность", "Сотрудник_Получатель_Описание", "Компания", "Количество",
//             "Описание", "Дата_Отправки", "Пользователь_Отправитель", "Дата_Получения", "Пользователь_Получатель",
//             "Дата_Изменения", "Изменил", "Дополнительные_Поля"
//         ],
//         standard: [
//             "Номер", "Название", "Статус", "Филиал_Отправитель", "Подразделение_Отправитель_Описание",
//             "Подразделение_Отправитель_Телефон", "Подразделение_Отправитель_Адрес", "Подразделение_Получатель",
//             "Подразделение_Получатель_Описание", "Подразделение_Получатель_Телефон", "Подразделение_Получатель_Адрес",
//             "Сотрудник_Отправитель", "Сотрудник_Отправитель_Отдел", "Сотрудник_Отправитель_Должность",
//             "Сотрудник_Отправитель_Описание", "Сотрудник_Получатель", "Сотрудник_Получатель_Отдел",
//             "Сотрудник_Получатель_Должность", "Сотрудник_Получатель_Описание", "Количество",
//             "Описание", "Дата_Отправки", "Пользователь_Отправитель", "Дата_Получения", "Пользователь_Получатель",
//             "Дата_Изменения", "Изменил", "Дополнительные_Поля"
//         ]
//     },
//     users: {
//         admin: [
//             "username",
//             'email',
//             "password",
//             "Фамилия",
//             "Имя",
//             "Отчество",
//             "Роль",
//             "Организация",
//             "Подразделение",
//             "Телефон"
//         ],
//         standard: [
//             "username",
//             'email',
//             "password",
//             "Фамилия",
//             "Имя",
//             "Отчество",
//             "Роль",
//             "Организация",
//             "Подразделение",
//             "Телефон"
//         ]
//     }
// }

// const handbookFieldsMap = {
//     equipments: {
//         admin: [
//             "Производитель",
//             "Тип",
//             "Модель",
//         ],
//         standard: [
//             "Производитель",
//             "Тип",
//             "Модель",
//         ]
//     },
//     programs: {
//         admin: [
//             "Название",
//             "Версия",
//             "Дистрибутив",
//         ],
//         standard: [
//             "Название",
//             "Версия",
//             "Дистрибутив",
//         ]
//     },
//     components: {
//         admin: [
//             "Название",
//             "Тип",
//             "Модель",
//         ],
//         standard: [
//             "Название",
//             "Тип",
//             "Модель",
//         ]
//     },
//     consumables: {
//         admin: [
//             "Название",
//             "Тип",
//             "Модель",
//         ],
//         standard: [
//             "Название",
//             "Тип",
//             "Модель",
//         ]
//     },
//     company: {
//         admin: [
//             "Компания",
//             "Местоположение",
//             "Статус",
//             "Сотрудник",
//             "Сотрудник_Компания",
//             "Сотрудник_Подразделение",
//             "Сотрудник_Офис",
//             "Сотрудник_Должность",
//             "Сотрудник_Телефон",
//             "Поставщик"
//         ],
//         standard: [
//             "Компания",
//             "Местоположение",
//             "Статус",
//             "Сотрудник",
//             "Сотрудник_Компания",
//             "Сотрудник_Подразделение",
//             "Сотрудник_Офис",
//             "Сотрудник_Должность",
//             "Сотрудник_Телефон",
//             "Поставщик"
//         ]
//     }
// };

// const getModelsByType = (obj, type) => {
//     const result = [];
//     Object.keys(obj).forEach((key) => {
//         if (obj[key].Тип === type) {
//             result.push(obj[key].Модель);
//         }
//     });
//     return result;
// }

// const getFieldTypesByCompany = (arr, companyName) => {
//     const result = {};
//     arr.forEach((company) => {
//         if (company.Компания === companyName) {
//             const kyes = Object.keys(company);
//             kyes.forEach((key) => {
//                 if (!result[key]) {
//                     result[key] = [];
//                 }
//                 result[key].push(company[key]);
//             });
//         }
//     });
//     result['Сотрудник_Логин'] = result['Сотрудник'];
//     return result;
// };


// const fieldsTypesMap = {
//     date: [
//         "Гарантия_До", "Лиценизя_До", "Дата_Изменения", "Дата_Отправки", "Дата_Возврата", "Дата_Поломки", "Дата_Получения", "Ремонт_Дата_Изменения"
//     ],
//     number: [
//         "Стоимость",
//         "Количество_пользователей",
//         "Ремонт_Стоимость"
//     ],
//     tel: [
//         "Сотрудник_Телефон",
//         "Телефон",
//     ],
//     email: [
//         "email"
//     ]
// }

// const AssetFormGenerator = ({ onClose, title, asset, options, endPoint, data, method = 'post', continueButtonText = 'Добавить', isHandbook = false, assetsData=null }) => {
//     const [formData, setFormData] = useState({});
//     const [alertMessage, setAlertMessage] = useState(null);
//     const [alertStatus, setAlertStatus] = useState("");
//     const [userRole, setUserRole] = useState(null);
//     const [formFields, setFormFields] = useState([]);
//     const [modelOptions, setModelOptions] = useState(null);
//     const [companyOptions, setCompanyOptions] = useState({});
//     const fieldsMap = isHandbook ? handbookFieldsMap : baseFieldsMap;
//     useEffect(() => {
//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//             const parsedUser = JSON.parse(storedUser);
//             setUserRole(parsedUser.role);
//         }
//     }, [data]);


//     useEffect(() => {
//         setFormFields(userRole === "admin" ? fieldsMap[asset]['admin'] : fieldsMap[asset]['standard']);
//     }, [userRole, asset, fieldsMap]);

//     useEffect(() => {
//         if (assetsData) {
//             const d = assetsData[asset].filter((item) => item.id === data.id)[0];
//             setFormData(d);
//         }
//     }, [assetsData, setFormData, asset, data]);

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData((prev) => {
//             if (prev[name] === value) return prev; // Исключаем лишние обновления
//             return {
//                 ...prev,
//                 [name]: type === "checkbox" ? checked : value,
//             };
//         });
//     };

//     const handleSelectChange = (name, event) => {
//         const value = event.target.value;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     const handleSubmit = async () => {
//         try {
//             const { status, data } = await fetchForm(endPoint, method, formData);
//             if (status >= 200 && status < 300) {
//                 setAlertMessage("✅ Запись успешно добавлена!");
//                 setAlertStatus("success");
//                 setTimeout(() => {
//                     setAlertMessage(null);
//                     window.location.reload();
//                 }, 3000);
//             } else {
//                 let errorMessages = [];
//                 if (data.detail) {
//                     errorMessages.push(`<strong>Ошибка:</strong> ${data.detail}`);
//                 } else {
//                     for (const field in data) {
//                         if (Array.isArray(data[field])) {
//                             errorMessages.push(`<strong>${field}</strong>: ${data[field].join(", ")}`);
//                         }
//                     }
//                 }
//                 setAlertMessage(errorMessages.length ? errorMessages.join("<br>").replace(/_/g, ' ') : "❌ Неизвестная ошибка.");
//                 setAlertStatus("error");
//             }
//         } catch (error) {
//             setAlertMessage("❌ Ошибка при отправке запроса.");
//             setAlertStatus("error");
//         }
//     };

//     const closeAlert = () => {
//         setAlertMessage(null);
//     };

//     const handleTypeChange = (event) => {
//         if (event.target.value && event.target.value !== "") {
//             setModelOptions(getModelsByType(data['handbooks'][asset], event.target.value));
//         }
//         else {
//             setModelOptions([]);
//         }
//     };

//     const handleCompanyChange = (event, name) => {
//         if (event.target.value && event.target.value !== "") {   
//             const d = assetsData ? assetsData : data;
//             setCompanyOptions(getFieldTypesByCompany(d['handbooks']['company'], event.target.value));
//         }
//         else {
//             setCompanyOptions({});
//         }
//     };

//     if (!formFields.length) return <Loader />;

//     return (
//         <div className={'formContainer p-3'}>
//             <h2>{title}</h2>
//             {alertMessage && (
//                 <div className={`alertBox ${alertStatus}`}>
//                     <span dangerouslySetInnerHTML={{ __html: alertMessage }}></span>
//                     <MyButton className="closeAlert" onClick={closeAlert} text={"x"} />
//                 </div>
//             )}
//             <form onSubmit={(e) => e.preventDefault()} className="formObject" action={endPoint}>
//                 <div className="d-flex gap-2 w-100 justify-content-between">
//                     <div className="d-flex gap-2 flex-wrap">
//                         <MyButton text={continueButtonText} onClick={handleSubmit} style={{ width: "fit-content" }} />
//                         <MyButton text="Отмена" onClick={onClose} style={{ width: "fit-content" }} />
//                     </div>
//                     {data && (
//                         <MyButton text="Удалить" onClick={() => {
//                             fetchForm(`${endPoint}`, "delete");
//                             window.location.reload();
//                         }} style={{ width: "fit-content" }} className="table-danger" />
//                     )}
//                 </div>
//                 {formFields.map((name) => (
//                     <div key={name} className="d-flex flex-column gap-1">
//                         <label className="p-1 text-capitalize">
//                             {name.replace(/_/g, " ").replace("id", "ID").replace("username", "Логин").replace("email", "Почта").replace("password", "Пароль")}
//                         </label>
//                         {!isHandbook && options && options[name] && name !== "Модель" && !['Офис'].includes(name) && !name.includes('Сотрудник') ? (
//                             <SelectInput
//                                 name={name}
//                                 options={options[name]}
//                                 value={formData[name] || data?.[name] || ""}
//                                 onChange={(event) => {
//                                     handleSelectChange(name, event);
//                                     if (name === "Тип") {
//                                         handleTypeChange(event);
//                                     }
//                                     else if ("Компания") {
//                                         handleCompanyChange(event, name);
//                                     }
//                                 }}
//                             />
//                         ) : !isHandbook && options && options[name] && name === "Модель" ? (
//                             <SelectInput
//                                 name={name}
//                                 options={!modelOptions?.length ? [] : modelOptions}
//                                 labelText={`${!modelOptions?.length ? "Сперва выберите тип" : "Выберите модель"}`}
//                                 value={formData[name] || data?.[name] || ""}
//                                 className={`${!modelOptions?.length ? "disabled" : ""}`}
//                                 onChange={(event) => {
//                                     handleSelectChange(name, event);
//                                 }}
//                             />
//                         ) : !isHandbook && options?.[name] && (['Офис'].includes(name) || name.includes('Сотрудник'))
//                         ? (
//                             <SelectInput
//                                 name={name}
//                                 options={companyOptions[name] || []}
//                                 labelText={`${!Object.keys(companyOptions).length ? "Сперва выберите компанию" : `Выберите ${name.replace(/_/g, " ")}`}`}
//                                 value={formData[name] || data?.[name] || ""}
//                                 className={`${!Object.keys(companyOptions).length ? "disabled" : ""}`}
//                                 onChange={(event) => {
//                                     handleSelectChange(name, event);
//                                 }}
//                             />
//                         ) : (
//                             <input
//                                 type={
//                                     fieldsTypesMap.date.includes(name)
//                                         ? "date"
//                                         : fieldsTypesMap.number.includes(name)
//                                             ? "number"
//                                             : fieldsTypesMap.tel.includes(name)
//                                                 ? "tel"
//                                                 : fieldsTypesMap.email.includes(name)
//                                                     ? "email"
//                                                     : name === "password"
//                                                         ? "password"
//                                                         : "text"
//                                 }
//                                 name={name}
//                                 value={formData[name] || data?.[name] || ""}
//                                 onChange={handleChange}
//                                 className="form-control"
//                             />
//                         )}
//                     </div>
//                 ))}
//             </form>
//         </div>
//     );
// };

// export default AssetFormGenerator;


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
        "Название",
        "Тип",
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
        Тип: ['Производитель'],
        Производитель: ['Модель'],
        Компания: ['Сотрудник', 'Сотрудник_Логин', 'Сотрудник_Компания', 'Сотрудник_Подразделение', 'Сотрудник_Офис', 'Сотрудник_Должность', 'Сотрудник_Телефон']
    },
    programs: {
        Производитель: ['Модель', 'Название'],
        Название: ['Версия'],
        Компания: ['Сотрудник', 'Сотрудник_Логин', 'Сотрудник_Компания', 'Сотрудник_Подразделение', 'Сотрудник_Офис', 'Сотрудник_Должность', 'Сотрудник_Телефон']
    }
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

const getBlockingField = (field, formData, asset) => {
    const relationsFieldsMaps = relationsMaps[asset] || relationsMaps.default;

    for (const [parent, children] of Object.entries(relationsFieldsMaps)) {
        if (children.includes(field)) {
            if (parent === "Категория" && field === 'Название' && asset === 'programs') {
                return null;
            }
            if (!formData[parent] || formData[parent] === '') {
                return parent;
            }
            return getBlockingField(parent, formData, asset);
        }
    }
    return null;
};



const SelectField = ({ name, options, onChange, defaultValue, fullData, formData, asset }) => {
    const [disabled, setDisabled] = useState(false);
    const [relationOptions, setRelationOptions] = useState(null);
    const [defaultText, setDefaultText] = useState('Выберите значение');

    const relationsFieldsMaps = relationsMaps[asset] || relationsMaps.default;

    useEffect(() => {
        const blockingField = getBlockingField(name, formData, asset);

        if (blockingField) {
            setDisabled(true);
            setDefaultText(`Сначала заполните поле - ${blockingField.replace(/_/g, " ")}`);
        } else {
            setDisabled(false);
            setDefaultText('Выберите значение');
        }

        const optionsFromRelation = [];
        let shouldDisable = false;

        Object.entries(relationsFieldsMaps).forEach(([key, values]) => {
            if (values.includes(name)) {
                if (!formData[key] || formData[key] === '') {
                    shouldDisable = true;
                    setDefaultText(`Сначала заполните поле - ${key.replace(/_/g, " ")}`);
                    return;
                } else {
                    setDefaultText('Выберите значение');
                }

                if (key !== 'Компания' && !relationsFieldsMaps['Компания'].includes(name)) {
                    fullData['handbooks'][asset]?.forEach((item) => {
                        if (item[key] === formData[key]) {
                            optionsFromRelation.push(item[name]);
                        }
                    });
                } else {
                    if (name === 'Сотрудник_Логин') {
                        fullData['users'].forEach((user) => {
                            if (user['Организация'] === formData['Компания']) {
                                optionsFromRelation.push(user['username']);
                            }
                        });
                    } else if (name === 'Сотрудник') {
                        fullData['users'].forEach((user) => {
                            if (user['Организация'] === formData['Компания']) {
                                optionsFromRelation.push(user['Фамилия'] ? `${user['Фамилия']} ${user['Имя']} ${user['Отчество']}` : user['username']);
                            }
                        });
                    } else {
                        fullData['handbooks']['company'].forEach((item) => {
                            if (item['Компания'] === formData['Компания'] && item[name] !== '') {
                                optionsFromRelation.push(item[name]);
                            }
                        });
                    }
                }

                setRelationOptions(optionsFromRelation);
            }
        });

        setDisabled(shouldDisable);
    }, [name, formData, fullData, asset, relationsFieldsMaps]);

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
                className={disabled ? "disabled" : ""}
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