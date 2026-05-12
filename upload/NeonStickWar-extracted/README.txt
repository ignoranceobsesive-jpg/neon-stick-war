Neon Stick War mobile release bundle

Files:
- NeonStickWar-release.apk: signed release APK for direct Android install/testing.
- NeonStickWar-release.aab: signed Android App Bundle for Play Console upload.
- release-keystore.jks and keystore.properties: generated release signing key and credentials.

Important:
Keep release-keystore.jks and keystore.properties safe. Future app updates must be signed with the same key unless Play App Signing is configured with a different upload key.

Build verification:
- Next static export completed successfully.
- Capacitor Android sync completed successfully.
- Gradle assembleRelease and bundleRelease completed successfully.
- Android target SDK is 35.
- APK signature verification passed with v1 and v2 schemes.
- AAB jarsigner verification passed; self-signed certificate warnings are expected for locally generated upload keys.
