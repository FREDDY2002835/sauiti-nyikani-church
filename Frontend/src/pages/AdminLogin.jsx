import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import logo from "../assets/logo/logo.png";
import { API_URL } from "../config/api";
import { isAuthenticated, saveSession } from "../auth/auth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated()) navigate("/admin/manage", { replace: true });
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Login failed.");

      saveSession(data);
      navigate(location.state?.from || "/admin/manage", { replace: true });
    } catch (err) {
      setError(err.message || "Could not sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10 bg-[#081B33]">
      <div className="w-full max-w-md bg-white/10 border border-white/20 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-lg">
        <div className="text-center mb-8">
          <img src={logo} alt="Sauti Nyikani Church" className="w-20 h-20 rounded-full object-cover mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Management App</h1>
          <p className="text-slate-300 text-sm mt-2">Sauti Nyikani Church</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-sm text-slate-200">Admin email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="mt-2 w-full rounded-xl bg-black/20 border border-white/20 px-4 py-3 text-white outline-none focus:border-blue-400"
              placeholder="admin@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-200">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl bg-black/20 border border-white/20 px-4 py-3 text-white outline-none focus:border-blue-400"
              placeholder="••••••••"
            />
          </label>

          {error && <p className="text-sm text-red-300 bg-red-500/10 border border-red-400/20 rounded-xl p-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold py-3.5 flex items-center justify-center gap-2 transition"
          >
            <FaLock /> {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
