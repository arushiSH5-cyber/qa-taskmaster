import { test, expect } from '@playwright/test'
import { TaskPage } from './pom/TaskPage'

// SMOKE TESTS — Run these first on every build.
// If these fail, stop immediately. No point running deeper tests.

test.describe('Smoke Tests', () => {
  test('app loads without crashing', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()
    await expect(page.getByRole('heading', { name: 'TaskMaster' })).toBeVisible()
  })

  test('page has correct title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/TaskMaster/)
  })

  test('add task form is visible', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()
    await expect(taskPage.addButton).toBeVisible()
    await expect(taskPage.titleInput).toBeVisible()
  })

  test('task list is visible after load', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()
    await expect(taskPage.taskList).toBeVisible()
  })

  test('at least one task is shown on load', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()
    const count = await taskPage.getVisibleTaskCount()
    expect(count).toBeGreaterThan(0)
  })

  test('filter controls are visible', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()
    await expect(taskPage.searchInput).toBeVisible()
    await expect(taskPage.statusFilter).toBeVisible()
  })
})
