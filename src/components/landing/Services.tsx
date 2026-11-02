import React from 'react';
import { motion } from 'framer-motion';
import { Palette, ShoppingBag, RefreshCw, ArrowRight, MessageCircle, Clock } from 'lucide-react';
import { useLang, whatsapp } from '../../i18n';

/*
 * "Qué hago": quién soy, el precio de referencia y los tres servicios,
 * cada uno con el caso real que lo muestra.
 */

const Services: React.FC = () => {
  const { t } = useLang();

  const services = [
    {
      icon: Palette,
      title: t('Sitios a medida', 'Custom websites'),
      text: t(
        'Para artistas, profesionales y marcas que quieren mostrar su trabajo con una web propia, rápida y que se vea bien en el celular.',
        'For artists, professionals and brands who want to show their work with a site of their own: fast, and great on mobile.'
      ),
      example: { label: t('Ver el sitio de Faiwel Wolfsdorf', 'See the Faiwel Wolfsdorf site'), href: '/proyectos/faiwel-wolfsdorf/' },
    },
    {
      icon: ShoppingBag,
      title: t('Tiendas online', 'Online stores'),
      text: t(
        'Catálogo, carrito y un panel simple para que cargues tus productos, precios y fotos sin depender de nadie.',
        'Catalog, cart and a simple admin panel so you can manage your products, prices and photos on your own.'
      ),
      example: { label: t('Ver la tienda de LOBA BAGUES', 'See the LOBA BAGUES store'), href: '/proyectos/loba-bagues/' },
    },
    {
      icon: RefreshCw,
      title: t('Rediseño de webs', 'Website redesign'),
      text: t(
        'Si tu sitio quedó viejo, es lento o no se ve en el celular, lo renuevo manteniendo tu contenido y tu identidad.',
        'If your site looks dated, is slow or breaks on mobile, I rebuild it while keeping your content and your identity.'
      ),
      example: { label: t('Ver el antes y después', 'See the before and after'), href: '/proyectos/faiwel-wolfsdorf/' },
    },
  ];

  return (
    <section id="servicios" className="py-24 px-6 bg-papel-100 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{t('Qué hago', 'What I do')}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            {t(
              'Soy Mirta Longhitano, desarrolladora web. Antes de programar trabajé muchos años en administración, así que entiendo cómo funciona un negocio por dentro y qué necesita de su web.',
              "I'm Mirta Longhitano, a web developer. Before coding I spent many years in business administration, so I understand how a business works from the inside and what it needs from its website."
            )}
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-lg mt-4">
            {t(
              'Me recibí de Analista en Computación Administrativa, cursé Análisis de Sistemas en la Facultad de Ingeniería de la UBA y sigo formándome en desarrollo web.',
              'I hold a degree in Business Computing, studied Systems Analysis at the University of Buenos Aires School of Engineering, and keep training in web development.'
            )}
          </p>
          <a
            href="#formacion"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 dark:text-amber-300 hover:gap-2.5 transition-all"
          >
            {t('Ver toda mi formación', 'See my full education')} <ArrowRight size={16} />
          </a>
        </motion.div>

        {/* Precio de referencia */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-14 p-6 md:p-8 rounded-2xl text-center bg-amber-50 border border-amber-300/70 dark:bg-amber-400/10 dark:border-amber-400/30"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-800 dark:text-amber-300 mb-2">
            {t('Precio', 'Pricing')}
          </p>
          <p className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            {t('Desde U$S 100', 'From US$100')}
          </p>
          <p className="mt-1 text-slate-700 dark:text-slate-300">{t('Pago único', 'One-time payment')}</p>
          <p className="mt-4 inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
            <Clock size={18} className="text-amber-700 dark:text-amber-300" />
            {t('Tené tu sitio en una semana', 'Get your site in one week')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s, index) => (
            <motion.div
              key={s.example.href + index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col p-8 rounded-2xl bg-papel-50 dark:bg-slate-900 border border-papel-200 dark:border-slate-800"
            >
              <div className="w-12 h-12 mb-6 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-700 dark:text-blue-400">
                <s.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{s.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">{s.text}</p>
              <a
                href={s.example.href}
                className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-amber-700 dark:text-amber-300 hover:gap-2.5 transition-all"
              >
                {s.example.label} <ArrowRight size={16} />
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-14 text-center"
        >
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {t('¿Tenés un proyecto en mente? Contame y te digo cómo lo haría.', "Have a project in mind? Tell me about it and I'll tell you how I'd build it.")}
          </p>
          <a
            href={whatsapp(t('Hola Mirta, vi tu web y quiero consultarte por un proyecto.', "Hi Mirta, I saw your website and I'd like to ask you about a project."))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-slate-900 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition-colors"
          >
            <MessageCircle size={18} /> {t('Escribime por WhatsApp', 'Message me on WhatsApp')}
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
