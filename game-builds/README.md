Neon Stick War - Final Release Build
=====================================

Files:
- NeonStickWar-release.apk  (9.8MB) — Signed release APK, fixed paths, real ads, real Firebase
- NeonStickWar-release.aab  (9.8MB) — Production AAB for Play Store upload (Google signs it)
- NeonStickWar-mobile-publish.zip — Web assets only, no junk

Build v2 - PATH FIX (May 12, 2025):
- FIXED: Blank screen issue — all script/CSS paths changed from absolute (/game/_next/) 
  to relative (_next/) so they work in Capacitor WebView
- Previous build had /game/_next/ paths which couldn't resolve inside the APK

All builds include:
- Latest game JS with cutscene removal, portal fix, ground collision fix
- Skill cooldown enforcement, fall-through recovery
- Audio pause on screen off / app switch
- Joystick text removed, mobile touch stability
- AdMob SDK with real ad unit IDs
- Firebase Analytics, Auth, Firestore
- Audio manager bridge for parent frame
- Signed with release keystore (SHA-1: d6df672b4e48d0b97998d4c399d7f07b057fd066)
