import MyButton from "../Button/MyButton";

const ImportForm = ({ tab, importAlertType, setImportAlertType, importAlert, setImportAlert, handleImportSubmit, handleFileChange, toggleImportFormVisibility }) => {
    return (
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
                <div className="d-flex gap-2 flex-wrap">
                    <MyButton text="Отправить" type="submit" style={{ width: "fit-content" }} />
                    <MyButton text="Отмена" type="button" style={{ width: "fit-content" }} onClick={() => {
                        toggleImportFormVisibility(false);
                        setImportAlert(null);
                        setImportAlertType(null);
                    }} />
                </div>
            </form>
        </div>
    )
};

export default ImportForm;