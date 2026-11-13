import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLang } from '../../i18n';
import ThemeToggle from './ThemeToggle';
import LangToggle from './LangToggle';

/*
 * Encabezado fijo: logo + nombre a la izquierda, menú de secciones y botones ES/EN y claro/oscuro.
 * Sobre la portada es transparente; al bajar toma fondo para que se lea sobre cualquier sección.
 * En el celular el menú se abre con el botón de tres rayas.
 */
const Header: React.FC = () => {
  const { t } = useLang();
  const [conFondo, setConFondo] = useState(false);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const alBajar = () => setConFondo(window.scrollY > 24);
    alBajar();
    window.addEventListener('scroll', alBajar, { passive: true });
    return () => window.removeEventListener('scroll', alBajar);
  }, []);

  const links = [
    { href: '#servicios', label: t('Servicios', 'Services') },
    { href: '#portfolio', label: t('Proyectos', 'Projects') },
    { href: '#precio', label: t('Precio', 'Pricing') },
    { href: '#contact', label: t('Contacto', 'Contact') },
  ];

  const fondo = conFondo || abierto;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        fondo
          ? 'bg-papel-100/90 border-b border-papel-200 backdrop-blur-md dark:bg-slate-950/85 dark:border-slate-800'
          : 'bg-transparent border-b border-transparent'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between gap-3">
        <a href="#inicio" onClick={() => setAbierto(false)} className="flex items-center gap-2.5 min-h-touch shrink-0">
          <img src="/favicon.svg" alt="" width={32} height={32} className="w-8 h-8 rounded-lg" />
          <span className="font-semibold tracking-tight text-slate-900 dark:text-white">Moebius Labs</span>
        </a>

        <nav className="hidden md:flex items-center gap-1" aria-label={t('Secciones', 'Sections')}>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 rounded-full text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-900/5 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangToggle />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setAbierto((a) => !a)}
            aria-expanded={abierto}
            aria-controls="menu-celular"
            aria-label={abierto ? t('Cerrar menú', 'Close menu') : t('Abrir menú', 'Open menu')}
            className="md:hidden min-w-touch min-h-touch inline-flex items-center justify-center rounded-full border backdrop-blur-md transition-colors bg-papel-100/90 text-slate-800 border-papel-200 hover:bg-papel-200 dark:bg-slate-900/70 dark:text-white dark:border-white/10 dark:hover:bg-slate-800"
          >
            {abierto ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {abierto && (
        <nav id="menu-celular" className="md:hidden px-4 pb-4" aria-label={t('Secciones', 'Sections')}>
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setAbierto(false)}
                  className="block px-4 py-3 rounded-xl text-base font-medium text-slate-800 hover:bg-slate-900/5 dark:text-slate-200 dark:hover:bg-white/10 transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
