import React, { useEffect, useState } from "react";
import { fetchData, fetchExportData, fetchImportData } from "../../utils/fetchData";
import Button from "../../components/UI/Button/MyButton";
import Loader from "../../components/UI/Loader/Loader";
import classes from "../Page.module.css";
import MyTable from "../../components/UI/Table/MyTable";

// Импортируем формы для разных типов
import EquipmentForm from "../../components/UI/Forms/EquipmentForm";
import ProgramsForm from "../../components/UI/Forms/ProgramsForm";
import ComponentsForm from "../../components/UI/Forms/ComponentsForm";
import ConsumablesForm from "../../components/UI/Forms/ConsumablesForm";
import RepairsForm from "../../components/UI/Forms/RepairsForm";
import MovementsForm from "../../components/UI/Forms/MovementsForm";
import UserForm from "../../components/UI/Forms/UserForm";

const Assets = () => {
  const tab = window.location.pathname.split("/assets/")[1]; // Делаем это для извлечения текущей страницы
  const [data, setData] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [importFormVisible, setImportFormVisible] = useState(false);
  const [role, setRole] = useState(null);
  const [file, setFile] = useState(null);
  const [importAlert, setImportAlert] = useState(null);
  const [importAlertType, setImportAlertType] = useState(null);

  useEffect(() => {
    fetchData("assets", "get", null, setData);
    localStorage.getItem("user") && setRole(JSON.parse(localStorage.getItem("user")).role);
  }, []);

  const exportData = () => {
    fetchExportData("assets/import", { name: tab });
  };

  // Логика для отображения нужной формы
  const getFormComponent = () => {
    switch (tab) {
      case "equipments":
        return <EquipmentForm onClose={toggleFormVisibility} />;
      case "programs":
        return <ProgramsForm onClose={toggleFormVisibility} />;
      case "components":
        return <ComponentsForm onClose={toggleFormVisibility} />;
      case "consumables":
        return <ConsumablesForm onClose={toggleFormVisibility} />;
      case "repairs":
        return <RepairsForm onClose={toggleFormVisibility} />;
      case "movements":
        return <MovementsForm onClose={toggleFormVisibility} />;
      case "users":
        return <UserForm onClose={toggleFormVisibility} />;
      default:
        return null;
    }
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


  return (
    <div className={classes.main + " main"}>
      <div className="p-3 border-bottom d-flex justify-content-between gap-3">
        <div className="d-flex gap-3">
          <Button
            text="Обновить данные"
            onClick={() => {
              fetchData("assets", "get", null, setData);
              alert("Данные обновлены!");
            }}
            style={{ width: "fit-content" }}
          />
          <Button
            text="Добавить новую запись"
            onClick={toggleFormVisibility}
            style={{ width: "fit-content" }}
            disabled={role === "user"}
          />
          {tab !== "users" && (
            <>
              <Button
                text="Импортировать CSV"
                onClick={toggleImportFormVisibility}
                style={{ width: "fit-content" }}
                disabled={role === "user"}
              />
              <Button
                text="Экспортировать CSV"
                onClick={exportData}
                style={{ width: "fit-content" }}
              />
            </>
          )}
        </div>
      </div>

      {data ? (
        <div className="p-3">
          <MyTable fulldata={data[tab]} tabName={tab} role={role} />
        </div>
      ) : (
        <div style={{ margin: "auto" }}>
          <Loader />
        </div>
      )}

      <div className="p-3">
        {formVisible && <div className="p-3 border rounded form-container">{getFormComponent()}</div>}
      </div>

      {/* Форма импорта CSV */}
      {importFormVisible && (
        <div className="p-3 border rounded form-container">
          <h3>Импортировать CSV для {tab}</h3>
          {importAlert && <div className={`alertBox ${importAlertType}`}>
            {importAlert}
            <button type="button" className="p-1" onClick={() => {
              setImportAlert(null);
              setImportAlertType(null);
            }}>X</button>
          </div>}
          <form onSubmit={handleImportSubmit} className="d-flex flex-column gap-3">
            <label>Выберите файл</label>
            <input type="file" accept=".csv" onChange={handleFileChange} className="form-control" />
            <div className="d-flex gap-2">
              <Button text="Отправить" type="submit" style={{ width: "fit-content" }} />
              <Button text="Отмена" type="button" style={{ width: "fit-content" }} onClick={() => {
                toggleImportFormVisibility(false);
                setImportAlert(null);
                setImportAlertType(null);
              }} />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Assets;
