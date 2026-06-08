"use client";

import { motion } from "motion/react";
import { Ticket, Zap, Shield, BarChart3, Users, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const stats = [
  { value: "10x", label: "Faster" },
  { value: "99.9%", label: "Uptime" },
  { value: "500+", label: "Teams" },
];

const features = [
  { icon: Zap, label: "Smart Routing" },
  { icon: Shield, label: "Secure" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Users, label: "Collaboration" },
];

export function AuthLayout({ children, mode = "login" }) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Left Side - Image/Wallpaper (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-1/2 relative overflow-hidden bg-neutral-950">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-neutral-950 to-violet-900/20" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 -right-20 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[80px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[120px]" />
        </div>

        {/* Floating decorative elements */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            style={{
              left: `${10 + (i * 18) % 80}%`,
              top: `${15 + (i * 12) % 70}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 5 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
          />
        ))}

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12 xl:p-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group w-fit">
            <div className="bg-white p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
              <Ticket className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">TicketGo</span>
          </Link>

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-center max-w-md">
            {/* Main headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-6">
                Streamline Your
                <span className="block bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
                  Support Workflow
                </span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-neutral-400 text-lg leading-relaxed mb-10"
            >
              Join hundreds of teams already using TicketGo to manage their support requests efficiently.
            </motion.p>

            {/* Feature tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              {features.map((feature) => (
                <div
                  key={feature.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <feature.icon className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-neutral-300">{feature.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex gap-8"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-neutral-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Bottom quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <CheckCircle key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed mb-4">
              &ldquo;TicketGo transformed how we handle support. Resolution time dropped by 60% in the first month.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center text-white font-bold text-sm">
                JD
              </div>
              <div>
                <p className="text-sm font-medium text-white">Jane Doe</p>
                <p className="text-xs text-neutral-500">Head of Support, Acme Inc.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col relative">
        {/* Background for mobile */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Top bar */}
          <div className="flex items-center justify-between p-6">
            <Link href="/" className="lg:hidden flex items-center gap-2">
              <div className="bg-white p-1.5 rounded-lg">
                <Ticket className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">TicketGo</span>
            </Link>
            <div className="ml-auto">
              <ThemeToggle variant="ghost" size="icon" />
            </div>
          </div>

          {/* Form area */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
