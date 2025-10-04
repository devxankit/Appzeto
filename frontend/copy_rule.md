## Copying Pages/Forms From Reference → Our Project (Reliable Checklist)

Use this guide to copy any React page or form from the reference code into our project so it works the first time with correct theme, animations, imports, navbar context, and mock data.

### 1) File locations and naming
- Pages go in: `src/modules/dev/DEV-pages/PM-pages/`
- PM components go in: `src/modules/dev/DEV-components/`
- Shared UI components live in: `src/components/ui/`

### 2) Import path rules
- Replace reference Magic UI imports:
  - `from './magicui/<component>'` → `from '../../components/ui/<component>'` (for pages)
  - For DEV-components importing UI: `from '../../../components/ui/<component>'`
- Replace reference utils path:
  - `from '../../lib/utils'` → `from '@/lib/utils'`
- Use icons from `lucide-react` consistently.

### 3) Theme and Tailwind
- Ensure theme colors are teal/cyan and mapped to Tailwind:
  - In `src/index.css` `:root` and `.dark`, variables must include:
    - `--primary`, `--primary-hover`, `--primary-light`, `--primary-dark`, `--ring`
    - Example (HSL): `--primary: 175 85% 48%` and matching hover/light/dark.
- `tailwind.config.js` must expose:
  - `colors.primary.{DEFAULT,foreground,hover,light,dark}`
  - animations/keyframes used by Magic UI: `marquee`, `marquee-vertical`, `shiny-text`, `aurora`, `rippling`.
- Use these classes in copied code:
  - Gradients: `bg-gradient-to-r from-primary to-primary-dark`
  - Focus states: `focus:border-primary focus:ring-primary/20`
  - Status/Badges: leverage `text-primary`, `border-primary/20`, `bg-primary/10`.

### 4) Navbar awareness and layout spacing
- Always render our navbar component: `PM_navbar` (not reference `PMNavbar`).
- Page wrappers must account for fixed mobile/desktop navbars:
  - `<main className="pt-16 pb-24 md:pt-20 md:pb-8">`
  - Container: `px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8`

### 5) Dialog vs Page mode for forms
- Pattern (as used in `PM_project_form.jsx`):
  - Detect edit mode with `useParams()` → `const isEditMode = !!id;`
  - Edit mode: render full page with `<PM_navbar />` and the spacing above.
  - Create mode: render a `<Dialog>` with the form body.
  - Provide loading UI for edit mode (`isLoading`) before showing the form.

### 6) Framer Motion animations (match reference)
- Import: `import { motion, AnimatePresence } from 'framer-motion';`
- Animate field sections with staggered delays:
  - `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`
  - `transition={{ delay: <0.1, 0.2, 0.3, ...> }}` per section order.
- Wrap error messages in `AnimatePresence` and animate height/opacity:
  - `initial={{ opacity: 0, height: 0 }}` → `animate={{ opacity: 1, height: 'auto' }}` → `exit={{ opacity: 0, height: 0 }}`
- Footer action row (Create/Update buttons) also animates in with the largest delay.

### 7) Magic UI components (dropdowns with animations)
- Use our UI components with built-in animations:
  - `Combobox`, `MultiSelect`, `DatePicker`
- Replace basic `<select>` with `Combobox` when the reference uses it.
- Ensure options are formatted `{ value, label, subtitle?, icon?, avatar? }`.

### 8) Data policy for DEV pages (mock instead of APIs)
- Do not copy reference API calls or contexts.
- Simulate network with `await new Promise(r => setTimeout(r, 500))`.
- Keep the same data shapes the page expects (ids, fields, status/priority values) to avoid UI regressions.
- For list pages, set local state from mock arrays; for forms, preload mock lists and prefill when `isEditMode`.

### 9) Validation pattern
- Keep validation synchronous and user-friendly:
  - Build `newErrors`, set via `setErrors(newErrors)`.
  - Clear field error in `handleInputChange` for that field.
  - Animate error messages via `AnimatePresence`.

### 10) Common replacements (quick-find list)
- Reference → Our project mappings:
  - `./magicui/<x>` → `../../components/ui/<x>` (for pages)
  - `./magicui/<x>` → `../../../components/ui/<x>` (for DEV-components)
  - `../../lib/utils` → `@/lib/utils`
  - `PMNavbar` → `PM_navbar`
  - Colors: replace `text-blue-*`/`bg-blue-*` with `text-primary`/`bg-primary` or gradient classes.

### 11) Testing checklist (must pass before commit)
- Theme
  - Buttons/tiles use `from-primary to-primary-dark` gradients.
  - Focus and ring colors use `primary`.
- Layout
  - Top/bottom spacing works on mobile (no content under fixed navbars).
  - Desktop spacing correct; container width applies.
- Animations
  - Sections fade/slide in sequence.
  - Dropdowns open/close smoothly (Combobox/MultiSelect/DatePicker).
  - Error messages animate in/out.
- Data
  - List pages render from mock data after simulated delay.
  - Forms preload mock options; edit mode pre-fills mock item.

### 12) Minimal example — section with animation and error
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
  className="space-y-2"
>
  <label className="text-sm font-semibold text-gray-700">Project Name</label>
  <Input
    value={formData.name}
    onChange={(e) => handleInputChange('name', e.target.value)}
    className={`h-12 rounded-xl border-2 ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-primary focus:ring-primary/20'}`}
  />
  <AnimatePresence>
    {errors.name && (
      <motion.p
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="text-sm text-red-500"
      >
        {errors.name}
      </motion.p>
    )}
  </AnimatePresence>
  {/* Next fields use delays 0.3, 0.4, ... */}
```

### 13) Gotchas to avoid
- Don’t import reference `PM-Navbar`; always use `PM_navbar`.
- Don’t copy reference API/contexts; use mock data in DEV pages.
- Don’t regress theme variables; keep HSL values consistent in `index.css`.
- Keep import depths correct for where the file lives (page vs DEV-component).

### 14) Final pass before opening PR
- Run dev server, verify no 500s in network tab.
- Scan console for missing imports/paths.
- If dropdowns don’t animate, verify `framer-motion` imports and `AnimatePresence` usage.
- If colors look off, re-check `index.css` variables and Tailwind `primary` mapping.

This checklist is what we followed to build `PM_projects.jsx` and `PM_project_form.jsx`. Reusing it will keep future copies consistent and error‑free.


