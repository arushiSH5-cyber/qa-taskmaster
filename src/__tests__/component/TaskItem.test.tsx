import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskItem } from '../../components/TaskItem'
import type { Task } from '../../types'

const TASK: Task = {
  id: '1',
  title: 'Write unit tests',
  description: 'Cover all edge cases',
  priority: 'high',
  status: 'todo',
  createdAt: '2024-01-01',
}

describe('TaskItem', () => {
  // ── Renders correctly ────────────────────────────────────────────────────────
  it('renders the task title', () => {
    render(<TaskItem task={TASK} onStatusChange={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Write unit tests')).toBeInTheDocument()
  })

  it('renders the description', () => {
    render(<TaskItem task={TASK} onStatusChange={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Cover all edge cases')).toBeInTheDocument()
  })

  it('renders priority badge', () => {
    render(<TaskItem task={TASK} onStatusChange={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('high')).toBeInTheDocument()
  })

  it('does not render description paragraph when description is empty', () => {
    render(<TaskItem task={{ ...TASK, description: '' }} onStatusChange={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.queryByText('Cover all edge cases')).not.toBeInTheDocument()
  })

  it('renders due date when provided', () => {
    render(<TaskItem task={{ ...TASK, dueDate: '2099-12-31' }} onStatusChange={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/2099-12-31/)).toBeInTheDocument()
  })

  // ── Interactions ─────────────────────────────────────────────────────────────
  it('calls onDelete with the task id when Delete is clicked', async () => {
    const onDelete = vi.fn()
    const user = userEvent.setup()
    render(<TaskItem task={TASK} onStatusChange={vi.fn()} onDelete={onDelete} />)

    await user.click(screen.getByRole('button', { name: /delete task: write unit tests/i }))

    expect(onDelete).toHaveBeenCalledOnce()
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('calls onStatusChange with id and new status when dropdown changes', async () => {
    const onStatusChange = vi.fn()
    const user = userEvent.setup()
    render(<TaskItem task={TASK} onStatusChange={onStatusChange} onDelete={vi.fn()} />)

    await user.selectOptions(screen.getByRole('combobox', { name: /change task status/i }), 'done')

    expect(onStatusChange).toHaveBeenCalledWith('1', 'done')
  })

  it('does not call onDelete when only status changes', async () => {
    const onDelete = vi.fn()
    const user = userEvent.setup()
    render(<TaskItem task={TASK} onStatusChange={vi.fn()} onDelete={onDelete} />)

    await user.selectOptions(screen.getByRole('combobox', { name: /change task status/i }), 'done')

    expect(onDelete).not.toHaveBeenCalled()
  })

  // ── Visual states ────────────────────────────────────────────────────────────
  it('applies line-through class on done tasks', () => {
    render(<TaskItem task={{ ...TASK, status: 'done' }} onStatusChange={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Write unit tests')).toHaveClass('line-through')
  })

  it('does not apply line-through on todo tasks', () => {
    render(<TaskItem task={TASK} onStatusChange={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Write unit tests')).not.toHaveClass('line-through')
  })

  // ── Accessibility ────────────────────────────────────────────────────────────
  it('has accessible article role with label', () => {
    render(<TaskItem task={TASK} onStatusChange={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByRole('article', { name: 'Task: Write unit tests' })).toBeInTheDocument()
  })

  it('delete button has descriptive aria-label', () => {
    render(<TaskItem task={TASK} onStatusChange={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Delete task: Write unit tests' })).toBeInTheDocument()
  })
})
