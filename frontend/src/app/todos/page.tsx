"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { isAxiosError } from "axios";
import { Task } from "@/types/todo";
import { TodoItem } from "@/components/TodoItem";
import { Plus, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default function TodosPage() {
  const [todos, setTodos] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [workType, setWorkType] = useState<'personal' | 'work' | 'study' | 'home' | 'other'>('personal');
  const router = useRouter();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("auth_token");
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/login";
  }, []);

  const fetchTodos = useCallback(async () => {
    try {
      const response = await api.get("/api/todos/");
      setTodos(response.data);
      setError("");
    } catch (err: unknown) {
      if (isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
        handleLogout();
      } else if (isAxiosError(err)) {
        setError(err.response?.data?.detail || "Connection error");
      } else {
        setError("Connection error");
      }
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setAuthChecked(true);

    fetchTodos().catch(() => {
      setError("Connection error");
      setLoading(false);
    });
  }, [router, fetchTodos]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Validate due date - warn if it's in the past
    if (dueDate) {
      const selectedDate = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        if (!window.confirm("Selected due date is in the past. Continue anyway?")) {
          return;
        }
      }
    }

    setIsProcessing(true);
    try {
      const response = await api.post("/api/todos/", {
        title: newTitle,
        dueDate: dueDate,
        priority: priority,
        workType: workType
      });
      setTodos((prev) => [...prev, response.data]);
      setNewTitle("");
      // Reset options after successful creation
      setDueDate(null);
      setPriority('medium');
      setWorkType('personal');
      setShowOptions(false);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.detail || "Failed to add task");
      } else {
        setError("Connection error");
      }
      console.error("Failed to add", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickDateSelect = (daysToAdd: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    const dateString = date.toISOString().split('T')[0];
    setDueDate(dateString);
  };

  const handleUpdate = async (id: number, title: string, description?: string, dueDate?: string | null, priority?: 'low' | 'medium' | 'high', workType?: 'personal' | 'work' | 'study' | 'home' | 'other') => {
    setIsProcessing(true);
    try {
      const safeDescription = description ?? null;
      const updateData: any = { title, description: safeDescription };

      // Only include new fields if they're provided to avoid overwriting with undefined
      if (dueDate !== undefined) updateData.dueDate = dueDate;
      if (priority !== undefined) updateData.priority = priority;
      if (workType !== undefined) updateData.workType = workType;

      await api.put(`/api/todos/${id}/`, updateData);
      await fetchTodos();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.detail || err.message);
      } else {
        setError("Connection error");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this task?")) return;
    setIsProcessing(true);
    try {
      await api.delete(`/api/todos/${id}/`);
      await fetchTodos();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.detail || err.message);
      } else {
        setError("Connection error");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggle = async (id: number) => {
    setIsProcessing(true);
    try {
      await api.patch(`/api/todos/${id}/complete/`);
      await fetchTodos();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.detail || err.message);
      } else {
        setError("Connection error");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background font-inter font-bold tracking-[0.2em] text-[10px] text-muted-foreground uppercase opacity-50">
        Authenticating...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden font-inter text-foreground">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 bg-background relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/[0.03] blur-[120px] pointer-events-none" />

        <Header />

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-12">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-bold font-poppins tracking-tight">Today</h2>
                <p className="text-muted-foreground font-medium mt-1">Manage your professional workflow</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-[10px] font-bold text-muted-foreground hover:text-red-500 uppercase tracking-widest transition-colors mb-2"
              >
                <LogOut size={14} className="mr-2" />
                Sign Out
              </button>
            </header>

            <form onSubmit={handleAddTodo} className="relative group">
              {/* Options Panel */}
              {showOptions && (
                <div className="bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-3xl p-6 mb-4 transition-all duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Due Date Picker */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Due Date
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={dueDate || ""}
                          onChange={(e) => setDueDate(e.target.value || null)}
                          className="w-full bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                        />
                        <div className="flex flex-wrap gap-1">
                          <button
                            type="button"
                            onClick={() => handleQuickDateSelect(0)}
                            className="text-xs bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 px-2 py-1 rounded-lg transition-colors"
                          >
                            Today
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickDateSelect(1)}
                            className="text-xs bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 px-2 py-1 rounded-lg transition-colors"
                          >
                            Tomorrow
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Priority Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Priority
                      </label>
                      <div className="flex gap-2">
                        {(['low', 'medium', 'high'] as const).map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setPriority(level)}
                            className={`flex-1 py-2 px-3 text-xs font-medium rounded-xl transition-all ${
                              priority === level
                                ? level === 'low'
                                  ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30'
                                  : level === 'medium'
                                    ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30'
                                    : 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
                                : 'bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/10'
                            }`}
                          >
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Work Type Selector */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Type of Work
                      </label>
                      <select
                        value={workType}
                        onChange={(e) => setWorkType(e.target.value as any)}
                        className="w-full bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20"
                      >
                        {(['personal', 'work', 'study', 'home', 'other'] as const).map((type) => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Task Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Push a new task into your day..."
                  className="w-full bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5 rounded-3xl py-6 px-8 text-lg font-medium shadow-2xl shadow-foreground/5 focus:outline-none focus:ring-2 focus:ring-foreground/5 transition-all placeholder:text-muted-foreground/30"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onFocus={() => setShowOptions(true)}
                />

                {/* Options Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowOptions(!showOptions)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </button>

                <button
                  type="submit"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-foreground text-background p-3 rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-xl"
                >
                  <Plus size={24} />
                </button>
              </div>
            </form>

            {error && (
              <div className="text-center text-red-500 text-xs font-bold uppercase tracking-[0.3em] bg-red-500/5 border border-red-500/10 rounded-2xl py-3">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="h-28 bg-white/5 animate-pulse rounded-[2rem] border border-white/5" />
                ))
              ) : todos.length === 0 ? (
                <div className="text-center py-32 border border-dashed border-white/10 rounded-[3rem] bg-white/[0.02]">
                  <p className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em] opacity-50">
                    Empty Workspace
                  </p>
                  <p className="text-foreground/40 mt-2 text-sm font-medium">Add a task to start productivity</p>
                </div>
              ) : (
                todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                    disabled={isProcessing}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
