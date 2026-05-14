                  28 + 2 * Math.sin(.1 * i + e), 7, 0, 2 * Math.PI), a.stroke(), a.beginPath(), a.moveTo(t,
                  l - 21), a.lineTo(t, l - 5), a.stroke())
              }
              a.globalAlpha = 1, a.save(), a.shadowBlur = 15, a.shadowColor = n, a.strokeStyle = n, a
                .lineWidth = 2.5, a.beginPath(), a.arc(o, l - 38, 9, 0, 2 * Math.PI), a.stroke(), a.fillStyle =
                "#ffffff", a.beginPath(), a.arc(o + 3, l - 39, 2, 0, 2 * Math.PI), a.fill(), a.strokeStyle = n,
                a.beginPath(), a.moveTo(o, l - 29), a.lineTo(o, l - 10), a.stroke();
              let c = 12 * Math.sin(.35 * i);
              a.beginPath(), a.moveTo(o, l - 25), a.lineTo(o - 12, l - 18 + c), a.stroke(), a.beginPath(), a
                .moveTo(o, l - 25), a.lineTo(o + 12, l - 18 - c), a.stroke();
              let d = 14 * Math.sin(.35 * i);
              a.beginPath(), a.moveTo(o, l - 10), a.lineTo(o - 8 + .3 * d, l + d), a.stroke(), a.beginPath(), a
                .moveTo(o, l - 10), a.lineTo(o + 8 - .3 * d, l - d), a.stroke(), a.shadowBlur = 0, a.restore()
            }
            if (p >= 1) {
              let t = "NEON STICKMAN",
                o = Math.min(t.length, Math.floor((p - 1) / (1 / t.length) * 1.2)),
                l = t.slice(0, o);
              !s.current.titleAppear && o > 0 && (s.current.titleAppear = !0, eo.init(), eo
              .playDramaticMoment());
              let r = .32 * h,
                i = Math.min(.08 * e, 56);
              if (a.save(), a.font = `bold ${i}px monospace`, a.textAlign = "center", a.textBaseline = "middle",
                a.shadowBlur = 30, a.shadowColor = n, a.fillStyle = n, a.fillText(l, e / 2, r), a.shadowBlur =
                10, a.shadowColor = "#00ffff", a.fillText(l, e / 2, r), a.shadowBlur = 0, a.fillStyle =
                "#ffffff", a.globalAlpha = .7, a.fillText(l, e / 2, r), a.globalAlpha = 1, a.restore(), p >=
                1.3 && .06 > Math.random()) {
                let o = Math.random() > .5 ? 1 : -1,
                  l = a.measureText ? t.length * i * .6 : .5 * e,
                  s = e / 2 + o * (.4 * l + 60 * Math.random());
                d.current.push(f(s, r - .6 * i, s + (Math.random() - .5) * 80, r + .6 * i, n))
              }
            }
            if (p >= 2) {
              let t = "STICK WAR",
                o = Math.min((p - 2) / .6, 1),
                l = 1 - Math.pow(1 - o, 3),
                r = .42 * h + (1 - l) * 40,
                n = Math.min(.06 * e, 40);
              !s.current.subtitleAppear && o > 0 && (s.current.subtitleAppear = !0, eo.init(), eo
                  .playReinforcement()), a.save(), a.globalAlpha = l, a.font = `bold ${n}px monospace`, a
                .textAlign = "center", a.textBaseline = "middle", a.shadowBlur = 25, a.shadowColor = i, a
                .fillStyle = i, a.fillText(t, e / 2, r), a.shadowBlur = 8, a.shadowColor = "#ff00ff", a
                .fillText(t, e / 2, r), a.shadowBlur = 0, a.fillStyle = "#ffffff", a.globalAlpha = .6 * l, a
                .fillText(t, e / 2, r), a.globalAlpha = 1, a.restore()
            }
            if (p >= 1) {
              let t = .5 * e,
                o = .55 * h,
                l = r.current;
              a.save(), a.shadowBlur = 15, a.shadowColor = n, a.strokeStyle = n, a.lineWidth = 2.5;
              let i = 2 * Math.sin(.08 * l),
                s = Math.sin(.02 * l) > 0 ? 1 : -1;
              a.beginPath(), a.arc(t + 2 * s, o - 38 + i, 9, 0, 2 * Math.PI), a.stroke(), a.fillStyle =
                "#ffffff", a.beginPath(), a.arc(t + 5 * s, o - 39 + i, 2, 0, 2 * Math.PI), a.fill(), a
                .strokeStyle = n, a.beginPath(), a.moveTo(t + +s, o - 29 + i), a.lineTo(t - 2 * s, o - 10 + i),
                a.stroke();
              let c = 3 * Math.sin(.06 * l);
              a.beginPath(), a.moveTo(t, o - 25 + i), a.lineTo(t - 14, o - 30 + i + c), a.stroke(), a
                .beginPath(), a.moveTo(t, o - 25 + i), a.lineTo(t + 12, o - 20 + i - c), a.stroke(), a
                .fillStyle = n, a.beginPath(), a.arc(t + 12, o - 20 + i - c, 3, 0, 2 * Math.PI), a.fill(), a
                .strokeStyle = n;
              let d = 1.5 * Math.sin(.1 * l);
              a.beginPath(), a.moveTo(t - 2 * s, o - 10 + i), a.lineTo(t - 12, o + d + i), a.stroke(), a
                .beginPath(), a.moveTo(t - 2 * s, o - 10 + i), a.lineTo(t + 12, o - d + i), a.stroke(), a
                .shadowBlur = 0, a.restore(), p - 1 > .5 && .08 > Math.random() && m(t + (Math.random() - .5) *
                  30, o - 20, 1, n, 1)
            }
            p >= 1.2 && .12 > Math.random() && m(.3 * e + Math.random() * e * .4, .25 * h + Math.random() * h *
              .2, 1, [n, i, "#00ff88", "#8844ff"][Math.floor(4 * Math.random())], .8);
            let v = [];
            for (let e of c.current)
              if (e.x += e.vx, e.y += e.vy, e.vy += .02, e.life--, e.life > 0) {
                let t = e.life / e.maxLife;
                a.globalAlpha = .6 * t, a.fillStyle = e.color, a.beginPath(), a.arc(e.x, e.y, e.size * t, 0, 2 *
                  Math.PI), a.fill(), v.push(e)
              } c.current = v, a.globalAlpha = 1;
            let w = [];
            for (let e of d.current)
              if (e.life--, e.life > 0) {
                let t = e.life / e.maxLife;
                a.globalAlpha = .8 * t, a.strokeStyle = e.color, a.lineWidth = 2, a.shadowBlur = 15, a
                  .shadowColor = e.color, a.beginPath(), a.moveTo(e.points[0].x, e.points[0].y);
                for (let t = 1; t < e.points.length; t++) a.lineTo(e.points[t].x, e.points[t].y);
                a.stroke(), a.lineWidth = 1, a.strokeStyle = "#ffffff", a.globalAlpha = .5 * t, a.beginPath(), a
                  .moveTo(e.points[0].x, e.points[0].y);
                for (let t = 1; t < e.points.length; t++) a.lineTo(e.points[t].x, e.points[t].y);
                a.stroke(), a.shadowBlur = 0, w.push(e)
              } if (d.current = w, a.globalAlpha = 1, p >= 3 && p < 4.5) {
              let t = Math.min((p - 3) / 1.2, 1),
                o = Math.min(.6 * e, 400),
                l = (e - o) / 2,
                r = .62 * h;
              a.fillStyle = "#ffffff10", a.fillRect(l, r, o, 8);
              let i = a.createLinearGradient(l, r, l + o * t, r);
              i.addColorStop(0, n), i.addColorStop(1, "#00aaff"), a.fillStyle = i, a.shadowBlur = 10, a
                .shadowColor = n, a.fillRect(l, r, o * t, 8), a.shadowBlur = 0;
              let s = ".".repeat(Math.floor(3 * p) % 4);
              a.font = "14px monospace", a.textAlign = "center", a.fillStyle = "#00ffff88", a.fillText(
                `LOADING${s}`, e / 2, r + 28), a.fillStyle = n, a.font = "bold 14px monospace", a.fillText(
                `${Math.floor(100*t)}%`, e / 2, r - 10)
            }
            if (p >= 4.5) {
              let t = .6 + .35 * Math.sin(4 * p),
                o = Math.min(.05 * e, 28);
              a.save();
              let l = "TAP TO START";
              a.font = `bold ${o}px monospace`, a.textAlign = "center", a.textBaseline = "middle";
              let r = a.measureText(l).width,
                c = .72 * h,
                u = (e - r) / 2 - 16,
                m = c - o / 2 - 8,
                x = r + 32,
                g = o + 16;
              a.globalAlpha = .12 * t, a.fillStyle = n, a.beginPath();
              let y = g / 2;
              if (a.moveTo(u + y, m), a.lineTo(u + x - y, m), a.quadraticCurveTo(u + x, m, u + x, m + y), a
                .lineTo(u + x, m + g - y), a.quadraticCurveTo(u + x, m + g, u + x - y, m + g), a.lineTo(u + y,
                  m + g), a.quadraticCurveTo(u, m + g, u, m + g - y), a.lineTo(u, m + y), a.quadraticCurveTo(u,
                  m, u + y, m), a.closePath(), a.fill(), a.globalAlpha = .3 * t, a.strokeStyle = n, a
                .lineWidth = 1.5, a.stroke(), a.globalAlpha = t, a.shadowBlur = 20, a.shadowColor = n, a
                .fillStyle = "#ffffff", a.fillText(l, e / 2, c), a.shadowBlur = 0, a.restore(), s.current
                .tapReady || (s.current.tapReady = !0, eo.init(), eo.playAbilityReady()), .03 > Math.random()) {
                let t = Math.random() > .5 ? 1 : -1;
                d.current.push(f(e / 2 + .3 * e * t, .15 * h, e / 2 + .25 * e * t + (Math.random() - .5) * 100,
                  .5 * h, t > 0 ? n : i))
              }
            }
            if (p >= 1) {
              a.globalAlpha = .1 + .05 * Math.sin(3 * p), a.fillStyle = n;
              for (let t = 0; t < 6; t++) {
                let o = 20 + 15 * t;
                a.beginPath(), a.arc(o, 20, 2, 0, 2 * Math.PI), a.fill(), a.beginPath(), a.arc(e - o, h - 20, 2,
                  0, 2 * Math.PI), a.fill()
              }
              a.fillStyle = i;
              for (let t = 0; t < 6; t++) {
                let o = 25 + 15 * t;
                a.beginPath(), a.arc(o, h - 25, 2, 0, 2 * Math.PI), a.fill(), a.beginPath(), a.arc(e - o, 20, 2,
                  0, 2 * Math.PI), a.fill()
              }
              a.globalAlpha = 1
            }
            p >= 2 && (a.globalAlpha = .2, a.font = "10px monospace", a.textAlign = "right", a.fillStyle = n, a
              .fillText("v1.0", e - 15, h - 15), a.globalAlpha = 1)
          };
        return x(), () => {
          cancelAnimationFrame(t.current), window.removeEventListener("resize", h)
        }
      }, []), (0, o.jsx)("div", {
        className: "absolute inset-0 z-50 flex flex-col items-center justify-center cursor-pointer",
        style: {
          backgroundColor: u,
          touchAction: "manipulation"
        },
        onClick: () => {
          let e = new CustomEvent("splash-end");
          window.dispatchEvent(e)
        },
        onTouchEnd: e => {
          e.preventDefault();
          let t = new CustomEvent("splash-end");
          window.dispatchEvent(t)
        },
        children: (0, o.jsx)("canvas", {
          ref: e,
          className: "absolute inset-0 w-full h-full",
          style: {
            touchAction: "none"
          }
        })
      })
    }
    let tT = ["⚔️", "🗡️", "🔥", "⚡", "💀", "👑", "🎮", "🕹️", "🌟", "💎", "🦊", "🐺", "🐉", "🔮", "🎯", "🛡️"],
      tM = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Japan", "South Korea",
        "Brazil", "India", "Mexico", "Russia", "China", "Italy", "Spain", "Netherlands", "Sweden", "Poland",
        "Turkey", "Other"
      ];

    function tj(e) {
      return e.startsWith("data:")
    }

    function tN() {
      let e = ea(e => e.saveData),
        t = ea(e => e.updateProfile),
        l = ea(e => e.setGamePhase);
      ea(e => e.loadGame);
      let r = ea(e => e.loadCloudSave),
        [i, d] = (0, a.useState)(e.username),
        [f, u] = (0, a.useState)(e.avatar),
        [x, p] = (0, a.useState)(e.about),
        [g, y] = (0, a.useState)(e.nationality),
        [b, v] = (0, a.useState)(!1),
        [w, k] = (0, a.useState)({
          user: null,
          loading: !0,
          error: null,
          isAnonymous: !1
        }),
        [C, S] = (0, a.useState)("idle"),
        [T, M] = (0, a.useState)(!1),
        j = (0, a.useRef)(null);
      (0, a.useEffect)(() => es(e => {
        k(e)
      }), []);
      let N = O(e.rankingData.elo),
        P = ex(),
        A = W.reduce((t, o, a) => e.rankingData.elo >= o.min ? a : t, 0),
        R = A < W.length - 1 ? W[A + 1] : null,
        I = R ? Math.round((e.rankingData.elo - W[A].min) / (R.min - W[A].min) * 100) : 100,
        E = (0, a.useCallback)(e => {
          e.stopPropagation()
        }, []),
        L = (0, a.useCallback)(async () => {
          eo.init(), eo.playMenuClick();
          let o = await eh();
          o && "NeonWarrior" === e.username && (t({
            username: `Player${o.uid.slice(0,6)}`
          }), d(`Player${o.uid.slice(0,6)}`))
        }, [e.username, t]),
        D = (0, a.useCallback)(async () => {
          eo.init(), eo.playMenuClick();
          let e = await ef();
          e && e.displayName && (t({
            username: e.displayName.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 15) || "NeonWarrior"
          }), d(e.displayName.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 15) || "NeonWarrior"))
        }, [t]),
        B = (0, a.useCallback)(async () => {
          eo.init(), eo.playMenuClick(), await em()
        }, []),
        G = (0, a.useCallback)(async () => {
          if (!w.user) return;
          S("uploading"), eo.init(), eo.playMenuClick();
          let t = await (0, ep.uploadSaveToCloud)(e);
          S(t ? "done" : "error"), t ? setTimeout(() => S("idle"), 2e3) : setTimeout(() => S("idle"), 3e3)
        }, [w.user, e]),
        $ = (0, a.useCallback)(async () => {
          if (!w.user) return;
          S("downloading"), eo.init(), eo.playMenuClick();
          let e = await (0, ep.downloadSaveFromCloud)();
          e ? (r(e), S("done")) : S("error"), setTimeout(() => S("idle"), 2e3)
        }, [w.user, r]),
        F = (0, a.useCallback)(async e => {
          let t = e.target.files?.[0];
          if (t && t.type.startsWith("image/")) {
            M(!0);
            try {
              let e = await new Promise((e, o) => {
                let a = new FileReader;
                a.onload = t => {
                  let a = new Image;
                  a.onload = () => {
                    let t = document.createElement("canvas"),
                      {
                        width: l,
                        height: r
                      } = a;
                    if (l > 100 || r > 100) {
                      let e = Math.min(100 / l, 100 / r);
                      l = Math.round(l * e), r = Math.round(r * e)
                    }
                    t.width = l, t.height = r;
                    let n = t.getContext("2d");
                    if (!n) return void o(Error("Canvas not supported"));
                    n.drawImage(a, 0, 0, l, r);
                    let i = .7,
                      s = t.toDataURL("image/jpeg", i);
                    for (; s.length > 28057.600000000002 && i > .1;) i -= .1, s = t.toDataURL(
                      "image/jpeg", i);
                    e(s)
                  }, a.onerror = () => o(Error("Failed to load image")), a.src = t.target?.result
                }, a.onerror = () => o(Error("Failed to read file")), a.readAsDataURL(t)
              });
              u(e), eo.init(), eo.playMenuClick()
            } catch (e) {
              console.error("Failed to process image:", e)
            } finally {
              M(!1), j.current && (j.current.value = "")
            }
          }
        }, []),
        H = e.rankingData.wins + e.rankingData.losses > 0 ? Math.round(e.rankingData.wins / (e.rankingData.wins + e
          .rankingData.losses) * 100) : 0,
        U = (e = 36) => tj(f) ? (0, o.jsx)("img", {
          src: f,
          alt: "Profile",
          className: "rounded-full object-cover",
          style: {
            width: e,
            height: e
          }
        }) : (0, o.jsx)("span", {
          style: {
            fontSize: .5 * e
          },
          children: f
        });
      return (0, o.jsx)("div", {
        className: "absolute inset-0 z-20 flex items-center justify-center pointer-events-none",
        children: (0, o.jsxs)("div", {
          className: "w-full max-w-md p-4 rounded-lg mx-4 pointer-events-auto max-h-[90vh] overflow-y-auto",
          style: {
            backgroundColor: "rgba(5,5,20,0.95)",
            border: "2px solid #aa00ff",
            boxShadow: "0 0 30px #aa00ff20",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none"
          },
          onKeyDown: e => e.stopPropagation(),
          children: [(0, o.jsx)("h2", {
            className: "text-xl font-bold text-center tracking-wider mb-3 font-mono",
            style: {
              color: h,
              textShadow: "0 0 10px #aa00ff"
            },
            children: "PROFILE"
          }), (0, o.jsxs)("div", {
            className: "flex items-center gap-3 mb-3 p-3 rounded-lg",
            style: {
              backgroundColor: "rgba(0,0,0,0.3)",
              border: "1px solid #333"
            },
            children: [(0, o.jsx)("div", {
              className: "relative",
              children: (0, o.jsx)("div", {
                className: "rounded-full flex items-center justify-center overflow-hidden",
                style: {
                  width: 64,
                  height: 64,
                  backgroundColor: "rgba(0,255,255,0.1)",
                  border: "2px solid #00ffff40",
                  boxShadow: "0 0 12px #aa00ff40"
                },
                children: U(64)
              })
            }), (0, o.jsxs)("div", {
              className: "flex-1 min-w-0",
              children: [(0, o.jsxs)("div", {
                className: "flex items-center gap-2",
                children: [(0, o.jsx)("span", {
                  className: "text-xl",
                  children: N.icon
                }), (0, o.jsx)("span", {
                  className: "font-mono font-bold text-sm",
                  style: {
                    color: m,
                    textShadow: "0 0 5px #ffd700"
                  },
                  children: N.rank
                })]
              }), (0, o.jsxs)("div", {
                className: "font-mono text-xs mt-0.5",
                style: {
                  color: "#888"
                },
                children: ["ELO: ", (0, o.jsx)("span", {
                  style: {
                    color: n
                  },
                  children: e.rankingData.elo
                }), R && (0, o.jsxs)(o.Fragment, {
                  children: [" ", "→ ", (0, o.jsx)("span", {
                    style: {
                      color: m
                    },
                    children: R.rank
                  }), (0, o.jsx)("div", {
                    className: "w-full h-1.5 rounded-full mt-1",
                    style: {
                      backgroundColor: "rgba(255,255,255,0.1)"
                    },
                    children: (0, o.jsx)("div", {
                      className: "h-full rounded-full transition-all duration-500",
                      style: {
                        width: `${I}%`,
                        backgroundColor: m,
                        boxShadow: "0 0 4px #ffd700"
                      }
                    })
                  })]
                })]
              }), (0, o.jsxs)("div", {
                className: "font-mono text-[10px] mt-1",
                style: {
                  color: "#666"
                },
                children: ["W/R: ", H, "% | ", e.rankingData.wins, "W ", e.rankingData
                  .losses, "L"
                ]
              })]
            })]
          }), (0, o.jsxs)("div", {
            className: "mb-3 p-2.5 rounded",
            style: {
              backgroundColor: "rgba(0,0,0,0.3)",
              border: "1px solid #222"
            },
            children: [(0, o.jsxs)("div", {
              className: "flex items-center justify-between mb-1",
              children: [(0, o.jsx)("span", {
                className: "font-mono text-[10px]",
                style: {
                  color: "#888"
                },
                children: "LEVEL PROGRESS"
              }), (0, o.jsxs)("span", {
                className: "font-mono text-xs font-bold",
                style: {
                  color: n
                },
                children: ["Zone ", e.highestLevel]
              })]
            }), (0, o.jsx)("div", {
              className: "w-full h-2 rounded-full",
              style: {
                backgroundColor: "rgba(0,255,255,0.1)"
              },
              children: (0, o.jsx)("div", {
                className: "h-full rounded-full transition-all duration-500",
                style: {
                  width: `${Math.min(e.highestLevel/100*100,100)}%`,
                  backgroundColor: n,
                  boxShadow: "0 0 6px #00ffff"
                }
              })
            }), (0, o.jsxs)("div", {
              className: "flex justify-between mt-1",
              children: [(0, o.jsx)("span", {
                className: "font-mono text-[9px]",
                style: {
                  color: "#555"
                },
                children: "Zone 1"
              }), (0, o.jsx)("span", {
                className: "font-mono text-[9px]",
                style: {
                  color: "#555"
                },
                children: "Zone 100+"
              })]
            })]
          }), (0, o.jsxs)("div", {
            className: "grid grid-cols-4 gap-1.5 mb-3",
            children: [(0, o.jsxs)("div", {
              className: "text-center p-1.5 rounded",
              style: {
                backgroundColor: "rgba(0,0,0,0.2)",
                border: "1px solid #222"
              },
              children: [(0, o.jsx)("div", {
                className: "font-mono text-[9px]",
                style: {
                  color: "#888"
                },
                children: "Level"
              }), (0, o.jsx)("div", {
                className: "font-mono text-xs font-bold",
                style: {
                  color: n
                },
                children: e.highestLevel
              })]
            }), (0, o.jsxs)("div", {
              className: "text-center p-1.5 rounded",
              style: {
                backgroundColor: "rgba(0,0,0,0.2)",
                border: "1px solid #222"
              },
              children: [(0, o.jsx)("div", {
                className: "font-mono text-[9px]",
                style: {
                  color: "#888"
                },
                children: "Kills"
              }), (0, o.jsx)("div", {
                className: "font-mono text-xs font-bold",
                style: {
                  color: c
                },
                children: e.totalKills
              })]
            }), (0, o.jsxs)("div", {
              className: "text-center p-1.5 rounded",
              style: {
                backgroundColor: "rgba(0,0,0,0.2)",
                border: "1px solid #222"
              },
              children: [(0, o.jsx)("div", {
                className: "font-mono text-[9px]",
                style: {
                  color: "#888"
                },
                children: "Coins"
              }), (0, o.jsx)("div", {
                className: "font-mono text-xs font-bold",
                style: {
                  color: m
                },
                children: e.totalCoins
              })]
            }), (0, o.jsxs)("div", {
              className: "text-center p-1.5 rounded",
              style: {
                backgroundColor: "rgba(0,0,0,0.2)",
                border: "1px solid #222"
              },
              children: [(0, o.jsx)("div", {
                className: "font-mono text-[9px]",
                style: {
                  color: "#888"
                },
                children: "Skills"
              }), (0, o.jsx)("div", {
                className: "font-mono text-xs font-bold",
                style: {
                  color: h
                },
                children: e.unlockedSkills.length
              })]
            })]
          }), (0, o.jsxs)("div", {
            className: "mb-3 p-3 rounded-lg",
            style: {
              backgroundColor: "rgba(0,0,0,0.3)",
              border: "1px solid #333"
            },
            children: [(0, o.jsx)("div", {
              className: "text-xs font-mono font-bold mb-2",
              style: {
                color: n
              },
              children: "CLOUD SAVE"
            }), w.loading ? (0, o.jsx)("div", {
              className: "text-xs font-mono text-center py-2",
              style: {
                color: "#888"
              },
              children: "Connecting..."
            }) : w.user ? (0, o.jsxs)("div", {
              className: "space-y-2",
              children: [(0, o.jsxs)("div", {
                className: "flex items-center gap-2",
                children: [(0, o.jsx)("div", {
                  className: "w-8 h-8 rounded-full flex items-center justify-center overflow-hidden",
                  style: {
                    backgroundColor: "rgba(0,255,255,0.1)",
                    border: "1px solid #00ffff40"
                  },
                  children: P?.photoURL ? (0, o.jsx)("img", {
                    src: P.photoURL,
                    alt: "avatar",
                    className: "w-8 h-8 rounded-full object-cover"
                  }) : U(32)
                }), (0, o.jsxs)("div", {
                  className: "flex-1 min-w-0",
                  children: [(0, o.jsxs)("div", {
                    className: "flex items-center gap-1.5",
                    children: [(0, o.jsx)("div", {
                      className: "w-2 h-2 rounded-full",
                      style: {
                        backgroundColor: w.isAnonymous ? c : s,
                        boxShadow: `0 0 4px ${w.isAnonymous?c:s}`
                      }
                    }), (0, o.jsx)("span", {
                      className: "font-mono text-xs font-bold truncate",
                      style: {
                        color: w.isAnonymous ? c : s
                      },
                      children: w.isAnonymous ? "Guest" : P
                        ?.displayName || "Signed In"
                    })]
                  }), P?.email && (0, o.jsx)("div", {
                    className: "font-mono text-[10px] truncate",
                    style: {
                      color: "#666"
                    },
                    children: P.email
                  })]
                })]
              }), (0, o.jsxs)("div", {
                className: "flex gap-2",
                children: [(0, o.jsx)("button", {
                  onClick: G,
                  disabled: "uploading" === C,
                  className: "flex-1 py-1.5 px-2 text-[10px] font-mono font-bold rounded",
                  style: {
                    backgroundColor: "done" === C ? "rgba(0,255,102,0.15)" :
                      "rgba(0,255,255,0.08)",
                    border: `1px solid ${"done"===C?s:"error"===C?"#ff3333":n}`,
                    color: "done" === C ? s : "error" === C ? "#ff3333" : n,
                    opacity: "uploading" === C ? .5 : 1
                  },
                  children: "uploading" === C ? "⬆ SYNCING..." : "done" === C ?
                    "✓ UPLOADED" : "error" === C ? "✗ FAILED" : "⬆ UPLOAD"
                }), (0, o.jsx)("button", {
                  onClick: $,
                  disabled: "downloading" === C,
                  className: "flex-1 py-1.5 px-2 text-[10px] font-mono font-bold rounded",
                  style: {
                    backgroundColor: "rgba(255,102,0,0.08)",
                    border: `1px solid ${"error"===C?"#ff3333":c}`,
                    color: "error" === C ? "#ff3333" : c,
                    opacity: "downloading" === C ? .5 : 1
                  },
                  children: "downloading" === C ? "⬇ LOADING..." : "⬇ DOWNLOAD"
                })]
              }), w.isAnonymous && (0, o.jsxs)("button", {
                onClick: D,
                className: "w-full py-1.5 px-2 text-[10px] font-mono font-bold rounded flex items-center justify-center gap-1.5",
                style: {
                  backgroundColor: "rgba(255,215,0,0.08)",
                  border: "1px solid #ffd70060",
                  color: m
                },
                children: [(0, o.jsxs)("svg", {
                  width: "14",
                  height: "14",
                  viewBox: "0 0 24 24",
                  style: {
                    flexShrink: 0
                  },
                  children: [(0, o.jsx)("path", {
                    fill: "#4285F4",
                    d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  }), (0, o.jsx)("path", {
                    fill: "#34A853",
                    d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  }), (0, o.jsx)("path", {
                    fill: "#FBBC05",
                    d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  }), (0, o.jsx)("path", {
                    fill: "#EA4335",
                    d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  })]
                }), "LINK GOOGLE ACCOUNT"]
              }), (0, o.jsx)("button", {
                onClick: B,
                className: "w-full py-1 px-2 text-[9px] font-mono rounded",
                style: {
                  border: "1px solid #444",
                  color: "#666"
                },
                children: "SIGN OUT"
              })]
            }) : (0, o.jsxs)("div", {
              className: "space-y-2",
              children: [(0, o.jsx)("div", {
                className: "text-[10px] font-mono mb-2",
                style: {
                  color: "#888"
                },
                children: "Sign in to save your progress to the cloud"
              }), (0, o.jsx)("button", {
                onClick: L,
                className: "w-full py-2 px-3 text-xs font-mono font-bold rounded",
                style: {
                  backgroundColor: "rgba(0,255,255,0.08)",
                  border: "1px solid #00ffff60",
                  color: n
                },
                children: "PLAY AS GUEST"
              }), (0, o.jsxs)("button", {
                onClick: D,
                className: "w-full py-2 px-3 text-xs font-mono font-bold rounded flex items-center justify-center gap-2",
                style: {
                  backgroundColor: "rgba(255,215,0,0.08)",
                  border: "1px solid #ffd70060",
                  color: m
                },
                children: [(0, o.jsxs)("svg", {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  style: {
                    flexShrink: 0
                  },
                  children: [(0, o.jsx)("path", {
                    fill: "#4285F4",
                    d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  }), (0, o.jsx)("path", {
                    fill: "#34A853",
                    d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  }), (0, o.jsx)("path", {
                    fill: "#FBBC05",
                    d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  }), (0, o.jsx)("path", {
                    fill: "#EA4335",
                    d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  })]
                }), "SIGN IN WITH GOOGLE"]
              })]
            })]
          }), (0, o.jsxs)("div", {
            className: "mb-3",
            children: [(0, o.jsx)("label", {
              className: "text-xs font-mono mb-1.5 block",
              style: {
                color: "#888"
              },
              children: "AVATAR"
            }), (0, o.jsxs)("div", {
              className: "flex items-center gap-2 mb-2",
              children: [(0, o.jsx)("div", {
                className: "rounded-full flex items-center justify-center overflow-hidden",
                style: {
                  width: 48,
                  height: 48,
                  backgroundColor: "rgba(170,0,255,0.15)",
                  border: "2px solid #aa00ff",
                  boxShadow: "0 0 10px #aa00ff40"
                },
                children: U(48)
              }), (0, o.jsxs)("div", {
                className: "flex-1 flex gap-2",
                children: [(0, o.jsx)("button", {
                  onClick: () => j.current?.click(),
                  disabled: T,
                  className: "flex-1 py-1.5 px-2 text-[10px] font-mono font-bold rounded",
                  style: {
                    backgroundColor: "rgba(170,0,255,0.08)",
                    border: "1px solid #aa00ff60",
                    color: h,
                    opacity: T ? .5 : 1
                  },
                  children: T ? "⏳ PROCESSING..." : "📷 UPLOAD IMAGE"
                }), tj(f) && (0, o.jsx)("button", {
                  onClick: () => {
                    u("⚔️"), eo.init(), eo.playMenuClick()
                  },
                  className: "py-1.5 px-2 text-[10px] font-mono font-bold rounded",
                  style: {
                    backgroundColor: "rgba(255,51,51,0.08)",
                    border: "1px solid #ff333360",
                    color: "#ff3333"
                  },
                  children: "✕ REMOVE"
                })]
              }), (0, o.jsx)("input", {
                ref: j,
                type: "file",
                accept: "image/*",
                onChange: F,
                className: "hidden"
              })]
            }), (0, o.jsx)("div", {
              className: "flex flex-wrap gap-1.5",
              children: tT.map(e => (0, o.jsx)("button", {
                onClick: () => {
                  u(e), eo.init(), eo.playMenuClick()
                },
                className: "w-8 h-8 text-base rounded flex items-center justify-center transition-all",
                style: {
                  backgroundColor: f !== e || tj(f) ? "rgba(0,0,0,0.3)" :
                    "rgba(170,0,255,0.2)",
                  border: f !== e || tj(f) ? "1px solid #333" : "2px solid #aa00ff",
                  boxShadow: f !== e || tj(f) ? "none" : "0 0 8px #aa00ff"
                },
                children: e
              }, e))
            })]
          }), (0, o.jsxs)("div", {
            className: "mb-3",
            children: [(0, o.jsx)("label", {
              className: "text-xs font-mono mb-1 block",
              style: {
                color: "#888"
              },
              children: "USERNAME"
            }), (0, o.jsx)("input", {
              type: "text",
              value: i,
              onChange: e => d(e.target.value.slice(0, 15)),
              onKeyDown: E,
              className: "w-full px-3 py-2 rounded font-mono text-sm",
              style: {
                backgroundColor: "rgba(0,0,0,0.4)",
                border: "1px solid #444",
                color: n,
                outline: "none"
              },
              maxLength: 15
            }), (0, o.jsxs)("span", {
              className: "text-[10px] font-mono",
              style: {
                color: "#555"
              },
              children: [i.length, "/15"]
            })]
          }), (0, o.jsxs)("div", {
            className: "mb-3",
            children: [(0, o.jsx)("label", {
              className: "text-xs font-mono mb-1 block",
              style: {
                color: "#888"
              },
              children: "ABOUT"
            }), (0, o.jsx)("input", {
              type: "text",
              value: x,
              onChange: e => p(e.target.value.slice(0, 50)),
              onKeyDown: E,
              className: "w-full px-3 py-2 rounded font-mono text-sm",
              style: {
                backgroundColor: "rgba(0,0,0,0.4)",
                border: "1px solid #444",
                color: "#ddd",
                outline: "none"
              },
              maxLength: 50,
              placeholder: "Tell us about yourself..."
            }), (0, o.jsxs)("span", {
              className: "text-[10px] font-mono",
              style: {
                color: "#555"
              },
              children: [x.length, "/50"]
            })]
          }), (0, o.jsxs)("div", {
            className: "mb-3",
            children: [(0, o.jsx)("label", {
              className: "text-xs font-mono mb-1 block",
              style: {
                color: "#888"
              },
              children: "NATIONALITY"
            }), (0, o.jsxs)("select", {
              value: g,
              onChange: e => y(e.target.value),
              className: "w-full px-3 py-2 rounded font-mono text-sm",
              style: {
                backgroundColor: "rgba(0,0,0,0.4)",
                border: "1px solid #444",
                color: "#ddd",
                outline: "none"
              },
              children: [(0, o.jsx)("option", {
                value: "",
                children: "Select..."
              }), tM.map(e => (0, o.jsx)("option", {
                value: e,
                children: e
              }, e))]
            })]
          }), (0, o.jsx)("button", {
            onClick: () => {
              eo.init(), eo.playMenuClick(), t({
                username: i.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 15) || "NeonWarrior",
                avatar: f,
                about: x.slice(0, 50),
                nationality: g
              }), v(!0), setTimeout(() => v(!1), 2e3)
            },
            className: "neon-btn w-full py-2.5 px-6 text-base font-bold font-mono tracking-wider mb-2",
            style: {
              borderColor: b ? s : h,
              color: b ? s : h,
              textShadow: b ? "0 0 10px #00ff66" : "0 0 10px #aa00ff"
            },
            children: b ? "✓ SAVED!" : "SAVE"
          }), (0, o.jsx)("button", {
            onClick: () => {
              eo.init(), eo.playMenuClick(), l("menu")
            },
            className: "neon-btn w-full py-2 px-4 text-sm tracking-wider",
            style: {
              borderColor: "#666",
              color: "#888"
            },
            children: "BACK"
          })]
        })
      })
    }
    let tP = ["NeonBlade99", "PixelStorm", "VoidRunner", "CyberWolf", "GridMaster", "DarkFlare", "CrimsonX",
      "GhostHack", "StormPilot", "ZeroGravity", "NightShade", "IronPulse", "FrostByte", "ThunderCore",
      "ShadowRift", "BlazeFury", "OmegaZ", "NovaStar", "RogueAgent", "ApexHunter"
    ];

    function tA() {
      let e = ea(e => e.saveData),
        t = ea(e => e.setGamePhase),
        l = (0, a.useMemo)(() => (function(e, t) {
          let o, a = (o = 439939, () => (o = (9301 * o + 49297) % 233280) / 233280),
            l = [];
          for (let e = 0; e < 19; e++) {
            let t = 800 + Math.floor(1200 * a());
            l.push({
              name: tP[e],
              elo: t,
              wins: Math.floor(100 * a()) + 5,
              losses: Math.floor(60 * a()) + 2,
              isPlayer: !1
            })
          }
          return l.push({
            name: t,
            elo: e,
            wins: 0,
            losses: 0,
            isPlayer: !0
          }), l.sort((e, t) => t.elo - e.elo), l
        })(e.rankingData.elo, e.username), [e.rankingData.elo, e.username]);
      return (0, o.jsx)("div", {
        className: "absolute inset-0 z-20 flex items-center justify-center pointer-events-none",
        children: (0, o.jsxs)("div", {
          className: "w-full max-w-md p-6 rounded-lg mx-4 pointer-events-auto max-h-[90vh] overflow-y-auto",
          style: {
            backgroundColor: "rgba(5,5,20,0.95)",
            border: "2px solid #ffd700",
            boxShadow: "0 0 30px #ffd70020"
          },
          children: [(0, o.jsx)("h2", {
            className: "text-2xl font-bold text-center tracking-wider mb-4 font-mono",
            style: {
              color: m,
              textShadow: "0 0 10px #ffd700"
            },
            children: "🏆 LEADERBOARD"
          }), (0, o.jsx)("div", {
            className: "flex flex-col gap-1.5",
            children: l.map((t, a) => {
              let l = O(t.elo);
              return (0, o.jsxs)("div", {
                className: "flex items-center gap-2 p-2 rounded",
                style: {
                  backgroundColor: t.isPlayer ? "rgba(255,215,0,0.1)" : "rgba(0,0,0,0.2)",
                  border: t.isPlayer ? "1px solid #ffd70060" : "1px solid #222"
                },
                children: [(0, o.jsx)("span", {
                  className: "font-bold font-mono text-sm w-8 text-center",
                  style: {
                    color: a < 3 ? m : "#666"
                  },
                  children: a + 1
                }), (0, o.jsx)("span", {
                  className: "text-lg",
                  children: l.icon
                }), (0, o.jsx)("span", {
                  className: "flex-1 font-mono text-sm truncate",
                  style: {
                    color: t.isPlayer ? m : n
                  },
                  children: t.name
                }), (0, o.jsx)("span", {
                  className: "font-mono text-xs",
                  style: {
                    color: c
                  },
                  children: t.elo
                }), (0, o.jsx)("span", {
                  className: "font-mono text-[10px]",
                  style: {
                    color: "#555"
                  },
                  children: t.isPlayer ?
                    `${e.rankingData.wins}W ${e.rankingData.losses}L` : `${t.wins}W`
                })]
              }, t.name)
            })
          }), (0, o.jsx)("button", {
            onClick: () => {
              eo.init(), eo.playMenuClick(), t("menu")
            },
            className: "neon-btn w-full py-2 px-4 text-sm tracking-wider mt-4",
            style: {
              borderColor: "#666",
              color: "#888"
            },
            children: "BACK"
          })]
        })
      })
    }
    let tR = {
      1: {
        color: "#00ffff",
        glow: "#00ffff",
        gradient: "linear-gradient(135deg, #00ffff20, #00446610)",
        icon: "⚡",
        name: "THE AWAKENING"
      },
      2: {
        color: "#aa44ff",
        glow: "#aa44ff",
        gradient: "linear-gradient(135deg, #aa44ff20, #44008810)",
        icon: "👥",
        name: "THE GANG"
      },
      3: {
        color: "#ff4444",
        glow: "#ff4444",
        gradient: "linear-gradient(135deg, #ff444420, #66000010)",
        icon: "🛡️",
        name: "THE RESCUE"
      },
      4: {
        color: "#ff44aa",
        glow: "#ff44aa",
        gradient: "linear-gradient(135deg, #ff44aa20, #66004410)",
        icon: "🏰",
        name: "PROTECT"
      },
      5: {
        color: "#ffd700",
        glow: "#ffd700",
        gradient: "linear-gradient(135deg, #ffd70020, #66440010)",
        icon: "⚔️",
        name: "THE FINAL WAR"
      },
      6: {
        color: "#00ff66",
        glow: "#00ff66",
        gradient: "linear-gradient(135deg, #00ff6620, #00442210)",
        icon: "🔮",
        name: "THE INFINITE GRID"
      },
      7: {
        color: "#ff4400",
        glow: "#ff4400",
        gradient: "linear-gradient(135deg, #ff440020, #44110010)",
        icon: "🐉",
        name: "DRAGON'S DOMAIN"
      },
      8: {
        color: "#aaaaaa",
        glow: "#aaaaaa",
        gradient: "linear-gradient(135deg, #aaaaaa20, #44444410)",
        icon: "🤖",
        name: "MECH WARFARE"
      },
      9: {
        color: "#8800ff",
        glow: "#8800ff",
        gradient: "linear-gradient(135deg, #8800ff20, #22006610)",
        icon: "👁️",
        name: "SHADOW REALM"
      },
      10: {
        color: "#ff8800",
        glow: "#ff8800",
        gradient: "linear-gradient(135deg, #ff880020, #44220010)",
        icon: "🔥",
        name: "PHOENIX RISING"
      }
    };

    function tI(e) {
      if (tR[e]) return tR[e];
      let t = `hsl(${37*e%360}, 100%, 60%)`;
      return {
        color: t,
        glow: t,
        gradient: `linear-gradient(135deg, ${t}20, ${t}08)`,
        icon: "🌀",
        name: `ZONE ${e}`
      }
    }

    function tE({
      levelNum: e,
      highestLevel: t,
      completedLevels: l,
      isFoggy: r,
      stars: n,
      onClick: i
    }) {
      let s = e > t,
        c = l.includes(e),
        d = e === t,
        h = e > 8 ? e % (e > 50 ? 3 : 5) == 0 : [6, 8].includes(e),
        f = tI(Math.ceil(e / 10)),
        u = G.find(t => t.id === e);
      u && u.name;
      let x = h ? 56 : d ? 52 : 46,
        p = h ? "text-xs" : d ? "text-[11px]" : "text-[10px]",
        [g, y] = (0, a.useState)(0);
      (0, a.useEffect)(() => {
        if (!d || r) return;
        let e = setInterval(() => {
          y(e => (e + 1) % 60)
        }, 50);
        return () => clearInterval(e)
      }, [d, r]);
      let b = d ? 1 + .06 * Math.sin(g / 60 * Math.PI * 2) : 1,
        v = {},
        w = "1px solid #1a1a2e",
        k = {
          color: "#333"
        },
        C = null;
      return r ? (v = {
        background: "radial-gradient(circle, rgba(20,10,40,0.4), rgba(5,5,16,0.6))"
      }, w = "1px dashed #1a1a2e", k = {
        color: "#1a1a2e"
      }, C = (0, o.jsx)("span", {
        style: {
          fontSize: 10,
          opacity: .3
        },
        children: "?"
      })) : c ? (v = {
        background: `radial-gradient(circle, ${f.color}25, ${f.color}08)`,
        boxShadow: `0 0 12px ${f.color}30, inset 0 0 8px ${f.color}10`
      }, w = `2px solid ${f.color}`, k = {
        color: f.color,
        textShadow: `0 0 8px ${f.color}80`
      }, C = (0, o.jsx)("div", {
        className: "flex gap-px",
        children: [1, 2, 3].map(e => (0, o.jsx)("span", {
          style: {
            fontSize: 7,
            color: e <= n ? "#ffd700" : "#333",
            textShadow: e <= n ? "0 0 4px #ffd700" : "none"
          },
          children: "★"
        }, e))
      })) : d ? (v = {
        background: `radial-gradient(circle, ${m}35, ${m}10)`,
        boxShadow: `0 0 20px ${m}60, 0 0 40px ${m}25, inset 0 0 15px ${m}15`,
        transform: `scale(${b})`
      }, w = `2px solid ${m}`, k = {
        color: m,
        textShadow: `0 0 10px ${m}`
      }, C = (0, o.jsx)("span", {
        style: {
          fontSize: 10
        },
        children: "▶"
      })) : s && (v = {
        background: "radial-gradient(circle, rgba(15,15,30,0.5), rgba(5,5,16,0.7))"
      }, w = "1px solid #1a1a2e", k = {
        color: "#2a2a3e"
      }, C = (0, o.jsx)("span", {
        style: {
          fontSize: 9,
          opacity: .5
        },
        children: "🔒"
      })), (0, o.jsxs)("button", {
        onClick: i,
        className: "flex flex-col items-center justify-center rounded-xl transition-all duration-300 hover:scale-105 active:scale-95",
        style: {
          width: x,
          height: x,
          ...v,
          border: w,
          cursor: r || s ? "not-allowed" : "pointer",
          opacity: r ? .3 : 1
        },
        children: [h && !r && !s && (0, o.jsx)("span", {
          style: {
            fontSize: 9,
            lineHeight: 1,
            marginBottom: -2,
            filter: c ? `drop-shadow(0 0 3px ${f.color})` : "none"
          },
          children: "👑"
        }), (0, o.jsx)("span", {
          className: `font-bold font-mono ${p} leading-none`,
          style: k,
          children: e
        }), C]
      })
    }

    function tL({
      chapterNum: e,
      theme: t,
      completedInChapter: a,
      totalInChapter: l,
      isFoggy: r,
      chapterRef: n
    }) {
      let i = l > 0 ? a / l * 100 : 0,
        c = a === l;
      return (0, o.jsx)("div", {
        ref: n,
        className: "w-full mb-3",
        children: (0, o.jsx)("div", {
          className: "relative rounded-lg overflow-hidden px-4 py-2.5 mb-2",
          style: {
            background: r ? "linear-gradient(135deg, rgba(20,10,40,0.2), rgba(10,5,20,0.3))" : t.gradient,
            border: r ? "1px dashed #1a1a2e" : `1px solid ${t.color}40`,
            boxShadow: r ? "none" : `0 0 15px ${t.glow}15`
          },
          children: (0, o.jsxs)("div", {
            className: "flex items-center gap-2",
            children: [(0, o.jsx)("span", {
              className: "text-lg",
              style: {
                opacity: r ? .2 : 1
              },
              children: t.icon
            }), (0, o.jsxs)("div", {
              className: "flex-1 min-w-0",
              children: [(0, o.jsxs)("div", {
                className: "flex items-baseline gap-2",
                children: [(0, o.jsxs)("span", {
                  className: "font-bold font-mono text-xs tracking-widest",
                  style: {
                    color: r ? "#1a1a2e" : t.color,
                    textShadow: r ? "none" : `0 0 8px ${t.glow}60`
                  },
                  children: ["CH.", e]
                }), (0, o.jsx)("span", {
                  className: "font-mono text-[10px] truncate",
                  style: {
                    color: r ? "#1a1a2e" : "#888"
                  },
                  children: r ? "???" : t.name
                })]
              }), !r && (0, o.jsxs)("div", {
                className: "flex items-center gap-2 mt-1",
                children: [(0, o.jsx)("div", {
                  className: "flex-1 h-1.5 rounded-full overflow-hidden",
                  style: {
                    backgroundColor: "rgba(255,255,255,0.05)"
                  },
                  children: (0, o.jsx)("div", {
                    className: "h-full rounded-full transition-all duration-700",
                    style: {
                      width: `${i}%`,
                      backgroundColor: c ? s : t.color,
                      boxShadow: `0 0 6px ${c?s:t.color}50`
                    }
                  })
                }), (0, o.jsxs)("span", {
                  className: "font-mono text-[8px] flex-shrink-0",
                  style: {
                    color: c ? s : "#555",
                    textShadow: c ? "0 0 5px #00ff66" : "none"
                  },
                  children: [a, "/", l]
                })]
              })]
            }), c && !r && (0, o.jsx)("span", {
              className: "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded",
              style: {
                color: s,
                backgroundColor: "#00ff6615",
                border: "1px solid #00ff6640",
                textShadow: "0 0 5px #00ff66"
              },
              children: "DONE"
            })]
          })
        })
      })
    }

    function tD({
      color: e
    }) {
      let t = Array.from({
        length: 6
      }, (e, t) => ({
        id: t,
        delay: .5 * t,
        x: 20 + 60 * Math.random(),
        size: 2 + 3 * Math.random()
      }));
      return (0, o.jsx)("div", {
        className: "absolute inset-0 pointer-events-none overflow-hidden",
        children: t.map(t => (0, o.jsx)("div", {
          className: "absolute rounded-full",
          style: {
            width: t.size,
            height: t.size,
            backgroundColor: e,
            boxShadow: `0 0 ${2*t.size}px ${e}`,
            left: `${t.x}%`,
            bottom: "0%",
            animation: "float-up 2s ease-out infinite",
            animationDelay: `${t.delay}s`,
            opacity: 0
          }
        }, t.id))
      })
    }

    function tW({
      highestLevel: e
    }) {
      let t = (0, a.useRef)(null),
        l = (0, a.useRef)(0),
        r = (0, a.useRef)([]),
        n = (0, a.useRef)([]),
        i = (0, a.useRef)([]),
        s = (0, a.useRef)(0),
        c = (0, a.useRef)(0),
        d = R(A((Math.ceil(Math.max(e, 1) / 10) - 1) % 10 * 10 + 1)),
        h = d.particleColor,
        f = d.platformGlow,
        u = (0, a.useCallback)(e => {
          let t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
          return t ? {
            r: parseInt(t[1], 16),
            g: parseInt(t[2], 16),
            b: parseInt(t[3], 16)
          } : {
            r: 0,
            g: 255,
            b: 255
          }
        }, []);
      return (0, a.useEffect)(() => {
        r.current = Array.from({
          length: 65
        }, () => ({
          x: Math.random(),
          y: Math.random(),
          size: .5 + 1.5 * Math.random(),
          twinkleSpeed: .5 + 2 * Math.random(),
          twinkleOffset: Math.random() * Math.PI * 2,
          baseOpacity: .3 + .5 * Math.random()
        })), n.current = Array.from({
          length: 25
        }, () => ({
          x: Math.random(),
          y: Math.random(),
          vx: (Math.random() - .5) * 3e-4,
          vy: -2e-4 - 5e-4 * Math.random(),
          size: 1.5 + 3 * Math.random(),
          opacity: Math.random(),
          opacityDir: (Math.random() > .5 ? 1 : -1) * (.005 + .01 * Math.random()),
          color: Math.random() > .3 ? h : "#ffffff",
          life: 300 * Math.random(),
          maxLife: 300 + 200 * Math.random()
        }));
        let e = ["triangle", "diamond", "hexagon", "circle"];
        i.current = Array.from({
          length: 7
        }, () => ({
          x: .05 + .9 * Math.random(),
          y: .05 + .9 * Math.random(),
          vx: (Math.random() - .5) * 1e-4,
          vy: (Math.random() - .5) * 1e-4,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - .5) * .005,
          size: 8 + 16 * Math.random(),
          opacity: .06 + .1 * Math.random(),
          type: e[Math.floor(Math.random() * e.length)],
          color: Math.random() > .4 ? h : f
        }))
      }, [h, f]), (0, a.useEffect)(() => {
        let e = t.current;
        if (!e) return;
        let o = e.getContext("2d");
        if (!o) return;
        let a = u(h),
          d = () => {
            let t = e.width,
              f = e.height;
            if (0 === t || 0 === f) {
              l.current = requestAnimationFrame(d);
              return
            }
            s.current += 1, c.current = (c.current + .15) % 50;
            let m = s.current;
            o.fillStyle = "rgba(5, 5, 16, 1)", o.fillRect(0, 0, t, f);
            let x = [{
              r: a.r,
              g: a.g,
              b: a.b
            }, {
              r: Math.min(255, a.r + 60),
              g: Math.max(0, a.g - 40),
              b: Math.min(255, a.b + 80)
            }, {
              r: Math.max(0, a.r - 40),
              g: Math.min(255, a.g + 60),
              b: Math.max(0, a.b - 40)
            }];
            for (let e = 0; e < 3; e++) {
              let a = x[e];
              o.beginPath(), o.moveTo(0, 0);
              let l = f * (.08 + .05 * e);
              for (let a = 0; a <= t; a += 4) {
                let r = a / t,
                  n = l + .04 * f * Math.sin(3 * r + .008 * m + 1.2 * e) + .02 * f * Math.sin(5 * r + .012 * m +
                    .7 * e);
                o.lineTo(a, n)
              }
              o.lineTo(t, 0), o.closePath();
              let r = .04 + .015 * Math.sin(.01 * m + e);
              o.fillStyle = `rgba(${a.r}, ${a.g}, ${a.b}, ${r})`, o.fill()
            }
            let p = c.current;
            o.strokeStyle = `rgba(${a.r}, ${a.g}, ${a.b}, 0.04)`, o.lineWidth = .5;
            for (let e = p; e < t; e += 50) o.beginPath(), o.moveTo(e, 0), o.lineTo(e, f), o.stroke();
            for (let e = p; e < f; e += 50) o.beginPath(), o.moveTo(0, e), o.lineTo(t, e), o.stroke();
            for (let e of r.current) {
              let a = Math.sin(.02 * m * e.twinkleSpeed + e.twinkleOffset),
                l = e.baseOpacity + .25 * a;
              l <= 0 || (o.beginPath(), o.arc(e.x * t, e.y * f, e.size, 0, 2 * Math.PI), o.fillStyle =
                `rgba(255, 255, 255, ${Math.min(1,Math.max(0,l))})`, o.fill())
            }
            for (let e of n.current) {
              e.x += e.vx, e.y += e.vy, e.opacity += e.opacityDir, e.life += 1, (e.y < -.05 || e.x < -.05 || e
                  .x > 1.05 || e.opacity <= 0 || e.life > e.maxLife) && (e.x = Math.random(), e.y = .9 + .15 *
                  Math.random(), e.vx = (Math.random() - .5) * 3e-4, e.vy = -2e-4 - 5e-4 * Math.random(), e
                  .opacity = 0, e.opacityDir = Math.abs(e.opacityDir), e.life = 0, e.color = Math.random() >
                  .3 ? h : "#ffffff"), e.opacity >= .8 && (e.opacityDir = -Math.abs(e.opacityDir)), e.opacity <=
                0 && (e.opacityDir = Math.abs(e.opacityDir));
              let a = u(e.color),
                l = e.x * t,
                r = e.y * f,
                n = .7 * Math.max(0, Math.min(1, e.opacity)),
                i = o.createRadialGradient(l, r, 0, l, r, 3 * e.size);
              i.addColorStop(0, `rgba(${a.r}, ${a.g}, ${a.b}, ${n})`), i.addColorStop(1,
                  `rgba(${a.r}, ${a.g}, ${a.b}, 0)`), o.beginPath(), o.arc(l, r, 3 * e.size, 0, 2 * Math.PI), o
                .fillStyle = i, o.fill(), o.beginPath(), o.arc(l, r, e.size, 0, 2 * Math.PI), o.fillStyle =
                `rgba(${a.r}, ${a.g}, ${a.b}, ${n})`, o.fill()
            }
            for (let e of i.current) {
              e.x += e.vx, e.y += e.vy, e.rotation += e.rotationSpeed, (e.x < .02 || e.x > .98) && (e.vx *= -1),
                (e.y < .02 || e.y > .98) && (e.vy *= -1);
              let a = e.x * t,
                l = e.y * f,
                r = u(e.color);
              o.save(), o.translate(a, l), o.rotate(e.rotation), o.strokeStyle =
                `rgba(${r.r}, ${r.g}, ${r.b}, ${e.opacity})`, o.lineWidth = 1, o.beginPath();
              let n = e.size;
              switch (e.type) {
                case "triangle":
                  o.moveTo(0, -n), o.lineTo(.866 * n, .5 * n), o.lineTo(-(.866 * n), .5 * n), o.closePath();
                  break;
                case "diamond":
                  o.moveTo(0, -n), o.lineTo(.6 * n, 0), o.lineTo(0, n), o.lineTo(-(.6 * n), 0), o.closePath();
                  break;
                case "hexagon":
                  for (let e = 0; e < 6; e++) {
                    let t = Math.PI / 3 * e - Math.PI / 6,
                      a = Math.cos(t) * n * .7,
                      l = Math.sin(t) * n * .7;
                    0 === e ? o.moveTo(a, l) : o.lineTo(a, l)
                  }
                  o.closePath();
                  break;
                case "circle":
                  o.arc(0, 0, .6 * n, 0, 2 * Math.PI)
              }
              o.stroke(), o.strokeStyle = `rgba(${r.r}, ${r.g}, ${r.b}, ${.3*e.opacity})`, o.lineWidth = 3, o
                .stroke(), o.restore()
            }
            let g = o.createRadialGradient(t / 2, f / 2, .3 * f, t / 2, f / 2, .9 * f);
            g.addColorStop(0, "rgba(5, 5, 16, 0)"), g.addColorStop(1, "rgba(5, 5, 16, 0.5)"), o.fillStyle = g, o
              .fillRect(0, 0, t, f), l.current = requestAnimationFrame(d)
          };
        return l.current = requestAnimationFrame(d), () => cancelAnimationFrame(l.current)
      }, [h, u]), (0, a.useEffect)(() => {
        let e = t.current;
        if (!e) return;
        let o = () => {
          let t = e.parentElement;
          t && (e.width = t.clientWidth, e.height = t.clientHeight)
        };
        o();
        let a = new ResizeObserver(o);
        return a.observe(e.parentElement), () => a.disconnect()
      }, []), (0, o.jsx)("canvas", {
        ref: t,
        className: "absolute inset-0",
        style: {
          zIndex: 0,
          pointerEvents: "none"
        }
      })
    }

    function tO() {
      let e = ea(e => e.saveData),
        t = ea(e => e.startLevel),
        l = ea(e => e.setGamePhase),
        r = (0, a.useRef)(null),
        [c, d] = (0, a.useState)(null),
        h = (0, a.useRef)({}),
        f = e.highestLevel,
        u = e.missionsCompleted.map(Number),
        x = f > 100,
        p = x ? Math.min(Math.ceil(f / 10) + 1, Math.ceil(220)) : 10,
        g = (0, a.useCallback)(e => {
          eo.init(), eo.playMenuClick(), e()
        }, []);
      (0, a.useEffect)(() => {
        let e = Math.min(Math.ceil(f / 10), p);
        setTimeout(() => {
          let t = h.current[e];
          t && t.scrollIntoView({
            behavior: "smooth",
            block: "center"
          })
        }, 300)
      }, [f, p]);
      let y = (l, r, n) => {
          let i = tI(n),
            s = "ltr" === r ? l : [...l].reverse();
          return (0, o.jsx)("div", {
            className: "flex items-center justify-center gap-0",
            children: s.map((l, r) => {
              let n = l > 100 && !x,
                c = l === f,
                h = u.includes(l),
                p = r > 0 ? s[r - 1] : null;
              return (0, o.jsxs)(a.default.Fragment, {
                children: [r > 0 && p && (0, o.jsx)("div", {
                  className: "flex-shrink-0",
                  style: {
                    width: 12,
                    height: 2,
                    backgroundColor: h && u.includes(p) ? i.color : "#1a1a2e",
                    boxShadow: h && u.includes(p) ? `0 0 4px ${i.color}50` : "none",
                    opacity: h && u.includes(p) ? .7 : .3,
                    borderRadius: 1
                  }
                }), (0, o.jsxs)("div", {
                  className: "relative flex-shrink-0",
                  children: [(0, o.jsx)(tE, {
                    levelNum: l,
                    highestLevel: f,
                    completedLevels: u,
                    isFoggy: n,
                    stars: e.levelStars?.[String(l)] ?? +!!u.includes(l),
                    onClick: () => (e => {
                      let o = e > f,
                        a = e > 100 && !x;
                      if (o || a) {
                        eo.init(), eo.playMenuClick();
                        return
                      }
                      g(() => {
                        d(e), ev(), t(e)
                      })
                    })(l)
                  }), c && !n && (0, o.jsx)(tD, {
                    color: m
                  })]
                })]
              }, l)
            })
          })
        },
        b = (e, t, a) => {
          let l = tI(a),
            r = u.includes(e) && u.includes(t),
            n = e > 100 && !x;
          return (0, o.jsx)("div", {
            className: "flex justify-end pr-4",
            style: {
              padding: "2px 0"
            },
            children: (0, o.jsx)("div", {
              style: {
                width: 2,
                height: 14,
                backgroundColor: n ? "#0a0a15" : r ? l.color : "#1a1a2e",
                boxShadow: r ? `0 0 4px ${l.color}50` : "none",
                opacity: n ? .1 : r ? .7 : .3,
                borderRadius: 1
              }
            })
          })
        },
        v = [];
      for (let e = 1; e <= p; e++) {
        let t = (e - 1) * 10 + 1,
          a = Math.min(10 * e, 100),
          l = e > 10 && !x,
          r = l ? .15 : 1,
          n = tI(e),
          i = Array.from({
            length: a - t + 1
          }, (e, o) => t + o).filter(e => u.includes(e)).length,
          s = a - t + 1,
          c = Array.from({
            length: 5
          }, (e, o) => t + o),
          d = Array.from({
            length: Math.min(5, a - t - 4)
          }, (e, o) => t + 5 + o);
        v.push((0, o.jsxs)("div", {
          style: {
            opacity: r
          },
          className: "mb-2",
          children: [(0, o.jsx)(tL, {
            chapterNum: e,
            theme: n,
            completedInChapter: i,
            totalInChapter: s,
            isFoggy: l,
            chapterRef: t => {
              h.current[e] = t
            }
          }), (0, o.jsxs)("div", {
            className: "flex flex-col items-center px-2 mb-1",
            children: [y(c, "ltr", e), d.length > 0 && b(c[4], d[0], e), d.length > 0 && y(d, "rtl", e)]
          }), e < p && (0, o.jsx)("div", {
            className: "flex items-center justify-center py-2",
            children: (0, o.jsxs)("div", {
              className: "flex flex-col items-center gap-0.5",
              children: [
                [0, 1, 2].map(e => (0, o.jsx)("div", {
                  className: "w-1 h-1 rounded-full",
                  style: {
                    backgroundColor: i === s ? n.color : "#1a1a2e",
                    boxShadow: i === s ? `0 0 4px ${n.color}50` : "none",
                    opacity: .5 + .1 * e
                  }
                }, e)), (0, o.jsx)("svg", {
                  width: "8",
                  height: "8",
                  viewBox: "0 0 8 8",
                  style: {
                    opacity: .4
                  },
                  children: (0, o.jsx)("path", {
                    d: "M4 0 L8 4 L4 8 L0 4 Z",
                    fill: i === s ? n.color : "#1a1a2e"
                  })
                })
              ]
            })
          })]
        }, e))
      }
      let w = u.length,
        k = Math.min(w / 100 * 100, 100);
      return (0, o.jsxs)("div", {
        style: {
          backgroundColor: "transparent"
        },
        className: "jsx-ab3c149bca899a0f absolute inset-0 z-30 flex flex-col",
        children: [(0, o.jsx)(tW, {
          highestLevel: f
        }), (0, o.jsxs)("div", {
          style: {
            borderBottom: "1px solid rgba(0, 255, 255, 0.15)",
            background: "linear-gradient(180deg, rgba(5,5,16,0.98) 0%, rgba(5,5,16,0.92) 100%)"
          },
          className: "jsx-ab3c149bca899a0f relative z-10 flex-shrink-0 px-4 py-3",
          children: [(0, o.jsxs)("div", {
            className: "jsx-ab3c149bca899a0f flex items-center justify-between mb-2",
            children: [(0, o.jsxs)("button", {
              onClick: () => g(() => l("menu")),
              style: {
                border: "1px solid #333",
                color: "#888"
              },
              className: "jsx-ab3c149bca899a0f flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:bg-white/5",
              children: [(0, o.jsx)("span", {
                style: {
                  fontSize: 12
                },
                className: "jsx-ab3c149bca899a0f",
                children: "←"
              }), (0, o.jsx)("span", {
                className: "jsx-ab3c149bca899a0f font-mono text-xs font-bold tracking-wider",
                children: "BACK"
              })]
            }), (0, o.jsx)("h2", {
              style: {
                color: n,
                textShadow: "0 0 15px #00ffff80, 0 0 30px #00ffff30"
              },
              className: "jsx-ab3c149bca899a0f text-lg font-bold tracking-widest font-mono",
              children: "LEVEL MAP"
            }), (0, o.jsxs)("div", {
              style: {
                color: m,
                textShadow: "0 0 8px #ffd70040"
              },
              className: "jsx-ab3c149bca899a0f font-mono text-xs font-bold",
              children: ["LV ", f]
            })]
          }), (0, o.jsxs)("div", {
            className: "jsx-ab3c149bca899a0f flex items-center gap-2",
            children: [(0, o.jsx)("div", {
              style: {
                backgroundColor: "rgba(255,255,255,0.05)"
              },
              className: "jsx-ab3c149bca899a0f flex-1 h-2 rounded-full overflow-hidden",
              children: (0, o.jsx)("div", {
                style: {
                  width: `${k}%`,
                  background: "linear-gradient(90deg, #00ffff, #00ff66, #ffd700)",
                  boxShadow: "0 0 8px rgba(0,255,102,0.4)"
                },
                className: "jsx-ab3c149bca899a0f h-full rounded-full transition-all duration-1000"
              })
            }), (0, o.jsxs)("span", {
              style: {
                color: "#666"
              },
              className: "jsx-ab3c149bca899a0f font-mono text-[9px] flex-shrink-0",
              children: [w, "/", 100]
            })]
          })]
        }), (0, o.jsx)("div", {
          style: {
            borderBottom: "1px solid rgba(255,255,255,0.03)",
            scrollbarWidth: "none"
          },
          className: "jsx-ab3c149bca899a0f relative z-10 flex-shrink-0 flex gap-1.5 px-3 py-2 overflow-x-auto",
          children: Array.from({
            length: p
          }, (e, t) => t + 1).map(e => {
            let t = Math.ceil(f / 10) === e,
              a = tI(e),
              l = e > 10 && !x;
            return (0, o.jsx)("button", {
              onClick: () => {
                let t = h.current[e];
                t && t.scrollIntoView({
                  behavior: "smooth",
                  block: "center"
                }), eo.init(), eo.playMenuClick()
              },
              style: {
                backgroundColor: t ? `${a.color}18` : "rgba(0,0,0,0.2)",
                border: t ? `1px solid ${a.color}60` : "1px solid #1a1a2e",
                color: l ? "#1a1a2e" : t ? a.color : "#555",
                textShadow: t ? `0 0 8px ${a.color}60` : "none",
                boxShadow: t ? `0 0 10px ${a.color}20` : "none"
              },
              className: "jsx-ab3c149bca899a0f flex-shrink-0 px-2.5 py-1.5 rounded-lg transition-all hover:scale-105 active:scale-95",
              children: (0, o.jsxs)("span", {
                className: "jsx-ab3c149bca899a0f font-mono text-[9px] font-bold tracking-wider",
                children: [a.icon, " ", e]
              })
            }, e)
          })
        }), (0, o.jsx)("div", {
          ref: r,
          style: {
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%)"
          },
          className: "jsx-ab3c149bca899a0f relative z-10 flex-1 overflow-y-auto px-2 py-4",
          children: (0, o.jsxs)("div", {
            className: "jsx-ab3c149bca899a0f max-w-md mx-auto",
            children: [v, x ? null : (0, o.jsx)("div", {
              className: "w-full mt-6 mb-8",
              children: (0, o.jsxs)("div", {
                className: "relative rounded-xl p-5 text-center overflow-hidden",
                style: {
                  background: "linear-gradient(180deg, rgba(20,10,40,0.3) 0%, rgba(10,5,25,0.5) 100%)",
                  border: "1px dashed #2a1a4e"
                },
                children: [(0, o.jsx)("div", {
                  className: "absolute inset-0",
                  style: {
                    background: "radial-gradient(ellipse at 50% 50%, rgba(60,20,100,0.15), transparent 70%)",
                    animation: "fog-drift 8s ease-in-out infinite alternate"
                  }
                }), (0, o.jsxs)("div", {
                  className: "relative z-10",
                  children: [(0, o.jsx)("div", {
                    className: "text-2xl mb-2",
                    children: "🌫️"
                  }), (0, o.jsx)("div", {
                    className: "font-bold font-mono text-sm tracking-wider mb-1",
                    style: {
                      color: "#6a3abe",
                      textShadow: "0 0 10px #6a3abe60"
                    },
                    children: "??? MYSTERY ZONE ???"
                  }), (0, o.jsx)("div", {
                    className: "text-[10px] font-mono",
                    style: {
                      color: "#4a3a8e"
                    },
                    children: "Complete Level 100 to unlock the path beyond..."
                  }), (0, o.jsx)("div", {
                    className: "mt-3 flex items-center justify-center gap-2",
                    children: [1, 2, 3, 4, 5].map(e => (0, o.jsx)("div", {
                      className: "w-1.5 h-1.5 rounded-full",
                      style: {
                        backgroundColor: "#4a2a8e",
                        animation: `neon-pulse ${1.5+.3*e}s ease-in-out infinite`,
                        animationDelay: `${.2*e}s`
                      }
                    }, e))
                  })]
                })]
              })
            }), x && (0, o.jsx)("div", {
              className: "jsx-ab3c149bca899a0f mt-6 mb-8 text-center",
              children: (0, o.jsxs)("div", {
                style: {
                  background: "linear-gradient(135deg, rgba(170,0,255,0.1), rgba(255,0,102,0.1))",
                  border: "1px solid #aa00ff30"
                },
                className: "jsx-ab3c149bca899a0f rounded-xl p-4",
                children: [(0, o.jsx)("div", {
                  className: "jsx-ab3c149bca899a0f text-xl mb-1",
                  children: "🌌"
                }), (0, o.jsx)("div", {
                  style: {
                    color: i,
                    textShadow: "0 0 15px #ff00ff60"
                  },
                  className: "jsx-ab3c149bca899a0f font-bold font-mono text-xs tracking-wider mb-1",
                  children: "THE INFINITE FRONTIER"
                }), (0, o.jsxs)("div", {
                  style: {
                    color: "#888"
                  },
                  className: "jsx-ab3c149bca899a0f text-[10px] font-mono",
                  children: [100, " levels await beyond..."]
                })]
              })
            })]
          })
        }), (0, o.jsx)("div", {
          style: {
            borderTop: "1px solid rgba(0, 255, 255, 0.1)",
            background: "linear-gradient(0deg, rgba(5,5,16,0.98) 0%, rgba(5,5,16,0.92) 100%)"
          },
          className: "jsx-ab3c149bca899a0f relative z-10 flex-shrink-0 px-4 py-2.5",
          children: (0, o.jsxs)("div", {
            className: "jsx-ab3c149bca899a0f flex items-center justify-center gap-5 text-[9px] font-mono",
            children: [(0, o.jsxs)("div", {
              className: "jsx-ab3c149bca899a0f flex items-center gap-1",
              children: [(0, o.jsx)("div", {
                style: {
                  backgroundColor: s,
                  boxShadow: "0 0 4px #00ff66"
                },
                className: "jsx-ab3c149bca899a0f w-2.5 h-2.5 rounded-sm"
              }), (0, o.jsx)("span", {
                style: {
                  color: "#666"
                },
                className: "jsx-ab3c149bca899a0f",
                children: "Cleared"
              })]
            }), (0, o.jsxs)("div", {
              className: "jsx-ab3c149bca899a0f flex items-center gap-1",
              children: [(0, o.jsx)("div", {
                style: {
                  backgroundColor: m,
                  boxShadow: "0 0 4px #ffd700"
                },
                className: "jsx-ab3c149bca899a0f w-2.5 h-2.5 rounded-sm"
              }), (0, o.jsx)("span", {
                style: {
                  color: "#666"
                },
                className: "jsx-ab3c149bca899a0f",
                children: "Current"
              })]
            }), (0, o.jsxs)("div", {
              className: "jsx-ab3c149bca899a0f flex items-center gap-1",
              children: [(0, o.jsx)("div", {
                style: {
                  backgroundColor: "#0a0a15"
                },
                className: "jsx-ab3c149bca899a0f w-2.5 h-2.5 rounded-sm border border-[#333]"
              }), (0, o.jsx)("span", {
                style: {
                  color: "#666"
                },
                className: "jsx-ab3c149bca899a0f",
                children: "Locked"
              })]
            }), (0, o.jsxs)("div", {
              className: "jsx-ab3c149bca899a0f flex items-center gap-1",
              children: [(0, o.jsx)("span", {
                style: {
                  fontSize: 10
                },
                className: "jsx-ab3c149bca899a0f",
                children: "👑"
              }), (0, o.jsx)("span", {
                style: {
                  color: "#666"
                },
                className: "jsx-ab3c149bca899a0f",
                children: "Boss"
              })]
            })]
          })
        }), (0, o.jsx)(e9.default, {
          id: "ab3c149bca899a0f",
          children: "@keyframes float-up{0%{opacity:0;transform:translateY(0)scale(1)}20%{opacity:.8}to{opacity:0;transform:translateY(-40px)scale(.3)}}@keyframes fog-drift{0%{transform:translate(-5%)scaleY(1)}to{transform:translate(5%)scaleY(1.1)}}"
        })]
      })
    }

    function tB({
      onComplete: e
    }) {
      let [t, l] = (0, a.useState)(0);
      return (0, a.useEffect)(() => {
        let e = setInterval(() => {
          l(t => t >= 100 ? (clearInterval(e), 100) : t + 2)
        }, 60);
        return () => clearInterval(e)
      }, []), (0, a.useEffect)(() => {
        if (t >= 100) {
          let t = setTimeout(e, 300);
          return () => clearTimeout(t)
        }
      }, [t, e]), (0, o.jsx)("div", {
        className: "fixed inset-0 z-50 flex flex-col items-center justify-center",
        style: {
          backgroundColor: "rgba(0,0,0,0.95)"
        },
        children: (0, o.jsxs)("div", {
          className: "text-center",
          children: [(0, o.jsx)("div", {
            className: "text-2xl font-bold font-mono mb-4",
            style: {
              color: m,
              textShadow: "0 0 15px #ffd700"
            },
            children: "🎬 WATCHING AD"
          }), (0, o.jsx)("div", {
            className: "w-64 h-3 rounded-full mx-auto mb-3",
            style: {
              backgroundColor: "#222",
              border: "1px solid #444"
            },
            children: (0, o.jsx)("div", {
              className: "h-full rounded-full transition-all duration-100",
              style: {
                width: `${t}%`,
                backgroundColor: n,
                boxShadow: "0 0 10px #00ffff"
              }
            })
          }), (0, o.jsx)("div", {
            className: "text-sm font-mono",
            style: {
              color: "#888"
            },
            children: t < 100 ? "Please wait..." : "✅ 2x Reward unlocked!"
          })]
        })
      })
    }

    function tG() {
      let e = ea(e => e.saveData),
        t = ea(e => e.claimDailyReward),
        [l, r] = (0, a.useState)(!1),
        [c, d] = (0, a.useState)(0),
        [h, f] = (0, a.useState)(0),
        [u, x] = (0, a.useState)(!1),
        [p, g] = (0, a.useState)(!1),
        [y, b] = (0, a.useState)(!1),
        v = e.dailyRewardStreak || 0,
        w = h || Math.min(v, 7),
        k = (0, a.useCallback)(() => {
          eo.init(), eo.playCoinCollect();
          let e = t();
          e && (r(!0), d(e.coins), f(e.day), g(!0), setTimeout(() => g(!1), 1e3))
        }, [t]),
        C = (0, a.useCallback)(() => {
          b(!0)
        }, []),
        S = (0, a.useCallback)(() => {
          b(!1), ea.getState().addCoinsReward(c), x(!0), eo.playCoinCollect()
        }, [c]),
        T = (0, a.useCallback)(() => {
          eo.init(), eo.playMenuClick(), window.dispatchEvent(new Event("daily-reward-dismissed"))
        }, []);
      return (0, o.jsxs)("div", {
        style: {
          backgroundColor: "rgba(0,0,0,0.9)"
        },
        className: "jsx-326cf905996ee422 fixed inset-0 z-40 flex items-center justify-center",
        children: [y && (0, o.jsx)(tB, {
          onComplete: S
        }), (0, o.jsxs)("div", {
          style: {
            backgroundColor: "#0a0a20",
            border: "2px solid #ffd70060",
            boxShadow: "0 0 40px rgba(255,215,0,0.2), inset 0 0 40px rgba(255,215,0,0.05)"
          },
          className: "jsx-326cf905996ee422 text-center p-6 rounded-xl max-w-sm w-full mx-4",
          children: [(0, o.jsx)("h2", {
            style: {
              color: m,
              textShadow: "0 0 15px #ffd700"
            },
            className: "jsx-326cf905996ee422 text-2xl font-bold font-mono tracking-wider mb-1",
            children: "📅 DAILY REWARD"
          }), (0, o.jsx)("p", {
            style: {
              color: "#888"
            },
            className: "jsx-326cf905996ee422 text-xs font-mono mb-4",
            children: "Login every day for bigger rewards!"
          }), (0, o.jsx)("div", {
            className: "jsx-326cf905996ee422 grid grid-cols-7 gap-1 mb-4",
            children: N.map((e, t) => {
              let a = t + 1,
                r = a === (l ? w : Math.min(v + 1, 7)),
                i = a <= v || l && a < w,
                c = l && a === w;
              return (0, o.jsxs)("div", {
                style: {
                  backgroundColor: c ? "rgba(255,215,0,0.15)" : r ? "rgba(0,255,255,0.1)" :
                    i ? "rgba(0,255,102,0.08)" : "rgba(0,0,0,0.3)",
                  border: `1px solid ${c?"#ffd700":r?n:i?"#00ff6640":"#33333330"}`
                },
                className: "jsx-326cf905996ee422 flex flex-col items-center p-1.5 rounded",
                children: [(0, o.jsxs)("div", {
                  style: {
                    color: c ? m : r ? n : i ? s : "#444"
                  },
                  className: "jsx-326cf905996ee422 text-[7px] font-mono font-bold",
                  children: ["D", a]
                }), (0, o.jsx)("div", {
                  style: {
                    color: c ? m : i ? "#888" : "#555"
                  },
                  className: "jsx-326cf905996ee422 text-[9px] font-mono font-bold",
                  children: c ? "✓" : `${e.coins}`
                })]
              }, a)
            })
          }), !l && (0, o.jsxs)("div", {
            style: {
              backgroundColor: "rgba(255,215,0,0.08)",
              border: "1px solid #ffd70030"
            },
            className: "jsx-326cf905996ee422 mb-4 p-3 rounded-lg",
            children: [(0, o.jsx)("div", {
              style: {
                color: "#888"
              },
              className: "jsx-326cf905996ee422 text-xs font-mono mb-1",
              children: "TODAY'S REWARD"
            }), (0, o.jsxs)("div", {
              style: {
                color: m,
                textShadow: "0 0 15px #ffd700"
              },
              className: "jsx-326cf905996ee422 text-3xl font-bold font-mono",
              children: ["🪙 ", N[Math.min(v, 6)]?.coins || 50]
            })]
          }), l && p && (0, o.jsxs)("div", {
            style: {
              backgroundColor: "rgba(0,255,102,0.1)",
              border: "1px solid rgba(0,255,102,0.3)",
              animation: "neon-pulse 0.5s ease-out"
            },
            className: "jsx-326cf905996ee422 mb-4 p-3 rounded-lg",
            children: [(0, o.jsxs)("div", {
              style: {
                color: s,
                textShadow: "0 0 15px #00ff66"
              },
              className: "jsx-326cf905996ee422 text-xl font-bold font-mono",
              children: ["+", c, " 🪙"]
            }), u && (0, o.jsxs)("div", {
              style: {
                color: i,
                textShadow: "0 0 10px #ff00ff"
              },
              className: "jsx-326cf905996ee422 text-lg font-bold font-mono mt-1",
              children: ["+", c, " BONUS! 🎬"]
            })]
          }), l && !p && (0, o.jsxs)("div", {
            style: {
              backgroundColor: "rgba(0,255,102,0.1)",
              border: "1px solid rgba(0,255,102,0.3)"
            },
            className: "jsx-326cf905996ee422 mb-4 p-3 rounded-lg",
            children: [(0, o.jsxs)("div", {
              style: {
                color: s,
                textShadow: "0 0 15px #00ff66"
              },
              className: "jsx-326cf905996ee422 text-xl font-bold font-mono",
              children: ["+", c, " 🪙 CLAIMED!"]
            }), u && (0, o.jsxs)("div", {
              style: {
                color: i,
                textShadow: "0 0 10px #ff00ff"
              },
              className: "jsx-326cf905996ee422 text-lg font-bold font-mono mt-1",
              children: ["+", c, " BONUS! 🎬"]
            })]
          }), (0, o.jsxs)("div", {
            className: "jsx-326cf905996ee422 flex flex-col gap-2",
            children: [!l && (0, o.jsx)("button", {
              onClick: k,
              style: {
                borderColor: m,
                color: m,
                textShadow: "0 0 10px #ffd700",
                boxShadow: "0 0 20px rgba(255,215,0,0.3)",
                animation: "neon-pulse 2s ease-in-out infinite"
              },
              onMouseEnter: () => {
                eo.init(), eo.playMenuHover()
              },
              className: "jsx-326cf905996ee422 neon-btn w-full py-3 px-4 text-lg font-bold font-mono tracking-wider",
              children: "🪙 CLAIM"
            }), l && !u && (0, o.jsx)("button", {
              onClick: C,
              style: {
                borderColor: n,
                color: n,
                textShadow: "0 0 8px #00ffff"
              },
              onMouseEnter: () => {
                eo.init(), eo.playMenuHover()
              },
              className: "jsx-326cf905996ee422 neon-btn w-full py-2 px-4 text-sm font-bold font-mono tracking-wider",
              children: "🎬 WATCH AD FOR 2X"
            }), (0, o.jsx)("button", {
              onClick: T,
              style: {
                color: "#666",
                border: "1px solid #333"
              },
              className: "jsx-326cf905996ee422 text-xs font-mono px-4 py-1.5 rounded",
              children: l ? "CLOSE" : "SKIP"
            })]
          }), (0, o.jsxs)("div", {
            style: {
              color: "#555"
            },
            className: "jsx-326cf905996ee422 mt-3 text-[9px] font-mono",
            children: ["Streak: ", l ? w : v, " / 7 days"]
          })]
        }), (0, o.jsx)(e9.default, {
          id: "326cf905996ee422",
          children: "@keyframes neon-pulse{0%,to{opacity:1}50%{opacity:.85}}"
        })]
      })
    }
    let t$ = {
        damage: "⚔️",
        fireRate: "🔥",
        bulletSpeed: "💨",
        bulletSize: "⭕",
        criticalChance: "💥"
      },
      tF = {
        damage: f,
        fireRate: c,
        bulletSpeed: n,
        bulletSize: i,
        criticalChance: m
      },
      tH = {
        damage: "+15% damage per level",
        fireRate: "+10% faster shooting per level",
        bulletSpeed: "+12% bullet speed per level",
        bulletSize: "+10% bullet size per level",
        criticalChance: "+2% crit chance per level (max 50)"
      };

    function tU({
      onComplete: e
    }) {
      let [t, l] = (0, a.useState)(0);
      return (0, a.useEffect)(() => {
        let e = setInterval(() => {
          l(t => t >= 100 ? (clearInterval(e), 100) : t + 2)
        }, 60);
        return () => clearInterval(e)
      }, []), (0, a.useEffect)(() => {
        if (t >= 100) {
          let t = setTimeout(e, 300);
          return () => clearTimeout(t)
        }
      }, [t, e]), (0, o.jsx)("div", {
        className: "fixed inset-0 z-50 flex flex-col items-center justify-center",
        style: {
          backgroundColor: "rgba(0,0,0,0.95)"
        },
        children: (0, o.jsxs)("div", {
          className: "text-center",
          children: [(0, o.jsx)("div", {
            className: "text-2xl font-bold font-mono mb-4",
            style: {
              color: m,
              textShadow: "0 0 15px #ffd700"
            },
            children: "🎬 WATCHING AD"
          }), (0, o.jsx)("div", {
            className: "w-64 h-3 rounded-full mx-auto mb-3",
            style: {
              backgroundColor: "#222",
              border: "1px solid #444"
            },
            children: (0, o.jsx)("div", {
              className: "h-full rounded-full transition-all duration-100",
              style: {
                width: `${t}%`,
                backgroundColor: n,
                boxShadow: "0 0 10px #00ffff"
              }
            })
          }), (0, o.jsx)("div", {
            className: "text-sm font-mono",
            style: {
              color: "#888"
            },
            children: t < 100 ? "Please wait..." : "✅ Free upgrade unlocked!"
          })]
        })
      })
    }

    function tV() {
      let e = ea(e => e.saveData),
        t = ea(e => e.setGamePhase),
        l = ea(e => e.upgradeWeapon),
        r = ea(e => e.upgradeWeaponByAd),
        i = ea(e => e.addCoinsReward),
        [c, d] = (0, a.useState)(!1),
        [h, u] = (0, a.useState)(null),
        x = e => {
          eo.init(), eo.playMenuClick(), e()
        },
        p = (0, a.useCallback)(() => {
          d(!1), h && (i(200), r(h), eo.playCoinCollect(), u(null))
        }, [h, i, r]);
      return (0, o.jsxs)("div", {
        className: "absolute inset-0 z-20 flex flex-col pointer-events-auto",
        style: {
          backgroundColor: "rgba(5,5,16,0.92)"
        },
        children: [c && (0, o.jsx)(tU, {
          onComplete: p
        }), (0, o.jsx)("div", {
          className: "flex-1 overflow-y-auto px-3 py-4",
          style: {
            scrollbarWidth: "none"
          },
          children: (0, o.jsxs)("div", {
            className: "max-w-md mx-auto",
            children: [(0, o.jsxs)("div", {
              className: "text-center mb-3",
              children: [(0, o.jsx)("h2", {
                className: "text-xl font-bold font-mono tracking-wider",
                style: {
                  color: f,
                  textShadow: "0 0 15px #ff3333, 0 0 30px #ff333366"
                },
                children: "🔫 WEAPON UPGRADES"
              }), (0, o.jsxs)("div", {
                className: "text-xs font-mono mt-1",
                style: {
                  color: m
                },
                children: ["🪙 ", e.totalCoins.toLocaleString(), " COINS"]
              })]
            }), (0, o.jsx)("div", {
              className: "space-y-2.5",
              children: ["damage", "fireRate", "bulletSpeed", "bulletSize", "criticalChance"]
                .map(t => {
                  let a = y[t],
                    r = e.weaponUpgrades[t] ?? 0,
                    i = b(t, r),
                    c = e.totalCoins >= i,
                    h = r >= a.maxLevel,
                    f = tF[t],
                    p = t$[t],
                    g = tH[t],
                    v = r > 0 ? `+${(r*a.effectPerLevel*100).toFixed(0)}%` : "Base",
                    w = h ? "MAX" : `+${((r+1)*a.effectPerLevel*100).toFixed(0)}%`;
                  return (0, o.jsxs)("div", {
                    className: "rounded-xl p-3",
                    style: {
                      backgroundColor: `${f}08`,
                      border: `1.5px solid ${f}30`,
                      boxShadow: `0 0 12px ${f}08`
                    },
                    children: [(0, o.jsxs)("div", {
                      className: "flex items-center gap-2 mb-1.5",
                      children: [(0, o.jsx)("span", {
                        className: "text-lg",
                        children: p
                      }), (0, o.jsxs)("div", {
                        className: "flex-1",
                        children: [(0, o.jsxs)("div", {
                          className: "flex items-center gap-2",
                          children: [(0, o.jsx)("span", {
                            className: "font-bold text-sm font-mono",
                            style: {
                              color: f
                            },
                            children: a.name
                          }), (0, o.jsxs)("span", {
                            className: "text-[9px] font-mono font-bold px-1.5 py-0.5 rounded",
                            style: {
                              backgroundColor: `${f}20`,
                              color: f,
                              border: `1px solid ${f}40`
                            },
                            children: ["LV ", r]
                          })]
                        }), (0, o.jsx)("div", {
                          className: "text-[9px] font-mono",
                          style: {
                            color: "#888"
                          },
                          children: g
                        })]
                      })]
                    }), (0, o.jsxs)("div", {
                      className: "flex items-center gap-2 mb-2 text-[10px] font-mono",
                      children: [(0, o.jsx)("span", {
                        style: {
                          color: "#666"
                        },
                        children: "Current:"
                      }), (0, o.jsx)("span", {
                        style: {
                          color: r > 0 ? s : "#555"
                        },
                        children: v
                      }), !h && (0, o.jsxs)(o.Fragment, {
                        children: [(0, o.jsx)("span", {
                          style: {
                            color: "#444"
                          },
                          children: "→"
                        }), (0, o.jsx)("span", {
                          style: {
                            color: f
                          },
                          children: w
                        })]
                      })]
                    }), (0, o.jsx)("div", {
                      className: "w-full h-1.5 rounded-full mb-2",
                      style: {
                        backgroundColor: "#1a1a2a"
                      },
                      children: (0, o.jsx)("div", {
                        className: "h-full rounded-full transition-all duration-300",
                        style: {
                          width: h ? "100%" :
                            `${Math.min(100,r/Math.min(a.maxLevel,50)*100)}%`,
                          backgroundColor: h ? m : f,
                          boxShadow: `0 0 6px ${h?m:f}66`
                        }
                      })
                    }), !h && (0, o.jsxs)("div", {
                      className: "flex gap-2",
                      children: [(0, o.jsxs)("button", {
                        onClick: () => x(() => {
                          l(t) && eo.playCoinCollect()
                        }),
                        className: "flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all",
                        style: {
                          backgroundColor: c ? "rgba(255,215,0,0.12)" :
                            "rgba(0,0,0,0.3)",
                          border: `1.5px solid ${c?"#ffd700":"#333"}`,
                          color: c ? "#ffd700" : "#555",
                          textShadow: c ? "0 0 6px #ffd70066" : "none",
                          cursor: c ? "pointer" : "not-allowed"
                        },
                        children: ["🪙 ", i.toLocaleString()]
                      }), (0, o.jsx)("button", {
                        onClick: () => x(() => {
                          d(!0), u(t)
                        }),
                        className: "flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all",
                        style: {
                          backgroundColor: "rgba(0,255,255,0.08)",
                          border: "1.5px solid rgba(0,255,255,0.4)",
                          color: n,
                          textShadow: "0 0 6px #00ffff66",
                          cursor: "pointer"
                        },
                        children: "🎬 AD (FREE)"
                      })]
                    }), h && (0, o.jsx)("div", {
                      className: "text-center text-xs font-mono font-bold py-1",
                      style: {
                        color: m,
                        textShadow: "0 0 8px #ffd700"
                      },
                      children: "★ MAX LEVEL ★"
                    })]
                  }, t)
                })
            }), (0, o.jsx)("div", {
              className: "text-center mt-4 text-[8px] font-mono",
              style: {
                color: "#ffffff22"
              },
              children: "Watch ads for free upgrades • Prices increase exponentially • No limit on upgrades"
            }), (0, o.jsx)("button", {
              onClick: () => x(() => t("menu")),
              className: "neon-btn w-full py-2 mt-3 text-xs tracking-wider font-mono font-bold",
              style: {
                borderColor: "#666",
                color: "#888"
              },
              children: "← BACK TO MENU"
            })]
          })
        })]
      })
    }
    e.s(["default", 0, function() {
      let e = ea(e => e.gamePhase),
        t = ea(e => e.setGamePhase),
        l = ea(e => e.saveData),
        r = ea(e => e.setCloudSync),
        n = ea(e => e.loadCloudSave);
      (0, a.useEffect)(() => {
        eb.initialize(), eu(), ed();
        let e = !1;
        return es(async t => {
          if (r(!!t.user), t.user && !e) {
            e = !0;
            try {
              let e = await (0, ep.downloadSaveFromCloud)();
              e && n(e)
            } catch {}
          }
        })
      }, [r, n]);
      let [i, s] = (0, a.useState)(() => {
        try {
          let e = localStorage.getItem("neon-stickwar-save");
          if (e) {
            let t = JSON.parse(e);
            if (t && t.highestLevel > 0) return !0
          }
        } catch {}
        return !1
      }), [c, d] = (0, a.useState)(""), h = (0, a.useMemo)(() => "menu" === e && Q(l) && l
        .lastDailyRewardDay !== c, [e, l, c]);
      return ((0, a.useEffect)(() => {
        let e = () => {
          d(l.lastDailyRewardDay)
        };
        return window.addEventListener("daily-reward-dismissed", e), () => window.removeEventListener(
          "daily-reward-dismissed", e)
      }, [l.lastDailyRewardDay]), (0, a.useEffect)(() => {
        i && "splash" === e && t("menu")
      }, [i, e, t]), (0, a.useEffect)(() => {
        if (!i) {
          let e = setTimeout(() => {
            s(!0), t("menu")
          }, 1e4);
          return () => clearTimeout(e)
        }
      }, [i, t]), (0, a.useEffect)(() => {
        let e = () => {
          i || (s(!0), t("menu"))
        };
        return window.addEventListener("splash-end", e), () => window.removeEventListener("splash-end",
          e)
      }, [i, t]), (0, a.useEffect)(() => {
        if ("u" > typeof screen && screen.orientation && "lock" in screen.orientation) try {
          screen.orientation.lock("landscape").catch(() => {})
        } catch {}
      }, []), i || "splash" !== e) ? (0, o.jsxs)("main", {
        className: "fixed inset-0 w-screen h-[100dvh] bg-[#050510] overflow-hidden",
        children: [(0, o.jsx)(eC, {}), h && (0, o.jsx)(tG, {}), (0, o.jsx)(e6, {}), "menu" === e && (0, o
            .jsx)(eI, {}), "cutscene" === e && (0, o.jsx)(ta, {}), "game-over" === e && (0, o.jsx)(
            e8, {}), "level-complete" === e && (0, o.jsx)(te, {}), "victory" === e && (0, o.jsx)(
          tt, {}), "skin-shop" === e && (0, o.jsx)(tc, {}), "skill-shop" === e && (0, o.jsx)(tg, {}),
          "settings" === e && (0, o.jsx)(ty, {}), "profile" === e && (0, o.jsx)(tN, {}),
          "leaderboard" === e && (0, o.jsx)(tA, {}), "level-map" === e && (0, o.jsx)(tO, {}),
          "weapon-shop" === e && (0, o.jsx)(tV, {}), "online-arena" === e && (0, o.jsx)(tk, {}),
          "online-lobby" === e && (0, o.jsx)(tk, {})
        ]
      }) : (0, o.jsx)("main", {
        className: "fixed inset-0 w-screen h-[100dvh] bg-[#050510] overflow-hidden",
        children: (0, o.jsx)(tS, {})
      })
    }], 52683)
  }
]);