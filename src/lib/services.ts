import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  increment,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// Interfaces
export interface Project {
  id?: string;
  title: string;
  description: string;
  link: string;
  image: string; // base64
  videoUrl?: string; // URL de la vidéo (YouTube, Vimeo, etc.)
  technologies?: string[]; // Technologies utilisées (ex: ["Next.js", "Tailwind"])
  completionLevel: number; // Niveau de réalisation (0-100)
  status: "online" | "local"; // Statut du projet
  clicks: number;
  createdAt?: unknown;
}

export interface Stats {
  visits: number;
  pageViews: number;
}

// Projects Services
export const getProjects = async (): Promise<Project[]> => {
  const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Project[];
};

export const addProject = async (project: Omit<Project, "id" | "clicks">) => {
  return await addDoc(collection(db, "projects"), {
    ...project,
    clicks: 0,
    createdAt: serverTimestamp(),
  });
};

export const updateProject = async (id: string, project: Partial<Project>) => {
  const docRef = doc(db, "projects", id);
  return await updateDoc(docRef, project);
};

export const deleteProject = async (id: string) => {
  const docRef = doc(db, "projects", id);
  return await deleteDoc(docRef);
};

export const trackClick = async (id: string) => {
  const docRef = doc(db, "projects", id);
  return await updateDoc(docRef, {
    clicks: increment(1),
  });
};

// Stats Services
export const trackVisit = async () => {
  const statsRef = doc(db, "stats", "global");
  const statsDoc = await getDoc(statsRef);

  if (!statsDoc.exists()) {
    await setDoc(statsRef, { visits: 1, pageViews: 1 });
  } else {
    await updateDoc(statsRef, {
      visits: increment(1),
      pageViews: increment(1),
    });
  }
};

export const trackPageView = async () => {
  const statsRef = doc(db, "stats", "global");
  await updateDoc(statsRef, {
    pageViews: increment(1),
  });
};

export const getStats = async (): Promise<Stats> => {
  const statsRef = doc(db, "stats", "global");
  const statsDoc = await getDoc(statsRef);
  if (statsDoc.exists()) {
    return statsDoc.data() as Stats;
  }
  return { visits: 0, pageViews: 0 };
};

// General Settings (Texts)
export interface Settings {
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  contactEmail: string;
  githubUrl: string;
  linkedinUrl: string;
}

export interface Feature {
  id?: string;
  title: string;
  description: string;
  icon: string; // Nom de l'icône Lucide
  color: string;
  order: number;
}

export const getSettings = async (): Promise<Settings> => {
  const settingsRef = doc(db, "settings", "general");
  const settingsDoc = await getDoc(settingsRef);
  if (settingsDoc.exists()) {
    const data = settingsDoc.data();
    return {
      heroTitle: data.heroTitle || "",
      heroSubtitle: data.heroSubtitle || "",
      aboutText: data.aboutText || "",
      contactEmail: data.contactEmail || "",
      githubUrl: data.githubUrl || "",
      linkedinUrl: data.linkedinUrl || "",
    } as Settings;
  }
  return {
    heroTitle: "Bienvenue sur mon Portfolio",
    heroSubtitle: "Développeur Fullstack & Passionné",
    aboutText: "Je crée des solutions web modernes et performantes.",
    contactEmail: "votre@email.com",
    githubUrl: "",
    linkedinUrl: "",
  };
};

// Features Services
export const getFeatures = async (): Promise<Feature[]> => {
  const q = query(collection(db, "features"), orderBy("order", "asc"));
  const querySnapshot = await getDocs(q);
  const features = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Feature[];

  if (features.length === 0) {
    // Données par défaut si vide
    return [
      { title: "Développement", description: "Expertise en React, Next.js et architectures web modernes.", icon: "Code2", color: "blue", order: 1 },
      { title: "Design UI/UX", description: "Création d'interfaces élégantes et intuitives.", icon: "Layout", color: "purple", order: 2 },
      { title: "Performance", description: "Optimisation avancée pour le SEO et la vitesse.", icon: "Rocket", color: "green", order: 3 },
    ];
  }
  return features;
};

export const addFeature = async (feature: Omit<Feature, "id">) => {
  return await addDoc(collection(db, "features"), feature);
};

export const updateFeature = async (id: string, feature: Partial<Feature>) => {
  const docRef = doc(db, "features", id);
  return await updateDoc(docRef, feature);
};

export const deleteFeature = async (id: string) => {
  const docRef = doc(db, "features", id);
  return await deleteDoc(docRef);
};

export const updateSettings = async (settings: Partial<Settings>) => {
  const settingsRef = doc(db, "settings", "general");
  const settingsDoc = await getDoc(settingsRef);
  if (!settingsDoc.exists()) {
    await setDoc(settingsRef, settings);
  } else {
    await updateDoc(settingsRef, settings);
  }
};
