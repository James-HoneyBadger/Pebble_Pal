# 🪨 Pebble Pal

A virtual pet stone companion app — feed, play, customize, and level up your very own pebble pal! Built with vanilla HTML/CSS/JS and available as a desktop app (Windows, macOS, Linux) and mobile app (iOS, Android).

![Pebble Pal](icons/icon.png)

## Features

### Core Gameplay
- **5 Stats** — Happiness, Fullness, Energy, Cleanliness, and Bond
- **8 Actions** — Feed, Play, Polish, Sleep, Talk, Pet, Walk, Music
- **Mood System** — Your rock's expression changes based on its stats (Ecstatic → Miserable)
- **Thought Bubbles** — Your rock shares its feelings and idle thoughts
- **Eye Tracking** — Pupils follow your cursor (desktop) and finger (mobile)
- **Daily Challenges** — 3 fresh challenges every day with XP rewards and progress bars
- **Seasonal Events** — Automatic holiday events (Halloween, Winter, Spring, etc.) with stat bonuses
- **Accessibility** — ARIA labels, progressbar roles, live regions, prefers-reduced-motion support
- **Content Security Policy** — CSP meta tag restricts resource loading
- **Auto-save** — Progress saves every 30 seconds and on app close
- **Time-Away Decay** — Stats decrease based on how long you've been away
- **Stat Change Floaters** — Visual "+10 😊" indicators float up when stats change
- **Aging** — Your rock ages over time in day increments

### Mini-Games (5 total)
| Game | Description |
|------|-------------|
| Rock Paper Scissors | Classic RPS — your rock has biased picks |
| Stone Skip | Tap the glowing zone in time to rack up skips |
| Gem Match | Flip card pairs — match all 8 gems as fast as you can |
| Earthquake Survival | Hold perfectly still while your rock trembles |
| Rock Stack | Tap the moving bar in the green zone to stack rocks |

### Customization System
All options are accessed via the **Customize** panel with 4 tabs:

#### Rock Skins (15 total)
| Skin | Unlock |
|------|--------|
| Granite | Start |
| Marble | Start |
| Obsidian | Level 3 |
| Jade | Level 5 |
| Rose Quartz | Level 7 |
| Lava Rock | Level 10 |
| Gold | Level 14 |
| Crystal | Level 18 |
| Void Stone | Level 22 |
| Rainbow | Level 25 |
| Aurora | Level 30 |
| Nebula | Level 35 |
| Ancient Stone | Level 40 |
| Prism | Level 45 |
| Galaxy Stone | Level 50 |

#### Eye Styles (9 total)
| Style | Unlock |
|-------|--------|
| Normal | Start |
| Big | Start |
| Anime | Level 4 |
| Sleepy | Level 6 |
| Cyclops | Level 9 |
| Star | Level 12 |
| Heart | Level 15 |
| Sparkle | Level 20 |
| Diamond | Level 25 |

#### Accessories (18 total, SVG-rendered)
| Accessory | Type | Unlock |
|-----------|------|--------|
| None | — | Start |
| Top Hat | Head | Start |
| Bow | Head | Start |
| Shades | Face | Level 2 |
| Flower | Head | Level 4 |
| Headband | Head | Level 5 |
| Party Hat | Head | Level 6 |
| Monocle | Face | Level 8 |
| Headphones | Head | Level 8 |
| Halo | Head | Level 10 |
| Chef Hat | Head | Level 12 |
| Mustache | Face | Level 15 |
| Wizard Hat | Head | Level 20 |
| Butterfly | Head | Level 25 |
| Scarf | Head | Level 28 |
| Pirate Hat | Head | Level 32 |
| Space Helmet | Head | Level 38 |
| Bowtie | Face | Level 42 |

#### Scene Backgrounds (13 total)
| Scene | Unlock |
|-------|--------|
| Default | Start |
| Park | Level 2 |
| Beach | Level 5 |
| Space | Level 8 |
| Underwater | Level 11 |
| Cozy Room | Level 14 |
| Volcano | Level 18 |
| Snowfield | Level 22 |
| Arctic Tundra | Level 28 |
| Jungle | Level 33 |
| Castle | Level 38 |
| Nebula | Level 43 |
| Dream World | Level 48 |

### Food Variety (12 types)
| Food | Fullness | Happiness | Energy | Unlock |
|------|----------|-----------|--------|--------|
| Pebbles | 15 | 3 | 0 | Start |
| Gravel | 20 | 5 | 0 | Start |
| Quartz Flakes | 12 | 10 | 5 | Start |
| Limestone | 25 | 4 | 0 | Start |
| Geode Slice | 10 | 15 | 10 | Start |
| Lava Cake | 20 | 20 | 5 | Level 6 |
| Diamond Dust | 8 | 25 | 15 | Level 12 |
| Stardust | 15 | 30 | 20 | Level 18 |
| Crystal Shard | 20 | 38 | 28 | Level 25 |
| Moonstone | 25 | 44 | 32 | Level 32 |
| Comet Crumble | 30 | 48 | 38 | Level 40 |
| Void Cookie | 35 | 55 | 45 | Level 48 |

### Daily Challenges
Each day 3 challenges are drawn from a pool of 15, seeded by date for consistency. Completing a challenge awards XP, visual fanfare, and progress toward the Challenger/Challenge Champ stickers. Challenges reset at midnight and track:
- Feed, pet, talk, clean, walk, music counts
- RPS wins, mini-game plays
- Stat thresholds (bond, happiness, fullness, energy)
- Special: feeding high-level food (Crystal Shard+)

### XP & Leveling
- Gain XP from every interaction (1–15 XP depending on action)
- Challenge completions grant bonus XP (15–35 XP per challenge)
- Customization changes grant 1 XP with a 5-second cooldown to prevent farming
- XP threshold increases per level: `30 + level × 20`
- Leveling up triggers an animated overlay with burst particles and unlocks new content

### Achievements (26 total)
| Achievement | Requirement |
|-------------|-------------|
| 🍪 First Bite | Feed for the first time |
| 🪨 Mineral Lover | Feed 10 times |
| ⛏️ Quarry Chef | Feed 50 times |
| 🍽️ Master Chef | Feed 100 times |
| 🤚 First Touch | Pet for the first time |
| 💕 Pet Whisperer | Pet 50 times |
| 💖 Rock Whisperer | Pet 100 times |
| 🎾 Playtime! | Play a game |
| 🎮 Game Master | Play 50 mini-games |
| ✌️ RPS Champ | Win RPS 5 times |
| 🏃 First Steps | Go for a walk |
| 🗺️ Explorer | Walk 20 times |
| 🌍 World Walker | Walk 50 times |
| ✨ Shine Bright | Polish 10 times |
| 🎵 DJ Rock | Play music 10 times |
| 💬 Chatterbox | Talk 20 times |
| ❤️ Best Friends | Reach 50 bond |
| 💖 Soulmates | Max out bond to 100 |
| ⬆️ Rising Star | Reach level 5 |
| 🌟 Veteran | Reach level 10 |
| 👑 Legendary | Reach level 20 |
| 💯 Centurion | 100 total interactions |
| 🎂 One Week | Rock is 7 days old |
| 🏆 One Month | Rock is 30 days old |
| 🗼 Rock Stacker | Play the Rock Stack game |
| 📋 Challenge Fanatic | Complete 7 daily challenges |

### Audio & Visual Effects
- **Web Audio API** — All sound effects synthesized in-browser (no audio files)
- **Ambient Sound** — Two-layer rumble: LFO-modulated bass + bandpass noise
- **Rich SFX** — ADSR-shaped tones with chord progressions for feed, pet, clean, level-up, evolution, win/lose, and mini-games
- **Burst Particles** — Radial emoji bursts on level-up, achievements, challenge completions, and mini-game wins
- **Screen Flash** — Full-screen color flash on significant events
- **Ripple Effect** — Water-ripple animation on rock tap
- **Stat Floaters** — Animated "+N 😊" indicators arc upward after actions
- **Haptic Feedback** — Capacitor Haptics API for mobile vibration

---

## Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ and npm

### Install & Run (Desktop)
```bash
git clone <repo-url>
cd Pebble_Pal
npm install
npm start
```

### Build Desktop Installers
```bash
npm run build:win      # Windows (NSIS + portable)
npm run build:mac      # macOS (DMG)
npm run build:linux    # Linux (AppImage + .deb)
npm run build:all      # All platforms
```
Build output goes to the `dist/` directory.

---

## Mobile Builds

### iOS
Requires a Mac with Xcode and an Apple Developer account ($99/year).

```bash
npm run ios:sync       # Sync web assets to iOS project
npm run ios:open       # Open in Xcode
```
Then in Xcode: set your Team, select a device, and run.

See [DEPLOYMENT.md](DEPLOYMENT.md) for App Store submission steps.

### Android
Requires Android Studio and the Android SDK.

```bash
npm run android:sync   # Sync web assets to Android project
npm run android:open   # Open in Android Studio
```
Or build from the command line:
```bash
cd android && ./gradlew assembleDebug
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for Google Play submission steps.

---

## Project Structure

```
Pebble_Pal/
├── index.html              # Main game HTML (desktop + source of truth)
├── style.css               # All styling, animations, responsive layout
├── game.js                 # Game logic, state, interactions (~2357 lines)
├── main.js                 # Electron main process
├── preload.js              # Electron preload (context bridge)
├── package.json            # Dependencies, scripts, build config
├── capacitor.config.json   # Capacitor (mobile) configuration
├── icons/                  # App icon assets
├── www/                    # Web assets copied for Capacitor (always keep in sync)
│   ├── index.html
│   ├── style.css
│   └── game.js
├── ios/                    # Xcode project (Capacitor-generated)
│   └── App/
├── android/                # Android Studio project (Capacitor-generated)
│   └── app/
└── node_modules/
```

> **Important:** After editing any of `index.html`, `style.css`, or `game.js`, sync to `www/`:
> ```bash
> cp game.js www/game.js && cp index.html www/index.html && cp style.css www/style.css
> ```

---

## NPM Scripts Reference

| Script | Description |
|--------|-------------|
| `npm start` | Run desktop app via Electron |
| `npm run build` | Build desktop installer for current platform |
| `npm run build:win` | Build Windows installer (NSIS + portable) |
| `npm run build:mac` | Build macOS installer (DMG) |
| `npm run build:linux` | Build Linux installer (AppImage + .deb) |
| `npm run build:all` | Build for all desktop platforms |
| `npm run copy:web` | Copy web files to `www/` for mobile |
| `npm run ios:sync` | Copy + sync to iOS project |
| `npm run ios:open` | Open iOS project in Xcode |
| `npm run ios:run` | Sync + run on iOS device/simulator |
| `npm run android:sync` | Copy + sync to Android project |
| `npm run android:open` | Open Android project in Android Studio |
| `npm run android:run` | Sync + run on Android device/emulator |

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Game UI | Vanilla HTML5, CSS3, JavaScript (ES2020) |
| Desktop App | Electron 40+ |
| Desktop Builds | electron-builder 26+ |
| Mobile Wrapper | Capacitor 8+ |
| Audio | Web Audio API (synthesized, no audio files) |
| Icons | Hand-crafted SVG (accessories + app icon) |
| Persistence | localStorage (auto-save every 30s) |
| Animations | CSS keyframes + JS DOM manipulation |

---

## License

MIT — do whatever you want with your pebble pal. 🪨
