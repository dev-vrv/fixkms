import React, { useState, useEffect } from "react";
import Button from "../Button/MyButton";
import "./Form.css";
import { fetchForm } from "../../../utils/fetchData"; // Используем fetchForm

const MovementsForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    Номер: "",
    Название: "",
    Статус: "",
    Филиал_Отправитель: "",
    Подразделение_Отправитель_Описание: "",
    Подразделение_Отправитель_Телефон: "",
    Подразделение_Отправитель_Адрес: "",
    Подразделение_Получатель: "",
    Подразделение_Получатель_Описание: "",
    Подразделение_Получатель_Телефон: "",
    Подразделение_Получатель_Адрес: "",
    Сотрудник_Отправитель: "",
    Сотрудник_Отправитель_Отдел: "",
    Сотрудник_Отправитель_Должность: "",
    Сотрудник_Отправитель_Описание: "",
    Сотрудник_Получатель: "",
    Сотрудник_Получатель_Отдел: "",
    Сотрудник_Получатель_Должность: "",
    Сотрудник_Получатель_Описание: "",
    Компания: "",
    Количество: "",
    Описание: "",
    Дата_Отправки: "",
    Пользователь_Отправитель: "",
    Дата_Получения: "",
    Пользователь_Получатель: "",
    Дата_Изменения: "",
    Изменил: "",
    Дополнительные_Поля: ""
  });

  const [alertMessage, setAlertMessage] = useState(null);
  const [alertStatus, setAlertStatus] = useState("");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).role : null;
    setUserRole(role); // Сохраняем роль пользователя
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const { status, data } = await fetchForm("assets/movements", "post", formData); // Используем fetchForm

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

  // Список полей для админа
  const adminFields = [
    "Номер", "Название", "Статус", "Филиал_Отправитель", "Подразделение_Отправитель_Описание",
    "Подразделение_Отправитель_Телефон", "Подразделение_Отправитель_Адрес", "Подразделение_Получатель",
    "Подразделение_Получатель_Описание", "Подразделение_Получатель_Телефон", "Подразделение_Получатель_Адрес",
    "Сотрудник_Отправитель", "Сотрудник_Отправитель_Отдел", "Сотрудник_Отправитель_Должность",
    "Сотрудник_Отправитель_Описание", "Сотрудник_Получатель", "Сотрудник_Получатель_Отдел", 
    "Сотрудник_Получатель_Должность", "Сотрудник_Получатель_Описание", "Компания", "Количество", 
    "Описание", "Дата_Отправки", "Пользователь_Отправитель", "Дата_Получения", "Пользователь_Получатель", 
    "Дата_Изменения", "Изменил", "Дополнительные_Поля"
  ];

  // Поля, доступные для обычного сотрудника
  const standardFields = [
    "Номер", "Название", "Статус", "Филиал_Отправитель", "Подразделение_Отправитель_Описание",
    "Подразделение_Отправитель_Телефон", "Подразделение_Отправитель_Адрес", "Подразделение_Получатель",
    "Подразделение_Получатель_Описание", "Подразделение_Получатель_Телефон", "Подразделение_Получатель_Адрес",
    "Сотрудник_Отправитель", "Сотрудник_Отправитель_Отдел", "Сотрудник_Отправитель_Должность",
    "Сотрудник_Отправитель_Описание", "Сотрудник_Получатель", "Сотрудник_Получатель_Отдел", 
    "Сотрудник_Получатель_Должность", "Сотрудник_Получатель_Описание", "Количество", 
    "Описание", "Дата_Отправки", "Пользователь_Отправитель", "Дата_Получения", "Пользователь_Получатель", 
    "Дата_Изменения", "Изменил", "Дополнительные_Поля"
  ];

  // Выбираем поля для отображения в зависимости от роли пользователя
  const formFields = userRole === "admin" ? adminFields : standardFields;

  return (
    <div className={'formContainer p-3'}>
      <h2>Добавить перемещение</h2>

      {alertMessage && (
        <div className={`alertBox ${alertStatus}`}>
          <span dangerouslySetInnerHTML={{ __html: alertMessage }}></span>
          <button className="closeAlert" onClick={closeAlert}>×</button>
        </div>
      )}

      <form onSubmit={(e) => e.preventDefault()} className="formObject">

        <div className="d-flex gap-2 w-100">
          <Button text="Добавить" onClick={handleSubmit} style={{ width: "fit-content" }} />
          <Button text="Отмена" onClick={onClose} style={{ width: "fit-content" }} />
        </div>

        {formFields.map((name) => (
          <div key={name} className="d-flex flex-column gap-1">
            <label className="p-1 text-capitalize">{name.replace(/_/g, " ")}</label>
            <input
              type={name === "Количество" ? "number" : "text"}
              name={name}
              value={formData[name] || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        ))}
      </form>
    </div>
  );
};

export default MovementsForm;
