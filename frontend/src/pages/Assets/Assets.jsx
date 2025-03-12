import React, { useEffect, useState } from "react";
import { fetchData, fetchExportData, fetchForm, fetchImportData } from "../../utils/fetchData";
import HandbooksTabs from "../../components/UI/HandbooksTabs/HandbooksTabs";
import MyButton from "../../components/UI/Button/MyButton";
import Loader from "../../components/UI/Loader/Loader";
import classes from "../Page.module.css";
import MyTable from "../../components/UI/Table/MyTable";
import AssetFormGenerator from "../../components/UI/Forms/AssetFormGenerator";
import { translateAssets } from "../../utils/assets";
import ImportForm from "../../components/UI/Forms/ImportForm";
import Cookies from "js-cookie";

const handbooksList = ["equipments", "programs", "components", "consumables"]

const ChangePassForm = ({ setShowChangePassForm }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [alert, setAlert] = useState(null);
  const [alertStatus, setAlertStatus] = useState(null);

  const handleChangePass = (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !newPassword2) {
      setAlert("Заполните все поля!");
      setAlertStatus("error");
      return;
    }
    else if (newPassword !== newPassword2) {
      setAlert("Пароли не совпадают!");
      setAlertStatus("error");
      return;
    }
    else {
      fetchForm("auth/change-password", "post", { old_password: oldPassword, new_password: newPassword }).then((response) => {
        setAlert(response.data.message || response.data.detail);
        setAlertStatus(response.status === 200 ? "success" : "error");
        if (response.status === 200) {
          setTimeout(() => {
            setShowChangePassForm(false);
            setAlert(null);
            setAlertStatus(null);
          }, 2000
          );
        }
      });
    }
  };

  return (
    <form className="form-container d-flex flex-column gap-3 p-3" onSubmit={handleChangePass}>
      {alert && <div className={`alertBox ${alertStatus}`}>
        {alert}
        <MyButton text="X" onClick={() => {
          setAlert(null);
          setAlertStatus(null);
        }} />   
      </div>}
      <div className="form-group d-flex flex-column gap-1">
        <label htmlFor="oldPassword">Старый пароль</label>
        <input
          type="password"
          className="form-control"
          id="oldPassword"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
      </div>

      <div className="form-group d-flex flex-column gap-1">
        <label htmlFor="newPassword">Новый пароль</label>
        <input
          type="password"
          className="form-control"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className="form-group d-flex flex-column gap-1">
        <label htmlFor="newPassword2">Повторите новый пароль</label>
        <input
          type="password"
          className="form-control"
          id="newPassword2"
          value={newPassword2}
          onChange={(e) => setNewPassword2(e.target.value)}
        />
      </div>

      <div className="d-flex gap-2">
        <MyButton className="w-fit" text="Отмена" onClick={() => setShowChangePassForm(false)} />
        <MyButton className="w-fit btn-danger" text="Сменить пароль" type="submit" />
      </div>
    </form>
  );
};


const AssetsActions = ({ role, tab, data, setData }) => {
  const [formVisible, setFormVisible] = useState(false);
  const [importFormVisible, setImportFormVisible] = useState(false);
  const [importAlert, setImportAlert] = useState(null);
  const [importAlertType, setImportAlertType] = useState(null);
  const [file, setFile] = useState(null);
  const [optionsData, setOptionsData] = useState(null);
  const [showChangePassForm, setShowChangePassForm] = useState(false);


  useEffect(() => {

    setOptionsData(null);
    if (formVisible && handbooksList.includes(tab)) {
      fetchData(`assets/handbooks/${tab}`, "get", null, setOptionsData);
    }
  }
    , [formVisible, setOptionsData, tab]);

  const exportData = () => {
    fetchExportData("assets/import", { name: tab });
  };

  const toggleFormVisibility = () => {
    setFormVisible((prev) => !prev);
  };

  const toggleImportFormVisibility = () => {
    setImportFormVisible((prev) => !prev);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImportSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setImportAlert("Файл не выбран!");
      setImportAlertType("error");
      return;
    }
    await fetchImportData(
      "assets/export",
      file,
      tab,
      (error) => {
        setImportAlert(error);
        setImportAlertType("error");
      },
      (success) => {
        setImportAlert(success);
        setImportAlertType("success");
        fetchData("assets", "get", null, setData);
        setTimeout(() => {
          toggleImportFormVisibility(false);
          setImportAlert(null);
          setImportAlertType(null);
        },
          2000);
      }
    );
  };

  const handleLogout = async () => {
    try {
      await fetchData("auth/logout", "post", { refresh_token: Cookies.get("refresh") });

      // Полное удаление токенов
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      Cookies.remove("access");
      Cookies.remove("refresh");

      // Перенаправляем на страницу логина
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleChangePass = () => {
    setShowChangePassForm(true);
  };


  const ActionsButtons = () => {
    return (
      <div className="d-flex gap-3 align-items-center" style={{ width: "100%", justifyContent: "space-between" }}>
        <div className="d-flex gap-3">
          <MyButton
            text="Обновить данные"
            onClick={() => {
              fetchData("assets", "get", null, setData);
              alert("Данные обновлены!");
            }}
            style={{ width: "fit-content" }}
          />
          <MyButton
            text="Добавить новую запись"
            onClick={toggleFormVisibility}
            style={{ width: "fit-content" }}
            disabled={role === "user"}
          />
          {tab !== "users" && (
            <>
              <MyButton
                text="Импортировать CSV"
                onClick={toggleImportFormVisibility}
                style={{ width: "fit-content" }}
                disabled={role === "user"}
              />
              <MyButton
                text="Экспортировать CSV"
                onClick={exportData}
                style={{ width: "fit-content" }}
              />
            </>
          )}
        </div>

        <div className="d-flex gap-2">
          <MyButton className="w-fit btn-danger" text="Сменить пароль" onClick={() => handleChangePass()} />

          <MyButton
            text={"Выйти"}
            onClick={() => handleLogout()}
            style={{ width: "fit-content" }}
            className="btn-danger"
          />

        </div>
        {showChangePassForm && <ChangePassForm showChangePassForm={showChangePassForm} setShowChangePassForm={setShowChangePassForm} />}
      </div>
    )
  };


  return (
    <>
      <div className="p-3 px-3 border-bottom d-flex justify-content-between gap-3">
        <ActionsButtons />
      </div>

      {formVisible && (
        <div className="p-3 border rounded form-container">
          {<AssetFormGenerator
            onClose={toggleFormVisibility}
            options={optionsData}
            asset={tab}
            title={`Добавить ${translateAssets(tab)}`}
            endPoint={`assets/${tab}`}
          />}
        </div>
      )}

      {importFormVisible && <div className="p-3 border rounded form-container">
        {<ImportForm
          tab={tab}
          importAlert={importAlert}
          setImportAlert={setImportAlert}
          importAlertType={importAlertType}
          setImportAlertType={setImportAlertType}
          handleImportSubmit={handleImportSubmit}
          handleFileChange={handleFileChange}
          toggleImportFormVisibility={toggleImportFormVisibility}
          visible={importFormVisible}
        />}
      </div>}
    </>
  );
};


const Assets = () => {
  const tab = window.location.pathname.split("/assets/")[1];
  const [data, setData] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    fetchData("assets", "get", null, setData);
    localStorage.getItem("user") && setRole(JSON.parse(localStorage.getItem("user")).role);
  }, []);

  return (
    <div className={classes.main + " main"}>
      {data && tab === 'handbooks' && (
        <div className="p-3">
          <HandbooksTabs data={data.handbooks} sync={() => { fetchData("assets", "get", null, setData); }} role={role} />
        </div>
      )}
      {data && tab !== 'handbooks' && (
        <>
          <AssetsActions
            role={role}
            tab={tab}
            data={data}
            setData={setData}
          />
          <MyTable fullData={data[tab]} tab={tab} role={role} />
        </>
      )}
      {!data && <Loader />}
    </div>
  );
};

export default Assets;
