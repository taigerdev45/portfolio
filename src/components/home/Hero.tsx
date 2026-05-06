"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Settings } from "@/lib/services";
import { motion } from "framer-motion";

interface HeroProps {
  settings: Settings | null;
}

export default function Hero({ settings }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20 md:py-0">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-64 h-64 md:w-96 md:h-96 bg-blue-500/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 md:w-96 md:h-96 bg-purple-500/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[24px_24px] md:bg-size-[32px_32px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left space-y-6 md:space-y-10"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs md:text-sm font-bold border border-blue-100 dark:border-blue-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>Disponible pour de nouveaux projets</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-black tracking-tight leading-[1.1] md:leading-tight">
              <span className="block text-gray-900 dark:text-white">
                {settings?.heroTitle?.split(' ').slice(0, -1).join(' ')}
              </span>
              <span className="text-gradient block sm:inline">
                {settings?.heroTitle?.split(' ').slice(-1)}
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed font-medium">
              {settings?.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row justify-start items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-6">
              <Link
                href="/projects"
                className="w-full sm:w-auto group relative px-8 py-5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gray-200 dark:shadow-none text-center"
              >
                <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center justify-center space-x-2">
                  <span>Explorer mes travaux</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-2 border-gray-100 dark:border-gray-800 rounded-2xl font-black hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm text-center"
              >
                Me contacter
              </Link>
            </div>
          </motion.div>

          {/* 3D Animation Caricature */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative perspective-1000 hidden lg:block"
          >
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 2, 0, -2, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative z-10 w-full max-w-[500px] mx-auto"
            >
              <div className="relative aspect-square w-full">
                <Image
                  src="/3d-avatar.png"
                  alt="3D Caricature Avatar"
                  fill
                  className="object-contain drop-shadow-[0_35px_35px_rgba(59,130,246,0.3)]"
                  priority
                />
              </div>
              
              {/* Floating Icons Decorations */}
              <motion.div 
                animate={{ y: [0, 15, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-lg" />
              </motion.div>
              <motion.div 
                animate={{ y: [0, -15, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-1/2 -left-12 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700"
              >
                <div className="w-8 h-8 bg-purple-500 rounded-lg rotate-45" />
              </motion.div>
            </motion.div>
            
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-blue-500/10 rounded-full blur-[100px] -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
