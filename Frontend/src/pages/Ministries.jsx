import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";

const Ministries = () => {
  const { t } = useTranslation();
  const list = t("ministries.list", { returnObjects: true });

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

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((m, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 hover:border-blue-400/50 transition"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-600/30 flex items-center justify-center text-blue-200 font-bold text-lg mb-5">
              {m.name.charAt(0)}
            </div>
            <h3 className="text-white font-bold text-lg mb-3">{m.name}</h3>
            <p className="text-slate-300 text-sm leading-7">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
      </MainLayout>
  );
};

export default Ministries;
