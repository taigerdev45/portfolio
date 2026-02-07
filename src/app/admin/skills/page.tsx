"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  Skill,
} from "@/lib/services";
import { Plus, Pencil, Trash2, X, Upload, Award } from "lucide-react";
import Image from "next/image";

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [order, setOrder] = useState(0);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    const s = await getSkills();
    setSkills(s);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new window.Image();
        img.src = reader.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const SIZE = 128; // Icônes de 128x128 max
          canvas.width = SIZE;
          canvas.height = SIZE;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, SIZE, SIZE);
          const compressedBase64 = canvas.toDataURL('image/png', 0.8);
          setIcon(compressedBase64);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillData = {
      name,
      icon,
      order: Number(order),
    };

    if (editingSkill?.id) {
      await updateSkill(editingSkill.id, skillData);
    } else {
      await addSkill(skillData);
    }

    closeModal();
    fetchSkills();
  };

  const openModal = (skill: Skill | null = null) => {
    if (skill) {
      setEditingSkill(skill);
      setName(skill.name);
      setIcon(skill.icon);
      setOrder(skill.order);
    } else {
      setEditingSkill(null);
      setName("");
      setIcon("");
      setOrder(skills.length);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    setName("");
    setIcon("");
    setOrder(0);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer cette compétence ?")) {
      await deleteSkill(id);
      fetchSkills();
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none">
            <Award className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-blue-950 dark:text-white uppercase tracking-tight">Compétences</h1>
            <p className="text-sm font-bold text-blue-900/40 dark:text-slate-500 uppercase tracking-widest">Langages & Technologies</p>
          </div>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-black transition-all duration-300 shadow-xl shadow-blue-500/20 active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>AJOUTER</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-blue-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-500"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="relative w-16 h-16 bg-blue-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center p-3 group-hover:scale-110 transition-transform duration-500">
                  <Image
                    src={skill.icon}
                    alt={skill.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => openModal(skill)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id!)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-black text-blue-950 dark:text-white mb-1">{skill.name}</h3>
                <p className="text-xs font-bold text-blue-900/40 dark:text-slate-500 uppercase tracking-widest">Ordre : {skill.order}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-blue-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 md:p-8 flex justify-between items-center border-b border-blue-100 dark:border-slate-800">
              <h2 className="text-xl md:text-2xl font-black text-blue-950 dark:text-white uppercase tracking-tight">
                {editingSkill ? "Modifier Compétence" : "Nouvelle Compétence"}
              </h2>
              <button onClick={closeModal} className="p-2 text-blue-900/40 dark:text-slate-500 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              <div>
                <label className="block text-sm font-black text-blue-900/70 dark:text-slate-400 mb-2 uppercase tracking-widest">Nom de la compétence</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 bg-blue-50/50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-blue-950 dark:text-white"
                  placeholder="ex: React, Python, Docker..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black text-blue-900/70 dark:text-slate-400 mb-2 uppercase tracking-widest">Ordre d&apos;affichage</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full px-5 py-4 bg-blue-50/50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-blue-950 dark:text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-black text-blue-900/70 dark:text-slate-400 mb-2 uppercase tracking-widest">Icône / Logo</label>
                  <div className="relative group">
                    <input
                      type="file"
                      onChange={handleIconChange}
                      accept="image/*"
                      className="hidden"
                      id="icon-upload"
                    />
                    <label
                      htmlFor="icon-upload"
                      className="flex items-center justify-center w-full h-14 px-5 bg-blue-50/50 dark:bg-slate-800 border-2 border-dashed border-blue-200 dark:border-slate-700 rounded-2xl cursor-pointer hover:border-blue-500 transition-all duration-300"
                    >
                      {icon ? (
                        <div className="flex items-center space-x-3">
                          <Image src={icon} alt="Preview" width={32} height={32} className="rounded-lg object-contain" />
                          <span className="text-sm font-bold text-blue-600">Changer</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-blue-900/40 dark:text-slate-500">
                          <Upload size={20} />
                          <span className="text-sm font-bold uppercase tracking-widest">Choisir</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-xl shadow-blue-500/20 active:scale-[0.98] uppercase tracking-widest"
                >
                  {editingSkill ? "Mettre à jour" : "Créer la compétence"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
