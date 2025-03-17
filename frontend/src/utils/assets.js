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

export const translateAssetsEdit = (text) => {
	switch (text) {
		case "components":
			return "Комплектующего";
		case "consumables":
			return "Расходника";
		case "equipments":
			return "Оборудования";
		case "movements":
			return "Перемещение";
		case "programs":
			return "Программы";
		case "repairs":
			return "Ремонта";
		case "users":
			return "Пользователя";
		case "handbooks":
			return "Справочник";
		case "companys":
			return "Компании";
		case "company":
			return "Компании";
		default:
			return text;
	}
};