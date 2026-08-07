import { useTranslation } from "react-i18next";
import { FaUniversity, FaMobileAlt, FaHandHoldingHeart } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";

const Giving = () => {
  const { t } = useTranslation();

  const methods = [
    { icon: <FaUniversity />, title: t("giving.methods.bank.title"), details: t("giving.methods.bank.details") },
    { icon: <FaMobileAlt />, title: t("giving.methods.mobile.title"), details: t("giving.methods.mobile.details") },
    { icon: <FaHandHoldingHeart />, title: t("giving.methods.inPerson.title"), details: t("giving.methods.inPerson.details") },
  ];

  return (
    <MainLayout>
    <div className="max-w-7xl mx-auto px-5 py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-block bg-blue-600/30 text-blue-100 px-4 py-2 rounded-full text-xs sm:text-sm">
          {t("giving.badge")}
        </span>
        <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
          {t("giving.title")}
        </h1>
        <p className="mt-5 text-sm sm:text-base text-slate-300 leading-7">
          {t("giving.subtitle")}
        </p>
        <p className="mt-6 italic text-slate-400 text-sm leading-7 max-w-xl mx-auto">
          {t("giving.intro")}
        </p>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-white text-center mb-10">
          {t("giving.methods.title")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {methods.map((m, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-blue-600/30 text-blue-200 flex items-center justify-center mx-auto mb-5 text-xl">
                {m.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{m.title}</h3>
              <p className="text-slate-400 text-sm leading-6">{m.details}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-14 text-center text-blue-300 font-semibold">
        {t("giving.thankyou")}
      </p>
    </div>
      </MainLayout>
  );
};

export default Giving;
