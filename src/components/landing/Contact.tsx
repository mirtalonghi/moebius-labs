import React from 'react';
import { motion } from 'framer-motion';
import { Github, Send, MessageCircle } from 'lucide-react';
import { useLang, whatsapp } from '../../i18n';

/*
 * Contacto directo, sin formulario: WhatsApp (con un mensaje ya empezado) y Telegram.
 * El mail se agrega cuando haya dominio propio (contacto@...).
 */

const TELEGRAM = 'https://t.me/wMoebius';

const Contact: React.FC = () => {
  const { t } = useLang();

  const SALUDO = t('Hola Mirta, vi tu web y quiero consultarte por un proyecto.', "Hi Mirta, I saw your website and I'd like to ask you about a project.");

  const canales = [
  {
    nombre: 'WhatsApp',
    detalle: t('La forma más rápida', 'The fastest way'),
    icono: MessageCircle,
    url: whatsapp(SALUDO),
    estilo: 'bg-green-600 hover:bg-green-500 text-white',
  },
  {
    nombre: 'Telegram',
    detalle: '@wMoebius',
    icono: Send,
    url: TELEGRAM,
    estilo: 'bg-sky-600 hover:bg-sky-500 text-white',
  },
];

  return (
    <section id="contact" className="py-24 px-6 bg-papel-100 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{t('¿Hablamos?', "Let's talk")}</h2>
          <p className="text-slate-600 dark:text-slate-400">
            {t(
              'Contame qué necesita tu negocio y te respondo con una propuesta. Elegí por dónde te queda más cómodo.',
              "Tell me what your business needs and I'll reply with a proposal. Pick whichever channel suits you best."
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
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
          <a
            href="https://github.com/mirtalonghi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 min-h-touch hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Github size={16} /> {t('Mi GitHub', 'My GitHub')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
