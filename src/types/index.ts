export type Priority = 'low' | 'medium' | 'high'
export type Status = 'todo' | 'in-progress' | 'done'

export interface Task {
  id: string
  title: string
  description: string
  priority: Priority
  status: Status
  createdAt: string
  dueDate?: string
}

export interface TaskFilter {
  status?: Status
  priority?: Priority
  search?: string
}
