import React, { useState } from "react";
import MyButton from "../Button/MyButton";
import MyTable from "../Table/MyTable";
import AssetFormGenerator from "../Forms/AssetFormGenerator";

const tabsNamesMap = {
    "Оборудование": "equipments",
    "Комплектующие": "components",
    "Программы": "programs",
    "Расходники": "consumables",
    "Компании": "company",
}

const tabs = Object.keys(tabsNamesMap);

const HandbooksTabs = ({ data, sync, role }) => {
    const [activeTab, setActiveTab] = useState("Оборудование");
    const [addFormVisible, setAddFormVisible] = useState(false);

    const tabData = data[tabsNamesMap[activeTab]];

    return (
        <div>
            <nav className="border-bottom">
                <h3>Справочники</h3>
                <ul style={{ display: "flex", listStyle: "none", padding: '0.5rem 0', overflow: 'auto' }}>
                    {tabs.map((tab) => (
                        <li key={tab}>
                            <MyButton
                                text={tab}
                                onClick={() => setActiveTab(tab)}
                                className={
                                    activeTab === tab
                                        ? "btn-primary btn-tab"
                                        : "btn-tab"
                                }
                            />
                        </li>
                    ))}
                </ul>
            </nav>
            <div>
                {addFormVisible && (
                    <div className="p-3 border rounded form-container">
                        <AssetFormGenerator
                            onClose={() => setAddFormVisible(false)}
                            title={`Добавление Справочника ${activeTab}`}
                            asset={tabsNamesMap[activeTab]}
                            endPoint={`assets/handbooks/${tabsNamesMap[activeTab]}`}
                            isHandbook={true}
                        />
                    </div>

                )}
                <div className="d-flex gap-2 py-3">
                    <MyButton className="w-fit" text={"Обновить Данные"} onClick={() => {
                        sync();
                        alert("Данные обновлены!");
                    }} />
                    <MyButton className="w-fit" text={"Добавить новую запись"} onClick={() => {
                        setAddFormVisible(true);
                    }}/>
                </div>

                {!tabData.length ? <p className="p-3">Нет данных</p> : <MyTable fullData={tabData} tab={tabsNamesMap[activeTab]} isHandbook={true} role={role}  />}
            </div>
        </div>
    );
};

export default HandbooksTabs;