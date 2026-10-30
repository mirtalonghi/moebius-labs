import React, { useEffect, useRef, useState } from 'react';

/*
 * Fondo del hero en modo claro: video de pliegues de luz.
 * - Solo se monta (y se descarga) en modo claro; el modo oscuro sigue con las partículas.
 * - En pantallas chicas usa la versión liviana (720p). WebM primero, MP4 de respaldo.
 * - Si la persona pidió reducir el movimiento, se muestra la imagen quieta.
 */

const useIsDark = () => {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    const html = document.documentElement;
    const obs = new MutationObserver(() => setDark(html.classList.contains('dark')));
    obs.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
};

const HeroVideo: React.FC = () => {
  const dark = useIsDark();
  const ref = useRef<HTMLVideoElement | null>(null);
  // Versión liviana en celulares; WebM (más chico) primero y MP4 como respaldo (iPhones más viejos)
  const [base] = useState(() => (window.innerWidth < 768 ? '/hero/seda-720' : '/hero/seda-1080'));
  const quieto =
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const video = ref.current;
    if (!video || quieto) return;
    // Pausa cuando la pestaña no se ve (ahorra batería)
    const alCambiar = () => (document.hidden ? video.pause() : void video.play().catch(() => {}));
    document.addEventListener('visibilitychange', alCambiar);
    return () => document.removeEventListener('visibilitychange', alCambiar);
  }, [dark, quieto]);

  if (dark) return null;

  return (
    <div className="absolute inset-0 z-0" aria-hidden="true">
      {quieto ? (
        <img src="/hero/seda-poster.webp" alt="" className="h-full w-full object-cover" />
      ) : (
        <video
          ref={ref}
          poster="/hero/seda-poster.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        >
          <source src={`${base}.webm`} type="video/webm" />
          <source src={`${base}.mp4`} type="video/mp4" />
        </video>
      )}
      {/* Tono cálido: lleva el blanco y gris del video al color papel del sitio */}
      <div className="absolute inset-0 bg-[#EFE4D0] mix-blend-multiply" />
    </div>
  );
};

export default HeroVideo;
