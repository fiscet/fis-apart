export const metadata = {
  title: 'AI Demo app',
  description: 'AI Demo website for holiday apartment rentals',
};

import './globals.css';
import { Providers } from '../components/Providers';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${inter.variable}`}>
        <Providers>
          <div className="bg-background min-h-screen w-full overflow-x-hidden">
            <Header />

            <main className="w-full">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
