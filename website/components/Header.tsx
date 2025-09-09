'use client';

import Link from "next/link";
import { UserMenu } from "@/components/UserMenu";
import { Home } from "lucide-react";
import { LanguageToggle } from "@/components/LanguageToggle";

export function Header() {

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center" data-testid="link-home">
              <Home className="text-primary text-2xl mr-2" />
              <h1 className="text-xl font-bold text-foreground">VacanzaItalia</h1>
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/contact" className="text-foreground hover:text-primary transition-colors" data-testid="link-contact">
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
