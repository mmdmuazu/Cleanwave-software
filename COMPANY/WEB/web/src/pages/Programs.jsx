import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import Card from "../components/Card";
import { Users, Award, Lightbulb, Briefcase, Calendar } from "lucide-react";

const programs = [
  {
    title: "Green Clubs for Schools",
    desc: "Climate education clubs for nursery, primary, and secondary schools with annual graduations and awards.",
    icon: <Users />,
  },
  {
    title: "Trainings & Certifications",
    desc: "Short courses on sustainability, circular economy, climate leadership, and green skills.",
    icon: <Award />,
  },
  {
    title: "Innovation Labs & Accelerator",
    desc: "Support for startups, researchers, and innovators building climate solutions.",
    icon: <Lightbulb />,
  },
  {
    title: "Fellowships & Internships (SIWES)",
    desc: "Practical learning opportunities for students and young professionals.",
    icon: <Briefcase />,
  },
  {
    title: "Annual Climate & Innovation Conference",
    desc: "A regional convening for knowledge sharing, partnerships, and innovation showcase.",
    icon: <Calendar />,
  },
];

export default function Programs() {
  return (
    <section className="container mx-auto px-4 section-padding">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SectionHeader title="Programs" subtitle={null} />
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {programs.map((program, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Card title={program.title} icon={program.icon}>
              {program.desc}
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
