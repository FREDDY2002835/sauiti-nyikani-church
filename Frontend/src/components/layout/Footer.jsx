import { Link } from "react-router-dom";
import logo from "../../assets/logo/logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#06172B] py-8 text-center">
      <img
        src={logo}
        alt="Sauti Nyikani Church logo"
        className="w-14 h-14 mx-auto mb-3 rounded-full object-cover"
      />
      <p className="text-sm text-slate-400">
        © 2026 Sauti Nyikani Church. All rights reserved.
      </p>
      <Link
        to="/admin/manage"
        className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
      >
        Manage
      </Link>
    </footer>
  );
};

export default Footer;