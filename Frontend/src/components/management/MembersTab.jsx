import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const API_URL = "http://127.0.0.1:5000/api/members";
const emptyForm = { name: "", whatsapp: "", email: "", address: "", status: "" };

const MembersTab = () => {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      setMembers(await res.json());
    } catch {
      // silently keep the previous list on failure
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    if (editingId) {
      await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    resetForm();
    fetchMembers();
  };

  const handleEdit = (member) => {
    setForm({
      name: member.name,
      whatsapp: member.whatsapp || "",
      email: member.email || "",
      address: member.address || "",
      status: member.status || "",
    });
    setEditingId(member.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("management.members.confirmDelete"))) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchMembers();
  };

  // Turns "+243 812 345 678" into a wa.me link WhatsApp accepts
  // (digits only, no spaces or plus sign).
  const whatsappLink = (number) => `https://wa.me/${number.replace(/[^\d]/g, "")}`;

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sm:p-8 space-y-4 mb-10"
      >
        <h2 className="text-white font-bold text-lg">
          {editingId ? t("management.members.edit") : t("management.members.addNew")}
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("management.members.name")}</label>
            <input
              type="text" name="name" value={form.name} onChange={handleChange} required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("management.members.whatsapp")}</label>
            <input
              type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange}
              placeholder="243812345678"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            />
            <p className="text-slate-500 text-[11px] mt-1">
              Country code + number, no leading 0, no spaces (e.g. Congo: 0812345678 → 243812345678)
            </p>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("management.members.email")}</label>
            <input
              type="email" name="email" value={form.email} onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("management.members.address")}</label>
            <input
              type="text" name="address" value={form.address} onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("management.members.status")}</label>
            <input
              type="text" name="status" value={form.status} onChange={handleChange}
              placeholder={t("management.members.statusPlaceholder")}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition">
            {t("management.members.save")}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold text-sm transition hover:bg-white/20">
              {t("management.members.cancel")}
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-slate-400 text-sm">...</p>
      ) : members.length === 0 ? (
        <p className="text-slate-400 text-sm">{t("management.members.empty")}</p>
      ) : (
        <div className="space-y-3">
          {members.map((m) => (
            <div key={m.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[160px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white font-semibold">{m.name}</h3>
                  {m.status && (
                    <span className="bg-blue-600/30 text-blue-200 text-[11px] px-2 py-0.5 rounded-full">
                      {m.status}
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-xs mt-1">{m.email}</p>
                <p className="text-slate-400 text-xs">{m.address}</p>
              </div>

              {m.whatsapp && (
                <a
                  href={whatsappLink(m.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600/30 text-green-200 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-green-600/50 transition"
                >
                  {t("management.members.chatOnWhatsapp")}
                </a>
              )}

              <div className="flex gap-2">
                <button onClick={() => handleEdit(m)} className="bg-blue-600/30 text-blue-200 px-4 py-2 rounded-lg text-xs hover:bg-blue-600/50 transition">
                  {t("management.members.edit")}
                </button>
                <button onClick={() => handleDelete(m.id)} className="bg-red-600/30 text-red-200 px-4 py-2 rounded-lg text-xs hover:bg-red-600/50 transition">
                  {t("management.members.delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MembersTab;
