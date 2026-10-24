import React from 'react';
import Hero from './components/landing/Hero';
import Portfolio from './components/landing/Portfolio';
import Education from './components/landing/Education';
import Contact from './components/landing/Contact';
import ThemeToggle from './components/landing/ThemeToggle';

function App() {
  return (
    <div className="w-full min-h-screen bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-200 selection:bg-blue-500/30">
      {/* Main content container */}
      <ThemeToggle />
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
          <Portfolio />
          <Education />
          <Contact />
          
          {/* Footer */}
          <footer className="py-12 px-6 text-center border-t border-slate-200 bg-white dark:border-slate-900 dark:bg-slate-950">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Mirta Longhitano · Moebius Labs — Diseño y desarrollo web
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
