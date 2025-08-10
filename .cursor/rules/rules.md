# Cursor IDE Development Rules

> **📋 READ GLOBAL RULES FIRST**: Always consult the comprehensive rules in `../../.dev/rules/` directory before applying these Cursor-specific guidelines.

## 🎯 Global Rules Reference

Consult these files in the `.dev/rules/` directory for complete development guidelines:
- **[Project Rules](../../.dev/rules/project.md)** - WoW Classic domain and architecture principles
- **[Vue 3 Rules](../../.dev/rules/vue.md)** - Vue 3 Composition API patterns
- **[TypeScript Rules](../../.dev/rules/typescript.md)** - Type safety and interface definitions
- **[Tailwind Rules](../../.dev/rules/tailwind.md)** - Utility-first CSS patterns
- **[Supabase Rules](../../.dev/rules/supabase.md)** - Database and authentication patterns

## 🎨 Cursor IDE Specific Guidelines

### Code Navigation & Discovery
- **Cmd+P/Ctrl+P file search**: Use `@` to search symbols, `#` to search workspace symbols
- **Go to Definition (Cmd+Click)**: Navigate between Vue components, TypeScript interfaces, and Pinia stores
- **Find All References (Shift+F12)**: Track WoW-specific terminology and component usage across codebase
- **Symbol Navigator (Cmd+Shift+O)**: Jump to component methods, computed properties, and reactive refs

### Cursor-Specific AI Features
- **Cursor Tab completions**: Accept AI suggestions for Vue 3 Composition API patterns and WoW domain logic
- **Cmd+K inline editing**: Use for refactoring component logic and TypeScript interface updates
- **Cursor Chat (@-references)**: Reference specific files when asking about WoW Classic business rules or Vue patterns
- **Apply in Editor**: Use AI suggestions for code improvements while maintaining project conventions

### IDE Optimizations for This Project
- **Vue Language Server**: Ensure Volar extension is enabled for Vue 3 + TypeScript support
- **TypeScript IntelliSense**: Leverage auto-imports for WoW domain types and Pinia store methods
- **Tailwind CSS IntelliSense**: Use class name completions and hover previews for utility combinations
- **File Tree Navigation**: Use workspace-specific settings to highlight `.dev/rules/` and `docs/` directories

### Debugging & Development Tools
- **Vue DevTools browser extension**: Debug Pinia store state and component reactivity
- **TypeScript error reporting**: Address type errors in Problems panel before committing
- **Integrated terminal**: Use project-specific npm scripts (`npm run dev`, `npm run type-check`)
- **Git integration**: Use Cursor's git features for WoW Classic feature branch management

### Project-Specific IDE Setup
- **Workspace settings**: Configure for Vue 3 + TypeScript + Tailwind development
- **File associations**: Associate `.vue` files with Vue language server
- **Snippet configuration**: Create snippets for WoW domain-specific component patterns
- **Extension recommendations**: Ensure team uses consistent Vue, TypeScript, and Tailwind extensions