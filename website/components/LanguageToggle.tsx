'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';

type SupportedLang = 'en' | 'it';

type LanguageToggleProps = {
  initialLang?: SupportedLang;
  onChange?: (lang: SupportedLang) => void;
};

export function LanguageToggle({ initialLang = 'en', onChange }: LanguageToggleProps) {
  const [lang, setLang] = React.useState<SupportedLang>(initialLang);

  const handleSelect = (next: SupportedLang) => {
    setLang(next);
    onChange?.(next);
    // placeholder side-effect
    console.log('language changed to', next);
  };

  return (
    <div className="flex items-center space-x-2" data-testid="language-toggle">
      <Button
        variant={lang === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleSelect('en')}
        data-testid="button-lang-en"
      >
        EN
      </Button>
      <Button
        variant={lang === 'it' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleSelect('it')}
        data-testid="button-lang-it"
      >
        IT
      </Button>
    </div>
  );
}
