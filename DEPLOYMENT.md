# Deployment Guide

How to build and publish Pet Rock for every platform.

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
├── Pet Rock Setup 1.0.0.exe    # NSIS installer
└── Pet Rock 1.0.0.exe          # Portable executable
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
└── Pet Rock-1.0.0.dmg          # Disk image installer
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
xcrun notarytool submit "dist/Pet Rock-1.0.0.dmg" \
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
├── Pet Rock-1.0.0.AppImage     # Universal portable app
└── pet-rock_1.0.0_amd64.deb   # Debian/Ubuntu package
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
| Display Name | Pet Rock |
| Bundle Identifier | com.petrock.app |
| Version | 1.0.0 |
| Build | 1 |
| Deployment Target | iOS 16.0 |
| Device Orientation | Portrait only |

### Step 4: Create App Store Listing
Go to [App Store Connect](https://appstoreconnect.apple.com):

1. **My Apps** → **+** → **New App**
2. Fill in required fields:

| Field | Value |
|-------|-------|
| Name | Pet Rock |
| Primary Language | English (U.S.) |
| Bundle ID | com.petrock.app |
| SKU | petrock001 |
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
   - 6.7" display (iPhone 15 Pro Max): 1290 × 2796 px — minimum 2 screenshots
   - 5.5" display (iPhone 8 Plus): 1242 × 2208 px — minimum 2 screenshots
   - Take screenshots using Xcode Simulator → File → Screenshot

7. **Description**:
```
Adopt your very own pet rock! 🪨

Feed it minerals, play Rock Paper Scissors, dress it up with hats and accessories, 
and watch it grow through 25 levels of customization.

Features:
• 10 unique rock skins to unlock
• 13 hand-drawn accessories (hats, glasses, mustache & more)
• 8 scenic backgrounds (space, underwater, volcano & more)  
• 6 eye styles to personalize your rock's look
• 8 different mineral foods to feed your rock
• 20 achievements to earn
• Rock Paper Scissors mini-game
• Auto-save — your rock is always waiting for you

The perfect low-maintenance virtual pet. Because everyone deserves a rock.
```

8. **Keywords**:
```
pet rock, virtual pet, tamagotchi, casual game, rock paper scissors, pet game
```

### Step 5: Archive & Upload
In Xcode:
1. Set target device to **Any iOS Device (arm64)** (not a simulator)
2. **Product** → **Archive**
3. When complete, the **Organizer** window opens
4. Click **Distribute App** → **App Store Connect** → **Upload**
5. Keep default options (bitcode, symbol upload)
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
npm run android:sync
```

### Step 2: Create Signing Key
Google Play requires signed apps. Generate a keystore:

```bash
keytool -genkey -v \
  -keystore petrock-release.keystore \
  -alias petrock \
  -keyalg RSA -keysize 2048 \
  -validity 10000 \
  -storepass YOUR_SECURE_PASSWORD \
  -keypass YOUR_SECURE_PASSWORD \
  -dname "CN=James, O=Pet Rock, L=City, ST=State, C=US"
```

> ⚠️ **CRITICAL**: Back up this keystore file and remember the password! You need it for every future update. Losing it means you can never update the app on Google Play.

### Step 3: Configure Signing
Edit `android/app/build.gradle` and add inside the `android { }` block:

```groovy
android {
    signingConfigs {
        release {
            storeFile file('../../petrock-release.keystore')
            storePassword 'YOUR_SECURE_PASSWORD'
            keyAlias 'petrock'
            keyPassword 'YOUR_SECURE_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
        }
    }
}
```

> **Tip**: For better security, use `gradle.properties` or environment variables instead of hardcoding passwords.

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
| App name | Pet Rock |
| Default language | English (US) |
| App or game | Game |
| Free or paid | Free |

2. **Store listing** (Grow → Store presence → Main store listing):
   - Short description (80 chars): `Adopt a virtual pet rock! Feed, play, dress up & level up your rock! 🪨`
   - Full description: (same as iOS description above)
   - **App icon**: 512 × 512 PNG (use `ios-icons/icon-1024.png` resized)
   - **Feature graphic**: 1024 × 500 PNG (create a promotional banner)
   - **Screenshots**: minimum 2 phone screenshots (1080 × 1920 or similar)
   - Category: **Game → Casual**
   - Tags: Virtual pet, Rock Paper Scissors

3. **Content rating** (Policy → App content):
   - Complete the IARC questionnaire
   - No violence, no user interaction, no data collection → Rating: Everyone

4. **Privacy policy**:
   - Provide a URL to your privacy policy
   - Simple statement: "Pet Rock does not collect, store, or transmit any personal data. All game data is stored locally on your device."

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
4. Add release notes: "Initial release — adopt your virtual pet rock!"
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
# 1. Update version in capacitor.config.json and build.gradle
# 2. Rebuild
npm run android:sync
cd android && ./gradlew bundleRelease

# 3. Upload new .aab to Google Play Console with incremented version code
```

---

## Privacy Policy Template

Both stores require a privacy policy. Here's a minimal one:

```
Privacy Policy for Pet Rock

Last updated: [DATE]

Pet Rock is a virtual pet game that runs entirely on your device.

Data Collection: Pet Rock does not collect, transmit, or store any personal 
information. All game data (progress, settings, statistics) is stored locally 
on your device using standard browser storage.

Third-Party Services: Pet Rock does not integrate with any third-party 
analytics, advertising, or tracking services.

Data Deletion: Uninstalling Pet Rock removes all associated data from your 
device. On the desktop version, you can reset data via Game → Reset Rock.

Contact: [YOUR EMAIL]
```

Host this on a simple webpage (GitHub Pages, personal site, etc.) and link it in both store listings.

---

## Quick Reference: Store Requirements Checklist

### Apple App Store
- [ ] Apple Developer account ($99/year)
- [ ] Mac with Xcode
- [ ] App icon (1024 × 1024)
- [ ] Screenshots: 6.7" and 5.5" (minimum 2 each)
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
