import React from 'react';
import Hero from './components/landing/Hero';
import Services from './components/landing/Services';
import Portfolio from './components/landing/Portfolio';
import Education from './components/landing/Education';
import Contact from './components/landing/Contact';
import Header from './components/landing/Header';
import { LangProvider, useLang } from './i18n';

function Pie() {
  const { t } = useLang();
  return (
    <p className="text-slate-500 text-sm">
      © {new Date().getFullYear()} Mirta Longhitano · Moebius Labs — {t('Diseño y desarrollo web', 'Web design and development')}
    </p>
  );
}

function App() {
  return (
    <LangProvider>
    <div className="w-full min-h-screen bg-papel-100 text-slate-800 dark:bg-slate-950 dark:text-slate-200 selection:bg-blue-500/30">
      {/* Main content container */}
      <Header />
      <main className="w-full relative">
        {/* Safe area padding for mobile devices */}
        <div
          className="w-full flex flex-col"
          style={{
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <Hero />
          <Services />
          <Portfolio />
          <Education />
          <Contact />
          
          {/* Footer */}
          <footer className="py-12 px-6 text-center border-t border-papel-200 bg-papel-100 dark:border-slate-900 dark:bg-slate-950">
            <Pie />
          </footer>
        </div>
      </main>
    </div>
    </LangProvider>
  );
}

export default App;
