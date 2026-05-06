"use client";

import { useEffect, useState } from "react";
import { getProjects, subscribeToStats, subscribeToDetailedAnalytics, Project, Stats, AnalyticsEvent } from "@/lib/services";
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
  AreaChart,
  Area,
} from "recharts";
import { Users, Eye, Briefcase, BarChart3, Globe, Clock, Timer } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial projects fetch (static)
    const loadProjects = async () => {
      try {
        const p = await getProjects();
        setProjects(p);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    loadProjects();

    // 2. Real-time stats subscription
    const unsubscribeStats = subscribeToStats((s) => {
      setStats(s);
    });

    // 3. Real-time analytics subscription
    const unsubscribeAnalytics = subscribeToDetailedAnalytics((a) => {
      setAnalytics(a);
      setLoading(false);
    });

    return () => {
      unsubscribeStats();
      unsubscribeAnalytics();
    };
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

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

  // Data processing for Project Clicks
  const projectClickData = projects.map((p) => ({
    name: p.title,
    clicks: p.clicks || 0,
  }));

  // Data processing for Countries
  const countryMap: Record<string, number> = {};
  analytics.forEach(event => {
    countryMap[event.country] = (countryMap[event.country] || 0) + 1;
  });
  const countryData = Object.entries(countryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Data processing for Hours
  const hourMap: Record<number, number> = {};
  for (let i = 0; i < 24; i++) hourMap[i] = 0;
  analytics.forEach(event => {
    if (event.hour !== undefined) {
      hourMap[event.hour] = (hourMap[event.hour] || 0) + 1;
    }
  });
  const hourData = Object.entries(hourMap).map(([hour, count]) => ({
    hour: `${hour}h`,
    count,
  }));

  // Average session duration
  const sessions: Record<string, number[]> = {};
  analytics.forEach(event => {
    if (!sessions[event.sessionId]) sessions[event.sessionId] = [];
    let ts = Date.now();
    if (event.timestamp && typeof event.timestamp === 'object' && 'seconds' in event.timestamp) {
      ts = (event.timestamp as { seconds: number }).seconds * 1000;
    }
    sessions[event.sessionId].push(ts);
  });
  
  let totalDurationSum = 0;
  let sessionCount = 0;
  Object.values(sessions).forEach(times => {
    const sessionTimes = times as number[];
    if (sessionTimes.length > 1) {
      const duration = (Math.max(...sessionTimes) - Math.min(...sessionTimes)) / 1000; // in seconds
      totalDurationSum += duration;
      sessionCount++;
    }
  });
  const avgDuration = sessionCount > 0 ? Math.round(totalDurationSum / sessionCount) : 0;
  const formatDuration = (s: number) => {
    if (s < 60) return `${s}s`;
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  };

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
          { icon: <Timer size={24} />, label: "Session Moy.", value: formatDuration(avgDuration), color: "amber" },
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
        {/* Peak Hours Chart */}
        <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900 p-6 md:p-8 rounded-3xl md:rounded-4xl shadow-sm border border-blue-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg md:text-xl font-black text-slate-950 dark:text-white uppercase tracking-tight">Fréquence Horaire</h3>
            <div className="p-2 bg-blue-50 dark:bg-slate-800 rounded-xl">
              <Clock size={20} className="text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbeafe" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="count" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Country Distribution Pie Chart */}
        <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900 p-6 md:p-8 rounded-3xl md:rounded-4xl shadow-sm border border-blue-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg md:text-xl font-black text-slate-950 dark:text-white uppercase tracking-tight">Origine Géo</h3>
            <div className="p-2 bg-blue-50 dark:bg-slate-800 rounded-xl">
              <Globe size={20} className="text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={countryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {countryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {countryData.map((entry, index) => (
              <div key={index} className="flex items-center space-x-2 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700">
                <div 
                  className={`w-2 h-2 rounded-full bg-[${COLORS[index % COLORS.length]}]`}
                />
                <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Clicks Bar Chart */}
        <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-900 p-6 md:p-8 rounded-3xl md:rounded-4xl shadow-sm border border-blue-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg md:text-xl font-black text-slate-950 dark:text-white uppercase tracking-tight">Clics / Projet</h3>
            <div className="p-2 bg-blue-50 dark:bg-slate-800 rounded-xl">
              <BarChart3 size={20} className="text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectClickData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbeafe" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900 }} />
                <Tooltip />
                <Bar dataKey="clicks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cross-tabulation: Country vs Pages */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm dark:bg-slate-900 p-6 md:p-10 rounded-3xl md:rounded-[3rem] shadow-sm border border-blue-100 dark:border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tight">Analyse Croisée : Pays & Pages</h3>
              <p className="text-xs font-black text-sky-400 uppercase tracking-widest mt-1">Répartition détaillée de l&apos;engagement</p>
            </div>
            <div className="p-3 bg-sky-50 dark:bg-sky-900/20 rounded-2xl">
              <BarChart3 size={24} className="text-sky-500" />
            </div>
          </div>
          
          <div className="overflow-x-auto custom-scrollbar -mx-6 md:-mx-10 px-6 md:px-10">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-blue-50 dark:border-slate-800">Pays / Page</th>
                  {Object.keys(analytics.reduce((acc, e) => { acc[e.path] = true; return acc; }, {} as Record<string, boolean>))
                    .sort()
                    .slice(0, 4)
                    .map(path => (
                      <th key={path} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-blue-50 dark:border-slate-800 text-center">{path}</th>
                    ))
                  }
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-blue-50 dark:border-slate-800 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {countryData.map((country, idx) => {
                  const paths = Object.keys(analytics.reduce((acc, e) => { acc[e.path] = true; return acc; }, {} as Record<string, boolean>)).sort().slice(0, 4);
                  let countryTotal = 0;
                  
                  return (
                    <tr key={idx} className="group">
                      <td className="px-6 py-5 bg-slate-50/50 dark:bg-slate-800/30 rounded-l-2xl border-y border-l border-blue-50/50 dark:border-slate-800/50">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-8 bg-sky-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="font-black text-slate-900 dark:text-white uppercase text-xs">{country.name}</span>
                        </div>
                      </td>
                      {paths.map(path => {
                        const count = analytics.filter(e => e.country === country.name && e.path === path).length;
                        countryTotal += count;
                        return (
                          <td key={path} className="px-6 py-5 bg-white dark:bg-slate-900 border-y border-blue-50/50 dark:border-slate-800/50 text-center">
                            <span className={`text-sm font-black ${count > 0 ? 'text-sky-500' : 'text-slate-200 dark:text-slate-800'}`}>
                              {count}
                            </span>
                          </td>
                        );
                      })}
                      <td className="px-6 py-5 bg-sky-50/30 dark:bg-sky-900/10 rounded-r-2xl border-y border-r border-sky-100 dark:border-sky-900/50 text-right font-black text-sky-600">
                        {countryTotal}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
