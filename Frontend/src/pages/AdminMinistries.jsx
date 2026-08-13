import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";

const API_URL = "http://127.0.0.1:5000/api/ministries";

const emptyForm = {
  name_en: "", description_en: "",
  name_fr: "", description_fr: "",
  name_sw: "", description_sw: "",
  sort_order: 0,
};

const AdminMinistries = () => {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state - used for BOTH adding a new ministry and editing an
  // existing one. editingId tells us which mode we're in: null means
  // "adding new", any other value means "editing that ministry".
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const fetchMinistries = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setMinistries(data);
    } catch (err) {
      setError("Could not load ministries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinistries();
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
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Save failed");
      }

      resetForm();
      fetchMinistries(); // reload the list to show the change
    } catch (err) {
      setError("Something went wrong while saving. Make sure every language field is filled in.");
    }
  };

  const handleEdit = (ministry) => {
    setForm({
      name_en: ministry.name_en,
      description_en: ministry.description_en,
      name_fr: ministry.name_fr,
      description_fr: ministry.description_fr,
      name_sw: ministry.name_sw,
      description_sw: ministry.description_sw,
      sort_order: ministry.sort_order,
    });
    setEditingId(ministry.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this ministry? This cannot be undone.");
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      fetchMinistries();
    } catch (err) {
      setError("Could not delete that ministry.");
    }
  };

  // A small reusable pair of inputs for one language - keeps the form
  // below from repeating the same six lines of JSX three times.
  const LanguageFields = ({ label, nameField, descField }) => (
    <div className="border border-white/10 rounded-2xl p-4">
      <p className="text-blue-300 text-xs font-semibold uppercase tracking-wide mb-3">{label}</p>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Name</label>
          <input
            type="text"
            name={nameField}
            value={form[nameField]}
            onChange={handleChange}
            required
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-400"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Description</label>
          <textarea
            name={descField}
            value={form[descField]}
            onChange={handleChange}
            required
            rows={2}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-5 py-16 md:py-24">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Manage Ministries
        </h1>
        <p className="text-slate-400 text-sm mb-10">
          Changes here update instantly on the public Ministries page, in all three languages.
        </p>

        {/* --- Add / Edit form --- */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sm:p-8 space-y-5 mb-12"
        >
          <h2 className="text-white font-bold text-lg">
            {editingId ? "Edit Ministry" : "Add New Ministry"}
          </h2>
          <p className="text-slate-400 text-xs">
            Fill in the name and description in all three languages below.
          </p>

          <LanguageFields label="English" nameField="name_en" descField="description_en" />
          <LanguageFields label="Français" nameField="name_fr" descField="description_fr" />
          <LanguageFields label="Kiswahili" nameField="name_sw" descField="description_sw" />

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Display Order (lower numbers show first)
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
              {editingId ? "Save Changes" : "Add Ministry"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold transition hover:bg-white/20"
              >
                Cancel
              </button>
            )}
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>

        {/* --- Existing ministries list --- */}
        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : (
          <div className="space-y-4">
            {ministries.map((m) => (
              <div
                key={m.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start justify-between gap-4"
              >
                <div>
                  <h3 className="text-white font-semibold">{m.name_en}</h3>
                  <p className="text-slate-400 text-sm mt-1">{m.description_en}</p>
                  <p className="text-slate-500 text-xs mt-2">Order: {m.sort_order}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(m)}
                    className="bg-blue-600/30 text-blue-200 px-4 py-2 rounded-lg text-sm hover:bg-blue-600/50 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="bg-red-600/30 text-red-200 px-4 py-2 rounded-lg text-sm hover:bg-red-600/50 transition"
                  >
                    Delete
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
