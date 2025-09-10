'use client';

import Link from 'next/link';
import { UserMenu } from '@/components/UserMenu';
import { Home } from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';

export function Header() {
  return (
    <header className="border-border sticky top-0 z-50 border-b bg-white" data-testid="header">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center" data-testid="link-home">
              <Home className="text-primary mr-2 text-2xl" />
              <h1 className="text-foreground text-xl font-bold">VacanzaItalia</h1>
            </Link>
            <nav className="hidden space-x-6 md:flex">
              <Link
                href="/contact"
                className="text-foreground hover:text-primary transition-colors"
                data-testid="link-contact"
              >
                Contacts
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
