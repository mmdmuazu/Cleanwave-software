import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

function useCount(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!hasAnimated) {
      let start = 0;
      let raf;
      const step = (timestamp) => {
        start += 16;
        const progress = Math.min(start / duration, 1);
        setCount(Math.floor(progress * target));
        if (progress < 1) raf = requestAnimationFrame(step);
        else setHasAnimated(true);
      };
      raf = requestAnimationFrame(step);
      return () => raf && cancelAnimationFrame(raf);
    }
  }, [target, duration, hasAnimated]);

  return count;
}

export default function ImpactCounter({ label, value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useCount(isInView ? value : 0);

  return (
    <motion.div
      ref={ref}
      className="card text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className="text-5xl font-bold text-brand-primary">
        {count}
        {value >= 1000 ? "+" : ""}
      </div>
      <div className="mt-4 text-brand-text/70 font-medium text-lg">{label}</div>
    </motion.div>
  );
}
