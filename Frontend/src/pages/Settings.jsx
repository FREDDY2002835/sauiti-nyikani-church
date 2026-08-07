import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";

const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "sw", label: "🇹🇿 Kiswahili" },
];

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <MainLayout>
    <div className="max-w-2xl mx-auto px-5 py-16 md:py-24">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-12">
        {t("settings.title")}
      </h1>

      <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sm:p-8 space-y-8">
        <div>
          <h2 className="text-white font-semibold mb-4">{t("settings.theme")}</h2>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-white hover:bg-white/20 transition"
          >
            {theme === "dark" ? <FaMoon /> : <FaSun />}
            <span className="capitalize">{theme}</span>
          </button>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-4">{t("settings.language")}</h2>
          <div className="flex flex-wrap gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`px-5 py-3 rounded-xl border transition ${
                  i18n.language === lang.code
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white/10 border-white/20 text-slate-200 hover:bg-white/20"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
      </MainLayout>
  );
};

export default Settings;
