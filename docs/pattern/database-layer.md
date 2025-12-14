# Database Layer Pattern

## Overview

The database layer follows a **domain-based organization pattern** with separate client/server utilities, TypeScript type safety, and result-pattern error handling.

## Architecture

```
lib/
  supabase/
    client.ts          # Browser client creation
    server.ts          # Server client creation
    types.ts           # Result pattern types and utilities
    database.ts        # Generated Supabase types
  db/
    users.ts           # User domain queries
    [domain].ts        # Other domain queries
```

## Key Principles

1. **Separate Client/Server**: Browser and server clients are created separately to follow Next.js App Router best practices
2. **Domain-Based Organization**: Queries are organized by database entities (users, posts, etc.)
3. **Result Pattern**: All queries return `{ data, error }` for consistent error handling
4. **Type Safety**: Generated types from Supabase schema ensure type safety across the application
5. **No Built-in Caching**: Caching is handled manually or not at all

## File Structure

### Client Creation

- **`lib/supabase/client.ts`**: Creates browser client using `createBrowserClient` from `@supabase/ssr`
- **`lib/supabase/server.ts`**: Creates server client for Server Components, Route Handlers, and Server Actions

### Result Pattern

- **`lib/supabase/types.ts`**: Defines `Result<T>` type and `toResult()` helper function
    - Converts Supabase responses to consistent `{ data, error }` format
    - Handles PostgrestError types

### Domain Queries

- **`lib/db/[domain].ts`**: Domain-specific query files
    - Each file contains queries for a specific database entity
    - All functions return `Result<T>` type
    - Use typed Supabase client with `Database` type

### Type Generation

- **`lib/supabase/database.ts`**: Generated TypeScript types from Supabase schema
    - Generated using: `npm run types:generate`
    - Automatically gitignored

## Usage Examples

### Server Component

```typescript
import { getUserById } from "@/lib/db/users";

async function UserProfile({ userId }: { userId: string }) {
  const { data: user, error } = await getUserById(userId);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <div>{user.name}</div>;
}
```

### Client Component

```typescript
"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function UserList() {
  const [users, setUsers] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    supabase.from("users").select("*").then(({ data }) => {
      setUsers(data || []);
    });
  }, []);

  return <div>{/* render users */}</div>;
}
```

## Adding New Domain Queries

1. Create a new file in `lib/db/` (e.g., `lib/db/posts.ts`)
2. Import required utilities:
    ```typescript
    import { createServerClient } from "@/lib/supabase/server"
    import { toResult, type Result } from "@/lib/supabase/types"
    import type { Database } from "@/lib/supabase/database"
    ```
3. Define types from Database schema:
    ```typescript
    type Post = Database["public"]["Tables"]["posts"]["Row"]
    type InsertPost = Database["public"]["Tables"]["posts"]["Insert"]
    type UpdatePost = Database["public"]["Tables"]["posts"]["Update"]
    ```
4. Create query functions that return `Result<T>`:
    ```typescript
    export async function getPostById(id: string): Promise<Result<Post>> {
        const supabase = await createServerClient()
        const response = await supabase.from("posts").select("*").eq("id", id).single()
        return toResult(response)
    }
    ```

## Type Generation

Generate types from your local Supabase schema:

```bash
npm run types:generate
```

This will update `lib/supabase/database.ts` with the latest schema types. The file is gitignored and should be regenerated after schema changes.
