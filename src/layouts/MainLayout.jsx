import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MobileNav from "../components/MobileNav";

function ScrollRestorer() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, search]);
  return null;
}

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <ScrollRestorer />
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <MobileNav />
    </div>
  );
}
