# Supabase Setup for WoW Raid Builder

## Database Setup

1. **Create the user_data table** by running the SQL in `supabase-schema.sql` in your Supabase SQL editor.

2. **Enable Row Level Security (RLS)** - The schema already includes RLS policies that ensure users can only access their own data.

## Environment Variables

Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## How Storage Works

The application uses a hybrid storage approach:

- **Unauthenticated users**: Data is stored in localStorage
- **Authenticated users**: Data is stored in Supabase with automatic migration from localStorage

### Data Structure

The `user_data` table stores different types of data with these keys:
- `characters`: Array of PlayerCharacter objects
- `raids`: Array of RaidComposition objects  
- `settings`: User settings object

### Automatic Migration

When a user signs in for the first time, any existing localStorage data is automatically migrated to Supabase and the localStorage is cleared.

## Testing the Setup

1. Create a character while unauthenticated (should save to localStorage)
2. Sign in with Supabase (should migrate data to cloud)
3. Create/edit characters (should save to Supabase)
4. Sign out and back in (data should persist)

## Troubleshooting

- Check browser console for storage-related logs
- Verify RLS policies are working correctly
- Ensure the `user_data` table exists with the correct schema
