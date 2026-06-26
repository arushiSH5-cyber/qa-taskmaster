import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterBar } from '../../components/FilterBar'

describe('FilterBar', () => {
  it('renders search input, status and priority dropdowns', () => {
    render(<FilterBar filter={{}} onFilterChange={vi.fn()} />)
    expect(screen.getByRole('searchbox', { name: /search tasks/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /status/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /priority/i })).toBeInTheDocument()
  })

  it('reflects existing filter values as controlled inputs', () => {
    render(<FilterBar filter={{ search: 'hello', status: 'todo' }} onFilterChange={vi.fn()} />)
    expect(screen.getByRole('searchbox')).toHaveValue('hello')
    expect(screen.getByRole('combobox', { name: /status/i })).toHaveValue('todo')
  })

  it('calls onFilterChange with the full search value', () => {
    // Use fireEvent.change (not userEvent.type) because FilterBar is a
    // controlled input — the parent owns the value. Typing char-by-char
    // in a controlled input without state resets it each time, so we fire
    // a single change event with the full value instead.
    const onChange = vi.fn()
    render(<FilterBar filter={{}} onFilterChange={onChange} />)

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'design' } })

    expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ search: 'design' }))
  })

  it('calls onFilterChange with selected status', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<FilterBar filter={{}} onFilterChange={onChange} />)

    await user.selectOptions(screen.getByRole('combobox', { name: /status/i }), 'done')

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ status: 'done' }))
  })

  it('calls onFilterChange with selected priority', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<FilterBar filter={{}} onFilterChange={onChange} />)

    await user.selectOptions(screen.getByRole('combobox', { name: /priority/i }), 'high')

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ priority: 'high' }))
  })

  it('calls onFilterChange with empty object when Clear is clicked', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<FilterBar filter={{ status: 'todo', priority: 'high', search: 'test' }} onFilterChange={onChange} />)

    await user.click(screen.getByRole('button', { name: /clear/i }))

    expect(onChange).toHaveBeenCalledWith({})
  })

  it('preserves existing filters when only one field changes', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<FilterBar filter={{ status: 'todo' }} onFilterChange={onChange} />)

    await user.selectOptions(screen.getByRole('combobox', { name: /priority/i }), 'high')

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ status: 'todo', priority: 'high' }))
  })
})
