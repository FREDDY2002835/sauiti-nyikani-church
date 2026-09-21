import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const API_URL = "http://127.0.0.1:5000/api/contributions";

const ProjectsTab = () => {
  const { t } = useTranslation();

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", goal_amount: "", project_year: String(new Date().getFullYear()) });

  const fetchProjects = async () => {
    const res = await fetch(`${API_URL}/projects`);
    setProjects(await res.json());
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.project_year) return;

    await fetch(`${API_URL}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ name: "", goal_amount: "", project_year: String(new Date().getFullYear()) });
    fetchProjects();
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("management.projects.confirmDelete"))) return;
    await fetch(`${API_URL}/projects/${id}`, { method: "DELETE" });
    fetchProjects();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sm:p-8 flex flex-wrap gap-4 items-end mb-8">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-slate-400 mb-1">{t("management.projects.name")}</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400" />
        </div>

        <div className="w-36">
          <label className="block text-xs text-slate-400 mb-1">{t("management.projects.year")}</label>
          <input type="number" min="2000" max="2100" value={form.project_year} onChange={(e) => setForm({ ...form, project_year: e.target.value })} required className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400" />
        </div>

        <div className="w-44">
          <label className="block text-xs text-slate-400 mb-1">{t("management.projects.goal")}</label>
          <input type="number" min="0" step="0.01" value={form.goal_amount} onChange={(e) => setForm({ ...form, goal_amount: e.target.value })} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400" />
        </div>

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition">{t("management.projects.addProject")}</button>
      </form>

      {projects.length === 0 ? (
        <p className="text-slate-400 text-sm">{t("management.projects.noProjects")}</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((project) => {
            const goal = Number(project.goal_amount) || 0;
            const raised = Number(project.raised_amount) || 0;
            const percentage = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;
            const remaining = Math.max(goal - raised, 0);

            return (
              <div key={project.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-white font-semibold">{project.name}</h3>
                    <p className="text-slate-400 text-xs mt-1">{t("management.projects.year")}: {project.project_year}</p>
                  </div>
                  <button type="button" onClick={() => handleDelete(project.id)} className="text-red-300 hover:text-red-200 text-xs shrink-0">{t("management.projects.delete")}</button>
                </div>

                <div className="mt-5">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-300">{t("management.projects.progress")}</span>
                    <span className="text-white font-semibold">{percentage.toFixed(0)}%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${percentage}%` }} />
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                    <div>
                      <p className="text-slate-500">{t("management.projects.raised")}</p>
                      <p className="text-green-400 font-semibold mt-1">{raised.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">{t("management.projects.goal")}</p>
                      <p className="text-white font-semibold mt-1">{goal.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">{t("management.projects.remaining")}</p>
                      <p className="text-amber-400 font-semibold mt-1">{remaining.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectsTab;
