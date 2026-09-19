import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaCheck } from "react-icons/fa";

const API_URL = "http://127.0.0.1:5000/api/communion";
const MEMBERS_URL = "http://127.0.0.1:5000/api/members";

const CommunionTab = () => {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [members, setMembers] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newVerse, setNewVerse] = useState("");
  const [attendanceError, setAttendanceError] = useState(null);

  const fetchSessions = async () => {
    const res = await fetch(`${API_URL}/sessions`);
    setSessions(await res.json());
  };

  const fetchMembers = async () => {
    const res = await fetch(MEMBERS_URL);
    setMembers(await res.json());
  };

  useEffect(() => {
    fetchSessions();
    fetchMembers();
  }, []);

  const fetchAttendance = async (sessionId) => {
    try {
      const res = await fetch(`${API_URL}/sessions/${sessionId}/attendance`);
      const data = await res.json();
      setAttendance(Array.isArray(data) ? data : []);
    } catch {
      setAttendance([]);
    }
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

  // Ticking a member: add them if not already marked, remove them if
  // they're already ticked. Communion attendance is stored by name (not
  // linked to a member id), so we match on the name string.
  const handleToggleAttendance = async (member, existingRecord) => {
    setAttendanceError(null);
    try {
      let response;
      if (existingRecord) {
        response = await fetch(`${API_URL}/attendance/${existingRecord.id}`, { method: "DELETE" });
      } else {
        response = await fetch(`${API_URL}/sessions/${selectedSession.id}/attendance`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ member_name: member.name }),
        });
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "The server rejected that request.");
      }

      fetchAttendance(selectedSession.id);
    } catch (err) {
      setAttendanceError(err.message || "Could not update attendance. Check that the backend is running.");
    }
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
                  {s.verse_read && <p className="text-blue-300 text-xs mt-1 italic">{s.verse_read}</p>}
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

      {/* --- Attendance column: tick who attended, from the church's Members list --- */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">{t("management.communion.attendance")}</h2>
          {selectedSession && (
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

        {!selectedSession ? (
          <p className="text-slate-400 text-sm">{t("management.communion.selectSession")}</p>
        ) : members.length === 0 ? (
          <p className="text-slate-400 text-sm">{t("management.communion.noAttendees")}</p>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {members.map((m) => {
              const record = attendance.find((a) => a.member_name === m.name);
              const isPresent = Boolean(record);

              return (
                <label
                  key={m.id}
                  className="relative flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 cursor-pointer hover:bg-white/10 transition"
                >
                  <input
                    type="checkbox"
                    checked={isPresent}
                    onChange={() => handleToggleAttendance(m, record)}
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
  );
};

export default CommunionTab;