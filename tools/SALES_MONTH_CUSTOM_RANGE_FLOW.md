# Sales Month Custom Date Range — Flow & Calculation

This document describes how the configurable sales month date range works in the sales module: the end-to-end flow, where it is used, and how calculations are performed.

---

## 1. Overview

The sales module supports a **custom sales month** (e.g. 10th to 10th) instead of the default calendar month (1st to last day). This affects only:

- **Sales employee dashboard hero card** (monthly sales, target progress, monthly incentive, rewards)
- **Target and incentive calculations** for sales employees

It does **not** affect:

- Admin analytics and reports (remain calendar-month based)
- Today's sales / today's incentive (always use the actual calendar day)
- Other modules (finance, projects, etc.)

---

## 2. High-Level Flow

```mermaid
flowchart TB
    subgraph admin [Admin Configuration]
        AdminUI[Admin Sales Management Page]
        SalesMonthTab[Sales Month and Targets Tab]
        StartDayInput[Start Day Input 1-31]
        EndDayInput[End Day Input 0-31]
        SaveBtn[Save Sales Month Button]
        AdminUI --> SalesMonthTab
        SalesMonthTab --> StartDayInput
        SalesMonthTab --> EndDayInput
        SalesMonthTab --> SaveBtn
    end

    subgraph backend [Backend]
        PUTMonthRange[PUT /api/admin/sales/month-range]
        SystemConfig[(SystemConfig Collection)]
        ConfigCache[In-Memory Config Cache 5min TTL]
        SaveBtn --> PUTMonthRange
        PUTMonthRange --> SystemConfig
        PUTMonthRange --> ConfigCache
        SystemConfig --> ConfigCache
    end

    subgraph salesEmployee [Sales Employee Dashboard]
        HeroStatsAPI[GET /api/sales/dashboard/hero-stats]
        SalesDashboard[Sales Dashboard Hero Card]
        HeroStatsAPI --> SalesDashboard
    end

    subgraph rangeCalc [Sales Month Range Calculation]
        GetConfig[getSalesMonthConfig]
        GetRange[getCurrentSalesMonthRange]
        GetConfig --> GetRange
        ConfigCache --> GetConfig
        HeroStatsAPI --> GetRange
    end

    subgraph metrics [Monthly Metrics Using Range]
        MonthlySales[Monthly Sales]
        MonthlyIncentive[Monthly Incentive]
        TargetProgress[Target Progress]
        Rewards[Rewards from Targets]
        GetRange --> MonthlySales
        GetRange --> MonthlyIncentive
        MonthlySales --> TargetProgress
        MonthlySales --> Rewards
        MonthlyIncentive --> SalesDashboard
    end
```

---

## 3. Admin Configuration Flow

```mermaid
sequenceDiagram
    participant Admin as Admin
    participant UI as Sales Month Tab UI
    participant API as Admin API
    participant DB as SystemConfig DB
    participant Cache as Config Cache

    Admin->>UI: Load Sales Management Page
    UI->>API: GET /api/admin/sales/month-range
    API->>DB: SystemConfig.getSingleton
    DB-->>API: salesMonthStartDay, salesMonthEndDay
    API-->>UI: Current config

    Admin->>UI: Change Start Day / End Day
    Admin->>UI: Click Save Sales Month

    UI->>API: PUT /api/admin/sales/month-range
    API->>API: Validate 1-31
    API->>DB: findOneAndUpdate upsert
    API->>Cache: Invalidate cache
    DB-->>API: Updated config
    API-->>UI: Success

    Note over Cache: Next hero-stats request will reload config
```

---

## 4. Sales Month Range Calculation Logic

The `getCurrentSalesMonthRange(now)` function computes the active sales month window based on `salesMonthStartDay` and `salesMonthEndDay`.

### 4.1 Config Values

| Config | Meaning | Example |
|--------|---------|---------|
| `salesMonthStartDay` | First day of sales month (1–31) | 10 |
| `salesMonthEndDay` | Last day of sales month; **0** = end of calendar month | 0 or 10 |

### 4.2 Calculation Flow (Mermaid)

```mermaid
flowchart TD
    Start([getCurrentSalesMonthRange now]) --> LoadConfig[Load Config from Cache or DB]
    LoadConfig --> CheckDefault{start=1 and end=0?}
    CheckDefault -->|Yes| CalendarMonth[Return Calendar Month 1st to last day]
    CheckDefault -->|No| ResolveEnd[endDay=0? Resolve to last day of month]
    ResolveEnd --> SingleOrCross{start <= end?}

    SingleOrCross -->|Yes Single Month| SingleMonth{today < start?}
    SingleMonth -->|Yes| PrevMonthWindow[Use previous month start to end]
    SingleMonth -->|No| ThisMonthWindow[Use this month start to end]

    SingleOrCross -->|No Cross Month| CrossMonth{today >= start?}
    CrossMonth -->|Yes| ThisToNext[This month start to next month end]
    CrossMonth -->|No| PrevToThis[Previous month start to this month end]

    CalendarMonth --> Return([Return start end])
    PrevMonthWindow --> Return
    ThisMonthWindow --> Return
    ThisToNext --> Return
    PrevToThis --> Return
```

### 4.3 Examples (10–10 Configuration)

| Today's Date | Active Sales Month Window |
|--------------|---------------------------|
| Jan 15, 2026 | Jan 10–Feb 10 |
| Feb 5, 2026 | Jan 10–Feb 10 |
| Feb 12, 2026 | Feb 10–Mar 10 |
| Mar 9, 2026 | Feb 10–Mar 10 |
| Mar 10, 2026 | Mar 10–Apr 10 |

### 4.4 Examples (Default 1–0 = Calendar Month)

| Today's Date | Active Sales Month Window |
|--------------|---------------------------|
| Jan 15, 2026 | Jan 1–Jan 31 |
| Feb 28, 2026 | Feb 1–Feb 28 |

### 4.5 Edge Cases

- **Day clamping**: If `endDay` is 31 but the month has 30 days, it is clamped to 30.
- **Leap year**: February 29 is handled correctly when the range includes it.
- **Default config**: `start=1`, `end=0` produces the same result as the original calendar-month logic.

---

## 5. Sales Hero Stats Calculation Flow

```mermaid
flowchart TB
    subgraph request [Request]
        HeroStatsReq[getDashboardHeroStats salesId]
    end

    subgraph dateRange [Date Range Setup]
        Now[now = new Date]
        TodayStart[Today Start 00:00:00]
        TodayEnd[Today End 23:59:59]
        GetRange[getCurrentSalesMonthRange now]
        MonthStart[monthStart]
        MonthEnd[monthEnd]
        Now --> TodayStart
        Now --> TodayEnd
        Now --> GetRange
        GetRange --> MonthStart
        GetRange --> MonthEnd
    end

    subgraph conversions [Client Conversions]
        ConvertedClients[Find converted clients by salesId]
        MonthlyClients[Filter by conversionDate in monthStart to monthEnd]
        TodayClients[Filter by conversionDate in todayStart to todayEnd]
        ConvertedClients --> MonthlyClients
        ConvertedClients --> TodayClients
        MonthStart --> MonthlyClients
        MonthEnd --> MonthlyClients
    end

    subgraph projects [Project Amounts]
        Projects[Projects with advanceReceived > 0]
        GetBaseCost[getProjectBaseCost exclude GST if included]
        MonthlySales[Sum base costs for monthlyClientIds]
        TodaysSales[Sum base costs for todayClientIds]
        Projects --> GetBaseCost
        MonthlyClients --> MonthlySales
        TodayClients --> TodaysSales
        GetBaseCost --> MonthlySales
        GetBaseCost --> TodaysSales
    end

    subgraph incentives [Incentives]
        Incentives[Conversion-based incentives]
        MonthlyIncentive[Filter by dateAwarded in monthStart to monthEnd]
        TodaysIncentive[Filter by dateAwarded in todayStart to todayEnd]
        Incentives --> MonthlyIncentive
        Incentives --> TodaysIncentive
        MonthStart --> MonthlyIncentive
        MonthEnd --> MonthlyIncentive
    end

    subgraph targets [Targets and Rewards]
        SalesTargets[Sales.salesTargets or salesTarget]
        MonthlyProjectsData[Projects with amount and conversion date]
        MonthlySales --> MonthlyProjectsData
        TargetProgress[Progress = monthlySales / targetAmount]
        RewardCalc[calculateRewardFromSalesTargets]
        MonthlyProjectsData --> RewardCalc
        SalesTargets --> TargetProgress
        SalesTargets --> RewardCalc
        MonthlySales --> TargetProgress
    end

    subgraph teamLead [Team Lead Optional]
        TeamMembers[Team members]
        TeamSales[Sum team conversions in monthStart to monthEnd]
        TeamLeadProgress[teamMonthlySales / teamLeadTarget]
        MonthStart --> TeamSales
        MonthEnd --> TeamSales
    end

    subgraph response [Response]
        HeroStats[heroStats JSON]
        HeroStats --> MonthlySales
        HeroStats --> MonthlyIncentive
        HeroStats --> TargetProgress
        HeroStats --> RewardCalc
        HeroStats --> TodaysSales
        HeroStats --> TodaysIncentive
    end

    HeroStatsReq --> request
```

---

## 6. Data Flow Summary

| Metric | Date Filter Used | Source |
|--------|------------------|--------|
| **Monthly Sales** | `monthStart` – `monthEnd` (custom range) | `Client.conversionDate` + `Project` base cost |
| **Monthly Incentive** | `monthStart` – `monthEnd` (custom range) | `Incentive.dateAwarded` |
| **Target Progress** | `monthlySales` (within custom range) | `Sales.salesTargets` |
| **Rewards** | `monthlyProjectsData` (within custom range) | `calculateRewardFromSalesTargets` |
| **Today's Sales** | `todayStart` – `todayEnd` (calendar day) | Same as monthly, but today filter |
| **Today's Incentive** | `todayStart` – `todayEnd` (calendar day) | Same as monthly, but today filter |
| **Team Lead Progress** | `monthStart` – `monthEnd` (custom range) | Team members' conversions |

---

## 7. Key Files

| File | Purpose |
|------|---------|
| `backend/models/SystemConfig.js` | Stores `salesMonthStartDay`, `salesMonthEndDay` |
| `backend/utils/salesMonthConfig.js` | Loads/updates config; in-memory cache (5 min TTL) |
| `backend/utils/salesMonthRange.js` | `getCurrentSalesMonthRange(now)` — computes window |
| `backend/controllers/adminSalesController.js` | `getSalesMonthRangeConfig`, `updateSalesMonthRangeConfig` |
| `backend/controllers/salesController.js` | `getDashboardHeroStats` — uses range for monthly metrics |
| `frontend/.../Admin_sales_management.jsx` | Sales Month & Targets tab UI |

---

## 8. Backwards Compatibility

- **Default config** (`start=1`, `end=0`): Produces the same calendar-month range as before.
- **No config in DB**: Uses defaults; behavior is unchanged.
- **Admin analytics**: Unchanged; continue to use calendar months.
- **Other modules**: Unaffected; only the sales hero stats endpoint uses the custom range.
