# Supabase Setup

## Database Setup
1. Run `supabase-schema.sql` in your Supabase SQL editor
2. RLS policies are included for user data isolation

## Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Storage Flow
- **Unauthenticated**: localStorage only
- **Authenticated**: Auto-migrate to Supabase + real-time sync

## Testing
1. Create character unauthenticated → localStorage
2. Sign in → auto-migrates to Supabase
3. Sign out/in → data persists
