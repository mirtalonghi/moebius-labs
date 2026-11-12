import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, X, Send, Loader2, MessageCircle } from 'lucide-react';
import { useLang, whatsapp } from '../../i18n';

/*
 * Asistente con IA: botón flotante abajo a la derecha que abre un chat.
 * Las respuestas vienen de /api/asistente (función de Vercel con Claude).
 * Cualquier parte de la página puede abrirlo con:  window.dispatchEvent(new Event('abrir-asistente'))
 */

type Msg = { role: 'user' | 'assistant'; content: string };

const Asistente: React.FC = () => {
  const { t, lang } = useLang();
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Msg[]>([]);
  const [texto, setTexto] = useState('');
  const [pensando, setPensando] = useState(false);
  const [error, setError] = useState('');
  const lista = useRef<HTMLDivElement | null>(null);
  const campo = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const abrir = () => setAbierto(true);
    window.addEventListener('abrir-asistente', abrir);
    return () => window.removeEventListener('abrir-asistente', abrir);
  }, []);

  useEffect(() => {
    if (abierto) setTimeout(() => campo.current?.focus(), 50);
  }, [abierto]);

  useEffect(() => {
    lista.current?.scrollTo({ top: lista.current.scrollHeight, behavior: 'smooth' });
  }, [mensajes, pensando]);

  useEffect(() => {
    if (!abierto) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAbierto(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [abierto]);

  const sugerencias =
    lang === 'en'
      ? ['How much does a website cost?', 'How long does it take?', 'Do you build online stores?']
      : ['¿Cuánto cuesta una web?', '¿Cuánto tarda?', '¿Hacés tiendas online?'];

  const enviar = async (pregunta: string) => {
    const q = pregunta.trim();
    if (!q || pensando) return;
    const nuevos: Msg[] = [...mensajes, { role: 'user', content: q }];
    setMensajes(nuevos);
    setTexto('');
    setError('');
    setPensando(true);
    try {
      const r = await fetch('/api/asistente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensajes: nuevos }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.respuesta) throw new Error(data.error || '');
      setMensajes([...nuevos, { role: 'assistant', content: data.respuesta }]);
    } catch (e) {
      setError(
        (e instanceof Error && e.message) ||
          t('El asistente no pudo responder. Probá de nuevo en unos minutos.', "The assistant couldn't reply. Please try again in a few minutes.")
      );
    } finally {
      setPensando(false);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      {!abierto && (
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-label={t('Abrir el asistente con IA', 'Open the AI assistant')}
          className="fixed z-40 inline-flex items-center gap-2 h-12 pl-4 pr-5 rounded-full shadow-xl font-semibold text-sm text-white bg-gradient-to-r from-green-700 to-emerald-500 hover:from-green-600 hover:to-emerald-400 transition-colors"
          style={{ bottom: 'calc(env(safe-area-inset-bottom) + 16px)', right: 'calc(env(safe-area-inset-right) + 16px)' }}
        >
          <Sparkles size={18} />
          {t('Preguntame', 'Ask me')}
        </button>
      )}

      {/* Ventana del chat */}
      {abierto && (
        <div
          role="dialog"
          aria-label={t('Asistente con IA', 'AI assistant')}
          className="fixed z-50 flex flex-col overflow-hidden rounded-2xl border shadow-2xl bg-papel-50 border-papel-200 dark:bg-slate-900 dark:border-slate-700 inset-x-3 sm:inset-x-auto sm:w-[380px]"
          style={{
            bottom: 'calc(env(safe-area-inset-bottom) + 12px)',
            right: 'calc(env(safe-area-inset-right) + 12px)',
            height: 'min(560px, calc(100dvh - 96px))',
          }}
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-papel-200 dark:border-slate-800 bg-gradient-to-r from-green-700 to-emerald-500 text-white">
            <Sparkles size={20} />
            <div className="flex-1 leading-tight">
              <p className="font-semibold">{t('Asistente de Moebius Labs', 'Moebius Labs assistant')}</p>
              <p className="text-xs opacity-90">{t('Con IA · respuestas al instante', 'AI-powered · instant answers')}</p>
            </div>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label={t('Cerrar', 'Close')}
              className="min-w-touch min-h-touch -mr-2 inline-flex items-center justify-center rounded-full hover:bg-white/15"
            >
              <X size={20} />
            </button>
          </div>

          <div ref={lista} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 text-sm" aria-live="polite">
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-2.5 bg-papel-200/70 text-slate-800 dark:bg-slate-800 dark:text-slate-100">
              {t(
                '¡Hola! Soy el asistente de Mirta. Preguntame por precios, plazos o qué tipo de web te conviene.',
                "Hi! I'm Mirta's assistant. Ask me about prices, timelines or what kind of website fits you."
              )}
            </div>

            {mensajes.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {sugerencias.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => enviar(s)}
                    className="px-3 py-2 rounded-full border text-left border-green-600/40 text-green-800 hover:bg-green-600/10 dark:text-green-300 dark:border-green-400/30 dark:hover:bg-green-400/10"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {mensajes.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 ${
                  m.role === 'user'
                    ? 'ml-auto rounded-tr-sm bg-green-700 text-white'
                    : 'rounded-tl-sm bg-papel-200/70 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
                }`}
              >
                {m.content}
              </div>
            ))}

            {pensando && (
              <div className="inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 bg-papel-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Loader2 size={16} className="animate-spin" /> {t('Pensando…', 'Thinking…')}
              </div>
            )}

            {error && (
              <div className="rounded-xl px-4 py-3 bg-red-50 text-red-800 dark:bg-red-500/10 dark:text-red-200">
                {error}{' '}
                <a
                  href={whatsapp(t('Hola Mirta, vi tu web y quiero consultarte por un proyecto.', "Hi Mirta, I saw your website and I'd like to ask you about a project."))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline"
                >
                  {t('Escribile por WhatsApp', 'Message her on WhatsApp')}
                </a>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              enviar(texto);
            }}
            className="flex items-center gap-2 p-3 border-t border-papel-200 dark:border-slate-800"
          >
            <input
              ref={campo}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              maxLength={600}
              placeholder={t('Escribí tu pregunta…', 'Type your question…')}
              aria-label={t('Tu pregunta', 'Your question')}
              className="flex-1 min-w-0 h-11 px-4 rounded-full border text-base sm:text-sm bg-white border-papel-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-600 dark:bg-slate-950 dark:border-slate-700 dark:text-white"
            />
            <button
              type="submit"
              disabled={!texto.trim() || pensando}
              aria-label={t('Enviar', 'Send')}
              className="w-11 h-11 shrink-0 inline-flex items-center justify-center rounded-full bg-green-700 text-white hover:bg-green-600 disabled:opacity-40 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="px-4 pb-2 -mt-1 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <MessageCircle size={12} />
            {t('Respuestas generadas con IA. Para confirmar, escribile a Mirta.', 'AI-generated answers. To confirm, message Mirta.')}
          </p>
        </div>
      )}
    </>
  );
};

export default Asistente;
