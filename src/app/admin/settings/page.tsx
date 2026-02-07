"use client";

import { useEffect, useState } from "react";
import { getSettings, updateSettings, Settings, getFeatures, addFeature, updateFeature, deleteFeature, Feature } from "@/lib/services";
import { Save, CheckCircle, AlertCircle, Plus, Trash2, Code2, Layout, Rocket, Sparkles } from "lucide-react";

const ICON_OPTIONS = [
  { name: "Code2", icon: Code2 },
  { name: "Layout", icon: Layout },
  { name: "Rocket", icon: Rocket },
  { name: "Sparkles", icon: Sparkles },
];

const COLOR_OPTIONS = ["blue", "purple", "green", "indigo", "orange", "pink"];

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>({
    heroTitle: "",
    heroSubtitle: "",
    aboutText: "",
    contactEmail: "",
    githubUrl: "",
    linkedinUrl: "",
    brevoApiKey: "",
  });
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, f] = await Promise.all([getSettings(), getFeatures()]);
        setSettings(s);
        setFeatures(f);
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddFeature = () => {
    const newFeature: Feature = {
      title: "Nouvelle compétence",
      description: "Description de votre compétence...",
      icon: "Code2",
      color: "blue",
      order: features.length + 1,
    };
    setFeatures([...features, newFeature]);
  };

  const handleDeleteFeature = async (id?: string, index?: number) => {
    if (confirm("Supprimer cette carte ?")) {
      if (id) {
        await deleteFeature(id);
        setFeatures(features.filter(f => f.id !== id));
      } else if (index !== undefined) {
        setFeatures(features.filter((_, i) => i !== index));
      }
    }
  };

  const handleFeatureChange = (index: number, updates: Partial<Feature>) => {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], ...updates };
    setFeatures(newFeatures);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");
    
    try {
      console.log("Saving settings:", settings);
      console.log("Saving features:", features);

      // 1. Update general settings
      await updateSettings(settings);

      // 2. Process features
      for (const feature of features) {
        if (feature.id) {
          console.log("Updating feature:", feature.id);
          await updateFeature(feature.id, feature);
        } else {
          console.log("Adding new feature");
          const featureData = { ...feature };
          delete featureData.id;
          await addFeature(featureData);
        }
      }
      
      // 3. Refresh features and settings to ensure UI is in sync
      const [freshSettings, freshFeatures] = await Promise.all([
        getSettings(),
        getFeatures()
      ]);
      setSettings(freshSettings);
      setFeatures(freshFeatures);
      
      setStatus("success");
      
      // Force refresh of the page to update other components (Navbar/Footer)
      // This is necessary because they are layout components
      setTimeout(() => {
        setStatus("idle");
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Detailed error in handleSubmit:", error);
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-blue-900/60 font-bold animate-pulse">Chargement des paramètres...</p>
    </div>
  );

  return (
    <div className="max-w-4xl space-y-6 md:space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tight uppercase">Paramètres</h1>
        <p className="text-blue-900/60 dark:text-slate-400 mt-1 md:mt-2 font-bold text-sm md:text-base">Gérez les textes et les liens principaux de votre portfolio.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl dark:bg-slate-900 rounded-4xl md:rounded-4xl shadow-2xl shadow-blue-900/5 border border-blue-100 dark:border-slate-800 p-6 md:p-12 space-y-8 md:space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-lg md:text-xl font-black text-blue-950 dark:text-white flex items-center space-x-2">
              <span className="w-1.5 md:w-2 h-6 md:h-8 bg-blue-600 rounded-full block"></span>
              <span>Accueil</span>
            </h3>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-[10px] md:text-sm font-black text-blue-900/70 dark:text-slate-400 mb-1.5 md:mb-2 uppercase tracking-wider">Titre Hero</label>
                <input
                  type="text"
                  value={settings.heroTitle}
                  onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                  className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-blue-50/50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-base md:text-lg text-blue-950 dark:text-white"
                  placeholder="Ex: Développeur Fullstack"
                />
              </div>
              <div>
                <label className="block text-[10px] md:text-sm font-black text-blue-900/70 dark:text-slate-400 mb-1.5 md:mb-2 uppercase tracking-wider">Sous-titre Hero</label>
                <textarea
                  value={settings.heroSubtitle}
                  onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                  className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-blue-50/50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 h-24 md:h-32 font-bold text-base md:text-lg text-blue-950 dark:text-white resize-none"
                  placeholder="Décrivez brièvement ce que vous faites..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <h3 className="text-lg md:text-xl font-black text-blue-950 dark:text-white flex items-center space-x-2">
              <span className="w-1.5 md:w-2 h-6 md:h-8 bg-blue-600 rounded-full block"></span>
              <span>Contact & Réseaux</span>
            </h3>
            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-[10px] md:text-sm font-black text-blue-900/70 dark:text-slate-400 mb-1.5 md:mb-2 uppercase tracking-wider">Email de contact</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-blue-50/50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-base md:text-lg text-blue-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] md:text-sm font-black text-blue-900/70 dark:text-slate-400 mb-1.5 md:mb-2 uppercase tracking-wider">URL GitHub</label>
                <input
                  type="url"
                  value={settings.githubUrl}
                  onChange={(e) => setSettings({ ...settings, githubUrl: e.target.value })}
                  className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-blue-50/50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-base md:text-lg text-blue-950 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] md:text-sm font-black text-blue-900/70 dark:text-slate-400 mb-1.5 md:mb-2 uppercase tracking-wider">URL LinkedIn</label>
                <input
                  type="url"
                  value={settings.linkedinUrl}
                  onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                  className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-blue-50/50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-base md:text-lg text-blue-950 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6 border-t border-blue-100 dark:border-slate-800 pt-8">
          <h3 className="text-lg md:text-xl font-black text-blue-950 dark:text-white flex items-center space-x-2">
            <span className="w-1.5 md:w-2 h-6 md:h-8 bg-orange-600 rounded-full block"></span>
            <span>Configuration Brevo (Envoi de Mail)</span>
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-[10px] md:text-sm font-black text-blue-900/70 dark:text-slate-400 mb-1.5 md:mb-2 uppercase tracking-wider">Clé API Brevo (v3)</label>
              <input
                type="password"
                value={settings.brevoApiKey || ""}
                onChange={(e) => setSettings({ ...settings, brevoApiKey: e.target.value.trim() })}
                className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-blue-50/50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-base md:text-lg text-blue-950 dark:text-white"
                placeholder="xkeysib-..."
              />
              <p className="mt-2 text-[10px] md:text-xs text-blue-900/40 dark:text-slate-500 font-bold italic">
                * Utilisez la clé <strong>API v3</strong> de Brevo. Assurez-vous que l&apos;adresse email de contact ci-dessus est bien un <strong>expéditeur vérifié</strong> dans votre compte Brevo.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <h3 className="text-lg md:text-xl font-black text-blue-950 dark:text-white flex items-center space-x-2">
            <span className="w-1.5 md:w-2 h-6 md:h-8 bg-blue-600 rounded-full block"></span>
            <span>À Propos</span>
          </h3>
          <div>
            <label className="block text-[10px] md:text-sm font-black text-blue-900/70 dark:text-slate-400 mb-1.5 md:mb-2 uppercase tracking-wider">Texte de présentation</label>
            <textarea
              value={settings.aboutText}
              onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
              className="w-full px-5 md:px-6 py-3.5 md:py-4 bg-blue-50/50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 h-32 md:h-48 font-bold text-base md:text-lg text-blue-950 dark:text-white resize-none"
              placeholder="Racontez votre parcours..."
            />
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-black text-blue-950 dark:text-white flex items-center space-x-2">
              <span className="w-1.5 md:w-2 h-6 md:h-8 bg-blue-600 rounded-full block"></span>
              <span>Cartes Descriptives (Accueil)</span>
            </h3>
            <button
              type="button"
              onClick={handleAddFeature}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <Plus size={18} />
              <span className="hidden md:inline">Ajouter une carte</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.id || `feature-${index}`} 
                className="group relative space-y-4 p-6 bg-white dark:bg-slate-800/50 rounded-3xl border border-blue-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500/50 transition-all shadow-sm hover:shadow-xl hover:shadow-blue-500/5"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-black text-xs">
                      {index + 1}
                    </span>
                    <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Carte</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteFeature(feature.id, index)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-blue-900/70 dark:text-slate-400 mb-1 uppercase tracking-wider">Titre</label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(index, { title: e.target.value })}
                      className="w-full px-4 py-3 bg-blue-50/30 dark:bg-slate-900/50 border border-blue-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-sm text-blue-950 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-black text-blue-900/70 dark:text-slate-400 mb-1 uppercase tracking-wider">Description</label>
                    <textarea
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(index, { description: e.target.value })}
                      className="w-full px-4 py-3 bg-blue-50/30 dark:bg-slate-900/50 border border-blue-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all h-24 font-bold text-sm text-blue-950 dark:text-white resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-blue-900/70 dark:text-slate-400 mb-1 uppercase tracking-wider">Icône</label>
                      <select
                        value={feature.icon}
                        onChange={(e) => handleFeatureChange(index, { icon: e.target.value })}
                        className="w-full px-4 py-3 bg-blue-50/30 dark:bg-slate-900/50 border border-blue-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-sm text-blue-950 dark:text-white appearance-none"
                      >
                        {ICON_OPTIONS.map(opt => (
                          <option key={opt.name} value={opt.name}>{opt.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-blue-900/70 dark:text-slate-400 mb-1 uppercase tracking-wider">Couleur</label>
                      <select
                        value={feature.color}
                        onChange={(e) => handleFeatureChange(index, { color: e.target.value })}
                        className="w-full px-4 py-3 bg-blue-50/30 dark:bg-slate-900/50 border border-blue-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-sm text-blue-950 dark:text-white appearance-none"
                      >
                        {COLOR_OPTIONS.map(color => (
                          <option key={color} value={color}>{color.charAt(0).toUpperCase() + color.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 md:pt-10 border-t border-blue-100 dark:border-slate-800">
          <div className="flex items-center space-x-2 w-full md:w-auto">
            {status === "success" && (
              <div className="flex items-center justify-center space-x-2 bg-green-50 dark:bg-green-900/20 text-green-600 px-6 py-4 rounded-xl md:rounded-2xl font-bold animate-in zoom-in-95 duration-300 w-full md:w-auto">
                <CheckCircle size={20} />
                <span className="text-sm md:text-base">Enregistré avec succès !</span>
              </div>
            )}
            {status === "error" && (
              <div className="flex items-center justify-center space-x-2 bg-red-50 dark:bg-red-900/20 text-red-600 px-6 py-4 rounded-xl md:rounded-2xl font-bold animate-in zoom-in-95 duration-300 w-full md:w-auto">
                <AlertCircle size={20} />
                <span className="text-sm md:text-base">Erreur lors de l&apos;enregistrement.</span>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto bg-blue-600 text-white px-8 md:px-10 py-4.5 md:py-4 rounded-xl md:rounded-2xl font-black flex items-center justify-center space-x-3 hover:bg-blue-700 hover:scale-[1.02] md:hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl shadow-blue-200 dark:shadow-none disabled:opacity-50 disabled:hover:scale-100"
          >
            {saving ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={20} />
                <span>Enregistrer les modifications</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
