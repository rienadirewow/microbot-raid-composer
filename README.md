# WoW Classic Raid Composer

A web application for creating, managing, and exporting World of Warcraft Classic raid compositions for use with companion hiring systems on private servers.

**Core Problem**: Players need to hire 19-39 companions for raids using either tedious NPC dialogs or complex chat commands/Lua macros. This app provides a visual interface to design raid compositions and export them as executable commands.

## ✨ Features

- **Visual Raid Builder**: 40-slot grid interface for designing raid compositions
- **Character Management**: Manage your WoW Classic characters with tier progression tracking
- **Companion System**: Hire companions or lite clones based on your character unlocks
- **Export Commands**: Generate `.z addinvite` and `.z addlegacy` commands for private servers
- **Auto-save**: Seamless data persistence with cloud backup for authenticated users
- **Faction Support**: Full Alliance/Horde compatibility with proper race restrictions

## 🚀 Quick Start

### Prerequisites
- Node.js 20.19.0+ or 22.12.0+
- Supabase account (for cloud sync - optional)

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment** (optional for cloud features)
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 📖 Documentation

- **[Technical Documentation](docs/technical-documentation.md)** - Comprehensive technical overview
- **[Feature Specification](docs/feature-specification.md)** - Detailed feature checklist  
- **[Supabase Setup](docs/supabase-setup.md)** - Database configuration guide
- **[Development Configuration](.dev/README.md)** - Unified dev config system

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run type-check   # Run TypeScript checks
npm run lint         # Lint and fix code
npm run format       # Format code with Prettier
npm config:check     # Validate environment setup
```

### Tech Stack

- **Frontend**: Vue 3 + TypeScript + Tailwind CSS
- **State**: Pinia for reactive state management
- **Database**: Supabase with JSONB storage
- **Build**: Vite with hot module replacement
- **Code Quality**: ESLint + Prettier + TypeScript

### Development Rules

See [Global Development Rules](.dev/global-rules.md) for comprehensive guidelines covering:
- Vue 3 Composition API patterns
- TypeScript conventions
- WoW Classic domain rules
- Auto-save patterns
- Code quality standards

## 🎮 Usage

1. **Character Setup**: Add your WoW Classic characters with tier unlocks
2. **Raid Building**: Create raid compositions using the visual grid interface  
3. **Companion Assignment**: Assign companions or lite clones to raid slots
4. **Export**: Generate command strings for in-game execution
5. **Save & Share**: Cloud sync for cross-device access (requires authentication)

## 📄 License

Private project for WoW Classic private server communities.
