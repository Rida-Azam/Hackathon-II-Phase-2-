"use client";

import React from "react";
import { motion } from "framer-motion";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden font-inter">
      {/* Ambient background gradients */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 dark:bg-blue-900/20 blur-[120px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 dark:bg-indigo-900/20 blur-[120px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md space-y-8 bg-white/70 dark:bg-white/[0.03] backdrop-blur-3xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/20 dark:border-white/10"
      >
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold tracking-tight text-foreground font-poppins"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-sm text-muted-foreground font-medium uppercase tracking-widest opacity-70"
          >
            {subtitle}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
