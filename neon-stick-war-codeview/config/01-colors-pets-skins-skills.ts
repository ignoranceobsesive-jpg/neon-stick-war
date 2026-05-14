            var l = f(a, o);
            return {
              styleId: l,
              rules: Array.isArray(t) ? t.map(function(e) {
                return u(l, e)
              }) : [u(l, t)]
            }
          }
          return {
            styleId: f(a),
            rules: Array.isArray(t) ? t : [t]
          }
        }, t.selectFromServer = function() {
          return Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]')).reduce(function(e, t) {
            return e[t.id.slice(2)] = t, e
          }, {})
        }, e
      }(),
      x = l.createContext(null);

    function p() {
      return new m
    }

    function g() {
      return l.useContext(x)
    }
    x.displayName = "StyleSheetContext";
    var y = r.default.useInsertionEffect || r.default.useLayoutEffect,
      b = "u" > typeof window ? p() : void 0;

    function v(e) {
      var t = b || g();
      return t && ("u" < typeof window ? t.add(e) : y(function() {
        return t.add(e),
          function() {
            t.remove(e)
          }
      }, [e.id, String(e.dynamic)])), null
    }
    v.dynamic = function(e) {
      return e.map(function(e) {
        return f(e[0], e[1])
      }).join(" ")
    }, o.StyleRegistry = function(e) {
      var t = e.registry,
        o = e.children,
        a = l.useContext(x),
        n = l.useState(function() {
          return a || t || p()
        })[0];
      return r.default.createElement(x.Provider, {
        value: n
      }, o)
    }, o.createStyleRegistry = p, o.style = v, o.useStyleRegistry = g
  },
  37902, (e, t, o) => {
    t.exports = e.r(98547).style
  },
  52683, e => {
    "use strict";
    let t;
    var o = e.i(43476),
      a = e.i(71645);
    let l = e => {
        let t, o = new Set,
          a = (e, a) => {
            let l = "function" == typeof e ? e(t) : e;
            if (!Object.is(l, t)) {
              let e = t;
              t = (null != a ? a : "object" != typeof l || null === l) ? l : Object.assign({}, t, l), o.forEach(o =>
                o(t, e))
            }
          },
          l = () => t,
          r = {
            setState: a,
            getState: l,
            getInitialState: () => n,
            subscribe: e => (o.add(e), () => o.delete(e))
          },
          n = t = e(a, l, r);
        return r
      },
      r = e => {
        let t = e ? l(e) : l,
          o = e => (function(e, t = e => e) {
            let o = a.default.useSyncExternalStore(e.subscribe, a.default.useCallback(() => t(e.getState()), [e,
              t]), a.default.useCallback(() => t(e.getInitialState()), [e, t]));
            return a.default.useDebugValue(o), o
          })(t, e);
        return Object.assign(o, t), o
      },
      n = "#00ffff",
      i = "#ff00ff",
      s = "#00ff66",
      c = "#ff6600",
      d = "#ffff00",
      h = "#aa00ff",
      f = "#ff3333",
      u = "#050510",
      m = "#ffd700",
      x = "#ff69b4",
      p = "#4488ff",
      g = "#ffffff",
      y = {
        damage: {
          name: "Damage",
          baseCost: 500,
          costMultiplier: 1.5,
          effectPerLevel: .15,
          maxLevel: 999
        },
        fireRate: {
          name: "Fire Rate",
          baseCost: 800,
          costMultiplier: 1.6,
          effectPerLevel: .1,
          maxLevel: 999
        },
        bulletSpeed: {
          name: "Bullet Speed",
          baseCost: 600,
          costMultiplier: 1.4,
          effectPerLevel: .12,
          maxLevel: 999
        },
        bulletSize: {
          name: "Bullet Size",
          baseCost: 400,
          costMultiplier: 1.3,
          effectPerLevel: .1,
          maxLevel: 999
        },
        criticalChance: {
          name: "Critical Hit",
          baseCost: 1500,
          costMultiplier: 2,
          effectPerLevel: .02,
          maxLevel: 50
        }
      };

    function b(e, t) {
      let o = y[e];
      return Math.floor(o.baseCost * Math.pow(o.costMultiplier, t))
    }
    let v = [{
        id: "neonWolf",
        name: "NEON WOLF",
        color: n,
        glowColor: n,
        shootColor: n,
        damage: 6,
        shootRate: 45,
        description: "Loyal companion. Balanced fighter.",
        price: 0
      }, {
        id: "plasmaFalcon",
        name: "PLASMA FALCON",
        color: c,
        glowColor: d,
        shootColor: c,
        damage: 4,
        shootRate: 30,
        description: "Fast attacks. Quick and agile.",
        price: 2e3
      }, {
        id: "shadowSpider",
        name: "SHADOW SPIDER",
        color: h,
        glowColor: i,
        shootColor: h,
        damage: 8,
        shootRate: 60,
        description: "Slow but devastating hits.",
        price: 3500
      }, {
        id: "crystalGolem",
        name: "CRYSTAL GOLEM",
        color: s,
        glowColor: s,
        shootColor: s,
        damage: 5,
        shootRate: 50,
        description: "Tanky. Absorbs damage for you.",
        price: 5500
      }, {
        id: "voidDrake",
        name: "VOID DRAKE",
        color: i,
        glowColor: f,
        shootColor: i,
        damage: 10,
        shootRate: 55,
        description: "Legendary power. Devastating attacks.",
        price: 25e3
      }, {
        id: "neonCat",
        name: "NEON CAT",
        color: "#ff44aa",
        glowColor: "#ff88cc",
        shootColor: "#ff44aa",
        damage: 5,
        shootRate: 40,
        description: "Agile and quick. Lands critical hits.",
        price: 3e3
      }, {
        id: "thunderBird",
        name: "THUNDER BIRD",
        color: "#ffff00",
        glowColor: "#ffffff",
        shootColor: "#ffff00",
        damage: 7,
        shootRate: 50,
        description: "Strikes with lightning bolts.",
        price: 4500
      }, {
        id: "iceFox",
        name: "ICE FOX",
        color: "#88eeff",
        glowColor: "#ffffff",
        shootColor: "#88eeff",
        damage: 6,
        shootRate: 42,
        description: "Freezing attacks slow enemies.",
        price: 7500
      }, {
        id: "magmaSnail",
        name: "MAGMA SNAIL",
        color: "#ff4400",
        glowColor: "#ff8844",
        shootColor: "#ff4400",
        damage: 9,
        shootRate: 70,
        description: "Slow but devastating fireballs.",
        price: 15e3
      }, {
        id: "cosmicOwl",
        name: "COSMIC OWL",
        color: "#aa44ff",
        glowColor: "#dd88ff",
        shootColor: "#aa44ff",
        damage: 11,
        shootRate: 58,
        description: "Legendary wisdom. Devastating cosmic blasts.",
        price: 4e4
      }],
      w = [{
        id: "wolf-default",
        name: "CYAN",
        petId: "neonWolf",
        color: n,
        glowColor: n,
        trailColor: n,
        price: 0,
        rarity: "common"
      }, {
        id: "wolf-crimson",
        name: "CRIMSON",
        petId: "neonWolf",
        color: f,
        glowColor: c,
        trailColor: f,
        price: 2400,
        rarity: "rare"
      }, {
        id: "wolf-golden",
        name: "GOLDEN",
        petId: "neonWolf",
        color: m,
        glowColor: d,
        trailColor: m,
        price: 15e3,
        rarity: "legendary"
      }, {
        id: "falcon-default",
        name: "FLAME",
        petId: "plasmaFalcon",
        color: c,
        glowColor: d,
        trailColor: c,
        price: 0,
        rarity: "common"
      }, {
        id: "falcon-ice",
        name: "ICE",
        petId: "plasmaFalcon",
        color: "#88eeff",
        glowColor: g,
        trailColor: "#88eeff",
        price: 2400,
        rarity: "rare"
      }, {
        id: "spider-default",
        name: "VOID",
        petId: "shadowSpider",
        color: h,
        glowColor: i,
        trailColor: h,
        price: 0,
        rarity: "common"
      }, {
        id: "spider-toxic",
        name: "TOXIC",
        petId: "shadowSpider",
        color: s,
        glowColor: s,
        trailColor: s,
        price: 4e3,
        rarity: "rare"
      }, {
        id: "golem-default",
        name: "CRYSTAL",
        petId: "crystalGolem",
        color: s,
        glowColor: s,
        trailColor: s,
        price: 0,
        rarity: "common"
      }, {
        id: "golem-magma",
        name: "MAGMA",
        petId: "crystalGolem",
        color: f,
        glowColor: c,
        trailColor: c,
        price: 5500,
        rarity: "epic"
      }, {
        id: "drake-default",
        name: "ABYSS",
        petId: "voidDrake",
        color: i,
        glowColor: f,
        trailColor: i,
        price: 0,
        rarity: "common"
      }, {
        id: "drake-prism",
        name: "PRISM",
        petId: "voidDrake",
        color: g,
        glowColor: n,
        trailColor: i,
        price: 25e3,
        rarity: "legendary",
        effect: "rainbow"
      }, {
        id: "cat-default",
        name: "PINK",
        petId: "neonCat",
        color: "#ff44aa",
        glowColor: "#ff88cc",
        trailColor: "#ff44aa",
        price: 0,
        rarity: "common"
      }, {
        id: "cat-shadow",
        name: "SHADOW",
        petId: "neonCat",
        color: "#442244",
        glowColor: "#664466",
        trailColor: "#442244",
        price: 2400,
        rarity: "rare"
      }, {
        id: "cat-cosmic",
        name: "COSMIC",
        petId: "neonCat",
        color: "#aa44ff",
        glowColor: "#dd88ff",
        trailColor: "#aa44ff",
        price: 8e3,
        rarity: "epic"
      }, {
        id: "bird-default",
        name: "STORM",
        petId: "thunderBird",
        color: "#ffff00",
        glowColor: "#ffffff",
        trailColor: "#ffff00",
        price: 0,
        rarity: "common"
      }, {
        id: "bird-plasma",
        name: "PLASMA",
        petId: "thunderBird",
        color: c,
        glowColor: d,
        trailColor: c,
        price: 2400,
        rarity: "rare"
      }, {
        id: "bird-void",
        name: "VOID STORM",
        petId: "thunderBird",
        color: "#8800ff",
        glowColor: i,
        trailColor: "#8800ff",
        price: 9e3,
        rarity: "epic"
      }, {
        id: "fox-default",
        name: "FROST",
        petId: "iceFox",
        color: "#88eeff",
        glowColor: "#ffffff",
        trailColor: "#88eeff",
        price: 0,
        rarity: "common"
      }, {
        id: "fox-arctic",
        name: "ARCTIC",
        petId: "iceFox",
        color: "#ffffff",
        glowColor: "#ccffff",
        trailColor: "#ffffff",
        price: 4e3,
        rarity: "rare"
      }, {
        id: "fox-aurora",
        name: "AURORA",
        petId: "iceFox",
        color: "#44ff88",
        glowColor: "#88ffcc",
        trailColor: "#44ff88",
        price: 12e3,
        rarity: "legendary",
        effect: "rainbow"
      }, {
        id: "snail-default",
        name: "LAVA",
        petId: "magmaSnail",
        color: "#ff4400",
        glowColor: "#ff8844",
        trailColor: "#ff4400",
        price: 0,
        rarity: "common"
      }, {
        id: "snail-obsidian",
        name: "OBSIDIAN",
        petId: "magmaSnail",
        color: "#333344",
        glowColor: "#666688",
        trailColor: "#333344",
        price: 7e3,
        rarity: "rare"
      }, {
        id: "snail-infernal",
        name: "INFERNAL",
        petId: "magmaSnail",
        color: "#ff0000",
        glowColor: "#ffaa00",
        trailColor: "#ff0000",
        price: 2e4,
        rarity: "legendary",
        effect: "fire"
      }, {
        id: "owl-default",
        name: "NEBULA",
        petId: "cosmicOwl",
        color: "#aa44ff",
        glowColor: "#dd88ff",
        trailColor: "#aa44ff",
        price: 0,
        rarity: "common"
      }, {
        id: "owl-stellar",
        name: "STELLAR",
        petId: "cosmicOwl",
        color: "#ffdd44",
        glowColor: "#ffffff",
        trailColor: "#ffdd44",
        price: 12e3,
        rarity: "rare"
      }, {
        id: "owl-eternity",
        name: "ETERNITY",
        petId: "cosmicOwl",
        color: "#ffffff",
        glowColor: "#ff44ff",
        trailColor: "#ffffff",
        price: 35e3,
        rarity: "legendary",
        effect: "rainbow"
      }],
      k = [{
        id: "shadow",
        name: "SHADOW",
        color: "#8800ff",
        glowColor: "#aa44ff",
        ability: "Stealth Dash",
        joinChapter: 2,
        active: !1,
        health: 80,
        maxHealth: 80
      }, {
        id: "blaze",
        name: "BLAZE",
        color: "#ff4400",
        glowColor: "#ff8844",
        ability: "Fire Burst",
        joinChapter: 3,
        active: !1,
        health: 100,
        maxHealth: 100
      }, {
        id: "volt",
        name: "VOLT",
        color: "#ffff00",
        glowColor: "#ffff88",
        ability: "Lightning Strike",
        joinChapter: 4,
        active: !1,
        health: 70,
        maxHealth: 70
      }, {
        id: "ice",
        name: "ICE",
        color: "#44ddff",
        glowColor: "#88eeff",
        ability: "Freeze Blast",
        joinChapter: 5,
        active: !1,
        health: 90,
        maxHealth: 90
      }],
      C = [{
        id: "neon-green",
        name: "TOXIC",
        color: s,
        glowColor: s,
        trailColor: s,
        price: 0,
        rarity: "common"
      }, {
        id: "fire-red",
        name: "BLAZE",
        color: f,
        glowColor: c,
        trailColor: c,
        price: 5e3,
        rarity: "rare"
      }, {
        id: "royal-purple",
        name: "ROYAL",
        color: h,
        glowColor: i,
        trailColor: i,
        price: 5e3,
        rarity: "rare",
        unlockLevel: 6
      }, {
        id: "crimson",
        name: "CRIMSON",
        color: "#ff2222",
        glowColor: "#ff6644",
        trailColor: "#ff2222",
        price: 3e3,
        rarity: "rare"
      }, {
        id: "emerald",
        name: "EMERALD",
        color: "#00cc66",
        glowColor: "#44ff88",
        trailColor: "#00cc66",
        price: 3e3,
        rarity: "rare"
      }, {
        id: "sapphire",
        name: "SAPPHIRE",
        color: "#2266ff",
        glowColor: "#4488ff",
        trailColor: "#2266ff",
        price: 3e3,
        rarity: "rare"
      }, {
        id: "gold",
        name: "GOLDEN",
        color: m,
        glowColor: d,
        trailColor: d,
        price: 15e3,
        rarity: "epic"
      }, {
        id: "shadow",
        name: "PHANTOM",
        color: "#4444ff",
        glowColor: "#8888ff",
        trailColor: h,
        price: 15e3,
        rarity: "epic",
        unlockLevel: 10
      }, {
        id: "sunset",
        name: "SUNSET",
        color: "#ff8800",
        glowColor: "#ffaa44",
        trailColor: "#ff8800",
        price: 1e4,
        rarity: "epic"
      }, {
        id: "arctic",
        name: "ARCTIC",
        color: "#88ddff",
        glowColor: "#ffffff",
        trailColor: "#88ddff",
        price: 1e4,
        rarity: "epic"
      }, {
        id: "venom",
        name: "VENOM",
        color: "#88ff00",
        glowColor: "#aaff44",
        trailColor: "#88ff00",
        price: 1e4,
        rarity: "epic"
      }, {
        id: "neon-pink",
        name: "NEON PINK",
        color: "#ff44aa",
        glowColor: "#ff88cc",
        trailColor: "#ff44aa",
        price: 18e3,
        rarity: "epic"
      }, {
        id: "rainbow",
        name: "PRISM",
        color: g,
        glowColor: i,
        trailColor: n,
        price: 3e4,
        rarity: "legendary",
        effect: "rainbow"
      }, {
        id: "diamond",
        name: "DIAMOND",
        color: "#88ffff",
        glowColor: g,
        trailColor: n,
        price: 4e4,
        rarity: "legendary",
        effect: "sparkle"
      }, {
        id: "obsidian",
        name: "OBSIDIAN",
        color: "#333344",
        glowColor: "#666688",
        trailColor: "#333344",
        price: 3e4,
        rarity: "legendary",
        effect: "shadow"
      }, {
        id: "plasma",
        name: "PLASMA",
        color: "#ff44ff",
        glowColor: "#ff88ff",
        trailColor: "#ff44ff",
        price: 3e4,
        rarity: "legendary",
        effect: "plasma"
      }, {
        id: "celestial",
        name: "CELESTIAL",
        color: "#ffdd44",
        glowColor: "#ffffff",
        trailColor: "#ffdd44",
        price: 4e4,
        rarity: "legendary",
        effect: "holy"
      }, {
        id: "abyssal",
        name: "ABYSSAL",
        color: "#220044",
        glowColor: "#440088",
        trailColor: "#220044",
        price: 5e4,
        rarity: "legendary",
        effect: "abyss"
      }, {
        id: "cyber",
        name: "CYBER",
        color: "#00ffaa",
        glowColor: "#44ffcc",
        trailColor: "#00ffaa",
        price: 5e4,
        rarity: "legendary",
        effect: "glitch"
      }],
      S = [1, 1.2, 1.5, 1.8, 2.2],
      T = [1, .9, .8, .7, .6],
      M = [0, 1500, 3e3, 5400, 10500],
      j = [!1, !1, !0, !0, !0],
      N = [{
        day: 1,
        coins: 50,
        type: "coins"
      }, {
        day: 2,
        coins: 100,
        type: "coins"
      }, {
        day: 3,
        coins: 150,
        type: "coins"
      }, {
        day: 4,
        coins: 200,
        type: "coins"
      }, {
        day: 5,
        coins: 300,
        type: "coins"
      }, {
        day: 6,
        coins: 500,
        type: "coins"
      }, {
        day: 7,
        coins: 1e3,
        type: "coins"
      }],
      P = [{
        id: "fireball",
        name: "FIREBALL",
        element: "fire",
        description: "Launch a devastating fireball that explodes on impact, dealing area damage to all nearby enemies.",
        damage: 25,
        cooldown: 180,
        duration: 30,
        color: "#ff4400",
        glowColor: "#ff8844",
        rarity: "common",
        unlockMethod: "level",
        unlockCost: 0,
        unlockLevel: 2,
        effectType: "projectile",
        projectileCount: 1
      }, {
        id: "fireStorm",
        name: "FIRE STORM",
        element: "fire",
        description: "Rain fire from above! Multiple fireballs cascade across the battlefield, creating a devastating inferno.",
        damage: 40,
        cooldown: 360,
        duration: 60,
        color: "#ff2200",
        glowColor: "#ff6600",
        rarity: "rare",
        unlockMethod: "boss",
        unlockCost: 0,
        unlockBoss: "bossRedKing",
        effectType: "aoe",
        effectRadius: 200
      }, {
        id: "inferno",
        name: "INFERNO",
        element: "fire",
        description: "Unleash the ultimate fire technique. A massive pillar of flame erupts from the ground, incinerating everything.",
        damage: 60,
        cooldown: 480,
        duration: 90,
        color: "#ff0000",
        glowColor: "#ffaa00",
        rarity: "legendary",
        unlockMethod: "ad",
        unlockCost: 4e3,
        effectType: "beam",
        effectRadius: 150
      }, {
        id: "iceShard",
        name: "ICE SHARD",
        element: "frost",
        description: "Fire razor-sharp ice shards that pierce through enemies and slow their movement.",
        damage: 20,
        cooldown: 150,
        duration: 60,
        color: "#88eeff",
        glowColor: "#ffffff",
        rarity: "common",
        unlockMethod: "level",
        unlockCost: 0,
        unlockLevel: 5,
        effectType: "projectile",
        projectileCount: 3
      }, {
        id: "blizzard",
        name: "BLIZZARD",
        element: "frost",
        description: "Summon a raging blizzard that freezes all enemies in a wide area.",
        damage: 35,
        cooldown: 300,
        duration: 90,
        color: "#44ddff",
        glowColor: "#ffffff",
        rarity: "rare",
        unlockMethod: "chest",
        unlockCost: 1800,
        effectType: "aoe",
        effectRadius: 250
      }, {
        id: "absoluteZero",
        name: "ABSOLUTE ZERO",
        element: "frost",
        description: "Flash-freeze the entire battlefield, stopping ALL enemies in their tracks.",
        damage: 50,
        cooldown: 600,
        duration: 120,
        color: "#ffffff",
        glowColor: "#88eeff",
        rarity: "legendary",
        unlockMethod: "ad",
        unlockCost: 5e3,
        effectType: "aoe",
        effectRadius: 500
      }, {
        id: "shadowStep",
        name: "SHADOW STEP",
        element: "shadow",
        description: "Teleport behind the nearest enemy and strike from the shadows. Grants brief invincibility.",
        damage: 30,
        cooldown: 200,
        duration: 20,
        color: "#8800ff",
        glowColor: "#aa44ff",
        rarity: "common",
        unlockMethod: "level",
        unlockCost: 0,
        unlockLevel: 8,
        effectType: "buff"
      }, {
        id: "shadowClone",
        name: "SHADOW CLONE",
        element: "shadow",
        description: "Create shadow clones that fight alongside you and draw enemy fire.",
        damage: 15,
        cooldown: 360,
        duration: 180,
        color: "#6600cc",
        glowColor: "#9933ff",
        rarity: "epic",
        unlockMethod: "boss",
        unlockCost: 0,
        unlockBoss: "bossCorrupted",
        effectType: "summon",
        summonCount: 2
      }, {
        id: "voidWalk",
        name: "VOID WALK",
        element: "shadow",
        description: "Enter the void dimension, becoming invisible and invincible. Next attack deals 3x damage.",
        damage: 45,
        cooldown: 480,
        duration: 60,
        color: "#4400aa",
        glowColor: "#8800ff",
        rarity: "legendary",
        unlockMethod: "ad",
        unlockCost: 4e3,
        effectType: "buff"
      }, {
        id: "summonWraith",
        name: "SUMMON WRAITH",
        element: "summon",
        description: "Summon a spectral wraith that hunts down enemies and drains their life force.",
        damage: 12,
        cooldown: 240,
        duration: 200,
        color: "#aa00ff",
        glowColor: "#ff00ff",
        rarity: "common",
        unlockMethod: "purchase",
        unlockCost: 1200,
        effectType: "summon",
        summonCount: 1
      }, {
        id: "summonLegion",
        name: "SUMMON LEGION",
        element: "summon",
        description: "Raise an army of shadow soldiers that charge forward, overwhelming enemies with numbers.",
        damage: 20,
        cooldown: 420,
        duration: 180,
        color: "#8800cc",
        glowColor: "#cc44ff",
        rarity: "epic",
        unlockMethod: "boss",
        unlockCost: 0,
        unlockBoss: "bossMechGolem",
        effectType: "summon",
        summonCount: 5
      }, {
        id: "summonDeathKnight",
        name: "DEATH KNIGHT",
        element: "summon",
        description: "Summon the legendary Death Knight, an unstoppable warrior that cleaves through enemies.",
        damage: 35,
        cooldown: 600,
        duration: 240,
        color: "#440066",
        glowColor: "#8800aa",
        rarity: "legendary",
        unlockMethod: "ad",
        unlockCost: 6e3,
        effectType: "summon",
        summonCount: 1
      }, {
        id: "deathTouch",
        name: "DEATH TOUCH",
        element: "death",
        description: "Channel the power of death. A close-range touch that instantly kills weaker enemies.",
        damage: 50,
        cooldown: 300,
        duration: 15,
        color: "#330033",
        glowColor: "#660066",
        rarity: "rare",
        unlockMethod: "chest",
        unlockCost: 2400,
        effectType: "beam"
      }, {
        id: "soulHarvest",
        name: "SOUL HARVEST",
        element: "death",
        description: "Reap the souls of nearby enemies, dealing damage and healing yourself for each hit.",
        damage: 30,
        cooldown: 360,
        duration: 45,
        color: "#220022",
        glowColor: "#550055",
        rarity: "epic",
        unlockMethod: "boss",
        unlockCost: 0,
        unlockBoss: "bossFather",
        effectType: "aoe",
        effectRadius: 200
      }, {
        id: "annihilation",
        name: "ANNIHILATION",
        element: "death",
        description: "Obliterate everything in a massive radius. Non-boss enemies are instantly killed.",
        damage: 999,
        cooldown: 900,
        duration: 30,
        color: "#110011",
        glowColor: "#330033",
        rarity: "legendary",
        unlockMethod: "ad",
        unlockCost: 1e4,
        effectType: "aoe",
        effectRadius: 400
      }, {
