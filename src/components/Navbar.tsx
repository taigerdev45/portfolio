"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Monitor } from "lucide-react";

import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  const navLinks = [
    { name: "Accueil", href: "/" },
    { name: "Projets", href: "/projects" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-gray-200/50 dark:border-gray-800/50 rounded-2xl shadow-lg shadow-black/5">
          <div className="flex justify-between h-16 md:h-20 px-4 md:px-8">
            <div className="flex items-center">
              <div className="group flex items-center space-x-3">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-xl">
                    <Image 
                      src="/logoportfolio.png"
                      alt="Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-lg md:text-xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
                    Portfolio
                  </span>
                </Link>
                <Link 
                  href="/admin/login" 
                   prefetch={false}
                  className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all ml-1 hover:scale-110 active:scale-95"
                  title="Administration"
                >
                  <Monitor size={18} />
                </Link>
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    pathname === link.href 
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-all active:scale-90"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-24 left-4 right-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-6 py-4 rounded-2xl text-base font-black transition-all ${
                  pathname === link.href
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
