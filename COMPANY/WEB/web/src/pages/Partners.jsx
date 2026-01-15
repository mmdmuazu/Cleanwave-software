import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";

const partners = [
  "Schools and tertiary institutions",
  "Government agencies and policymakers",
  "Development partners and donors",
  "Private sector organizations",
  "NGOs and community-based groups",
  "Startups and innovators",
];

export default function Partners() {
  return (
    <section className="container mx-auto px-4 section-padding">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SectionHeader title="Partners & Stakeholders" subtitle={null} />
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
          We work with schools, government agencies, development partners,
          private sector organizations, NGOs, and startups. Partnerships are
          built around shared impact goals, transparency, and long-term
          collaboration.
        </p>
      </motion.div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {partners.map((partner, index) => (
          <motion.div
            key={index}
            className="card"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <p className="text-gray-700">{partner}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
