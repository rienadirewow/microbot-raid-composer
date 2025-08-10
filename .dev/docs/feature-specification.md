# WoW Classic Raid Composer - Feature Specification

## Overview
A web application for creating, managing, and exporting World of Warcraft Classic raid compositions for use with companion hiring systems on private servers.

**Core Problem**: Players need to hire 19-39 companions for raids using either tedious NPC dialogs or complex chat commands/Lua macros. This app provides a visual interface to design raid compositions and export them as executable commands.

## Core Features Checklist

### <× Raid Composition Builder
- [x] Support for 20-man raid layouts
- [x] Support for 40-man raid layouts  
- [x] Click-to-assign interface for raid slots
- [x] Real-time role counters (tanks/healers/DPS) - Enhanced with visual status indicators
- [x] Suggested role minimums (non-enforcing)
- [x] Store alt name per slot
- [x] Store license tier per slot (T0-T5, t1r/t1d variants)
- [x] Store class per slot (Warrior, Priest, Mage, etc.)
- [x] Store spec/role per slot (Tank, Healer, DPS variants) - With WoW Classic defaults
- [x] Store race per slot - Optional for companions
- [x] Store hiring type per slot (Companion vs. Lite clone)

### =e Character Management
- [x] Manual input of character names
- [x] Track available licenses per character
- [x] Faction designation per character (Alliance/Horde)
- [x] Cross-faction hiring capability tracking
- [x] Character list persistence
- [x] Default role setting per character
- [x] Character editing and deletion
- [x] Set current player to DPS by default - Task 6 implementation

### =¾ Data Persistence
- [x] Local storage for unauthenticated users
- [x] Cloud storage for authenticated users (Supabase)
- [x] Automatic migration from local to cloud on login
- [x] Real-time sync across devices
- [x] Auto-save functionality - No manual save required

### = Authentication System
- [x] Email/password registration and login
- [x] Guest mode with local storage
- [x] Password reset functionality
- [x] User session management
- [x] Secure data isolation per user

### =ä Export Functionality
- [x] Generate `.z addlegacy` command strings
- [x] Generate `.z addinvite` command strings
- [x] Export with proper character names and tier specifications
- [x] Copy to clipboard functionality
- [x] Export validation and error handling

### <¨ User Interface
- [x] Responsive design for desktop and mobile
- [x] WoW-themed visual design with dark colors
- [x] Intuitive drag-and-drop or click-to-assign interface
- [x] Visual feedback for role distribution and requirements
- [x] Modal dialogs for character and slot assignment
- [x] Three-line header layout - Task completed
- [x] Improved role counter display visually - Task 7 implementation

### = Validation & Business Rules
- [x] Enforce WoW Classic class-role restrictions
- [x] Validate faction requirements (Alliance/Horde)
- [x] License tier availability checking
- [x] Duplicate character name prevention
- [x] Role distribution suggestions
- [x] Character hiring type validation (lite vs companion)

## Advanced Features (Future)

### =Ê Analytics & Insights
- [ ] Raid composition statistics
- [ ] Popular character builds tracking
- [ ] License tier usage analytics
- [ ] Export command usage metrics

### > Collaboration
- [ ] Share raid compositions with other users
- [ ] Import/export raid templates
- [ ] Collaborative raid planning
- [ ] Comment system for raid compositions

### =à Advanced Customization
- [ ] Custom role definitions beyond tank/heal/dps
- [ ] Server-specific rule sets
- [ ] Custom export command formats
- [ ] Bulk character import from CSV/JSON

### <¯ Optimization Features
- [ ] AI-powered raid composition suggestions
- [ ] Automatic role balancing recommendations
- [ ] License tier optimization suggestions
- [ ] Conflict detection and resolution

## Technical Implementation Details

### Character-Centric Data Model
The application uses a character-centric approach rather than slot-based:
- Each character has inherent properties (name, faction, available licenses)
- Raid slots reference characters and specify desired role/tier
- This allows for flexible character reuse across multiple raid compositions

### Companion Hiring Mechanics
- **Lite Clones**: Free copies of existing characters with "-lite" suffix
- **Hired Companions**: Licensed characters with tier progression (T0-T5)
- **Cross-Faction Hiring**: Some characters can be hired across faction boundaries
- **License Tiers**: T0 (base) through T5 (max), with t1r/t1d variants for different specs

### Export Command Generation
The application generates two types of commands:
1. **`.z addlegacy`**: For adding characters to legacy raid systems
2. **`.z addinvite`**: For inviting characters to current raid groups

Commands include proper character names, tier specifications, and role assignments for seamless in-game execution.

### Real-Time State Management
- Pinia stores manage character and raid state
- Auto-save triggers on any data modification
- Reactive UI updates reflect changes immediately
- Optimistic updates with error handling for network operations

## User Experience Goals

### Ease of Use
- Minimal learning curve for WoW Classic players
- Intuitive visual interface matching in-game concepts
- Quick character setup and raid composition creation
- Seamless export workflow

### Performance
- Fast loading and responsive interactions
- Efficient data synchronization
- Minimal network requests
- Optimized for both desktop and mobile devices

### Reliability
- Robust error handling and recovery
- Data integrity and validation
- Secure authentication and data protection
- Graceful degradation when offline