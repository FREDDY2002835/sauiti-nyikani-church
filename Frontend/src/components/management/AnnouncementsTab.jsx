import { API_URL as API_ROOT } from "../../config/api";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const API_URL = `${API_ROOT}/announcements`;

const AnnouncementsTab = () => {
  const { t } = useTranslation();
  const today = new Date().toISOString().slice(0, 10);
  const empty = { title: "", message: "", announcement_date: today };
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);

  const fetchAnnouncements = async () => {
    const res = await fetch(API_URL);
    if (res.ok) setAnnouncements(await res.json());
  };
  useEffect(() => { fetchAnnouncements(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(empty);
    setEditingId(null);
    fetchAnnouncements();
  };

  const editAnnouncement = (item) => {
    setEditingId(item.id);
    setForm({ title: item.title, message: item.message, announcement_date: String(item.announcement_date).slice(0, 10) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteAnnouncement = async (id) => {
    if (!window.confirm(t("management.announcements.confirmDelete"))) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchAnnouncements();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sm:p-8 mb-8">
        <div className="grid md:grid-cols-[1fr_180px] gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("management.announcements.title")}</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder={t("management.announcements.titlePlaceholder")} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("management.announcements.date")}</label>
            <input type="date" value={form.announcement_date} onChange={(e) => setForm({ ...form, announcement_date: e.target.value })} required className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400" />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-xs text-slate-400 mb-1">{t("management.announcements.message")}</label>
          <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} placeholder={t("management.announcements.messagePlaceholder")} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400 resize-y" />
        </div>
        <div className="flex gap-3 mt-4">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm">{editingId ? t("management.announcements.update") : t("management.announcements.add")}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(empty); }} className="bg-white/10 text-white px-6 py-2.5 rounded-xl font-semibold text-sm">{t("management.announcements.cancel")}</button>}
        </div>
      </form>

      {announcements.length === 0 ? <p className="text-slate-400 text-sm">{t("management.announcements.empty")}</p> : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <article key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                <div>
                  <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                  <p className="text-blue-300 text-xs mt-1">{new Date(`${String(item.announcement_date).slice(0, 10)}T00:00:00`).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button onClick={() => editAnnouncement(item)} className="text-blue-300 hover:text-blue-200 text-xs">{t("management.announcements.edit")}</button>
                  <button onClick={() => deleteAnnouncement(item.id)} className="text-red-300 hover:text-red-200 text-xs">{t("management.announcements.delete")}</button>
                </div>
              </div>
              <p className="text-slate-300 text-sm mt-4 whitespace-pre-wrap">{item.message}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
export default AnnouncementsTab;
