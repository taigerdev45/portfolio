"use client";

import { Code2, Layout, Rocket, Sparkles, LucideIcon } from "lucide-react";
import { Feature } from "@/lib/services";
import { motion } from "framer-motion";

const IconMap: Record<string, LucideIcon> = {
  Code2,
  Layout,
  Rocket,
  Sparkles
};

interface FeaturesProps {
  features: Feature[];
}

export default function Features({ features }: FeaturesProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
        {features.map((feature, i) => {
          const IconComponent = IconMap[feature.icon] || Code2;
          return (
            <motion.div 
              key={feature.id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ 
                y: -15,
                scale: 1.02,
                rotateX: 5,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
              className="group p-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <IconComponent size={120} />
              </div>
              
              <div className={`p-5 bg-${feature.color}-50 dark:bg-${feature.color}-900/20 text-${feature.color}-600 dark:text-${feature.color}-400 w-fit rounded-2xl mb-8 group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-${feature.color}-500/10`}>
                <IconComponent size={36} />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-bold leading-relaxed text-lg">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
