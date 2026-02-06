"use client";

import { useEffect, useState } from "react";
import { getProjects, Project, trackPageView, trackClick } from "@/lib/services";
import { ExternalLink, Code2, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

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

  const handleProjectClick = async (id?: string) => {
    if (id) {
      await trackClick(id);
    }
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
              <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white transform scale-90 group-hover:scale-100 transition-transform duration-500">
                  <ExternalLink size={32} />
                </div>
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
                <Link 
                  href={project.link}
                  target="_blank"
                  onClick={() => handleProjectClick(project.id)}
                  className="inline-flex items-center justify-center space-x-3 w-full bg-blue-600 text-white px-6 md:px-8 py-4 md:py-5 rounded-2xl md:rounded-4xl font-black text-base md:text-lg hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-xl shadow-blue-200 dark:shadow-none"
                >
                  <span>Explorer le projet</span>
                  <ExternalLink size={20} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
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
