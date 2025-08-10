# Supabase Development Rules

## 🗄️ Database Patterns

### Schema Design
- **JSONB storage** for flexible user data in `user_data` table
- **Row Level Security (RLS)** for user data isolation
- **Single table strategy** with `data_type` field for different content types
- **UUID primary keys** for all tables and references

### Data Organization
- **User data types**: `characters`, `raids`, `settings` in separate JSONB rows
- **Atomic updates** for individual data types
- **Migration-friendly** schema that supports evolution
- **Backup-friendly** structure with complete user data portability

## 🔐 Authentication & Security

### Auth Patterns
- **Supabase Auth** for user authentication and session management
- **RLS policies** ensuring users only access their own data
- **Anonymous usage** with localStorage fallback
- **Seamless migration** from localStorage to Supabase on signup

### Security Implementation
- **Environment variables** for all Supabase credentials
- **Client-side validation** with server-side data integrity
- **Secure defaults** with minimal privilege principles
- **Error handling** that doesn't leak sensitive information

## 💾 Data Persistence Patterns

### Storage Strategy
- **Hybrid approach**: localStorage for unauthenticated, Supabase for authenticated
- **Auto-migration** when user signs up with existing local data
- **Conflict resolution** favoring cloud data over local data
- **Graceful degradation** when Supabase is unavailable

### Performance Optimization
- **Selective loading** of data types based on application needs
- **Optimistic updates** with rollback on failure
- **Debounced saves** to prevent excessive API calls
- **Local caching** with Pinia store persistence

## 🔄 Integration Patterns

### Store Integration
- **useStorage composable** for abstracted data access
- **Pinia actions** for Supabase operations
- **Reactive updates** when data changes in cloud
- **Error boundaries** for network failures

### Client Configuration
- **Environment-based** Supabase client configuration
- **TypeScript types** for database schema
- **Connection pooling** through Supabase client reuse
- **Real-time subscriptions** for future collaborative features

## 🚨 Error Handling

### Network Resilience
- **Retry mechanisms** for transient failures
- **Offline detection** with appropriate user feedback
- **Data preservation** during network issues
- **Recovery procedures** for corrupted or lost data

### User Experience
- **Loading states** for async operations
- **Error messages** that guide user action
- **Fallback modes** when cloud features are unavailable
- **Data integrity** validation before and after operations