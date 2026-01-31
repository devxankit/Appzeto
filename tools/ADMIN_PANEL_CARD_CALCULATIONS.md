## Admin Panel Dashboard Card Calculations

This document outlines the data sources and calculation logic for the various statistics cards displayed on the Admin Dashboard. This will serve as a reference for understanding how values are derived and updated across different filtering options.

### Data Sources:
- `adminDashboardService.getDashboardStats()`: Fetches general dashboard statistics (users, projects, sales, system health).
  - API Endpoint: `/admin/analytics/dashboard`
- `adminFinanceService.getFinanceStatistics(timeFilter, params)`: Fetches detailed financial statistics based on a specified time filter or custom date range.
  - API Endpoint: `/admin/finance/statistics`
  - Parameters: `timeFilter` (e.g., `day`, `week`, `month`, `year`, `custom`), `startDate`, `endDate` (for custom filter)

### Card Breakdown:

#### Today's Financial Metrics Grid
These cards display financial metrics, primarily sourced from `adminFinanceService.getFinanceStatistics`. If `financeData` is not available, these values will default to 0. All currency values are formatted using `formatCurrency`, which now ensures no decimal places.

1.  **Earnings**
    - **Source**: `dashboardData.today.earnings`
    - **Calculation**: `financeData.totalRevenue || financeData.todayEarnings || 0`
    - **Description**: Represents the total earnings for the selected filter period.

2.  **Expense**
    - **Source**: `dashboardData.today.expenses`
    - **Calculation**: `financeData.totalExpenses || 0`
    - **Description**: Represents the total expenses for the selected filter period.

3.  **Sales**
    - **Source**: `dashboardData.today.sales`
    - **Calculation**: `financeData.totalRevenue || 0`
    - **Description**: Represents the total sales for the selected filter period. This often mirrors total revenue in many business contexts.

4.  **Pending Amount**
    - **Source**: `dashboardData.today.pendingAmount`
    - **Calculation**: `financeData.pendingAmounts?.totalPendingReceivables || 0`
    - **Description**: Total amount of payments pending or outstanding receivables.

5.  **Profit**
    - **Source**: `dashboardData.today.profit`
    - **Calculation**: `financeData.netProfit || 0`
    - **Description**: Net profit for the selected filter period.

6.  **Loss**
    - **Source**: `dashboardData.today.loss`
    - **Calculation**: `(financeData.totalExpenses || 0) > (financeData.totalRevenue || 0) ? (financeData.totalExpenses - financeData.totalRevenue) : 0`
    - **Description**: Calculated as the difference between total expenses and total revenue if expenses exceed revenue, otherwise 0.

#### Performance Metrics Section
These cards display key performance indicators, drawing data from various parts of the `dashboardData` object, which is a merged result from both `adminDashboardService` and `adminFinanceService`. The `dashboardData.finance` properties now strictly rely on `financeData`.

1.  **Revenue**
    - **Source**: `dashboardData.finance.monthlyRevenue` or `dashboardData.finance.totalRevenue`
    - **Calculation**: `formatCurrency(dashboardData.finance.monthlyRevenue || dashboardData.finance.totalRevenue)`
    - **Description**: Total revenue for the selected period, updated by financial statistics.

2.  **Converted Leads**
    - **Source**: `dashboardData.sales.converted`
    - **Calculation**: `formatNumber(dashboardData.sales.converted)`
    - **Description**: Number of leads that have been converted into clients.

3.  **Conversion Rate**
    - **Source**: `dashboardData.sales.conversionRate`
    - **Calculation**: `dashboardData.sales.conversionRate?.toFixed(2) || 0`
    - **Description**: Percentage of leads converted to clients, rounded to two decimal places.

4.  **Overdue Projects**
    - **Source**: `dashboardData.projects.overdue`
    - **Calculation**: `formatNumber(dashboardData.projects.overdue)`
    - **Description**: Number of projects that are currently overdue.

5.  **Total Clients**
    - **Source**: `dashboardData.users.clients`
    - **Calculation**: `formatNumber(dashboardData.users.clients)`
    - **Description**: Total number of active clients.

### General Data Loading Logic (`loadDashboardData` function):

- The `loadDashboardData` function makes parallel API calls to `adminDashboardService.getDashboardStats()` and `adminFinanceService.getFinanceStatistics()`.
- The `dashboardData` state is initially populated by `adminDashboardService.getDashboardStats()`.
- If `adminFinanceService.getFinanceStatistics()` returns data (`financeData`), it **overrides and updates** the financial sections (`dashboardData.finance` and `dashboardData.today`) of the `dashboardData` object with the filtered financial information. These sections now strictly rely on `financeData`.
- This ensures that when a date filter is applied, the financial cards specifically reflect the data for that chosen period.
- The `useEffect` hook triggers `loadDashboardData` when `filterType`, `startDate`, or `endDate` change, ensuring that the dashboard data is reloaded with the appropriate filters.

This document should be kept updated as any changes are made to the dashboard's data fetching or calculation logic.