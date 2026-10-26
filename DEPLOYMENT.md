# Deployment Guide

How to build and publish Pebble Pal for every platform.

---

## Table of Contents
- [Desktop — Windows](#desktop--windows)
- [Desktop — macOS](#desktop--macos)
- [Desktop — Linux](#desktop--linux)
- [iOS — App Store](#ios--app-store)
- [Android — Google Play](#android--google-play)

---

## Desktop — Windows++++++++++                                                                                                                                                                                   

### Build
```bash
npm run build:win
```

### Output
```
dist/
├── Pebble Pal Setup 1.0.0.exe    # NSIS installer
└── Pebble Pal 1.0.0.exe          # Portable executable
```

### Distribution Options
- **Direct download** — Host the `.exe` files on your website
- **Microsoft Store** — Requires MSIX packaging and a Microsoft Partner Center account ($19 one-time)

### Code Signing (optional but recommended)
Without signing, Windows SmartScreen will warn users. To sign:
1. Obtain a code signing certificate (DigiCert, Sectigo, etc. ~$200-400/year)
2. Add to `package.json` build config:
```json
"win": {
  "certificateFile": "path/to/cert.pfx",
  "certificatePassword": "password"
}
```

---

## Desktop — macOS

### Build
```bash
npm run build:mac
```
> **Note**: macOS builds can only be created on a Mac.

### Output
```
dist/
└── Pebble Pal-1.0.0.dmg          # Disk image installer
```

### Code Signing & Notarization (required for distribution)
1. **Apple Developer account** required ($99/year)
2. Sign the app:
```json
"mac": {
  "identity": "Developer ID Application: Your Name (TEAMID)",
  "hardenedRuntime": true
}
```
3. Notarize with Apple:
```bash
xcrun notarytool submit "dist/Pebble Pal-1.0.0.dmg" \
  --apple-id "your@email.com" \
  --password "app-specific-password" \
  --team-id "TEAMID" \
  --wait
```

---

## Desktop — Linux

### Build
```bash
npm run build:linux
```

### Output
```
dist/
├── Pebble Pal-1.0.0.AppImage     # Universal portable app
└── pebble-pal_1.0.0_amd64.deb   # Debian/Ubuntu package
```

### Distribution Options
- **AppImage** — Universal, works on any distro. Users download and `chmod +x` to run.
- **.deb** — Install with `sudo dpkg -i pet-rock_1.0.0_amd64.deb`
- **Snap Store** — Requires snapcraft.yaml and Snap Store account (free)
- **Flathub** — Requires Flatpak manifest and Flathub submission

---

## iOS — App Store

### Prerequisites
- Mac with **Xcode 15+** installed
- **Apple Developer Program** membership ($99/year) at [developer.apple.com](https://developer.apple.com)
- Physical iPhone for testing (optional — simulator works for basic testing)

### Step 1: Prepare the Build
```bash
# On your Mac, in the project directory:
npm install
npm run ios:sync
npm run ios:open       # Opens Xcode
```

### Step 2: Configure Signing in Xcode
1. Select the **App** target in the project navigator
2. Go to **Signing & Capabilities** tab
3. Check **Automatically manage signing**
4. Select your **Team** (your Apple Developer account)
5. Xcode will auto-create provisioning profiles

### Step 3: Configure App Settings
In Xcode, under **General**:
| Setting | Value |
|---------|-------|
| Display Name | Pebble Pal |
| Bundle Identifier | com.pebblepal.app |
| Version | 1.0.0 |
| Build | 1 |
| Deployment Target | iOS 15.0 |
| Device Orientation | Portrait only |

### Step 4: Create App Store Listing
Go to [App Store Connect](https://appstoreconnect.apple.com):

1. **My Apps** → **+** → **New App**
2. Fill in required fields:

| Field | Value |
|-------|-------|
| Name | Pebble Pal |
| Primary Language | English (U.S.) |
| Bundle ID | com.pebblepal.app |
| SKU | pebblepal001 |
| User Access | Full Access |

3. **App Information**:
   - Category: Games → Casual
   - Content Rights: Does not contain third-party content
   - Age Rating: 4+ (no objectionable content)

4. **Pricing and Availability**:
   - Price: Free (or your chosen price)
   - Available in all territories

5. **App Privacy**:
   - Data Collection: **No data collected** (localStorage is on-device only)

6. **Screenshots** (required):
   - 6.9" display (iPhone 16/17 Pro Max): 1320 × 2868 px — minimum 2 screenshots
   - 6.5" display (iPhone 11 Pro Max): 1242 × 2688 px — minimum 2 screenshots
   - 13" iPad (required — the target ships as a universal app, `TARGETED_DEVICE_FAMILY = "1,2"`): 2064 × 2752 px — minimum 2 screenshots
   - Take screenshots using the Xcode Simulator → File → New Screen Shot

7. **Description**:
```
Adopt your very own pet rock! 🪨

Feed it minerals, play mini-games, dress it up with hats and accessories,
and watch it grow through 50 levels of customization.

Features:
• 15 unique rock skins to unlock
• 19 hand-drawn accessories (hats, glasses, mustache & more)
• 13 scenic backgrounds (space, underwater, volcano & more)
• 9 eye styles to personalize your rock's look
• 12 different mineral foods to feed your rock
• 37 achievements and 21 stickers to collect
• 5 mini-games: Rock Paper Scissors, Stone Skip, Gem Match, Earthquake Survival, Rock Stack
• Daily challenges, visit streaks and seasonal events
• Rock journal + shareable rock card
• Auto-save — your rock is always waiting for you

The perfect low-maintenance virtual pet. Because everyone deserves a rock.
```

8. **Keywords**:
```
pet rock, virtual pet, tamagotchi, casual game, rock paper scissors, idle pet, mini games, virtual companion
```

### Step 5: Archive & Upload
In Xcode:
1. Set target device to **Any iOS Device (arm64)** (not a simulator)
2. **Product** → **Archive**
3. When complete, the **Organizer** window opens
4. Click **Distribute App** → **App Store Connect** → **Upload**
5. Keep the default options (symbol upload); bitcode is deprecated and no longer offered
6. Click **Upload**

### Step 6: Submit for Review
1. Back in App Store Connect, wait ~15 minutes for the build to process
2. Go to your app → **App Store** tab → select the build
3. Complete any remaining required fields
4. Click **Submit for Review**

### Review Timeline
- Typical review: **24–48 hours**
- First app may take up to 1 week
- Common rejection reasons: crashes, placeholder content, missing privacy policy

---

## Android — Google Play

### Prerequisites
- **Android Studio** installed (any OS — Linux, macOS, or Windows)
- **JDK 17+** installed
- **Google Play Developer account** ($25 one-time) at [play.google.com/console](https://play.google.com/console)

### Step 1: Prepare the Build
```bash
npm install
npm run android:sync   # copies www/ and wires the Capacitor plugins into the Gradle project
```
> **Required**: the generated files `android/capacitor.settings.gradle` and
> `android/app/capacitor.build.gradle` must list `:capacitor-haptics` (and any other
> plugin) before Gradle will build — run `android:sync` after every dependency change.

### Step 2: Create Signing Key
Google Play requires signed apps. Generate a keystore:

```bash
keytool -genkey -v \
  -keystore pebble-pal-release.keystore \
  -alias pebblepal \
  -keyalg RSA -keysize 2048 \
  -validity 10000 \
  -storepass YOUR_SECURE_PASSWORD \
  -keypass YOUR_SECURE_PASSWORD \
  -dname "CN=James, O=Pebble Pal, L=City, ST=State, C=US"
```

> ⚠️ **CRITICAL**: Back up this keystore file and remember the password! You need it for every future update. Losing it means you can never update the app on Google Play.

### Step 3: Configure Signing
`android/app/build.gradle` already reads a `keystore.properties` file (which is
git-ignored). Copy the template and fill in your values:

```bash
cp android/keystore.properties.template android/keystore.properties
# then edit storeFile / storePassword / keyAlias / keyPassword
```

> **Never commit** `keystore.properties` or the `.jks` file — both are already in `.gitignore`.

### Step 4: Build the Release Bundle
```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

To build an APK instead:
```bash
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

### Step 5: Create Google Play Listing
Go to [Google Play Console](https://play.google.com/console):

1. **Create app**:

| Field | Value |
|-------|-------|
| App name | Pebble Pal |
| Default language | English (US) |
| App or game | Game |
| Free or paid | Free |

2. **Store listing** (Grow → Store presence → Main store listing):
   - Short description (80 chars): `Adopt a virtual pebble pal! Feed, play, dress up & level up your rock! 🪨`
   - Full description: (same as iOS description above)
   - **App icon**: 512 × 512 PNG (`icons/icon.png` is already 512 × 512)
   - **Feature graphic**: 1024 × 500 PNG (not in the repo — create a promotional banner)
   - **Screenshots**: minimum 2 phone screenshots (1080 × 1920 or similar)
   - Category: **Game → Casual**
   - Tags: Virtual pet, Rock Paper Scissors

3. **Content rating** (Policy → App content):
   - Complete the IARC questionnaire
   - No violence, no user interaction, no data collection → Rating: Everyone

4. **Privacy policy**:
   - Provide a URL to your privacy policy
   - Simple statement: "Pebble Pal does not collect, store, or transmit any personal data. All game data is stored locally on your device."

5. **Data safety** (Policy → App content → Data safety):
   - Does not collect or share user data
   - No user data collected: ✅
   - Data encrypted in transit: N/A (no network requests)
   - Data deletion mechanism: Uninstalling the app removes all data

6. **Target audience and content**:
   - Target age group: All ages
   - Appeals to children: No (unless you want to comply with additional COPPA requirements)

7. **Ads declaration**: App does not contain ads

### Step 6: Upload & Release

#### Option A: Internal Testing (recommended for first release)
1. Go to **Testing** → **Internal testing** → **Create new release**
2. Opt in to **Google Play App Signing** (recommended)
3. Upload your `.aab` file
4. Add release notes: "Initial release — adopt your virtual pebble pal!"
5. **Review and start rollout**
6. Add testers by email (up to 100)
7. Available immediately — no review wait

#### Option B: Production Release
1. Go to **Production** → **Create new release**
2. Upload `.aab` file
3. Add release notes
4. **Review and start rollout**
5. Google review takes **a few hours to 7 days** (first-time apps may take longer)

### Step 7: Post-Release Updates
For future updates:
```bash
# 1. Bump the version: android/app/build.gradle (versionCode + versionName) and
#    ios/App/App.xcodeproj MARKETING_VERSION / CURRENT_PROJECT_VERSION
# 2. Rebuild
npm run android:sync
cd android && ./gradlew bundleRelease

# 3. Upload new .aab to Google Play Console with incremented version code
```

---

## Privacy Policy Template

Both stores require a hosted URL (not a file in the repo). The text lives in
[PRIVACY.md](./PRIVACY.md) — fill in the contact address, publish it (GitHub Pages
works well) and paste the URL into App Store Connect and the Play Console.

---

## Quick Reference: Store Requirements Checklist

### Apple App Store
- [ ] Apple Developer account ($99/year)
- [ ] Mac with Xcode
- [ ] App icon (1024 × 1024, **opaque 8-bit RGB — no alpha channel**, or validation fails)
- [ ] Screenshots: 6.9" and 6.5" iPhone **plus 13" iPad** (minimum 2 each)
- [ ] Description, keywords, category
- [ ] Privacy policy URL
- [ ] Age rating (4+)
- [ ] Signed & archived build uploaded via Xcode

### Google Play Store
- [ ] Google Play Developer account ($25 one-time)
- [ ] Android Studio + JDK 17+
- [ ] Signed release `.aab` bundle
- [ ] App icon (512 × 512)
- [ ] Feature graphic (1024 × 500)
- [ ] Screenshots: phone (minimum 2)
- [ ] Short description (80 chars) + full description
- [ ] Privacy policy URL
- [ ] Content rating (IARC questionnaire)
- [ ] Data safety declaration
- [ ] Target audience selected
