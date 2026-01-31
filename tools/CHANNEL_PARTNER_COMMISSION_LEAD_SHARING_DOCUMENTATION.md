# Channel Partner Commission & Lead Sharing System Documentation

## Table of Contents
1. [Overview](#overview)
2. [Lead Sharing Mechanism](#lead-sharing-mechanism)
3. [Commission Calculation System](#commission-calculation-system)
4. [Complete Flow Diagrams](#complete-flow-diagrams)
5. [Data Models](#data-models)
6. [API Endpoints](#api-endpoints)
7. [Commission Scenarios](#commission-scenarios)
8. [Technical Implementation](#technical-implementation)

---

## Overview

The Channel Partner Commission & Lead Sharing System enables:
- **Lead Sharing**: Two-way sharing between Channel Partners (CP) and Sales Team Leads
- **Automatic Commission Calculation**: Dynamic commission percentages based on conversion scenarios
- **Wallet Integration**: Immediate commission distribution to CP wallets upon conversion
- **Admin Configuration**: Dynamic commission percentage management

---

## Lead Sharing Mechanism

### How Lead Sharing Works

The system supports **two-way lead sharing** between Channel Partners and Sales Team Leads:

#### 1. CP Shares Lead with Sales Team Lead

**Process:**
1. Channel Partner creates a lead in their system (`CPLead`)
2. CP decides to share the lead with a Sales Team Lead
3. System adds entry to `CPLead.sharedWithSales` array:
   ```javascript
   {
     salesId: ObjectId,      // Sales Team Lead ID
     sharedAt: Date,          // Timestamp
     sharedBy: ObjectId       // CP ID who shared
   }
   ```
4. Sales Team Lead can now see this lead in their shared leads list
5. Sales Team Lead can convert the lead (creates a `Lead` record in Sales system)

**Key Points:**
- The original `CPLead` remains in CP's system
- Sharing is tracked via `sharedWithSales` array
- Multiple Sales Team Leads can be shared with the same lead
- CP can unshare the lead at any time

#### 2. Sales Team Lead Shares Lead with CP

**Process:**
1. Sales Team Lead has a lead in their system (`Lead`)
2. Sales decides to share the lead with a Channel Partner
3. System creates a new `CPLead` record for the CP:
   - Phone number matches the Sales lead
   - `sharedFromSales` array is populated:
     ```javascript
     {
       leadId: ObjectId,      // Original Sales Lead ID
       sharedAt: Date,        // Timestamp
       sharedBy: ObjectId      // Sales Team Lead ID
     }
     ```
4. CP can now see this lead in their "Received from Sales" list
5. CP can convert the lead directly

**Key Points:**
- A new `CPLead` is created (not just a reference)
- Original `Lead` remains in Sales system
- Sharing is tracked via `sharedFromSales` array
- CP becomes the owner of this lead

### Tracking Mechanism

#### CPLead Model Fields

```javascript
{
  // Lead owned by CP
  assignedTo: ObjectId,           // CP ID (owner)
  createdBy: ObjectId,            // Who created it
  creatorModel: 'ChannelPartner', // Creator type
  
  // Sharing tracking
  sharedWithSales: [{             // CP shared with Sales
    salesId: ObjectId,
    sharedAt: Date,
    sharedBy: ObjectId            // CP who shared
  }],
  
  sharedFromSales: [{              // Sales shared with CP
    leadId: ObjectId,              // Original Sales Lead ID
    sharedAt: Date,
    sharedBy: ObjectId              // Sales who shared
  }],
  
  // Conversion tracking
  status: String,                  // 'new', 'connected', 'converted', etc.
  convertedToClient: ObjectId,     // Client ID if converted
  convertedAt: Date                // Conversion timestamp
}
```

---

## Commission Calculation System

### Commission Scenarios

The system calculates commissions based on **three scenarios**:

#### Scenario 1: CP Converts Own Lead
- **Lead Source**: Channel Partner
- **Converter**: Channel Partner
- **Commission**: `ownConversionCommission` (Default: 30%)
- **Condition**: CP converts a lead they created (no `sharedFromSales`)

#### Scenario 2: CP Shares Lead, Sales Converts
- **Lead Source**: Channel Partner
- **Converter**: Sales Team Lead
- **Commission**: `sharedConversionCommission` (Default: 10%)
- **Condition**: 
  - CP lead has `sharedWithSales` entry
  - Sales converts a `Lead` with matching phone number
  - System finds matching `CPLead` via `findSharedCPLead()`

#### Scenario 3: Sales Shares Lead, CP Converts
- **Lead Source**: Sales Team Lead
- **Converter**: Channel Partner
- **Commission**: `sharedConversionCommission` (Default: 10%)
- **Condition**: CP lead has `sharedFromSales` entry

### Commission Calculation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Lead Conversion Event                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  Determine Conversion Scenario     │
        └───────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌───────────────┐      ┌──────────────────┐
│ CP Converts   │      │ Sales Converts   │
│ Lead          │      │ Lead             │
└───────────────┘      └──────────────────┘
        │                       │
        ▼                       ▼
┌──────────────────┐   ┌──────────────────────┐
│ Check            │   │ Check if CPLead      │
│ sharedFromSales  │   │ shared with Sales    │
└──────────────────┘   │ (findSharedCPLead)   │
        │              └──────────────────────┘
        │                       │
        ▼                       ▼
┌──────────────────┐   ┌──────────────────────┐
│ Scenario:        │   │ Scenario:            │
│ - own (if none)  │   │ - shared (if found)  │
│ - shared (if     │   │ - no commission      │
│   sharedFromSales│   │   (if not found)     │
│   exists)        │   └──────────────────────┘
└──────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│ Get Commission Settings          │
│ - ownConversionCommission: 30%   │
│ - sharedConversionCommission: 10%│
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│ Calculate Commission Amount       │
│ amount = totalCost × percentage   │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│ Get/Create CP Wallet              │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│ Credit Wallet Balance             │
│ balance += commissionAmount       │
│ totalEarned += commissionAmount   │
└──────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────┐
│ Create Transaction Record         │
│ - type: 'credit'                  │
│ - transactionType: 'commission'   │
│ - reference: 'lead_conversion'    │
│ - status: 'completed'             │
└──────────────────────────────────┘
```

---

## Complete Flow Diagrams

### Flow 1: CP Creates Lead → CP Converts (Own Commission)

```
┌──────────────┐
│ Channel      │
│ Partner      │
└──────┬───────┘
       │
       │ 1. Create Lead
       ▼
┌──────────────────┐
│ CPLead Created   │
│ - assignedTo: CP │
│ - createdBy: CP  │
│ - status: 'new'  │
└────────┬─────────┘
         │
         │ 2. Work on Lead
         │    (follow-ups, etc.)
         ▼
┌──────────────────┐
│ CP Converts Lead │
│ POST /api/cp/    │
│ leads/:id/convert│
└────────┬─────────┘
         │
         │ 3. Determine Scenario
         ▼
┌──────────────────┐
│ Check:           │
│ sharedFromSales? │
│ → NO             │
│ Scenario: 'own'  │
└────────┬─────────┘
         │
         │ 4. Calculate Commission
         ▼
┌──────────────────┐
│ Commission:      │
│ 30% of totalCost │
└────────┬─────────┘
         │
         │ 5. Distribute to Wallet
         ▼
┌──────────────────┐
│ CP Wallet        │
│ balance += 30%   │
│ Transaction      │
│ created          │
└──────────────────┘
```

### Flow 2: CP Creates Lead → Shares with Sales → Sales Converts (Shared Commission)

```
┌──────────────┐         ┌──────────────┐
│ Channel      │         │ Sales Team   │
│ Partner      │         │ Lead         │
└──────┬───────┘         └──────┬───────┘
       │                        │
       │ 1. Create Lead         │
       ▼                        │
┌──────────────────┐            │
│ CPLead Created   │            │
│ - assignedTo: CP │            │
│ - status: 'new'  │            │
└────────┬─────────┘            │
         │                       │
         │ 2. Share with Sales   │
         │ POST /api/cp/leads/   │
         │ :id/share             │
         ▼                       │
┌──────────────────┐            │
│ CPLead Updated   │            │
│ sharedWithSales: │            │
│ [{               │            │
│   salesId: Sales, │            │
│   sharedAt: Date, │            │
│   sharedBy: CP    │            │
│ }]               │            │
└────────┬─────────┘            │
         │                       │
         │ 3. Sales sees shared   │
         │    lead in their list  │
         └───────────┬───────────┘
                     │
                     │ 4. Sales Converts
                     │ POST /api/sales/
                     │ leads/:id/convert
                     ▼
         ┌───────────────────────┐
         │ Sales Lead Conversion  │
         │ - Creates Client       │
         │ - Creates Project      │
         │ - totalCost: ₹10,000   │
         └───────────┬────────────┘
                     │
                     │ 5. Check for Shared CPLead
                     │ findSharedCPLead(phone, salesId)
                     ▼
         ┌───────────────────────┐
         │ Find CPLead where:    │
         │ - phone matches        │
         │ - sharedWithSales      │
         │   contains salesId     │
         │ - status != 'converted'│
         └───────────┬────────────┘
                     │
                     │ 6. Found! Calculate Commission
                     ▼
         ┌───────────────────────┐
         │ Commission:           │
         │ 10% of ₹10,000        │
         │ = ₹1,000              │
         └───────────┬────────────┘
                     │
                     │ 7. Distribute to CP Wallet
                     ▼
         ┌───────────────────────┐
         │ CP Wallet             │
         │ balance += ₹1,000     │
         │ Transaction created   │
         └───────────────────────┘
                     │
                     │ 8. Mark CPLead as converted
                     ▼
         ┌───────────────────────┐
         │ CPLead Updated        │
         │ - status: 'converted' │
         │ - convertedToClient   │
         │ - convertedAt: Date   │
         └───────────────────────┘
```

### Flow 3: Sales Creates Lead → Shares with CP → CP Converts (Shared Commission)

```
┌──────────────┐         ┌──────────────┐
│ Sales Team   │         │ Channel      │
│ Lead         │         │ Partner      │
└──────┬───────┘         └──────┬───────┘
       │                        │
       │ 1. Create Lead         │
       ▼                        │
┌──────────────────┐            │
│ Lead Created     │            │
│ - assignedTo:    │            │
│   Sales          │            │
│ - status: 'new'  │            │
└────────┬─────────┘            │
         │                       │
         │ 2. Share with CP      │
         │ (Creates CPLead)      │
         ▼                       │
┌──────────────────┐            │
│ CPLead Created   │            │
│ - assignedTo: CP │            │
│ - sharedFromSales│            │
│   [{             │            │
│     leadId: Lead,│            │
│     sharedAt:    │            │
│     Date,        │            │
│     sharedBy:    │            │
│     Sales        │            │
│   }]             │            │
└────────┬─────────┘            │
         │                       │
         │ 3. CP sees shared     │
         │    lead in their list │
         └───────────┬───────────┘
                     │
                     │ 4. CP Converts
                     │ POST /api/cp/
                     │ leads/:id/convert
                     ▼
         ┌───────────────────────┐
         │ CP Lead Conversion    │
         │ - Creates Client      │
         │ - totalCost: ₹10,000  │
         └───────────┬────────────┘
                     │
                     │ 5. Determine Scenario
                     ▼
         ┌───────────────────────┐
         │ Check:               │
         │ sharedFromSales?      │
         │ → YES                 │
         │ Scenario: 'shared'    │
         └───────────┬────────────┘
                     │
                     │ 6. Calculate Commission
                     ▼
         ┌───────────────────────┐
         │ Commission:           │
         │ 10% of ₹10,000       │
         │ = ₹1,000             │
         └───────────┬────────────┘
                     │
                     │ 7. Distribute to Wallet
                     ▼
         ┌───────────────────────┐
         │ CP Wallet             │
         │ balance += ₹1,000     │
         │ Transaction created   │
         └───────────────────────┘
```

---

## Data Models

### CPCommissionSettings

```javascript
{
  ownConversionCommission: Number,      // Default: 30
  sharedConversionCommission: Number,   // Default: 10
  isActive: Boolean,                    // Default: true
  updatedBy: ObjectId,                  // Admin ID
  createdAt: Date,
  updatedAt: Date
}
```

**Note**: This is a singleton model - only one active settings document exists at a time.

### CPLead (Relevant Fields)

```javascript
{
  phone: String,                        // Unique identifier
  assignedTo: ObjectId,                 // CP owner
  createdBy: ObjectId,                 // Creator ID
  creatorModel: String,                 // 'ChannelPartner' or 'Admin'
  
  // Sharing arrays
  sharedWithSales: [{
    salesId: ObjectId,
    sharedAt: Date,
    sharedBy: ObjectId                 // CP who shared
  }],
  
  sharedFromSales: [{
    leadId: ObjectId,                   // Original Sales Lead ID
    sharedAt: Date,
    sharedBy: ObjectId                  // Sales who shared
  }],
  
  // Conversion tracking
  status: String,                       // 'converted' when converted
  convertedToClient: ObjectId,
  convertedAt: Date,
  leadProfile: ObjectId                 // Contains conversionData.totalCost
}
```

### CPWalletTransaction

```javascript
{
  wallet: ObjectId,                     // CPWallet reference
  channelPartner: ObjectId,             // CP reference
  type: 'credit',                       // or 'debit'
  amount: Number,                        // Commission amount
  transactionType: 'commission',        // Type identifier
  description: String,                   // Detailed description
  reference: {
    type: 'lead_conversion',
    id: ObjectId                        // CPLead ID
  },
  status: 'completed',
  balanceAfter: Number,                  // Wallet balance after transaction
  createdAt: Date
}
```

---

## API Endpoints

### Commission Settings

#### GET `/api/admin/channel-partners/commission-settings`
Get current commission settings.

**Response:**
```json
{
  "success": true,
  "data": {
    "ownConversionCommission": 30,
    "sharedConversionCommission": 10,
    "updatedBy": {
      "name": "Admin Name",
      "email": "admin@example.com"
    },
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### PUT `/api/admin/channel-partners/commission-settings`
Update commission settings.

**Request Body:**
```json
{
  "ownConversionCommission": 35,
  "sharedConversionCommission": 12
}
```

**Response:**
```json
{
  "success": true,
  "message": "Commission settings updated successfully",
  "data": {
    "ownConversionCommission": 35,
    "sharedConversionCommission": 12,
    "updatedBy": {...},
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

### Lead Sharing

#### POST `/api/cp/leads/:id/share`
Share CP lead with Sales Team Lead.

**Request Body:**
```json
{
  "salesId": "sales_team_lead_id"
}
```

#### POST `/api/cp/leads/:id/unshare`
Unshare CP lead from Sales Team Lead.

**Request Body:**
```json
{
  "salesId": "sales_team_lead_id"
}
```

### Lead Conversion

#### POST `/api/cp/leads/:id/convert`
Convert CP lead to client (includes commission calculation).

**Request Body:**
```json
{
  "projectName": "Project Name",
  "totalCost": 10000,
  "advanceReceived": 5000,
  "includeGST": false,
  "finishedDays": 30
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead converted to client successfully",
  "data": {
    "lead": {...},
    "client": {...},
    "commission": {
      "amount": 3000,
      "percentage": 30,
      "scenario": "own"
    }
  }
}
```

---

## Commission Scenarios

### Scenario Matrix

| Lead Source | Converter | Commission Type | Percentage | Example (₹10K) |
|------------|-----------|----------------|------------|----------------|
| CP | CP | Own | 30% | ₹3,000 |
| CP | Sales | Shared | 10% | ₹1,000 |
| Sales | CP | Shared | 10% | ₹1,000 |

### Scenario Detection Logic

#### When CP Converts:
```javascript
function determineCPCommissionScenario(cpLead) {
  // If lead was shared FROM Sales, it's shared commission
  if (cpLead.sharedFromSales && cpLead.sharedFromSales.length > 0) {
    return 'shared';  // 10%
  }
  
  // Otherwise, it's CP's own lead
  return 'own';  // 30%
}
```

#### When Sales Converts:
```javascript
async function findSharedCPLead(phoneNumber, salesId) {
  // Find CPLead that:
  // 1. Has matching phone number
  // 2. Was shared with this Sales employee
  // 3. Not already converted by CP
  
  const cpLead = await CPLead.findOne({
    phone: phoneNumber,
    'sharedWithSales.salesId': salesId,
    status: { $ne: 'converted' }
  });
  
  if (cpLead) {
    // Calculate shared commission for CP
    return {
      cpLead: cpLead,
      channelPartnerId: cpLead.assignedTo._id
    };
  }
  
  return null;  // No commission
}
```

---

## Technical Implementation

### Commission Calculation Service

**File**: `backend/services/cpCommissionService.js`

#### Key Functions:

1. **`calculateCommission(scenario, totalCost, settings)`**
   - Calculates commission amount based on scenario
   - Returns: `{ amount, percentage, scenario }`

2. **`distributeCommission(channelPartnerId, amount, description, reference, commissionPercentage)`**
   - Credits CP wallet
   - Creates transaction record
   - Returns transaction object

3. **`determineCPCommissionScenario(cpLead)`**
   - Determines if commission is 'own' or 'shared'
   - Based on `sharedFromSales` array

4. **`findSharedCPLead(phoneNumber, salesId)`**
   - Finds CPLead shared with Sales employee
   - Used when Sales converts a lead
   - Returns CP info if found

### Integration Points

#### CP Lead Conversion
**File**: `backend/controllers/cpLeadController.js`

```javascript
// After creating client and updating lead
const scenario = determineCPCommissionScenario(lead);
const commissionResult = await calculateCommission(scenario, totalCost);

if (commissionResult.amount > 0) {
  await distributeCommission(
    cpId,
    commissionResult.amount,
    description,
    { type: 'lead_conversion', id: lead._id },
    commissionResult.percentage
  );
}
```

#### Sales Lead Conversion
**File**: `backend/controllers/salesController.js`

```javascript
// After Sales converts lead
const sharedCPLeadInfo = await findSharedCPLead(phoneNumber, req.sales.id);

if (sharedCPLeadInfo) {
  const commissionResult = await calculateCommission('shared', totalCost);
  
  await distributeCommission(
    sharedCPLeadInfo.channelPartnerId,
    commissionResult.amount,
    description,
    { type: 'lead_conversion', id: sharedCPLeadInfo.cpLead._id },
    commissionResult.percentage
  );
  
  // Mark CPLead as converted
  sharedCPLeadInfo.cpLead.status = 'converted';
  sharedCPLeadInfo.cpLead.convertedToClient = client._id;
  await sharedCPLeadInfo.cpLead.save();
}
```

---

## Important Notes

### Phone Number Matching
- **Critical**: Commission matching relies on phone number
- When Sales converts, system searches for CPLead with matching phone number
- Phone numbers must be exactly 10 digits (validated)

### Commission Timing
- Commissions are **immediately** added to wallet upon conversion
- No pending state - status is always 'completed'
- Transaction is created synchronously during conversion

### Error Handling
- Commission calculation errors are **logged but don't fail conversion**
- Conversion process continues even if commission fails
- Errors are logged to console for debugging

### Historical Tracking
- Commission percentage used is stored in transaction description
- Each transaction includes:
  - Amount
  - Percentage used
  - Scenario type
  - Reference to lead/client

### Settings Management
- Only one active settings document exists (singleton pattern)
- Old settings are deactivated when new ones are created
- Admin can update percentages at any time
- Changes apply to **future conversions only**

---

## Testing Scenarios

### Test Case 1: CP Own Conversion
1. CP creates lead
2. CP converts lead (₹10,000)
3. **Expected**: CP wallet credited ₹3,000 (30%)

### Test Case 2: CP Shares, Sales Converts
1. CP creates lead
2. CP shares with Sales Team Lead
3. Sales converts lead (₹10,000)
4. **Expected**: CP wallet credited ₹1,000 (10%)

### Test Case 3: Sales Shares, CP Converts
1. Sales creates lead
2. Sales shares with CP (creates CPLead)
3. CP converts lead (₹10,000)
4. **Expected**: CP wallet credited ₹1,000 (10%)

### Test Case 4: Commission Settings Update
1. Admin updates ownConversionCommission to 35%
2. CP converts lead (₹10,000)
3. **Expected**: CP wallet credited ₹3,500 (35%)

---

## Troubleshooting

### Commission Not Distributed

**Check:**
1. Is `totalCost` > 0?
2. Are commission settings active?
3. Check console logs for errors
4. Verify wallet exists for CP
5. Check transaction records in database

### Wrong Commission Percentage

**Check:**
1. Verify scenario detection logic
2. Check `sharedFromSales` / `sharedWithSales` arrays
3. Verify commission settings in database
4. Check transaction description for percentage used

### Shared Lead Not Found

**Check:**
1. Phone number matches exactly
2. `sharedWithSales` array contains correct salesId
3. CPLead status is not 'converted' before Sales conversion
4. CPLead exists in database

---

## Future Enhancements

1. **Commission History**: Track all commission changes over time
2. **Commission Reports**: Generate reports by CP, date range, scenario
3. **Partial Commissions**: Support for milestone-based commissions
4. **Commission Approval**: Optional approval workflow before distribution
5. **Multi-level Commissions**: Support for team-based commission structures

---

**Document Version**: 1.0  
**Last Updated**: January 2024  
**Maintained By**: Development Team
