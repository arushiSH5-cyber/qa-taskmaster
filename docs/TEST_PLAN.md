# Test Plan — TaskMaster v1.0

## 1. Overview

| Field | Value |
|---|---|
| Project | TaskMaster |
| Version | 1.0 |
| Author | QA Engineer |
| Date | 2024-01-01 |
| Status | Active |

A **test plan** is a document that describes WHAT you will test, HOW you will test it, and WHAT TOOLS you will use. It's required before testing starts in any serious team.

---

## 2. Scope

### In Scope
- Task creation (form validation, API integration)
- Task filtering (search, status, priority)
- Task deletion
- Statistics display
- Accessibility (WCAG 2.1 AA)
- Cross-browser compatibility (Chrome, Firefox, Safari)
- Mobile responsiveness

### Out of Scope
- Backend server (mocked in tests)
- User authentication (not implemented in v1)
- Database persistence (in-memory only)

---

## 3. Test Types & Strategy

| Type | Tool | Count | When |
|---|---|---|---|
| Unit | Vitest | 30+ | Every commit |
| Component | Vitest + RTL | 25+ | Every commit |
| Integration | Vitest + MSW | 10+ | Every commit |
| API | Vitest + MSW | 8+ | Every commit |
| Smoke E2E | Playwright | 6 | Every build |
| Regression E2E | Playwright | 10+ | Every PR |
| Negative E2E | Playwright | 6 | Every PR |
| Accessibility | Playwright + axe | 5+ | Weekly |
| Visual Regression | Playwright | 10+ | On UI changes |

---

## 4. Test Environments

| Environment | URL | Purpose |
|---|---|---|
| Local | http://localhost:5173 | Developer testing |
| CI | GitHub Actions | Automated testing on PR |
| Staging | TBD | Pre-production validation |
| Production | TBD | Smoke tests post-deploy |

---

## 5. Entry & Exit Criteria

### Entry Criteria (when to START testing)
- Code is merged to the feature branch
- Build passes with no compile errors
- Smoke tests pass

### Exit Criteria (when testing is DONE)
- All test types pass
- Code coverage ≥ 80%
- No Priority 1 or Priority 2 bugs open
- Product Owner has signed off

---

## 6. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| MSW handlers don't match real API | Medium | High | Contract testing |
| Flaky E2E tests in CI | Medium | Medium | Retries + stable selectors |
| Coverage drops below threshold | Low | High | Coverage thresholds enforced |
| Cross-browser inconsistency | Low | Medium | Playwright multi-browser config |

---

## 7. Defect Severity Levels

| Severity | Description | Example |
|---|---|---|
| **P1 — Critical** | App unusable, data loss | App crashes on load |
| **P2 — High** | Major feature broken | Can't add tasks |
| **P3 — Medium** | Feature works but degraded | Filter misses some results |
| **P4 — Low** | Cosmetic / minor | Button color wrong |

> **Severity vs Priority (interview question!):**
> - **Severity** = how bad is the bug technically?
> - **Priority** = how urgently should it be fixed?
> A typo on the homepage is low severity but high priority (everyone sees it).
> A bug in admin-only reporting is high severity but lower priority.
