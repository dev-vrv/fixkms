import axios from "axios";
import Cookies from "js-cookie";

// const API_URL = "http://127.0.0.1:8000/api/";
const API_URL = "http://77.95.201.66:8000/api/";

export const refreshTokens = async () => {
	const refresh = Cookies.get("refresh");

	if (!refresh) return console.warn("Refresh token отсутствует!") || false;

	try {
		const { data } = await axios.post(`${API_URL}auth/token/`, { refresh });

		Cookies.set("access", data.access, {
			expires: 15 / 1440,
			// secure: true,
			sameSite: "Lax",
		});
		Cookies.set("refresh", data.refresh, {
			expires: 30,
			// secure: true,
			sameSite: "Lax",
		});

		window.location.reload();

		return true;
	} catch (err) {
		return false;
	}
};

export const fetchData = async (
	url,
	method,
	data = null,
	setResponse = null,
	setFetchError = null,
	setFetchSuccess = null
) => {
	let access = Cookies.get("access");

	try {
		const response = await axios({
			method,
			url: `${API_URL}${url}/`,
			data,
			headers: {
				Authorization: `Bearer ${access}`,
				"Content-Type": "application/json",
			},
		});

		console.log("Успех:", response.data);

		if (response.data["user"]) {
			localStorage.setItem("user", JSON.stringify(response.data["user"]));
		}

		if (response.data.access && response.data.refresh) {
			Cookies.set("access", response.data.access, {
				expires: 15 / 1440,
				// secure: true,
				sameSite: "Lax",
			});
			Cookies.set("refresh", response.data.refresh, {
				expires: 30,
				// secure: true,
				sameSite: "Lax",
			});
			window.location.reload();
		}

		setResponse?.(response.data);
		setFetchSuccess?.(response.data.message);
	} catch (error) {
		if (error.response) {
			const fetchError = error.response.data.detail;
			console.error("Ошибка ответа:", error.response.data);
			setFetchError?.(fetchError || "Ошибка сервера.");

			if (fetchError === "Authentication credentials were not provided.") {
				console.warn("Токен истёк. Попытка обновить токен...");

				await refreshTokens();
			}
		} else {
			console.error("Ошибка сети или сервера:", error.message);
			setFetchError?.("Ошибка сети или сервера.");
		}
	}
};

export const fetchImportData = async (url, file, modelName, setFetchError = null, setFetchSuccess = null) => {
	let access = Cookies.get("access");

	try {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("name", modelName);
		const response = await axios.post(`${API_URL}/${url}/`, formData, {
			headers: {
				Authorization: `Bearer ${access}`,
				"Content-Type": "multipart/form-data",
			},
		});

		if (response.status === 200 || response.status < 300) {
			setFetchSuccess?.("Данные успешно загружены!");
		}
	} catch (error) {
		const errorMessage = error.response?.data?.error || error.response?.data?.detail || "Ошибка сервера.";
		setFetchError?.(errorMessage);
		console.error("Ошибка при загрузке:", errorMessage);
	}
};

export const fetchExportData = async (url, data = null, setFetchError = null, setFetchSuccess = null, fileType = 'csv', name='export') => {
	let access = Cookies.get("access");

	try {
		const response = await axios({
			method: "POST",
			url: `${API_URL}${url}/`,
			data,
			headers: {
				Authorization: `Bearer ${access}`,
				"Content-Type": "application/json",
			},
			responseType: "blob",
		});

		console.log("Успех:", response.data);

		if (response.status === 200) {
			const link = document.createElement("a");
			let fileName = data.name || name;
			
			link.href = URL.createObjectURL(response.data);
			link.download = `${fileName}.${fileType}`;
			link.click();

			setFetchSuccess?.("Данные успешно экспортированы!");
			alert("Данные успешно экспортированы!");
		}
	} catch (error) {
		if (error.response) {
			const fetchError = error.response.data.detail;
			console.error("Ошибка ответа:", error.response.data);
			setFetchError?.(fetchError || "Ошибка сервера.");
			alert("Ошибка при экспорте данных.", error.response.data);
		} else {
			console.error("Ошибка сети или сервера:", error.message);
			setFetchError?.("Ошибка сети или сервера.");
			alert("Ошибка сети или сервера.", error.message);
		}
	}
};

export const fetchForm = async (url, method, data = null) => {
	let access = Cookies.get("access");

	try {
		const response = await axios({
			method,
			url: `${API_URL}${url}/`,
			data,
			headers: {
				Authorization: `Bearer ${access}`,
				"Content-Type": "application/json",
			},
		});

		if (response.data["user"]) {
			localStorage.setItem("user", JSON.stringify(response.data["user"]));
		}

		if (response.data.access && response.data.refresh) {
			Cookies.set("access", response.data.access, {
				expires: 15 / 1440,
				// secure: true,
				sameSite: "Lax",
			});
			Cookies.set("refresh", response.data.refresh, {
				expires: 30,
				// secure: true,
				sameSite: "Lax",
			});
			window.location.reload();
		}

		console.log("Успех:", response.data);
		return { status: response.status, data: response.data }; // ✅ Возвращаем статус и JSON
	} catch (error) {
		if (error.response) {
			console.error("Ошибка ответа:", error.response.data);
			return { status: error.response.status, data: error.response.data }; // ✅ Возвращаем ошибки API
		} else {
			console.error("Ошибка сети или сервера:", error.message);
			return { status: 500, data: { error: "Ошибка сети или сервера." } }; // Ошибка сети
		}
	}
};
