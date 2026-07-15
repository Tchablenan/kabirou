'use client';

import { I18nextProvider, initReactI18next } from 'react-i18next';
import { createInstance } from 'i18next';
import { useState } from 'react';
import en from '@/locales/en.json';
import fr from '@/locales/fr.json';

export default function I18nProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  // Initialisation synchrone (initImmediate: false) : le contenu traduit est
  // présent dès le HTML rendu côté serveur — indispensable pour le SEO.
  // Une instance par arbre évite les collisions de langue entre requêtes SSR.
  const [instance] = useState(() => {
    const i18nInstance = createInstance();
    i18nInstance.use(initReactI18next).init({
      resources: {
        en: { translation: en },
        fr: { translation: fr },
      },
      lng: locale,
      fallbackLng: 'fr',
      interpolation: {
        escapeValue: false,
      },
      initImmediate: false,
    });
    return i18nInstance;
  });

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
