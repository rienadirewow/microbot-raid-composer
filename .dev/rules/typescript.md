# TypeScript Development Rules

## 🎯 Type Safety Standards

### Interface Definitions
- **Centralized types** in `src/types/index.ts` for shared interfaces
- **Domain-specific types** for WoW Classic data structures
- **Component props** typed with `defineProps<Interface>()`
- **Event payloads** typed with `defineEmits<{event: [payload: Type]}>()`

### Type Patterns
- **Union types** for WoW Classic enums (`Faction`, `WoWClass`, `Role`)
- **Literal types** for tier levels and license types
- **Optional properties** with `?` for flexible data structures
- **Generic types** for reusable component patterns

## 🔧 Implementation Guidelines

### Strict Type Checking
- **No `any` types** - use `unknown` for truly unknown data
- **Proper null checks** with optional chaining (`?.`) and nullish coalescing (`??`)
- **Type guards** for runtime data validation
- **Assertion functions** for data transformation safety

### Vue 3 + TypeScript Integration
- **Template type inference** through proper component typing
- **Store typing** with Pinia type inference
- **Computed return types** inferred from dependencies
- **Ref typing** with explicit generics when needed: `ref<Type>()`

## 📊 Data Structure Typing

### WoW Classic Domain Types
- **Character interfaces** with faction and tier constraints
- **Slot assignment types** with role and class validation
- **Export command types** for `.z` command generation
- **Database schema types** matching Supabase JSONB structure

### State Management Types
- **Store state interfaces** for each Pinia store
- **Action return types** for async operations
- **Getter return types** for computed store values
- **Mutation payload types** for state updates

## 🚀 Development Efficiency

### Type Inference
- **Let TypeScript infer** when types are obvious from context
- **Explicit typing** for public APIs and complex data flows
- **Type annotations** for function parameters and return values
- **Generic constraints** for flexible but safe type parameters

### Error Prevention
- **Strict mode enabled** in `tsconfig.json`
- **ESLint TypeScript rules** for code quality
- **Type-only imports** with `import type` when appropriate
- **Exhaustiveness checking** for union types in switch statements