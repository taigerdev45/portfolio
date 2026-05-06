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

// Cache implementation
const cache: Record<string, { data: unknown; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedData = <T>(key: string): T | null => {
  const item = cache[key];
  if (item && Date.now() - item.timestamp < CACHE_DURATION) {
    return item.data as T;
  }
  return null;
};

const setCachedData = (key: string, data: unknown) => {
  cache[key] = { data, timestamp: Date.now() };
};

export const clearCache = (key?: string) => {
  if (key) {
    delete cache[key];
  } else {
    Object.keys(cache).forEach(k => delete cache[k]);
  }
};

// Interfaces
export interface Project {
  id?: string;
  title: string;
  description: string;
  link: string;
  image: string; // base64
  videoUrl?: string; // URL de la vidéo (YouTube, Vimeo, etc.)
  githubUrl?: string; // Lien GitHub du projet
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
  const cached = getCachedData<Project[]>("projects");
  if (cached) return cached;

  const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Project[];
  
  setCachedData("projects", data);
  return data;
};

export const addProject = async (project: Omit<Project, "id" | "clicks">) => {
  clearCache("projects");
  return await addDoc(collection(db, "projects"), {
    ...project,
    clicks: 0,
    createdAt: serverTimestamp(),
  });
};

export const updateProject = async (id: string, project: Partial<Project>) => {
  clearCache("projects");
  const docRef = doc(db, "projects", id);
  return await updateDoc(docRef, project);
};

export const deleteProject = async (id: string) => {
  clearCache("projects");
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
  brevoApiKey?: string;
}

export interface Feature {
  id?: string;
  title: string;
  description: string;
  icon: string; // Nom de l'icône Lucide
  color: string;
  order: number;
}

export interface Skill {
  id?: string;
  name: string;
  icon: string; // base64 ou URL de l'image
  category?: string;
  order: number;
}

export const getSettings = async (): Promise<Settings> => {
  const cached = getCachedData<Settings>("settings");
  if (cached) return cached;

  const settingsRef = doc(db, "settings", "general");
  const settingsDoc = await getDoc(settingsRef);
  let data: Settings;
  
  if (settingsDoc.exists()) {
    const docData = settingsDoc.data();
    data = {
      heroTitle: docData.heroTitle || "",
      heroSubtitle: docData.heroSubtitle || "",
      aboutText: docData.aboutText || "",
      contactEmail: docData.contactEmail || "",
      githubUrl: docData.githubUrl || "",
      linkedinUrl: docData.linkedinUrl || "",
      brevoApiKey: docData.brevoApiKey || "",
    } as Settings;
  } else {
    data = {
      heroTitle: "Bienvenue sur mon Portfolio",
      heroSubtitle: "Développeur Fullstack & Passionné",
      aboutText: "Je crée des solutions web modernes et performantes.",
      contactEmail: "votre@email.com",
      githubUrl: "",
      linkedinUrl: "",
    };
  }

  setCachedData("settings", data);
  return data;
};

// Features Services
export const getFeatures = async (): Promise<Feature[]> => {
  const cached = getCachedData<Feature[]>("features");
  if (cached) return cached;

  const q = query(collection(db, "features"), orderBy("order", "asc"));
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Feature[];

  setCachedData("features", data);
  return data;
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

// Skills Services
export const getSkills = async (): Promise<Skill[]> => {
  const cached = getCachedData<Skill[]>("skills");
  if (cached) return cached;

  const q = query(collection(db, "skills"), orderBy("order", "asc"));
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Skill[];

  setCachedData("skills", data);
  return data;
};

export const addSkill = async (skill: Omit<Skill, "id">) => {
  return await addDoc(collection(db, "skills"), skill);
};

export const updateSkill = async (id: string, skill: Partial<Skill>) => {
  const docRef = doc(db, "skills", id);
  return await updateDoc(docRef, skill);
};

export const deleteSkill = async (id: string) => {
  const docRef = doc(db, "skills", id);
  return await deleteDoc(docRef);
};

export const updateSettings = async (settings: Partial<Settings>) => {
  clearCache("settings");
  const settingsRef = doc(db, "settings", "general");
  const settingsDoc = await getDoc(settingsRef);
  if (!settingsDoc.exists()) {
    await setDoc(settingsRef, settings);
  } else {
    await updateDoc(settingsRef, settings);
  }
};
