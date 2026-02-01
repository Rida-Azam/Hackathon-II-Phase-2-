"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, borderColor: "rgba(59, 130, 246, 0.5)" }}
      className="p-8 rounded-3xl bg-[#111111] border border-[#222222] transition-colors group"
    >
      <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-6 group-hover:bg-blue-600/20 transition-colors">
        <Icon className="text-blue-500" size={24} strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3 font-poppins">{title}</h3>
      <p className="text-muted-foreground leading-relaxed font-inter">{description}</p>
    </motion.div>
  );
}
