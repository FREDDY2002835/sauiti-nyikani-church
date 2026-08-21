import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import { getBook } from "../utils/bible";
import { FaArrowLeft } from "react-icons/fa";

const BibleBook = () => {
  const { book } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const bookData = getBook(book);

  if (!bookData) {
    return (
      <MainLayout>
        <div className="max-w-3xl mx-auto px-5 py-24 text-center">
          <p className="text-red-400 mb-6">Book not found.</p>
          <Link to="/bible" className="text-blue-400 hover:underline">Back to Bible</Link>
        </div>
      </MainLayout>
    );
  }

  const chapters = Array.from({ length: bookData.chapters }, (_, i) => i + 1);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-5 py-16 md:py-24">
        <Link
          to="/bible"
          className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 text-sm mb-8 transition"
        >
          <FaArrowLeft /> All Books
        </Link>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-10">
          {bookData[lang] || bookData.en}
        </h1>

        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
          {chapters.map((c) => (
            <Link
              key={c}
              to={`/bible/${book}/${c}`}
              className="aspect-square flex items-center justify-center bg-white/10 border border-white/20 rounded-lg text-white text-sm hover:bg-blue-600 hover:border-blue-400 transition"
            >
              {c}
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default BibleBook;
