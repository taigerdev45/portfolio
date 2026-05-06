"use client";

import Image from "next/image";
import { X, Info, Globe, ExternalLink, Github, Server, Monitor, Play, Rocket, Code2 } from "lucide-react";
import { Project } from "@/lib/services";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      return url.replace("youtu.be/", "youtube.com/embed/");
    }
    return url;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-blue-950/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className="bg-white dark:bg-slate-900 rounded-4xl md:rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300 flex flex-col">
        <div className="p-6 md:p-8 border-b border-blue-50 dark:border-slate-800 flex justify-between items-center bg-blue-50/30 dark:bg-blue-900/10 shrink-0">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600 text-white rounded-2xl">
              <Info size={24} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-blue-950 dark:text-white uppercase tracking-tight">
              Détails du Projet
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all text-blue-900/40 hover:text-blue-600 hover:rotate-90 duration-300"
            aria-label="Fermer la fenêtre"
          >
            <X size={28} />
          </button>
        </div>
        
        <div className="p-6 md:p-10 overflow-y-auto space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl border border-blue-100 dark:border-slate-800">
              {project.videoUrl ? (
                <iframe
                  src={getEmbedUrl(project.videoUrl) || ""}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title={`Vidéo de présentation du projet ${project.title}`}
                />
              ) : (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )}
            </div>
            
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl font-black text-blue-950 dark:text-white leading-tight">
                {project.title}
              </h3>
              <div className="inline-flex px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-black text-sm uppercase tracking-widest">
                Exploration Interactive
              </div>

              {/* Liquid Progress Bar */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black text-blue-900/40 dark:text-slate-500 uppercase tracking-widest">Avancement</span>
                  <span className="text-xl font-black text-blue-600">{project.completionLevel || 0}%</span>
                </div>
                <div className="relative h-4 w-full bg-blue-50 dark:bg-slate-800 rounded-full overflow-hidden border border-blue-100 dark:border-slate-700">
                  <div 
                    className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-500 transition-all duration-1000 ease-out"
                    style={{ width: `${project.completionLevel || 0}%` } as React.CSSProperties}
                  >
                    {/* Liquid Wave Effect */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute inset-0 animate-wave bg-[url('/wave.png')] bg-repeat-x bg-contain" />
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-lg text-blue-900/60 dark:text-slate-400 font-bold leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-1 bg-blue-600 rounded-full" />
              <h4 className="text-xl font-black text-blue-950 dark:text-white uppercase tracking-tighter">Tableau d&apos;exploration</h4>
            </div>
            
            <div className="overflow-hidden border border-blue-100 dark:border-slate-800 rounded-3xl shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-50/50 dark:bg-blue-900/20">
                    <th className="px-6 py-4 text-xs font-black text-blue-900/40 dark:text-slate-500 uppercase tracking-widest border-b border-blue-100 dark:border-slate-800">Caractéristique</th>
                    <th className="px-6 py-4 text-xs font-black text-blue-900/40 dark:text-slate-500 uppercase tracking-widest border-b border-blue-100 dark:border-slate-800">Information</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-50 dark:divide-slate-800">
                  <tr>
                    <td className="px-6 py-5 font-black text-blue-950 dark:text-white flex items-center space-x-3">
                      <Info size={18} className="text-blue-600" />
                      <span>Nom du projet</span>
                    </td>
                    <td className="px-6 py-5 text-blue-900/60 dark:text-slate-400 font-bold">{project.title}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-5 font-black text-blue-950 dark:text-white flex items-center space-x-3">
                      <Globe size={18} className="text-blue-600" />
                      <span>Lien direct</span>
                    </td>
                    <td className="px-6 py-5">
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-black inline-flex items-center space-x-2"
                      >
                        <span>Visiter le site</span>
                        <ExternalLink size={14} />
                      </a>
                    </td>
                  </tr>
                  {project.githubUrl && (
                    <tr>
                      <td className="px-6 py-5 font-black text-blue-950 dark:text-white flex items-center space-x-3">
                        <Github size={18} className="text-blue-600" />
                        <span>Code source</span>
                      </td>
                      <td className="px-6 py-5">
                        <a 
                          href={project.githubUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-black inline-flex items-center space-x-2"
                        >
                          <span>Voir sur GitHub</span>
                          <ExternalLink size={14} />
                        </a>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="px-6 py-5 font-black text-blue-950 dark:text-white flex items-center space-x-3">
                      {project.status === "online" ? (
                        <Server size={18} className="text-green-500" />
                      ) : (
                        <Monitor size={18} className="text-orange-500" />
                      )}
                      <span>Environnement</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${
                        project.status === "online" 
                          ? "bg-green-50 dark:bg-green-900/20 text-green-600" 
                          : "bg-orange-50 dark:bg-orange-900/20 text-orange-600"
                      }`}>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                          project.status === "online" ? "bg-green-500" : "bg-orange-500"
                        }`} />
                        <span>{project.status === "online" ? "En ligne" : "Local / Dev"}</span>
                      </div>
                    </td>
                  </tr>
                  {project.videoUrl && (
                    <tr>
                      <td className="px-6 py-5 font-black text-blue-950 dark:text-white flex items-center space-x-3">
                        <Play size={18} className="text-blue-600" />
                        <span>Démo Vidéo</span>
                      </td>
                      <td className="px-6 py-5">
                        <a 
                          href={project.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-black inline-flex items-center space-x-2"
                        >
                          <span>Voir sur la plateforme</span>
                          <ExternalLink size={14} />
                        </a>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td className="px-6 py-5 font-black text-blue-950 dark:text-white flex items-center space-x-3">
                      <Code2 size={18} className="text-blue-600" />
                      <span>Technologies</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                        {project.technologies && project.technologies.length > 0 ? (
                          project.technologies.map((tech, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-black uppercase tracking-widest"
                            >
                              {tech}
                            </span>
                          ))
                        ) : (
                          <span className="text-blue-900/40 dark:text-slate-500 font-bold italic">
                            Non spécifiées
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center space-x-3 bg-blue-600 text-white px-8 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-200 dark:shadow-none"
            >
              <span>Lancer le Projet</span>
              <Rocket size={20} />
            </a>
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center space-x-3 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 px-8 py-5 rounded-2xl font-black text-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
            >
              <span>Fermer l&apos;exploration</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
