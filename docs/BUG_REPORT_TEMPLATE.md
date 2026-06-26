# Bug Report Template

> Copy this template for every bug you find. A good bug report is so clear that a developer can reproduce it WITHOUT asking you any questions.

---

## Bug Report #[NUMBER]

**Title:** [Short, specific — "Add task form accepts empty title and creates blank task"]

**Reporter:** [Your name]  
**Date:** [YYYY-MM-DD]  
**Environment:** [Browser + OS + App version, e.g. "Chrome 131 / macOS 15 / TaskMaster v1.0"]  

---

### Severity
- [ ] P1 — Critical (app unusable)
- [ ] P2 — High (major feature broken)
- [ ] P3 — Medium (degraded experience)
- [ ] P4 — Low (cosmetic)

### Priority
- [ ] Must fix now
- [ ] Fix in this sprint
- [ ] Fix in next sprint
- [ ] Nice to have

---

### Summary
[One sentence: what is broken]

### Steps to Reproduce
1. Open the app at http://localhost:5173
2. Click the "Add Task" button without filling in the title
3. [Exact steps, numbered]

### Expected Result
[What SHOULD happen — be specific]
> e.g. "Form should show a validation error 'Title is required' and NOT submit"

### Actual Result
[What ACTUALLY happened]
> e.g. "Form submits successfully and an empty task appears in the list"

### Screenshot / Video
[Attach here]

### Console Errors
```
[Paste any browser console errors here]
```

### Additional Notes
[Any other context — does it happen always or sometimes? Only on mobile? Only in Firefox?]

---

## Example Filled Bug Report

**Title:** Add task with 2-character title creates a task (should be rejected)

**Reporter:** Arushi  
**Date:** 2024-01-15  
**Environment:** Chrome 131 / macOS 15 / TaskMaster v1.0  

**Severity:** P3 — Medium  
**Priority:** Fix in this sprint  

**Summary:** The form accepts task titles shorter than 3 characters, violating the validation rule.

**Steps to Reproduce:**
1. Open http://localhost:5173
2. Type "ab" in the Title field (only 2 characters)
3. Click "Add Task"

**Expected Result:** Validation error appears: "Title must be at least 3 characters". Task is NOT created.

**Actual Result:** Task is created with title "ab" and appears in the task list with no error shown.

**Screenshot:** [attached]

**Console Errors:** None

**Additional Notes:** Happens on all browsers tested. The 100-character max limit seems to work correctly — only the minimum is broken.
