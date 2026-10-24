import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

/*
 * Botón para cambiar entre modo claro y oscuro.
 * El oscuro es el de siempre (por defecto). La elección queda guardada en el navegador.
 * Para quitar esta opción: borrar este archivo y la línea <ThemeToggle /> en App.tsx.
 */
const ThemeToggle: React.FC = () => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {
      /* sin almacenamiento: el cambio vale solo para esta visita */
    }
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={dark ? 'Modo claro' : 'Modo oscuro'}
      className="fixed z-50 min-w-touch min-h-touch inline-flex items-center justify-center rounded-full border backdrop-blur-md shadow-lg transition-colors bg-sand-50/90 text-stone-800 border-sand-200 hover:bg-sand-50 dark:bg-slate-900/70 dark:text-white dark:border-white/10 dark:hover:bg-slate-800"
      style={{
        top: 'calc(env(safe-area-inset-top) + 16px)',
        right: 'calc(env(safe-area-inset-right) + 16px)',
      }}
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;
