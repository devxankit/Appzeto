# Sales Module - Critical Bug Audit Report

**Date:** Feb 2026  
**Scope:** Frontend (SL-*) + Backend (salesController, sales routes)

---

## 1. CALCULATION & AMOUNT PARSING BUGS

### 1.1 Inconsistent amount parsing (comma-separated numbers)
| File | Issue | Impact |
|------|-------|--------|
| **SL_quotation_sent.jsx** (L171, L182) | `parseFloat(conversionFormData.totalCost)` and `parseFloat(conversionFormData.advanceReceived)` | Fails for "10,000" → returns 10 instead of 10000 |
| **SL_demo_sent.jsx** (L152, L163) | Same as above | Same bug |
| **SL_ClientProfile.jsx** (L353) | `parseFloat(increaseAmount)` | Same for cost increase input |
| **SL_payments_recovery.jsx** (L126) | `parseInt(requestAmount)` in WhatsApp message | "10,000" → 10 only |

**Fix:** Use `parseAmount` helper: `Math.round(Number(String(val||'').replace(/,/g,''))||0)` (as in SL_leadProfile).

### 1.2 Conversion payload inconsistency (totalCost/advanceReceived)
| File | Issue | Impact |
|------|-------|--------|
| **SL_quotation_sent.jsx**, **SL_demo_sent.jsx** | Sends `totalCostNum` (float) and `advanceReceived` as float | Backend expects whole numbers; SL_leadProfile uses `Math.round()`. Inconsistent. |
| **Backend convertLeadToClient** (L3810-3812) | `parseFloat(req.body.totalCost)` | Accepts floats; stored as Number. Should round for consistency. |

**Fix:** Use `Math.round(parseAmount(val))` for totalCost and advanceReceived in quotation_sent, demo_sent; align backend to round.

---

## 2. TOTAL LEADS CALCULATION (Backend - CRITICAL)

### 2.1 Double-counting in getSalesDashboardStats
**File:** `backend/controllers/salesController.js` (L1722-1724)

```js
const totalLeads = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
```

**Issue:** 
- `connected` is overwritten to = count of ALL leads with profile not in (converted, lost, not_interested, not_picked). This includes hot, quotation_sent, demo_requested, etc.
- Other status counts (quotation_sent, hot, followup, etc.) are also in statusCounts.
- Summing all statusCounts = connected (broad) + quotation_sent + hot + ... = **double/triple counting** of the same leads.
- `totalLeads` inflates incorrectly.

**Fix:** Use actual lead count:
```js
const totalLeads = await Lead.countDocuments({ assignedTo: new mongoose.Types.ObjectId(salesId) });
```
(or use the pre-computed `totalLeadsCount` at L1585 if available).

---

## 3. CATEGORY ID LOOKUP BUG

### 3.1 cat.id vs cat._id
| File | Issue | Impact |
|------|-------|--------|
| **SL_demo_request.jsx** (L131) | `leadCategories.find(cat => cat.id === categoryId)` | Lead categories from API use `_id`, not `id`. Lookup fails. |
| **SL_connectedLeads.jsx** (L128) | Same | Same bug |

**Fix:** Use `cat._id` or `(cat._id || cat.id) === categoryId`.

---

## 4. SL_PROFILE - DATA SOURCE MISMATCH

### 4.1 dashboardStats structure
**File:** `SL_profile.jsx` (L122-123)

```js
const statusCounts = dashboardStats?.data?.statusCounts || {}
const totalLeads = dashboardStats?.data?.totalLeads || 0
```

**Issue:** `salesAnalyticsService.getDashboardStats()` returns raw API response. Backend returns `{ success, data: { statusCounts, totalLeads } }`. So `dashboardStats.data` is correct. But if backend ever returns a different shape (e.g. `{ statusCounts, totalLeads }` at top level), it would break. Ensure API contract is documented.

**Minor:** Catch returns `{ totalDue: 0 }` for getReceivableStats – correct since only `totalDue` is used.

---

## 5. FUNNEL/CONVERSION RATE CALCULATION

### 5.1 Redundant recalculation
**File:** `SL_dashboard.jsx` (L1127, L1136)

```js
{totalLeads ? Math.round(((Number((funnelData.find(f=>f.key==='converted')?.amount||'0').split(' ')[0]))/totalLeads)*100) : 0}%
```

**Issue:** 
- `funnelData` already has `value` (percentage) set when processing dashboard stats.
- Re-parsing `amount` ("5 leads") with `.split(' ')[0]` is fragile – any format change breaks it.
- Should use `funnelData.find(f=>f.key==='converted')?.value ?? 0` for consistency.

---

## 6. FOLLOW-UP DATE SORTING

### 6.1 Missing scheduledTime
**File:** `SL_followup.jsx` (L125-128)

```js
const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime || '00:00'}`)
```

**Issue:** If `scheduledTime` is undefined/null, `'00:00'` is used – OK. But if `scheduledDate` is ISO string with time (e.g. "2026-02-16T12:00:00.000Z"), then `"2026-02-16T12:00:00.000ZT00:00"` would be invalid. Consider normalizing: if `scheduledDate` includes "T", use as-is; else append time.

---

## 7. ESTIMATED COST PARSING

### 7.1 parseInt for comma-separated
| File | Issue |
|------|-------|
| **SL_lost.jsx** (L224) | `parseInt(contactedFormData.estimatedPrice)` – "10,000" → 10 |
| **SL_not_picked.jsx** (L205) | Same |
| **SL_newLeads.jsx** (L299) | Same |

**Fix:** Use parseAmount helper.

---

## 8. PAYMENT / FINANCIAL CONSISTENCY

### 8.1 Available amount calculation
**SL_ClientProfile.jsx** and **SL_payments_recovery.jsx** both use:
```js
const totalPending = pendingReceipts.reduce((sum, r) => sum + (r.amount || 0), 0)
const available = Math.max(0, (remainingAmount || 0) - totalPending)
```
This is **correct and consistent** – good.

### 8.2 Band filter typo
**salesPaymentsService.js** (L13): `params.band` – backend uses `band` for amount bands. No typo; "band" is correct.

---

## 9. ROUTE / API CONSISTENCY

- **getDashboardStats** vs **getDashboardStatistics**: Both map to same handler `getSalesDashboardStats` (/dashboard/stats and /dashboard/statistics). No inconsistency.

---

## 10. MINOR / EDGE CASES

| Issue | Location | Notes |
|-------|----------|-------|
| `window.refreshDashboardStats` | SL_leadProfile, SL_quotation_sent, SL_demo_sent | May be undefined if user navigates directly to lead-profile; consider event-based refresh. |
| `leadCategories[0]` fallback | SL_demo_request getCategoryInfo | If `leadCategories` is empty, `leadCategories[0]` is undefined; could crash. Add null check. |
| salesDemoService.updateStatus | First param is `requestId` | Backend route expects `leadId`. Verify demo request ID vs lead ID – if they differ, API may fail. |

---

## SUMMARY – PRIORITY FIXES

| Priority | Bug | Fix |
|----------|-----|-----|
| **P0** | totalLeads double-counting (backend) | Use `Lead.countDocuments` instead of sum of statusCounts |
| **P1** | Amount parsing (comma) in quotation_sent, demo_sent, ClientProfile, payments_recovery, lost, not_picked, newLeads | Use parseAmount helper |
| **P1** | cat.id vs cat._id in demo_request, connectedLeads | Use cat._id or (cat._id \|\| cat.id) |
| **P2** | Conversion payload totalCost/advanceReceived – use Math.round | Align with SL_leadProfile |
| **P2** | Funnel percentage – use funnelData.value | Avoid fragile string parsing |
| **P3** | Empty leadCategories fallback | Add null check |
| **P3** | Follow-up date+time parsing for ISO dates | Normalize before concatenation |
