"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
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
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setAuthChecked(true);
    fetchTodos();
  }, [router]);

  const fetchTodos = async () => {
    try {
      const response = await api.get("/api/todos/");
      setTodos(response.data);
      setError("");
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      } else {
        setError(err.response?.data?.detail || "Connection error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const response = await api.post("/api/todos/", { title: newTitle });
      setTodos([...todos, response.data]);
      setNewTitle("");
    } catch (err) {
      console.error("Failed to add", err);
    }
  };

  const handleUpdate = async (id: number, title: string, description: string | null) => {
    setIsProcessing(true);
    try {
      await api.put(`/api/todos/${id}/`, { title, description });
      await fetchTodos();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
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
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggle = async (id: number) => {
    setIsProcessing(true);
    try {
      await api.patch(`/api/todos/${id}/complete/`);
      await fetchTodos();
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/login";
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
              <input
                type="text"
                placeholder="Push a new task into your day..."
                className="w-full bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5 rounded-3xl py-6 px-8 text-lg font-medium shadow-2xl shadow-foreground/5 focus:outline-none focus:ring-2 focus:ring-foreground/5 transition-all placeholder:text-muted-foreground/30"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-foreground text-background p-3 rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-xl"
              >
                <Plus size={24} />
              </button>
            </form>

            <div className="space-y-6">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="h-28 bg-white/5 animate-pulse rounded-[2rem] border border-white/5" />
                ))
              ) : todos.length === 0 ? (
                <div className="text-center py-32 border border-dashed border-white/10 rounded-[3rem] bg-white/[0.02]">
                  <p className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em] opacity-50">Empty Workspace</p>
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
