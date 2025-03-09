import React, { useEffect, useState } from "react";
import { fetchData, fetchExportData, fetchImportData } from "../../utils/fetchData";
import HandbooksTabs from "../../components/UI/HandbooksTabs/HandbooksTabs";
import MyButton from "../../components/UI/Button/MyButton";
import Loader from "../../components/UI/Loader/Loader";
import classes from "../Page.module.css";
import MyTable from "../../components/UI/Table/MyTable";
import AssetFormGenerator from "../../components/UI/Forms/AssetFormGenerator";
import { translateAssets } from "../../utils/assets";
import ImportForm from "../../components/UI/Forms/ImportForm";

const handbooksList = ["equipments", "programs", "components", "consumables"]


const AssetsActions = ({ role, tab, data, setData }) => {
  const [formVisible, setFormVisible] = useState(false);
  const [importFormVisible, setImportFormVisible] = useState(false);
  const [importAlert, setImportAlert] = useState(null);
  const [importAlertType, setImportAlertType] = useState(null);
  const [file, setFile] = useState(null);
  const [optionsData, setOptionsData] = useState(null);

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

  const ActionsButtons = () => {
    return (
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
