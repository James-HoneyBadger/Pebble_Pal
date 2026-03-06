# Development Guide

Technical reference for developing and extending Pet Rock.

---

## Architecture Overview

Pet Rock is a **single-page web app** wrapped in platform-specific shells:

```
┌──────────────────────────────────────────────────┐
│                    game.js                        │  Game logic, state machine
│                   style.css                       │  Visual styling, animations
│                  index.html                       │  DOM structure
├──────────────────────────────────────────────────┤
│  Electron (main.js + preload.js)                 │  Desktop wrapper
│  Capacitor (ios/ + android/)                     │  Mobile wrappers
└──────────────────────────────────────────────────┘
```

The game logic is **100% vanilla JS** with no frameworks or build tools. The same HTML/CSS/JS runs everywhere — only the wrapper and viewport config differ.

---

## File Reference

### `index.html` (197 lines)
Main game structure. Key sections:
- **Header** — Name display, rename button (with `aria-label`), age, level, XP bar
- **Left panel** — Stats bars (5 stats with `role="progressbar"` and `aria-valuenow`) + achievement trophy grid
- **Center** — Rock stage with environment layer, rock body, face, accessories, thought bubble (`aria-live="polite"`), particles
- **Right panel** — Action buttons (8 actions), food picker, and customize panel (4 tabs with `role="tablist"`: Skin/Eyes/Hats/Scene)
- **Message log** — Scrollable event log at bottom (`role="log"`, `aria-live="polite"`)
- **Modals** — RPS mini-game modal, achievement toast (`role="alert"`), level-up overlay
- **Security** — Content Security Policy meta tag, `viewport-fit=cover`

### `style.css` (418 lines)
All visuals and animations. Key sections:
- **Layout** — 3-column CSS Grid (`210px | 1fr | 240px`), responsive breakpoint at 600px → single-column
- **Rock rendering** — Radial gradients using CSS custom properties (`--rock-color`, `--rock-highlight`, `--rock-shadow`)
- **Face system** — `.eye`, `.pupil`, `#mouth` with state classes (`.face-happy`, `.face-sad`, `.face-sleeping`, `.face-excited`, `.face-love`)
- **Eye styles** — `.eyes-big`, `.eyes-anime`, `.eyes-sleepy`, `.eyes-cyclops`, `.eyes-star` modify eye/pupil dimensions
- **Accessories** — Absolutely positioned SVG containers (`#accessory-display` for head, `#face-accessory` for face items) with per-item positioning classes
- **Environments** — Background gradients + pseudo-element decorations on `#env-layer`; JS-spawned particles for stars, bubbles, snowflakes
- **Animations** — `bounce`, `wiggle`, `spin`, `jelly`, `float`, `sleep-bob`, `dance`, `walk-bob`, particle float, Zzz, sparkle, music note, stat floaters
- **Stat floaters** — `.stat-floater` with `floater-up` keyframe animation for "+10 😊" text
- **Mobile responsive** — `@media(max-width:600px)` stacks layout, shrinks rock, compacts buttons into 4-column grid, reduces font sizes
- **Reduced motion** — `@media(prefers-reduced-motion:reduce)` disables all animations and transitions

### `game.js` (1069 lines)
All game logic in an IIFE. Key sections:

| Section | Lines | Description |
|---------|-------|-------------|
| State object | 8–38 | All mutable game state (stats, unlocks, counters, timestamps) |
| DOM cache | 43–70 | Query selectors cached at startup |
| Data: Skins | 76–87 | 10 rock skins with color definitions |
| Data: Eye Styles | 90–97 | 6 eye style CSS class mappings |
| Data: Accessories | 100–128 | 13 accessories with inline SVG markup |
| Data: Backgrounds | 131–140 | 8 environment backgrounds |
| Data: Foods | 143–152 | 8 food types with stat effects |
| Data: Achievements | 155–176 | 20 achievement definitions with check functions |
| Data: Dialogue | 178–222 | Categorized dialogue banks (feed, play, clean, etc.) |
| Helpers | 226–230 | `clamp()`, `pick()`, `ts()`, `esc()` (XSS sanitizer) |
| XP & Leveling | 232–260 | `addXP()`, `updateXPBar()`, `showLevelUp()`, `grantCustomizeXP()` |
| Unlock checks | 262–330 | Scans all data tables for newly unlockable content |
| Achievements | 333–370 | Check, toast notification, optimized trophy grid rendering |
| UI updates | 372–445 | `updateStats()` (with ARIA updates), `updateMood()`, `updateFace()`, `updateSkin()`, `updateAccessory()`, `updateBackground()` |
| Environment FX | 438–490 | Interval-tracked `spawnBubbles()`, `spawnSnowflakes()`, `clearBgIntervals()` |
| Picker rendering | 492–598 | Dynamic button generation for all customization tabs + food |
| Thought bubbles | 600–606 | Show/hide with timeout |
| Rock animations | 608–610 | Add/remove CSS animation classes |
| Particles + Floaters | 612–660 | Emoji particles, stat change floaters, sleep Zzz, sparkles, music notes |
| Eye tracking | 668–686 | Mouse + touch pupil movement with div/zero guard |
| Cooldown system | 688–693 | Disable action buttons temporarily |
| Feed action | 695–720 | Applies food stats, spawns particles + floaters, logs |
| Actions object | 722–820 | All 8 action handlers (feed, play, clean, sleep, talk, pet, exercise, music) |
| RPS mini-game | 822–856 | Rock Paper Scissors with balanced outcomes |
| Stat decay | 858–870 | Stats decrease over time (5s interval) |
| Idle thoughts | 872–888 | Random thought bubbles (15s interval, context-aware) |
| Age system | 890–900 | Age increments (every 12 ticks = ~60s) |
| Critical warnings | 902–908 | Low-stat warnings in message log |
| Rock click | 910–924 | Random reactions on clicking the rock |
| Event binding | 926–970 | All DOM event listeners (buttons, tabs, RPS, rename, touch) |
| Save/Load | 972–1005 | localStorage persistence with time-away decay + cooldown reset |
| Init | 1007–1040 | Load → setup → render → start intervals |

### `main.js` (172 lines)
Electron main process:
- **Window config** — 1150×780, min 800×600, dark background, sandboxed
- **App menu** — Game (Reset Rock, Quit), View (Reload, DevTools, Zoom, Fullscreen), Help (How to Play, About)
- **Security** — Context isolation, no node integration, external links open in browser

### `preload.js` (15 lines)
Exposes `window.petRock.platform` and `window.petRock.version` via context bridge.

### `capacitor.config.json`
Mobile configuration:
- Bundle ID: `com.petrock.app`
- Web directory: `www/`
- iOS: automatic content inset, dark background
- Android: HTTPS scheme

---

## State Management

All state lives in a single `state` object and is persisted to `localStorage` as JSON. Save key: `petRockState2`.

### Key State Properties
- `lastSaved` — timestamp used for time-away stat decay on reload
- `lastCustomizeXP` — timestamp throttling customization XP to once per 5 seconds
- `actionCooldown` — runtime flag, reset to `false` on load to prevent stale persistence

### Time-Away Decay
When the game loads, it compares `Date.now()` with `state.lastSaved`. If more than ~6 minutes have passed, stats decay by up to 40 points proportional to hours away (3 per hour for happiness, 3.6 for fullness, 1.5 for energy, 2.4 for cleanliness).

### Stat Decay Rates (per 5s tick)
| Stat | Awake Decay | Sleeping |
|------|-------------|----------|
| Happiness | −0.8 | — |
| Fullness | −0.5 | −0.3 |
| Energy | −0.4 | +2.0 (recovery) |
| Cleanliness | −0.3 | — |

### XP Awards
| Action | XP |
|--------|----|
| Click rock | 1 |
| Change skin/eyes/accessory/scene | 1 (5s cooldown) |
| Talk | 3 |
| Sleep | 3 |
| Rename | 3 |
| Pet | 4 |
| Polish | 4 |
| Music | 4 |
| Feed | 5 + happiness/5 |
| Walk | 6 |
| RPS game | 6 |
| Achievement unlocked | 15 |
| Age tick (daily) | 2 |

---

## Adding New Content

### Adding a New Skin
In `game.js`, add to the `SKINS` object:
```javascript
myskin: { label: "My Skin", color: "#hex", hi: "#hex", sh: "#hex", unlock: { level: N } },
```

### Adding a New Accessory
1. Add to the `ACCESSORIES` object in `game.js` with inline SVG:
```javascript
myacc: { label: "My Acc", target: "head", unlock: { level: N },
  svg: `<svg viewBox="0 0 W H" width="W" height="H">...</svg>` },
```
2. Add CSS positioning in `style.css`:
```css
#accessory-display.acc-myacc { top: -Npx; left: 50%; transform: translateX(-50%); }
```

### Adding a New Achievement
Add to the `ACHIEVEMENTS` array:
```javascript
{ id: "my_ach", icon: "🏅", name: "My Achievement", desc: "Do the thing", check: () => state.someCounter >= N },
```

### Adding a New Background
1. Add to `BACKGROUNDS` object in `game.js`
2. Add CSS environment styles in `style.css` (gradient on `#env-layer`, decorative pseudo-elements)
3. Optionally add JS particle spawner in `game.js`

### Adding a New Food
Add to the `FOODS` object:
```javascript
myfood: { label: "🍕 My Food", fullness: N, happiness: N, energy: N, msg: "Yum!", unlock: { level: N } },
```

---

## Mobile Differences (`www/` files)

The `www/` directory is synced from root files via `npm run copy:web`. Both root and `www/` now share the same codebase — mobile-specific features (custom rename dialog, touch events, visibility save, viewport-fit, safe areas) are included in the root files.

### Key Mobile-Ready Features (in root files)
- `viewport-fit=cover` for iOS safe areas
- Content Security Policy meta tag
- Custom rename dialog (replaces `prompt()` which doesn't work in Capacitor’s WKWebView)
- `visibilitychange` + `pause`/`resume` listeners for auto-save when app backgrounds
- Touch events: `touchstart` on rock, `touchmove` for eye tracking
- `prefers-reduced-motion` media query for accessibility
- ARIA attributes on stat bars, message log, thought bubble, and achievement toast

---

## Workflow: Making Changes

1. **Edit the root files** (`index.html`, `style.css`, `game.js`)
2. **Test on desktop**: `npm start`
3. **Sync to mobile**: `npm run copy:web` (copies root files to `www/`)
4. **Sync to platforms**: `npx cap sync`
5. **Test on mobile**: Open in Xcode / Android Studio

> **Note**: Root and `www/` files are now identical. No manual mobile patches are needed.

---

## Debugging

### Desktop (Electron)
- **View → Toggle DevTools** in the app menu (or `Ctrl+Shift+I`)
- Console, network, and element inspector all available
- **View → Reload** to refresh without restarting

### iOS (Capacitor)
- Run in Xcode on simulator or device
- Open Safari → Develop → [Device] → [Page] for Web Inspector
- Requires "Web Inspector" enabled in iOS Settings → Safari → Advanced

### Android (Capacitor)
- Run in Android Studio on emulator or device
- Open `chrome://inspect` in Chrome on your computer
- Select the WebView to open DevTools

### Common Issues
| Problem | Solution |
|---------|----------|
| Stats not updating visually | Check that `updateStats()` is called after modifying `state.stats` |
| Accessory not showing | Verify CSS positioning class exists for the accessory ID |
| Save not loading | Check `localStorage.getItem("petRockState2")` in console |
| New unlock not appearing | Call `renderPickers()` after modifying unlocked arrays |
| Memory leak from backgrounds | Ensure `clearBgIntervals()` is called before spawning new intervals |
| D-Bus errors on Linux | Benign Electron/portal warnings — safe to ignore |
