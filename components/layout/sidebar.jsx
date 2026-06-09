'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Ticket, Settings, LogOut, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { motion } from 'motion/react';
import { ThemeToggle } from '@/components/theme-toggle';
import OrgSwitcher from '@/components/organizations/org-switcher';
import { Separator } from '@/components/ui/separator';

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-sky-500',
  },
  {
    label: 'Tickets',
    icon: Ticket,
    href: '/tickets',
    color: 'text-violet-500',
  },
  {
    label: 'Organizations',
    icon: Building2,
    href: '/organizations',
    color: 'text-emerald-500',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    color: 'text-amber-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14 group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Ticket className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">TicketGo</h1>
          </motion.div>
        </Link>

        <OrgSwitcher />

        <Separator className="my-4 bg-sidebar-border/50" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-1"
        >
          {routes.map((route) => (
            <motion.div key={route.href} variants={itemVariants}>
              <Link
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer rounded-xl transition-all duration-200 relative overflow-hidden",
                  pathname === route.href
                    ? "text-sidebar-primary-foreground bg-sidebar-primary shadow-sm"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                {pathname === route.href && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 bg-sidebar-primary rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <div className="flex items-center flex-1 relative z-10">
                  <route.icon className={cn("h-5 w-5 mr-3 transition-transform duration-200 group-hover:scale-110", route.color)} />
                  {route.label}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="px-3 py-2 space-y-2">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-sidebar-foreground/50">Theme</span>
            <ThemeToggle variant="ghost" size="sm" />
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => signOut({ callbackUrl: '/login' })}
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/80 rounded-xl transition-all duration-200"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </motion.div>
      </div>
    </div>
  );
}