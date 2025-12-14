# React Components Rule

**Always use arrow functions for React components (Server/Client Components, Server Actions).**

## ✅ Correct

```typescript
export const MyComponent = async () => <div>Content</div>
export const MyClientComponent = ({ prop }: { prop: string }) => <div>{prop}</div>
export const myServerAction = async () => ({ data: "result" })
```

## ❌ Incorrect

```typescript
export async function MyComponent() { return <div>Content</div> }
export function MyClientComponent({ prop }: { prop: string }) { return <div>{prop}</div> }
```
