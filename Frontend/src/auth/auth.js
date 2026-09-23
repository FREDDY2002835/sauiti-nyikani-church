export const AUTH_TOKEN_KEY = "sauti_admin_token";
export const ADMIN_USER_KEY = "sauti_admin_user";

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
};

export const isAuthenticated = () => Boolean(getToken());
