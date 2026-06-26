import type { Task } from '../types'

const BASE = '/api/tasks'

export async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(BASE)
  if (!res.ok) throw new Error('Failed to fetch tasks')
  return res.json()
}

export async function createTask(
  task: Omit<Task, 'id' | 'createdAt'>
): Promise<Task> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
  if (!res.ok) throw new Error('Failed to create task')
  return res.json()
}

export async function updateTask(
  id: string,
  updates: Partial<Task>
): Promise<{ status: number; data: Task }> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  const data = await res.json()
  return { status: res.status, data }
}

export async function deleteTask(id: string): Promise<{ status: number }> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
  return { status: res.status }
}
