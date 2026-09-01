import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const API_URL = "http://127.0.0.1:5000/api/finance";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const FinanceTab = () => {
  const { t } = useTranslation();
  const now = new Date();

  const [records, setRecords] = useState([]);
  const [year, setYear] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(String(now.getMonth() + 1));

  const [form, setForm] = useState({
    type: "in",
    amount: "",
    description: "",
    transaction_date: "",
  });

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
    if (!form.amount || !form.transaction_date) return;

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ type: "in", amount: "", description: "", transaction_date: "" });
    fetchRecords();
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("management.finance.confirmDelete"))) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchRecords();
  };

  const totalIn = records.filter((r) => r.type === "in").reduce((sum, r) => sum + Number(r.amount), 0);
  const totalOut = records.filter((r) => r.type === "out").reduce((sum, r) => sum + Number(r.amount), 0);
  const balance = totalIn - totalOut;

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sm:p-8 space-y-4 mb-8"
      >
        <h2 className="text-white font-bold text-lg">{t("management.finance.addRecord")}</h2>

        <div className="grid sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("management.finance.type")}</label>
            <select
              name="type" value={form.type} onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="in" className="text-black">{t("management.finance.typeIn")}</option>
              <option value="out" className="text-black">{t("management.finance.typeOut")}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("management.finance.amount")}</label>
            <input
              type="number" step="0.01" name="amount" value={form.amount} onChange={handleChange} required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("management.finance.date")}</label>
            <input
              type="date" name="transaction_date" value={form.transaction_date} onChange={handleChange} required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t("management.finance.description")}</label>
            <input
              type="text" name="description" value={form.description} onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition">
          {t("management.finance.addRecord")}
        </button>
      </form>

      {/* --- Filters + totals --- */}
      <div className="flex flex-wrap gap-3 items-end mb-6">
        <div>
          <label className="block text-xs text-slate-400 mb-1">{t("management.finance.filterMonth")}</label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
          >
            <option value="" className="text-black">{t("management.finance.allMonths")}</option>
            {MONTH_NAMES.map((name, i) => (
              <option key={i} value={i + 1} className="text-black">{name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">{t("management.finance.filterYear")}</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-28 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
          />
        </div>

        <div className="ml-auto flex gap-6 text-right">
          <div>
            <p className="text-xs text-slate-400">{t("management.finance.totalIn")}</p>
            <p className="text-green-400 font-bold text-lg">{totalIn.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">{t("management.finance.totalOut")}</p>
            <p className="text-red-400 font-bold text-lg">{totalOut.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">{t("management.finance.balance")}</p>
            <p className="text-white font-bold text-lg">{balance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {records.length === 0 ? (
        <p className="text-slate-400 text-sm">{t("management.finance.noRecords")}</p>
      ) : (
        <div className="space-y-2">
          {records.map((r) => (
            <div key={r.id} className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 flex justify-between items-center">
              <div>
                <p className="text-white font-semibold text-sm">
                  {r.description || (r.type === "in" ? t("management.finance.typeIn") : t("management.finance.typeOut"))}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">{r.transaction_date?.slice(0, 10)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-semibold ${r.type === "in" ? "text-green-400" : "text-red-400"}`}>
                  {r.type === "in" ? "+" : "-"}{Number(r.amount).toLocaleString()}
                </span>
                <button onClick={() => handleDelete(r.id)} className="text-red-300 hover:text-red-200 text-xs">
                  {t("management.finance.delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FinanceTab;
