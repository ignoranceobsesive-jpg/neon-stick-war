            break;
          case "holy":
            e.globalAlpha = .15 + .08 * Math.sin(.06 * r), e.fillStyle = "#ffdd44", e.shadowBlur = 30, e
              .shadowColor = "#ffdd44", e.beginPath(), e.arc(0, -20 * s, 35 * s, 0, 2 * Math.PI), e.fill(), e
              .globalAlpha = .1, e.strokeStyle = "#ffdd44", e.lineWidth = 1.5 * s;
            for (let t = 0; t < 6; t++) {
              let o = t / 6 * Math.PI * 2 + .01 * r;
              e.beginPath(), e.moveTo(20 * Math.cos(o) * s, -20 * s + 20 * Math.sin(o) * s), e.lineTo(45 * Math.cos(
                o) * s, -20 * s + 45 * Math.sin(o) * s), e.stroke()
            }
            e.globalAlpha = .3, e.strokeStyle = "#ffdd44", e.lineWidth = 1.5 * s, e.beginPath(), e.ellipse(0, -50 *
              s, 10 * s, 3 * s, 0, 0, 2 * Math.PI), e.stroke();
            break;
          case "abyss":
            e.globalAlpha = .15 + .08 * Math.sin(.08 * r), e.fillStyle = "#220044", e.shadowBlur = 25, e
              .shadowColor = "#440088", e.beginPath(), e.arc(0, -20 * s, 32 * s, 0, 2 * Math.PI), e.fill(), e
              .globalAlpha = .3, e.strokeStyle = "#6600aa", e.lineWidth = 1.5 * s;
            for (let t = 0; t < 4; t++) {
              let o = t / 4 * Math.PI * 2 + .03 * r;
              e.beginPath(), e.moveTo(12 * Math.cos(o) * s, -20 * s + 12 * Math.sin(o) * s);
              let a = 22 * Math.cos(o + .3) * s,
                l = -20 * s + 22 * Math.sin(o + .3) * s,
                n = 30 * Math.cos(o + .5) * s,
                i = -20 * s + 30 * Math.sin(o + .5) * s;
              e.quadraticCurveTo(a, l, n, i), e.stroke()
            }
            break;
          case "glitch": {
            e.globalAlpha = .15, e.strokeStyle = "#ff0000", e.lineWidth = 2 * s;
            let t = 3 * Math.sin(.5 * r) * s;
            e.beginPath(), e.arc(t, -38 * s, 9 * s, 0, 2 * Math.PI), e.stroke(), e.strokeStyle = "#00ff00", e
              .beginPath(), e.arc(-t, -38 * s, 9 * s, 0, 2 * Math.PI), e.stroke(), r % 20 < 3 && (e.globalAlpha =
                .4, e.fillStyle = "#00ffaa", e.fillRect(-20 * s, -45 * s + 40 * Math.random() * s, 40 * s, 2 * s)),
              e.globalAlpha = .06, e.fillStyle = "#00ffaa";
            e.fillRect(-20 * s, 2 * r % 60 * s - 30 * s, 40 * s, 2 * s)
          }
        }
        e.shadowBlur = 0, e.globalAlpha = 1, e.restore()
      }
      e.restore()
    }
    let eL = [];

    function eD(e, t, o, a, l) {
      let r = e.createLinearGradient(0, 0, 0, o);
      r.addColorStop(0, "#030310"), r.addColorStop(.5, "#050520"), r.addColorStop(1, "#030310"), e.fillStyle = r, e
        .fillRect(0, 0, t, o), e.globalAlpha = .06, e.strokeStyle = n, e.lineWidth = 1;
      let i = .3 * a % 80;
      for (let a = i; a < t; a += 80) e.beginPath(), e.moveTo(a, 0), e.lineTo(a, o), e.stroke();
      for (let a = 0; a < o; a += 80) e.beginPath(), e.moveTo(0, a), e.lineTo(t, a), e.stroke();
      for (let a of (e.globalAlpha = 1, l)) a.x += a.vx, a.y += a.vy, a.y < -10 && (a.y = o + 10, a.x = Math
        .random() * t), a.x < -10 && (a.x = t + 10), a.x > t + 10 && (a.x = -10), e.globalAlpha = .5, e.shadowBlur =
        5, e.shadowColor = a.color, e.fillStyle = a.color, e.beginPath(), e.arc(a.x, a.y, a.size, 0, 2 * Math.PI), e
        .fill();
      e.shadowBlur = 0, e.globalAlpha = 1
    }

    function eW(e, t, o, a) {
      e.fillStyle = "#050505", e.fillRect(0, 0, t, o), e.globalAlpha = .04, e.fillStyle = f;
      for (let l = 0; l < 8; l++) {
        let r = (1.5 * a + 97 * l) % o;
        e.fillRect(0, r, t, 3 + 5 * Math.random())
      }
      e.globalAlpha = 1
    }

    function eO(e, t, o, a, l, r, n, i) {
      return e < l + n && e + o > l && t < r + i && t + a > r
    }

    function eB() {
      return !!window.Capacitor?.isNativePlatform?.() || window.matchMedia("(hover: none) and (pointer: coarse)")
        .matches || /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
    let eG = eB(),
      e$ = eG ? .4 : 1,
      eF = eG ? 20 : 100,
      eH = 1e3 / (eG ? 30 : 60);

    function eU(e, t, o, a, l) {
      let r = eG ? Math.min(Math.ceil(a * e$), 3) : a;
      for (let a = 0; a < r; a++) e.push({
        x: t,
        y: o,
        vx: (Math.random() - .5) * 5,
        vy: (Math.random() - .5) * 5 - 1.5,
        life: 18 + 18 * Math.random(),
        maxLife: 36,
        color: l,
        size: 2 + 2 * Math.random()
      });
      e.length > eF && e.splice(0, e.length - eF)
    }

    function eV(e) {
      return {
        px: "moving" === e.type && "x" === e.moveAxis && e.moveRange && e.moveSpeed ? e.x + Math.sin(e.moveOffset ||
          0) * e.moveRange : e.x,
        py: "moving" === e.type && "y" === e.moveAxis && e.moveRange && e.moveSpeed ? e.y + Math.sin(e.moveOffset ||
          0) * e.moveRange : e.y
      }
    }

    function ez(e) {
      return "boss" === e || "bossRedKing" === e || "bossTitan" === e || "bossDragon" === e || "bossPhoenix" ===
        e || "bossMechGolem" === e || "bossCorrupted" === e || "bossFather" === e || "bossTwin" === e || "giant" ===
        e ? 80 : "voidGuardian" === e ? 30 : "dragon" === e || "phoenix" === e ? 50 : "mechGolem" === e ||
        "heavyWalker" === e || "zombie" === e ? 55 : "shadowAssassin" === e || "eliteDrone" === e ||
        "necromancer" === e ? 50 : "bomber" === e ? 45 : "voidBat" === e ? 30 : "stormEagle" === e ? 45 :
        "emberWisp" === e ? 30 : "frostWraith" === e ? 45 : "shadowDrake" === e ? 55 : "plasmaSerpent" === e ? 50 :
        "neonWyrm" === e ? 60 : "crystalMoth" === e ? 35 : 50
    }

    function e_(e) {
      let t = _[e];
      return t && 0 !== t.length ? t[Math.floor(Math.random() * t.length)] : ""
    }
    let eK = (e, t, o, a, l, r = 20) => {
        let n = t + 5;
        for (let t of [e + 35 * o, e + 35 * o + (o > 0 ? r : -r) * .5, e + (o > 0 ? r : 0) + 5 * o]) {
          let e = !1;
          for (let o of a) {
            let {
              px: a,
              py: l
            } = eV(o);
            if (t >= a && t <= a + o.width && n >= l - 5 && n <= l + o.height + 20) {
              e = !0;
              break
            }
          }
          if (!e) return !1
        }
        return !(e + 35 * o < 0) && !(e + 35 * o > l.width - 20)
      },
      eq = (0, a.forwardRef)(function(e, t) {
        let l = (0, a.useRef)(null),
          r = (0, a.useRef)(0),
          x = (0, a.useRef)({
            left: !1,
            right: !1,
            up: !1,
            shoot: !1
          }),
          g = (0, a.useRef)({
            left: !1,
            right: !1,
            up: !1,
            shoot: !1,
            dash: !1,
            shield: !1,
            special: !1
          }),
          b = (0, a.useRef)({
            active: !1,
            dx: 0,
            dy: 0
          }),
          M = (0, a.useRef)({
            active: !1,
            dx: 0,
            dy: 0
          }),
          j = (0, a.useRef)(null),
          N = (0, a.useRef)(null),
          I = (0, a.useRef)([]),
          D = (0, a.useRef)([]),
          W = (0, a.useRef)([]),
          O = (0, a.useRef)([]),
          B = (0, a.useRef)(null),
          $ = (0, a.useRef)(0),
          F = (0, a.useRef)(0),
          z = (0, a.useRef)(0),
          _ = (0, a.useRef)(!1),
          K = (0, a.useRef)(!1),
          q = (0, a.useRef)(1),
          Y = (0, a.useRef)([]),
          J = (0, a.useRef)(null),
          X = (0, a.useRef)(0),
          Q = (0, a.useRef)([]),
          ee = (0, a.useRef)(!1),
          et = (0, a.useRef)(0),
          el = (0, a.useRef)(""),
          er = (0, a.useRef)(n),
          en = (0, a.useRef)(0),
          ei = (0, a.useRef)(0),
          es = (0, a.useRef)([]),
          ec = (0, a.useRef)(null),
          ed = (0, a.useRef)("menu"),
          eh = (0, a.useRef)(!1),
          ef = (0, a.useRef)(0),
          eu = (0, a.useRef)(""),
          em = (0, a.useRef)(n),
          ex = (0, a.useRef)(0),
          ep = (0, a.useRef)(""),
          eg = (0, a.useRef)(n),
          ey = (0, a.useRef)(0),
          eb = (0, a.useRef)(0),
          ev = (0, a.useRef)(!1),
          ew = (0, a.useRef)(1),
          ek = (0, a.useRef)([]),
          eC = (0, a.useRef)(0),
          eS = (0, a.useRef)({
            x: 0,
            y: 0,
            active: !1
          }),
          eT = (0, a.useRef)(0),
          eM = (0, a.useRef)(0),
          ej = (0, a.useRef)(null),
          eN = (0, a.useRef)(0),
          eP = (0, a.useRef)(!1),
          eA = (0, a.useRef)(1),
          eR = (0, a.useRef)([]),
          eI = (0, a.useRef)(0),
          e$ = (0, a.useRef)(0),
          eq = (0, a.useRef)(0),
          eY = (0, a.useRef)(0),
          eJ = (0, a.useRef)(0),
          eZ = () => {
            eh.current || (eo.init(), eh.current = !0)
          },
          eX = (0, a.useCallback)(e => {
            let t = [],
              o = eG ? 30 : 80;
            for (let a = 0; a < o; a++) t.push({
              x: Math.random() * e,
              y: 600 * Math.random(),
              size: .5 + 2 * Math.random(),
              speed: .1 + .3 * Math.random()
            });
            Y.current = t
          }, []),
          eQ = (0, a.useCallback)((e, t) => {
            let o = [],
              a = eG ? 15 : 40;
            for (let l = 0; l < a; l++) o.push({
              x: Math.random() * e,
              y: Math.random() * t,
              vx: (Math.random() - .5) * .5,
              vy: -(.5 * Math.random()) - .2,
              color: [n, i, s, h][Math.floor(4 * Math.random())],
              size: 1 + 3 * Math.random()
            });
            Q.current = o
          }, []),
          e0 = (0, a.useCallback)((e, t, o) => {
            let a = C.find(e => e.id === o) || C[0],
              l = ea.getState().saveData;
            return {
              x: e,
              y: t,
              width: 20,
              height: 50,
              vx: 0,
              vy: 0,
              health: 100,
              maxHealth: 100,
              facing: 1,
              grounded: !1,
              shootCooldown: 0,
              animFrame: 0,
              animTimer: 0,
              invincible: 0,
              expression: "determined",
              isMoving: !1,
              isShooting: !1,
              shootTimer: 0,
              dashCooldown: 0,
              dashTimer: 0,
              isDashing: !1,
              shieldCooldown: 0,
              shieldTimer: 0,
              isShielding: !1,
              specialCooldown: 0,
              specialTimer: 0,
              isUsingSpecial: !1,
              jumpCount: 0,
              maxJumps: 2,
              kills: 0,
              combo: 0,
              comboTimer: 0,
              skinColor: a.color,
              skinGlow: a.glowColor,
              skinTrail: a.trailColor,
              skinEffect: a.effect,
              equippedSkills: l.equippedSkills.slice(0, 3),
              skillStates: l.equippedSkills.slice(0, 3).filter(e => e).map(e => ({
                id: e,
                cooldownTimer: 0,
                activeTimer: 0,
                isActive: !1
              }))
            }
          }, []),
          e1 = (0, a.useRef)([]),
          e2 = (0, a.useRef)([]),
          e5 = (e, t) => {
            let o, a = (o = 11 * (5 * e + 13) + 37, () => (o = (9301 * o + 49297) % 233280) / 233280),
              l = 2 + Math.floor(3 * a()),
              r = [];
            for (let e = 0; e < l; e++) {
              let e = Math.floor(a() * t.length),
                o = t[e];
              r.push({
                x: o.x + 20 + Math.floor(a() * (o.width - 40)),
                y: o.y - 25,
                opened: !1,
                reward: a() > .8 ? "skill" : "coins",
                value: a() > .5 ? 25 : 10
              })
            }
            e2.current = r
          },
          e3 = (0, a.useCallback)(e => {
            let t, o, a = ea.getState().gameMode,
              l = "versus" === a,
              r = l ? L : G.find(t => t.id === e) || U(e);
            if (!r) return;
            B.current = r, J.current = R(A(e));
            let i = ea.getState().saveData;
            l ? (j.current = e0(100, 460, i.currentSkin), N.current = e0(r.width - 120, 460, "default"), N
              .current.skinColor = c, N.current.skinGlow = f, N.current.skinTrail = c, N.current.facing = -1,
              ec.current = null, es.current = []) : (j.current = e0(r.playerSpawn.x, r.playerSpawn.y, i
              .currentSkin), "coop" === a ? (N.current = e0(r.playerSpawn.x + 40, r.playerSpawn.y,
                "default"), N.current.skinColor = c, N.current.skinGlow = f, N.current.skinTrail = c, N
              .current.facing = 1) : N.current = null);
            let s = i.gangMembersUnlocked;
            es.current = r.gangMembersAvailable.filter(e => s.includes(e)).map(e => ({
                ...k.find(t => t.id === e),
                active: !0,
                x: r.playerSpawn.x - 40 - 30 * Math.random(),
                y: r.playerSpawn.y,
                vx: 0,
                vy: 0,
                facing: 1,
                animFrame: 0,
                shootCooldown: 60 + Math.floor(40 * Math.random()),
                grounded: !1,
                invincible: 0,
                expression: "determined"
              })), I.current = [], D.current = [], W.current = [], O.current = r.platforms.map(e => ({
                ...e,
                moveOffset: e.moveOffset || 0
              })), $.current = 0, F.current = 0, z.current = 0, ee.current = !1, X.current = 0, en.current = 0,
              ei.current = 0, et.current = 0, ef.current = 0, eu.current = "", em.current = n, ex.current = 0,
              ep.current = "", eg.current = n, ey.current = 0;
            let d = v.find(e => e.id === i.currentPet) || v[0],
              h = w.find(e => e.id === i.currentPetSkin) || w[0];
            ec.current = {
              x: r.playerSpawn.x + 30,
              y: r.playerSpawn.y - 20,
              vx: 0,
              vy: 0,
              health: 50,
              maxHealth: 50,
              type: d.id,
              skinColor: h.color,
              skinGlow: h.glowColor,
              shootCooldown: d.shootRate,
              animFrame: 0,
              grounded: !1,
              facing: 1,
              invincible: 0,
              expression: "neutral",
              active: !0,
              respawnTimer: 0
            };
            let u = (o = 7 * (3 * e + 7) + 13, () => (o = (9301 * o + 49297) % 233280) / 233280),
              m = Math.min(15 + Math.floor(.6 * e), 40),
              x = [],
              p = () => e <= 20 ? 3 + Math.floor(6 * u()) : e <= 60 ? 5 + Math.floor(8 * u()) : 8 + Math.floor(
                8 * u());
            for (let e = 150; e < r.width - 150; e += 200 + Math.floor(100 * u())) x.push({
              x: e,
              y: 490,
              collected: !1,
              animFrame: Math.floor(100 * u()),
              value: p()
            });
            for (let e = 0; e < m; e++) {
              let e, t, o = u();
              if (o < .4) {
                let o = Math.floor(u() * r.platforms.length),
                  a = r.platforms[o];
                e = a.x + 20 + Math.floor(u() * (a.width - 40)), t = a.y - 30 - Math.floor(60 * u())
              } else o < .75 ? (e = 100 + Math.floor(u() * (r.width - 200)), t = 490) : (e = 100 + Math.floor(
              u() * (r.width - 200)), t = 200 + Math.floor(200 * u()));
              let a = p();
              x.push({
                x: e,
                y: t,
                collected: !1,
                animFrame: Math.floor(100 * u()),
                value: a
              })
            }
            let g = 2 + Math.floor(3 * u());
            for (let e = 0; e < g; e++) {
              let e = 200 + Math.floor(u() * (r.width - 600)),
                t = 250 + Math.floor(150 * u()),
                o = 4 + Math.floor(4 * u());
              for (let a = 0; a < o; a++) {
                let l = a / (o - 1),
                  r = e + 50 * a,
                  n = t - 60 * Math.sin(l * Math.PI);
                x.push({
                  x: r,
                  y: n,
                  collected: !1,
                  animFrame: Math.floor(100 * u()),
                  value: p()
                })
              }
            }
            let y = r.waves.length;
            for (let e = 0; e < y - 1; e++) {
              let e = 3 + Math.floor(2 * u());
              for (let t = 0; t < e; t++) {
                let e = 200 + Math.floor(u() * (r.width - 400)),
                  t = u() > .5 ? 490 : 250 + Math.floor(180 * u()),
                  o = p();
                x.push({
                  x: e,
                  y: t,
                  collected: !1,
                  animFrame: Math.floor(100 * u()),
                  value: o
                })
              }
            }
            ek.current = x, eC.current = 0, t = e <= 5 ? .8 + .01 * e : e <= 20 ? .85 + (e - 5) * .00333 : e <=
              50 ? .9 + (e - 20) * .00167 : .93 + Math.min((e - 50) * .001, .04), eS.current = {
                x: Math.floor(r.width * t),
                y: 480,
                active: !1
              }, eT.current = 0, ej.current = null, eN.current = 0, eP.current = !1, eA.current = e <= 3 ? .5 :
              e <= 50 ? .6 + (e - 3) * .01 : 1.07 + (e - 50) * .002, eR.current = [], eI.current = 0, e$
              .current = 0, eq.current = 0, eY.current = 0, eJ.current = 0, e1.current = i.equippedSkills
              .filter(e => e).map(e => ({
                id: e,
                cooldownTimer: 0,
                activeTimer: 0,
                isActive: !1
              })), e5(e, r.platforms);
            let b = 0;
            for (let e of r.waves) b += e.enemies.length;
            r.bossWave && (b += r.bossWave.enemies.length), eM.current = b, eX(r.width)
          }, [eX, e0, ea, e5]);
        (0, a.useImperativeHandle)(t, () => ({
          moveLeft: () => {
            x.current.left = !0
          },
          moveRight: () => {
            x.current.right = !0
          },
          stopMove: () => {
            x.current.left = !1, x.current.right = !1, x.current.up = !1, x.current.shoot = !1
          },
          jump: () => {
            let e = j.current;
            e && e.jumpCount < e.maxJumps && (e.vy = -12, e.grounded = !1, e.jumpCount++, eU(W.current, e
              .x + e.width / 2, e.y, 5, n), eZ(), eo.playJump())
          },
          shoot: () => {
            x.current.shoot = !0
          },
          stopShoot: () => {
            x.current.shoot = !1
          },
          dash: () => {
            let e = j.current;
            !e || e.dashCooldown > 0 || e.isDashing || (e.isDashing = !0, e.dashTimer = 8, e.dashCooldown =
              90, e.invincible = Math.max(e.invincible, 8), e4(e_("dash"), n), eU(W.current, e.x + e
                .width / 2, e.y - 25, 8, n), eZ(), eo.playDash())
          },
          shield: () => {
            let e = j.current;
            !e || e.shieldCooldown > 0 || e.isShielding || (e.isShielding = !0, e.shieldTimer = 120, e
              .shieldCooldown = 300, e4(e_("shield"), s), eZ(), eo.playShield())
          },
          special: () => {
            let e = j.current;
            if (!e || e.specialCooldown > 0 || e.isUsingSpecial) return;
            e.isUsingSpecial = !0, e.specialTimer = 30, e.specialCooldown = 360, X.current = 10, e4(e_(
              "special"), c);
            let t = e.x + e.width / 2,
              o = e.y - 25;
            for (let a = -.5; a <= .51; a += .1) {
              let l = Math.cos(a),
                r = Math.sin(a),
                n = 10 * e.facing;
              D.current.push({
                x: t,
                y: o,
                vx: n * l - 0 * r,
                vy: n * r + 0 * l,
                fromPlayer: !0,
                damage: 30,
                active: !0,
                color: c,
                radius: 5,
                isSpecial: !0
              })
            }
            eU(W.current, t, o, 20, c), eZ(), eo.playSpecial()
          },
          setJoystick: e => {
            b.current = e
          },
          setP2Joystick: e => {
            M.current = e
          },
          executeSkill: e => {
            e8(e)
          },
          pause: () => {
            "playing" === ea.getState().gamePhase && ea.getState().setGamePhase("settings")
          }
        }));
        let e4 = (e, t) => {
            el.current = e, er.current = t, et.current = 90
          },
          e6 = (e, t) => {
            eu.current = e, em.current = t, ex.current = 120
          },
          e8 = e => {
            let t = j.current;
            if (!t || t.health <= 0) return;
            let o = P.find(t => t.id === e);
            if (!o) return;
            let a = e1.current.find(t => t.id === e);
            if (a || (a = {
                id: e,
                cooldownTimer: 0,
                activeTimer: 0,
                isActive: !1
              }, e1.current.push(a)), a.cooldownTimer > 0 || a.isActive) return;
            if ("blood" === o.element && "bloodStrike" === o.id) {
              if (t.health <= 10) return;
              t.health -= 10, t.invulnFlash = 10
            }
            let l = I.current,
              r = D.current,
              n = W.current,
              i = t.x + t.width / 2,
              s = t.y - 25,
              c = ea.getState().saveData.skillUpgrades[e] ?? 1,
              d = S[Math.min(c - 1, S.length - 1)],
              h = T[Math.min(c - 1, T.length - 1)];
            switch (o.effectType) {
              case "projectile": {
                let e = o.projectileCount || 1;
                for (let a = 0; a < e; a++) {
                  let l = e > 1 ? (a / (e - 1) - .5) * .6 : 0;
                  r.push({
                    x: i,
                    y: s,
                    vx: 15 * t.facing * Math.cos(l),
                    vy: 15 * Math.sin(l),
                    fromPlayer: !0,
                    damage: Math.round(o.damage * d),
                    active: !0,
                    color: o.color,
                    radius: 6,
                    isSpecial: !0
                  })
                }
                eU(n, i, s, 15, o.color), X.current = 5;
                break
              }
              case "aoe": {
                let e = o.effectRadius || 200;
                for (let t of l) {
                  if (!t.active) continue;
                  let a = t.x + t.width / 2 - i,
                    l = t.y - 25 - s;
                  if (Math.sqrt(a * a + l * l) < e) {
                    let e = t.type.startsWith("boss"),
                      a = 999 !== o.damage || e ? o.damage : t.health,
                      l = 999 !== o.damage || e ? Math.round(a * d) : a;
                    t.health -= l, t.isHit = !0, t.hitTimer = 10
                  }
                }
                for (let t = 0; t < 2 * Math.PI; t += .15)
                  for (let a = 30; a < e; a += 60) n.push({
                    x: i + Math.cos(t) * a,
                    y: s + Math.sin(t) * a * .5,
                    vx: 2 * Math.cos(t),
                    vy: 2 * Math.sin(t) - 1,
                    life: 30,
                    maxLife: 30,
                    color: o.glowColor,
                    size: 3
                  });
                if (X.current = 15, "soulHarvest" === o.id) {
                  let o = l.filter(t => t.active && Math.sqrt((t.x + t.width / 2 - i) ** 2 + (t.y - 25 - s) **
                    2) < e).length;
                  t.health = Math.min(t.maxHealth, t.health + 5 * o)
                }
                break
              }
              case "buff":
                if ("shadowStep" === o.id) {
                  let e = l.filter(e => e.active).sort((e, o) => Math.abs(e.x - t.x) - Math.abs(o.x - t.x))[0];
                  e && (t.x = e.x + (e.x > t.x ? -40 : 40), t.facing = e.x > t.x ? 1 : -1, t.invincible = Math
                    .max(t.invincible, o.duration), e.health -= Math.round(o.damage * d), e.isHit = !0, e
                    .hitTimer = 10), eU(n, i, s, 20, o.color)
                } else "voidWalk" === o.id ? (t.invincible = Math.max(t.invincible, o.duration), eU(n, i, s, 25, o
                  .color)) : "bloodFury" === o.id && eU(n, i, s, 20, o.color);
                break;
              case "summon": {
                let e = o.summonCount || 1;
                for (let a = 0; a < e; a++) {
                  let l = a / e * Math.PI * .6 - .3 * Math.PI;
                  for (let e = 0; e < 3; e++) r.push({
                    x: i,
                    y: s,
                    vx: 10 * t.facing * Math.cos(l) + (Math.random() - .5) * 2,
                    vy: 10 * Math.sin(l) * .5 - 2 + .5 * e,
                    fromPlayer: !0,
                    damage: Math.round(o.damage * d),
                    active: !0,
                    color: o.glowColor,
                    radius: 5,
                    isSpecial: !0
                  })
                }
                eU(n, i, s, 20, o.color), X.current = 8;
                break
              }
              case "beam":
                for (let e = 0; e < 8; e++) r.push({
                  x: i + t.facing * e * 15,
                  y: s + (Math.random() - .5) * 10,
                  vx: 20 * t.facing,
                  vy: (Math.random() - .5) * 1,
                  fromPlayer: !0,
                  damage: Math.round(o.damage / 4 * d),
                  active: !0,
                  color: o.glowColor,
                  radius: 7,
                  isSpecial: !0
                });
                eU(n, i, s, 25, o.color), X.current = 12;
                break;
              case "wave":
                for (let e = 0; e < 2 * Math.PI; e += Math.PI / 6) r.push({
                  x: i,
                  y: s,
                  vx: 10 * Math.cos(e),
                  vy: 10 * Math.sin(e) * .6,
                  fromPlayer: !0,
                  damage: Math.round(o.damage * d),
                  active: !0,
                  color: o.color,
                  radius: 5,
                  isSpecial: !0
                });
                eU(n, i, s, 30, o.glowColor), X.current = 10
            }
            a.cooldownTimer = Math.round(o.cooldown * h), a.activeTimer = o.duration, a.isActive = !0, e4(o.name +
              "!", o.color), eZ(), eo.playSpecial()
          };
        (0, a.useEffect)(() => {}, []), (0, a.useEffect)(() => (window.__neonWarriorControls = {
          moveLeft: () => {
            x.current.left = !0
          },
          moveRight: () => {
            x.current.right = !0
          },
          stopMove: () => {
            x.current.left = !1, x.current.right = !1, x.current.up = !1, x.current.shoot = !1
          },
          jump: () => {
            let e = j.current;
            e && e.jumpCount < e.maxJumps && (e.vy = -12, e.grounded = !1, e.jumpCount++, eU(W.current, e
              .x + e.width / 2, e.y, 5, n), eZ(), eo.playJump())
          },
          shoot: () => {
            x.current.shoot = !0
          },
          stopShoot: () => {
            x.current.shoot = !1
          },
          dash: () => {
            let e = j.current;
            !e || e.dashCooldown > 0 || e.isDashing || (e.isDashing = !0, e.dashTimer = 8, e.dashCooldown =
              90, e.invincible = Math.max(e.invincible, 8), e4(e_("dash"), n), eU(W.current, e.x + e
                .width / 2, e.y - 25, 8, n), eZ(), eo.playDash())
          },
          shield: () => {
            let e = j.current;
            !e || e.shieldCooldown > 0 || e.isShielding || (e.isShielding = !0, e.shieldTimer = 120, e
              .shieldCooldown = 300, e4(e_("shield"), s), eZ(), eo.playShield())
          },
          special: () => {
            let e = j.current;
            if (!e || e.specialCooldown > 0 || e.isUsingSpecial) return;
            e.isUsingSpecial = !0, e.specialTimer = 30, e.specialCooldown = 360, X.current = 10, e4(e_(
              "special"), c);
            let t = e.x + e.width / 2,
              o = e.y - 25;
            for (let a = -.5; a <= .51; a += .1) {
              let l = Math.cos(a),
                r = Math.sin(a),
                n = 10 * e.facing;
              D.current.push({
                x: t,
                y: o,
                vx: n * l - 0 * r,
                vy: n * r + 0 * l,
                fromPlayer: !0,
                damage: 30,
                active: !0,
                color: c,
                radius: 5,
                isSpecial: !0
              })
            }
            eU(W.current, t, o, 20, c), eZ(), eo.playSpecial()
          },
          setJoystick: e => {
            b.current = e
          },
          setP2Joystick: e => {
            M.current = e
          },
          p2Jump: () => {
            let e = N.current;
            e && e.jumpCount < e.maxJumps && (e.vy = -12, e.grounded = !1, e.jumpCount++, eU(W.current, e
              .x + e.width / 2, e.y, 5, c), eZ(), eo.playJump())
          },
          p2Shoot: () => {
            g.current.shoot = !0
          },
          p2StopShoot: () => {
            g.current.shoot = !1
          },
          p2Dash: () => {
            let e = N.current;
            !e || e.dashCooldown > 0 || e.isDashing || (e.isDashing = !0, e.dashTimer = 8, e.dashCooldown =
              90, e.invincible = Math.max(e.invincible, 8), eU(W.current, e.x + e.width / 2, e.y - 25, 8,
                c), eZ(), eo.playDash())
          },
          p2Shield: () => {
            let e = N.current;
            !e || e.shieldCooldown > 0 || e.isShielding || (e.isShielding = !0, e.shieldTimer = 120, e
              .shieldCooldown = 300, eZ(), eo.playShield())
          },
          p2Special: () => {
            let e = N.current;
            if (!e || e.specialCooldown > 0 || e.isUsingSpecial) return;
            e.isUsingSpecial = !0, e.specialTimer = 30, e.specialCooldown = 360, X.current = 10;
            let t = e.x + e.width / 2,
              o = e.y - 25;
            for (let a = -.5; a <= .51; a += .1) {
              let l = Math.cos(a),
                r = Math.sin(a),
                n = 10 * e.facing;
              D.current.push({
                x: t,
                y: o,
                vx: n * l,
                vy: n * r,
                fromPlayer: !0,
                damage: 30,
                active: !0,
                color: c,
                radius: 5,
                isSpecial: !0,
                fromPlayerId: 2
              })
            }
            eU(W.current, t, o, 20, c), eZ(), eo.playSpecial()
          },
          executeSkill: e => {
            e8(e)
          },
          pause: () => {
            "playing" === ea.getState().gamePhase && ea.getState().setGamePhase("settings")
          }
        }, () => {
          delete window.__neonWarriorControls
        }), []);
        let e9 = (e, t, o, a, l, r, n, i, s) => {
          let c = 0;
          if (o?.active ? e.facing = (c = o.dx) > .05 ? 1 : c < -.05 ? -1 : e.facing : (t.left && (c = -1, e
              .facing = -1), t.right && (c = 1, e.facing = 1)), e.isDashing ? (e.dashTimer -= (eG ? 2 : 1), e
              .vx = 18 * e.facing, e.dashTimer <= 0 && (e.isDashing = !1), F.current % 2 == 0 && eU(r, e.x + e
                .width / 2, e.y - 25, 2, e.skinColor)) : e.vx = (e.grounded ? 5 : 3.5) * c, e.isMoving = Math
            .abs(c) > .1 || e.isDashing, e.isShielding && (e.shieldTimer -= (eG ? 2 : 1), e.shieldTimer <= 0 &&
              (e.isShielding = !1)), e.isUsingSpecial && (e.specialTimer -= (eG ? 2 : 1), e.specialTimer <= 0 &&
              (e.isUsingSpecial = !1)), e.shootCooldown > 0 && (e.shootCooldown -= (eG ? 2 : 1)), e
            .isShooting && e.shootTimer--, t.shoot && e.shootCooldown <= 0 && !e.isDashing) {
            let t = ea.getState().saveData.weaponUpgrades,
              o = t.damage ?? 0,
              a = t.fireRate ?? 0,
              n = t.bulletSpeed ?? 0,
              i = t.bulletSize ?? 0,
              c = t.criticalChance ?? 0,
              d = 1 + o * y.damage.effectPerLevel,
              h = 1 - Math.min(a * y.fireRate.effectPerLevel, .8),
              f = 1 + n * y.bulletSpeed.effectPerLevel,
              u = 1 + i * y.bulletSize.effectPerLevel,
              x = Math.random() < c * y.criticalChance.effectPerLevel;
            l.push({
              x: e.x + e.width / 2 + 15 * e.facing,
              y: e.y - 25,
              vx: 10 * e.facing * f,
              vy: 0,
              fromPlayer: !0,
              damage: Math.round(10 * d * (x ? 2 : 1)),
              active: !0,
              color: x ? m : e.skinColor,
              radius: Math.round(4 * u),
              fromPlayerId: s
            }), e.shootCooldown = Math.max(2, Math.round(8 * h)), e.isShooting = !0, e.shootTimer = 6, eU(r, e
              .x + e.width / 2 + 20 * e.facing, e.y - 25, x ? 8 : 3, x ? m : e.skinColor), eZ(), eo
            .playShoot()
          }
          if (e.shootTimer <= 0 && (e.isShooting = !1), e.dashCooldown > 0 && e.dashCooldown--, e
            .shieldCooldown > 0 && e.shieldCooldown--, e.specialCooldown > 0 && e.specialCooldown--, F.current %
            6 == 0 && ea.getState().updateCooldowns(e.dashCooldown, e.shieldCooldown, e.specialCooldown), e
            .isDashing) e.expression = "determined";
          else if (e.isUsingSpecial) e.expression = "angry";
          else if (e.isShielding) e.expression = "smirk";
          else if (e.invincible > 0 && e.health < 30) e.expression = "hurt";
          else if (e.isShooting) e.expression = "determined";
          else if (e.isMoving) {
            let t = a.some(t => t.active && 300 > Math.abs(t.x - e.x));
            e.expression = t ? "angry" : "determined"
          } else e.expression = "smirk";
          let d = ew.current;
          for (let t of (e.vy += .5 * d, e.vy > 10 * d && (e.vy = 10 * d), e.x += e.vx * d, e.y += e.vy * d, e
              .grounded = !1, n)) {
            let {
              px: o,
              py: a
            } = eV(t);
            e.x + e.width > o + 4 && e.x < o + t.width - 4 && e.y >= a - 4 && e.y - e.vy * d <= a + Math.max(10,
              Math.abs(e.vy) * d + 8) && (e.y = a, e.vy = 0, e.grounded = !0, e.jumpCount = 0)
          }
          e.x < 0 && (e.x = 0), e.x + e.width > i.width && (e.x = i.width - e.width), e.y > i.height - 5 && (e
            .grounded || (e.grounded = !0), e.jumpCount = 0), e.y > i.height + 100 && (e.y = 460, e.vy = 0, e
            .vx = 0, e.x = 80), (0 !== e.vx || !e.grounded) && (e.animTimer++, e.animTimer >= 3 && (e
            .animTimer = 0, e.animFrame++)), e.invincible > 0 && (e.invincible -= (eG ? 2 : 1))
        };
        return (0, a.useEffect)(() => {
          let e = l.current;
          if (!e) return;
          let t = e.getContext("2d", {
            alpha: !1,
            willReadFrequently: !1
          });
          if (!t) return;
          let o = () => {
            let t = window.visualViewport || {
                width: window.innerWidth,
                height: window.innerHeight
              },
              o = Math.min(window.devicePixelRatio || 1, 1.5);
            q.current = o, e.width = Math.floor(t.width * o), e.height = Math.floor(t.height * o), e.style
              .width = t.width + "px", e.style.height = t.height + "px", _.current = eB(), K.current = _
              .current
          };
          o(), window.addEventListener("resize", o), document.addEventListener("visibilitychange", () => {
            document.hidden && ea.getState().gamePhase === "playing" && ea.getState().setGamePhase(
              "settings")
          }), window.visualViewport && window.visualViewport.addEventListener("resize", o);
          let a = () => {
            setTimeout(o, 100)
          };
          window.addEventListener("orientationchange", a);
          let y = 0,
            w = ea.getState().gamePhase,
            k = 0,
            C = ea.subscribe(e => {
              if ("playing" === e.gamePhase && e.currentLevel !== y && (y = e.currentLevel, e3(e
                    .currentLevel), ee.current = !1, eZ(), eo.stopMenuMusic(), eo.startMusic(), e
                  .introText && (ep.current = e.introText, eg.current = e.introColor, ey.current = e
                    .introTimer)), "playing" === e.gamePhase && "playing" !== w && e.currentLevel === y && e
                .waitingForTap && (e.introText && (ep.current = e.introText, eg.current = e.introColor, ey
                  .current = e.introTimer), B.current && B.current.id === e.currentLevel || (e3(e
                  .currentLevel), ee.current = !1, eZ(), eo.stopMenuMusic(), eo.startMusic())), "versus" ===
                e.gameMode && "playing" === e.gamePhase && 0 === e.versusRoundWinner && 0 !== k) {
                let t = B.current || L;
                j.current = e0(100, 460, ea.getState().saveData.currentSkin), N.current = e0(t.width - 120,
                    460, "default"), N.current.skinColor = c, N.current.skinGlow = f, N.current.skinTrail =
                  c, N.current.facing = -1, D.current = [], W.current = [], ek.current = [], I.current = [],
                  e.introText && (ep.current = e.introText, eg.current = e.introColor, ey.current = e
                    .introTimer)
              }
              if (k = e.versusRoundWinner, "playing" === e.gamePhase && "game-over" === w && e
                .revivedWithFullPower) {
                let e = j.current;
                e && (e.health = e.maxHealth, e.dashCooldown = 0, e.shieldCooldown = 0, e.specialCooldown =
                  0, e.invincible = 120)
              }
              "playing" === w && "playing" !== e.gamePhase && ("settings" === e.gamePhase ? (eo.stopMusic(),
                  eo.stopBossMusic()) : (eo.stopMusic(), eo.stopBossMusic(), ("level-complete" === e
                    .gamePhase || "victory" === e.gamePhase) && eo.playVictoryFanfare(), "menu" === e
                  .gamePhase && eo.startMenuMusic())), "settings" === w && "playing" === e.gamePhase && (
                eZ(), e.isBossLevel ? eo.startBossMusic() : eo.startMusic()), "menu" !== w && "menu" === e
                .gamePhase && "playing" !== w && (eo.stopMenuMusic(), eo.startMenuMusic()), e
                .dramaticMoment && (eu.current = e.dramaticMoment.text, em.current = e.dramaticMoment.color,
                  ex.current = e.dramaticMoment.timer), ("menu" === e.gamePhase || "game-over" === e
                  .gamePhase || "level-complete" === e.gamePhase || "victory" === e.gamePhase) && (y = 0),
                w = e.gamePhase
            }),
            S = ea.getState();
          "playing" === S.gamePhase && S.currentLevel !== y && (y = S.currentLevel, e3(S.currentLevel));
          let T = q.current || 1;
          eQ(e.width / T, e.height / T);
          let A = o => {
              r.current = requestAnimationFrame(A), 0 === eb.current && (eb.current = o);
              let a = o - eb.current,
                l = _.current ? eH : 1e3 / 60;
              if (a < l) return;
              eb.current = o - a % l, _.current && a > 40 && !ev.current && (ev.current = !0), F.current++, ew
                .current = _.current ? 2 : 1;
              let c = ea.getState().gamePhase,
                h = q.current,
                f = e.width / h,
                u = e.height / h,
                m = u / 600,
                x = Math.ceil(f / m);
              _.current && (W.current.length > eF && W.current.splice(0, W.current.length - eF), D.current
                .length > 20 && (D.current = D.current.filter(e => e.active)), I.current.length > 15 && (I
                  .current = I.current.filter(e => e.active)));
              let p = 0,
                g = 0;
              switch (X.current > 0 && (p = (Math.random() - .5) * X.current, g = (Math.random() - .5) * X
                  .current, X.current *= .9, X.current < .5 && (X.current = 0)), t.save(), t.setTransform(h,
                  0, 0, h, 0, 0), t.translate(p, g), t.imageSmoothingEnabled = !1, c) {
                case "menu": {
                  eD(t, f, u, F.current, Q.current), t.save();
                  let e = 5 * Math.sin(.03 * F.current);
                  t.globalAlpha = .04, t.fillStyle = n, t.beginPath(), t.arc(f / 2, u / 2 + 40 + e, 40 + 8 *
                      Math.sin(.04 * F.current), 0, 2 * Math.PI), t.fill(), t.globalAlpha = .12, eE(t, f / 2,
                      u / 2 + 40 + e, 1, n, F.current, !1, !0, 1.2, "smirk", !1, !1, 0, ""), t.globalAlpha =
                    .35;
                  for (let o = 0; o < 8; o++) {
                    let a = o / 8 * Math.PI * 2 + .02 * F.current,
                      l = 55 + 10 * Math.sin(.04 * F.current + o),
                      r = f / 2 + Math.cos(a) * l,
                      i = u / 2 + 40 + e + Math.sin(a) * l * .5;
                    t.shadowBlur = 5, t.shadowColor = o % 2 == 0 ? n : s, t.fillStyle = o % 2 == 0 ? n : s, t
                      .beginPath(), t.arc(r, i, 2, 0, 2 * Math.PI), t.fill()
                  }
                  t.shadowBlur = 0, t.globalAlpha = 1, t.restore(), "menu" !== ed.current && (ed.current =
                    "menu", eZ(), eo.stopMusic(), eo.stopBossMusic(), eo.startMenuMusic());
                  break
                }
                case "playing":
                  ea.getState().waitingForTap || ("versus" !== ea.getState().gameMode && R(), e8(x, 600)), t
                    .save(), t.scale(m, m), e7(t, x, 600), t.restore(), te(t, f, u), eh(t, f, u), U(t, f, u),
                    eX(t, f, u), eG(t, f, u), e5(t, f, u);
                  break;
                case "settings":
                  B.current && j.current ? (t.save(), t.scale(m, m), e7(t, x, 600), t.restore(), te(t, f, u),
                    t.fillStyle = "rgba(0,0,0,0.4)", t.fillRect(0, 0, f, u)) : eW(t, f, u, F.current);
                  break;
                case "cutscene":
                default:
                  eD(t, f, u, F.current, Q.current);
                  break;
                case "game-over":
                case "skin-shop":
                  eW(t, f, u, F.current);
                  break;
                case "level-complete":
                case "victory":
                  ! function(e, t, o, a) {
                    let l = e.createLinearGradient(0, 0, 0, o);
                    l.addColorStop(0, "#000510"), l.addColorStop(.5, "#001020"), l.addColorStop(1, "#000510"),
                      e.fillStyle = l, e.fillRect(0, 0, t, o), e.globalAlpha = .5;
                    for (let l = 0; l < 30; l++) {
                      let r = (73.7 * l + .5 * a) % t,
                        c = o - (47.7 * l + .8 * a) % o,
                        h = [n, s, i, d][l % 4];
                      e.shadowBlur = 5, e.shadowColor = h, e.fillStyle = h, e.beginPath(), e.arc(r, c, 2, 0,
                        2 * Math.PI), e.fill()
                    }
                    e.shadowBlur = 0, e.globalAlpha = 1
                  }(t, f, u, F.current)
              }
              t.restore()
            },
            R = () => {
              if (ee.current && 0 === eR.current.length) return;
              let e = B.current,
                t = j.current;
              if (!e || !t) return;
              if (eR.current.length > 0) {
                if (eI.current--, eI.current <= 0) {
                  let e = Math.min(eR.current.length, 2);
                  for (let t = 0; t < e; t++) {
                    let e = eR.current.shift();
                    e.x += Math.floor(Math.random() * 100 - 50), e.active = !0, I.current.push(e), eJ
                      .current++
                  }
                  eI.current = e$.current, 0 === eR.current.length && (ee.current = !0)
                }
                return
              }
              if (ee.current) return;
              let o = ea.getState(),
                a = o.currentWave,
                l = o.totalWaves,
                r = e.bossWave && a === l - 1,
                s = r ? e.bossWave : e.waves[a];
              if (!s) {
                z.current += 200, ea.getState().completeLevel(z.current);
                return
              }
              let d = s.enemies.map((e, t) => {
                let o, a, l, r = "boss" === e.type || "bossRedKing" === e.type || "bossTitan" === e
                  .type || "bossDragon" === e.type || "bossPhoenix" === e.type || "bossMechGolem" === e
                  .type || "bossCorrupted" === e.type || "bossFather" === e.type || "bossTwin" === e.type,
                  n = "voidGuardian" === e.type,
                  i = "eliteDrone" === e.type,
                  s = "heavyWalker" === e.type,
                  c = "dragon" === e.type,
                  d = "phoenix" === e.type,
                  h = "mechGolem" === e.type,
                  f = "shadowAssassin" === e.type,
                  u = "bossTitan" === e.type ? 500 : "bossRedKing" === e.type ? 400 : "boss" === e.type ?
                  300 : "bossDragon" === e.type ? 600 : "bossPhoenix" === e.type ? 450 :
                  "bossMechGolem" === e.type ? 550 : "bossCorrupted" === e.type ? 480 : "bossFather" === e
                  .type ? 550 : "bossTwin" === e.type ? 700 : 150,
                  m = 20,
                  x = 50,
                  p = 20;
                r ? (m = 60, x = 80, p = u) : n ? (m = 30, x = 30, p = 25) : i ? (m = 20, x = 50, p =
                  30) : s ? (m = 25, x = 55, p = 40) : c ? (m = 35, x = 40, p = 45) : d ? (m = 25, x = 40,
                    p = 35) : h ? (m = 30, x = 55, p = 60) : f ? (m = 18, x = 50, p = 25) : "drone" === e
                  .type ? p = 20 : "glitchWalker" === e.type ? p = 25 : "voidBat" === e.type ? (m = 16,
                    x = 30, p = 15) : "stormEagle" === e.type ? (m = 24, x = 45, p = 30) : "emberWisp" ===
                  e.type ? (m = 16, x = 30, p = 18) : "frostWraith" === e.type ? (m = 22, x = 45, p =
                  35) : "shadowDrake" === e.type ? (m = 30, x = 55, p = 40) : "plasmaSerpent" === e.type ?
                  (m = 26, x = 50, p = 35) : "neonWyrm" === e.type ? (m = 32, x = 60, p = 50) :
                  "crystalMoth" === e.type ? (m = 18, x = 35, p = 20) : "zombie" === e.type ? (m = 22, x =
                    55, p = 55) : "giant" === e.type ? (m = 55, x = 80, p = 150) : "necromancer" === e
                  .type ? (m = 20, x = 50, p = 40) : "bomber" === e.type && (m = 18, x = 45, p = 25);
                let g = ea.getState().currentLevel;
                return o = g <= 3 ? .4 : g <= 50 ? .6 + .2 * Math.log(1 + (g - 3) / 80) : g <= 200 ? 1 +
                  .25 * Math.log(1 + (g - 50) / 50) : 1.35 + .3 * Math.log(1 + (g - 200) / 100), a = g <=
                  3 ? .5 : g <= 50 ? .7 + .15 * Math.log(1 + (g - 3) / 100) : Math.min(1 + .2 * Math.log(
                    1 + g / 100), 1.8), l = g <= 50 ? .7 : g <= 200 ? 1 + .2 * Math.log(1 + (g - 50) /
                    100) : 1.2 + .3 * Math.log(1 + (g - 200) / 100), p = r ? Math.floor(p * l) : Math
                  .floor(p * o), {
                    x: e.x,
                    y: e.y,
                    width: m,
                    height: x,
                    vx: 0,
                    vy: 0,
                    type: e.type,
                    health: p,
                    maxHealth: p,
                    facing: -1,
                    shootCooldown: Math.floor((70 + Math.floor(30 * Math.random())) / a),
                    animFrame: 10 * t,
                    animTimer: 0,
                    active: !1,
                    grounded: !E(e.type),
                    patternTimer: 0,
                    invincible: 0,
                    isHit: !1,
                    hitTimer: 0,
                    bossName: e.bossName,
                    bossColor: e.bossColor
                  }
              });
              if (r || d.length <= 2) {
                for (let e of d) e.active = !0;
                I.current = [...I.current, ...d], ee.current = !0, eJ.current += d.length
              } else {
                eR.current = d, e$.current = 25 + Math.floor(20 * Math.random()), eI.current = 0;
                let e = Math.min(d.length, 2);
                for (let t = 0; t < e; t++) {
                  let e = eR.current.shift();
                  e.x += Math.floor(Math.random() * 100 - 50), e.active = !0, I.current.push(e), eJ.current++
                }
              }
              if (r) {
                eZ(), eo.stopMusic(), eo.startBossMusic();
                let e = s.enemies.find(e => e.bossName);
                e && (e6(`⚠ ${e.bossName} ⚠`, e.bossColor || f), X.current = 10)
              }
              if (s.voiceLine) e4(s.voiceLine, r ? i : n);
              else {
                let e = s.enemies.filter(e => ["dragon", "phoenix", "mechGolem", "shadowAssassin"].includes(e
                  .type));
                e.length > 0 && !r && e4(e_("dragon" === e[0].type ? "dragon" : "phoenix" === e[0].type ?
                  "phoenix" : "mechGolem" === e[0].type ? "mechGolem" : "shadowAssassin"), c)
              }
            },
            U = (e, t, o) => {
              if (ex.current <= 0) return;
              ex.current--;
              let a = ex.current;
              if (a <= 0) {
                eu.current = "";
                return
              }
              e.save(), e.globalAlpha = .8 * (a > 100 ? 1 : a / 100), e.fillStyle = "rgba(0,0,0,0.6)", e
                .fillRect(0, o / 2 - 35, t, 70), e.shadowBlur = 20, e.shadowColor = em.current, e.fillStyle =
                em.current, e.font = "bold 24px monospace", e.textAlign = "center", e.fillText(eu.current, t /
                  2, o / 2 + 8), e.shadowBlur = 0, e.globalAlpha = 1, e.restore()
            },
            eh = (e, t, o) => {
              if (et.current <= 0) return;
              et.current--;
              let a = et.current > 60 ? 1 : et.current / 60;
              e.save(), e.globalAlpha = .9 * a, e.shadowBlur = 10, e.shadowColor = er.current, e.fillStyle =
                er.current, e.font = "bold 16px monospace", e.textAlign = "center", e.fillText(el.current, t /
                  2, o - 100), e.shadowBlur = 0, e.globalAlpha = 1, e.restore()
            },
            eG = (e, t, o) => {
              if (ey.current <= 0 && ea.getState().introTimer > 0 && ea.getState().introText && (ep.current =
                  ea.getState().introText || "", eg.current = ea.getState().introColor, ey.current = ea
                  .getState().introTimer), !ep.current || ey.current <= 0) return;
              ey.current--;
              let a = ey.current;
              ey.current <= 0 && ea.setState({
                introTimer: 0
              });
              let l = a > 120 ? Math.min(1, (180 - a + 1) / 60) : a < 40 ? a / 40 : 1;
              e.save(), e.globalAlpha = .6 * l, e.fillStyle = "#000000", e.fillRect(0, o / 2 - 50, t, 100), e
                .globalAlpha = l, e.shadowBlur = 15, e.shadowColor = eg.current, e.fillStyle = eg.current, e
                .font = "bold 20px monospace", e.textAlign = "center", e.fillText(ep.current, t / 2, o / 2 +
                  5), e.shadowBlur = 0, e.globalAlpha = 1, e.restore()
            },
            eX = (e, t, o) => {
              if (!ej.current || eN.current <= 0) return;
              eN.current--;
              let a = ej.current,
                l = Math.min(1, eN.current / 30),
                r = 1 + .05 * Math.sin(.15 * eN.current);
              if (e.save(), e.globalAlpha = l, eN.current > a.duration - 10) {
                let r = (a.duration - eN.current + 1) / 10 * .3;
                e.fillStyle = a.color, e.globalAlpha = r, e.fillRect(0, 0, t, o), e.globalAlpha = l
              }
              e.textAlign = "center", e.font = `bold ${Math.floor(24*r)}px monospace`, e.fillStyle = a.color,
                e.shadowBlur = 20, e.shadowColor = a.color, e.fillText(a.text, t / 2, .3 * o), e.font =
                "bold 12px monospace", e.fillStyle = "#ffffff", e.shadowBlur = 5, e.shadowColor = "#ffffff", e
                .fillText(`[ ${a.type.toUpperCase()} ]`, t / 2, .35 * o), e.restore(), eN.current <= 0 && (ej
                  .current = null)
            },
            e5 = (e, t, o) => {
              if (ey.current > 0 || !B.current) return;
              let a = F.current;
              if (a > 300) return;
              let l = .7 * Math.max(0, 1 - a / 300);
              e.save(), e.globalAlpha = l;
              let r = o - 80;
              e.fillStyle = "rgba(0,0,0,0.5)", e.fillRect(t / 2 - 180, r - 10, 360, 30), e.strokeStyle = n, e
                .lineWidth = 1, e.strokeRect(t / 2 - 180, r - 10, 360, 30), e.fillStyle = n, e.font =
                "11px monospace", e.textAlign = "center", e.fillText(
                  "Joystick: Move | Buttons: Jump, Shoot, Skills", t / 2, r + 10), e.globalAlpha = 1, e
                .restore()
            },
            e8 = (e, t) => {
              let o, a = j.current,
                l = B.current;
              if (!a || !l) return;
              let r = x.current,
                u = g.current,
                w = b.current,
                k = I.current,
                C = D.current,
                S = W.current,
                T = O.current;
              for (let e of T) "moving" === e.type && e.moveSpeed && (e.moveOffset = (e.moveOffset || 0) +
                .02 * e.moveSpeed);
              let A = ea.getState().gameMode,
                R = "versus" === A,
                L = ea.getState().currentLevel;
              e9(a, r, w, k, C, S, T, l, R ? 1 : void 0), ei.current > 0 && (ei.current--, ei.current <= 0 &&
                (en.current = 0));
              let G = N.current,
                U = M.current;
              for (let e of (G && G.health > 0 && e9(G, u, U.active ? U : null, k, C, S, T, l, R ? 2 :
                  void 0), k)) {
                if (!e.active) continue;
                let t = Math.abs(e.x - a.x);
                switch (e.invincible > 0 && e.invincible--, e.isHit && (e.hitTimer--, e.hitTimer <= 0 && (e
                    .isHit = !1)), e.type) {
                  case "drone":
                    for (let o of (t < 500 ? (e.vx = e.x > a.x ? -1.5 : 1.5, e.facing = e.vx > 0 ? 1 : -1) : e
                        .vx = +e.facing, e.grounded && !eK(e.x, e.y, e.vx > 0 ? 1 : -1, T, l, e.width) && (e
                          .vx = 0, e.facing = -1 * e.facing), e.vy += .5, e.vy > 10 && (e.vy = 10), e.x += e
                        .vx, e.y += e.vy, e.grounded = !1, T)) {
                      let {
                        px: t,
                        py: a
                      } = eV(o);
                      e.x + e.width > t && e.x < t + o.width && e.y >= a - 4 && e.y - e.vy <= a + Math.max(10,
                        Math.abs(e.vy) + 8) && (e.y = a, e.vy = 0, e.grounded = !0)
                    }(e.x < 10 || e.x > l.width - 30) && (e.facing = -1 * e.facing), e.animFrame++;
                    break;
                  case "glitchWalker":
                    if (t < 600) {
                      let t = 2.5 + .5 * Math.sin(.1 * e.animFrame);
                      e.vx = e.x > a.x ? -t : t, e.facing = e.vx > 0 ? 1 : -1
                    } else e.vx = 1.5 * e.facing;
                    for (let t of (e.grounded && !eK(e.x, e.y, e.vx > 0 ? 1 : -1, T, l, e.width) && (e.vx = 0,
                          e.facing = -1 * e.facing), e.vy += .5, e.vy > 10 && (e.vy = 10), e.x += e.vx, e
                        .y += e.vy, e.grounded = !1, T)) {
                      let {
                        px: o,
                        py: a
                      } = eV(t);
                      e.x + e.width > o && e.x < o + t.width && e.y >= a - 4 && e.y - e.vy <= a + Math.max(10,
                        Math.abs(e.vy) + 8) && (e.y = a, e.vy = 0, e.grounded = !0)
                    }
                    if ((e.x < 10 || e.x > l.width - 30) && (e.facing = -1 * e.facing), e.shootCooldown -= (
                        eG ? 2 : 1), e.shootCooldown <= 0 && t < 500) {
                      let t = a.x - e.x,
                        o = a.y - 25 - (e.y - 25),
                        l = Math.sqrt(t * t + o * o);
                      l > 0 && C.push({
                        x: e.x + e.width / 2,
                        y: e.y - 25,
                        vx: t / l * 5.5,
                        vy: o / l * 5.5,
                        fromPlayer: !1,
                        damage: 10,
                        active: !0,
                        color: h,
                        radius: 3
                      }), e.shootCooldown = 49
                    }
                    e.animFrame++;
                    break;
                  case "voidGuardian":
                    if (e.facing = e.x > a.x ? -1 : 1, e.shootCooldown -= (eG ? 2 : 1), e.shootCooldown <=
                      0 && t < 500) {
                      let t = a.x - e.x,
                        o = a.y - 25 - (e.y - 15),
                        l = Math.sqrt(t * t + o * o);
                      if (l > 0)
                        for (let a = -.2; a <= .21; a += .2) {
                          let r = Math.cos(a),
                            n = Math.sin(a);
                          C.push({
                            x: e.x + e.width / 2,
                            y: e.y - 15,
                            vx: (t / l * r - o / l * n) * 4.5,
                            vy: (t / l * n + o / l * r) * 4.5,
                            fromPlayer: !1,
                            damage: 10,
                            active: !0,
                            color: c,
                            radius: 3
                          })
                        }
                      e.shootCooldown = 80
                    }
                    e.animFrame++;
                    break;
                  case "boss":
                  case "bossRedKing":
                  case "bossTitan":
                  case "bossDragon":
                  case "bossPhoenix":
                  case "bossMechGolem": {
                    e.facing = e.x > a.x ? -1 : 1, e.patternTimer++;
                    let o = Math.min(.5 + (eA.current - 1) * .15, .75);
                    e.health < e.maxHealth * o && !e.enraged && (e.enraged = !0, X.current = 15, eU(S, e.x + e
                      .width / 2, e.y - 40, 30, f), eZ(), eo.playBossEnrage(), e4(e_("bossEnrage"), f));
                    let r = e.enraged ? 1.5 : 1;
                    for (let t of (e.vy += .5, e.vy > 10 && (e.vy = 10), e.grounded = !1, T)) {
                      let {
                        px: o,
                        py: a
                      } = eV(t);
                      e.x + e.width > o && e.x < o + t.width && e.y >= a - 4 && e.y - e.vy <= a + Math.max(10,
                        Math.abs(e.vy) + 8) && (e.y = a, e.vy = 0, e.grounded = !0)
                    }
                    let n = e.patternTimer % 360,
                      h = 0;
                    if (n < 120 ? (h = a.x > e.x ? 1 : -1, e.vx = 2.5 * h * r) : e.vx = 0, e.grounded && 0 !==
                      h && !eK(e.x, e.y, h, T, l, e.width) && (e.vx = 0, e.facing = -1 * e.facing), e.x += e
                      .vx, n >= 120 && n < 240) {
                      if (e.shootCooldown -= (eG ? 2 : 1), e.shootCooldown <= 0) {
                        let t = a.x - e.x,
                          o = a.y - 25 - (e.y - 40),
                          l = Math.sqrt(t * t + o * o);
                        if (l > 0)
                          for (let a = -.3; a <= .31; a += .15) {
                            let r = Math.cos(a),
                              n = Math.sin(a),
                              h = "bossDragon" === e.type ? c : "bossPhoenix" === e.type ? d :
                              "bossMechGolem" === e.type ? s : i;
                            C.push({
                              x: e.x + e.width / 2,
                              y: e.y - 40,
                              vx: (t / l * r - o / l * n) * 5.5,
                              vy: (t / l * n + o / l * r) * 5.5,
                              fromPlayer: !1,
                              damage: 10,
                              active: !0,
                              color: h,
                              radius: 4
                            })
                          }
                        e.shootCooldown = 25 / r
                      }
                    } else if (n >= 240 && (240 === n && e.grounded && (e.vy = -14), 300 === n && e
                        .grounded && t < 130)) {
                      a.invincible <= 0 && !a.isShielding && (a.health -= 15, a.invincible = 40, a
                        .expression = "hurt", eU(S, a.x + a.width / 2, a.y - 25, 10, f), X.current = 12,
                        eZ(), eo.playHit());
                      for (let t = 0; t < 20; t++) S.push({
                        x: e.x + e.width / 2 + (Math.random() - .5) * 150,
                        y: e.y,
                        vx: (Math.random() - .5) * 4,
                        vy: -(5 * Math.random()),
                        life: 30,
                        maxLife: 30,
                        color: c,
                        size: 3
                      })
                    }
                    e.y += e.vy, e.animFrame++;
                    break
                  }
                  case "dragon":
                    if (e.vy += .15, e.vy > 3 && (e.vy = 3), t < 500 ? (e.vx = (a.x > e.x ? 1 : -1) * 2, e
                        .facing = e.vx > 0 ? 1 : -1, e.y - 25 > a.y - 40 && (e.vy -= .5), e.y - 25 < a.y -
                        60 && (e.vy += .3)) : (e.vx = +e.facing, e.vy += .3 * Math.sin(.05 * e.animFrame)), e
                      .x += e.vx, e.y += e.vy, e.shootCooldown -= (eG ? 2 : 1), e.shootCooldown <= 0 && t <
                      400) {
                      for (let t = -.15; t <= .16; t += .15) C.push({
                        x: e.x + e.width / 2,
                        y: e.y - 20,
                        vx: 5.5 * e.facing * Math.cos(t),
                        vy: 2 * Math.sin(t) - 1,
                        fromPlayer: !1,
                        damage: 10,
                        active: !0,
                        color: c,
                        radius: 4
                      });
                      e.shootCooldown = 50
                    }
                    e.animFrame++;
                    break;
                  case "phoenix":
                    e.vy += .125, e.vy > 3 && (e.vy = 3), t < 500 ? (e.vx = (a.x > e.x ? 1 : -1) * 2.5, e
                        .facing = e.vx > 0 ? 1 : -1, e.y - 25 > a.y - 30 && (e.vy -= .6), e.y - 25 < a.y -
                        70 && (e.vy += .4)) : (e.vx = 1.5 * e.facing, e.vy += .4 * Math.sin(.06 * e
                        .animFrame)), e.x += e.vx, e.y += e.vy, e.shootCooldown -= (eG ? 2 : 1), e
                      .shootCooldown <= 0 && t < 450 && (C.push({
                        x: e.x + e.width / 2,
                        y: e.y - 15,
                        vx: 6.5 * e.facing,
                        vy: 1,
                        fromPlayer: !1,
                        damage: 8,
                        active: !0,
                        color: d,
                        radius: 3
                      }), e.shootCooldown = 35), e.animFrame++;
                    break;
                  case "mechGolem":
                    for (let o of (t < 500 ? (e.vx = (a.x > e.x ? 1 : -1) * 1.2, e.facing = e.vx > 0 ? 1 : -
                        1) : e.vx = .8 * e.facing, e.grounded && !eK(e.x, e.y, e.vx > 0 ? 1 : -1, T, l, e
                          .width) && (e.vx = 0, e.facing = -1 * e.facing), e.vy += .5, e.vy > 10 && (e.vy =
                          10), e.x += e.vx, e.y += e.vy, e.grounded = !1, T)) {
                      let {
                        px: t,
                        py: a
                      } = eV(o);
                      e.x + e.width > t && e.x < t + o.width && e.y >= a - 4 && e.y - e.vy <= a + Math.max(10,
                        Math.abs(e.vy) + 8) && (e.y = a, e.vy = 0, e.grounded = !0)
                    }
                    if (e.shootCooldown -= (eG ? 2 : 1), e.shootCooldown <= 0 && t < 450) {
                      for (let t = -.1; t <= .11; t += .2) C.push({
                        x: e.x + e.width / 2,
                        y: e.y - 30,
                        vx: 5.5 * e.facing * Math.cos(t),
                        vy: -2 * Math.sin(t),
                        fromPlayer: !1,
                        damage: 12,
                        active: !0,
                        color: s,
                        radius: 4
                      });
                      e.shootCooldown = 60
                    }
                    e.animFrame++;
                    break;
                  case "shadowAssassin":
                    if (t < 500) {
                      let t = 3.5 + +Math.sin(.15 * e.animFrame);
                      e.vx = (a.x > e.x ? 1 : -1) * t, e.facing = e.vx > 0 ? 1 : -1
                    } else e.vx = 2 * e.facing;
                    for (let t of (e.grounded && !eK(e.x, e.y, e.vx > 0 ? 1 : -1, T, l, e.width) && (e.vx = 0,
                          e.facing = -1 * e.facing), e.vy += .5, e.vy > 10 && (e.vy = 10), e.x += e.vx, e
                        .y += e.vy, e.grounded = !1, T)) {
                      let {
                        px: o,
                        py: a
                      } = eV(t);
                      e.x + e.width > o && e.x < o + t.width && e.y >= a - 4 && e.y - e.vy <= a + Math.max(10,
                        Math.abs(e.vy) + 8) && (e.y = a, e.vy = 0, e.grounded = !0)
                    }
                    e.shootCooldown -= (eG ? 2 : 1), e.shootCooldown <= 0 && t < 200 && (C.push({
                      x: e.x + e.width / 2,
                      y: e.y - 25,
                      vx: 8.5 * e.facing,
                      vy: 0,
                      fromPlayer: !1,
                      damage: 14,
                      active: !0,
                      color: h,
                      radius: 3
                    }), e.shootCooldown = 25), e.animFrame++;
                    break;
                  case "eliteDrone":
                    for (let o of (t < 600 ? (e.vx = e.x > a.x ? -2 : 2, e.facing = e.vx > 0 ? 1 : -1) : e
                        .vx = 1.2 * e.facing, e.grounded && !eK(e.x, e.y, e.vx > 0 ? 1 : -1, T, l, e
                        .width) && (e.vx = 0, e.facing = -1 * e.facing), e.vy += .5, e.vy > 10 && (e.vy =
                          10), e.x += e.vx, e.y += e.vy, e.grounded = !1, T)) {
                      let {
                        px: t,
                        py: a
                      } = eV(o);
                      e.x + e.width > t && e.x < t + o.width && e.y >= a - 4 && e.y - e.vy <= a + Math.max(10,
                        Math.abs(e.vy) + 8) && (e.y = a, e.vy = 0, e.grounded = !0)
                    }
                    if (e.shootCooldown -= (eG ? 2 : 1), e.shootCooldown <= 0 && t < 500) {
                      let t = a.x - e.x,
                        o = a.y - 25 - (e.y - 25),
                        l = Math.sqrt(t * t + o * o);
                      l > 0 && C.push({
                        x: e.x + e.width / 2,
                        y: e.y - 25,
                        vx: t / l * 6,
                        vy: o / l * 6,
                        fromPlayer: !1,
                        damage: 12,
                        active: !0,
                        color: f,
                        radius: 3
                      }), e.shootCooldown = 35
                    }(e.x < 10 || e.x > l.width - 30) && (e.facing = -1 * e.facing), e.animFrame++;
                    break;
                  case "heavyWalker":
                    for (let o of (t < 500 ? (e.vx = (a.x > e.x ? 1 : -1) * 1, e.facing = e.vx > 0 ? 1 : -1) :
                        e.vx = .6 * e.facing, e.grounded && !eK(e.x, e.y, e.vx > 0 ? 1 : -1, T, l, e
                        .width) && (e.vx = 0, e.facing = -1 * e.facing), e.vy += .5, e.vy > 10 && (e.vy =
                          10), e.x += e.vx, e.y += e.vy, e.grounded = !1, T)) {
                      let {
                        px: t,
                        py: a
                      } = eV(o);
                      e.x + e.width > t && e.x < t + o.width && e.y >= a - 4 && e.y - e.vy <= a + Math.max(10,
                        Math.abs(e.vy) + 8) && (e.y = a, e.vy = 0, e.grounded = !0)
                    }
                    if (e.shootCooldown -= (eG ? 2 : 1), e.shootCooldown <= 0 && t < 450) {
                      for (let t = -.15; t <= .16; t += .15) C.push({
                        x: e.x + e.width / 2,
                        y: e.y - 30,
                        vx: 4.5 * e.facing * Math.cos(t),
                        vy: -1.5 * Math.sin(t),
                        fromPlayer: !1,
                        damage: 14,
                        active: !0,
                        color: c,
                        radius: 4
                      });
                      e.shootCooldown = 70
                    }(e.x < 10 || e.x > l.width - 30) && (e.facing = -1 * e.facing), e.animFrame++;
                    break;
                  case "bossCorrupted": {
                    e.facing = e.x > a.x ? -1 : 1, e.patternTimer++;
                    let t = Math.min(.5 + (eA.current - 1) * .15, .75);
                    e.health < e.maxHealth * t && !e.enraged && (e.enraged = !0, X.current = 15, eU(S, e.x + e
                      .width / 2, e.y - 40, 30, h), eZ(), eo.playBossEnrage());
                    let o = e.enraged ? 1.5 : 1;
                    for (let t of (e.vy += .5, e.vy > 10 && (e.vy = 10), e.grounded = !1, T)) {
                      let {
                        px: o,
                        py: a
                      } = eV(t);
                      e.x + e.width > o && e.x < o + t.width && e.y >= a - 4 && e.y - e.vy <= a + Math.max(10,
                        Math.abs(e.vy) + 8) && (e.y = a, e.vy = 0, e.grounded = !0)
                    }
                    let r = e.patternTimer % 300,
                      n = 0;
                    if (r < 100 ? (n = a.x > e.x ? 1 : -1, e.vx = 2 * n * o) : e.vx = 0, e.grounded && 0 !==
                      n && !eK(e.x, e.y, n, T, l, e.width) && (e.vx = 0, e.facing = -1 * e.facing), e.x += e
                      .vx, r >= 100 && r < 200) {
                      if (e.shootCooldown -= (eG ? 2 : 1), e.shootCooldown <= 0) {
                        for (let t = -.4; t <= .41; t += .2) C.push({
                          x: e.x + e.width / 2,
                          y: e.y - 40,
                          vx: 5 * e.facing * Math.cos(t),
                          vy: 3 * Math.sin(t),
                          fromPlayer: !1,
                          damage: 10,
                          active: !0,
                          color: h,
                          radius: 4
                        });
                        e.shootCooldown = 25 / o
                      }
                    } else r >= 200 && 200 === r && e.grounded && (e.vy = -13);
                    e.y += e.vy, e.animFrame++;
                    break
                  }
                  case "bossFather": {
                    e.facing = e.x > a.x ? -1 : 1, e.patternTimer++;
                    let t = Math.min(.4 + (eA.current - 1) * .15, .7);
                    e.health < e.maxHealth * t && !e.enraged && (e.enraged = !0, X.current = 15, eU(S, e.x + e
                      .width / 2, e.y - 40, 30, n), eZ(), eo.playBossEnrage());
                    let o = e.enraged ? 1.6 : 1;
                    for (let t of (e.vy += .5, e.vy > 10 && (e.vy = 10), e.grounded = !1, T)) {
                      let {
                        px: o,
                        py: a
                      } = eV(t);
                      e.x + e.width > o && e.x < o + t.width && e.y >= a - 4 && e.y - e.vy <= a + Math.max(10,
                        Math.abs(e.vy) + 8) && (e.y = a, e.vy = 0, e.grounded = !0)
                    }
                    let r = e.patternTimer % 360,
                      i = 0;
                    if (r < 80) i = a.x > e.x ? 1 : -1, e.vx = 2.5 * i * o;
                    else if (r >= 80 && r < 120) 80 === r && eU(S, e.x + e.width / 2, e.y - 25, 10, n), i = a
                      .x > e.x ? 1 : -1, e.vx = 8 * i * o, F.current % 3 == 0 && eU(S, e.x + e.width / 2, e
                        .y - 25, 2, n);
                    else if (r >= 120 && r < 220) {
                      if (e.vx = 0, e.shootCooldown -= (eG ? 2 : 1), e.shootCooldown <= 0) {
                        for (let t = -.6; t <= .61; t += .15) C.push({
                          x: e.x + e.width / 2,
                          y: e.y - 30,
                          vx: 6 * e.facing * Math.cos(t) * o,
                          vy: 4 * Math.sin(t),
                          fromPlayer: !1,
                          damage: 8,
                          active: !0,
                          color: n,
                          radius: 4
                        });
                        e.shootCooldown = 50 / o
                      }
                    } else {
                      if (220 === r && e.grounded && (e.vy = -14, eU(S, e.x + e.width / 2, e.y, 15, n)), r >
                        240 && e.grounded) {
                        X.current = 12;
                        for (let t = -3; t <= 3; t++) C.push({
                          x: e.x + e.width / 2 + 20 * t,
                          y: e.y - 5,
                          vx: 2.5 * t,
                          vy: -2,
                          fromPlayer: !1,
                          damage: 12,
                          active: !0,
                          color: n,
                          radius: 5
                        });
                        eU(S, e.x + e.width / 2, e.y, 20, n)
                      }
                      e.vx = a.x > e.x ? 1.5 : -1.5
                    }
                    e.grounded && 0 !== i && !eK(e.x, e.y, i, T, l, e.width) && (e.vx = 0, e.facing = -1 * e
                        .facing), e.x += e.vx, e.y += e.vy, e.x < 10 && (e.x = 10), e.x + e.width > l.width &&
                      (e.x = l.width - e.width), e.animFrame++;
                    break
                  }
                  case "bossTwin": {
                    e.facing = e.x > a.x ? -1 : 1, e.patternTimer++;
                    let t = Math.min(.4 + (eA.current - 1) * .15, .7);
                    e.health < e.maxHealth * t && !e.enraged && (e.enraged = !0, X.current = 15, eU(S, e.x + e
                      .width / 2, e.y - 40, 30, p), eZ(), eo.playBossEnrage());
                    let o = e.enraged ? 1.8 : 1;
                    for (let t of (e.vy += .5, e.vy > 10 && (e.vy = 10), e.grounded = !1, T)) {
                      let {
                        px: o,
                        py: a
                      } = eV(t);
                      e.x + e.width > o && e.x < o + t.width && e.y >= a - 4 && e.y - e.vy <= a + Math.max(10,
                        Math.abs(e.vy) + 8) && (e.y = a, e.vy = 0, e.grounded = !0)
                    }
                    let r = e.patternTimer % 400,
                      n = 0;
                    if (r < 60) n = a.x > e.x ? 1 : -1, e.vx = 10 * n * o, F.current % 2 == 0 && eU(S, e.x + e
                      .width / 2, e.y - 25, 2, p);
                    else if (r >= 60 && r < 180) {
                      if (e.vx = 0, e.shootCooldown -= (eG ? 2 : 1), e.shootCooldown <= 0) {
                        for (let t = -.5; t <= .51; t += .12) C.push({
                          x: e.x + e.width / 2,
                          y: e.y - 30,
                          vx: 7 * e.facing * Math.cos(t) * o,
                          vy: 3 * Math.sin(t),
                          fromPlayer: !1,
                          damage: 7,
                          active: !0,
                          color: p,
                          radius: 4
                        });
                        e.shootCooldown = Math.floor(62.5 / o)
                      }
                    } else if (r >= 180 && r < 260) e.vx = 0, 180 === r && eU(S, e.x + e.width / 2, e.y - 25,
                      15, "#4488ff"), F.current % 4 == 0 && eU(S, e.x + e.width / 2, e.y - 25, 1, "#88bbff");
                    else {
                      if (260 === r && e.grounded && (e.vy = -15, eU(S, e.x + e.width / 2, e.y, 15, p)), e
                        .vx = a.x > e.x ? 2 : -2, !e.grounded && F.current % 12 == 0)
                        for (let t = -.3; t <= .31; t += .15) C.push({
                          x: e.x + e.width / 2,
                          y: e.y - 30,
                          vx: 6 * e.facing * Math.cos(t),
                          vy: 4 * Math.sin(t),
                          fromPlayer: !1,
                          damage: 6,
                          active: !0,
                          color: "#88bbff",
                          radius: 3
                        });
                      if (r > 300 && e.grounded) {
                        X.current = 10;
                        for (let t = -4; t <= 4; t++) C.push({
                          x: e.x + e.width / 2 + 15 * t,
                          y: e.y - 5,
                          vx: 2 * t,
                          vy: -3,
                          fromPlayer: !1,
                          damage: 10,
                          active: !0,
                          color: p,
                          radius: 4
                        });
                        eU(S, e.x + e.width / 2, e.y, 25, p)
                      }
                    }
                    e.grounded && 0 !== n && !eK(e.x, e.y, n, T, l, e.width) && (e.vx = 0, e.facing = -1 * e
                        .facing), e.x += e.vx, e.y += e.vy, e.x < 10 && (e.x = 10), e.x + e.width > l.width &&
                      (e.x = l.width - e.width), e.animFrame++;
                    break
                  }
                  case "voidBat":
                    if (e.facing = e.x > a.x ? -1 : 1, t < 500) {
                      e.vx = (a.x > e.x ? 1 : -1) * 3;
                      let t = a.y - 60;
                      e.vy += (t - e.y) * .02
                    } else e.vx = 2 * e.facing, e.vy = 1.5 * Math.sin(.08 * e.animFrame);
                    e.vy += .3 * Math.sin(.12 * e.animFrame), e.vy > 4 && (e.vy = 4), e.vy < -4 && (e.vy = -
                      4), e.x += e.vx, e.y += e.vy, e.y < 40 && (e.y = 40), e.y > l.height - 50 && (e.y = l
                        .height - 50), (e.x < 10 || e.x > l.width - 30) && (e.facing = -1 * e.facing), e
                      .shootCooldown -= (eG ? 2 : 1), e.shootCooldown <= 0 && t < 400 && (C.push({
                        x: e.x + e.width / 2,
                        y: e.y - 10,
                        vx: 5 * e.facing,
                        vy: .5,
                        fromPlayer: !1,
                        damage: 5,
                        active: !0,
                        color: i,
                        radius: 2
                      }), e.shootCooldown = 40), e.animFrame++;
                    break;
                  case "stormEagle":
                    if (e.facing = e.x > a.x ? -1 : 1, t < 500) {
                      e.vx = (a.x > e.x ? 1 : -1) * 2;
                      let t = a.y - 80;
                      e.vy += (t - e.y) * .015
                    } else e.vx = 1.5 * e.facing, e.vy = 1.2 * Math.sin(.06 * e.animFrame);
                    if (e.vy += .2 * Math.sin(.1 * e.animFrame), e.vy > 3 && (e.vy = 3), e.vy < -3 && (e
                        .vy = -3), e.x += e.vx, e.y += e.vy, e.y < 50 && (e.y = 50), e.y > l.height - 60 && (e
                        .y = l.height - 60), (e.x < 10 || e.x > l.width - 30) && (e.facing = -1 * e.facing), e
                      .shootCooldown -= (eG ? 2 : 1), e.shootCooldown <= 0 && t < 450) {
                      let t = a.x - e.x,
                        o = a.y - 25 - (e.y - 20),
                        l = Math.sqrt(t * t + o * o);
                      l > 0 && C.push({
                        x: e.x + e.width / 2,
                        y: e.y - 20,
                        vx: t / l * 8,
                        vy: o / l * 8,
                        fromPlayer: !1,
                        damage: 10,
                        active: !0,
                        color: d,
                        radius: 4
                      }), e.shootCooldown = 60
                    }
                    e.animFrame++;
                    break;
                  case "emberWisp":
                    if (e.facing = e.x > a.x ? -1 : 1, t < 500) {
                      e.vx = (a.x > e.x ? 1 : -1) * 2.5;
                      let t = a.y - 50 + 30 * Math.sin(.1 * e.animFrame);
                      e.vy += (t - e.y) * .02
                    } else e.vx = 1.5 * e.facing, e.vy = 1.5 * Math.sin(.1 * e.animFrame);
                    e.vy += .4 * Math.sin(.15 * e.animFrame), e.vy > 4 && (e.vy = 4), e.vy < -4 && (e.vy = -
                      4), e.x += e.vx, e.y += e.vy, e.y < 30 && (e.y = 30), e.y > l.height - 50 && (e.y = l
                        .height - 50), (e.x < 10 || e.x > l.width - 30) && (e.facing = -1 * e.facing), e
                      .shootCooldown -= (eG ? 2 : 1), e.shootCooldown <= 0 && t < 400 && (C.push({
                        x: e.x + e.width / 2,
                        y: e.y - 8,
                        vx: 5 * e.facing,
                        vy: 1,
                        fromPlayer: !1,
                        damage: 7,
                        active: !0,
                        color: c,
                        radius: 3
                      }), e.shootCooldown = 35), e.animFrame++;
                    break;
                  case "frostWraith":
                    if (e.facing = e.x > a.x ? -1 : 1, t < 500) {
                      e.vx = (a.x > e.x ? 1 : -1) * 1.8;
                      let t = a.y - 70;
                      e.vy += (t - e.y) * .012
                    } else e.vx = +e.facing, e.vy = +Math.sin(.07 * e.animFrame);
                    if (e.vy += .3 * Math.sin(.09 * e.animFrame), e.vy > 3 && (e.vy = 3), e.vy < -3 && (e
                        .vy = -3), e.x += e.vx, e.y += e.vy, e.y < 40 && (e.y = 40), e.y > l.height - 60 && (e
                        .y = l.height - 60), (e.x < 10 || e.x > l.width - 30) && (e.facing = -1 * e.facing), e
                      .shootCooldown -= (eG ? 2 : 1), e.shootCooldown <= 0 && t < 450) {
                      for (let t = -.2; t <= .21; t += .2) C.push({
                        x: e.x + e.width / 2,
                        y: e.y - 20,
                        vx: 4 * e.facing * Math.cos(t),
                        vy: 2 * Math.sin(t),
                        fromPlayer: !1,
                        damage: 8,
                        active: !0,
                        color: "#88eeff",
                        radius: 3
                      });
                      e.shootCooldown = 65
                    }
                    e.animFrame++;
                    break;
                  case "shadowDrake":
                    if (e.facing = e.x > a.x ? -1 : 1, e.vy += .1, e.vy > 3 && (e.vy = 3), t < 600) {
                      e.vx = (a.x > e.x ? 1 : -1) * 2.5;
                      let t = a.y - 80;
                      e.vy += (t - e.y) * .015
                    } else e.vx = 1.5 * e.facing, e.vy += .4 * Math.sin(.07 * e.animFrame);
                    if (e.x += e.vx, e.y += e.vy, e.y < 30 && (e.y = 30), e.y > l.height - 60 && (e.y = l
                        .height - 60), (e.x < 10 || e.x > l.width - 30) && (e.facing = -1 * e.facing), e
                      .shootCooldown -= (eG ? 2 : 1), e.shootCooldown <= 0 && t < 400) {
                      for (let t = -.15; t <= .16; t += .15) C.push({
                        x: e.x + e.width / 2,
                        y: e.y - 20,
                        vx: 5 * e.facing * Math.cos(t),
                        vy: 1.5 * Math.sin(t),
                        fromPlayer: !1,
                        damage: 9,
                        active: !0,
                        color: h,
                        radius: 3
                      });
                      e.shootCooldown = 50
                    }
                    e.animFrame++;
                    break;
                  case "plasmaSerpent":
                    if (e.facing = e.x > a.x ? -1 : 1, t < 500) {
                      e.vx = (a.x > e.x ? 1 : -1) * 2.2;
                      let t = a.y - 65;
                      e.vy += (t - e.y) * .018
                    } else e.vx = 1.5 * e.facing, e.vy = 1.5 * Math.sin(.08 * e.animFrame);
                    if (e.vy += .5 * Math.sin(.12 * e.animFrame), e.vy > 4 && (e.vy = 4), e.vy < -4 && (e
                        .vy = -4), e.x += e.vx, e.y += e.vy, e.y < 30 && (e.y = 30), e.y > l.height - 60 && (e
                        .y = l.height - 60), (e.x < 10 || e.x > l.width - 30) && (e.facing = -1 * e.facing), e
                      .shootCooldown -= (eG ? 2 : 1), e.shootCooldown <= 0 && t < 450) {
                      let t = a.x - e.x,
                        o = a.y - 25 - (e.y - 20),
                        l = Math.sqrt(t * t + o * o);
                      l > 0 && C.push({
                        x: e.x + e.width / 2,
                        y: e.y - 15,
                        vx: t / l * 6,
                        vy: o / l * 6,
                        fromPlayer: !1,
                        damage: 10,
                        active: !0,
                        color: i,
                        radius: 4
                      }), e.shootCooldown = 55
                    }
                    e.animFrame++;
                    break;
                  case "neonWyrm":
                    if (e.facing = e.x > a.x ? -1 : 1, e.vy += .075, e.vy > 3 && (e.vy = 3), t < 600) {
                      e.vx = (a.x > e.x ? 1 : -1) * 2;
                      let t = a.y - 90;
                      e.vy += (t - e.y) * .01
                    } else e.vx = +e.facing, e.vy += .5 * Math.sin(.06 * e.animFrame);
                    if (e.x += e.vx, e.y += e.vy, e.y < 40 && (e.y = 40), e.y > l.height - 70 && (e.y = l
                        .height - 70), (e.x < 10 || e.x > l.width - 30) && (e.facing = -1 * e.facing), e
                      .shootCooldown -= (eG ? 2 : 1), e.shootCooldown <= 0 && t < 500) {
                      for (let t = -.3; t <= .31; t += .15) C.push({
                        x: e.x + e.width / 2,
                        y: e.y - 25,
                        vx: 5 * e.facing * Math.cos(t),
                        vy: 2 * Math.sin(t),
                        fromPlayer: !1,
                        damage: 12,
                        active: !0,
                        color: n,
                        radius: 4
                      });
                      e.shootCooldown = 70
                    }
                    e.animFrame++;
                    break;
                  case "crystalMoth":
                    if (e.facing = e.x > a.x ? -1 : 1, t < 500) {
                      e.vx = (a.x > e.x ? 1 : -1) * 2;
                      let t = a.y - 55 + 25 * Math.sin(.08 * e.animFrame);
                      e.vy += (t - e.y) * .02
                    } else e.vx = +e.facing, e.vy = +Math.sin(.1 * e.animFrame);
                    if (e.vy += .3 * Math.sin(.13 * e.animFrame), e.vy > 3 && (e.vy = 3), e.vy < -3 && (e
                        .vy = -3), e.x += e.vx, e.y += e.vy, e.y < 30 && (e.y = 30), e.y > l.height - 50 && (e
                        .y = l.height - 50), (e.x < 10 || e.x > l.width - 30) && (e.facing = -1 * e.facing), e
                      .shootCooldown -= (eG ? 2 : 1), e.shootCooldown <= 0 && t < 400) {
                      for (let t = -.25; t <= .26; t += .25) C.push({
                        x: e.x + e.width / 2,
                        y: e.y - 12,
                        vx: 4.5 * e.facing * Math.cos(t),
                        vy: 1.5 * Math.sin(t),
                        fromPlayer: !1,
                        damage: 6,
                        active: !0,
                        color: s,
                        radius: 3
                      });
                      e.shootCooldown = 50
                    }
                    e.animFrame++;
                    break;
                  case "zombie":
                    for (let o of (t < 600 ? (e.vx = a.x > e.x ? 1.2 : -1.2, e.facing = e.vx > 0 ? 1 : -1) : e
                        .vx = .8 * e.facing, e.grounded && !eK(e.x, e.y, e.vx > 0 ? 1 : -1, T, l, e
                        .width) && (e.vx = 0, e.facing = -1 * e.facing), e.vy += .5, e.vy > 10 && (e.vy =
                          10), e.x += e.vx, e.y += e.vy, e.grounded = !1, T)) {
                      let {
                        px: t,
                        py: a
                      } = eV(o);
                      e.x + e.width > t && e.x < t + o.width && e.y >= a - 4 && e.y - e.vy <= a + Math.max(10,
                        Math.abs(e.vy) + 8) && (e.y = a, e.vy = 0, e.grounded = !0)
                    }(e.x < 10 || e.x > l.width - 30) && (e.facing = -1 * e.facing), e.shootCooldown -= (eG ?
                      2 : 1), e.shootCooldown <= 0 && t < 80 && (C.push({
                      x: e.x + e.width / 2,
                      y: e.y - 25,
                      vx: 3 * e.facing,
                      vy: 0,
                      fromPlayer: !1,
                      damage: 8,
                      active: !0,
                      color: "#44aa44",
                      radius: 4
                    }), e.shootCooldown = 50), e.animFrame++;
                    break;
                  case "bomber":
                    for (let o of (t < 500 ? (e.vx = a.x > e.x ? 2.5 : -2.5, e.facing = e.vx > 0 ? 1 : -1) : e
                        .vx = 1.5 * e.facing, e.grounded && !eK(e.x, e.y, e.vx > 0 ? 1 : -1, T, l, e
                        .width) && (e.vx = 0, e.facing = -1 * e.facing), e.vy += .5, e.vy > 10 && (e.vy =
                          10), e.x += e.vx, e.y += e.vy, e.grounded = !1, T)) {
                      let {
                        px: t,
                        py: a
                      } = eV(o);
                      e.x + e.width > t && e.x < t + o.width && e.y >= a - 4 && e.y - e.vy <= a + Math.max(10,
                        Math.abs(e.vy) + 8) && (e.y = a, e.vy = 0, e.grounded = !0)
                    }
                    if ((e.x < 10 || e.x > l.width - 30) && (e.facing = -1 * e.facing), t < 60 && e.active) {
                      if (eU(S, e.x + e.width / 2, e.y - 20, 20, c), eU(S, e.x + e.width / 2, e.y - 20, 15,
                        f), X.current = 8, a.invincible <= 0) {
                        let e = L <= 3 ? 3 : L <= 50 ? 8 : 12;
                        a.health -= e, a.invincible = 40
                      }
                      e.active = !1, e.health = 0
                    }
                    e.animFrame++;
                    break;
                  case "necromancer":
                    for (let o of (e.facing = e.x > a.x ? -1 : 1, e.grounded && !eK(e.x, e.y, e.vx > 0 ? 1 : -
                          1, T, l, e.width) && (e.vx = 0, e.facing = -1 * e.facing), e.vy += .5, e.vy >
                        10 && (e.vy = 10), t < 400 ? e.vx = (a.x > e.x ? 1 : -1) * .5 : e.vx = .3 * e
                        .facing, e.x += e.vx, e.y += e.vy, e.grounded = !1, T)) {
                      let {
                        px: t,
                        py: a
                      } = eV(o);
                      e.x + e.width > t && e.x < t + o.width && e.y >= a - 4 && e.y - e.vy <= a + Math.max(10,
                        Math.abs(e.vy) + 8) && (e.y = a, e.vy = 0, e.grounded = !0)
                    }
                    if ((e.x < 10 || e.x > l.width - 30) && (e.facing = -1 * e.facing), e.shootCooldown -= (
                        eG ? 2 : 1), e.shootCooldown <= 0 && t < 500) {
                      let t = .5 * e.animFrame;
                      for (let o = 0; o < 3; o++) {
                        let a = t + o / 3 * Math.PI * 2;
                        C.push({
                          x: e.x + e.width / 2,
                          y: e.y - 25,
                          vx: 4 * Math.cos(a),
                          vy: 3 * Math.sin(a),
                          fromPlayer: !1,
                          damage: 7,
                          active: !0,
                          color: h,
                          radius: 3
                        })
                      }
                      e.shootCooldown = 55
                    }
                    e.animFrame++;
                    break;
                  case "giant":
                    for (let o of (t < 500 ? (e.vx = a.x > e.x ? .8 : -.8, e.facing = e.vx > 0 ? 1 : -1) : e
                        .vx = .5 * e.facing, e.grounded && !eK(e.x, e.y, e.vx > 0 ? 1 : -1, T, l, e
                        .width) && (e.vx = 0, e.facing = -1 * e.facing), e.vy += .5, e.vy > 10 && (e.vy =
                          10), e.x += e.vx, e.y += e.vy, e.grounded = !1, T)) {
                      let {
                        px: t,
                        py: a
                      } = eV(o);
                      e.x + e.width > t && e.x < t + o.width && e.y >= a - 4 && e.y - e.vy <= a + Math.max(10,
                        Math.abs(e.vy) + 8) && (e.y = a, e.vy = 0, e.grounded = !0)
                    }
                    if ((e.x < 10 || e.x > l.width - 30) && (e.facing = -1 * e.facing), e.shootCooldown -= (
                        eG ? 2 : 1), e.shootCooldown <= 0 && t < 300) {
                      for (let t = -2; t <= 2; t++) C.push({
                        x: e.x + e.width / 2 + 15 * t,
                        y: e.y - 5,
                        vx: 2 * t,
                        vy: -2,
                        fromPlayer: !1,
                        damage: 12,
                        active: !0,
                        color: c,
                        radius: 5
                      });
                      eU(S, e.x + e.width / 2, e.y, 15, c), X.current = 8, e.shootCooldown = 80
                    }
                    e.animFrame++
                }
                if (e.y > l.height + 100)
                  if ("boss" === e.type || "bossRedKing" === e.type || "bossTitan" === e.type ||
                    "bossDragon" === e.type || "bossPhoenix" === e.type || "bossMechGolem" === e.type ||
                    "bossCorrupted" === e.type || "bossFather" === e.type || "bossTwin" === e.type) {
                    let t = T[0],
                      o = 1 / 0;
                    for (let e of T) {
                      let {
                        px: l,
                        py: r
                      } = eV(e), n = Math.abs(l + e.width / 2 - a.x);
                      n < o && r < 530 && (o = n, t = e)
                    }
                    let {
                      px: l,
                      py: r
                    } = eV(t);
                    e.x = l + t.width / 2 - e.width / 2, e.y = r, e.vy = 0, e.grounded = !1, e.invincible = 60
                  } else e.active = !1;
                if (a.invincible <= 0 && !a.isShielding && e.active) {
                  let t = ez(e.type);
                  if (eO(a.x, a.y - a.height, a.width, a.height, e.x, e.y - t, e.width, t)) {
                    let t = L <= 3 ? 2 : L <= 50 ? "boss" === e.type ? 8 : 5 : "boss" === e.type ? 15 : 10;
                    a.health -= t, a.invincible = 40, a.expression = "hurt", eU(S, a.x + a.width / 2, a.y -
                        25, 8, f), X.current = L <= 3 ? 2 : 5, a.vx += a.x < e.x ? -6 : 6, eZ(), eo
                      .playDamage()
                  }
                }
                if (G && G.health > 0 && G.invincible <= 0 && !G.isShielding && e.active) {
                  let t = ez(e.type);
                  eO(G.x, G.y - G.height, G.width, G.height, e.x, e.y - t, e.width, t) && (G.health -=
                    "boss" === e.type ? 15 : 10, G.invincible = 40, G.expression = "hurt", eU(S, G.x + G
                      .width / 2, G.y - 25, 8, f), X.current = 5, G.vx += G.x < e.x ? -6 : 6, eZ(), eo
                    .playDamage())
                }
              }
              for (let e of es.current) {
                if (!e.active) continue;
                let t = Math.abs(e.x - a.x);
                for (let o of (t > 60 ? (e.vx = (a.x > e.x ? 1 : -1) * 4, e.facing = e.vx > 0 ? 1 : -1) : (e
                    .vx = 0, e.facing = a.facing), e.grounded && 0 !== e.vx && !eK(e.x, e.y, e.vx > 0 ?
                    1 : -1, T, l, 30) && (e.vx = 0, e.facing = -1 * e.facing), e.vy += .5, e.vy > 10 && (e
                    .vy = 10), e.x += e.vx, e.y += e.vy, e.grounded = !1, T)) {
                  let {
                    px: t,
                    py: a
                  } = eV(o);
                  e.x + 15 > t && e.x - 15 < t + o.width && e.y >= a - 4 && e.y - e.vy <= a + Math.max(10,
                    Math.abs(e.vy) + 8) && (e.y = a, e.vy = 0, e.grounded = !0)
                }
                if (e.y > l.height + 50 && (e.x = a.x - 40, e.y = a.y, e.vy = 0, e.grounded = !1, e
                    .invincible = 30), e.grounded && (!a.grounded || e.x < 10 || e.x > l.width - 30)) {
                  let t = a.x > e.x ? 1 : -1;
                  eK(e.x, e.y, t, T, l, 30) ? (e.vy = -10.2, e.grounded = !1) : a.y < e.y - 60 && (e.vy = -
                    10.2, e.grounded = !1)
                }
                if (e.shootCooldown -= (eG ? 2 : 1), e.shootCooldown <= 0) {
                  let t = k.find(t => t.active && 400 > Math.abs(t.x - e.x));
                  if (t) {
                    let o = t.x - e.x,
                      a = t.y - 25 - (e.y - 25),
                      l = Math.sqrt(o * o + a * a);
                    l > 0 && (C.push({
                        x: e.x,
                        y: e.y - 25,
                        vx: o / l * 7,
                        vy: a / l * 7,
                        fromPlayer: !0,
                        damage: 8,
                        active: !0,
                        color: e.color,
                        radius: 3,
                        fromGangMember: e.id
                      }), eU(S, e.x + 15 * e.facing, e.y - 25, 2, e.color)), e.shootCooldown = 50 + Math
                      .floor(30 * Math.random())
                  }
                }
                for (let t of (e.animFrame++, e.invincible > 0 && (e.invincible -= (eG ? 2 : 1)), k)) t
                  .active && e.invincible <= 0 && eO(e.x - 10, e.y - 45, 20, 45, t.x, t.y - ez(t.type), t
                    .width, ez(t.type)) && (e.health -= 10, e.invincible = 40, e.expression = "hurt", eU(S, e
                    .x, e.y - 25, 5, e.color));
                e.health <= 0 && (e.active = !1, eU(S, e.x, e.y - 25, 15, e.color)), e.expression = e
                  .shootCooldown < 20 ? "angry" : t < 200 ? "determined" : "neutral"
              }
              let _ = ec.current;
              if (_ && _.active) {
                let e = Math.abs(_.x - a.x),
                  t = a.y - _.y,
                  o = a.x - 30 * a.facing,
                  r = o > _.x ? 1 : o < _.x ? -1 : 0,
                  i = !1;
                for (let n of (_.grounded && 0 !== r && (i = !eK(_.x, _.y, r, T, l, 20)), i ? _.grounded &&
                    e > 60 && (_.vy = -10.8, _.grounded = !1) : (_.x += (o - _.x) * (e > 80 ? .12 : .06),
                      e > 80 && (_.x += (o - _.x) * .08)), e > 30 ? _.facing = a.x > _.x ? 1 : -1 : _
                    .facing = a.facing, _.vy += .25, _.vy > 6 && (_.vy = 6), t < -60 && _.grounded && (_
                      .vy = -10.2, _.grounded = !1), _.y += _.vy, _.grounded = !1, T)) {
                  let {
                    px: e,
                    py: t
                  } = eV(n);
                  _.x + 10 > e && _.x - 10 < e + n.width && _.y >= t && _.y - _.vy <= t + 4 && (_.y = t, _
                    .vy = 0, _.grounded = !0)
                }
                if (_.y > l.height + 50 && (_.x = a.x + 30, _.y = a.y - 20, _.vy = 0, _.grounded = !1, _
                    .invincible = 30), _.x < 0 && (_.x = 0), _.x > l.width && (_.x = l.width), _
                  .shootCooldown -= (eG ? 2 : 1), _.shootCooldown <= 0) {
                  let e = k.find(e => e.active && 350 > Math.abs(e.x - _.x));
                  if (e) {
                    let t = e.x - _.x,
                      o = e.y - 20 - (_.y - 15),
                      a = Math.sqrt(t * t + o * o);
                    if (a > 0) {
                      let e = v.find(e => e.id === _.type) || v[0];
                      C.push({
                        x: _.x,
                        y: _.y - 15,
                        vx: t / a * 6,
                        vy: o / a * 6,
                        fromPlayer: !0,
                        damage: e.damage,
                        active: !0,
                        color: _.skinColor,
                        radius: 3,
                        fromPet: !0
                      }), eU(S, _.x + 10 * _.facing, _.y - 15, 2, _.skinColor), eZ(), eo.playPetShoot()
                    }
                    _.shootCooldown = v.find(e => e.id === _.type)?.shootRate || 45
                  }
                }
                for (let e of (_.animFrame++, _.invincible > 0 && _.invincible--, k)) e.active && _
                  .invincible <= 0 && eO(_.x - 8, _.y - 20, 16, 20, e.x, e.y - ez(e.type), e.width, ez(e
                    .type)) && (_.health -= 8, _.invincible = 40, eU(S, _.x, _.y - 10, 5, _.skinColor), eZ(),
                    eo.playDamage());
                _.health <= 0 && (_.active = !1, _.respawnTimer = 600, eU(S, _.x, _.y - 15, 15, _.skinColor),
                  eZ(), eo.playPetDeath(), e4("", n))
              } else _ && !_.active && (_.respawnTimer--, _.respawnTimer <= 0 && (_.active = !0, _.health = _
                .maxHealth, _.x = a.x + 30, _.y = a.y - 20, _.invincible = 60, eZ(), eo.playPetRespawn(),
                e4("", s)));
              let K = ea.getState().currentLevel;
              K <= 3 ? a.health < a.maxHealth && (a.health = Math.min(a.maxHealth, a.health + 2)) : K <= 50 &&
                a.health < a.maxHealth && F.current % 30 == 0 && (a.health = Math.min(a.maxHealth, a.health +
                  1)), ef.current--, ef.current <= 0 && (ef.current = 600, a.health > 0 && a.health < .25 * a
                  .maxHealth && ea.getState().triggerDramaticMoment("Stay with me! We're not done!", f), k
                  .find(e => e.active && ("boss" === e.type || "bossRedKing" === e.type || "bossTitan" === e
                      .type || "bossDragon" === e.type || "bossPhoenix" === e.type || "bossMechGolem" === e
                      .type || "bossCorrupted" === e.type || "bossFather" === e.type || "bossTwin" === e.type
                      ) && e.health < .25 * e.maxHealth) && ea.getState().triggerDramaticMoment("FINISH HIM!",
                    m));
              let q = ew.current;
              for (let t of C) {
                if (!t.active) continue;
                if (t.x += t.vx * q, t.y += t.vy * q, t.x < $.current - 50 || t.x > $.current + e + 50 || t
                  .y < -50 || t.y > l.height + 50) {
                  t.active = !1;
                  continue
                }
                let o = !1;
                for (let e of T) {
                  let {
                    px: a,
                    py: l
                  } = eV(e);
                  if (t.x + t.radius > a && t.x - t.radius < a + e.width && t.y + t.radius > l && t.y - t
                    .radius < l + e.height) {
                    o = !0;
                    break
                  }
                }
                if (o) {
                  t.active = !1, eU(S, t.x, t.y, 5, t.color);
                  continue
                }
                if (t.fromPlayer)
                  for (let e of k) {
                    if (!e.active) continue;
                    let o = ez(e.type);
                    if (eO(t.x - t.radius, t.y - t.radius, 2 * t.radius, 2 * t.radius, e.x, e.y - o, e.width,
                        o)) {
                      e.health -= t.damage, e.isHit = !0, e.hitTimer = 5, e.vx += (t.vx > 0 ? 3 : -3), t
                        .active = !1, eU(S, t.x, t.y, 8, t.color), X.current = 3;
                      let o = "boss" === e.type || "bossRedKing" === e.type || "bossTitan" === e.type ||
                        "bossDragon" === e.type || "bossPhoenix" === e.type || "bossMechGolem" === e.type ||
                        "bossCorrupted" === e.type || "bossFather" === e.type || "bossTwin" === e.type;
                      if (eZ(), eo.playHit(), e.health <= 0) {
                        e.active = !1;
                        let t = "boss" === e.type ? 500 : "voidGuardian" === e.type ? 150 : 100;
                        if (z.current += t, en.current++, ei.current = 120, en.current > 2 && (z.current +=
                            10 * en.current), o) {
                          eU(S, e.x + e.width / 2, e.y - 25, 60, i), eU(S, e.x + e.width / 2, e.y - 25, 40,
                            f), eU(S, e.x + e.width / 2, e.y - 25, 30, c), eU(S, e.x + e.width / 2, e.y - 25,
                              20, d), X.current = 20;
                          let t = e.bossName || "BOSS";
                          e6(`${t} DEFEATED!`, m)
                        } else eU(S, e.x + e.width / 2, e.y - 25, 15, c), X.current = 5;
                        a.expression = "victory", o ? (eo.stopBossMusic(), eo.startMusic(), eo
                        .playExplosion()) : eo.playEnemyDeath(), .25 > Math.random() && e4(e_("kill"), n)
                      }
                      break
                    }
                  } else {
                    if (a.isShielding) eO(t.x - t.radius, t.y - t.radius, 2 * t.radius, 2 * t.radius, a.x -
                      10, a.y - a.height - 10, a.width + 20, a.height + 20) && (t.active = !1, eU(S, t.x, t
                      .y, 5, s));
                    else if (a.invincible <= 0 && eO(t.x - t.radius, t.y - t.radius, 2 * t.radius, 2 * t
                        .radius, a.x, a.y - a.height, a.width, a.height)) {
                      let e = L <= 3 ? 2 : L <= 50 ? 5 : 10;
                      a.health -= Math.min(t.damage, e), a.invincible = 40, a.expression = "hurt", t
                        .active = !1, eU(S, t.x, t.y, 8, f), X.current = 4, eZ(), eo.playDamage(), .3 > Math
                        .random() && e4(e_("damage"), f)
                    }
                    G && G.health > 0 && t.active && (G.isShielding ? eO(t.x - t.radius, t.y - t.radius, 2 * t
                        .radius, 2 * t.radius, G.x - 10, G.y - G.height - 10, G.width + 20, G.height + 20
                        ) && (t.active = !1, eU(S, t.x, t.y, 5, s)) : G.invincible <= 0 && eO(t.x - t
                        .radius, t.y - t.radius, 2 * t.radius, 2 * t.radius, G.x, G.y - G.height, G.width, G
                        .height) && (G.health -= t.damage, G.invincible = 40, G.expression = "hurt", t
                        .active = !1, eU(S, t.x, t.y, 8, f), X.current = 4, eZ(), eo.playDamage()))
                  }
                R && t.active && t.fromPlayer && t.fromPlayerId && (1 === t.fromPlayerId && G && G.health >
                  0 ? G.isShielding ? eO(t.x - t.radius, t.y - t.radius, 2 * t.radius, 2 * t.radius, G.x -
                    10, G.y - G.height - 10, G.width + 20, G.height + 20) && (t.active = !1, eU(S, t.x, t.y,
                    5, s), a.invincible <= 0 && (a.health -= 3, a.invincible = 20)) : G.invincible <= 0 &&
                  eO(t.x - t.radius, t.y - t.radius, 2 * t.radius, 2 * t.radius, G.x, G.y - G.height, G
                    .width, G.height) && (G.health -= t.damage, G.invincible = 40, G.expression = "hurt", t
                    .active = !1, eU(S, t.x, t.y, 10, c), X.current = 5, eZ(), eo.playDamage()) : 2 === t
                  .fromPlayerId && a.health > 0 && (a.isShielding ? eO(t.x - t.radius, t.y - t.radius, 2 * t
                      .radius, 2 * t.radius, a.x - 10, a.y - a.height - 10, a.width + 20, a.height + 20) &&
                    (t.active = !1, eU(S, t.x, t.y, 5, s), G && G.invincible <= 0 && (G.health -= 3, G
                      .invincible = 20)) : a.invincible <= 0 && eO(t.x - t.radius, t.y - t.radius, 2 * t
                      .radius, 2 * t.radius, a.x, a.y - a.height, a.width, a.height) && (a.health -= t
                      .damage, a.invincible = 40, a.expression = "hurt", t.active = !1, eU(S, t.x, t.y, 10,
                        n), X.current = 5, eZ(), eo.playDamage())))
              }
              for (let e of (D.current = C.filter(e => e.active), D.current.length > 100 && (D.current = D
                  .current.slice(-100)), F.current % 120 == 0 && eS.current.active && (I.current = I
                  .current.filter(e => e.active)), S)) e.x += e.vx, e.y += e.vy, e.vy += .05, e.life--;
              let Y = S.filter(e => e.life > 0);
              for (let e of (Y.length > 200 && Y.splice(0, Y.length - 200), W.current = Y, ek.current))
                if (!e.collected && (e.animFrame++, eO(a.x, a.y - a.height, a.width, a.height, e.x - 10, e.y -
                    10, 20, 20))) {
                  e.collected = !0;
                  let t = 1 + .1 * en.current,
                    o = Math.round(e.value * t);
                  eC.current += Math.ceil(o / 5), z.current += o, eU(S, e.x, e.y, 8 + Math.min(en.current,
                    10), m), eZ(), eo.playCoinCollect()
                } for (let e of e2.current)
                if (!e.opened && eO(a.x, a.y - a.height, a.width, a.height, e.x - 15, e.y - 15, 30, 30)) {
                  if (e.opened = !0, "coins" === e.reward) {
                    let t = 1 + .1 * en.current,
                      o = Math.round(e.value * t);
                    z.current += o, eC.current += Math.ceil(o / 5), eU(S, e.x, e.y, 12, m)
                  } else if ("skill" === e.reward) {
                    let t = P.filter(e => "purchase" === e.unlockMethod && !ea.getState().saveData
                      .unlockedSkills.includes(e.id));
                    if (t.length > 0) {
                      let e = t[Math.floor(Math.random() * t.length)],
                        o = ea.getState().saveData,
                        a = {
                          ...o,
                          unlockedSkills: [...o.unlockedSkills, e.id]
                        };
                      Z(a), ea.setState({
                        saveData: a
                      }), e4("SKILL UNLOCKED: " + e.name + "!", e.color)
                    } else z.current += 50, eU(S, e.x, e.y, 15, m)
                  }
                  eU(S, e.x, e.y, 10, c), eZ(), eo.playCoinCollect()
                } for (let e of e1.current) e.cooldownTimer > 0 && (e.cooldownTimer -= (eG ? 2 : 1)), e
                .activeTimer > 0 && (e.activeTimer--, e.activeTimer <= 0 && (e.isActive = !1));
              if (e1.current.find(e => "bloodFury" === e.id && e.isActive) && (a.shootCooldown = Math.max(0, a
                    .shootCooldown - 2), F.current % 30 == 0 && (a.health = Math.max(1, a.health - 1)), F
                  .current % 3 == 0 && eU(S, a.x + a.width / 2, a.y - 25, 1, "#ff0000")), !eP.current && I
                .current.length > 0) {
                let t = eM.current,
                  o = I.current.filter(e => !e.active).length;
                if (t > 0 && o >= t * (.4 + y % 7 * .05)) {
                  let t = function(e) {
                    if (H[e]) return H[e];
                    if (e >= 9 && e <= 100) {
                      let t = e % 10;
                      if (3 === t || 6 === t || 9 === t) {
                        let t = V(e + 3333),
                          o = ["ambush", "thugsAppear", "trapTriggered", "allyArrives", "warning"],
                          a = o[Math.floor(t() * o.length)];
                        return {
                          type: a,
                          text: ({
                            ambush: "AMBUSH! WATCH YOUR BACK!",
                            thugsAppear: "THUGS BLOCKING THE PATH!",
                            bossSurprise: "A HIDDEN BOSS AWAKENS!",
                            allyArrives: "REINFORCEMENTS ARRIVED!",
                            trapTriggered: "TRAP SPRUNG! BE CAREFUL!",
                            voidRift: "A VOID RIFT TEARS OPEN!",
                            betrayal: "WAIT... WHOSE SIDE ARE YOU ON?!",
                            rescue: "SOMEONE NEEDS SAVING!",
                            treasure: "RARE LOOT AHEAD!",
                            warning: "DANGER APPROACHES...",
                            flashback: "A MEMORY SURFACES...",
                            earthquake: "THE GROUND SHAKES!"
                          })[a],
                          color: "ambush" === a ? f : "thugsAppear" === a ? c : d,
                          spawnEnemies: "ambush" === a || "thugsAppear" === a ? e > 20 ? ["voidGuardian",
                            "glitchWalker"
                          ] : ["drone", "glitchWalker"] : [],
                          enemyCount: "ambush" === a || "thugsAppear" === a ? 2 + Math.floor(3 * t()) : 0,
                          duration: 120
                        }
                      }
                    }
                    if (e > 100) {
                      let t = e % 10;
                      if (3 === t || 5 === t || 7 === t) {
                        let t = V(e + 7777),
                          o = ["ambush", "thugsAppear", "voidRift", "trapTriggered", "bossSurprise",
                            "betrayal"
                          ],
                          a = o[Math.floor(t() * o.length)];
                        return {
                          type: a,
                          text: ({
                            ambush: "AMBUSH! ENEMIES FROM THE SHADOWS!",
                            thugsAppear: "THUGS AHEAD! FIGHT THROUGH!",
                            bossSurprise: "SURPRISE BOSS! PREPARE YOURSELF!",
                            allyArrives: "REINFORCEMENTS HAVE ARRIVED!",
                            trapTriggered: "TRAP TRIGGERED! WATCH YOUR STEP!",
                            voidRift: "A VOID RIFT TEARS OPEN!",
                            betrayal: "SOMEONE IS TURNING AGAINST YOU!",
                            rescue: "A PRISONER NEEDS SAVING!",
                            treasure: "RARE LOOT DETECTED!",
                            warning: "DANGER APPROACHES...",
                            flashback: "A MEMORY SURFACES...",
                            earthquake: "THE GROUND SHAKES!"
                          })[a],
                          color: "bossSurprise" === a ? f : "voidRift" === a ? i : "ambush" === a ? c : d,
                          spawnEnemies: "bossSurprise" === a ? ["bossCorrupted"] : e > 150 ? ["eliteDrone",
                            "heavyWalker", "shadowAssassin"
                          ] : e > 50 ? ["voidGuardian", "eliteDrone"] : ["glitchWalker", "drone"],
                          enemyCount: "bossSurprise" === a ? 1 : 2 + Math.floor(4 * t()),
                          duration: "bossSurprise" === a ? 180 : 120
                        }
                      }
                    }
                    return null
                  }(y);
                  if (t) {
                    if (ej.current = t, eN.current = t.duration, eP.current = !0, t.spawnEnemies && t
                      .spawnEnemies.length > 0 && t.enemyCount) {
                      for (let o = 0; o < t.enemyCount; o++) {
                        let r = t.spawnEnemies[o % t.spawnEnemies.length],
                          n = "boss" === r || "bossRedKing" === r || "bossTitan" === r || "bossDragon" ===
                          r || "bossPhoenix" === r || "bossMechGolem" === r || "bossCorrupted" === r ||
                          "bossFather" === r || "bossTwin" === r,
                          i = "voidGuardian" === r,
                          s = "eliteDrone" === r,
                          c = "heavyWalker" === r,
                          d = "dragon" === r,
                          h = "phoenix" === r,
                          f = "mechGolem" === r,
                          u = "shadowAssassin" === r,
                          m = "bossTitan" === r ? 500 : "bossRedKing" === r ? 400 : "boss" === r ? 300 :
                          "bossDragon" === r ? 600 : "bossPhoenix" === r ? 450 : "bossMechGolem" === r ? 550 :
                          "bossCorrupted" === r ? 480 : "bossTwin" === r ? 700 : 150,
                          x = 20,
                          p = 50,
                          g = 20;
                        n ? (x = 60, p = 80, g = m) : i ? (x = 30, p = 30, g = 25) : s ? (x = 20, p = 50, g =
                            30) : c ? (x = 25, p = 55, g = 40) : d ? (x = 35, p = 40, g = 45) : h ? (x = 25,
                            p = 40, g = 35) : f ? (x = 30, p = 55, g = 60) : u ? (x = 18, p = 50, g = 25) :
                          "drone" === r ? g = 20 : "glitchWalker" === r ? g = 25 : "voidBat" === r ? (x = 16,
                            p = 30, g = 15) : "stormEagle" === r ? (x = 24, p = 45, g = 30) : "emberWisp" ===
                          r ? (x = 16, p = 30, g = 18) : "frostWraith" === r ? (x = 22, p = 45, g = 35) :
                          "shadowDrake" === r ? (x = 30, p = 55, g = 40) : "plasmaSerpent" === r ? (x = 26,
                            p = 50, g = 35) : "neonWyrm" === r ? (x = 32, p = 60, g = 50) : "crystalMoth" ===
                          r ? (x = 18, p = 35, g = 20) : "zombie" === r ? (x = 22, p = 55, g = 55) :
                          "giant" === r ? (x = 55, p = 80, g = 150) : "necromancer" === r ? (x = 20, p = 50,
                            g = 40) : "bomber" === r && (x = 18, p = 45, g = 25);
                        let y = Math.min(a.x + a.facing * (.4 * e) + 60 * o, l.width - 40),
                          b = E(r) || "necromancer" === r;
                        I.current.push({
                          x: Math.max(40, y),
                          y: b ? 200 + Math.floor(150 * Math.random()) : 480,
                          width: x,
                          height: p,
                          vx: 0,
                          vy: 0,
                          type: r,
                          health: g,
                          maxHealth: g,
                          facing: -1,
                          shootCooldown: 70 + Math.floor(30 * Math.random()),
                          animFrame: 10 * o,
                          animTimer: 0,
                          active: !0,
                          grounded: !b,
                          patternTimer: 0,
                          invincible: 0,
                          isHit: !1,
                          hitTimer: 0,
                          bossName: n ? "SURPRISE BOSS" : void 0,
                          bossColor: n ? t.color : void 0
                        })
                      }
                      eM.current += t.enemyCount, X.current = 8
                    }
                    eZ(), eo.playAbilityReady()
                  }
                }
              }
              let J = eS.current,
                Q = ea.getState(),
                et = Q.currentWave >= Q.totalWaves - 1,
                el = eJ.current,
                er = I.current.filter(e => !e.isAmbient && e.active && e.y < 600 && e.y > -100),
                ed = el > 0 && 0 === er.length,
                eh = 0 === eR.current.length;
              if (et && ed && ee.current && eh && !J.active && (J.active = !0, e4(
                  "EXIT OPEN! Reach the gate!", s)), J.active && eO(a.x, a.y - a.height, a.width, a.height, J
                  .x - 40, J.y - 80, 80, 90)) {
                z.current += 200;
                let e = Math.round(Math.max(0, a.health) / a.maxHealth * 100),
                  t = a.kills,
                  o = eM.current,
                  l = eT.current,
                  r = Math.floor(z.current / 5),
                  n = 1;
                (e > 40 || t >= .5 * o) && (n = 2), e > 70 && t >= .8 * o && (n = 3), ea.setState({
                  lastLevelStars: n,
                  lastLevelKills: t,
                  lastLevelMaxCombo: l,
                  lastLevelCoinsEarned: r,
                  lastLevelHealthPct: e,
                  lastLevelTotalEnemies: o
                }), ea.getState().completeLevel(z.current);
                return
              }
              en.current > eT.current && (eT.current = en.current);
              let eu = I.current.filter(e => !e.isAmbient && e.active && e.y < 600 && e.y > -100);
              if (eJ.current > 0 && 0 === eu.length && 0 === eR.current.length && ee.current) {
                .5 > Math.random() && e4(e_("waveClear"), s), eZ(), eo.playWaveComplete(), ee.current = !1;
                let e = ea.getState();
                e.currentWave < e.totalWaves - 1 && ea.getState().advanceWave()
              }
              let em = ea.getState().currentWave >= ea.getState().totalWaves - 1 && ee.current;
              if ("single" === A && !em && (eq.current--, eq.current <= 0)) {
                let e = ea.getState().currentLevel;
                if (I.current.filter(e => e.active).length < Math.min(2 + Math.floor(e / 25), 6) && a.health >
                  0) {
                  let t = 300 + 400 * Math.random(),
                    o = a.x + a.facing * t,
                    l = eS.current,
                    r = l.active && 200 > Math.abs(o - l.x);
                  if (o > 100 && o < (B.current?.width || 9999) - 200 && !r) {
                    let t = ["drone", "glitchWalker"];
                    e >= 10 && t.push("eliteDrone", "shadowAssassin"), e >= 20 && t.push("zombie", "voidBat"),
                      e >= 40 && t.push("bomber", "necromancer");
                    let l = t[Math.floor(Math.random() * t.length)],
                      r = E(l),
                      n = Math.floor(("zombie" === l ? 55 : "bomber" === l ? 25 : "necromancer" === l ? 40 :
                        "shadowAssassin" === l ? 25 : "eliteDrone" === l ? 30 : 20) * (e <= 3 ? .4 : e <=
                        50 ? .6 + .2 * Math.log(1 + (e - 3) / 80) : e <= 200 ? 1 + .25 * Math.log(1 + (e -
                          50) / 50) : 1.35 + .3 * Math.log(1 + (e - 200) / 100))),
                      i = e <= 3 ? .5 : e <= 50 ? Math.min(.7 + e / 500, 1) : Math.min(1 + e / 250, 2.5);
                    I.current.push({
                      x: o,
                      y: r ? 150 + 200 * Math.random() : 480,
                      width: "zombie" === l ? 22 : "bomber" === l ? 18 : 20,
                      height: "zombie" === l ? 55 : "bomber" === l ? 45 : 50,
                      vx: 0,
                      vy: 0,
                      type: l,
                      health: n,
                      maxHealth: n,
                      facing: -1 * a.facing,
                      shootCooldown: Math.floor((70 + Math.floor(30 * Math.random())) / i),
                      animFrame: 0,
                      animTimer: 0,
                      active: !0,
                      grounded: !r,
                      patternTimer: 0,
                      invincible: 0,
                      isHit: !1,
                      hitTimer: 0,
                      isAmbient: !0
                    }), eY.current++
                  }
                }
                eq.current = (e <= 10 ? 200 : e <= 30 ? 150 : e <= 60 ? 100 : 70) + Math.floor(60 * Math
                  .random())
              }
              ea.getState().currentLevel <= 3 && a.health < 1 && (a.health = 1);
              let ex = a.health <= 0,
                ep = !G || G.health <= 0;
              if (R) {
                if (ex || ep) {
                  let e = e => {
                    let t = j.current;
                    if (t) {
                      for (let o = 0; o < 40; o++) {
                        let a = 2 * Math.PI * o / 40,
                          l = 2 + 4 * Math.random();
                        W.current.push({
                          x: t.x + t.width / 2,
                          y: t.y + t.height / 2,
                          vx: Math.cos(a) * l,
                          vy: Math.sin(a) * l - 2,
                          life: 80 + 40 * Math.random(),
                          maxLife: 120,
                          color: e,
                          size: 2 + 3 * Math.random(),
                          type: "spark"
                        })
                      }
                      for (let e = 0; e < 20; e++) {
                        let o = 2 * Math.PI * e / 20;
                        W.current.push({
                          x: t.x + t.width / 2 + 60 * Math.cos(o),
                          y: t.y + t.height / 2 + 60 * Math.sin(o),
                          vx: .5 * Math.cos(o),
                          vy: .5 * Math.sin(o) - 1,
                          life: 50 + 30 * Math.random(),
                          maxLife: 80,
                          color: "#ffd700",
                          size: 4 + 2 * Math.random(),
                          type: "spark"
                        })
                      }
                    }
                  };
                  if (eZ(), eo.stopAll(), ex && !ep) {
                    e(c), ea.getState().versusRoundWin(2);
                    return
                  }
                  if (ep && !ex) {
                    e(n), ea.getState().versusRoundWin(1);
                    return
                  }
                  if (ex && ep) {
                    e("#ffd700"), ea.getState().versusRoundWin(3);
                    return
                  }
                }
              } else if (ex && ep || !G && ex) {
                eZ(), eo.playGameOver(), ea.getState().gameOver();
                return
              }
              o = G && G.health > 0 && !ex ? (a.x + G.x) / 2 - e / 2 + a.width / 2 : G && G.health > 0 && ex ?
                G.x - e / 2 + G.width / 2 : a.x - e / 2 + a.width / 2, $.current += (o - $.current) * .1, $
                .current = Math.max(0, Math.min($.current, l.width - e))
            },
            e7 = (e, t, o) => {
              var a, l, r, x, g, y, b, v, w, k, C, S, T, M, P, A;
              let R = B.current,
                E = j.current,
                L = N.current;
              if (!R || !E) {
                e.fillStyle = "#050510", e.fillRect(0, 0, t, o), e.save(), e.globalAlpha = .6 + .3 * Math.sin(
                    .05 * F.current), e.fillStyle = n, e.shadowBlur = 15, e.shadowColor = n, e.font =
                  "bold 16px monospace", e.textAlign = "center", e.textBaseline = "middle", e.fillText(
                    "LOADING...", t / 2, o / 2), e.shadowBlur = 0, e.globalAlpha = 1, e.restore();
                return
              }
              let G = $.current;
              for (let a of (! function(e, t, o, a, l, r, s, m) {
                  if (m) {
                    let t = e.createLinearGradient(0, 0, 0, o),
                      a = m.skyGradient;
                    for (let e = 0; e < a.length; e++) t.addColorStop(e / (a.length - 1), a[e]);
                    e.fillStyle = t
                  } else e.fillStyle = u;
                  e.fillRect(0, 0, t, o), e.globalAlpha = .55, e.fillStyle = "#000008", e.fillRect(0, 0,
                    t, o), e.globalAlpha = 1, m && "none" !== m.weatherType && function(e, t, o) {
                    if (.015 > Math.random()) {
                      let e = 2 + Math.floor(3 * Math.random()),
                        a = [],
                        l = Math.random() * t,
                        r = 0;
                      a.push({
                        x: l,
                        y: r
                      });
                      for (let t = 0; t < e; t++) l += (Math.random() - .5) * 120, r += o / (e + 1) +
                        40 * Math.random(), a.push({
                          x: l,
                          y: Math.min(r, o)
                        });
                      eL.push({
                        segments: a,
                        life: 6 + Math.floor(4 * Math.random()),
                        flashLife: 4
                      })
                    }
                    for (let a = eL.length - 1; a >= 0; a--) {
                      let l = eL[a];
                      if (l.life--, l.flashLife--, l.life <= 0) {
                        eL.splice(a, 1);
                        continue
                      }
                      l.flashLife > 0 && (e.globalAlpha = .15 * (l.flashLife / 4), e.fillStyle =
                        "#ffffff", e.fillRect(0, 0, t, o), e.globalAlpha = 1);
                      let r = Math.min(l.life / 6, 1);
                      e.save(), e.globalAlpha = .4 * r, e.strokeStyle = "#ffffff", e.lineWidth = 6, e
                        .shadowBlur = 30, e.shadowColor = "#ffffff", e.beginPath(), e.moveTo(l.segments[
                          0].x, l.segments[0].y);
                      for (let t = 1; t < l.segments.length; t++) e.lineTo(l.segments[t].x, l.segments[
                        t].y);
                      e.stroke(), e.globalAlpha = .9 * r, e.strokeStyle = "#00ffff", e.lineWidth = 2, e
                        .shadowBlur = 20, e.shadowColor = "#00ffff", e.beginPath(), e.moveTo(l.segments[
                          0].x, l.segments[0].y);
                      for (let t = 1; t < l.segments.length; t++) e.lineTo(l.segments[t].x, l.segments[
                        t].y);
                      e.stroke(), e.globalAlpha = .5 * r, e.strokeStyle = "#00ffff", e.lineWidth = 1, e
                        .shadowBlur = 8;
                      for (let t = 1; t < l.segments.length - 1; t++)
                        if (.6 > Math.random()) {
                          let o = 15 + 30 * Math.random(),
                            a = (Math.random() - .5) * Math.PI * .6;
                          e.beginPath(), e.moveTo(l.segments[t].x, l.segments[t].y), e.lineTo(l
                              .segments[t].x + Math.cos(a) * o, l.segments[t].y + Math.sin(a + .5) * o),
                            e.stroke()
                        } e.restore()
                    }
                  }(e, t, o), e.globalAlpha = .25;
                  for (let l = 0; l < 30; l++) {
                    let r = ((197.3 * l - .05 * a + .15 * s) % t + t) % t,
                      n = (127.7 * l + .2 * s * (.5 + l % 3 * .3)) % o,
                      i = 1.5 + l % 4 * .8;
                    e.fillStyle = l % 3 == 0 ? "#220044" : l % 3 == 1 ? "#110022" : "#0a0020", e
                      .beginPath(), e.arc(r, n, i, 0, 2 * Math.PI), e.fill()
                  }
                  for (let o of (e.globalAlpha = 1, e.globalAlpha = .4, r)) {
                    let l = ((o.x - a * o.speed) % t + t) % t;
                    e.fillStyle = m ? m.particleColor : "#ffffff", e.fillRect(l, o.y, o.size, o.size)
                  }
                  e.globalAlpha = 1;
                  let x = m ? m.platformGlow : "firewall" === l.background ? c : "void" === l.background ?
                    i : "core" === l.background ? h : n;
                  e.globalAlpha = .06, e.strokeStyle = x, e.lineWidth = 1;
                  let p = -(.15 * a) % 80;
                  for (let a = p; a < t; a += 80) e.beginPath(), e.moveTo(a, 0), e.lineTo(a, o), e
                  .stroke();
                  for (let a = 0; a < o; a += 80) e.beginPath(), e.moveTo(0, a), e.lineTo(t, a), e
                  .stroke();
                  e.globalAlpha = .1;
                  let g = -(.4 * a) % 50;
                  for (let a = g; a < t; a += 50) e.beginPath(), e.moveTo(a, 0), e.lineTo(a, o), e
                  .stroke();
                  e.globalAlpha = .08, e.fillStyle = x;
                  let y = -(.2 * a),
                    b = [60, 40, 80, 50, 70, 45, 90, 55, 65, 75, 35, 85],
                    v = [120, 80, 200, 150, 180, 90, 250, 130, 160, 220, 70, 190];
                  for (let a = 0; a < b.length; a++) {
                    let l = (y + 250 * a) % (t + 500) - 100,
                      r = v[a % v.length],
                      n = b[a % b.length];
                    e.fillRect(l, o - 100 - r, n, r)
                  }
                  let w = m ? m.particleColor : x;
                  e.globalAlpha = .3;
                  for (let l = 0; l < 20; l++) {
                    let r = ((173.7 * l - .1 * a) % t + t) % t,
                      n = (91.3 * l + .3 * s) % o,
                      i = 1 + l % 3;
                    e.shadowBlur = 5, e.shadowColor = w, e.fillStyle = w, e.beginPath(), e.arc(r, n, i, 0,
                      2 * Math.PI), e.fill()
                  }
                  if (e.shadowBlur = 0, e.globalAlpha = 1, m) {
                    let l = m.weatherType,
                      r = m.particleColor;
                    if ("rain" === l) {
                      e.globalAlpha = .3, e.strokeStyle = r, e.lineWidth = 1;
                      for (let l = 0; l < 60; l++) {
                        let r = ((97.3 * l - .3 * a + 2 * s) % t + t) % t,
                          n = (53.7 * l + 6 * s) % o;
                        e.beginPath(), e.moveTo(r, n), e.lineTo(r - 1, n + 8), e.stroke()
                      }
                      e.globalAlpha = 1
                    } else if ("snow" === l) {
                      e.globalAlpha = .6, e.fillStyle = "#ffffff";
                      for (let l = 0; l < 50; l++) {
                        let r = ((79.1 * l - .1 * a + 20 * Math.sin(.01 * s + l)) % t + t) % t,
                          n = (43.7 * l + 1.5 * s) % o,
                          i = 1 + l % 3;
                        e.beginPath(), e.arc(r, n, i, 0, 2 * Math.PI), e.fill()
                      }
                      e.globalAlpha = 1
                    } else if ("embers" === l) {
                      e.globalAlpha = .5;
                      for (let l = 0; l < 40; l++) {
                        let n = ((87.3 * l - .15 * a) % t + t) % t,
                          i = o - (67.1 * l + 2 * s) % o,
                          c = 1 + l % 2;
                        e.shadowBlur = 4, e.shadowColor = r, e.fillStyle = l % 3 == 0 ? d : r, e
                          .beginPath(), e.arc(n, i, c, 0, 2 * Math.PI), e.fill()
                      }
                      e.shadowBlur = 0, e.globalAlpha = 1
                    } else if ("glitch" === l) {
                      e.globalAlpha = .06, e.fillStyle = r;
                      for (let a = 0; a < 8; a++) {
                        let l = (2 * s + 97 * a) % o;
                        e.fillRect(0, l, t, 2 + 6 * Math.random())
                      }
                      m.platformGlow === d && s % 180 < 3 && (e.globalAlpha = .15, e.fillStyle =
                        "#ffffff", e.fillRect(0, 0, t, o)), e.globalAlpha = 1
                    } else if ("voidParticles" === l) {
                      e.globalAlpha = .08 + .04 * Math.sin(.02 * s), e.fillStyle = r, e.beginPath(), e
                        .arc(t / 2, o / 2, 200 + 50 * Math.sin(.03 * s), 0, 2 * Math.PI), e.fill(), e
                        .globalAlpha = .4;
                      for (let l = 0; l < 20; l++) {
                        let n = ((113.7 * l - .2 * a) % t + t) % t,
                          i = (73.1 * l + .8 * s) % o;
                        e.fillStyle = l % 2 == 0 ? r : "#440044", e.beginPath(), e.arc(n, i, 2 + +Math
                          .sin(.1 * s + l), 0, 2 * Math.PI), e.fill()
                      }
                      e.globalAlpha = 1
                    } else if ("none" === l) {
                      e.globalAlpha = .3 + .15 * Math.sin(.04 * s);
                      for (let l = 0; l < 15; l++) {
                        let n = ((131.7 * l - .1 * a) % t + t) % t,
                          i = (83.1 * l + 30 * Math.sin(.02 * s + 2 * l)) % o;
                        e.shadowBlur = 8, e.shadowColor = r, e.fillStyle = "#ffffff", e.beginPath();
                        let c = 2 + +Math.sin(.08 * s + l);
                        e.moveTo(n, i - c), e.lineTo(n + c, i), e.lineTo(n, i + c), e.lineTo(n - c, i), e
                          .closePath(), e.fill()
                      }
                      e.shadowBlur = 0, e.globalAlpha = 1
                    }
                    "#cc0033" === m.platformGlow && (e.globalAlpha = .04 + .02 * Math.sin(.01 * s), e
                      .fillStyle = "#ff0033", e.fillRect(0, 0, t, o), e.globalAlpha = .2 + .05 * Math
                      .sin(.02 * s), e.shadowBlur = 30, e.shadowColor = "#cc0033", e.fillStyle =
                      "#cc0033", e.beginPath(), e.arc(.8 * t, 60, 35 + 3 * Math.sin(.03 * s), 0, 2 *
                        Math.PI), e.fill(), e.shadowBlur = 0, e.globalAlpha = 1)
                  } else if ("corrupted" === l.background) {
                    e.globalAlpha = .03, e.fillStyle = f;
                    for (let a = 0; a < 5; a++) {
                      let l = (2 * s + 137 * a) % o;
                      e.fillRect(0, l, t, 2 + 4 * Math.random())
                    }
                    e.globalAlpha = 1
                  } else "void" === l.background ? (e.globalAlpha = .05 + .03 * Math.sin(.02 * s), e
                    .fillStyle = i, e.beginPath(), e.arc(t / 2, o / 2, 200 + 50 * Math.sin(.03 * s), 0,
                      2 * Math.PI), e.fill(), e.globalAlpha = 1) : "core" === l.background && (e
                    .globalAlpha = .08, e.fillStyle = h, e.beginPath(), e.arc(t / 2, o / 2, 300 + 30 *
                      Math.sin(.02 * s), 0, 2 * Math.PI), e.fill(), e.globalAlpha = .04, e.fillStyle =
                    n, e.beginPath(), e.arc(t / 2, o / 2, 150 + 20 * Math.sin(.04 * s), 0, 2 * Math.PI),
                    e.fill(), e.globalAlpha = 1)
                }(e, t, o, G, R, Y.current, F.current, J.current ?? void 0), O.current)) {
                let {
                  px: o,
                  py: l
                } = eV(a), r = o - G;
                r + a.width < -50 || r > t + 50 || function(e, t, o, a, l, r) {
                  let s = "firewall" === r ? c : "void" === r ? i : "core" === r ? h : n;
                  e.shadowBlur = 10, e.shadowColor = s, e.globalAlpha = .2, e.fillStyle = s, e.fillRect(t,
                      o, a, l), e.globalAlpha = 1, e.shadowBlur = 0, e.fillStyle = "firewall" === r ?
                    "#1a0d00" : "void" === r ? "#1a0011" : "core" === r ? "#11001a" : "#001a1a", e.fillRect(
                      t, o, a, l), e.globalAlpha = .8, e.shadowBlur = 6, e.shadowColor = s, e.strokeStyle =
                    s, e.lineWidth = 2, e.beginPath(), e.moveTo(t, o), e.lineTo(t + a, o), e.stroke(), e
                    .shadowBlur = 0, e.globalAlpha = 1
                }(e, r, l, a.width, a.height, R.background)
              }
              for (let o of I.current) {
                if (!o.active) continue;
                let a = o.x - G;
                if (!(a < -100) && !(a > t + 100)) {
                  if ("boss" === o.type || "bossRedKing" === o.type || "bossTitan" === o.type ||
                    "bossDragon" === o.type || "bossPhoenix" === o.type || "bossMechGolem" === o.type ||
                    "bossCorrupted" === o.type || "bossFather" === o.type || "bossTwin" === o.type) {
                    let t = o.bossColor || ("bossFather" === o.type ? n : "bossTwin" === o.type ? p : 3 === R
                      .id ? i : h);
                    w = e, k = a + o.width / 2, C = o.y, S = o.facing, T = t, M = o.animFrame, P = o.health,
                      A = o.maxHealth, w.save(), w.translate(k, C), w.shadowBlur = 30, w.shadowColor = T, w
                      .globalAlpha = .15 + .1 * Math.sin(.05 * M), w.beginPath(), w.arc(0, -75, 100, 0, 2 *
                        Math.PI), w.fillStyle = T, w.fill(), w.globalAlpha = 1, w.shadowBlur = 15, w
                      .shadowColor = T, w.beginPath(), w.arc(0, -95, 30, 0, 2 * Math.PI), w.strokeStyle = T, w
                      .lineWidth = 3, w.stroke(), w.fillStyle = "#ff0000", w.shadowColor = "#ff0000", w
                      .shadowBlur = 15, w.beginPath(), w.arc(-12.5, -100, 5, 0, 2 * Math.PI), w.fill(), w
                      .beginPath(), w.arc(12.5, -100, 5, 0, 2 * Math.PI), w.fill(), w.shadowColor = T, w
                      .shadowBlur = 15, w.globalAlpha = .3, w.lineWidth = 8, w.beginPath(), w.moveTo(0, -65),
                      w.lineTo(0, -12.5), w.stroke(), w.globalAlpha = 1, w.lineWidth = 3, w.beginPath(), w
                      .moveTo(0, -65), w.lineTo(0, -12.5), w.stroke(), w.globalAlpha = .3, w.lineWidth = 8, w
                      .beginPath(), w.moveTo(0, -50), w.lineTo(-(25 * S * 2.5), -25 + 5 * Math.sin(.05 * M) *
                        2.5), w.stroke(), w.beginPath(), w.moveTo(0, -50), w.lineTo(25 * S * 2.5, -62.5 + 5 *
                        Math.sin(.05 * M + 1) * 2.5), w.stroke(), w.globalAlpha = 1, w.lineWidth = 3, w
                      .beginPath(), w.moveTo(0, -50), w.lineTo(-(25 * S * 2.5), -25 + 5 * Math.sin(.05 * M) *
                        2.5), w.stroke(), w.beginPath(), w.moveTo(0, -50), w.lineTo(25 * S * 2.5, -62.5 + 5 *
                        Math.sin(.05 * M + 1) * 2.5), w.stroke(), w.globalAlpha = .3, w.lineWidth = 8, w
                      .beginPath(), w.moveTo(0, -12.5), w.lineTo(-25, 32.5), w.stroke(), w.beginPath(), w
                      .moveTo(0, -12.5), w.lineTo(25, 32.5), w.stroke(), w.globalAlpha = 1, w.lineWidth = 3, w
                      .beginPath(), w.moveTo(0, -12.5), w.lineTo(-25, 32.5), w.stroke(), w.beginPath(), w
                      .moveTo(0, -12.5), w.lineTo(25, 32.5), w.stroke(), w.globalAlpha = .8, w.shadowBlur = 0,
                      w.fillStyle = "#330000", w.fillRect(-40, -137.5, 80, 6), w.fillStyle = f, w
                      .shadowColor = f, w.shadowBlur = 8, w.fillRect(-40, -137.5, P / A * 80, 6), w.restore(),
                      o.bossName && (e.save(), e.globalAlpha = .8, e.shadowBlur = 10, e.shadowColor = t, e
                        .fillStyle = t, e.font = "bold 12px monospace", e.textAlign = "center", e.fillText(o
                          .bossName, a + o.width / 2, o.y - 90), e.shadowBlur = 0, e.globalAlpha = 1, e
                        .restore())
                  } else ! function(e, t, o, a, l, r, u) {
                    if ("boss" === a) return;
                    let m = "drone" === a ? f : "glitchWalker" === a ? h : "eliteDrone" === a ? "#ff4466" :
                      "heavyWalker" === a ? "#884400" : c;
                    if ("eliteDrone" === a) {
                      eE(e, t, o + 2 * Math.sin(.15 * r), l, "#ff4466", r, !1, u, 1.1, "angry", !0), e
                        .save(), e.globalAlpha = .15 + .1 * Math.sin(.1 * r), e.shadowBlur = 20, e
                        .shadowColor = "#ff4466", e.fillStyle = "#ff4466", e.beginPath(), e.arc(t, o - 25,
                          30, 0, 2 * Math.PI), e.fill(), e.shadowBlur = 0, e.globalAlpha = 1, e.restore();
                      return
                    }
                    if ("heavyWalker" === a) {
                      e.save(), e.translate(t, o), e.shadowBlur = 10, e.shadowColor = "#884400", e
                        .strokeStyle = "#884400", e.lineWidth = 3.9000000000000004, e.beginPath(), e.arc(0,
                          -49.4, 11.700000000000001, 0, 2 * Math.PI), e.stroke(), e.fillStyle = "#ff0000", e
                        .beginPath(), e.arc(3 * l * 1.3, -50.7, 2.6, 0, 2 * Math.PI), e.fill(), e
                        .beginPath(), e.moveTo(0, -37.7), e.lineTo(0, -13), e.stroke(), e.lineWidth = 5.2, e
                        .beginPath(), e.moveTo(0, -32.5), e.lineTo(-(15 * l * 1.3), -19.5), e.stroke(), e
                        .beginPath(), e.moveTo(0, -32.5), e.lineTo(15 * l * 1.3, -19.5), e.stroke(), e
                        .lineWidth = 5.2, e.beginPath(), e.moveTo(0, -13), e.lineTo(-13, 10.4), e.stroke(),
                        e.beginPath(), e.moveTo(0, -13), e.lineTo(13, 10.4), e.stroke(), e.shadowBlur = 0, e
                        .restore();
                      return
                    }
                    if ("voidGuardian" === a) e.save(), e.translate(t, o), e.shadowBlur = 10, e
                      .shadowColor = c, e.globalAlpha = .4, e.fillStyle = c, e.fillRect(-15, -25, 30, 25), e
                      .globalAlpha = 1, e.strokeStyle = c, e.lineWidth = 2, e.strokeRect(-15, -25, 30, 25),
                      e.beginPath(), e.moveTo(0, -15), e.lineTo(20 * l, -18), e.stroke(), e.shadowBlur = 0,
                      e.restore();
                    else if ("dragon" === a) {
                      e.save(), e.translate(t, o), e.shadowBlur = 12, e.shadowColor = c, e.strokeStyle = c,
                        e.fillStyle = c, e.lineWidth = 2;
                      let a = 3 * Math.sin(.08 * r);
                      e.beginPath(), e.ellipse(0, -15 + a, 14, 8, 0, 0, 2 * Math.PI), e.stroke(), e
                        .beginPath(), e.arc(16 * l, -20 + a, 6, 0, 2 * Math.PI), e.stroke(), e.fillStyle =
                        f, e.beginPath(), e.arc(18 * l, -21 + a, 2, 0, 2 * Math.PI), e.fill();
                      let n = 10 * Math.sin(.15 * r);
                      e.strokeStyle = c, e.beginPath(), e.moveTo(-6, -18 + a), e.lineTo(-20, -30 + a + n), e
                        .lineTo(-12, -8 + a), e.moveTo(6, -18 + a), e.lineTo(20, -30 + a + n), e.lineTo(12,
                          -8 + a), e.stroke(), e.beginPath(), e.moveTo(-(14 * l), -12 + a), e
                        .quadraticCurveTo(-(22 * l), -6 + a + 4 * Math.sin(.1 * r), -(26 * l), -12 + a), e
                        .stroke(), r % 60 < 15 && (e.globalAlpha = .6, e.fillStyle = d, e.beginPath(), e
                          .moveTo(22 * l, -20 + a), e.lineTo(35 * l, -18 + a), e.lineTo(35 * l, -22 + a), e
                          .closePath(), e.fill(), e.globalAlpha = 1), e.shadowBlur = 0, e.restore()
                    } else if ("phoenix" === a) {
                      e.save(), e.translate(t, o), e.shadowBlur = 12, e.shadowColor = d, e.strokeStyle = d,
                        e.fillStyle = d, e.lineWidth = 2;
                      let a = 4 * Math.sin(.1 * r);
                      e.beginPath(), e.ellipse(0, -14 + a, 10, 6, 0, 0, 2 * Math.PI), e.stroke(), e
                        .beginPath(), e.arc(12 * l, -18 + a, 5, 0, 2 * Math.PI), e.stroke();
                      let n = 8 * Math.sin(.2 * r);
                      e.strokeStyle = c, e.beginPath(), e.moveTo(-5, -16 + a), e.lineTo(-18, -26 + a + n), e
                        .lineTo(-8, -6 + a), e.moveTo(5, -16 + a), e.lineTo(18, -26 + a + n), e.lineTo(8, -
                          6 + a), e.stroke(), e.globalAlpha = .5, e.fillStyle = c;
                      for (let t = 1; t <= 3; t++) e.beginPath(), e.arc(-l * (8 + 6 * t), -10 + a + 3 * Math
                        .sin(.15 * r + t), 3 - .5 * t, 0, 2 * Math.PI), e.fill();
                      e.globalAlpha = 1, e.shadowBlur = 0, e.restore()
                    } else if ("mechGolem" === a) {
                      e.save(), e.translate(t, o), e.shadowBlur = 10, e.shadowColor = s, e.strokeStyle = s,
                        e.lineWidth = 2.5;
                      let a = 1.5 * Math.sin(.06 * r);
                      e.beginPath(), e.moveTo(-6, -38 + a), e.lineTo(6, -38 + a), e.lineTo(8, -30 + a), e
                        .lineTo(-8, -30 + a), e.closePath(), e.stroke(), e.fillStyle = f, e.beginPath(), e
                        .arc(-3, -34 + a, 2, 0, 2 * Math.PI), e.arc(3, -34 + a, 2, 0, 2 * Math.PI), e
                      .fill(), e.strokeStyle = s, e.lineWidth = 3, e.strokeRect(-10, -28 + a, 20, 20), e
                        .lineWidth = 3, e.beginPath(), e.moveTo(-10, -24 + a), e.lineTo(-18, -16 + a + 2 *
                          Math.sin(.1 * r)), e.moveTo(10, -24 + a), e.lineTo(18, -16 + a - 2 * Math.sin(.1 *
                          r)), e.stroke(), e.lineWidth = 3, e.beginPath(), e.moveTo(-6, -8 + a), e.lineTo(-
                          8, 2 + a), e.moveTo(6, -8 + a), e.lineTo(8, 2 + a), e.stroke(), e.shadowBlur = 0,
                        e.restore()
                    } else if ("shadowAssassin" === a) {
                      e.save(), e.translate(t, o), e.globalAlpha = .1, e.strokeStyle = h, e.lineWidth = 1.5;
                      for (let t = 1; t <= 3; t++) {
                        let o = -l * t * 8;
                        e.beginPath(), e.arc(o, -38, 7, 0, 2 * Math.PI), e.stroke(), e.beginPath(), e
                          .moveTo(o, -31), e.lineTo(o, -10), e.stroke()
                      }
                      e.globalAlpha = .7 + .2 * Math.sin(.2 * r), e.shadowBlur = 8, e.shadowColor = h, e
                        .strokeStyle = h, e.lineWidth = 1.5, e.beginPath(), e.arc(0, -38, 7, 0, 2 * Math
                        .PI), e.stroke(), e.fillStyle = i, e.shadowColor = i, e.beginPath(), e.arc(3 * l, -
                          39, 2, 0, 2 * Math.PI), e.fill(), e.strokeStyle = h, e.beginPath(), e.moveTo(0, -
                          31), e.lineTo(0, -10), e.stroke(), e.beginPath(), e.moveTo(0, -25), e.lineTo(18 *
                          l, -28), e.stroke(), e.beginPath(), e.moveTo(0, -25), e.lineTo(-(10 * l), -20), e
                        .stroke();
                      let a = 10 * Math.sin(.3 * r);
                      e.beginPath(), e.moveTo(0, -10), e.lineTo(-6 + .3 * a, a), e.stroke(), e.beginPath(),
                        e.moveTo(0, -10), e.lineTo(6 - .3 * a, -a), e.stroke(), e.shadowBlur = 0, e
                        .globalAlpha = 1, e.restore()
                    } else if ("voidBat" === a) {
                      e.save(), e.translate(t, o), e.shadowBlur = 8, e.shadowColor = "#8800aa", e
                        .strokeStyle = "#8800aa", e.fillStyle = i, e.lineWidth = 1.5;
                      let a = 4 * Math.sin(.2 * r);
                      e.beginPath(), e.ellipse(0, -12 + a, 6, 4, 0, 0, 2 * Math.PI), e.stroke(), e
                        .beginPath(), e.arc(7 * l, -14 + a, 3.5, 0, 2 * Math.PI), e.stroke(), e.fillStyle =
                        i, e.beginPath(), e.arc(8 * l, -15 + a, 1.2, 0, 2 * Math.PI), e.fill();
                      let n = 8 * Math.sin(.3 * r);
                      e.beginPath(), e.moveTo(-3, -14 + a), e.quadraticCurveTo(-12, -22 + a + n, -8, -6 +
                        a), e.moveTo(3, -14 + a), e.quadraticCurveTo(12, -22 + a + n, 8, -6 + a), e
                      .stroke(), e.shadowBlur = 0, e.globalAlpha = 1, e.restore()
                    } else if ("stormEagle" === a) {
                      e.save(), e.translate(t, o), e.shadowBlur = 12, e.shadowColor = d, e.strokeStyle = d,
                        e.fillStyle = "#ffff44", e.lineWidth = 2;
                      let a = 5 * Math.sin(.12 * r);
                      e.beginPath(), e.ellipse(0, -16 + a, 12, 6, 0, 0, 2 * Math.PI), e.stroke(), e
                        .beginPath(), e.arc(14 * l, -20 + a, 5, 0, 2 * Math.PI), e.stroke(), e.fillStyle =
                        "#ffffff", e.beginPath(), e.arc(16 * l, -21 + a, 1.5, 0, 2 * Math.PI), e.fill();
                      let n = 10 * Math.sin(.2 * r);
                      e.strokeStyle = d, e.beginPath(), e.moveTo(-6, -18 + a), e.lineTo(-22, -30 + a + n), e
                        .lineTo(-10, -8 + a), e.moveTo(6, -18 + a), e.lineTo(22, -30 + a + n), e.lineTo(10,
                          -8 + a), e.stroke(), r % 30 < 5 && (e.globalAlpha = .7, e.strokeStyle = "#ffffff",
                          e.lineWidth = 1, e.beginPath(), e.moveTo(5 * l, -8 + a), e.lineTo(8 * l, -3 + a),
                          e.lineTo(3 * l, -2 + a), e.lineTo(7 * l, 3 + a), e.stroke(), e.globalAlpha = 1), e
                        .shadowBlur = 0, e.globalAlpha = 1, e.restore()
                    } else if ("emberWisp" === a) {
                      e.save(), e.translate(t, o), e.shadowBlur = 10, e.shadowColor = c;
                      let a = 5 * Math.sin(.15 * r);
                      e.globalAlpha = .6 + .2 * Math.sin(.1 * r), e.fillStyle = c, e.beginPath(), e.arc(0, -
                          12 + a, 5, 0, 2 * Math.PI), e.fill(), e.fillStyle = d, e.beginPath(), e.arc(0, -
                          12 + a, 2.5, 0, 2 * Math.PI), e.fill(), e.globalAlpha = .4, e.strokeStyle = c, e
                        .lineWidth = 1.5;
                      for (let t = 0; t < 4; t++) {
                        let o = t / 4 * Math.PI * 2 + .08 * r,
                          l = 8 + 4 * Math.sin(.15 * r + 2 * t);
                        e.beginPath(), e.moveTo(0, -12 + a), e.lineTo(Math.cos(o) * l, -12 + a + Math.sin(
                          o) * l), e.stroke()
                      }
                      e.globalAlpha = .8, e.fillStyle = "#ffffff", e.beginPath(), e.arc(-2, -13 + a, 1, 0,
                          2 * Math.PI), e.fill(), e.beginPath(), e.arc(2, -13 + a, 1, 0, 2 * Math.PI), e
                        .fill(), e.shadowBlur = 0, e.globalAlpha = 1, e.restore()
                    } else if ("frostWraith" === a) {
                      e.save(), e.translate(t, o), e.shadowBlur = 12, e.shadowColor = "#88eeff", e
                        .strokeStyle = "#88eeff", e.lineWidth = 1.5;
                      let a = 6 * Math.sin(.1 * r);
                      e.globalAlpha = .5 + .15 * Math.sin(.08 * r), e.beginPath(), e.moveTo(-8, -5 + a), e
                        .quadraticCurveTo(-10, -30 + a, 0, -35 + a), e.quadraticCurveTo(10, -30 + a, 8, -5 +
                          a);
                      for (let t = 0; t < 4; t++) {
                        let o = -8 + 4 * t + 1,
                          l = -5 + a + 3 * Math.sin(.15 * r + t);
                        e.lineTo(o, l)
                      }
                      e.closePath(), e.stroke(), e.globalAlpha = .8, e.fillStyle = "#ffffff", e.beginPath(),
                        e.arc(-3, -22 + a, 2, 0, 2 * Math.PI), e.fill(), e.beginPath(), e.arc(3, -22 + a, 2,
                          0, 2 * Math.PI), e.fill(), e.globalAlpha = .3, e.fillStyle = "#ffffff";
                      for (let t = 0; t < 4; t++) {
                        let o = 12 * Math.cos(.05 * r + 1.5 * t),
                          l = -20 + a + 8 * Math.sin(.07 * r + 1.3 * t);
                        e.beginPath(), e.arc(o, l, 1.5, 0, 2 * Math.PI), e.fill()
                      }
                      e.shadowBlur = 0, e.globalAlpha = 1, e.restore()
                    } else if ("shadowDrake" === a) {
                      e.save(), e.translate(t, o), e.shadowBlur = 12, e.shadowColor = h, e.strokeStyle = h,
                        e.fillStyle = i, e.lineWidth = 2;
                      let a = 4 * Math.sin(.08 * r);
                      e.beginPath(), e.ellipse(0, -16 + a, 14, 8, 0, 0, 2 * Math.PI), e.stroke(), e
                        .beginPath(), e.arc(17 * l, -22 + a, 7, 0, 2 * Math.PI), e.stroke(), e.fillStyle =
                        i, e.beginPath(), e.arc(19 * l, -23 + a, 2, 0, 2 * Math.PI), e.fill();
                      let n = 12 * Math.sin(.15 * r);
                      e.strokeStyle = h, e.beginPath(), e.moveTo(-8, -20 + a), e.lineTo(-24, -34 + a + n), e
                        .lineTo(-16, -24 + a), e.lineTo(-22, -14 + a + .5 * n), e.lineTo(-10, -12 + a), e
                        .moveTo(8, -20 + a), e.lineTo(24, -34 + a + n), e.lineTo(16, -24 + a), e.lineTo(22,
                          -14 + a + .5 * n), e.lineTo(10, -12 + a), e.stroke(), e.beginPath(), e.moveTo(-(
                          14 * l), -14 + a), e.quadraticCurveTo(-(24 * l), -8 + a + 5 * Math.sin(.1 * r), -(
                          28 * l), -16 + a), e.stroke(), e.globalAlpha = .15 + .1 * Math.sin(.1 * r), e
                        .fillStyle = h, e.beginPath(), e.arc(0, -16 + a, 22, 0, 2 * Math.PI), e.fill(), e
                        .shadowBlur = 0, e.globalAlpha = 1, e.restore()
                    } else if ("plasmaSerpent" === a) {
                      e.save(), e.translate(t, o), e.shadowBlur = 12, e.shadowColor = i, e.strokeStyle = i,
                        e.lineWidth = 2.5;
                      let a = 4 * Math.sin(.1 * r);
                      e.globalAlpha = .8;
                      for (let t = 0; t < 6; t++) {
                        let o = -l * t * 7,
                          n = -14 + a + 5 * Math.sin(.15 * r + .8 * t),
                          i = 4 - .3 * t;
                        e.beginPath(), e.arc(o, n, i, 0, 2 * Math.PI), e.stroke()
                      }
                      e.beginPath(), e.arc(5 * l, -16 + a, 6, 0, 2 * Math.PI), e.stroke(), e.fillStyle =
                        "#ffffff", e.beginPath(), e.arc(7 * l, -17 + a, 2, 0, 2 * Math.PI), e.fill(), e
                        .globalAlpha = .4, e.strokeStyle = "#ff44ff", e.lineWidth = 1;
                      for (let t = 0; t < 3; t++) {
                        let o = l * (2 + 5 * t),
                          n = -14 + a + 6 * Math.sin(.2 * r + t);
                        e.beginPath(), e.moveTo(o, n), e.lineTo(o + 8 * Math.sin(.3 * r + 2 * t), n + 5 *
                          Math.cos(.25 * r + t)), e.stroke()
                      }
                      e.shadowBlur = 0, e.globalAlpha = 1, e.restore()
                    } else if ("neonWyrm" === a) {
                      e.save(), e.translate(t, o), e.shadowBlur = 15, e.shadowColor = n, e.strokeStyle = n,
                        e.fillStyle = "#00ffff", e.lineWidth = 2.5;
                      let a = 5 * Math.sin(.07 * r);
                      e.globalAlpha = .9;
                      for (let t = 0; t < 8; t++) {
                        let o = -l * t * 9,
                          n = -18 + a + 6 * Math.sin(.12 * r + .7 * t),
                          i = 6 - .5 * t;
                        e.beginPath(), e.arc(o, n, i, 0, 2 * Math.PI), e.stroke()
                      }
                      e.beginPath(), e.arc(8 * l, -22 + a, 8, 0, 2 * Math.PI), e.stroke(), e.fillStyle =
                        "#ffffff", e.beginPath(), e.arc(11 * l, -24 + a, 2.5, 0, 2 * Math.PI), e.fill(), e
                        .fillStyle = n, e.beginPath(), e.arc(11 * l, -24 + a, 1.5, 0, 2 * Math.PI), e
                      .fill();
                      let i = 10 * Math.sin(.12 * r);
                      e.strokeStyle = n, e.lineWidth = 2, e.beginPath(), e.moveTo(-5, -22 + a), e.lineTo(-
                          25, -38 + a + i), e.lineTo(-15, -16 + a), e.moveTo(5, -22 + a), e.lineTo(25, -38 +
                          a + i), e.lineTo(15, -16 + a), e.stroke(), e.globalAlpha = .12 + .06 * Math.sin(
                          .08 * r), e.fillStyle = n, e.beginPath(), e.arc(0, -18 + a, 30, 0, 2 * Math.PI), e
                        .fill(), e.shadowBlur = 0, e.globalAlpha = 1, e.restore()
                    } else if ("crystalMoth" === a) {
                      e.save(), e.translate(t, o), e.shadowBlur = 10, e.shadowColor = s, e.strokeStyle = s,
                        e.fillStyle = "#88ffaa", e.lineWidth = 1.5;
                      let a = 5 * Math.sin(.13 * r);
                      e.beginPath(), e.ellipse(0, -12 + a, 4, 6, 0, 0, 2 * Math.PI), e.stroke(), e
                        .beginPath(), e.arc(0, -20 + a, 3, 0, 2 * Math.PI), e.stroke(), e.fillStyle =
                        "#ffffff", e.beginPath(), e.arc(-1.5, -21 + a, 1, 0, 2 * Math.PI), e.fill(), e
                        .beginPath(), e.arc(1.5, -21 + a, 1, 0, 2 * Math.PI), e.fill();
                      let l = 6 * Math.sin(.25 * r);
                      e.fillStyle = s, e.globalAlpha = .3, e.beginPath(), e.moveTo(-4, -16 + a), e.lineTo(-
                          16, -24 + a + l), e.lineTo(-14, -12 + a + .5 * l), e.closePath(), e.fill(), e
                        .stroke(), e.beginPath(), e.moveTo(4, -16 + a), e.lineTo(16, -24 + a + l), e.lineTo(
                          14, -12 + a + .5 * l), e.closePath(), e.fill(), e.stroke(), e.globalAlpha = .5 +
                        .3 * Math.sin(.1 * r), e.fillStyle = "#ffffff";
                      for (let t = 0; t < 3; t++) {
                        let o = 12 * Math.cos(.06 * r + 2 * t),
                          l = -16 + a + 8 * Math.sin(.08 * r + 1.5 * t);
                        e.beginPath(), e.arc(o, l, 1, 0, 2 * Math.PI), e.fill()
                      }
                      e.shadowBlur = 0, e.globalAlpha = 1, e.restore()
                    } else if ("zombie" === a) {
                      e.save(), e.translate(t, o), e.shadowBlur = 8, e.shadowColor = "#44aa00", e
                        .strokeStyle = "#44aa00", e.lineWidth = 2.5;
                      let a = 3 * Math.sin(.08 * r);
                      e.beginPath(), e.arc(.3 * a, -40, 8, 0, 2 * Math.PI), e.stroke(), e.fillStyle =
                        "#88ff00", e.beginPath(), e.arc(2 * l + .3 * a, -41, 2, 0, 2 * Math.PI), e.fill(), e
                        .beginPath(), e.arc(-l + .3 * a, -41, 2, 0, 2 * Math.PI), e.fill(), e.beginPath(), e
                        .moveTo(.3 * a, -32), e.lineTo(.2 * a, -12), e.stroke(), e.lineWidth = 2, e
                        .beginPath(), e.moveTo(.2 * a, -26), e.lineTo(16 * l, -22 + a), e.stroke(), e
                        .beginPath(), e.moveTo(.2 * a, -26), e.lineTo(-(8 * l), -20), e.stroke(), e
                        .lineWidth = 2.5, e.beginPath(), e.moveTo(.2 * a, -12), e.lineTo(-8 + .5 * a, 2), e
                        .stroke(), e.beginPath(), e.moveTo(.2 * a, -12), e.lineTo(8 - .5 * a, 2), e
                      .stroke(), e.globalAlpha = .3, e.fillStyle = "#44aa00";
                      for (let t = 0; t < 3; t++) {
                        let o = 10 * Math.sin(.05 * r + 2 * t),
                          a = -20 + 8 * Math.cos(.07 * r + t);
                        e.beginPath(), e.arc(o, a, 2, 0, 2 * Math.PI), e.fill()
                      }
                      e.shadowBlur = 0, e.globalAlpha = 1, e.restore()
                    } else if ("giant" === a) {
                      e.save(), e.translate(t, o), e.shadowBlur = 15, e.shadowColor = "#cc4400", e
                        .strokeStyle = "#cc4400", e.lineWidth = 6.4;
                      let a = 2 * Math.sin(.04 * r);
                      e.beginPath(), e.arc(a, -60.800000000000004, 19.200000000000003, 0, 2 * Math.PI), e
                        .stroke(), e.fillStyle = "#ff0000", e.beginPath(), e.arc(4 * l + a, -
                          62.400000000000006, 4.800000000000001, 0, 2 * Math.PI), e.fill(), e.beginPath(), e
                        .arc(-(2 * l) + a, -62.400000000000006, 4.800000000000001, 0, 2 * Math.PI), e
                      .fill(), e.beginPath(), e.moveTo(a, -41.6), e.lineTo(a, -12.8), e.stroke(), e
                        .lineWidth = 6.4, e.beginPath(), e.moveTo(a, -35.2), e.lineTo(22 * l * 1.6, -
                          22.400000000000002 + a), e.stroke(), e.beginPath(), e.moveTo(a, -35.2), e.lineTo(-
                          (18 * l * 1.6), -16), e.stroke(), e.lineWidth = 8, e.beginPath(), e.moveTo(a, -
                          12.8), e.lineTo(-16 + a, 6.4), e.stroke(), e.beginPath(), e.moveTo(a, -12.8), e
                        .lineTo(16 + a, 6.4), e.stroke(), e.globalAlpha = .15, e.fillStyle = "#ff4400", e
                        .beginPath(), e.ellipse(0, 4, 25, 5, 0, 0, 2 * Math.PI), e.fill(), e.shadowBlur = 0,
                        e.globalAlpha = 1, e.restore()
                    } else if ("necromancer" === a) {
                      e.save(), e.translate(t, o), e.shadowBlur = 15, e.shadowColor = "#6600aa", e
                        .strokeStyle = "#6600aa", e.fillStyle = i, e.lineWidth = 2;
                      let a = 6 * Math.sin(.08 * r);
                      e.globalAlpha = .7, e.beginPath(), e.moveTo(-10, -5 + a), e.quadraticCurveTo(-12, -
                          30 + a, 0, -38 + a), e.quadraticCurveTo(12, -30 + a, 10, -5 + a), e.closePath(), e
                        .stroke(), e.globalAlpha = .15, e.fillStyle = "#6600aa", e.fill(), e.globalAlpha =
                        1, e.fillStyle = "#ffffff", e.beginPath(), e.arc(-3, -28 + a, 2.5, 0, 2 * Math.PI),
                        e.fill(), e.beginPath(), e.arc(3, -28 + a, 2.5, 0, 2 * Math.PI), e.fill(), e
                        .fillStyle = "#ff44ff", e.beginPath(), e.arc(-3, -28 + a, 1.2, 0, 2 * Math.PI), e
                        .fill(), e.beginPath(), e.arc(3, -28 + a, 1.2, 0, 2 * Math.PI), e.fill(), e
                        .strokeStyle = "#8844cc", e.lineWidth = 2, e.beginPath(), e.moveTo(12 * l, -32 + a),
                        e.lineTo(10 * l, 0 + a), e.stroke(), e.fillStyle = "#ff44ff", e.shadowColor =
                        "#ff44ff", e.shadowBlur = 12, e.beginPath(), e.arc(12 * l, -35 + a, 4, 0, 2 * Math
                          .PI), e.fill(), e.globalAlpha = .4, e.strokeStyle = "#ff44ff", e.lineWidth = 1;
                      for (let t = 0; t < 3; t++) {
                        let o = .06 * r + 2 * Math.PI / 3 * t,
                          l = 16 * Math.cos(o),
                          n = -20 + a + 10 * Math.sin(o);
                        e.beginPath(), e.arc(l, n, 3, 0, 2 * Math.PI), e.stroke()
                      }
                      e.shadowBlur = 0, e.globalAlpha = 1, e.restore()
                    } else if ("bomber" === a) {
                      e.save(), e.translate(t, o);
                      let a = .3 * Math.sin(.2 * r) + .7;
                      e.shadowBlur = 8 + 6 * Math.sin(.15 * r), e.shadowColor = f, e.strokeStyle = f, e
                        .lineWidth = 2;
                      let n = 3 * Math.sin(.4 * r);
                      e.beginPath(), e.arc(0, -38 + n, 7, 0, 2 * Math.PI), e.stroke(), e.fillStyle = d, e
                        .globalAlpha = a, e.beginPath(), e.arc(0, -46 + n, 3 + 2 * Math.sin(.3 * r), 0, 2 *
                          Math.PI), e.fill(), e.globalAlpha = 1, e.fillStyle = "#ffffff", e.beginPath(), e
                        .arc(-3, -39 + n, 1.5, 0, 2 * Math.PI), e.fill(), e.beginPath(), e.arc(3, -39 + n,
                          1.5, 0, 2 * Math.PI), e.fill(), e.strokeStyle = f, e.beginPath(), e.moveTo(0, -
                          31 + n), e.lineTo(0, -12 + n), e.stroke(), e.lineWidth = 1.5, e.beginPath(), e
                        .moveTo(0, -26 + n), e.lineTo(14 * l, -22 + n), e.stroke(), e.beginPath(), e.moveTo(
                          0, -26 + n), e.lineTo(-(8 * l), -20 + n), e.stroke(), e.lineWidth = 2;
                      let i = 12 * Math.sin(.4 * r);
                      e.beginPath(), e.moveTo(0, -12 + n), e.lineTo(-6 + .4 * i, 0 + n), e.stroke(), e
                        .beginPath(), e.moveTo(0, -12 + n), e.lineTo(6 - .4 * i, 0 + n), e.stroke(), e
                        .globalAlpha = .1 + .08 * Math.sin(.25 * r), e.fillStyle = "#ff0000", e.beginPath(),
                        e.arc(0, -22 + n, 20 + 5 * Math.sin(.2 * r), 0, 2 * Math.PI), e.fill(), e
                        .shadowBlur = 0, e.globalAlpha = 1, e.restore()
                    } else eE(e, t + ("glitchWalker" === a ? 3 * Math.sin(.5 * r) : 0), o, l, m, r, !1, u,
                      .9, "angry", !0)
                  }(e, a + o.width / 2, o.y, o.type, o.facing, o.animFrame, o.grounded);
                  if (o.isHit) {
                    e.save(), e.globalAlpha = .5, e.fillStyle = "#ffffff";
                    let t = ez(o.type);
                    e.fillRect(a, o.y - t, o.width, t), e.globalAlpha = 1, e.restore()
                  }
                }
              }
              let H = E.x - G + E.width / 2,
                U = E.y,
                V = E.skinColor || n;
              if ((E.invincible <= 0 || F.current % 4 < 2) && E.health > 0 && eE(e, H, U, E.facing, V, E
                  .animFrame, E.isShooting, E.grounded, 1, E.expression, E.isMoving, !1, E.vx, E.skinEffect ||
                  ""), L && L.health > 0) {
                let t = L.x - G + L.width / 2,
                  o = L.y;
                (L.invincible <= 0 || F.current % 4 < 2) && eE(e, t, o, L.facing, L.skinColor, L.animFrame, L
                    .isShooting, L.grounded, 1, L.expression, L.isMoving, !1, L.vx, L.skinEffect || ""), e
                  .save(), e.globalAlpha = .7, e.shadowBlur = 5, e.shadowColor = c, e.fillStyle = c, e.font =
                  "8px monospace", e.textAlign = "center", e.fillText("P2", t, L.y - 55), e.shadowBlur = 0, e
                  .globalAlpha = 1, e.restore();
                let a = Math.max(0, L.health / L.maxHealth);
                e.save(), e.globalAlpha = .8, e.fillStyle = "#1a0a00", e.fillRect(t - 15, L.y - 60, 30, 4), e
                  .fillStyle = c, e.shadowBlur = 3, e.shadowColor = c, e.fillRect(t - 15, L.y - 60, 30 * a,
                  4), e.shadowBlur = 0, e.globalAlpha = 1, e.restore()
              }
              for (let o of es.current) {
                if (!o.active) continue;
                let a = o.x - G;
                a < -50 || a > t + 50 || (eE(e, a, o.y, o.facing, o.color, o.animFrame, o.shootCooldown > 10,
                    o.grounded, .85, o.expression, !0, !1, 0, ""), e.save(), e.globalAlpha = .6, e
                  .shadowBlur = 5, e.shadowColor = o.color, e.fillStyle = o.color, e.font = "8px monospace",
                  e.textAlign = "center", e.fillText(o.name, a, o.y - 55), e.shadowBlur = 0, e.globalAlpha =
                  1, e.restore())
              }
              let z = ec.current;
              if (z && z.active) {
                let o = z.x - G;
                if (o > -50 && o < t + 50) {
                  ! function(e, t, o, a, l, r, n) {
                    e.save(), e.shadowBlur = 8, e.shadowColor = l, e.strokeStyle = l, e.fillStyle = l, e
                      .lineWidth = 1.5;
                    let s = 3 * Math.sin(.08 * r);
                    if ("neonWolf" === a) e.beginPath(), e.ellipse(t, o - 10 + s, 8, 5, 0, 0, 2 * Math.PI), e
                      .stroke(), e.beginPath(), e.arc(t + 10 * n, o - 15 + s, 5, 0, 2 * Math.PI), e.stroke(),
                      e.beginPath(), e.moveTo(t + 8 * n, o - 19 + s), e.lineTo(t + 6 * n, o - 24 + s), e
                      .moveTo(t + 13 * n, o - 19 + s), e.lineTo(t + 14 * n, o - 24 + s), e.stroke(), e
                      .fillStyle = "#ffffff", e.beginPath(), e.arc(t + 12 * n, o - 15 + s, 1.5, 0, 2 * Math
                        .PI), e.fill(), e.beginPath(), e.moveTo(t - 8 * n, o - 10 + s), e.quadraticCurveTo(t -
                        14 * n, o - 20 + s + 3 * Math.sin(.15 * r), t - 16 * n, o - 16 + s), e.stroke();
                    else if ("plasmaFalcon" === a) {
                      e.beginPath(), e.ellipse(t, o - 12 + s, 6, 4, 0, 0, 2 * Math.PI), e.stroke();
                      let a = 6 * Math.sin(.2 * r);
                      e.beginPath(), e.moveTo(t - 5, o - 12 + s), e.lineTo(t - 16, o - 18 + s + a), e.lineTo(
                          t - 8, o - 8 + s), e.moveTo(t + 5, o - 12 + s), e.lineTo(t + 16, o - 18 + s + a), e
                        .lineTo(t + 8, o - 8 + s), e.stroke(), e.beginPath(), e.arc(t + 8 * n, o - 16 + s, 3,
                          0, 2 * Math.PI), e.stroke(), e.fillStyle = "#ffffff", e.beginPath(), e.arc(t + 9 *
                          n, o - 16 + s, 1.2, 0, 2 * Math.PI), e.fill(), e.beginPath(), e.moveTo(t + 11 * n,
                          o - 16 + s), e.lineTo(t + 14 * n, o - 15 + s), e.stroke()
                    } else if ("shadowSpider" === a) {
                      e.beginPath(), e.arc(t, o - 10 + s, 6, 0, 2 * Math.PI), e.stroke(), e.beginPath(), e
                        .arc(t + 6 * n, o - 14 + s, 4, 0, 2 * Math.PI), e.stroke();
                      for (let a = 0; a < 4; a++) {
                        let l = 2 * Math.sin(.15 * r + a);
                        e.beginPath(), e.moveTo(t - 4, o - 8 + s), e.lineTo(t - 12 + l, o - 2 + 2 * a + s), e
                          .moveTo(t + 4, o - 8 + s), e.lineTo(t + 12 - l, o - 2 + 2 * a + s), e.stroke()
                      }
                      e.fillStyle = "#ff0000", e.beginPath(), e.arc(t + 7 * n, o - 15 + s, 1.5, 0, 2 * Math
                        .PI), e.arc(t + 5 * n, o - 15 + s, 1.5, 0, 2 * Math.PI), e.fill()
                    } else if ("crystalGolem" === a) e.beginPath(), e.moveTo(t - 7, o + s), e.lineTo(t - 9,
                        o - 10 + s), e.lineTo(t, o - 18 + s), e.lineTo(t + 9, o - 10 + s), e.lineTo(t + 7, o +
                        s), e.closePath(), e.stroke(), e.beginPath(), e.moveTo(t - 9, o - 8 + s), e.lineTo(t -
                        14, o - 14 + s + 2 * Math.sin(.1 * r)), e.moveTo(t + 9, o - 8 + s), e.lineTo(t + 14,
                        o - 14 + s - 2 * Math.sin(.1 * r)), e.stroke(), e.fillStyle = l, e.shadowBlur = 12, e
                      .beginPath(), e.arc(t + 2 * n, o - 13 + s, 2, 0, 2 * Math.PI), e.fill();
                    else if ("voidDrake" === a) {
                      e.beginPath(), e.ellipse(t, o - 10 + s, 9, 5, 0, 0, 2 * Math.PI), e.stroke();
                      let a = 8 * Math.sin(.15 * r);
                      e.beginPath(), e.moveTo(t - 6, o - 12 + s), e.lineTo(t - 18, o - 22 + s + a), e.lineTo(
                          t - 10, o - 6 + s), e.moveTo(t + 6, o - 12 + s), e.lineTo(t + 18, o - 22 + s + a), e
                        .lineTo(t + 10, o - 6 + s), e.stroke(), e.beginPath(), e.arc(t + 12 * n, o - 14 + s,
                          4, 0, 2 * Math.PI), e.stroke(), e.beginPath(), e.moveTo(t + 10 * n, o - 18 + s), e
                        .lineTo(t + 8 * n, o - 24 + s), e.moveTo(t + 14 * n, o - 17 + s), e.lineTo(t + 16 * n,
                          o - 23 + s), e.stroke(), e.fillStyle = i, e.beginPath(), e.arc(t + 13 * n, o - 14 +
                          s, 1.5, 0, 2 * Math.PI), e.fill(), e.beginPath(), e.moveTo(t - 9 * n, o - 10 + s), e
                        .quadraticCurveTo(t - 16 * n, o - 6 + s + 4 * Math.sin(.12 * r), t - 20 * n, o - 10 +
                          s), e.stroke()
                    } else if ("neonCat" === a) e.beginPath(), e.ellipse(t, o - 10 + s, 7, 5, 0, 0, 2 * Math
                        .PI), e.stroke(), e.beginPath(), e.arc(t + 8 * n, o - 15 + s, 5, 0, 2 * Math.PI), e
                      .stroke(), e.beginPath(), e.moveTo(t + 5 * n, o - 19 + s), e.lineTo(t + 4 * n, o - 26 +
                        s), e.lineTo(t + 8 * n, o - 20 + s), e.moveTo(t + 11 * n, o - 19 + s), e.lineTo(t +
                        12 * n, o - 26 + s), e.lineTo(t + 14 * n, o - 20 + s), e.stroke(), e.shadowBlur = 12,
                      e.fillStyle = "#ffffff", e.beginPath(), e.arc(t + 9 * n, o - 15 + s, 1.5, 0, 2 * Math
                        .PI), e.fill(), e.beginPath(), e.arc(t + 7 * n, o - 15 + s, 1.5, 0, 2 * Math.PI), e
                      .fill(), e.beginPath(), e.moveTo(t - 7 * n, o - 10 + s), e.bezierCurveTo(t - 12 * n, o -
                        18 + s + 3 * Math.sin(.15 * r), t - 18 * n, o - 6 + s - 3 * Math.sin(.15 * r), t -
                        20 * n, o - 14 + s), e.stroke();
                    else if ("thunderBird" === a) {
                      e.beginPath(), e.ellipse(t, o - 12 + s, 7, 4, 0, 0, 2 * Math.PI), e.stroke();
                      let a = 7 * Math.sin(.25 * r);
                      e.beginPath(), e.moveTo(t - 5, o - 12 + s), e.lineTo(t - 14, o - 20 + s + a), e.lineTo(
                          t - 8, o - 10 + s), e.moveTo(t + 5, o - 12 + s), e.lineTo(t + 14, o - 20 + s + a), e
                        .lineTo(t + 8, o - 10 + s), e.stroke(), e.shadowBlur = 14;
                      let l = t - 14,
                        i = t + 14,
                        c = o - 20 + s + a;
                      e.beginPath(), e.moveTo(l, c), e.lineTo(l - 2, c + 4), e.lineTo(l + 1, c + 3), e.lineTo(
                          l - 1, c + 7), e.moveTo(i, c), e.lineTo(i + 2, c + 4), e.lineTo(i - 1, c + 3), e
                        .lineTo(i + 1, c + 7), e.stroke(), e.beginPath(), e.arc(t + 9 * n, o - 16 + s, 3, 0,
                          2 * Math.PI), e.stroke(), e.fillStyle = "#ffffff", e.beginPath(), e.arc(t + 10 * n,
                          o - 16 + s, 1.2, 0, 2 * Math.PI), e.fill(), e.beginPath(), e.moveTo(t + 12 * n, o -
                          16 + s), e.lineTo(t + 15 * n, o - 15 + s), e.stroke()
                    } else if ("iceFox" === a) {
                      e.beginPath(), e.ellipse(t, o - 10 + s, 8, 5, 0, 0, 2 * Math.PI), e.stroke(), e
                        .beginPath(), e.moveTo(t + 8 * n, o - 20 + s), e.lineTo(t + 14 * n, o - 14 + s), e
                        .lineTo(t + 8 * n, o - 10 + s), e.closePath(), e.stroke(), e.beginPath(), e.moveTo(t +
                          6 * n, o - 19 + s), e.lineTo(t + 4 * n, o - 26 + s), e.lineTo(t + 9 * n, o - 20 +
                        s), e.moveTo(t + 11 * n, o - 19 + s), e.lineTo(t + 13 * n, o - 26 + s), e.lineTo(t +
                          10 * n, o - 20 + s), e.stroke(), e.shadowBlur = 12, e.fillStyle = "#ffffff", e
                        .beginPath(), e.arc(t + 10 * n, o - 15 + s, 1.3, 0, 2 * Math.PI), e.fill(), e
                        .beginPath(), e.moveTo(t - 8 * n, o - 10 + s), e.quadraticCurveTo(t - 16 * n, o - 18 +
                          s + 4 * Math.sin(.1 * r), t - 20 * n, o - 14 + s), e.quadraticCurveTo(t - 16 * n,
                          o - 8 + s - 2 * Math.sin(.1 * r), t - 8 * n, o - 8 + s), e.stroke(), e.shadowBlur =
                        6, e.fillStyle = "#ffffff";
                      for (let a = 0; a < 3; a++) {
                        let l = t + 14 * Math.sin(.08 * r + 2.1 * a),
                          n = o - 14 + 8 * Math.cos(.1 * r + 1.7 * a) + s;
                        e.beginPath(), e.arc(l, n, 1, 0, 2 * Math.PI), e.fill()
                      }
                    } else if ("magmaSnail" === a) {
                      e.beginPath(), e.arc(t, o - 14 + s, 9, 0, 2 * Math.PI), e.stroke(), e.beginPath(), e
                        .arc(t - 2, o - 14 + s, 6, 0, 1.5 * Math.PI), e.stroke(), e.beginPath(), e.arc(t + 1,
                          o - 14 + s, 3, 0, 1.5 * Math.PI), e.stroke(), e.beginPath(), e.ellipse(t + 8 * n,
                          o - 6 + s, 6, 3, 0, 0, 2 * Math.PI), e.stroke(), e.beginPath(), e.moveTo(t + 10 * n,
                          o - 8 + s), e.lineTo(t + 12 * n, o - 16 + s + 2 * Math.sin(.1 * r)), e.moveTo(t +
                          13 * n, o - 8 + s), e.lineTo(t + 15 * n, o - 16 + s - 2 * Math.sin(.1 * r)), e
                        .stroke(), e.fillStyle = "#ffffff", e.beginPath(), e.arc(t + 12 * n, o - 16 + s + 2 *
                          Math.sin(.1 * r), 1.2, 0, 2 * Math.PI), e.arc(t + 15 * n, o - 16 + s - 2 * Math.sin(
                          .1 * r), 1.2, 0, 2 * Math.PI), e.fill(), e.shadowBlur = 10, e.fillStyle = "#ff4400";
                      for (let a = 0; a < 3; a++) {
                        let l = t + 10 * Math.cos(.12 * r + 2.09 * a),
                          n = o - 14 + 8 * Math.sin(.15 * r + 2.09 * a) + s;
                        e.beginPath(), e.arc(l, n, 1.5 - .3 * a, 0, 2 * Math.PI), e.fill()
                      }
                    } else if ("cosmicOwl" === a) {
                      e.beginPath(), e.ellipse(t, o - 10 + s, 8, 7, 0, 0, 2 * Math.PI), e.stroke(), e
                        .beginPath(), e.arc(t + 4 * n, o - 18 + s, 6, 0, 2 * Math.PI), e.stroke(), e
                        .beginPath(), e.moveTo(t + 0 * n, o - 23 + s), e.lineTo(t - 2 * n, o - 30 + s), e
                        .lineTo(t + 3 * n, o - 24 + s), e.moveTo(t + 8 * n, o - 23 + s), e.lineTo(t + 10 * n,
                          o - 30 + s), e.lineTo(t + 6 * n, o - 24 + s), e.stroke(), e.shadowBlur = 14, e
                        .fillStyle = "#ffffff", e.beginPath(), e.arc(t + 6 * n, o - 18 + s, 2, 0, 2 * Math
                        .PI), e.fill(), e.beginPath(), e.arc(t + 2 * n, o - 18 + s, 2, 0, 2 * Math.PI), e
                        .fill(), e.fillStyle = l, e.beginPath(), e.arc(t + 6 * n, o - 18 + s, 1, 0, 2 * Math
                          .PI), e.fill(), e.beginPath(), e.arc(t + 2 * n, o - 18 + s, 1, 0, 2 * Math.PI), e
                        .fill();
                      let a = 4 * Math.sin(.12 * r);
                      e.beginPath(), e.moveTo(t - 6, o - 10 + s), e.lineTo(t - 14, o - 14 + s + a), e.lineTo(
                          t - 8, o - 4 + s), e.moveTo(t + 6, o - 10 + s), e.lineTo(t + 14, o - 14 + s + a), e
                        .lineTo(t + 8, o - 4 + s), e.stroke(), e.shadowBlur = 8, e.fillStyle = "#ffffff";
                      for (let a = 0; a < 4; a++) {
                        let l = t + 5 * Math.cos(1.57 * a + .02 * r),
                          n = o - 10 + 4 * Math.sin(1.57 * a + .02 * r) + s;
                        e.beginPath(), e.arc(l, n, .8, 0, 2 * Math.PI), e.fill()
                      }
                    }
                    e.shadowBlur = 0, e.restore()
                  }(e, o, z.y, z.type, z.skinColor, z.animFrame, z.facing), e.save(), e.globalAlpha = .7;
                  let t = Math.max(0, z.health / z.maxHealth);
                  e.fillStyle = "#001a00", e.fillRect(o - 12, z.y - 30, 24, 3), e.fillStyle = t > .5 ? s : t >
                    .25 ? c : f, e.shadowBlur = 3, e.shadowColor = e.fillStyle, e.fillRect(o - 12, z.y - 30,
                      24 * t, 3), e.shadowBlur = 0, e.globalAlpha = 1, e.restore()
                }
              }
              for (let o of ek.current) {
                if (o.collected) continue;
                let a = o.x - G;
                if (a < -20 || a > t + 20) continue;
                let l = 4 * Math.sin(.06 * o.animFrame),
                  r = .3 * Math.sin(.12 * o.animFrame) + .7;
                e.save(), e.globalAlpha = r, e.shadowBlur = 12, e.shadowColor = m, e.fillStyle = m, e
                  .beginPath(), e.arc(a, o.y + l, 8, 0, 2 * Math.PI), e.fill(), e.strokeStyle = "#fff8dc", e
                  .lineWidth = 1, e.beginPath(), e.arc(a, o.y + l, 5, 0, 2 * Math.PI), e.stroke(), e
                  .globalAlpha = .5 * r, e.fillStyle = "#ffffff", e.beginPath(), e.arc(a + 3, o.y + l - 3,
                    1.5, 0, 2 * Math.PI), e.fill(), e.shadowBlur = 0, e.globalAlpha = 1, e.restore()
              }
              for (let o of e2.current) {
                if (o.opened) continue;
                let a = o.x - G;
                a < -30 || a > t + 30 || (e.save(), e.shadowBlur = 15, e.shadowColor = "skill" === o.reward ?
                  h : m, e.strokeStyle = "skill" === o.reward ? h : m, e.lineWidth = 2, e.strokeRect(a - 12,
                    o.y - 12, 24, 20), e.beginPath(), e.moveTo(a - 14, o.y - 12), e.lineTo(a, o.y - 20), e
                  .lineTo(a + 14, o.y - 12), e.stroke(), e.fillStyle = "skill" === o.reward ? i : "#ffd700",
                  e.beginPath(), e.arc(a, o.y - 4, 3, 0, 2 * Math.PI), e.fill(), e.shadowBlur = 0, e
                  .restore())
              }
              let _ = eS.current;
              if (_.active) {
                let t, o = _.x - G;
                a = _.y - 30, t = .3 * Math.sin(.05 * (l = F.current)) + .7, e.shadowBlur = 25, e
                  .shadowColor = s, e.globalAlpha = .3 * t, e.beginPath(), e.arc(o, a, 35, 0, 2 * Math.PI), e
                  .fillStyle = s, e.fill(), e.globalAlpha = .8 * t, e.beginPath(), e.arc(o, a, 18, 0, 2 * Math
                    .PI), e.fill(), e.globalAlpha = 1, e.strokeStyle = s, e.lineWidth = 2, e.beginPath(), e
                  .arc(o, a, 22 + 5 * Math.sin(.08 * l), 0, 2 * Math.PI), e.stroke(), e.globalAlpha = .5, e
                  .strokeStyle = "#ffffff", e.lineWidth = 1, e.beginPath(), e.arc(o, a, 12 + 3 * Math.sin(
                    .12 * l), 0, 2 * Math.PI), e.stroke(), e.shadowBlur = 0, e.globalAlpha = 1
              } else {
                let o = _.x - G;
                if (o > -100 && o < t + 100) {
                  let t = 5 * Math.sin(.06 * F.current);
                  e.save(), e.globalAlpha = .4 + .2 * Math.sin(.04 * F.current), e.shadowBlur = 8, e
                    .shadowColor = f, e.fillStyle = f, e.font = "bold 9px monospace", e.textAlign = "center",
                    e.fillText("CLEAR ALL", o, _.y - 65 + t), e.fillText("ENEMIES", o, _.y - 53 + t), e
                    .beginPath(), e.moveTo(o + 10, _.y - 40 + t), e.lineTo(o - 5, _.y - 46 + t), e.lineTo(o -
                      5, _.y - 34 + t), e.closePath(), e.fill(), e.shadowBlur = 0, e.globalAlpha = 1, e
                    .restore()
                }
              }
              if (E.isShielding && (e.save(), e.globalAlpha = .3 + .15 * Math.sin(.1 * F.current), e
                  .shadowBlur = 20, e.shadowColor = s, e.strokeStyle = s, e.lineWidth = 2, e.beginPath(), e
                  .arc(H, U - 25, 35, 0, 2 * Math.PI), e.stroke(), e.globalAlpha = .1, e.fillStyle = s, e
                  .fill(), e.shadowBlur = 0, e.globalAlpha = 1, e.restore()), L && L.isShielding) {
                let t = L.x - G + L.width / 2;
                e.save(), e.globalAlpha = .3 + .15 * Math.sin(.1 * F.current), e.shadowBlur = 20, e
                  .shadowColor = c, e.strokeStyle = c, e.lineWidth = 2, e.beginPath(), e.arc(t, L.y - 25, 35,
                    0, 2 * Math.PI), e.stroke(), e.globalAlpha = .1, e.fillStyle = c, e.fill(), e.shadowBlur =
                  0, e.globalAlpha = 1, e.restore()
              }
              if (E.isDashing) {
                e.save(), e.globalAlpha = .3, e.strokeStyle = n, e.lineWidth = 1.5;
                for (let t = 1; t <= 3; t++) {
                  let o = -E.facing * t * 12;
                  e.globalAlpha = .3 - .08 * t, e.beginPath(), e.moveTo(H + o, -38), e.lineTo(H + o + 2 * E
                    .facing, -29), e.lineTo(H + o, -10), e.stroke()
                }
                e.globalAlpha = 1, e.restore()
              }
              if (L && L.isDashing) {
                let t = L.x - G + L.width / 2;
                e.save(), e.globalAlpha = .3, e.strokeStyle = c, e.lineWidth = 1.5;
                for (let o = 1; o <= 3; o++) {
                  let a = -L.facing * o * 12;
                  e.globalAlpha = .3 - .08 * o, e.beginPath(), e.moveTo(t + a, -38), e.lineTo(t + a + 2 * L
                    .facing, -29), e.lineTo(t + a, -10), e.stroke()
                }
                e.globalAlpha = 1, e.restore()
              }
              for (let o of D.current) {
                if (!o.active) continue;
                let a = o.x - G;
                a < -20 || a > t + 20 || (r = o.y, x = o.radius, g = o.color, e.shadowBlur = 10, e
                  .shadowColor = g, e.globalAlpha = .35, e.beginPath(), e.arc(a, r, 2.5 * x, 0, 2 * Math
                  .PI), e.fillStyle = g, e.fill(), e.globalAlpha = 1, e.beginPath(), e.arc(a, r, x, 0, 2 *
                    Math.PI), e.fillStyle = "#ffffff", e.fill(), e.globalAlpha = .8, e.beginPath(), e.arc(a,
                    r, 1.2 * x, 0, 2 * Math.PI), e.fillStyle = g, e.fill(), e.shadowBlur = 0)
              }
              for (let o of W.current) {
                let a = o.x - G;
                a < -20 || a > t + 20 || (y = o.y, b = o.size * (o.life / o.maxLife), v = o.color, e
                  .globalAlpha = o.life / o.maxLife, e.shadowBlur = 5, e.shadowColor = v, e.fillStyle = v, e
                  .beginPath(), e.arc(a, y, b, 0, 2 * Math.PI), e.fill(), e.shadowBlur = 0)
              }
            },
            te = (e, t, o) => {
              let a = j.current,
                l = N.current,
                r = B.current;
              if (!a || !r) return;
              let i = "versus" === ea.getState().gameMode;
              e.save(), e.globalAlpha = .9;
              let h = Math.min(180, .25 * t);
              e.fillStyle = "#001a00", e.fillRect(16, 16, h, 12), e.strokeStyle = s, e.lineWidth = 1, e
                .shadowBlur = 5, e.shadowColor = s, e.strokeRect(16, 16, h, 12);
              let u = Math.max(0, a.health / a.maxHealth),
                x = u > .5 ? s : u > .25 ? c : f;
              if (e.fillStyle = x, e.shadowColor = x, e.shadowBlur = 8, e.fillRect(17, 17, (h - 2) * u, 10), e
                .shadowColor = s, e.shadowBlur = 5, e.fillStyle = s, e.font = "bold 10px monospace", e
                .textAlign = "left", e.fillText("P1 HP", 16, 12), l) {
                e.fillStyle = "#1a0a00", e.fillRect(16, 38, h, 12), e.strokeStyle = c, e.shadowColor = c, e
                  .strokeRect(16, 38, h, 12);
                let t = Math.max(0, l.health / l.maxHealth);
                e.fillStyle = t > .5 ? c : t > .25 ? d : f, e.shadowColor = e.fillStyle, e.fillRect(17, 39, (
                    h - 2) * t, 10), e.fillStyle = c, e.shadowColor = c, e.font = "bold 10px monospace", e
                  .fillText("P2 HP", 16, 34)
              }
              let p = G.find(e => e.id === r.id);
              if (p) {
                e.shadowColor = n, e.shadowBlur = 5, e.fillStyle = n, e.font = "10px monospace", e.textAlign =
                  "center", e.fillText(p.chapter, t / 2, 20), e.font = "bold 12px monospace", e.fillText(p
                    .name, t / 2, 34);
                let o = ea.getState();
                e.font = "9px monospace", e.fillStyle = d, e.shadowColor = d, e.shadowBlur = 3, e.fillText(
                  `WAVE ${o.currentWave+1}/${o.totalWaves}`, t / 2, 48)
              }
              if (eC.current > 0 && (e.shadowColor = m, e.shadowBlur = 5, e.fillStyle = m, e.font =
                  "10px monospace", e.textAlign = "right", e.fillText(`🪙 ${eC.current}`, t - 16, 62)), e
                .shadowColor = c, e.shadowBlur = 5, e.fillStyle = c, e.font = "10px monospace", e.textAlign =
                "right", e.fillText("SCORE", t - 16, 20), e.font = "bold 12px monospace", e.fillText(String(z
                  .current), t - 16, 34), l)
                if (e.font = "9px monospace", i) {
                  e.fillStyle = f, e.shadowColor = f;
                  let o = ea.getState();
                  e.fillText(`VS R${o.versusCurrentRound}`, t - 16, 48), e.font = "8px monospace", e
                    .fillStyle = n, e.fillText(`P1:${o.versusP1Wins}`, t - 46, 60), e.fillStyle = c, e
                    .fillText(`P2:${o.versusP2Wins}`, t - 16, 60)
                } else e.fillStyle = c, e.shadowColor = c, e.fillText("CO-OP", t - 16, 48);
              let g = I.current.find(e => e.active && ("boss" === e.type || "bossRedKing" === e.type ||
                "bossTitan" === e.type || "bossDragon" === e.type || "bossPhoenix" === e.type ||
                "bossMechGolem" === e.type || "bossCorrupted" === e.type || "bossFather" === e.type ||
                "bossTwin" === e.type));
              if (g) {
                let a = Math.min(300, .5 * t),
                  l = (t - a) / 2,
                  r = o - 16 - 12,
                  n = g.bossName || "BOSS",
                  i = g.bossColor || f;
                e.globalAlpha = .9, e.shadowBlur = 10, e.shadowColor = i, e.fillStyle = i, e.font =
                  "bold 12px monospace", e.textAlign = "center", e.fillText(n, t / 2, r - 6), e.globalAlpha =
                  .8, e.fillStyle = "#1a0000", e.fillRect(l, r, a, 16);
                let s = Math.max(0, g.health / g.maxHealth),
                  h = s > .5 ? f : s > .25 ? c : d,
                  u = e.createLinearGradient(l, r, l + a * s, r);
                u.addColorStop(0, h), u.addColorStop(1, f), e.fillStyle = u, e.shadowBlur = 10, e
                  .shadowColor = h, e.fillRect(l + 1, r + 1, (a - 2) * s, 14), e.globalAlpha = .3, e
                  .strokeStyle = "#ffffff", e.lineWidth = 1, e.shadowBlur = 0;
                for (let t = 1; t < 10; t++) {
                  let o = l + a / 10 * t;
                  e.beginPath(), e.moveTo(o, r), e.lineTo(o, r + 16), e.stroke()
                }
                e.globalAlpha = .9, e.strokeStyle = i, e.lineWidth = 2, e.shadowBlur = 8, e.shadowColor = i, e
                  .strokeRect(l, r, a, 16), g.enraged && (e.globalAlpha = .3 * Math.sin(.2 * F.current) + .7,
                    e.fillStyle = "#ff0000", e.shadowBlur = 15, e.shadowColor = "#ff0000", e.font =
                    "bold 10px monospace", e.textAlign = "center", e.fillText("⚠ ENRAGED ⚠", t / 2, r + 16 +
                      14)), e.globalAlpha = .7, e.fillStyle = "#ffffff", e.font = "bold 9px monospace", e
                  .shadowBlur = 0, e.fillText(`${Math.ceil(100*s)}%`, l + a / 2, r + 16 - 3)
              }
              e.shadowBlur = 0, e.globalAlpha = 1, e.restore();
              let y = eS.current,
                b = y.x - a.x,
                v = t - 40,
                w = o / 2,
                k = 5 * Math.sin(.08 * F.current);
              e.save(), b > 400 && !i ? (e.globalAlpha = .6 + .3 * Math.sin(.06 * F.current), e.shadowBlur =
                15, e.shadowColor = y.active ? s : d, e.fillStyle = y.active ? s : d, e.beginPath(), e
                .moveTo(v + 15, w + k), e.lineTo(v - 8, w - 10 + k), e.lineTo(v - 8, w + 10 + k), e
                .closePath(), e.fill(), e.font = "8px monospace", e.textAlign = "center", e.fillText(
                  `${Math.floor(b/100)}m`, v + 3, w + 22 + k)) : (e.globalAlpha = .4 + .2 * Math.sin(.06 * F
                  .current), e.shadowBlur = 10, e.shadowColor = s, e.fillStyle = s, e.beginPath(), e.moveTo(
                  v + 12, w + k), e.lineTo(v - 6, w - 8 + k), e.lineTo(v - 6, w + 8 + k), e.closePath(), e
                .fill()), e.shadowBlur = 0, e.globalAlpha = 1, e.restore()
            };
          return requestAnimationFrame(A), () => {
            cancelAnimationFrame(r.current), window.removeEventListener("resize", o), window
              .removeEventListener("orientationchange", a), window.visualViewport && window.visualViewport
              .removeEventListener("resize", o), C()
          }
        }, [ea, e3, eX, eQ]), (0, o.jsx)("canvas", {
          ref: l,
          className: "absolute top-0 left-0 w-full h-full",
          style: {
            touchAction: "none"
          }
        })
      });

    function eY() {
      return window.__neonWarriorControls
    }

    function eJ(e = 10) {
      try {
        navigator.vibrate?.(e)
      } catch {}
    }
    let eZ = {
        fire: "🔥",
        frost: "❄️",
        shadow: "👤",
        summon: "👻",
        death: "💀",
        lightning: "⚡",
        void: "🌀",
        blood: "🩸"
      },
      eX = {
        fire: "#ff4400",
        frost: "#88eeff",
        shadow: "#8800ff",
        summon: "#aa00ff",
        death: "#660066",
        lightning: "#ffff00",
        void: "#ff00ff",
        blood: "#cc0000"
      },
      eQ = [1, .9, .8, .7, .6];

    function e0({
      cooldownFrames: e,
      maxCooldown: t,
      size: a
    }) {
      if (e <= 0 || t <= 0) return null;
      let l = e / t,
        r = Math.ceil(e / 60),
        n = a / 2,
        i = -Math.PI / 2,
        s = i + 2 * l * Math.PI,
        c = n + n * Math.cos(i),
        d = n + n * Math.sin(i),
        h = n + n * Math.cos(s),
        f = n + n * Math.sin(s),
        u = l >= .999 ? `M ${n} ${n} L ${c} ${d} A ${n} ${n} 0 1 1 ${n-.01} ${d} Z` :
        `M ${n} ${n} L ${c} ${d} A ${n} ${n} 0 ${+(l>.5)} 1 ${h} ${f} Z`;
      return (0, o.jsxs)("div", {
        className: "absolute inset-0 flex items-center justify-center pointer-events-none",
        style: {
          width: a,
          height: a
        },
        children: [(0, o.jsx)("svg", {
          width: a,
          height: a,
          viewBox: `0 0 ${a} ${a}`,
          className: "absolute",
          style: {
            transform: "rotate(0deg)"
          },
          children: (0, o.jsx)("path", {
            d: u,
            fill: "rgba(0,0,0,0.7)"
          })
        }), (0, o.jsxs)("span", {
          className: "absolute font-bold text-white z-10",
          style: {
            fontSize: a < 60 ? 11 : 14,
            textShadow: "0 0 4px rgba(0,0,0,0.8)"
          },
          children: [r, "s"]
        })]
      })
    }

    function e1({
      icon: e,
      label: t,
      color: l,
      size: r,
      cooldownFrames: n,
      maxCooldown: i,
      onPressStart: s,
      onPressEnd: c,
      pulseEffect: d = !1,
      style: h
    }) {
      let f = n > 0,
        u = f ? .4 : 1,
        m = (0, a.useCallback)(e => {
          e.preventDefault(), e.stopPropagation(), f || (eJ(12), s())
        }, [f, s]),
        x = (0, a.useCallback)(e => {
          e.preventDefault(), e.stopPropagation(), c?.()
        }, [c]),
        p = .3 * !f,
        g = f ? .2 : .6,
        y = f ? .04 : .1;
      return (0, o.jsxs)("div", {
        className: "relative select-none",
        style: {
          width: r,
          height: r,
          touchAction: "none"
        },
        children: [(0, o.jsx)("button", {
          className: "flex items-center justify-center rounded-full active:scale-90 transition-transform select-none font-bold relative overflow-hidden",
          style: {
            width: r,
            height: r,
            backgroundColor: `rgba(${e2(l)}, ${y})`,
            border: `2.5px solid rgba(${e2(l)}, ${g})`,
            color: l,
            textShadow: `0 0 6px ${l}`,
            fontSize: r < 60 ? "20px" : r < 80 ? "24px" : "28px",
            boxShadow: f ? "none" : `0 0 ${r/4}px rgba(${e2(l)}, ${p})`,
            opacity: u,
            touchAction: "none",
            animation: d && !f ? "touch-btn-pulse 2s ease-in-out infinite" : "none",
            ...h
          },
          onTouchStart: m,
          onTouchEnd: x,
          onTouchCancel: x,
          "aria-label": t,
          children: e
        }), (0, o.jsx)(e0, {
          cooldownFrames: n,
          maxCooldown: i,
          size: r
        }), (0, o.jsx)("div", {
          className: "absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap",
          style: {
            fontSize: 7,
            color: `rgba(${e2(l)}, ${f?.3:.6})`,
            fontWeight: 700,
            letterSpacing: "0.05em"
          },
          children: t
        })]
      })
    }

    function e2(e) {
      let t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
      return t ? `${parseInt(t[1],16)},${parseInt(t[2],16)},${parseInt(t[3],16)}` : "255,255,255"
    }

    function e5() {
      let e = ea(e => e.gamePhase),
        t = ea(e => e.currentLevel);
      ea(e => e.dashCooldown), ea(e => e.shieldCooldown), ea(e => e.specialCooldown), ea(e => e.saveData);
      let a = ea(e => e.setGamePhase);
      return "playing" === e || "settings" === e && t > 0 ? "settings" === e && t > 0 ? (0, o.jsx)(e3, {
        onResume: () => a("playing")
      }) : (0, o.jsx)(e4, {}) : null
    }

    function e3({
      onResume: e
    }) {
      let t = ea(e => e.backToMenu);
      return (0, o.jsx)("div", {
        className: "absolute inset-0 z-30 flex items-center justify-center pointer-events-auto",
        style: {
          backgroundColor: "rgba(0,0,0,0.75)",
          touchAction: "none"
        },
        children: (0, o.jsxs)("div", {
          className: "flex flex-col items-center gap-6",
          children: [(0, o.jsx)("div", {
            className: "text-3xl font-bold tracking-widest",
            style: {
              color: n,
              textShadow: `0 0 20px ${n}`
            },
            children: "⏸ PAUSED"
          }), (0, o.jsx)("button", {
            className: "px-8 py-3 rounded-xl font-bold text-lg tracking-wider select-none active:scale-95 transition-transform",
            style: {
              backgroundColor: `rgba(${e2(n)}, 0.15)`,
              border: `2px solid rgba(${e2(n)}, 0.6)`,
              color: n,
              textShadow: `0 0 8px ${n}`,
              boxShadow: `0 0 15px rgba(${e2(n)}, 0.2)`,
              touchAction: "none"
            },
            onTouchStart: t => {
              t.preventDefault(), eJ(15), e()
            },
            onClick: () => {
              eJ(15), e()
            },
            "aria-label": "Resume game",
            children: "▶ RESUME"
          }), (0, o.jsx)("button", {
            className: "px-8 py-3 rounded-xl font-bold text-lg tracking-wider select-none active:scale-95 transition-transform",
            style: {
              backgroundColor: `rgba(${e2(i)}, 0.1)`,
              border: `2px solid rgba(${e2(i)}, 0.4)`,
              color: i,
              textShadow: `0 0 8px ${i}`,
              touchAction: "none"
            },
            onTouchStart: e => {
              e.preventDefault(), eJ(10), t()
            },
            onClick: () => {
              eJ(10), t()
            },
            "aria-label": "Quit to menu",
            children: "✕ QUIT"
          })]
        })
      })
    }

    function e4() {
      let e = ea(e => e.dashCooldown),
        t = ea(e => e.shieldCooldown),
        l = ea(e => e.specialCooldown),
        r = ea(e => e.saveData),
        [c, d] = (0, a.useState)(!1),
        [h, f] = (0, a.useState)({
          x: 0,
          y: 0
        }),
        u = (0, a.useRef)(null),
        m = (0, a.useRef)({
          x: 0,
          y: 0
        }),
        x = (0, a.useRef)(null),
        p = (0, a.useRef)(null),
        [g] = (0, a.useState)(() => window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
          /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)),
        y = r.equippedSkills,
        b = r.skillUpgrades,
        v = (0, a.useMemo)(() => {
          let o = [{
            key: "dash",
            icon: "⚡",
            color: n,
            label: "",
            cooldown: e,
            maxCooldown: 90,
            skillId: ""
          }, {
            key: "shield",
            icon: "🛡",
            color: s,
            label: "",
            cooldown: t,
            maxCooldown: 300,
            skillId: ""
          }, {
            key: "special",
            icon: "✦",
            color: i,
            label: "",
            cooldown: l,
            maxCooldown: 360,
            skillId: ""
          }];
          for (let e = 0; e < 3; e++) {
            let t = y[e];
            if (t) {
              let a = P.find(e => e.id === t);
              if (a) {
                let l = eQ[Math.min((b[t] ?? 1) - 1, eQ.length - 1)];
                o[e] = {
                  ...o[e],
                  icon: eZ[a.element] || o[e].icon,
                  color: eX[a.element] || o[e].color,
                  label: a.name.slice(0, 6),
                  maxCooldown: Math.floor(a.cooldown * l),
                  skillId: t
                }
              }
            }
          }
          return o
        }, [y, b, e, t, l]),
        w = (0, a.useCallback)((e, t) => {
          let o = e - m.current.x,
