<!-- 7a727ef5-7160-43fe-9bcc-8dd04f093a92 f885884e-9b50-401e-9faf-9c4adc574a86 -->
# Lead Profile System Execution Plan

## Current Status Assessment

### Already Implemented ✓

- Backend endpoints: `getSalesTeam`, `requestDemo`, `transferLead`, `addNoteToLead` ✓
- DemoRequest model exists ✓
- Frontend service functions implemented ✓
- ConnectedLeadForm component exists ✓
- SL_leadProfile.jsx uses real data and has most features ✓
- Routes are properly configured ✓

### Issues Identified

1. **Conversion Form Data Mismatch**: SL_leadProfile.jsx conversion form sends wrong structure

   - Frontend sends: `{ projectName, mobileNo, finishedDays, web, app, description, totalCost, advanceReceived, includeGST }`
   - Backend expects: `{ projectName, projectType, estimatedBudget, startDate }`
   - Other pages (SL_app_client.jsx, etc.) use correct structure

2. **Conversion form in SL_leadProfile.jsx** needs to match backend API structure
3. **ProjectType format**: Backend expects object `{ web, app, taxi }` but conversion form sends separate booleans

## Execution Steps

### Phase 1: Fix Conversion Form Data Mapping

**File**: `frontend/src/modules/sells/SL-pages/SL_leadProfile.jsx`

1. Update `conversionData` state structure to match backend API:

   - Change from: `{ projectName, mobileNo, finishedDays, web, app, description, totalCost, advanceReceived, includeGST }`
   - Change to: `{ projectName, projectType: { web, app, taxi }, estimatedBudget, startDate }`

2. Update conversion form fields:

   - Remove: `mobileNo`, `finishedDays`, `advanceReceived`, `includeGST`
   - Keep but rename: `totalCost` → `estimatedBudget`
   - Transform: `web`/`app` checkboxes → `projectType` object
   - Add: `startDate` field (date picker)
   - Keep: `projectName`, `description` (optional)

3. Update `handleLeadConversion` function:

   - Transform form data to match backend structure before API call
   - Map `web`/`app`/`taxi` checkboxes to `projectType` object
   - Send correct field names: `estimatedBudget` instead of `totalCost`

### Phase 2: Verify and Test Integration

**Files**: Various frontend pages

1. Test conversion flow from SL_leadProfile.jsx:

   - Verify form validation works
   - Verify data transformation before API call
   - Verify success/error handling
   - Verify navigation after conversion

2. Ensure consistency across all conversion points:

   - SL_leadProfile.jsx (main profile page)
   - SL_app_client.jsx
   - SL_quotation_sent.jsx
   - SL_web.jsx
   - SL_dq_sent.jsx

### Phase 3: Verify Other Features

**File**: `frontend/src/modules/sells/SL-pages/SL_leadProfile.jsx`

1. Verify all existing features work:

   - Profile data fetching and display ✓
   - Status management (single-select radio buttons) ✓
   - Follow-up dialog integration ✓
   - Notes feature ✓
   - Demo request ✓
   - Transfer lead ✓
   - Lost status ✓
   - Create Profile CTA when missing ✓

2. Test edge cases:

   - Lead without profile (should show CTA)
   - Empty notes array
   - Missing optional fields
   - Status transitions validation

### Phase 4: End-to-End Testing

1. Test complete user flows:

   - Create new lead → Mark as connected → Create profile → View profile
   - Add notes → Update status → Request demo
   - Transfer lead → Convert to client

2. Verify backend responses:

   - All API endpoints return expected data structures
   - Error handling works correctly
   - Success messages display properly

## Technical Details

### Conversion Form Fix

**Current form fields** (lines 81-91 in SL_leadProfile.jsx):

```javascript
const [conversionData, setConversionData] = useState({
  projectName: '',
  mobileNo: '',
  finishedDays: '',
  web: false,
  app: false,
  description: '',
  totalCost: '',
  advanceReceived: '',
  includeGST: false
})
```

**Should be**:

```javascript
const [conversionData, setConversionData] = useState({
  projectName: '',
  projectType: { web: false, app: false, taxi: false },
  estimatedBudget: '',
  startDate: '',
  description: '' // optional, not sent but kept for UI
})
```

**Transform before API call**:

```javascript
const projectData = {
  projectName: conversionData.projectName,
  projectType: conversionData.projectType,
  estimatedBudget: parseFloat(conversionData.estimatedBudget) || 0,
  startDate: conversionData.startDate || new Date().toISOString()
}
```

## Validation Rules

- `projectName`: Required, non-empty string
- `projectType`: At least one of `web`, `app`, or `taxi` must be true
- `estimatedBudget`: Required, number >= 0
- `startDate`: Required, valid date (defaults to today if not provided)

## Files to Modify

1. `frontend/src/modules/sells/SL-pages/SL_leadProfile.jsx`

   - Update conversionData state structure
   - Update conversion form UI (lines ~932-1074)
   - Update handleLeadConversion function (lines ~258-273)
   - Update initial conversionData state from leadProfile (lines ~114-124)

## Success Criteria

1. Conversion form in SL_leadProfile.jsx matches backend API structure
2. Conversion works successfully from profile page
3. Client and Project records created correctly
4. Lead status updates to 'converted'
5. All other features continue to work as expected
6. Consistent conversion flow across all pages