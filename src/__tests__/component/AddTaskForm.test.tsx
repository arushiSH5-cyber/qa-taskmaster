import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AddTaskForm } from '../../components/AddTaskForm'

describe('AddTaskForm', () => {
  // ── Renders correctly ────────────────────────────────────────────────────────
  it('renders all form fields', () => {
    render(<AddTaskForm onAdd={vi.fn()} />)
    expect(screen.getByLabelText(/title \*/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument()
  })

  it('priority defaults to medium', () => {
    render(<AddTaskForm onAdd={vi.fn()} />)
    expect(screen.getByLabelText(/priority/i)).toHaveValue('medium')
  })

  // ── Validation errors ────────────────────────────────────────────────────────
  it('shows required error when submitted with empty title', async () => {
    const user = userEvent.setup()
    render(<AddTaskForm onAdd={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /add task/i }))

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/required/i)).toBeInTheDocument()
  })

  it('shows length error for 2-character title', async () => {
    const user = userEvent.setup()
    render(<AddTaskForm onAdd={vi.fn()} />)

    await user.type(screen.getByLabelText(/title \*/i), 'ab')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    expect(screen.getByText(/3 characters/i)).toBeInTheDocument()
  })

  it('shows error for title over 100 characters', async () => {
    const user = userEvent.setup()
    render(<AddTaskForm onAdd={vi.fn()} />)

    await user.type(screen.getByLabelText(/title \*/i), 'a'.repeat(101))
    await user.click(screen.getByRole('button', { name: /add task/i }))

    expect(screen.getByText(/100 characters/i)).toBeInTheDocument()
  })

  it('sets aria-invalid on title input when error exists', async () => {
    const user = userEvent.setup()
    render(<AddTaskForm onAdd={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /add task/i }))

    expect(screen.getByLabelText(/title \*/i)).toHaveAttribute('aria-invalid', 'true')
  })

  // ── Successful submission ─────────────────────────────────────────────────────
  it('calls onAdd with correct data on valid submission', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<AddTaskForm onAdd={onAdd} />)

    await user.type(screen.getByLabelText(/title \*/i), 'My new task')
    await user.selectOptions(screen.getByLabelText(/priority/i), 'high')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    expect(onAdd).toHaveBeenCalledOnce()
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({
      title: 'My new task',
      priority: 'high',
      status: 'todo',
    }))
  })

  it('clears all fields after successful submission', async () => {
    const user = userEvent.setup()
    render(<AddTaskForm onAdd={vi.fn()} />)

    await user.type(screen.getByLabelText(/title \*/i), 'Task to clear')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    expect(screen.getByLabelText(/title \*/i)).toHaveValue('')
    expect(screen.getByLabelText(/priority/i)).toHaveValue('medium')
  })

  it('does not call onAdd when validation fails', async () => {
    const onAdd = vi.fn()
    const user = userEvent.setup()
    render(<AddTaskForm onAdd={onAdd} />)

    await user.click(screen.getByRole('button', { name: /add task/i }))

    expect(onAdd).not.toHaveBeenCalled()
  })

  it('clears previous errors after a successful submission', async () => {
    const user = userEvent.setup()
    render(<AddTaskForm onAdd={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /add task/i }))
    expect(screen.getByRole('alert')).toBeInTheDocument()

    await user.type(screen.getByLabelText(/title \*/i), 'Now valid title')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
