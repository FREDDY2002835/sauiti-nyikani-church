import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import { FaArrowLeft } from "react-icons/fa";

const BASE_URL = "http://127.0.0.1:5000/api/ministries";

// A small reusable "named list" manager - Members, Activities, and Plans
// all work the same way (add an item, see the list, remove an item), so
// this one component handles all three instead of writing it three times.
const ListSection = ({ title, items, fieldName, placeholder, addLabel, emptyLabel, removeLabel, onAdd, onDelete }) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value);
    setValue("");
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sm:p-8">
      <h2 className="text-white font-bold text-lg mb-4">{title}</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-5">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition">
          {addLabel}
        </button>
      </form>

      {items.length === 0 ? (
        <p className="text-slate-400 text-sm">{emptyLabel}</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex justify-between items-center gap-3">
              <span className="text-white text-sm">{item[fieldName]}</span>
              <button onClick={() => onDelete(item.id)} className="text-red-300 hover:text-red-200 text-xs shrink-0">
                {removeLabel}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminMinistryDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [ministryName, setMinistryName] = useState("");
  const [members, setMembers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [plans, setPlans] = useState([]);

  const fetchAll = async () => {
    const [ministryRes, membersRes, activitiesRes, plansRes] = await Promise.all([
      fetch(`${BASE_URL}/${id}`),
      fetch(`${BASE_URL}/${id}/members`),
      fetch(`${BASE_URL}/${id}/activities`),
      fetch(`${BASE_URL}/${id}/plans`),
    ]);

    const ministry = await ministryRes.json();
    setMinistryName(ministry[`name_${lang}`] || ministry.name_en || "");
    setMembers(await membersRes.json());
    setActivities(await activitiesRes.json());
    setPlans(await plansRes.json());
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, lang]);

  const addMember = async (name) => {
    await fetch(`${BASE_URL}/${id}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    fetchAll();
  };

  const deleteMember = async (memberId) => {
    await fetch(`${BASE_URL}/members/${memberId}`, { method: "DELETE" });
    fetchAll();
  };

  const addActivity = async (description) => {
    await fetch(`${BASE_URL}/${id}/activities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });
    fetchAll();
  };

  const deleteActivity = async (activityId) => {
    await fetch(`${BASE_URL}/activities/${activityId}`, { method: "DELETE" });
    fetchAll();
  };

  const addPlan = async (description) => {
    await fetch(`${BASE_URL}/${id}/plans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    });
    fetchAll();
  };

  const deletePlan = async (planId) => {
    await fetch(`${BASE_URL}/plans/${planId}`, { method: "DELETE" });
    fetchAll();
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-5 py-16 md:py-24">
        <Link
          to="/admin/ministries"
          className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 text-sm mb-6 transition"
        >
          <FaArrowLeft /> {t("management.ministriesAdmin.detail.backToMinistries")}
        </Link>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          {ministryName || t("management.ministriesAdmin.detail.defaultTitle")}
        </h1>
        <p className="text-slate-400 text-sm mb-10">
          {t("management.ministriesAdmin.detail.subtitle")}
        </p>

        <div className="space-y-8">
          <ListSection
            title={t("management.ministriesAdmin.detail.members")}
            items={members}
            fieldName="name"
            placeholder={t("management.ministriesAdmin.detail.memberPlaceholder")}
            addLabel={t("management.ministriesAdmin.detail.add")}
            emptyLabel={t("management.ministriesAdmin.detail.empty")}
            removeLabel={t("management.ministriesAdmin.detail.remove")}
            onAdd={addMember}
            onDelete={deleteMember}
          />

          <ListSection
            title={t("management.ministriesAdmin.detail.activities")}
            items={activities}
            fieldName="description"
            placeholder={t("management.ministriesAdmin.detail.activityPlaceholder")}
            addLabel={t("management.ministriesAdmin.detail.add")}
            emptyLabel={t("management.ministriesAdmin.detail.empty")}
            removeLabel={t("management.ministriesAdmin.detail.remove")}
            onAdd={addActivity}
            onDelete={deleteActivity}
          />

          <ListSection
            title={t("management.ministriesAdmin.detail.plans")}
            items={plans}
            fieldName="description"
            placeholder={t("management.ministriesAdmin.detail.planPlaceholder")}
            addLabel={t("management.ministriesAdmin.detail.add")}
            emptyLabel={t("management.ministriesAdmin.detail.empty")}
            removeLabel={t("management.ministriesAdmin.detail.remove")}
            onAdd={addPlan}
            onDelete={deletePlan}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminMinistryDetail;
