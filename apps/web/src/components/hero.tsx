'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/i18n/context';

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white p-8 md:p-12 mb-10 shadow-2xl">
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10 max-w-2xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-blue-100 border border-white/20">
          <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
          {t('hero.badge')}
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
          {t('hero.title')}
        </h1>

        <p className="text-blue-100 text-lg md:text-xl font-normal leading-relaxed">
          {t('hero.subtitle')}
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl shadow-lg">
            <Link href="/products" className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              {t('hero.explore')}
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="border-white/40 text-white bg-white/10 hover:bg-white/20 font-semibold rounded-xl backdrop-blur-sm">
            <Link href="/search" className="flex items-center gap-2">
              {t('hero.smartSearch')}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
