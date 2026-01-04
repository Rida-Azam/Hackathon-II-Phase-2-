"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, CheckSquare, Calendar, Bell, FileText, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getUserFromSession } from "@/lib/auth";

const navItems = [
  { id: "dashboard", label: "Dashboard", href: "/todos", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", href: "/todos", icon: CheckSquare },
  { id: "calendar", label: "Calendar", href: "/calendar", icon: Calendar },
  { id: "reminders", label: "Reminders", href: "/reminders", icon: Bell },
  { id: "notes", label: "Notes", href: "/notes", icon: FileText },
  { id: "settings", label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const user = getUserFromSession();
    if (user?.name) {
      setUserName(user.name);
    }
  }, []);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-foreground text-background rounded-2xl shadow-2xl transition-transform active:scale-95"
      >
        <LayoutDashboard size={24} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-45 w-64 h-full bg-sidebar border-r border-white/10 flex flex-col font-inter transition-all duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8">
          <Link href="/" className="block">
            <h1 className="text-xl font-bold font-poppins text-foreground tracking-tight flex items-center hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-6 h-6 bg-foreground rounded-lg mr-3 flex items-center justify-center">
                 <div className="w-2 h-2 bg-background rounded-full" />
              </div>
              Todo
            </h1>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group",
                  isActive
                    ? "bg-foreground text-background shadow-lg shadow-foreground/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                <Icon size={18} className={cn("mr-4", isActive ? "text-background" : "group-hover:scale-110 transition-transform")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6">
          <div className="bg-white/5 rounded-3xl p-4 border border-white/5">
            <div className="flex items-center space-x-3">
               <div className="w-10 h-10 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                  <User size={20} />
               </div>
               <div>
                  <p className="text-xs font-bold text-foreground">{userName}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pro Member</p>
               </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
