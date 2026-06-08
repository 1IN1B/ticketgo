"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Ticket, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Header() {
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Tickets", href: "/tickets" },
    { name: "Projects", href: "/projects" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between px-6 py-3 bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-full shadow-2xl">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="bg-white p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
          <Ticket className="w-5 h-5 text-black" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">
          TicketGo
        </span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="text-sm font-medium text-neutral-400 hover:text-white transition-colors duration-200"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          className="hidden md:flex text-neutral-300 hover:text-white hover:bg-white/10 rounded-full px-6"
          asChild
        >
          <Link href="/login">Log In</Link>
        </Button>
        <Button
          className="bg-white text-black hover:bg-neutral-200 rounded-full px-6 font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-all duration-300"
          asChild
        >
          <Link href="/register">Get Started</Link>
        </Button>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 rounded-full"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="bg-black/95 border-white/10 text-white backdrop-blur-2xl"
            >
              <SheetHeader className="border-b border-white/10 pb-4">
                <SheetTitle className="text-white flex items-center gap-2">
                  <div className="bg-white p-1 rounded-md">
                    <Ticket className="w-4 h-4 text-black" />
                  </div>
                  TicketGo
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-medium text-neutral-400 hover:text-white transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                  <Button
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/10 w-full rounded-xl"
                    asChild
                  >
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button
                    className="bg-white text-black hover:bg-neutral-200 w-full rounded-xl font-semibold"
                    asChild
                  >
                    <Link href="/register">Get Started</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
