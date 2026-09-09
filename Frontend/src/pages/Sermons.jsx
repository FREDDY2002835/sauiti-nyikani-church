import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";

const BASE_URL = "http://127.0.0.1:5000";

const Sermons = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/sermons`);
        if (!response.ok) throw new Error("Failed to load sermons");
        const data = await response.json();
        setSermons(data);
      } catch (err) {
        setError("Could not load sermons right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSermons();
  }, []);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-5 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block bg-blue-600/30 text-blue-100 px-4 py-2 rounded-full text-xs sm:text-sm">
            {t("sermons.badge")}
          </span>
          <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
            {t("sermons.title")}
          </h1>
          <p className="mt-5 text-sm sm:text-base text-slate-300 leading-7">
            {t("sermons.subtitle")}
          </p>
        </div>

        {loading && (
          <p className="mt-16 text-center text-slate-400">{t("sermons.loading")}</p>
        )}

        {error && (
          <p className="mt-16 text-center text-red-400">{error}</p>
        )}

        {!loading && !error && sermons.length === 0 && (
          <p className="mt-16 text-center text-slate-400">
            {t("sermons.noneYet")}
          </p>
        )}

        {!loading && !error && sermons.length > 0 && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((s) => (
              <div
                key={s.id}
                className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden hover:border-blue-400/50 transition flex flex-col"
              >
                {s.file_type === "video" ? (
                  <video
                    controls
                    className="w-full h-48 bg-black object-contain"
                    src={`${BASE_URL}${s.file_url}`}
                  />
                ) : (
                  <div className="p-5 bg-blue-950/40">
                    <audio controls className="w-full" src={`${BASE_URL}${s.file_url}`} />
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col">
                  {s.sermon_date && (
                    <p className="text-blue-300 text-xs font-semibold">
                      {new Date(s.sermon_date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                  <h3 className="text-white font-bold text-lg mt-2">{s[`title_${lang}`] || s.title_en}</h3>
                  <p className="text-slate-400 text-sm mt-1">{s.speaker}</p>
                  {(s[`description_${lang}`] || s.description_en) && (
                    <p className="text-slate-300 text-sm leading-6 mt-3 flex-1">
                      {s[`description_${lang}`] || s.description_en}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Sermons;
