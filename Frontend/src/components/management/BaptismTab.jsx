import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const API_URL = "http://127.0.0.1:5000/api/baptisms";

const BaptismTab = () => {
  const { t } = useTranslation();

  const [records, setRecords] = useState([]);
  const [year, setYear] = useState("");

  const [form, setForm] = useState({ member_name: "", method: "", baptism_date: "" });

  const fetchRecords = async () => {
    const params = new URLSearchParams();
    if (year) params.set("year", year);

    const res = await fetch(`${API_URL}?${params.toString()}`);
    setRecords(await res.json());
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.member_name.trim() || !form.baptism_date) return;

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ member_name: "", method: "", baptism_date: "" });
    fetchRecords();
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("management.baptism.confirmDelete"))) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchRecords();
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sm:p-8 space-y-4 mb-8"
      >
        <h2 className="text-white font-bold text-lg">{t("management.baptism.addRecord")}</h2>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("management.baptism.name")}</label>
            <input
              type="text" name="member_name" value={form.member_name} onChange={handleChange} required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("management.baptism.method")}</label>
            <input
              type="text" name="method" value={form.method} onChange={handleChange}
              placeholder={t("management.baptism.methodPlaceholder")}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("management.baptism.date")}</label>
            <input
              type="date" name="baptism_date" value={form.baptism_date} onChange={handleChange} required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition">
          {t("management.baptism.addRecord")}
        </button>
      </form>

      {/* --- Filter --- */}
      <div className="flex flex-wrap gap-3 items-end mb-6">
        <div>
          <label className="block text-xs text-slate-400 mb-1">{t("management.baptism.filterYear")}</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder={t("management.baptism.allYears")}
            className="w-32 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
          />
        </div>
      </div>

      {records.length === 0 ? (
        <p className="text-slate-400 text-sm">{t("management.baptism.noRecords")}</p>
      ) : (
        <div className="space-y-2">
          {records.map((r) => (
            <div key={r.id} className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 flex justify-between items-center">
              <div>
                <p className="text-white font-semibold text-sm">{r.member_name}</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {r.baptism_date?.slice(0, 10)}{r.method ? ` — ${r.method}` : ""}
                </p>
              </div>
              <button onClick={() => handleDelete(r.id)} className="text-red-300 hover:text-red-200 text-xs">
                {t("management.baptism.delete")}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BaptismTab;
