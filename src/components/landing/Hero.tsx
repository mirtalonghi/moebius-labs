import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, ChevronDown, Play, Pause } from 'lucide-react';
import { hapticFeedback } from '../../utils/mobileFeatures';

const Hero: React.FC = () => {
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
    const colorAttr = new THREE.BufferAttribute(colors, 3);
    geometry.setAttribute('color', colorAttr);

    const material = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      blending: THREE.NormalBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    /* ---------- Modo claro: partículas mejoradas ----------
     * La mitad de los puntos, redondos y más grandes, en tonos de tinta que se ven
     * sobre el papel, unidos por líneas finas como una constelación.
     * El modo oscuro sigue exactamente igual.
     */
    const tintas: [number, number, number][] = [
      [0.42, 0.18, 0.38], // ciruela
      [0.44, 0.38, 0.66], // lavanda
      [0.16, 0.42, 0.46], // verde azulado
      [0.66, 0.38, 0.47], // rosa viejo
    ];
    const claroCount = Math.floor(particleCount / 2);
    const claroPos = new Float32Array(claroCount * 3);
    const claroCol = new Float32Array(claroCount * 3);
    for (let i = 0; i < claroCount; i += 1) {
      const origen = i * 2; // uno de cada dos puntos, así se conserva la forma
      claroPos.set(positions.subarray(origen * 3, origen * 3 + 3), i * 3);
      const grupo = Math.floor((origen / particleCount) * 4);
      const [r, g, b] = tintas[grupo];
      const variacion = 0.85 + Math.random() * 0.3;
      claroCol[i * 3] = Math.min(1, r * variacion);
      claroCol[i * 3 + 1] = Math.min(1, g * variacion);
      claroCol[i * 3 + 2] = Math.min(1, b * variacion);
    }
    const claroGeo = new THREE.BufferGeometry();
    claroGeo.setAttribute('position', new THREE.BufferAttribute(claroPos, 3));
    claroGeo.setAttribute('color', new THREE.BufferAttribute(claroCol, 3));

    // Punto redondo con borde suave (en lugar del cuadradito)
    const lienzo = document.createElement('canvas');
    lienzo.width = lienzo.height = 64;
    const ctx2d = lienzo.getContext('2d');
    if (ctx2d) {
      const grad = ctx2d.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.55, 'rgba(255,255,255,0.95)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx2d.fillStyle = grad;
      ctx2d.fillRect(0, 0, 64, 64);
    }
    const puntoRedondo = new THREE.CanvasTexture(lienzo);
    const claroMat = new THREE.PointsMaterial({
      size: 0.7,
      map: puntoRedondo,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });

    // Constelación: une puntos cercanos con líneas finas (como mucho 2 por punto)
    const enlaces: number[] = [];
    const usados = new Uint8Array(claroCount);
    const DIST2 = 2.4 * 2.4;
    for (let i = 0; i < claroCount; i += 1) {
      if (usados[i] >= 2) continue;
      for (let j = i + 1; j < claroCount && usados[i] < 2; j += 1) {
        if (usados[j] >= 2) continue;
        const dx = claroPos[i * 3] - claroPos[j * 3];
        const dy = claroPos[i * 3 + 1] - claroPos[j * 3 + 1];
        const dz = claroPos[i * 3 + 2] - claroPos[j * 3 + 2];
        if (dx * dx + dy * dy + dz * dz < DIST2) {
          enlaces.push(...claroPos.subarray(i * 3, i * 3 + 3), ...claroPos.subarray(j * 3, j * 3 + 3));
          usados[i] += 1;
          usados[j] += 1;
        }
      }
    }
    const lineasGeo = new THREE.BufferGeometry();
    lineasGeo.setAttribute('position', new THREE.Float32BufferAttribute(enlaces, 3));
    const lineasMat = new THREE.LineBasicMaterial({ color: 0x5b3a57, transparent: true, opacity: 0.22 });
    const lineas = new THREE.LineSegments(lineasGeo, lineasMat);
    particles.add(lineas); // gira junto con las partículas

    // Cambia entre la versión oscura (original) y la clara
    const applyTheme = () => {
      const dark = document.documentElement.classList.contains('dark');
      renderer.setClearColor(dark ? 0x000000 : 0xf8f5ef, 1);
      particles.geometry = dark ? geometry : claroGeo;
      particles.material = dark ? material : claroMat;
      lineas.visible = !dark;
    };
    applyTheme();
    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

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

      const baseRotationX = Math.sin(time * 0.3) * 0.003;
      const baseRotationY = Math.cos(time * 0.2) * 0.005;
      const extraRotationX = bass * 0.002 * Math.sin(time * 2);
      const extraRotationY = mid * 0.004 * Math.cos(time);

      particles.rotation.x += baseRotationX + extraRotationX;
      particles.rotation.y += baseRotationY + extraRotationY;
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
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    cleanup = () => {
      window.removeEventListener('resize', handleResize);
      window.cancelAnimationFrame(animationFrameId);
      audio.pause();
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('error', handleAudioError);
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      themeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      claroGeo.dispose();
      claroMat.dispose();
      puntoRedondo.dispose();
      lineasGeo.dispose();
      lineasMat.dispose();
      renderer.dispose();
    };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [audioUrl]);

  const handleDownload = () => {
    hapticFeedback('medium');
    const link = document.createElement('a');
    link.href = '/CV_Mirta_Longhitano.pdf';
    link.download = 'CV_Mirta_Longhitano.pdf';
    link.click();
  };

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
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-papel-100 dark:bg-slate-950">
      <div ref={containerRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 dark:bg-black/35" />
      {/* Modo claro: velo suave detrás del texto para que las partículas no lo tapen */}
      <div
        className="pointer-events-none absolute inset-0 dark:hidden"
        style={{
          background:
            'radial-gradient(ellipse 42% 30% at 50% 52%, rgba(248,245,239,0.95) 0%, rgba(248,245,239,0.7) 55%, rgba(248,245,239,0) 100%)',
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
            <span className="text-slate-700 dark:text-slate-300 text-sm font-medium tracking-tight">Disponible para trabajar</span>
          </motion.div>

          <h1 className="font-display text-5xl md:text-7xl font-semibold text-slate-900 dark:text-white mb-4 tracking-tighter">
            Moebius Labs
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 font-light tracking-tight">
            Estudio profesional de diseño y desarrollo web
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 px-8 py-4 rounded-full font-semibold text-lg shadow-xl transition-colors w-full sm:w-auto justify-center"
            >
              <Download size={20} />
              Descargar CV
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="flex items-center gap-2 bg-papel-100/70 text-slate-900 border border-papel-300 hover:bg-papel-200/60 dark:bg-slate-800/60 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700 px-8 py-4 rounded-full font-semibold text-lg backdrop-blur-sm transition-colors w-full sm:w-auto justify-center"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              {isPlaying ? 'Pausar música' : 'Reproducir música'}
            </motion.button>
          </div>

          {errorMessage && (
            <p className="mt-4 text-sm text-red-600 dark:text-red-400">{errorMessage}</p>
          )}
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 flex flex-col items-center gap-2"
      >
        <span className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown size={28} className="text-slate-500 dark:text-slate-400" />
      </motion.div>
    </section>
  );
};

export default Hero;
