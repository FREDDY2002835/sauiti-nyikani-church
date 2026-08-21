import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaBookOpen, FaArrowRight } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";

const About = () => {
  const { t } = useTranslation();
  const values = t("about.values.items", { returnObjects: true });

  return (
    <MainLayout>
    <div className="max-w-7xl mx-auto px-5 py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-block bg-blue-600/30 text-blue-100 px-4 py-2 rounded-full text-xs sm:text-sm">
          {t("about.badge")}
        </span>
        <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
          {t("about.title")}
        </h1>
        <p className="mt-5 text-sm sm:text-base text-slate-300 leading-7">
          {t("about.intro")}
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8">
          <h2 className="text-xl font-bold text-white mb-3">{t("about.mission.title")}</h2>
          <p className="text-slate-300 leading-7 text-sm sm:text-base">{t("about.mission.text")}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8">
          <h2 className="text-xl font-bold text-white mb-3">{t("about.vision.title")}</h2>
          <p className="text-slate-300 leading-7 text-sm sm:text-base">{t("about.vision.text")}</p>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
          {t("about.values.title")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((item, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition"
            >
              <div className="w-10 h-10 rounded-full bg-blue-600 mx-auto mb-4 flex items-center justify-center text-white font-bold">
                {i + 1}
              </div>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-6">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 text-center max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-3">{t("about.leadership.title")}</h2>
        <p className="text-slate-300 leading-7 text-sm sm:text-base">{t("about.leadership.text")}</p>
      </div>

      <div className="mt-16 bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
        <div className="w-16 h-16 shrink-0 rounded-2xl bg-blue-600/20 text-blue-300 flex items-center justify-center text-3xl">
          <FaBookOpen />
        </div>

        <div className="flex-1 text-center md:text-left">
          <span className="inline-block text-blue-300 text-xs sm:text-sm font-semibold uppercase tracking-wide">
            {t("about.bibleCta.tag")}
          </span>

          <h2 className="mt-2 text-2xl font-extrabold text-white">
            {t("about.bibleCta.title")}
          </h2>

          <p className="mt-2 text-slate-300">{t("about.bibleCta.text")}</p>
        </div>

        <Link
          to="/bible"
          className="shrink-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition"
        >
          {t("about.bibleCta.button")}
          <FaArrowRight size={14} />
        </Link>
      </div>
    </div>
      </MainLayout>
  );
};

export default About;
