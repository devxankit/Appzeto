# Appzeto Navigation & Routing Rules

## Project Overview
This document defines the navigation and routing standards for the Appzeto project, a React application using React Router DOM v7.9.2 with a modular architecture.

## Technology Stack
- **Frontend Framework**: React 19.1.1
- **Routing**: React Router DOM v7.9.2
- **Styling**: Tailwind CSS v3.4.17
- **Build Tool**: Vite v7.1.7
- **UI Components**: Custom components with Lucide React icons

## Project Structure

### Module-Based Architecture
The project follows a modular structure under `frontend/src/modules/`:

```
modules/
├── admin/           # Admin module
│   ├── AD-components/
│   ├── AD-pages/
│   └── AD-services/
├── dev/             # Development module
│   ├── DEV-components/
│   ├── DEV-pages/
│   └── DEV-services/
└── sells/           # Sales module
    ├── SL-components/
    ├── SL-pages/
    └── SL-services/
```

### Naming Conventions
- **Module Prefixes**: Each module uses a 2-letter prefix (AD, DEV, SL)
- **Components**: `{PREFIX}_component_name.jsx`
- **Pages**: `{PREFIX}_page_name.jsx`
- **Services**: `{PREFIX}_service_name.js`

## Routing Architecture

### 1. Main Router Setup
- **Location**: `frontend/src/App.jsx`
- **Router Type**: `BrowserRouter` (imported as `Router`)
- **Wrapper**: All routes wrapped in `<Router>` component

### 2. Route Structure
```jsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/dashboard" element={<SL_dashboard />} />
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

### 3. Route Naming Convention
- **Home**: `/` (root path)
- **Module Routes**: `/{module-name}` (e.g., `/dashboard`, `/admin`, `/dev`)
- **Nested Routes**: `/{module-name}/{sub-page}` (e.g., `/dashboard/analytics`)
- **404 Route**: `*` (catch-all for undefined routes)

## Navigation Components

### 1. Main Navigation
- **Location**: Defined inline in `App.jsx`
- **Component Name**: `Navigation`
- **Hook Used**: `useLocation()` for active route detection
- **Structure**: Array-based navigation items

```jsx
const navItems = [
  { path: '/', label: 'Home' },
  { path: '/dashboard', label: 'Dashboard' },
]
```

### 2. Navigation Styling
- **Active State**: Blue background with border-bottom
- **Inactive State**: Gray text with hover effects
- **Transitions**: 200ms color transitions
- **Responsive**: Flexbox layout with spacing

### 3. Active Route Highlighting
```jsx
className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
  location.pathname === item.path
    ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500'
    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
}`}
```

## Component Creation Rules

### 1. Page Components
- **Location**: `{module}/{PREFIX}-pages/`
- **Naming**: `{PREFIX}_{page_name}.jsx`
- **Export**: Default export with PascalCase
- **Import**: Import in `App.jsx` for routing

**Example**:
```jsx
// SL-pages/SL_dashboard.jsx
import React from 'react'

const SL_dashboard = () => {
  return (
    <div>
      <h1>SL Dashboard</h1>
    </div>
  )
}

export default SL_dashboard
```

### 2. Navigation Components
- **Location**: `{module}/{PREFIX}-components/`
- **Naming**: `{PREFIX}_navbar.jsx` or `{PREFIX}_navigation.jsx`
- **Purpose**: Module-specific navigation elements

### 3. Service Components
- **Location**: `{module}/{PREFIX}-services/`
- **Naming**: `{PREFIX}_service_name.js`
- **Purpose**: API calls, data fetching, business logic

## Layout Structure

### 1. Main Layout
```jsx
<div className="min-h-screen bg-gray-50">
  <header className="bg-white shadow-sm border-b">
    {/* Navigation Header */}
  </header>
  <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    {/* Route Content */}
  </main>
</div>
```

### 2. Header Structure
- **Brand**: Left-aligned logo/brand name
- **Navigation**: Right-aligned navigation menu
- **Styling**: White background with shadow and border

### 3. Content Area
- **Container**: Max-width 7xl with auto margins
- **Padding**: Responsive padding (py-6, sm:px-6, lg:px-8)
- **Background**: Gray-50 background

## Styling Guidelines

### 1. Color Scheme
- **Primary**: Blue (blue-600, blue-700, blue-100)
- **Secondary**: Gray (gray-50, gray-100, gray-600, gray-900)
- **Success**: Green (green-50, green-700, green-900)
- **Background**: White for cards, gray-50 for main background

### 2. Typography
- **Headings**: text-2xl, font-bold, text-gray-900
- **Body**: text-gray-600
- **Navigation**: text-sm, font-medium

### 3. Spacing
- **Container**: max-w-7xl, mx-auto
- **Padding**: px-4, py-6, sm:px-6, lg:px-8
- **Margins**: mb-4, mb-6
- **Gaps**: space-x-8, gap-4

## Best Practices

### 1. Route Management
- Always use `BrowserRouter` for client-side routing
- Implement 404 route with `*` path
- Use descriptive route paths
- Keep route definitions in `App.jsx`

### 2. Navigation Management
- Use `useLocation()` hook for active state detection
- Implement hover and transition effects
- Keep navigation items in an array for easy management
- Use consistent styling across all navigation elements

### 3. Component Organization
- Follow the module-based structure
- Use consistent naming conventions
- Keep components focused and single-purpose
- Export components as default exports

### 4. Import/Export Patterns
```jsx
// Import pattern for pages
import SL_dashboard from './modules/sells/SL-pages/SL_dashboard'

// Export pattern for components
const ComponentName = () => { /* ... */ }
export default ComponentName
```

## Adding New Routes

### 1. Create Page Component
1. Create new file in appropriate module: `{module}/{PREFIX}-pages/{PREFIX}_{name}.jsx`
2. Follow the component template structure
3. Export as default

### 2. Add Route Definition
1. Import the new component in `App.jsx`
2. Add route in `<Routes>` section
3. Follow the path naming convention

### 3. Update Navigation
1. Add new item to `navItems` array in `Navigation` component
2. Use consistent path and label naming
3. Test active state highlighting

### 4. Example: Adding Admin Dashboard
```jsx
// 1. Create: modules/admin/AD-pages/AD_dashboard.jsx
const AD_dashboard = () => {
  return <div><h1>Admin Dashboard</h1></div>
}
export default AD_dashboard

// 2. Import in App.jsx
import AD_dashboard from './modules/admin/AD-pages/AD_dashboard'

// 3. Add route
<Route path="/admin" element={<AD_dashboard />} />

// 4. Update navigation
const navItems = [
  { path: '/', label: 'Home' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/admin', label: 'Admin' },
]
```

## Error Handling

### 1. 404 Page
- Implement catch-all route with `*` path
- Provide user-friendly error message
- Include navigation back to home
- Use consistent styling with rest of application

### 2. Route Protection
- Implement authentication checks for protected routes
- Redirect unauthorized users to login
- Use React Router's `Navigate` component for redirects

## Performance Considerations

### 1. Code Splitting
- Use `React.lazy()` for large components
- Implement `Suspense` for loading states
- Split routes by module for better performance

### 2. Navigation Optimization
- Use `Link` component instead of anchor tags
- Implement prefetching for critical routes
- Minimize re-renders with proper key props

## Future Enhancements

### 1. Nested Routing
- Implement nested routes for complex modules
- Use `Outlet` component for nested layouts
- Create module-specific routers

### 2. Dynamic Routing
- Implement parameterized routes
- Use `useParams()` hook for dynamic content
- Add search and filter capabilities

### 3. State Management
- Integrate with state management library (Redux, Zustand)
- Implement route-based state persistence
- Add breadcrumb navigation

## Maintenance Notes

### 1. Regular Updates
- Keep React Router DOM updated
- Review and update route structure quarterly
- Monitor performance and optimize as needed

### 2. Documentation
- Update this document when adding new patterns
- Document any deviations from these rules
- Keep component examples current

---

**Last Updated**: December 2024
**Version**: 1.0
**Maintainer**: Development Team
