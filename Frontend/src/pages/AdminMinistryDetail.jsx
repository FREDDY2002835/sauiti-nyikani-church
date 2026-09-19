import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import { FaArrowLeft, FaCheck } from "react-icons/fa";

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
  const [committee, setCommittee] = useState([]);

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [attendanceError, setAttendanceError] = useState(null);

  // Committee form (name + role together)
  const [committeeName, setCommitteeName] = useState("");
  const [committeeRole, setCommitteeRole] = useState("");

  // New-service form
  const [newServiceDate, setNewServiceDate] = useState("");
  const [newServiceNotes, setNewServiceNotes] = useState("");

  const fetchAll = async () => {
    const [ministryRes, membersRes, activitiesRes, plansRes, committeeRes, servicesRes] = await Promise.all([
      fetch(`${BASE_URL}/${id}`),
      fetch(`${BASE_URL}/${id}/members`),
      fetch(`${BASE_URL}/${id}/activities`),
      fetch(`${BASE_URL}/${id}/plans`),
      fetch(`${BASE_URL}/${id}/committee`),
      fetch(`${BASE_URL}/${id}/services`),
    ]);

    const ministry = await ministryRes.json();
    setMinistryName(ministry[`name_${lang}`] || ministry.name_en || "");
    setMembers(await membersRes.json());
    setActivities(await activitiesRes.json());
    setPlans(await plansRes.json());
    setCommittee(await committeeRes.json());
    setServices(await servicesRes.json());
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

  // --- Committee ---

  const handleAddCommittee = async (e) => {
    e.preventDefault();
    if (!committeeName.trim()) return;

    await fetch(`${BASE_URL}/${id}/committee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: committeeName, role: committeeRole }),
    });

    setCommitteeName("");
    setCommitteeRole("");
    fetchAll();
  };

  const deleteCommitteeMember = async (committeeId) => {
    await fetch(`${BASE_URL}/committee/${committeeId}`, { method: "DELETE" });
    fetchAll();
  };

  // --- Services + attendance ---

  const fetchAttendance = async (serviceId) => {
    try {
      const res = await fetch(`${BASE_URL}/services/${serviceId}/attendance`);
      const data = await res.json();
      setAttendance(Array.isArray(data) ? data : []);
    } catch (err) {
      setAttendance([]);
    }
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    fetchAttendance(service.id);
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newServiceDate) return;

    await fetch(`${BASE_URL}/${id}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service_date: newServiceDate, notes: newServiceNotes }),
    });

    setNewServiceDate("");
    setNewServiceNotes("");
    fetchAll();
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm(t("management.ministriesAdmin.detail.confirmDeleteService"))) return;
    await fetch(`${BASE_URL}/services/${serviceId}`, { method: "DELETE" });
    if (selectedService?.id === serviceId) {
      setSelectedService(null);
      setAttendance([]);
    }
    fetchAll();
  };

  const handleToggleAttendance = async (memberId, existingRecord) => {
    setAttendanceError(null);
    try {
      let response;
      if (existingRecord) {
        // Already ticked - untick by removing that attendance record.
        response = await fetch(`${BASE_URL}/service-attendance/${existingRecord.id}`, { method: "DELETE" });
      } else {
        // Not ticked yet - mark them present.
        response = await fetch(`${BASE_URL}/services/${selectedService.id}/attendance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ member_id: memberId }),
        });
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "The server rejected that request.");
      }

      fetchAttendance(selectedService.id);
    } catch (err) {
      setAttendanceError(err.message || "Could not update attendance. Check that the backend is running.");
    }
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

          {/* --- Committee (name + role) --- */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sm:p-8">
            <h2 className="text-white font-bold text-lg mb-4">{t("management.ministriesAdmin.detail.committee")}</h2>

            <form onSubmit={handleAddCommittee} className="flex flex-col sm:flex-row gap-2 mb-5">
              <input
                type="text"
                value={committeeName}
                onChange={(e) => setCommitteeName(e.target.value)}
                placeholder={t("management.ministriesAdmin.detail.committeeNamePlaceholder")}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
              />
              <input
                type="text"
                value={committeeRole}
                onChange={(e) => setCommitteeRole(e.target.value)}
                placeholder={t("management.ministriesAdmin.detail.committeeRolePlaceholder")}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition shrink-0">
                {t("management.ministriesAdmin.detail.addCommittee")}
              </button>
            </form>

            {committee.length === 0 ? (
              <p className="text-slate-400 text-sm">{t("management.ministriesAdmin.detail.empty")}</p>
            ) : (
              <div className="space-y-2">
                {committee.map((c) => (
                  <div key={c.id} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex justify-between items-center gap-3">
                    <span className="text-white text-sm">
                      {c.name}
                      {c.role && <span className="text-slate-400"> — {c.role}</span>}
                    </span>
                    <button onClick={() => deleteCommitteeMember(c.id)} className="text-red-300 hover:text-red-200 text-xs shrink-0">
                      {t("management.ministriesAdmin.detail.remove")}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

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

          {/* --- Service attendance --- */}
          <div>
            <h2 className="text-white font-bold text-lg mb-4">{t("management.ministriesAdmin.detail.servicesTitle")}</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <form onSubmit={handleAddService} className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 space-y-4 mb-5">
                  <h3 className="text-white font-semibold text-sm">{t("management.ministriesAdmin.detail.newService")}</h3>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t("management.ministriesAdmin.detail.date")}</label>
                    <input
                      type="date" value={newServiceDate} onChange={(e) => setNewServiceDate(e.target.value)} required
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t("management.ministriesAdmin.detail.notes")}</label>
                    <input
                      type="text" value={newServiceNotes} onChange={(e) => setNewServiceNotes(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition">
                    {t("management.ministriesAdmin.detail.addService")}
                  </button>
                </form>

                {services.length === 0 ? (
                  <p className="text-slate-400 text-sm">{t("management.ministriesAdmin.detail.noServices")}</p>
                ) : (
                  <div className="space-y-2">
                    {services.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => handleSelectService(s)}
                        className={`cursor-pointer rounded-xl p-4 border transition flex justify-between items-center ${
                          selectedService?.id === s.id
                            ? "bg-blue-600/20 border-blue-500/50"
                            : "bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <div>
                          <p className="text-white font-semibold text-sm">{s.service_date?.slice(0, 10)}</p>
                          {s.notes && <p className="text-slate-400 text-xs mt-1">{s.notes}</p>}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteService(s.id); }}
                          className="text-red-300 hover:text-red-200 text-xs shrink-0"
                        >
                          {t("management.ministriesAdmin.detail.remove")}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold text-sm">{t("management.ministriesAdmin.detail.attendance")}</h3>
                  {selectedService && (
                    <span className="text-green-400 text-xs font-semibold bg-green-500/10 px-3 py-1 rounded-full">
                      {attendance.length} / {members.length} present
                    </span>
                  )}
                </div>

                {attendanceError && (
                  <p className="text-red-400 text-xs mb-3 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    {attendanceError}
                  </p>
                )}

                {!selectedService ? (
                  <p className="text-slate-400 text-sm">{t("management.ministriesAdmin.detail.selectService")}</p>
                ) : members.length === 0 ? (
                  <p className="text-slate-400 text-sm">{t("management.ministriesAdmin.detail.empty")}</p>
                ) : (
                  <div className="space-y-2">
                    {members.map((m) => {
                      const record = attendance.find((a) => a.member_id === m.id);
                      const isPresent = Boolean(record);

                      return (
                        <label
                          key={m.id}
                          className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 cursor-pointer hover:bg-white/10 transition"
                        >
                          <input
                            type="checkbox"
                            checked={isPresent}
                            onChange={() => handleToggleAttendance(m.id, record)}
                            className="sr-only"
                          />
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition ${
                              isPresent ? "bg-green-500" : "border-2 border-white/30"
                            }`}
                          >
                            {isPresent && <FaCheck className="text-white text-[10px]" />}
                          </span>
                          <span className="text-white text-sm">{m.name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminMinistryDetail;
