import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";

const teamMembers = [
  "Founder & Executive Director",
  "Hub Manager / Programs Lead",
  "Sustainability & Circular Economy Lead",
  "Innovation & Technology Lead",
  "Community & Partnerships Lead",
  "Finance & Operations Support",
];

export default function Team() {
  return (
    <section className="container mx-auto px-4 section-padding">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SectionHeader title="Our Team & Governance" subtitle={null} />
        <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
          SIH is led by a multidisciplinary team of professionals with
          experience in sustainability, innovation, technology, education, and
          community development.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {teamMembers.map((role, index) => (
          <motion.div
            key={index}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h5 className="font-semibold text-lg">{role}</h5>
          </motion.div>
        ))}
      </div>
      <motion.div
        className="mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <h4 className="font-semibold text-2xl">Advisory Board</h4>
        <p className="text-gray-600 mt-4 leading-relaxed">
          The Hub is guided by an Advisory Board made up of industry experts,
          academics, and development practitioners.
        </p>
      </motion.div>
    </section>
  );
}
