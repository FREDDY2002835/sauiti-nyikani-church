import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCrown, FaCross, FaDove, FaTimes } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import { TRINITY_CONTENT } from "../data/trinityContent";

const TRINITY_PERSONS = [
  {
    key: "father",
    icon: <FaCrown />,
    hoverBorder: "hover:border-amber-400/50",
    iconBg: "bg-amber-500/20",
    iconText: "text-amber-300",
  },
  {
    key: "son",
    icon: <FaCross />,
    hoverBorder: "hover:border-rose-400/50",
    iconBg: "bg-rose-500/20",
    iconText: "text-rose-300",
  },
  {
    key: "spirit",
    icon: <FaDove />,
    hoverBorder: "hover:border-emerald-400/50",
    iconBg: "bg-emerald-500/20",
    iconText: "text-emerald-300",
  },
];

const About = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || "en";
  const values = t("about.values.items", { returnObjects: true });
  const [openPerson, setOpenPerson] = useState(null);

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

      <div className="mt-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block bg-blue-600/30 text-blue-100 px-4 py-2 rounded-full text-xs sm:text-sm">
            {t("about.trinity.sectionTag")}
          </span>
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-white">
            {t("about.trinity.sectionTitle")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TRINITY_PERSONS.map((person) => (
            <button
              key={person.key}
              onClick={() => setOpenPerson(person.key)}
              className={`bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 ${person.hoverBorder} transition`}
            >
              <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl ${person.iconBg} ${person.iconText} flex items-center justify-center text-2xl`}>
                {person.icon}
              </div>
              <h3 className="text-white font-semibold">{t(`about.trinity.${person.key}`)}</h3>
              <p className="text-slate-500 text-xs mt-2">{t("about.trinity.tapToLearn")}</p>
            </button>
          ))}
        </div>
      </div>

      {openPerson && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-5"
          onClick={() => setOpenPerson(null)}
        >
          <div
            className="bg-[#0c223f] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpenPerson(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
              aria-label={t("about.trinity.close")}
            >
              <FaTimes />
            </button>

            <h2 className="text-xl font-extrabold text-white mb-6 pr-8">
              {t(`about.trinity.${openPerson}`)}
            </h2>

            {TRINITY_CONTENT[openPerson][lang] || TRINITY_CONTENT[openPerson].en}
          </div>
        </div>
      )}

      <div className="mt-16 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 text-center max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-3">{t("about.leadership.title")}</h2>
        <p className="text-slate-300 leading-7 text-sm sm:text-base">{t("about.leadership.text")}</p>
      </div>
    </div>
      </MainLayout>
  );
};

export default About;
