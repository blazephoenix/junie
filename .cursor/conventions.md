# Project-Specific Conventions & Gotchas

## Naming Conventions

### Files and Directories
- **Components**: kebab-case, descriptive names
  - ✅ `chat-input.tsx`, `chat-messages.tsx`, `assistant-picker.tsx`
  - ❌ `ChatInput.tsx`, `input.tsx`, `chat_input.tsx`

- **Database files**: singular table name, kebab-case
  - ✅ `chats.ts`, `messages.ts`, `assistant-files.ts`
  - ❌ `chat.ts`, `Messages.ts`, `assistantFiles.ts`

- **Hooks**: prefix with `use`, kebab-case
  - ✅ `use-chat-handler.tsx`, `use-hotkey.ts`
  - ❌ `chatHandler.ts`, `useHotKey.ts`

- **Types**: singular, kebab-case
  - ✅ `chat-message.ts`, `chat-file.tsx`, `llms.ts`
  - ❌ `ChatMessage.ts`, `chat_message.ts`

### Variables and Functions
- **Components**: PascalCase
  ```typescript
  export const ChatInput: FC<ChatInputProps> = () => {}
  ```

- **Functions**: camelCase, descriptive verb-noun
  ```typescript
  const handleSendMessage = () => {}
  const getChatById = async (id: string) => {}
  const createMessage = async (message: TablesInsert<"messages">) => {}
  ```

- **Constants**: UPPER_SNAKE_CASE for true constants, camelCase for config objects
  ```typescript
  const MAX_FILE_SIZE = 10 * 1024 * 1024
  const defaultSettings = { temperature: 0.7 }
  ```

- **Types/Interfaces**: PascalCase
  ```typescript
  interface ChatInputProps {}
  type ChatMessage = {}
  ```

### Database Conventions
- **Tables**: plural, snake_case
  - `chats`, `messages`, `file_items`, `assistant_files`

- **Columns**: snake_case
  - `user_id`, `created_at`, `workspace_id`

- **Join tables**: table1_table2 format
  - `assistant_files`, `assistant_tools`, `collection_files`

## Code Organization Patterns

### Component File Structure
```typescript
// 1. Imports (in Prettier order)
import { FC, useContext, useState, useEffect } from "react"
import { ChatbotUIContext } from "@/context/context"
import { Button } from "@/components/ui/button"

// 2. Types/Interfaces
interface ComponentProps {
  prop1: string
  prop2?: number
}

// 3. Component definition
export const Component: FC<ComponentProps> = ({ prop1, prop2 }) => {
  // 3a. Context
  const { state } = useContext(ChatbotUIContext)
  
  // 3b. State
  const [localState, setLocalState] = useState<string>("")
  
  // 3c. Refs
  const inputRef = useRef<HTMLInputElement>(null)
  
  // 3d. Effects
  useEffect(() => {
    // side effects
  }, [])
  
  // 3e. Handlers
  const handleClick = () => {
    // implementation
  }
  
  // 3f. Derived values
  const computedValue = useMemo(() => {
    return expensiveCalculation()
  }, [dependency])
  
  // 3g. Render
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

### Database File Structure
```typescript
// 1. Imports
import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"

// 2. Get by ID
export const getXById = async (id: string) => {}

// 3. Get by relationship
export const getXsByYId = async (yId: string) => {}

// 4. Create single
export const createX = async (x: TablesInsert<"table">) => {}

// 5. Create multiple
export const createXs = async (xs: TablesInsert<"table">[]) => {}

// 6. Update
export const updateX = async (id: string, x: TablesUpdate<"table">) => {}

// 7. Delete
export const deleteX = async (id: string) => {}

// 8. Custom operations
export const customOperation = async () => {}
```

## Type Safety Patterns

### Database Types
```typescript
// ✅ Correct: Use generated types
import { Tables, TablesInsert, TablesUpdate } from "@/supabase/types"

type Chat = Tables<"chats">
type ChatInsert = TablesInsert<"chats">
type ChatUpdate = TablesUpdate<"chats">

// ❌ Wrong: Define your own database types
interface Chat {
  id: string
  // ...
}
```

### Avoid Type Assertions
```typescript
// ✅ Correct: Use proper typing
const chat: Tables<"chats"> | null = await getChatById(id)
if (chat) {
  console.log(chat.name)
}

// ❌ Wrong: Use assertion
const chat = await getChatById(id) as Tables<"chats">

// ✅ Correct: Handle nullability
const chat = await getChatById(id)
if (!chat) {
  throw new Error("Chat not found")
}

// ❌ Wrong: Use non-null assertion
const chat = await getChatById(id)!
```

### Generic Types
```typescript
// ✅ Correct: Constrain generics
function processItems<T extends Tables<"chats">>(items: T[]): void {}

// ❌ Wrong: Use any or overly broad types
function processItems<T>(items: T[]): void {}
```

## Context Usage Patterns

### Destructure Only What You Need
```typescript
// ✅ Correct: Only take what you use
const { selectedChat, setSelectedChat } = useContext(ChatbotUIContext)

// ❌ Wrong: Take everything (causes unnecessary re-renders)
const context = useContext(ChatbotUIContext)
```

### Update Context State Correctly
```typescript
// ✅ Correct: For arrays, use functional update
setChats(prevChats => [...prevChats, newChat])
setChats(prevChats => prevChats.filter(c => c.id !== chatId))

// ❌ Wrong: Direct mutation
chats.push(newChat)
setChats(chats)

// ✅ Correct: For objects
setProfile(prevProfile => ({ ...prevProfile, name: newName }))

// ❌ Wrong: Mutate existing object
profile.name = newName
setProfile(profile)
```

## Database Query Patterns

### Error Handling
```typescript
// ✅ Correct: Check for errors and throw
const { data, error } = await supabase.from("chats").select("*")

if (!data) {
  throw new Error(error.message)
}

// Also correct for insert/update/delete
if (error) {
  throw new Error(error.message)
}

// ❌ Wrong: Ignore errors
const { data } = await supabase.from("chats").select("*")
return data
```

### Single vs Maybe Single
```typescript
// ✅ Use .single() when record MUST exist
const { data: chat, error } = await supabase
  .from("chats")
  .select("*")
  .eq("id", id)
  .single()

if (!chat) {
  throw new Error("Chat not found")
}

// ✅ Use .maybeSingle() when record might not exist
const { data: chat } = await supabase
  .from("chats")
  .select("*")
  .eq("id", id)
  .maybeSingle()

// chat could be null, handle it
if (!chat) {
  return null
}
```

### Filters and Ordering
```typescript
// ✅ Correct: Chain filters
const { data } = await supabase
  .from("chats")
  .select("*")
  .eq("workspace_id", workspaceId)
  .order("created_at", { ascending: false })
  .limit(10)

// ❌ Wrong: Don't filter in JavaScript
const { data } = await supabase.from("chats").select("*")
const filtered = data.filter(chat => chat.workspace_id === workspaceId)
```

## Component Patterns

### Conditional Rendering
```typescript
// ✅ Correct: Use conditional operators
{isLoading && <LoadingSpinner />}
{error ? <ErrorMessage error={error} /> : <Content />}
{items.length > 0 && <ItemList items={items} />}

// ❌ Wrong: Use ternary with null unnecessarily
{isLoading ? <LoadingSpinner /> : null}

// ✅ Correct: For complex conditions
{(() => {
  if (condition1) return <Component1 />
  if (condition2) return <Component2 />
  return <DefaultComponent />
})()}
```

### Event Handlers
```typescript
// ✅ Correct: Define handler outside JSX
const handleClick = (id: string) => {
  console.log(id)
}

return <Button onClick={() => handleClick(item.id)}>Click</Button>

// ❌ Wrong: Define inline (creates new function on every render)
return (
  <Button onClick={() => console.log(item.id)}>
    Click
  </Button>
)

// ✅ Correct: No params, pass directly
return <Button onClick={handleSubmit}>Submit</Button>
```

### Children Props
```typescript
// ✅ Correct: Type children properly
interface Props {
  children: React.ReactNode
}

// Also correct for specific children
interface Props {
  children: React.ReactElement<ChildProps>
}
```

## Styling Patterns

### Class Name Composition
```typescript
// ✅ Correct: Use cn() utility
import { cn } from "@/lib/utils"

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "primary" && "primary-classes",
  className
)} />

// ❌ Wrong: String concatenation
<div className={`base-classes ${isActive ? "active-classes" : ""} ${className}`} />
```

### Responsive Design
```typescript
// ✅ Correct: Mobile-first
<div className="flex flex-col md:flex-row lg:gap-4" />

// ❌ Wrong: Desktop-first
<div className="lg:flex lg:flex-row md:flex-col" />
```

### Semantic Colors
```typescript
// ✅ Correct: Use semantic tokens
<div className="bg-background text-foreground" />
<Button className="bg-primary text-primary-foreground" />

// ❌ Wrong: Hard-coded colors
<div className="bg-white text-black dark:bg-gray-900 dark:text-white" />
```

## Async Patterns

### Async Event Handlers
```typescript
// ✅ Correct: Handle errors in async handlers
const handleSubmit = async () => {
  try {
    await saveData()
    toast.success("Saved!")
  } catch (error) {
    console.error(error)
    toast.error("Failed to save")
  }
}

// ❌ Wrong: Unhandled promise rejection
const handleSubmit = async () => {
  await saveData() // might throw
  toast.success("Saved!")
}
```

### Loading States
```typescript
// ✅ Correct: Show loading state
const [isLoading, setIsLoading] = useState(false)

const handleAction = async () => {
  setIsLoading(true)
  try {
    await performAction()
  } finally {
    setIsLoading(false)
  }
}

return <Button disabled={isLoading}>
  {isLoading ? "Loading..." : "Submit"}
</Button>
```

## Common Gotchas & Pitfalls

### 1. Environment Variables
```typescript
// ✅ Correct: NEXT_PUBLIC_ prefix for client-side
// .env.local:
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=... // server-only

// Usage:
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!

// ❌ Wrong: Use server-only var in client
const key = process.env.SUPABASE_SERVICE_ROLE_KEY // undefined in browser!
```

### 2. Supabase Client Context
```typescript
// ✅ Correct: Use browser client in components
import { supabase } from "@/lib/supabase/browser-client"

// ✅ Correct: Use server client in API routes/Server Components
import { createClient } from "@/lib/supabase/server"
const supabase = createClient()

// ❌ Wrong: Use browser client in API routes (doesn't have user context)
```

### 3. Type Generation After Schema Changes
```bash
# Always regenerate types after migrations!
npm run db-types

# Otherwise, TypeScript types won't match database schema
```

### 4. Context Provider Placement
```typescript
// ✅ Correct: Provider wraps components that need context
<ChatbotUIProvider>
  <ComponentThatNeedsContext />
</ChatbotUIProvider>

// ❌ Wrong: Using context outside provider (will get default values)
<ComponentThatNeedsContext />
```

### 5. RLS Policy Issues
```typescript
// Common issue: Query returns empty even though data exists
// Solution: Check RLS policies in Supabase

// Also: Service role key bypasses RLS
// Only use for admin operations!
```

### 6. Image Component
```typescript
// ✅ Correct: Use Next.js Image
import Image from "next/image"
<Image src="/path" alt="description" width={100} height={100} />

// ❌ Wrong: Use img tag (no optimization)
<img src="/path" alt="description" />
```

### 7. Router Usage
```typescript
// ✅ Correct: Use from next/navigation in App Router
import { useRouter } from "next/navigation"
const router = useRouter()
router.push("/path")

// ❌ Wrong: Use from next/router (Pages Router, deprecated)
import { useRouter } from "next/router"
```

### 8. String Quotes
```typescript
// ✅ Correct: Double quotes (enforced by Prettier)
const text = "Hello"
const template = `Hello ${name}`

// ❌ Wrong: Single quotes
const text = 'Hello'
```

### 9. Semicolons
```typescript
// ✅ Correct: No semicolons (enforced by Prettier)
const value = 10
const func = () => {}

// ❌ Wrong: With semicolons
const value = 10;
const func = () => {};
```

### 10. Import Paths
```typescript
// ✅ Correct: Use @ alias
import { supabase } from "@/lib/supabase/browser-client"

// ❌ Wrong: Relative paths from root
import { supabase } from "../../lib/supabase/browser-client"
```

## Performance Considerations

### 1. Avoid Unnecessary Re-renders
```typescript
// ✅ Correct: Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data)
}, [data])

// ✅ Correct: Memoize callbacks passed to children
const handleClick = useCallback(() => {
  doSomething()
}, [])
```

### 2. Lazy Load Heavy Components
```typescript
// ✅ Correct: Dynamic import
import dynamic from "next/dynamic"

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <LoadingSpinner />
})
```

### 3. Optimize Database Queries
```typescript
// ✅ Correct: Select only needed columns
const { data } = await supabase
  .from("chats")
  .select("id, name, created_at")

// ❌ Wrong: Select all columns when you only need a few
const { data } = await supabase.from("chats").select("*")
```

## Security Best Practices

### 1. Never Trust Client Input
```typescript
// ✅ Correct: Validate on server
export async function POST(request: Request) {
  const body = await request.json()
  
  // Validate with Zod
  const schema = z.object({
    name: z.string().min(1).max(100)
  })
  
  const validated = schema.parse(body)
  // Use validated data
}
```

### 2. API Keys
```typescript
// ✅ Correct: Never expose in client code
// Store in env vars, use in API routes only

// ❌ Wrong: Hard-code or pass from client
const apiKey = "sk_..."
```

### 3. User Authorization
```typescript
// ✅ Correct: Always verify user owns resource
const { data: chat } = await supabase
  .from("chats")
  .select("*")
  .eq("id", chatId)
  .eq("user_id", userId) // Important!
  .single()
```

## Documentation Standards

### 1. Complex Functions
```typescript
/**
 * Processes a file and generates embeddings for retrieval
 * 
 * @param fileId - The ID of the file to process
 * @param workspaceId - The workspace context
 * @returns Array of generated file items with embeddings
 * @throws Error if file processing fails
 */
export async function processFileForRetrieval(
  fileId: string,
  workspaceId: string
): Promise<Tables<"file_items">[]> {
  // Implementation
}
```

### 2. Inline Comments for Non-Obvious Logic
```typescript
// Update context with optimistic UI
setMessages(prev => [...prev, optimisticMessage])

try {
  // Actually save to database
  const saved = await createMessage(message)
  
  // Replace optimistic message with real one
  setMessages(prev => 
    prev.map(m => m.id === optimisticMessage.id ? saved : m)
  )
} catch (error) {
  // Revert optimistic update
  setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id))
  throw error
}
```

## Quick Checklist Before Committing

- [ ] No `any` types
- [ ] No non-null assertions (except env vars)
- [ ] Double quotes for strings
- [ ] No semicolons
- [ ] Imports use `@/` alias
- [ ] Database types use `Tables<"...">`
- [ ] Error handling in place
- [ ] Loading states for async operations
- [ ] RLS policies considered
- [ ] Types regenerated if schema changed
- [ ] Linting passes (`npm run lint`)
- [ ] Formatting applied (`npm run format:write`)
- [ ] Type checking passes (`npm run type-check`)

