import type { Task } from '../types'
import { TaskItem } from './TaskItem'

interface Props {
  tasks: Task[]
  onStatusChange: (id: string, status: Task['status']) => void
  onDelete: (id: string) => void
}

export function TaskList({ tasks, onStatusChange, onDelete }: Props) {
  if (tasks.length === 0) {
    return (
      <div role="status" aria-live="polite" className="text-center py-12 text-slate-400">
        No tasks found.
      </div>
    )
  }

  return (
    <ul aria-label="Task list" className="space-y-3">
      {tasks.map(task => (
        <li key={task.id}>
          <TaskItem task={task} onStatusChange={onStatusChange} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  )
}
