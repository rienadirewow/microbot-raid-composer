# Tailwind CSS Development Rules

## 🎨 Utility-First Approach

### Core Principles
- **Utility classes over custom CSS** for consistent design
- **Responsive design** with mobile-first approach
- **Component composition** through utility combinations
- **Consistent spacing** using Tailwind's spacing scale

### Class Organization
- **Logical grouping** of related utilities: `"flex items-center justify-between"`
- **Responsive modifiers** for different screen sizes: `sm:`, `md:`, `lg:`, `xl:`
- **State modifiers** for interactions: `hover:`, `focus:`, `active:`
- **Variant grouping** to reduce class duplication

## 📱 Responsive Design Patterns

### Mobile-First Strategy
- **Base styles** for mobile devices (default)
- **Progressive enhancement** with responsive modifiers
- **Breakpoint considerations** for WoW-themed UI elements
- **Touch-friendly interfaces** for companion assignment

### Layout Utilities
- **Flexbox layouts** for component arrangement: `flex`, `items-center`, `justify-between`
- **Grid systems** for raid slot arrangements: `grid`, `grid-cols-5`, `gap-4`
- **Spacing consistency** with margin/padding utilities: `p-4`, `mx-auto`, `space-x-2`
- **Container utilities** for content width management

## 🎮 WoW Classic Theme Integration

### Color Patterns
- **Class colors** for character representations
- **Faction colors** for Alliance/Horde distinctions
- **Role indicators** with consistent color coding (blue for tank, green for healer, red for DPS)
- **Status feedback** with semantic color usage

### Component Styling
- **Card components** with subtle shadows and borders
- **Interactive elements** with clear hover and focus states
- **Form controls** with WoW Classic aesthetic
- **Modal overlays** with proper z-index management

## ⚡ Performance Considerations

### Class Optimization
- **Minimal arbitrary values** - use design tokens when possible: `w-[calc(100%-2rem)]` only when necessary
- **Purge optimization** through proper class usage
- **Reusable patterns** extracted to component classes when appropriate
- **Critical CSS** considerations for above-the-fold content

### Maintainability
- **Consistent naming** for custom component classes
- **Documentation** of complex utility combinations
- **Design system adherence** through Tailwind configuration
- **Cross-browser compatibility** through Tailwind's browser support