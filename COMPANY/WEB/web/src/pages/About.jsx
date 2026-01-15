import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";

const copy = `ABOUT CLEANWAVE SUSTAINABILITY & INNOVATION HUB (SIH)
Cleanwave Sustainability & Innovation Hub (SIH) is a pioneering climate-focused hub based in Northern Nigeria, established to drive sustainability, circular economy solutions, and climate-smart innovation through education, technology, and entrepreneurship.

SIH was created to respond to the urgent environmental, economic, and social challenges facing communities in Northern Nigeria, while unlocking opportunities for youth, institutions, and enterprises to participate in the green economy.

Operating as both a non-profit impact institution and a social enterprise, SIH delivers public-good programs while generating revenue through training, co-working, consulting, and innovation services to ensure long-term sustainability.

The Hub is part of the broader Cleanwave ecosystem, complementing Cleanwave Recycling Nigeria Limited by providing the knowledge, innovation, research, and talent pipeline needed to scale climate and circular economy solutions.

OUR VISION
To become the leading climate, sustainability, and innovation hub in Northern Nigeria—driving inclusive green growth, climate resilience, and locally developed solutions with regional and global impact.

OUR MISSION
To empower youth, schools, startups, communities, and institutions with the knowledge, tools, and platforms needed to design, deploy, and scale sustainable and climate-smart solutions that protect the environment while creating economic opportunities.

OUR CORE VALUES
Sustainability First: Environmental and social impact guide every decision.

Innovation with Purpose: Technology and creativity applied to real problems.

Inclusion & Equity: Youth, women, and underserved communities at the center.

Collaboration: Partnerships across sectors and disciplines.

Integrity & Accountability: Transparency in governance and impact.`;

export default function About() {
  return (
    <motion.section
      className="container mx-auto px-4 section-padding"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <SectionHeader title="About Us" subtitle={null} />
      <motion.div
        className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {copy.split("\n\n").map((paragraph, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
            className="mb-6"
          >
            {paragraph}
          </motion.p>
        ))}
      </motion.div>
    </motion.section>
  );
}
