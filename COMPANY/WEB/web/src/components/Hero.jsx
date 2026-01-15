import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Hero() {
  return (
    <section className="bg-brand-background section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5"></div>
      <motion.div
        className="container mx-auto px-4 text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl font-bold text-brand-primary max-w-5xl mx-auto leading-tight text-gradient"
        >
          Cleanwave Sustainability & Innovation Hub (SIH)
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="mt-8 text-xl text-brand-text/80 max-w-4xl mx-auto leading-relaxed"
        >
          Cleanwave Sustainability & Innovation Hub (SIH) is a pioneering
          climate-focused hub based in Northern Nigeria, established to drive
          sustainability, circular economy solutions, and climate-smart
          innovation through education, technology, and entrepreneurship.
        </motion.p>
        <motion.div
          variants={itemVariants}
          className="mt-12 flex flex-col md:flex-row gap-6 justify-center"
        >
          <motion.a
            href="/get-involved"
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Involved
          </motion.a>
          <motion.a
            href="/programs"
            className="inline-block border-2 border-brand-primary text-brand-primary px-8 py-4 rounded-2xl hover:bg-brand-primary hover:text-white transition-all duration-300 font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join a Program
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
