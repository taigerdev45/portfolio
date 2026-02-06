"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
  Project,
} from "@/lib/services";
import { Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import Image from "next/image";

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [completionLevel, setCompletionLevel] = useState(100);
  const [status, setStatus] = useState<"online" | "local">("online");
  const [image, setImage] = useState("");

  const fetchProjects = useCallback(async () => {
    const p = await getProjects();
    setProjects(p);
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      const p = await getProjects();
      if (isMounted) {
        setProjects(p);
        setLoading(false);
      }
    };

    loadData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier avant traitement (max 5Mo pour la source)
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image est trop lourde (max 5Mo). Elle sera compressée.");
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new window.Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compression en JPEG avec qualité 0.7 pour rester sous 1Mo
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setImage(compressedBase64);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = technologies.split(",").map(t => t.trim()).filter(t => t !== "");
    const projectData = { 
      title, 
      description, 
      link, 
      videoUrl, 
      githubUrl,
      image,
      technologies: techArray,
      completionLevel: Number(completionLevel),
      status
    };

    try {
      if (editingProject?.id) {
        await updateProject(editingProject.id, projectData);
      } else {
        await addProject(projectData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setLink(project.link);
    setVideoUrl(project.videoUrl || "");
    setGithubUrl(project.githubUrl || "");
    setTechnologies(project.technologies?.join(", ") || "");
    setCompletionLevel(project.completionLevel || 100);
    setStatus(project.status || "online");
    setImage(project.image);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      await deleteProject(id);
      fetchProjects();
    }
  };

  const resetForm = () => {
    setEditingProject(null);
    setTitle("");
    setDescription("");
    setLink("");
    setVideoUrl("");
    setGithubUrl("");
    setTechnologies("");
    setCompletionLevel(100);
    setStatus("online");
    setImage("");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-blue-900/40 font-black uppercase tracking-widest text-sm">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-blue-950 dark:text-white tracking-tight uppercase">Projets</h1>
          <p className="text-blue-900/60 dark:text-slate-400 mt-1 md:mt-2 font-bold text-sm md:text-base">Gérez les travaux affichés sur votre portfolio</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="w-full md:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 md:py-3 rounded-xl md:rounded-2xl font-black transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <Plus size={20} />
          <span>Nouveau Projet</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group bg-white/80 backdrop-blur-sm dark:bg-slate-900 rounded-4xl md:rounded-4xl border border-blue-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-300 transition-all duration-500"
          >
            <div className="relative h-48 md:h-52 w-full overflow-hidden">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center">
                  <Briefcase className="text-blue-200" size={48} />
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-blue-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="p-6 md:p-8">
              <h3 className="text-lg md:text-xl font-black text-blue-950 dark:text-white mb-2 md:mb-3 line-clamp-1">
                {project.title}
              </h3>
              <p className="text-blue-900/60 dark:text-slate-400 text-xs md:text-sm font-bold line-clamp-2 mb-4 md:mb-6 leading-relaxed">
                {project.description}
              </p>
              <div className="flex justify-between items-center pt-4 md:pt-6 border-t border-blue-50 dark:border-slate-800">
                <button
                  onClick={() => handleEdit(project)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-black text-xs md:text-sm uppercase tracking-wider transition-colors"
                >
                  <Pencil size={16} />
                  <span>Modifier</span>
                </button>
                <button
                  onClick={() => project.id && handleDelete(project.id)}
                  className="flex items-center space-x-2 text-red-500 hover:text-red-600 font-black text-xs md:text-sm uppercase tracking-wider transition-colors"
                >
                  <Trash2 size={16} />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-60 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white dark:bg-slate-900 rounded-t-4xl md:rounded-4xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom md:slide-in-from-bottom-0 md:zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            <div className="p-6 md:p-8 border-b border-blue-50 dark:border-slate-800 flex justify-between items-center bg-blue-50/30 shrink-0">
              <h2 className="text-xl md:text-2xl font-black text-blue-950 dark:text-white uppercase tracking-tight">
                {editingProject ? "Modifier le projet" : "Nouveau Projet"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white rounded-xl transition-colors text-blue-900/40 hover:text-blue-600"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4 md:space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-blue-900/40 uppercase tracking-widest ml-1">Titre</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-blue-50/50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-200 dark:focus:border-blue-900 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-base md:text-lg text-blue-950 dark:text-white placeholder:text-blue-900/20"
                    placeholder="Nom du projet"
                  />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-blue-900/40 uppercase tracking-widest ml-1">Lien</label>
                  <input
                    type="url"
                    required
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-blue-50/50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-200 dark:focus:border-blue-900 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-base md:text-lg text-blue-950 dark:text-white placeholder:text-blue-900/20"
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-blue-900/40 uppercase tracking-widest ml-1">Lien Vidéo (Optionnel)</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-blue-50/50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-200 dark:focus:border-blue-900 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-base md:text-lg text-blue-950 dark:text-white placeholder:text-blue-900/20"
                    placeholder="https://youtube.com/..."
                  />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-blue-900/40 uppercase tracking-widest ml-1">Lien GitHub (Optionnel)</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-blue-50/50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-200 dark:focus:border-blue-900 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-base md:text-lg text-blue-950 dark:text-white placeholder:text-blue-900/20"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-blue-900/40 uppercase tracking-widest ml-1">Technologies (séparées par des virgules)</label>
                  <input
                    type="text"
                    value={technologies}
                    onChange={(e) => setTechnologies(e.target.value)}
                    className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-blue-50/50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-200 dark:focus:border-blue-900 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-base md:text-lg text-blue-950 dark:text-white placeholder:text-blue-900/20"
                    placeholder="React, Next.js, Tailwind..."
                  />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-blue-900/40 uppercase tracking-widest ml-1">Niveau de réalisation ({completionLevel}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={completionLevel}
                    onChange={(e) => setCompletionLevel(Number(e.target.value))}
                    className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-blue-900/40 uppercase tracking-widest ml-1">Statut du projet</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "online" | "local")}
                    className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-blue-50/50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-200 dark:focus:border-blue-900 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-base md:text-lg text-blue-950 dark:text-white"
                  >
                    <option value="online">En ligne</option>
                    <option value="local">Local</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[10px] md:text-xs font-black text-blue-900/40 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-blue-50/50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-200 dark:focus:border-blue-900 rounded-xl md:rounded-2xl outline-none transition-all font-bold text-base md:text-lg text-blue-950 dark:text-white placeholder:text-blue-900/20 min-h-[100px] md:min-h-[120px] resize-none"
                  placeholder="Décrivez votre projet..."
                />
              </div>
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[10px] md:text-xs font-black text-blue-900/40 uppercase tracking-widest ml-1">Image</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 md:h-40 border-4 border-dashed border-blue-100 dark:border-slate-800 rounded-2xl md:rounded-3xl cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-all bg-blue-50/30 hover:bg-blue-50/50"
                  >
                    {image ? (
                      <div className="relative w-full h-full p-2">
                        <Image src={image} alt="Preview" fill className="object-cover rounded-xl md:rounded-2xl" unoptimized />
                        <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl md:rounded-2xl">
                          <Upload className="text-white" size={32} />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-1 md:space-y-2">
                        <Upload className="text-blue-300 w-6 h-6 md:w-8 md:h-8" />
                        <span className="text-xs md:text-sm font-black text-blue-900/40 uppercase tracking-tighter">Cliquez pour uploader</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              <div className="pt-4 flex flex-col md:flex-row justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="order-2 md:order-1 px-8 py-4 border-2 border-blue-50 hover:bg-blue-50 rounded-xl md:rounded-2xl font-black text-blue-900/40 hover:text-blue-600 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="order-1 md:order-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl md:rounded-2xl font-black transition-all shadow-xl shadow-blue-200 active:scale-95"
                >
                  {editingProject ? "Mettre à jour" : "Créer le projet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

function Briefcase({ size = 24, ...props }: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
