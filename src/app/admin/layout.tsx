"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, FolderKanban, LogOut, Home, Settings, Menu, X } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== "/admin/login" && pathname !== "/admin/login/") {
        router.push("/admin/login");
      } else if (user && user.email !== "taigermboumba@gmail.com" && pathname !== "/admin/login" && pathname !== "/admin/login/") {
        signOut(auth);
        router.push("/admin/login");
      }
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (pathname === "/admin/login" || pathname === "/admin/login/") {
    return <>{children}</>;
  }

  if (!user || user.email !== "taigermboumba@gmail.com") {
    return null;
  }

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  const navItems = [
    { href: "/admin", icon: <LayoutDashboard size={20} />, label: "Tableau de bord" },
    { href: "/admin/projects", icon: <FolderKanban size={20} />, label: "Projets" },
    { href: "/admin/settings", icon: <Settings size={20} />, label: "Paramètres" },
  ];

  return (
    <div className="min-h-screen bg-blue-50/30 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-white/80 backdrop-blur-xl border-b border-blue-100 dark:border-slate-800 p-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-lg font-black text-lg shadow-lg shadow-blue-200">
            A
          </div>
          <h2 className="text-lg font-black text-blue-950 dark:text-white tracking-tight uppercase">Admin</h2>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-blue-900/60 dark:text-slate-400"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-blue-950/40 backdrop-blur-sm z-55 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-60 h-full w-72 bg-white dark:bg-slate-900 border-r border-blue-100 dark:border-slate-800 flex flex-col transition-transform duration-300 md:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-8 hidden md:block">
          <div className="flex items-center space-x-3 group">
            <div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white w-10 h-10 flex items-center justify-center rounded-xl font-black text-xl shadow-lg shadow-blue-500/30 group-hover:rotate-6 transition-transform">
              A
            </div>
            <div>
              <h2 className="text-xl font-black text-blue-950 dark:text-white tracking-tight uppercase leading-none">Admin</h2>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Dashboard</span>
            </div>
          </div>
        </div>
        
        <div className="md:hidden p-8 flex justify-between items-center border-b border-blue-50 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="bg-linear-to-br from-blue-600 to-indigo-700 text-white w-10 h-10 flex items-center justify-center rounded-xl font-black text-xl shadow-lg shadow-blue-500/30">
              A
            </div>
            <h2 className="text-xl font-black text-blue-950 dark:text-white tracking-tight uppercase">Admin</h2>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <X size={24} className="text-blue-900/40" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 md:py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center space-x-3 p-4 rounded-xl font-bold transition-all duration-300 group ${
                pathname === item.href
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-500/30 translate-x-1"
                  : "text-blue-900/60 dark:text-slate-400 hover:bg-blue-50/50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white"
              }`}
            >
              <div className={`transition-transform duration-300 group-hover:scale-110 ${pathname === item.href ? "text-white" : ""}`}>
                {item.icon}
              </div>
              <span className="tracking-tight">{item.label}</span>
            </Link>
          ))}
          
          <div className="pt-6 mt-6 border-t border-blue-50 dark:border-slate-800">
            <Link
              href="/"
              className="flex items-center space-x-3 p-4 text-blue-900/60 dark:text-slate-400 hover:bg-blue-50/50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-white rounded-xl font-bold transition-all group"
            >
              <div className="transition-transform duration-300 group-hover:-translate-x-1">
                <Home size={20} />
              </div>
              <span className="tracking-tight">Voir le site</span>
            </Link>
          </div>
        </nav>

        <div className="p-6 mt-auto border-t border-blue-50 dark:border-slate-800">
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 p-4 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-bold transition-all group"
          >
            <div className="transition-transform duration-300 group-hover:rotate-12">
              <LogOut size={20} />
            </div>
            <span className="tracking-tight">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto w-full max-w-full overflow-x-hidden">
        <div className="p-4 md:p-12 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
