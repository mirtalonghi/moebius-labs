import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Github } from 'lucide-react';

/*
 * Dos tipos de card:
 *  - "link":   el click en la card abre directamente el sitio (link externo).
 *  - "detail": el click lleva primero a una página propia con la intro y el detalle
 *              del proyecto (detailPage); esa página tiene abajo el botón al proyecto.
 */
type Project = {
  title: string;
  description: string;
  image: string;
  imagePosition?: string;
  tags: string[];
  github?: string;
} & (
  | { type: 'link'; link: string }
  | { type: 'detail'; detailPage: string }
);

const projects: Project[] = [
  {
    type: 'link',
    title: "Faiwel Wolfsdorf",
    description: "Sitio web para un artista surrealista: un viaje cromático desde Varsovia hasta Sudamérica, con galería de obra multiidioma y experiencia inmersiva.",
    image: "/projects/faiwelwolfsdorf.webp",
    tags: ["React", "Vite", "Tailwind", "Framer Motion"],
    link: "https://faiwelwolfsdorf.com",
    github: "https://github.com/mirtalonghi/wolfsdorff"
  },
  {
    type: 'link',
    title: "LOBA BAGUES",
    description: "Tienda online de cosmética con catálogo por categorías, promociones, carrito de compras y panel de gestión con autenticación.",
    image: "/projects/loba-bagues.webp",
    imagePosition: "object-top",
    tags: ["Next.js", "TypeScript", "Tailwind", "Better Auth"],
    link: "https://loba-bagues.vercel.app",
    github: "https://github.com/mirtalonghi/LOBABAGUES"
  },
  {
    type: 'detail',
    title: "SimpleDEX",
    description: "Exchange descentralizado en Solidity. Una demo interactiva muestra cómo funciona y qué fallas de la versión original corrige la versión 2.",
    image: "/projects/simpledex.svg",
    tags: ["Solidity", "Scaffold-ETH", "Next.js", "Blockchain"],
    detailPage: "/proyectos/simpledex/",
    github: "https://github.com/mirtalonghi/simpleDex"
  }
];

// "#" o vacío = todavía sin link
const real = (url?: string) => (url && url !== '#' ? url : undefined);

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const isDetail = project.type === 'detail';
  const href = isDetail ? project.detailPage : real(project.link);
  const github = real(project.github);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`relative flex flex-col bg-slate-800 rounded-2xl overflow-hidden border transition-colors group focus-within:ring-2 focus-within:ring-blue-500 ${
        isDetail ? 'border-amber-400/30 hover:border-amber-400/70' : 'border-slate-700 hover:border-blue-500/50'
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.image}
          alt=""
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover ${project.imagePosition ?? ''} group-hover:scale-110 transition-transform duration-500`}
        />
        {isDetail && (
          <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400 text-slate-950">
            Caso de estudio
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-white mb-2">
          {href ? (
            <a
              href={href}
              {...(isDetail ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
              className="focus:outline-none after:absolute after:inset-0 after:content-['']"
            >
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h3>
        <p className="text-slate-400 text-sm mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.map((tag) => (
            <span key={tag} className="text-xs font-medium px-2 py-1 bg-blue-500/10 text-blue-400 rounded-md border border-blue-500/20">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-slate-700/70">
          {href ? (
            <span
              aria-hidden="true"
              className={`inline-flex items-center gap-1.5 text-sm font-semibold ${isDetail ? 'text-amber-300' : 'text-blue-400'}`}
            >
              {isDetail ? (
                <>Ver el proyecto <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
              ) : (
                <>Visitar el sitio <ArrowUpRight size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" /></>
              )}
            </span>
          ) : (
            <span className="text-sm text-slate-500">Próximamente</span>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ver el código de ${project.title} en GitHub`}
              className="relative z-10 min-w-touch min-h-touch -m-2 inline-flex items-center justify-center rounded-full text-slate-400 hover:text-white transition-colors"
            >
              <Github size={20} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
};

const Portfolio: React.FC = () => {
  return (
    <section id="portfolio" className="py-24 px-6 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Mi Portfolio</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Una selección de mis proyectos más recientes y destacados.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
