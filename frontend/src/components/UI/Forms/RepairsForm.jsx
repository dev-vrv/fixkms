import React, { useState, useEffect } from "react";
import Button from "../Button/MyButton";
import { fetchForm } from "../../../utils/fetchData";  // Используем fetchForm
import "./Form.css";

const RepairsForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    Сотрудник: "", 
    Номер: "", 
    Дата_Поломки: "",
    Дата_Отправки: "", 
    Дата_Возврата: "", 
    Описание_Неисправности: "", 
    Ремонт_Примечания: "", 
    Ремонт_Сервисная_Организация: "", 
    Ремонт_Стоимость: "", Создал: "", 
    Отправил: "", 
    Принял: "", 
    Ремонт_Дата_Изменения: "", 
    Ремонт_Изменил: "", 
    Вид_Учётных_Единиц: "", 
    ID_Объекта: "", 
    Подразделение: "", 
    Сервисная_Организация: ""
  });

  const [alertMessage, setAlertMessage] = useState(null);
  const [alertStatus, setAlertStatus] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Получаем данные из localStorage
    const role = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).role : null;
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).username : null;
    setUser(user);  // Сохраняем пользователя в состоянии
    setUserRole(role);  // Сохраняем роль в состоянии
  }, []);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, Сотрудник: user }));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const { status, data } = await fetchForm("assets/repairs", "post", formData);  // Используем fetchForm

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
    "Сотрудник", "Номер", "Дата_Поломки", "Дата_Отправки", "Дата_Возврата", "Описание_Неисправности", 
    "Ремонт_Примечания", "Ремонт_Сервисная_Организация", "Ремонт_Стоимость", "Создал", 
    "Отправил", "Принял", "Ремонт_Дата_Изменения", "Ремонт_Изменил", "Вид_Учётных_Единиц", 
    "ID_Объекта", "Подразделение", "Сервисная_Организация"
  ];

  // Поля, доступные для обычного сотрудника
  const standardFields = [
    "Сотрудник", "Номер", "Дата_Поломки", "Дата_Отправки", "Дата_Возврата", "Описание_Неисправности", 
    "Ремонт_Примечания", "Ремонт_Сервисная_Организация", "Ремонт_Стоимость", "Создал", 
    "Отправил", "Принял", "Ремонт_Дата_Изменения", "Ремонт_Изменил", "Вид_Учётных_Единиц", 
    "ID_Объекта", "Подразделение", "Сервисная_Организация"
  ];

  // Выбираем поля для отображения в зависимости от роли пользователя
  const formFields = userRole === "admin" ? adminFields : standardFields;

  return (
    <div className={'formContainer p-3'}>
      <h2>Добавить ремонт</h2>

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
              type={name === "Ремонт_Стоимость" ? "number" : "text"}
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

export default RepairsForm;
