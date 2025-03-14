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
import EquimpentReportForm from "../../components/UI/Forms/EquimpentReportForm";
import BrokenEquipmentReportForm from "../../components/UI/Forms/BrokenEquipmentReportForm";
import TemporaryEquipmentReportForm from "../../components/UI/Forms/TemporaryEquipmentReportForm";
import DropDown from "../../components/UI/DropDown/DropDown";
const handbooksList = ["equipments", "programs", "components", "consumables", "users"];


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

const FormEndpointsMap = {
  equipments: "assets/equipments",
  programs: "assets/programs",
  components: "assets/components",
  consumables: "assets/consumables",
  users: "auth/users/create",
}


const AssetsActions = ({ role, tab, data, setData }) => {
  const [formVisible, setFormVisible] = useState(false);
  const [importFormVisible, setImportFormVisible] = useState(false);
  const [importAlert, setImportAlert] = useState(null);
  const [importAlertType, setImportAlertType] = useState(null);
  const [file, setFile] = useState(null);
  const [optionsData, setOptionsData] = useState(null);
  const [showChangePassForm, setShowChangePassForm] = useState(false);
  const [showEquipmentReportForm, setShowEquipmentReportForm] = useState(false);
  const [showBrokenEquipmentReportForm, setShowBrokenEquipmentReportForm] = useState(false);
  const [showTemporaryEquipmentReportForm, setShowTemporaryEquipmentReportForm] = useState(false);
  const [selectedEquipments, setSelectedEquipments] = useState([]);

  useEffect(() => {
    setOptionsData(null);
    if (formVisible && handbooksList.includes(tab)) {
      fetchData(`assets/handbooks/${tab}`, "get", null, setOptionsData);
    }
  }
    , [formVisible, setOptionsData, tab]);

  const exportData = () => {
    const pks = [];
    const selectInputs = document.querySelectorAll(`[data-export-select-asset="${tab}"]`);
    selectInputs?.forEach((input) => {
      if (input.checked) {
        pks.push(input.getAttribute("data-export-select"));
      }
    });

    fetchExportData("assets/export", { name: tab, pks: pks });
  };

  const toggleFormVisibility = () => {
    setFormVisible((prev) => !prev);
  };

  const toggleImportFormVisibility = () => {
    setImportFormVisible((prev) => !prev);
  };

  const getSelectedEquipments = () => {
    const inputs = document.querySelectorAll(`[data-export-select-asset="${tab}"]`);
    const pks = [];
    inputs.forEach((input) => {
      if (input.checked) {
        pks.push(parseInt(input.getAttribute("data-export-select")));
      }
    });
    setSelectedEquipments(pks);
    return pks;
  }

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
      "assets/import",
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

      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      Cookies.remove("access");
      Cookies.remove("refresh");

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleChangePass = () => {
    setShowChangePassForm(true);
  };

  const handleGeneratePdfLabels = () => {
    const inputs = document.querySelectorAll(`[data-export-select-asset="${tab}"]`);
    const pks = [];
    inputs.forEach((input) => {
      if (input.checked) {
        pks.push(input.getAttribute("data-export-select"));
      }
    });

    if (pks.length === 0) {
      alert("Выберите хотя бы один элемент!");
      return;
    }
    else {
      fetchExportData("forms/invent", { type: tab, pks: pks }, null, null, "pdf", `${tab}_labels`);
    }
  };

  const handleEquipmentReport = () => {
    const pks = getSelectedEquipments();
    if (pks.length === 0) {
      alert("Выберите хотя бы один элемент!");
      return;
    }
    else {
      setShowEquipmentReportForm(true);
    }
  };

  const handleTemporaryEquipmentReport = () => {
    const pks = getSelectedEquipments();
    if (pks.length === 0) {
      alert("Выберите хотя бы один элемент!");
      return;
    }
    else {
      setShowTemporaryEquipmentReportForm(true);
    }
  };

  const handleBrokenEquipmentReport = () => {
    const pks = getSelectedEquipments();
    if (pks.length === 0) {
      alert("Выберите хотя бы один элемент!");
      return;
    }
    else {
      setShowBrokenEquipmentReportForm(true);
    }
  }

  const ActionsButtons = () => {
    return (
      <div className="d-flex gap-3 align-items-center flex-wrap" style={{ width: "100%", justifyContent: "space-between" }}>
        <div className="d-flex gap-3 flex-wrap">
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


              {
                tab === "equipments" && (
                  <DropDown buttonText="Создать акт">
                    <MyButton
                      text="Акт возврата оборудования"
                      onClick={() => handleEquipmentReport()}
                      style={{ width: "fit-content" }}
                      className="btn-link"
                    />
                    <MyButton
                      text="Акт приема неисправного оборудования"
                      onClick={() => handleBrokenEquipmentReport()}
                      style={{ width: "fit-content" }}
                      className="btn-link"
                    />
                    <MyButton
                      text="Акт передачи оборудования во временное пользование"
                      onClick={() => handleTemporaryEquipmentReport()}
                      style={{ width: "fit-content" }}
                      className="btn-link"
                    />
                    <MyButton
                      text="Сгенерировать инвентаризационные этикетки"
                      onClick={handleGeneratePdfLabels}
                      style={{ width: "fit-content" }}
                      className="btn-link"
                    />
                  </DropDown>
                )
              }

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
            endPoint={FormEndpointsMap[tab]}
          />}
        </div>
      )}

      {importFormVisible && (
        <div className="p-3 border rounded form-container">
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
        </div>
      )}

      {EquimpentReportForm({ showEquipmentReportForm, setShowEquipmentReportForm, data, selectedEquipments })}
      {BrokenEquipmentReportForm({ showBrokenEquipmentReportForm, setShowBrokenEquipmentReportForm, data, selectedEquipments })}
      {TemporaryEquipmentReportForm({ showTemporaryEquipmentReportForm, setShowTemporaryEquipmentReportForm, data, selectedEquipments })}
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
