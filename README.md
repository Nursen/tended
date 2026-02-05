# Tended 🌱

A private friendship management app that helps you nurture your relationships intentionally. Friends are represented as kawaii potted plants — tend to them, and they thrive.

## The Concept

Businesses spend enormous resources on customer retention programs (airline miles, hotel points, credit card rewards). **Tended applies the same intentional approach to personal friendships.**

Not everyone can be a tier-one friend worthy of an all-inclusive resort vacation. But if you're not intentional about managing your friendships and allocating your limited time and energy, you'll miss out on the benefits of a strong social safety net — people who show up for your graduation, ride-or-die friends who'll be your groomsmen, and that one close friend you'd trust as godparent to your kid.

This is a tool you'd never reveal to your friends, but it's invaluable for keeping connections warm and honoring the people who invest in you.

## Core Metaphor: Plants as Friends

Each friend is represented as a potted plant with a kawaii face. The plant's health reflects the friendship's state. The tier system mirrors real-world plant care requirements:

| Tier | Relationship | Plant Type | Care Metaphor |
|------|--------------|------------|---------------|
| **Tier 1** | Inner Circle | High-maintenance tropicals (Orchid, Monstera, Bird of Paradise) | These plants die without consistent attention — like your closest friendships |
| **Tier 2** | Close Friends | Expressive houseplants (Pothos, Peace Lily, Fiddle Leaf) | They show when neglected, but forgive occasional lapses |
| **Tier 3** | Good Friends | Forgiving everyday plants (Fern, Spider Plant, Herbs) | Resilient, bounce back from neglect |
| **Tier 4** | Friends | Low-maintenance succulents (Echeveria, Snake Plant, Aloe) | Self-sustaining, minimal attention needed |
| **Tier 5** | Acquaintances | Neglect-tolerant cacti & seedlings | Thrive on benign neglect |

### The Seedling Principle

New connections start as **seedlings** — they need consistent early care to grow strong roots before becoming resilient. Once established, a seedling can "graduate" to a proper plant species. The app gives special prompts during this growth phase:

> *"This friendship is still growing roots — a check-in this week could help it take hold."*

This mirrors how real relationships work: early investment creates the foundation for lasting connection.

## Features

### Friendship Health Tracking
- Log interactions (texts, calls, hangouts, deep conversations)
- Automatic health scoring based on contact frequency and tier-appropriate cadence
- Visual health states: Thriving → Healthy → Cooling → At Risk → Dormant
- No guilt — soft nudges, not obligations

### Know Your Friend Cards
Structured notes to remember what matters:
- **Basics**: Partner, kids, pets, dietary restrictions, drink preferences
- **Favorites**: Restaurants, candy, brands, books, activities
- **Life**: Job, goals, stressors, big news
- **Gift Intel**: Sizes, likes, dislikes, gift ideas backlog
- **Raw Notes**: Free-form for anything else

### Friendship Fund
Budget tracking for gifts and generosity by tier and occasion:
- Annual per-friend budgets scaled by tier
- Occasion pools (birthdays, holidays, milestones, spontaneous)
- Gift history tracking (never give the same candle twice)

### Nudge System
Gentle, actionable reminders:
- *"Maya might love to hear from you — it's been a couple weeks"*
- *"James's birthday is Friday. He's into craft beer — want to get him something?"*
- Scheduled personal nudges: *"Call Sally on your commute and ask about summer plans"*

### Cozy Game Aesthetic
- Kawaii plant faces with expressions that reflect relationship health
- Animated leaves that sway gently
- Interactive tap responses (bounce, heart, wink)
- Garden shelf visualization
- Customizable pots, plant types, and themes

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **State**: Zustand with localStorage persistence
- **Animation**: Framer Motion + CSS animations
- **Styling**: CSS custom properties (design tokens)
- **Future Mobile**: React Native + Expo

### Architecture

```
src/
  core/               ← Platform-agnostic business logic
    models/           ← TypeScript types (Friend, Interaction, etc.)
    services/         ← Health scoring, budget calculations
    stores/           ← Zustand state management

  ui/                 ← React-specific UI
    components/       ← Reusable components (Plant, Card, etc.)
    pages/            ← Route-level views (Home, Friends, Profile)
    hooks/            ← Custom React hooks
    assets/           ← SVG plants, images
    styles/           ← Design tokens, global CSS
```

The `core/` layer is pure TypeScript with no DOM dependencies — portable to React Native when we go mobile.

## Design Principles

### Happy Path First
The default experience is lightweight and non-threatening. You should get value from opening the app once a month:
- Upcoming birthdays at a glance
- Gentle reconnection suggestions (not screaming red alerts)
- One-tap interaction logging

Power-user features (analytics, reciprocity tracking, detailed budgets) exist but are hidden behind drill-downs.

### Warm Language, Not System Language
- ❌ "Status: AT RISK"
- ✅ "It's been a while"

- ❌ "21 days since last contact"
- ✅ "You last caught up a few weeks ago"

- ❌ "Cadence target missed"
- ✅ Shows up in gentle suggestions, no label

### No Guilt Mechanics
The app celebrates connection, it doesn't shame neglect. Nudges are opportunities, not obligations. If you ignore them, the app stays calm.

### Private by Design
- Local-first data storage
- No social features, no sharing
- No cloud sync required
- This is a personal tool, not a social network

## Live Demo

Deployed on Netlify with auto-deploy from main branch.

## Getting Started

```bash
cd app
npm install
npm run dev
```

## Project Structure

```
/
├── app/                    # React application
│   └── src/
│       ├── core/           # Business logic (portable)
│       └── ui/             # React components
├── assets/
│   └── plants/
│       ├── svg/            # Placeholder SVG plants
│       └── preview.html    # Interactive SVG preview
├── scripts/                # Build/utility scripts
├── ILLUSTRATION_DESIGN_BRIEF.md   # Designer handoff doc
├── BRAND_IDENTITY_v2.md           # Brand guidelines
├── IMPLEMENTATION_GUIDE.md        # Dev reference
└── README.md               # You are here
```

## Contributing

This is a personal project, but the design documents are thorough enough to onboard collaborators. See:
- `CONTRIBUTING.md` — Code patterns, conventions, and how to add features
- `ILLUSTRATION_DESIGN_BRIEF.md` — Full illustrator handoff
- `BRAND_IDENTITY_v2.md` — Visual design system
- `IMPLEMENTATION_GUIDE.md` — Technical implementation guide

## Philosophy

> "Friendships don't end with a fight. They end with silence — a text you meant to send, a birthday you forgot, a coffee you never scheduled. Tended is a private garden for your relationships. Not a social network. Not something your friends ever see. Just a quiet place where you remember what matters about the people who matter, and a gentle nudge to show up for them before the distance grows."
