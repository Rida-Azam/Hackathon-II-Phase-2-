export interface Task {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  dueDate?: string | null;
  priority: 'low' | 'medium' | 'high';
  workType: 'personal' | 'work' | 'study' | 'home' | 'other';
  completed: boolean;
  created_at: string;
  updated_at: string;
}
