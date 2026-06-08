"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Layout, Zap, Shield, Sparkles } from "lucide-react";

const words = ["Speed.", "Productivity.", "Efficiency.", "Performance."];

function RollingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="m-auto min-w-[12ch]">
      <span className="inline-flex text-green-400 ">
        <AnimatePresence mode="popLayout" initial={false}>
          {words[index].split("").map((char, i) => (
            <motion.span
              key={`${words[index]}-${i}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: i * 0.05,
              }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </AnimatePresence>
      </span>
    </div>
  );
}

const features = [
  {
    title: "Instant Resolution",
    description:
      "Route tickets to the right experts automatically. Resolve blockers in record time.",
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    color: "from-yellow-500/20",
  },
  {
    title: "Project Tracking",
    description:
      "Monitor project health with real-time analytics and comprehensive team overviews.",
    icon: <Layout className="w-6 h-6 text-blue-400" />,
    color: "from-blue-500/20",
  },
  {
    title: "Team Collaboration",
    description:
      "Centralize discussions and documentation. Keep everyone aligned on priorities.",
    icon: <Sparkles className="w-6 h-6 text-purple-400" />,
    color: "from-purple-500/20",
  },
];

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0,
    },
  },
};

const cardVariants = {
  hidden: (i) => ({
    opacity: 0,
    scale: 0.8,
    rotateY: 45,
    rotateX: -10,
    rotateZ: -15,
    x:
      i % 3 === 0
        ? "calc(100% + 2rem)"
        : i % 3 === 2
          ? "calc(-100% - 2rem)"
          : 0,
    y:
      Math.floor(i / 3) > 0 ? `calc(-${Math.floor(i / 3)} * (100% + 2rem))` : 0,
    filter: "blur(4px)",
    transition: {
      type: "spring",
      stiffness: 1,
      damping: 2,
    },
  }),
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    rotateX: 0,
    rotateZ: 0,
    x: 0,
    y: 0,
    z: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 14,
      mass: 1,
    },
  },
};

export default function Features() {
  return (
    <section className="py-32 px-6 relative overflow-hidden bg-neutral-950">
      {/* Background decorative element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-6 border border-white/10 rounded-full bg-white/5 backdrop-blur-md"
          >
            <span className="text-sm font-medium text-neutral-400 tracking-wider uppercase">
              Platform Features
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
          >
            Engineered for <RollingWord />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            We've optimized every aspect of the project lifecycle to ensure your
            team operates at peak efficiency.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              whileHover={{
                y: -12,
                scale: 1.02,
                transition: { duration: 0.2, ease: "easeOut" },
              }}
              className="group relative p-10 bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] hover:border-white/20 transition-all duration-500 shadow-2xl"
            >
              {/* Card Glow Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]`}
              />

              <div className="relative">
                <div className="w-14 h-14 bg-neutral-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white group-hover:rotate-6 transition-all duration-300">
                  <div className="group-hover:text-black transition-colors duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
