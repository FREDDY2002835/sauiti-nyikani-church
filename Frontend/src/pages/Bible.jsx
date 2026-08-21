import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FaBookOpen, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import booksMeta from "../data/bible/books.json";
import enBible from "../data/bible/en.json";
import frBible from "../data/bible/fr.json";
import swBible from "../data/bible/sw.json";

// All Scripture text is bundled locally (src/data/bible/*.json) — this page
// never makes a network request. Sources: King James Version (en, 1769,
// public domain), Louis Segond 1910 (fr, public domain), Swahili Union
// Version (sw, via shemmjunior/swahili-bible-edition, MIT-licensed data
// packaging on GitHub).
const BIBLE_BY_LANG = { en: enBible, fr: frBible, sw: swBible };

const Bible = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language?.slice(0, 2) || "en";
  const lang = BIBLE_BY_LANG[currentLang] ? currentLang : "en";
  const bible = BIBLE_BY_LANG[lang];

  const [bookId, setBookId] = useState(booksMeta[0].id);
  const [chapterNum, setChapterNum] = useState(1);

  const currentBookMeta = useMemo(
    () => booksMeta.find((b) => b.id === bookId),
    [bookId]
  );

  const totalChapters = currentBookMeta?.chapters || 1;

  const verses = useMemo(() => {
    const chapterData = bible[bookId]?.[String(chapterNum)] || {};
    return Object.entries(chapterData)
      .map(([number, text]) => ({ number: Number(number), text }))
      .sort((a, b) => a.number - b.number);
  }, [bible, bookId, chapterNum]);

  const handleBookChange = (e) => {
    setBookId(e.target.value);
    setChapterNum(1);
  };

  const goToChapter = (num) => {
    if (num < 1 || num > totalChapters) return;
    setChapterNum(num);
  };

  const bookLabel = (book) => book[lang] || book.en;

  return (
    <MainLayout>
      <section className="max-w-5xl mx-auto px-5 py-12 md:py-16">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-300 flex items-center justify-center text-xl">
            <FaBookOpen />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              {t("bible.title")}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {t("bible.subtitle")}
            </p>
          </div>
        </div>

        {/* Selectors */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <select
            value={bookId}
            onChange={handleBookChange}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white flex-1"
          >
            {booksMeta.map((book) => (
              <option key={book.id} value={book.id} className="text-black">
                {bookLabel(book)}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <button
              onClick={() => goToChapter(chapterNum - 1)}
              disabled={chapterNum <= 1}
              className="text-slate-300 hover:text-white disabled:opacity-30"
              aria-label={t("bible.prevChapter")}
            >
              <FaChevronLeft />
            </button>

            <span className="text-white font-semibold min-w-[90px] text-center">
              {t("bible.chapter")} {chapterNum}
            </span>

            <button
              onClick={() => goToChapter(chapterNum + 1)}
              disabled={chapterNum >= totalChapters}
              className="text-slate-300 hover:text-white disabled:opacity-30"
              aria-label={t("bible.nextChapter")}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 min-h-[300px]">
          <h2 className="text-xl font-bold text-white mb-6">
            {currentBookMeta && bookLabel(currentBookMeta)} {chapterNum}
          </h2>

          <div className="space-y-3 text-slate-200 leading-8">
            {verses.map((verse) => (
              <p key={verse.number}>
                <sup className="text-blue-400 font-semibold mr-1">
                  {verse.number}
                </sup>
                {verse.text}
              </p>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-slate-500 text-xs">
          {t("bible.source")}
        </p>
      </section>
    </MainLayout>
  );
};

export default Bible;
