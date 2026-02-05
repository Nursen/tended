# Tended — Cozy Game Brand Identity v2.0

**Last updated:** February 5, 2026
**Design direction:** Cozy game aesthetic (Stardew Valley, Animal Crossing, Cozy Grove)

---

## 1. Color Palette

### Core Brand Colors

```
Primary (Warm Sage Green)
#7CAA6D — Main brand color, fresh growing plants, life energy
Use for: Primary buttons, active states, thriving friendship indicators

Secondary (Terracotta)
#D4896A — Warm clay pots, earthy grounding
Use for: Secondary actions, warm accents, decorative elements

Tertiary (Soft Cream)
#FFF8E7 — Greenhouse light, morning sun through glass
Use for: Backgrounds, card surfaces, light containers
```

### Accent Colors (Plant Variety)

```
Bloom Pink
#F7A8B8 — Flowering friendships, celebrations, milestones
Use for: Achievements, special moments, celebration states

Seedling Yellow
#FFE17B — New connections, energy, optimism
Use for: New friend cards, onboarding, highlights

Sky Blue
#A8D5E2 — Calm water, peaceful maintenance, breathing room
Use for: Info states, calm notifications, watering reminders

Lavender
#B8A8D9 — Thoughtful care, memories, reflection
Use for: Memory features, photo elements, nostalgic moments
```

### Functional Colors

```
Background Base
#F5F1E8 — Warm off-white, like a sunlit potting shed

Surface/Card Base
#FFFFFF — Clean white for cards, with subtle warm tint

Border/Divider
#E8DCC8 — Soft sand, barely-there divisions

Text Primary
#2C3E2A — Deep forest green, readable but warm

Text Secondary
#6B7569 — Mossy grey-green, less emphasis

Text Tertiary
#9BA199 — Faded sage, labels and hints
```

### Health Status Colors (Friendship States)

```
Thriving
#7CAA6D — Full bloom, strong connection
Visual: Vibrant plant, flowers, full leaves, slight glow animation

Healthy
#9BC085 — Growing well, steady connection
Visual: Green leaves, upright posture, gentle sway

Cooling
#D4C47E — Needs attention, yellowing slightly
Visual: Some leaves turning yellow, pot needs water icon

At-Risk
#D8A876 — Urgent care needed, wilting
Visual: Drooping leaves, dry soil visible, gentle pulse alert

Dormant
#B8AFA4 — Resting, seasonal, not dead
Visual: Bare branches or sleeping bulb, peaceful state (NOT withered)
```

### Seasonal Palette Shifts (Optional Customization)

**Spring (Default)**
Bright greens, pastels, fresh growth

**Summer**
Deeper greens, warm golds, blooming colors (+15% saturation)

**Autumn**
Burnt orange (#C47B5C), rust red (#B8654F), golden yellow (#E6B566)

**Winter**
Evergreens (#5C8D73), frost blue (#D4E4E8), winter white (#FAFBFC)

---

## 2. Typography

### Heading Font: **Fredoka** (Google Fonts)
- Weight: 500 (Medium) for H1-H2, 400 (Regular) for H3-H4
- Why: Rounded, friendly, cozy without being childish. Perfect reading weight.
- Usage: Section headers, card titles, dashboard greetings
- Line height: 1.2 for headings

```css
H1: Fredoka 500, 32px / 38px
H2: Fredoka 500, 24px / 29px
H3: Fredoka 400, 20px / 24px
H4: Fredoka 400, 16px / 19px
```

### Body Font: **Inter** (Google Fonts)
- Weight: 400 (Regular), 500 (Medium for emphasis), 600 (Semi-bold for labels)
- Why: Clean, readable, pairs perfectly with rounded headings, maintains professionalism
- Usage: All body text, UI labels, descriptions
- Line height: 1.5 for body text

```css
Body Large: Inter 400, 16px / 24px
Body: Inter 400, 14px / 21px
Body Small: Inter 400, 12px / 18px
Label: Inter 500, 14px / 20px (all caps with 0.02em letter-spacing)
```

### Accent Font (Optional): **Caveat** (Google Fonts)
- Weight: 400-500
- Why: Handwritten garden journal feel
- Usage: Personal notes, user's own entries, memory captions (sparingly)

---

## 3. UI Components

### Border Radius Philosophy
Rounded and friendly, tactile like terracotta pots.

```
Cards: 16px border radius
Buttons (Primary): 12px border radius
Buttons (Small): 8px border radius
Input Fields: 10px border radius
Modals: 20px border radius
Chips/Tags: 20px border radius (pill shape)
Profile Images: 50% (full circle)
Plant Pots: Custom SVG with organic curve (not geometric)
```

### Shadows (Soft and Layered)

```css
/* Card Rest */
box-shadow:
  0px 2px 8px rgba(44, 62, 42, 0.08),
  0px 1px 2px rgba(44, 62, 42, 0.04);

/* Card Hover */
box-shadow:
  0px 4px 16px rgba(44, 62, 42, 0.12),
  0px 2px 4px rgba(44, 62, 42, 0.06);
transform: translateY(-2px);

/* Button Active */
box-shadow:
  inset 0px 2px 4px rgba(44, 62, 42, 0.15);
transform: scale(0.98);

/* Modal/Overlay */
box-shadow:
  0px 16px 48px rgba(44, 62, 42, 0.16),
  0px 4px 12px rgba(44, 62, 42, 0.08);
```

### Spacing System (8px base)

```
XXS: 4px — Tight padding, icon margins
XS: 8px — Input padding, small gaps
S: 12px — Button padding vertical
M: 16px — Card padding, standard gaps
L: 24px — Section spacing
XL: 32px — Major layout spacing
XXL: 48px — Page margins
```

### Button Styles

**Primary Button (Action)**
```css
background: #7CAA6D;
color: #FFFFFF;
padding: 12px 24px;
border-radius: 12px;
font: Inter 500, 14px;
box-shadow: 0px 2px 4px rgba(124, 170, 109, 0.3);

/* Hover */
background: #6A9A5E;
transform: translateY(-1px);
box-shadow: 0px 4px 8px rgba(124, 170, 109, 0.4);

/* Active */
transform: scale(0.98);
```

**Secondary Button (Soft)**
```css
background: #F5F1E8;
color: #2C3E2A;
border: 2px solid #E8DCC8;
padding: 12px 24px;
border-radius: 12px;

/* Hover */
background: #FFFFFF;
border-color: #7CAA6D;
```

**Icon Button (Floating Action)**
```css
width: 56px;
height: 56px;
border-radius: 50%;
background: #7CAA6D;
box-shadow: 0px 4px 12px rgba(124, 170, 109, 0.4);

/* Hover: Gentle grow */
transform: scale(1.05);
```

### Input Fields

```css
background: #FFFFFF;
border: 2px solid #E8DCC8;
border-radius: 10px;
padding: 12px 16px;
font: Inter 400, 14px;
color: #2C3E2A;

/* Focus */
border-color: #7CAA6D;
box-shadow: 0px 0px 0px 3px rgba(124, 170, 109, 0.1);

/* Error */
border-color: #D8A876;
```

---

## 4. Illustration Style

### Core Aesthetic: **Soft Stylized Botanical**

**NOT**: Photorealistic, line-art-only, overly geometric, minimalist icons
**YES**: Hand-drawn feel, filled color shapes, gentle textures, personality

### Specific Direction

**Plant Character Design:**
- Simplified 3-5 leaf shapes per plant (not botanically accurate)
- Slightly oversized heads (plants are 1:1.2 pot ratio, slightly top-heavy = cute)
- NO faces on plants (avoids infantilizing friendship), but posture conveys emotion
- Organic imperfect shapes — hand-drawn paths, not geometric circles
- Leaves have subtle gradient fills (lighter at tips, darker at base)
- Line weight: 2-3px outlines in darker green (#2C3E2A at 60% opacity)

**Color Fill Approach:**
- Flat color base with ONE subtle gradient overlay (5-10% lighter at top)
- Texture overlay: 3-5% noise/grain for organic feel (like watercolor paper)
- Highlights: Small white dot/crescent on leaves for glossy freshness
- Shadows: Multiply layer at 10% opacity under leaves for depth

**Pot Design:**
- Terracotta base (#D4896A) with rim highlight (#E8A788)
- Visible soil texture at top (dark brown #5C4A3A with grain)
- Drainage hole visible at bottom (detail = care)
- Variations: Ceramic glazed pots, painted patterns, hanging planters, terrariums
- Pots sit in soft circular shadows (radial gradient, 8% opacity)

**Detail Level:**
- Simple enough to render at 64x64px and remain recognizable
- Detailed enough at 256x256px to reward close inspection
- 8-12 color values per plant illustration (not flat 2-color)

**Plant Type Variations by Friendship Category:**
```
Close Friends → Flowering plants (roses, tulips, daisies)
Family → Sturdy plants (succulents, snake plants, pothos)
Colleagues → Structured plants (bonsai, herbs in pots)
Acquaintances → Small seedlings, sprouting bulbs
New Connections → Seeds in soil, first sprouts emerging
```

### Reference Style
Think: **Kawaii Botanical** meets **Stardew Valley crop art** meets **Ghibli background plants**
- Studio Ghibli background flora (lush, alive, slightly exaggerated)
- Stardew Valley crop sprites (clear read, charming, progression visible)
- Kawaii food illustration (rounded, friendly, not too precious)

---

## 5. Animation Philosophy

### Core Principle: **Gentle, Organic, Rewarding**

Cozy games never use linear easing. Every movement has life.

### Easing Curves

```css
/* Primary: Soft Ease Out (default for most UI) */
cubic-bezier(0.22, 1, 0.36, 1) — "Gentle settle"
Duration: 300ms

/* Bounce (for celebrations, achievements) */
cubic-bezier(0.68, -0.55, 0.265, 1.55) — "Happy spring"
Duration: 500ms

/* Ease In-Out (for continuous loops like breathing) */
cubic-bezier(0.45, 0, 0.55, 1) — "Natural rhythm"
Duration: 2000ms

/* Slow Ease (for page transitions) */
cubic-bezier(0.25, 0.46, 0.45, 0.94) — "Dreamy drift"
Duration: 400ms
```

### Specific Animations

**Plant Idle States (Always-On Micro-Animations):**
```
Gentle Sway:
- transform: rotate(-1deg) to rotate(1deg)
- Duration: 3s, infinite, ease-in-out
- Random delay per plant: 0-2s (feels natural, not synchronized)

Leaf Rustle (on hover):
- Individual leaves rotate slightly: -2deg to 2deg
- Duration: 400ms, cubic-bezier(0.68, -0.55, 0.265, 1.55)
- Stagger: 50ms between leaves, top to bottom

Flower Bloom (on tap/focus):
- Scale from 0.9 to 1.1 to 1.0
- Opacity from 0.8 to 1.0
- Duration: 600ms, bounce easing
- Particle burst: 3-5 small petals float upward (500ms fade)
```

**Watering/Care Action:**
```
1. Water droplet falls from top (0.5s, gravity ease)
2. Droplet hits soil, small ripple effect (0.3s)
3. Plant glows softly green (0.5s pulse)
4. Leaves perk up: rotate +5deg, scale 1.05 (0.6s, bounce)
5. Health meter fills with liquid fill animation (1s)
```

**Card Interactions:**
```
Card Hover:
- translateY: 0 to -4px (300ms, soft ease-out)
- box-shadow: expands (300ms, same timing)
- Border: subtle glow effect (200ms delay, 300ms fade-in)

Card Tap/Active:
- scale: 1 to 0.98 to 1 (200ms, slight bounce)
- Haptic feedback trigger point: at 0.98 scale

Swipe Gesture (archive/snooze):
- Card slides left/right with rubber-band resistance
- Background color fades in: green (archive) or blue (snooze)
- Icon scales in from 0.5 to 1.0 as card moves
- Release: Bounce back (400ms) or slide away (300ms)
```

**Loading States:**
```
Seedling Growing (page load):
- Sprout emerges from soil: translateY -20px (800ms)
- First leaf unfolds: scaleX 0 to 1 (400ms, 200ms delay)
- Second leaf: scaleX 0 to 1 (400ms, 400ms delay)
- Gentle bounce settle (200ms)
Total: ~1.4s

Skeleton Loader:
- Soft pulse: opacity 0.4 to 0.6 (1.5s, infinite, ease-in-out)
- Background: Warm cream (#FFF8E7) shimmer
```

**Success/Achievement:**
```
Plant Level-Up:
1. Plant glows (500ms pulse, #FFE17B at 40% opacity)
2. Sparkle particles burst from pot (800ms, 8-12 particles)
3. Plant scales up 1.0 to 1.15 to 1.05 (1s, bounce)
4. New flower/leaves fade in (600ms, stagger 100ms each)
5. Subtle confetti rain (2s, slow fall)
6. Toast notification slides in from top (400ms, soft ease-out)
```

**Empty/Error States:**
```
Wilted Plant Animation:
- Leaves droop: rotate +15deg (2s, slow ease)
- Saturation decreases (2s, matched timing)
- Small water drop icon appears above pot
- Gentle pulse on icon (1.5s infinite, "please help me")

NO harsh shake, NO red X, NO sudden disappearance
```

### Performance Notes
- Use `transform` and `opacity` only (GPU accelerated)
- Reduce motion for users with prefers-reduced-motion
- Cap simultaneous animations: max 3-4 plants animating at once
- Pause off-screen animations

---

## 6. Gamification & Visual Progression

### Growth Stages (Friendship Depth Over Time)

**Stage 1: Seed (0-2 interactions)**
- Visual: Small pot, dark soil, tiny sprout just visible
- Size: 64px × 80px
- Message: "Just planted"

**Stage 2: Seedling (3-8 interactions)**
- Visual: 2-3 small leaves, light green, upright
- Size: 80px × 100px
- First customization unlocked: Choose pot color

**Stage 3: Growing (9-20 interactions)**
- Visual: 5-7 leaves, stem visible, fuller shape
- Size: 96px × 120px
- Unlocked: Choose plant type within category

**Stage 4: Thriving (21-50 interactions)**
- Visual: Full plant, flowers budding, vibrant color
- Size: 112px × 140px
- Unlocked: Seasonal variations, decorative elements

**Stage 5: Blooming (51+ interactions, consistent care)**
- Visual: Full bloom, multiple flowers, slight sparkle effect
- Size: 128px × 160px
- Unlocked: Rare plant variants, garden showcase spot

### Garden Layout Progression

**Week 1 (3-5 friends):**
- Single shelf, wooden plank, warm light from above
- Minimalist, room to grow

**Month 1 (10-15 friends):**
- Two shelves, small decorative items (watering can, journal)
- Background: Frosted greenhouse window visible

**Month 3 (20-30 friends):**
- Three shelves in offset arrangement
- Background: Full greenhouse with hanging plants
- Ambient details: Garden tools, seed packets, small bird

**Month 6+ (30+ friends):**
- Layered shelves, floor plants, hanging baskets
- Custom garden themes unlocked (see Section 8)
- Parallax scrolling: Background depth, foreground vines

### Rewards & Milestones

**Weekly Streak:**
- Day 1-3: Water droplet counter
- Day 7: Watering can badge, +1 rare seed
- Day 30: Golden watering can, garden theme unlocked

**Friendship Milestones:**
```
First contact → Seed packet appears
1 week → First leaves
1 month → Flowers bud
Birthday remembered → Bonus bloom
Photo added → Plant gets small picture frame accessory
6 months → Plant "glows" gently
1 year → Anniversary flower crown on pot
```

**Collection Achievements:**
- "Green Thumb" — 10 thriving plants (unlock: Terrarium garden theme)
- "Gardener" — 25 plants at any stage (unlock: Seasonal auto-themes)
- "Cultivator" — 50 plants (unlock: Rare plant seed shop)

### Visual Feedback for Actions

```
Check-in logged → Small leaf sprouts, +1 to growth meter
Text sent → Water droplet appears, gentle glow
Photo added → Polaroid icon floats to plant base
Call completed → Flower blooms instantly
Missed reminder → Single leaf yellows (reversible with action)
Long gap → Plant wilts slightly, NOT punitive, recoverable
```

---

## 7. Brand Voice & Microcopy

### Tone Shift: From Editorial Premium → Cozy Companion

**Old voice:** Sophisticated, literary, aspirational
**New voice:** Warm, encouraging, gently playful, like a kind gardening mentor

### Three Voice Attributes

1. **Encouraging** — Celebrates small wins, never scolds
2. **Gentle** — Soft suggestions, not urgent demands
3. **Grounded** — Real about friendship effort, not toxic positivity

### Three Voice Avoidances

1. NOT cutesy/baby-talk — No "pwease" or excessive emoji
2. NOT guilt-trippy — No "Your plant is dying!" shame mechanics
3. NOT corporate-cheerful — No "Awesome job, rockstar!" energy

### Updated Microcopy Examples

#### Welcome/Onboarding
```
OLD: "Welcome to Tended. Cultivate meaningful connections."
NEW: "Hey there. Let's grow something beautiful together."

OLD: "Add your first contact to begin."
NEW: "Who should we plant first?"
```

#### Dashboard Greetings
```
Morning: "Good morning. Your garden is waking up."
Afternoon: "Looks like a good day to check in on a friend."
Evening: "A few plants could use some evening care."
Late night: "Still here? Your garden will be here tomorrow too."
```

#### Action Prompts (Non-Pushy)
```
OLD: "You haven't contacted Sarah in 14 days."
NEW: "Sarah's plant is looking a little thirsty. Maybe a quick text?"

OLD: "Schedule a call with Mom."
NEW: "Mom's flowers would love to hear your voice."

OLD: "Complete your weekly goal."
NEW: "Three more check-ins and your watering can gets a gold star."
```

#### Empty States
```
No friends yet:
"Your greenhouse is empty, but not for long. Let's plant your first friendship."

No interactions this week:
"It's been quiet in here. Even small check-ins help things grow."

Archived friends:
"Resting in the potting shed. These friendships are taking a seasonal break."
```

#### Success Messages
```
After logging contact:
"Watered. [Name]'s plant just perked up a bit."

After adding photo:
"Memory planted. This one's going in the journal."

After week streak:
"Seven days strong. Your garden is thriving."

After milestone:
"[Name]'s plant just bloomed. One year of friendship well-tended."
```

#### Error/Gentle Nudges
```
Forgotten reminder:
"Hey, no pressure — but [Name]'s leaves are drooping a little. Free this week?"

Long absence (30+ days):
"It's been a month. [Name]'s plant is dormant, not gone. Want to revive it?"

User sets impossible goal:
"That's a lot of watering. Maybe start with 3 check-ins this week?"
```

#### Settings/Customization
```
"Pick your garden vibe"
"Choose this plant's personality"
"When should we nudge you?"
"Rearrange your shelf however feels right"
```

### Button/CTA Copy

```
Primary Actions:
- "Plant a new friend"
- "Water this friendship" (log interaction)
- "Add to garden"
- "Check in now"

Secondary Actions:
- "Maybe later"
- "Let it rest" (archive)
- "Tend to this" (edit/manage)
- "Browse the shed" (view archived)

Confirmations:
- "Yes, take a break" (archive confirm)
- "Replant it" (unarchive)
- "Keep growing" (cancel deletion)
```

---

## 8. Customization Options

### Philosophy
Customization = ownership. Let users make the garden feel like THEIRS without overwhelming choice.

### Garden Themes (Background Environment)

**Default: Warm Greenhouse**
- Wooden shelves, frosted glass, warm daylight
- Color temp: 5500K (neutral warm)

**Unlockable Themes:**

**1. Sunlit Windowsill**
- Bright window background, outdoor view (city or nature)
- Stronger shadows, high contrast
- Color shift: +10% brightness overall

**2. Cozy Potting Shed**
- Rustic wood walls, hanging tools, vintage feel
- Warmer lighting (4500K)
- Background: #E8D5C4 (warm taupe)

**3. Modern Studio**
- Clean white walls, minimalist shelves, studio lighting
- Cooler palette: whites and soft grays
- For users who want less visual clutter

**4. Enchanted Conservatory** (Premium/Milestone unlock)
- Arched glass ceiling, hanging vines, magical twilight
- Subtle sparkle particles in air
- Background gradient: deep blue to purple evening sky

**5. Seasonal Auto-Shift** (Achievement unlock)
- Spring: Cherry blossom petals drift past window
- Summer: Bright sun, longer shadows
- Autumn: Leaves blow past, amber lighting
- Winter: Frost on window edges, cooler tones

### Plant Type Customization

**Within Each Friendship Category, User Chooses:**

Close Friends options:
- Rose (classic, elegant)
- Sunflower (cheerful, bright)
- Orchid (delicate, refined)
- Wildflower mix (abundant, casual)

Family options:
- Succulent (resilient, steady)
- Fern (lush, reliable)
- Cactus (prickly but loving)
- Herb garden (nourishing, practical)

Colleagues options:
- Bonsai (cultivated, intentional)
- Bamboo (structured, growing)
- Air plant (low-key, independent)
- Desk succulent (practical, friendly)

New/Acquaintance options:
- Seedling sprout
- Bulb emerging
- Cutting in water
- Tiny cactus

### Pot Customization (Unlocked by Care Level)

**Starter Pots:** Terracotta (3 sizes)

**Earned Pots (after 2 weeks care):**
- Painted ceramic (choose color: blue, pink, yellow, green)
- Woven basket
- Geometric concrete
- Vintage tin can

**Premium/Milestone Pots:**
- Hand-painted patterns (stripes, dots, floral)
- Hanging planters
- Glass terrarium
- Decorative enamelware
- Seasonal variants (pumpkin pot for autumn, etc.)

### Decorative Elements (Earned)

**Shelf Accessories:**
- Watering can (bronze → silver → gold based on streak)
- Small garden journal (unlocked after 10 memories added)
- Seed packets (show upcoming plant types)
- Tiny garden gnome (Easter egg unlock)
- Picture frames (display friend photos)
- Fairy lights (evening theme enhancement)

**Plant Accessories:**
- Small flags with friend names
- Decorative stakes (birthday, anniversary)
- Seasonal items (tiny scarf in winter, sun hat in summer)
- Growth chart marker (shows level-up progress)

### Sound Design (Optional but Recommended)

**Ambient:**
- Soft wind through leaves (loopable, 0.3 volume)
- Distant birds occasionally (random, 0.2 volume)
- Greenhouse ambience (subtle)

**Interaction Sounds:**
- Tap plant: Soft rustle (100ms)
- Water action: Gentle pour + drip (800ms)
- Level up: Wind chime + sparkle (1.5s)
- Card swipe: Soft whoosh (200ms)
- Button tap: Soft "pok" like tapping terracotta (50ms)

**All sounds:**
- Warm, organic, never digital beeps
- Low-pass filtered (no harsh frequencies)
- User toggle: ON by default, easy to disable

---

## 9. Implementation Priority

### Phase 1: Core Visual System (MVP)
- [ ] Implement new color palette across all components
- [ ] Switch to Fredoka + Inter typography
- [ ] Update border radius + shadows to cozy standards
- [ ] Create 5 base plant illustrations (one per category)
- [ ] Basic idle sway animation on plants
- [ ] Health status color system
- [ ] Updated microcopy for main flows

### Phase 2: Interaction & Delight
- [ ] Hover/tap animations on all interactive elements
- [ ] Watering action animation sequence
- [ ] Card interaction animations (hover, swipe)
- [ ] Loading state animations (growing seedling)
- [ ] Success/achievement animation system
- [ ] Particle effects for celebrations

### Phase 3: Progression & Customization
- [ ] 5-stage plant growth system
- [ ] Garden layout progression (shelves expand)
- [ ] Basic pot customization (3 variants per category)
- [ ] Weekly streak visual rewards
- [ ] Milestone achievement badges
- [ ] Photo memory integration (frames on plants)

### Phase 4: Depth & Polish
- [ ] Full plant library (3-4 options per category)
- [ ] Garden theme system (4 themes minimum)
- [ ] Seasonal palette shifts
- [ ] Decorative accessory system
- [ ] Sound design implementation
- [ ] Advanced customization (pot painting, arrangement)

---

## 10. Design File Specs

### Figma/Design Tool Setup

**Artboards:**
- Mobile: 375×812 (iPhone 13 base)
- Tablet: 768×1024 (iPad)
- Desktop: 1440×900 (optional, mobile-first)

**Color Styles:** Name exactly as hex codes above
**Text Styles:** Match typography spec exactly
**Component Library:**
- Button (Primary, Secondary, Icon)
- Card (Friend, Memory, Achievement)
- Input (Text, Textarea, Select)
- Plant (Base component with variants)
- Pot (Base with color/style variants)

**Auto-layout:** 8px spacing grid throughout

---

## 11. Brand Applications

### App Icon
- Circular (iOS) / Rounded square (Android)
- Simplified single potted plant (succulent or sprout)
- Warm sage green background (#7CAA6D)
- Terracotta pot accent (#D4896A)
- Subtle shadow for depth
- Should read clearly at 60×60px

### Marketing/Social
- Instagram: Use plant close-ups, cozy lighting, soft shadows
- Screenshots: Always show thriving garden (8-12 plants, varied stages)
- Testimonials: Pair with small plant illustration accent
- Website hero: Animated greenhouse parallax scene

### Merchandise (If Applicable)
- Stickers: Individual plant illustrations
- Notebook: Garden journal theme, cream pages
- Pins: Tiny enamel pots with plants
- Prints: Full garden scene, suitable for framing

---

## Brand Essence (One-Liner)

**Old:** "A sophisticated dashboard for intentional connection."
**New:** "Your cozy corner for growing the friendships that matter."

---

## Design References to Study

**Games:**
- Stardew Valley (crop sprites, UI warmth)
- Animal Crossing (rounded UI, progression feel)
- Cozy Grove (color palette, soft animations)
- Unpacking (gentle interactions, ambient sound)

**Illustration Style:**
- Tokki Studio (soft botanical illustrations)
- Natsuki Camomille (cozy game art, warm palettes)
- Plant illustration from "Viridi" game (realistic but cute)

**Color Palette Inspiration:**
- @plantifulsoul (Instagram, warm plant photography)
- Studio Ghibli background art (Arrietty, Whisper of the Heart)

**UI Motion:**
- Stripe's dashboard micro-interactions (smooth, confident)
- Duolingo's celebration animations (joyful but not over-the-top)
- iOS Weather app transitions (fluid, organic)

---

## Questions for Design Review

1. Does the plant illustration style feel cozy-game enough without being childish?
2. Is the color palette too saturated, or still tasteful for daily dashboard use?
3. Are the animations described clearly enough for a developer handoff?
4. Does the customization system provide enough ownership without overwhelming?
5. Is the voice shift clear in the microcopy examples?

---

**Next Steps:**
- Create initial plant illustration templates
- Build Figma component library with new system
- Prototype one plant growth animation sequence
- User-test watering interaction flow
- Define metric: Does this feel more like a cozy game now?

---

End of Brand Identity v2.0
