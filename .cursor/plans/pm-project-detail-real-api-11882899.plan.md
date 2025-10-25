<!-- 11882899-3028-435b-b4f9-5f90d0ccb8b1 e8e75a79-4692-4c75-860b-91aa9bb7ca60 -->
# PM Project Detail Real API Integration with Revisions System

## Phase 1: Backend - Revision Model & Schema

### 1.1 Create Revision Model

**File**: `backend/models/Revision.js`

Create a new Revision model with:

- Schema fields: `title`, `description`, `project` (ref: Project), `status` (pending/in-progress/completed/rejected), `sequence` (order number), `dueDate`, `completedDate`, `assignedTo` (array of Employee refs), `attachments` (Cloudinary format), `feedback`, `createdBy` (ref: PM)
- Indexes: project, status, sequence, createdAt
- Methods: `markComplete()`, `markRejected()`, `addFeedback()`
- Virtual field for checking if overdue

### 1.2 Update Project Model

**File**: `backend/models/Project.js`

Add revisions field to project schema:

```javascript
revisions: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Revision'
}]
```

Add methods: `addRevision(revisionId)`, `removeRevision(revisionId)`

## Phase 2: Backend - Revision Controllers & Routes

### 2.1 Create Revision Controller

**File**: `backend/controllers/revisionController.js`

Implement controller functions:

- `createRevision` - POST /api/revisions (PM only)
- `getRevisionsByProject` - GET /api/revisions/project/:projectId
- `getRevisionById` - GET /api/revisions/:id
- `updateRevision` - PUT /api/revisions/:id (PM only)
- `deleteRevision` - DELETE /api/revisions/:id (PM only)
- `updateRevisionStatus` - PATCH /api/revisions/:id/status
- `addRevisionFeedback` - POST /api/revisions/:id/feedback
- `uploadRevisionAttachment` - POST /api/revisions/:id/attachments
- `removeRevisionAttachment` - DELETE /api/revisions/:id/attachments/:attachmentId

Each controller should:

- Include WebSocket real-time updates via socketService
- Log activities via Activity model
- Populate related data (project, assignedTo, createdBy)
- Handle Cloudinary file uploads/deletions

### 2.2 Create Revision Routes

**File**: `backend/routes/revisionRoutes.js`

Set up RESTful routes with:

- Authentication middleware (protect)
- Authorization middleware (authorize for PM role)
- File upload middleware for attachments
- All CRUD endpoints from controller

### 2.3 Register Routes in Server

**File**: `backend/server.js`

Import and mount revision routes:

```javascript
const revisionRoutes = require('./routes/revisionRoutes');
app.use('/api/revisions', revisionRoutes);
```

## Phase 3: Frontend - Revision Service

### 3.1 Create Revision Service

**File**: `frontend/src/modules/dev/DEV-services/revisionService.js`

Implement service methods:

- `createRevision(revisionData)`
- `getRevisionsByProject(projectId)`
- `getRevisionById(revisionId)`
- `updateRevision(revisionId, revisionData)`
- `deleteRevision(revisionId)`
- `updateRevisionStatus(revisionId, status)`
- `addRevisionFeedback(revisionId, feedback)`
- `uploadRevisionAttachment(revisionId, file)`
- `removeRevisionAttachment(revisionId, attachmentId)`

### 3.2 Export Revision Service

**File**: `frontend/src/modules/dev/DEV-services/index.js`

Add revision service to exports:

```javascript
export { revisionService } from './revisionService';
```

## Phase 4: Frontend - Update PM Project Detail Page

### 4.1 Replace Mock Data Loading

**File**: `frontend/src/modules/dev/DEV-pages/PM-pages/PM_project_detail.jsx`

Replace the mock data useEffect (lines 28-181) with real API calls:

1. **Load Project Data**:

   - Use `projectService.getProjectById(id)` to fetch project
   - Handle loading states and errors
   - Transform response data to match component expectations

2. **Load Milestones**:

   - Use `milestoneService.getMilestonesByProject(id)` to fetch milestones
   - Sort by sequence number
   - Populate with real data

3. **Load Tasks**:

   - Use `taskService.getTasksByProject(id)` to fetch tasks
   - Filter and display based on project

4. **Load Revisions**:

   - Use `revisionService.getRevisionsByProject(id)` to fetch revisions
   - Sort by sequence or createdAt
   - Display real revision data

### 4.2 Implement Real-Time Updates

Add WebSocket listeners for:

- `project_updated` - reload project data
- `milestone_created`, `milestone_updated`, `milestone_deleted` - reload milestones
- `task_created`, `task_updated`, `task_deleted` - reload tasks
- `revision_created`, `revision_updated`, `revision_deleted` - reload revisions

### 4.3 Update File Attachment Handling

Modify attachment display (lines 359-444) to:

- Use Cloudinary attachment structure from backend
- Display `secure_url`, `originalName`, `format`, `size`, `uploadedAt`
- Implement real file upload via `projectService.uploadProjectAttachment()`
- Implement real file deletion via `projectService.removeProjectAttachment()`
- Add proper error handling and loading states

### 4.4 Update Revision Status Dialog

Modify revision status dialog (lines 750-835) to:

- Call `revisionService.updateRevisionStatus()` when status changes
- Show toast notifications on success/error
- Reload revisions after status update
- Add loading state during API call

### 4.5 Add Error Handling

Implement comprehensive error handling:

- Display error messages with toast notifications
- Show fallback UI for failed API calls
- Add retry mechanisms for critical data
- Handle 404 errors (project not found) with redirect

### 4.6 Add Loading States

Improve loading UX:

- Separate loading states for project, milestones, tasks, revisions
- Show skeleton loaders for each section
- Prevent user interactions during loading
- Display progress indicators

## Phase 5: Backend - WebSocket Events for Revisions

### 5.1 Update Socket Service

**File**: `backend/services/socketService.js`

Add revision-related event handlers:

- `join_revision` - join revision room
- `leave_revision` - leave revision room
- Emit events: `revision_created`, `revision_updated`, `revision_deleted`, `revision_status_changed`

### 5.2 Update Revision Controller Events

Emit WebSocket events in revision controller:

- After creating revision: emit `revision_created` to project room
- After updating revision: emit `revision_updated` to project and revision rooms
- After deleting revision: emit `revision_deleted` to project room
- After status change: emit `revision_status_changed` to project room

## Phase 6: Testing & Validation

### 6.1 Backend Testing

- Test all revision CRUD operations via Postman/API client
- Verify WebSocket events are emitted correctly
- Test file upload/deletion for revision attachments
- Verify authorization (only PM can create/update/delete)

### 6.2 Frontend Testing

- Test project detail page loads with real data
- Verify milestones, tasks, and revisions display correctly
- Test file upload/download functionality
- Test revision status updates
- Verify real-time updates work via WebSocket
- Test error handling and edge cases (no data, network errors)

### 6.3 Integration Testing

- Create a project via PM dashboard
- Add milestones and tasks
- Create revisions and update their status
- Upload attachments to project and revisions
- Verify all data persists and displays correctly

## Phase 7: Demo Data Script (Optional)

### 7.1 Create Revision Demo Script

**File**: `backend/scripts/creating_revision.js`

Create script to generate demo revisions for existing projects:

- Link to existing projects
- Create 2-3 revisions per project with different statuses
- Add realistic descriptions and dates
- Professional console output

## Implementation Notes

- Use existing authentication middleware (protect, authorize)
- Follow existing code patterns from milestone and task controllers
- Maintain consistency with current API response format
- Use existing Cloudinary service for file uploads
- Implement proper error handling throughout
- Add appropriate console logging for debugging
- Ensure all API endpoints are documented in backend_progress_structure.md

### To-dos

- [ ] Create Revision model with schema, methods, and indexes
- [ ] Add revisions field and methods to Project model
- [ ] Implement complete revision controller with CRUD operations
- [ ] Create revision routes with authentication and authorization
- [ ] Register revision routes in server.js
- [ ] Create frontend revision service with all API methods
- [ ] Replace mock data with real API calls in PM_project_detail.jsx
- [ ] Add WebSocket real-time updates for revisions
- [ ] Implement real Cloudinary file upload/download for project and revisions
- [ ] Test all functionality end-to-end and fix any issues
- [ ] check the backend and frontend connectivity.