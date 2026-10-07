import { getToken, getSectionToken, clearSectionToken } from "./auth";

const originalFetch = window.fetch.bind(window);

// Pages that need the extra "section" password.
const PRIVATE_SECTION_URL = /\/api\/(tithes|elders|finance)(\/|\?|$)/;

window.fetch = async (input, init = {}) => {
  const url = typeof input === "string" ? input : input?.url || "";
  const token = getToken();

  const isApiRequest = /\/api\//.test(url) || /\/api$/.test(url);
  if (!token || !isApiRequest) {
    return originalFetch(input, init);
  }

  const headers = new Headers(init.headers || (typeof input !== "string" ? input.headers : undefined));
  headers.set("Authorization", `Bearer ${token}`);

  const sectionToken = getSectionToken();
  if (sectionToken) headers.set("X-Section-Token", sectionToken);

  const response = await originalFetch(input, { ...init, headers });

  // The unlock expired (or was refused): lock the sections again so the
  // password box shows up instead of an empty page.
  if (response.status === 403 && PRIVATE_SECTION_URL.test(url)) {
    clearSectionToken();
    window.dispatchEvent(new Event("sections-locked"));
  }

  return response;
};
