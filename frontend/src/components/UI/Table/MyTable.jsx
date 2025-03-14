import React, { useState, useEffect } from "react";
import "./MyTable.css";
import MyButton from "../Button/MyButton";
import { translateAssets } from "../../../utils/assets";
import { fetchData, fetchForm } from "../../../utils/fetchData";
import AssetFormGenerator from "../Forms/AssetFormGenerator";

const handbooksList = ["equipments", "programs", "components", "consumables", "users"];

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

	const timeDifference = licenseEndDate - currentDate;
	const daysRemaining = timeDifference / (1000 * 3600 * 24);
	if (daysRemaining < 0) {
		return 'danger';
	} else if (daysRemaining < 30) {
		return 'warning';
	} else {
		return 'success';
	}
};

const MyTable = ({ fullData, tab, role, isHandbook }) => {
	const [editingRow, setEditingRow] = useState(null);
	const [formData, setFormData] = useState({});
	const [search, setSearch] = useState("");
	const [viewData, setViewData] = useState([]);
	const [licenseStatus, setLicenseStatus] = useState(null);
	const [warningDate, setWarningDate] = useState(null);
	const [dangerDate, setDangerDate] = useState(null);
	const [optionsData, setOptionsData] = useState(null);

	useEffect(() => {
		setOptionsData(null);
		if (editingRow && handbooksList.includes(tab)) {
			fetchData(`assets/handbooks/${tab}`, "get", null, setOptionsData);
		}
	}
		, [editingRow, setOptionsData, tab]);

	useEffect(() => {
		setViewData(fullData);
	}, [fullData, setViewData]);

	useEffect(() => {
		const expired = {};
		let hasDanger = false;
		let hasWarning = false;
		fullData.forEach((row) => {
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

	}, [fullData, setLicenseStatus, setWarningDate, setDangerDate]);

	if (!fullData || fullData.length === 0) return <p className="p-3">Нет данных</p>;

	const assetsUrls = {
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

	const handbooksUrls = {
		components: {
			delete: `assets/handbooks/components/${formData.id}`,
			update: `assets/handbooks/components/${formData.id}`,
			get: 'assets/handbooks/components',
		},
		consumables: {
			delete: `assets/handbooks/consumables/${formData.id}`,
			update: `assets/handbooks/consumables/${formData.id}`,
			get: 'assets/handbooks/consumables',
		},
		equipments: {
			delete: `assets/handbooks/equipments/${formData.id}`,
			update: `assets/handbooks/equipments/${formData.id}`,
			get: 'assets/handbooks/equipments',
		},
		programs: {
			delete: `assets/handbooks/programs/${formData.id}`,
			update: `assets/handbooks/programs/${formData.id}`,
			get: 'assets/handbooks/programs',
		},
		company: {
			delete: `assets/handbooks/company/${formData.id}`,
			update: `assets/handbooks/company/${formData.id}`,
			get: 'assets/handbooks/company',
		}
	}

	const urls = isHandbook ? handbooksUrls : assetsUrls;

	const handleEditClick = (row) => {
		setEditingRow(row);
		setFormData(row);
	};

	const handleSearch = () => {
		fetchForm(`${urls[tab].get}/${search}`, "get", null).then((response) => {
			if (response && response.status === 200) {
				setViewData([response.data]);
			}
			else {
				alert("Ничего не найдено");
			}
		});
	};

	const Table = () => {
		return (
			<table>
				<thead>
					<tr>
						{role !== 'user' && <th>Действие</th>}
						{!isHandbook && tab !== 'users' && <th>Выбрать</th>}
						{Object.keys(fullData[0]).map((cell) => (
							<th key={cell}>{cell === 'username' ? 'Логин' : cell === 'date_joined' ? 'Дата регистрации' : cell === 'email' ? 'Почта' : cell.replace(/_/g, " ")}</th>
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
							{!isHandbook && tab !== 'users' && (
								<td className="text-center">
									<input type="checkbox" data-export-select={row.id} data-export-select-asset={tab} />
								</td>
							)}
							{Object.keys(fullData[0]).map((cell) => (
								<td key={cell + rowIndex}>{row[cell]}</td>
							))}
						</tr>
					))}
				</tbody>
			</table>

		)
	};

	const Search = () => {
		return (
			<div className="d-flex gap-2 py-2 px-2">
				<SearchComponent search={search} setSearch={setSearch} />
				<MyButton text="Поиск" onClick={() => handleSearch()} style={{ width: 'fit-content' }} />
				<MyButton text="Сброс" onClick={() => {
					setSearch("");
					setViewData(fullData);
				}} style={{ width: 'fit-content' }} />
			</div>
		)
	}
	const Change = () => {
		return (
			<div className="form-container">
				<AssetFormGenerator
					onClose={() => setEditingRow(null)}
					title={`Изменение ${translateAssets(tab)} ID: ${editingRow.id}`}
					asset={tab} endPoint={urls[tab].update}
					data={editingRow}
					options={!isHandbook ? optionsData : null}
					method="put"
					continueButtonText="Сохранить изменения"
					isHandbook={isHandbook}
				/>
			</div>
		)
	}

	return (
		<div className="table-container">
			{editingRow && <Change />}
			<div className="">
				{tab === 'programs' && warningDate && <div className="alertBox warning">{warningDate}</div>}
				{tab === 'programs' && dangerDate && <div className="alertBox error">{dangerDate}</div>}
			</div>

			<Search />
			<Table />
		</div>
	);
};

export default MyTable;