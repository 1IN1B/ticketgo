'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import MobileNav from '@/components/layout/mobile-nav';

export default function TopNav({ user }) {
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : 'U';

  return (
    <div className="flex items-center p-4 border-b h-[70px]">
      <MobileNav />
      <div className="flex w-full justify-between items-center ml-4">
        <div className="font-semibold text-lg hidden sm:block">
          Welcome, {user?.name}
        </div>
        <div className="flex items-center gap-x-4 ml-auto">
          <div className="flex items-center gap-x-2">
            <div className="text-sm font-medium text-right hidden md:block">
              <p>{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.role}</p>
            </div>
            <Avatar>
              <AvatarFallback className="bg-sky-500 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
}
