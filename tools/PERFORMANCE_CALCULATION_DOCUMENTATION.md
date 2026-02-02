# Performance Calculation Documentation

This document provides a comprehensive guide to how performance metrics are calculated across different modules in the Appzeto system.

---

## Table of Contents

1. [Project Manager (PM) Performance](#project-manager-pm-performance)
2. [Employee Performance (Development Team)](#employee-performance-development-team)
3. [Sales Employee Performance](#sales-employee-performance)
4. [Leaderboard Points System](#leaderboard-points-system)

---

## Project Manager (PM) Performance

### Overview
PMs are evaluated based on two key metrics displayed in the Admin Project Management table:
- **Completion Rate** (Green percentage)
- **Performance Score** (Blue percentage)

### 1. Completion Rate

**Definition:** The percentage of completed projects out of total projects managed by the PM.

**Formula:**
```
Completion Rate = (Completed Projects ÷ Total Projects) × 100
```

**Calculation Logic:**
- **Completed Projects:** Projects with status = `'completed'`
- **Total Projects:** All projects in `projectsManaged` array
- **Default Value:** 0% if no projects exist

**Example:**
- Total Projects: 10
- Completed Projects: 7
- Completion Rate = (7 ÷ 10) × 100 = **70%**

**Location in Code:**
- Backend: `backend/controllers/adminUserController.js` (lines 108-110)
- Frontend Display: `frontend/src/modules/admin/admin-pages/Admin_project_management.jsx` (line 4251)

---

### 2. Performance Score

**Definition:** A comprehensive score that starts with completion rate and adjusts based on project timeliness.

**Formula:**
```
Performance Score = Completion Rate + Bonuses - Penalties
```

**Calculation Steps:**

1. **Base Score:** Start with Completion Rate
   ```
   Performance = Completion Rate
   ```

2. **Overdue Project Penalty:**
   - Calculate overdue projects (projects past due date that are not completed/cancelled)
   - Deduct **-5% per overdue project**
   - Maximum penalty: **-30%**
   ```
   Overdue Penalty = min(30, Overdue Projects × 5)
   Performance = Performance - Overdue Penalty
   ```

3. **Zero Overdue Bonus:**
   - If there are **zero overdue projects**, add **+10% bonus**
   ```
   If Overdue Projects === 0:
     Performance = Performance + 10
   ```

4. **Final Clamping:**
   - Ensure score is between **0-100%**
   ```
   Performance = min(100, max(0, round(Performance)))
   ```

**Example Scenarios:**

**Scenario 1: Perfect PM**
- Completion Rate: 80%
- Overdue Projects: 0
- Performance = 80% + 10% = **90%**

**Scenario 2: PM with Overdue Projects**
- Completion Rate: 80%
- Overdue Projects: 2
- Performance = 80% - (2 × 5%) = **70%**

**Scenario 3: PM with Many Overdue Projects**
- Completion Rate: 80%
- Overdue Projects: 8
- Performance = 80% - 30% (max penalty) = **50%**

**Location in Code:**
- Backend: `backend/controllers/adminUserController.js` (lines 119-136)
- Frontend Display: `frontend/src/modules/admin/admin-pages/Admin_project_management.jsx` (line 4254)

---

## Employee Performance (Development Team)

### Overview
Employees in the development team use a **points-based system** where points are earned or deducted based on task completion and timeliness.

### Points System

#### 1. Points Awarded for Task Completion

**On-Time Completion:**
- **Points:** +1 point
- **Reason:** `'task_completed_on_time'`
- **Condition:** Task completed on or before due date

**Overdue Completion:**
- **Points:** 0 points (points already deducted daily)
- **Reason:** `'task_completed_overdue_X_days'`
- **Condition:** Task completed after due date

**Location in Code:**
- `backend/controllers/employeeTaskController.js` (lines 140-177)
- `backend/models/Task.js` (lines 232-268)

---

#### 2. Daily Points Deduction for Overdue Tasks

**Deduction Rate:**
- **-1 point per day** for each overdue task
- Deducted once per day (not multiple times if checked multiple times)

**Conditions:**
- Task status is NOT `'completed'`
- Task has a `dueDate`
- Task is past due date
- Points not already deducted today

**Location in Code:**
- `backend/models/Task.js` (lines 270-299)

---

#### 3. Employee Statistics

The system tracks the following statistics for each employee:

- **tasksCompleted:** Total number of completed tasks
- **tasksOnTime:** Tasks completed on or before due date
- **tasksOverdue:** Tasks completed after due date
- **tasksMissed:** Tasks that were not completed (if applicable)
- **averageCompletionTime:** Average time taken to complete tasks (in days)
- **completionRate:** Percentage of completed tasks
  ```
  Completion Rate = (Completed Tasks ÷ Total Tasks) × 100
  ```
- **totalPointsEarned:** Sum of all positive points
- **totalPointsDeducted:** Sum of all deducted points

**Location in Code:**
- `backend/models/Employee.js` (lines 240-291)

---

#### 4. Employee Performance Score (for User Management)

**Formula:**
```
Performance = Base Score + Project Bonus
```

**Calculation:**
- **Base Score:** 85 if employee has tasks, 70 if no tasks
- **Project Bonus:** +10 if employee is assigned to projects
- **Final Score:** Clamped between 0-100

**Example:**
- Employee with tasks and projects: 85 + 10 = **95%**
- Employee with tasks but no projects: **85%**
- Employee with no tasks: **70%**

**Location in Code:**
- `backend/controllers/adminUserController.js` (lines 168-170)

---

### Points History

Each employee maintains a `pointsHistory` array that records:
- **taskId:** Reference to the task
- **points:** Points awarded/deducted (positive or negative)
- **reason:** Reason for points change
- **timestamp:** When points were changed

**Location in Code:**
- `backend/models/Employee.js` (lines 124-129)

---

## Sales Employee Performance

### Overview
Sales employees are evaluated based on **revenue generated from converting clients**. Performance is directly tied to the total revenue value of all converted leads.

### 1. Conversion Rate

**Definition:** The percentage of leads that were successfully converted to clients.

**Formula:**
```
Conversion Rate = (Converted Leads ÷ Total Leads) × 100
```

**Calculation:**
- **Total Leads:** All leads assigned to the sales employee
- **Converted Leads:** Leads with status = `'converted'`
- **Default Value:** 0% if no leads exist

**Note:** Conversion rate is tracked as a metric but is **not used** for performance score calculation.

**Example:**
- Total Leads: 50
- Converted Leads: 25
- Conversion Rate = (25 ÷ 50) × 100 = **50%**

**Location in Code:**
- `backend/controllers/adminAnalyticsController.js` (lines 916-918)

---

### 2. Performance Score

**Definition:** Performance score is based on **total revenue generated from converting clients**. The higher the revenue, the higher the performance score.

**Formula:**
```
Performance Score = Total Revenue from Converted Clients
```

**Calculation:**
- **Performance Score** = Sum of `value` field from all leads with status = `'converted'`
- This represents the total revenue generated by the sales employee
- **Default Value:** 0 if no converted leads exist

**Example:**
- Converted Lead 1: ₹50,000
- Converted Lead 2: ₹75,000
- Converted Lead 3: ₹25,000
- **Performance Score = ₹150,000**

**Key Points:**
- Performance is directly proportional to revenue generated
- No weighted calculations or percentages
- Simple, transparent metric: more revenue = better performance
- Revenue is calculated from the `value` field of converted leads

**Location in Code:**
- `backend/controllers/adminSalesController.js` (lines 1545-1549)

---

### 3. Sales Metrics Tracked

- **totalLeads:** Total number of leads assigned
- **convertedLeads:** Number of converted leads
- **totalRevenue:** Total value of converted leads
- **deals:** Number of deals (converted leads)
- **salesTarget:** Target sales amount
- **currentSales:** Current sales achieved
- **currentIncentive:** Current incentive earned

**Location in Code:**
- `backend/controllers/adminAnalyticsController.js` (lines 949-955)

---

## Leaderboard Points System

### Overview
The leaderboard system ranks employees and sales team members based on their performance metrics.

### 1. Development Team Leaderboard

**Ranking Criteria:**
- Primary: **Total Points** (descending order)
- Employees are sorted by `points` field

**Metrics Displayed:**
- **Score:** Total points
- **Rank:** Position in leaderboard
- **Completed:** Tasks completed
- **Overdue:** Tasks overdue
- **Missed:** Tasks missed
- **OnTime:** Tasks completed on time
- **Rate:** Completion rate percentage
- **Trend:** Points trend (up/down/stable)
- **TrendValue:** Percentage change in points

**Location in Code:**
- `backend/controllers/adminAnalyticsController.js` (lines 771-808)

---

### 2. Sales Team Leaderboard

**Ranking Criteria:**
1. **Primary:** Revenue Generated (highest first)
   - Total revenue from all converted clients
   - Direct sum of `value` from converted leads
2. **Secondary:** Number of conversions (if revenue is equal)
   - Used as tiebreaker when two sales employees have the same revenue

**Metrics Displayed:**
- **Score:** Total Revenue from Converted Clients (in rupees)
- **Rank:** Position in leaderboard (based on revenue)
- **Completed:** Converted leads count
- **Rate:** Conversion rate percentage (for reference, not used for ranking)
- **Sales Metrics:**
  - Leads: Total leads
  - Conversions: Converted leads count
  - Revenue: Total revenue from conversions (used for ranking)
  - Deals: Number of deals

**Achievements:**
- **Sales Champion:** Revenue ≥ ₹500,000
- **Sales Champion + Revenue Master:** Revenue ≥ ₹1,000,000

**Location in Code:**
- `backend/controllers/adminAnalyticsController.js` (lines 900-971)

---

### 3. PM Performance Leaderboard

**Ranking Criteria:**
1. **Primary:** Performance Score (highest first)
2. **Secondary:** Project Completion Rate
3. **Tertiary:** Fewer overdue projects

**Performance Score Calculation (for Leaderboard):**
```
Performance Score = Project Completion Rate + Bonuses - Penalties
```

**Bonuses:**
- **+30 points** if zero overdue projects

**Penalties:**
- **-10 points** per overdue project

**Final Clamping:** 0-100

**Metrics Displayed:**
- **Performance Score:** Calculated performance score
- **Total Projects:** Total projects managed
- **Completed Projects:** Number of completed projects
- **Active Projects:** Number of active projects
- **Overdue Projects:** Number of overdue projects
- **Project Completion Rate:** Percentage of completed projects

**Achievements:**
- **On-Time Master:** Zero overdue projects
- **Project Champion:** Project completion rate ≥ 90%

**Location in Code:**
- `backend/controllers/adminAnalyticsController.js` (lines 815-894)

---

### 4. Trend Calculation

**Trend Types:**
- **Up:** Points increased over the period
- **Down:** Points decreased over the period
- **Stable:** No significant change

**Periods:**
- **Week:** Last 7 days
- **Month:** Last 30 days
- **Year:** Last 365 days

**Trend Value:**
- Calculated as percentage change from first to last point in period
- Format: `+X%` or `-X%` or `0%`

**Location in Code:**
- `backend/controllers/adminAnalyticsController.js` (lines 663-737)

---

## Summary Tables

### PM Performance Metrics

| Metric | Formula | Range | Display Color |
|--------|---------|-------|---------------|
| Completion Rate | (Completed Projects ÷ Total Projects) × 100 | 0-100% | Green |
| Performance Score | Completion Rate ± Bonuses/Penalties | 0-100% | Blue |

### Employee Points System

| Action | Points | Condition |
|--------|--------|-----------|
| Complete task on time | +1 | Completed on/before due date |
| Complete task overdue | 0 | Completed after due date (points already deducted) |
| Daily overdue deduction | -1 per day | Task overdue and not completed |

### Sales Performance Metrics

| Metric | Formula | Notes |
|--------|---------|-------|
| Conversion Rate | (Converted Leads ÷ Total Leads) × 100 | Tracked for reference, not used for performance |
| Revenue Generated | Sum of `value` from all converted leads | Used for performance score and ranking |
| Performance Score | Total Revenue from Converted Clients | Direct revenue amount (in rupees) |

---

## Notes

1. **PM Performance:** The performance score penalizes overdue projects more heavily than it rewards completion, emphasizing timeliness.

2. **Employee Points:** Points can go negative if an employee has many overdue tasks. This allows for accurate tracking of performance issues.

3. **Sales Performance:** Performance is now based entirely on revenue generated from converting clients. The total revenue value of all converted leads directly determines the performance score. This ensures that sales employees are rewarded for generating actual business value rather than just conversion rates or target achievement percentages.

4. **Leaderboard Updates:** Leaderboards are calculated in real-time when requested, ensuring up-to-date rankings.

5. **Date Calculations:** All date comparisons use midnight (00:00:00) as the reference point to ensure accurate day calculations.

---

## Related Files

### Backend Controllers
- `backend/controllers/adminUserController.js` - PM and Employee performance calculations
- `backend/controllers/adminAnalyticsController.js` - Leaderboard and analytics
- `backend/controllers/adminSalesController.js` - Sales performance calculations
- `backend/controllers/employeeTaskController.js` - Task completion and points logic

### Backend Models
- `backend/models/Employee.js` - Employee points and statistics
- `backend/models/Task.js` - Task points calculation
- `backend/models/Sales.js` - Sales employee model
- `backend/models/PM.js` - Project Manager model

### Frontend Display
- `frontend/src/modules/admin/admin-pages/Admin_project_management.jsx` - PM table display
- `frontend/src/modules/admin/admin-pages/Admin_leaderboard.jsx` - Leaderboard display

---

**Last Updated:** February 3, 2026
**Version:** 1.1

### Version History

**v1.1 (February 3, 2026)**
- Changed Sales Performance calculation from weighted score (conversion rate + target achievement) to revenue-based system
- Performance score now equals total revenue generated from converted clients
- Leaderboard ranking updated to sort by revenue (highest first) instead of conversion rate
- Achievements updated to use revenue thresholds instead of conversion rate thresholds

**v1.0 (February 3, 2026)**
- Initial documentation created
