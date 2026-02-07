"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { getSettings, Settings } from "@/lib/services";
import Image from "next/image";

export default function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const s = await getSettings();
        setSettings(s);
      } catch (error) {
        console.error("Error fetching settings for footer:", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <div className="relative w-10 h-10 overflow-hidden rounded-lg">
                <Image 
                  src="/logoportfolio.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
                Portfolio
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm text-lg">
              Concevoir des expériences numériques exceptionnelles avec passion et précision.
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">
              © {new Date().getFullYear()} Tous droits réservés.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end space-y-6">
            <div className="flex space-x-4">
              {[
                { icon: <Github size={24} />, href: settings?.githubUrl || "#", label: "GitHub" },
                { icon: <Linkedin size={24} />, href: settings?.linkedinUrl || "#", label: "LinkedIn" },
                { icon: <Mail size={24} />, href: settings?.contactEmail ? `mailto:${settings.contactEmail}` : "#", label: "Email" }
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href} 
                  target={social.href.startsWith('http') ? "_blank" : undefined}
                  rel={social.href.startsWith('http') ? "noopener noreferrer" : undefined}
                  className="p-3 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            <div className="text-sm font-bold text-gray-400 dark:text-gray-500 tracking-widest uppercase">
              Fait avec Next.js & Tailwind
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
