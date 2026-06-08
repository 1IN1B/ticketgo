"use client";

import { motion } from "motion/react";
import HeroBackground from "./hero-background";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-[90vh] flex items-center">
      <HeroBackground />

      <div className="relative max-w-7xl mx-auto text-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 border border-white/10 rounded-full bg-white/5 backdrop-blur-md text-sm font-medium text-neutral-400 tracking-wider uppercase">
            Support Desk Platform
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8"
        >
          <span className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
            Master Your
          </span>
          <br />
          <span className="bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
            Internal Workflows
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-neutral-400 mb-12 leading-relaxed"
        >
          The ultimate internal ticketing and project management platform.
          Resolve issues faster, track progress seamlessly, and boost team
          productivity with TicketGo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/dashboard"
            className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:scale-105"
          >
            <span className="relative z-10">Explore Dashboard</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-300 via-sky-300 to-violet-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
          <Link
            href="/tickets/new"
            className="px-8 py-4 bg-neutral-900 text-white border border-white/10 rounded-full font-bold text-lg hover:bg-neutral-800 hover:border-white/20 transition-all duration-300 hover:scale-105"
          >
            Create New Ticket
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
        >
          {[
            { value: "10x", label: "Faster Resolution" },
            { value: "99.9%", label: "Uptime" },
            { value: "500+", label: "Teams" },
            { value: "24/7", label: "Support" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-neutral-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
