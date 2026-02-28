## Salary Management Flow – HR Module

### 1. High-level overview
- **Entry point (UI)**: `Admin_hr_management.jsx` → HR tab **Salary**.
- **Core backend controller**: `backend/controllers/adminSalaryController.js`.
- **Data model**: `backend/models/Salary.js`.

The system manages:
- Fixed monthly salary for all employee types (Employee, Sales, PM, Admin/HR).
- Incentive and reward amounts primarily for the Sales team, plus rewards for Dev/PM via `EmployeeReward` / `PMReward`.

---

### 2. Data model (Salary)

Key fields (simplified):
- `employeeId`, `employeeModel` (`Employee` | `Sales` | `PM` | `Admin`)
- `employeeName`, `department`, `role`
- `month` (YYYY-MM), `fixedSalary`
- `paymentDate`, `paymentDay`
- `status` (pending/paid), `paidDate`, `paymentMethod`, `remarks`
- Incentive (Sales only): `incentiveAmount`, `incentiveStatus`, `incentivePaidDate`
- Reward: `rewardAmount`, `rewardStatus`, `rewardPaidDate`
- Audit: `createdBy`, `updatedBy`

Graph of relationships:

```mermaid
graph LR
  subgraph Core
    Salary -->|employeeId, employeeModel| EmployeeModels[Employee / Sales / PM / Admin]
  end

  subgraph Sales Extras
    Salary -->|incentiveAmount*| Incentive
    Salary -->|rewardAmount*| SalesTargets[(Sales Targets & Team Target)]
    Incentive -->|salesEmployee| Sales
    SalesTargets --> Sales
  end

  subgraph Dev/PM Rewards
    Salary -->|rewardAmount*| EmployeeReward
    Salary -->|rewardAmount*| PMReward
    EmployeeReward --> Employee
    PMReward --> PM
  end
```

`*` means the value is derived from these models, not stored independently.

---

### 3. Flow A – Set fixed salary for an employee

**UI path:** HR → Salary → “Set salary” modal  
**Frontend:** `Admin_hr_management.jsx` → `handleSetEmployeeSalary` (via `adminSalaryService.setEmployeeSalary`)  
**Backend route:** `PUT /api/admin/salary/set/:userType/:employeeId` → `setEmployeeSalary`

Mermaid sequence:

```mermaid
sequenceDiagram
  participant HR as HR Admin (UI)
  participant FE as Admin_hr_management.jsx
  participant API as /api/admin/salary/set
  participant C as adminSalaryController.setEmployeeSalary
  participant M as Employee/Sales/PM/Admin
  participant S as Salary

  HR->>FE: Open "Set salary" modal, select employee, enter fixedSalary
  FE->>API: PUT /salary/set/:userType/:employeeId { fixedSalary }
  API->>C: Call setEmployeeSalary(userType, employeeId, fixedSalary)
  C->>M: Resolve concrete model (Employee/Sales/PM/Admin) and load employee
  C->>M: Update employee.fixedSalary and save
  C->>C: Compute months from (joining+1 month) to (now+36 months)
  loop For each month
    C->>C: paymentDate = calculatePaymentDate(joiningDate, month)
    alt employeeModel === 'Sales'
      C->>Incentive: Sum Incentive.currentBalance > 0
      C->>C: teamReward = calculateTeamTargetRewardForMonth()
      C->>C: personalReward = calculatePersonalTargetRewardForMonth()
      C->>S: Upsert Salary{fixedSalary, incentiveAmount, rewardAmount}
    else Non-sales
      C->>S: Upsert Salary{fixedSalary}
    end
  end
  C-->>FE: success + basic employee info
  FE-->>HR: Toast "Fixed salary set" and reload salary list
```

Key points:
- Sets both the **employee’s own `fixedSalary`** and creates/updates many future `Salary` records.
- For Sales, `incentiveAmount` is taken from current `Incentive.currentBalance`, and `rewardAmount` is combination of **team** and **personal** target rewards for each month.

---

### 4. Flow B – View salary list for selected month

**UI path:** HR → Salary tab (with filters for month, department, status, week).  
**Frontend:**  
- `loadSalaryData(selectedSalaryMonth)`  
- `getFilteredSalaryData()` for week and status filters.  
**Backend route:** `GET /api/admin/salary?month=&department=&status=&search=` → `getSalaryRecords`

Mermaid sequence:

```mermaid
sequenceDiagram
  participant HR as HR Admin (UI)
  participant FE as Admin_hr_management.jsx
  participant API as /api/admin/salary
  participant C as adminSalaryController.getSalaryRecords
  participant S as Salary
  participant INC as Incentive/Rewards

  HR->>FE: Open Salary tab / change filters
  FE->>API: GET /salary?month=&department=&status=
  API->>C: getSalaryRecords(query)
  C->>S: Find Salary records for month (+filters)
  loop Sync Sales incentives & rewards (pending only)
    C->>INC: Recalculate incentive from Incentive.currentBalance
    C->>INC: Recalculate rewards (team + personal for Sales, or EmployeeReward / PMReward)
    C->>S: Conditionally update Salary.incentiveAmount / rewardAmount
  end
  C->>S: Re-fetch updated Salary list
  C->>C: Compute stats (totals, paid/pending, incentives, rewards)
  C-->>FE: { data: salaries, stats, month }
  FE->>FE: Map API data to UI rows (normalize IDs, dates)
  FE->>FE: Apply week-based filtering + sort unpaid first by paymentDate
  FE-->>HR: Render salary table + stats
```

Key frontend behaviour:
- `loadSalaryData` always calls backend and then:
  - Normalizes `_id` and `employeeId` to strings.
  - Casts dates into JS `Date` objects.
  - Stores incentive/reward and their statuses for actions.
- `getFilteredSalaryData`:
  - Optional week‑wise filtering (1st–4th week by `paymentDate` day).
  - Sort order: **unpaid first (nearest `paymentDate` first)**, then paid (recent first).

---

### 5. Flow C – Edit salary amount

**UI path:** Salary list → row action “Edit”.  
**Frontend:** `handleEditSalary` → `handleSaveSalaryEdit` → `adminSalaryService.updateSalaryRecord`.  
**Backend route:** `PUT /api/admin/salary/:id` → `updateSalaryRecord`.

Mermaid sequence:

```mermaid
sequenceDiagram
  participant HR as HR Admin (UI)
  participant FE as Admin_hr_management.jsx
  participant API as /api/admin/salary/:id
  participant C as adminSalaryController.updateSalaryRecord
  participant S as Salary
  participant M as Employee/Sales/PM/Admin

  HR->>FE: Click "Edit" on salary row
  FE->>FE: Validate record is editable (future month or pending)
  FE-->>HR: Show Edit Salary modal
  HR->>FE: Enter new amount and save
  FE->>API: PUT /salary/:id { fixedSalary }
  API->>C: updateSalaryRecord(id, body)
  C->>S: Load Salary by id
  C->>C: Detect "onlySafeFields" (no status/incentiveStatus/rewardStatus in body)
  alt onlySafeFields
    C->>S: Update fixedSalary, optional remarks, keep incentive/reward untouched
    C->>M: Sync employee.fixedSalary to underlying employee model
  else Full update
    C->>S: Also process status/incentive/reward changes (see Flow D/E/F)
  end
  C-->>FE: success
  FE-->>HR: Toast "Salary updated" and reload salary list
```

Business rules:
- Past **paid** months are read‑only; only **future or pending** months can be edited.
- Editing with only `fixedSalary` will **not** modify `incentiveAmount` or `rewardAmount`; these are preserved until explicitly changed or resynced.

---

### 6. Flow D – Mark salary as paid (main salary)

**UI path:** Salary list → “Mark salary paid”.  
**Frontend:** `handleMarkSalaryPaid` → `confirmSalaryPayment`.  
**Backend route:** `PUT /api/admin/salary/:id` with `status: 'paid'` → `updateSalaryRecord`.

Mermaid sequence:

```mermaid
sequenceDiagram
  participant HR as HR Admin (UI)
  participant FE as Admin_hr_management.jsx
  participant API as /api/admin/salary/:id
  participant C as adminSalaryController.updateSalaryRecord
  participant S as Salary
  participant F as Finance Transactions

  HR->>FE: Click "Mark salary paid"
  FE-->>HR: Show payment modal (method, remarks)
  HR->>FE: Confirm payment
  FE->>API: PUT /salary/:id { status: 'paid', paymentMethod, remarks }
  API->>C: updateSalaryRecord
  C->>S: Load Salary and check month vs current (block past already-paid edits)
  C->>S: Set status='paid', paidDate=now, paymentMethod
  C->>F: createOutgoingTransaction for fixedSalary (Salary Payment)

  alt EmployeeModel == 'Sales'
    C->>INC: Sum Incentive.currentBalance > 0
    C->>S: Set incentiveAmount, incentiveStatus='paid', incentivePaidDate
    C->>INC: Zero currentBalance, set paidAt on Incentive docs
    C->>F: createOutgoingTransaction for Incentive Payment
    C->>S: If rewardAmount > 0, set rewardStatus='paid', rewardPaidDate
    C->>F: createOutgoingTransaction for Reward Payment
  else Employee / PM
    C->>S: If rewardAmount > 0, set rewardStatus='paid', rewardPaidDate
    C->>EmployeeReward/PMReward: Mark related rewards as paid
  end

  C->>C: Optionally auto‑create next month Salary record (pending)
  C-->>FE: success
  FE-->>HR: Toast + refresh salary list (and history if open)
```

Notes:
- Finance integration ensures every salary / incentive / reward payout is mirrored in outgoing finance transactions.
- Cancelling salary payment (status back to `pending`) will also call finance cancellation for the related salary transaction.

---

### 7. Flow E – Mark incentive as paid (Sales only)

**UI path:** Salary list → action on incentive column (for Sales) → “Mark Incentive Paid”.  
**Frontend:** `handleMarkIncentivePaid` → `confirmIncentivePayment`.  
**Backend route:** `PUT /api/admin/salary/:id/incentive` → `updateIncentivePayment`.

Mermaid sequence:

```mermaid
sequenceDiagram
  participant HR as HR Admin (UI)
  participant FE as Admin_hr_management.jsx
  participant API as /api/admin/salary/:id/incentive
  participant C as adminSalaryController.updateIncentivePayment
  participant S as Salary
  participant INC as Incentive
  participant F as Finance

  HR->>FE: Click "Mark incentive paid"
  FE-->>HR: Incentive payment modal (method, remarks)
  HR->>FE: Confirm incentive payment
  FE->>API: PUT /salary/:id/incentive { incentiveStatus: 'paid', paymentMethod, remarks }
  API->>C: updateIncentivePayment
  C->>S: Load Salary, ensure employeeModel === 'Sales'
  C->>INC: Find Incentive docs with currentBalance > 0 for salesEmployee
  C->>C: totalIncentive = sum(currentBalance)
  C->>S: Set incentiveAmount = totalIncentive, incentiveStatus='paid', incentivePaidDate
  C->>INC: Set currentBalance=0 and paidAt on each incentive doc
  C->>F: createOutgoingTransaction (category: Incentive Payment)
  C-->>FE: success
  FE-->>HR: Toast + reload salary list
```

If status is changed back to `pending`, the salary record’s `incentivePaidDate` is cleared and the related finance transaction is cancelled via helper.

---

### 8. Flow F – Mark reward as paid (Sales / Dev / PM)

**UI path:** Salary list → action on reward column → “Mark Reward Paid”.  
**Frontend:** `handleMarkRewardPaid` → `confirmRewardPayment`.  
**Backend routes:**
- `PUT /api/admin/salary/:id` with `rewardStatus`
- or `PUT /api/admin/salary/:id/reward` via `updateRewardPayment`

Mermaid sequence (generic):

```mermaid
sequenceDiagram
  participant HR as HR Admin (UI)
  participant FE as Admin_hr_management.jsx
  participant API as /api/admin/salary/:id/reward
  participant C as adminSalaryController.updateRewardPayment
  participant S as Salary
  participant R as EmployeeReward/PMReward
  participant F as Finance

  HR->>FE: Click "Mark reward paid"
  FE-->>HR: Reward payment modal
  HR->>FE: Confirm
  FE->>API: PUT /salary/:id/reward { rewardStatus: 'paid', paymentMethod, remarks }
  API->>C: updateRewardPayment
  C->>S: Load Salary
  C->>S: Set rewardStatus='paid', rewardPaidDate
  C->>F: createOutgoingTransaction (category: Reward Payment)
  alt EmployeeModel == 'Employee'
    C->>R: EmployeeReward.updateMany(..., { status:'paid', paidAt })
  else EmployeeModel == 'PM'
    C->>R: PMReward.updateMany(..., { status:'paid', paidAt })
  end
  C-->>FE: success
  FE-->>HR: Toast + reload salary list
```

Changing reward back to `pending` clears `rewardPaidDate` and cancels the finance transaction.

---

### 9. Flow G – Generate salaries for a specific month (bulk)

**Admin utility (backend only or via some button):**  
**Route:** `POST /api/admin/salary/generate/:month` → `generateMonthlySalaries`.

Mermaid sequence:

```mermaid
sequenceDiagram
  participant Admin as System/Admin
  participant API as /api/admin/salary/generate/:month
  participant C as adminSalaryController.generateMonthlySalaries
  participant M as Employee/Sales/PM/Admin
  participant S as Salary
  participant INC as Incentive

  Admin->>API: POST /salary/generate/2026-03
  API->>C: generateMonthlySalaries(month)
  C->>M: Fetch all active employees with fixedSalary > 0
  loop For each employee
    C->>C: paymentDate = calculatePaymentDate(joiningDate, month)
    alt modelType == 'Sales'
      C->>INC: Sum Incentive.currentBalance > 0
      C->>C: reward = calculateTeamTargetRewardForMonth()
      C->>S: Create/Update Salary with fixedSalary + incentiveAmount + rewardAmount
    else
      C->>S: Create/Update Salary with fixedSalary only
    end
  end
  C-->>Admin: Summary { generated, updated, total }
```

---

### 10. Flow H – Salary history per employee

**UI path:** Within HR Salary → open employee history.  
**Frontend:** `adminSalaryService.getEmployeeSalaryHistory` → history modal.  
**Backend route:** `GET /api/admin/salary/employee/:userType/:employeeId` → `getEmployeeSalaryHistory`.

Mermaid sequence:

```mermaid
sequenceDiagram
  participant HR as HR Admin (UI)
  participant FE as Admin_hr_management.jsx
  participant API as /api/admin/salary/employee/:userType/:employeeId
  participant C as adminSalaryController.getEmployeeSalaryHistory
  participant S as Salary

  HR->>FE: Open history for selected employee
  FE->>API: GET /salary/employee/:userType/:employeeId
  API->>C: getEmployeeSalaryHistory
  C->>S: Find salaries by employeeId + employeeModel, sorted by month desc
  C-->>FE: List of salary records
  FE->>FE: Map + filter to show only paid, non-future months (>= joiningDate)
  FE-->>HR: Render history table
```

---

### 11. Summary of end-to-end behaviour

- HR can:
  - **Set fixed salary** once, which auto‑generates a long horizon of monthly salary records.
  - **View, filter, and sort** salary records per month with statistics and week‑wise grouping.
  - **Edit salary amounts** for upcoming/pending months without touching incentives/rewards.
  - **Mark salary, incentives, and rewards as paid**, which:
    - Updates status and timestamps on the `Salary` record.
    - Clears source balances (for incentives).
    - Syncs Dev/PM rewards from their own models.
    - Always creates matching **finance transactions**.
  - **Generate missing records** in bulk for a given month and inspect **salary history** per employee.

