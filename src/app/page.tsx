import { getSettings, getProjects, getFeatures, getSkills } from "@/lib/services";
import HomeContent from "@/components/home/HomeContent";

export default async function Home() {
  // Fetch data on the server
  const [settings, projects, features, skills] = await Promise.all([
    getSettings(),
    getProjects(),
    getFeatures(),
    getSkills()
  ]);

  return (
    <HomeContent 
      settings={settings}
      projects={projects}
      features={features}
      skills={skills}
    />
  );
}
