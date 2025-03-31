import React from 'react';
import { useLanguage, Language } from '@/lib/language-context';
import { useSpeech } from '@/lib/speech-context';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { SpeakableElement } from './SpeakableElement';

interface LanguageSwitcherProps {
  className?: string;
}

/**
 * LanguageSwitcher component for switching between English and Hindi
 */
export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = '',
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { speak } = useSpeech();

  const languages: { code: Language; label: string; nativeLabel: string }[] = [
    { code: 'en-IN', label: 'English', nativeLabel: 'English' },
    { code: 'hi-IN', label: 'Hindi', nativeLabel: 'हिंदी' },
  ];

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    
    // Speak the language name when selected
    const selectedLanguage = languages.find(l => l.code === lang);
    if (selectedLanguage) {
      speak(lang === 'en-IN' ? t('switchedToEnglish') : t('switchedToHindi'));
    }
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <SpeakableElement text={t('displayLanguage')}>
        <div className="text-sm text-muted-foreground mb-1">
          {t('displayLanguage')}
        </div>
      </SpeakableElement>
      <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={language === lang.code ? "default" : "outline"}
            className="flex justify-between items-center"
            onClick={() => handleLanguageChange(lang.code)}
            aria-pressed={language === lang.code}
            title={`${t('switchTo')} ${lang.nativeLabel}`}
          >
            <span className="flex items-center">
              <span className="mr-1">{lang.nativeLabel}</span>
              <span className="text-xs opacity-60">{lang.code.split('-')[0]}</span>
            </span>
            {language === lang.code && <Check className="h-4 w-4 ml-2" />}
          </Button>
        ))}
      </div>
    </div>
  );
};