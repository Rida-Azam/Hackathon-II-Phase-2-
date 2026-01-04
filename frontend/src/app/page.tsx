"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Layout, Zap, Shield, ArrowRight } from "lucide-react";
import { AuthCard } from "@/components/AuthCard";
import { FeatureCard } from "@/components/FeatureCard";

const features = [
  {
    icon: Zap,
    title: "Fast Implementation",
    description: "Experience lightning-fast task management with our optimized interface.",
  },
  {
    icon: Layout,
    title: "Modern Interface",
    description: "A beautiful minimalist design that helps you focus on what matters most.",
  },
  {
    icon: Shield,
    title: "Secure Access",
    description: "Your data is protected with industry-standard security and authentication.",
  },
  {
    icon: CheckCircle2,
    title: "Track Progress",
    description: "Monitor your productivity and celebrate your achievements over time.",
  },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Check if user is already signed in
    const token = localStorage.getItem("auth_token");
    if (token) {
      router.replace("/todos");
    }
  }, [router]);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-blue-500/30 selection:text-blue-200">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-[50%] -z-10 bg-[radial-gradient(ellipse_at_50%_100%,rgba(99,102,241,0.1)_0%,transparent_50%)]" />

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-4"
          >
            <span className="relative flex h-2 w-2 mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Evolution Phase II is here
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black font-poppins tracking-tighter leading-tight"
          >
            Transform your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400">productivity.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl text-muted-foreground font-inter max-w-2xl mx-auto leading-relaxed"
          >
            Experience the next era of task management.
            Beautiful, fast, and secure. Designed for the modern professional.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
          >
            <Link
              href="/signup"
              className="group relative px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transform hover:scale-105 active:scale-95 flex items-center"
            >
              Get Started for Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="px-10 py-5 bg-white/[0.03] text-foreground border border-white/10 font-bold rounded-2xl hover:bg-white/10 transition-all backdrop-blur-md transform hover:scale-105 active:scale-95"
            >
              Sign In
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-32 bg-[#050505]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold font-poppins mb-6">Designed for Focus.</h2>
            <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5 -z-10" />
        <div className="max-w-4xl mx-auto text-center bg-white/[0.02] border border-white/10 p-16 rounded-[3rem] backdrop-blur-3xl shadow-2xl">
          <h2 className="text-4xl md:text-6xl font-black font-poppins mb-8">Ready to evolve?</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-xl mx-auto">
            Join thousands of users who have transformed their daily workflows.
          </p>
          <Link
            href="/signup"
            className="inline-block px-12 py-6 bg-foreground text-background font-black rounded-3xl hover:opacity-90 transition-all text-xl transform hover:scale-110 shadow-2xl"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      <footer className="py-12 text-center text-muted-foreground text-xs font-bold uppercase tracking-[0.4em] opacity-30">
        Todo Evolution &copy; 2026 &bull; Build with Intent
      </footer>
    </div>
  );
}
