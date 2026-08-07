import { useTranslation } from "react-i18next";
import { FaPlay } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";

const Sermons = () => {
  const { t } = useTranslation();
  const list = t("sermons.list", { returnObjects: true });

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

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((s, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden hover:border-blue-400/50 transition flex flex-col"
          >
            <div className="h-36 bg-blue-950/60 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <FaPlay />
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-blue-300 text-xs font-semibold">{s.date}</p>
              <h3 className="text-white font-bold text-lg mt-2">{s.title}</h3>
              <p className="text-slate-400 text-sm mt-1">{s.speaker}</p>
              <p className="text-slate-300 text-sm leading-6 mt-3 flex-1">{s.summary}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition">
          {t("sermons.watchAll")}
        </button>
      </div>
    </div>
      </MainLayout>
  );
};

export default Sermons;
