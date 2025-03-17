export const translateAssets = (text) => {
	switch (text) {
		case "components":
			return "Комплектующие";
		case "consumables":
			return "Расходники";
		case "equipments":
			return "Оборудование";
		case "movements":
			return "Перемещения";
		case "programs":
			return "Программы";
		case "repairs":
			return "Ремонт";
		case "users":
			return "Пользователи";
		case "handbooks":
			return "Справочники";
		case "companys":
			return "Компании";
		case "company":
			return "Компании";
		default:
			return text;
	}
};

export const translateAssetsSingle = (text) => {
	switch (text) {
		case "components":
			return "Комплектующее";
		case "consumables":
			return "Расходник";
		case "equipments":
			return "Оборудование";
		case "movements":
			return "Перемещение";
		case "programs":
			return "Программу";
		case "repairs":
			return "Ремонт";
		case "users":
			return "Пользователя";
		case "handbooks":
			return "Справочник";
		case "companys":
			return "Компанию";
		case "company":
			return "Компанию";
		default:
			return text;
	}
};