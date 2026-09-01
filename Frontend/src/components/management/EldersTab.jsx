import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const API_URL = "http://127.0.0.1:5000/api/elders";

const EldersTab = () => {
  const { t } = useTranslation();

  const [elders, setElders] = useState([]);
  const [newElderName, setNewElderName] = useState("");
  const [newElderWhatsapp, setNewElderWhatsapp] = useState("");

  const [meetings, setMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [chosenElderId, setChosenElderId] = useState("");

  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState("");

  // Tracks which single meeting (by id) currently has its minutes
  // editor open, plus the text being typed for it.
  const [minutesOpenFor, setMinutesOpenFor] = useState(null);
  const [minutesText, setMinutesText] = useState("");
  const [minutesSavedId, setMinutesSavedId] = useState(null);

  const fetchElders = async () => {
    const res = await fetch(`${API_URL}`);
    setElders(await res.json());
  };

  const fetchMeetings = async () => {
    const res = await fetch(`${API_URL}/meetings`);
    setMeetings(await res.json());
  };

  const fetchPlans = async () => {
    const res = await fetch(`${API_URL}/plans`);
    setPlans(await res.json());
  };

  useEffect(() => {
    fetchElders();
    fetchMeetings();
    fetchPlans();
  }, []);

  const fetchAttendance = async (meetingId) => {
    const res = await fetch(`${API_URL}/meetings/${meetingId}/attendance`);
    setAttendance(await res.json());
  };

  const handleSelectMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    fetchAttendance(meeting.id);
  };

  const handleAddElder = async (e) => {
    e.preventDefault();
    if (!newElderName.trim()) return;

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newElderName, whatsapp: newElderWhatsapp }),
    });

    setNewElderName("");
    setNewElderWhatsapp("");
    fetchElders();
  };

  const handleDeleteElder = async (id) => {
    if (!window.confirm(t("management.elders.confirmDeleteElder"))) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchElders();
  };

  const handleAddMeeting = async (e) => {
    e.preventDefault();
    if (!newDate) return;

    await fetch(`${API_URL}/meetings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ meeting_date: newDate, notes: newNotes }),
    });

    setNewDate("");
    setNewNotes("");
    fetchMeetings();
  };

  const handleDeleteMeeting = async (id) => {
    if (!window.confirm(t("management.elders.confirmDeleteMeeting"))) return;
    await fetch(`${API_URL}/meetings/${id}`, { method: "DELETE" });
    if (selectedMeeting?.id === id) {
      setSelectedMeeting(null);
      setAttendance([]);
    }
    fetchMeetings();
  };

  const handleMarkPresent = async (e) => {
    e.preventDefault();
    if (!chosenElderId || !selectedMeeting) return;

    await fetch(`${API_URL}/meetings/${selectedMeeting.id}/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ elder_id: chosenElderId }),
    });

    setChosenElderId("");
    fetchAttendance(selectedMeeting.id);
  };

  const handleRemoveAttendance = async (id) => {
    await fetch(`${API_URL}/attendance/${id}`, { method: "DELETE" });
    fetchAttendance(selectedMeeting.id);
  };

  const handleAddPlan = async (e) => {
    e.preventDefault();
    if (!newPlan.trim()) return;

    await fetch(`${API_URL}/plans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: newPlan }),
    });

    setNewPlan("");
    fetchPlans();
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm(t("management.elders.confirmDeletePlan"))) return;
    await fetch(`${API_URL}/plans/${id}`, { method: "DELETE" });
    fetchPlans();
  };

  const toggleMinutes = (meeting) => {
    if (minutesOpenFor === meeting.id) {
      setMinutesOpenFor(null);
      return;
    }
    setMinutesOpenFor(meeting.id);
    setMinutesText(meeting.minutes || "");
    setMinutesSavedId(null);
  };

  const handleSaveMinutes = async (meetingId) => {
    await fetch(`${API_URL}/meetings/${meetingId}/minutes`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ minutes: minutesText }),
    });
    setMinutesSavedId(meetingId);
    fetchMeetings();
  };

  return (
    <div className="space-y-10">
      {/* --- Roster --- */}
      <div>
        <h2 className="text-white font-bold text-lg mb-4">{t("management.elders.rosterTitle")}</h2>

        <form onSubmit={handleAddElder} className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 space-y-4 mb-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">{t("management.elders.name")}</label>
              <input
                type="text" value={newElderName} onChange={(e) => setNewElderName(e.target.value)} required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">{t("management.elders.whatsapp")}</label>
              <input
                type="text" value={newElderWhatsapp} onChange={(e) => setNewElderWhatsapp(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition">
            {t("management.elders.addElder")}
          </button>
        </form>

        {elders.length === 0 ? (
          <p className="text-slate-400 text-sm">{t("management.elders.noElders")}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {elders.map((e) => (
              <div key={e.id} className="bg-white/5 border border-white/10 rounded-full pl-4 pr-2 py-1.5 flex items-center gap-2">
                <span className="text-white text-sm">{e.name}</span>
                <button onClick={() => handleDeleteElder(e.id)} className="text-red-300 hover:text-red-200 text-xs w-5 h-5 flex items-center justify-center">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Meetings + attendance --- */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-white font-bold text-lg mb-4">{t("management.elders.meetingsTitle")}</h2>

          <form onSubmit={handleAddMeeting} className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 space-y-4 mb-6">
            <div>
              <label className="block text-xs text-slate-400 mb-1">{t("management.elders.date")}</label>
              <input
                type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">{t("management.elders.notes")}</label>
              <input
                type="text" value={newNotes} onChange={(e) => setNewNotes(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition">
              {t("management.elders.addMeeting")}
            </button>
          </form>

          {meetings.length === 0 ? (
            <p className="text-slate-400 text-sm">{t("management.elders.noMeetings")}</p>
          ) : (
            <div className="space-y-2">
              {meetings.map((m) => (
                <div key={m.id} className="space-y-2">
                  <div
                    onClick={() => handleSelectMeeting(m)}
                    className={`cursor-pointer rounded-xl p-4 border transition flex justify-between items-center ${
                      selectedMeeting?.id === m.id
                        ? "bg-blue-600/20 border-blue-500/50"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div>
                      <p className="text-white font-semibold text-sm">{m.meeting_date?.slice(0, 10)}</p>
                      {m.notes && <p className="text-slate-400 text-xs mt-1">{m.notes}</p>}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleMinutes(m); }}
                        className="text-blue-300 hover:text-blue-200 text-xs"
                      >
                        {t("management.elders.minutes")}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteMeeting(m.id); }}
                        className="text-red-300 hover:text-red-200 text-xs"
                      >
                        {t("management.elders.remove")}
                      </button>
                    </div>
                  </div>

                  {minutesOpenFor === m.id && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <textarea
                        value={minutesText}
                        onChange={(e) => setMinutesText(e.target.value)}
                        placeholder={t("management.elders.minutesPlaceholder")}
                        rows={6}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                      />
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => handleSaveMinutes(m.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
                        >
                          {t("management.elders.saveMinutes")}
                        </button>
                        {minutesSavedId === m.id && (
                          <span className="text-green-400 text-xs">{t("management.elders.minutesSaved")}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-white font-bold text-lg mb-4">{t("management.elders.attendance")}</h2>

          {!selectedMeeting ? (
            <p className="text-slate-400 text-sm">{t("management.elders.selectMeeting")}</p>
          ) : (
            <>
              <form onSubmit={handleMarkPresent} className="flex gap-2 mb-5">
                <select
                  value={chosenElderId}
                  onChange={(e) => setChosenElderId(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                >
                  <option value="" className="text-black">{t("management.elders.choose")}</option>
                  {elders.map((e) => (
                    <option key={e.id} value={e.id} className="text-black">{e.name}</option>
                  ))}
                </select>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition">
                  {t("management.elders.markPresent")}
                </button>
              </form>

              {attendance.length === 0 ? (
                <p className="text-slate-400 text-sm">{t("management.elders.noAttendance")}</p>
              ) : (
                <div className="space-y-2">
                  {attendance.map((a) => (
                    <div key={a.id} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex justify-between items-center">
                      <span className="text-white text-sm">{a.name}</span>
                      <button onClick={() => handleRemoveAttendance(a.id)} className="text-red-300 hover:text-red-200 text-xs">
                        {t("management.elders.remove")}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* --- Plans --- */}
      <div>
        <h2 className="text-white font-bold text-lg mb-4">{t("management.elders.plansTitle")}</h2>

        <form onSubmit={handleAddPlan} className="flex gap-2 mb-5">
          <input
            type="text"
            value={newPlan}
            onChange={(e) => setNewPlan(e.target.value)}
            placeholder={t("management.elders.planPlaceholder")}
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition">
            {t("management.elders.addPlan")}
          </button>
        </form>

        {plans.length === 0 ? (
          <p className="text-slate-400 text-sm">{t("management.elders.noPlans")}</p>
        ) : (
          <div className="space-y-2">
            {plans.map((p) => (
              <div key={p.id} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex justify-between items-center gap-3">
                <span className="text-white text-sm">{p.description}</span>
                <button onClick={() => handleDeletePlan(p.id)} className="text-red-300 hover:text-red-200 text-xs shrink-0">
                  {t("management.elders.remove")}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EldersTab;
