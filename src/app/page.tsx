"use client";

import { useEffect, useState } from "react";
import { getSettings, getProjects, Project, Settings, trackVisit, getFeatures, Feature, trackClick } from "@/lib/services";
import { ArrowRight, ExternalLink, Code2, Rocket, Layout, Sparkles, LucideIcon, X, Play, Globe, Info, Search, Server, Monitor } from "lucide-react";

// Mapping des icônes Lucide
const IconMap: Record<string, LucideIcon> = {
  Code2,
  Layout,
  Rocket,
  Sparkles
};
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, p, f] = await Promise.all([getSettings(), getProjects(), getFeatures()]);
        setSettings(s);
        setFeaturedProjects(p.slice(0, 3));
        setFeatures(f);
        await trackVisit();
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  if (loading) return null;

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 md:py-0">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 -left-20 w-64 h-64 md:w-96 md:h-96 bg-blue-500/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-20 w-64 h-64 md:w-96 md:h-96 bg-purple-500/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[24px_24px] md:bg-size-[32px_32px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 md:space-y-10">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs md:text-sm font-bold border border-blue-100 dark:border-blue-800 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>Disponible pour de nouveaux projets</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.1] md:leading-tight">
              <span className="block text-gray-900 dark:text-white">
                {settings?.heroTitle?.split(' ').slice(0, -1).join(' ')}
              </span>
              <span className="text-gradient block sm:inline">
                {settings?.heroTitle?.split(' ').slice(-1)}
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium px-4">
              {settings?.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-6 px-4">
              <Link
                href="/projects"
                className="w-full sm:w-auto group relative px-8 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gray-200 dark:shadow-none text-center"
              >
                <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center justify-center space-x-2">
                  <span>Explorer mes travaux</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-100 dark:border-gray-800 rounded-2xl font-black hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm text-center"
              >
                Me contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, i) => {
            const IconComponent = IconMap[feature.icon] || Code2;
            return (
              <div 
                key={feature.id || i}
                className="group p-8 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] hover:shadow-2xl hover:shadow-gray-200/50 dark:hover:shadow-none transition-all duration-500 md:hover:-translate-y-2"
              >
                <div className={`p-4 bg-${feature.color}-50 dark:bg-${feature.color}-900/20 text-${feature.color}-600 dark:text-${feature.color}-400 w-fit rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <IconComponent size={32} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Projects Preview */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <div key={project.id} className="group bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={project.image || "/placeholder.png"} 
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  unoptimized
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
                    onClick={() => handleProjectClick(project)}
                    className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white transform scale-90 group-hover:scale-100 transition-transform duration-500"
                  >
                    <Search size={32} />
                  </button>
                </div>
              </div>
              <div className="p-8 space-y-4 grow flex flex-col">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors tracking-tight">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-lg font-medium leading-relaxed">
                  {project.description}
                </p>
                <div className="pt-4 mt-auto">
                  <button 
                    onClick={() => handleProjectClick(project)}
                    className="inline-flex items-center space-x-2 text-blue-600 font-black hover:space-x-3 transition-all uppercase text-sm tracking-widest"
                  >
                    <span>Explorer</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

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
    </div>
  );
}
