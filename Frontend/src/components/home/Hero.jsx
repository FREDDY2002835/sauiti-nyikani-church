import heroImage from "../../assets/images/church.jpg";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();

  const services = [
    {
      title: t("hero.services.sunday"),
      time: t("hero.services.sundayTime"),
    },
    {
      title: t("hero.services.tuesday"),
      time: t("hero.services.tuesdayTime"),
    },
    {
      title: t("hero.services.saturday"),
      time: t("hero.services.saturdayTime"),
    },
  ];

  return (
    <section
      className="relative bg-cover bg-center"
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#081B33]/80"></div>

      <div className="relative max-w-7xl mx-auto px-5 py-12 md:py-20 lg:min-h-screen flex items-center">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center w-full">

          {/* Left Content */}

          <div className="text-center lg:text-left">

            <span className="inline-block bg-blue-600/30 text-blue-100 px-4 py-2 rounded-full text-xs sm:text-sm">
              {t("hero.badge")}
            </span>

            <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white leading-tight">
              {t("hero.title1")}
              <br />
              {t("hero.title2")}
            </h1>

            <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-200 leading-7 max-w-xl mx-auto lg:mx-0">
              {t("hero.description")}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

              <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition">
                {t("hero.join")}
              </button>

              <button className="w-full sm:w-auto border border-blue-400 text-blue-200 hover:bg-blue-700/40 px-8 py-3 rounded-xl font-semibold transition">
                {t("hero.watch")}
              </button>

            </div>

          </div>

          {/* Weekly Services */}

          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 lg:p-6 max-w-md mx-auto w-full">

            <h2 className="text-xl lg:text-xl font-bold text-white text-center mb-8 lg:mb-6">
              {t("hero.services.title")}
            </h2>

            <div className="space-y-6 lg:space-y-4">

              {services.map((service) => (
                <div
                  key={service.title}
                  className="flex justify-between items-center border-b border-white/10 pb-4 lg:pb-3"
                >
                  <div>

                    <h3 className="text-white font-semibold text-sm sm:text-base">
                      {service.title}
                    </h3>

                    <p className="text-slate-300 text-sm mt-1">
                      {service.time}
                    </p>

                  </div>

                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>

                </div>
              ))}

            </div>

            <div className="mt-8 lg:mt-6 pt-6 lg:pt-4 border-t border-white/20">

              <p className="italic text-slate-300 text-sm leading-7 text-center">
                "{t("hero.verse.text")}"
              </p>

              <p className="mt-4 text-blue-300 font-semibold text-center">
                {t("hero.verse.reference")}
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;