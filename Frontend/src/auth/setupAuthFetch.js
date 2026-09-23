import { getToken } from "./auth";

const originalFetch = window.fetch.bind(window);

window.fetch = (input, init = {}) => {
  const url = typeof input === "string" ? input : input?.url || "";
  const token = getToken();

  const isApiRequest = /\/api\//.test(url) || /\/api$/.test(url);
  if (!token || !isApiRequest) {
    return originalFetch(input, init);
  }

  const headers = new Headers(init.headers || (typeof input !== "string" ? input.headers : undefined));
  headers.set("Authorization", `Bearer ${token}`);

  return originalFetch(input, { ...init, headers });
};
