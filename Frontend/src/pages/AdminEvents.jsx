import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";

const BASE_URL = "http://127.0.0.1:5000";
const API_URL = `${BASE_URL}/api/events`;

const emptyForm = {
  title_en: "",
  description_en: "",
  location_en: "",
  event_date: "",
  event_time: "",
};

const AdminEvents = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(t("events.loading"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }

      resetForm();
      fetchEvents(); // reload the list to show the change
    } catch (err) {
      setError(err.message || "Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (event) => {
    setForm({
      title_en: event.title_en || "",
      description_en: event.description_en || "",
      location_en: event.location_en || "",
      event_date: event.event_date ? event.event_date.split("T")[0] : "",
      event_time: event.event_time || "",
    });
    setEditingId(event.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(t("events.confirmDelete"));
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      fetchEvents();
    } catch (err) {
      setError("Could not delete that event.");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-5 py-16 md:py-24">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          {t("events.adminTitle")}
        </h1>
        <p className="text-slate-400 text-sm mb-10">
          Type the details in English below - French and Swahili are filled in automatically.
        </p>

        {/* --- Add / Edit form --- */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sm:p-8 space-y-5 mb-12"
        >
          <h2 className="text-white font-bold text-lg">
            {editingId ? t("events.edit") : t("events.addNew")}
          </h2>

          <div>
            <label className="block text-sm text-slate-300 mb-2">{t("events.formTitle")}</label>
            <input
              type="text"
              name="title_en"
              value={form.title_en}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">{t("events.formLocation")}</label>
            <input
              type="text"
              name="location_en"
              value={form.location_en}
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">{t("events.formDescription")}</label>
            <textarea
              name="description_en"
              value={form.description_en}
              onChange={handleChange}
              rows={3}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">{t("events.formDate")}</label>
            <input
              type="date"
              name="event_date"
              value={form.event_date}
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">{t("events.formTime")}</label>
            <input
              type="text"
              name="event_time"
              value={form.event_time}
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              {saving ? "Translating & saving..." : editingId ? t("events.save") : t("events.add")}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold transition hover:bg-white/20"
              >
                {t("events.cancel")}
              </button>
            )}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>

        {/* --- Existing events list --- */}
        {loading ? (
          <p className="text-slate-400">{t("events.loading")}</p>
        ) : (
          <div className="space-y-4">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <h3 className="text-white font-semibold truncate">{ev[`title_${lang}`] || ev.title_en}</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    {ev.event_date && new Date(ev.event_date).toLocaleDateString()}
                    {ev.event_time && ` · ${ev.event_time}`}
                  </p>
                  {(ev[`location_${lang}`] || ev.location_en) && (
                    <p className="text-slate-500 text-xs mt-1">{ev[`location_${lang}`] || ev.location_en}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(ev)}
                    className="bg-blue-600/30 text-blue-200 px-4 py-2 rounded-lg text-sm hover:bg-blue-600/50 transition"
                  >
                    {t("events.edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="bg-red-600/30 text-red-200 px-4 py-2 rounded-lg text-sm hover:bg-red-600/50 transition"
                  >
                    {t("events.delete")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminEvents;
