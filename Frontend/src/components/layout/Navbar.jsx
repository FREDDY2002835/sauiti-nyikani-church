import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
  FaGlobe,
  FaChevronDown,
} from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import logo from "../../assets/logo/logo.png";

const Navbar = () => {
 const { theme, toggleTheme } = useTheme();
const { t, i18n } = useTranslation();

const [menuOpen, setMenuOpen] = useState(false);
const [showLanguages, setShowLanguages] = useState(false);

const [language, setLanguage] = useState(
  localStorage.getItem("language") || "en"
);


const changeLanguage = (lang) => {
  i18n.changeLanguage(lang);
  localStorage.setItem("language", lang);
  setLanguage(lang);
  setShowLanguages(false);
};

 const links = [
  { name: t("nav.home"), path: "/" },
  { name: t("nav.about"), path: "/about" },
  { name: t("nav.ministries"), path: "/ministries" },
  { name: t("nav.sermons"), path: "/sermons" },
  { name: t("nav.events"), path: "/events" },
  { name: t("nav.gallery"), path: "/gallery" },
  { name: t("nav.giving"), path: "/giving" },
  { name: t("nav.prayer"), path: "/prayer" },
  { name: t("nav.contact"), path: "/contact" },
];
  return (
    <header
      className="sticky top-0 z-50 shadow-lg border-b"
      style={{
        background: "var(--nav)",
        borderColor: "rgba(255,255,255,.08)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 md:h-20 px-4 md:px-8">

        {/* Logo */}

        <NavLink
          to="/"
          className="flex items-center gap-3"
        >
          <img
            src={logo}
            alt="Sauti Nyikani Church logo"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
          />

          <div>
            <h1 className="text-base md:text-2xl font-bold text-white">
              Sauti Nyikani
            </h1>

            <p className="hidden md:block text-xs text-slate-300">
              Church
            </p>
          </div>
        </NavLink>

        {/* Desktop Navigation */}

        <nav className="hidden lg:flex items-center gap-8">

          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `font-medium transition ${
                  isActive
                    ? "text-blue-400"
                    : "text-slate-200 hover:text-blue-300"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

        </nav>

        {/* Desktop Controls */}

        <div className="hidden lg:flex items-center gap-5">

          {/* Language */}

          <div className="relative">

            <button
              onClick={() => setShowLanguages(!showLanguages)}
              className="flex items-center gap-2 text-slate-200 hover:text-white"
            >
              <FaGlobe />
              {language.toUpperCase()}
              <FaChevronDown size={12} />
            </button>

            {showLanguages && (
              <div className="absolute right-0 mt-3 w-40 rounded-xl bg-[#102845] shadow-xl overflow-hidden">

               {[
  { code: "en", label: "🇬🇧 English" },
  { code: "fr", label: "🇫🇷 Français" },
  { code: "sw", label: "🇹🇿 Kiswahili" },
].map((lang) => (
                  <button
  key={lang.code}
  onClick={() => changeLanguage(lang.code)}
  className="w-full px-4 py-3 text-left hover:bg-blue-600 text-white"
>
  {lang.label}
</button>
                ))}

              </div>
            )}

          </div>

          {/* Theme */}

          <button
            onClick={toggleTheme}
            className="text-xl text-slate-200 hover:text-yellow-300 transition"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

        </div>

        {/* Mobile Controls */}

        <div className="flex items-center gap-4 lg:hidden">

          <button
            onClick={toggleTheme}
            className="text-white"
          >
            {theme === "dark" ? <FaSun size={18} /> : <FaMoon size={18} />}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white"
          >
            {menuOpen ? (
              <FaTimes size={22} />
            ) : (
              <FaBars size={22} />
            )}
          </button>

        </div>

      </div>

      {/* Mobile Menu */}

      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-screen" : "max-h-0"
        }`}
        style={{ background: "var(--nav)" }}
      >
        <nav className="flex flex-col py-2">

          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `px-5 py-4 transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-200 hover:bg-blue-700"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          <div className="border-t border-slate-700 mt-2">

            <p className="px-5 pt-4 text-sm text-slate-400">
              {t("nav.language")}
            </p>

            <button
             onClick={() => changeLanguage("en")}
              className="w-full text-left px-5 py-3 text-slate-200 hover:bg-blue-700"
            >
              🇬🇧 English
            </button>

            <button
             onClick={() => changeLanguage("fr")}
              className="w-full text-left px-5 py-3 text-slate-200 hover:bg-blue-700"
            >
              🇫🇷 Français
            </button>

            <button
             onClick={() => changeLanguage("sw")}
              className="w-full text-left px-5 py-3 text-slate-200 hover:bg-blue-700"
            >
              🇹🇿 Kiswahili
            </button>

          </div>

        </nav>
      </div>
    </header>
  );
};

export default Navbar;