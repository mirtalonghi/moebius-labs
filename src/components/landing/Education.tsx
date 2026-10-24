import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar } from 'lucide-react';

// Formación real (del CV). Del más nuevo al más antiguo.
const education: { degree: string; school: string; period?: string; description: string }[] = [
  {
    degree: "Cursos de desarrollo web e inteligencia artificial",
    school: "Platzi",
    period: "2026",
    description: "Creación de páginas web con V0, Introducción a la web (historia y funcionamiento de Internet) e Introducción a la inteligencia artificial."
  },
  {
    degree: "Developer Pack en Ethereum (Solidity)",
    school: "ETH-KIPU",
    period: "2024",
    description: "Desarrollo de contratos inteligentes en Solidity. Trabajo final: SimpleDEX, un exchange descentralizado."
  },
  {
    degree: "Front-End JavaScript",
    school: "Talento Tech",
    period: "2024",
    description: "Desarrollo de interfaces web con HTML, CSS y JavaScript."
  },
  {
    degree: "Full Stack Python, Django y Desarrollo Web con Node.js",
    school: "Codo a Codo 4.0",
    period: "2022 - 2024",
    description: "Tres cursos de desarrollo full stack: Python y Django en el back-end, JavaScript y Node.js en la web."
  },
  {
    degree: "Analista en Computación Administrativa",
    school: "Instituto Superior de Buenos Aires",
    description: "Título oficial. Título intermedio: Técnica Superior en Estadística de Empresas."
  },
  {
    degree: "Licenciatura en Análisis de Sistemas (cursada parcial)",
    school: "Facultad de Ingeniería, UBA",
    description: "Materias aprobadas, entre otras: Algoritmos y Programación I, II y III, Organización de Datos y Técnicas de Diseño."
  }
];

const Education: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-slate-950">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Formación</h2>
          <p className="text-slate-400">Formación en sistemas y actualización constante en desarrollo web.</p>
        </motion.div>

        <div className="space-y-8">
          {education.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 border-l-2 border-slate-800 hover:border-blue-500 transition-colors"
            >
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-slate-950 border-2 border-blue-500 rounded-full" />
              <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:bg-slate-900 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <GraduationCap className="text-blue-400" size={20} />
                    {item.degree}
                  </h3>
                  {item.period && (
                    <span className="flex items-center gap-1 text-sm font-medium text-slate-500 bg-slate-800 px-3 py-1 rounded-full shrink-0">
                      <Calendar size={14} />
                      {item.period}
                    </span>
                  )}
                </div>
                <p className="text-blue-400 font-medium mb-2">{item.school}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
