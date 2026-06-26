export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export function validateTask(data: {
  title?: string
  description?: string
  dueDate?: string
}): ValidationResult {
  const errors: Record<string, string> = {}

  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required'
  } else if (data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters'
  } else if (data.title.trim().length > 100) {
    errors.title = 'Title must be under 100 characters'
  }

  if (data.description && data.description.length > 500) {
    errors.description = 'Description must be under 500 characters'
  }

  if (data.dueDate) {
    const due = new Date(data.dueDate)
    if (isNaN(due.getTime())) {
      errors.dueDate = 'Invalid date format'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
