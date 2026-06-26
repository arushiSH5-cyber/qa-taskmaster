import { http, HttpResponse } from 'msw'
import type { Task } from '../types'

// This is the "test database" — resets between tests
let mockTasks: Task[] = [
  { id: '1', title: 'Set up project', description: '', priority: 'high', status: 'done', createdAt: '2024-01-01' },
  { id: '2', title: 'Write unit tests', description: '', priority: 'high', status: 'in-progress', createdAt: '2024-01-02' },
  { id: '3', title: 'Review PR', description: '', priority: 'medium', status: 'todo', createdAt: '2024-01-03' },
]

export const handlers = [
  http.get('/api/tasks', () => {
    return HttpResponse.json(mockTasks)
  }),

  http.post('/api/tasks', async ({ request }) => {
    const body = await request.json() as Omit<Task, 'id' | 'createdAt'>
    const newTask: Task = {
      ...body,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    }
    mockTasks.push(newTask)
    return HttpResponse.json(newTask, { status: 201 })
  }),

  http.patch('/api/tasks/:id', async ({ params, request }) => {
    const updates = await request.json() as Partial<Task>
    const idx = mockTasks.findIndex(t => t.id === params.id)
    if (idx === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    mockTasks[idx] = { ...mockTasks[idx], ...updates }
    return HttpResponse.json(mockTasks[idx])
  }),

  http.delete('/api/tasks/:id', ({ params }) => {
    const idx = mockTasks.findIndex(t => t.id === params.id)
    if (idx === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    mockTasks.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]

export function resetMockTasks() {
  mockTasks = [
    { id: '1', title: 'Set up project', description: '', priority: 'high', status: 'done', createdAt: '2024-01-01' },
    { id: '2', title: 'Write unit tests', description: '', priority: 'high', status: 'in-progress', createdAt: '2024-01-02' },
    { id: '3', title: 'Review PR', description: '', priority: 'medium', status: 'todo', createdAt: '2024-01-03' },
  ]
}
