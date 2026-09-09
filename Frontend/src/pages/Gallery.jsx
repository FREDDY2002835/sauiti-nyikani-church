import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import { FaTimes } from "react-icons/fa";

const BASE_URL = "http://127.0.0.1:5000";
const API_URL = `${BASE_URL}/api/gallery`;

const Gallery = () => {
  const { t, i18n } = useTranslation();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Which photo (if any) is currently open full-size. null = closed.
  const [selectedImage, setSelectedImage] = useState(null);

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

  // Let the Escape key close the lightbox too, not just clicking away.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
                onClick={() => setSelectedImage({ ...img, caption })}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 cursor-pointer"
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

    {/* --- Lightbox: shows the selected photo full-size over everything else --- */}
    {selectedImage && (
      <div
        onClick={() => setSelectedImage(null)}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
      >
        <button
          onClick={() => setSelectedImage(null)}
          className="absolute top-5 right-5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition"
          aria-label="Close"
        >
          <FaTimes size={20} />
        </button>

        <div
          onClick={(e) => e.stopPropagation()}
          className="max-w-5xl max-h-full flex flex-col items-center cursor-default"
        >
          <img
            src={`${BASE_URL}${selectedImage.image_url}`}
            alt={selectedImage.caption || "Sauti Nyikani Church"}
            onClick={() => setSelectedImage(null)}
            className="max-w-full max-h-[80vh] rounded-2xl object-contain cursor-zoom-out"
          />
          {selectedImage.caption && (
            <p className="text-white text-sm sm:text-base mt-4 text-center">
              {selectedImage.caption}
            </p>
          )}
        </div>
      </div>
    )}
      </MainLayout>
  );
};

export default Gallery;
