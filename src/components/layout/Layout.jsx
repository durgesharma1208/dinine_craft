import { useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AnnouncementBar from "./AnnouncementBar";
import SearchModal from "../search/SearchModal";
import ScrollToTop from "../ui/ScrollToTop";
import BackToTop from "../ui/BackToTop";
import StickyWhatsApp from "../ui/StickyWhatsApp";
import ExitIntentPopup from "../ui/ExitIntentPopup";

export default function Layout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 22,
    mass: 0.2,
  });

  return (
    <>
      <ScrollToTop />
      <motion.div
        style={{ scaleX: progress }}
        className="fixed top-0 left-0 right-0 h-0.5 origin-left z-100 bg-linear-to-r from-primary-dark via-primary to-gold"
        aria-hidden="true"
      />
      <AnnouncementBar />
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <main>
        <Outlet />
      </main>
      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <BackToTop />
      <StickyWhatsApp />
      <ExitIntentPopup />
    </>
  );
}
