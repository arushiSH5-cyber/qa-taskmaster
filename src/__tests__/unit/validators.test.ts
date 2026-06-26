import { describe, it, expect } from 'vitest'
import { validateTask } from '../../utils/validators'

describe('validateTask', () => {
  // ── Happy path (positive tests) ──────────────────────────────────────────────
  it('passes with a valid title', () => {
    const result = validateTask({ title: 'Valid task title' })
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('passes with all fields valid', () => {
    const result = validateTask({ title: 'Valid', description: 'Some desc', dueDate: '2099-12-31' })
    expect(result.isValid).toBe(true)
  })

  // ── Title validation (negative / boundary tests) ─────────────────────────────
  it('fails when title is empty', () => {
    const result = validateTask({ title: '' })
    expect(result.isValid).toBe(false)
    expect(result.errors.title).toMatch(/required/i)
  })

  it('fails when title is only whitespace', () => {
    const result = validateTask({ title: '   ' })
    expect(result.isValid).toBe(false)
  })

  it('fails for 2-character title (boundary: min is 3)', () => {
    expect(validateTask({ title: 'ab' }).isValid).toBe(false)
  })

  it('passes for exactly 3-character title (boundary: min is 3)', () => {
    expect(validateTask({ title: 'abc' }).isValid).toBe(true)
  })

  it('passes for exactly 100-character title (boundary: max is 100)', () => {
    expect(validateTask({ title: 'a'.repeat(100) }).isValid).toBe(true)
  })

  it('fails for 101-character title (boundary: max is 100)', () => {
    const result = validateTask({ title: 'a'.repeat(101) })
    expect(result.isValid).toBe(false)
    expect(result.errors.title).toMatch(/100 characters/i)
  })

  // ── Description validation ───────────────────────────────────────────────────
  it('passes with no description', () => {
    expect(validateTask({ title: 'Valid title' }).isValid).toBe(true)
  })

  it('fails when description exceeds 500 characters', () => {
    const result = validateTask({ title: 'Valid', description: 'x'.repeat(501) })
    expect(result.isValid).toBe(false)
    expect(result.errors.description).toBeTruthy()
  })

  // ── Date validation ──────────────────────────────────────────────────────────
  it('passes with valid ISO date', () => {
    expect(validateTask({ title: 'Valid', dueDate: '2099-06-15' }).isValid).toBe(true)
  })

  it('fails with invalid date string', () => {
    const result = validateTask({ title: 'Valid', dueDate: 'not-a-date' })
    expect(result.isValid).toBe(false)
    expect(result.errors.dueDate).toBeTruthy()
  })

  // ── Multiple errors at once ──────────────────────────────────────────────────
  it('collects multiple errors simultaneously', () => {
    const result = validateTask({ title: '', description: 'x'.repeat(501) })
    expect(result.isValid).toBe(false)
    expect(Object.keys(result.errors).length).toBeGreaterThanOrEqual(2)
  })
})
