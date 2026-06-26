import { test, expect } from '@playwright/test'
import { TaskPage } from './pom/TaskPage'

// NEGATIVE TESTS — Deliberately use bad input to confirm the app handles it.
// "What happens when things go wrong?" is a core QA interview question.

test.describe('Negative Tests — Bad Input & Edge Cases', () => {
  test('empty title shows required error and blocks submission', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()
    const before = await taskPage.getVisibleTaskCount()

    await taskPage.addButton.click()

    await expect(page.getByRole('alert')).toBeVisible()
    const after = await taskPage.getVisibleTaskCount()
    expect(after).toBe(before)
  })

  test('title with only spaces is rejected', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()

    await taskPage.titleInput.fill('     ')
    await taskPage.addButton.click()

    await expect(page.getByRole('alert')).toBeVisible()
  })

  test('2-character title (below 3-char minimum) is rejected', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()

    await taskPage.titleInput.fill('ab')
    await taskPage.addButton.click()

    await expect(page.getByText(/3 characters/i)).toBeVisible()
  })

  test('101-character title (above 100-char max) is rejected', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()

    await taskPage.titleInput.fill('a'.repeat(101))
    await taskPage.addButton.click()

    await expect(page.getByText(/100 characters/i)).toBeVisible()
  })

  test('search with impossible string shows empty state, not a crash', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()

    await taskPage.searchFor('xyzxyzxyz-will-never-match-anything')

    await expect(page.getByText('No tasks found.')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'TaskMaster' })).toBeVisible()
  })

  test('rapid repeated clicking of Add does not duplicate tasks', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()

    await taskPage.titleInput.fill('Rapid click test')
    await taskPage.addButton.click()
    await taskPage.addButton.click()
    await taskPage.addButton.click()

    await taskPage.waitForTaskVisible('Rapid click test')
    await taskPage.clearFilters()
    const titles = await taskPage.getVisibleTaskTitles()
    const count = titles.filter(t => t === 'Rapid click test').length
    expect(count).toBe(1)
  })

  test('app stays functional after deleting all tasks', async ({ page }) => {
    const taskPage = new TaskPage(page)
    await taskPage.goto()

    // Delete all visible tasks one by one
    const titles = await taskPage.getVisibleTaskTitles()
    for (const title of titles) {
      await taskPage.deleteTask(title)
      await taskPage.waitForTaskGone(title)
    }

    await expect(page.getByText('No tasks found.')).toBeVisible()
    // App should still be usable
    await expect(taskPage.addButton).toBeVisible()
    await taskPage.addTask('Recovered task')
    await taskPage.waitForTaskVisible('Recovered task')
  })
})
