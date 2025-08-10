# Technical Documentation

## Core Files
- `src/types/index.ts` - TypeScript interfaces
- `src/data/wow-data.ts` - WoW Classic reference data  
- `src/stores/characters.ts` - Character CRUD with Pinia
- `src/stores/raids.ts` - Raid building and export
- `src/composables/useStorage.ts` - localStorage + Supabase abstraction

## Database Schema
Single `user_data` table with JSONB for flexible storage:
- `characters`: Array of PlayerCharacter objects
- `raids`: Array of RaidComposition objects
- `settings`: User preferences

## Storage Strategy
- **Unauthenticated**: localStorage only
- **Authenticated**: Auto-migrate to Supabase, real-time sync

## Data Structures

### Core Types (see `src/types/index.ts`)

**PlayerCharacter**: User's actual WoW characters (max 10 per account)
- Each level 60 character can hire 4 companions
- Tracks tier progression unlocks (t0r-t5r, t0d-t5d)
- Enforces faction consistency

**CompanionAssignment**: AI companions hired from player characters
- User-defined names and configurations
- Inherits faction from owner character
- Limited by owner's tier progression

**RaidComposition**: 40-slot raid structure
- 8 groups of 5 slots each
- Raid can mix Alliance/Horde companions
- Tracks creation and modification timestamps

### Business Rules (enforced in `src/utils/validation.ts`)

**Character Ownership**
- Players have 1-10 characters per account
- Each level 60 character can hire 4 companions
- Companions inherit faction from owner character

**Faction Restrictions**
- Paladin: Alliance only (Human, Dwarf)
- Shaman: Horde only (Orc, Tauren, Troll)
- Raids can mix Alliance/Horde companions

**Tier Progression**
- Linear unlock: t0r → t1r → t2r → t3r → t4r → t5r
- Separate raid (r) and dungeon (d) tracks
- Companions can only use tiers unlocked by owner

## Application Flows

### 1. Character Management Flow

**New User Experience:**
1. User opens app → lands on Raid Builder (no auth required)
2. Wants to save work → clicks "Sign In" → Supabase Auth UI
3. After auth → prompted to create first character
4. Character creation → validates class/race restrictions

**Character Creation Process:**
- Input: Name, Class, Race, Level, Unlocked Tiers
- Validation: Class-race compatibility, faction consistency
- Storage: Added to user's character array via `charactersStore.addCharacter()`

**Character Progression:**
- User updates character tier unlocks as they progress in-game
- Affects available companion gear levels
- Cannot delete character if companions are assigned to raids

### 2. Raid Building Flow

**Raid Creation:**
1. User clicks "New Raid" → selects faction (Alliance/Horde)
2. App creates 40 empty slots (8 groups × 5 slots) via `raidsStore.createNewRaid()`
3. User assigns companions to slots through UI interaction

**Companion Assignment Logic:**
```
Available Companions = User's Characters 
  → expand to 4 companions each
  → filter by tier availability
  → exclude already assigned companions
```

**Assignment Process:**
1. Click empty slot → opens companion selector modal
2. Choose owner character → shows 4 available companion slots
3. Configure: Name, Class, Role, Tier, Race
4. Validate: Faction match, tier availability, class/race restrictions
5. Assign to raid slot via `raidsStore.assignCompanion()`

**Validation Rules:**
- No duplicate companion assignments
- Tier must be unlocked by owner character
- Class/race combinations must be valid (see `src/data/wow-data.ts`)

### 3. Export Flow

**Command Generation** (handled by `raidsStore.generateExportString()`):
For each assigned slot, generates: `.z addinvite ${name} ${tier} ${class} ${role} default ${race}`

**Export Options:**
1. **Copy to Clipboard**: All commands as text block
2. **Download as File**: .txt file for future addon import
3. **Show Instructions**: Explain in-game usage with 500ms delay requirement

### 4. Data Persistence Flow

**Storage Strategy** (implemented in `src/composables/useStorage.ts`):
- **Unauthenticated**: localStorage only
- **Authenticated**: Supabase JSONB storage with localStorage fallback
- **Migration**: Prompt to import local data when user signs in

**Data Sync Structure:**
```
User Data in Supabase JSONB:
{
  characters: PlayerCharacter[],
  raids: RaidComposition[],
  settings: { autoSave: boolean, defaultFaction: Faction }
}
```

**Auto-save Triggers:**
- Character creation/modification
- Raid slot assignment/removal
- Raid rename/save
- Settings changes

## User Interface Structure

### Primary Views

**1. Raid Builder (Main View)**
```
┌─ Navigation Bar ─────────────────────────────┐
├─ Raid Info: Name, Faction, Fill Status ─────┤
├─ Group 1: [Slot1] [Slot2] [Slot3] [Slot4] [Slot5] ─┤
├─ Group 2: [Slot6] [Slot7] [Slot8] [Slot9] [Slot10] ─┤
├─ ... (Groups 3-8) ──────────────────────────┤
├─ Export Panel: Commands Preview + Copy ─────┤
└─ Save/Load Raids ──────────────────────────┘
```

**2. Character Manager**
```
┌─ Character List ─────────────────────────────┐
├─ Alliance Characters: [Card] [Card] [Card] ──┤
├─ Horde Characters: [Card] [Card] ───────────┤
├─ Add Character Button ──────────────────────┤
└─ Character Details Modal ───────────────────┘
```

### Component Hierarchy (To Be Built)

```
App.vue
├── NavBar.vue
├── RaidBuilder.vue
│   ├── RaidHeader.vue
│   ├── RaidGrid.vue
│   │   ├── GroupRow.vue
│   │   └── SlotButton.vue
│   ├── CompanionSelector.vue
│   └── ExportPanel.vue
├── CharacterManager.vue
│   ├── CharacterCard.vue
│   └── CharacterForm.vue
└── AuthModal.vue
```

## State Management Overview

### Store Responsibilities

**charactersStore** (`src/stores/characters.ts`):
- Manages `characters: PlayerCharacter[]`
- CRUD operations: `loadCharacters()`, `addCharacter()`, `updateCharacter()`, `deleteCharacter()`
- Computed properties: `allianceCharacters`, `hordeCharacters`

**raidsStore** (`src/stores/raids.ts`):
- Manages `raids: RaidComposition[]` and `currentRaid: RaidComposition | null`
- Core operations: `createNewRaid()`, `assignCompanion()`, `removeAssignment()`, `saveCurrentRaid()`
- Export functionality: `generateExportString()`
- Computed properties: `currentRaidSlots`, `filledSlots`

**authStore** (`src/stores/auth.ts`):
- Manages authentication state: `user`, `session`, `isAuthenticated`
- Auth operations: `initialize()`, `signOut()`
- Provides Supabase client access

### Data Flow Pattern

```
User Action → Component Event → Store Action → Storage Layer → UI Update
```

Example: Character Creation → CharacterForm → `charactersStore.addCharacter()` → `useStorage.setPlayerCharacters()` → UI Refresh

## Technical Decisions

### Storage Strategy
- **Local-first approach**: Works offline, provides instant performance
- **Cloud backup**: Cross-device sync for authenticated users via Supabase
- **Seamless migration**: Automatic upgrade from local to cloud storage
- **JSONB flexibility**: Allows schema evolution without migrations

### Validation Approach
- **Client-side validation**: No server validation needed for this use case
- **Immediate feedback**: Validate on form input changes
- **Permissive fallback**: Allow edge cases with clear warnings
- **Centralized logic**: All validation rules in `src/utils/validation.ts`

### Performance Considerations
- **Minimal data volume**: 40 slots × 100 users = trivial storage requirements
- **JSONB performance**: Adequate for query patterns, indexed by user + data_type
- **Local caching**: Instant UI responses with storage abstraction
- **Lazy loading**: Load data only when needed

### Error Handling Strategy
- **Graceful degradation**: Fall back to localStorage on network issues
- **Clear user feedback**: Descriptive error messages with retry options
- **Data preservation**: Never silently lose user work
- **Offline indicators**: Clear communication about connection status

## Implementation Roadmap

### Phase 1: Foundation ✅ (Completed)
- [x] Type definitions (`src/types/index.ts`)
- [x] Reference data (`src/data/wow-data.ts`)
- [x] Storage abstraction (`src/composables/useStorage.ts`)
- [x] Validation utilities (`src/utils/validation.ts`)
- [x] Pinia stores (`src/stores/*.ts`)
- [x] Supabase integration and auth

### Phase 2: Core UI Components (Next Steps)
- [ ] Navigation component (`src/components/NavBar.vue`)
- [ ] Character management UI (`src/components/CharacterManager.vue`)
- [ ] Character creation form (`src/components/CharacterForm.vue`)
- [ ] Basic raid builder layout (`src/components/RaidBuilder.vue`)

### Phase 3: Raid Building Features
- [ ] Raid grid component (`src/components/RaidGrid.vue`)
- [ ] Slot assignment UI (`src/components/SlotButton.vue`)
- [ ] Companion selector modal (`src/components/CompanionSelector.vue`)
- [ ] Raid validation and feedback

### Phase 4: Export and Polish
- [ ] Export panel (`src/components/ExportPanel.vue`)
- [ ] Command generation and clipboard integration
- [ ] Error states and loading indicators
- [ ] Responsive design optimization

### Phase 5: Advanced Features
- [ ] Raid templates and presets
- [ ] Bulk assignment operations
- [ ] Advanced export options (addon integration)
- [ ] Performance monitoring and optimization

## Development Guidelines

### File Organization
- **Types**: Centralized in `src/types/index.ts`
- **Business logic**: In Pinia stores, not components
- **Validation**: Shared utilities in `src/utils/`
- **Static data**: Reference data in `src/data/`
- **Components**: Feature-focused, single responsibility

### Error Handling Patterns
- **Storage errors**: Graceful fallback with user notification
- **Validation errors**: Immediate feedback with specific messages
- **Network errors**: Retry mechanisms with offline indicators
- **Data corruption**: Recovery options and backup suggestions

### Testing Strategy (Future)
- **Unit tests**: Validation logic and store actions
- **Integration tests**: Storage layer and data persistence
- **E2E tests**: Critical user flows (character creation, raid building)
- **Manual testing**: Cross-browser compatibility and responsive design

## Future Enhancements

### Short-term Improvements
- **Raid templates**: Save and share popular raid compositions
- **Validation warnings**: Suggest optimal raid balance (tank/healer/dps ratios)
- **Bulk operations**: Copy groups, auto-fill based on available companions
- **Export enhancements**: Multiple format options, batch operations

### Long-term Features
- **Real-time collaboration**: Multiple users editing the same raid
- **Advanced addon integration**: Custom WoW addon for seamless import
- **Analytics dashboard**: Track popular class/race combinations
- **Community features**: Share raids, rating system, composition discussions

### Technical Debt Considerations
- **Migration to normalized tables**: When query complexity increases
- **Performance optimization**: If user base grows significantly
- **Security audit**: Before handling any sensitive data
- **Accessibility improvements**: WCAG compliance for broader user base