import type { Task } from '../types'

interface Props {
  task: Task
  onStatusChange: (id: string, status: Task['status']) => void
  onDelete: (id: string) => void
}

const PRIORITY_COLORS: Record<Task['priority'], string> = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-green-100 text-green-700 border-green-200',
}

const STATUS_OPTIONS: Task['status'][] = ['todo', 'in-progress', 'done']

export function TaskItem({ task, onStatusChange, onDelete }: Props) {
  return (
    <div
      role="article"
      aria-label={`Task: ${task.title}`}
      data-testid="task-item"
      data-task-id={task.id}
      className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-lg shadow-sm"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-medium px-2 py-0.5 rounded border ${PRIORITY_COLORS[task.priority]}`}>
            {task.priority}
          </span>
          <h3
            className={`font-medium text-slate-800 ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}
          >
            {task.title}
          </h3>
        </div>
        {task.description && (
          <p className="text-sm text-slate-500 mt-1">{task.description}</p>
        )}
        {task.dueDate && (
          <p className="text-xs text-slate-400 mt-1">Due: {task.dueDate}</p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <select
          aria-label="Change task status"
          value={task.status}
          onChange={e => onStatusChange(task.id, e.target.value as Task['status'])}
          className="text-sm border border-slate-200 rounded px-2 py-1 bg-white"
        >
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          aria-label={`Delete task: ${task.title}`}
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 rounded hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
