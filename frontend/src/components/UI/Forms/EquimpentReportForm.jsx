import React, { useState, useEffect } from "react";
import MyButton from "../Button/MyButton";
import { fetchExportData, fetchForm } from "../../../utils/fetchData";

const EquimpentReportForm = ({ showEquipmentReportForm, setShowEquipmentReportForm, data, selectedEquipments }) => {
    const [formData, setFormData] = useState({
        employee_name: "",
        company_name: "",
        position_1: "",
        position_2: "",
        signer_1: "",
        signer_2: "",
        equipment_ids: [],
    });

    const [optionsData, setOptionsData] = useState(null);
    const users = data.users || [];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        setOptionsData(null);
        fetchForm(`assets/handbooks/equipments`, "get", null, null).then(response => {
            setOptionsData(response.data);
        });
    }
        , [setOptionsData]);



    const handleCreateReport = (e) => {
        e.preventDefault();
        setFormData((prevState) => {
            const updatedData = { ...prevState, equipment_ids: selectedEquipments };
            fetchExportData('forms/reception', updatedData, null, null, 'docx', 'Equipments_Report');
            return updatedData;
        });
    };
    if (!showEquipmentReportForm || !selectedEquipments.length) return null;
    else {
        return (
            <form className="d-flex p-3 gap-3 flex-column form-container">
                <h2>Создание акта возврата оборудования</h2>
                <div className="d-flex flex-column gap-2">
                    <label className="form-label">Сотрудник</label>
                    <select
                        name="employee_name"
                        className="form-control"
                        value={formData.employee_name}
                        onChange={handleChange}
                    >
                        <option value="">Выберите сотрудника</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.username}>
                                {user.Фамилия} {user.Имя} {user.Отчество} ({user.username})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Выбор компании */}
                <div className="d-flex flex-column gap-2">
                    <label className="form-label">Компания</label>
                    <select
                        name="company_name"
                        className="form-control"
                        value={formData.company_name}
                        onChange={handleChange}
                    >
                        <option value="">Выберите компанию</option>
                        {optionsData && optionsData.Компания.map((company, index) => {
                            return (
                                <option key={index} value={company}>
                                    {company}
                                </option>
                            )
                        })}
                    </select>
                </div>

                {/* Должность сотрудника */}
                <div className="d-flex flex-column gap-2">
                    <label className="form-label">Должность сотрудника</label>
                    <input
                        type="text"
                        name="position_1"
                        className="form-control"
                        value={formData.position_1}
                        onChange={handleChange}
                        placeholder="Введите должность сотрудника"
                    />
                </div>

                {/* Должность принимающего */}
                <div className="d-flex flex-column gap-2">
                    <label className="form-label">Должность принимающего</label>
                    <input
                        type="text"
                        name="position_2"
                        className="form-control"
                        value={formData.position_2}
                        onChange={handleChange}
                        placeholder="Введите должность принимающего"
                    />
                </div>

                {/* Подписант 1 */}
                <div className="d-flex flex-column gap-2">
                    <label className="form-label">Подписант 1</label>
                    <input
                        type="text"
                        name="signer_1"
                        className="form-control"
                        value={formData.signer_1}
                        onChange={handleChange}
                        placeholder="Введите ФИО подписанта 1"
                    />
                </div>

                {/* Подписант 2 */}
                <div className="d-flex flex-column gap-2">
                    <label className="form-label">Подписант 2</label>
                    <input
                        type="text"
                        name="signer_2"
                        className="form-control"
                        value={formData.signer_2}
                        onChange={handleChange}
                        placeholder="Введите ФИО подписанта 2"
                    />
                </div>

                {/* Выбор оборудования */}
                <div className="d-flex flex-column gap-2">
                    <p className="form-label">Избранное оборудование</p>
                    <div className="d-flex flex-column gap-2 w-fit">
                        {data.equipments.map((equipment) => (
                            selectedEquipments.includes(equipment.id) && (
                                <div className="p-2 border w-100" key={equipment.id}>
                                    {'id: ' + equipment.id + ' Модель: ' + equipment.Модель + ' Серийный номер: ' + equipment.Серийный_Номер}
                                </div>
                            )
                        ))}
                    </div>
                </div>

                {/* Кнопки */}
                <div className="d-flex gap-3 flex-wrap">
                    <MyButton text={'Печатные формы'} className="w-fit" onClick={handleCreateReport} />
                    <MyButton text={'Отмена'} className="w-fit" onClick={() => setShowEquipmentReportForm(false)} />
                </div>
            </form>
        )
    }
};

export default EquimpentReportForm;
