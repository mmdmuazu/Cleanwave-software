import React from "react";
import { motion } from "framer-motion";

export default function Card({ title, children, icon }) {
  return (
    <motion.article
      className="card"
      whileHover={{
        y: -6,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex items-start gap-6">
        {icon && (
          <div className="text-brand-primary text-3xl flex-shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-xl text-brand-text">{title}</h3>
          <div className="mt-4 text-brand-text/70 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
