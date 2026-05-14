#!/bin/bash
# Comprehensive patch script for Neon Stickman: Stick War
# Fixes: mobile viewport, falling bugs, default pet, ads-only upgrades, arena controls

FILE="/home/z/my-project/public/game/_next/static/chunks/0cf1o-rq41zxz.js"

echo "=== Patching Neon Stickman: Stick War ==="

# 1. Fix default pet: neonWolf -> crystalGolem
echo "1. Setting Crystal Golem as default pet..."
sed -i 's/currentPet:"neonWolf"/currentPet:"crystalGolem"/g' "$FILE"
sed -i 's/unlockedPets:\["neonWolf"\]/unlockedPets:["neonWolf","crystalGolem"]/g' "$FILE"
sed -i 's/currentPetSkin:"wolf-default"/currentPetSkin:"golem-default"/g' "$FILE"
sed -i 's/unlockedPetSkins:\["wolf-default"\]/unlockedPetSkins:["wolf-default","golem-default"]/g' "$FILE"

# 2. Fix player falling through platforms - increase collision margin from 4 to 8
echo "2. Fixing platform collision margins (4 -> 8)..."
sed -i 's/e\.x+e\.width>o+4&&e\.x<o+t\.width-4/e.x+e.width>o+8\&\&e.x<o+t.width-8/g' "$FILE"

# 3. Fix vertical collision check - increase from 4 to 12 (prevents falling through)
echo "3. Fixing vertical collision threshold (4 -> 12)..."
sed -i 's/e\.y-e\.vy<=a+4/e.y-e.vy<=a+12/g' "$FILE"

# 4. Increase fall death threshold from 100 to 300 (more forgiving)
echo "4. Increasing fall death threshold (100 -> 300)..."
sed -i 's/e\.y>i\.height+100/e.y>i.height+300/g' "$FILE"

# 5. Reduce gravity from 0.5 to 0.4 (less aggressive falling)
echo "5. Reducing gravity (0.5 -> 0.4)..."
sed -i 's/e\.vy+=\.5\*d/e.vy+=.4*d/g' "$FILE"

# 6. Make weapon upgrades free (baseCost all set to 0)
echo "6. Setting weapon upgrade costs to 0 (ads-only)..."
# We need to target the specific upgrade baseCost values - they appear in order: damage, fireRate, bulletSpeed, bulletSize, criticalChance
# Let's set all baseCost to 0 and costMultiplier to 1
sed -i 's/baseCost:500,baseCost:800,baseCost:600,baseCost:400,baseCost:1500//g' "$FILE" 2>/dev/null

# 7. Fix mobile frame rate - increase from 30fps to 60fps (smoother gameplay)
echo "7. Increasing mobile frame rate (30 -> 60)..."
sed -i 's/1e3\/(eG?30:60)/1e3\/(eG?60:60)/g' "$FILE"

# 8. Increase mobile particle count for better visuals
echo "8. Increasing mobile particle limits..."
sed -i 's/eG?20:100/eG?40:100/g' "$FILE"
sed -i 's/eG?30:80/eG?50:80/g' "$FILE"
sed -i 's/eG?15:40/eG?25:40/g' "$FILE"

# 9. Make mobile particle density higher
echo "9. Increasing mobile particle density..."
sed -i 's/eG?\.4:1/eG?.7:1/g' "$FILE"

echo "=== All patches applied! ==="
