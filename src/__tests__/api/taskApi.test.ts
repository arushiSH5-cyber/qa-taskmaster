import { describe, it, expect } from 'vitest'
import { fetchTasks, createTask, updateTask, deleteTask } from '../../api/taskApi'

// MSW server is started globally in setup.ts

describe('fetchTasks', () => {
  it('returns an array of tasks', async () => {
    const tasks = await fetchTasks()
    expect(Array.isArray(tasks)).toBe(true)
    expect(tasks.length).toBeGreaterThan(0)
  })

  it('returns tasks with all required fields', async () => {
    const tasks = await fetchTasks()
    const task = tasks[0]
    expect(task).toHaveProperty('id')
    expect(task).toHaveProperty('title')
    expect(task).toHaveProperty('status')
    expect(task).toHaveProperty('priority')
    expect(task).toHaveProperty('createdAt')
  })
})

describe('createTask', () => {
  it('returns the newly created task', async () => {
    const newTask = await createTask({
      title: 'API created task',
      description: '',
      priority: 'low',
      status: 'todo',
    })
    expect(newTask.title).toBe('API created task')
    expect(newTask.id).toBeTruthy()
    expect(newTask.createdAt).toBeTruthy()
  })

  it('created task appears in subsequent fetchTasks call', async () => {
    await createTask({ title: 'Persistent task', description: '', priority: 'medium', status: 'todo' })
    const tasks = await fetchTasks()
    expect(tasks.some(t => t.title === 'Persistent task')).toBe(true)
  })
})

describe('updateTask', () => {
  it('returns status 200 and updated task', async () => {
    const result = await updateTask('1', { status: 'done' })
    expect(result.status).toBe(200)
    expect(result.data.status).toBe('done')
  })

  it('returns status 404 for non-existent task id', async () => {
    const result = await updateTask('999', { status: 'done' })
    expect(result.status).toBe(404)
  })
})

describe('deleteTask', () => {
  it('returns status 204 on successful deletion', async () => {
    const result = await deleteTask('1')
    expect(result.status).toBe(204)
  })

  it('returns status 404 when task does not exist', async () => {
    const result = await deleteTask('999')
    expect(result.status).toBe(404)
  })
})
