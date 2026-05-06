"use client";

import Image from "next/image";
import { Skill } from "@/lib/services";
import { motion } from "framer-motion";

interface SkillsCarouselProps {
  skills: Skill[];
}

export default function SkillsCarousel({ skills }: SkillsCarouselProps) {
  if (skills.length === 0) return null;

  // Dupliquer les skills pour assurer un défilement fluide
  const duplicatedSkills = [...skills, ...skills, ...skills];

  return (
    <section className="py-20 relative overflow-hidden bg-blue-50/10 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl md:text-4xl font-black text-blue-950 dark:text-white uppercase tracking-tight">Technologies & Outils</h2>
          <div className="h-1 w-24 bg-blue-600 rounded-full" />
        </div>
      </div>

      <div className="relative flex overflow-hidden py-10">
        <motion.div 
          animate={{
            x: [0, -1035],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
          className="flex items-center space-x-8 md:space-x-16 pr-8 md:pr-16"
        >
          {duplicatedSkills.map((skill, idx) => (
            <motion.div 
              key={`${skill.id || idx}-${idx}`}
              whileHover={{ scale: 1.1, y: -10 }}
              className="flex flex-col items-center space-y-4 shrink-0"
            >
              <div className="relative w-24 h-24 md:w-36 md:h-36 flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
                <Image 
                  src={skill.icon} 
                  alt={skill.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 96px, 144px"
                />
              </div>
              <span className="text-sm md:text-lg font-black text-blue-900/40 dark:text-slate-400 uppercase tracking-widest">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Gradient Overlays */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-blue-50/10 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-blue-50/10 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
