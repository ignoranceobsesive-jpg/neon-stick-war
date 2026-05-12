Neon Stick War - Mobile Release Build (v3 - Portal + Install Fix)
=================================================================

Files:
- NeonStickWar-release.apk: Signed release APK (6.5MB) - ALL fixes included
- NeonStickWar-release.aab: Signed AAB for Play Console upload (6.6MB)
- NeonStickWar-mobile-publish.zip: ZIP archive of web assets

Keystore: /home/z/my-project/upload/NeonStickWar-extracted/release-keystore.jks
Password: NeonStickWar2026!
Key Alias: neonstickwar

v3 Changes (Portal + Install Fix):
- GREEN PORTAL made 3x bigger and more prominent (radius 55 vs 35)
- "NEXT LEVEL ▶" text floating above active portal
- "DEFEAT ALL ENEMIES ▼" text with big arrow at inactive portal
- MAGNETIC PULL: player auto-draws toward portal when within 150px
- Portal hitbox DOUBLED (120x100 vs 50x60) - easier to enter
- Off-screen arrow shows "PORTAL ▶" instead of just distance
- Level travel distance DOUBLED (2x longer levels)
- "App Not Installed" FIXED: resources.arsc now uncompressed (Stored 0%)
- META-INF/services restored (Kotlin coroutines)
- v1+v2+v3 signing scheme

Previous Bug Fixes (v2):
- Auto-movement bug fixed (visibility/blur/pagehide handlers)
- Auto-shooting bug fixed (periodic auto-release for stuck inputs)
- Joystick bug fixed (touch end/cancel reset)
- Performance optimizations (shadow blur, particle/entity limits, delta time clamping)
- Memory management (particle limit 80, enemy limit 20, wave queue limit 50)
- Mobile viewport fixes (touch-action, double-tap zoom prevention)
- Crystal Golem default pet
- Nuisance text removal
- Ad-only upgrades
- GPU acceleration CSS

Critical Technical Notes:
- Browser paths use /game/_next/static/chunks/...
- APK WebView paths must use /_next/static/chunks/... (no /game/ prefix)
- resources.arsc MUST be stored uncompressed in APK (Android memory-maps it)
- baseline.prof MUST be stored uncompressed
- META-INF/services/ required for Kotlin coroutines

Ads Configuration:
- AdMob isTesting = false (production mode)
- App ID: ca-app-pub-6439599735010649~1983422275
- Rewarded ad unit: ca-app-pub-6439599735010649/4027131683
- Interstitial ad unit: ca-app-pub-6439599735010649/8990244364
- Banner ad unit: ca-app-pub-6439599735010649/7774805003
- Real ads will show once AdMob account is verified and app is published on Play Store
