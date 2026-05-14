#!/bin/bash
# Sync game files to Android project
# Usage: ./sync-android.sh [path-to-project]

PROJECT_DIR="${1:-/home/z/my-project}"

echo "=== Neon Stick War - Android Sync ==="

# Check if source game chunk exists
SOURCE_CHUNK="$(dirname $0)/../source-minified/game-full.js"
TARGET_CHUNK="$PROJECT_DIR/public/game/_next/static/chunks/0cf1o-rq41zxz.js"

if [ -f "$SOURCE_CHUNK" ]; then
    echo "Copying game-full.js to project..."
    cp "$SOURCE_CHUNK" "$TARGET_CHUNK"
    echo "Copied: $SOURCE_CHUNK -> $TARGET_CHUNK"
fi

# Run Capacitor sync
echo "Running Capacitor sync..."
cd "$PROJECT_DIR"
npx cap sync android

echo ""
echo "=== Sync Complete ==="
echo "Android assets updated. Run build-debug.sh or build-release.sh to build."
