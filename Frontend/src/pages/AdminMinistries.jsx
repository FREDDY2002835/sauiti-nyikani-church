import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";

const API_URL = "http://127.0.0.1:5000/api/ministries";

const emptyForm = { name: "", description: "", leader_name: "", sort_order: 0 };

const AdminMinistries = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state - used for BOTH adding a new ministry and editing an
  // existing one. editingId tells us which mode we're in: null means
  // "adding new", any other value means "editing that ministry". The
  // form only ever holds ONE language's text at a time - whichever
  // language the site is currently set to (see the language switcher
  // in the navbar). Switching the site's language and editing the same
  // ministry again lets you fill in that language's translation.
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const fetchMinistries = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setMinistries(data);
    } catch (err) {
      setError(t("management.ministriesAdmin.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinistries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    try {
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, language: lang }),
      });

      if (!response.ok) {
        throw new Error("Save failed");
      }

      resetForm();
      fetchMinistries(); // reload the list to show the change
    } catch (err) {
      setError(t("management.ministriesAdmin.saveError"));
    }
  };

  // Loads this ministry's text for whichever language is currently
  // active - not always English - so editing in French shows the
  // existing French text (which may still be blank if nobody has
  // translated it yet).
  const handleEdit = (ministry) => {
    setForm({
      name: ministry[`name_${lang}`] || "",
      description: ministry[`description_${lang}`] || "",
      leader_name: ministry.leader_name || "",
      sort_order: ministry.sort_order,
    });
    setEditingId(ministry.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(t("management.ministriesAdmin.confirmDelete"));
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      fetchMinistries();
    } catch (err) {
      setError(t("management.ministriesAdmin.deleteError"));
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-5 py-16 md:py-24">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          {t("management.ministriesAdmin.title")}
        </h1>
        <p className="text-slate-400 text-sm mb-10">
          {t("management.ministriesAdmin.subtitle")}
        </p>

        {/* --- Add / Edit form --- */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sm:p-8 space-y-5 mb-12"
        >
          <h2 className="text-white font-bold text-lg">
            {editingId ? t("management.ministriesAdmin.editTitle") : t("management.ministriesAdmin.addNew")}
          </h2>
          <p className="text-slate-400 text-xs">
            {t("management.ministriesAdmin.fillHint")}
          </p>

          <div className="border border-white/10 rounded-2xl p-4">
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">{t("management.ministriesAdmin.name")}</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">{t("management.ministriesAdmin.description")}</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={2}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">{t("management.ministriesAdmin.leader")}</label>
            <input
              type="text"
              name="leader_name"
              value={form.leader_name}
              onChange={handleChange}
              placeholder={t("management.ministriesAdmin.leaderPlaceholder")}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              {t("management.ministriesAdmin.displayOrder")}
            </label>
            <input
              type="number"
              name="sort_order"
              value={form.sort_order}
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              {editingId ? t("management.ministriesAdmin.save") : t("management.ministriesAdmin.add")}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold transition hover:bg-white/20"
              >
                {t("management.ministriesAdmin.cancel")}
              </button>
            )}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>

        {/* --- Existing ministries list --- */}
        {loading ? (
          <p className="text-slate-400">{t("management.ministriesAdmin.loading")}</p>
        ) : (
          <div className="space-y-4">
            {ministries.map((m) => (
              <div
                key={m.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start justify-between gap-4"
              >
                <div>
                  <h3 className="text-white font-semibold">{m[`name_${lang}`] || m.name_en}</h3>
                  <p className="text-slate-400 text-sm mt-1">{m[`description_${lang}`] || m.description_en}</p>
                  {m.leader_name && (
                    <p className="text-blue-300 text-xs mt-2">
                      {t("management.ministriesAdmin.leaderLabel")}: {m.leader_name}
                    </p>
                  )}
                  <p className="text-slate-500 text-xs mt-1">{t("management.ministriesAdmin.order")}: {m.sort_order}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    to={`/admin/ministries/${m.id}`}
                    className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg text-sm hover:bg-white/20 transition"
                  >
                    {t("management.ministriesAdmin.manageDetails")}
                  </Link>
                  <button
                    onClick={() => handleEdit(m)}
                    className="bg-blue-600/30 text-blue-200 px-4 py-2 rounded-lg text-sm hover:bg-blue-600/50 transition"
                  >
                    {t("management.ministriesAdmin.edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="bg-red-600/30 text-red-200 px-4 py-2 rounded-lg text-sm hover:bg-red-600/50 transition"
                  >
                    {t("management.ministriesAdmin.delete")}
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

export default AdminMinistries;
