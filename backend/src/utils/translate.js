// This file auto-translates text using MyMemory - a free translation
// API that needs no signup or API key. Docs: https://mymemory.translated.net
//
// It has a daily character limit per IP address (generous enough for
// occasional admin use on a small church site), so this is meant for
// translating short admin-entered text (titles, descriptions), not bulk use.

const translateText = async (text, targetLang) => {
  if (!text || !text.trim()) return "";

  try {
    const params = new URLSearchParams({
      q: text,
      langpair: `en|${targetLang}`,
    });
    const response = await fetch(`https://api.mymemory.translated.net/get?${params}`);
    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }

    // Translation service hiccupped - fall back to the English text
    // rather than leaving the field blank.
    return text;
  } catch (err) {
    console.error(`Translation to "${targetLang}" failed:`, err.message);
    return text;
  }
};

/**
 * Translates one English string into French and Swahili.
 * @returns {Promise<{fr: string, sw: string}>}
 */
export const translateToFrenchAndSwahili = async (englishText) => {
  const [fr, sw] = await Promise.all([
    translateText(englishText, "fr"),
    translateText(englishText, "sw"),
  ]);
  return { fr, sw };
};
