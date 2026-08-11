import { useState } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";

const Prayer = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", request: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Server responded with an error");
      }

      setSubmitted(true);
      setForm({ name: "", email: "", request: "" });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-5 py-16 md:py-24">
        <div className="text-center">
          <span className="inline-block bg-blue-600/30 text-blue-100 px-4 py-2 rounded-full text-xs sm:text-sm">
            {t("prayer.badge")}
          </span>
          <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
            {t("prayer.title")}
          </h1>
          <p className="mt-5 text-sm sm:text-base text-slate-300 leading-7">
            {t("prayer.subtitle")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-12 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sm:p-8 space-y-5"
        >
          <div>
            <label className="block text-sm text-slate-300 mb-2">{t("prayer.form.name")}</label>
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
            <label className="block text-sm text-slate-300 mb-2">{t("prayer.form.email")}</label>
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
            <label className="block text-sm text-slate-300 mb-2">{t("prayer.form.request")}</label>
            <textarea
              name="request"
              value={form.request}
              onChange={handleChange}
              required
              rows={5}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            {t("prayer.form.submit")}
          </button>

          {submitted && (
            <p className="text-blue-300 text-sm">
              {t("prayer.note")}
            </p>
          )}

          {error && (
            <p className="text-red-400 text-sm">
              {error}
            </p>
          )}
        </form>
      </div>
    </MainLayout>
  );
};

export default Prayer;