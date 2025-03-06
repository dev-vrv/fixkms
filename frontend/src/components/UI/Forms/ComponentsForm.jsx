import React, { useState, useEffect } from "react";
import Button from "../Button/MyButton";
import { fetchForm } from "../../../utils/fetchData";  // Используем fetchForm
import "./Form.css";

const ComponentsForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    Сотрудник: "",
    Местоположение: "",
    Статус: "",
    Производитель: "",
    Серийный_Номер: "",
    Инв_Номер_Бухгалтерии: "",

    Сотрудник: "",
    Сотрудник_Компания: "",
    Сотрудник_Подразделение: "",
    Сотрудник_Офис: "",

    Сотрудник_Должность: "",
    Сотрудник_Телефон: "",
    Сотрудник_Мобильный_Телефон: "",
    Сотрудник_EMail: "",

    Сотрудник_Логин: "",
    Описание: "",
    Дополнительные_Поля: "",

    Гарантия_До: "",
    Тип: "",
    Модель: "",
    Номер_Партии: "",


  });

  const [alertMessage, setAlertMessage] = useState(null);
  const [alertStatus, setAlertStatus] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Получаем данные из localStorage
    const role = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).role : null;
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).username : null;
    setUser(user);  // Сохраняем пользователя
    setUserRole(role);  // Сохраняем роль в состоянии
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, Сотрудник: user }));
    }
  }
    , [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const { status, data } = await fetchForm("assets/components", "post", formData);  // Используем fetchForm

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
    "Компания", "Местоположение", "Статус", "Производитель", "Серийный_Номер", "Инв_Номер_Бухгалтерии",
    "Сотрудник", "Сотрудник_Компания", "Сотрудник_Подразделение", "Сотрудник_Офис",
    "Сотрудник_Должность", "Сотрудник_Телефон", "Сотрудник_Мобильный_Телефон", "Сотрудник_EMail",
    "Сотрудник_Логин", "Описание", "Дополнительные_Поля",
    "Гарантия_До", "Тип", "Модель", "Номер_Партии",
  ];

  // Поля, доступные для обычного сотрудника
  const standardFields = [
    "Местоположение", "Статус", "Производитель", "Серийный_Номер", "Инв_Номер_Бухгалтерии",
    "Сотрудник", "Сотрудник_Компания", "Сотрудник_Подразделение", "Сотрудник_Офис",
    "Сотрудник_Должность", "Сотрудник_Телефон", "Сотрудник_Мобильный_Телефон", "Сотрудник_EMail",
    "Сотрудник_Логин", "Описание", "Дополнительные_Поля",
    "Гарантия_До", "Тип", "Модель", "Номер_Партии",
  ];

  // Выбираем поля для отображения в зависимости от роли пользователя
  const formFields = userRole === "admin" ? adminFields : standardFields;

  return (
    <div className={'formContainer p-3'}>
      <h2>Добавить компонент</h2>

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
              type={"text"}
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

export default ComponentsForm;
