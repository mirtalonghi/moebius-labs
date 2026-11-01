import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Send, MessageCircle, Copy, Check } from 'lucide-react';

/*
 * Contacto directo, sin formulario: cada botón abre WhatsApp, Telegram o el mail
 * con un mensaje ya empezado. El mail se muestra escrito y se puede copiar,
 * porque en algunas computadoras "mailto:" no abre ningún programa.
 */

const EMAIL = 'mirta.wolfsdorf@gmail.com';
const SALUDO = 'Hola Mirta, vi tu web y quiero consultarte por un proyecto.';
// Celular 011 4447 4421 en formato internacional para WhatsApp (54 9 11 ...)
const WHATSAPP = `https://wa.me/5491144474421?text=${encodeURIComponent(SALUDO)}`;
const TELEGRAM = 'https://t.me/wMoebius';
const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent('Consulta desde la web · Moebius Labs')}&body=${encodeURIComponent(SALUDO + '\n\n')}`;

const canales = [
  {
    nombre: 'WhatsApp',
    detalle: 'La forma más rápida',
    icono: MessageCircle,
    url: WHATSAPP,
    estilo: 'bg-green-600 hover:bg-green-500 text-white',
  },
  {
    nombre: 'Telegram',
    detalle: '@wMoebius',
    icono: Send,
    url: TELEGRAM,
    estilo: 'bg-sky-600 hover:bg-sky-500 text-white',
  },
  {
    nombre: 'Email',
    detalle: EMAIL,
    icono: Mail,
    url: MAILTO,
    estilo:
      'bg-slate-900 hover:bg-slate-700 text-white dark:bg-white dark:hover:bg-slate-200 dark:text-slate-950',
  },
];

const Contact: React.FC = () => {
  const [copiado, setCopiado] = useState(false);

  const copiarMail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* si el navegador no deja copiar, el mail igual queda visible */
    }
  };

  return (
    <section id="contact" className="py-24 px-6 bg-papel-100 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">¿Hablamos?</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Contame qué necesita tu negocio y te respondo con una propuesta. Elegí por dónde te queda más cómodo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {canales.map((c, index) => (
            <motion.a
              key={c.nombre}
              href={c.url}
              {...(c.url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              className={`flex flex-col items-center justify-center gap-2 min-h-touch px-6 py-6 rounded-2xl shadow-lg transition-colors ${c.estilo}`}
            >
              <c.icono size={28} />
              <span className="text-lg font-bold">{c.nombre}</span>
              <span className="text-sm opacity-80 break-all">{c.detalle}</span>
            </motion.a>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate-600 dark:text-slate-400">
          <button
            onClick={copiarMail}
            className="inline-flex items-center gap-1.5 min-h-touch hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {copiado ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            {copiado ? 'Mail copiado' : 'Copiar mi mail'}
          </button>
          <a
            href="https://github.com/mirtalonghi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 min-h-touch hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Github size={16} /> Mi GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
