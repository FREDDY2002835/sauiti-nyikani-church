import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import Ministries from "../pages/Ministries";
import MinistryDetail from "../pages/MinistryDetail";
import AdminMinistries from "../pages/AdminMinistries";
import Sermons from "../pages/Sermons";
import Events from "../pages/Events";
import Gallery from "../pages/Gallery";
import AdminGallery from "../pages/AdminGallery";
import ChurchManagement from "../pages/ChurchManagement";
import Giving from "../pages/Giving";
import Prayer from "../pages/Prayer";
import Contact from "../pages/Contact";
import Settings from "../pages/Settings";
import Bible from "../pages/Bible";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/ministries" element={<Ministries />} />
      <Route path="/ministries/:id" element={<MinistryDetail />} />
      <Route path="/admin/ministries" element={<AdminMinistries />} />
      <Route path="/sermons" element={<Sermons />} />
      <Route path="/events" element={<Events />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/admin/gallery" element={<AdminGallery />} />
      <Route path="/admin/manage" element={<ChurchManagement />} />
      <Route path="/giving" element={<Giving />} />
      <Route path="/prayer" element={<Prayer />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/bible" element={<Bible />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;