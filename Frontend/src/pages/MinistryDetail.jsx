import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import { FaArrowLeft } from "react-icons/fa";

const MinistryDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [ministry, setMinistry] = useState(null);
  const [members, setMembers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const lang = i18n.language;

  useEffect(() => {
    // Scroll to the top whenever we land on a new ministry's detail page -
    // otherwise if you click from partway down the list, you'd land
    // partway down this page too.
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchMinistry = async () => {
      setLoading(true);
      setError(null);
      try {
        const BASE = "http://127.0.0.1:5000/api/ministries";
        const [ministryRes, membersRes, activitiesRes, plansRes] = await Promise.all([
          fetch(`${BASE}/${id}`),
          fetch(`${BASE}/${id}/members`),
          fetch(`${BASE}/${id}/activities`),
          fetch(`${BASE}/${id}/plans`),
        ]);

        if (!ministryRes.ok) {
          throw new Error("Not found");
        }

        setMinistry(await ministryRes.json());
        setMembers(await membersRes.json());
        setActivities(await activitiesRes.json());
        setPlans(await plansRes.json());
      } catch (err) {
        setError("Could not find that ministry.");
      } finally {
        setLoading(false);
      }
    };

    fetchMinistry();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-5 py-24 text-center text-slate-400">
          Loading...
        </div>
      </MainLayout>
    );
  }

  if (error || !ministry) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-5 py-24 text-center">
          <p className="text-red-400 mb-6">{error || "Ministry not found."}</p>
          <Link to="/ministries" className="text-blue-400 hover:underline">
            {t("ministries.title")}
          </Link>
        </div>
      </MainLayout>
    );
  }

  const name = ministry[`name_${lang}`] || ministry.name_en;
  const description = ministry[`description_${lang}`] || ministry.description_en;

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-5 py-16 md:py-24">
        <Link
          to="/ministries"
          className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 text-sm mb-8 transition"
        >
          <FaArrowLeft /> {t("ministries.title")}
        </Link>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 sm:p-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/30 flex items-center justify-center text-blue-200 font-bold text-2xl mb-6">
            {name.charAt(0)}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
            {name}
          </h1>
          <p className="text-slate-300 text-base leading-8">
            {description}
          </p>

          {ministry.leader_name && (
            <p className="mt-6 text-blue-300 text-sm font-semibold">
              {t("ministries.detail.leader")}: <span className="text-white font-normal">{ministry.leader_name}</span>
            </p>
          )}
        </div>

        {/* --- Members --- */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
          <h2 className="text-white font-bold text-lg mb-4">{t("ministries.detail.members")}</h2>
          {members.length === 0 ? (
            <p className="text-slate-400 text-sm">{t("ministries.detail.noMembers")}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {members.map((m) => (
                <span key={m.id} className="bg-white/10 border border-white/10 text-slate-200 text-sm px-3 py-1.5 rounded-full">
                  {m.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* --- Activities --- */}
        <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
          <h2 className="text-white font-bold text-lg mb-4">{t("ministries.detail.activities")}</h2>
          {activities.length === 0 ? (
            <p className="text-slate-400 text-sm">{t("ministries.detail.noActivities")}</p>
          ) : (
            <ul className="space-y-2 list-disc list-inside">
              {activities.map((a) => (
                <li key={a.id} className="text-slate-300 text-sm">{a.description}</li>
              ))}
            </ul>
          )}
        </div>

        {/* --- Plans --- */}
        <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
          <h2 className="text-white font-bold text-lg mb-4">{t("ministries.detail.plans")}</h2>
          {plans.length === 0 ? (
            <p className="text-slate-400 text-sm">{t("ministries.detail.noPlans")}</p>
          ) : (
            <ul className="space-y-2 list-disc list-inside">
              {plans.map((p) => (
                <li key={p.id} className="text-slate-300 text-sm">{p.description}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MinistryDetail;
