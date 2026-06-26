import type { Page, Locator } from '@playwright/test'

/**
 * Page Object Model for the TaskMaster app.
 * Centralizes all selectors and actions — if the UI changes, update here only.
 */
export class TaskPage {
  readonly page: Page
  readonly titleInput: Locator
  readonly descInput: Locator
  readonly prioritySelect: Locator
  readonly dueDateInput: Locator
  readonly addButton: Locator
  readonly searchInput: Locator
  readonly statusFilter: Locator
  readonly priorityFilter: Locator
  readonly clearButton: Locator
  readonly taskList: Locator
  readonly statsRegion: Locator

  constructor(page: Page) {
    this.page = page
    this.titleInput = page.getByLabel('Title *')
    this.descInput = page.getByLabel('Description')
    this.prioritySelect = page.getByLabel('Priority')
    this.dueDateInput = page.getByLabel('Due Date')
    this.addButton = page.getByRole('button', { name: 'Add Task' })
    this.searchInput = page.getByRole('searchbox', { name: 'Search tasks' })
    this.statusFilter = page.getByLabel('Filter by status')
    this.priorityFilter = page.getByLabel('Filter by priority')
    this.clearButton = page.getByRole('button', { name: /clear/i })
    this.taskList = page.getByRole('list', { name: 'Task list' })
    this.statsRegion = page.getByRole('region', { name: 'Task statistics' })
  }

  async goto() {
    await this.page.goto('/')
    await this.page.waitForLoadState('networkidle')
  }

  async addTask(title: string, priority: 'low' | 'medium' | 'high' = 'medium') {
    await this.titleInput.fill(title)
    await this.prioritySelect.selectOption(priority)
    await this.addButton.click()
  }

  async deleteTask(title: string) {
    await this.page.getByRole('button', { name: `Delete task: ${title}` }).click()
  }

  async searchFor(query: string) {
    await this.searchInput.fill(query)
  }

  async clearSearch() {
    await this.searchInput.clear()
  }

  async filterByStatus(status: string) {
    await this.statusFilter.selectOption(status)
  }

  async filterByPriority(priority: string) {
    await this.priorityFilter.selectOption(priority)
  }

  async clearFilters() {
    await this.clearButton.click()
  }

  async getVisibleTaskCount(): Promise<number> {
    return this.taskList.locator('[data-testid="task-item"]').count()
  }

  async getVisibleTaskTitles(): Promise<string[]> {
    return this.taskList.locator('[data-testid="task-item"] h3').allTextContents()
  }

  async waitForTaskVisible(title: string) {
    await this.page.getByText(title).waitFor({ state: 'visible' })
  }

  async waitForTaskGone(title: string) {
    await this.page.getByText(title).waitFor({ state: 'hidden' })
  }
}
