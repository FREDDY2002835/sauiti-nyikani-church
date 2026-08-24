import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

const BASE_URL = "http://127.0.0.1:5000";
const API_URL = `${BASE_URL}/api/gallery`;

const Gallery = () => {
  const { t, i18n } = useTranslation();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Same idea as the Ministries page: the current language tells us
  // which caption column to read - caption_en, caption_fr, caption_sw.
  const lang = i18n.language;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Failed to load gallery");
        }
        const data = await response.json();
        setImages(data);
      } catch (err) {
        setError("Could not load the gallery right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

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

        <Link
          to="/admin/gallery"
          className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition"
        >
          Upload Photos
        </Link>
      </div>

      {loading && (
        <p className="mt-16 text-center text-slate-400">Loading gallery...</p>
      )}

      {error && (
        <p className="mt-16 text-center text-red-400">{error}</p>
      )}

      {!loading && !error && images.length > 0 && (
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img) => {
            const caption = img[`caption_${lang}`] || img.caption_en;

            return (
              <div
                key={img.id}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10"
              >
                <img
                  src={`${BASE_URL}${img.image_url}`}
                  alt={caption || "Sauti Nyikani Church"}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                {caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition">
                    <p className="text-white text-xs sm:text-sm">{caption}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && images.length === 0 && (
        <p className="mt-16 text-center text-slate-400 text-sm">
          {t("gallery.comingSoon")}
        </p>
      )}
    </div>
      </MainLayout>
  );
};

export default Gallery;
