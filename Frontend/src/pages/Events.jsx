import { useTranslation } from "react-i18next";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";

const Events = () => {
  const { t } = useTranslation();
  const list = t("events.list", { returnObjects: true });

  return (
    <MainLayout>
    <div className="max-w-7xl mx-auto px-5 py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-block bg-blue-600/30 text-blue-100 px-4 py-2 rounded-full text-xs sm:text-sm">
          {t("events.badge")}
        </span>
        <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
          {t("events.title")}
        </h1>
        <p className="mt-5 text-sm sm:text-base text-slate-300 leading-7">
          {t("events.subtitle")}
        </p>
      </div>

      <div className="mt-16 space-y-6 max-w-3xl mx-auto">
        {list.map((e, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sm:p-8 hover:border-blue-400/50 transition"
          >
            <h3 className="text-white font-bold text-lg mb-3">{e.title}</h3>
            <p className="text-slate-300 text-sm leading-6 mb-4">{e.desc}</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <FaCalendarAlt className="text-blue-400" /> {e.date}
              </span>
              <span className="flex items-center gap-2">
                <FaClock className="text-blue-400" /> {e.time}
              </span>
              <span className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-400" /> {e.location}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
      </MainLayout>
  );
};

export default Events;
