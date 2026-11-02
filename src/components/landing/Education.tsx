import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar } from 'lucide-react';
import { useLang } from '../../i18n';

// Formación real (del CV). Del más nuevo al más antiguo.
const education: { degree: string; school: string; period?: string; description: string; en: [string, string] }[] = [
  {
    degree: "Creación de Páginas Web con V0",
    en: ["Building Websites with V0", "7 hours of theory and practice. Designing and prototyping websites with v0, Vercel's AI tool."],
    school: "Platzi",
    period: "2026",
    description: "7 horas de teoría y práctica. Diseño y prototipado de sitios web con v0, la herramienta de inteligencia artificial de Vercel."
  },
  {
    degree: "Introducción a la Web: Historia y Funcionamiento de Internet",
    en: ["Introduction to the Web: History and How the Internet Works", "12 hours. How the Internet, the web and browsers work."],
    school: "Platzi",
    period: "2026",
    description: "12 horas. Cómo funciona Internet, la web y los navegadores."
  },
  {
    degree: "Introducción a la Inteligencia Artificial",
    en: ["Introduction to Artificial Intelligence", "4 hours. Basic concepts of artificial intelligence and its applications."],
    school: "Platzi",
    period: "2026",
    description: "4 horas. Conceptos básicos de inteligencia artificial y sus aplicaciones."
  },
  {
    degree: "Developer Pack en Ethereum (Solidity)",
    en: ["Ethereum Developer Pack (Solidity)", "Smart contract development in Solidity. Final project: SimpleDEX, a decentralized exchange."],
    school: "ETH-KIPU",
    period: "2024",
    description: "Desarrollo de contratos inteligentes en Solidity. Trabajo final: SimpleDEX, un exchange descentralizado."
  },
  {
    degree: "Front-End JavaScript",
    en: ["Front-End JavaScript", "Building web interfaces with HTML, CSS and JavaScript."],
    school: "Talento Tech",
    period: "2024",
    description: "Desarrollo de interfaces web con HTML, CSS y JavaScript."
  },
  {
    degree: "Full Stack Python, Django y Desarrollo Web con Node.js",
    en: ["Full Stack Python, Django and Web Development with Node.js", "Three full stack courses: Python and Django on the back end, JavaScript and Node.js on the web."],
    school: "Codo a Codo 4.0",
    period: "2022 - 2024",
    description: "Tres cursos de desarrollo full stack: Python y Django en el back-end, JavaScript y Node.js en la web."
  },
  {
    degree: "Analista en Computación Administrativa",
    en: ["Business Computing Analyst (degree)", "Official degree. Intermediate degree: Senior Technician in Business Statistics."],
    school: "Instituto Superior de Buenos Aires",
    description: "Título oficial. Título intermedio: Técnica Superior en Estadística de Empresas."
  },
  {
    degree: "Licenciatura en Análisis de Sistemas (cursada parcial)",
    en: ["Bachelor's in Systems Analysis (partial)", "Courses passed include Algorithms and Programming I, II and III, Data Organization and Design Techniques."],
    school: "Facultad de Ingeniería, UBA",
    description: "Materias aprobadas, entre otras: Algoritmos y Programación I, II y III, Organización de Datos y Técnicas de Diseño."
  }
];

const Education: React.FC = () => {
  const { lang, t } = useLang();
  return (
    <section id="formacion" className="py-24 px-6 bg-papel-100 dark:bg-slate-950 scroll-mt-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">{t('Formación', 'Education')}</h2>
          <p className="text-slate-600 dark:text-slate-400">{t('Formación en sistemas y actualización constante en desarrollo web.', 'Background in systems and ongoing training in web development.')}</p>
        </motion.div>

        <div className="space-y-8">
          {education.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 border-l-2 border-papel-200 dark:border-slate-800 hover:border-blue-500 transition-colors"
            >
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-papel-100 dark:bg-slate-950 border-2 border-blue-500 rounded-full" />
              <div className="bg-papel-100 dark:bg-slate-900/50 p-6 rounded-2xl border border-papel-200 dark:border-slate-800 hover:bg-papel-200 dark:hover:bg-slate-900 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <GraduationCap className="text-blue-600 dark:text-blue-400 shrink-0" size={20} />
                    {lang === 'en' ? item.en[0] : item.degree}
                  </h3>
                  {item.period && (
                    <span className="flex items-center gap-1 text-sm font-medium text-slate-600 bg-papel-200 dark:text-slate-500 dark:bg-slate-800 px-3 py-1 rounded-full shrink-0">
                      <Calendar size={14} />
                      {item.period}
                    </span>
                  )}
                </div>
                <p className="text-blue-700 dark:text-blue-400 font-medium mb-2">{item.school}</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{lang === 'en' ? item.en[1] : item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
