"use client";

import { useEffect, useState } from "react";
import { getSettings, getProjects, Project, Settings, trackVisit, getFeatures, Feature } from "@/lib/services";
import { ArrowRight, ExternalLink, Code2, Rocket, Layout, Sparkles, LucideIcon } from "lucide-react";

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
                <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white">
                    <ExternalLink size={32} />
                  </div>
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
                  <Link 
                    href={project.link}
                    target="_blank"
                    className="inline-flex items-center space-x-2 text-blue-600 font-black hover:space-x-3 transition-all uppercase text-sm tracking-widest"
                  >
                    <span>Explorer</span>
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
