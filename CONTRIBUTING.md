# Contributing to Tended

Thanks for your interest in contributing! This guide covers the patterns and conventions used in this codebase.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** for build/dev
- **Zustand** for state management
- **Framer Motion** for animations
- **React Router** for navigation

## Project Structure

```
app/src/
├── core/                    # Business logic (no React)
│   ├── models/types.ts      # All TypeScript types & constants
│   ├── services/            # Pure functions (health scoring, etc.)
│   └── stores/              # Zustand stores
├── ui/                      # React components
│   ├── components/          # Reusable components
│   ├── pages/               # Route pages
│   └── styles/              # Global styles
```

## Key Patterns

### 1. Types & Constants Live in `types.ts`

All shared types and label constants are in `src/core/models/types.ts`. **Never duplicate constants in components.**

```typescript
// ✅ Good - import from types.ts
import { TIER_LABELS, INTERACTION_ICONS, type Tier } from '../../core/models/types';

// ❌ Bad - duplicating constants
const TIER_LABELS = { 1: 'Inner Circle', ... };
```

### 2. Store Selectors

Use Zustand selectors to subscribe to specific state slices:

```typescript
// ✅ Good - subscribe to specific function/slice
const getCurrentGardenFriends = useFriendStore((state) => state.getCurrentGardenFriends);
const friends = getCurrentGardenFriends();

// ❌ Bad - subscribing to entire arrays (causes unnecessary re-renders)
const friends = useFriendStore((state) => state.friends);
```

### 3. Adding a New Plant Type

1. Add the type to `PlantType` in `types.ts`
2. Add it to `TIER_PLANT_OPTIONS` mapping
3. Create or map to an SVG in `components/plants/`
4. Add case in `Plant.tsx` `PlantSVG` switch

### 4. Health Status → Plant Expression

Use the `healthToExpression()` function from `Plant.tsx`:

```typescript
import { healthToExpression } from '../components/Plant';

const expression = healthToExpression(health.healthStatus);
// Returns: 'happy' | 'content' | 'worried' | 'sleeping'
```

### 5. Animation Conventions (Framer Motion)

```typescript
// Entrance animations - stagger children
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.1 }}
>

// Hover effects
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>

// Continuous subtle animations
animate={{ rotate: [-2, 2, -2] }}
transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
```

### 6. Null Safety

Always use proper type guards, not non-null assertions:

```typescript
// ✅ Good - type guard filter
const items = data
  .map(d => {
    const found = lookup[d.id];
    if (!found) return null;
    return { ...d, found };
  })
  .filter((item): item is NonNullable<typeof item> => item !== null);

// ❌ Bad - non-null assertion
items.map(item => item.found!.name)
```

### 7. CSS Conventions

- Use CSS custom properties from `design-tokens.css`
- Frosted glass effect for cards:
  ```css
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  ```
- Shelf surfaces use the wood gradient pattern

## Gardens & Multi-tenancy

Friends are scoped to gardens via `gardenId`. Always use:
- `getCurrentGardenFriends()` not `state.friends` directly
- `getAllFriendsHealth()` which filters by current garden

## File Naming

- Components: `PascalCase.tsx` with matching `.css`
- Pages: `PascalCasePage.tsx`
- Services: `camelCase.ts`

## Commit Messages

Follow conventional commits:
```
feat: Add bulletin board with birthday calendar
fix: Resolve null reference in health calculation
refactor: Extract plant expression logic
```
