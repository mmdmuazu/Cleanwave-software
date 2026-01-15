import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import CTA from "../components/CTA";

export default function Coworking() {
  return (
    <section className="container mx-auto px-4 section-padding">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SectionHeader title="Co-working Space" subtitle={null} />
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
          Our co-working space provides a collaborative, affordable, and
          mission-driven environment for startups, freelancers, researchers,
          NGOs, and social enterprises working in sustainability and innovation.
        </p>
      </motion.div>
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <motion.div
          className="card"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h4 className="font-semibold text-xl">Features & Benefits</h4>
          <ul className="mt-4 text-gray-600 space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Hot desks & dedicated desks
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Meeting rooms
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Community events & mentorship
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              Learning opportunities
            </li>
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <CTA
            title="Book Co-working Space"
            description="Reserve a desk or meeting room at our hub."
            ctaText="Book Now"
            ctaHref="/contact"
          />
        </motion.div>
      </div>
    </section>
  );
}
