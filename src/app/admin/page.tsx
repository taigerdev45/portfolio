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
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";
import { Users, BarChart3, Globe, Zap, TrendingUp, Timer } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [projects, setProjects] = useState<Array<Project>>([]);
  const [analytics, setAnalytics] = useState<Array<AnalyticsEvent>>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
          <div className="absolute inset-0 border-4 border-sky-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-sky-400 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-sky-900/60 font-black uppercase tracking-widest text-[10px] animate-pulse">Synchronisation live...</p>
      </div>
    );
  }



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

  // Data processing for Hours (Curve)
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

  // Engagement Points (Scatter)
  const scatterData = analytics.slice(0, 50).map((event, _) => ({
    x: event.hour,
    y: event.duration || 0,
    z: 1,
    name: event.path
  }));

  // Gauge Data (Radial)
  const targetVisits = 1000;
  const currentVisits = stats?.visits || 0;
  const gaugeData = [
    { name: 'Visites', value: (currentVisits / targetVisits) * 100, fill: '#0ea5e9' }
  ];

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
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-950 dark:text-white tracking-tighter uppercase italic leading-none">Intelligence</h1>
          <p className="text-sky-400 font-black uppercase tracking-[0.3em] text-[10px] mt-2 ml-1">Analyse prédictive & Temps réel</p>
        </div>
        <div className="flex items-center space-x-3 bg-white/80 dark:bg-slate-900 px-6 py-3 rounded-full border border-sky-100 dark:border-slate-800 shadow-sm shadow-sky-500/5">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </div>
          <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <Users size={18} />, label: "Audience", value: stats?.visits || 0, color: "sky" },
          { icon: <Timer size={18} />, label: "Session", value: formatDuration(avgDuration), color: "sky" },
          { icon: <Zap size={18} />, label: "Activité", value: "Live", color: "sky" },
          { icon: <TrendingUp size={18} />, label: "Projets", value: projects.length, color: "sky" }
        ].map((item, i) => (
          <div key={i} className="bg-white/90 dark:bg-slate-900 p-5 rounded-[2rem] border border-sky-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-500 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-sky-50 dark:bg-sky-900/30 text-sky-500 rounded-xl group-hover:rotate-12 transition-transform">{item.icon}</div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
            </div>
            <p className="text-2xl font-black text-slate-950 dark:text-white leading-none">{item.value}</p>
          </div>
        ))}
      </div>

      {/* UNIFIED HUB TABLEAU */}
      <div className="bg-white/95 dark:bg-slate-950 p-6 md:p-10 rounded-[3rem] border border-sky-100 dark:border-slate-800 shadow-2xl shadow-sky-500/5 overflow-hidden">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tighter">Hub Statistique Unifié</h2>
            <p className="text-sky-400 font-black uppercase tracking-widest text-[10px] mt-1">Multi-visualisation synchronisée</p>
          </div>
          <div className="hidden md:flex space-x-2">
            <div className="w-8 h-8 bg-sky-50 dark:bg-slate-900 rounded-lg border border-sky-100 dark:border-slate-800" />
            <div className="w-8 h-8 bg-sky-100 dark:bg-slate-800 rounded-lg" />
            <div className="w-8 h-8 bg-sky-400 rounded-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Curve Chart (Evolution) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3 border-l-4 border-sky-400 pl-4">
              <h3 className="font-black text-slate-950 dark:text-white uppercase text-xs tracking-[0.2em]">Flux d&apos;activité (Courbe)</h3>
            </div>
            <div className="h-72 w-full bg-slate-50/50 dark:bg-slate-900/30 rounded-[2.5rem] p-6 border border-sky-50/50 dark:border-slate-800/50">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorCount)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gauge Chart (Performance) */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 border-l-4 border-sky-400 pl-4">
              <h3 className="font-black text-slate-950 dark:text-white uppercase text-xs tracking-[0.2em]">Score Engagement (Jauge)</h3>
            </div>
            <div className="h-72 w-full flex flex-col items-center justify-center bg-sky-50/30 dark:bg-sky-900/10 rounded-[2.5rem] p-6 border border-sky-100/50 dark:border-sky-900/20">
              <div className="relative w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gaugeData}
                      cx="50%"
                      cy="80%"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      <Cell fill="#0ea5e9" />
                      <Cell fill="#f1f5f9" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-20">
                  <span className="text-4xl font-black text-slate-950 dark:text-white">{Math.round(gaugeData[0].value)}%</span>
                  <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest">Objectif atteint</span>
                </div>
              </div>
            </div>
          </div>

          {/* Points Chart (Engagement Heatmap) */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 border-l-4 border-sky-400 pl-4">
              <h3 className="font-black text-slate-950 dark:text-white uppercase text-xs tracking-[0.2em]">Densité Sessions (Points)</h3>
            </div>
            <div className="h-64 w-full bg-slate-50/50 dark:bg-slate-900/30 rounded-[2.5rem] p-4 border border-sky-50/50 dark:border-slate-800/50">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                  <XAxis type="number" dataKey="x" name="Heure" unit="h" axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 900 }} />
                  <YAxis type="number" dataKey="y" name="Durée" unit="s" axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 900 }} />
                  <ZAxis type="number" dataKey="z" range={[50, 400]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Sessions" data={scatterData} fill="#0ea5e9" shape="circle" fillOpacity={0.6} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Details Table Integrated */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-l-4 border-sky-400 pl-4">
              <h3 className="font-black text-slate-950 dark:text-white uppercase text-xs tracking-[0.2em]">Top Clics Projets</h3>
              <BarChart3 size={16} className="text-sky-500" />
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectClickData} layout="vertical" margin={{ left: 40 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b' }} width={80} />
                  <Tooltip 
                     cursor={{fill: 'transparent'}}
                     contentStyle={{ borderRadius: '16px', border: 'none' }}
                  />
                  <Bar dataKey="clicks" fill="#0ea5e9" radius={[0, 10, 10, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      {/* Geographical Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white/90 dark:bg-slate-900 p-8 rounded-[3rem] border border-sky-100 dark:border-slate-800">
           <h3 className="font-black text-slate-950 dark:text-white uppercase text-xs tracking-[0.2em] mb-6 border-l-4 border-sky-400 pl-4">Origines Mondiales</h3>
           <div className="space-y-4">
              {countryData.map((country, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-sky-50/50 dark:bg-slate-800/50 rounded-2xl border border-sky-100/50 dark:border-slate-700/50 group hover:bg-sky-400 transition-colors duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-900 rounded-lg text-[10px] font-black group-hover:text-sky-500">{idx+1}</div>
                    <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-white uppercase">{country.name}</span>
                  </div>
                  <span className="text-sm font-black text-sky-500 group-hover:text-white">{country.value}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-2 bg-slate-950 p-1 rounded-[3rem] shadow-2xl shadow-sky-500/10 overflow-hidden">
           <div className="bg-white dark:bg-slate-900 m-1 rounded-[2.8rem] p-8 md:p-10 h-full">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="font-black text-slate-950 dark:text-white uppercase text-sm tracking-[0.2em]">Matrice d&apos;Engagement</h3>
                 <Globe size={20} className="text-sky-500" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {analytics.slice(0, 8).map((e, i) => (
                   <div key={i} className="p-4 border border-sky-50 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 hover:border-sky-400 transition-colors">
                      <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter truncate w-full">{e.path}</p>
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate w-full">{e.city}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
