import React, { useEffect, useRef } from 'react';
import { audioLevels } from './heroAudio';
import { prefiereMenosMovimiento } from './useIsDark';

/*
 * Efecto del hero en modo claro (opción 2): líneas de tinta que ondulan como
 * un pentagrama o un mapa topográfico. Con la música se agitan como ondas de sonido.
 */

const InkWaves: React.FC = () => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    const ajustar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    ajustar();

    const quieto = prefiereMenosMovimiento();
    let energia = 0;
    let id = 0;
    const t0 = performance.now();

    const dibujar = () => {
      const t = (performance.now() - t0) / 1000;
      const objetivo = audioLevels.bass * 1.2 + audioLevels.mid * 0.8 + audioLevels.treble * 0.5;
      energia += (objetivo - energia) * 0.1;

      ctx.clearRect(0, 0, w, h);
      const chico = w < 640;
      const lineas = chico ? 16 : 26;
      const paso = chico ? 6 : 5;
      const margen = h * 0.12;
      const alto = h - margen * 2;

      for (let i = 0; i < lineas; i += 1) {
        const p = i / (lineas - 1); // 0 arriba, 1 abajo
        const base = margen + p * alto;
        const fase = i * 0.45;
        // las líneas del medio son más oscuras; las de los bordes se esfuman
        const cercania = 1 - Math.abs(p - 0.5) * 2;
        ctx.strokeStyle = `rgba(74, 42, 69, ${0.12 + cercania * 0.33})`;
        ctx.lineWidth = 1 + cercania * 0.4;
        ctx.beginPath();
        for (let x = 0; x <= w + paso; x += paso) {
          const nx = x / w;
          // la onda es más amplia en el centro de la pantalla
          const envolvente = Math.exp(-Math.pow((nx - 0.5) / 0.32, 2));
          const amp = (chico ? 16 : 26) * (0.5 + energia * 1.8) * envolvente;
          const y =
            base +
            Math.sin(nx * 7 + t * 0.6 + fase) * amp * 0.6 +
            Math.sin(nx * 13 - t * 0.9 + fase * 1.7) * amp * 0.3 * (0.4 + energia) +
            Math.sin(nx * 3 + t * 0.25 + i * 0.2) * amp * 0.5;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const loop = () => {
      id = requestAnimationFrame(loop);
      dibujar();
    };
    if (quieto) dibujar();
    else loop();

    const onResize = () => {
      ajustar();
      if (quieto) dibujar();
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
};

export default InkWaves;
