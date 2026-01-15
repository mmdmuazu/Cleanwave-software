import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import ImpactCounter from "../components/ImpactCounter";

export default function Impact() {
  return (
    <section className="container mx-auto px-4 section-padding">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SectionHeader title="Impact" subtitle={null} />
      </motion.div>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <ImpactCounter label="Youth & Students Trained" value={1200} />
        <ImpactCounter label="Schools & Communities Reached" value={85} />
        <ImpactCounter label="Startups Supported" value={45} />
        <ImpactCounter label="Jobs & Green Skills Created" value={300} />
      </motion.div>
    </section>
  );
}
