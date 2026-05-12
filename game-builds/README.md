# Neon Stickman: Stick War - Game Builds (Latest Version)

These are the **latest builds** with ALL bug fixes applied.

| File | Size | Description |
|------|------|-------------|
| `NeonStickWar-release.apk` | ~15 MB | ✅ Android APK — Install on any Android device |
| `NeonStickWar-release.aab` | ~15 MB | ✅ Android App Bundle — Upload to Google Play Console |
| `NeonStickWar-mobile-publish.zip` | ~13 MB | Publish bundle with APK + AAB + keystore |

## ✅ What's Fixed in This Build

- ✅ Auto-movement bug fixed (ghost inputs reset on background/blur)
- ✅ Auto-shooting bug fixed (stuck shoot state auto-released)
- ✅ Joystick touch handling fixed (jump state properly reset)
- ✅ Performance optimized (particle limits, shadow blur reduction)
- ✅ Memory leak prevention (entity cleanup, level transition cleanup)
- ✅ Delta time clamping (no physics explosions)
- ✅ NaN/Infinity position guards
- ✅ Mobile CSS optimizations (GPU acceleration, no scroll glitches)
- ✅ AdMob configured for REAL ads (isTesting: false)
- ✅ All 30+ bug patches included

## 💰 Ad Configuration

| Ad Type | Ad Unit ID | Status |
|---------|-----------|--------|
| Banner | ca-app-pub-6439599735010649/7774805003 | Real ads |
| Interstitial | ca-app-pub-6439599735010649/8990244364 | Real ads |
| Rewarded | ca-app-pub-64395997350150649/4027131683 | Real ads |

- `isTesting: false` — Real ads mode
- AdMob requires app to be published on Play Store for real ads to serve

## 📦 How to Deploy

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new release
3. Upload `NeonStickWar-release.aab`
4. Fill in store listing details
5. Submit for review

## 🔑 Signing Key

- Keystore: `release-keystore.jks` (inside the zip)
- Alias: `neonstickwar`
- Password: see `keystore.properties` (inside the zip)

⚠️ **Keep the keystore safe!** Lost keystore = can't update your app on Play Store.
