'use client';

import { useTranslation, Language } from '@/i18n/context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';

const languagesList: Array<{ code: Language; label: string; flag: string }> = [
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
];

export function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  const currentLangObj = languagesList.find(l => l.code === language) || languagesList[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 px-2.5 font-medium">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{currentLangObj.flag}</span>
          <span className="text-xs uppercase font-semibold hidden md:inline">{currentLangObj.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {languagesList.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center justify-between cursor-pointer py-2"
          >
            <span className="flex items-center gap-2 text-sm">
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </span>
            {language === lang.code && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
