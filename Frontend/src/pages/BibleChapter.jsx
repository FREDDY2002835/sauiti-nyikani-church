import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MainLayout from "../layouts/MainLayout";
import { getBook, resolveBibleVersion, fetchChapter, BIBLE_BOOKS } from "../utils/bible";
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaPlay, FaPause, FaStop } from "react-icons/fa";

// Maps our site's language codes to the codes browsers use for
// text-to-speech voices. Swahili voice support varies by device/browser -
// if none is installed, most browsers will still speak using a fallback
// voice rather than failing silently.
const SPEECH_LANG = { en: "en-US", fr: "fr-FR", sw: "sw-KE" };

const BibleChapter = () => {
  const { book, chapter } = useParams();
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const bookData = getBook(book);
  const chapterNum = parseInt(chapter, 10);

  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usedFallbackLang, setUsedFallbackLang] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    stopSpeaking(); // don't let audio keep playing after navigating away

    const load = async () => {
      setLoading(true);
      setError(null);
      setUsedFallbackLang(false);

      try {
        const versionId = await resolveBibleVersion(lang);

        if (versionId) {
          try {
            const data = await fetchChapter(versionId, book, chapterNum);
            if (data.length > 0) {
              setVerses(data);
              setLoading(false);
              return;
            }
          } catch (err) {
            // fall through to the English fallback below
          }
        }

        // Either this language has no confirmed Bible translation, or
        // this specific book/chapter wasn't available in it - fall back
        // to English rather than showing a dead end.
        if (lang !== "en") {
          const englishVersion = await resolveBibleVersion("en");
          const englishData = await fetchChapter(englishVersion, book, chapterNum);
          setVerses(englishData);
          setUsedFallbackLang(true);
        } else {
          throw new Error("No verses returned");
        }
      } catch (err) {
        setError(
          "Sorry, this chapter couldn't be loaded right now. Please try again in a moment."
        );
      } finally {
        setLoading(false);
      }
    };

    if (bookData) load();

    return () => stopSpeaking();
  }, [book, chapter, lang]);

  const speakChapter = () => {
    if (!("speechSynthesis" in window) || verses.length === 0) return;

    window.speechSynthesis.cancel(); // clear anything queued before starting fresh

    const fullText = verses.map((v) => v.text).join(" ");
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.lang = SPEECH_LANG[lang] || "en-US";
    utterance.rate = 0.95;

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const togglePause = () => {
    if (!("speechSynthesis" in window)) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

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

  const hasPrev = chapterNum > 1;
  const hasNext = chapterNum < bookData.chapters;
  const bookIndex = BIBLE_BOOKS.findIndex((b) => b.slug === book);
  const prevBook = BIBLE_BOOKS[bookIndex - 1];
  const nextBook = BIBLE_BOOKS[bookIndex + 1];

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-5 py-16 md:py-24">
        <Link
          to={`/bible/${book}`}
          className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 text-sm mb-8 transition"
        >
          <FaArrowLeft /> {bookData[lang] || bookData.en}
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            {bookData[lang] || bookData.en} {chapterNum}
          </h1>

          {!loading && !error && verses.length > 0 && "speechSynthesis" in window && (
            <div className="flex items-center gap-2">
              {!isSpeaking ? (
                <button
                  onClick={speakChapter}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  <FaPlay className="text-xs" /> Read Aloud
                </button>
              ) : (
                <>
                  <button
                    onClick={togglePause}
                    className="flex items-center gap-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition"
                  >
                    {isPaused ? <FaPlay className="text-xs" /> : <FaPause className="text-xs" />}
                    {isPaused ? "Resume" : "Pause"}
                  </button>
                  <button
                    onClick={stopSpeaking}
                    className="flex items-center gap-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition"
                  >
                    <FaStop className="text-xs" /> Stop
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {usedFallbackLang && (
          <p className="text-amber-300 text-xs mb-6 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3">
            This chapter isn't available yet in your selected language, so English is shown instead.
          </p>
        )}

        {loading && <p className="text-slate-400">Loading...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 sm:p-10 space-y-1">
            {verses.map((v) => (
              <p key={v.verse} className="text-slate-200 leading-8 text-base">
                <sup className="text-blue-400 text-xs font-bold mr-1">{v.verse}</sup>
                {v.text}
              </p>
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-between items-center">
          {hasPrev ? (
            <Link to={`/bible/${book}/${chapterNum - 1}`} className="flex items-center gap-2 text-blue-300 hover:text-blue-200 text-sm">
              <FaChevronLeft /> Previous
            </Link>
          ) : prevBook ? (
            <Link to={`/bible/${prevBook.slug}/${prevBook.chapters}`} className="flex items-center gap-2 text-blue-300 hover:text-blue-200 text-sm">
              <FaChevronLeft /> {prevBook[lang] || prevBook.en}
            </Link>
          ) : <span />}

          {hasNext ? (
            <Link to={`/bible/${book}/${chapterNum + 1}`} className="flex items-center gap-2 text-blue-300 hover:text-blue-200 text-sm">
              Next <FaChevronRight />
            </Link>
          ) : nextBook ? (
            <Link to={`/bible/${nextBook.slug}/1`} className="flex items-center gap-2 text-blue-300 hover:text-blue-200 text-sm">
              {nextBook[lang] || nextBook.en} <FaChevronRight />
            </Link>
          ) : <span />}
        </div>
      </div>
    </MainLayout>
  );
};

export default BibleChapter;
