import { API_URL as API_ROOT } from "../../config/api";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaCheck } from "react-icons/fa";

const API_URL = `${API_ROOT}/choir`;

const ChoirTab = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [addingGroup, setAddingGroup] = useState(false);
  const [groupError, setGroupError] = useState(null);

  const [members, setMembers] = useState([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberWhatsapp, setNewMemberWhatsapp] = useState("");

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const fetchGroups = async () => {
    const res = await fetch(`${API_URL}/groups`);
    const data = await res.json();
    setGroups(data);
    // Keep whatever choir is currently selected if it still exists;
    // otherwise default to the first one in the list.
    setSelectedGroup((current) => {
      if (current && data.some((g) => g.slug === current)) return current;
      return data[0]?.slug || null;
    });
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleAddGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    setGroupError(null);
    setAddingGroup(true);
    try {
      const res = await fetch(`${API_URL}/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name_en: newGroupName }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not add that choir.");
      }
      const created = await res.json();
      setNewGroupName("");
      await fetchGroups();
      setSelectedGroup(created.slug); // jump straight to the new choir
    } catch (err) {
      setGroupError(err.message);
    } finally {
      setAddingGroup(false);
    }
  };

  const handleDeleteGroup = async (group) => {
    if (!window.confirm(`Remove "${group.name_en}"? Its members and practice records are kept but won't be visible until it's re-added.`)) return;
    await fetch(`${API_URL}/groups/${group.id}`, { method: "DELETE" });
    fetchGroups();
  };


  const fetchMembers = async (group) => {
    const res = await fetch(`${API_URL}/members?group=${group}`);
    setMembers(await res.json());
  };

  const fetchSessions = async (group) => {
    const res = await fetch(`${API_URL}/sessions?group=${group}`);
    setSessions(await res.json());
  };

  // Whenever the selected choir changes, reload its roster/sessions and
  // clear whatever practice/attendance was open for the previous choir.
  useEffect(() => {
    if (!selectedGroup) return;
    fetchMembers(selectedGroup);
    fetchSessions(selectedGroup);
    setSelectedSession(null);
    setAttendance([]);
  }, [selectedGroup]);

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

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    await fetch(`${API_URL}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newMemberName,
        whatsapp: newMemberWhatsapp,
        group_name: selectedGroup,
      }),
    });

    setNewMemberName("");
    setNewMemberWhatsapp("");
    fetchMembers(selectedGroup);
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm(t("management.choir.confirmDeleteSinger"))) return;
    await fetch(`${API_URL}/members/${id}`, { method: "DELETE" });
    fetchMembers(selectedGroup);
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    if (!newDate) return;

    await fetch(`${API_URL}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_date: newDate,
        notes: newNotes,
        group_name: selectedGroup,
      }),
    });

    setNewDate("");
    setNewNotes("");
    fetchSessions(selectedGroup);
  };

  const handleDeleteSession = async (id) => {
    if (!window.confirm(t("management.choir.confirmDeletePractice"))) return;
    await fetch(`${API_URL}/sessions/${id}`, { method: "DELETE" });
    if (selectedSession?.id === id) {
      setSelectedSession(null);
      setAttendance([]);
    }
    fetchSessions(selectedGroup);
  };

  const handleToggleAttendance = async (member, existingRecord) => {
    if (existingRecord) {
      await fetch(`${API_URL}/attendance/${existingRecord.id}`, { method: "DELETE" });
    } else {
      await fetch(`${API_URL}/sessions/${selectedSession.id}/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choir_member_id: member.id }),
      });
    }
    fetchAttendance(selectedSession.id);
  };

  return (
    <div className="space-y-10">
      {/* --- Choir group switcher --- */}
      <div>
        <div className="flex flex-wrap gap-2 mb-4">
          {groups.map((group) => (
            <div key={group.id} className="relative group/tab">
              <button
                onClick={() => setSelectedGroup(group.slug)}
                className={`px-4 py-2 pr-7 rounded-xl text-sm font-semibold transition ${
                  selectedGroup === group.slug
                    ? "bg-blue-600 text-white"
                    : "bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {group[`name_${lang}`] || group.name_en}
              </button>
              <button
                onClick={() => handleDeleteGroup(group)}
                title="Remove this choir"
                className="absolute top-1/2 -translate-y-1/2 right-2 text-xs opacity-0 group-hover/tab:opacity-70 hover:!opacity-100 transition"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddGroup} className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="e.g. Cathedral Choir"
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-400"
          />
          <button
            type="submit"
            disabled={addingGroup}
            className="bg-white/10 border border-white/20 hover:bg-white/20 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
          >
            {addingGroup ? "Adding..." : "+ Add Choir"}
          </button>
        </form>
        {groupError && <p className="text-red-400 text-xs mt-2">{groupError}</p>}
      </div>

      {/* --- Roster --- */}
      <div>
        <h2 className="text-white font-bold text-lg mb-4">
          {t("management.choir.rosterTitle")} — {groups.find((g) => g.slug === selectedGroup)?.[`name_${lang}`] || ""}
        </h2>

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
          ) : members.length === 0 ? (
            <p className="text-slate-400 text-sm">{t("management.choir.noSingers")}</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {members.map((m) => {
                const record = attendance.find((a) => a.choir_member_id === m.id);
                const isPresent = Boolean(record);

                return (
                  <label
                    key={m.id}
                    className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 cursor-pointer hover:bg-white/10 transition"
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
    </div>
  );
};

export default ChoirTab;
