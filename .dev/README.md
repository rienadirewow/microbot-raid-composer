# Development Configuration

Clean, unified development rules and configuration for the WoW Classic Raid Composer project.

## Structure
```
.dev/
├── docs/                   # Project documentation
│   ├── project-overview.md # Project context & tech stack
│   ├── supabase-setup.md   # Database setup guide  
│   └── technical-documentation.md # Core files & architecture
├── rules/                  # Tech-specific development rules
│   ├── project.md          # WoW Classic domain & architecture
│   ├── vue.md              # Vue 3 Composition API patterns
│   ├── typescript.md       # Type safety & interface definitions
│   ├── tailwind.md         # Utility-first CSS & theming
│   └── supabase.md         # Database & auth patterns
└── mcp/config.json         # Canonical MCP server config
```

## Usage
- **Claude Code**: References `CLAUDE.md` → `.dev/rules/` directory
- **Cursor IDE**: References `.cursor/rules/rules.md` → `.dev/rules/` directory
- **MCP Config**: Environment variables in `.mcp.json` and `.cursor/.mcp.json`

## Benefits
- **No duplication** - Rules defined once, referenced everywhere
- **Tech-specific** - All rules are specific to project technologies
- **Tool-focused** - Each tool gets relevant, focused guidance
- **Easy maintenance** - Update rules in one place