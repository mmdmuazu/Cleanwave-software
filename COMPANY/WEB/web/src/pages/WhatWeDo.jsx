import React from "react";
import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import Card from "../components/Card";
import { BookOpen, Recycle, Zap, Users } from "lucide-react";

const services = [
  {
    title: "Climate & Sustainability Education",
    desc: "We design and deliver structured climate education programs for schools, youth groups, and communities. This includes Green Clubs, age-appropriate curricula, comics, animations, storytelling, trainings, and capacity-building workshops that make sustainability practical and engaging.",
    icon: <BookOpen />,
  },
  {
    title: "Circular Economy & Waste Innovation",
    desc: "SIH promotes circular economy practices by supporting recycling innovation, waste reduction, resource efficiency, and sustainable production. We run pilot projects, research initiatives, and industry collaborations that turn waste into value.",
    icon: <Recycle />,
  },
  {
    title: "Innovation, Technology & Entrepreneurship",
    desc: "We support climate-focused startups and innovators through incubation, acceleration, innovation labs, co-working spaces, mentorship, and access to funding and partnerships.",
    icon: <Zap />,
  },
  {
    title: "Policy, Research & Community Engagement",
    desc: "SIH facilitates research, policy dialogue, advocacy, and stakeholder engagement to strengthen climate governance and community-led solutions across Northern Nigeria.",
    icon: <Users />,
  },
];

export default function WhatWeDo() {
  return (
    <section className="container mx-auto px-4 section-padding">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <SectionHeader title="What We Do" subtitle={null} />
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Card title={service.title} icon={service.icon}>
              {service.desc}
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
