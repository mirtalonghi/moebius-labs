import React, { useState } from 'react';
import MoebiusRibbon from './MoebiusRibbon';
import InkWaves from './InkWaves';
import { useIsDark } from './useIsDark';

/*
 * Efecto del hero solo para modo claro. El modo oscuro sigue con las partículas.
 *
 * TEMPORAL: incluye un selector para comparar las dos opciones.
 * Cuando se elija una, se borra el selector y el componente que no se use.
 */

type Efecto = 'cinta' | 'ondas';
const CLAVE = 'moebius-efecto-claro';

const leer = (): Efecto => {
  try {
    return localStorage.getItem(CLAVE) === 'ondas' ? 'ondas' : 'cinta';
  } catch {
    return 'cinta';
  }
};

const LightHeroEffect: React.FC = () => {
  const dark = useIsDark();
  const [efecto, setEfecto] = useState<Efecto>(leer);

  if (dark) return null;

  const elegir = (e: Efecto) => {
    setEfecto(e);
    try {
      localStorage.setItem(CLAVE, e);
    } catch {
      /* sin almacenamiento: vale solo para esta visita */
    }
  };

  return (
    <>
      <div className="absolute inset-0 z-0">{efecto === 'cinta' ? <MoebiusRibbon key="cinta" /> : <InkWaves key="ondas" />}</div>

      {/* Velo suave detrás del texto para que siempre se lea bien */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 46% 34% at 50% 52%, rgba(248,245,239,0.92) 0%, rgba(248,245,239,0.6) 55%, rgba(248,245,239,0) 100%)',
        }}
      />

      {/* Selector temporal para comparar */}
      <div className="absolute bottom-24 left-1/2 z-20 -translate-x-1/2 sm:bottom-auto sm:left-6 sm:top-6 sm:translate-x-0">
        <div className="flex items-center gap-1 rounded-full border border-papel-200 bg-papel-100/90 p-1 text-xs shadow-sm backdrop-blur">
          <span className="whitespace-nowrap px-2 text-slate-500">Prueba:</span>
          {(['cinta', 'ondas'] as Efecto[]).map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => elegir(e)}
              aria-pressed={efecto === e}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 font-semibold transition-colors ${
                efecto === e ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-papel-200'
              }`}
            >
              {e === 'cinta' ? 'Cinta de Möbius' : 'Ondas de tinta'}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default LightHeroEffect;
