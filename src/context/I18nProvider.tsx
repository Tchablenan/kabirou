'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { useEffect, useState } from 'react';

export default function I18nProvider({ 
  children, 
  locale 
}: { 
  children: React.ReactNode, 
  locale: string 
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initI18n = async () => {
      if (i18n.language !== locale) {
        await i18n.changeLanguage(locale);
      }
      setIsReady(true);
    };
    initI18n();
  }, [locale]);

  if (!isReady) return null; // Or a loading spinner

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
