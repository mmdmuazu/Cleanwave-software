import React from "react";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import SectionHeader from "../components/SectionHeader";
import Card from "../components/Card";
import CTA from "../components/CTA";
import ImpactCounter from "../components/ImpactCounter";
import { FOCUS_AREAS } from "../data/focusAreas";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function Home() {
  return (
    <div>
      <Hero />
      <motion.section
        className="container mx-auto px-4 section-padding"
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        viewport={{ once: true, margin: "-100px" }}
      >
        <SectionHeader
          title="About Cleanwave Sustainability & Innovation Hub (SIH)"
          subtitle={null}
        />
        <p className="text-lg text-gray-700 leading-relaxed max-w-4xl">
          Cleanwave Sustainability & Innovation Hub (SIH) is a pioneering
          climate-focused hub based in Northern Nigeria, established to drive
          sustainability, circular economy solutions, and climate-smart
          innovation through education, technology, and entrepreneurship.
        </p>

        <motion.div
          className="mt-12"
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          viewport={{ once: true, margin: "-50px" }}
        >
          <SectionHeader title="Key Focus Areas" subtitle="" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {FOCUS_AREAS.map((a, index) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
              >
                <Card title={a.title} icon={a.icon}>
                  {a.desc}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mt-16"
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          viewport={{ once: true, margin: "-50px" }}
        >
          <SectionHeader title="Impact Highlights" subtitle="" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <ImpactCounter label="Youth & Students Trained" value={1200} />
            <ImpactCounter label="Schools & Communities Reached" value={85} />
            <ImpactCounter label="Startups Supported" value={45} />
            <ImpactCounter label="Jobs & Green Skills Created" value={300} />
          </div>
        </motion.div>

        <motion.div
          className="mt-16"
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          viewport={{ once: true, margin: "-50px" }}
        >
          <CTA
            title="Partner With Us"
            description="Collaborate on projects, research, and programs that create impact."
            ctaText="Partner"
            ctaHref="/partners"
          />
        </motion.div>
      </motion.section>
    </div>
  );
}
