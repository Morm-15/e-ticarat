'use client';

import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { SearchBox } from '@/components/search-box';
import { UserMenu } from './navbar/user-menu';
import { CartIcon } from '@/modules/cart/components/cart-icon';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';

import Image from 'next/image';
import { LanguageToggle } from './language-toggle';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <Link href="/" className="font-bold text-xl md:text-lg flex items-center gap-3 group">
              <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-primary/20 shadow-sm group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/logo.jpeg"
                  alt="MORM Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent text-2xl font-black tracking-tight">
                MORM
              </span>
            </Link>
          </div>

          <div className="flex-1 max-w-xl mx-8 md:max-w-sm sm:max-w-[200px] xxs:hidden">
            <SearchBox />
          </div>

          <nav className="flex items-center gap-3 md:gap-1.5">
            <LanguageToggle />
            <ThemeToggle />
            <CartIcon />
            <UserMenu />
          </nav>
        </div>
      </Container>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="sm:block hidden border-t">
          <Container>
            <div className="py-4 space-y-4">
              <SearchBox />
              <div className="flex items-center justify-between pt-4 border-t">
                <LanguageToggle />
                <ThemeToggle />
                <CartIcon />
                <UserMenu />
              </div>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
