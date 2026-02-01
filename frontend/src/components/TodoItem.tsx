"use client";

import { Task } from "@/types/todo";
import { CheckCircle2, Trash2, Edit2, Save } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, title: string, description?: string, dueDate?: string | null, priority?: 'low' | 'medium' | 'high', workType?: 'personal' | 'work' | 'study' | 'home' | 'other') => void;
  disabled?: boolean;
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate, disabled }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || "");
  const [editDueDate, setEditDueDate] = useState<string | null>(todo.dueDate || null);
  const [editPriority, setEditPriority] = useState<'low' | 'medium' | 'high'>(todo.priority || 'medium');
  const [editWorkType, setEditWorkType] = useState<'personal' | 'work' | 'study' | 'home' | 'other'>(todo.workType || 'personal');

  const handleSave = () => {
    onUpdate(todo.id, editTitle, editDescription, editDueDate, editPriority, editWorkType);
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

          {/* Edit form for new fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Due Date Editor */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={editDueDate || ""}
                onChange={(e) => setEditDueDate(e.target.value || null)}
                className="w-full p-2 bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-foreground/10 outline-none text-sm"
              />
            </div>

            {/* Priority Editor */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                Priority
              </label>
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as any)}
                className="w-full p-2 bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-foreground/10 outline-none text-sm"
              >
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Work Type Editor */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                Type of Work
              </label>
              <select
                value={editWorkType}
                onChange={(e) => setEditWorkType(e.target.value as any)}
                className="w-full p-2 bg-white dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-foreground/10 outline-none text-sm"
              >
                {(['personal', 'work', 'study', 'home', 'other'] as const).map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

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

              {/* Additional Task Details */}
              <div className="flex flex-wrap gap-2 mt-2">
                {/* Priority Indicator */}
                {todo.priority && (
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded-full ${
                    todo.priority === 'low'
                      ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                      : todo.priority === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                        : 'bg-red-500/20 text-red-600 dark:text-red-400'
                  }`}>
                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                  </span>
                )}

                {/* Work Type Badge */}
                {todo.workType && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-bold rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
                    {todo.workType.charAt(0).toUpperCase() + todo.workType.slice(1)}
                  </span>
                )}

                {/* Due Date */}
                {todo.dueDate && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-bold rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400">
                    📅 {new Date(todo.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
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
