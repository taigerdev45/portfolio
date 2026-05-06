"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Rocket } from "lucide-react";
import { Project, Settings, Feature, Skill, trackClick, trackVisit, getSettings, getProjects, getFeatures, getSkills } from "@/lib/services";
import Hero from "./Hero";
import Features from "./Features";
import ProjectsPreview from "./ProjectsPreview";

const SkillsCarousel = dynamic(() => import("./SkillsCarousel"), {
  ssr: false,
  loading: () => <div className="h-32 bg-blue-50/50 dark:bg-slate-900/50 animate-pulse rounded-[3rem] mx-4 md:mx-8" />
});

const ProjectModal = dynamic(() => import("./ProjectModal"), {
  ssr: false
});

interface HomeContentProps {
  settings: Settings | null;
  projects: Project[];
  features: Feature[];
  skills: Skill[];
}

export default function HomeContent({ 
  settings: initialSettings, 
  projects: initialProjects, 
  features: initialFeatures, 
  skills: initialSkills 
}: HomeContentProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [settings, setSettings] = useState<Settings | null>(initialSettings);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [skills, setSkills] = useState<Skill[]>(initialSkills);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    trackVisit().catch(console.error);
    
    const fetchFreshData = async () => {
      setIsRefreshing(true);
      try {
        const [s, p, f, sk] = await Promise.all([
          getSettings(),
          getProjects(),
          getFeatures(),
          getSkills()
        ]);
        setSettings(s);
        setProjects(p);
        setFeatures(f);
        setSkills(sk);
      } catch (error) {
        console.error("Error fetching fresh data:", error);
      } finally {
        setIsRefreshing(false);
      }
    };
    
    fetchFreshData();
  }, []);

  const handleProjectClick = async (project: Project) => {
    setSelectedProject(project);
    if (project.id) {
      await trackClick(project.id);
    }
  };

  return (
    <div className={`space-y-32 pb-32 transition-opacity duration-500 ${isRefreshing ? "opacity-80" : "opacity-100"}`}>
      <Hero settings={settings} />
      <Features features={features} />
      <SkillsCarousel skills={skills} />
      <ProjectsPreview 
        projects={projects.slice(0, 3)} 
        onProjectClick={handleProjectClick} 
      />
      
      {/* Bottom Caricature Section - Invitation au Projet */}
      <section className="relative py-32 overflow-hidden bg-blue-50/30 dark:bg-blue-900/5 rounded-[3rem] md:rounded-[5rem] mx-4 md:mx-8">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
        
        <div className="max-w-4xl mx-auto px-4 text-center space-y-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative w-56 h-56 md:w-80 md:h-80 mx-auto group"
          >
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full cursor-pointer"
            >
              <Image
                src="/avatar prejet.png"
                alt="3D Avatar Bottom"
                fill
                className="object-contain drop-shadow-[0_20px_60px_rgba(37,99,235,0.5)] group-hover:scale-110 transition-transform duration-700"
                priority
              />
            </motion.div>
            
            {/* Decorative circles */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-7xl font-black text-slate-950 dark:text-white tracking-tight leading-none">
              Envie de <span className="text-gradient">concrétiser</span> votre idée ?
            </h2>
            <p className="text-xl md:text-2xl text-blue-900/60 dark:text-slate-400 font-bold max-w-2xl mx-auto leading-relaxed">
              Transformons vos concepts en expériences numériques d&apos;exception.
            </p>
            <div className="pt-8">
              <a 
                href="/contact" 
                className="inline-flex items-center space-x-4 bg-blue-600 text-white px-10 py-5 rounded-3xl font-black text-xl hover:bg-blue-700 hover:scale-[1.05] active:scale-95 transition-all shadow-2xl shadow-blue-300 dark:shadow-none"
              >
                <span>Démarrer l&apos;aventure</span>
                <Rocket size={24} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
}
