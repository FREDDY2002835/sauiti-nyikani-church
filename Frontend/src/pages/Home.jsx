import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FaBookOpen, FaArrowRight } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import Hero from "../components/home/Hero";

const Home = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
      <Hero />

      <div className="max-w-7xl mx-auto px-5 py-12">
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
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

export default Home;