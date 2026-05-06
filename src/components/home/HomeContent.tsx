"use client";

import { useState, useEffect } from "react";
import { Project, Settings, Feature, Skill, trackClick, trackVisit, getSettings, getProjects, getFeatures, getSkills } from "@/lib/services";
import Hero from "./Hero";
import Features from "./Features";
import SkillsCarousel from "./SkillsCarousel";
import ProjectsPreview from "./ProjectsPreview";
import ProjectModal from "./ProjectModal";

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

  useEffect(() => {
    trackVisit().catch(console.error);
    
    // Fetch fresh data on the client to handle static export limitations
    const fetchFreshData = async () => {
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
    <div className="space-y-32 pb-32">
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
