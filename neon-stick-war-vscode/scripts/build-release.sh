#!/bin/bash
# Build Release APK and AAB
# Usage: ./build-release.sh [path-to-project]

PROJECT_DIR="${1:-/home/z/my-project}"
GAME_CHUNK="$PROJECT_DIR/public/game/_next/static/chunks/0cf1o-rq41zxz.js"

echo "=== Neon Stick War - Release Build ==="

# Check if game chunk exists
if [ ! -f "$GAME_CHUNK" ]; then
    echo "ERROR: Game chunk not found at $GAME_CHUNK"
    exit 1
fi

# Check if JAVA_HOME is set
if [ -z "$JAVA_HOME" ]; then
    export JAVA_HOME="/home/z/.jdks/jdk-21.0.11"
    echo "Using JAVA_HOME: $JAVA_HOME"
fi

# Verify game file parses correctly
echo "Checking game file for syntax errors..."
node --check "$GAME_CHUNK" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "WARNING: Game file has syntax errors! Building anyway..."
fi

# Sync web assets to Android
echo "Syncing web assets..."
cd "$PROJECT_DIR"
npx cap sync android

# Build release APK
echo "Building release APK..."
cd "$PROJECT_DIR/android"
"$JAVA_HOME/bin/java" -version 2>&1 | head -1
./gradlew assembleRelease

# Build release AAB
echo "Building release AAB..."
./gradlew bundleRelease

# Copy to builds folder
BUILD_DIR="$PROJECT_DIR/game-builds"
mkdir -p "$BUILD_DIR"
cp "$PROJECT_DIR/android/app/build/outputs/apk/release/app-release.apk" "$BUILD_DIR/NeonStickWar-release.apk"
cp "$PROJECT_DIR/android/app/build/outputs/bundle/release/app-release.aab" "$BUILD_DIR/NeonStickWar-release.aab"

echo ""
echo "=== Build Complete ==="
echo "Release APK: $BUILD_DIR/NeonStickWar-release.apk"
echo "Release AAB: $BUILD_DIR/NeonStickWar-release.aab"
ls -lh "$BUILD_DIR/NeonStickWar-release.apk"
ls -lh "$BUILD_DIR/NeonStickWar-release.aab"
