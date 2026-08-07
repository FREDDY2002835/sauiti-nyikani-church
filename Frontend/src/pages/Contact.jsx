import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";

const Contact = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <MainLayout>
    <div className="max-w-6xl mx-auto px-5 py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-block bg-blue-600/30 text-blue-100 px-4 py-2 rounded-full text-xs sm:text-sm">
          {t("contact.badge")}
        </span>
        <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
          {t("contact.title")}
        </h1>
        <p className="mt-5 text-sm sm:text-base text-slate-300 leading-7">
          {t("contact.subtitle")}
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-white mb-6">{t("contact.info.title")}</h2>
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <FaMapMarkerAlt className="text-blue-400 mt-1" />
              <p className="text-slate-300 text-sm">{t("contact.info.address")}</p>
            </div>
            <div className="flex items-start gap-4">
              <FaPhone className="text-blue-400 mt-1" />
              <p className="text-slate-300 text-sm">{t("contact.info.phone")}</p>
            </div>
            <div className="flex items-start gap-4">
              <FaEnvelope className="text-blue-400 mt-1" />
              <p className="text-slate-300 text-sm">{t("contact.info.email")}</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sm:p-8 space-y-5"
        >
          <div>
            <label className="block text-sm text-slate-300 mb-2">{t("contact.form.name")}</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">{t("contact.form.email")}</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-2">{t("contact.form.message")}</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            {t("contact.form.submit")}
          </button>

          {submitted && (
            <p className="text-blue-300 text-sm">
              {t("contact.form.sent")}
            </p>
          )}
        </form>
      </div>
    </div>
      </MainLayout>
  );
};

export default Contact;
