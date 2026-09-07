import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";

const BASE_URL = "http://127.0.0.1:5000";
const API_URL = `${BASE_URL}/api/sermons`;

const emptyForm = {
  title: "",
  speaker: "",
  description: "",
  sermon_date: "",
};

const AdminSermons = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);

  const fetchSermons = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setSermons(data);
    } catch (err) {
      setError("Could not load sermons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSermons();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Please choose an audio or video file to upload.");
      return;
    }

    const body = new FormData();
    body.append("file", file);
    body.append("title", form.title);
    body.append("speaker", form.speaker);
    body.append("description", form.description);
    body.append("sermon_date", form.sermon_date);

    setUploading(true);
    try {
      const response = await fetch(API_URL, { method: "POST", body });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }

      resetForm();
      fetchSermons(); // reload the list to show the new sermon
    } catch (err) {
      setError(err.message || "Something went wrong while uploading.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this sermon? This cannot be undone.");
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      fetchSermons();
    } catch (err) {
      setError("Could not delete that sermon.");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-5 py-16 md:py-24">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Manage Sermons
        </h1>
        <p className="text-slate-400 text-sm mb-10">
          Upload a sermon recording (audio or video) and it appears instantly on the public Sermons page.
        </p>

        {/* --- Upload form --- */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sm:p-8 space-y-5 mb-12"
        >
          <h2 className="text-white font-bold text-lg">Upload New Sermon</h2>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Audio or Video File</label>
            <input
              type="file"
              accept="audio/*,video/*"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-semibold hover:file:bg-blue-700 file:cursor-pointer"
            />
            <p className="text-slate-500 text-xs mt-2">Maximum file size: 200MB.</p>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Speaker</label>
            <input
              type="text"
              name="speaker"
              value={form.speaker}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Date</label>
            <input
              type="date"
              name="sermon_date"
              value={form.sermon_date}
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Description (optional)</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            {uploading ? "Uploading..." : "Upload Sermon"}
          </button>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>

        {/* --- Existing sermons list --- */}
        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : (
          <div className="space-y-4">
            {sermons.map((s) => (
              <div
                key={s.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <h3 className="text-white font-semibold truncate">{s.title}</h3>
                  <p className="text-slate-400 text-sm mt-1">
                    {s.speaker}
                    {s.sermon_date && ` · ${new Date(s.sermon_date).toLocaleDateString()}`}
                  </p>
                  <p className="text-slate-500 text-xs mt-1 uppercase tracking-wide">{s.file_type}</p>
                </div>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="bg-red-600/30 text-red-200 px-4 py-2 rounded-lg text-sm hover:bg-red-600/50 transition shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AdminSermons;
