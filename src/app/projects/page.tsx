"use client";

import { useEffect, useState } from "react";
import { getProjects, Project, trackPageView, trackClick } from "@/lib/services";
import { ExternalLink, Code2, Search, X, Play, Globe, Info, Rocket, Server, Monitor } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const p = await getProjects();
        setProjects(p);
        await trackPageView();
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProjectClick = async (project: Project) => {
    setSelectedProject(project);
    if (project.id) {
      await trackClick(project.id);
    }
  };

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

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-blue-900/60 font-black uppercase tracking-widest text-sm animate-pulse">Chargement des projets...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-20 animate-in fade-in duration-1000">
      <div className="text-center space-y-6 pt-12">
        <h1 className="text-5xl md:text-8xl font-black text-slate-950 dark:text-white tracking-tight leading-tight">
          Mes <span className="text-gradient">Réalisations</span>
        </h1>
        <p className="text-xl text-blue-900/60 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-bold">
          Une sélection de projets passionnants où le design rencontre la performance.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mb-20 md:mb-32">
        <div className="relative group px-4">
          <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-focus-within:duration-200" />
          <Search className="absolute left-10 md:left-6 top-1/2 -translate-y-1/2 text-blue-900/40 group-focus-within:text-blue-600 transition-colors duration-300" size={24} />
          <input
            type="text"
            placeholder="Filtrer par technologie ou nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 md:pl-16 pr-6 md:pr-8 py-5 md:py-6 bg-white/80 backdrop-blur-xl dark:bg-slate-900 border-2 border-blue-100 dark:border-slate-800 rounded-full focus:ring-8 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-500 text-base md:text-lg font-bold text-blue-950 dark:text-white shadow-2xl shadow-blue-900/5"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group bg-white/80 backdrop-blur-sm dark:bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] border border-blue-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:border-blue-300 transition-all duration-500 flex flex-col md:hover:-translate-y-4"
          >
            <div className="relative h-56 md:h-64 w-full overflow-hidden">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center">
                  <div className="p-6 bg-white/50 dark:bg-slate-900/50 rounded-full">
                    <Code2 size={48} className="text-blue-200 dark:text-slate-700" />
                  </div>
                </div>
              )}
              
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
              <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <button 
                  onClick={() => handleProjectClick(project)}
                  className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white transform scale-90 group-hover:scale-100 transition-transform duration-500"
                >
                  <Search size={32} />
                </button>
              </div>
            </div>

            <div className="p-6 md:p-10 flex flex-col grow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl md:text-2xl font-black text-blue-950 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
              </div>
              
              <p className="text-blue-900/60 dark:text-slate-400 font-bold mb-8 line-clamp-3 leading-relaxed text-sm md:text-base">
                {project.description}
              </p>

              <div className="mt-auto pt-6 border-t border-blue-50 dark:border-slate-800">
                <button 
                  onClick={() => handleProjectClick(project)}
                  className="inline-flex items-center justify-center space-x-3 w-full bg-blue-600 text-white px-6 md:px-8 py-4 md:py-5 rounded-2xl md:rounded-4xl font-black text-base md:text-lg hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-xl shadow-blue-200 dark:shadow-none"
                >
                  <span>Explorer le projet</span>
                  <ExternalLink size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-blue-950/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedProject(null)} />
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300 flex flex-col">
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
                onClick={() => setSelectedProject(null)}
                className="p-3 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all text-blue-900/40 hover:text-blue-600 hover:rotate-90 duration-300"
              >
                <X size={28} />
              </button>
            </div>
            
            <div className="p-6 md:p-10 overflow-y-auto space-y-10">
              {/* Image / Video Header */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl border border-blue-100 dark:border-slate-800">
                  {selectedProject.videoUrl ? (
                    <iframe
                      src={getEmbedUrl(selectedProject.videoUrl) || ""}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  ) : (
                    <Image
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-3xl md:text-4xl font-black text-blue-950 dark:text-white leading-tight">
                    {selectedProject.title}
                  </h3>
                  <div className="inline-flex px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-black text-sm uppercase tracking-widest">
                    Exploration Interactive
                  </div>
                  
                  {/* Liquid Progress Bar */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-black text-blue-900/40 dark:text-slate-500 uppercase tracking-widest">Avancement</span>
                      <span className="text-xl font-black text-blue-600">{selectedProject.completionLevel || 0}%</span>
                    </div>
                    <div className="relative h-4 w-full bg-blue-50 dark:bg-slate-800 rounded-full overflow-hidden border border-blue-100 dark:border-slate-700">
                      <div 
                        className="absolute inset-0 bg-linear-to-r from-blue-600 to-indigo-500 transition-all duration-1000 ease-out"
                        style={{ width: `${selectedProject.completionLevel || 0}%` }}
                      >
                        {/* Liquid Wave Effect */}
                        <div className="absolute inset-0 opacity-30">
                          <div className="absolute inset-0 animate-wave bg-[url('https://raw.githubusercontent.com/Anmol-Baranwal/Cool-CSS-Animations/main/Wave%20Animation/wave.png')] bg-repeat-x bg-contain" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-lg text-blue-900/60 dark:text-slate-400 font-bold leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>
              </div>

              {/* Exploration Table */}
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
                        <td className="px-6 py-5 text-blue-900/60 dark:text-slate-400 font-bold">{selectedProject.title}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-5 font-black text-blue-950 dark:text-white flex items-center space-x-3">
                          <Globe size={18} className="text-blue-600" />
                          <span>Lien direct</span>
                        </td>
                        <td className="px-6 py-5">
                          <a 
                            href={selectedProject.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-black inline-flex items-center space-x-2"
                          >
                            <span>Visiter le site</span>
                            <ExternalLink size={14} />
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-5 font-black text-blue-950 dark:text-white flex items-center space-x-3">
                          {selectedProject.status === "online" ? (
                            <Server size={18} className="text-green-500" />
                          ) : (
                            <Monitor size={18} className="text-orange-500" />
                          )}
                          <span>Environnement</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${
                            selectedProject.status === "online" 
                              ? "bg-green-50 dark:bg-green-900/20 text-green-600" 
                              : "bg-orange-50 dark:bg-orange-900/20 text-orange-600"
                          }`}>
                            <div className={`w-2 h-2 rounded-full animate-pulse ${
                              selectedProject.status === "online" ? "bg-green-500" : "bg-orange-500"
                            }`} />
                            <span>{selectedProject.status === "online" ? "En ligne" : "Local / Dev"}</span>
                          </div>
                        </td>
                      </tr>
                      {selectedProject.videoUrl && (
                        <tr>
                          <td className="px-6 py-5 font-black text-blue-950 dark:text-white flex items-center space-x-3">
                            <Play size={18} className="text-blue-600" />
                            <span>Démo Vidéo</span>
                          </td>
                          <td className="px-6 py-5">
                            <a 
                              href={selectedProject.videoUrl} 
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
                            {selectedProject.technologies && selectedProject.technologies.length > 0 ? (
                              selectedProject.technologies.map((tech, index) => (
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <a
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-3 bg-blue-600 text-white px-8 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-200 dark:shadow-none"
                >
                  <span>Lancer le Projet</span>
                  <Rocket size={20} />
                </a>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="flex-1 flex items-center justify-center space-x-3 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 px-8 py-5 rounded-2xl font-black text-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
                >
                  <span>Fermer l&apos;exploration</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {filteredProjects.length === 0 && (
        <div className="text-center py-32 space-y-8 animate-in zoom-in-95 duration-500">
          <div className="inline-flex p-10 bg-blue-50 dark:bg-slate-800 rounded-full text-blue-200 dark:text-slate-700 shadow-inner">
            <Search size={64} />
          </div>
          <div className="space-y-2">
            <p className="text-3xl font-black text-blue-950 dark:text-white tracking-tight">
              Aucun projet trouvé
            </p>
            <p className="text-blue-900/60 dark:text-slate-400 font-bold text-lg">
              Essayez avec d&apos;autres mots-clés ou technologies.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
