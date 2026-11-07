import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Pause, MessageCircle, ArrowDown, Music } from 'lucide-react';
import { hapticFeedback } from '../../utils/mobileFeatures';
import HeroVideo from './HeroVideo';
import { useLang, whatsapp } from '../../i18n';

// Partículas que esquivan el dedo (o el mouse): se apartan y vuelven al soltar.
const Hero: React.FC = () => {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<any>(null);
  const isPlayingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioUrl = '/Villanelle.mp3';

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    import('three').then((THREE) => {
      if (cancelled || !container) return;

      const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 45;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const particleCount = 2500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const groupIndex = Math.floor((i / particleCount) * 4);
      let radius = 10 + Math.random() * 10;
      let theta = Math.random() * Math.PI * 2;
      let phi = Math.acos(2 * Math.random() - 1);

      switch (groupIndex) {
        case 0:
          radius = 10 + Math.random() * 5;
          break;
        case 1:
          radius = 5 + Math.random() * 3;
          break;
        case 2:
          radius = 12 + Math.random() * 4;
          phi = (Math.random() * 0.5 + 0.75) * Math.PI;
          break;
        case 3:
        default:
          radius = 15 + Math.random() * 5;
          break;
      }

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      switch (groupIndex) {
        case 0:
          colors[i * 3] = 0.1 + Math.random() * 0.1;
          colors[i * 3 + 1] = 0.1 + Math.random() * 0.1;
          colors[i * 3 + 2] = 0.4 + Math.random() * 0.2;
          break;
        case 1:
          colors[i * 3] = 0.2 + Math.random() * 0.1;
          colors[i * 3 + 1] = 0.3 + Math.random() * 0.1;
          colors[i * 3 + 2] = 0.5 + Math.random() * 0.2;
          break;
        case 2:
          colors[i * 3] = 0.3 + Math.random() * 0.1;
          colors[i * 3 + 1] = 0.1 + Math.random() * 0.1;
          colors[i * 3 + 2] = 0.4 + Math.random() * 0.1;
          break;
        case 3:
        default:
          colors[i * 3] = 0.4 + Math.random() * 0.3;
          colors[i * 3 + 1] = 0.4 + Math.random() * 0.3;
          colors[i * 3 + 2] = 0.6 + Math.random() * 0.3;
          break;
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      blending: THREE.NormalBlending,
    });

    // "Esquivar": se calcula en la placa de video (GPU), así no pesa aunque haya miles de partículas.
    const uniforms = {
      uPointer: { value: new THREE.Vector2(10, 10) },
      uFuerza: { value: 0 },
      uRadio: { value: 0.42 },
      uAspect: { value: window.innerWidth / window.innerHeight },
    };
    material.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.vertexShader =
        'uniform vec2 uPointer;\nuniform float uFuerza;\nuniform float uRadio;\nuniform float uAspect;\n' +
        shader.vertexShader.replace(
          '#include <project_vertex>',
          `#include <project_vertex>
          {
            vec2 ndc = gl_Position.xy / gl_Position.w;
            vec2 d = ndc - uPointer;
            d.x *= uAspect;
            float dist = length(d);
            float empuje = uFuerza * (1.0 - smoothstep(0.0, uRadio, dist));
            vec2 dir = dist > 0.0001 ? d / dist : vec2(0.0);
            dir.x /= uAspect;
            gl_Position.xy += dir * empuje * uRadio * gl_Position.w;
          }`
        );
    };

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    renderer.setClearColor(0x000000, 1);

    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x3366ff, 1, 100);
    blueLight.position.set(30, 0, 15);
    scene.add(blueLight);

    const redLight = new THREE.PointLight(0xff3366, 1, 100);
    redLight.position.set(-30, 0, 15);
    scene.add(redLight);

    const greenLight = new THREE.PointLight(0x33ff66, 1, 100);
    greenLight.position.set(0, 30, 15);
    scene.add(greenLight);

    const purpleLight = new THREE.PointLight(0xaa33ff, 1, 100);
    purpleLight.position.set(0, -30, 15);
    scene.add(purpleLight);

    const spotLights = [blueLight, redLight, greenLight, purpleLight];

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const AudioContext = (window.AudioContext || (window as any).webkitAudioContext) as any;
    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array | null = null;
    let audioSource: MediaElementAudioSourceNode | null = null;
    let animationFrameId: number;

    if (AudioContext) {
      audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 1024;
      dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.crossOrigin = 'anonymous';
    audio.preload = 'none';
    audioRef.current = audio;

    const handleCanPlay = () => {
      if (audioContext && analyser && !audioSource) {
        audioSource = audioContext.createMediaElementSource(audio);
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);
      }
    };

    const handleAudioError = (event: Event) => {
      console.error('Audio error', event);
      setErrorMessage('No se pudo cargar el audio de fondo.');
    };

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleAudioError);

    // ---- Dedo / mouse ----
    // Los listeners son "passive": nunca bloquean el scroll, la página sigue bajando normal.
    const section = sectionRef.current;
    const dedo = { activo: false, x: 0, y: 0, ndcX: 10, ndcY: 10 };
    const objetivo = new THREE.Vector2(10, 10);
    const esOscuro = () => document.documentElement.classList.contains('dark');

    const aNdc = (cx: number, cy: number) => {
      const r = container.getBoundingClientRect();
      dedo.ndcX = ((cx - r.left) / r.width) * 2 - 1;
      dedo.ndcY = -(((cy - r.top) / r.height) * 2 - 1);
    };
    const empezar = (cx: number, cy: number) => {
      if (!esOscuro()) return;
      dedo.activo = true;
      dedo.x = cx;
      dedo.y = cy;
      aNdc(cx, cy);
      uniforms.uPointer.value.set(dedo.ndcX, dedo.ndcY);
      objetivo.set(dedo.ndcX, dedo.ndcY);
    };
    const mover = (cx: number, cy: number) => {
      if (!dedo.activo) return;
      dedo.x = cx;
      dedo.y = cy;
      aNdc(cx, cy);
      objetivo.set(dedo.ndcX, dedo.ndcY);
    };
    const soltar = () => {
      dedo.activo = false;
    };

    const onTouchStart = (e: TouchEvent) => empezar(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => mover(e.touches[0].clientX, e.touches[0].clientY);
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') empezar(e.clientX, e.clientY);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      // Con mouse, el hueco sigue al cursor sin hacer click
      if (!dedo.activo) empezar(e.clientX, e.clientY);
      mover(e.clientX, e.clientY);
    };
    const pasivo = { passive: true } as const;
    section?.addEventListener('touchstart', onTouchStart, pasivo);
    section?.addEventListener('touchmove', onTouchMove, pasivo);
    section?.addEventListener('touchend', soltar, pasivo);
    section?.addEventListener('touchcancel', soltar, pasivo);
    section?.addEventListener('pointerdown', onPointerDown);
    section?.addEventListener('pointermove', onPointerMove);
    section?.addEventListener('pointerleave', soltar);

    const getAverageVolume = (
      array: Uint8Array,
      start: number,
      end: number
    ) => {
      let sum = 0;
      const count = Math.max(1, end - start);
      for (let i = start; i < end && i < array.length; i += 1) {
        sum += array[i];
      }
      return sum / count;
    };

    const animate = () => {
      animationFrameId = window.requestAnimationFrame(animate);
      const time = Date.now() * 0.001;
      let bass = 0;
      let lowMid = 0;
      let mid = 0;
      let highMid = 0;
      let treble = 0;

      if (analyser && dataArray && isPlayingRef.current) {
        analyser.getByteFrequencyData(dataArray);
        bass = getAverageVolume(dataArray, 0, 10) / 255;
        lowMid = getAverageVolume(dataArray, 10, 100) / 255;
        mid = getAverageVolume(dataArray, 100, 200) / 255;
        highMid = getAverageVolume(dataArray, 200, 300) / 255;
        treble = getAverageVolume(dataArray, 300, 400) / 255;
      }

      // En modo claro se ve el video y las partículas no se dibujan (ahorra batería)
      if (!document.documentElement.classList.contains('dark')) return;

      const baseRotationX = Math.sin(time * 0.3) * 0.003;
      const baseRotationY = Math.cos(time * 0.2) * 0.005;
      const extraRotationX = bass * 0.002 * Math.sin(time * 2);
      const extraRotationY = mid * 0.004 * Math.cos(time);

      particles.rotation.x += baseRotationX + extraRotationX;
      particles.rotation.y += baseRotationY + extraRotationY;

      // El hueco sigue al dedo con suavidad y se cierra al soltar
      uniforms.uFuerza.value += ((dedo.activo ? 1 : 0) - uniforms.uFuerza.value) * 0.08;
      uniforms.uPointer.value.lerp(objetivo, 0.25);
      particles.rotation.z = Math.sin(time * 0.1) * 0.05;

      spotLights.forEach((light, index) => {
        const audioSegment = Math.floor(time % 20);
        let baseIntensity = 0.3;
        const primaryIndex = Math.floor(audioSegment / 5);
        if (index === primaryIndex) {
          baseIntensity = 2.0;
        } else if (index === (primaryIndex + 1) % 4 || index === (primaryIndex + 3) % 4) {
          baseIntensity = 0.5 + (Math.sin(((audioSegment % 5) / 5) * Math.PI) * 0.5 + 0.5) * 0.8;
        }

        switch (index) {
          case 0:
            light.intensity = baseIntensity + bass * 2;
            light.position.x = 30 * Math.sin(time * 0.4);
            light.position.y = 10 * Math.cos(time * 0.5);
            break;
          case 1:
            light.intensity = baseIntensity + mid * 2;
            light.position.x = -30 * Math.cos(time * 0.3);
            light.position.y = -10 * Math.sin(time * 0.4);
            break;
          case 2:
            light.intensity = baseIntensity + highMid * 2;
            light.position.y = 30 * Math.sin(time * 0.2);
            light.position.x = 15 * Math.cos(time * 0.3);
            break;
          case 3:
            light.intensity = baseIntensity + treble * 2;
            light.position.y = -30 * Math.cos(time * 0.3);
            light.position.x = -15 * Math.sin(time * 0.4);
            break;
          default:
            break;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      uniforms.uAspect.value = camera.aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    cleanup = () => {
      window.removeEventListener('resize', handleResize);
      section?.removeEventListener('touchstart', onTouchStart);
      section?.removeEventListener('touchmove', onTouchMove);
      section?.removeEventListener('touchend', soltar);
      section?.removeEventListener('touchcancel', soltar);
      section?.removeEventListener('pointerdown', onPointerDown);
      section?.removeEventListener('pointermove', onPointerMove);
      section?.removeEventListener('pointerleave', soltar);
      window.cancelAnimationFrame(animationFrameId);
      audio.pause();
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('error', handleAudioError);
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [audioUrl]);

  const togglePlay = async () => {
    try {
      await hapticFeedback('medium');
    } catch (error) {
      console.warn('Haptic feedback no disponible', error);
    }

    const audio = audioRef.current;
    if (!audio) {
      setErrorMessage('El audio aún no está listo.');
      return;
    }

    if (!isPlaying) {
      try {
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        await audio.play();
        isPlayingRef.current = true;
        setIsPlaying(true);
      } catch (error) {
        console.error('Error al reproducir audio:', error);
        setErrorMessage('No se pudo iniciar la música de fondo.');
      }
    } else {
      audio.pause();
      isPlayingRef.current = false;
      setIsPlaying(false);
    }
  };

  return (
    <section id="inicio" ref={sectionRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-papel-100 dark:bg-slate-950">
      <div ref={containerRef} className="absolute inset-0 z-0 hidden dark:block" />
      <HeroVideo />
      <div className="absolute inset-0 dark:bg-black/35" />
      {/* Modo claro: velo suave detrás del texto */}
      <div
        className="pointer-events-none absolute inset-0 dark:hidden"
        style={{
          background:
            'radial-gradient(ellipse 44% 32% at 50% 52%, rgba(248,245,239,0.75) 0%, rgba(248,245,239,0.35) 60%, rgba(248,245,239,0) 100%)',
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-slate-900/5 border border-slate-900/10 dark:bg-white/5 dark:border-white/10 rounded-full"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium tracking-tight">{t('Disponible para nuevos proyectos', 'Available for new projects')}</span>
          </motion.div>

          <h1 className="font-display text-[clamp(2rem,9.6vw,3rem)] sm:text-6xl lg:text-[5.25rem] xl:text-8xl leading-[1.05] font-semibold text-slate-900 dark:text-white mb-5 tracking-tighter max-w-4xl mx-auto">
            {t('Diseño web a medida que potencia tu ', 'Custom web design that grows your ')}
            {/* La palabra clave en el mismo verde del botón, en degradé */}
            <span className="bg-gradient-to-r from-green-800 via-green-600 to-emerald-400 dark:from-green-600 dark:via-emerald-400 dark:to-teal-200 bg-clip-text text-transparent pb-[0.08em] pr-[0.04em]">
              {t('negocio', 'business')}
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-700 dark:text-slate-300 mb-3 font-light tracking-tight max-w-2xl mx-auto">
            {t('Sitios y tiendas online para emprendimientos, artistas y pymes.', 'Websites and online stores for entrepreneurs, artists and small businesses.')}
          </p>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-8 tracking-tight">
            {t('Trabajás directo conmigo, sin intermediarios.', 'You work directly with me, no middlemen.')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href={whatsapp(t('Hola Mirta, vi tu web y quiero pedirte un presupuesto.', "Hi Mirta, I saw your website and I'd like to get a quote."))}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl transition-colors w-full sm:w-auto justify-center"
            >
              <MessageCircle size={20} />
              {t('Pedí tu presupuesto', 'Get a quote')}
            </motion.a>
            <motion.a
              href="#portfolio"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-papel-100/70 text-slate-900 border border-papel-300 hover:bg-papel-200/60 dark:bg-slate-800/60 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700 px-8 py-4 rounded-full font-semibold text-lg backdrop-blur-sm transition-colors w-full sm:w-auto justify-center"
            >
              <ArrowDown size={20} />
              {t('Ver proyectos', 'See projects')}
            </motion.a>
          </div>

          {errorMessage && (
            <p className="mt-4 text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
          )}
        </motion.div>
      </div>

      {/* Música: botón flotante abajo a la izquierda (mueve las partículas al ritmo) */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? t('Pausar música', 'Pause music') : t('Reproducir música', 'Play music')}
        title={isPlaying ? t('Pausar música', 'Pause music') : t('Música', 'Music')}
        className={`fixed z-40 w-12 h-12 inline-flex items-center justify-center rounded-full border backdrop-blur-md shadow-lg transition-colors bg-papel-100/90 text-slate-800 border-papel-200 hover:bg-papel-200 dark:bg-slate-900/70 dark:text-white dark:border-white/10 dark:hover:bg-slate-800 ${
          isPlaying ? 'ring-2 ring-green-500/70' : ''
        }`}
        style={{
          bottom: 'calc(env(safe-area-inset-bottom) + 16px)',
          left: 'calc(env(safe-area-inset-left) + 16px)',
        }}
      >
        {isPlaying ? <Pause size={20} /> : <Music size={20} />}
      </button>

      {/* Indicador para bajar: también es un link a "Qué hago" */}
      <motion.a
        href="#servicios"
        aria-label={t('Bajar a Qué hago', 'Scroll to What I do')}
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-16 z-10 flex flex-col items-center gap-2 group md:[@media(max-height:900px)]:bottom-5 [@media(max-height:720px)]:hidden"
      >
        <span className="text-slate-800 dark:text-white text-sm font-semibold uppercase tracking-[0.25em] drop-shadow">
          Scroll
        </span>
        <ChevronDown
          size={36}
          strokeWidth={2.75}
          className="text-slate-900 dark:text-white drop-shadow transition-transform group-hover:translate-y-1"
        />
      </motion.a>
    </section>
  );
};

export default Hero;
