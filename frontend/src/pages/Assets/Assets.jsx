import React, { useEffect, useState } from "react";
import { fetchData, fetchExportData } from "../../utils/fetchData";
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
  const [role, setRole] = useState(null);

  useEffect(() => {
    fetchData("assets", "get", null, setData);
    localStorage.getItem("user") && setRole(JSON.parse(localStorage.getItem("user")).role);
  }, []);

  const exportData = () => {
    const name = tab; 
    fetchExportData('assets/import', { name: name });
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
        return null; // Если нет соответствующей страницы, не показываем форму
    }
  };

  const toggleFormVisibility = () => {
    setFormVisible((prev) => !prev);
  };

  return (
    <div className={classes.main + ' main'}>
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
          <Button
            text="Импортировать CSV"
            onClick={() => {
              console.log("click");
            }}
            style={{ width: "fit-content" }}
            disabled={role === "user"}
          />
          <Button
            text="Экспортировать CSV"
            onClick={exportData}
            style={{ width: "fit-content" }}
          />
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
    </div>
  );
};

export default Assets;
