import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";

const BASE_URL = "http://127.0.0.1:5000";
const API_URL = `${BASE_URL}/api/gallery`;

const emptyForm = {
  caption_en: "",
  caption_fr: "",
  caption_sw: "",
  sort_order: 0,
};

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state - used for BOTH uploading a new photo and editing an
  // existing one's captions. editingId tells us which mode we're in:
  // null means "uploading new", any other value means "editing that photo".
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setImages(data);
    } catch (err) {
      setError("Could not load the gallery.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setFile(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingId) {
        // Editing only changes captions/order - not the image itself.
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!response.ok) throw new Error("Save failed");
      } else {
        // Uploading a new photo sends the actual file, so this has to
        // be FormData instead of JSON - the browser sets the right
        // Content-Type (multipart/form-data) automatically.
        if (!file) {
          setError("Please choose a photo to upload.");
          return;
        }

        const body = new FormData();
        body.append("image", file);
        body.append("caption_en", form.caption_en);
        body.append("caption_fr", form.caption_fr);
        body.append("caption_sw", form.caption_sw);
        body.append("sort_order", form.sort_order);

        const response = await fetch(API_URL, { method: "POST", body });
        if (!response.ok) throw new Error("Upload failed");
      }

      resetForm();
      fetchImages(); // reload the list to show the change
    } catch (err) {
      setError("Something went wrong while saving.");
    }
  };

  const handleEdit = (image) => {
    setForm({
      caption_en: image.caption_en,
      caption_fr: image.caption_fr,
      caption_sw: image.caption_sw,
      sort_order: image.sort_order,
    });
    setFile(null);
    setEditingId(image.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this photo? This cannot be undone.");
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      fetchImages();
    } catch (err) {
      setError("Could not delete that photo.");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-5 py-16 md:py-24">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Manage Gallery
        </h1>
        <p className="text-slate-400 text-sm mb-10">
          Changes here update instantly on the public Gallery page, in all three languages.
        </p>

        {/* --- Upload / Edit form --- */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sm:p-8 space-y-5 mb-12"
        >
          <h2 className="text-white font-bold text-lg">
            {editingId ? "Edit Photo" : "Upload New Photo"}
          </h2>

          {editingId ? (
            <p className="text-slate-400 text-xs">
              You're editing captions only. To replace the actual photo, delete it below and upload a new one.
            </p>
          ) : (
            <div>
              <label className="block text-sm text-slate-300 mb-2">Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                required
                className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:font-semibold hover:file:bg-blue-700 file:cursor-pointer"
              />
            </div>
          )}

          <div className="border border-white/10 rounded-2xl p-4 space-y-3">
            <p className="text-blue-300 text-xs font-semibold uppercase tracking-wide">
              Captions (optional)
            </p>

            <div>
              <label className="block text-xs text-slate-400 mb-1">English</label>
              <input
                type="text"
                name="caption_en"
                value={form.caption_en}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Français</label>
              <input
                type="text"
                name="caption_fr"
                value={form.caption_fr}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Kiswahili</label>
              <input
                type="text"
                name="caption_sw"
                value={form.caption_sw}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

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
              {editingId ? "Save Changes" : "Upload Photo"}
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

        {/* --- Existing photos list --- */}
        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : (
          <div className="space-y-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4"
              >
                <img
                  src={`${BASE_URL}${img.image_url}`}
                  alt={img.caption_en || "Gallery photo"}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">
                    {img.caption_en || "(no caption)"}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1">Order: {img.sort_order}</p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleEdit(img)}
                    className="bg-blue-600/30 text-blue-200 px-4 py-2 rounded-lg text-sm hover:bg-blue-600/50 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
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

export default AdminGallery;
