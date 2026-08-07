import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <MainLayout>
    <div className="max-w-xl mx-auto px-5 py-24 md:py-32 text-center">
      <h1 className="text-6xl sm:text-8xl font-extrabold text-blue-500">
        {t("notFound.title")}
      </h1>
      <p className="mt-6 text-slate-300 text-sm sm:text-base">
        {t("notFound.message")}
      </p>
      <Link
        to="/"
        className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition"
      >
        {t("notFound.backHome")}
      </Link>
    </div>
      </MainLayout>
  );
};

export default NotFound;
