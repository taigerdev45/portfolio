"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
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
      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
}
