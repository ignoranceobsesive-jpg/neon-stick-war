        id: "lightningBolt",
        name: "LIGHTNING BOLT",
        element: "lightning",
        description: "Strike enemies with a bolt of lightning that chains between nearby targets.",
        damage: 22,
        cooldown: 160,
        duration: 20,
        color: "#ffff00",
        glowColor: "#ffffff",
        rarity: "common",
        unlockMethod: "level",
        unlockCost: 0,
        unlockLevel: 12,
        effectType: "projectile",
        projectileCount: 1
      }, {
        id: "thunderStorm",
        name: "THUNDER STORM",
        element: "lightning",
        description: "Call down a devastating thunder storm that repeatedly strikes the battlefield.",
        damage: 38,
        cooldown: 350,
        duration: 90,
        color: "#ffff44",
        glowColor: "#ffffff",
        rarity: "epic",
        unlockMethod: "purchase",
        unlockCost: 3600,
        effectType: "aoe",
        effectRadius: 300
      }, {
        id: "voidBlast",
        name: "VOID BLAST",
        element: "void",
        description: "Fire a concentrated blast of void energy that tears through enemies and distorts reality.",
        damage: 28,
        cooldown: 200,
        duration: 40,
        color: "#ff00ff",
        glowColor: "#ff44ff",
        rarity: "rare",
        unlockMethod: "level",
        unlockCost: 0,
        unlockLevel: 20,
        effectType: "projectile",
        projectileCount: 1
      }, {
        id: "voidRift",
        name: "VOID RIFT",
        element: "void",
        description: "Tear open a rift in reality that continuously damages and slows all enemies within.",
        damage: 20,
        cooldown: 400,
        duration: 150,
        color: "#cc00cc",
        glowColor: "#ff44ff",
        rarity: "epic",
        unlockMethod: "boss",
        unlockCost: 0,
        unlockBoss: "bossDragon",
        effectType: "aoe",
        effectRadius: 180
      }, {
        id: "bloodStrike",
        name: "BLOOD STRIKE",
        element: "blood",
        description: "Sacrifice health to deal massive damage. The lower your health, the more damage this deals.",
        damage: 35,
        cooldown: 180,
        duration: 15,
        color: "#cc0000",
        glowColor: "#ff3333",
        rarity: "rare",
        unlockMethod: "purchase",
        unlockCost: 1500,
        effectType: "projectile",
        projectileCount: 1
      }, {
        id: "bloodFury",
        name: "BLOOD FURY",
        element: "blood",
        description: "Enter a blood rage that massively increases attack speed and damage, but drains health.",
        damage: 0,
        cooldown: 420,
        duration: 180,
        color: "#990000",
        glowColor: "#ff0000",
        rarity: "epic",
        unlockMethod: "boss",
        unlockCost: 0,
        unlockBoss: "bossPhoenix",
        effectType: "buff"
      }];

    function A(e) {
      return e <= 10 ? "neonCity" : e <= 20 ? "scorchedWasteland" : e <= 30 ? "frozenTundra" : e <= 40 ?
        "shadowRealm" : e <= 50 ? "volcanicCore" : e <= 60 ? "crystalCaves" : e <= 70 ? "voidDimension" : e <= 80 ?
        "cyberForest" : e <= 90 ? "stormPlains" : e <= 100 ? "bloodMoon" : ["neonCity", "scorchedWasteland",
          "frozenTundra", "shadowRealm", "volcanicCore", "crystalCaves", "voidDimension", "cyberForest",
          "stormPlains", "bloodMoon"
        ][(e - 101) % 10]
    }

    function R(e) {
      switch (e) {
        case "neonCity":
          return {
            skyColor: "#020210", skyGradient: ["#020210", "#040418", "#020212"], groundColor: "#000a0a",
              platformColor: "#000a0a", platformGlow: n, particleColor: n, weatherType: "rain", ambientDescription:
              "The neon city pulses with digital energy"
          };
        case "scorchedWasteland":
          return {
            skyColor: "#080300", skyGradient: ["#080300", "#0c0500", "#060200"], groundColor: "#0a0500",
              platformColor: "#0a0500", platformGlow: c, particleColor: c, weatherType: "embers",
              ambientDescription: "The wasteland burns under a dying sun"
          };
        case "frozenTundra":
          return {
            skyColor: "#010408", skyGradient: ["#010408", "#030810", "#02060a"], groundColor: "#000810",
              platformColor: "#000810", platformGlow: "#88eeff", particleColor: "#88eeff", weatherType: "snow",
              ambientDescription: "Ice covers everything in this frozen digital tundra"
          };
        case "shadowRealm":
          return {
            skyColor: "#050008", skyGradient: ["#050008", "#080012", "#040006"], groundColor: "#050008",
              platformColor: "#080010", platformGlow: h, particleColor: h, weatherType: "glitch",
              ambientDescription: "Shadows twist and writhe in this corrupted realm"
          };
        case "volcanicCore":
          return {
            skyColor: "#080000", skyGradient: ["#080000", "#0c0200", "#060000"], groundColor: "#0a0200",
              platformColor: "#0a0200", platformGlow: f, particleColor: f, weatherType: "embers",
              ambientDescription: "Molten data flows through the volcanic core"
          };
        case "crystalCaves":
          return {
            skyColor: "#000a08", skyGradient: ["#000a08", "#000c0a", "#000605"], groundColor: "#000a08",
              platformColor: "#000a08", platformGlow: s, particleColor: s, weatherType: "none", ambientDescription:
              "Crystals hum with ancient power"
          };
        case "voidDimension":
          return {
            skyColor: "#060006", skyGradient: ["#060006", "#0a000a", "#030003"], groundColor: "#050008",
              platformColor: "#050008", platformGlow: i, particleColor: i, weatherType: "voidParticles",
              ambientDescription: "Reality fractures in the void dimension"
          };
        case "cyberForest":
          return {
            skyColor: "#000805", skyGradient: ["#000805", "#000c08", "#000403"], groundColor: "#000c08",
              platformColor: "#000c08", platformGlow: "#00ff66", particleColor: "#00ff66", weatherType: "rain",
              ambientDescription: "Digital trees pulse with living code"
          };
        case "stormPlains":
          return {
            skyColor: "#080800", skyGradient: ["#080800", "#0a0a04", "#060600"], groundColor: "#080800",
              platformColor: "#080800", platformGlow: d, particleColor: d, weatherType: "glitch",
              ambientDescription: "Lightning tears across the storm plains"
          };
        case "bloodMoon":
          return {
            skyColor: "#080002", skyGradient: ["#080002", "#0c0004", "#060001"], groundColor: "#080002",
              platformColor: "#080002", platformGlow: "#cc0033", particleColor: "#cc0033", weatherType: "embers",
              ambientDescription: "The blood moon watches. Everything ends here."
          }
      }
    }
    let I = ["voidBat", "stormEagle", "emberWisp", "frostWraith", "shadowDrake", "plasmaSerpent", "neonWyrm",
      "crystalMoth", "dragon", "phoenix"
    ];

    function E(e) {
      return I.includes(e)
    }
    let L = {
        id: -1,
        name: "VERSUS ARENA",
        chapter: "VS",
        width: 1200,
        height: 600,
        playerSpawn: {
          x: 100,
          y: 460
        },
        platforms: [{
          x: 0,
          y: 520,
          width: 1200,
          height: 40,
          type: "static"
        }, {
          x: 80,
          y: 380,
          width: 150,
          height: 16,
          type: "static"
        }, {
          x: 320,
          y: 320,
          width: 130,
          height: 16,
          type: "static"
        }, {
          x: 500,
          y: 260,
          width: 120,
          height: 16,
          type: "moving",
          moveRange: 80,
          moveSpeed: 1,
          moveAxis: "x",
          moveOffset: 0
        }, {
          x: 700,
          y: 320,
          width: 130,
          height: 16,
          type: "static"
        }, {
          x: 920,
          y: 380,
          width: 150,
          height: 16,
          type: "static"
        }, {
          x: 200,
          y: 220,
          width: 80,
          height: 16,
          type: "static"
        }, {
          x: 880,
          y: 220,
          width: 80,
          height: 16,
          type: "static"
        }, {
          x: 520,
          y: 160,
          width: 100,
          height: 16,
          type: "static"
        }],
        waves: [],
        background: "core",
        introText: "FIGHT!",
        introColor: m,
        missionType: "fight",
        gangMembersAvailable: []
      },
      D = {
        elo: 1e3,
        wins: 0,
        losses: 0
      },
      W = [{
        rank: "Bronze",
        min: 0,
        icon: "🥉"
      }, {
        rank: "Silver",
        min: 1e3,
        icon: "🥈"
      }, {
        rank: "Gold",
        min: 1200,
        icon: "🥇"
      }, {
        rank: "Platinum",
        min: 1400,
        icon: "💎"
      }, {
        rank: "Diamond",
        min: 1600,
        icon: "💠"
      }, {
        rank: "Master",
        min: 2e3,
        icon: "👑"
      }];

    function O(e) {
      let t = W[0];
      for (let o of W) e >= o.min && (t = o);
      return {
        rank: t.rank,
        icon: t.icon
      }
    }
    let B = {
        currentChapter: 1,
        highestLevel: 1,
        totalCoins: 0,
        totalScore: 0,
        unlockedSkins: ["neon-green"],
        currentSkin: "neon-green",
        currentPet: "crystalGolem",
        unlockedPets: ["neonWolf", "crystalGolem"],
        currentPetSkin: "wolf-default",
        unlockedPetSkins: ["wolf-default"],
        gangMembersUnlocked: [],
        missionsCompleted: [],
        endlessHighScore: 0,
        endlessHighestWave: 0,
        totalKills: 0,
        totalDeaths: 0,
        lastSaveTime: 0,
        rankingData: {
          ...D
        },
        username: "NeonWarrior",
        avatar: "⚔️",
        about: "",
        nationality: "",
        unlockedSkills: [],
        equippedSkills: ["", "", ""],
        skillUpgrades: {},
        lastDailyRewardDay: "",
        dailyRewardStreak: 0,
        levelStars: {},
        weaponUpgrades: {},
        hasSeenTapToStart: !1,
        skinUpgrades: {}
      },
      G = [{
        id: 1,
        name: "FIRST STEPS",
        chapter: "CH.1",
        width: 2e3,
        height: 600,
        playerSpawn: {
          x: 80 + Math.floor(Math.random() * 40),
          y: 460
        },
        platforms: [{
          x: 0,
          y: 520,
          width: 2e3,
          height: 40,
          type: "static"
        }, {
          x: 400,
          y: 400,
          width: 120,
          height: 16,
          type: "static"
        }, {
          x: 800,
          y: 360,
          width: 120,
          height: 16,
          type: "static"
        }],
        waves: [{
          enemies: [{
            x: 600,
            y: 480,
            type: "drone"
          }],
          voiceLine: "Who took her... I'll find out."
        }],
        background: "city",
        introText: "They took LUNA. Blue wakes up alone in the neon city. Your journey begins.",
        introColor: n,
        missionType: "fight",
        gangMembersAvailable: []
      }, {
        id: 2,
        name: "LEARNING TO FIGHT",
        chapter: "CH.1",
        width: 2200,
        height: 600,
        playerSpawn: {
          x: 80 + Math.floor(Math.random() * 40),
          y: 460
        },
        platforms: [{
          x: 0,
          y: 520,
          width: 2200,
          height: 40,
          type: "static"
        }, {
          x: 500,
          y: 380,
          width: 120,
          height: 16,
          type: "static"
        }, {
          x: 1e3,
          y: 350,
          width: 120,
          height: 16,
          type: "static"
        }, {
          x: 1500,
          y: 400,
          width: 120,
          height: 16,
          type: "static"
        }],
        waves: [{
          enemies: [{
            x: 500,
            y: 480,
            type: "drone"
          }, {
            x: 700,
            y: 480,
            type: "drone"
          }],
          voiceLine: "More of them. I can handle this."
        }, {
          enemies: [{
            x: 1200,
            y: 480,
            type: "drone"
          }, {
            x: 1400,
            y: 480,
            type: "drone"
          }],
          voiceLine: "Luna... I'm coming."
        }],
        background: "city",
        introText: "The streets are crawling with Red King's drones. Fight through.",
        introColor: c,
        missionType: "fight",
        gangMembersAvailable: []
      }, {
        id: 3,
        name: "MEET SHADOW",
        chapter: "CH.2",
        width: 2400,
        height: 600,
        playerSpawn: {
          x: 80 + Math.floor(Math.random() * 40),
          y: 460
        },
        platforms: [{
          x: 0,
          y: 520,
          width: 2400,
          height: 40,
          type: "static"
        }, {
          x: 400,
          y: 400,
          width: 120,
          height: 16,
          type: "static"
        }, {
          x: 900,
          y: 360,
          width: 120,
          height: 16,
          type: "static"
        }, {
          x: 1400,
          y: 400,
          width: 120,
          height: 16,
          type: "static"
        }, {
          x: 1900,
          y: 350,
          width: 120,
          height: 16,
          type: "static"
        }],
        waves: [{
          enemies: [{
            x: 500,
            y: 480,
            type: "drone"
          }, {
            x: 700,
            y: 480,
            type: "drone"
          }, {
            x: 900,
            y: 480,
            type: "drone"
          }],
          voiceLine: "Someone's fighting ahead..."
        }, {
          enemies: [{
            x: 1300,
            y: 480,
            type: "drone"
          }, {
            x: 1500,
            y: 480,
            type: "glitchWalker"
          }],
          voiceLine: "That fighter... he's good."
        }],
        background: "warehouse",
        introText: "A lone fighter stands against Red King's army. His name is SHADOW.",
        introColor: h,
        missionType: "fight",
        gangMembersAvailable: []
      }, {
        id: 4,
        name: "THE WAREHOUSE",
        chapter: "CH.2",
        width: 2600,
        height: 600,
        playerSpawn: {
          x: 80 + Math.floor(Math.random() * 40),
          y: 460
        },
        platforms: [{
          x: 0,
          y: 520,
          width: 3e3,
          height: 40,
          type: "static"
        }, {
          x: 350,
          y: 380,
          width: 130,
          height: 16,
          type: "static"
        }, {
          x: 650,
          y: 320,
          width: 110,
          height: 16,
          type: "static"
        }, {
          x: 1e3,
          y: 400,
          width: 120,
          height: 16,
          type: "static"
        }, {
          x: 1400,
          y: 350,
          width: 100,
          height: 16,
          type: "moving",
          moveRange: 100,
          moveSpeed: 1.5,
          moveAxis: "x",
          moveOffset: 0
        }, {
          x: 1800,
          y: 380,
          width: 130,
          height: 16,
          type: "static"
        }, {
          x: 2200,
          y: 340,
          width: 110,
          height: 16,
          type: "static"
        }, {
          x: 2600,
          y: 390,
          width: 120,
          height: 16,
          type: "static"
        }],
        waves: [{
          enemies: [{
            x: 500,
            y: 480,
            type: "drone"
          }, {
            x: 650,
            y: 480,
            type: "glitchWalker"
          }],
          voiceLine: "Shadow, cover the left!"
        }, {
          enemies: [{
            x: 900,
            y: 480,
            type: "glitchWalker"
          }, {
            x: 1050,
            y: 480,
            type: "voidGuardian"
          }, {
            x: 1200,
            y: 480,
            type: "drone"
          }],
          voiceLine: "Turret up ahead!"
        }, {
          enemies: [{
            x: 1600,
            y: 480,
            type: "glitchWalker"
          }, {
            x: 1750,
            y: 480,
            type: "glitchWalker"
          }, {
            x: 1900,
            y: 480,
            type: "drone"
          }, {
            x: 2e3,
            y: 480,
            type: "drone"
          }],
          voiceLine: "The Blue Gang doesn't quit."
        }, {
          enemies: [{
            x: 2400,
            y: 480,
            type: "voidGuardian"
          }, {
            x: 2500,
            y: 480,
            type: "glitchWalker"
          }, {
            x: 2600,
            y: 480,
            type: "glitchWalker"
          }, {
            x: 2750,
            y: 480,
            type: "drone"
          }],
          voiceLine: "Warehouse is ours."
        }],
        background: "warehouse",
        introText: "Blue and Shadow raid Red King's weapons warehouse.",
        introColor: h,
        missionType: "fight",
        gangMembersAvailable: []
      }, {
        id: 5,
        name: "RESCUE MISSION",
        chapter: "CH.3",
        width: 2800,
        height: 600,
        playerSpawn: {
          x: 80 + Math.floor(Math.random() * 40),
          y: 460
        },
        platforms: [{
          x: 0,
          y: 520,
          width: 2800,
          height: 40,
          type: "static"
        }, {
          x: 400,
          y: 380,
          width: 120,
          height: 16,
          type: "static"
        }, {
          x: 700,
          y: 310,
          width: 110,
          height: 16,
          type: "static"
        }, {
          x: 1050,
          y: 390,
          width: 130,
          height: 16,
          type: "static"
        }, {
          x: 1500,
          y: 350,
          width: 100,
          height: 16,
          type: "static"
        }, {
          x: 1800,
          y: 300,
          width: 120,
          height: 16,
          type: "moving",
          moveRange: 120,
          moveSpeed: 1.5,
          moveAxis: "x",
          moveOffset: 0
        }, {
          x: 2200,
          y: 380,
          width: 100,
          height: 16,
          type: "static"
        }],
        waves: [{
          enemies: [{
            x: 500,
            y: 480,
            type: "glitchWalker"
          }, {
            x: 650,
            y: 480,
            type: "glitchWalker"
          }, {
            x: 800,
            y: 480,
            type: "voidGuardian"
          }],
          voiceLine: "Luna is close. I can feel it."
        }, {
          enemies: [{
            x: 1100,
            y: 480,
            type: "voidGuardian"
          }, {
            x: 1250,
            y: 480,
            type: "glitchWalker"
          }, {
            x: 1400,
            y: 480,
            type: "drone"
          }, {
            x: 1500,
            y: 480,
            type: "drone"
          }],
          voiceLine: "Nothing stops me now."
        }, {
          enemies: [{
            x: 1900,
            y: 480,
            type: "glitchWalker"
          }, {
            x: 2e3,
            y: 480,
            type: "glitchWalker"
          }, {
            x: 2100,
            y: 480,
            type: "voidGuardian"
          }],
          voiceLine: "Shadow, BLAZE — cover me!"
        }],
        background: "firewall",
        introText: "Luna is held in the Red King's fortress. The Blue Gang breaches the walls.",
        introColor: f,
        missionType: "rescue",
        gangMembersAvailable: []
      }, {
        id: 6,
        name: "RED KING'S THRONE",
        chapter: "CH.3",
        width: 2e3,
        height: 600,
        playerSpawn: {
          x: 80 + Math.floor(Math.random() * 40),
          y: 460
        },
        platforms: [{
          x: 0,
          y: 520,
          width: 800,
          height: 40,
          type: "static"
        }, {
          x: 900,
          y: 520,
          width: 1100,
          height: 40,
          type: "static"
        }, {
          x: 350,
          y: 380,
          width: 120,
          height: 16,
          type: "static"
        }, {
          x: 600,
          y: 310,
          width: 100,
          height: 16,
          type: "static"
        }, {
          x: 1200,
          y: 380,
          width: 130,
          height: 16,
          type: "static"
        }, {
          x: 1600,
          y: 330,
          width: 110,
          height: 16,
          type: "static"
        }],
        waves: [{
          enemies: [{
            x: 500,
            y: 480,
            type: "glitchWalker"
          }, {
            x: 650,
            y: 480,
            type: "drone"
          }],
          voiceLine: "The throne room. This is it."
        }],
        bossWave: {
          enemies: [{
            x: 1500,
            y: 480,
            type: "bossRedKing",
            bossName: "RED KING",
            bossColor: f
          }],
          voiceLine: "RED KING. Let her go. NOW."
        },
        background: "core",
        introText: "The Red King himself. Luna is behind him. This ends now.",
        introColor: i,
        missionType: "boss",
        gangMembersAvailable: []
      }, {
        id: 7,
        name: "PROTECT NEON",
        chapter: "CH.4",
        width: 2500,
        height: 600,
        playerSpawn: {
          x: 80 + Math.floor(Math.random() * 40),
          y: 460
        },
        platforms: [{
          x: 0,
          y: 520,
          width: 2500,
          height: 40,
          type: "static"
        }, {
          x: 300,
          y: 400,
          width: 120,
          height: 16,
          type: "static"
        }, {
          x: 600,
          y: 340,
          width: 100,
          height: 16,
          type: "static"
        }, {
          x: 900,
          y: 380,
          width: 130,
          height: 16,
          type: "static"
        }, {
          x: 1200,
          y: 350,
          width: 100,
          height: 16,
          type: "static"
        }, {
          x: 1600,
          y: 400,
          width: 120,
          height: 16,
          type: "moving",
          moveRange: 80,
          moveSpeed: 1.5,
          moveAxis: "x",
          moveOffset: 0
        }, {
          x: 2e3,
          y: 340,
          width: 110,
          height: 16,
          type: "static"
        }],
        waves: [{
          enemies: [{
            x: 400,
            y: 480,
            type: "glitchWalker"
          }, {
            x: 550,
            y: 480,
            type: "drone"
          }, {
            x: 700,
            y: 480,
            type: "drone"
          }],
          voiceLine: "They're coming for Mom. NOT happening."
        }, {
          enemies: [{
            x: 1e3,
            y: 480,
            type: "voidGuardian"
          }, {
            x: 1150,
            y: 480,
            type: "glitchWalker"
          }, {
            x: 1300,
            y: 480,
            type: "drone"
          }, {
            x: 1400,
            y: 480,
            type: "glitchWalker"
          }],
          voiceLine: "Gang, protect the left flank!"
        }, {
          enemies: [{
            x: 1800,
            y: 480,
            type: "glitchWalker"
          }, {
            x: 1900,
            y: 480,
            type: "glitchWalker"
          }, {
            x: 2e3,
            y: 480,
            type: "voidGuardian"
          }, {
            x: 2100,
            y: 480,
            type: "drone"
          }, {
            x: 2200,
            y: 480,
            type: "drone"
          }],
          voiceLine: "She's safe. The Gang protects its own."
        }],
        background: "city",
        introText: "Red King's army attacks Blue's mother NEON. Protect her at all costs.",
        introColor: x,
        missionType: "protect",
        gangMembersAvailable: []
      }, {
        id: 8,
        name: "THE FINAL WAR",
        chapter: "CH.5",
        width: 3500,
        height: 600,
        playerSpawn: {
          x: 80 + Math.floor(Math.random() * 40),
          y: 460
        },
        platforms: [{
          x: 0,
          y: 520,
          width: 3500,
          height: 40,
          type: "static"
        }, {
          x: 300,
          y: 380,
          width: 120,
          height: 16,
          type: "static"
        }, {
          x: 600,
          y: 310,
          width: 100,
          height: 16,
          type: "static"
        }, {
          x: 900,
          y: 380,
          width: 130,
          height: 16,
          type: "static"
        }, {
          x: 1300,
          y: 340,
          width: 110,
          height: 16,
          type: "moving",
          moveRange: 100,
          moveSpeed: 2,
          moveAxis: "x",
          moveOffset: 0
        }, {
          x: 1700,
          y: 370,
          width: 120,
          height: 16,
          type: "static"
        }, {
          x: 2100,
          y: 330,
          width: 100,
          height: 16,
          type: "static"
        }, {
          x: 2400,
          y: 380,
          width: 130,
          height: 16,
          type: "static"
        }, {
          x: 2800,
          y: 340,
          width: 110,
          height: 16,
          type: "static"
        }],
        waves: [{
          enemies: [{
            x: 500,
            y: 480,
            type: "glitchWalker"
          }, {
            x: 600,
            y: 480,
            type: "drone"
          }, {
            x: 700,
            y: 480,
            type: "drone"
          }, {
            x: 800,
            y: 480,
            type: "voidGuardian"
          }],
          voiceLine: "The final war. EVERYONE fights!"
        }, {
          enemies: [{
            x: 1200,
            y: 480,
            type: "voidGuardian"
          }, {
            x: 1350,
            y: 480,
            type: "glitchWalker"
          }, {
            x: 1500,
            y: 480,
            type: "glitchWalker"
          }, {
            x: 1600,
            y: 480,
            type: "drone"
          }, {
            x: 1700,
            y: 480,
            type: "drone"
          }],
          voiceLine: "Blue Gang, UNLEASH!"
        }, {
          enemies: [{
            x: 2200,
            y: 480,
            type: "glitchWalker"
          }, {
            x: 2300,
            y: 480,
            type: "voidGuardian"
          }, {
            x: 2400,
            y: 480,
            type: "glitchWalker"
          }, {
            x: 2500,
            y: 480,
            type: "drone"
          }],
          voiceLine: "Push them back!"
        }],
        bossWave: {
          enemies: [{
            x: 3e3,
            y: 480,
            type: "bossTitan",
            bossName: "THE TITAN",
            bossColor: "#ff0000"
          }],
          voiceLine: "This is for EVERYONE you hurt. OVERLOAD!"
        },
        background: "core",
        introText: "THE FINAL WAR. The Blue Gang vs Red King's entire army. No retreat.",
        introColor: m,
        missionType: "boss",
        gangMembersAvailable: []
      }],
      $ = {
        6: "THE INFINITE GRID",
        7: "DRAGON'S DOMAIN",
        8: "MECH WARFARE",
        9: "SHADOW REALM",
        10: "PHOENIX RISING",
        11: "THE VOID AWAKENS",
        12: "CORRUPTED KINGDOM",
        13: "NEON APOCALYPSE",
        14: "THE FINAL FRONTIER",
        15: "ETERNAL WAR"
      },
      F = {
        1: "ch1-intro",
        10: "ch2-intro",
        20: "ch3-intro",
        30: "lv20-luna",
        40: "lv40-mother",
        50: "lv50-void",
        60: "ch4-intro",
        70: "lv70-betrayal",
        80: "lv80-truth",
        90: "lv90-final",
        100: "lv100-turning",
        110: "ch5-intro",
        120: "ch1-intro",
        130: "ch2-intro",
        140: "ch3-intro",
        150: "ch4-intro",
        160: "ch5-intro",
        170: "ch1-intro",
        180: "ch2-intro",
        190: "ch3-intro",
        200: "ch4-intro",
        210: "ch5-intro",
        220: "ch1-intro",
        230: "ch2-intro",
        240: "ch3-intro",
        250: "lv250-father"
      },
      H = {
        5: {
          type: "ambush",
          text: "BEHIND YOU!",
          color: f,
          spawnEnemies: ["glitchWalker", "drone"],
          enemyCount: 4,
          duration: 120
        },
        15: {
          type: "thugsAppear",
          text: "THUGS BLOCKING THE PATH!",
          color: c,
          spawnEnemies: ["glitchWalker"],
          enemyCount: 5,
          duration: 120
        },
        25: {
          type: "allyArrives",
          text: 'SHADOW: "Need a hand?"',
          color: h,
          spawnEnemies: [],
          duration: 150
        },
        35: {
          type: "trapTriggered",
          text: "THE FLOOR IS COLLAPSING!",
          color: f,
          spawnEnemies: [],
          duration: 90
        },
        45: {
          type: "voidRift",
          text: "A VOID RIFT! SOMETHING IS COMING THROUGH!",
          color: i,
          spawnEnemies: ["voidGuardian"],
          enemyCount: 3,
          duration: 120
        },
        55: {
          type: "betrayal",
          text: "WAIT... WHOSE SIDE ARE YOU ON?!",
          color: c,
          spawnEnemies: ["eliteDrone"],
          enemyCount: 3,
          duration: 150
        },
        65: {
          type: "rescue",
          text: "SOMEONE IS TRAPPED AHEAD! SAVE THEM!",
          color: x,
          spawnEnemies: [],
          duration: 150
        },
        75: {
          type: "bossSurprise",
          text: "A HIDDEN BOSS AWAKENS!",
          color: f,
          spawnEnemies: ["bossCorrupted"],
          enemyCount: 1,
          duration: 180
        },
        85: {
          type: "flashback",
          text: "Blue sees his father's memory...",
          color: n,
          spawnEnemies: [],
          duration: 120
        },
        95: {
          type: "earthquake",
          text: "THE GRID IS SHAKING! PLATFORMS SHIFTING!",
          color: m,
          spawnEnemies: [],
          duration: 90
        }
      };

    function U(e) {
      let t, o, a, l, r = V(e),
        d = Math.min(Math.floor((e - 1) / 100) + 6, 200),
        u = $[d] ? $[d] : `ZONE ${d}`;
      t = e <= 3 ? 2700 + 150 * e : e <= 10 ? 3e3 + 75 * e : e <= 50 ? 3750 + (e - 10) * 75 : e <= 200 ? 6750 + (e -
        50) * 45 : Math.min(13500 + (e - 200) * 30, 3e4);
      let x = [],
        g = [],
        y = 0,
        b = e > 50 && r() > .6;
      for (; y < t;) {
        let e = 200 + Math.floor(400 * r());
        g.push({
          x: y,
          y: 520,
          width: e,
          height: 40,
          type: "static"
        }), y += e, b && r() > .6 && y > 300 && y < t - 300 && (y += 80 + Math.floor(60 * r()))
      }
      x.push(...g), o = e <= 10 ? 2 : e <= 30 ? 2 + Math.floor(2 * r()) : e <= 50 ? 3 + Math.floor(2 * r()) : e <=
        200 ? 4 + Math.floor(2 * r()) : 5 + Math.floor(Math.min(e / 100, 8));
      for (let e = 0; e < o; e++) {
        let e = 200 + Math.floor(r() * (t - 400)),
          o = 280 + Math.floor(180 * r()),
          a = 80 + Math.floor(80 * r()),
          l = r() > .7;
        x.push({
          x: e,
          y: o,
          width: a,
          height: 16,
          type: l ? "moving" : "static",
          ...l ? {
            moveRange: 60 + Math.floor(60 * r()),
            moveSpeed: .8 + 1.5 * r(),
            moveAxis: "x",
            moveOffset: 0
          } : {}
        })
      }
      a = e <= 3 || e <= 5 ? 1 : e <= 10 || e <= 30 ? 2 : e <= 50 ? 2 + Math.floor(2 * r()) : e <= 100 ? 3 + Math
        .floor(2 * r()) : e <= 200 ? 5 + Math.floor(3 * r()) : e <= 500 ? 7 + Math.floor(4 * r()) : 10 + Math.floor(
          5 * r());
      let v = [],
        w = [];
      e <= 15 ? w.push("drone") : e <= 30 ? w.push("drone", "glitchWalker") : e <= 50 ? w.push("drone", "drone",
          "glitchWalker", "voidGuardian") : w.push("drone", "glitchWalker", "voidGuardian"), e >= 50 && w.push(
          "shadowAssassin", "eliteDrone"), e >= 80 && w.push("dragon"), e >= 100 && w.push("voidBat", "stormEagle",
          "emberWisp", "zombie"), e >= 150 && w.push("frostWraith", "shadowDrake", "plasmaSerpent", "giant"), e >=
        200 && w.push("neonWyrm", "crystalMoth", "necromancer"), e >= 300 && w.push("mechGolem"), e >= 400 && w
        .push("phoenix"), e >= 500 && w.push("bomber"), e >= 700 && w.push("heavyWalker");
      let k = ["Stay focused. They're coming.", "Another wave... bring it.", "We've come too far to stop now.",
          "This zone is crawling with them.", "Keep pushing. Don't look back.", "They think they can stop us?",
          "For Luna. For everyone.", "This is getting intense...", "We will beat the Red King!",
          "I can do this all day.", "The Grid trembles before us.", "No retreat. No surrender.",
          "I am the Neon Stickman. I don't go dark.", "Every battle makes me stronger.",
          "This realm will know my name."
        ],
        C = `Level ${e} — ${u}`;
      e % 100 == 1 && (C = `CHAPTER ${d}: ${u} — A new frontier awaits!`);
      for (let o = 0; o < a; o++) {
        let l;
        l = e <= 3 ? 1 : e <= 5 ? 1 + Math.floor(+r()) : e <= 10 ? 1 + Math.floor(2 * r()) : e <= 30 ? 2 + Math
          .floor(+r()) : e <= 50 ? 2 + Math.floor(2 * r()) : e <= 100 ? 4 + Math.floor(3 * r()) : e <= 200 ? 5 +
          Math.floor(4 * r()) : e <= 500 ? 7 + Math.floor(5 * r()) : 10 + Math.floor(6 * r());
        let n = 300 + Math.floor(o / a * (t - 800)),
          i = n + Math.floor((t - 800) / a),
          s = [];
        for (let e = 0; e < l; e++) {
          let e = w[Math.floor(r() * w.length)],
            t = E(e);
          s.push({
            x: n + Math.floor(r() * (i - n)),
            y: t ? 150 + Math.floor(200 * r()) : 480,
            type: e
          })
        }
        v.push({
          enemies: s,
          voiceLine: 0 === o ? k[Math.floor(r() * k.length)] : void 0
        })
      }
      let S = e >= 50 && e % 10 == 0,
        T = e >= 100 && e % 50 == 0;
      if (S || T)
        if (100 === e) l = {
          enemies: [{
            x: t - 400,
            y: 480,
            type: "bossTwin",
            bossName: "YOUR TWIN BROTHER",
            bossColor: p
          }],
          voiceLine: "You... you look just like me!"
        };
        else {
          let e = ["bossRedKing", "bossTitan", "bossCorrupted", "bossDragon", "bossPhoenix", "bossMechGolem",
              "bossFather", "bossTwin"
            ],
            o = e[Math.floor(r() * e.length)],
            a = ["CORRUPTED KING", "THE ABYSS", "VOID EMPEROR", "DARK TITAN", "SHADOW LORD", "PLASMA REAPER",
              "NEON DEVOURER", "THE INFINITE", "DRAGON KING", "PHOENIX LORD", "MECH OVERLORD", "VOID SERPENT",
              "CHROME REAPER", "THE HUNGRY DARK", "IRON JUGGERNAUT", "PHANTOM WYRM", "CRYSTAL TYRANT",
              "THE NAMELESS", "STORM BRINGER", "DOOM WEAVER", "FATHER", "THE PATRIARCH", "BLUE'S FATHER",
              "YOUR TWIN"
            ],
            s = [f, h, i, c, "#ff0044", "#8800ff", m, n, p];
          l = {
            enemies: [{
              x: t - 400,
              y: 480,
              type: o,
              bossName: a[Math.floor(r() * a.length)],
              bossColor: s[Math.floor(r() * s.length)]
            }],
            voiceLine: "This ends NOW!"
          }
        } let M = ["city", "corrupted", "firewall", "warehouse", "rooftop", "void", "core", "grid"],
        j = M[Math.floor(r() * M.length)],
        N = ["fight", "fight", "fight", "rescue", "protect", "escape"],
        P = S || T ? "boss" : N[Math.floor(r() * N.length)],
        A = ["NEON ALLEY", "DARK CORRIDOR", "FIRE ZONE", "VOID SECTOR", "CORRUPTED PATH", "GRID MAZE",
          "SHADOW TUNNEL", "CRYSTAL CAVE", "PLASMA BRIDGE", "DEATH ROW", "BURNING HALL", "FROZEN GATE", "THE ABYSS",
          "CHASM WALK", "IRON GAUNTLET", "TOXIC DRAIN", "DATA STREAM", "GLITCH HIGHWAY", "RENDER ZONE", "DEEP CORE",
          "DRAGON'S LAIR", "MECH FACTORY", "PHOENIX NEST", "SHADOW CITADEL", "CHROME WASTES", "EMBER FIELDS",
          "FROST SPIRE", "VOLT ARENA", "SILENT RUINS", "WARP TUNNEL", "PHANTOM GATE", "NEON CATHEDRAL",
          "BLOOD GRID", "SOUL REEF", "NULL ZONE"
        ],
        R = A[Math.floor(r() * A.length)],
        I = ["neonSign", "brokenPillar", "glitchCrystal", "voidRift", "dataStream"],
        L = 3 + Math.floor(6 * r()),
        D = [];
      for (let e = 0; e < L; e++) D.push({
        x: 100 + Math.floor(r() * (t - 200)),
        y: 350 + Math.floor(150 * r()),
        type: I[Math.floor(r() * I.length)]
      });
      let W = ["none", "none", "rain", "snow", "glitch", "embers", "voidParticles"],
        O = W[Math.floor(r() * W.length)];
      return {
        id: e,
        name: R,
        chapter: `CH.${d}`,
        width: t,
        height: 600,
        playerSpawn: {
          x: 80 + Math.floor(Math.random() * 40),
          y: 460
        },
        platforms: x,
        waves: v,
        bossWave: l,
        background: j,
        introText: C,
        introColor: [n, c, i, h, s, m][Math.floor(6 * r())],
        missionType: P,
        gangMembersAvailable: [],
        isProcedural: !0,
        environmentalObjects: D,
        weatherType: O
      }
    }

    function V(e) {
      let t = 9301 * e + 49297;
      return () => (t = (9301 * t + 49297) % 233280) / 233280
    }
    let z = {
        "ch1-intro": {
          id: "ch1-intro",
          frames: [{
            scene: "cityPan",
            dialogue: "",
            speaker: "NARRATOR",
            speakerColor: c,
            duration: 180
          }, {
            scene: "kidnapping",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 180
          }, {
            scene: "blueWakes",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 150
          }]
        },
        "ch2-intro": {
          id: "ch2-intro",
          frames: [{
            scene: "warScene",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 150
          }, {
            scene: "shadowAppears",
            dialogue: "",
            speaker: "SHADOW",
            speakerColor: h,
            duration: 180
          }, {
            scene: "handshake",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 150
          }]
        },
        "ch2-blaze": {
          id: "ch2-blaze",
          frames: [{
            scene: "warScene",
            dialogue: "",
            speaker: "BLAZE",
            speakerColor: c,
            duration: 180
          }, {
            scene: "gangJoin",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 120
          }]
        },
        "ch3-intro": {
          id: "ch3-intro",
          frames: [{
            scene: "lunaCaptured",
            dialogue: "",
            speaker: "SHADOW",
            speakerColor: h,
            duration: 150
          }, {
            scene: "blueAngry",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 150
          }]
        },
        "ch3-rescue": {
          id: "ch3-rescue",
          frames: [{
            scene: "reunion",
            dialogue: "",
            speaker: "LUNA",
            speakerColor: x,
            duration: 150
          }, {
            scene: "blueSeesLuna",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 150
          }]
        },
        "ch4-intro": {
          id: "ch4-intro",
          frames: [{
            scene: "motherThreat",
            dialogue: "",
            speaker: "VOLT",
            speakerColor: d,
            duration: 180
          }, {
            scene: "protectMother",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: f,
            duration: 150
          }]
        },
        "ch5-intro": {
          id: "ch5-intro",
          frames: [{
            scene: "warScene",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: m,
            duration: 180
          }, {
            scene: "gangForming",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: m,
            duration: 180
          }]
        },
        victory: {
          id: "victory",
          frames: [{
            scene: "bossDefeated",
            dialogue: "",
            speaker: "SHADOW",
            speakerColor: h,
            duration: 150
          }, {
            scene: "victoryCelebration",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 180
          }, {
            scene: "reunion",
            dialogue: "",
            speaker: "LUNA",
            speakerColor: x,
            duration: 120
          }]
        },
        revive: {
          id: "revive",
          frames: [{
            scene: "blueWakes",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 120
          }]
        },
        "lv10-revelation": {
          id: "lv10-revelation",
          frames: [{
            scene: "darkRevelation",
            dialogue: "",
            speaker: "VOLT",
            speakerColor: d,
            duration: 200
          }, {
            scene: "flashback",
            dialogue: "",
            speaker: "VOLT",
            speakerColor: d,
            duration: 200
          }, {
            scene: "darkCorridor",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 180
          }, {
            scene: "redKingPlan",
            dialogue: "",
            speaker: "SHADOW",
            speakerColor: h,
            duration: 180
          }]
        },
        "lv20-luna": {
          id: "lv20-luna",
          frames: [{
            scene: "lunaVision",
            dialogue: "",
            speaker: "LUNA",
            speakerColor: x,
            duration: 200
          }, {
            scene: "lunaVision",
            dialogue: "",
            speaker: "LUNA",
            speakerColor: x,
            duration: 200
          }, {
            scene: "mysteryFigure",
            dialogue: "",
            speaker: "SHADOW",
            speakerColor: h,
            duration: 180
          }]
        },
        "lv30-shadow": {
          id: "lv30-shadow",
          frames: [{
            scene: "shadowPast",
            dialogue: "",
            speaker: "SHADOW",
            speakerColor: h,
            duration: 200
          }, {
            scene: "betrayal",
            dialogue: "",
            speaker: "SHADOW",
            speakerColor: h,
            duration: 200
          }, {
            scene: "darkRevelation",
            dialogue: "",
            speaker: "SHADOW",
            speakerColor: h,
            duration: 180
          }, {
            scene: "gangOath",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 150
          }]
        },
        "lv40-mother": {
          id: "lv40-mother",
          frames: [{
            scene: "motherSecret",
            dialogue: "",
            speaker: "NEON",
            speakerColor: "#44ddaa",
            duration: 200
          }, {
            scene: "flashback",
            dialogue: "Your father was the First Guardian. He built the Grid. And the Red King... was his partner.",
            speaker: "NEON",
            speakerColor: "#44ddaa",
            duration: 220
          }, {
            scene: "darkRevelation",
            dialogue: "",
            speaker: "NEON",
            speakerColor: "#44ddaa",
            duration: 200
          }, {
            scene: "blueAngry",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: f,
            duration: 180
          }]
        },
        "lv50-void": {
          id: "lv50-void",
          frames: [{
            scene: "voidRift",
            dialogue: "",
            speaker: "BLAZE",
            speakerColor: c,
            duration: 180
          }, {
            scene: "explosion",
            dialogue: "The Void... it's bleeding into our world. The Red King tore the fabric of the Grid!",
            speaker: "VOLT",
            speakerColor: d,
            duration: 200
          }, {
            scene: "mysteryFigure",
            dialogue: "",
            speaker: "ICE",
            speakerColor: "#44ddff",
            duration: 180
          }, {
            scene: "stormApproaching",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: m,
            duration: 200
          }]
        },
        "lv60-deal": {
          id: "lv60-deal",
          frames: [{
            scene: "hiddenBase",
            dialogue: "",
            speaker: "LUNA",
            speakerColor: x,
            duration: 200
          }, {
            scene: "theDeal",
            dialogue: "I can enter the Void Rift. Merge with the Grid's core. But I might not come back.",
            speaker: "LUNA",
            speakerColor: x,
            duration: 200
          }, {
            scene: "silentPrayer",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 180
          }, {
            scene: "sacrifice",
            dialogue: "If it saves everyone... including you... I'll do it. With or without your permission.",
            speaker: "LUNA",
            speakerColor: x,
            duration: 200
          }]
        },
        "lv70-betrayal": {
          id: "lv70-betrayal",
          frames: [{
            scene: "darkCorridor",
            dialogue: "",
            speaker: "SHADOW",
            speakerColor: h,
            duration: 200
          }, {
            scene: "betrayal",
            dialogue: "",
            speaker: "???",
            speakerColor: c,
            duration: 200
          }, {
            scene: "lastStand",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: f,
            duration: 180
          }, {
            scene: "gangOath",
            dialogue: "",
            speaker: "SHADOW",
            speakerColor: h,
            duration: 180
          }]
        },
        "lv80-truth": {
          id: "lv80-truth",
          frames: [{
            scene: "truthRevealed",
            dialogue: "",
            speaker: "LUNA",
            speakerColor: x,
            duration: 220
          }, {
            scene: "voidRift",
            dialogue: "",
            speaker: "VOLT",
            speakerColor: d,
            duration: 200
          }, {
            scene: "flashback",
            dialogue: "My father created the Grid as a sanctuary. For everyone. The Red King turned it into a prison.",
            speaker: "BLUE",
            speakerColor: n,
            duration: 200
          }, {
            scene: "gangOath",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: m,
            duration: 180
          }]
        },
        "lv90-final": {
          id: "lv90-final",
          frames: [{
            scene: "hiddenBase",
            dialogue: "",
            speaker: "SHADOW",
            speakerColor: h,
            duration: 180
          }, {
            scene: "gangForming",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: m,
            duration: 200
          }, {
            scene: "silentPrayer",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 200
          }, {
            scene: "newDawn",
            dialogue: "",
            speaker: "LUNA",
            speakerColor: x,
            duration: 180
          }]
        },
        "lv100-turning": {
          id: "lv100-turning",
          frames: [{
            scene: "bossDefeated",
            dialogue: "",
            speaker: "SHADOW",
            speakerColor: h,
            duration: 200
          }, {
            scene: "voidRift",
            dialogue: "Something is coming THROUGH the rift. Something that makes the Red King look like nothing.",
            speaker: "VOLT",
            speakerColor: d,
            duration: 200
          }, {
            scene: "mysteryFigure",
            dialogue: "",
            speaker: "???",
            speakerColor: "#ff0044",
            duration: 220
          }, {
            scene: "stormApproaching",
            dialogue: "A new enemy. A bigger war. But the Blue Gang doesn't surrender. We just fight HARDER.",
            speaker: "BLUE",
            speakerColor: m,
            duration: 200
          }]
        },
        "boss-redking-intro": {
          id: "boss-redking-intro",
          frames: [{
            scene: "bossIntro",
            dialogue: "",
            speaker: "RED KING",
            speakerColor: f,
            duration: 180
          }, {
            scene: "bossIntro",
            dialogue: "",
            speaker: "RED KING",
            speakerColor: f,
            duration: 200
          }, {
            scene: "blueAngry",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 180
          }]
        },
        "boss-dragon-intro": {
          id: "boss-dragon-intro",
          frames: [{
            scene: "bossIntro",
            dialogue: "",
            speaker: "NARRATOR",
            speakerColor: c,
            duration: 180
          }, {
            scene: "bossIntro",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 200
          }]
        },
        "boss-phoenix-intro": {
          id: "boss-phoenix-intro",
          frames: [{
            scene: "bossIntro",
            dialogue: "",
            speaker: "NARRATOR",
            speakerColor: c,
            duration: 180
          }, {
            scene: "bossIntro",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 180
          }]
        },
        "boss-mechgolem-intro": {
          id: "boss-mechgolem-intro",
          frames: [{
            scene: "bossIntro",
            dialogue: "",
            speaker: "NARRATOR",
            speakerColor: c,
            duration: 180
          }, {
            scene: "bossIntro",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 180
          }]
        },
        "boss-corrupted-intro": {
          id: "boss-corrupted-intro",
          frames: [{
            scene: "bossIntro",
            dialogue: "",
            speaker: "VOLT",
            speakerColor: d,
            duration: 200
          }, {
            scene: "bossIntro",
            dialogue: "",
            speaker: "SHADOW",
            speakerColor: h,
            duration: 180
          }]
        },
        "boss-father-intro": {
          id: "boss-father-intro",
          frames: [{
            scene: "darkCorridor",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 200
          }, {
            scene: "bossIntro",
            dialogue: "",
            speaker: "FATHER",
            speakerColor: "#44aaff",
            duration: 220
          }, {
            scene: "blueAngry",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: f,
            duration: 200
          }]
        },
        "boss-twin-intro": {
          id: "boss-twin-intro",
          frames: [{
            scene: "bossIntro",
            dialogue: "",
            speaker: "BLAZE",
            speakerColor: c,
            duration: 180
          }, {
            scene: "bossIntro",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 180
          }]
        },
        "boss-generic-defeated": {
          id: "boss-generic-defeated",
          frames: [{
            scene: "bossDefeated",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 150
          }, {
            scene: "victoryCelebration",
            dialogue: "",
            speaker: "SHADOW",
            speakerColor: h,
            duration: 150
          }]
        },
        "boss-redking-defeated": {
          id: "boss-redking-defeated",
          frames: [{
            scene: "bossDefeated",
            dialogue: "",
            speaker: "RED KING",
            speakerColor: f,
            duration: 200
          }, {
            scene: "bossDefeated",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 200
          }, {
            scene: "victoryCelebration",
            dialogue: "",
            speaker: "BLAZE",
            speakerColor: c,
            duration: 180
          }]
        },
        "boss-father-defeated": {
          id: "boss-father-defeated",
          frames: [{
            scene: "bossDefeated",
            dialogue: "",
            speaker: "FATHER",
            speakerColor: "#44aaff",
            duration: 220
          }, {
            scene: "silentPrayer",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 200
          }, {
            scene: "bossDefeated",
            dialogue: "",
            speaker: "FATHER",
            speakerColor: "#44aaff",
            duration: 220
          }]
        },
        "rescue-luna": {
          id: "rescue-luna",
          frames: [{
            scene: "lunaCaptured",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 150
          }, {
            scene: "reunion",
            dialogue: "",
            speaker: "LUNA",
            speakerColor: x,
            duration: 180
          }, {
            scene: "reunion",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 180
          }]
        },
        "rescue-mother": {
          id: "rescue-mother",
          frames: [{
            scene: "protectMother",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 180
          }, {
            scene: "protectMother",
            dialogue: "",
            speaker: "NEON",
            speakerColor: "#44ddaa",
            duration: 200
          }, {
            scene: "protectMother",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: n,
            duration: 180
          }]
        },
        "rescue-villagers": {
          id: "rescue-villagers",
          frames: [{
            scene: "walking",
            dialogue: "",
            speaker: "SHADOW",
            speakerColor: h,
            duration: 180
          }, {
            scene: "gangForming",
            dialogue: "",
            speaker: "BLUE",
            speakerColor: m,
            duration: 200
          }]
        }
      },
      _ = {
        kill: ["Deleted.", "Stay down.", "One less.", "Crashed.", "Lights out.", "Too slow.", "Dust.", "Erased."],
        damage: ["That all you got?", "Just a scratch.", "Not today.", "I've had worse.", "Tickles.",
          "Keep coming."],
        waveClear: ["Zone secured.", "Moving up.", "Area clear.", "Next.", "Too easy.", "Onward."],
        dash: ["Too fast.", "Can't touch this.", "Gone.", "Blurred."],
        shield: ["Blocked.", "Nope.", "Nice try.", "Not even close."],
        special: ["OVERLOAD!", "BURN IT DOWN!", "LIGHT 'EM UP!", "UNLEASH THE GRID!", "MAXIMUM POWER!"],
        gang: ["Gang, attack!", "Together!", "Blue Gang never quits!", "Crew assemble!"],
        rescue: ["Luna, I'm coming!", "Hold on!", "I'll find you!", "Hang in there!"],
        protect: ["Not touching her!", "Stay back from Mom!", "Over my dead body!", "Shield up!"],
        dramatic: ["Reinforcements have arrived!", "We will beat the Red King!", "Stay with me, partner!",
          "This ends NOW!", "They think they can break us?", "NOT TODAY!", "I am NOT done yet!",
          "For EVERYONE you hurt!", "The Grid fights with me!", "I AM the storm!"
        ],
        bossEnrage: ["You're only making me ANGRY!", "Is that ALL you've got?!", "NOW you'll see REAL power!",
          "You woke the WRONG stickman!"
        ],
        pet: ["Good boy!", "Get 'em!", "Atta boy!", "Nice shot, partner!"],
        dragon: ["A DRAGON! Bring it down!", "Fire can't stop me!", "Dragon slayer incoming!"],
        phoenix: ["It rises from the ashes?!", "Burn again, bird!", "Phoenix down!"],
        mechGolem: ["Tin can incoming!", "Dismantle it!", "Mech detected — engaging!"],
        shadowAssassin: ["I can barely see it!", "Show yourself!", "Shadows can't hide from me!"],
        voidBat: ["Bats from the void!", "Fast little nightmares!", "They come from the dark!"],
        stormEagle: ["Lightning bird incoming!", "That eagle's charged up!", "Storm wings above!"],
        emberWisp: ["Fire spirits! Watch out!", "Those wisps burn!", "Floating flames!"],
        frostWraith: ["Ice ghost detected!", "It's freezing in here!", "A cold wind rises!"],
        shadowDrake: ["Shadow dragon approaches!", "The darkness has teeth!", "That drake is not natural!"],
        plasmaSerpent: ["Energy serpent spotted!", "It's made of pure plasma!",
          "That snake electrifies everything!"],
        neonWyrm: ["THE WYRM! Look at the size of it!", "Neon wyrm! Stay clear!", "That thing is massive!"],
        crystalMoth: ["Crystal moths? Beautiful but deadly!", "Those wings are sharp!",
          "Don't let it shimmer close!"
        ]
      },
      K = "neonStickman_save_v4",
      q = !1;
    async function Y(t) {
      if (q) try {
        let {
          uploadSaveToCloud: o
        } = await e.A(66060);
        if (await o(t)) try {
          let {
            logAnalyticsEvent: o
          } = await e.A(76207);
          o("cloud_sync", {
            level: t.highestLevel,
            coins: t.totalCoins
          })
        } catch {}
      } catch {}
    }

    function J() {
      try {
        let e = localStorage.getItem(K);
        if (!e) return {
          ...B,
          rankingData: {
            ...D
          }
        };
        let t = JSON.parse(e),
          o = t.unlockedSkins || ["neon-green"];
        o.includes("neon-green") || o.push("neon-green");
        let a = "default" === t.currentSkin ? "neon-green" : t.currentSkin || "neon-green";
        return {
          ...B,
          ...t,
          unlockedSkins: o,
          currentSkin: a,
          rankingData: {
            ...D,
            ...t.rankingData || {}
          },
          unlockedPets: t.unlockedPets || ["neonWolf"],
          unlockedPetSkins: t.unlockedPetSkins || ["wolf-default"],
          username: t.username || B.username,
          avatar: t.avatar || B.avatar,
          about: t.about ?? B.about,
          nationality: t.nationality ?? B.nationality,
          unlockedSkills: t.unlockedSkills ?? B.unlockedSkills,
          equippedSkills: (t.equippedSkills ?? B.equippedSkills).slice(0, 3).concat(["", "", ""]).slice(0, 3),
          skillUpgrades: t.skillUpgrades ?? B.skillUpgrades,
          lastDailyRewardDay: t.lastDailyRewardDay ?? B.lastDailyRewardDay,
          dailyRewardStreak: t.dailyRewardStreak ?? B.dailyRewardStreak,
          levelStars: t.levelStars ?? B.levelStars,
          weaponUpgrades: t.weaponUpgrades ?? B.weaponUpgrades,
          hasSeenTapToStart: t.hasSeenTapToStart ?? B.hasSeenTapToStart,
          skinUpgrades: t.skinUpgrades ?? B.skinUpgrades,
          gangMembersUnlocked: t.gangMembersUnlocked ?? B.gangMembersUnlocked,
          missionsCompleted: t.missionsCompleted ?? B.missionsCompleted
        }
      } catch {
        return {
          ...B,
          rankingData: {
            ...D
          }
        }
      }
    }

    function Z(e) {
      try {
        e.lastSaveTime = Date.now(), localStorage.setItem(K, JSON.stringify(e)), Y(e)
      } catch {}
    }

    function X(e, t) {
      return {
        ...e,
        totalCoins: e.totalCoins + t
      }
    }

    function Q(e) {
      let t = new Date().toISOString().split("T")[0];
      return e.lastDailyRewardDay !== t
    }
    let ee = {
        masterVolume: .7,
        sfxVolume: .8,
        musicVolume: .5,
        musicEnabled: !0,
        sfxEnabled: !0
      },
      et = "neonStickman_sound_v1",
      eo = new class {
        ctx = null;
        masterGain = null;
        sfxGain = null;
        musicGain = null;
        musicPlaying = !1;
        bossMusicPlaying = !1;
        menuMusicPlaying = !1;
        musicInterval = null;
        bossMusicInterval = null;
        menuMusicInterval = null;
        noiseBuffer = null;
        shortNoiseBuffer = null;
        lastSfxTime = {};
        SFX_THROTTLE_MS = 50;
        activeNodeCount = 0;
        MAX_ACTIVE_NODES = 30;
        lastResumeTime = 0;
        RESUME_THROTTLE_MS = 500;
        masterVolume = .7;
        sfxVolume = .8;
        musicVolume = .5;
        musicEnabled = !0;
        sfxEnabled = !0;
        init() {
          if (!this.ctx) try {
            this.ctx = new AudioContext, this.masterGain = this.ctx.createGain(), this.masterGain.gain.value =
              this.masterVolume, this.masterGain.connect(this.ctx.destination), this.sfxGain = this.ctx
              .createGain(), this.sfxGain.gain.value = this.sfxVolume, this.sfxGain.connect(this.masterGain),
              this.musicGain = this.ctx.createGain(), this.musicGain.gain.value = this.musicVolume, this
              .musicGain.connect(this.masterGain), this.noiseBuffer = this.createNoiseBuffer(4410), this
