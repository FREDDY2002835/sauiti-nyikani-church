import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const API_URL = "http://127.0.0.1:5000/api/communion";

const CommunionTab = () => {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newVerse, setNewVerse] = useState("");
  const [newAttendeeName, setNewAttendeeName] = useState("");

  const fetchSessions = async () => {
    const res = await fetch(`${API_URL}/sessions`);
    setSessions(await res.json());
  };

  useEffect(() => {
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

  const handleAddSession = async (e) => {
    e.preventDefault();
    if (!newDate) return;

    await fetch(`${API_URL}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_date: newDate, notes: newNotes, verse_read: newVerse }),
    });

    setNewDate("");
    setNewNotes("");
    setNewVerse("");
    fetchSessions();
  };

  const handleDeleteSession = async (id) => {
    if (!window.confirm(t("management.communion.confirmDeleteSession"))) return;
    await fetch(`${API_URL}/sessions/${id}`, { method: "DELETE" });
    if (selectedSession?.id === id) {
      setSelectedSession(null);
      setAttendance([]);
    }
    fetchSessions();
  };

  const handleAddAttendee = async (e) => {
    e.preventDefault();
    if (!newAttendeeName.trim() || !selectedSession) return;

    await fetch(`${API_URL}/sessions/${selectedSession.id}/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ member_name: newAttendeeName }),
    });

    setNewAttendeeName("");
    fetchAttendance(selectedSession.id);
  };

  const handleRemoveAttendee = async (id) => {
    await fetch(`${API_URL}/attendance/${id}`, { method: "DELETE" });
    fetchAttendance(selectedSession.id);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* --- Sessions column --- */}
      <div>
        <form
          onSubmit={handleAddSession}
          className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 space-y-4 mb-6"
        >
          <h2 className="text-white font-bold text-lg">{t("management.communion.newSession")}</h2>

          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("management.communion.date")}</label>
            <input
              type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("management.communion.notes")}</label>
            <input
              type="text" value={newNotes} onChange={(e) => setNewNotes(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("management.communion.verseRead")}</label>
            <input
              type="text" value={newVerse} onChange={(e) => setNewVerse(e.target.value)}
              placeholder={t("management.communion.verseReadPlaceholder")}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition">
            {t("management.communion.addSession")}
          </button>
        </form>

        <h3 className="text-slate-300 text-sm font-semibold mb-3">{t("management.communion.sessions")}</h3>

        {sessions.length === 0 ? (
          <p className="text-slate-400 text-sm">{t("management.communion.noSessions")}</p>
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
                  {s.verse_read && (
                    <p className="text-blue-300 text-xs mt-1 italic">{s.verse_read}</p>
                  )}
                  {s.notes && <p className="text-slate-400 text-xs mt-1">{s.notes}</p>}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteSession(s.id); }}
                  className="text-red-300 hover:text-red-200 text-xs shrink-0"
                >
                  {t("management.communion.deleteSession")}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Attendance column --- */}
      <div>
        <h2 className="text-white font-bold text-lg mb-4">{t("management.communion.attendance")}</h2>

        {!selectedSession ? (
          <p className="text-slate-400 text-sm">{t("management.communion.selectSession")}</p>
        ) : (
          <>
            <form onSubmit={handleAddAttendee} className="flex gap-2 mb-5">
              <input
                type="text"
                value={newAttendeeName}
                onChange={(e) => setNewAttendeeName(e.target.value)}
                placeholder={t("management.communion.addAttendee")}
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition">
                {t("management.communion.addPerson")}
              </button>
            </form>

            {attendance.length === 0 ? (
              <p className="text-slate-400 text-sm">{t("management.communion.noAttendees")}</p>
            ) : (
              <div className="space-y-2">
                {attendance.map((a) => (
                  <div key={a.id} className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex justify-between items-center">
                    <span className="text-white text-sm">{a.member_name}</span>
                    <button onClick={() => handleRemoveAttendee(a.id)} className="text-red-300 hover:text-red-200 text-xs">
                      {t("management.communion.remove")}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommunionTab;
