import React from "react";
import { motion } from "framer-motion";

export default function CTA({ title, description, ctaText, ctaHref }) {
  return (
    <motion.div
      className="card flex flex-col md:flex-row md:items-center md:justify-between gap-8"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div>
        <h4 className="font-semibold text-2xl text-brand-text">{title}</h4>
        <p className="text-brand-text/70 mt-3 leading-relaxed text-lg">
          {description}
        </p>
      </div>
      <motion.a
        href={ctaHref}
        className="btn-primary shrink-0"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {ctaText}
      </motion.a>
    </motion.div>
  );
}
