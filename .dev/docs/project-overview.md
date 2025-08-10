# Project Overview

**WoW Classic Raid Composer** - Visual raid builder for private server companion hiring systems.

## Problem & Solution
Players need to hire 19-39 companions for raids using tedious NPC dialogs or complex commands. This app provides a visual interface to design compositions and export executable commands.

## Tech Stack
Vue 3 + TypeScript + Tailwind CSS + Pinia + Supabase + Vite

## Key Features
- 40-slot visual raid builder with character-centric design  
- Character management with tier progression (T0-T5)
- Auto-save with cloud sync for authenticated users
- Export for `.z addlegacy` and `.z addinvite` systems
- WoW Classic faction/class restrictions

## Architecture
- **Character-centric data** (not slot-based)
- **Vue 3 Composition API** with TypeScript
- **Pinia reactive stores** with auto-save
- **Supabase** for data persistence & auth
- **Single table JSONB schema** for flexible data storage