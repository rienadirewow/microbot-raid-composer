# Vue 3 Development Rules

## 🚀 Framework Standards

### Composition API Patterns
- **Always use Vue 3** with Composition API and `<script setup>` syntax
- **Component structure**: Use `defineProps<Interface>()` for typed props
- **Event handling**: Use `defineEmits<{eventName: [payload: Type]}>()` for events
- **Reactivity**: Prefer `ref()` over `reactive()` for primitives
- **Computed state**: Use `computed()` for derived state and complex calculations

### Component Architecture
- **Single File Components** order: `<template>`, `<script setup>`, `<style>`
- **Props down, events up** for component communication
- **Composables** for reusable logic patterns
- **Store integration** via Pinia for persistent state

## 🔄 State Management with Pinia

### Store Patterns
- **charactersStore**: Character CRUD operations and computed properties
- **raidsStore**: Raid building, slot assignment, export generation
- **authStore**: Supabase authentication state management

### Reactive Patterns
- **Auto-save watchers** on critical data changes
- **Computed getters** for filtered/sorted data views
- **Actions** for complex state mutations and async operations

## 🎨 Component Guidelines

### Template Best Practices
- **Conditional rendering** with `v-if`/`v-show` based on performance needs
- **List rendering** with proper `:key` attributes for stable DOM updates
- **Event modifiers** for clean event handling (`.prevent`, `.stop`, etc.)
- **Slot patterns** for flexible component composition

### Script Setup Patterns
- **Import organization**: Types, composables, components, utilities
- **Lifecycle hooks** only when needed (prefer reactive patterns)
- **Template refs** for direct DOM access (sparingly)
- **Provide/inject** for deep component communication when props are insufficient

## 🔧 Integration Patterns

### Router Integration
- **Vue Router 4** with composables (`useRouter`, `useRoute`)
- **Route guards** for authentication and navigation protection
- **Dynamic imports** for code splitting on route level

### External Library Integration
- **Supabase client** accessed through auth store
- **Utility libraries** imported at component level when needed
- **Type definitions** for external APIs and services