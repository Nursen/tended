# Room Scene Redesign Plan

## Vision
Transform the app from a traditional multi-page layout into a single immersive room scene. The room is always visible — all interactions happen within it through overlays, zoom effects, and sliding panels.

**Key principles:**
- The room is the app. No page transitions that break the scene.
- Cozy front-view perspective (like looking at a dollhouse)
- Side panels slide over the room (never replace it)
- Plant close-ups zoom into focus with floating info cards

---

## Room Layout (Single Scene)

```
┌─────────────────────────────────────────────────────────────────────┐
│  🌿                                            ☁️ 🪟 ☁️              │
│  hanging                                          window            │
│  plant                                            with              │
│                                                   succulent         │
│  ┌──────────┐                                                       │
│  │ BULLETIN │    ┌─────────────────────────────────┐               │
│  │  BOARD   │    │      GARDEN SHELVES             │               │
│  │ ┌──────┐ │    │  ┌─────┐ ┌─────┐ ┌─────┐       │               │
│  │ │ 📅  │ │    │  │ 🌱  │ │ 🌿  │ │ 🪴  │  ...   │               │
│  │ │ cal │ │    │  └─────┘ └─────┘ └─────┘       │               │
│  │ └──────┘ │    │  ═══════════════════════       │               │
│  │ 📌 notes │    │  ┌─────┐ ┌─────┐              │               │
│  └──────────┘    │  │ 🌵  │ │ 🌻  │  ...          │               │
│                  │  └─────┘ └─────┘              │               │
│                  │  ═══════════════════════       │               │
│                  └─────────────────────────────────┘               │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │ 💔 NEEDS LOVE SHELF: [wilting plants]  🪴🥀🪴                  ││
│  │══════════════════════════════════════════════════════════════ ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  ════════════════════════════════════════════════════════ floor ═══│
│                                                                     │
│         [+ Add]  [🏠 Garden Name ▾]  [⚙️]     ← floating toolbar    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. RoomScene (New - replaces Layout + FriendsPage)
The persistent room container. Always rendered, never unmounts.

Contains:
- CozyBackground (wall, window, hanging plant, particles)
- BulletinBoard (left side) — birthdays, notes
- GardenShelves (center) — plants organized by tier
- NeedsLoveShelf (bottom) — wilting plants
- FloatingToolbar (bottom) — add friend, garden selector, settings

### 2. PlantCloseup (New - replaces FriendDetailPage)
When you click a plant:
- Plant zooms to center/foreground with spring animation
- Background dims (not hidden)
- Floating info cards appear around the plant:
  - Name & tier badge (top)
  - "Last caught up 3 weeks ago" (side)
  - Quick action buttons: 💬 📞 🤝 💭 (bottom)
  - Recent interactions timeline (side panel or floating)
- Click outside or × to close (plant shrinks back to shelf)

### 3. SidePanel (New - generic slide-in panel)
Slides from right edge, room dims but stays visible.

Used for:
- AddFriendPanel (currently AddFriendModal)
- SettingsPanel (new)
- GardenSwitcher (enhanced dropdown → panel)

### 4. FloatingToolbar (New)
Minimal floating bar at bottom of room:
- `[+ Add Friend]` — opens AddFriendPanel
- `[🏠 My Garden ▾]` — opens GardenSwitcher panel
- `[⚙️]` — opens SettingsPanel

Styled to look like it's sitting on the floor/baseboard.

---

## Navigation Changes

### Before (URL-based routing)
```
/           → HomePage (dashboard)
/friends    → FriendsPage (garden)
/friends/:id → FriendDetailPage
```

### After (State-based overlays)
```
/           → RoomScene (everything)
             ├── Click plant → PlantCloseup overlay (no URL change)
             ├── Click Add → AddFriendPanel slides in
             └── Click Settings → SettingsPanel slides in
```

**Optional:** Could keep `/friends/:id` for deep-linking to a plant closeup, but navigation happens via animations, not page loads.

---

## Framer Motion Animations

### Plant click → Closeup
```typescript
// Plant zooms from its shelf position to center
<motion.div
  layoutId={`plant-${friendId}`}  // Shared layout animation
  animate={{ scale: 2, y: -100 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
/>

// Info cards fade/slide in with stagger
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.2 }}
/>
```

### Side panel slide
```typescript
<motion.div
  initial={{ x: "100%" }}
  animate={{ x: 0 }}
  exit={{ x: "100%" }}
  transition={{ type: "spring", damping: 25 }}
/>
```

### Background dim
```typescript
<motion.div
  className="overlay-backdrop"
  initial={{ opacity: 0 }}
  animate={{ opacity: 0.4 }}
  exit={{ opacity: 0 }}
/>
```

---

## State Management

Add to friendStore (or create uiStore):
```typescript
interface UIState {
  selectedFriendId: string | null;  // null = no closeup
  activePanel: 'add' | 'settings' | 'gardens' | null;

  // Actions
  openPlantCloseup: (friendId: string) => void;
  closePlantCloseup: () => void;
  openPanel: (panel: UIState['activePanel']) => void;
  closePanel: () => void;
}
```

---

## File Changes Summary

### Delete
- `HomePage.tsx` — dashboard absorbed into room
- `FriendsPage.tsx` — becomes RoomScene
- `FriendDetailPage.tsx` — becomes PlantCloseup overlay

### Create
- `RoomScene.tsx` — main room container
- `PlantCloseup.tsx` — plant detail overlay
- `SidePanel.tsx` — generic sliding panel
- `FloatingToolbar.tsx` — bottom action bar
- `GardenShelves.tsx` — extracted shelf logic
- `stores/uiStore.ts` — UI state (selected plant, active panel)

### Modify
- `App.tsx` — simplify routing (maybe just `/`)
- `Layout.tsx` — remove header nav, or delete entirely
- `PlantCard.tsx` — change Link to onClick (opens closeup)
- `AddFriendModal.tsx` → `AddFriendPanel.tsx` — side panel style
- `CozyBackground.tsx` — may need adjustments for full-screen

---

## Migration Steps

1. **Create uiStore** for selected plant and panel state
2. **Build RoomScene** that composes existing components
3. **Build PlantCloseup** with zoom animation and floating cards
4. **Build SidePanel** wrapper component
5. **Build FloatingToolbar**
6. **Convert PlantCard** from Link to onClick
7. **Convert AddFriendModal** to AddFriendPanel
8. **Update App.tsx** routing
9. **Delete old pages** and clean up

---

## Open Questions

1. **Garden switcher UX** — Should switching gardens animate the shelves? Fade transition? Instant swap?

2. **Keyboard navigation** — Escape to close closeup/panel?

3. **Mobile considerations** — Room scales down, but closeup might need different treatment on small screens

4. **Bulletin board interactions** — Click a birthday note → open that plant's closeup?

---

## Typography

**Strategy:** Mix of playful display font + clean readable body font

### Recommended pairing (via Google Fonts)

**Display (headers, labels, plant names):**
- **Fredoka** — chunky, friendly, cozy game vibes
- Alt: Baloo 2, Grandstander

**Body (descriptions, info text):**
- **Nunito** — rounded, highly readable, warm
- Alt: Quicksand, Work Sans

### Implementation

```css
/* In index.html or via @import in CSS */
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&family=Nunito:wght@400;500;600&display=swap');

/* In tokens.css */
:root {
  --font-display: 'Fredoka', sans-serif;
  --font-body: 'Nunito', sans-serif;
}

/* Usage */
h1, h2, h3, .plant-name, .tier-badge {
  font-family: var(--font-display);
}

body, p, .description {
  font-family: var(--font-body);
}
```

---

## Visual Polish (Later)

- Subtle parallax when moving mouse (room depth)
- Shelf shadows that respond to "time of day"
- Particle density changes based on window light
- Small animations when plants get watered (sparkles)
- Secret discoverable elements (click the window, pet the hanging plant)
