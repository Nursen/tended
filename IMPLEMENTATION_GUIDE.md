# Tended Implementation Guide — Cozy Game Visual System

This guide translates the brand identity into actionable dev tasks.

---

## Quick Start

1. Import Google Fonts in your `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500&family=Inter:wght@400;500;600&family=Caveat:wght@400;500&display=swap" rel="stylesheet">
```

2. Import design tokens:
```css
@import url('./design-tokens.css');
```

3. Set base body styles:
```css
body {
  font-family: var(--font-body);
  background: var(--color-background);
  color: var(--color-text-primary);
  margin: 0;
  padding: 0;
}
```

---

## Component Implementation Examples

### Friend Card with Plant

```jsx
// FriendCard.jsx (React example)
import React from 'react';
import './FriendCard.css';

const FriendCard = ({ friend }) => {
  const { name, lastContact, healthStatus, plantStage, plantType } = friend;

  return (
    <div className="friend-card" data-health={healthStatus}>
      <div className="plant-container">
        <PlantIllustration
          type={plantType}
          stage={plantStage}
          health={healthStatus}
        />
      </div>
      <div className="friend-info">
        <h3 className="friend-name">{name}</h3>
        <p className="last-contact">{lastContact}</p>
        <button className="water-button" onClick={() => waterPlant(friend.id)}>
          Water this friendship
        </button>
      </div>
    </div>
  );
};
```

```css
/* FriendCard.css */
.friend-card {
  background: var(--color-surface);
  border-radius: var(--radius-card);
  padding: var(--space-m);
  box-shadow: var(--shadow-card-rest);
  transition:
    transform var(--duration-normal) var(--ease-soft),
    box-shadow var(--duration-normal) var(--ease-soft);
  cursor: pointer;
}

.friend-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
}

.plant-container {
  position: relative;
  width: 100%;
  height: 160px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-bottom: var(--space-m);
}

.friend-name {
  font-family: var(--font-heading);
  font-size: var(--text-h3);
  margin: 0 0 var(--space-xs) 0;
  color: var(--color-text-primary);
}

.last-contact {
  font-size: var(--text-body-small);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-m) 0;
}

.water-button {
  width: 100%;
  background: var(--color-primary);
  color: white;
  border: none;
  padding: var(--space-s) var(--space-m);
  border-radius: var(--radius-button);
  font-family: var(--font-body);
  font-weight: var(--weight-medium);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-soft);
}

.water-button:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.water-button:active {
  transform: scale(0.98);
}

/* Health-based styling */
.friend-card[data-health="thriving"] .plant-container {
  animation: glow-pulse var(--duration-breath) var(--ease-in-out) infinite;
}

.friend-card[data-health="at-risk"] .water-button {
  background: var(--color-at-risk);
}
```

---

### Plant Illustration Component

```jsx
// PlantIllustration.jsx
import React, { useEffect, useRef } from 'react';
import './PlantIllustration.css';

const PlantIllustration = ({ type, stage, health }) => {
  const plantRef = useRef(null);

  useEffect(() => {
    // Random delay for natural sway
    if (plantRef.current) {
      const randomDelay = Math.random() * 2;
      plantRef.current.style.animationDelay = `${randomDelay}s`;
    }
  }, []);

  return (
    <div className="plant-wrapper">
      <div className="pot" data-type={type}>
        <div className="pot-rim"></div>
        <div className="soil"></div>
      </div>
      <svg
        ref={plantRef}
        className={`plant plant-${type} plant-stage-${stage} plant-health-${health}`}
        viewBox="0 0 128 160"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Plant illustration goes here - use SVG paths */}
        {/* Example for succulent: */}
        {type === 'succulent' && (
          <>
            {/* Pot visible at bottom */}
            <g className="leaves">
              <ellipse cx="64" cy="100" rx="30" ry="20" fill="#7CAA6D" opacity="0.9" />
              <ellipse cx="50" cy="95" rx="25" ry="18" fill="#6A9A5E" />
              <ellipse cx="78" cy="95" rx="25" ry="18" fill="#6A9A5E" />
              <ellipse cx="64" cy="85" rx="20" ry="15" fill="#5D8A52" />
            </g>
            {stage >= 3 && (
              <g className="flower">
                <circle cx="64" cy="70" r="8" fill="#F7A8B8" className="flower-bloom" />
              </g>
            )}
          </>
        )}
      </svg>
    </div>
  );
};
```

```css
/* PlantIllustration.css */
.plant-wrapper {
  position: relative;
  width: 128px;
  height: 160px;
}

.pot {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 60px;
  background: var(--color-secondary);
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 8px rgba(212, 137, 106, 0.3);
}

.pot::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  height: 8px;
  background: #E8A788;
  border-radius: 4px 4px 0 0;
}

.soil {
  position: absolute;
  top: 4px;
  left: 8px;
  right: 8px;
  height: 12px;
  background: #5C4A3A;
  border-radius: 50%;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.plant {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  transform-origin: bottom center;
  animation: plant-sway var(--duration-sway) var(--ease-in-out) infinite;
  filter: drop-shadow(0 2px 4px rgba(44, 62, 42, 0.2));
}

/* Hover interaction */
.plant-wrapper:hover .plant {
  animation: plant-sway 1.5s var(--ease-bounce);
}

/* Health-based filters */
.plant-health-thriving {
  filter:
    drop-shadow(0 2px 4px rgba(44, 62, 42, 0.2))
    drop-shadow(0 0 8px rgba(124, 170, 109, 0.4));
}

.plant-health-at-risk {
  filter: grayscale(30%) brightness(0.9);
  animation: droop 2s ease-out forwards;
}

@keyframes droop {
  to {
    transform: translateX(-50%) rotate(8deg);
  }
}

.plant-health-dormant {
  filter: grayscale(60%) brightness(0.85);
  opacity: 0.8;
}

/* Stage-based scaling */
.plant-stage-1 { width: 64px; height: 80px; }
.plant-stage-2 { width: 80px; height: 100px; }
.plant-stage-3 { width: 96px; height: 120px; }
.plant-stage-4 { width: 112px; height: 140px; }
.plant-stage-5 { width: 128px; height: 160px; }
```

---

### Watering Animation Sequence

```javascript
// wateringAnimation.js

export const playWateringAnimation = async (plantElement) => {
  const container = plantElement.closest('.plant-container');

  // 1. Create water droplet
  const droplet = document.createElement('div');
  droplet.className = 'water-droplet';
  container.appendChild(droplet);

  // 2. Animate droplet fall
  await animateDroplet(droplet);

  // 3. Ripple effect on soil
  const ripple = document.createElement('div');
  ripple.className = 'soil-ripple';
  container.querySelector('.soil').appendChild(ripple);

  // 4. Plant glow + perk up
  plantElement.classList.add('being-watered');

  await new Promise(resolve => setTimeout(resolve, 600));

  // 5. Clean up
  droplet.remove();
  ripple.remove();
  plantElement.classList.remove('being-watered');
  plantElement.classList.add('freshly-watered');

  // 6. Trigger success feedback
  showSuccessToast('Watered! Plant looking fresh.');
};

const animateDroplet = (droplet) => {
  return new Promise(resolve => {
    droplet.style.animation = 'droplet-fall 500ms cubic-bezier(0.5, 0, 1, 1) forwards';
    setTimeout(resolve, 500);
  });
};
```

```css
/* Watering animation styles */
.water-droplet {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: var(--color-sky-blue);
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  opacity: 0.8;
}

@keyframes droplet-fall {
  0% {
    top: -20px;
    opacity: 0.8;
  }
  100% {
    top: 40px;
    opacity: 0;
  }
}

.soil-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: rgba(168, 213, 226, 0.6);
  border-radius: 50%;
  animation: ripple-expand 300ms ease-out forwards;
}

@keyframes ripple-expand {
  to {
    width: 40px;
    height: 40px;
    opacity: 0;
  }
}

.plant.being-watered {
  animation: perk-up 600ms var(--ease-bounce) forwards;
  filter:
    drop-shadow(0 2px 4px rgba(44, 62, 42, 0.2))
    drop-shadow(0 0 12px rgba(124, 170, 109, 0.6));
}

@keyframes perk-up {
  0% {
    transform: translateX(-50%) scale(1);
  }
  50% {
    transform: translateX(-50%) scale(1.05) rotate(-2deg);
  }
  100% {
    transform: translateX(-50%) scale(1.02);
  }
}

.plant.freshly-watered {
  filter:
    drop-shadow(0 2px 4px rgba(44, 62, 42, 0.2))
    drop-shadow(0 0 8px rgba(124, 170, 109, 0.4));
  animation: gentle-glow 2s ease-in-out 3;
}

@keyframes gentle-glow {
  0%, 100% {
    filter:
      drop-shadow(0 2px 4px rgba(44, 62, 42, 0.2))
      drop-shadow(0 0 8px rgba(124, 170, 109, 0.4));
  }
  50% {
    filter:
      drop-shadow(0 2px 4px rgba(44, 62, 42, 0.2))
      drop-shadow(0 0 16px rgba(124, 170, 109, 0.6));
  }
}
```

---

### Achievement Toast with Sparkles

```jsx
// AchievementToast.jsx
import React, { useEffect } from 'react';
import './AchievementToast.css';

const AchievementToast = ({ title, description, onClose }) => {
  useEffect(() => {
    // Create sparkle particles
    const container = document.querySelector('.toast-container');
    for (let i = 0; i < 12; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle-particle';
      sparkle.style.left = `${Math.random() * 100}%`;
      sparkle.style.animationDelay = `${Math.random() * 200}ms`;
      container.appendChild(sparkle);

      setTimeout(() => sparkle.remove(), 1000);
    }

    // Auto-dismiss after 3 seconds
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast-container achievement-toast">
      <div className="toast-icon">🌸</div>
      <div className="toast-content">
        <h4 className="toast-title">{title}</h4>
        <p className="toast-description">{description}</p>
      </div>
    </div>
  );
};
```

```css
/* AchievementToast.css */
.achievement-toast {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--z-toast);
  background: var(--color-surface);
  border-radius: var(--radius-modal);
  padding: var(--space-m) var(--space-l);
  box-shadow: var(--shadow-modal);
  display: flex;
  align-items: center;
  gap: var(--space-m);
  animation: toast-slide-in 400ms var(--ease-soft) forwards;
  overflow: visible;
}

@keyframes toast-slide-in {
  0% {
    transform: translateX(-50%) translateY(-100px);
    opacity: 0;
  }
  100% {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

.toast-icon {
  font-size: 32px;
  animation: icon-bounce 500ms var(--ease-bounce);
}

@keyframes icon-bounce {
  0% { transform: scale(0.5); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.toast-title {
  font-family: var(--font-heading);
  font-size: var(--text-h4);
  margin: 0 0 4px 0;
  color: var(--color-primary);
}

.toast-description {
  font-size: var(--text-body-small);
  color: var(--color-text-secondary);
  margin: 0;
}

.sparkle-particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: var(--color-seedling-yellow);
  border-radius: 50%;
  top: 50%;
  animation: sparkle-rise 800ms var(--ease-soft) forwards;
  box-shadow: 0 0 4px rgba(255, 225, 123, 0.8);
}
```

---

### Loading State (Growing Seedling)

```jsx
// LoadingState.jsx
import React from 'react';
import './LoadingState.css';

const LoadingState = ({ message = "Loading your garden..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-seedling">
        <div className="loading-pot"></div>
        <svg className="loading-plant" viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
          <g className="stem">
            <line x1="30" y1="60" x2="30" y2="30" stroke="#7CAA6D" strokeWidth="3" />
          </g>
          <g className="leaf-left">
            <ellipse cx="20" cy="40" rx="12" ry="8" fill="#6A9A5E" />
          </g>
          <g className="leaf-right">
            <ellipse cx="40" cy="35" rx="12" ry="8" fill="#6A9A5E" />
          </g>
        </svg>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
};
```

```css
/* LoadingState.css */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.loading-seedling {
  position: relative;
  width: 60px;
  height: 80px;
}

.loading-pot {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 30px;
  background: var(--color-secondary);
  border-radius: 0 0 6px 6px;
}

.loading-plant {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 80px;
}

.loading-plant .stem {
  animation: grow-stem 800ms ease-out forwards;
  transform-origin: bottom;
}

.loading-plant .leaf-left {
  animation:
    grow-leaf 400ms ease-out 200ms forwards,
    leaf-sway 2s ease-in-out 600ms infinite;
  transform-origin: center;
  opacity: 0;
}

.loading-plant .leaf-right {
  animation:
    grow-leaf 400ms ease-out 400ms forwards,
    leaf-sway 2s ease-in-out 800ms infinite;
  transform-origin: center;
  opacity: 0;
}

@keyframes grow-stem {
  from {
    transform: scaleY(0);
    opacity: 0;
  }
  to {
    transform: scaleY(1);
    opacity: 1;
  }
}

@keyframes grow-leaf {
  from {
    transform: scaleX(0);
    opacity: 0;
  }
  to {
    transform: scaleX(1);
    opacity: 1;
  }
}

@keyframes leaf-sway {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

.loading-message {
  margin-top: var(--space-l);
  font-size: var(--text-body);
  color: var(--color-text-secondary);
  animation: pulse-text 1.5s ease-in-out infinite;
}

@keyframes pulse-text {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
```

---

## Performance Optimization

### 1. Animation Performance
```css
/* Always use transform and opacity for animations */
.optimized-animation {
  /* Good: GPU accelerated */
  transform: translateY(-4px);
  opacity: 0.9;

  /* Avoid: Causes reflow */
  /* top: -4px; */
  /* height: 100px; */
}

/* Enable hardware acceleration */
.animated-element {
  will-change: transform, opacity;
}

/* Don't overuse will-change */
.animated-element.is-animating {
  will-change: transform;
}
.animated-element:not(.is-animating) {
  will-change: auto;
}
```

### 2. Reduce Motion Support
```css
/* Always respect user preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .plant-idle {
    animation: none;
  }
}
```

### 3. Lazy Load Illustrations
```javascript
// Use Intersection Observer for off-screen plants
const observerOptions = {
  root: null,
  rootMargin: '50px',
  threshold: 0.1
};

const plantObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Start animations only when visible
      entry.target.style.animationPlayState = 'running';
    } else {
      // Pause animations when off-screen
      entry.target.style.animationPlayState = 'paused';
    }
  });
}, observerOptions);

document.querySelectorAll('.plant').forEach(plant => {
  plantObserver.observe(plant);
});
```

---

## Responsive Breakpoints

```css
/* Mobile-first approach */

/* Base: Mobile (375px+) */
.friend-card {
  width: 100%;
  padding: var(--space-m);
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .friend-card {
    width: calc(50% - var(--space-m));
  }

  .garden-layout {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-l);
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .friend-card {
    width: calc(33.333% - var(--space-l));
  }

  .garden-layout {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-xl);
  }
}

/* Wide (1440px+) */
@media (min-width: 1440px) {
  .garden-layout {
    grid-template-columns: repeat(4, 1fr);
    max-width: 1600px;
    margin: 0 auto;
  }
}
```

---

## Accessibility Checklist

- [ ] All interactive elements have focus states
- [ ] Focus indicators use `outline` or `box-shadow`, not just color
- [ ] Color is never the only indicator (use icons + text)
- [ ] All text meets WCAG AA contrast ratio (4.5:1 for body, 3:1 for large)
- [ ] Animations respect `prefers-reduced-motion`
- [ ] All images/illustrations have alt text
- [ ] Keyboard navigation works for all interactions
- [ ] Screen reader announces state changes (use ARIA live regions)
- [ ] Touch targets are at least 44×44px
- [ ] Form inputs have associated labels

### Example: Accessible Button
```jsx
<button
  className="water-button"
  onClick={handleWater}
  aria-label={`Water ${friendName}'s plant`}
  disabled={isWatering}
>
  <span aria-hidden="true">💧</span>
  Water this friendship
</button>
```

---

## Testing the Cozy-Game Feel

### User Testing Questions
1. "Does this feel like a cozy game to you?"
2. "Do the animations feel satisfying or annoying?"
3. "Is the color palette inviting or overwhelming?"
4. "Do you want to keep checking back on your garden?"
5. "Does the plant metaphor make sense?"

### A/B Test Ideas
- **Animation speed:** 300ms vs 500ms vs 800ms
- **Plant style:** More realistic vs more stylized
- **Color saturation:** Current palette vs +20% saturation
- **Interaction feedback:** Sound on/off default

### Metrics to Track
- Time spent in app per session (should increase with cozy feel)
- Return rate within 24 hours (cozy games have high retention)
- Customization engagement (% of users who change themes/pots)
- Completion rate of friend interactions (should feel rewarding, not chore-like)

---

## Common Pitfalls to Avoid

1. **Too much animation** — Not everything needs to move. Prioritize:
   - Primary interactions (watering, adding friend)
   - Idle states (gentle sway)
   - Achievements (celebration)
   - Skip: unnecessary page transitions, excessive micro-interactions

2. **Inconsistent timing** — Use design tokens. Don't hardcode animation durations.

3. **Forgetting reduced motion** — 20% of users have motion sensitivity.

4. **Over-customization** — Too many options = decision paralysis. Start with 3-4 garden themes.

5. **Losing the metaphor** — Everything should reinforce "tending a garden." Avoid generic gamification (points, levels) that break the theme.

---

## Next Steps for Dev Team

### Phase 1: Foundation (Week 1-2)
1. Set up design tokens CSS
2. Implement typography system
3. Build base card component
4. Create 3 basic plant SVG illustrations (succulent, flower, herb)

### Phase 2: Core Interactions (Week 3-4)
1. Watering animation sequence
2. Plant idle sway animation
3. Card hover/tap interactions
4. Health status visual states

### Phase 3: Progression (Week 5-6)
1. 5-stage plant growth system
2. Achievement toast notifications
3. Garden layout with shelf progression
4. Weekly streak visual counter

### Phase 4: Customization (Week 7-8)
1. Garden theme switching
2. Pot customization options
3. Plant type selection within categories
4. Seasonal palette shifts

---

## Resources

### Design Inspiration
- **Stardew Valley UI** — Study crop sprites, inventory UI, season transitions
- **Animal Crossing UI** — Rounded corners, friendly typography, item interactions
- **Cozy Grove** — Color palette, soft animations, achievement notifications

### SVG Illustration Tools
- **Figma** — Best for creating modular plant components
- **SVGator** — For animating SVG paths (leaf rustle, flower bloom)
- **SVGOMG** — Optimize SVG file size before using

### Animation Libraries (if needed)
- **Framer Motion** (React) — Declarative animations, spring physics
- **GSAP** — Complex animation sequences (watering action)
- **Anime.js** — Lightweight, works with vanilla JS

### Color Tools
- **Coolors.co** — Palette generation
- **Accessible Colors** — Test contrast ratios
- **Color Hunt** — Cozy game color palette inspiration

---

## FAQ

**Q: Can I use Lottie animations instead of CSS?**
A: Yes, for complex sequences (watering, level-up), Lottie is great. But use CSS for simple stuff (hover, sway) to avoid library overhead.

**Q: Should plants have faces?**
A: No. Cozy games like Stardew Valley don't anthropomorphize crops. Personality comes from posture, color, animation — not eyes.

**Q: What if a user has 100+ friends? Will the garden get overwhelming?**
A: Implement:
- Pagination/infinite scroll
- Filter by status (thriving, needs attention)
- Search
- "Focus view" showing only top 10 priority friends

**Q: How do I handle dark mode?**
A: Cozy games typically don't have dark mode — they use warm lighting instead. Consider:
- "Evening mode" — warmer tones, softer shadows, amber lighting
- NOT high-contrast black background
- Keep the greenhouse metaphor (dim the lights, don't turn them off)

**Q: Should I add haptic feedback on mobile?**
A: YES. Watering a plant should have a gentle haptic pulse. Button taps should have light feedback. But keep it subtle — cozy, not aggressive.

---

End of Implementation Guide
