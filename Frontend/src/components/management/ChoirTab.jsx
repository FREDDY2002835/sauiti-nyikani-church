import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const API_URL = "http://127.0.0.1:5000/api/choir";

const ChoirTab = () => {
  const { t } = useTranslation();

  const [members, setMembers] = useState([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberWhatsapp, setNewMemberWhatsapp] = useState("");

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [chosenMemberId, setChosenMemberId] = useState("");

  const fetchMembers = async () => {
    const res = await fetch(`${API_URL}/members`);
    setMembers(await res.json());
  };

  const fetchSessions = async () => {
    const res = await fetch(`${API_URL}/sessions`);
    setSessions(await res.json());
  };

  useEffect(() => {
    fetchMembers();
    fetchSessions();
  }, []);

  const fetchAttendance = async (sessionId) => {
    const res = await fetch(`${API_URL}/sessions/${sessionId}/attendance`);
    setAttendance(await res.json());
  };

  const handleSelectSession = (session) => {
    setSelectedSession(session);
    fetchAttendance(session.id);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    await fetch(`${API_URL}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newMemberName, whatsapp: newMemberWhatsapp }),
    });

    setNewMemberName("");
    setNewMemberWhatsapp("");
    fetchMembers();
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm(t("management.choir.confirmDeleteSinger"))) return;
    await fetch(`${API_URL}/members/${id}`, { method: "DELETE" });
    fetchMembers();
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    if (!newDate) return;

    await fetch(`${API_URL}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_date: newDate, notes: newNotes }),
    });

    setNewDate("");
    setNewNotes("");
    fetchSessions();
  };

  const handleDeleteSession = async (id) => {
    if (!window.confirm(t("management.choir.confirmDeletePractice"))) return;
    await fetch(`${API_URL}/sessions/${id}`, { method: "DELETE" });
    if (selectedSession?.id === id) {
      setSelectedSession(null);
      setAttendance([]);
    }
    fetchSessions();
  };

  const handleMarkPresent = async (e) => {
    e.preventDefault();
    if (!chosenMemberId || !selectedSession) return;

    await fetch(`${API_URL}/sessions/${selectedSession.id}/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ choir_member_id: chosenMemberId }),
    });

    setChosenMemberId("");
    fetchAttendance(selectedSession.id);
  };

  const handleRemoveAttendance = async (id) => {
    await fetch(`${API_URL}/attendance/${id}`, { method: "DELETE" });
    fetchAttendance(selectedSession.id);
  };

  return (
    <div className="space-y-10">
      {/* --- Roster --- */}
      <div>
        <h2 className="text-white font-bold text-lg mb-4">{t("management.choir.rosterTitle")}</h2>

        <form onSubmit={handleAddMember} className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 space-y-4 mb-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">{t("management.choir.name")}</label>
              <input
                type="text" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">{t("management.choir.whatsapp")}</label>
              <input
                type="text" value={newMemberWhatsapp} onChange={(e) => setNewMemberWhatsapp(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition">
            {t("management.choir.addSinger")}
          </button>
        </form>

        {members.length === 0 ? (
          <p className="text-slate-400 text-sm">{t("management.choir.noSingers")}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {members.map((m) => (
              <div key={m.id} className="bg-white/5 border border-white/10 rounded-full pl-4 pr-2 py-1.5 flex items-center gap-2">
                <span className="text-white text-sm">{m.name}</span>
                <button onClick={() => handleDeleteMember(m.id)} className="text-red-300 hover:text-red-200 text-xs w-5 h-5 flex items-center justify-center">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Practices + attendance --- */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-white font-bold text-lg mb-4">{t("management.choir.practicesTitle")}</h2>

          <form onSubmit={handleAddSession} className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 space-y-4 mb-6">
            <div>
              <label className="block text-xs text-slate-400 mb-1">{t("management.choir.date")}</label>
              <input
                type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">{t("management.choir.notes")}</label>
              <input
                type="text" value={newNotes} onChange={(e) => setNewNotes(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition">
              {t("management.choir.addPractice")}
            </button>
          </form>

          {sessions.length === 0 ? (
            <p className="text-slate-400 text-sm">{t("management.choir.noPractices")}</p>
          ) : (
            <div className="space-y-2">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleSelectSession(s)}
                  className={`cursor-pointer rounded-xl p-4 border transition flex justify-between items-center ${
                    selectedSession?.id === s.id
                      ? "bg-blue-600/20 border-blue-500/50"
                      : "bg-white/5 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div>
                    <p className="text-white font-semibold text-sm">{s.session_date?.slice(0, 10)}</p>
                    {s.notes && <p className="text-slate-400 text-xs mt-1">{s.notes}</p>}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteSession(s.id); }}
                    className="text-red-300 hover:text-red-200 text-xs shrink-0"
                  >
                    {t("management.choir.remove")}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-white font-bold text-lg mb-4">{t("management.choir.attendance")}</h2>

          {!selectedSession ? (
            <p className="text-slate-400 text-sm">{t("management.choir.selectPractice")}</p>
          ) : (
            <>
              <form onSubmit={handleMarkPresent} className="flex gap-2 mb-5">
                <select
                  value={chosenMemberId}
                  onChange={(e) => setChosenMemberId(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
                >
                  <option value="" className="text-black">{t("management.choir.choose")}</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id} className="text-black">{m.name}</option>
                  ))}
                </select>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition">
                  {t("management.choir.markPresent")}
                </button>
              </form>

              {attendance.length === 0 ? (
                <p className="text-slate-400 text-sm">{t("management.choir.noAttendance")}</p>
              ) : (
                <div className="space-y-2">
                  {attendance.map((a) => (
                    <div key={a.id} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex justify-between items-center">
                      <span className="text-white text-sm">{a.name}</span>
                      <button onClick={() => handleRemoveAttendance(a.id)} className="text-red-300 hover:text-red-200 text-xs">
                        {t("management.choir.remove")}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChoirTab;
