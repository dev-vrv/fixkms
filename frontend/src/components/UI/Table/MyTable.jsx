import React, { useState, useEffect } from "react";
import "./MyTable.css";
import MyButton from "../Button/MyButton";
import { translateAssets } from "../../../utils/assets";
import { fetchData, fetchForm } from "../../../utils/fetchData";


const SearchComponent = ({ search, setSearch }) => {
	return (
		<input
			type="text"
			placeholder="Поиск"
			value={search}
			onChange={(e) => setSearch(e.target.value)}
			className="form-control"
		/>
	);
};

const checkDateExpired = (date) => {
	const currentDate = new Date();
	const licenseEndDate = new Date(date);

	// Сравниваем даты по времени
	const timeDifference = licenseEndDate - currentDate;
	const daysRemaining = timeDifference / (1000 * 3600 * 24); // переводим миллисекунды в дни

	if (daysRemaining < 0) {
		return 'danger'; // если дата истекла
	} else if (daysRemaining < 30) {
		return 'warning'; // если осталось меньше 30 дней
	} else {
		return 'success'; // если все в порядке
	}
};

const MyTable = ({ fulldata, tabName, role }) => {
	const [editingRow, setEditingRow] = useState(null);
	const [formData, setFormData] = useState({});
	const [alertMessage, setAlertMessage] = useState(null);
	const [alertStatus, setAlertStatus] = useState("");
	const [search, setSearch] = useState("");
	const [viewData, setViewData] = useState([]);
	const [licenseStatus, setLicenseStatus] = useState(null);
	const [warningDate, setWarningDate] = useState(null);
	const [dangerDate, setDangerDate] = useState(null);

	useEffect(() => {
		setViewData(fulldata);
	}, [fulldata, setViewData]);

	useEffect(() => {
		const expired = {};
		let hasDanger = false;
		let hasWarning = false;
		fulldata.forEach((row) => {
			const date = row['Лиценизя_До'];
			if (date) {
				const status = checkDateExpired(date);
				const id = row['id'];
				expired[id] = status;

				if (status === 'danger') {
					hasDanger = true;
				}
				if (status === 'warning') {
					hasWarning = true;
				}
			}
		});
		setLicenseStatus(expired);

		if (Object.keys(expired).length > 0) {
			if (hasDanger) {
				setDangerDate("❌ Внимание! У вас есть программное обеспечение с истекшими лицензиями.");
			}
			if (hasWarning) {
				setWarningDate("⚠️ Внимание! У вас есть программное обеспечение с лицензиями, которые истекут в течение 30 дней.");
			}
		}
 
	}, [fulldata, setLicenseStatus, setWarningDate, setDangerDate]);

	if (!fulldata || fulldata.length === 0) return <p>Нет данных</p>;

	const urls = {
		components: {
			delete: `assets/components/${formData.id}`,
			update: `assets/components/${formData.id}`,
			get: 'assets/components',
		},
		consumables: {
			delete: `assets/consumables/${formData.id}`,
			update: `assets/consumables/${formData.id}`,
			get: 'assets/consumables',
		},
		equipments: {
			delete: `assets/equipments/${formData.id}`,
			update: `assets/equipments/${formData.id}`,
			get: 'assets/equipments',
		},
		movements: {
			delete: `assets/movements/${formData.id}`,
			update: `assets/movements/${formData.id}`,
			get: 'assets/movements',
		},
		programs: {
			delete: `assets/programs/${formData.id}`,
			update: `assets/programs/${formData.id}`,
			get: 'assets/programs',
		},
		repairs: {
			delete: `assets/repairs/${formData.id}`,
			update: `assets/repairs/${formData.id}`,
			get: 'assets/repairs',
		},
		users: {
			delete: `auth/users/${formData.id}`,
			update: `auth/users/${formData.id}`,
			get: 'auth/user',
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

	const handleSearch = () => {
		fetchForm(`${urls[tabName].get}/${search}`, "get", null).then((response) => {
			if (response && response.status === 200) {
				setViewData([response.data]);
			}
			else {
				alert("Ничего не найдено");
			}
		});
	};

	return (
		<div className="table-container">

			<div className="">
				{tabName === 'programs' && warningDate && <div className="alertBox warning">{warningDate}</div>}
				{tabName === 'programs' && dangerDate && <div className="alertBox error">{dangerDate}</div>}
			</div>

			<div className="d-flex gap-2 py-2">
				<SearchComponent search={search} setSearch={setSearch} />
				<MyButton text="Поиск" onClick={() => handleSearch()} style={{ width: 'fit-content' }} />
				<MyButton text="Сброс" onClick={() => {
					setSearch("");
					setViewData(fulldata);
				}} style={{ width: 'fit-content' }} />
			</div>

			<table>
				<thead>
					<tr>
						{role !== 'user' && <th>Действие</th>}
						{Object.keys(fulldata[0]).map((cell) => (
							<th key={cell}>{cell === 'username' ? 'Логин' : cell === 'date_joined' ? 'Дата регистрации' : cell.replace(/_/g, " ")}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{viewData.map((row, rowIndex) => (
						<tr key={rowIndex} className={licenseStatus && licenseStatus[row.id] ? `table-${licenseStatus[row.id]}` : ''}>
							{role !== 'user' && (
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