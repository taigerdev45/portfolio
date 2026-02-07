"use client";

import { useEffect, useState } from "react";
import { getStats, getProjects, Project, Stats } from "@/lib/services";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, Eye, MousePointer2, Briefcase, BarChart3, PieChart as PieIcon } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const [s, p] = await Promise.all([getStats(), getProjects()]);
        setStats(s);
        setProjects(p);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-blue-900/60 font-bold animate-pulse">Chargement du tableau de bord...</p>
      </div>
    );
  }

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  const projectClickData = projects.map((p) => ({
    name: p.title,
    clicks: p.clicks || 0,
  }));

  const totalClicks = projects.reduce((acc, p) => acc + (p.clicks || 0), 0);

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-white tracking-tight uppercase">Dashboard</h1>
          <p className="text-slate-700 dark:text-slate-300 mt-1 md:mt-2 font-bold text-sm md:text-base">Analyse des performances de votre portfolio</p>
        </div>
        <div className="text-[10px] md:text-sm font-black px-4 md:px-5 py-2 md:py-2.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-200 rounded-full border border-indigo-200 dark:border-indigo-700 shadow-sm">
          Mise à jour: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { icon: <Users size={24} />, label: "Visiteurs", value: stats?.visits || 0, color: "indigo" },
          { icon: <Eye size={24} />, label: "Vues", value: stats?.pageViews || 0, color: "emerald" },
          { icon: <MousePointer2 size={24} />, label: "Clics", value: totalClicks, color: "amber" },
          { icon: <Briefcase size={24} />, label: "Projets", value: projects.length, color: "violet" }
        ].map((item, i) => (
          <div key={i} className="group bg-white/80 backdrop-blur-sm dark:bg-slate-900 p-6 md:p-8 rounded-3xl md:rounded-4xl shadow-sm border border-blue-100 dark:border-slate-800 flex items-center space-x-4 md:space-x-6 hover:shadow-2xl hover:border-blue-300 dark:hover:border-indigo-700 transition-all duration-500">
            <div className={`p-3 md:p-4 bg-${item.color}-100/50 dark:bg-${item.color}-900/30 text-${item.color}-700 dark:text-${item.color}-300 rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
              {item.icon}
            </div>
            <div>
              <p className="text-[10px] md:text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">{item.label}</p>
              <p className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white mt-0.5 md:mt-1">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Project Clicks Bar Chart */}
        <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900 p-6 md:p-8 rounded-3xl md:rounded-4xl shadow-sm border border-blue-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <h3 className="text-lg md:text-xl font-black text-slate-950 dark:text-white uppercase tracking-tight">Clics / Projet</h3>
            <div className="p-2 bg-blue-50 dark:bg-slate-800 rounded-xl">
              <BarChart3 size={20} className="text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <div className="h-64 md:h-80 w-full min-w-0">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectClickData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbeafe" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#1e3a8a', fontWeight: 900, fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#1e3a8a', fontWeight: 900, fontSize: 10 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#eff6ff' }}
                    contentStyle={{ 
                      borderRadius: '20px', 
                      border: '1px solid #dbeafe', 
                      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)',
                      padding: '12px 16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      color: '#1e3a8a',
                      fontWeight: '900',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="clicks" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Clics Distribution Pie Chart */}
        <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900 p-6 md:p-8 rounded-3xl md:rounded-4xl shadow-sm border border-blue-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8 md:mb-10">
            <h3 className="text-lg md:text-xl font-black text-slate-950 dark:text-white uppercase tracking-tight">Répartition</h3>
            <div className="p-2 bg-blue-50 dark:bg-slate-800 rounded-xl">
              <PieIcon size={20} className="text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <div className="h-64 md:h-80 w-full min-w-0">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectClickData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={8}
                    dataKey="clicks"
                  >
                    {projectClickData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '20px', 
                      border: '1px solid #dbeafe', 
                      boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)',
                      padding: '12px 16px',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      color: '#1e3a8a',
                      fontWeight: '900',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4 md:mt-6">
            {projectClickData.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 rounded-xl md:rounded-2xl hover:bg-blue-50 dark:hover:bg-slate-800/80 transition-all border border-transparent hover:border-blue-100 dark:hover:border-slate-700">
                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-[10px] md:text-xs font-black text-blue-900 dark:text-slate-200 truncate uppercase tracking-tight">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
