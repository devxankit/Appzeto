## Financial & Recovery Flow – Known / Suspected Issues

This document lists **bugs, edge cases, and design risks** related to:

- Project creation & pricing changes
- Sales recovery (PaymentReceipts) and admin manual recoveries
- Finance & dashboard statistics
- Deletion of clients/projects/transactions

It includes **previously fixed issues** (for history) and **issues still present or worth re‑reviewing**.

---

### 1. Recovery & PaymentReceipt Flow

#### 1.1 Pending PaymentReceipts previously reduced remainingAmount immediately **(FIXED)**

- **Location**: `backend/controllers/salesController.js`
  - Project-based recovery endpoint (uses `projectId`)
  - Client-based primary project recovery endpoint
- **Old behavior**:
  - When a sales employee created a recovery, a `PaymentReceipt` with `status: 'pending'` was created.
  - Immediately after, code **subtracted the pending amount** from `project.financialDetails.remainingAmount`:
    - This caused **pending** recoveries to appear as **already collected** across:
      - Admin finance statistics (pending receivables)
      - Admin dashboard cards
      - Client wallet & sales payment recovery lists
  - When the receipt was later **rejected**, remaining amount and stats were only corrected via `recalculateProjectFinancials`, after having shown wrong values while pending.
- **Status**: Logic removed; remainingAmount is now only changed on **approval/rejection** via the shared financial helper.
- **Risk if re-introduced**: Any future “optimistic” adjustment before admin approval will again corrupt all statistics that depend on remainingAmount.

#### 1.2 Double-counting admin manual recoveries in project financials **(FIXED)**

- **Location**:
  - `backend/utils/projectFinancialHelper.js::recalculateProjectFinancials`
  - `backend/controllers/adminProjectController.js::recalculateProjectFinancials`
- **Old behavior**:
  - Both helpers computed:
    - `totalApprovedPayments` (PaymentReceipt)
    - `collectedFromInstallments`
    - `totalManualRecoveries` (AdminFinance with `metadata.sourceType = 'adminManualRecovery'`)
  - Then they **added an “initialAdvancePortion” derived from existing `financialDetails.advanceReceived`**, effectively:
    - `totalReceived = receipts + installments + manualRecoveries + (storedAdvance - (receipts + installments))`
  - When `recalculateProjectFinancials` ran more than once, admin manual recoveries could be **double-counted** in `advanceReceived`.
- **Status**: Now both helpers recompute `advanceReceived` **purely from live data** (receipts + installments + manual recoveries) and no longer reuse the stored advance in the sum.
- **Residual risk**:
  - Any other custom place that **manually edits `financialDetails.advanceReceived`** without going through the helper can desync numbers.

#### 1.3 Client wallet previously recomputed totals using its own receipt map **(FIXED)**

- **Location**: `backend/controllers/clientWalletController.js`
- **Old behavior**:
  - Wallet controller built a `receiptsByProject` map from approved `PaymentReceipt`s and added those on top of `advanceReceived`.
  - After we started including receipts and manual recoveries inside `advanceReceived` via the shared helper, this logic caused **over-counting** when computing:
    - `paidAmount`
    - derived virtual installments (30/30/40)
  - This made client-facing wallet and admin/sales views disagree.
- **Status**:
  - Wallet now treats `financialDetails.advanceReceived` as the **single source of truth** for “all money received from advance/receipts/manual recoveries”, and only adds `Payment` model amounts on top.
  - Virtual installments are computed from totalCost vs `(advanceReceived + paymentRecordsPaid)`.

---

### 2. Date / Period Classification Issues

These affect how **“This Month” / “Today” / “This Year”** cards behave for past or future-dated data.

#### 2.1 AdminFinance `getFinanceStatistics()` – inconsistent period logic

- **Location**: `backend/models/AdminFinance.js::getFinanceStatistics`
- **Previous issue (FIXED)**:
  - `timeFilter='month'/'year'` used **rolling windows** (“last 30 days” / “last 365 days”), not calendar periods.
  - This was confusing vs the UI labels (“This Month”, etc.).
- **Current behavior**:
  - `timeFilter` now uses **calendar** periods:
    - `today`: 00:00–23:59 of today
    - `week`: last 7 days including today
    - `month`: 1st–last day of this month
    - `year`: 1 Jan – 31 Dec of current year
- **Remaining risks**:
  - Any frontend calls that expect **rolling** behavior (e.g. “Last 7 days” vs “This Week”) might not match the new semantics. All callers must treat `'month'`/`'year'` as **calendar** periods now.

#### 2.2 Admin dashboard finance stats – project sales period based on `createdAt` **(FIXED)**

- **Location**: `backend/controllers/adminFinanceController.js::getFinanceStatistics`
- **Old behavior**:
  - For **“Total Sales” in period**, code used:
    - `createdAt: dateFilter` + `financialDetails.advanceReceived > 0`
  - If a project was created in MongoDB **this month** but its **business date (start) was last year**, it still counted as **this month’s sale**.
- **Current behavior**:
  - We now use **`startDate`** as the sale date:
    - `startDate: dateFilter` + `advanceReceived > 0`
  - That means:
    - Back‑dated projects only impact **their own month/year**.
    - Projects with a future `startDate` won’t inflate current period stats.
- **Residual risk**:
  - If any UI shows “This Month Sales” but expects **conversion date** or **first approved payment date** instead of `startDate`, there can still be conceptual mismatch.

#### 2.3 Sales hero stats vs finance stats – different “sale date” definitions

- **Locations**:
  - Sales hero stats: `backend/controllers/salesController.js::getDashboardHeroStats`
  - Sales incentive wallet: `salesController` later section (analytics / wallet)
  - Finance stats: `adminFinanceController.getFinanceStatistics`
- **Behavior**:
  - Sales hero & wallet treat a sale as belonging to the month of **`Client.conversionDate`** (with project `advanceReceived > 0`).
  - Finance stats treat a sale as belonging to the month of **`Project.startDate`** (and use `transactionDate` / `paidAt` / `verifiedAt` for actual cash flow).
- **Risk**:
  - For back‑dated or edited data:
    - **Sales cards and admin finance cards can show different months** for the same project.
  - This is a **design inconsistency**, not a code bug, but it will confuse users comparing “This Month Sales” across admin vs sales dashboards.

---

### 3. Aggregation / Double-Counting Risks

#### 3.1 Finance statistics – multiple sources of revenue

- **Location**: `adminFinanceController.getFinanceStatistics`
- **Revenue sources included**:
  - Payments (`Payment` model, `paidAt`)
  - PaymentReceipts (`PaymentReceipt`, `verifiedAt`, status `approved`)
  - Paid project installments (`Project.installmentPlan`, `paidDate`)
  - Other incoming AdminFinance transactions (excluding those with `metadata.sourceType` `'payment'`, `'projectInstallment'`, `'paymentReceipt'`)
- **Design**:
  - Each source is intended to be mutually exclusive:
    - Payments & receipts each create **their own** AdminFinance entries, but those are filtered out by `metadata.sourceType` from the AdminFinance aggregation.
- **Risks / edge cases**:
  1. If any code path creates **AdminFinance records for a payment/receipt** but **forgets to tag `metadata.sourceType`** properly, that transaction gets included **twice**:
     - Once via its source model (Payment/PaymentReceipt)
     - Again via the AdminFinance aggregation.
  2. If someone adds a new `metadata.sourceType` (e.g. `'adminManualRecoveryV2'`) and does **not update the `$nin` filters**, it may be:
     - Incorrectly excluded, or
     - Double-counted, depending on how the record is created elsewhere.
  3. Manual project recoveries (with `sourceType='adminManualRecovery'`) are **only counted via AdminFinance**, not via Payment/PaymentReceipt, which is correct now—but any future change to add receipts for admin recoveries must keep this separation.

#### 3.2 `totalSalesAllTime` ignores timeFilter by design

- **Location**: `adminFinanceController.getFinanceStatistics` (bottom section)
- **Behavior**:
  - `totalSalesAllTime` aggregates **all projects with `totalCost > 0` and `advanceReceived > 0`**.
  - It is not filtered by `timeFilter`, but is reused in the finance management UI.
- **Risk**:
  - If a card in the UI is labeled like “Total Sales (This Month)” and bound to `totalSalesAllTime`, it will always show **all-time** numbers, not filtered ones.

---

### 4. Deletion & Data Consistency

#### 4.1 Client deletion – potential orphaned stats vs historical data

- **Location**: `backend/controllers/adminUserController.js` (client deletion logic)
- **Behavior**:
  - On client delete, code attempts to delete:
    - Projects, Payments, PaymentReceipts, AdminFinance, Incentives, Requests, etc. for that client.
- **Risks**:
  - **Historical statistics** (monthly revenue trend, past months sales) will **change** when a client is deleted, because underlying transactions and projects are removed.
  - This may be acceptable (hard delete) but it means:
    - Finance dashboard is **not immutable**; old months can change if data is cleaned up.
  - If any dependent counts/aggregations assume “all time” is stable, deletions can make numbers look inconsistent with exported reports or previous screenshots.

---

### 5. Recovery-Specific UX / Design Risks

These are not strict bugs in code, but behavior that can confuse users.

#### 5.1 Admin manual recoveries do not create any PaymentReceipt or incentive

- **Location**:
  - `backend/controllers/adminProjectController.js::addProjectRecovery`
  - `backend/utils/projectFinancialHelper.js`
- **Behavior**:
  - Admin manual recovery:
    - Creates an `AdminFinance` transaction with `sourceType='adminManualRecovery'`.
    - Updates project financials via `recalculateProjectFinancials`.
  - It **does not**:
    - Create a `PaymentReceipt`.
    - Trigger any sales incentives/rewards.
- **Risk**:
  - From sales’ perspective, their target/incentive metrics only reflect **sales-driven receipts**, not **admin manual recoveries**.
  - This might be intended, but should be documented; otherwise, finance vs sales views of “who recovered what” will diverge.

#### 5.2 Multiple definitions of “pending” for recovery

- **Behavior**:
  - Pending receivables are computed from:
    - Project `remainingAmount` (which already accounts for **approved** receipts/installments/manual recoveries).
    - Pending salaries/expenses are computed separately.
  - Pending **PaymentReceipts** themselves are not surfaced in top-level finance cards; they only block creating further receipts (via the “available amount” calculation).
- **Risk**:
  - A user looking at a project might see **pending receipts in the UI**, but finance cards only see pending via **remainingAmount**.
  - If any future change again “optimistically” adjusts remainingAmount for pending items, the definition of “pending” in stats becomes unclear.

---

### 6. Summary of Most Harmful Issues (for prioritization)

1. **Any code that mutates `financialDetails.remainingAmount` outside `recalculateProjectFinancials`**  
   - High risk of desyncing all dashboards, wallets, and sales recovery views.

2. **Inconsistent date bases across modules (conversionDate vs startDate vs transactionDate)**  
   - Causes admin vs sales vs wallet to disagree on “This Month” numbers, especially for back‑dated entries.

3. **Revenue double-count risk if `metadata.sourceType` is missing or misconfigured**  
   - Will silently inflate total revenue and monthly revenue without obvious UI error.

4. **Client/project deletion rewrites historical statistics**  
   - Deletes underlying records, making past months’ reports mutable.

These should be carefully considered before further feature development or refactors to the recovery and financial flows.

