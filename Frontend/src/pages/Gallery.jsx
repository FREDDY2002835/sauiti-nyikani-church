import { useTranslation } from "react-i18next";
import churchImg from "../assets/images/church.jpg";
import MainLayout from "../layouts/MainLayout";

const Gallery = () => {
  const { t } = useTranslation();
  const placeholders = new Array(6).fill(0);

  return (
    <MainLayout>
    <div className="max-w-7xl mx-auto px-5 py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-block bg-blue-600/30 text-blue-100 px-4 py-2 rounded-full text-xs sm:text-sm">
          {t("gallery.badge")}
        </span>
        <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
          {t("gallery.title")}
        </h1>
        <p className="mt-5 text-sm sm:text-base text-slate-300 leading-7">
          {t("gallery.subtitle")}
        </p>
      </div>

      <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-4">
        {placeholders.map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-2xl overflow-hidden border border-white/10"
          >
            <img
              src={churchImg}
              alt="Sauiti Nyikani Church"
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-slate-400 text-sm">
        {t("gallery.comingSoon")}
      </p>
    </div>
      </MainLayout>
  );
};

export default Gallery;
