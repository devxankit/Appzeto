# Admin Project Management Backend - Testing Guide

## Overview
This guide provides comprehensive instructions for testing the Admin Project Management backend implementation, including database seeding, API testing, and end-to-end workflow verification.

## Prerequisites
- Node.js installed
- MongoDB running locally or accessible
- Backend dependencies installed (`npm install`)

## Quick Start

### 1. Seed Database with Sample Data
```bash
cd backend
npm run seed
```

This will:
- Clear existing data
- Create sample users (Admin, PMs, Employees, Clients, Sales)
- Create sample projects with different statuses
- Create milestones and tasks
- Set up relationships between all entities

### 2. Test All APIs
```bash
npm run test-apis
```

This will test:
- Authentication for all user types
- Statistics API
- Project management APIs
- PM assignment workflow
- PM new projects APIs
- User management APIs
- Error handling

### 3. Run Complete Test Suite
```bash
npm run test-all
```

This will seed the database and run all API tests in sequence.

## Manual Testing Workflow

### Step 1: Start Backend Server
```bash
npm run dev
```

### Step 2: Test Admin Login
- Email: `admin@appzeto.com`
- Password: `admin123`

### Step 3: Test Admin Project Management Page
1. Navigate to Admin Project Management page
2. Verify statistics cards show real data
3. Check pending projects tab shows projects from sales
4. Test PM assignment functionality
5. Verify active projects show with PM details
6. Check completed projects tab
7. Test employee, client, and PM management tabs

### Step 4: Test PM Login and New Projects
- Email: `david@appzeto.com` or `lisa@appzeto.com`
- Password: `pm123`

1. Navigate to PM New Projects page
2. Verify assigned projects appear
3. Test meeting status update
4. Test project start functionality
5. Test project activation

## API Endpoints Testing

### Statistics API
```bash
GET /api/admin/projects/management-statistics
Authorization: Bearer <admin-token>
```

### Project Management APIs
```bash
# Get all projects
GET /api/admin/projects
Authorization: Bearer <admin-token>

# Get pending projects
GET /api/admin/projects/pending
Authorization: Bearer <admin-token>

# Get PMs for assignment
GET /api/admin/projects/pms-for-assignment
Authorization: Bearer <admin-token>

# Assign PM to pending project
POST /api/admin/projects/pending/:projectId/assign-pm
Authorization: Bearer <admin-token>
Body: { "pmId": "pm-id" }
```

### PM New Projects APIs
```bash
# Get new projects for PM
GET /api/pm/new-projects
Authorization: Bearer <pm-token>

# Update meeting status
PATCH /api/pm/projects/:projectId/meeting-status
Authorization: Bearer <pm-token>
Body: { "meetingStatus": "done" }

# Start project
PATCH /api/pm/projects/:projectId/start
Authorization: Bearer <pm-token>

# Activate project
PATCH /api/pm/projects/:projectId/activate
Authorization: Bearer <pm-token>
Body: { "dueDate": "2024-03-15", "assignedTeam": ["emp-id1", "emp-id2"] }
```

## Sample Data Overview

### Users Created
- **Admin**: admin@appzeto.com / admin123
- **PMs**: david@appzeto.com, lisa@appzeto.com, mike@appzeto.com / pm123
- **Sales**: priya@appzeto.com, amit@appzeto.com, sneha@appzeto.com / sales123
- **Employees**: emma@appzeto.com, tom@appzeto.com, sarah@appzeto.com, mike.j@appzeto.com, lisa.g@appzeto.com / emp123

### Projects Created
- **3 Pending Projects** (from sales team, status: pending-assignment)
- **2 Active Projects** (assigned to PMs, status: active)
- **2 Completed Projects** (status: completed)
- **1 On-Hold Project** (status: on-hold)

### Project Flow Testing
1. **Sales → Admin**: Projects submitted by sales team appear in pending projects
2. **Admin → PM**: Admin assigns PM to pending project, status changes to 'untouched'
3. **PM Management**: PM sees project in "New Projects", can update meeting status and start project
4. **Project Activation**: PM activates project with team assignment, status changes to 'active'

## Error Handling Tests

### Test Cases
1. **Unauthorized Access**: Try accessing admin APIs without token
2. **Invalid Project ID**: Try accessing non-existent project
3. **Invalid PM Assignment**: Try assigning invalid PM to project
4. **Permission Errors**: Try PM accessing admin-only endpoints
5. **Validation Errors**: Try creating project with missing required fields

### Expected Responses
- 401: Unauthorized access
- 404: Resource not found
- 400: Bad request/validation error
- 403: Forbidden/permission denied
- 500: Internal server error

## Performance Testing

### Database Queries
- Statistics API uses aggregation pipelines for optimal performance
- Project listing includes comprehensive population and metrics calculation
- PM assignment includes validation and relationship updates

### Frontend Integration
- Real-time statistics updates
- Proper error handling and user feedback
- Loading states and error messages
- Fallback to mock data if APIs fail

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env file

2. **Authentication Failures**
   - Verify user credentials in seeded data
   - Check JWT token expiration

3. **API Response Errors**
   - Check server logs for detailed error messages
   - Verify request format and required fields

4. **Frontend Integration Issues**
   - Check browser console for JavaScript errors
   - Verify API base URL configuration
   - Check network tab for failed requests

### Debug Commands
```bash
# Check database connection
npm run status

# View server logs
npm run dev

# Test specific functionality
npm run test-apis
```

## Success Criteria

### Backend APIs
- ✅ All authentication endpoints working
- ✅ Statistics API returns accurate real-time data
- ✅ Project management APIs handle all CRUD operations
- ✅ PM assignment workflow functions correctly
- ✅ PM new projects APIs support complete workflow
- ✅ Error handling covers all edge cases

### Frontend Integration
- ✅ Admin page displays real statistics
- ✅ Project listing shows comprehensive data
- ✅ PM assignment works with real API calls
- ✅ Error handling provides user feedback
- ✅ Loading states work correctly

### End-to-End Workflow
- ✅ Sales team can submit projects
- ✅ Admin can view and assign pending projects
- ✅ PMs receive assigned projects
- ✅ PMs can manage new projects through activation
- ✅ Statistics update in real-time
- ✅ All status transitions work correctly

## Next Steps

After successful testing:
1. Deploy backend to production environment
2. Update frontend API base URLs
3. Configure production database
4. Set up monitoring and logging
5. Implement additional features as needed

## Support

For issues or questions:
1. Check server logs for detailed error messages
2. Verify database connection and data integrity
3. Test individual API endpoints using tools like Postman
4. Check frontend browser console for client-side errors
