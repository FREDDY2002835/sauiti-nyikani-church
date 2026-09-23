import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { clearSession, getAdminUser } from "../auth/auth";
import MainLayout from "../layouts/MainLayout";
import MembersTab from "../components/management/MembersTab";
import CommunionTab from "../components/management/CommunionTab";
import ChoirTab from "../components/management/ChoirTab";
import TitheTab from "../components/management/TitheTab";
import EldersTab from "../components/management/EldersTab";
import FinanceTab from "../components/management/FinanceTab";
import BaptismTab from "../components/management/BaptismTab";
import ContributionsTab from "../components/management/ContributionsTab";
import ProjectsTab from "../components/management/ProjectsTab";
import AnnouncementsTab from "../components/management/AnnouncementsTab";

const TABS = [
  { key: "members", Component: MembersTab },
  { key: "communion", Component: CommunionTab },
  { key: "choir", Component: ChoirTab },
  { key: "tithe", Component: TitheTab },
  { key: "elders", Component: EldersTab },
  { key: "finance", Component: FinanceTab },
  { key: "baptism", Component: BaptismTab },
  { key: "contributions", Component: ContributionsTab },
  { key: "projects", Component: ProjectsTab },
  { key: "announcements", Component: AnnouncementsTab },
];

const ChurchManagement = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("members");
  const navigate = useNavigate();
  const adminUser = getAdminUser();

  const handleLogout = () => {
    clearSession();
    navigate("/admin/login", { replace: true });
  };

  const ActiveComponent = TABS.find((tab) => tab.key === activeTab)?.Component;

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-5 py-16 md:py-24">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          {t("management.title")}
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <p className="text-slate-400 text-sm">{t("management.subtitle")}</p>
          <div className="flex items-center gap-3">
            {adminUser?.email && <span className="text-xs text-slate-400 hidden sm:block">{adminUser.email}</span>}
            <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-400/20 text-red-200 text-sm font-semibold hover:bg-red-500/20">Sign out</button>
          </div>
        </div>

        {/* --- Links to the other admin areas, so nothing requires typing a URL --- */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link
            to="/admin/ministries"
            className="bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition"
          >
            {t("management.manageMinistries")}
          </Link>
          <Link
            to="/admin/gallery"
            className="bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition"
          >
            {t("management.manageGallery")}
          </Link>
          <Link
            to="/admin/sermons"
            className="bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition"
          >
            {t("management.manageSermons")}
          </Link>
          <Link
            to="/admin/events"
            className="bg-white/10 border border-white/20 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition"
          >
            {t("management.manageEvents")}
          </Link>
        </div>

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
