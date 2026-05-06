"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";
import { Project } from "@/lib/services";
import { motion } from "framer-motion";

interface ProjectsPreviewProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export default function ProjectsPreview({ projects, onProjectClick }: ProjectsPreviewProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 space-y-4 md:space-y-0">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">Projets Sélectionnés</h2>
          <div className="h-1.5 w-20 bg-blue-600 rounded-full" />
        </div>
        <Link href="/projects" className="text-blue-600 font-black flex items-center space-x-2 hover:translate-x-2 transition-transform">
          <span>Voir tout l&apos;univers</span>
          <ArrowRight size={20} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {projects.map((project, i) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{ 
              y: -10,
              transition: { duration: 0.3 }
            }}
            className="group bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col"
          >
            <div className="relative h-72 overflow-hidden">
              <Image 
                src={project.image || "/placeholder.png"} 
                alt={project.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Status Badge on Card */}
              <div className="absolute top-6 right-6 z-10">
                <div className={`px-4 py-2 rounded-2xl backdrop-blur-md border font-black text-[10px] uppercase tracking-widest flex items-center space-x-2 ${
                  project.status === "online" 
                    ? "bg-green-500/20 border-green-400/30 text-green-100" 
                    : "bg-orange-500/20 border-orange-400/30 text-orange-100"
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    project.status === "online" ? "bg-green-400" : "bg-orange-400"
                  }`} />
                  <span>{project.status === "online" ? "Online" : "Local"}</span>
                </div>
              </div>

              <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => onProjectClick(project)}
                  className="bg-white/20 backdrop-blur-md p-5 rounded-full text-white transform scale-90 group-hover:scale-100 transition-transform duration-500"
                  aria-label="Voir les détails du projet"
                >
                  <Search size={40} />
                </button>
              </div>
            </div>
            <div className="p-8 md:p-10 space-y-4 grow flex flex-col">
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors tracking-tight">
                {project.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-lg font-bold leading-relaxed">
                {project.description}
              </p>
              <div className="pt-6 mt-auto">
                <button 
                  onClick={() => onProjectClick(project)}
                  className="inline-flex items-center space-x-2 text-blue-600 font-black hover:space-x-3 transition-all uppercase text-sm tracking-widest"
                >
                  <span>Explorer</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
