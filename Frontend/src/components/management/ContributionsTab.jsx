import { API_URL as API_ROOT } from "../../config/api";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaCheck } from "react-icons/fa";

const API_URL = `${API_ROOT}/contributions`;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const ContributionsTab = () => {
  const { t } = useTranslation();
  const now = new Date();

  const [records, setRecords] = useState([]);
  const [projects, setProjects] = useState([]);
  const [year, setYear] = useState(String(now.getFullYear()));
  const [month, setMonth] = useState(String(now.getMonth() + 1));

  const [form, setForm] = useState({
    contributor_name: "",
    kind: "",
    amount: "",
    contribution_date: "",
    project_id: "",
  });

  const fetchProjects = async () => {
    const res = await fetch(`${API_URL}/projects`);
    setProjects(await res.json());
  };

  const fetchRecords = async () => {
    const params = new URLSearchParams();
    if (year) params.set("year", year);
    if (month) params.set("month", month);

    const res = await fetch(`${API_URL}?${params.toString()}`);
    setRecords(await res.json());
  };

  useEffect(() => {
    fetchRecords();
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.contributor_name.trim() ||
      !form.amount ||
      !form.contribution_date
    ) {
      return;
    }

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      contributor_name: "",
      kind: "",
      amount: "",
      contribution_date: "",
      project_id: "",
    });

    fetchRecords();
  };

  const handleToggleFulfilled = async (id) => {
    await fetch(`${API_URL}/${id}/fulfill`, {
      method: "PUT",
    });

    fetchRecords();
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("management.contributions.confirmDelete"))) return;

    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    fetchRecords();
  };

  const total = records.reduce((sum, r) => sum + Number(r.amount), 0);
  const fulfilledTotal = records
    .filter((r) => r.fulfilled)
    .reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <div>
      {/* Add contribution */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sm:p-8 space-y-4 mb-8"
      >
        <h2 className="text-white font-bold text-lg">
          {t("management.contributions.addRecord")}
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              {t("management.contributions.name")}
            </label>
            <input
              type="text"
              name="contributor_name"
              value={form.contributor_name}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              {t("management.contributions.kind")}
            </label>
            <input
              type="text"
              name="kind"
              value={form.kind}
              onChange={handleChange}
              placeholder={t("management.contributions.kindPlaceholder")}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              {t("management.contributions.amount")}
            </label>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              {t("management.contributions.project")}
            </label>
            <select
              name="project_id"
              value={form.project_id}
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="" className="text-black">{t("management.contributions.noProject")}</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id} className="text-black">
                  {project.name} ({project.project_year})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              {t("management.contributions.date")}
            </label>
            <input
              type="date"
              name="contribution_date"
              value={form.contribution_date}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition"
        >
          {t("management.contributions.addRecord")}
        </button>
      </form>

      {/* Filters + totals */}
      <div className="flex flex-wrap gap-3 items-end mb-6">
        <div>
          <label className="block text-xs text-slate-400 mb-1">
            {t("management.contributions.filterMonth")}
          </label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
          >
            <option value="" className="text-black">
              {t("management.contributions.allMonths")}
            </option>
            {MONTH_NAMES.map((name, i) => (
              <option key={i} value={i + 1} className="text-black">
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">
            {t("management.contributions.filterYear")}
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-28 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
          />
        </div>

        <div className="ml-auto flex gap-6 text-right">
          <div>
            <p className="text-xs text-slate-400">
              {t("management.contributions.total")}
            </p>
            <p className="text-white font-bold text-lg">
              {total.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-400">
              {t("management.contributions.given")}
            </p>
            <p className="text-green-400 font-bold text-lg">
              {fulfilledTotal.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Contribution records */}
      {records.length === 0 ? (
        <p className="text-slate-400 text-sm">
          {t("management.contributions.noRecords")}
        </p>
      ) : (
        <div className="space-y-2">
          {records.map((r) => (
            <div
              key={r.id}
              className={`border rounded-xl px-5 py-3 flex justify-between items-center gap-4 transition ${
                r.fulfilled
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => handleToggleFulfilled(r.id)}
                  title={
                    r.fulfilled
                      ? t("management.contributions.markUnfulfilled")
                      : t("management.contributions.markFulfilled")
                  }
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                    r.fulfilled
                      ? "bg-green-500 border-green-500"
                      : "border-slate-500 hover:border-blue-400"
                  }`}
                >
                  {r.fulfilled && <FaCheck className="text-white text-xs" />}
                </button>

                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    {r.contributor_name}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {r.contribution_date?.slice(0, 10)}
                    {r.kind && ` — ${r.kind}`}
                    {r.project_name && ` — ${r.project_name}`}
                    {" — "}
                    <span
                      className={
                        r.fulfilled ? "text-green-400" : "text-amber-400"
                      }
                    >
                      {r.fulfilled
                        ? t("management.contributions.fulfilled")
                        : t("management.contributions.unfulfilled")}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-white font-semibold">
                  {Number(r.amount).toLocaleString()}
                </span>

                <button
                  type="button"
                  onClick={() => handleDelete(r.id)}
                  className="text-red-300 hover:text-red-200 text-xs"
                >
                  {t("management.contributions.delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContributionsTab;
