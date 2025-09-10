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
import { Bell, ChevronDown } from 'lucide-react';

export function UserMenu() {
  const isAuthenticated = true;
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    profileImageUrl: 'tmp-avatar.jpg',
    id: '123',
  };

  const signOut = () => {
    console.log('signOut');
  };

  const signInWithGoogle = () => {
    console.log('signInWithGoogle');
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" data-testid="button-notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2"
              data-testid="button-user-menu"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.profileImageUrl || undefined} />
                <AvatarFallback>
                  {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline" data-testid="text-username">
                {user.firstName} {user.lastName}
              </span>
              <ChevronDown className="h-4 w-4" />
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
