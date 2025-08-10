# WoW Classic Raid Composer - Project Rules

## 🎮 Project Context
**WoW Classic Raid Composer** - A web application for creating, managing, and exporting World of Warcraft Classic raid compositions for use with companion hiring systems on private servers.

**Core Problem**: Players need to hire 19-39 companions for raids using either tedious NPC dialogs or complex chat commands/Lua macros. This app provides a visual interface to design raid compositions and export them as executable commands.

## 🏗️ Architecture Principles

### Data Structure Philosophy
- **Character-centric data structures** over legacy slot-based approaches
- **Auto-save patterns** with reactive watchers for seamless UX
- **Type-safe interfaces** for all WoW game data structures
- **Backward compatibility** while transitioning to modern patterns

### User Experience Guidelines
- **Auto-save everything** - no manual save buttons needed
- **Real-time validation** with soft suggestions, never blocking
- **Visual feedback** for role distribution and composition balance
- **Graceful degradation** when data is incomplete

## 🎯 WoW Classic Domain Rules

### Character & Companion System
- **Companion hiring mechanics** with license tiers T0-T5 and lite clones
- **Faction restrictions** (Alliance/Horde) with proper race validation
- **Class role restrictions** following WoW Classic raiding conventions
- **Tier progression tracking** for character unlock status

### Business Logic
- **Current player selection** with role choice (defaults to DPS)
- **Character-centric raids** where each character can contribute 1 lite + 4 companions
- **Export functionality** to generate `.z addlegacy` and `.z addinvite` commands
- **Cross-faction raiding** support for private server mechanics

## 🔄 Development Workflow

### State Management Patterns
- **Pinia stores** for persistent data (characters, raids)
- **Reactive watchers** for auto-save functionality
- **Computed properties** for derived UI state
- **Local component state** for temporary UI interactions

### Code Quality Standards
- **No comments** unless explicitly requested by user
- **Descriptive variable names** that reflect WoW terminology
- **Error handling** with user-friendly messaging
- **Performance considerations** for real-time UI updates