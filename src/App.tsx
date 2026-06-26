import { useTasks } from './hooks/useTasks'
import { AddTaskForm } from './components/AddTaskForm'
import { FilterBar } from './components/FilterBar'
import { TaskList } from './components/TaskList'
import { getTaskStats } from './utils/taskUtils'

export default function App() {
  const { tasks, allTasks, filter, setFilter, addTask, changeStatus, removeTask, loading, error } = useTasks()
  const stats = getTaskStats(allTasks)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-slate-800">TaskMaster</h1>
        <p className="text-slate-500 text-sm">QA Learning Project 1 — Full Automated Test Suite</p>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div role="region" aria-label="Task statistics" className="grid grid-cols-4 gap-3">
          {[
            { label: 'Total', value: stats.total },
            { label: 'To Do', value: stats.todo },
            { label: 'In Progress', value: stats.inProgress },
            { label: 'Done', value: stats.done },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-slate-800">{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {stats.total > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-2 text-sm text-blue-700">
            Completion rate: <strong>{stats.completionRate}%</strong>
          </div>
        )}

        <AddTaskForm onAdd={addTask} />
        <FilterBar filter={filter} onFilterChange={setFilter} />

        {loading && (
          <div role="status" aria-live="polite" className="text-center text-slate-400 py-8">
            Loading tasks...
          </div>
        )}
        {error && (
          <div role="alert" className="text-red-500 text-sm">{error}</div>
        )}
        {!loading && !error && (
          <TaskList tasks={tasks} onStatusChange={changeStatus} onDelete={removeTask} />
        )}
      </main>
    </div>
  )
}
