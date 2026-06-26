import { describe, it, expect } from 'vitest'
import { filterTasks, sortByPriority, getTaskStats, isOverdue } from '../../utils/taskUtils'
import type { Task } from '../../types'

const TASKS: Task[] = [
  { id: '1', title: 'High priority task', description: '', priority: 'high', status: 'todo', createdAt: '2024-01-01' },
  { id: '2', title: 'Medium task in progress', description: '', priority: 'medium', status: 'in-progress', createdAt: '2024-01-02' },
  { id: '3', title: 'Low priority done', description: '', priority: 'low', status: 'done', createdAt: '2024-01-03' },
  { id: '4', title: 'Another high done', description: '', priority: 'high', status: 'done', createdAt: '2024-01-04' },
]

// ─── filterTasks ───────────────────────────────────────────────────────────────

describe('filterTasks', () => {
  it('returns all tasks when no filter is applied', () => {
    expect(filterTasks(TASKS, {})).toHaveLength(4)
  })

  it('filters by status: todo', () => {
    const result = filterTasks(TASKS, { status: 'todo' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('1')
  })

  it('filters by priority: high', () => {
    expect(filterTasks(TASKS, { priority: 'high' })).toHaveLength(2)
  })

  it('filters by search — case insensitive', () => {
    expect(filterTasks(TASKS, { search: 'HIGH' })).toHaveLength(2)
    expect(filterTasks(TASKS, { search: 'high' })).toHaveLength(2)
  })

  it('combines status and priority filters with AND logic', () => {
    const result = filterTasks(TASKS, { priority: 'high', status: 'done' })
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('4')
  })

  it('returns empty array when nothing matches', () => {
    expect(filterTasks(TASKS, { search: 'zzz-no-match' })).toHaveLength(0)
  })

  it('handles empty input array', () => {
    expect(filterTasks([], { status: 'todo' })).toHaveLength(0)
  })

  it('partial search match works', () => {
    expect(filterTasks(TASKS, { search: 'in pro' })).toHaveLength(1)
  })
})

// ─── sortByPriority ────────────────────────────────────────────────────────────

describe('sortByPriority', () => {
  it('sorts high → medium → low', () => {
    const shuffled: Task[] = [
      { ...TASKS[1] },
      { ...TASKS[2] },
      { ...TASKS[0] },
    ]
    const result = sortByPriority(shuffled)
    expect(result[0].priority).toBe('high')
    expect(result[1].priority).toBe('medium')
    expect(result[2].priority).toBe('low')
  })

  it('does not mutate the original array', () => {
    const original = [...TASKS]
    sortByPriority(TASKS)
    expect(TASKS).toEqual(original)
  })

  it('handles empty array', () => {
    expect(sortByPriority([])).toEqual([])
  })
})

// ─── getTaskStats ──────────────────────────────────────────────────────────────

describe('getTaskStats', () => {
  it('counts tasks by status correctly', () => {
    const stats = getTaskStats(TASKS)
    expect(stats.total).toBe(4)
    expect(stats.todo).toBe(1)
    expect(stats.inProgress).toBe(1)
    expect(stats.done).toBe(2)
  })

  it('calculates completion rate as a percentage', () => {
    expect(getTaskStats(TASKS).completionRate).toBe(50)
  })

  it('returns 0% completion rate for empty list', () => {
    expect(getTaskStats([]).completionRate).toBe(0)
  })

  it('returns 100% when all tasks are done', () => {
    const allDone = TASKS.map(t => ({ ...t, status: 'done' as const }))
    expect(getTaskStats(allDone).completionRate).toBe(100)
  })
})

// ─── isOverdue ─────────────────────────────────────────────────────────────────

describe('isOverdue', () => {
  it('returns true for past due date on non-done task', () => {
    const task: Task = { ...TASKS[0], dueDate: '2000-01-01' }
    expect(isOverdue(task)).toBe(true)
  })

  it('returns false for done task even with past due date', () => {
    const task: Task = { ...TASKS[2], dueDate: '2000-01-01' }
    expect(isOverdue(task)).toBe(false)
  })

  it('returns false when no due date', () => {
    expect(isOverdue(TASKS[0])).toBe(false)
  })

  it('returns false for future due date', () => {
    const task: Task = { ...TASKS[0], dueDate: '2099-01-01' }
    expect(isOverdue(task)).toBe(false)
  })
})
