# Sales Module - Second Bug Audit (Round 2)

**Date:** Feb 2026  
**Scope:** Additional bugs found after initial audit fixes

---

## 1. BACKEND AMOUNT PARSING - COMMA-SEPARATED VALUES

### 1.1 createPaymentReceipt (salesController ~L216)
- **Issue:** `Math.round(parseFloat(amount))` - `parseFloat("10,000")` returns 10 (stops at comma)
- **Impact:** User enters "10,000" → receipt created for ₹10 instead of ₹10,000
- **Fix:** Use `Number(String(amount).replace(/,/g,''))` before validation/round

### 1.2 createPaymentReceipt for client (salesController ~L4653)
- **Issue:** `parseFloat(amount)` - same comma bug; also no Math.round (could store decimals)
- **Impact:** "10,000" → ₹10; inconsistent with other receipt creation
- **Fix:** Use parseAmount helper + Math.round

### 1.3 increaseCost request (salesController ~L4975)
- **Issue:** `parseFloat(amount)` - "10,000" → 10
- **Impact:** Cost increase request for wrong amount
- **Fix:** Use parseAmount helper

---

## 2. SL_DASHBOARD - TOTAL FALLBACK (LOW PRIORITY)

### 2.1 totalLeads fallback
- **Location:** SL_dashboard.jsx L222
- **Code:** `const total = s?.data?.totalLeads ?? Object.values(statusCounts).reduce((a,b)=>a+b,0)`
- **Issue:** When totalLeads is missing, fallback sums statusCounts. This can double-count (connected is broad) - same bug we fixed on backend. Backend now always returns totalLeads, so fallback rarely triggers.
- **Impact:** Low - edge case when API returns malformed response
- **Recommendation:** Use `s?.data?.totalLeads ?? 0` to avoid wrong sum, or leave as-is (rare edge case)

---

## 3. SL_PROFILE - ACTIVE LEADS FORMULA (MINOR)

### 3.1 Missing demo_requested?
- **Location:** SL_profile.jsx L127-134
- **Code:** activeLeads = connected + followup + hot + quotation_sent + demo_sent + web + app_client
- **Question:** Should demo_requested be included? Leads awaiting demo are "active" in pipeline.
- **Impact:** Minor - depends on product definition of "active"
- **Recommendation:** Confirm with product; add demo_requested if intended

---

## 4. VERIFIED AS CORRECT

- Division by zero: Backend checks teamLeadTarget > 0, activeTarget > 0 before dividing
- Response handling: Services use optional chaining and fallbacks
- FunnelData percentage: Now uses .value
- Total leads: Backend uses Lead.countDocuments
