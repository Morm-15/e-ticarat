'use client';

import { useTranslation } from '@/i18n/context';

export function HomeSectionHeader() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-3xl font-bold tracking-tight">{t('products.latestProducts')}</h2>
      <p className="text-muted-foreground text-sm">{t('products.subtitle')}</p>
    </div>
  );
}
