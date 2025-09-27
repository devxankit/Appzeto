# Appzeto Theme Rules & Design System

## 🎨 **Color System & Gradients**

### **Primary Color Palette**
- **Teal Theme**: Use teal-based gradients as primary brand colors
- **Gradient Patterns**: Always use `bg-gradient-to-br` (bottom-right) for diagonal gradients
- **Color Combinations**: 
  - `from-emerald-500/20 to-teal-600/20` (success/positive)
  - `from-amber-500/20 to-yellow-600/20` (warning/attention)
  - `from-blue-500/20 to-cyan-600/20` (info/neutral)
  - `from-purple-500/20 to-violet-600/20` (premium/special)
  - `from-rose-500/20 to-pink-600/20` (urgent/important)

### **Dark Theme Cards**
- **Background**: `bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900`
- **Border**: `border-slate-700/50`
- **Text**: White with gradient text effects for headings
- **Shadows**: `shadow-xl` with custom box-shadow for depth

## 🔮 **Glassmorphism Effects**

### **Backdrop Blur Standards**
- **Primary**: `backdrop-blur-sm` for main glassmorphism
- **Secondary**: `backdrop-blur-md` for enhanced effects
- **Background Opacity**: Use `/20`, `/30`, `/50` opacity levels
- **Border**: Always include `border border-white/20` or `border border-gray-200/50`

### **Glassmorphism Patterns**
```css
/* Standard Glassmorphism Card */
bg-gradient-to-br from-color-500/20 to-color-600/20 
backdrop-blur-sm rounded-xl p-4 border border-color-400/30
```

### **Icon Containers**
- **Size**: `w-12 h-12` for main icons, `w-7 h-7` for secondary
- **Background**: `bg-white/20 backdrop-blur-sm`
- **Border**: `border border-white/30`
- **Shape**: `rounded-xl` for consistency

## 🎭 **Animation System**

### **Scroll-Triggered Animations**
- **Setup**: Use `useRef` and `useInView` from framer-motion
- **Margin**: `margin: "-100px"` for early trigger
- **Once**: `once: true` to prevent re-triggering

### **Animation Patterns**
```javascript
// Container Animation
initial={{ opacity: 0, y: 50 }}
animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
transition={{ duration: 0.8, ease: "easeOut" }}

// Staggered Items
transition={{ duration: 0.6, delay: 0.1 + (index * 0.1), ease: "easeOut" }}

// Scale + Slide
initial={{ opacity: 0, y: 30, scale: 0.9 }}
animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
```

### **Hover Effects**
- **Scale**: `whileHover={{ scale: 1.02, y: -2 }}`
- **Tap**: `whileTap={{ scale: 0.98 }}`
- **Duration**: `transition-all duration-300`

## 📐 **Layout & Spacing**

### **Container Structure**
- **Main Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Mobile Padding**: `pt-3 pb-3` (accounts for navbar)
- **Desktop Padding**: `lg:pt-16 lg:pb-4`
- **Section Spacing**: `space-y-6` between major sections

### **Card Dimensions**
- **Padding**: `p-4` for standard cards, `p-5` for hero cards
- **Border Radius**: `rounded-xl` for cards, `rounded-2xl` for hero sections
- **Margins**: `mb-4` or `mb-5` between card sections

### **Grid Systems**
- **Two Column**: `grid grid-cols-2 gap-3` or `gap-4`
- **Three Column**: `grid grid-cols-3 gap-3` or `gap-4`
- **Responsive**: Use `lg:` prefixes for desktop layouts

## 🎯 **Typography Hierarchy**

### **Text Sizes**
- **Hero Title**: `text-lg font-bold` (18px)
- **Card Titles**: `text-sm font-semibold` (14px)
- **Body Text**: `text-xs` (12px) for secondary info
- **Numbers**: `text-xl` or `text-2xl font-bold` for emphasis

### **Text Colors**
- **Primary**: `text-white` on dark backgrounds
- **Secondary**: `text-gray-300` or `text-gray-600`
- **Accent**: Use color-specific text (e.g., `text-emerald-200`)

## ✨ **Visual Effects**

### **Shadows**
- **Standard**: `shadow-xl`
- **Hover**: `hover:shadow-2xl`
- **Custom**: Use inline styles for complex shadows
- **Depth**: Layer shadows for 3D effect

### **Status Indicators**
- **Dots**: `w-2 h-2 rounded-full` with color coding
- **Animations**: `animate-pulse` for active states
- **Colors**: Yellow (pending), Green (active), White (neutral)

### **Background Patterns**
- **Sparkles**: Small animated dots with `animate-pulse`
- **Grid**: Subtle radial gradient patterns
- **Opacity**: Use `/20` to `/40` opacity levels

## 📱 **Responsive Design**

### **Mobile-First Approach**
- **Default**: Mobile layout (`lg:hidden`)
- **Desktop**: `hidden lg:block` for desktop-specific layouts
- **Breakpoints**: Use `lg:` prefix for desktop adaptations

### **Touch Targets**
- **Minimum Size**: 44px (w-11 h-11) for interactive elements
- **Spacing**: Adequate spacing between touch targets
- **Feedback**: Visual feedback on touch interactions

## 🎨 **Component Patterns**

### **Metric Cards**
```jsx
<motion.div className="bg-gradient-to-br from-color-500/20 to-color-600/20 backdrop-blur-sm rounded-xl p-4 border border-color-400/30">
  <div className="flex items-center justify-between mb-2">
    <p className="text-color-200 text-sm font-semibold">Label</p>
    <div className="w-7 h-7 bg-gradient-to-br from-color-400 to-color-500 rounded-lg flex items-center justify-center">
      <Icon className="text-white text-sm" />
    </div>
  </div>
  <p className="text-2xl font-bold text-white">Value</p>
</motion.div>
```

### **Tile Cards**
```jsx
<motion.div className="bg-gradient-to-br from-color-500 via-color-600 to-color-600 rounded-xl p-4 text-white shadow-xl">
  <div className="flex justify-center mb-3">
    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
      <Icon className="text-xl text-white" />
    </div>
  </div>
  <h3 className="font-bold text-sm mb-1.5 text-center">Title</h3>
  <div className="flex items-center justify-center space-x-2 mb-2.5">
    <div className="w-2 h-2 bg-color rounded-full animate-pulse"></div>
    <p className="text-xs font-semibold">Status</p>
  </div>
</motion.div>
```

## 🔧 **Implementation Guidelines**

### **Required Imports**
```javascript
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
```

### **Animation Setup**
```javascript
const elementRef = useRef(null)
const elementInView = useInView(elementRef, { once: true, margin: "-100px" })
```

### **Color Consistency**
- Always use the centralized color system
- Maintain opacity levels (`/20`, `/30`, `/50`)
- Use consistent gradient directions (`bg-gradient-to-br`)

### **Performance**
- Use `once: true` for scroll animations
- Optimize animation durations (0.6s-0.8s)
- Use `ease: "easeOut"` for natural feel

---

**Remember**: Consistency is key. Follow these patterns across all components to maintain the Appzeto design system integrity.
