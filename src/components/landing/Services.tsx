import React from 'react';
import { motion } from 'framer-motion';
import { Palette, ShoppingBag, RefreshCw, ArrowRight, MessageCircle } from 'lucide-react';

/*
 * "Qué hago": quién soy en dos líneas y los tres servicios,
 * cada uno con el caso real que lo muestra.
 */

const WHATSAPP = `https://wa.me/5491144474421?text=${encodeURIComponent("Hola Mirta, vi tu web y quiero consultarte por un proyecto.")}`;

const services = [
  {
    icon: Palette,
    title: 'Sitios a medida',
    text: 'Para artistas, profesionales y marcas que quieren mostrar su trabajo con una web propia, rápida y que se vea bien en el celular.',
    example: { label: 'Ver el sitio de Faiwel Wolfsdorf', href: '/proyectos/faiwel-wolfsdorf/' },
  },
  {
    icon: ShoppingBag,
    title: 'Tiendas online',
    text: 'Catálogo, carrito y un panel simple para que cargues tus productos, precios y fotos sin depender de nadie.',
    example: { label: 'Ver la tienda de LOBA BAGUES', href: '/proyectos/loba-bagues/' },
  },
  {
    icon: RefreshCw,
    title: 'Rediseño de webs',
    text: 'Si tu sitio quedó viejo, es lento o no se ve en el celular, lo renuevo manteniendo tu contenido y tu identidad.',
    example: { label: 'Ver el antes y después', href: '/proyectos/faiwel-wolfsdorf/' },
  },
];

const Services: React.FC = () => {
  return (
    <section id="servicios" className="py-24 px-6 bg-papel-100 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Qué hago</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Soy Mirta Longhitano, desarrolladora web. Antes de programar trabajé muchos años
            en administración, así que entiendo cómo funciona un negocio por dentro y qué necesita de su web.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s, index) => (
            <motion.div
              key={s.title}
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
          <p className="text-slate-600 dark:text-slate-400 mb-4">¿Tenés un proyecto en mente? Contame y te digo cómo lo haría.</p>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold bg-slate-900 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition-colors"
          >
            <MessageCircle size={18} /> Escribime por WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
