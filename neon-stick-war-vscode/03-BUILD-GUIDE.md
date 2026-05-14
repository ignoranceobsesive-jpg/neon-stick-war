# Neon Stick War - Build Guide

Step-by-step instructions for building the Neon Stick War APK and AAB for Android.

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ or Bun | Runtime for Next.js |
| **JDK** | 21 | Android compilation (JDK 17+ required, 21 recommended) |
| **Android SDK** | API 35 | Android build tools |
| **Gradle** | 8.x (bundled) | Android build system |

### JDK Installation

The game requires JDK 21 with `javac` (JRE alone is NOT sufficient). Find your JDK:

```bash
# Check if javac is available
which javac
javac -version

# If not, check for installed JDKs
ls /home/z/.jdks/

# Expected: jdk-21.0.x
```

If JDK is missing, install it:
```bash
# Ubuntu/Debian
sudo apt install openjdk-21-jdk

# Or download from Oracle/Adoptium
```

### Android SDK

Install via Android Studio or command-line tools:
```bash
# Set ANDROID_HOME
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

---

## Quick Build (One Command)

```bash
# From the project root directory
npx cap sync android && cd android && JAVA_HOME=/home/z/.jdks/jdk-21.0.11 ./gradlew assembleRelease && cd ..
```

---

## Detailed Build Steps

### Step 1: Edit the Game Code

If you need to make changes, edit the minified game file:

```bash
# The game file location in the Next.js project
nano public/game/_next/static/chunks/0cf1o-rq41zxz.js
```

Alternatively, edit the copy in this package and copy it back:
```bash
cp source-minified/game-full.js /path/to/project/public/game/_next/static/chunks/0cf1o-rq41zxz.js
```

### Step 2: Test Locally

```bash
# Start the dev server
bun run dev

# Open http://localhost:3000 in a browser
# Test the game thoroughly before building
```

### Step 3: Build the Next.js Static Export

```bash
# Build the Next.js project
bun run build

# The static export goes to public/game/ directory
# Capacitor reads from this directory
```

### Step 4: Sync to Android Project

```bash
# Copy web assets to the Android project
npx cap sync android

# This copies everything from public/game/ to android/app/src/main/assets/public/game/
```

### Step 5: Build Android APK/AAB

```bash
cd android

# Debug APK (faster build, signed with debug key)
JAVA_HOME=/home/z/.jdks/jdk-21.0.11 ./gradlew assembleDebug

# Release APK (signed with release keystore)
JAVA_HOME=/home/z/.jdks/jdk-21.0.11 ./gradlew assembleRelease

# Release AAB (for Google Play Store upload)
JAVA_HOME=/home/z/.jdks/jdk-21.0.11 ./gradlew bundleRelease

cd ..
```

### Step 6: Copy Build Artifacts

```bash
# APK locations after build
cp android/app/build/outputs/apk/debug/app-debug.apk builds/NeonStickWar-debug.apk
cp android/app/build/outputs/apk/release/app-release.apk builds/NeonStickWar-release.apk
cp android/app/build/outputs/bundle/release/app-release.aab builds/NeonStickWar-release.aab
```

---

## Signing Configuration

### Release Keystore

The release keystore is located at:
```
/home/z/my-project/upload/NeonStickWar-extracted/release-keystore.jks
```

### Keystore Properties

| Property | Value |
|---|---|
| **Key Alias** | `neonstickwar` |
| **Key Password** | `NeonStickWar2026!` |
| **Store Password** | `NeonStickWar2026!` |

### Where Signing is Configured

1. **android/app/build.gradle** - Signing config block:
```groovy
signingConfigs {
    release {
        storeFile file('/home/z/my-project/upload/NeonStickWar-extracted/release-keystore.jks')
        storePassword 'NeonStickWar2026!'
        keyAlias 'neonstickwar'
        keyPassword 'NeonStickWar2026!'
    }
}
```

2. **capacitor.config.ts** - Build options:
```typescript
android: {
    buildOptions: {
        keystorePath: '/home/z/my-project/upload/NeonStickWar-extracted/release-keystore.jks',
        keystoreAlias: 'neonstickwar',
        keystorePassword: 'NeonStickWar2026!',
        keystoreAliasPassword: 'NeonStickWar2026!',
        signingType: 'apksigner'
    }
}
```

3. **android-project/signing/keystore.properties** - Properties file:
```
storeFile=release-keystore.jks
storePassword=NeonStickWar2026!
keyAlias=neonstickwar
keyPassword=NeonStickWar2026!
```

> ⚠️ **Security Warning**: These passwords are in plain text. For production, move keystore details to environment variables or a secure secrets manager.

---

## Build Troubleshooting

### "Could not find or load main class com.android.sdklib.tool.sdkmanager.SdkManagerCli"
- Ensure Android SDK is installed and `ANDROID_HOME` is set

### "Execution failed for task ':app:mergeDebugResources'"
- Run `npx cap sync android` before building

### "Keystore file not found"
- Check the keystore path in `build.gradle` matches the actual file location
- Use absolute paths

### "javac: not found" or "Could not target platform"
- Set `JAVA_HOME` to a JDK (not JRE) installation:
```bash
export JAVA_HOME=/home/z/.jdks/jdk-21.0.11
```

### Build is very slow
- Debug builds are faster (~1-2 min)
- Release builds take longer due to ProGuard and signing (~3-5 min)
- First build downloads Gradle wrapper (slow), subsequent builds are faster

### Game shows black screen in APK
- Verify the game chunk file exists in `android/app/src/main/assets/public/game/_next/static/chunks/`
- Check for JavaScript syntax errors with `node --check public/game/_next/static/chunks/0cf1o-rq41zxz.js`

---

## Build Sizes

| Output | Size | Purpose |
|---|---|---|
| Debug APK | ~13 MB | Testing on device |
| Release APK | ~11 MB | Direct distribution |
| Release AAB | ~10 MB | Google Play Store upload |
| Web assets (ZIP) | ~1.2 MB | Web deployment |

---

## Deploying to Google Play Store

1. Build the release AAB:
   ```bash
   JAVA_HOME=/home/z/.jdks/jdk-21.0.11 ./gradlew bundleRelease
   ```

2. The AAB is at: `android/app/build/outputs/bundle/release/app-release.aab`

3. Upload to Google Play Console at https://play.google.com/console

4. Fill in store listing, screenshots, and content rating

5. Roll out to production track
