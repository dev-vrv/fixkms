import axios from "axios";
import Cookies from "js-cookie";

export const refreshTokens = async () => {
	const refresh = Cookies.get("refresh");

	if (!refresh) return console.warn("Refresh token отсутствует!") || false;

	try {
		const { data } = await axios.post(
			"http://localhost:8000/api/auth/token/",
			{ refresh }
		);

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
			url: `http://localhost:8000/api/${url}/`,
			data,
			headers: {
				Authorization: `Bearer ${access}`,
				"Content-Type": "application/json",
			},
		});

		console.log("Успех:", response.data);

		if (response.data['user']) {
			localStorage.setItem("user", JSON.stringify(response.data['user']));
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

			if (
				fetchError === "Authentication credentials were not provided."
			) {
				console.warn("Токен истёк. Попытка обновить токен...");

				await refreshTokens();
			}
		} else {
			console.error("Ошибка сети или сервера:", error.message);
			setFetchError?.("Ошибка сети или сервера.");
		}
	}
};

export const fetchExportData = async (
	url,
	data = null,
	setFetchError = null,
	setFetchSuccess = null
  ) => {
	let access = Cookies.get("access");
  
	try {
	  const response = await axios({
		method: 'POST', // Используем POST для отправки данных
		url: `http://localhost:8000/api/${url}/`, // Предполагаем, что серверная часть ожидает запрос по такому пути
		data,
		headers: {
		  Authorization: `Bearer ${access}`,
		  "Content-Type": "application/json",
		},
		responseType: 'blob', // Указываем, что ожидаем получить файл
	  });
  
	  console.log("Успех:", response.data);
  
	  // Проверяем успешность запроса
	  if (response.status === 200) {
		// Создаем ссылку для скачивания
		const link = document.createElement('a');
		link.href = URL.createObjectURL(response.data); // Создаем URL для скачивания
		link.download = `${data.name}_export.csv`; // Имя файла для скачивания
		link.click(); // Имитируем клик для начала скачивания
  
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
		url: `http://localhost:8000/api/${url}/`,
		data,
		headers: {
		  Authorization: `Bearer ${access}`,
		  "Content-Type": "application/json",
		},
	  });
  
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
  