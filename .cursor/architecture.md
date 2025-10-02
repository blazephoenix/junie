# Chatbot UI Architecture Guide

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js 14 App Router                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Pages (/app/[locale]/)                                │ │
│  │  - User-facing routes                                  │ │
│  │  - Server Components (default)                         │ │
│  │  - Client Components (when interactive)                │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  API Routes (/app/api/)                                │ │
│  │  - LLM streaming endpoints                             │ │
│  │  - File processing                                      │ │
│  │  - Integration endpoints                                │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   React Context Layer                        │
│  - Global state management (ChatbotUIContext)               │
│  - User profile, workspaces, chats, files, etc.            │
│  - Shared across all client components                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Database Access Layer (/db/)                    │
│  - Abstraction over Supabase client                         │
│  - Type-safe CRUD operations                                │
│  - Standard patterns for each table                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  PostgreSQL  │  │  Auth        │  │  Storage         │  │
│  │  + pgvector  │  │  - JWT       │  │  - File uploads  │  │
│  │  - RLS       │  │  - Email     │  │  - Images        │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│  - OpenAI, Anthropic, Google AI (LLM providers)             │
│  - Azure OpenAI                                              │
│  - Mistral, Groq, OpenRouter                                 │
│  - Ollama (local models)                                     │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Patterns

### 1. User Authentication Flow
```
User → Next.js Auth Pages → Supabase Auth → JWT Token
                                              ↓
                            Set in cookie & local state
                                              ↓
                            Used in all API/DB requests
```

### 2. Chat Message Flow
```
User Input (ChatInput)
    ↓
Context State Update (userInput)
    ↓
Send Message Handler (useChatHandler)
    ↓
Create Message in DB (/db/messages.ts)
    ↓
Call LLM API (/app/api/chat/[provider])
    ↓
Stream Response → Update UI
    ↓
Save Assistant Response to DB
    ↓
Update Context (chatMessages)
```

### 3. File Upload Flow
```
User Selects File
    ↓
Upload to Supabase Storage (/lib/storage/)
    ↓
Create File Record in DB (/db/files.ts)
    ↓
Process File Content (PDF/DOCX parser)
    ↓
Generate Embeddings (Xenova/Transformers)
    ↓
Store Chunks in file_items table
    ↓
Available for Retrieval (RAG)
```

### 4. Workspace Data Isolation
```
User logs in
    ↓
Load user's workspaces
    ↓
Select workspace (setSelectedWorkspace)
    ↓
All queries filtered by workspace_id
    ↓
Data scoped to workspace:
  - Chats
  - Files
  - Assistants
  - Prompts
  - Tools
  - Collections
```

## Component Architecture

### Component Hierarchy
```
App Layout (Server Component)
  ├─ GlobalContextProvider (Client)
  │   ├─ Sidebar (Client)
  │   │   ├─ WorkspaceSwitcher
  │   │   ├─ ChatList
  │   │   └─ SidebarContent
  │   │
  │   └─ ChatUI (Client)
  │       ├─ ChatMessages
  │       │   └─ Message[] (markdown, code highlighting)
  │       │
  │       ├─ ChatInput
  │       │   ├─ TextareaAutosize
  │       │   ├─ ChatCommandInput (pickers)
  │       │   ├─ ChatFilesDisplay
  │       │   └─ ChatSecondaryButtons
  │       │
  │       └─ ChatSettings
  │           ├─ ModelPicker
  │           ├─ QuickSettings (temp, tokens, etc.)
  │           └─ ChatRetrievalSettings
```

### State Flow in Components
```
Component renders
    ↓
useContext to access global state
    ↓
useState for local state
    ↓
useEffect for side effects
    ↓
Custom hooks for complex logic
    ↓
Event handlers update state
    ↓
State changes trigger re-render
```

## Database Schema Architecture

### Core Entity Relationships
```
users (Supabase Auth)
  ↓ 1:1
profiles
  ↓ 1:N
workspaces
  ↓ 1:N
  ├─ chats ──→ 1:N messages
  ├─ files ──→ 1:N file_items (chunks)
  ├─ folders
  ├─ assistants ──→ N:M assistant_files
  │               └─→ N:M assistant_tools
  ├─ presets
  ├─ prompts
  ├─ tools
  ├─ collections ──→ N:M collection_files
  └─ models (custom)
```

### Row Level Security (RLS) Pattern
Every table has policies like:
```sql
-- Select: users can read their own data
CREATE POLICY "Users can read own data"
ON table_name FOR SELECT
USING (auth.uid() = user_id);

-- Insert: users can create their own data
CREATE POLICY "Users can insert own data"
ON table_name FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Update: users can update their own data
CREATE POLICY "Users can update own data"
ON table_name FOR UPDATE
USING (auth.uid() = user_id);

-- Delete: users can delete their own data
CREATE POLICY "Users can delete own data"
ON table_name FOR DELETE
USING (auth.uid() = user_id);
```

## Feature-Specific Architectures

### 1. Chat System
**Components:**
- `ChatUI` - Main chat interface container
- `ChatMessages` - Message list with virtualization
- `ChatInput` - Text input with command support
- `ChatCommandInput` - Command picker overlay (/, #, @, !)

**Hooks:**
- `useChatHandler` - Send/stop message logic
- `useChatHistoryHandler` - Navigate message history
- `usePromptAndCommand` - Command parsing
- `useSelectFileHandler` - File attachment handling
- `useScroll` - Auto-scroll behavior

**State Flow:**
```
Global Context:
  - selectedChat
  - chatMessages
  - userInput
  - isGenerating
  - selectedTools
  - chatFiles/chatImages

Local State:
  - Command picker visibility
  - File picker visibility
  - Scroll position
```

### 2. Retrieval (RAG) System
**Flow:**
```
1. File uploaded → Supabase Storage
2. Content extracted (pdf-parse, mammoth for DOCX)
3. Text chunked (sliding window)
4. Embeddings generated (Xenova/Transformers)
5. Stored in file_items with vector column
6. On query: similarity search via pgvector
7. Relevant chunks added to LLM context
```

**Key Files:**
- `/lib/retrieval/` - Retrieval logic
- `/lib/generate-local-embedding.ts` - Local embeddings
- `/db/file-items.ts` - File item CRUD

### 3. Assistant System
**Architecture:**
```
Assistant Definition
  ├─ Metadata (name, description, model)
  ├─ Instructions (system prompt)
  ├─ Files (N:M relationship)
  ├─ Tools (N:M relationship)
  └─ Settings (temperature, etc.)

When assistant selected:
  1. Load assistant config
  2. Load associated files
  3. Load associated tools
  4. Apply to chat settings
  5. Inject instructions into system prompt
```

### 4. Tools System
**Tool Definition:**
```typescript
{
  name: string
  description: string
  schema: JSONSchema
  url?: string  // for external tools
}
```

**Execution Flow:**
```
1. LLM decides to use tool
2. Generates tool call with parameters
3. Tool executed (function or API call)
4. Result returned to LLM
5. LLM continues with result
```

### 5. Multi-Provider LLM Architecture
**Pattern:**
```
Unified Interface:
  - Same chat parameters
  - Same streaming format
  - Provider-specific adapters

API Routes:
  /api/chat/openai
  /api/chat/anthropic
  /api/chat/google
  /api/chat/azure
  etc.

Each route:
  1. Accepts standard chat format
  2. Transforms to provider format
  3. Streams response
  4. Transforms back to standard format
```

## Internationalization (i18n)

**Structure:**
```
/public/locales/
  ├─ en/
  │   └─ translation.json
  ├─ es/
  │   └─ translation.json
  └─ ...

Route Structure:
  /[locale]/...
  - Automatic locale detection
  - URL-based locale switching
```

**Usage:**
```typescript
const { t } = useTranslation()
const text = t("key.path")
```

## Performance Optimizations

### 1. Code Splitting
- Route-based splitting (Next.js automatic)
- Dynamic imports for heavy components
- Lazy loading of LLM model lists

### 2. Database Optimizations
- Indexed columns (user_id, workspace_id, created_at)
- Vector indices on embeddings
- Connection pooling via Supabase

### 3. Caching Strategy
- Static assets cached via Next.js
- API responses not cached (real-time data)
- Browser localStorage for user preferences

### 4. Streaming
- LLM responses streamed for better UX
- Reduces time to first token
- Uses Server-Sent Events (SSE)

## Security Architecture

### 1. Authentication
- JWT tokens from Supabase Auth
- Stored in HTTP-only cookies
- Validated on every request

### 2. Authorization
- Row Level Security (RLS) in database
- User can only access own data
- Workspace-level isolation

### 3. API Key Management
- Environment variables for server keys
- User-provided keys encrypted in database
- Never exposed to client

### 4. File Upload Security
- Type validation
- Size limits
- Virus scanning (TODO)
- Scoped to user/workspace

## Deployment Architecture

### Development
```
Local Machine
  ├─ Next.js dev server (port 3000)
  ├─ Supabase local (Docker)
  │   ├─ PostgreSQL (port 54322)
  │   ├─ API Gateway (port 54321)
  │   └─ Studio (port 54323)
  └─ Hot reload enabled
```

### Production (Vercel + Supabase Cloud)
```
Vercel
  ├─ Next.js SSR/SSG
  ├─ Edge Functions
  ├─ API Routes
  └─ Static Assets (CDN)
        ↓
Supabase Cloud
  ├─ PostgreSQL (managed)
  ├─ Auth Service
  ├─ Storage (S3-compatible)
  └─ Edge Functions
```

## Testing Strategy

### Unit Tests
- Utility functions
- Database helpers
- Component logic

### Integration Tests
- API routes
- Database operations
- Auth flows

### E2E Tests (TODO)
- User flows
- Chat functionality
- File uploads

## Monitoring & Logging

### Client-Side
- Console errors
- Toast notifications for user errors
- Error boundaries for component crashes

### Server-Side
- Next.js logs
- Supabase logs
- API route error logs

### Performance
- Vercel Analytics
- Web Vitals tracking
- Bundle size monitoring

## Migration Strategy

When making breaking changes:
1. Create new migration file
2. Preserve backward compatibility if possible
3. Update TypeScript types
4. Update database access layer
5. Test locally
6. Apply to staging
7. Apply to production

## Scalability Considerations

### Current Limitations
- Single-region database
- Synchronous file processing
- No CDN for user files

### Future Improvements
- Multi-region database replication
- Background job queue for file processing
- CDN integration for file storage
- Horizontal scaling of Next.js instances
- Caching layer (Redis)
- WebSocket for real-time updates

## Development Best Practices

### 1. Before Starting Work
- Pull latest code
- Apply migrations: `npm run db-migrate`
- Regenerate types: `npm run db-types`
- Check for conflicts

### 2. During Development
- Run dev server: `npm run chat`
- Check linting: `npm run lint`
- Test in browser
- Check Supabase Studio for data

### 3. Before Committing
- Run `npm run clean` (lint + format)
- Run `npm run type-check`
- Test functionality
- Review changes

### 4. Database Changes
- Create migration file
- Test migration up/down
- Regenerate types
- Update database access layer
- Update affected components

## Common Patterns Summary

1. **Database Access**: Always through `/db` layer, never direct Supabase calls in components
2. **Type Safety**: Use generated Supabase types, never `any`
3. **State Management**: Context for global, useState for local
4. **Styling**: Tailwind utilities, semantic color tokens
5. **Error Handling**: Try-catch with toast notifications
6. **Components**: Functional components with TypeScript
7. **Imports**: Always use `@/` alias
8. **Formatting**: Double quotes, no semicolons, 2-space indent

