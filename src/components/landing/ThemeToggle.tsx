import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

/*
 * Botón para cambiar entre modo claro y oscuro.
 * El oscuro es el de siempre (por defecto). La elección queda guardada en el navegador.
 * Se muestra dentro del encabezado (Header.tsx).
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
      className="min-w-touch min-h-touch inline-flex items-center justify-center rounded-full border backdrop-blur-md transition-colors bg-papel-100/90 text-slate-800 border-papel-200 hover:bg-papel-200 dark:bg-slate-900/70 dark:text-white dark:border-white/10 dark:hover:bg-slate-800"
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;
