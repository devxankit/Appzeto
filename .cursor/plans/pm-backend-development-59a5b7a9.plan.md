<!-- 59a5b7a9-ba74-4158-8c97-30a2d6b1147c 4cf80915-7f06-4ea5-a467-412fa34b7e7e -->
# PM Module Backend Development Plan

## Overview

Build a complete backend system for the PM (Project Manager) module enabling PMs to create projects, manage milestones, assign tasks to employees, track progress, and provide real-time updates. This includes REST APIs, WebSocket integration, file uploads via Cloudinary, payment tracking models, analytics endpoints, and complete frontend integration with mock data replacement.

## Phase 1: Database Models & Schema Design

### 1.1 Create Project Model (`backend/models/Project.js`)

- Schema fields: name, description, client (ref: Client), projectManager (ref: PM), status (planning/active/on-hold/testing/completed/cancelled), priority (low/normal/high/urgent), dueDate, startDate, assignedTeam (array of Employee refs), budget, estimatedHours, actualHours, progress (0-100), milestones (array of Milestone refs), attachments (Cloudinary), tags, createdAt, updatedAt
- Virtual field for calculating completion percentage from milestones
- Methods: updateProgress(), isOverdue()
- Indexes: client, projectManager, status, priority, dueDate

### 1.2 Create Milestone Model (`backend/models/Milestone.js`)

- Schema fields: title, description, project (ref: Project), sequence (order), dueDate, status (pending/in-progress/testing/completed/cancelled), priority (low/normal/high/urgent), assignedTo (array of Employee refs), tasks (array of Task refs), progress (0-100), attachments (Cloudinary), createdAt, updatedAt
- Virtual field for task completion percentage
- Methods: updateProgress(), isOverdue()
- Indexes: project, status, sequence, dueDate

### 1.3 Create Task Model (`backend/models/Task.js`)

- Schema fields: title, description, project (ref: Project), milestone (ref: Milestone), assignedTo (array of Employee refs), status (pending/in-progress/testing/completed/cancelled), priority (low/normal/high/urgent), isUrgent (boolean), dueDate, startDate, completedDate, estimatedHours, actualHours, attachments (Cloudinary), comments (array of comment objects), createdBy (ref: PM), createdAt, updatedAt
- Methods: markComplete(), isOverdue(), addComment()
- Indexes: project, milestone, assignedTo, status, isUrgent, dueDate

### 1.4 Create Payment Model (`backend/models/Payment.js`)

- Schema fields: project (ref: Project), client (ref: Client), milestone (ref: Milestone, optional), amount, currency, paymentType (advance/milestone/final/additional), status (pending/completed/failed/refunded), transactionId, paymentMethod, paidAt, notes, createdAt, updatedAt
- Methods: markPaid(), markFailed()
- Indexes: project, client, status, paymentType

### 1.5 Create Comment/Activity Model (`backend/models/Activity.js`)

- Schema fields: entityType (project/milestone/task), entityId, activityType (created/updated/assigned/completed/commented), user (ref: PM/Employee/Client), userModel (PM/Employee/Client), message, metadata (object), createdAt
- For tracking project/milestone/task activities and comments
- Indexes: entityType, entityId, createdAt

## Phase 2: Controllers & Business Logic

### 2.1 Project Controller (`backend/controllers/projectController.js`)

- `createProject()` - PM creates project, assigns to client and team
- `getAllProjects()` - Get all projects with filters (status, priority, client, PM)
- `getProjectById()` - Get single project with populated data
- `updateProject()` - Update project details, team assignments
- `deleteProject()` - Soft delete or hard delete project
- `getProjectsByClient()` - Get client's projects
- `getProjectsByPM()` - Get PM's managed projects
- `getProjectStatistics()` - Analytics: counts by status, priority, overdue
- `uploadProjectAttachment()` - Upload files to Cloudinary
- `removeProjectAttachment()` - Remove uploaded files

### 2.2 Milestone Controller (`backend/controllers/milestoneController.js`)

- `createMilestone()` - PM creates milestone within project
- `getMilestonesByProject()` - Get all milestones for a project (sorted by sequence)
- `getMilestoneById()` - Get single milestone with tasks
- `updateMilestone()` - Update milestone details, sequence, assignments
- `deleteMilestone()` - Delete milestone
- `updateMilestoneProgress()` - Auto-calculate from tasks or manual update
- `uploadMilestoneAttachment()` - Upload files to Cloudinary

### 2.3 Task Controller (`backend/controllers/taskController.js`)

- `createTask()` - PM creates task within milestone
- `createUrgentTask()` - PM creates urgent task (isUrgent: true)
- `getTasksByMilestone()` - Get all tasks for a milestone
- `getTasksByEmployee()` - Get employee's assigned tasks
- `getTasksByProject()` - Get all tasks for a project
- `getUrgentTasks()` - Get all urgent tasks for PM
- `getTaskById()` - Get single task with details
- `updateTask()` - Update task details, status, assignments
- `deleteTask()` - Delete task
- `assignTask()` - Assign/reassign task to employees
- `updateTaskStatus()` - Update task status (triggers WebSocket event)
- `addTaskComment()` - Add comment to task
- `uploadTaskAttachment()` - Upload files to Cloudinary

### 2.4 Payment Controller (`backend/controllers/paymentController.js`)

- `createPaymentRecord()` - Create payment tracking record
- `getPaymentsByProject()` - Get all payments for a project
- `getPaymentsByClient()` - Get client's payment history
- `updatePaymentStatus()` - Mark payment as completed/failed
- `getPaymentStatistics()` - Calculate total paid, pending, by project

### 2.5 Analytics Controller (`backend/controllers/analyticsController.js`)

- `getPMDashboardStats()` - Overall statistics for PM dashboard
- `getProjectAnalytics()` - Project-specific analytics (progress, team performance)
- `getEmployeePerformance()` - Employee task completion rates, timelines
- `getClientProjectStats()` - Client's project overview statistics

## Phase 3: Routes & API Endpoints

### 3.1 Project Routes (`backend/routes/projectRoutes.js`)

```
POST   /api/projects                    - Create project (PM only)
GET    /api/projects                    - Get all projects (filtered)
GET    /api/projects/:id                - Get project by ID
PUT    /api/projects/:id                - Update project (PM only)
DELETE /api/projects/:id                - Delete project (PM only)
GET    /api/projects/client/:clientId   - Get client projects
GET    /api/projects/pm/:pmId           - Get PM projects
GET    /api/projects/statistics         - Project statistics
POST   /api/projects/:id/attachments    - Upload attachment
DELETE /api/projects/:id/attachments/:attachmentId - Remove attachment
```

### 3.2 Milestone Routes (`backend/routes/milestoneRoutes.js`)

```
POST   /api/milestones                  - Create milestone (PM only)
GET    /api/milestones/project/:projectId - Get project milestones
GET    /api/milestones/:id              - Get milestone by ID
PUT    /api/milestones/:id              - Update milestone (PM only)
DELETE /api/milestones/:id              - Delete milestone (PM only)
PATCH  /api/milestones/:id/progress     - Update progress
POST   /api/milestones/:id/attachments  - Upload attachment
```

### 3.3 Task Routes (`backend/routes/taskRoutes.js`)

```
POST   /api/tasks                       - Create task (PM only)
POST   /api/tasks/urgent                - Create urgent task (PM only)
GET    /api/tasks/milestone/:milestoneId - Get milestone tasks
GET    /api/tasks/project/:projectId    - Get project tasks
GET    /api/tasks/employee/:employeeId  - Get employee tasks
GET    /api/tasks/urgent                - Get urgent tasks (PM only)
GET    /api/tasks/:id                   - Get task by ID
PUT    /api/tasks/:id                   - Update task
DELETE /api/tasks/:id                   - Delete task (PM only)
PATCH  /api/tasks/:id/status            - Update task status
PATCH  /api/tasks/:id/assign            - Assign/reassign task
POST   /api/tasks/:id/comments          - Add comment to task
POST   /api/tasks/:id/attachments       - Upload attachment
```

### 3.4 Payment Routes (`backend/routes/paymentRoutes.js`)

```
POST   /api/payments                    - Create payment record (PM/Admin only)
GET    /api/payments/project/:projectId - Get project payments
GET    /api/payments/client/:clientId   - Get client payments
PUT    /api/payments/:id                - Update payment status
GET    /api/payments/statistics         - Payment statistics
```

### 3.5 Analytics Routes (`backend/routes/analyticsRoutes.js`)

```
GET    /api/analytics/pm/dashboard      - PM dashboard statistics
GET    /api/analytics/project/:projectId - Project analytics
GET    /api/analytics/employee/:employeeId - Employee performance
GET    /api/analytics/client/:clientId  - Client project statistics
```

## Phase 4: WebSocket Integration for Real-Time Updates

### 4.1 Install Socket.io

- Install `socket.io` package
- Configure Socket.io server in `backend/server.js`

### 4.2 Create WebSocket Service (`backend/services/socketService.js`)

- Initialize Socket.io with authentication middleware
- Define event handlers: `connection`, `disconnect`, `join-room`, `leave-room`
- Room structure: project rooms, milestone rooms, task rooms

### 4.3 Real-Time Events

- Emit events for:
  - Project created/updated/deleted
  - Milestone created/updated/completed
  - Task assigned/updated/status changed
  - Comment added to task
  - Team member added/removed from project
  - Progress updates (project/milestone)

### 4.4 Authentication for WebSocket

- Verify JWT token on Socket.io connection
- Authorize users to join specific rooms (only if they're part of project/assigned to task)

## Phase 5: Middleware & Security

### 5.1 Update Auth Middleware (`backend/middlewares/auth.js`)

- Add `isPM()` middleware - verify user is PM
- Add `isEmployee()` middleware - verify user is Employee
- Add `isClient()` middleware - verify user is Client
- Add `canAccessProject()` - verify user has access to specific project
- Add `canAccessTask()` - verify user has access to specific task

### 5.2 Validation Middleware (`backend/middlewares/validation.js`)

- Create validation schemas for project, milestone, task creation/update
- Use express-validator or joi for input validation
- Validate file uploads (size, type, count)

### 5.3 Upload Middleware (Enhance existing)

- Update `backend/services/cloudinaryService.js` to handle multiple file types
- Add support for documents, images, videos for projects/milestones/tasks
- Create upload limits per entity type

## Phase 6: Integration & Testing Preparation

### 6.1 Update server.js

- Register all new routes
- Initialize Socket.io server
- Update CORS for WebSocket connections

### 6.2 Update PM Model

- Add `projectsManaged` reference (already exists)
- Ensure relationship integrity

### 6.3 Update Employee Model

- Ensure `projectsAssigned` and `tasksAssigned` arrays work properly
- Add methods to get assigned projects/tasks

### 6.4 Update Client Model

- Ensure `projects` array reference works
- Add methods to get client projects

### 6.5 Create Seed/Demo Scripts

- `backend/scripts/creating_project.js` - Create demo projects
- `backend/scripts/creating_milestone.js` - Create demo milestones
- `backend/scripts/creating_task.js` - Create demo tasks
- Populate with realistic data for testing

## Phase 7: Frontend API Services Integration

### 7.1 Create API Service Files

Create new services in `frontend/src/modules/dev/DEV-services/`:

- `projectService.js` - All project-related API calls
- `milestoneService.js` - All milestone-related API calls
- `taskService.js` - All task-related API calls (including urgent tasks)
- `paymentService.js` - All payment tracking API calls
- `analyticsService.js` - All analytics and statistics API calls
- `teamService.js` - Get team members, clients, employees for assignments
- `socketService.js` - WebSocket client connection and event handling

### 7.2 Update Service Index

Update `frontend/src/modules/dev/DEV-services/index.js` to export all new services

### 7.3 Replace Mock Data in PM Pages

Replace mock data with real API calls in:

- `PM_dashboard.jsx` - Dashboard statistics and recent projects
- `PM_projects.jsx` - Project list and filtering
- `PM_project_detail.jsx` - Project details, milestones, team
- `PM_milestone.jsx` and `PM_milestone_detail.jsx` - Milestone data
- `PM_tasks.jsx` and `PM_task_detail.jsx` - Task data
- `PM_urgent_tasks.jsx` and `PM_urgent_task_detail.jsx` - Urgent task data
- `PM_wallet.jsx` - Payment tracking data
- `PM_leaderboard.jsx` - Employee performance data
- **Important:** Keep all UI layouts, designs, animations, and styling exactly the same

### 7.4 Replace Mock Data in Employee Pages

Replace mock data with real API calls in:

- `Employee_dashboard.jsx` - Employee statistics and assigned tasks
- `Employee_tasks.jsx` and `Employee_task_detail.jsx` - Task assignments
- `Employee_projects.jsx` and `Employee_project_detail.jsx` - Assigned projects
- `Employee_milestone_details.jsx` - Milestone progress
- **Important:** Maintain exact same UI and interactions

### 7.5 Replace Mock Data in Client Pages

Replace mock data with real API calls in:

- `Client_dashboard.jsx` - Client project statistics
- `Client_projects.jsx` and `Client_project_detail.jsx` - Client's projects
- `Client_milestone_detail.jsx` - Milestone visibility for clients
- `Client_wallet.jsx` - Client payment history
- **Important:** Keep all UI components unchanged

### 7.6 Update Form Components

Replace mock data loaders in forms:

- `PM_project_form.jsx` - Load clients and employees from API
- `PM_milestone_form.jsx` - Load team members from API
- `PM_task_form.jsx` - Load projects, milestones, team members from API
- `PM_urgent_task_form.jsx` - Load projects, milestones, team members from API
- **Important:** Ensure all form fields match backend model schemas exactly

### 7.7 Integrate WebSocket in Frontend

- Create `socketService.js` for Socket.io client
- Integrate real-time updates in PM, Employee, and Client dashboards
- Add subtle UI indicators for real-time notifications

### 7.8 Integrate File Uploads

- Connect Cloudinary upload component to backend endpoints
- Handle file uploads in project/milestone/task forms
- Display uploaded attachments with preview and remove options

## Phase 8: Data Validation & UI Consistency

### 8.1 Verify Model-Frontend Field Mapping

- Ensure 100% field mapping between frontend forms and backend models
- Validate data types match (dates, numbers, arrays, enums)
- Check all enum values are consistent

### 8.2 Test API Integration

- Test all CRUD operations
- Verify filters, search, and pagination
- Test file upload and download
- Verify WebSocket real-time updates
- Test error handling and loading states

### 8.3 Ensure UI Consistency

- Verify all pages maintain exact same layout after API integration
- Test responsive design (mobile/tablet/desktop)
- Ensure animations and transitions still work
- Verify color schemes and styling unchanged
- Test loading states and error messages

### 8.4 Handle Edge Cases

- Empty states (no data)
- Loading states during API calls
- Error states (network errors, validation errors)
- Permission-based UI rendering
- Pagination for large datasets

## Key Implementation Notes

**File Uploads:** Use existing Cloudinary configuration

**Real-Time Updates:** Socket.io events emitted from controllers after database operations

**Payment Tracking:** Record-keeping only, no payment processing

**Analytics:** Use MongoDB aggregation pipelines for performance

**Authorization:** Role-based access (PM/Employee/Client)

**Cascading Deletes:** Implement soft delete or cascade to related entities

**Progress Calculation:**

- Task: manual or status-based
- Milestone: average of task progress
- Project: average of milestone progress

**Frontend Integration Principles:**

- Zero UI Changes - maintain all layouts, designs, animations
- Mock Data Replacement - replace all mock arrays with API calls
- Field Mapping - 100% mapping between forms and models
- Error Handling - proper loading/error states without UI changes
- Backward Compatibility - existing navigation and flows work identically

### To-dos

- [ ] Create Project model with all fields, virtuals, methods, and indexes
- [ ] Create Milestone model with sequence ordering and progress tracking
- [ ] Create Task model with urgent flag, comments, and status tracking
- [ ] Create Payment model for payment tracking (no processing)
- [ ] Create Activity model for audit trail and comments
- [ ] Implement projectController with CRUD, file uploads, and statistics
- [ ] Implement milestoneController with CRUD, progress tracking, and file uploads
- [ ] Implement taskController with CRUD, urgent tasks, assignments, comments, and file uploads
- [ ] Implement paymentController for payment tracking and statistics
- [ ] Implement analyticsController with dashboard stats and performance metrics
- [ ] Create project routes with all CRUD and attachment endpoints
- [ ] Create milestone routes with CRUD and progress endpoints
- [ ] Create task routes with CRUD, urgent tasks, assignments, and comments
- [ ] Create payment routes for tracking and statistics
- [ ] Create analytics routes for dashboard and performance data
- [ ] Add isPM, isEmployee, isClient, canAccessProject, canAccessTask middlewares
- [ ] Create validation middleware for projects, milestones, tasks
- [ ] Install socket.io and configure WebSocket server in server.js
- [ ] Create socketService with room management and authentication
- [ ] Integrate WebSocket events in controllers for real-time updates
- [ ] Enhance cloudinaryService for project/milestone/task attachments
- [ ] Register all new routes in server.js and update API documentation
- [ ] Update PM, Employee, Client models for project/task relationships
- [ ] Create demo data scripts for projects, milestones, and tasks