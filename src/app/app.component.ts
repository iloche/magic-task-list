import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, TaskCategory, CATEGORY_CONFIG } from './task.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = signal('Gestionnaire de Tâches');
  
  newTaskTitle = signal('');
  selectedCategory = signal<TaskCategory>('work');
  categoryConfig = CATEGORY_CONFIG;

  filter = signal<'all' | 'pending' | 'completed'>('all');

  tasks = signal<Task[]>(this.loadTasks());

  completionPercentage = computed(() => {
    const list = this.tasks();
    if (list.length === 0) return 0;
    const completedCount = list.filter(t => t.completed).length;
    return Math.round((completedCount / list.length) * 100);
  });

  filteredTasks = computed(() => {
    const currentFilter = this.filter();
    const list = this.tasks();
    
    if (currentFilter === 'pending') return list.filter(t => !t.completed);
    if (currentFilter === 'completed') return list.filter(t => t.completed);
    return list;
  });

  constructor() {
    effect(() => {
      localStorage.setItem('app_tasks', JSON.stringify(this.tasks()));
    });
  }

  addTask() {
    const title = this.newTaskTitle().trim();
    if (!title) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      category: this.selectedCategory(),
      completed: false,
      createdAt: new Date()
    };

    this.tasks.update(list => [newTask, ...list]);
    this.newTaskTitle.set('');
  }

  toggleTask(id: string) {
    this.tasks.update(list =>
      list.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  deleteTask(id: string) {
    this.tasks.update(list => list.filter(task => task.id !== id));
  }

  setFilter(f: 'all' | 'pending' | 'completed') {
    this.filter.set(f);
  }

  private loadTasks(): Task[] {
    const saved = localStorage.getItem('app_tasks');
    return saved ? JSON.parse(saved) : []; // 👈 Tableau vide par défaut !
  }
}