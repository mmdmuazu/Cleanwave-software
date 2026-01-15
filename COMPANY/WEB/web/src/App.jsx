import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import WhatWeDo from "./pages/WhatWeDo";
import Programs from "./pages/Programs";
import Coworking from "./pages/Coworking";
import Team from "./pages/Team";
import Partners from "./pages/Partners";
import Impact from "./pages/Impact";
import GetInvolved from "./pages/GetInvolved";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.3,
};

export default function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <MainLayout />
            </motion.div>
          }
        >
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="what-we-do" element={<WhatWeDo />} />
          <Route path="programs" element={<Programs />} />
          <Route path="coworking" element={<Coworking />} />
          <Route path="team" element={<Team />} />
          <Route path="partners" element={<Partners />} />
          <Route path="impact" element={<Impact />} />
          <Route path="get-involved" element={<GetInvolved />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}
