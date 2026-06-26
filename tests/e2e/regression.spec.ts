import { test, expect } from '@playwright/test'
import { TaskPage } from './pom/TaskPage'

// REGRESSION SUITE — Re-run after every code change to confirm nothing broke.
// Each test here represents a feature that was once verified as working.

test.describe('Regression Suite', () => {
  test('search filters task list in real time', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()

    await taskPage.searchFor('Set up')

    await expect(page.getByText('Set up project')).toBeVisible()
    await expect(page.getByText('Review PR')).not.toBeVisible()
  })

  test('clearing search restores all tasks', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()
    const initial = await taskPage.getVisibleTaskCount()

    await taskPage.searchFor('zzz-no-match')
    await expect(page.getByText('No tasks found.')).toBeVisible()

    await taskPage.clearFilters()
    const restored = await taskPage.getVisibleTaskCount()
    expect(restored).toBe(initial)
  })

  test('status filter shows only matching tasks', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()

    await taskPage.filterByStatus('done')
    const titles = await taskPage.getVisibleTaskTitles()
    expect(titles).toContain('Set up project') // status: done in mock data
    expect(titles).not.toContain('Review PR') // status: todo
  })

  test('priority filter shows only matching tasks', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()

    await taskPage.filterByPriority('medium')
    const titles = await taskPage.getVisibleTaskTitles()
    expect(titles).toContain('Review PR') // priority: medium
    expect(titles).not.toContain('Set up project') // priority: high
  })

  test('deleting a task removes it permanently from the list', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()
    const before = await taskPage.getVisibleTaskCount()

    await taskPage.deleteTask('Review PR')

    await taskPage.waitForTaskGone('Review PR')
    const after = await taskPage.getVisibleTaskCount()
    expect(after).toBe(before - 1)
  })

  test('task stats update when task is added', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()

    const statsBefore = await taskPage.statsRegion.textContent()
    await taskPage.addTask('Stats test task')
    await taskPage.waitForTaskVisible('Stats test task')

    const statsAfter = await taskPage.statsRegion.textContent()
    expect(statsAfter).not.toBe(statsBefore)
  })

  test('tasks are sorted high priority first', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()

    const titles = await taskPage.getVisibleTaskTitles()
    const firstTaskItem = page.locator('[data-testid="task-item"]').first()
    await expect(firstTaskItem.getByText('high')).toBeVisible()
    expect(titles.length).toBeGreaterThan(0)
  })

  test('completion rate is displayed', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()
    await expect(page.getByText(/completion rate/i)).toBeVisible()
  })
})
