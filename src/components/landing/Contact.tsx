import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Send, MessageCircle } from 'lucide-react';

const EMAIL = "mirta.wolfsdorf@gmail.com";
// Celular 011 4447 4421 en formato internacional para WhatsApp (54 9 11 ...)
const WHATSAPP = `https://wa.me/5491144474421?text=${encodeURIComponent("Hola Mirta, vi tu web y quiero consultarte por un proyecto.")}`;

const socialLinks = [
  {
    name: "WhatsApp",
    icon: <MessageCircle size={24} />,
    url: WHATSAPP,
    color: "hover:bg-green-600"
  },
  {
    name: "GitHub",
    icon: <Github size={24} />,
    url: "https://github.com/mirtalonghi",
    color: "hover:bg-slate-700"
  },
  {
    name: "Email",
    icon: <Mail size={24} />,
    url: `mailto:${EMAIL}`,
    color: "hover:bg-red-500"
  }
];

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Sin servidor: abre el programa de correo con el mensaje ya armado
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Consulta desde la web${name ? ` — ${name}` : ''}`;
    const body = `${message}\n\n${name}${email ? `\n${email}` : ''}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="contact" className="py-24 px-6 bg-slate-900">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">¿Hablamos?</h2>
          <p className="text-slate-400">
            Contame qué necesita tu negocio y te respondo con una propuesta.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6 mb-16">
          {socialLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.url}
              {...(link.url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              aria-label={link.name}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.9 }}
              className={`p-4 bg-slate-800 text-white rounded-2xl border border-slate-700 transition-all duration-300 ${link.color} group`}
              title={link.name}
            >
              {link.icon}
            </motion.a>
          ))}
        </div>

        <motion.a
          href={WHATSAPP}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center justify-center gap-3 min-h-touch mb-12 px-8 py-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-bold text-lg transition-colors"
        >
          <MessageCircle size={22} />
          Escribime por WhatsApp
        </motion.a>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-blue-600 to-purple-600 p-1 rounded-3xl"
        >
          <div className="bg-slate-950 p-8 md:p-12 rounded-[calc(1.5rem-1px)]">
            <h3 className="text-2xl font-bold text-white mb-6">O mandame un mail</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
              <input
                type="text"
                required
                aria-label="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu Nombre"
                className="bg-slate-900 border border-slate-800 text-white px-6 py-4 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors"
              />
              <input
                type="email"
                aria-label="Tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu Email"
                className="bg-slate-900 border border-slate-800 text-white px-6 py-4 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors"
              />
              <textarea
                required
                aria-label="Tu mensaje"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tu Mensaje"
                rows={4}
                className="bg-slate-900 border border-slate-800 text-white px-6 py-4 rounded-2xl focus:outline-none focus:border-blue-500 transition-colors resize-none"
              ></textarea>
              <button type="submit" className="flex items-center justify-center gap-2 bg-white text-slate-950 font-bold py-4 rounded-2xl hover:bg-blue-500 hover:text-white transition-all active:scale-95">
                <Send size={20} />
                Enviar Mensaje
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
