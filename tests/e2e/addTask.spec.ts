import { test, expect } from '@playwright/test'
import { TaskPage } from './pom/TaskPage'

test.describe('Add Task — E2E', () => {
  test('adds a task and shows it in the list', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()
    const before = await taskPage.getVisibleTaskCount()

    await taskPage.addTask('My E2E task', 'high')

    await taskPage.waitForTaskVisible('My E2E task')
    const after = await taskPage.getVisibleTaskCount()
    expect(after).toBe(before + 1)
  })

  test('task shows correct priority badge after add', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()
    await taskPage.addTask('High priority E2E task', 'high')

    await taskPage.waitForTaskVisible('High priority E2E task')
    const taskItem = page.locator('[data-testid="task-item"]').filter({ hasText: 'High priority E2E task' })
    await expect(taskItem.getByText('high')).toBeVisible()
  })

  test('form clears after successful add', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()
    await taskPage.addTask('Cleared form task')

    await expect(taskPage.titleInput).toHaveValue('')
    await expect(taskPage.prioritySelect).toHaveValue('medium')
  })

  test('shows validation error for empty title', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()
    await taskPage.addButton.click()

    await expect(page.getByRole('alert')).toBeVisible()
    await expect(page.getByText(/required/i)).toBeVisible()
  })

  test('does not add task when title is only 2 characters', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()
    const before = await taskPage.getVisibleTaskCount()

    await taskPage.titleInput.fill('ab')
    await taskPage.addButton.click()

    const after = await taskPage.getVisibleTaskCount()
    expect(after).toBe(before)
  })
})
