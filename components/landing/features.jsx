"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { useRef } from "react";
import { Zap, Layout, Sparkles, ArrowRight, Globe, Lock, BarChart3, MessageSquare } from "lucide-react";
import Link from "next/link";

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
    <span className="inline-flex text-emerald-400 min-w-[12ch] justify-center">
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
  );
}

const features = [
  {
    title: "Instant Resolution",
    description:
      "Route tickets to the right experts automatically. Resolve blockers in record time with smart assignment.",
    icon: Zap,
    iconColor: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    hoverBorder: "group-hover:border-yellow-500/40",
  },
  {
    title: "Project Tracking",
    description:
      "Monitor project health with real-time analytics and comprehensive team overviews at a glance.",
    icon: Layout,
    iconColor: "text-sky-400",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/20",
    hoverBorder: "group-hover:border-sky-500/40",
  },
  {
    title: "Team Collaboration",
    description:
      "Centralize discussions and documentation. Keep everyone aligned on priorities and deadlines.",
    icon: Sparkles,
    iconColor: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
    hoverBorder: "group-hover:border-violet-500/40",
  },
];

const secondaryFeatures = [
  {
    title: "Global Access",
    description: "Access your dashboard from anywhere in the world with secure cloud hosting.",
    icon: Globe,
  },
  {
    title: "Enterprise Security",
    description: "Bank-level encryption and role-based access control for peace of mind.",
    icon: Lock,
  },
  {
    title: "Analytics Dashboard",
    description: "Visualize ticket trends, resolution rates, and team performance in real-time.",
    icon: BarChart3,
  },
  {
    title: "Team Chat",
    description: "Built-in commenting system for seamless communication on every ticket.",
    icon: MessageSquare,
  },
];

function AnimatedSection({ children, className, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Features() {
  return (
    <div className="relative overflow-hidden bg-neutral-950">
      {/* Features Section */}
      <section className="py-32 px-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-24">
            <AnimatedSection>
              <span className="inline-block px-4 py-1.5 mb-6 border border-white/10 rounded-full bg-white/5 backdrop-blur-md text-sm font-medium text-neutral-400 tracking-wider uppercase">
                Platform Features
              </span>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                Engineered for <RollingWord />
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="text-neutral-400 max-w-2xl mx-auto text-lg leading-relaxed">
                We have optimized every aspect of the project lifecycle to ensure your
                team operates at peak efficiency.
              </p>
            </AnimatedSection>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={0.1 + index * 0.1}>
                <div
                  className={`group relative p-8 bg-neutral-900/40 backdrop-blur-xl border border-white/5 rounded-3xl hover:border-white/20 transition-all duration-500 h-full cursor-default`}
                >
                  {/* Card Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}
                  />

                  <div className="relative">
                    <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-neutral-400 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Secondary Features Grid */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {secondaryFeatures.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={0.05 * index}>
                <div className="group p-6 bg-neutral-900/20 border border-white/5 rounded-2xl hover:bg-neutral-900/40 hover:border-white/10 transition-all duration-300 h-full">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                    <feature.icon className="w-5 h-5 text-neutral-300 group-hover:text-white transition-colors" />
                  </div>
                  <h4 className="font-semibold mb-2">{feature.title}</h4>
                  <p className="text-sm text-neutral-400 leading-relaxed">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              Ready to streamline your
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
                support workflow?
              </span>
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <p className="text-neutral-400 text-lg mb-10 max-w-xl mx-auto">
              Join hundreds of teams already using TicketGo to manage their support requests efficiently.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-neutral-200 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 bg-neutral-900 text-white border border-white/10 rounded-full font-bold text-lg hover:bg-neutral-800 hover:border-white/20 transition-all duration-300 hover:scale-105"
              >
                Sign In
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
