import { API_URL as API_ROOT, API_ORIGIN } from "../config/api";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";

const BASE_URL = API_ORIGIN;

const Events = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/events`);
        if (!response.ok) throw new Error("Failed to load events");
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError("Could not load events right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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

        {loading && (
          <p className="mt-16 text-center text-slate-400">{t("events.loading")}</p>
        )}

        {error && (
          <p className="mt-16 text-center text-red-400">{error}</p>
        )}

        {!loading && !error && events.length === 0 && (
          <p className="mt-16 text-center text-slate-400">{t("events.noneYet")}</p>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="mt-16 space-y-6 max-w-3xl mx-auto">
            {events.map((ev) => {
              const title = ev[`title_${lang}`] || ev.title_en;
              const description = ev[`description_${lang}`] || ev.description_en;
              const location = ev[`location_${lang}`] || ev.location_en;

              // Compare by calendar day only (ignoring time-of-day) so an
              // event dated today doesn't get marked "past" the moment
              // the clock ticks past midnight local time.
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const isPast = ev.event_date && new Date(ev.event_date) < today;

              return (
                <div
                  key={ev.id}
                  className={`relative bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden hover:border-blue-400/50 transition ${
                    isPast ? "opacity-60" : ""
                  }`}
                >
                  {isPast && (
                    <span className="absolute top-4 left-4 z-10 bg-slate-800/90 text-slate-200 text-xs font-semibold px-3 py-1 rounded-full border border-white/20">
                      {t("events.pastEvent")}
                    </span>
                  )}
                  {ev.image_url && (
                    <img
                      src={`${BASE_URL}${ev.image_url}`}
                      alt={title}
                      onClick={() => setLightboxImage(`${BASE_URL}${ev.image_url}`)}
                      className="w-full max-h-[420px] object-contain bg-black/20 cursor-pointer hover:opacity-90 transition"
                    />
                  )}
                  <div className="p-6 sm:p-8">
                    <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
                    {description && (
                      <p className="text-slate-300 text-sm leading-6 mb-4">{description}</p>
                    )}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
                      {ev.event_date && (
                        <span className="flex items-center gap-2">
                          <FaCalendarAlt className="text-blue-400" />
                          {new Date(ev.event_date).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      )}
                      {ev.event_time && (
                        <span className="flex items-center gap-2">
                          <FaClock className="text-blue-400" /> {ev.event_time}
                        </span>
                      )}
                      {location && (
                        <span className="flex items-center gap-2">
                          <FaMapMarkerAlt className="text-blue-400" /> {location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-5"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-5 right-5 text-white/80 hover:text-white text-2xl"
            aria-label="Close"
          >
            <FaTimes />
          </button>
          <img
            src={lightboxImage}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>
      )}
    </MainLayout>
  );
};

export default Events;
