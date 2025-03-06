import React, { useState, useEffect } from "react";
import Button from "../Button/MyButton";
import { fetchForm } from "../../../utils/fetchData";
import "./Form.css";

const UserForm = ({ onClose }) => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        Фамилия: "",
        Имя: "",
        Отчество: "",
        Роль: "user",
        Организация: "",
        Подразделение: "",
        Телефон: "",
    });

    const [alertMessage, setAlertMessage] = useState(null);
    const [alertStatus, setAlertStatus] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const { status, data } = await fetchForm("auth/users/create", "post", formData);

            if (status >= 200 && status < 300) {
                setAlertMessage("✅ Пользователь успешно добавлен!");
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

    const fields = ["username",  'email', "password", "Фамилия", "Имя",  "Отчество", "Роль",  "Организация", "Подразделение", "Телефон"];

    return (
        <div className={'formContainer p-3'}>
            <h2>Добавить пользователя</h2>

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

                {fields.map((name) => (
                    <div key={name} className="d-flex flex-column gap-1">
                        <label className="p-1 text-capitalize">{name === 'username' ?  'Логин' : name === 'password' ? 'Пароль' : name === 'email'? 'Почта' : name.replace(/_/g, " ")}</label>
                        {name === "Роль" ? (
                            <select name={name} value={formData[name]} onChange={handleChange} className="form-control">
                                <option value="admin">Администратор</option>
                                <option value="manager">Менеджер</option>
                                <option value="user">Пользователь</option>
                            </select>
                        ) : (
                            <input
                                type={
                                    name === "password" ? "password" :
                                        name === "Телефон" ? "tel" :
                                            name === "email" ? "email" :
                                                "text"
                                }
                                name={name}
                                value={formData[name] || ''}
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

export default UserForm;
