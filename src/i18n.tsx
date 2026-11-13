import React, { createContext, useContext, useEffect, useState } from 'react';

/*
 * Idioma de la landing: español o inglés.
 * Orden para elegir el idioma inicial:
 *   1. ?lang=en o ?lang=es en la dirección (sirve para compartir el link en inglés)
 *   2. lo que la persona eligió antes con el botón ES/EN (queda guardado en el navegador)
 *   3. el idioma del navegador: si es español, español; si no, inglés
 * Uso en los componentes:  const { t } = useLang();  t('Hola', 'Hello')
 */

export type Lang = 'es' | 'en';

const idiomaInicial = (): Lang => {
  const param = new URLSearchParams(window.location.search).get('lang');
  if (param === 'es' || param === 'en') return param;
  try {
    const guardado = localStorage.getItem('lang');
    if (guardado === 'es' || guardado === 'en') return guardado;
  } catch {
    /* sin almacenamiento */
  }
  return (navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en';
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (es: string, en: string) => string };

const LangContext = createContext<Ctx>({ lang: 'es', setLang: () => {}, t: (es) => es });

export const LangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(idiomaInicial);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('lang', lang);
    } catch {
      /* sin almacenamiento: vale solo para esta visita */
    }
  }, [lang]);

  const t = (es: string, en: string) => (lang === 'en' ? en : es);
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
};

export const useLang = () => useContext(LangContext);

// Mensajes que llegan ya escritos a WhatsApp / mail, en el idioma de la persona
export const WHATSAPP_NUMERO = '5491144474421';
export const whatsapp = (texto: string) => `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(texto)}`;
