import type { Task, TaskFilter, Priority } from '../types'

export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  return tasks.filter(task => {
    if (filter.status && task.status !== filter.status) return false
    if (filter.priority && task.priority !== filter.priority) return false
    if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase())) return false
    return true
  })
}

export function sortByPriority(tasks: Task[]): Task[] {
  const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 }
  return [...tasks].sort((a, b) => order[a.priority] - order[b.priority])
}

export function getTaskStats(tasks: Task[]) {
  const done = tasks.filter(t => t.status === 'done').length
  return {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done,
    completionRate: tasks.length === 0 ? 0 : Math.round((done / tasks.length) * 100),
  }
}

export function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'done') return false
  return new Date(task.dueDate) < new Date()
}
