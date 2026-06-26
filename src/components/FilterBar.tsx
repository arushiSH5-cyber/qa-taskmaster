import type { TaskFilter, Task } from '../types'

interface Props {
  filter: TaskFilter
  onFilterChange: (filter: TaskFilter) => void
}

export function FilterBar({ filter, onFilterChange }: Props) {
  return (
    <div role="search" aria-label="Filter tasks" className="flex flex-wrap gap-3 items-center">
      <input
        type="search"
        aria-label="Search tasks"
        placeholder="Search tasks..."
        value={filter.search ?? ''}
        onChange={e => onFilterChange({ ...filter, search: e.target.value || undefined })}
        className="border border-slate-200 rounded px-3 py-1.5 text-sm flex-1 min-w-40"
      />
      <select
        aria-label="Filter by status"
        value={filter.status ?? ''}
        onChange={e => onFilterChange({ ...filter, status: (e.target.value as Task['status']) || undefined })}
        className="border border-slate-200 rounded px-3 py-1.5 text-sm"
      >
        <option value="">All statuses</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <select
        aria-label="Filter by priority"
        value={filter.priority ?? ''}
        onChange={e => onFilterChange({ ...filter, priority: (e.target.value as Task['priority']) || undefined })}
        className="border border-slate-200 rounded px-3 py-1.5 text-sm"
      >
        <option value="">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <button
        onClick={() => onFilterChange({})}
        className="text-sm text-slate-500 hover:text-slate-700 underline"
      >
        Clear
      </button>
    </div>
  )
}
