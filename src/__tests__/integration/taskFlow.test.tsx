import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../App'

// These tests render the full App and test real user flows end-to-end
// MSW intercepts API calls — no real server needed

describe('Task management flow', () => {
  it('loads and displays initial tasks from the API', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByText('Set up project')).toBeInTheDocument()
      expect(screen.getByText('Write unit tests')).toBeInTheDocument()
      expect(screen.getByText('Review PR')).toBeInTheDocument()
    })
  })

  it('shows loading state before tasks arrive', () => {
    render(<App />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('displays correct total count in stats', async () => {
    render(<App />)
    await waitFor(() => screen.getByText('Set up project'))
    const statRegion = screen.getByRole('region', { name: /task statistics/i })
    expect(statRegion).toHaveTextContent('3') // 3 mock tasks
  })

  it('adds a new task and it appears in the list', async () => {
    const user = userEvent.setup()
    render(<App />)
    await waitFor(() => screen.getByText('Set up project'))

    await user.type(screen.getByLabelText(/title \*/i), 'Brand new task')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    await waitFor(() => {
      expect(screen.getByText('Brand new task')).toBeInTheDocument()
    })
  })

  it('total count increments after adding a task', async () => {
    const user = userEvent.setup()
    render(<App />)
    await waitFor(() => screen.getByText('Set up project'))

    await user.type(screen.getByLabelText(/title \*/i), 'Counter test task')
    await user.click(screen.getByRole('button', { name: /add task/i }))

    await waitFor(() => {
      const statRegion = screen.getByRole('region', { name: /task statistics/i })
      expect(statRegion).toHaveTextContent('4')
    })
  })

  it('filters the list when user types in search', async () => {
    const user = userEvent.setup()
    render(<App />)
    await waitFor(() => screen.getByText('Review PR'))

    await user.type(screen.getByRole('searchbox'), 'Review')

    expect(screen.getByText('Review PR')).toBeInTheDocument()
    expect(screen.queryByText('Set up project')).not.toBeInTheDocument()
  })

  it('restores all tasks when search is cleared', async () => {
    const user = userEvent.setup()
    render(<App />)
    await waitFor(() => screen.getByText('Set up project'))

    await user.type(screen.getByRole('searchbox'), 'Review')
    await user.click(screen.getByRole('button', { name: /clear/i }))

    expect(screen.getByText('Set up project')).toBeInTheDocument()
    expect(screen.getByText('Write unit tests')).toBeInTheDocument()
  })

  it('removes a task from the list after deletion', async () => {
    const user = userEvent.setup()
    render(<App />)
    await waitFor(() => screen.getByText('Review PR'))

    await user.click(screen.getByRole('button', { name: /delete task: review pr/i }))

    await waitFor(() => {
      expect(screen.queryByText('Review PR')).not.toBeInTheDocument()
    })
  })

  it('shows "No tasks found" when filter matches nothing', async () => {
    const user = userEvent.setup()
    render(<App />)
    await waitFor(() => screen.getByText('Set up project'))

    await user.type(screen.getByRole('searchbox'), 'zzz-impossible')

    expect(screen.getByText('No tasks found.')).toBeInTheDocument()
  })
})
