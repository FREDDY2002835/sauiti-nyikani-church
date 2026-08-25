import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const API_URL = "http://127.0.0.1:5000/api/tithes";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TitheTab = () => {
  const { t } = useTranslation();
  const now = new Date();

  const [records, setRecords] = useState([]);
  const [year, setYear] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(String(now.getMonth() + 1));

  const [form, setForm] = useState({ member_name: "", amount: "", payment_date: "" });

  const fetchRecords = async () => {
    const params = new URLSearchParams();
    if (year) params.set("year", year);
    if (month) params.set("month", month);

    const res = await fetch(`${API_URL}?${params.toString()}`);
    setRecords(await res.json());
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.member_name.trim() || !form.amount || !form.payment_date) return;

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ member_name: "", amount: "", payment_date: "" });
    fetchRecords();
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("management.tithe.confirmDelete"))) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchRecords();
  };

  const total = records.reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sm:p-8 space-y-4 mb-8"
      >
        <h2 className="text-white font-bold text-lg">{t("management.tithe.addRecord")}</h2>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("management.tithe.name")}</label>
            <input
              type="text" name="member_name" value={form.member_name} onChange={handleChange} required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("management.tithe.amount")}</label>
            <input
              type="number" step="0.01" name="amount" value={form.amount} onChange={handleChange} required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("management.tithe.date")}</label>
            <input
              type="date" name="payment_date" value={form.payment_date} onChange={handleChange} required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition">
          {t("management.tithe.addRecord")}
        </button>
      </form>

      {/* --- Filters --- */}
      <div className="flex flex-wrap gap-3 items-end mb-6">
        <div>
          <label className="block text-xs text-slate-400 mb-1">{t("management.tithe.filterMonth")}</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
          >
            <option value="" className="text-black">{t("management.tithe.allMonths")}</option>
            {MONTH_NAMES.map((name, i) => (
              <option key={i} value={i + 1} className="text-black">{name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">{t("management.tithe.filterYear")}</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-28 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
          />
        </div>

        <div className="ml-auto text-right">
          <p className="text-xs text-slate-400">{t("management.tithe.total")}</p>
          <p className="text-white font-bold text-lg">{total.toLocaleString()}</p>
        </div>
      </div>

      {records.length === 0 ? (
        <p className="text-slate-400 text-sm">{t("management.tithe.noRecords")}</p>
      ) : (
        <div className="space-y-2">
          {records.map((r) => (
            <div key={r.id} className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 flex justify-between items-center">
              <div>
                <p className="text-white font-semibold text-sm">{r.member_name}</p>
                <p className="text-slate-400 text-xs mt-0.5">{r.payment_date?.slice(0, 10)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white font-semibold">{Number(r.amount).toLocaleString()}</span>
                <button onClick={() => handleDelete(r.id)} className="text-red-300 hover:text-red-200 text-xs">
                  {t("management.tithe.delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TitheTab;
