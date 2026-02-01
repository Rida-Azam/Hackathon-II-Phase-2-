"use client";

import { useTheme } from "@/app/provider";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) return <div className="p-2 w-10 h-10" />;

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-white/50 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-sm group"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        <Moon size={18} className="group-hover:rotate-12 transition-transform" />
      ) : (
        <Sun size={18} className="group-hover:rotate-45 transition-transform" />
      )}
    </button>
  );
}
