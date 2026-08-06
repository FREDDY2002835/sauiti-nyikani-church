import logo from "../../assets/logo/logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#06172B] py-8 text-center">
      <img
        src={logo}
        alt="Sauiti Nyikani Church logo"
        className="w-14 h-14 mx-auto mb-3 rounded-full object-cover"
      />
      <p className="text-sm text-slate-400">
        © 2026 Sauiti Nyikani Church. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;