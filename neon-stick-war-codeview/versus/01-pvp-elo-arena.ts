                    color: "#888"
                  },
                  children: [(0, o.jsx)("p", {
                    children: "Hold 🔥 for auto-fire"
                  }), (0, o.jsx)("p", {
                    children: "Double-tap ⬆ for double jump"
                  }), (0, o.jsx)("p", {
                    children: "Use skills wisely — they have cooldowns"
                  }), (0, o.jsx)("p", {
                    children: "Watch ads to earn coins"
                  }), (0, o.jsx)("p", {
                    children: "Complete levels to unlock skins"
                  }), (0, o.jsx)("p", {
                    children: "Upgrade weapons for more power"
                  })]
                })]
              })]
            })]
          }), (0, o.jsxs)("div", {
            className: "flex gap-3",
            children: [r && (0, o.jsx)("button", {
              onClick: () => {
                eo.playMenuClick(), l("playing")
              },
              className: "neon-btn flex-1 py-3 px-4 text-lg font-bold font-mono tracking-wider",
              style: {
                borderColor: s,
                color: s,
                textShadow: "0 0 10px #00ff66"
              },
              children: "RESUME"
            }), (0, o.jsx)("button", {
              onClick: () => {
                eo.playMenuClick(), a()
              },
              className: "neon-btn flex-1 py-3 px-4 text-sm font-bold font-mono tracking-wider",
              style: {
                borderColor: "#666",
                color: "#888",
                textShadow: "none"
              },
              children: "QUIT"
            })]
          })]
        })
      })
    }
    let tb = ["xXDarkSlayerXx", "NeonPhantom", "PixelKnight", "GridWalker", "VoidHunter", "CyberSamurai",
        "FlameReaper", "StormBlade", "GhostRunner", "IronFist", "ShadowPulse", "NovaStrike", "RoguePixel",
        "ZeroPoint", "CodeBreaker", "NightGrid", "ApexNeon", "TurboFlux", "DarkCircuit", "QuantumEdge"
      ],
      tv = ["🐉", "💀", "🔥", "⚡", "🗡️", "🛡️", "🎯", "👻", "🤖", "👾", "🦊", "🐺", "🦅", "🐍", "🦂", "🌋", "🌀", "💎", "⭐", "🌙"],
      tw = ["Nice shot!", "GG!", "Wow!", "Too easy!", "Close one!", "Lucky!", "Let's go!", "No way!", "Haha!",
        "Rematch?"
      ];

    function tk() {
      let e = (0, a.useRef)(null),
        t = (0, a.useRef)(0),
        l = (0, a.useRef)(0),
        r = ea(e => e.saveData),
        x = ea(e => e.updateRanking),
        p = ea(e => e.backToMenu),
        [g, y] = (0, a.useState)("lobby"),
        [b, v] = (0, a.useState)(0),
        [w, k] = (0, a.useState)(null),
        [C, S] = (0, a.useState)(""),
        [T, M] = (0, a.useState)(""),
        [j, N] = (0, a.useState)(!1),
        [P, A] = (0, a.useState)(null),
        [R, I] = (0, a.useState)(0),
        [E, L] = (0, a.useState)(0),
        D = (0, a.useRef)("lobby"),
        W = (0, a.useRef)(null),
        B = (0, a.useRef)(null),
        G = (0, a.useRef)({
          x: 50,
          y: 460,
          health: 500,
          maxHealth: 500,
          team: "blue"
        }),
        $ = (0, a.useRef)({
          x: 1520,
          y: 460,
          health: 500,
          maxHealth: 500,
          team: "red"
        }),
        F = (0, a.useRef)([]),
        H = (0, a.useRef)([]),
        U = (0, a.useRef)(0),
        V = (0, a.useRef)({
          left: !1,
          right: !1,
          up: !1,
          shoot: !1,
          dash: !1,
          shield: !1,
          special: !1
        }),
        z = (0, a.useRef)(.5),
        _ = (0, a.useRef)([]),
        K = (0, a.useRef)(0),
        q = (0, a.useRef)(null),
        Y = O(r.rankingData.elo);
      (0, a.useEffect)(() => {}, []), (0, a.useEffect)(() => {
        if ("searching" !== g) return;
        let e = setInterval(() => {
          v(t => t >= 3 ? (y("matched"), D.current = "matched", clearInterval(e), eo.init(), eo
            .playWaveComplete(), 0) : t + 1)
        }, 1e3);
        return () => clearInterval(e)
      }, [g]), (0, a.useEffect)(() => {
        if ("matched" !== g) return;
        let e = setTimeout(() => {
          y("playing"), D.current = "playing"
        }, 2e3);
        return () => clearTimeout(e)
      }, [g]);
      let J = (0, a.useRef)(0);
      (0, a.useEffect)(() => {
        if ("result" !== g) return;
        J.current = Date.now();
        let e = setInterval(() => {
          L(Math.floor((Date.now() - J.current) / 1e3))
        }, 1e3);
        return () => clearInterval(e)
      }, [g]);
      let Z = (0, a.useCallback)(() => {
        W.current = {
            x: 150,
            y: 460,
            vx: 0,
            vy: 0,
            health: 100,
            maxHealth: 100,
            facing: 1,
            grounded: !1,
            jumpCount: 0,
            shootCooldown: 0,
            animFrame: 0,
            isMoving: !1,
            isShooting: !1,
            color: n,
            dashCooldown: 0,
            isDashing: !1,
            dashTimer: 0,
            shieldCooldown: 0,
            isShielding: !1,
            shieldTimer: 0,
            specialCooldown: 0,
            isUsingSpecial: !1,
            specialTimer: 0,
            invincible: 0
          }, B.current = {
            x: 1450,
            y: 460,
            vx: 0,
            vy: 0,
            health: 100,
            maxHealth: 100,
            facing: -1,
            grounded: !1,
            jumpCount: 0,
            shootCooldown: 0,
            animFrame: 0,
            isMoving: !1,
            isShooting: !1,
            color: f,
            dashCooldown: 0,
            isDashing: !1,
            dashTimer: 0,
            shieldCooldown: 0,
            isShielding: !1,
            shieldTimer: 0,
            specialCooldown: 0,
            isUsingSpecial: !1,
            specialTimer: 0,
            invincible: 0
          }, G.current = {
            x: 50,
            y: 460,
            health: 500,
            maxHealth: 500,
            team: "blue"
          }, $.current = {
            x: 1520,
            y: 460,
            health: 500,
            maxHealth: 500,
            team: "red"
          }, F.current = [], H.current = [], U.current = 0, l.current = 0, _.current = [], K.current > 0 ? z
          .current = Math.min(1, .5 + .15 * K.current) : K.current < 0 ? z.current = Math.max(.1, .5 + .1 * K
            .current) : z.current = .5
      }, []);
      (0, a.useEffect)(() => {
        "playing" === g && Z()
      }, [g, Z]), (0, a.useEffect)(() => {
        let o = e.current;
        if (!o) return;
        let a = o.getContext("2d");
        if (!a) return;
        let h = () => {
          o.width = window.innerWidth, o.height = window.innerHeight
        };
        h(), window.addEventListener("resize", h);
        let m = () => {
          t.current = requestAnimationFrame(m), l.current++;
          let e = o.width,
            h = o.height;
          if ("playing" !== D.current) {
            a.fillStyle = u, a.fillRect(0, 0, e, h), a.globalAlpha = .04, a.strokeStyle = n, a.lineWidth = 1;
            let t = .3 * l.current % 80;
            for (let o = t; o < e; o += 80) a.beginPath(), a.moveTo(o, 0), a.lineTo(o, h), a.stroke();
            for (let t = 0; t < h; t += 80) a.beginPath(), a.moveTo(0, t), a.lineTo(e, t), a.stroke();
            a.globalAlpha = 1;
            return
          }
          let p = W.current,
            g = B.current;
          if (!p || !g) return;
          let b = z.current,
            v = V.current,
            w = 0;
          if (v.left && (w = -1, p.facing = -1), v.right && (w = 1, p.facing = 1), v.dash && p.dashCooldown <=
            0 && !p.isDashing && (p.isDashing = !0, p.dashTimer = 8, p.dashCooldown = 90, p.invincible = 8, p.x,
              p.y), p.isDashing ? (p.dashTimer -= (eG ? 2 : 1), p.vx = 18 * p.facing, p.dashTimer <= 0 && (p
              .isDashing = !1)) : p.vx = (p.grounded ? 4.5 : 3) * w, v.shield && p.shieldCooldown <= 0 && !p
            .isShielding && (p.isShielding = !0, p.shieldTimer = 120, p.shieldCooldown = 300), p.isShielding &&
            (p.shieldTimer -= (eG ? 2 : 1), p.shieldTimer <= 0 && (p.isShielding = !1)), v.special && p
            .specialCooldown <= 0 && !p.isUsingSpecial) {
            p.isUsingSpecial = !0, p.specialTimer = 30, p.specialCooldown = 360;
            for (let e = -.4; e <= .41; e += .13) {
              let t = 9 * p.facing;
              H.current.push({
                x: p.x + 15 * p.facing,
                y: p.y - 25,
                vx: t * Math.cos(e),
                vy: t * Math.sin(e),
                fromBlue: !0,
                damage: 8,
                active: !0,
                color: c,
                radius: 4
              })
            }
          }
          p.isUsingSpecial && (p.specialTimer -= (eG ? 2 : 1), p.specialTimer <= 0 && (p.isUsingSpecial = !1)),
            p.isMoving = Math.abs(w) > 0, v.up && p.jumpCount < 2 && (p.vy = -12, p.grounded = !1, p
              .jumpCount++, eo.init(), eo.playJump()), p.shootCooldown > 0 && (p.shootCooldown -= (eG ? 2 : 1)),
            v.shoot && p.shootCooldown <= 0 && !p.isDashing ? (H.current.push({
              x: p.x + 15 * p.facing,
              y: p.y - 25,
              vx: 9 * p.facing,
              vy: 0,
              fromBlue: !0,
              damage: 8,
              active: !0,
              color: n,
              radius: 4
            }), p.shootCooldown = 10, p.isShooting = !0, eo.init(), eo.playShoot()) : p.isShooting = !1, p
            .dashCooldown > 0 && p.dashCooldown--, p.shieldCooldown > 0 && p.shieldCooldown--, p
            .specialCooldown > 0 && p.specialCooldown--, p.invincible > 0 && (p.invincible -= (eG ? 2 : 1)), p
            .vy += .5, p.vy > 10 && (p.vy = 10), p.x += p.vx, p.y += p.vy, p.y >= 460 && (p.y = 460, p.vy = 0, p
              .grounded = !0, p.jumpCount = 0), p.x < 50 && (p.x = 50), p.x > 1550 && (p.x = 1550);
          let C = Math.abs(g.x - p.x);
          if (Math.random() > (1 - b) * .02 ? C > 200 ? (g.vx = (p.x > g.x ? 1 : -1) * (2 + 2 * b), g.facing = g
              .vx > 0 ? 1 : -1, g.isMoving = !0) : (Math.random() < .3 * b ? g.vx = (p.x > g.x ? -1 : 1) * 2 : g
              .vx = 0, g.isMoving = Math.abs(g.vx) > 0, g.facing = p.x > g.x ? 1 : -1) : (g.vx = 0, g
              .isMoving = !1, g.facing = p.x > g.x ? 1 : -1), g.shootCooldown > 0 && (g.shootCooldown -= (eG ?
              2 : 1)), g.shootCooldown <= 0 && C < 400) {
            let e = p.x - g.x,
              t = p.y - 25 - (g.y - 25),
              o = Math.sqrt(e * e + t * t);
            if (o > 0) {
              let a = (1 - (.7 + .3 * b)) * .5,
                l = (Math.random() - .5) * a,
                r = (Math.random() - .5) * a;
              H.current.push({
                x: g.x + 15 * g.facing,
                y: g.y - 25,
                vx: (e / o + l) * 7,
                vy: (t / o + r) * 7,
                fromBlue: !1,
                damage: 8,
                active: !0,
                color: f,
                radius: 3
              })
            }
            g.shootCooldown = Math.floor((30 + 20 * Math.random()) / (.5 + .5 * b)), g.isShooting = !0
          } else g.isShooting = !1;
          if (g.dashCooldown > 0 && g.dashCooldown--, g.shieldCooldown > 0 && g.shieldCooldown--, g
            .specialCooldown > 0 && g.specialCooldown--, g.invincible > 0 && (g.invincible -= (eG ? 2 : 1)), b >
            .6 && g.dashCooldown <= 0 && C < 200 && Math.random() < .01 * b && (g.isDashing = !0, g.dashTimer =
              8, g.dashCooldown = 90, g.invincible = 8), g.isDashing && (g.dashTimer -= (eG ? 2 : 1), g.vx =
              18 * g.facing, g.dashTimer <= 0 && (g.isDashing = !1)), g.health < .4 * g.maxHealth && g
            .shieldCooldown <= 0 && .005 > Math.random() && (g.isShielding = !0, g.shieldTimer = 60, g
              .shieldCooldown = 200), g.isShielding && (g.shieldTimer -= (eG ? 2 : 1), g.shieldTimer <= 0 && (g
              .isShielding = !1)), b > .5 && g.specialCooldown <= 0 && C < 350 && Math.random() < .003 * b) {
            g.isUsingSpecial = !0, g.specialTimer = 30, g.specialCooldown = 360;
            for (let e = -.3; e <= .31; e += .15) {
              let t = 8 * g.facing;
              H.current.push({
                x: g.x + 15 * g.facing,
                y: g.y - 25,
                vx: t * Math.cos(e),
                vy: t * Math.sin(e),
                fromBlue: !1,
                damage: 6,
                active: !0,
                color: i,
                radius: 3
              })
            }
          }
          g.isUsingSpecial && (g.specialTimer -= (eG ? 2 : 1), g.specialTimer <= 0 && (g.isUsingSpecial = !1)),
            g.grounded && Math.random() < .01 + .02 * b && (g.vy = -11, g.grounded = !1), g.vy += .5, g.vy >
            10 && (g.vy = 10), g.x += g.vx, g.y += g.vy, g.y >= 460 && (g.y = 460, g.vy = 0, g.grounded = !0, g
              .jumpCount = 0), g.x < 50 && (g.x = 50), g.x > 1550 && (g.x = 1550);
          let S = q.current;
          if (.003 > Math.random() && S) {
            let e = tw[Math.floor(Math.random() * tw.length)];
            _.current.push({
              text: `${S.name}: ${e}`,
              timer: 120,
              color: f
            })
          }
          for (let e of (_.current = _.current.filter(e => (e.timer--, e.timer > 0)), U.current++, U.current >=
              300 && (U.current = 0, F.current.push({
                x: 100,
                y: 460,
                vx: 1.5,
                vy: 0,
                team: "blue",
                health: 40,
                maxHealth: 40,
                facing: 1,
                attackCooldown: 0,
                animFrame: 0,
                active: !0
              }), F.current.push({
                x: 1500,
                y: 460,
                vx: -1.5,
                vy: 0,
                team: "red",
                health: 40,
                maxHealth: 40,
                facing: -1,
                attackCooldown: 0,
                animFrame: 0,
                active: !0
              })), F.current)) {
            if (!e.active) continue;
            e.animFrame++;
            let t = F.current.filter(t => t.active && t.team !== e.team && 100 > Math.abs(t.x - e.x));
            if (t.length > 0) {
              let o = t[0];
              e.attackCooldown--, e.attackCooldown <= 0 && (o.health -= 5, e.attackCooldown = 30, o.health <=
                0 && (o.active = !1)), e.vx = 0
            } else e.vx = "blue" === e.team ? 1.2 : -1.2;
            "blue" === e.team && e.x >= $.current.x - 20 && ($.current.health -= 1, e.vx = 0, e
              .attackCooldown--, e.attackCooldown <= 0 && ($.current.health -= 2, e.attackCooldown = 30, eo
                .init(), eo.playHit())), "red" === e.team && e.x <= G.current.x + 40 && (G.current.health -=
              1, e.vx = 0, e.attackCooldown--, e.attackCooldown <= 0 && (G.current.health -= 2, e
                .attackCooldown = 30)), e.x += e.vx
          }
          for (let e of (F.current = F.current.filter(e => e.active), H.current))
            if (e.active) {
              if (e.x += e.vx, e.y += e.vy, e.x < -20 || e.x > 1620) {
                e.active = !1;
                continue
              }
              if (e.fromBlue) {
                let t = B.current;
                for (let o of (t && t.invincible <= 0 && !t.isShielding && 15 > Math.abs(e.x - t.x) && 25 > Math
                    .abs(e.y - (t.y - 25)) && (t.health -= e.damage, t.invincible = 20, e.active = !1, eo
                      .init(), eo.playHit()), F.current))
                  if (o.active && "red" === o.team && 15 > Math.abs(e.x - o.x) && 15 > Math.abs(e.y - (o.y -
                      15))) {
                    o.health -= e.damage, e.active = !1, o.health <= 0 && (o.active = !1, eo.init(), eo
                      .playEnemyDeath());
                    break
                  }
              } else
                for (let t of (p.invincible <= 0 && !p.isShielding && 15 > Math.abs(e.x - p.x) && 25 > Math.abs(
                    e.y - (p.y - 25)) && (p.health -= e.damage, p.invincible = 20, e.active = !1, eo.init(),
                    eo.playDamage()), F.current))
                  if (t.active && "blue" === t.team && 15 > Math.abs(e.x - t.x) && 15 > Math.abs(e.y - (t.y -
                      15))) {
                    t.health -= e.damage, e.active = !1, t.health <= 0 && (t.active = !1);
                    break
                  }
            } H.current = H.current.filter(e => e.active);
          let T = G.current,
            M = $.current;
          if (M.health <= 0 || g.health <= 0) {
            D.current = "result", k("win"), y("result"), K.current = Math.max(K.current + 1, 1), I(K.current),
              x(!0), eo.init(), eo.playLevelComplete();
            return
          }
          if (T.health <= 0 || p.health <= 0) {
            D.current = "result", k("loss"), y("result"), K.current = Math.min(K.current - 1, -1), I(K.current),
              x(!1), eo.init(), eo.playGameOver();
            return
          }
          a.fillStyle = u, a.fillRect(0, 0, e, h);
          let j = Math.min(e / 1600, h / 500),
            N = (e - 1600 * j) / 2,
            P = (h - 500 * j) / 2;
          a.save(), a.translate(N, P), a.scale(j, j), a.globalAlpha = .05, a.strokeStyle = n, a.lineWidth = 1;
          for (let e = 0; e < 1600; e += 80) a.beginPath(), a.moveTo(e, 0), a.lineTo(e, 500), a.stroke();
          for (let e = 0; e < 500; e += 80) a.beginPath(), a.moveTo(0, e), a.lineTo(1600, e), a.stroke();
          a.globalAlpha = 1, a.fillStyle = "#0a1a1a", a.fillRect(0, 460, 1600, 40), a.strokeStyle = s, a
            .shadowBlur = 8, a.shadowColor = s, a.lineWidth = 2, a.beginPath(), a.moveTo(0, 460), a.lineTo(1600,
              460), a.stroke(), a.shadowBlur = 0, a.globalAlpha = .1, a.strokeStyle = d, a.lineWidth = 1, a
            .setLineDash([5, 10]), a.beginPath(), a.moveTo(800, 360), a.lineTo(800, 460), a.stroke(), a
            .setLineDash([]), a.globalAlpha = 1, a.fillStyle = "rgba(0,255,255,0.08)", a.fillRect(T.x - 10, 380,
              50, 80), a.strokeStyle = n, a.shadowBlur = 10, a.shadowColor = n, a.lineWidth = 2, a.strokeRect(T
              .x - 10, 380, 50, 80);
          let A = Math.max(0, T.health / T.maxHealth);
          a.fillStyle = "#001a00", a.fillRect(T.x - 15, 370, 60, 6), a.fillStyle = n, a.shadowColor = n, a
            .fillRect(T.x - 15, 370, 60 * A, 6), a.shadowBlur = 0, a.fillStyle = "rgba(255,51,51,0.08)", a
            .fillRect(M.x - 10, 380, 50, 80), a.strokeStyle = f, a.shadowBlur = 10, a.shadowColor = f, a
            .lineWidth = 2, a.strokeRect(M.x - 10, 380, 50, 80);
          let R = Math.max(0, M.health / M.maxHealth);
          for (let e of (a.fillStyle = "#1a0000", a.fillRect(M.x - 15, 370, 60, 6), a.fillStyle = f, a
              .shadowColor = f, a.fillRect(M.x - 15, 370, 60 * R, 6), a.shadowBlur = 0, F.current)) {
            if (!e.active) continue;
            let t = "blue" === e.team ? n : f;
            a.strokeStyle = t, a.shadowBlur = 5, a.shadowColor = t, a.lineWidth = 1.5;
            let o = e.x,
              l = e.y;
            a.beginPath(), a.arc(o, l - 30, 5, 0, 2 * Math.PI), a.stroke(), a.beginPath(), a.moveTo(o, l - 25),
              a.lineTo(o, l - 8), a.stroke(), a.beginPath(), a.moveTo(o, l - 20), a.lineTo(o - 6, l - 14), a
              .stroke(), a.beginPath(), a.moveTo(o, l - 20), a.lineTo(o + 6, l - 14), a.stroke(), a.beginPath(),
              a.moveTo(o, l - 8), a.lineTo(o - 5, l), a.stroke(), a.beginPath(), a.moveTo(o, l - 8), a.lineTo(
                o + 5, l), a.stroke();
            let r = e.health / e.maxHealth;
            a.fillStyle = "#111", a.fillRect(o - 10, l - 38, 20, 3), a.fillStyle = r > .5 ? s : r > .25 ? c : f,
              a.fillRect(o - 10, l - 38, 20 * r, 3), a.shadowBlur = 0
          }
          tC(a, p.x, p.y, p.facing, p.color, p.animFrame, p.isShooting, p.grounded, p.isMoving, p.isShielding, p
            .invincible > 0);
          let E = Math.max(0, p.health / p.maxHealth);
          a.fillStyle = "#111", a.fillRect(p.x - 15, p.y - 55, 30, 4), a.fillStyle = E > .5 ? s : E > .25 ? c :
            f, a.shadowBlur = 3, a.shadowColor = a.fillStyle, a.fillRect(p.x - 15, p.y - 55, 30 * E, 4), a
            .shadowBlur = 0, tC(a, g.x, g.y, g.facing, g.color, g.animFrame, g.isShooting, g.grounded, g
              .isMoving, g.isShielding, g.invincible > 0);
          let L = Math.max(0, g.health / g.maxHealth);
          for (let e of (a.fillStyle = "#111", a.fillRect(g.x - 15, g.y - 55, 30, 4), a.fillStyle = f, a
              .fillRect(g.x - 15, g.y - 55, 30 * L, 4), H.current)) e.active && (a.shadowBlur = 8, a
            .shadowColor = e.color, a.fillStyle = "#ffffff", a.beginPath(), a.arc(e.x, e.y, e.radius, 0, 2 *
              Math.PI), a.fill(), a.globalAlpha = .4, a.fillStyle = e.color, a.beginPath(), a.arc(e.x, e.y,
              2 * e.radius, 0, 2 * Math.PI), a.fill(), a.globalAlpha = 1, a.shadowBlur = 0);
          a.globalAlpha = .8, a.font = "12px monospace", a.textAlign = "left";
          let O = 80;
          for (let e of _.current.slice(-3)) a.globalAlpha = .8 * Math.min(1, e.timer / 30), a.shadowBlur = 3, a
            .shadowColor = e.color, a.fillStyle = e.color, a.fillText(e.text, 480, O), O += 16;
          a.shadowBlur = 0, a.globalAlpha = 1, a.globalAlpha = .9, a.font = "bold 14px monospace", a.textAlign =
            "center", a.shadowBlur = 5, a.shadowColor = n, a.fillStyle = n, a.font = "16px sans-serif", a
            .fillText(r.avatar, 345, 32), a.font = "bold 14px monospace", a.fillText(r.username, 400, 32), a
            .shadowColor = f, a.fillStyle = f, S && (a.font = "16px sans-serif", a.fillText(S.avatar, 1145,
            32)), a.font = "bold 14px monospace", a.fillText(S?.name ?? "???", 1200, 32), a.shadowColor = d, a
            .fillStyle = d, a.fillText("ONLINE ARENA", 800, 32), Math.abs(K.current) > 1 && (a.font =
              "10px monospace", a.fillStyle = K.current > 0 ? s : f, a.shadowColor = a.fillStyle, a.fillText(K
                .current > 0 ? `${K.current} WIN STREAK` : `${Math.abs(K.current)} LOSS STREAK`, 800, 48)), a
            .shadowBlur = 0, a.globalAlpha = 1;
          a.font = "9px monospace", a.textAlign = "center";
          let Y = [{
            label: "",
            cd: p.dashCooldown,
            max: 90,
            color: n
          }, {
            label: "",
            cd: p.shieldCooldown,
            max: 300,
            color: s
          }, {
            label: "",
            cd: p.specialCooldown,
            max: 360,
            color: c
          }];
          for (let e = 0; e < Y.length; e++) {
            let t = Y[e],
              o = 240 + 45 * e,
              l = t.cd <= 0;
            a.globalAlpha = l ? 1 : .4, a.strokeStyle = t.color, a.lineWidth = l ? 2 : 1, a.shadowBlur = 5 * !!
              l, a.shadowColor = t.color, a.strokeRect(o - 15, 477, 30, 16), a.fillStyle = t.color, a.fillText(t
                .label, o, 488), a.shadowBlur = 0
          }
          a.globalAlpha = 1, a.restore()
        };
        return m(), () => {
          cancelAnimationFrame(t.current), window.removeEventListener("resize", h)
        }
      }, [P, r.username, r.avatar, x]);
      let X = (0, a.useCallback)(() => {
          var e;
          let t, o, a, l, n, i, s, c, d = (e = r.rankingData.elo, a = tb[Math.floor((o = (t = 9301 * Date.now() +
              49297, () => (t = (9301 * t + 49297) % 233280) / 233280))() * tb.length)], l = tv[Math.floor(o() *
              tv.length)], n = Math.max(100, e + Math.floor((o() - .5) * 400)), i = Math.floor(50 * o()) + 5,
            s = Math.floor(40 * o()) + 2, c = O(n), {
              name: a,
              avatar: l,
              elo: n,
              wins: i,
              losses: s,
              rank: c.rank,
              rankIcon: c.icon
            });
          A(d), q.current = d, y("searching"), v(0), D.current = "searching"
        }, [r.rankingData.elo]),
        Q = () => {
          eo.init(), eo.playMenuClick(), D.current = "lobby", p()
        },
        [ee, et] = (0, a.useState)(!1),
        [el, er] = (0, a.useState)(!1),
        en = (e, t) => {
          if (V.current[e] = t, t) try {
            navigator.vibrate?.(10)
          } catch {}
        },
        ei = (e, t, a = 48) => (0, o.jsx)("div", {
          className: "rounded-full flex items-center justify-center flex-shrink-0",
          style: {
            width: a,
            height: a,
            border: `3px solid ${t}`,
            backgroundColor: "rgba(0,0,0,0.5)",
            boxShadow: `0 0 15px ${t}40`,
            fontSize: .5 * a
          },
          children: e
        });
      return (0, o.jsxs)("div", {
        style: {
          backgroundColor: u
        },
        className: "jsx-bfd3ab80909036c6 absolute inset-0 z-20",
        children: [(0, o.jsx)("canvas", {
          ref: e,
          style: {
            touchAction: "none"
          },
          className: "jsx-bfd3ab80909036c6 absolute inset-0 w-full h-full"
        }), "playing" === g && (0, o.jsxs)("div", {
          style: {
            touchAction: "none"
          },
          className: "jsx-bfd3ab80909036c6 absolute inset-0 z-30 pointer-events-none select-none",
          children: [(0, o.jsx)("div", {
            style: {
              touchAction: "none"
            },
            className: "jsx-bfd3ab80909036c6 absolute bottom-5 left-5 flex gap-3 pointer-events-auto",
            children: ["left", "right"].map(e => (0, o.jsx)("button", {
              style: {
                backgroundColor: "rgba(0,255,255,0.1)",
                border: `2px solid ${n}80`,
                color: n
              },
              onTouchStart: t => {
                t.preventDefault(), en(e, !0)
              },
              onTouchEnd: t => {
                t.preventDefault(), en(e, !1)
              },
              onTouchCancel: t => {
                t.preventDefault(), en(e, !1)
              },
              "aria-label": "left" === e ? "Move left" : "Move right",
              className: "jsx-bfd3ab80909036c6 w-16 h-16 rounded-full active:scale-90 font-bold text-2xl",
              children: "left" === e ? "‹" : "›"
            }, e))
          }), (0, o.jsx)("div", {
            style: {
              touchAction: "none"
            },
            className: "jsx-bfd3ab80909036c6 absolute bottom-5 right-5 flex items-end gap-2 pointer-events-auto",
            children: [
              ["dash", "DASH", n],
              ["shield", "SHLD", s],
              ["special", "SPCL", c],
              ["up", "JUMP", s],
              ["shoot", "FIRE", i]
            ].map(([e, t, a]) => (0, o.jsx)("button", {
              style: {
                width: "shoot" === e ? 74 : "up" === e ? 64 : 52,
                height: "shoot" === e ? 74 : "up" === e ? 64 : 52,
                backgroundColor: `${a}18`,
                border: `2px solid ${a}80`,
                color: a,
                fontSize: "shoot" === e ? 12 : 10,
                textShadow: `0 0 6px ${a}`
              },
              onTouchStart: t => {
                t.preventDefault(), en(e, !0)
              },
              onTouchEnd: t => {
                t.preventDefault(), en(e, !1)
              },
              onTouchCancel: t => {
                t.preventDefault(), en(e, !1)
              },
              "aria-label": t,
              className: "jsx-bfd3ab80909036c6 rounded-full active:scale-90 font-mono font-bold",
              children: t
            }, e))
          })]
        }), "lobby" === g && (0, o.jsx)("div", {
          className: "jsx-bfd3ab80909036c6 absolute inset-0 flex items-center justify-center pointer-events-auto",
          children: (0, o.jsxs)("div", {
            style: {
              backgroundColor: "rgba(5,5,20,0.95)",
              border: "2px solid #ff6600",
              boxShadow: "0 0 30px #ff660020"
            },
            className: "jsx-bfd3ab80909036c6 w-full max-w-md p-4 sm:p-6 rounded-lg mx-4",
            children: [(0, o.jsx)("h1", {
              style: {
                color: c,
                textShadow: "0 0 10px #ff6600"
              },
              className: "jsx-bfd3ab80909036c6 text-2xl sm:text-3xl font-bold text-center tracking-wider mb-3 font-mono",
              children: "ONLINE ARENA"
            }), (0, o.jsxs)("div", {
              style: {
                backgroundColor: "rgba(255,215,0,0.05)",
                border: "1px solid rgba(255,215,0,0.2)"
              },
              className: "jsx-bfd3ab80909036c6 text-center mb-4 p-3 rounded-lg",
              children: [(0, o.jsxs)("div", {
                className: "jsx-bfd3ab80909036c6 flex items-center justify-center gap-2 mb-1",
                children: [ei(r.avatar, m, 36), (0, o.jsxs)("div", {
                  className: "jsx-bfd3ab80909036c6 text-left",
                  children: [(0, o.jsxs)("div", {
                    className: "jsx-bfd3ab80909036c6 flex items-center gap-1.5",
                    children: [(0, o.jsx)("span", {
                      className: "jsx-bfd3ab80909036c6 text-lg",
                      children: Y.icon
                    }), (0, o.jsx)("span", {
                      style: {
                        color: m,
                        textShadow: "0 0 5px #ffd700"
                      },
                      className: "jsx-bfd3ab80909036c6 font-mono font-bold text-base",
                      children: Y.rank
                    })]
                  }), (0, o.jsxs)("span", {
                    style: {
                      color: "#aaa"
                    },
                    className: "jsx-bfd3ab80909036c6 font-mono text-sm",
                    children: ["ELO: ", (0, o.jsx)("span", {
                      style: {
                        color: m
                      },
                      className: "jsx-bfd3ab80909036c6",
                      children: r.rankingData.elo
                    })]
                  })]
                })]
              }), (0, o.jsxs)("div", {
                style: {
                  color: "#666"
                },
                className: "jsx-bfd3ab80909036c6 font-mono text-xs mt-1",
                children: [(0, o.jsxs)("span", {
                  style: {
                    color: s
                  },
                  className: "jsx-bfd3ab80909036c6",
                  children: ["W: ", r.rankingData.wins]
                }), (0, o.jsx)("span", {
                  className: "jsx-bfd3ab80909036c6 mx-2",
                  children: "|"
                }), (0, o.jsxs)("span", {
                  style: {
                    color: f
                  },
                  className: "jsx-bfd3ab80909036c6",
                  children: ["L: ", r.rankingData.losses]
                }), 0 !== R && (0, o.jsx)("span", {
                  style: {
                    color: R > 0 ? s : f
                  },
                  className: "jsx-bfd3ab80909036c6 ml-2",
                  children: R > 0 ? `🔥${R}` : `💀${Math.abs(R)}`
                })]
              })]
            }), (0, o.jsxs)("div", {
              className: "jsx-bfd3ab80909036c6 flex flex-col gap-2.5",
              children: [(0, o.jsx)("button", {
                onClick: () => {
                  eo.init(), eo.playMenuClick(), X()
                },
                style: {
                  borderColor: c,
                  color: c,
                  textShadow: "0 0 10px #ff6600"
                },
                className: "jsx-bfd3ab80909036c6 neon-btn w-full py-3 px-6 text-lg font-bold font-mono tracking-wider",
                children: "⚔️ FIND MATCH"
              }), (0, o.jsxs)("div", {
                className: "jsx-bfd3ab80909036c6 grid grid-cols-2 gap-2",
                children: [(0, o.jsx)("button", {
                  onClick: () => {
                    eo.init(), eo.playMenuClick(), S(Math.random().toString(36)
                      .substring(2, 8).toUpperCase()), X()
                  },
                  style: {
                    borderColor: n,
                    color: n,
                    textShadow: "0 0 10px #00ffff"
                  },
                  className: "jsx-bfd3ab80909036c6 neon-btn py-2 px-3 text-xs sm:text-sm font-bold font-mono tracking-wider",
                  children: "🏠 CREATE ROOM"
                }), (0, o.jsx)("button", {
                  onClick: () => {
                    eo.init(), eo.playMenuClick(), N(!j)
                  },
                  style: {
                    borderColor: h,
                    color: h,
                    textShadow: "0 0 10px #aa00ff"
                  },
                  className: "jsx-bfd3ab80909036c6 neon-btn py-2 px-3 text-xs sm:text-sm font-bold font-mono tracking-wider",
                  children: "🔗 JOIN ROOM"
                })]
              }), C && (0, o.jsxs)("div", {
                style: {
                  color: m,
                  backgroundColor: "rgba(255,215,0,0.05)",
                  border: "1px solid rgba(255,215,0,0.2)"
                },
                className: "jsx-bfd3ab80909036c6 text-center font-mono text-sm p-2 rounded",
                children: ["Room Code: ", (0, o.jsx)("span", {
                  className: "jsx-bfd3ab80909036c6 font-bold text-lg tracking-widest",
                  children: C
                }), (0, o.jsx)("div", {
                  style: {
                    color: "#666"
                  },
                  className: "jsx-bfd3ab80909036c6 text-[9px]",
                  children: "Share this code with your friend"
                })]
              }), j && (0, o.jsxs)("div", {
                className: "jsx-bfd3ab80909036c6 flex gap-2",
                children: [(0, o.jsx)("input", {
                  type: "text",
                  value: T,
                  onChange: e => M(e.target.value.toUpperCase().slice(0, 6)),
                  placeholder: "ROOM CODE",
                  maxLength: 6,
                  style: {
                    backgroundColor: "rgba(170,0,255,0.1)",
                    border: "1px solid #aa00ff",
                    color: "#fff",
                    outline: "none"
                  },
                  onKeyDown: e => e.stopPropagation(),
                  className: "jsx-bfd3ab80909036c6 flex-1 px-3 py-2 font-mono text-sm rounded"
                }), (0, o.jsx)("button", {
                  onClick: () => {
                    eo.init(), eo.playMenuClick(), T.length >= 4 && X()
                  },
                  disabled: T.length < 4,
                  style: {
                    backgroundColor: T.length >= 4 ? "rgba(170,0,255,0.2)" :
                      "rgba(0,0,0,0.3)",
                    border: `1px solid ${T.length>=4?h:"#444"}`,
                    color: T.length >= 4 ? h : "#555"
                  },
                  className: "jsx-bfd3ab80909036c6 px-4 py-2 font-mono text-sm font-bold rounded",
                  children: "JOIN"
                })]
              }), (0, o.jsx)("button", {
                onClick: Q,
                style: {
                  borderColor: "#666",
                  color: "#888"
                },
                className: "jsx-bfd3ab80909036c6 neon-btn w-full py-2 px-4 text-sm tracking-wider",
                children: "BACK"
              })]
            })]
          })
        }), "searching" === g && (0, o.jsx)("div", {
          className: "jsx-bfd3ab80909036c6 absolute inset-0 flex items-center justify-center pointer-events-auto",
          children: (0, o.jsxs)("div", {
            className: "jsx-bfd3ab80909036c6 text-center",
            children: [(0, o.jsxs)("div", {
              className: "jsx-bfd3ab80909036c6 relative w-32 h-32 mx-auto mb-4",
              children: [(0, o.jsx)("div", {
                style: {
                  border: `2px solid ${c}40`,
                  animation: "search-pulse 1.5s ease-out infinite"
                },
                className: "jsx-bfd3ab80909036c6 absolute inset-0 rounded-full"
              }), (0, o.jsx)("div", {
                style: {
                  border: `2px solid ${c}60`,
                  animation: "search-pulse 1.5s ease-out infinite 0.3s"
                },
                className: "jsx-bfd3ab80909036c6 absolute inset-4 rounded-full"
              }), (0, o.jsx)("div", {
                style: {
                  border: `2px solid ${c}80`,
                  animation: "search-pulse 1.5s ease-out infinite 0.6s"
                },
                className: "jsx-bfd3ab80909036c6 absolute inset-8 rounded-full"
              }), (0, o.jsx)("div", {
                className: "jsx-bfd3ab80909036c6 absolute inset-0 flex items-center justify-center",
                children: (0, o.jsx)("span", {
                  style: {
                    animation: "search-spin 2s linear infinite"
                  },
                  className: "jsx-bfd3ab80909036c6 text-3xl",
                  children: "⚔️"
                })
              })]
            }), (0, o.jsx)("div", {
              style: {
                color: c,
                textShadow: "0 0 15px #ff6600"
              },
              className: "jsx-bfd3ab80909036c6 text-xl sm:text-2xl font-bold font-mono mb-3",
              children: "FINDING OPPONENT..."
            }), b > 0 && (0, o.jsxs)("div", {
              style: {
                color: "#555"
              },
              className: "jsx-bfd3ab80909036c6 font-mono text-xs mb-2",
              children: ["Scanning: ", tb[b % tb.length]]
            }), (0, o.jsx)("div", {
              style: {
                backgroundColor: "#222"
              },
              className: "jsx-bfd3ab80909036c6 w-48 h-2 rounded-full mx-auto overflow-hidden",
              children: (0, o.jsx)("div", {
                style: {
                  width: `${b/3*100}%`,
                  backgroundColor: c,
                  boxShadow: "0 0 10px #ff6600"
                },
                className: "jsx-bfd3ab80909036c6 h-full rounded-full transition-all"
              })
            }), (0, o.jsxs)("div", {
              style: {
                color: "#666"
              },
              className: "jsx-bfd3ab80909036c6 text-xs font-mono mt-2",
              children: [b, "/3"]
            })]
          })
        }), "matched" === g && P && (0, o.jsx)("div", {
          className: "jsx-bfd3ab80909036c6 absolute inset-0 flex items-center justify-center pointer-events-auto",
          children: (0, o.jsxs)("div", {
            style: {
              backgroundColor: "rgba(5,5,20,0.95)",
              border: "2px solid #ff6600",
              boxShadow: "0 0 40px #ff660030"
            },
            className: "jsx-bfd3ab80909036c6 text-center p-6 rounded-lg mx-4 w-full max-w-sm",
            children: [(0, o.jsx)("div", {
              style: {
                color: c,
                textShadow: "0 0 10px #ff6600"
              },
              className: "jsx-bfd3ab80909036c6 text-lg font-bold font-mono mb-4",
              children: "OPPONENT FOUND!"
            }), (0, o.jsxs)("div", {
              className: "jsx-bfd3ab80909036c6 flex items-center justify-center gap-4 mb-4",
              children: [(0, o.jsxs)("div", {
                className: "jsx-bfd3ab80909036c6 flex flex-col items-center",
                children: [ei(r.avatar, n, 56), (0, o.jsx)("div", {
                  style: {
                    color: n
                  },
                  className: "jsx-bfd3ab80909036c6 font-mono font-bold text-sm mt-1.5",
                  children: r.username
                }), (0, o.jsxs)("div", {
                  style: {
                    color: m
                  },
                  className: "jsx-bfd3ab80909036c6 font-mono text-xs",
                  children: [Y.icon, " ", Y.rank]
                }), (0, o.jsxs)("div", {
                  style: {
                    color: "#888"
                  },
                  className: "jsx-bfd3ab80909036c6 font-mono text-xs",
                  children: ["ELO ", r.rankingData.elo]
                })]
              }), (0, o.jsx)("div", {
                style: {
                  color: c,
                  textShadow: "0 0 20px #ff6600"
                },
                className: "jsx-bfd3ab80909036c6 text-2xl font-bold font-mono",
                children: "VS"
              }), (0, o.jsxs)("div", {
                className: "jsx-bfd3ab80909036c6 flex flex-col items-center",
                children: [ei(P.avatar, f, 56), (0, o.jsx)("div", {
                  style: {
                    color: f
                  },
                  className: "jsx-bfd3ab80909036c6 font-mono font-bold text-sm mt-1.5",
                  children: P.name
                }), (0, o.jsxs)("div", {
                  style: {
                    color: m
                  },
                  className: "jsx-bfd3ab80909036c6 font-mono text-xs",
                  children: [P.rankIcon, " ", P.rank]
                }), (0, o.jsxs)("div", {
                  style: {
                    color: "#888"
                  },
                  className: "jsx-bfd3ab80909036c6 font-mono text-xs",
                  children: ["ELO ", P.elo]
                })]
              })]
            }), (0, o.jsx)("div", {
              style: {
                color: s,
                textShadow: "0 0 8px #00ff66"
              },
              className: "jsx-bfd3ab80909036c6 text-xs font-mono animate-pulse",
              children: "MATCH STARTING..."
            })]
          })
        }), "result" === g && w && P && (0, o.jsx)("div", {
          className: "jsx-bfd3ab80909036c6 absolute inset-0 flex items-center justify-center pointer-events-auto",
          children: (0, o.jsxs)("div", {
            className: "jsx-bfd3ab80909036c6 text-center w-full max-w-sm mx-4",
            children: [(0, o.jsxs)("div", {
              className: "jsx-bfd3ab80909036c6 flex items-center justify-center gap-4 mb-3",
              children: [(0, o.jsxs)("div", {
                className: "jsx-bfd3ab80909036c6 flex flex-col items-center",
                children: [ei(r.avatar, "win" === w ? m : "#555", "win" === w ? 64 : 44),
                  "win" === w && (0, o.jsx)("div", {
                    style: {
                      backgroundColor: "rgba(255,215,0,0.2)",
                      color: m
                    },
                    className: "jsx-bfd3ab80909036c6 font-mono text-[10px] mt-1 px-2 py-0.5 rounded",
                    children: "WINNER"
                  }), (0, o.jsx)("div", {
                    style: {
                      color: "win" === w ? n : "#666"
                    },
                    className: "jsx-bfd3ab80909036c6 font-mono font-bold text-xs mt-1",
                    children: r.username
                  })
                ]
              }), (0, o.jsxs)("div", {
                className: "jsx-bfd3ab80909036c6 flex flex-col items-center",
                children: [ei(P.avatar, "loss" === w ? m : "#555", "loss" === w ? 64 :
                  44), "loss" === w && (0, o.jsx)("div", {
                    style: {
                      backgroundColor: "rgba(255,215,0,0.2)",
                      color: m
                    },
                    className: "jsx-bfd3ab80909036c6 font-mono text-[10px] mt-1 px-2 py-0.5 rounded",
                    children: "WINNER"
                  }), (0, o.jsx)("div", {
                    style: {
                      color: "loss" === w ? f : "#666"
                    },
                    className: "jsx-bfd3ab80909036c6 font-mono font-bold text-xs mt-1",
                    children: P.name
                  })
                ]
              })]
            }), (0, o.jsx)("h1", {
              style: {
                color: "win" === w ? s : f,
                textShadow: "win" === w ? "0 0 20px #00ff66, 0 0 40px #00ff66" :
                  "0 0 20px #ff3333, 0 0 40px #ff3333"
              },
              className: "jsx-bfd3ab80909036c6 text-4xl sm:text-6xl font-bold tracking-wider mb-2",
              children: "win" === w ? "VICTORY" : "DEFEATED"
            }), (0, o.jsxs)("div", {
              style: {
                color: "win" === w ? s : f,
                backgroundColor: "win" === w ? "rgba(0,255,102,0.1)" : "rgba(255,51,51,0.1)",
                border: `1px solid ${"win"===w?s:f}30`
              },
              className: "jsx-bfd3ab80909036c6 inline-block font-mono text-sm mb-1 px-3 py-1 rounded",
              children: ["win" === w ? "+" : "", "win" === w ? 25 : "loss" === w ? -15 : 0,
                " ELO"
              ]
            }), (0, o.jsxs)("div", {
              style: {
                color: "#888"
              },
              className: "jsx-bfd3ab80909036c6 font-mono text-lg mb-1",
              children: ["ELO: ", (0, o.jsx)("span", {
                style: {
                  color: m
                },
                className: "jsx-bfd3ab80909036c6",
                children: r.rankingData.elo
              })]
            }), (0, o.jsxs)("div", {
              style: {
                color: "#555"
              },
              className: "jsx-bfd3ab80909036c6 font-mono text-xs mb-2",
              children: ["vs ", P.rankIcon, " ", P.name, " (ELO ", P.elo, ")"]
            }), Math.abs(R) > 1 && (0, o.jsx)("div", {
              style: {
                color: R > 0 ? s : f
              },
              className: "jsx-bfd3ab80909036c6 font-mono text-sm mb-3",
              children: R > 0 ? `🔥 ${R} WIN STREAK!` : `💀 ${Math.abs(R)} losses in a row`
            }), el && (0, o.jsxs)("div", {
              style: {
                color: c,
                textShadow: "0 0 8px #ff6600"
              },
              className: "jsx-bfd3ab80909036c6 font-mono text-sm mb-3",
              children: ["Waiting for ", P.name, "..."]
            }), ee && (0, o.jsxs)("div", {
              style: {
                color: f,
                textShadow: "0 0 8px #ff3333"
              },
              className: "jsx-bfd3ab80909036c6 font-mono text-sm mb-3",
              children: [P.name, " declined rematch. Finding new opponent..."]
            }), !el && !ee && (0, o.jsxs)("div", {
              className: "jsx-bfd3ab80909036c6 flex flex-col gap-2.5 items-center",
              children: [(0, o.jsx)("button", {
                onClick: () => {
                  eo.init(), eo.playMenuClick(), X()
                },
                style: {
                  border: "2px solid #00ff66",
                  color: "#00ff66",
                  textShadow: "0 0 15px #00ff66, 0 0 30px #00ff66",
                  backgroundColor: "rgba(0,255,102,0.1)",
                  boxShadow: "0 0 20px rgba(0,255,102,0.3), inset 0 0 20px rgba(0,255,102,0.05)",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                },
                className: "jsx-bfd3ab80909036c6 w-56 py-3 px-6 text-lg font-bold font-mono tracking-wider",
                children: "NEW GAME ▶"
              }), (0, o.jsxs)("div", {
                className: "jsx-bfd3ab80909036c6 flex flex-col items-center",
                children: [(0, o.jsx)("button", {
                  onClick: () => {
                    eo.init(), eo.playMenuClick(), er(!0), setTimeout(() => {
                      er(!1), .65 > Math.random() ? (et(!0), setTimeout(
                    () => {
                        et(!1), X()
                      }, 2e3)) : (y("playing"), D.current = "playing", Z())
                    }, 1500)
                  },
                  style: {
                    borderColor: c,
                    color: c,
                    textShadow: "0 0 8px #ff6600"
                  },
                  className: "jsx-bfd3ab80909036c6 neon-btn w-48 py-2 px-6 text-base font-bold font-mono tracking-wider",
                  children: "REMATCH"
                }), (0, o.jsx)("span", {
                  style: {
                    color: "#666"
                  },
                  className: "jsx-bfd3ab80909036c6 text-[10px] font-mono mt-1",
                  children: "(Same opponent — may decline)"
                })]
              }), (0, o.jsx)("button", {
                onClick: Q,
                style: {
                  borderColor: "#666",
                  color: "#888"
                },
                className: "jsx-bfd3ab80909036c6 neon-btn w-48 py-2 px-6 text-base font-bold font-mono tracking-wider",
                children: "MAIN MENU"
              })]
            })]
          })
        }), (0, o.jsx)(e9.default, {
          id: "bfd3ab80909036c6",
          children: "@keyframes search-pulse{0%{opacity:1;transform:scale(.5)}to{opacity:0;transform:scale(1.5)}}@keyframes search-spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}"
        })]
      })
    }

    function tC(e, t, o, a, l, r, n, i, c, d = !1, h = !1) {
      if (e.save(), e.translate(t, o), h && (e.globalAlpha = .5 + .3 * Math.sin(.3 * r)), e.shadowBlur = 12, e
        .shadowColor = l, e.strokeStyle = l, e.lineWidth = 2, d && (e.globalAlpha = .2, e.fillStyle = s, e
          .beginPath(), e.arc(0, -20, 25, 0, 2 * Math.PI), e.fill(), e.globalAlpha = .8, e.strokeStyle = s, e
          .lineWidth = 1.5, e.beginPath(), e.arc(0, -20, 25, 0, 2 * Math.PI), e.stroke(), e.strokeStyle = l, e
          .lineWidth = 2), e.beginPath(), e.arc(0, -38, 8, 0, 2 * Math.PI), e.stroke(), e.beginPath(), e.moveTo(0, -
          30), e.lineTo(0, -10), e.stroke(), n) e.beginPath(), e.moveTo(0, -25), e.lineTo(22 * a, -25), e.stroke(),
        e.fillStyle = "#ffffff", e.beginPath(), e.arc(25 * a, -25, 3, 0, 2 * Math.PI), e.fill();
      else {
        let t = c ? 10 * Math.sin(.3 * r) : 0;
        e.beginPath(), e.moveTo(0, -25), e.lineTo(-10, -20 + t), e.stroke(), e.beginPath(), e.moveTo(0, -25), e
          .lineTo(10, -20 - t), e.stroke()
      }
      if (c) {
        let t = 12 * Math.sin(.3 * r);
        e.beginPath(), e.moveTo(0, -10), e.lineTo(-7 + .3 * t, 0 + t), e.stroke(), e.beginPath(), e.moveTo(0, -10),
          e.lineTo(7 - .3 * t, 0 - t), e.stroke()
      } else e.beginPath(), e.moveTo(0, -10), e.lineTo(-8, 0), e.stroke(), e.beginPath(), e.moveTo(0, -10), e
        .lineTo(8, 0), e.stroke();
      e.shadowBlur = 0, e.globalAlpha = 1, e.restore()
    }

    function tS() {
      let e = (0, a.useRef)(null),
        t = (0, a.useRef)(0),
        l = (0, a.useRef)(0),
        r = (0, a.useRef)(0),
        s = (0, a.useRef)({
          titleAppear: !1,
          subtitleAppear: !1,
          tapReady: !1
        }),
        c = (0, a.useRef)([]),
        d = (0, a.useRef)([]);
      return (0, a.useEffect)(() => {
        let o = e.current;
        if (!o) return;
        let a = o.getContext("2d");
        l.current = performance.now();
        let h = () => {
          o.width = window.innerWidth, o.height = window.innerHeight
        };
        h(), window.addEventListener("resize", h);
        let f = (e, t, o, a, l) => {
            let r = [{
                x: e,
                y: t
              }],
              n = 8 + Math.floor(6 * Math.random()),
              i = (o - e) / n,
              s = (a - t) / n;
            for (let o = 1; o < n; o++) r.push({
              x: e + i * o + (Math.random() - .5) * 40,
              y: t + s * o + (Math.random() - .5) * 40
            });
            return r.push({
              x: o,
              y: a
            }), {
              points: r,
              life: 12,
              maxLife: 12,
              color: l
            }
          },
          m = (e, t, o, a, l = 3) => {
            for (let r = 0; r < o; r++) c.current.push({
              x: e,
              y: t,
              vx: (Math.random() - .5) * l,
              vy: (Math.random() - .5) * l - 1,
              life: 30 + 40 * Math.random(),
              maxLife: 70,
              color: a,
              size: 1 + 3 * Math.random()
            })
          },
          x = () => {
            t.current = requestAnimationFrame(x), r.current++;
            let e = o.width,
              h = o.height,
              p = (performance.now() - l.current) / 1e3;
            a.fillStyle = u, a.fillRect(0, 0, e, h), a.globalAlpha = .03 + .015 * Math.sin(2 * p), a
              .strokeStyle = n, a.lineWidth = 1;
            let g = .3 * r.current % 80;
            for (let t = g; t < e; t += 80) a.beginPath(), a.moveTo(t, 0), a.lineTo(t, h), a.stroke();
            for (let t = 0; t < h; t += 80) a.beginPath(), a.moveTo(0, t), a.lineTo(e, t), a.stroke();
            a.globalAlpha = 1;
            let y = Math.min(.15, .05 * p),
              b = a.createLinearGradient(0, .55 * h, e, .55 * h);
            if (b.addColorStop(0, "transparent"), b.addColorStop(.3, `rgba(0, 255, 255, ${y})`), b.addColorStop(
                .7, `rgba(0, 255, 255, ${y})`), b.addColorStop(1, "transparent"), a.fillStyle = b, a.fillRect(0,
                .54 * h, e, .04 * h), p < 1) {
              let t = 1 - Math.pow(1 - Math.min(p / .8, 1), 3),
                o = -50 + (.5 * e - -50) * t,
                l = .55 * h,
                i = r.current,
                s = Math.min(12, Math.floor(15 * t));
              for (let e = 1; e <= s; e++) {
                let t = o - 8 * e,
                  r = .4 - .03 * e;
                r <= 0 || (a.globalAlpha = r, a.strokeStyle = n, a.lineWidth = 2, a.beginPath(), a.arc(t, l -
