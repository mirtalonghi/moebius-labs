import React from 'react';
import { useLang } from '../../i18n';

/* Botón ES / EN, al lado del de modo claro/oscuro. */
const LangToggle: React.FC = () => {
  const { lang, setLang } = useLang();
  const otro = lang === 'es' ? 'en' : 'es';

  return (
    <button
      type="button"
      onClick={() => setLang(otro)}
      aria-label={lang === 'es' ? 'View in English' : 'Ver en español'}
      title={lang === 'es' ? 'English' : 'Español'}
      className="fixed z-50 min-w-touch min-h-touch px-3 inline-flex items-center justify-center rounded-full border backdrop-blur-md shadow-lg text-sm font-bold tracking-wide transition-colors bg-papel-100/90 text-slate-800 border-papel-200 hover:bg-papel-200 dark:bg-slate-900/70 dark:text-white dark:border-white/10 dark:hover:bg-slate-800"
      style={{
        top: 'calc(env(safe-area-inset-top) + 16px)',
        right: 'calc(env(safe-area-inset-right) + 72px)',
      }}
    >
      {otro.toUpperCase()}
    </button>
  );
};

export default LangToggle;
