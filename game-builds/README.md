Neon Stick War - Mobile Release Build (v2 - Bug Fixed)
=======================================================

Files:
- NeonStickWar-release.apk: Signed release APK with all bug fixes (auto-movement, auto-shooting, joystick, performance, memory fixes)
- NeonStickWar-release.aab: Signed Android App Bundle for Play Console upload (with all bug fixes)
- NeonStickWar-mobile-publish.zip: ZIP archive of web assets

Keystore: /home/z/my-project/upload/NeonStickWar-extracted/release-keystore.jks
Password: NeonStickWar2026!
Key Alias: neonstickwar

Bug Fixes Included:
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

Critical Fix: Path correction
- Browser paths use /game/_next/static/chunks/...
- APK WebView paths must use /_next/static/chunks/... (no /game/ prefix)
- This was the cause of the black screen issue in the original APK

Ads Configuration:
- AdMob isTesting = false (production mode)
- Rewarded ad unit: ca-app-pub-6439599735010649/XXXXXXX
- Interstitial ad unit: ca-app-pub-6439599735010649/XXXXXXX
- Banner ad unit: ca-app-pub-6439599735010649/XXXXXXX
- Real ads will show once AdMob account is verified and app is published on Play Store
