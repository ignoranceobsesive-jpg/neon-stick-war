#!/bin/bash
# Build Debug APK
# Usage: ./build-debug.sh [path-to-project]

PROJECT_DIR="${1:-/home/z/my-project}"
GAME_CHUNK="$PROJECT_DIR/public/game/_next/static/chunks/0cf1o-rq41zxz.js"

echo "=== Neon Stick War - Debug Build ==="

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

# Sync web assets to Android
echo "Syncing web assets..."
cd "$PROJECT_DIR"
npx cap sync android

# Build debug APK
echo "Building debug APK..."
cd "$PROJECT_DIR/android"
"$JAVA_HOME/bin/java" -version 2>&1 | head -1
./gradlew assembleDebug

# Copy to builds folder
BUILD_DIR="$PROJECT_DIR/game-builds"
mkdir -p "$BUILD_DIR"
cp "$PROJECT_DIR/android/app/build/outputs/apk/debug/app-debug.apk" "$BUILD_DIR/NeonStickWar-debug.apk"

echo ""
echo "=== Build Complete ==="
echo "Debug APK: $BUILD_DIR/NeonStickWar-debug.apk"
ls -lh "$BUILD_DIR/NeonStickWar-debug.apk"
