# Quick Reference Guide for Chatbot UI Development

## Common Code Snippets

### Database CRUD Operations

```typescript
// Read single item
const item = await supabase
  .from("table_name")
  .select("*")
  .eq("id", id)
  .maybeSingle()

// Read multiple with filter
const { data, error } = await supabase
  .from("table_name")
  .select("*")
  .eq("workspace_id", workspaceId)
  .order("created_at", { ascending: false })

// Create single
const { data, error } = await supabase
  .from("table_name")
  .insert([item])
  .select("*")
  .single()

// Update
const { data, error } = await supabase
  .from("table_name")
  .update(updates)
  .eq("id", id)
  .select("*")
  .single()

// Delete
const { error } = await supabase
  .from("table_name")
  .delete()
  .eq("id", id)
```

### Component Boilerplate

```typescript
import { FC, useContext, useState } from "react"
import { ChatbotUIContext } from "@/context/context"
import { cn } from "@/lib/utils"

interface ComponentNameProps {
  prop1: string
  prop2?: number
}

export const ComponentName: FC<ComponentNameProps> = ({ prop1, prop2 }) => {
  const { profile } = useContext(ChatbotUIContext)
  const [state, setState] = useState<string>("")
  
  const handleAction = () => {
    // implementation
  }
  
  return (
    <div className={cn("base-classes")}>
      {/* content */}
    </div>
  )
}
```

### API Route Handler

```typescript
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()
    
    // Verify authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Process request
    const result = await processRequest(body)
    
    return NextResponse.json({ data: result })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

### Custom Hook Pattern

```typescript
import { useContext, useEffect, useState } from "react"
import { ChatbotUIContext } from "@/context/context"

export const useCustomHook = () => {
  const { someState } = useContext(ChatbotUIContext)
  const [localState, setLocalState] = useState<string>("")
  
  useEffect(() => {
    // side effect
  }, [someState])
  
  const handleAction = () => {
    // implementation
  }
  
  return {
    localState,
    handleAction
  }
}
```

### Context Access

```typescript
import { useContext } from "react"
import { ChatbotUIContext } from "@/context/context"

const {
  // Profile
  profile,
  setProfile,
  
  // Items
  chats,
  setChats,
  files,
  setFiles,
  
  // Workspace
  selectedWorkspace,
  setSelectedWorkspace,
  
  // Chat state
  chatMessages,
  setChatMessages,
  isGenerating,
  setIsGenerating
} = useContext(ChatbotUIContext)
```

## File Locations Quick Map

| Purpose | Location | Example |
|---------|----------|---------|
| Database queries | `/db/` | `/db/chats.ts` |
| React components | `/components/` | `/components/chat/chat-input.tsx` |
| Type definitions | `/types/` | `/types/chat.ts` |
| Utility functions | `/lib/` | `/lib/utils.ts` |
| Custom hooks | `/lib/hooks/` | `/lib/hooks/use-hotkey.ts` |
| API routes | `/app/api/` | `/app/api/chat/route.ts` |
| Pages | `/app/[locale]/` | `/app/[locale]/page.tsx` |
| Database migrations | `/supabase/migrations/` | `/supabase/migrations/20240108_*.sql` |
| UI components | `/components/ui/` | `/components/ui/button.tsx` |
| Context | `/context/` | `/context/context.tsx` |

## Common Imports Cheatsheet

```typescript
// Database
import { supabase } from "@/lib/supabase/browser-client"
import { Tables, TablesInsert, TablesUpdate } from "@/supabase/types"

// Context
import { ChatbotUIContext } from "@/context/context"

// React
import { FC, useContext, useState, useEffect, useRef } from "react"

// Next.js
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

// Utilities
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Icons
import { IconSend, IconX, IconCheck } from "@tabler/icons-react"

// Translation
import { useTranslation } from "react-i18next"

// Forms
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
```

## Database Schema Quick Reference

### Main Tables
- `profiles` - User profiles
- `workspaces` - User workspaces
- `chats` - Chat conversations
- `messages` - Individual messages
- `files` - Uploaded files
- `file_items` - File content chunks (for retrieval)
- `folders` - Organization folders
- `assistants` - Custom assistants
- `presets` - Chat presets
- `prompts` - Reusable prompts
- `tools` - Custom tools
- `collections` - File collections
- `models` - Custom model configurations

### Common Relationships
- User → Workspaces (one-to-many)
- Workspace → Chats (one-to-many)
- Chat → Messages (one-to-many)
- Workspace → Files (one-to-many)
- File → File Items (one-to-many)

## NPM Scripts Quick Reference

```bash
# Development
npm run dev                    # Start dev server
npm run chat                   # Start Supabase + dev server
npm run restart                # Restart Supabase + dev server

# Database
npm run db-reset               # Reset database (deletes data!)
npm run db-migrate             # Apply migrations
npm run db-types               # Generate TypeScript types
npm run db-push                # Push to hosted database
npm run db-pull                # Pull from hosted database

# Code Quality
npm run lint                   # Check linting
npm run lint:fix               # Fix linting issues
npm run format:write           # Format code with Prettier
npm run format:check           # Check formatting
npm run type-check             # Check TypeScript types
npm run clean                  # Fix linting + formatting

# Build & Deploy
npm run build                  # Production build
npm run start                  # Start production server
npm run preview                # Build + start
npm run analyze                # Analyze bundle size

# Testing
npm test                       # Run Jest tests

# Utilities
npm run update                 # Pull latest + migrate
```

## Styling Patterns

### Common Tailwind Combinations

```typescript
// Card/Container
"rounded-lg border bg-card p-4 shadow-sm"

// Button variants (use Button component instead)
"bg-primary text-primary-foreground hover:bg-primary/90"

// Input
"border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2"

// Text
"text-sm font-medium leading-none"
"text-muted-foreground text-sm"

// Layout
"flex items-center justify-between"
"grid gap-4"
"space-y-2"

// Responsive
"hidden md:block"
"flex-col md:flex-row"
```

### Color System

Use semantic color variables:
- `bg-background` / `text-foreground` - Main background/text
- `bg-card` / `text-card-foreground` - Card surfaces
- `bg-primary` / `text-primary-foreground` - Primary actions
- `bg-secondary` / `text-secondary-foreground` - Secondary elements
- `bg-muted` / `text-muted-foreground` - Muted/disabled elements
- `bg-accent` / `text-accent-foreground` - Accent colors
- `bg-destructive` / `text-destructive-foreground` - Destructive actions
- `border` - Border colors
- `ring` - Focus ring colors

## Error Handling Patterns

```typescript
// Database operations
try {
  const data = await someDbOperation()
  toast.success("Operation successful")
  return data
} catch (error) {
  console.error("Operation failed:", error)
  toast.error(`Failed: ${error.message}`)
  throw error
}

// With loading state
const [loading, setLoading] = useState(false)

const handleAction = async () => {
  setLoading(true)
  try {
    await someOperation()
    toast.success("Success!")
  } catch (error) {
    toast.error(error.message)
  } finally {
    setLoading(false)
  }
}

// API route error handling
export async function POST(request: Request) {
  try {
    // ... operation
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
```

## Validation Patterns (Zod)

```typescript
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  age: z.number().min(0).optional()
})

type FormData = z.infer<typeof schema>

// Use with react-hook-form
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: {
    name: "",
    email: ""
  }
})
```

## State Management Best Practices

### When to use what:
- **Context** - Global app state (user, workspaces, chats, settings)
- **useState** - Local component state (form inputs, toggles, modals)
- **useRef** - DOM references, mutable values that don't trigger re-renders
- **Custom hooks** - Reusable stateful logic
- **URL state** - Navigation state, filters, pagination

### Context usage pattern:
```typescript
// Only destructure what you need
const { 
  chats, 
  selectedChat, 
  setSelectedChat 
} = useContext(ChatbotUIContext)

// Update context
setSelectedChat(newChat)
setChats(prevChats => [...prevChats, newChat])
```

## Performance Tips

1. **Memoization** - Use `useMemo` for expensive calculations
2. **Callbacks** - Use `useCallback` for function props to child components
3. **Lazy loading** - Use `dynamic` from Next.js for heavy components
4. **Image optimization** - Always use Next.js `Image` component
5. **Virtualization** - For long lists, consider react-virtual
6. **Code splitting** - Route-based automatically, manual with dynamic imports

## Debugging Tips

1. **Check Supabase logs** - http://localhost:54323/project/default/logs
2. **Verify RLS policies** - Common cause of data not appearing
3. **Check network tab** - For API/database call failures
4. **Console errors** - React strict mode may show duplicate logs in dev
5. **Type errors** - Regenerate types if schema changed: `npm run db-types`
6. **Auth issues** - Verify user is authenticated and has correct permissions

