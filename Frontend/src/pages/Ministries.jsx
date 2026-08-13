import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

const Ministries = () => {
  const { t, i18n } = useTranslation();
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // The current language code ("en", "fr", or "sw") tells us which
  // columns to read from each ministry - e.g. name_en, name_fr, name_sw.
  const lang = i18n.language;

  useEffect(() => {
    const fetchMinistries = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/ministries");
        if (!response.ok) {
          throw new Error("Failed to load ministries");
        }
        const data = await response.json();
        setMinistries(data);
      } catch (err) {
        setError("Could not load ministries right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMinistries();
  }, []);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-5 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block bg-blue-600/30 text-blue-100 px-4 py-2 rounded-full text-xs sm:text-sm">
            {t("ministries.badge")}
          </span>
          <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
            {t("ministries.title")}
          </h1>
          <p className="mt-5 text-sm sm:text-base text-slate-300 leading-7">
            {t("ministries.subtitle")}
          </p>
        </div>

        {loading && (
          <p className="mt-16 text-center text-slate-400">Loading ministries...</p>
        )}

        {error && (
          <p className="mt-16 text-center text-red-400">{error}</p>
        )}

        {!loading && !error && (
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministries.map((m) => {
              const name = m[`name_${lang}`] || m.name_en;
              const description = m[`description_${lang}`] || m.description_en;

              return (
                <Link
                  to={`/ministries/${m.id}`}
                  key={m.id}
                  className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 hover:border-blue-400/50 hover:-translate-y-1 hover:bg-white/15 transition duration-300 cursor-pointer block"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-600/30 flex items-center justify-center text-blue-200 font-bold text-lg mb-5">
                    {name.charAt(0)}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-3">{name}</h3>
                  <p className="text-slate-300 text-sm leading-7">{description}</p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Ministries;
