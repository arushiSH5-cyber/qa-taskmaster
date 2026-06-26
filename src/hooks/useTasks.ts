import { useState, useEffect, useCallback } from 'react'
import type { Task, TaskFilter } from '../types'
import { fetchTasks, createTask, updateTask, deleteTask } from '../api/taskApi'
import { filterTasks, sortByPriority } from '../utils/taskUtils'

export function useTasks() {
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<TaskFilter>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
      .then(data => setAllTasks(data))
      .catch(() => setError('Failed to load tasks'))
      .finally(() => setLoading(false))
  }, [])

  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask = await createTask(taskData)
    setAllTasks(prev => [...prev, newTask])
  }, [])

  const changeStatus = useCallback(async (id: string, status: Task['status']) => {
    await updateTask(id, { status })
    setAllTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
  }, [])

  const removeTask = useCallback(async (id: string) => {
    await deleteTask(id)
    setAllTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  return {
    tasks: sortByPriority(filterTasks(allTasks, filter)),
    allTasks,
    filter,
    setFilter,
    addTask,
    changeStatus,
    removeTask,
    loading,
    error,
  }
}
