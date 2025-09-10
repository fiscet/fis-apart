import Link from 'next/link';
import { UserMenu } from '@/components/UserMenu';
import { Home, Mail } from 'lucide-react';

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
            {/* Desktop contact link removed - using mobile icon for all breakpoints */}
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/contact"
              className="transition-colors p-1 animate-pulse"
              data-testid="link-contact-mobile"
            >
              <Mail className="h-6 w-6 text-blue-600" />
            </Link>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
