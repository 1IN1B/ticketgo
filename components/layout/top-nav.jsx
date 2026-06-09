'use client';

import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import MobileNav from '@/components/layout/mobile-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { Building2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function TopNav({ user }) {
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : 'U';

  const orgRoleLabel = user?.currentOrgRole === 'ORG_ADMIN' ? 'Org Admin' : 'Org Member';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex items-center p-4 border-b h-[70px] bg-background/80 backdrop-blur-md sticky top-0 z-30"
    >
      <MobileNav />
      <div className="flex w-full justify-between items-center ml-4">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="font-semibold text-lg hidden sm:block"
        >
          Welcome, {user?.name}
        </motion.div>
        <div className="flex items-center gap-x-4 ml-auto">
          <ThemeToggle variant="outline" size="icon" />
          <div className="flex items-center gap-x-3">
            <div className="text-sm font-medium text-right hidden md:block">
              <p className="leading-tight">{user?.name}</p>
              <p className="text-xs text-muted-foreground leading-tight">{orgRoleLabel}</p>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Avatar className="h-9 w-9 ring-2 ring-primary/10 ring-offset-2 ring-offset-background">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}