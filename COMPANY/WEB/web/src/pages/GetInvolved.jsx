import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import CTA from "../components/CTA";

const ctas = [
  {
    title: "Join Programs",
    description: "Enroll in our training and Green Clubs.",
    ctaText: "View Programs",
    ctaHref: "/programs",
  },
  {
    title: "Partner or Donate",
    description: "Support our work through partnership or donations.",
    ctaText: "Partner",
    ctaHref: "/partners",
  },
  {
    title: "Volunteer or Intern",
    description: "Volunteer opportunities and internships available.",
    ctaText: "Volunteer",
    ctaHref: "/contact",
  },
  {
    title: "Book Co-working Space",
    description: "Reserve a desk or meeting room.",
    ctaText: "Book",
    ctaHref: "/coworking",
  },
];

export default function GetInvolved() {
  return (
    <section className="container mx-auto px-4 section-padding">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SectionHeader title="Get Involved" subtitle={null} />
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {ctas.map((cta, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <CTA
              title={cta.title}
              description={cta.description}
              ctaText={cta.ctaText}
              ctaHref={cta.ctaHref}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
