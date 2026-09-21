export type TaskCategory = 'work' | 'personal' | 'urgent' | 'learning';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  completed: boolean;
  createdAt: Date;
}

export const CATEGORY_CONFIG: Record<TaskCategory, { label: string; emoji: string; color: string }> = {
  work: { label: 'Travail', emoji: '💼', color: '#38bdf8' },
  personal: { label: 'Personnel', emoji: '🏠', color: '#4ade80' },
  urgent: { label: 'Urgent', emoji: '🔥', color: '#f87171' },
  learning: { label: 'Apprentissage', emoji: '📚', color: '#fbbf24' }
};