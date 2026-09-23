import { useEffect } from "react";

const AdminPwaSetup = () => {
  useEffect(() => {
    const id = "sauti-admin-manifest";
    let link = document.getElementById(id);

    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "manifest";
      link.href = "/admin-manifest.webmanifest";
      document.head.appendChild(link);
    }

    let registration;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/admin-sw.js", { scope: "/admin/" })
        .then((value) => {
          registration = value;
        })
        .catch(() => {});
    }

    return () => {
      if (registration) {
        // Keep the service worker installed so the management app remains installable.
      }
    };
  }, []);

  return null;
};

export default AdminPwaSetup;
