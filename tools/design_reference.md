# Appzeto Mobile UI – Unified Design Reference

> **Purpose**
> This document is a **design reference file** for redesigning the Appzeto CRM (Channel Partner & related modules).
> It is inspired by multiple modern mobile apps (fintech, service marketplace, learning apps) but **does not copy content or structure** from any single source.

This file can be used by:

* UI/UX designers (Figma)
* Frontend developers (React / React Native)
* Product owners (design consistency)

---

## 1. Overall Design Philosophy

**Style Keywords**

* Mobile-first
* Clean & minimal
* Soft fintech feel
* Friendly but professional
* Trust-oriented

**Design Personality**

* Calm
* Confident
* Modern
* Premium but not flashy

---

## 2. Color System (Unified Palette)

### Primary Color

* **Primary Yellow / Amber**
  Used for highlights, primary cards, active states

```
Hex: #F6C453
Usage: CTA highlights, progress bars, badges
```

### Secondary Colors

* **Dark Text**: #1E1E1E
* **Muted Text**: #7A7A7A
* **Card Background**: #FFFFFF
* **App Background**: #F9F9F9

### Status Colors

* Success / Positive: #3BB273
* Warning / Attention: #F5A623
* Error / Negative: #E5533D
* Info / Neutral: #4A90E2

> Rule: **Never use harsh pure colors**. Always slightly muted.

---

## 3. Typography System

### Primary Font

* **Inter / SF Pro / Poppins** (any clean modern sans-serif)

### Font Sizes (Mobile First)

* Page Title: 18–20px
* Section Title: 15–16px
* Body Text: 13–14px
* Helper / Meta Text: 11–12px

### Font Weights

* Bold: Important numbers, names
* Medium: Section headers
* Regular: Content

---

## 4. Layout & Spacing Rules

### Screen Padding

* Horizontal: 16px
* Vertical: 12–16px

### Card Design

* Border Radius: 16–20px
* Shadow: Soft, low-opacity
* No hard borders (use spacing instead)

### Section Separation

* Space-based separation (12–24px)
* Avoid dividers unless necessary

---

## 5. Core UI Components

### A. Header (Top Bar)

* Minimal height
* Left: Back / Menu
* Center: Page title
* Right: Action icon (search / bell)

---

### B. Primary Highlight Card

Used for:

* Wallet balance
* Profile summary
* Dashboard KPIs

**Structure**

* Large value
* Supporting label
* Soft gradient background

---

### C. Action Tiles (Square Cards)

Used for:

* Quick actions
* Navigation shortcuts

**Rules**

* Icon on top
* Label below
* Rounded corners
* Tap feedback

---

### D. List Cards

Used for:

* Leads
* Clients
* Notifications
* Resources

**Structure**

* Left: Icon / Avatar
* Center: Title + subtext
* Right: Chevron / status

---

### E. Status Chips

Used everywhere for clarity

Examples:

* Converted
* Pending
* Active

**Rules**

* Rounded pill shape
* Soft background
* Small font

---

## 6. Navigation Pattern

### Bottom Navigation (Mobile First)

5 items max:

* Home
* Leads
* Add (+)
* Wallet
* Profile

**Rules**

* Active item highlighted with primary color
* Icons simple & consistent

---

### Side Drawer (Hamburger)

Used for secondary pages:

* Resources
* Quotations
* Demo Videos
* Notices
* Settings

---

## 7. Page-Level Design Patterns

### Dashboard

* Highlight card on top
* Stats in grid
* Alerts section
* Quick actions

---

### Leads

* Tab-based filtering
* Card-based leads
* Clear status indicators

---

### Wallet

* Balance summary
* Earnings breakdown
* Transaction list

---

### Profile

* Identity-focused
* Verification badge
* Share & QR support
* Performance snapshot

---

## 8. Interaction & Motion Guidelines

* Subtle animations only
* No heavy transitions
* Use motion to guide attention

Examples:

* Progress bar fill
* Card hover / tap
* Status change highlight

---

## 9. Iconography Rules

* Use outline icons
* Keep stroke consistent
* Avoid mixing icon styles

Preferred libraries:

* Lucide
* Phosphor
* Material Symbols (outlined)

---

## 10. Accessibility & Usability

* Touch targets minimum 44px
* High contrast for text
* Avoid yellow text on white
* Clear error messaging

---

## 11. What NOT To Do

❌ No heavy gradients everywhere
❌ No cluttered dashboards
❌ No long paragraphs
❌ No admin-style tables on mobile

---

## 12. How to Use This File

* Use this as a **single source of truth**
* Apply same colors, spacing & components across all modules
* Designers → convert to Figma components
* Developers → map components to reusable UI blocks

---

### Final Note

This design system ensures Appzeto feels:

* Unified
* Professional
* Trustworthy
* Scalable

without copying any external app directly.
