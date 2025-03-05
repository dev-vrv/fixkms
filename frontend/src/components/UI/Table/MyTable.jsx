import React, { useState } from "react";
import "./MyTable.css";
import MyButton from "../Button/MyButton";
import { translateAssets } from "../../../utils/assets";
import { fetchData, fetchForm } from "../../../utils/fetchData";

const MyTable = ({ fulldata, tabName, role }) => {
	const [editingRow, setEditingRow] = useState(null);
	const [formData, setFormData] = useState({});
	const [alertMessage, setAlertMessage] = useState(null);
	const [alertStatus, setAlertStatus] = useState("");


	if (!fulldata || fulldata.length === 0) return <p>Нет данных</p>;

	const urls = {
		components: {
			delete: `assets/components/${formData.id}`,
			update: `assets/components/${formData.id}`,
		},
		consumables: {
			delete: `assets/consumables/${formData.id}`,
			update: `assets/consumables/${formData.id}`,
		},
		equipments: {
			delete: `assets/equipments/${formData.id}`,
			update: `assets/equipments/${formData.id}`,
		},
		movements: {
			delete: `assets/movements/${formData.id}`,
			update: `assets/movements/${formData.id}`,
		},
		programs: {
			delete: `assets/programs/${formData.id}`,
			update: `assets/programs/${formData.id}`,
		},
		repairs: {
			delete: `assets/repairs/${formData.id}`,
			update: `assets/repairs/${formData.id}`,
		},
		users: {
			delete: `auth/users/${formData.id}`,
			update: `auth/users/${formData.id}`,
		},
	}

	const data = Object.keys(fulldata[0]).filter((key) => key !== "id" && key !== "date_joined");
	const handleEditClick = (row) => {
		setEditingRow(row);
		setFormData(row);
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSave = async () => {
		try {
			const response = await fetchForm(urls[tabName].update, "put", formData);

			if (response.status >= 200 && response.status < 300) {
				setAlertMessage("✅ Запись успешно обновлена!");
				setAlertStatus("success");

				setTimeout(() => {
					window.location.reload();
				}, 3000);
			} else {
				let errorMessages = [];
				if (response.data.detail) {
					errorMessages.push(`<strong>Ошибка:</strong> ${response.data.detail}`);
				} else {
					for (const field in response.data) {
						if (Array.isArray(response.data[field])) {
							errorMessages.push(`<strong>${field}</strong>: ${response.data[field].join(", ")}`);
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

	const handleDelete = async () => {
		try {
			const response = await fetchData(urls[tabName].delete, "delete");
			if (!response) {
				setAlertMessage("✅ Запись успешно удалена!");
				setAlertStatus("success");
				setTimeout(() => {
					window.location.reload();
				}, 3000);
			} else {
				setAlertMessage("❌ Неизвестная ошибка.");
				setAlertStatus("error");
			}
		} catch (error) {
			setAlertMessage("❌ Ошибка при отправке запроса.");
			setAlertStatus("error");
		}
	};

	return (
		<div className="table-container">
			<table>
				<thead>
					<tr>
						{role === 'admin' && <th>Действие</th>}
						{Object.keys(fulldata[0]).map((cell) => (
							<th key={cell}>{cell.replace(/_/g, " ")}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{fulldata.map((row, rowIndex) => (
						<tr key={rowIndex}>
							{role === 'admin' && (
								<td>
									<MyButton
										text="Изменить"
										style={{ width: "100%", cursor: "pointer" }}
										onClick={() => handleEditClick(row)}
									/>
								</td>
							)}
							{Object.keys(fulldata[0]).map((cell) => (
								<td key={cell + rowIndex}>{row[cell]}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>

			{editingRow && (
				<div className="p-3 border rounded form-container d-flex flex-column gap-3">
					<div className="d-flex gap-3 w-100 align-items-center justify-content-between">
						<h3>Редактирование {translateAssets(tabName)} ID: {formData.id}</h3>
						<MyButton text="Удалить запись" onClick={() => handleDelete()} style={{ backgroundColor: '#f8d7da', width: 'fit-content' }} />
					</div>
					<div className="d-flex gap-2">
						<MyButton text="Сохранить" onClick={handleSave} style={{ width: 'fit-content' }} />
						<MyButton text="Отмена" onClick={() => setEditingRow(null)} style={{ width: 'fit-content' }} />
					</div>
					{alertMessage && (
						<div className={`alertBox ${alertStatus}`}>
							<span dangerouslySetInnerHTML={{ __html: alertMessage }}></span>
							<button className="closeAlert" onClick={() => setAlertMessage(null)}>×</button>
						</div>
					)}
					<div className="d-flex flex-wrap gap-3">
						{data.map((field) => (
							<div key={field} className="d-flex flex-column gap-2">
								<label>{field.replace(/_/g, " ")}</label>
								{field === "Роль" ? (
									<select name={field} value={formData[field] || ""} onChange={handleChange} className="form-control">
										<option value="admin">Admin</option>
										<option value="manager">Manager</option>
										<option value="user">User</option>
									</select>
								) : (
									<input
										type={field === "password" ? "password" : field === "Телефон" ? "tel" : field === "email" ? "email" : "text"}
										name={field}
										value={formData[field] || ""}
										onChange={handleChange}
										className="form-control"
									/>
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default MyTable;