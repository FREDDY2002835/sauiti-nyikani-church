import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaLock } from "react-icons/fa";
import { API_URL } from "../../config/api";
import { getSectionToken, saveSectionToken, clearSectionToken } from "../../auth/auth";

// Wraps the Tithes, Elders Council and Finance tabs. Until the extra password
// is entered, the tab content is NOT shown (and not even loaded). The server
// also refuses to send the data without the unlock token, so this is real
// protection and not just a hidden screen.
const SectionLock = ({ children }) => {
  const { t } = useTranslation();
  const [unlocked, setUnlocked] = useState(Boolean(getSectionToken()));
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // The server said "locked" (token expired): show the password box again.
  useEffect(() => {
    const onLocked = () => {
      setUnlocked(false);
      setError(t("management.lock.expired", "The section was locked again. Please enter the password."));
    };
    window.addEventListener("sections-locked", onLocked);
    return () => window.removeEventListener("sections-locked", onLocked);
  }, [t]);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/auth/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || t("management.lock.failed", "Could not unlock. Please try again."));
        return;
      }

      saveSectionToken(data.token);
      setPassword("");
      setUnlocked(true);
    } catch {
      setError(t("management.lock.network", "Could not reach the server. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  const handleLock = () => {
    clearSectionToken();
    setUnlocked(false);
    setError("");
  };

  if (!unlocked) {
    return (
      <form
        onSubmit={handleUnlock}
        className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 text-center"
      >
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-300">
          <FaLock />
        </div>
        <h2 className="text-white font-bold text-lg mb-1">
          {t("management.lock.title", "Private section")}
        </h2>
        <p className="text-slate-400 text-sm mb-5">
          {t("management.lock.hint", "Enter the section password to open Tithes, Elders Council and Finance.")}
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
          autoFocus
          placeholder={t("management.lock.placeholder", "Section password")}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
        />

        {error && <p className="mt-3 text-red-300 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={busy || !password}
          className="mt-5 w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          {busy ? t("management.lock.checking", "Checking...") : t("management.lock.unlock", "Unlock")}
        </button>
      </form>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLock}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm hover:bg-white/10 transition"
        >
          <FaLock className="text-xs" />
          {t("management.lock.lockNow", "Lock now")}
        </button>
      </div>
      {children}
    </div>
  );
};

export default SectionLock;
