import { useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MainLayout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_center,_#1e3a8a_0%,_#0a1229_65%,_#020617_100%)] text-white">
      <Navbar />

      <main key={location.pathname} className="flex-1 animate-page-fade">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;