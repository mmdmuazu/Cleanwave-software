import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="container mx-auto px-4 py-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-4xl font-semibold text-gray-800">Page Not Found</h2>
        <p className="mt-6 text-lg text-gray-600 max-w-md mx-auto">
          The page you are looking for does not exist.
        </p>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Link to="/" className="btn-primary">
            Go Home
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
