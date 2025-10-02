# Cursor Rules & Documentation for Chatbot UI

Welcome! This directory contains comprehensive rules and guidelines for working on the Chatbot UI codebase. These documents will help you understand the project structure, coding conventions, and architectural patterns.

## 📚 Documentation Files

### 1. [Main Rules File](../.cursorrules)
**The primary rules file** - Start here!
- Critical architecture patterns
- TypeScript and code style rules (MUST FOLLOW)
- Database access patterns
- React/Next.js conventions
- Component patterns
- Error handling
- API route patterns
- Development workflow

**When to reference:** Before starting any work, when writing new code, when in doubt about conventions.

### 2. [Quick Reference](./quick-reference.md)
**Fast lookup for common patterns** - Keep this handy!
- Code snippets for common operations
- Database CRUD templates
- Component boilerplate
- Import statements cheatsheet
- File location map
- NPM scripts reference
- Styling patterns
- Error handling templates

**When to reference:** When you need a quick code template, forgot an import, or need to find where something is.

### 3. [Architecture Guide](./architecture.md)
**Deep dive into system architecture** - Read for understanding!
- System architecture overview
- Data flow patterns
- Component hierarchy
- Database schema relationships
- Feature-specific architectures
- Security architecture
- Deployment architecture
- Scalability considerations

**When to reference:** When adding new features, making architectural decisions, or trying to understand how things fit together.

### 4. [Conventions & Gotchas](./conventions.md)
**Detailed conventions and common mistakes** - Learn from this!
- Naming conventions (files, variables, functions)
- Code organization patterns
- Type safety patterns
- Context usage patterns
- Database query patterns
- Component patterns
- Common pitfalls and how to avoid them
- Performance considerations
- Security best practices

**When to reference:** When writing code, before committing, when troubleshooting issues, or when you encounter something unexpected.

## 🚀 Quick Start

### For New Developers
1. Read the [Main Rules File](../.cursorrules) thoroughly
2. Skim the [Architecture Guide](./architecture.md) to understand the big picture
3. Keep the [Quick Reference](./quick-reference.md) open while coding
4. Refer to [Conventions & Gotchas](./conventions.md) when in doubt

### For Experienced Developers
1. Review the [Main Rules File](../.cursorrules) for project-specific conventions
2. Check the [Quick Reference](./quick-reference.md) for code templates
3. Reference [Conventions & Gotchas](./conventions.md) to avoid common mistakes

## 🎯 Critical Rules (ALWAYS FOLLOW)

### TypeScript
- ❌ **NEVER** use `any` type
- ❌ **NEVER** use non-null assertion (`!`) except for env vars
- ❌ **NEVER** cast to unknown (`as unknown as T`)
- ✅ **ALWAYS** use strict TypeScript
- ✅ **ALWAYS** use generated Supabase types

### Code Style
- ✅ **ALWAYS** use double quotes (`"`) for strings
- ❌ **NEVER** use single quotes
- ❌ **NEVER** use semicolons
- ✅ **ALWAYS** use 2-space indentation
- ✅ **ALWAYS** use `@/` import alias

### Code Quality
- ✅ **ALWAYS** include JSDoc comments for exported functions
- ✅ **ALWAYS** implement error checking and validation
- ✅ **ALWAYS** handle loading states for async operations
- ✅ **ALWAYS** use Tailwind CSS (no custom CSS)
- ✅ **ALWAYS** run `npm run clean` before committing

## 📁 Project Structure

```
/home/tanmay/junie/
├── app/                    # Next.js 14 App Router
│   ├── [locale]/          # Internationalized routes
│   └── api/               # API endpoints
├── components/            # React components by feature
│   ├── chat/             # Chat-related components
│   ├── sidebar/          # Sidebar components
│   ├── ui/               # shadcn/ui base components
│   └── ...
├── context/              # React Context (global state)
├── db/                   # Database access layer
├── lib/                  # Utilities, hooks, business logic
├── types/                # TypeScript type definitions
├── supabase/             # Database migrations & types
└── .cursor/              # 👈 YOU ARE HERE
    ├── README.md         # This file
    ├── quick-reference.md
    ├── architecture.md
    └── conventions.md
```

## 🛠️ Common Tasks

### Starting Development
```bash
npm run chat              # Start Supabase + dev server
# or
npm run dev              # Just dev server (Supabase already running)
```

### Database Operations
```bash
npm run db-migrate       # Apply migrations
npm run db-types         # Regenerate TypeScript types (IMPORTANT!)
npm run db-reset         # Reset database (⚠️ deletes data)
```

### Code Quality
```bash
npm run clean            # Fix linting + formatting
npm run type-check       # Check TypeScript errors
npm test                 # Run tests
```

### Before Committing
```bash
npm run clean            # Fix all auto-fixable issues
npm run type-check       # Verify no type errors
# Test manually in browser
# Review your changes
```

## 📖 Key Concepts

### Database Access Pattern
```typescript
// 1. Import types and client
import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"

// 2. Create function in /db directory
export const createChat = async (chat: TablesInsert<"chats">) => {
  const { data, error } = await supabase
    .from("chats")
    .insert([chat])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// 3. Use in components
import { createChat } from "@/db/chats"
```

### Component Pattern
```typescript
import { FC, useContext } from "react"
import { ChatbotUIContext } from "@/context/context"

interface MyComponentProps {
  title: string
}

export const MyComponent: FC<MyComponentProps> = ({ title }) => {
  const { profile } = useContext(ChatbotUIContext)
  
  return <div>{title}</div>
}
```

### Context Usage
```typescript
import { useContext } from "react"
import { ChatbotUIContext } from "@/context/context"

const { 
  selectedChat,
  setSelectedChat,
  chatMessages,
  setChatMessages 
} = useContext(ChatbotUIContext)
```

## 🔍 Finding Things

### "Where do I put...?"
- **Database query** → `/db/table-name.ts`
- **Type definition** → `/types/feature-name.ts`
- **UI component** → `/components/ui/component-name.tsx`
- **Feature component** → `/components/feature/component-name.tsx`
- **Utility function** → `/lib/util-name.ts`
- **Custom hook** → `/lib/hooks/use-hook-name.ts`
- **API route** → `/app/api/endpoint/route.ts`
- **Page** → `/app/[locale]/page.tsx`

### "Where is...?"
Use the Quick Reference file location map or:
```bash
# Search for file
find . -name "*filename*"

# Search for code
grep -r "searchTerm" --include="*.ts" --include="*.tsx"
```

## 🐛 Common Issues & Solutions

### Issue: Types don't match database
**Solution:** Regenerate types after schema changes
```bash
npm run db-types
```

### Issue: Data not showing up
**Solution:** Check Row Level Security (RLS) policies in Supabase Studio

### Issue: Import not found
**Solution:** Use `@/` prefix for all imports
```typescript
// ✅ Correct
import { utils } from "@/lib/utils"

// ❌ Wrong
import { utils } from "../../lib/utils"
```

### Issue: Linting errors
**Solution:** Run auto-fix
```bash
npm run lint:fix
npm run format:write
```

### Issue: Type errors with Supabase
**Solution:** Use generated types, not custom types
```typescript
// ✅ Correct
import { Tables } from "@/supabase/types"
type Chat = Tables<"chats">

// ❌ Wrong
interface Chat { id: string; ... }
```

## 📝 Development Workflow

1. **Start**
   - Pull latest code
   - Run `npm run db-migrate` to apply any new migrations
   - Run `npm run db-types` to get latest types
   - Start dev server: `npm run chat`

2. **Develop**
   - Follow conventions in these docs
   - Test in browser frequently
   - Check Supabase Studio for database state
   - Use TypeScript errors as your guide

3. **Before Commit**
   - Run `npm run clean` (lint + format)
   - Run `npm run type-check`
   - Test functionality
   - Review changes

4. **If Making Database Changes**
   - Create migration: `supabase migration new name`
   - Write SQL
   - Apply: `npm run db-migrate`
   - Regenerate types: `npm run db-types`
   - Update database access layer in `/db`
   - Update affected components

## 🎓 Learning Resources

### Understanding the Codebase
1. Start with [Architecture Guide](./architecture.md)
2. Look at existing code in `/components/chat/` for examples
3. Study `/db/chats.ts` for database patterns
4. Check `/types/` for type definitions

### Understanding the Stack
- **Next.js 14**: https://nextjs.org/docs
- **React 18**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Supabase**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com

## 💡 Tips for Success

1. **Read error messages carefully** - TypeScript errors are usually helpful
2. **Use the Quick Reference** - Don't memorize, just look it up
3. **Follow existing patterns** - Look at similar code in the codebase
4. **Test early, test often** - Don't write a lot of code before testing
5. **When in doubt, ask** - Or check these docs first!
6. **Keep types strict** - It saves time in the long run
7. **Commit often** - Small commits are easier to review and debug

## 🔗 Quick Links

- **Development Server**: http://localhost:3000
- **Supabase Studio**: http://localhost:54323/project/default/editor
- **Main Rules**: [.cursorrules](../.cursorrules)
- **Quick Reference**: [quick-reference.md](./quick-reference.md)
- **Architecture**: [architecture.md](./architecture.md)
- **Conventions**: [conventions.md](./conventions.md)

## 📞 Getting Help

1. Check these documentation files
2. Search existing code for examples
3. Check Supabase logs/Next.js console for errors
4. Review recent commits for similar work
5. Ask the team

---

**Remember:** These rules exist to make development faster, more consistent, and less error-prone. When you follow them, you'll spend less time debugging and more time building features!

Happy coding! 🚀

