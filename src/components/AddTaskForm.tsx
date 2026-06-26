import { useState } from 'react'
import type { Task } from '../types'
import { validateTask } from '../utils/validators'

interface Props {
  onAdd: (task: Omit<Task, 'id' | 'createdAt'>) => void
}

export function AddTaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('medium')
  const [dueDate, setDueDate] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = validateTask({ title, description, dueDate })
    if (!result.isValid) {
      setErrors(result.errors)
      return
    }
    onAdd({ title: title.trim(), description, priority, status: 'todo', dueDate: dueDate || undefined })
    setTitle('')
    setDescription('')
    setPriority('medium')
    setDueDate('')
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Add new task" className="bg-white border border-slate-200 rounded-lg p-4 space-y-3">
      <h2 className="font-semibold text-slate-700">Add New Task</h2>

      <div>
        <label htmlFor="task-title" className="block text-sm font-medium text-slate-600 mb-1">
          Title *
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter task title"
          aria-required="true"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
          className={`w-full border rounded px-3 py-2 text-sm ${errors.title ? 'border-red-400' : 'border-slate-200'}`}
        />
        {errors.title && (
          <p id="title-error" role="alert" className="text-red-500 text-xs mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="task-desc" className="block text-sm font-medium text-slate-600 mb-1">
          Description
        </label>
        <textarea
          id="task-desc"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={2}
          className="w-full border border-slate-200 rounded px-3 py-2 text-sm"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label htmlFor="task-priority" className="block text-sm font-medium text-slate-600 mb-1">
            Priority
          </label>
          <select
            id="task-priority"
            value={priority}
            onChange={e => setPriority(e.target.value as Task['priority'])}
            className="w-full border border-slate-200 rounded px-3 py-2 text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="task-due" className="block text-sm font-medium text-slate-600 mb-1">
            Due Date
          </label>
          <input
            id="task-due"
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            className="w-full border border-slate-200 rounded px-3 py-2 text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white rounded py-2 text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Add Task
      </button>
    </form>
  )
}
