// This file handles everything to do with reading the Bible online:
// the standard list of all 66 books (names + chapter counts - this is
// universal, public information, not copyrighted), and figuring out
// which specific Bible translation to use for each site language.
//
// We use the free wldeh/bible-api (served via the jsDelivr CDN), which
// needs no API key: https://github.com/wldeh/bible-api

const BIBLES_INDEX_URL =
  "https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/bibles.json";

// The standard 66-book Protestant Bible, in order. "slug" is the
// identifier this API expects in its URLs (all lowercase, no spaces).
export const BIBLE_BOOKS = [
  { slug: "genesis", en: "Genesis", fr: "Genèse", sw: "Mwanzo", chapters: 50, testament: "old" },
  { slug: "exodus", en: "Exodus", fr: "Exode", sw: "Kutoka", chapters: 40, testament: "old" },
  { slug: "leviticus", en: "Leviticus", fr: "Lévitique", sw: "Mambo ya Walawi", chapters: 27, testament: "old" },
  { slug: "numbers", en: "Numbers", fr: "Nombres", sw: "Hesabu", chapters: 36, testament: "old" },
  { slug: "deuteronomy", en: "Deuteronomy", fr: "Deutéronome", sw: "Kumbukumbu la Torati", chapters: 34, testament: "old" },
  { slug: "joshua", en: "Joshua", fr: "Josué", sw: "Yoshua", chapters: 24, testament: "old" },
  { slug: "judges", en: "Judges", fr: "Juges", sw: "Waamuzi", chapters: 21, testament: "old" },
  { slug: "ruth", en: "Ruth", fr: "Ruth", sw: "Ruthu", chapters: 4, testament: "old" },
  { slug: "1samuel", en: "1 Samuel", fr: "1 Samuel", sw: "1 Samweli", chapters: 31, testament: "old" },
  { slug: "2samuel", en: "2 Samuel", fr: "2 Samuel", sw: "2 Samweli", chapters: 24, testament: "old" },
  { slug: "1kings", en: "1 Kings", fr: "1 Rois", sw: "1 Wafalme", chapters: 22, testament: "old" },
  { slug: "2kings", en: "2 Kings", fr: "2 Rois", sw: "2 Wafalme", chapters: 25, testament: "old" },
  { slug: "1chronicles", en: "1 Chronicles", fr: "1 Chroniques", sw: "1 Mambo ya Nyakati", chapters: 29, testament: "old" },
  { slug: "2chronicles", en: "2 Chronicles", fr: "2 Chroniques", sw: "2 Mambo ya Nyakati", chapters: 36, testament: "old" },
  { slug: "ezra", en: "Ezra", fr: "Esdras", sw: "Ezra", chapters: 10, testament: "old" },
  { slug: "nehemiah", en: "Nehemiah", fr: "Néhémie", sw: "Nehemia", chapters: 13, testament: "old" },
  { slug: "esther", en: "Esther", fr: "Esther", sw: "Esta", chapters: 10, testament: "old" },
  { slug: "job", en: "Job", fr: "Job", sw: "Ayubu", chapters: 42, testament: "old" },
  { slug: "psalms", en: "Psalms", fr: "Psaumes", sw: "Zaburi", chapters: 150, testament: "old" },
  { slug: "proverbs", en: "Proverbs", fr: "Proverbes", sw: "Mithali", chapters: 31, testament: "old" },
  { slug: "ecclesiastes", en: "Ecclesiastes", fr: "Ecclésiaste", sw: "Mhubiri", chapters: 12, testament: "old" },
  { slug: "songofsolomon", en: "Song of Solomon", fr: "Cantique des Cantiques", sw: "Wimbo Ulio Bora", chapters: 8, testament: "old" },
  { slug: "isaiah", en: "Isaiah", fr: "Ésaïe", sw: "Isaya", chapters: 66, testament: "old" },
  { slug: "jeremiah", en: "Jeremiah", fr: "Jérémie", sw: "Yeremia", chapters: 52, testament: "old" },
  { slug: "lamentations", en: "Lamentations", fr: "Lamentations", sw: "Maombolezo", chapters: 5, testament: "old" },
  { slug: "ezekiel", en: "Ezekiel", fr: "Ézéchiel", sw: "Ezekieli", chapters: 48, testament: "old" },
  { slug: "daniel", en: "Daniel", fr: "Daniel", sw: "Danieli", chapters: 12, testament: "old" },
  { slug: "hosea", en: "Hosea", fr: "Osée", sw: "Hosea", chapters: 14, testament: "old" },
  { slug: "joel", en: "Joel", fr: "Joël", sw: "Yoeli", chapters: 3, testament: "old" },
  { slug: "amos", en: "Amos", fr: "Amos", sw: "Amosi", chapters: 9, testament: "old" },
  { slug: "obadiah", en: "Obadiah", fr: "Abdias", sw: "Obadia", chapters: 1, testament: "old" },
  { slug: "jonah", en: "Jonah", fr: "Jonas", sw: "Yona", chapters: 4, testament: "old" },
  { slug: "micah", en: "Micah", fr: "Michée", sw: "Mika", chapters: 7, testament: "old" },
  { slug: "nahum", en: "Nahum", fr: "Nahum", sw: "Nahumu", chapters: 3, testament: "old" },
  { slug: "habakkuk", en: "Habakkuk", fr: "Habacuc", sw: "Habakuki", chapters: 3, testament: "old" },
  { slug: "zephaniah", en: "Zephaniah", fr: "Sophonie", sw: "Sefania", chapters: 3, testament: "old" },
  { slug: "haggai", en: "Haggai", fr: "Aggée", sw: "Hagai", chapters: 2, testament: "old" },
  { slug: "zechariah", en: "Zechariah", fr: "Zacharie", sw: "Zekaria", chapters: 14, testament: "old" },
  { slug: "malachi", en: "Malachi", fr: "Malachie", sw: "Malaki", chapters: 4, testament: "old" },
  { slug: "matthew", en: "Matthew", fr: "Matthieu", sw: "Mathayo", chapters: 28, testament: "new" },
  { slug: "mark", en: "Mark", fr: "Marc", sw: "Marko", chapters: 16, testament: "new" },
  { slug: "luke", en: "Luke", fr: "Luc", sw: "Luka", chapters: 24, testament: "new" },
  { slug: "john", en: "John", fr: "Jean", sw: "Yohana", chapters: 21, testament: "new" },
  { slug: "acts", en: "Acts", fr: "Actes", sw: "Matendo ya Mitume", chapters: 28, testament: "new" },
  { slug: "romans", en: "Romans", fr: "Romains", sw: "Warumi", chapters: 16, testament: "new" },
  { slug: "1corinthians", en: "1 Corinthians", fr: "1 Corinthiens", sw: "1 Wakorintho", chapters: 16, testament: "new" },
  { slug: "2corinthians", en: "2 Corinthians", fr: "2 Corinthiens", sw: "2 Wakorintho", chapters: 13, testament: "new" },
  { slug: "galatians", en: "Galatians", fr: "Galates", sw: "Wagalatia", chapters: 6, testament: "new" },
  { slug: "ephesians", en: "Ephesians", fr: "Éphésiens", sw: "Waefeso", chapters: 6, testament: "new" },
  { slug: "philippians", en: "Philippians", fr: "Philippiens", sw: "Wafilipi", chapters: 4, testament: "new" },
  { slug: "colossians", en: "Colossians", fr: "Colossiens", sw: "Wakolosai", chapters: 4, testament: "new" },
  { slug: "1thessalonians", en: "1 Thessalonians", fr: "1 Thessaloniciens", sw: "1 Wathesalonike", chapters: 5, testament: "new" },
  { slug: "2thessalonians", en: "2 Thessalonians", fr: "2 Thessaloniciens", sw: "2 Wathesalonike", chapters: 3, testament: "new" },
  { slug: "1timothy", en: "1 Timothy", fr: "1 Timothée", sw: "1 Timotheo", chapters: 6, testament: "new" },
  { slug: "2timothy", en: "2 Timothy", fr: "2 Timothée", sw: "2 Timotheo", chapters: 4, testament: "new" },
  { slug: "titus", en: "Titus", fr: "Tite", sw: "Tito", chapters: 3, testament: "new" },
  { slug: "philemon", en: "Philemon", fr: "Philémon", sw: "Filemoni", chapters: 1, testament: "new" },
  { slug: "hebrews", en: "Hebrews", fr: "Hébreux", sw: "Waebrania", chapters: 13, testament: "new" },
  { slug: "james", en: "James", fr: "Jacques", sw: "Yakobo", chapters: 5, testament: "new" },
  { slug: "1peter", en: "1 Peter", fr: "1 Pierre", sw: "1 Petro", chapters: 5, testament: "new" },
  { slug: "2peter", en: "2 Peter", fr: "2 Pierre", sw: "2 Petro", chapters: 3, testament: "new" },
  { slug: "1john", en: "1 John", fr: "1 Jean", sw: "1 Yohana", chapters: 5, testament: "new" },
  { slug: "2john", en: "2 John", fr: "2 Jean", sw: "2 Yohana", chapters: 1, testament: "new" },
  { slug: "3john", en: "3 John", fr: "3 Jean", sw: "3 Yohana", chapters: 1, testament: "new" },
  { slug: "jude", en: "Jude", fr: "Jude", sw: "Yuda", chapters: 1, testament: "new" },
  { slug: "revelation", en: "Revelation", fr: "Apocalypse", sw: "Ufunuo", chapters: 22, testament: "new" },
];

export const getBook = (slug) => BIBLE_BOOKS.find((b) => b.slug === slug);

// Known-good fallback version IDs, in case the dynamic lookup below
// fails (e.g. the person is offline, or the index file is unreachable).
// There is deliberately NO French fallback here - unlike English and
// Swahili, we were never able to confirm a working French Bible id in
// this API, so guessing one risks silently showing the wrong content.
// If French can't be dynamically resolved, the chapter page falls back
// to English instead, with a clear on-screen note.
const FALLBACK_VERSIONS = {
  en: "en-kjv",
  sw: "swh-onen",
};

const LANGUAGE_NAMES = {
  en: "English",
  fr: "French",
  sw: "Swahili",
};

let bibleIndexCache = null; // caches the big bibles.json so we only fetch it once
const resolvedVersionCache = {}; // caches which version id we picked per language

async function loadBibleIndex() {
  if (bibleIndexCache) return bibleIndexCache;
  const response = await fetch(BIBLES_INDEX_URL);
  if (!response.ok) throw new Error("Could not load Bible version list");
  bibleIndexCache = await response.json();
  return bibleIndexCache;
}

// Picks the best available full-Bible translation for a given site
// language ("en", "fr", or "sw"), preferring a complete Bible over a
// New-Testament-only translation.
export async function resolveBibleVersion(lang) {
  if (resolvedVersionCache[lang]) return resolvedVersionCache[lang];

  try {
    const index = await loadBibleIndex();
    const languageName = LANGUAGE_NAMES[lang];
    const matches = index.filter(
      (v) => v.language && v.language.name === languageName
    );

    // Prefer a full Bible, then "Bible with Deuterocanon", then anything else available.
    const best =
      matches.find((v) => v.scope === "Bible") ||
      matches.find((v) => v.scope === "Bible with Deuterocanon") ||
      matches[0];

    if (best) {
      resolvedVersionCache[lang] = best.id;
      return best.id;
    }
  } catch (err) {
    console.error("Bible version lookup failed:", err.message);
  }

  // No confirmed version for this language - null tells the caller to
  // fall back to English rather than silently trying a wrong guess.
  const fallback = FALLBACK_VERSIONS[lang] || null;
  resolvedVersionCache[lang] = fallback;
  return fallback;
}

// Fetches one chapter's text. Different Bible versions in this API can
// return slightly different JSON shapes, so this normalizes them all
// into a simple array of { verse, text }.
export async function fetchChapter(versionId, bookSlug, chapterNum) {
  const url = `https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/${versionId}/books/${bookSlug}/chapters/${chapterNum}.json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("This chapter isn't available in this translation.");
  }
  const data = await response.json();

  // Normalize whatever shape comes back into [{ verse, text }, ...]
  const rawVerses = data.verses || data.data || (Array.isArray(data) ? data : []);
  return rawVerses.map((v, i) => ({
    verse: v.verse || v.number || i + 1,
    text: (v.text || v.content || "").replace(/\s+/g, " ").trim(),
  }));
}
