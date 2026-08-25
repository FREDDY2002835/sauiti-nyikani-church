import { useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import MembersTab from "../components/management/MembersTab";
import CommunionTab from "../components/management/CommunionTab";
import ChoirTab from "../components/management/ChoirTab";
import TitheTab from "../components/management/TitheTab";

const TABS = [
  { key: "members", Component: MembersTab },
  { key: "communion", Component: CommunionTab },
  { key: "choir", Component: ChoirTab },
  { key: "tithe", Component: TitheTab },
];

const ChurchManagement = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("members");

  const ActiveComponent = TABS.find((tab) => tab.key === activeTab)?.Component;

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-5 py-16 md:py-24">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          {t("management.title")}
        </h1>
        <p className="text-slate-400 text-sm mb-8">{t("management.subtitle")}</p>

        {/* --- Tab switcher --- */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-white/10 pb-4">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {t(`management.tabs.${tab.key}`)}
            </button>
          ))}
        </div>

        {ActiveComponent && <ActiveComponent />}
      </div>
    </MainLayout>
  );
};

export default ChurchManagement;
