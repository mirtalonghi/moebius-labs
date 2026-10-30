import React, { useEffect, useRef } from 'react';
import { audioLevels } from './heroAudio';
import { prefiereMenosMovimiento } from './useIsDark';

/*
 * Efecto del hero en modo claro (opción 1): una cinta de Möbius dibujada con
 * líneas finas, como tinta sobre papel. Gira despacio y se ondula con la música.
 */

const PAPEL = 0xf8f5ef; // mismo tono que el fondo (papel-100): las líneas del fondo se funden con él
const TINTA = 0x4a2a45; // ciruela oscuro
const TINTA_SUAVE = 0x8a6f86;

const MoebiusRibbon: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    import('three').then((THREE) => {
      if (cancelled) return;
      const chico = window.innerWidth < 640;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 200);
      // Distancia para que la cinta entre completa: en pantallas angostas manda el ancho
      const encuadrar = () => {
        const aspecto = container.clientWidth / container.clientHeight;
        const mitadFov = (camera.fov * Math.PI) / 360;
        const radio = 19; // R + W con margen
        // en la compu entra completa; en el celular se pasa un poco de los bordes
        const porAlto = (radio * 1.1) / Math.tan(mitadFov);
        const porAncho = (radio * 0.62) / (Math.tan(mitadFov) * aspecto);
        camera.position.set(0, 0, Math.max(porAlto, porAncho));
        camera.aspect = aspecto;
        camera.updateProjectionMatrix();
        scene.fog = new THREE.Fog(PAPEL, camera.position.z - 6, camera.position.z + 22);
      };
      encuadrar();

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setClearColor(PAPEL, 0);
      container.appendChild(renderer.domElement);

      // Geometría: "peldaños" que cruzan la cinta + líneas que la recorren a lo largo
      const R = 13; // radio de la cinta
      const W = 5; // medio ancho
      const PELDANOS = chico ? 90 : 140;
      const LARGAS = chico ? 5 : 7;
      const PASOS = chico ? 160 : 240;

      const punto = (u: number, v: number, t: number, onda: number, out: number[]) => {
        // ondulación que recorre la cinta (crece con la música)
        const vv = v * (1 + onda * 0.35 * Math.sin(u * 3 + t * 1.6));
        const r = R + vv * Math.cos(u / 2);
        const z = vv * Math.sin(u / 2) + Math.sin(u * 5 - t * 2) * onda * 0.9;
        out.push(r * Math.cos(u), r * Math.sin(u), z);
      };

      const geoPeldanos = new THREE.BufferGeometry();
      const geoLargas = new THREE.BufferGeometry();
      const posPeldanos = new Float32Array(PELDANOS * 2 * 3);
      const posLargas = new Float32Array(LARGAS * PASOS * 2 * 3);
      geoPeldanos.setAttribute('position', new THREE.BufferAttribute(posPeldanos, 3));
      geoLargas.setAttribute('position', new THREE.BufferAttribute(posLargas, 3));

      const tmp: number[] = [];
      const actualizar = (t: number, onda: number) => {
        let k = 0;
        for (let i = 0; i < PELDANOS; i += 1) {
          const u = (i / PELDANOS) * Math.PI * 2;
          tmp.length = 0;
          punto(u, -W, t, onda, tmp);
          punto(u, W, t, onda, tmp);
          for (let j = 0; j < 6; j += 1) posPeldanos[k++] = tmp[j];
        }
        k = 0;
        for (let l = 0; l < LARGAS; l += 1) {
          const v = -W + (2 * W * l) / (LARGAS - 1);
          for (let s = 0; s < PASOS; s += 1) {
            const u0 = (s / PASOS) * Math.PI * 2;
            const u1 = ((s + 1) / PASOS) * Math.PI * 2;
            tmp.length = 0;
            punto(u0, v, t, onda, tmp);
            // en u = 2π el punto (v) coincide con (u = 0, -v): la cinta se une sola, con su media vuelta
            punto(u1, v, t, onda, tmp);
            for (let j = 0; j < 6; j += 1) posLargas[k++] = tmp[j];
          }
        }
        geoPeldanos.attributes.position.needsUpdate = true;
        geoLargas.attributes.position.needsUpdate = true;
      };

      const matPeldanos = new THREE.LineBasicMaterial({ color: TINTA_SUAVE, transparent: true, opacity: 0.55 });
      const matLargas = new THREE.LineBasicMaterial({ color: TINTA, transparent: true, opacity: 0.9 });
      const cinta = new THREE.Group();
      cinta.add(new THREE.LineSegments(geoPeldanos, matPeldanos));
      cinta.add(new THREE.LineSegments(geoLargas, matLargas));
      cinta.rotation.x = -0.6;
      scene.add(cinta);

      const quieto = prefiereMenosMovimiento();
      let id = 0;
      let onda = 0;
      const t0 = performance.now();

      const dibujar = () => {
        const t = (performance.now() - t0) / 1000;
        // la música suma ondulación; se suaviza para que no salte
        const objetivo = audioLevels.bass * 0.9 + audioLevels.mid * 0.6;
        onda += (objetivo - onda) * 0.08;
        actualizar(t, 0.12 + onda);
        cinta.rotation.z = t * 0.12;
        cinta.rotation.x = -0.6 + Math.sin(t * 0.25) * 0.15;
        cinta.rotation.y = Math.sin(t * 0.18) * 0.18;
        const escala = 1 + audioLevels.bass * 0.06;
        cinta.scale.setScalar(escala);
        renderer.render(scene, camera);
      };

      const loop = () => {
        id = requestAnimationFrame(loop);
        dibujar();
      };
      if (quieto) dibujar();
      else loop();

      const onResize = () => {
        encuadrar();
        renderer.setSize(container.clientWidth, container.clientHeight);
        if (quieto) dibujar();
      };
      window.addEventListener('resize', onResize);

      cleanup = () => {
        cancelAnimationFrame(id);
        window.removeEventListener('resize', onResize);
        geoPeldanos.dispose();
        geoLargas.dispose();
        matPeldanos.dispose();
        matLargas.dispose();
        renderer.dispose();
        if (renderer.domElement.parentElement === container) container.removeChild(renderer.domElement);
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return <div ref={ref} className="absolute inset-0" aria-hidden="true" />;
};

export default MoebiusRibbon;
