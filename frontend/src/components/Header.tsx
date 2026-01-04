"use client";

import { useState, useEffect } from "react";
import { Search, User } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { getUserFromSession } from "@/lib/auth";

export function Header() {
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const user = getUserFromSession();
    if (user?.name) {
      setUserName(user.name);
    }
  }, []);
  return (
    <header className="h-20 px-8 flex items-center justify-between bg-background/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-10">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search tasks, notes, symbols..."
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <ThemeToggle />
        <div className="h-8 w-[1px] bg-white/10" />
        <div className="flex items-center space-x-3">
           <div className="text-right">
              <p className="text-sm font-bold text-foreground font-poppins">{userName}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Now</p>
           </div>
           <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-400 shadow-lg">
              <User size={20} />
           </div>
        </div>
      </div>
    </header>
  );
}
