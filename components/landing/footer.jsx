"use client";

import Link from "next/link";
import { Ticket, Twitter, Linkedin, Github } from "lucide-react";
import { motion } from "motion/react";

export default function Footer() {
  const sections = [
    {
      title: "Product",
      links: [
        { name: "Tickets", href: "/tickets" },
        { name: "Projects", href: "/projects" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Settings", href: "/settings" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "/about" },
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "/docs" },
        { name: "Help Center", href: "/help" },
        { name: "API Reference", href: "/api" },
        { name: "Community", href: "/community" },
      ],
    },
  ];

  const socials = [
    {
      name: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      href: "https://twitter.com",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      href: "https://linkedin.com",
    },
    {
      name: "GitHub",
      icon: <Github className="w-5 h-5" />,
      href: "https://github.com",
    },
  ];

  return (
    <footer className="relative bg-neutral-950 pt-20 pb-10 px-6 overflow-hidden shadow-[inset_0_-80px_100px_-50px_rgba(34,197,94,0.15)] mt-24 border-t border-white/5">
      {/* Green glow effect layer */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0.5 }}
        whileInView={{ opacity: 1, scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 h-[200px] bg-green-500/[0.2] blur-[120px] pointer-events-none origin-bottom"
      />

      {/* Accent bottom line with glow */}
      <motion.div
        initial={{ opacity: 0, width: "0%" }}
        whileInView={{ opacity: 1, width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent shadow-[0_0_20px_rgba(34,197,94,0.2)] mx-auto"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group w-fit">
              <div className="bg-white p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
                <Ticket className="w-5 h-5 text-black" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                TicketGo
              </span>
            </Link>
            <p className="text-neutral-400 max-w-sm mb-8 leading-relaxed">
              Empowering teams to resolve issues faster and manage projects with
              unparalleled efficiency. Built for the modern workspace.
            </p>
            <div className="flex gap-4">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-neutral-900 border border-white/5 rounded-xl text-neutral-400 hover:text-white hover:border-white/20 hover:bg-neutral-800 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-bold mb-6">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-neutral-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} TicketGo Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-neutral-500">
            <Link
              href="/privacy"
              className="hover:text-neutral-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-neutral-300 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
