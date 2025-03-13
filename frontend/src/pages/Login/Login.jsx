import React, { useState } from "react";
import { fetchForm } from "../../utils/fetchData";

import MyInput from "../../components/UI/Input/MyInput";
import MyButton from "../../components/UI/Button/MyButton";

import classes from "../Page.module.css";
import cls from "./Login.module.css";

const Login = () => {
	const [values, setValues] = useState({});
	const [alert, setAlert] = useState(null);

	const handleChange = (event, field) => {
		setValues((prevValues) => ({
			...prevValues,
			[field]: event.target.value,
		}));
	};

	const handleLogin = () => {

		if (!values.username || !values.password) {
			setAlert("Поле логин и пароль обязательны для заполнения!");
			return;
		}

		else {
			fetchForm("auth/login", "post", values).then((response) => {
				if (response.status !== 200) {
					setAlert(response.data.message || response.data.detail || 'Логин или пароль неверны!');
				}
			});
	
		}
	};

	return (
		<div className={cls.login}>
			<div className={classes.fields} style={{ width: "320px" }}>
				{alert && <div className={`alertBox error w-100`}>{alert}</div>}
				<h1 className={classes.title}>Вход</h1>

				<MyInput
					type="text"
					placeholder="Введите логин"
					onChange={(event) => handleChange(event, "username")}
					className="w-100"
				/>
				<MyInput
					type="password"
					placeholder="Введите пароль"
					onChange={(event) => handleChange(event, "password")}
					className="w-100"
				/>

				<MyButton
					text="Войти"
					onClick={() => handleLogin()}
				/>
			</div>
		</div>
	);
};

export default Login;
