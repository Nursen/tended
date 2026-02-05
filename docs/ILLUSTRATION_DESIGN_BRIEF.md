# Tended: Illustration Design Brief

**Project:** Tended Friendship Management App
**Document Version:** 1.0
**Date:** February 5, 2026
**Client:** Tended Development Team

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technical Requirements](#technical-requirements)
3. [Color Palette](#color-palette)
4. [The Plant Collection](#the-plant-collection)
5. [Pot Designs](#pot-designs)
6. [Face System](#face-system)
7. [Health States](#health-states)
8. [Environmental Elements](#environmental-elements)
9. [Animation Notes](#animation-notes)
10. [Style Guide & References](#style-guide--references)
11. [Deliverables Checklist](#deliverables-checklist)
12. [Timeline & Phases](#timeline--phases)

---

## 1. Project Overview

### What is Tended?

Tended is a private friendship management dashboard that helps users nurture their relationships through a cozy, game-like interface. Each friend is represented as a kawaii potted plant whose health and appearance reflects the state of the friendship. The app tracks interactions, reminders, and relationship health across five friendship tiers.

### How Will These Illustrations Be Used?

All illustrations will be:
- Implemented as **interactive SVG components** in a React-based web and mobile application
- Animated programmatically using CSS and JavaScript (GSAP/Framer Motion)
- Responsive across desktop, tablet, and mobile viewports
- User-facing in the main dashboard, where plants are arranged on shelves in a greenhouse-like scene

### Emotional Tone & Aesthetic

The visual language should evoke:
- **Warmth and comfort** — like stepping into a cozy plant shop on a rainy day
- **Gentle encouragement** — the app celebrates relationship care without shame or pressure
- **Playful sophistication** — cute but not childish; accessible to adults 25-45
- **Calm focus** — this is a personal, private space for reflection

Think: *Animal Crossing meets a thoughtfully curated plant boutique meets a cozy game like Viridi or Cozy Grove.*

### Core Concept

Friends are plants. The better you tend to the friendship, the healthier the plant. Each friendship tier (from "Inner Circle" to "Acquaintances") has its own set of plant species and pot styles. The kawaii face on the pot expresses emotion and responds to user interaction, while the plant itself visually represents relationship health through color saturation, leaf posture, and overall vitality.

---

## 2. Technical Requirements

### File Format: SVG

All illustrations must be delivered as **SVG files** with the following specifications:

- **SVG version:** SVG 1.1 (maximum compatibility)
- **Canvas size:** 400px × 600px (width × height) for plants; 1200px × 300px for shelves
- **Artboard alignment:** Center-aligned, with the pot base sitting at y=550px (leaving 50px bottom margin)
- **Color format:** Hex values only (no RGB, HSL, or named colors)
- **Stroke width:** Consistent 2.5px for outlines (may be 2px for fine details like leaf veins)
- **No raster elements:** All artwork must be vector (no embedded PNGs or JPEGs)
- **No filters:** Avoid SVG filters (like blur, drop-shadow) — we'll add these in CSS if needed
- **Clean code:** Remove hidden layers, unused definitions, and editor metadata before export

### SVG Layer Structure: "Puppet Rigging"

Each plant SVG must be structured as a **puppet rig** with named groups for every independently animatable part. This is critical for code-based animation.

#### Required Group Hierarchy

```xml
<svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
  <g id="plant-assembly">

    <!-- Pot -->
    <g id="pot">
      <g id="pot-body">
        <!-- Main pot shape -->
      </g>
      <g id="pot-rim">
        <!-- Optional rim/lip -->
      </g>
      <g id="pot-decoration">
        <!-- Stripes, patterns, texture -->
      </g>
    </g>

    <!-- Face (always on top of pot) -->
    <g id="face">
      <g id="blush">
        <circle id="blush-left" />
        <circle id="blush-right" />
      </g>
      <g id="eyes">
        <g id="eye-left">
          <path id="eye-left-open" />
          <path id="eye-left-closed" style="display:none;" />
          <path id="eye-left-winking" style="display:none;" />
          <!-- Additional eye states hidden by default -->
        </g>
        <g id="eye-right">
          <path id="eye-right-open" />
          <path id="eye-right-closed" style="display:none;" />
          <!-- Additional eye states hidden by default -->
        </g>
      </g>
      <g id="mouth">
        <path id="mouth-happy" />
        <path id="mouth-content" style="display:none;" />
        <path id="mouth-sleeping" style="display:none;" />
        <path id="mouth-worried" style="display:none;" />
        <path id="mouth-excited" style="display:none;" />
        <path id="mouth-giggling" style="display:none;" />
      </g>
    </g>

    <!-- Soil (behind foliage) -->
    <g id="soil">
      <ellipse id="soil-surface" />
    </g>

    <!-- Foliage (each leaf/flower/stem is separate) -->
    <g id="foliage">
      <g id="stem-main">
        <!-- Main stem path -->
      </g>
      <g id="leaf-1" data-pivot-x="200" data-pivot-y="350">
        <!-- Single leaf path - will rotate/sway -->
      </g>
      <g id="leaf-2" data-pivot-x="180" data-pivot-y="320">
        <!-- Another leaf -->
      </g>
      <!-- Continue for all leaves/flowers/vines -->
      <g id="flower-1">
        <g id="flower-petals">
          <!-- Flower petals -->
        </g>
        <g id="flower-center">
          <!-- Flower center -->
        </g>
      </g>
    </g>

    <!-- Optional decorative elements -->
    <g id="decorations" style="display:none;">
      <g id="sparkles">
        <!-- Sparkle shapes for thriving state -->
      </g>
      <g id="sweat-drop">
        <!-- Anxiety sweat for at-risk state -->
      </g>
      <g id="zzz">
        <!-- Sleep indicator for dormant state -->
      </g>
      <g id="heart">
        <!-- Heart for positive interactions -->
      </g>
      <g id="music-notes">
        <!-- Music notes for happy state -->
      </g>
    </g>

  </g>
</svg>
```

#### Critical Layer Naming Rules

1. **Use kebab-case** for all IDs (e.g., `leaf-top-right`, not `leafTopRight` or `leaf_top_right`)
2. **Number sequentially** for repeated elements (e.g., `leaf-1`, `leaf-2`, `leaf-3`)
3. **Include pivot point data attributes** for leaves/stems that will rotate: `data-pivot-x="200" data-pivot-y="350"`
   - Pivot point should be at the BASE/stem connection point, not the leaf center
4. **Default visible state:** Only show one eye state and one mouth state by default; hide others with `style="display:none;"`
5. **Face components must be interchangeable:** All mouth shapes must fit in the same bounding box; same for eye pairs

### Export Settings

- **Decimal precision:** 2 decimal places maximum (reduces file size)
- **Minification:** Do NOT minify — we need human-readable layer names
- **Responsive attributes:** Include `viewBox` but omit fixed `width` and `height` attributes on the root `<svg>` tag
- **Optimization:** Run through SVGO with the following settings preserved:
  - Keep `viewBox`
  - Keep IDs
  - Keep data attributes
  - Remove editor data (Sketch/Figma/Illustrator metadata)

---

## 3. Color Palette

All illustrations must use ONLY the following colors. Do not introduce new colors without client approval.

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Primary Sage Green** | `#7CAA6D` | Healthy foliage, primary plant color, healthy leaves |
| **Terracotta** | `#D4896A` | Pot color option, warm accent, classic plant pot feel |
| **Bloom Pink** | `#F7A8B8` | Flowers, blush marks on faces, cheerful accents |
| **Seedling Yellow** | `#FFE17B` | Flowers, new growth, happy highlights, sparkles |
| **Sky Blue** | `#A8D5E2` | Pot color option, cool accent, calming elements |
| **Lavender** | `#B8A8D9` | Pot color option, soft accent, gentle flowers |
| **Deep Green (Outline)** | `#2C3E2A` | All outlines, dark foliage accents, stem details |
| **Background Cream** | `#FFF8F0` | Shelf backgrounds, window panes, negative space |

### Additional Derived Colors (for health states)

You may create tints and shades of the above colors for health state variations:

- **Lighter tints:** Add white (up to 40%) for highlights, petal gradients
- **Darker shades:** Add the Deep Green (up to 30%) for shadows, depth
- **Desaturation:** Reduce saturation by specified percentages for cooling/at-risk/dormant states (see Health States section)

### Color Combination Guidelines

- **Classic pot:** Terracotta body + Deep Green rim
- **Fresh pot:** Sky Blue body + Primary Sage Green rim
- **Sweet pot:** Bloom Pink body + Lavender rim
- **Sunny pot:** Seedling Yellow body + Primary Sage Green rim
- **Natural pot:** Primary Sage Green body + Deep Green rim

---

## 4. The Plant Collection

Design **14 unique plant species** across 5 friendship tiers. Each plant should have a distinct personality, visual complexity matching its tier, and be instantly recognizable.

### The Care Metaphor (Core Design Principle)

**The tier system mirrors real-world plant care requirements.** This is the organizing principle for the entire plant collection:

| Tier | Friendship Level | Plant Type | Real-World Care | Metaphor |
|------|------------------|------------|-----------------|----------|
| **Tier 1** | Inner Circle | High-maintenance tropicals | Weekly attention, specific conditions | Your closest friends need consistent nurturing |
| **Tier 2** | Close Friends | Expressive houseplants | Regular care, shows when neglected | Good friendships thrive with steady investment |
| **Tier 3** | Good Friends | Forgiving everyday plants | Tolerates some neglect | Solid friendships bounce back |
| **Tier 4** | Friends | Low-maintenance succulents | Stores what it needs, minimal watering | Casual friendships are self-sustaining |
| **Tier 5** | Acquaintances | Neglect-tolerant cacti/seeds | Thrives on benign neglect | New or distant connections need little |

**This metaphor should be immediately intuitive to users:** A Tier 1 orchid that dies without attention maps to your ride-or-die friends who need consistent presence. A Tier 5 cactus that thrives when ignored maps to acquaintances who are fine with a text every few months.

### Design Principles by Tier

| Tier | Complexity | Visual Personality | Element Count | Height Range |
|------|------------|-------------------|---------------|--------------|
| **Tier 1: Inner Circle** | High | Grand, lush, statement-making (tropical divas) | 15-25 leaves/flowers | 350-450px tall |
| **Tier 2: Close Friends** | Medium-High | Warm, expressive, dynamic (loyal companions) | 10-18 leaves/flowers | 280-380px tall |
| **Tier 3: Good Friends** | Medium | Charming, reliable, balanced (forgiving friends) | 7-14 leaves/flowers | 220-320px tall |
| **Tier 4: Friends** | Low-Medium | Simple, cute, compact (self-sufficient) | 4-8 leaves/flowers | 150-220px tall |
| **Tier 5: Acquaintances** | Low | Minimal, hardy, patient (thrives on neglect) | 1-4 leaves/sprouts | 80-150px tall |

---

### Tier 1: Inner Circle (3 Plants)

**High-Maintenance Tropicals** — These are your best friends. The plants are impressive, demanding, and require consistent care — the kind that will dramatically wilt if you forget them for two weeks. In real life, these plants need specific humidity, light, and watering schedules. The metaphor: your closest friendships need regular nurturing to thrive.

---

#### Plant 1.1: Monstera Deliciosa

**Type:** Tropical foliage plant
**Personality:** Bold, sophisticated, iconic — the statement piece of your collection

**Visual Description:**
- **Leaves:** 9-12 large, fenestrated leaves (those signature split/hole patterns)
- **Leaf shape:** Heart-shaped base with deep cuts and oval holes
- **Leaf size:** Largest leaves 80-100px wide
- **Colors:**
  - Leaves: Primary Sage Green with Deep Green veins and outlines
  - New growth: Slightly lighter sage (tint with 20% white)
  - Stems: Deep Green
- **Arrangement:** Leaves emerge from central stems at varied heights, some overlapping, creating depth
- **Unique details:**
  - Each leaf has 4-7 fenestrations (splits/holes) in an irregular natural pattern
  - Prominent central vein with 3-4 secondary veins per leaf
  - Slight upward curl at leaf tips
  - 2-3 unfurling new leaves (rolled, lighter green) at the top

**Individual Elements to Create:**
- 9-12 individual leaf paths (each with fenestrations cut out)
- 5-7 stem segments connecting leaves to main stem
- 2-3 unfurling new leaf rolls
- Main central stem structure

**Pot Pairing Suggestion:** Tapered/tulip pot in Terracotta or Sky Blue

---

#### Plant 1.2: Fiddle Leaf Fig

**Type:** Tropical tree
**Personality:** Elegant, architectural, refined — tall and graceful

**Visual Description:**
- **Leaves:** 8-10 large, violin-shaped leaves
- **Leaf shape:** Broad upper portion, narrow waist, rounded bottom (like a fiddle/violin)
- **Leaf size:** 70-90px tall, 50-60px wide at broadest point
- **Colors:**
  - Leaves: Primary Sage Green with lighter veining
  - Veins: Lighter sage (tint with 30% white)
  - Stems: Deep Green with slight woody brown tint (#3A4A38)
- **Arrangement:** Alternating pattern up a single trunk, leaves angle outward and slightly upward
- **Unique details:**
  - Prominent light-colored central vein that branches into 5-7 secondary veins
  - Subtle wavy edges on leaves
  - One trunk that's slightly thicker at base, tapering toward top
  - 1-2 new leaves at top, smaller and brighter green

**Individual Elements to Create:**
- 8-10 individual violin-shaped leaf paths
- Single trunk path (with subtle width variation)
- Leaf stems (petioles) connecting each leaf to trunk
- Vein details (can be separate paths or integrated into leaf)

**Pot Pairing Suggestion:** Classic cylinder in Sky Blue or Natural (sage green)

---

#### Plant 1.3: Bird of Paradise

**Type:** Tropical flowering plant
**Personality:** Exotic, vibrant, showstopping — this plant blooms

**Visual Description:**
- **Leaves:** 7-9 large, paddle-shaped leaves
- **Leaf shape:** Long oval with pointed tip, banana-leaf-like with slight splits along edges (natural wind damage)
- **Leaf size:** 90-120px tall, 40-50px wide
- **Colors:**
  - Leaves: Primary Sage Green with Deep Green outlines
  - Central vein: Lighter sage
  - Flower petals: Bloom Pink and Seedling Yellow
  - Flower structure: Sky Blue base with Bloom Pink petals emerging
- **Arrangement:** Leaves fan out from central base, tall and upright
- **Unique details:**
  - 1-2 iconic "bird" flowers emerging from leaf base
  - Flower has blue-green bract (boat-shaped base) with orange and pink petals shooting upward like a bird crest
  - Leaves have subtle tears along edges (organic, not damaged-looking)
  - Strong central vein down each leaf

**Individual Elements to Create:**
- 7-9 individual paddle-shaped leaf paths
- 5-7 leaf stems
- 1-2 flower assemblies, each containing:
  - Bract base (boat shape)
  - 3-5 petal/sepal shapes in orange and pink
  - Flower stem
- Central base cluster where everything emerges

**Pot Pairing Suggestion:** Round/bulbous pot in Terracotta or Lavender

---

### Tier 2: Close Friends (3 Plants)

**Expressive Houseplants** — These are the friends you see regularly and genuinely enjoy. The plants need regular care and visibly show when neglected — drooping pothos, peace lilies that dramatically wilt. In real life, these plants forgive occasional lapses but thrive with weekly attention. The metaphor: close friendships need steady investment; they'll let you know when they need water.

---

#### Plant 2.1: Trailing Pothos

**Type:** Vining foliage plant
**Personality:** Friendly, easygoing, warm — the plant equivalent of a golden retriever

**Visual Description:**
- **Leaves:** 12-16 heart-shaped leaves cascading down vines
- **Leaf shape:** Classic heart shape with pointed tip
- **Leaf size:** 30-50px wide (varied sizes along vine)
- **Colors:**
  - Leaves: Primary Sage Green with Seedling Yellow variegation (irregular patches)
  - Variegation pattern: Random creamy yellow patches and stripes
  - Vines: Deep Green
- **Arrangement:** 2-3 main vines trailing down from pot, each with 4-6 leaves; some vines overlap
- **Unique details:**
  - Each leaf has slightly different variegation (no two alike)
  - Leaves get smaller as they trail down the vine
  - Vines have gentle S-curves (not straight)
  - 2-3 new growth tips at vine ends (small, bright leaves)

**Individual Elements to Create:**
- 12-16 individual heart-shaped leaf paths (with varied variegation patterns)
- 2-3 vine paths (curved lines)
- Each leaf connects to vine at a node point (small bulge on vine)

**Pot Pairing Suggestion:** Round/bulbous pot in Sky Blue or Bloom Pink

---

#### Plant 2.2: Sunflower

**Type:** Flowering plant
**Personality:** Cheerful, radiant, uplifting — pure joy in plant form

**Visual Description:**
- **Leaves:** 6-8 large, heart-shaped leaves along thick stem
- **Leaf shape:** Broad heart with serrated edges
- **Leaf size:** 40-60px wide
- **Flower:** 1 large sunflower head at top
- **Colors:**
  - Leaves: Primary Sage Green with Deep Green veins
  - Stem: Deep Green with slight brown tint (#4A5A48)
  - Petals: Seedling Yellow with slight gradient to lighter yellow at tips
  - Flower center: Deep circular center filled with small dots/seeds (use Terracotta or brown)
- **Arrangement:** Single thick stem rising from soil, leaves alternate along stem, large flower at top facing slightly forward
- **Unique details:**
  - Large circular flower head (80-100px diameter)
  - 16-20 petals radiating from center
  - Flower center has spiral pattern or small circle texture
  - Stem has visible texture lines (not smooth)
  - 1-2 small side buds below main flower

**Individual Elements to Create:**
- Single thick stem path
- 6-8 individual heart-shaped leaves with serrated edges
- Flower head assembly:
  - Flower center (circle with seed pattern)
  - 16-20 individual petal paths (arranged in circle)
  - Optional: 1-2 small bud shapes

**Pot Pairing Suggestion:** Terracotta traditional or Classic cylinder in Seedling Yellow

---

#### Plant 2.3: Peace Lily

**Type:** Flowering foliage plant
**Personality:** Serene, elegant, balanced — sophisticated but approachable

**Visual Description:**
- **Leaves:** 8-12 lance-shaped leaves emerging from base
- **Leaf shape:** Long, pointed oval (canoe-shaped) with gentle arch
- **Leaf size:** 60-80px tall, 30-40px wide
- **Flowers:** 1-2 white spadix flowers (those iconic white hoods)
- **Colors:**
  - Leaves: Primary Sage Green with glossy appearance (use subtle lighter green highlight stripe down center)
  - Flowers: Background Cream with very slight Sky Blue shadow, center spadix in Seedling Yellow
  - Stems: Primary Sage Green
- **Arrangement:** Leaves emerge from central base, arching gracefully outward; flowers rise above foliage
- **Unique details:**
  - Flower is a white spathe (hood/sail shape) wrapping around yellow spadix (spike)
  - Leaves have prominent central vein and elegant arch
  - Leaves cross over each other at base
  - Subtle shine/highlight on leaf surface (lighter green stripe along one side)

**Individual Elements to Create:**
- 8-12 individual lance-shaped leaf paths
- Leaf stems (all emerging from central point)
- 1-2 flower assemblies:
  - Spathe (hood) shape
  - Spadix (spike) in center
  - Flower stem

**Pot Pairing Suggestion:** Tapered/tulip pot in Lavender or Sky Blue

---

### Tier 3: Good Friends (3 Plants)

**Forgiving Everyday Plants** — These are solid, reliable friendships. The plants are charming, tolerant, and bounce back from occasional neglect — ferns, herbs, spider plants. In real life, these are the plants that survive a week-long vacation without drama. The metaphor: good friendships are resilient; they appreciate your care but don't collapse without it.

---

#### Plant 3.1: Herb Garden (Basil)

**Type:** Culinary herb
**Personality:** Practical, cheerful, everyday comfort — useful and lovely

**Visual Description:**
- **Leaves:** 14-20 small oval leaves clustered on multiple stems
- **Leaf shape:** Rounded oval with pointed tip, slightly cupped
- **Leaf size:** 20-35px long
- **Colors:**
  - Leaves: Primary Sage Green with slightly brighter tint
  - Stems: Deep Green
- **Arrangement:** 3-4 main stems branching from base, each with pairs of leaves along length, bushy appearance
- **Unique details:**
  - Leaves grow in opposite pairs along stem
  - Small flower buds at tips of stems (tiny lavender dots)
  - Slightly textured/veined leaves
  - Compact, bushy form

**Individual Elements to Create:**
- 14-20 individual small leaf paths
- 3-4 main stem paths
- Small flower bud clusters at stem tips
- Leaves arranged in opposite pairs

**Pot Pairing Suggestion:** Terracotta traditional or Woven basket texture in natural tones

---

#### Plant 3.2: African Violet

**Type:** Flowering houseplant
**Personality:** Sweet, compact, delightful — small but full of charm

**Visual Description:**
- **Leaves:** 10-14 rounded, fuzzy-looking leaves in rosette pattern
- **Leaf shape:** Round to oval, slightly scalloped edges
- **Leaf size:** 30-40px wide
- **Flowers:** 5-8 small clustered flowers above foliage
- **Colors:**
  - Leaves: Primary Sage Green with Deep Green veins, fuzzy texture implied by soft edges
  - Flowers: Lavender or Bloom Pink with Seedling Yellow centers
  - Stems: Primary Sage Green
- **Arrangement:** Leaves form low rosette pattern, flower stems rise from center
- **Unique details:**
  - Leaves have soft, fuzzy appearance (use slightly irregular edges, not smooth)
  - Flowers are 5-petaled, clustered together
  - Compact, low-growing form
  - Leaves overlap at base

**Individual Elements to Create:**
- 10-14 individual round leaf paths with fuzzy edges
- 5-8 individual small flower shapes (5 petals each)
- Flower stems rising from center
- Flower centers (small yellow circles)

**Pot Pairing Suggestion:** Round/bulbous pot in Bloom Pink or Lavender

---

#### Plant 3.3: Boston Fern

**Type:** Fern
**Personality:** Lush, reliable, classic — timeless greenery

**Visual Description:**
- **Fronds:** 8-12 arching fronds with many small leaflets
- **Frond shape:** Long, arching, feather-like with 12-20 leaflet pairs per frond
- **Frond size:** 80-120px long, 40-50px wide at fullest point
- **Colors:**
  - Leaflets: Primary Sage Green
  - Stems: Deep Green
- **Arrangement:** Fronds emerge from central base, arching outward and downward in all directions, creating full, bushy appearance
- **Unique details:**
  - Each frond has central stem (rachis) with many small leaflets arranged in pairs
  - Leaflets get smaller toward frond tip
  - Fronds arch gracefully
  - New growth (fiddleheads) at center: tightly coiled frond tips in brighter green

**Individual Elements to Create:**
- 8-12 individual frond assemblies, each containing:
  - Central rachis (stem)
  - 12-20 small leaflet paths arranged in pairs
- 2-3 fiddlehead shapes (coiled new growth) at center

**Pot Pairing Suggestion:** Woven basket or Classic cylinder in Sky Blue

---

### Tier 4: Friends (3 Plants)

**Low-Maintenance Succulents & Hardy Plants** — These are the friends you like but don't see often. The plants store water, tolerate neglect, and bounce back easily — succulents, snake plants, aloe. In real life, you can forget to water these for weeks and they're fine. The metaphor: these friendships are self-sustaining and don't require constant attention to stay healthy.

---

#### Plant 4.1: Succulent (Echeveria)

**Type:** Succulent rosette
**Personality:** Cute, geometric, self-sufficient — adorably minimal

**Visual Description:**
- **Leaves:** 12-18 fleshy, teardrop-shaped leaves in tight rosette
- **Leaf shape:** Rounded teardrop, thick and plump
- **Leaf size:** 25-35px long
- **Colors:**
  - Leaves: Sky Blue-green (mix Sky Blue and Primary Sage Green)
  - Leaf edges: Slight Bloom Pink blush at tips
  - Center: Brighter, lighter green
- **Arrangement:** Perfect geometric rosette viewed from above, leaves spiral outward from center
- **Unique details:**
  - Leaves have subtle gradient from center (lighter) to edges (slightly darker)
  - Pink/purple blush at leaf tips
  - Tight, compact form
  - Slight powdery texture (use very subtle lighter overlay)

**Individual Elements to Create:**
- 12-18 individual teardrop-shaped leaf paths
- Arrange in spiral/rosette pattern
- Each leaf should layer slightly over the one below

**Pot Pairing Suggestion:** Small classic cylinder or Round pot in Terracotta or Bloom Pink

---

#### Plant 4.2: Mini Cactus (Pincushion Cactus)

**Type:** Small cactus
**Personality:** Spiky but lovable, compact, quirky

**Visual Description:**
- **Body:** Single round or cylindrical cactus body
- **Shape:** Sphere or short cylinder with ribbed texture
- **Size:** 60-80px tall, 50-60px wide
- **Colors:**
  - Body: Primary Sage Green with Deep Green ribs/lines
  - Spines: Deep Green or Lavender (small radiating lines)
  - Optional flower: Bloom Pink or Seedling Yellow
- **Arrangement:** Single compact cactus body, centered in pot
- **Unique details:**
  - 8-12 vertical ribs with spine clusters along each rib
  - Spine clusters are small bursts of 5-8 short lines radiating from points
  - Optional: 1 small flower at top
  - Slightly flattened sphere shape (not perfectly round)

**Individual Elements to Create:**
- Main cactus body path (with rib texture)
- 20-30 small spine cluster groups
- Optional: 1 small flower (5 petals)

**Pot Pairing Suggestion:** Terracotta traditional or Small round pot in Seedling Yellow

---

#### Plant 4.3: Air Plant (Tillandsia)

**Type:** Epiphyte
**Personality:** Minimal, sculptural, independent — barely there but interesting

**Visual Description:**
- **Leaves:** 8-12 thin, curving leaves radiating from center
- **Leaf shape:** Narrow, ribbon-like, curving outward and upward
- **Leaf size:** 40-60px long, 8-12px wide
- **Colors:**
  - Leaves: Sky Blue-green with silvery tint (lighter than typical foliage)
  - Leaf bases: Slightly darker sage
- **Arrangement:** Leaves emerge from bulbous base, curve outward in all directions like a sea urchin or starburst
- **Unique details:**
  - Leaves are thin and elegant, with gentle curves
  - Slightly silvery/frosted appearance
  - No visible roots or soil (air plants don't need soil)
  - Base is small, bulbous cluster

**Individual Elements to Create:**
- 8-12 individual narrow, curved leaf paths
- Small bulbous base cluster

**Pot Pairing Suggestion:** This plant may sit ON TOP of soil or on a small decorative stone rather than planted in soil; pair with any small pot

---

### Tier 5: Acquaintances (2 Plants)

**Neglect-Tolerant Cacti & Seeds** — These are new connections or distant acquaintances. The plants literally thrive on neglect — hardy cacti, dormant seeds, tiny air plants. In real life, overwatering a cactus kills it faster than ignoring it. The metaphor: these relationships are fine with a text every few months; too much attention can actually feel overwhelming.

---

#### Plant 5.1: Seedling

**Type:** Generic young plant
**Personality:** New, hopeful, tender — the beginning of something

**Visual Description:**
- **Leaves:** 2-3 tiny, simple leaves
- **Leaf shape:** Round or oval cotyledons (seed leaves), simple and undetailed
- **Leaf size:** 15-25px wide
- **Stem:** Single thin stem, 40-60px tall
- **Colors:**
  - Leaves: Bright, light sage green (add 40% white to Primary Sage Green)
  - Stem: Light green
  - Soil: visible and prominent around base
- **Arrangement:** Single thin stem emerging from soil, topped with 2-3 small leaves
- **Unique details:**
  - Very simple, almost generic plant shape
  - Leaves are soft and rounded (not detailed)
  - Delicate, thin stem
  - Small scale overall

**Individual Elements to Create:**
- Single thin stem path
- 2-3 small simple leaf shapes
- Prominent soil surface

**Pot Pairing Suggestion:** Any small pot; plant is much smaller than pot, emphasizing newness

---

#### Plant 5.2: Sprouting Seed

**Type:** Seed with emerging sprout
**Personality:** Brand new, just beginning, full of potential

**Visual Description:**
- **Seed:** Small round or oval seed shape partially buried in soil
- **Sprout:** Single curved stem emerging from seed, topped with ONE tiny unfurling leaf
- **Size:** Total height 30-50px
- **Colors:**
  - Seed: Terracotta or brown
  - Sprout stem: Very light sage (almost yellowish-green)
  - Unfurling leaf: Bright light green
- **Arrangement:** Seed sits on/in soil surface, sprout emerges upward in gentle curve
- **Unique details:**
  - Seed may be cracked open slightly
  - Sprout has delicate, curved appearance
  - Unfurling leaf at top is still partially folded/rolled
  - This is the MOST minimal plant representation

**Individual Elements to Create:**
- Seed shape (partially buried)
- Single curved sprout stem
- One tiny unfurling leaf shape

**Pot Pairing Suggestion:** Any small pot; this is the smallest, most minimal plant

---

### Special Note: The Seedling Principle

Seedlings in Tended represent more than just Tier 5 acquaintances — they embody a core design philosophy:

> **New connections need consistent care to grow strong roots before they become resilient.**

In the app, when a user adds a new friend at ANY tier, there's an optional "seedling phase" — a growth period where the friendship is represented as a seedling regardless of the intended tier. During this phase:

1. **The plant starts small** — even a Tier 1 friend begins as a seedling
2. **Consistent early care is rewarded** — regular interactions help the seedling "grow roots"
3. **After the growth phase (~30 days of healthy interaction)**, the plant "graduates" to its proper species (Monstera for Tier 1, Pothos for Tier 2, etc.)
4. **Visual growth progression** — the seedling visually matures, getting larger and more detailed

**Design Implication:** Create 3-4 intermediate growth stages between "Seedling" and each full plant species:
- **Stage 1:** Basic seedling (2-3 simple leaves)
- **Stage 2:** Young plant (5-6 leaves, slightly larger)
- **Stage 3:** Adolescent plant (8-10 leaves, recognizable as species)
- **Stage 4:** Full plant (final form for the tier)

This growth animation is one of the primary rewards in the app — watching a friendship literally bloom.

**UI Copy Examples:**
- *"This friendship is still growing roots — a check-in this week could help it take hold."*
- *"Sarah's plant has sprouted a new leaf! Your recent conversations are helping it grow."*
- *"Marcus's seedling is ready to bloom into a full Monstera! You've built a strong foundation."*

---

## 5. Pot Designs

Design **5 pot styles**, each available in **5 color variants** = **25 total pot SVGs**.

Each pot should be designed on a **400px × 300px canvas**, with the pot base sitting at y=280px (20px bottom margin). Pots should be centered horizontally.

### Pot Dimension Guidelines

| Tier | Pot Height | Pot Width (at widest) | Rim Height |
|------|------------|----------------------|-----------|
| Tier 1-2 (Large) | 160-200px | 140-180px | 8-12px |
| Tier 3 (Medium) | 120-150px | 100-130px | 6-10px |
| Tier 4-5 (Small) | 80-110px | 70-100px | 5-8px |

### Face Placement Zone

All pots must have a designated "face zone" — a clear, smooth area on the front of the pot where the kawaii face will be placed. This area should be:
- **Width:** 60-80px (depending on pot size)
- **Height:** 50-70px
- **Position:** Centered horizontally, positioned in upper-middle third of pot body
- **Background:** Solid color, no patterns or decorations in this zone

---

### Pot Style 1: Classic Cylinder

**Shape:** Straight-sided cylinder with subtle rim

**Proportions:**
- Height: 1.3x width
- Straight vertical sides
- Rim extends 5-8px beyond pot body width
- Flat rim top (ellipse)

**Details:**
- Clean, modern aesthetic
- Rim is slightly thicker than body line (3px vs 2.5px)
- Optional: thin horizontal line 15px below rim for subtle detail
- Smooth, solid body color

**Face Zone:** Center front, 60-80% of pot width

**Color Variants (5):**
1. **Terracotta** body + Deep Green rim
2. **Sky Blue** body + Primary Sage Green rim
3. **Seedling Yellow** body + Primary Sage Green rim
4. **Primary Sage Green** body + Deep Green rim
5. **Lavender** body + Bloom Pink rim

**Available Sizes:** Small, Medium, Large

---

### Pot Style 2: Tapered / Tulip Shape

**Shape:** Wider at top, narrower at bottom — elegant tulip silhouette

**Proportions:**
- Height: 1.4x width (measured at widest point — top)
- Bottom width is 70% of top width
- Gentle outward curve from bottom to top
- Rim extends slightly beyond pot curve

**Details:**
- Graceful, sophisticated aesthetic
- Smooth curves (not angular)
- Rim sits on top of outward-curving body
- Optional: single thin vertical stripe down front (20px wide) in contrasting color

**Face Zone:** Center front, positioned in upper third due to wide top opening

**Color Variants (5):**
1. **Bloom Pink** body + Lavender rim + Sky Blue stripe (optional)
2. **Sky Blue** body + Deep Green rim + Primary Sage Green stripe
3. **Terracotta** body + Deep Green rim (no stripe)
4. **Lavender** body + Bloom Pink rim + Seedling Yellow stripe
5. **Primary Sage Green** body + Deep Green rim + Seedling Yellow stripe

**Available Sizes:** Medium, Large

---

### Pot Style 3: Round / Bulbous

**Shape:** Rounded, friendly pot with narrow opening

**Proportions:**
- Nearly spherical body
- Width: 1.1x height (wider than tall)
- Opening at top is 50-60% of maximum width
- Rim curves inward slightly

**Details:**
- Soft, friendly, huggable appearance
- Maximum width is at pot's midpoint
- Base narrows slightly (but not as narrow as top)
- Smooth curves throughout

**Face Zone:** Center front at widest point

**Color Variants (5):**
1. **Seedling Yellow** body + Primary Sage Green rim
2. **Bloom Pink** body + Lavender rim
3. **Sky Blue** body + Deep Green rim
4. **Terracotta** body + Deep Green rim
5. **Lavender** body + Bloom Pink rim

**Available Sizes:** Small, Medium, Large

---

### Pot Style 4: Terracotta Traditional

**Shape:** Classic terracotta plant pot shape — widest at top, tapered bottom

**Proportions:**
- Height: 1.2x width (at top)
- Linear taper from top to bottom (not curved)
- Bottom width is 60% of top width
- Prominent rolled rim

**Details:**
- Textured appearance suggesting terracotta clay
- Rim is rolled/rounded (not flat)
- Optional: subtle horizontal bands/grooves suggesting clay pottery rings
- Earthy, classic aesthetic

**Face Zone:** Center front, upper half

**Color Variants (5):**
1. **Terracotta** body + darker terracotta rim (shade by adding 20% Deep Green)
2. **Primary Sage Green** body + Deep Green rim
3. **Bloom Pink** body (glazed look) + Lavender rim
4. **Sky Blue** body (glazed look) + Deep Green rim
5. **Seedling Yellow** body (glazed look) + Primary Sage Green rim

**Available Sizes:** Small, Medium, Large

---

### Pot Style 5: Woven Basket Texture

**Shape:** Cylindrical or slightly tapered with woven texture

**Proportions:**
- Height: 1.2x width
- Straight or very slightly tapered sides
- No prominent rim (basket edge is irregular/organic)
- Flat bottom

**Details:**
- Woven texture pattern across entire surface (crosshatch or basket weave pattern)
- Use overlapping diagonal lines (crosshatch) to suggest weaving: lines at +45° and -45°, spaced 8-10px apart
- Organic, handmade appearance
- Rim is irregular, not perfectly horizontal

**Face Zone:** Center front; face appears to be on a fabric patch or label attached to basket

**Color Variants (5):**
1. **Terracotta + Seedling Yellow** (two-tone weave)
2. **Primary Sage Green + Deep Green** (natural fiber look)
3. **Seedling Yellow + Primary Sage Green** (bright basket)
4. **Sky Blue + Lavender** (pastel basket)
5. **Terracotta alone** (classic natural fiber)

**Texture Pattern:** Create crosshatch pattern using thin lines (1.5px) in slightly darker shade of base color

**Available Sizes:** Small, Medium

---

### Pot Size Reference Table

| Size Name | Dimensions (W × H) | Best For Tiers | Pot Styles Available |
|-----------|-------------------|----------------|---------------------|
| **Large** | 160-180px × 180-200px | Tier 1, Tier 2 | Classic, Tapered, Round, Terracotta |
| **Medium** | 110-130px × 130-150px | Tier 2, Tier 3 | All 5 styles |
| **Small** | 75-100px × 90-110px | Tier 4, Tier 5 | Classic, Round, Terracotta, Basket |

---

## 6. Face System

The kawaii face system is **universal** — all face components must work on any pot. Design faces as **separate SVG files** that will be programmatically positioned on pot surfaces.

### Face Component Canvas

Create face components on a **150px × 150px artboard**. Faces will be scaled to fit the designated face zone of each pot.

### Design Principles

- **Simple, minimal shapes** — dots, curves, small lines
- **No facial features that require specific pot color** — faces must look good on any background
- **Consistent sizing** — all eyes, all mouths should fit within the same bounding boxes
- **Expressive but not overly complex** — 2-3 lines maximum per feature

---

### Eyes (6 States, Mirrored Pairs)

Create each eye state as a LEFT eye. The right eye will be a mirrored copy. Position the left eye at **x=45px** and right eye at **x=105px** (60px apart), both at **y=60px** from top of canvas.

#### Eye 1: Open / Neutral

**Description:** Simple, friendly, awake
**Shape:** Small filled circle
**Size:** 8px diameter
**Color:** Deep Green
**Usage:** Default state, healthy plant, neutral expression

---

#### Eye 2: Happy / Content

**Description:** Upturned curves suggesting closed, smiling eyes
**Shape:** Small upward arc, like a smile but positioned where eyes go
**Size:** 12px wide × 6px tall arc
**Color:** Deep Green
**Stroke:** 2px, no fill
**Usage:** Thriving plant, after positive interaction, happy state

---

#### Eye 3: Closed / Sleeping

**Description:** Gentle horizontal lines suggesting rest
**Shape:** Short horizontal line
**Size:** 10px wide × 2px stroke
**Color:** Deep Green
**Usage:** Dormant state, nighttime, resting

---

#### Eye 4: Winking

**Description:** One eye open (neutral), one eye closed (arc)
**Shape:** Left eye = happy arc (closed), Right eye = open circle
**Usage:** Playful state, after you add a note or funny memory

---

#### Eye 5: Worried / Concerned

**Description:** Slightly angled, smaller eyes suggesting anxiety
**Shape:** Small filled circles positioned slightly closer together and lower
**Size:** 6px diameter (smaller than neutral)
**Angle:** Eyes positioned 2px closer together than usual, suggesting "nervous" look
**Optional:** Add small downward angle (eyes tilt inward/downward by 5°)
**Color:** Deep Green
**Usage:** At-risk state, approaching dormant, hasn't been contacted in a while

---

#### Eye 6: Excited / Surprised

**Description:** Larger circles suggesting wide-open eyes
**Shape:** Filled circles, larger than neutral
**Size:** 12px diameter
**Color:** Deep Green
**Optional:** Add tiny highlight (2px white circle in upper-right of each eye)
**Usage:** After interaction, when you're viewing the plant, thriving state

---

### Mouths (6 States)

Position all mouths at **y=85px**, centered horizontally at **x=75px**.

#### Mouth 1: Happy Smile

**Description:** Small, gentle upward curve
**Shape:** Arc curving upward
**Size:** 20px wide × 8px tall
**Color:** Deep Green
**Stroke:** 2px, no fill
**Usage:** Default positive state, healthy plant

---

#### Mouth 2: Content

**Description:** Tiny straight line or very subtle smile
**Shape:** Short horizontal line or very slight upward curve
**Size:** 12px wide × 2px stroke
**Color:** Deep Green
**Usage:** Neutral/content state, resting

---

#### Mouth 3: Sleeping / Kissy

**Description:** Small "o" or "3" shape suggesting sleep or gentle kiss
**Shape:** Small circle (6px) or sideways "3" shape
**Size:** 6-8px
**Color:** Deep Green
**Stroke:** 2px
**Usage:** Dormant state, sleeping, nighttime

---

#### Mouth 4: Worried

**Description:** Small downward curve suggesting concern
**Shape:** Arc curving downward (inverted smile)
**Size:** 16px wide × 6px tall
**Color:** Deep Green
**Stroke:** 2px, no fill
**Usage:** At-risk state, cooling state, hasn't heard from friend

---

#### Mouth 5: Excited / Open Smile

**Description:** Larger open smile
**Shape:** "D" shape — larger upward curve
**Size:** 24px wide × 12px tall
**Color:** Deep Green
**Stroke:** 2.5px, no fill
**Usage:** Thriving state, just after interaction, happy surprise

---

#### Mouth 6: Giggling

**Description:** Playful wavy line suggesting laughter
**Shape:** Wavy sine curve or "w" shape
**Size:** 20px wide × 6px tall
**Color:** Deep Green
**Stroke:** 2px, no fill
**Usage:** Playful moments, winking state, fun interactions

---

### Blush Marks (2 Variants)

Position blush marks at **y=75px**, **x=25px** (left cheek) and **x=125px** (right cheek).

#### Blush 1: Subtle

**Description:** Small rosy circles suggesting gentle warmth
**Shape:** Filled circle
**Size:** 12px diameter
**Color:** Bloom Pink at 40% opacity
**Usage:** Default, healthy state

---

#### Blush 2: Pronounced

**Description:** Larger, more visible blush suggesting excitement or shyness
**Shape:** Filled circle
**Size:** 16px diameter
**Color:** Bloom Pink at 60% opacity
**Usage:** Thriving state, excited state, after positive interaction

---

### Optional Decorative Elements

These appear NEAR the face (not on the pot itself) as floating SVG elements.

#### Sweat Drop

**Description:** Single blue drop suggesting anxiety
**Shape:** Teardrop shape
**Size:** 8px wide × 12px tall
**Color:** Sky Blue with slight gradient to lighter blue at top
**Position:** Upper right of face, near temple area
**Usage:** At-risk state, worried state

---

#### Sparkles

**Description:** 2-3 small star shapes suggesting vitality
**Shape:** 4-pointed stars or plus signs
**Size:** 8-12px
**Color:** Seedling Yellow
**Position:** Scattered around top-left and top-right of face
**Usage:** Thriving state, healthy state, after positive interaction

---

#### Zzz

**Description:** 3 stacked "Z" letters suggesting sleep
**Shape:** Three "Z" letters decreasing in size
**Sizes:** 12px, 10px, 8px tall
**Color:** Sky Blue or Lavender
**Position:** Upper right of face, rising diagonally
**Usage:** Dormant state, sleeping state, at night

---

#### Heart

**Description:** Small heart shape
**Shape:** Classic heart
**Size:** 14px × 14px
**Color:** Bloom Pink
**Position:** Above or next to face
**Usage:** After logging a positive interaction, on hover, thriving state

---

#### Music Notes

**Description:** 1-2 small eighth notes
**Shape:** Musical notes with flag
**Size:** 10-14px tall
**Color:** Deep Green or Lavender
**Position:** Upper right of face
**Usage:** Happy state, after interaction, playful mood

---

### Face Assembly Guidelines

**Default Face (Healthy State):**
- Eyes: Open/Neutral
- Mouth: Happy Smile
- Blush: Subtle
- No optional elements

**All face states must be designed so that:**
- Eyes and mouths can be swapped without repositioning
- Blush marks always stay visible regardless of eye/mouth state
- Optional elements layer ABOVE the face
- Face components do not overlap in ways that cause visual artifacts when swapped

---

## 7. Health States

Each plant must be deliverable in **5 health states** that reflect friendship status. Health state variants can be achieved through color shifts, leaf positions, and visibility toggles — but the core plant structure remains the same.

### Health State Overview

| State | Friendship Status | Visual Indicators | Color Saturation | Leaf Posture |
|-------|------------------|-------------------|------------------|--------------|
| **Thriving** | Very active, strong relationship | Vibrant colors, upright, sparkles | 100% (full saturation) | Upright, perky, full |
| **Healthy** | Normal, steady relationship | Normal colors, standard posture | 100% (baseline) | Standard position |
| **Cooling** | Less frequent contact | Slightly muted, one droopy leaf | 85-90% (10-15% desaturate) | Slight droop in 1-2 leaves |
| **At Risk** | Neglected, infrequent contact | Noticeably muted, drooping | 70-75% (25-30% desaturate) | Multiple drooping leaves |
| **Dormant** | Very infrequent or no contact | Grayish, wilted, browning | 50-60% (40-50% desaturate) | Wilted, drooping significantly |

---

### Thriving State (Tier 100%)

**Visual Characteristics:**
- **Color:** Full saturation — colors are vibrant and rich
- **Foliage:** All leaves present, upright, perky posture
- **Additions:**
  - Sparkles visible (2-3 small stars near plant)
  - Optional: 1-2 flowers or new growth shoots visible
  - Face: Excited/Happy eyes + Excited/Open Smile
  - Blush: Pronounced
- **Leaf posture:** All leaves angled upward 5-10° from baseline
- **Special touches:** Slight highlight on some leaf edges (add 30% white to edge)

**Color Adjustments:**
- Leaves: Use base Primary Sage Green (#7CAA6D) at 100%
- Add subtle highlights (lighter green) to create "glow"
- Flowers (if present) are fully saturated

**Implementation Notes:**
- This state should feel "radiant"
- Optional: increase leaf count by 2-3 (add small new growth leaves)

---

### Healthy State (Baseline — 100%)

**Visual Characteristics:**
- **Color:** Full saturation — this is the baseline, standard appearance
- **Foliage:** All leaves present in standard positions
- **Face:** Open/Neutral eyes + Happy Smile
- **Blush:** Subtle
- **Leaf posture:** Standard position as designed
- **No additional elements**

**Color Adjustments:**
- Use base colors exactly as defined in palette
- No modifications

**Implementation Notes:**
- This is the "default" version of each plant
- Clean, appealing, balanced

---

### Cooling State (85-90% Saturation)

**Visual Characteristics:**
- **Color:** Slightly muted — 10-15% desaturation
- **Foliage:** All leaves present, but 1-2 leaves show slight droop
- **Face:** Open/Neutral eyes + Content mouth (less smile)
- **Blush:** Subtle
- **Leaf posture:** 1-2 leaves angled downward 10-15° from baseline
- **No additional elements**

**Color Adjustments:**
- **Leaves:** Primary Sage Green → reduce saturation by 10-15%
  - From #7CAA6D → shift toward gray: #7FA67B (less vibrant)
- **Flowers/accents:** Also reduce saturation by 10-15%

**Leaf Changes:**
- Select 1-2 leaves (usually lower or outer leaves)
- Rotate downward by 10-15° around pivot point
- Optional: one leaf shows very slight yellowing at tip (add 20% Seedling Yellow)

**Implementation Notes:**
- Subtle but noticeable decline
- User should feel gentle concern, not alarm

---

### At Risk State (70-75% Saturation)

**Visual Characteristics:**
- **Color:** Noticeably muted — 25-30% desaturation
- **Foliage:** Some leaves drooping, 1-2 leaves showing yellowing or browning
- **Face:** Worried eyes + Worried mouth
- **Blush:** Subtle or removed
- **Optional:** Sweat drop visible
- **Leaf posture:** 3-5 leaves angled downward 20-30°, some leaves wilting

**Color Adjustments:**
- **Leaves:** Primary Sage Green → reduce saturation by 25-30%
  - From #7CAA6D → shift toward brownish-gray: #8B9B7D
- **Yellowing leaves:** 1-2 leaves shift toward Seedling Yellow mixed with brown
  - Mix: 60% Seedling Yellow + 40% Deep Green = yellowed leaf
- **Flowers:** Faded significantly or remove entirely

**Leaf Changes:**
- 3-5 leaves droop noticeably (20-30° downward rotation)
- 1-2 leaves show yellowing (color shift)
- 1 leaf may show browning edges (add Deep Green/brown tint to leaf edge)
- Overall plant looks "sad"

**Implementation Notes:**
- User should feel urgency to act
- Clear visual message: "I need attention"

---

### Dormant State (50-60% Saturation)

**Visual Characteristics:**
- **Color:** Very muted, grayish-brown — 40-50% desaturation
- **Foliage:** Minimal leaves remaining (remove 30-50% of leaves), remaining leaves wilted and brown
- **Face:** Closed/Sleeping eyes + Sleeping mouth
- **Blush:** Removed
- **Optional:** Zzz visible
- **Leaf posture:** All remaining leaves drooping heavily (40-60° downward), some curling inward

**Color Adjustments:**
- **Leaves:** Primary Sage Green → heavily desaturated and browned
  - From #7CAA6D → shift to grayish-brown: #8D8B79 or #7F7D6B
- **Browning leaves:** Mix 50% Deep Green + 30% Terracotta + 20% gray
- **Flowers:** Remove entirely
- **Stems:** Also shift to brown tones

**Leaf Changes:**
- **Remove 30-50% of leaves entirely** (hide via `display:none`)
- Remaining leaves:
  - Heavy downward droop (40-60° rotation)
  - Curled/wilted appearance (if possible, curve leaf paths inward)
  - Fully browned or grayish color
- Plant looks "barely alive"

**Implementation Notes:**
- This should evoke strong concern and empathy
- Face is sleeping, not dead — suggests potential for revival
- Minimal but not completely lifeless

---

### Health State Transition Implementation

**For Developers (Note to Include):**
Each plant SVG should include ALL leaves as separate groups. Health state transitions are achieved by:

1. **Color shifts:** Apply saturation and hue filters or direct color swaps to leaf groups
2. **Rotation transforms:** Rotate leaves around their pivot points (use `data-pivot-x` and `data-pivot-y` attributes)
3. **Visibility toggles:** Hide specific leaves in dormant state (`display:none`)
4. **Face swaps:** Toggle visibility of face component variants
5. **Decorative elements:** Show/hide sparkles, sweat, zzz based on state

**CSS/JS Approach:**
```css
.plant[data-health="thriving"] .leaf {
  filter: saturate(1.0) brightness(1.05);
  transform-origin: var(--pivot-x) var(--pivot-y);
  transform: rotate(0deg);
}

.plant[data-health="cooling"] .leaf {
  filter: saturate(0.85);
}

.plant[data-health="cooling"] #leaf-3,
.plant[data-health="cooling"] #leaf-7 {
  transform: rotate(-15deg);
}

.plant[data-health="at-risk"] .leaf {
  filter: saturate(0.70);
}

.plant[data-health="dormant"] .leaf {
  filter: saturate(0.50) hue-rotate(-10deg);
}

.plant[data-health="dormant"] #leaf-2,
.plant[data-health="dormant"] #leaf-5,
.plant[data-health="dormant"] #leaf-8 {
  display: none;
}
```

---

### Health State Color Reference Table

| Element | Healthy (Baseline) | Cooling (-15% sat) | At Risk (-30% sat) | Dormant (-50% sat) |
|---------|-------------------|-------------------|-------------------|-------------------|
| **Primary Sage Green** | `#7CAA6D` | `#7FA67B` | `#8B9B7D` | `#8D8B79` |
| **Deep Green** | `#2C3E2A` | `#2C3E2A` (unchanged) | `#3A4438` | `#4A4A42` |
| **Bloom Pink (flowers)** | `#F7A8B8` | `#F0B5C0` (faded) | `#E8C6CC` (very faded) | Removed |
| **Seedling Yellow (flowers)** | `#FFE17B` | `#F5E095` | `#EBE0B0` | Removed |

---

## 8. Environmental Elements

These are the background and scene elements that create the greenhouse/garden setting where plants live.

### 8.1 Shelves (3 Styles)

Shelves are the primary display surface for plants. Design shelves on a **1200px × 300px canvas** (wide landscape format).

---

#### Shelf 1: Wooden Plank Shelf

**Description:** Simple wooden shelf with visible grain and bracket supports

**Dimensions:**
- Shelf plank: 1200px wide × 40px tall
- Front edge visible
- Depth suggested by slightly darker bottom edge

**Colors:**
- Wood plank: Mix of Terracotta + Seedling Yellow + slight Deep Green = `#C8A87D` (light wood)
- Wood grain: Thin Deep Green lines (1px) running horizontally, slightly irregular
- Underside/shadow: Darker shade (add 30% Deep Green)

**Details:**
- 2-3 horizontal grain lines across plank
- Optional: 2 bracket supports visible at left and right ends (L-shaped brackets in Deep Green)
- Front edge has subtle highlight (lighter wood tone)

**Bracket Style (optional):**
- Simple L-shaped bracket
- Deep Green or Terracotta
- Position at x=100px and x=1100px

---

#### Shelf 2: Glass Panel Shelf

**Description:** Modern, minimal glass or acrylic shelf

**Dimensions:**
- Shelf: 1200px wide × 30px tall
- Very thin edge, transparent appearance

**Colors:**
- Shelf surface: Sky Blue at 20% opacity with slight gradient
- Top edge: White highlight line (2px) suggesting reflection
- Bottom edge: Sky Blue at 40% opacity suggesting glass thickness

**Details:**
- Minimal, clean, modern
- Two small metal brackets visible (simple circles or small rectangles) in Deep Green
- Shelf appears to float

---

#### Shelf 3: Woven Rattan Shelf

**Description:** Cozy, natural rattan/woven shelf

**Dimensions:**
- Shelf: 1200px wide × 50px tall
- Thicker appearance than wooden shelf

**Colors:**
- Rattan: Seedling Yellow + Terracotta mix = `#E8C17B`
- Weave pattern: Crosshatch or horizontal lines in slightly darker tone

**Details:**
- Woven texture across entire surface (similar to basket pot texture)
- Slightly irregular top edge (organic, not perfectly straight)
- Warm, cozy, handmade appearance

---

### 8.2 Greenhouse Glass Pane Background

**Description:** Subtle background element suggesting greenhouse windows

**Dimensions:**
- Full viewport width × height
- Designed as repeatable pattern

**Visual Elements:**
- Large rectangular panes (300px × 400px each) arranged in grid
- Very thin Deep Green lines (1px) for window frames
- Background Cream fill for each pane
- Extremely subtle — should not compete with plants

**Colors:**
- Glass panes: Background Cream (`#FFF8F0`)
- Window frames: Deep Green at 30% opacity
- Optional: Very subtle Sky Blue tint (5% opacity) suggesting sky outside

**Implementation Note:** This should be a background layer, barely noticeable, creating subtle structure

---

### 8.3 Hanging Plant Hooks

**Description:** Small hooks for hanging trailing plants (like pothos)

**Design:**
- Simple S-curve hook shape
- 30px wide × 60px tall
- Attached to top of frame/ceiling

**Colors:**
- Hook: Deep Green or Terracotta
- Rope/string: Seedling Yellow or natural fiber color (Terracotta + white)

**Usage:** Trailing plants (like Pothos) can hang from these instead of sitting on shelves

---

### 8.4 Decorative Items

Small, optional elements to add warmth and personality to the scene.

#### Watering Can

**Size:** 80px × 100px
**Shape:** Classic watering can with spout and handle
**Colors:** Sky Blue body + Deep Green handle, or Terracotta
**Details:** Simple, iconic shape; may sit on shelf or hang on hook

---

#### Garden Journal / Notebook

**Size:** 60px × 80px
**Shape:** Small closed book/journal
**Colors:** Lavender or Bloom Pink cover + Background Cream pages visible at edge
**Details:** May have tiny floral illustration on cover; sits on shelf

---

#### Seed Packets

**Size:** 40px × 60px each
**Shape:** Rectangular packets, slightly overlapping
**Colors:** Varied — Seedling Yellow, Bloom Pink, Sky Blue, Lavender
**Details:** Each has tiny plant illustration on front; arranged in small stack or row

---

#### Tiny Trowel / Garden Tool

**Size:** 50px × 15px
**Shape:** Small hand trowel
**Colors:** Terracotta or Deep Green handle + gray/silver blade
**Details:** Simple, iconic tool shape; leans against pot or sits on shelf

---

### 8.5 Fairy Lights (String Lights)

**Description:** Decorative string lights draped across shelf

**Design:**
- Thin string/wire (1px Deep Green or Seedling Yellow)
- Small circular bulbs (6-8px diameter) spaced 80-120px apart along string
- String has gentle draped curve between attachment points

**Colors:**
- Wire: Deep Green (barely visible) or Seedling Yellow
- Bulbs: Seedling Yellow (glowing appearance) with slight white highlight at center
- Optional: slight glow effect (outer circle at 20% opacity)

**Length:** 1200px (spans entire shelf)

**Usage:** Drapes across top of shelf, adds cozy warmth

---

### 8.6 Seasonal Decorations (Optional — Phase 3)

#### Winter/Snow

- Small snow piles on windowsills (white with slight Sky Blue shadow)
- Tiny snowflakes floating in background (simple 6-pointed stars)

#### Spring/Cherry Blossoms

- Small cherry blossom branch in corner (Bloom Pink flowers + Deep Green branch)
- Falling petals (small Bloom Pink shapes)

#### Summer/Butterflies

- 1-2 small butterflies near plants (Seedling Yellow + Bloom Pink wings)

#### Autumn/Leaves

- Small fallen leaves on shelf (Terracotta + Seedling Yellow)

---

## 9. Animation Notes for the Illustrator

Even though animation will be implemented in code, the illustrator must structure files to support animation. **These are critical technical requirements.**

### 9.1 Animatable Elements

The following elements will be animated independently:

#### Leaves
- **Movement:** Gentle sway, rotate around pivot point
- **Requirement:** Each leaf must be a SEPARATE `<g>` group with `data-pivot-x` and `data-pivot-y` attributes
- **Pivot point location:** At the base of the leaf where it connects to stem (NOT at leaf center)
- **Rotation range:** ±5-15° (subtle sway)

#### Stems
- **Movement:** Gentle flex/wave
- **Requirement:** If stem is long, break into 2-3 segments for more natural movement
- **Pivot points:** At connection points

#### Flowers
- **Movement:** Slight bob, petal flutter
- **Requirement:** Flower petals and center may be separate groups for independent animation

#### Face Components
- **Movement:** Eyes and mouth swap states, blush fades in/out
- **Requirement:** Each facial expression must be a separate path within the face group, toggled via `display: none/block`
- **Spacing:** Face components must have at least 5px clearance from each other to avoid overlap when swapping

#### Decorative Elements (sparkles, sweat, zzz, hearts)
- **Movement:** Fade in/out, float upward, pulse
- **Requirement:** Each element must be separate group, positioned near but not overlapping face

---

### 9.2 Pivot Point Guidelines

**What is a pivot point?**
A pivot point is the origin point around which an element rotates. For leaves, this should be at the stem connection point, not the geometric center of the leaf.

**How to indicate pivot points:**
Add data attributes to each group:
```xml
<g id="leaf-3" data-pivot-x="200" data-pivot-y="350">
  <!-- leaf path here -->
</g>
```

The pivot coordinates are the X and Y position (in the SVG's coordinate system) where the leaf attaches to the stem.

**For illustrators using design tools:**
- In Figma/Sketch/Illustrator, note the base/stem connection point of each leaf
- Include a small guide marker (circle or dot) at the pivot point before export
- Document pivot coordinates in a separate text file if tool doesn't support data attributes

---

### 9.3 Path Overlap Rules

**IMPORTANT:** Elements that will animate independently must NOT share overlapping paths. This prevents visual artifacts during animation.

**Good Structure:**
```xml
<g id="foliage">
  <g id="leaf-1"><!-- separate path --></g>
  <g id="leaf-2"><!-- separate path --></g>
  <g id="leaf-3"><!-- separate path --></g>
</g>
```

**Bad Structure (DO NOT DO THIS):**
```xml
<g id="foliage">
  <path d="M... (all leaves combined into one path)" />
</g>
```

**Rule:** Never merge paths that belong to different animatable elements.

---

### 9.4 Face Component Spacing

All face components (eyes, mouths) must fit within defined bounding boxes with clearance:

- **Eyes bounding box:** 15px × 15px per eye, 60px apart (center to center)
- **Mouth bounding box:** 30px × 20px
- **Minimum clearance:** 5px between eye bottom and mouth top
- **Blush clearance:** 10px from eyes and mouth

This ensures that when expressions swap (e.g., happy mouth → worried mouth), elements don't overlap in unintended ways.

---

### 9.5 Layer Order Matters

**Z-index order from back to front:**
1. Pot body
2. Soil
3. Stems (behind leaves)
4. Leaves (back to front, overlapping naturally)
5. Flowers (on top of leaves)
6. Face (on top of pot body)
7. Decorative elements (sparkles, sweat, etc.) on top of everything

Ensure this order is maintained in the SVG group structure (groups listed first in code appear behind groups listed later).

---

## 10. Style Guide & References

### 10.1 Aesthetic References

**Games:**
- **Animal Crossing (New Horizons):** Cozy, approachable, warm color palette, gentle character design
- **Stardew Valley:** Charming pixel-art simplicity translated to clean vectors
- **Viridi:** Calm, meditative plant care game aesthetic
- **Cozy Grove:** Soft colors, handcrafted feel, emotional warmth

**Illustration Style:**
- **Kawaii plant illustrations:** Search "kawaii potted plants," "cute plant illustrations," "kawaii cactus"
- Clean flat illustration with subtle gradients
- 2-3px consistent outlines in dark color
- Soft drop shadows (if any)
- Rounded, friendly shapes
- Dot eyes and simple curved mouth lines
- Rosy cheeks (blush)

**NOT These Styles (Avoid):**
- Realistic botanical illustration (too serious, too detailed)
- Corporate flat illustration (too generic, lacks warmth)
- Pixel art (different medium, wrong aesthetic)
- Overly childish/baby aesthetic (too young, not sophisticated)
- Highly detailed/textured (too complex for animation)
- 3D/isometric (wrong perspective)

---

### 10.2 Visual Style Rules

#### Line Work
- **Outline weight:** 2.5px for primary shapes (pot, leaves)
- **Detail weight:** 1.5-2px for secondary details (leaf veins, patterns)
- **Outline color:** Deep Green (#2C3E2A) for all outlines
- **No outline on:** Blush marks, subtle highlights, decorative elements like sparkles

#### Color Application
- **Flat fills with subtle gradients:** Gradients should be gentle (10-20% lighter at one end)
- **Gradient direction:** Top-to-bottom or center-to-edge (radial)
- **No complex shading:** Avoid multi-step gradients or complex light/shadow
- **Highlights:** Use tints (add white) for highlights, not pure white

#### Shapes
- **Rounded corners:** Most shapes have slightly rounded corners (1-3px border radius equivalent)
- **Organic but clean:** Leaf shapes are stylized, not botanically accurate, but still recognizable
- **No sharp angles:** Soften hard corners wherever possible

#### Shadows (Optional, Minimal)
- **If using shadows:** Soft drop shadow, 2-4px offset, 10-20% opacity, Deep Green color
- **Better approach:** Use slightly darker fills on bottom/back edges instead of drop shadows (more compatible with SVG animation)

---

### 10.3 Composition Guidelines

#### Plant Composition
- **Rule of thirds:** Place visual interest (flowers, largest leaves) in upper third of plant
- **Balance:** Distribute leaves/foliage evenly around center stem (avoid lopsided appearance)
- **Depth:** Layer leaves to create sense of depth (some behind, some in front)
- **Breathing room:** Leave space around plant — don't fill every pixel

#### Pot + Face Composition
- **Face placement:** Upper-middle of pot, centered horizontally
- **Face size:** Face should be 50-70% of pot width
- **Eye level:** Eyes should be roughly 60% up from pot base
- **Clearance:** Leave at least 10px between face and pot rim

#### Overall Plant + Pot
- **Proportions:** Plant height should be 1.5-2.5x pot height (depending on tier)
- **Pot stability:** Visually, pot should look stable (not top-heavy)
- **Alignment:** Center plant above pot opening

---

## 11. Deliverables Checklist

### Phase 1: Core Assets (Deliver First)

#### Plants (5 plants, 1 per tier)
- [ ] Tier 1: Monstera Deliciosa — Healthy state SVG
- [ ] Tier 2: Trailing Pothos — Healthy state SVG
- [ ] Tier 3: Herb Garden (Basil) — Healthy state SVG
- [ ] Tier 4: Succulent (Echeveria) — Healthy state SVG
- [ ] Tier 5: Seedling — Healthy state SVG

**Total: 5 SVG files**

---

#### Pots (2 styles × 5 colors × 3 sizes = 30 files)

**Style 1: Classic Cylinder**
- [ ] Terracotta + Deep Green rim — Small, Medium, Large (3 files)
- [ ] Sky Blue + Sage rim — Small, Medium, Large (3 files)
- [ ] Seedling Yellow + Sage rim — Small, Medium, Large (3 files)
- [ ] Sage + Deep Green rim — Small, Medium, Large (3 files)
- [ ] Lavender + Pink rim — Small, Medium, Large (3 files)

**Style 3: Round/Bulbous**
- [ ] Seedling Yellow + Sage rim — Small, Medium, Large (3 files)
- [ ] Bloom Pink + Lavender rim — Small, Medium, Large (3 files)
- [ ] Sky Blue + Deep Green rim — Small, Medium, Large (3 files)
- [ ] Terracotta + Deep Green rim — Small, Medium, Large (3 files)
- [ ] Lavender + Bloom Pink rim — Small, Medium, Large (3 files)

**Total: 30 SVG files**

---

#### Face Components (1 comprehensive SVG file with all states)

**Single "Face Component Library" SVG containing:**
- [ ] Eyes: 6 states × 2 eyes (left + right) = 12 eye elements
- [ ] Mouths: 6 mouth states = 6 mouth elements
- [ ] Blush: 2 variants × 2 cheeks = 4 blush elements
- [ ] Optional elements: Sweat drop, Sparkles (3), Zzz (3), Heart, Music notes (2)

**Total: 1 comprehensive SVG file** (all face components in one file, organized by groups)

---

#### Environmental Elements

- [ ] Shelf 1: Wooden Plank — 1 SVG file
- [ ] Background: Greenhouse glass pane pattern — 1 SVG file (or CSS implementation notes)

**Total: 2 SVG files**

---

**Phase 1 Total File Count: 38 SVG files**

---

### Phase 2: Expanded Assets

#### Plants (Remaining 9 plants × 5 health states = 45 files)

**Tier 1:**
- [ ] Fiddle Leaf Fig — 5 health states (5 files)
- [ ] Bird of Paradise — 5 health states (5 files)

**Tier 2:**
- [ ] Sunflower — 5 health states (5 files)
- [ ] Peace Lily — 5 health states (5 files)

**Tier 3:**
- [ ] African Violet — 5 health states (5 files)
- [ ] Boston Fern — 5 health states (5 files)

**Tier 4:**
- [ ] Mini Cactus — 5 health states (5 files)
- [ ] Air Plant — 5 health states (5 files)

**Tier 5:**
- [ ] Sprouting Seed — 5 health states (5 files)

**Total: 45 SVG files**

---

#### Pots (Remaining 3 styles × 5 colors × sizes = ~45 files)

**Style 2: Tapered/Tulip** (Medium and Large only)
- [ ] 5 color variants × 2 sizes = 10 files

**Style 4: Terracotta Traditional**
- [ ] 5 color variants × 3 sizes = 15 files

**Style 5: Woven Basket** (Small and Medium only)
- [ ] 5 color variants × 2 sizes = 10 files

**Total: 35 SVG files**

---

#### Health State Variants for Phase 1 Plants

- [ ] Monstera — Thriving, Cooling, At Risk, Dormant (4 additional files)
- [ ] Pothos — Thriving, Cooling, At Risk, Dormant (4 files)
- [ ] Herb Garden — Thriving, Cooling, At Risk, Dormant (4 files)
- [ ] Succulent — Thriving, Cooling, At Risk, Dormant (4 files)
- [ ] Seedling — Thriving, Cooling, At Risk, Dormant (4 files)

**Total: 20 SVG files**

---

**Phase 2 Total File Count: 100 SVG files**

---

### Phase 3: Decorative & Seasonal Assets

#### Environmental Elements
- [ ] Shelf 2: Glass Panel — 1 file
- [ ] Shelf 3: Woven Rattan — 1 file
- [ ] Hanging plant hooks — 1 file (hooks can be repeated via code)
- [ ] Watering can — 1 file
- [ ] Garden journal — 1 file
- [ ] Seed packets — 1 file (3 packets in one SVG)
- [ ] Tiny trowel — 1 file
- [ ] Fairy lights — 1 file (repeatable string segment)

**Total: 8 SVG files**

---

#### Seasonal Decorations (Optional)
- [ ] Winter: Snow piles + snowflakes — 1 file
- [ ] Spring: Cherry blossom branch + petals — 1 file
- [ ] Summer: Butterflies — 1 file
- [ ] Autumn: Fallen leaves — 1 file

**Total: 4 SVG files**

---

**Phase 3 Total File Count: 12 SVG files**

---

### Grand Total Deliverables

**Phase 1:** 38 files (core, highest priority)
**Phase 2:** 100 files (full plant collection + all pots)
**Phase 3:** 12 files (environmental + seasonal)

**Overall Total: ~150 SVG files**

---

### File Naming Convention

Use consistent, clear naming:

**Plants:**
- `plant-[name]-[tier]-[health-state].svg`
- Example: `plant-monstera-tier1-healthy.svg`, `plant-monstera-tier1-thriving.svg`

**Pots:**
- `pot-[style]-[color]-[size].svg`
- Example: `pot-classic-terracotta-medium.svg`, `pot-round-skyblue-small.svg`

**Face Components:**
- `face-components.svg` (single comprehensive file)

**Environmental:**
- `shelf-[style].svg` (e.g., `shelf-wooden.svg`)
- `env-[item].svg` (e.g., `env-watering-can.svg`, `env-fairy-lights.svg`)

**Seasonal:**
- `seasonal-[season]-[element].svg` (e.g., `seasonal-winter-snow.svg`)

---

## 12. Timeline & Phases

### Phase 1: Core Foundations (Week 1-2)
**Priority: HIGHEST — These are needed for MVP**

**Deliverables:**
- 5 plants (1 per tier) in Healthy state
- 2 pot styles (Classic + Round) in all color variants and sizes
- Complete face component library
- 1 shelf style (Wooden Plank)
- Greenhouse background

**Estimated Hours:** 60-80 hours

**Approval Checkpoint:** Client reviews these assets before Phase 2 begins. Changes to style/approach should be made here.

---

### Phase 2: Full Collection (Week 3-5)
**Priority: HIGH — Completes core functionality**

**Deliverables:**
- Remaining 9 plants in all 5 health states
- All 5 Phase 1 plants in remaining health states
- Remaining 3 pot styles in all variants
- No new environmental elements yet

**Estimated Hours:** 120-160 hours

**Approval Checkpoint:** Client reviews full plant + pot collection. Health state transitions are tested in code.

---

### Phase 3: Polish & Atmosphere (Week 6-7)
**Priority: MEDIUM — Adds polish and delight**

**Deliverables:**
- Remaining shelf styles (Glass, Rattan)
- All decorative items (watering can, journal, tools, fairy lights)
- Hanging hooks
- Seasonal decoration sets (optional)

**Estimated Hours:** 40-60 hours

**Final Delivery:** Complete asset library with documentation

---

### Total Estimated Timeline: 6-7 weeks
**Total Estimated Hours:** 220-300 hours (depending on revisions and complexity)

---

## Questions for the Illustrator

Before beginning, please confirm:

1. **Software/Tools:** What design software will you use? (Figma, Illustrator, Affinity Designer, etc.)
2. **Pivot point support:** Can your tool add custom data attributes to SVG groups? If not, can you provide pivot coordinates in a separate document?
3. **SVG export:** Are you comfortable with SVG optimization and layer naming conventions?
4. **Timeline:** Does the proposed timeline work for your schedule?
5. **Rate/Budget:** Please provide your rate (hourly or per-asset) and estimated total cost for each phase.
6. **Revisions:** How many rounds of revisions are included in your quote?
7. **Style examples:** Can you provide 1-2 portfolio examples of similar work (kawaii, cozy game, flat illustration with character)?

---

## Appendix: Reference Links & Inspiration

**Visual References to Review:**
- Search "kawaii potted plants illustration" on Pinterest, Dribbble
- Animal Crossing: New Horizons plant furniture items
- Viridi game screenshots
- "Cute plant icons" on Iconfinder or Noun Project

**Color Palette (Repeat for Easy Reference):**

| Color Name | Hex Code |
|------------|----------|
| Primary Sage Green | `#7CAA6D` |
| Terracotta | `#D4896A` |
| Bloom Pink | `#F7A8B8` |
| Seedling Yellow | `#FFE17B` |
| Sky Blue | `#A8D5E2` |
| Lavender | `#B8A8D9` |
| Deep Green (Outline) | `#2C3E2A` |
| Background Cream | `#FFF8F0` |

---

## Contact & Questions

For any questions, clarifications, or approval requests during the project, please contact:

**Client Name:** [Your Name]
**Email:** [Your Email]
**Project Repository:** [GitHub link if applicable]
**Preferred Communication:** [Email, Slack, etc.]

We're excited to see these illustrations come to life! This is a deeply personal project about nurturing relationships, and the visual language you create will shape how users feel about their friendships. Thank you for bringing warmth, personality, and care to this work.

---

**End of Brief**