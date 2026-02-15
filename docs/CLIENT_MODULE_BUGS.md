# Client Module – Bug Report

> **Document Purpose:** Track all bugs in the Client module for project cost, project progress, and related functionality.

**Last Updated:** February 16, 2025  
**Status:** Most bugs fixed. See "Fix Status" section below.

---

## Fix Status (February 16, 2025)

| Bug # | Status | Notes |
|-------|--------|-------|
| 1 | ✅ Fixed | Use backend remainingAmount; prefer financialDetails.totalCost |
| 2 | ⚠️ Mitigated | Backend recalculates financials in getClientProjectById |
| 3 | ✅ Fixed | `assignedTeam?.length ?? 0` |
| 4 | ✅ Fixed | Real API: clientRequestService.respondToRequest |
| 5 | ✅ Fixed | Guard against NaN; milestones.length check |
| 6 | ✅ Fixed | Label changed to "Upcoming" |
| 7 | ✅ Fixed | Limit increased to 100 for upcoming payments |
| 8 | ✅ Fixed | Use updatedAt \|\| lastUpdate with fallback |
| 9 | ✅ Fixed | financialDetails?.totalCost ?? budget |
| 10 | ✅ Fixed | in-progress counted as active |
| 11 | ✅ Fixed | Simplified milestone progress logic |
| 12 | Deferred | Requires backend Payment/PaymentReceipt reconciliation |
| 13 | ✅ Fixed | More robust response normalization |
| 14 | ✅ Fixed | avgProgress clamped; in-progress in stats |
| 15 | Documented | TODO: Backend API needed for milestone comments |

---

## Table of Contents
1. [Major Bugs](#major-bugs)
2. [Moderate Bugs](#moderate-bugs)
3. [Minor Bugs](#minor-bugs)
4. [Summary Table](#summary-table)
5. [Affected Files](#affected-files)

---

## Major Bugs

### Bug #1: Project Cost / Total Paid – Double-Counting Risk

**Location:** `frontend/src/modules/dev/DEV-pages/Client-pages/Client_project_detail.jsx`  
**Lines:** 80-95, 390-431

**Issue:**  
The total paid is calculated as:
```javascript
totalPaidAmount = advanceReceived + installmentPaidAmount + paymentRecordsPaid
```

The `advanceReceived` field may already include paid installments and approved PaymentReceipts (when updated by `projectFinancialHelper.recalculateProjectFinancials`). Adding `installmentPaidAmount` again would **double-count** paid installments.

**Impact:** Total paid can be overstated and remaining amount understated.

**Fix:**  
- Either use backend-calculated `advanceReceived` and do NOT add `installmentPaidAmount` separately,  
- Or ensure `advanceReceived` represents only the initial advance and is never overwritten by recalculations when used on the client.

---

### Bug #2: Payment Model vs PaymentReceipt Model – Inconsistent Sources

**Location:**  
- `Client_project_detail.jsx`  
- `backend/controllers/clientWalletController.js`  
- `backend/utils/projectFinancialHelper.js`

**Issue:**  
Two parallel payment systems exist:
- **Payment** model – milestone-based/client payments (from `clientPaymentService.getProjectPayments`)
- **PaymentReceipt** model – admin-approved receipts (used in `projectFinancialHelper`)

Client project detail uses Payment records (`status === 'completed'`) while the backend financial logic uses PaymentReceipt. If the same physical payment creates both a Payment record and a PaymentReceipt, amounts could be double-counted.

**Impact:** Incorrect totals when both sources represent the same payment.

**Fix:**  
- Unify financial calculations to use a single source of truth (either Payment or PaymentReceipt).  
- Document when each is used and ensure no overlap in what gets counted.

---

### Bug #3: `assignedTeam.length` Without Null Check – Runtime Error

**Location:**  
- `frontend/src/modules/dev/DEV-pages/Client-pages/Client_dashboard.jsx` (lines 307, 384)  
- `frontend/src/modules/dev/DEV-pages/Client-pages/Client_projects.jsx` (lines 322, 381)

**Issue:**  
`project.assignedTeam.length` is used without checking if `assignedTeam` exists. If the backend doesn't populate it or the project has no assigned team, `project.assignedTeam` is `undefined`, and accessing `.length` throws a runtime error.

**Fix:**
```javascript
project.assignedTeam?.length || 0
```

---

### Bug #4: Request Response Not Persisted – Simulated API Call

**Location:** `frontend/src/modules/dev/DEV-pages/Client-pages/Client_dashboard.jsx`  
**Lines:** 263-299

**Issue:**  
`handleConfirmResponse` uses `setTimeout` to simulate an API call. There is no actual backend API invoked for approving, rejecting, or requesting changes on team requests.

**Impact:** Request responses are never persisted; they only update local state and are lost on refresh.

**Fix:**  
- Implement a backend API endpoint for client request responses.  
- Replace the `setTimeout` with a real API call to that endpoint.

---

### Bug #5: Project Progress Can Be `NaN`

**Location:** `frontend/src/modules/dev/DEV-pages/Client-pages/Client_project_detail.jsx`  
**Lines:** 108-114

**Issue:**  
```javascript
projectProgress = Math.round((completedMilestones / milestones.length) * 100)
```
When `milestones.length === 0`, this evaluates to `0/0` → `NaN`.

**Fix:**
```javascript
projectProgress = milestones.length > 0 
  ? Math.round((completedMilestones / milestones.length) * 100) 
  : 0
```

---

## Moderate Bugs

### Bug #6: "Due Soon" Label Misleading

**Location:** `frontend/src/modules/dev/DEV-pages/Client-pages/Client_wallet.jsx`  
**Lines:** 428, 494, 505

**Issue:**  
The UI label says "Next 30 days" for upcoming amounts, but `getUpcomingPayments` returns all upcoming payments without filtering by 30 days.

**Impact:** Users may assume amounts shown are only due in the next 30 days when they may be due much later.

**Fix:**  
- Either filter upcoming payments to the next 30 days in the API or frontend,  
- Or change the label to something like "Upcoming" or "Scheduled."

---

### Bug #7: `upcomingAmount` Underestimated

**Location:**  
- `frontend/src/modules/dev/DEV-pages/Client-pages/Client_wallet.jsx` (lines 188-192, 35-56)

**Issue:**  
`totals.upcomingAmount` sums `upcomingPayments`, which comes from `getUpcomingPayments`. The backend limits results (e.g., default 10). Only the first N upcoming payments are summed, not the total.

**Impact:** Total "Due Soon" or upcoming amount can be lower than actual.

**Fix:**  
- Add a dedicated API for total upcoming amount, or  
- Ensure the upcoming payments endpoint returns all relevant payments when used for summary totals.

---

### Bug #8: `project.lastUpdate` / Invalid Date

**Location:** `frontend/src/modules/dev/DEV-pages/Client-pages/Client_projects.jsx`  
**Lines:** 361-365, 420-424

**Issue:**  
Uses `project.lastUpdate`, but the backend returns `updatedAt`. If `lastUpdate` is undefined, `new Date(undefined)` produces Invalid Date.

**Fix:**
```javascript
project.updatedAt || project.lastUpdate
```
Plus a fallback when both are missing (e.g., `'N/A'` or current date).

---

### Bug #9: Total Cost Source Inconsistency

**Location:** `frontend/src/modules/dev/DEV-pages/Client-pages/Client_project_detail.jsx`  
**Line:** 80

**Issue:**  
Uses `project.budget || project.financialDetails?.totalCost`. The canonical project cost from conversion is in `financialDetails.totalCost`; `budget` may be outdated or different.

**Fix:**
```javascript
project.financialDetails?.totalCost || project.budget || 0
```

---

### Bug #10: `in-progress` Not Counted as Active

**Location:**  
- `frontend/src/modules/dev/DEV-pages/Client-pages/Client_projects.jsx` (lines 79, 274)  
- `backend/controllers/clientProjectController.js`

**Issue:**  
Statistics count `p.status === 'active'` only. Project schema includes `in-progress`, which is not treated as active.

**Fix:**  
Count both: `['active', 'in-progress'].includes(p.status)` or equivalent.

---

## Minor Bugs

### Bug #11: Milestone Progress Fallback Redundancy

**Location:** `frontend/src/modules/dev/DEV-pages/Client-pages/Client_project_detail.jsx`  
**Lines:** 164-167

**Issue:**  
The else branch assigns `milestone.progress || 0` again, which is redundant with the earlier logic.

---

### Bug #12: Duplicate Keys / Double Entry in Payment History

**Location:** `frontend/src/modules/dev/DEV-pages/Client-pages/Client_project_detail.jsx`  
**Lines:** 233-248

**Issue:**  
Payment history includes advance payment and paid installments. When an installment is paid, it might also create a Payment record. Both could appear in the history, causing duplicate entries.

---

### Bug #13: Response Normalization Assumptions

**Location:** `frontend/src/modules/dev/DEV-services/clientWalletService.js`  
**Lines:** 15-25

**Issue:**  
`normalizeSummaryResponse` assumes multiple response shapes. If the API structure changes, parsing could break.

---

### Bug #14: Statistics `avgProgress` May Be Stale

**Location:** `backend/controllers/clientProjectController.js`  
**Lines:** 273-274

**Issue:**  
`avgProgress` is computed from `project.progress` in the DB. Progress is recalculated per request in `getClientProjects`, but the statistics endpoint does not use the same logic and may use outdated values.

---

### Bug #15: Milestone Comments Not Persisted

**Location:** `frontend/src/modules/dev/DEV-pages/Client-pages/Client_milestone_detail.jsx`  
**Lines:** 232-267

**Issue:**  
Comments are added only to local state. There is no API call; a TODO in the code notes that a backend API is missing.

**Impact:** Comments are lost on page reload.

---

## Summary Table

| # | Severity | Category           | Description                                           |
|---|----------|--------------------|-------------------------------------------------------|
| 1 | MAJOR    | Cost miscalculation| Double-counting risk (advanceReceived + installments) |
| 2 | MAJOR    | Cost miscalculation| Payment vs PaymentReceipt source inconsistency        |
| 3 | MAJOR    | Crash              | `assignedTeam.length` without null check              |
| 4 | MAJOR    | Data persistence   | Request responses not persisted (simulated API)       |
| 5 | MAJOR    | Progress           | Project progress NaN when milestones array is empty   |
| 6 | MODERATE | UX/Label           | "Due Soon" implies 30 days, data is unfiltered        |
| 7 | MODERATE | Cost miscalculation| `upcomingAmount` limited by pagination                |
| 8 | MODERATE | Date handling      | Invalid Date when `lastUpdate` is undefined           |
| 9 | MODERATE | Cost source        | Prefer `financialDetails.totalCost` over `budget`     |
| 10| MODERATE | Statistics         | `in-progress` not counted as active                   |
| 11| MINOR    | Code quality       | Redundant milestone progress logic                    |
| 12| MINOR    | Data consistency   | Possible duplicate entries in payment history         |
| 13| MINOR    | Code quality       | Fragile response normalization                        |
| 14| MINOR    | Statistics         | Stale `avgProgress` in statistics                     |
| 15| MINOR    | Persistence        | Milestone comments not persisted                      |

---

## Affected Files

| File | Bugs |
|------|------|
| `Client_project_detail.jsx` | 1, 2, 5, 9, 11, 12 |
| `Client_dashboard.jsx` | 3, 4 |
| `Client_projects.jsx` | 3, 8, 10 |
| `Client_wallet.jsx` | 6, 7 |
| `Client_milestone_detail.jsx` | 15 |
| `clientWalletService.js` | 13 |
| `clientProjectController.js` (backend) | 14 |
| `clientWalletController.js` (backend) | 2 |
| `projectFinancialHelper.js` (backend) | 2 |

---

## Notes

- When fixing cost-related bugs (1, 2, 7, 9), confirm the intended source of truth for project totals (Payment, PaymentReceipt, installments, advance).
- Consider adding unit or integration tests for financial calculations and progress logic.
- After fixes, update this document and mark items as resolved with the commit or PR reference.
