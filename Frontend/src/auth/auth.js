export const AUTH_TOKEN_KEY = "sauti_admin_token";
export const ADMIN_USER_KEY = "sauti_admin_user";
export const SECTION_TOKEN_KEY = "sauti_section_token";

export const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY);
export const getAdminUser = () => {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_USER_KEY) || "null");
  } catch {
    return null;
  }
};

export const saveSession = (data) => {
  localStorage.setItem(AUTH_TOKEN_KEY, data.token);
  localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user || {}));
};

export const clearSession = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
  clearSectionToken();
};

export const isAuthenticated = () => Boolean(getToken());

// --- Extra password for Tithes, Elders Council and Finance ---
// Kept in sessionStorage on purpose: it disappears when the tab or the
// installed app is closed, so the sections lock themselves again.
export const getSectionToken = () => sessionStorage.getItem(SECTION_TOKEN_KEY);
export const saveSectionToken = (token) => sessionStorage.setItem(SECTION_TOKEN_KEY, token);
export const clearSectionToken = () => sessionStorage.removeItem(SECTION_TOKEN_KEY);
