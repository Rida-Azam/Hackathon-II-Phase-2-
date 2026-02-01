"use client";

import { Task } from "@/types/todo";
import { CheckCircle2, Trash2, Edit2, Save } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, title: string, description?: string) => void;
  disabled?: boolean;
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate, disabled }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || "");

  const handleSave = () => {
    onUpdate(todo.id, editTitle, editDescription);
    setIsEditing(false);
  };

  return (
    <div className={cn(
      "group flex flex-col p-6 bg-white dark:bg-white/[0.02] rounded-[2rem] border border-slate-200 dark:border-white/5 transition-all duration-500 hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-foreground/5",
      todo.completed && "opacity-60 bg-slate-50/50 dark:bg-black/20"
    )}>
      {isEditing ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
          <input
            type="text"
            className="w-full p-4 bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-foreground/10 outline-none transition-all font-bold text-foreground"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task title"
          />
          <textarea
            className="w-full p-4 bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-foreground/10 outline-none transition-all text-sm font-medium text-foreground min-h-[100px]"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Add a description..."
          />
          <div className="flex justify-end space-x-3 mt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors disabled:opacity-50"
              disabled={disabled}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-foreground text-background text-xs font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center uppercase tracking-widest"
              disabled={disabled}
            >
              <Save size={14} className="mr-2" />
              Update Task
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6 flex-1 min-w-0">
            <button
              onClick={() => onToggle(todo.id)}
              className="mt-1 flex-shrink-0 transition-transform active:scale-90 disabled:opacity-50"
              disabled={disabled}
            >
              {todo.completed ? (
                <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center animate-in zoom-in duration-300">
                  <CheckCircle2 className="text-background" size={14} strokeWidth={3} />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-white/10 hover:border-foreground transition-colors" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "text-lg font-bold font-poppins text-foreground truncate transition-all duration-500",
                todo.completed && "text-muted-foreground line-through decoration-1 opacity-50"
              )}>
                {todo.title}
              </h3>
              {todo.description ? (
                <p className={cn(
                  "text-sm font-medium text-muted-foreground mt-1 line-clamp-2 transition-all duration-500",
                  todo.completed && "opacity-30"
                )}>
                  {todo.description}
                </p>
              ) : (
                <p className="text-[10px] font-bold text-muted-foreground/30 mt-1 uppercase tracking-[0.2em]">No description provided</p>
              )}
            </div>
          </div>
          <div className="flex space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => setIsEditing(true)}
              className="p-3 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-2xl transition-all disabled:opacity-50"
              disabled={disabled}
              title="Edit task"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="p-3 text-muted-foreground hover:text-red-500 hover:bg-red-500/5 rounded-2xl transition-all disabled:opacity-50"
              disabled={disabled}
              title="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
