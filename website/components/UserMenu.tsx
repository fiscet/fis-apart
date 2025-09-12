'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export function UserMenu() {
  const isMobile = useIsMobile();
  const isAuthenticated = true;
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    profileImageUrl: 'tmp-avatar.jpg',
    id: '123',
  };

  const signOut = () => {
    // TODO: Implement sign out functionality
  };

  const signInWithGoogle = () => {
    // TODO: Implement Google sign in functionality
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`flex items-center ${isMobile ? 'space-x-1 p-1' : 'space-x-2'}`}
              data-testid="button-user-menu"
            >
              <div className="relative">
                <Avatar className={isMobile ? "h-7 w-7" : "h-8 w-8"}>
                  <AvatarImage src={user.profileImageUrl || undefined} />
                  <AvatarFallback className={isMobile ? "text-xs" : ""}>
                    {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
                  </AvatarFallback>
                </Avatar>
                  <div className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full border border-white"></div>
              </div>
              <span className="hidden text-sm font-medium sm:inline" data-testid="text-username">
                {user.firstName} {user.lastName}
              </span>
              {!isMobile && <ChevronDown className="h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem asChild>
              <Link href="#" data-testid="link-dashboard">
                Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="#" data-testid="link-profile">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-red-500"
              onClick={signOut}
              data-testid="link-logout"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <Button onClick={signInWithGoogle} data-testid="button-login">
      Sign in with Google
    </Button>
  );
}
