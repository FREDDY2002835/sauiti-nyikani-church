import { useState } from "react";
import { FaBars, FaTimes, FaMoon, FaGlobe } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0A2342] text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 md:px-8">

        {/* Logo */}
        <div>
          <h1 className="text-lg md:text-2xl font-bold">
            Sauiti Nyikani
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/ministries">Ministries</a>
          <a href="/sermons">Sermons</a>
          <a href="/events">Events</a>
          <a href="/gallery">Gallery</a>
          <a href="/contact">Contact</a>
        </nav>

        {/* Desktop Controls */}
        <div className="hidden lg:flex items-center gap-5">
          <button>
            <FaGlobe />
          </button>

          <button>
            <FaMoon />
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="flex lg:hidden items-center gap-4">

          <button>
            <FaMoon size={18} />
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

        </div>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#081B33] border-t border-slate-700">

          <div className="flex flex-col">

            {[
              "Home",
              "About",
              "Ministries",
              "Sermons",
              "Events",
              "Gallery",
              "Contact",
            ].map((item) => (
              <a
                key={item}
                href="/"
                className="px-5 py-4 hover:bg-blue-700"
              >
                {item}
              </a>
            ))}

            <button className="flex items-center gap-2 px-5 py-4">
              <FaGlobe />
              English
            </button>

          </div>

        </div>
      )}
    </header>
  );
};

export default Navbar;