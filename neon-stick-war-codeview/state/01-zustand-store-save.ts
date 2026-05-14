            a = t - m.current.y,
            l = Math.sqrt(o * o + a * a),
            r = Math.min(l, 40),
            n = Math.atan2(a, o),
            i = l > 0 ? r / 40 * Math.cos(n) : 0,
            s = l > 0 ? r / 40 * Math.sin(n) : 0;
          f({
            x: l > 0 ? r * Math.cos(n) : 0,
            y: l > 0 ? r * Math.sin(n) : 0
          });
          let c = eY();
          c?.setJoystick({
            active: !0,
            dx: i,
            dy: s
          }), i < -.3 ? c?.moveLeft() : i > .3 ? c?.moveRight() : c?.stopMove()
        }, [40]),
        k = (0, a.useCallback)(e => {
          e.preventDefault(), e.stopPropagation();
          let t = e.changedTouches[0];
          if (null !== u.current) return;
          u.current = t.identifier, d(!0);
          let o = x.current?.getBoundingClientRect();
          o && (m.current = {
            x: o.left + o.width / 2,
            y: o.top + o.height / 2
          }), eJ(8), w(t.clientX, t.clientY)
        }, [w]),
        C = (0, a.useCallback)(e => {
          e.preventDefault(), e.stopPropagation();
          for (let t = 0; t < e.changedTouches.length; t++) {
            let o = e.changedTouches[t];
            if (o.identifier === u.current) {
              w(o.clientX, o.clientY);
              break
            }
          }
        }, [w]),
        S = (0, a.useCallback)(e => {
          e.preventDefault(), e.stopPropagation();
          for (let t = 0; t < e.changedTouches.length; t++)
            if (e.changedTouches[t].identifier === u.current) {
              u.current = null, d(!1), f({
                x: 0,
                y: 0
              });
              let e = eY();
              e?.setJoystick({
                active: !1,
                dx: 0,
                dy: 0
              }), e?.stopMove();
              break
            }
        }, []),
        T = (0, a.useCallback)(() => {
          eJ(15);
          let e = eY();
          e?.jump()
        }, []),
        M = (0, a.useCallback)(() => {
          eJ(10);
          let e = eY();
          e?.shoot(), p.current = setInterval(() => {
            let e = eY();
            e?.shoot()
          }, 150)
        }, []),
        j = (0, a.useCallback)(() => {
          let e = eY();
          e?.stopShoot(), p.current && (clearInterval(p.current), p.current = null)
        }, []),
        N = (0, a.useCallback)((e, t) => {
          let o = eY();
          if (t) o?.executeSkill(t);
          else switch (e) {
            case "dash":
              o?.dash();
              break;
            case "shield":
              o?.shield();
              break;
            case "special":
              o?.special()
          }
        }, []),
        A = (0, a.useCallback)(() => {
          eJ(15);
          let e = eY();
          e?.pause()
        }, []);
      return (0, a.useEffect)(() => () => {
        p.current && clearInterval(p.current)
      }, []), (0, o.jsxs)("div", {
        className: "absolute inset-0 z-20 pointer-events-none select-none",
        style: {
          touchAction: "none"
        },
        children: [(0, o.jsx)("div", {
          className: "absolute pointer-events-auto",
          style: {
            left: 12,
            bottom: 18,
            touchAction: "none"
          },
          children: (0, o.jsxs)("div", {
            ref: x,
            className: "relative rounded-full",
            style: {
              width: 130,
              height: 130,
              backgroundColor: c ? "rgba(0, 255, 255, 0.12)" : "rgba(0, 255, 255, 0.06)",
              border: `2.5px solid ${c?"rgba(0, 255, 255, 0.7)":"rgba(0, 255, 255, 0.35)"}`,
              boxShadow: c ?
                "0 0 20px rgba(0, 255, 255, 0.25), inset 0 0 12px rgba(0, 255, 255, 0.06)" :
                "0 0 12px rgba(0, 255, 255, 0.1), inset 0 0 8px rgba(0, 255, 255, 0.03)",
              transition: c ? "none" : "box-shadow 0.3s, background-color 0.3s, border-color 0.3s",
              animation: c ? "none" : "joystick-idle-pulse 2s ease-in-out infinite"
            },
            onTouchStart: k,
            onTouchMove: C,
            onTouchEnd: S,
            onTouchCancel: S,
            children: [(0, o.jsxs)("div", {
              className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-200",
              style: {
                opacity: .7 * !c,
                color: n,
                fontSize: 12,
                fontWeight: 900,
                letterSpacing: "0.15em",
                textShadow: "0 0 12px rgba(0, 255, 255, 0.6), 0 0 25px rgba(0, 255, 255, 0.3)"
              },
              children: [(0, o.jsx)("span", {
                children: "⬍"
              }), (0, o.jsx)("span", {
                style: {
                  fontSize: 9,
                  marginTop: 1
                },
                children: ""
              })]
            }), (0, o.jsx)("div", {
              className: "absolute left-1/2 -translate-x-1/2 pointer-events-none",
              style: {
                top: 6,
                color: c ? "rgba(0, 255, 255, 0.7)" : "rgba(0, 255, 255, 0.35)",
                fontSize: 14,
                fontWeight: 900,
                transition: "color 0.15s",
                textShadow: c ? "0 0 8px rgba(0,255,255,0.5)" : "none"
              },
              children: "▲"
            }), (0, o.jsx)("div", {
              className: "absolute left-1/2 -translate-x-1/2 pointer-events-none",
              style: {
                bottom: 6,
                color: c ? "rgba(0, 255, 255, 0.7)" : "rgba(0, 255, 255, 0.35)",
                fontSize: 14,
                fontWeight: 900,
                transition: "color 0.15s",
                textShadow: c ? "0 0 8px rgba(0,255,255,0.5)" : "none"
              },
              children: "▼"
            }), (0, o.jsx)("div", {
              className: "absolute top-1/2 -translate-y-1/2 pointer-events-none",
              style: {
                left: 6,
                color: c ? "rgba(0, 255, 255, 0.7)" : "rgba(0, 255, 255, 0.35)",
                fontSize: 14,
                fontWeight: 900,
                transition: "color 0.15s",
                textShadow: c ? "0 0 8px rgba(0,255,255,0.5)" : "none"
              },
              children: "◀"
            }), (0, o.jsx)("div", {
              className: "absolute top-1/2 -translate-y-1/2 pointer-events-none",
              style: {
                right: 6,
                color: c ? "rgba(0, 255, 255, 0.7)" : "rgba(0, 255, 255, 0.35)",
                fontSize: 14,
                fontWeight: 900,
                transition: "color 0.15s",
                textShadow: c ? "0 0 8px rgba(0,255,255,0.5)" : "none"
              },
              children: "▶"
            }), (0, o.jsx)("div", {
              className: "absolute pointer-events-none",
              style: {
                left: "50%",
                top: 0,
                bottom: 0,
                width: 1,
                backgroundColor: "rgba(0, 255, 255, 0.06)",
                transform: "translateX(-50%)"
              }
            }), (0, o.jsx)("div", {
              className: "absolute pointer-events-none",
              style: {
                top: "50%",
                left: 0,
                right: 0,
                height: 1,
                backgroundColor: "rgba(0, 255, 255, 0.06)",
                transform: "translateY(-50%)"
              }
            }), (0, o.jsx)("div", {
              className: "absolute rounded-full pointer-events-none",
              style: {
                width: 50,
                height: 50,
                backgroundColor: c ? "rgba(0, 255, 255, 0.3)" : "rgba(0, 255, 255, 0.15)",
                border: `2.5px solid ${c?"rgba(0, 255, 255, 0.9)":"rgba(0, 255, 255, 0.5)"}`,
                boxShadow: c ?
                  "0 0 15px rgba(0, 255, 255, 0.4), inset 0 0 8px rgba(0, 255, 255, 0.15)" :
                  "0 0 8px rgba(0, 255, 255, 0.15), inset 0 0 5px rgba(0, 255, 255, 0.06)",
                top: "50%",
                left: "50%",
                transform: `translate(calc(-50% + ${h.x}px), calc(-50% + ${h.y}px))`,
                transition: c ? "box-shadow 0.1s, background-color 0.1s, border-color 0.1s" :
                  "transform 0.15s ease-out, box-shadow 0.2s, background-color 0.2s, border-color 0.2s"
              }
            })]
          })
        }), (0, o.jsxs)("div", {
          className: "absolute pointer-events-auto flex flex-col items-end gap-2",
          style: {
            right: 8,
            bottom: 12,
            touchAction: "none"
          },
          children: [(0, o.jsx)("div", {
            className: "flex gap-1.5 items-end",
            children: v.map(e => (0, o.jsx)(e1, {
              icon: e.icon,
              label: e.label,
              color: e.color,
              size: 52,
              cooldownFrames: e.cooldown,
              maxCooldown: e.maxCooldown,
              onPressStart: () => N(e.key, e.skillId)
            }, e.key))
          }), (0, o.jsxs)("div", {
            className: "flex gap-2 items-end",
            children: [(0, o.jsx)(e1, {
              icon: "⬆",
              label: "",
              color: s,
              size: 80,
              cooldownFrames: 0,
              maxCooldown: 0,
              onPressStart: T
            }), (0, o.jsx)(e1, {
              icon: "🔥",
              label: "",
              color: i,
              size: 76,
              cooldownFrames: 0,
              maxCooldown: 0,
              onPressStart: M,
              onPressEnd: j,
              pulseEffect: !0
            })]
          })]
        }), (0, o.jsx)("div", {
          className: "absolute pointer-events-auto",
          style: {
            top: 8,
            right: 8,
            touchAction: "none"
          },
          children: (0, o.jsx)("button", {
            className: "flex items-center justify-center rounded-xl active:scale-90 transition-transform select-none",
            style: {
              width: 44,
              height: 44,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "18px",
              touchAction: "none"
            },
            onTouchStart: e => {
              e.preventDefault(), A()
            },
            onClick: A,
            "aria-label": "Pause game",
            children: "⏸"
          })
        })]
      })
    }

    function e6() {
      let e = (0, a.useRef)(null),
        t = ea(e => e.gamePhase),
        l = ea(e => e.waitingForTap),
        r = ea(e => e.introTimer),
        n = ea(e => e.tapToStart),
        i = "playing" === t && l && r <= 0,
        s = () => {
          i && n()
        };
      return (0, o.jsxs)("div", {
        className: "fixed inset-0 overflow-hidden bg-[#050510] pointer-events-none",
        style: {
          width: "100vw",
          height: "100dvh",
          zIndex: 0
        },
        children: [(0, o.jsx)(eq, {
          ref: e
        }), "playing" === t && !l && (0, o.jsx)("div", {
          className: "pointer-events-auto",
          children: (0, o.jsx)(e5, {})
        }), i && (0, o.jsx)("div", {
          className: "absolute inset-0 z-40 flex items-center justify-center cursor-pointer select-none pointer-events-auto",
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.5)"
          },
          onClick: s,
          onTouchStart: e => {
            e.preventDefault(), s()
          },
          role: "button",
          "aria-label": "Tap to start the game",
          children: (0, o.jsxs)("div", {
            className: "flex flex-col items-center gap-4",
            children: [(0, o.jsx)("div", {
              className: "text-3xl sm:text-4xl md:text-5xl font-bold tracking-widest",
              style: {
                color: "#00ffff",
                animation: "tap-start-pulse 1.5s ease-in-out infinite"
              },
              children: "TAP TO START"
            }), (0, o.jsx)("div", {
              className: "text-sm sm:text-base tracking-wide",
              style: {
                color: "rgba(0, 255, 255, 0.5)",
                animation: "tap-start-pulse 1.5s ease-in-out infinite 0.5s"
              },
              children: "⚡ Tap anywhere to begin ⚡"
            })]
          })
        })]
      })
    }

    function e8() {
      let e = ea(e => e.score),
        t = ea(e => e.currentLevel),
        l = ea(e => e.lastLevelKills),
        r = ea(e => e.lastLevelMaxCombo),
        n = ea(e => e.lastLevelCoinsEarned),
        i = ea(e => e.retryLevel),
        s = ea(e => e.backToMenu),
        c = ea(e => e.revive),
        d = ea(e => e.canRevive),
        [h, f] = (0, a.useState)(!1),
        [u, m] = (0, a.useState)(0),
        x = (0, a.useCallback)(() => {
          h || (f(!0), m(0), eo.init(), eo.playMenuClick(), ey.getInstance().showRewardedAdWithCallbacks(() => {
            f(!1), c(), eo.playAbilityReady()
          }, e => {
            f(!1), console.log("Rewarded ad skipped:", e)
          }, e => {
            m(e)
          }))
        }, [h, c]),
        p = Math.max(0, Math.ceil((100 - u) / 20));
      return h ? (0, o.jsx)("div", {
        className: "absolute inset-0 z-30 flex items-center justify-center",
        style: {
          backgroundColor: "rgba(0,0,0,0.92)"
        },
        children: (0, o.jsxs)("div", {
          className: "text-center px-4",
          children: [(0, o.jsx)("div", {
            className: "text-base sm:text-lg font-mono font-bold mb-3",
            style: {
              color: "#ffd700",
              textShadow: "0 0 10px #ffd700"
            },
            children: "🎬 WATCH AD TO REVIVE"
          }), (0, o.jsx)("div", {
            className: "w-64 sm:w-72 h-32 sm:h-40 rounded-lg mx-auto mb-3 flex items-center justify-center",
            style: {
              backgroundColor: "#111",
              border: "1px solid #333"
            },
            children: (0, o.jsxs)("div", {
              children: [(0, o.jsx)("div", {
                className: "text-xl sm:text-2xl font-bold font-mono mb-1",
                style: {
                  color: "#ff3333",
                  textShadow: "0 0 10px #ff3333"
                },
                children: "REVIVE"
              }), (0, o.jsx)("div", {
                className: "text-[10px] sm:text-xs font-mono",
                style: {
                  color: "#888"
                },
                children: "Continue with FULL HP"
              })]
            })
          }), (0, o.jsx)("div", {
            className: "w-64 sm:w-72 h-3 rounded-full overflow-hidden mx-auto mb-2",
            style: {
              backgroundColor: "#222"
            },
            children: (0, o.jsx)("div", {
              className: "h-full rounded-full transition-all",
              style: {
                width: `${u}%`,
                backgroundColor: "#ffd700",
                boxShadow: "0 0 8px #ffd700"
              }
            })
          }), (0, o.jsxs)("div", {
            className: "text-xs font-mono",
            style: {
              color: "#555"
            },
            children: ["Ad playing... ", p, "s remaining"]
          })]
        })
      }) : (0, o.jsx)("div", {
        className: "absolute inset-0 z-20 overflow-y-auto",
        style: {
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          maxHeight: "100dvh",
          overscrollBehavior: "contain"
        },
        children: (0, o.jsx)("div", {
          className: "text-center pointer-events-auto px-3 max-w-md w-full mx-auto flex flex-col items-center",
          style: {
            minHeight: "100dvh",
            paddingBottom: "calc(env(safe-area-inset-bottom, 20px) + 2.5rem)"
          },
          children: (0, o.jsxs)("div", {
            className: "my-auto w-full py-6",
            children: [(0, o.jsx)("h1", {
              className: "text-3xl sm:text-5xl font-bold tracking-wider mb-2 sm:mb-4",
              style: {
                color: "#ff3333",
                textShadow: "0 0 20px #ff3333, 0 0 40px #ff3333, 0 0 80px #ff0000",
                animation: "neon-pulse 2s ease-in-out infinite"
              },
              children: "SYSTEM FAILURE"
            }), (0, o.jsx)("p", {
              className: "font-mono text-xs sm:text-sm mb-1 sm:mb-2",
              style: {
                color: "#00ffff",
                textShadow: "0 0 5px #00ffff"
              },
              children: '"That... was a glitch. But I\'m not done."      '
            }), (0, o.jsxs)("p", {
              className: "font-mono text-xs sm:text-sm mb-2 sm:mb-3",
              style: {
                color: "#00ffff",
                textShadow: "0 0 8px #00ffff"
              },
              children: ["LEVEL ", t]
            }), (0, o.jsxs)("div", {
              className: "grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-0.5 sm:gap-y-1 mb-2 sm:mb-3 mx-auto max-w-xs",
              children: [(0, o.jsxs)("div", {
                className: "text-right font-mono text-xs sm:text-sm",
                style: {
                  color: "#ff6600",
                  textShadow: "0 0 5px #ff6600"
                },
                children: ["Kills: ", l]
              }), (0, o.jsxs)("div", {
                className: "text-left font-mono text-xs sm:text-sm",
                style: {
                  color: "#ff00ff",
                  textShadow: "0 0 5px #ff00ff"
                },
                children: ["Max Combo: ", r, "x"]
              }), (0, o.jsxs)("div", {
                className: "text-right font-mono text-xs sm:text-sm",
                style: {
                  color: "#ffd700",
                  textShadow: "0 0 5px #ffd700"
                },
                children: ["Coins: +", n]
              }), (0, o.jsxs)("div", {
                className: "text-left font-mono text-xs sm:text-sm",
                style: {
                  color: "#00ff66",
                  textShadow: "0 0 5px #00ff66"
                },
                children: ["Score: ", e]
              })]
            }), (0, o.jsxs)("div", {
              className: "flex flex-col gap-2 sm:gap-3 items-center",
              children: [d && (0, o.jsxs)(o.Fragment, {
                children: [(0, o.jsx)("button", {
                  onClick: x,
                  className: "neon-btn w-60 sm:w-72 py-3 px-4 text-base sm:text-lg font-bold font-mono tracking-wider min-h-[44px]",
                  style: {
                    borderColor: "#ffd700",
                    color: "#ffd700",
                    textShadow: "0 0 10px #ffd700, 0 0 20px #ffd700",
                    background: "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,100,0,0.1))",
                    boxShadow: "0 0 20px rgba(255,215,0,0.3)",
                    animation: "neon-pulse 2s ease-in-out infinite"
                  },
                  children: "🎬 WATCH AD TO REVIVE"
                }), (0, o.jsx)("div", {
                  className: "text-[10px] sm:text-xs font-mono mb-0.5",
                  style: {
                    color: "#ffd700",
                    textShadow: "0 0 5px #ffd700"
                  },
                  children: "Continue where you died with FULL HP!"
                })]
              }), (0, o.jsx)("button", {
                onClick: i,
                className: "neon-btn w-48 sm:w-56 py-3 px-4 text-base sm:text-lg font-bold font-mono tracking-wider min-h-[44px]",
                style: {
                  borderColor: "#00ffff",
                  color: "#00ffff",
                  textShadow: "0 0 10px #00ffff"
                },
                onMouseEnter: () => {
                  eo.init(), eo.playMenuHover()
                },
                children: "↺ RETRY"
              }), (0, o.jsx)("button", {
                onClick: s,
                className: "neon-btn w-36 sm:w-48 py-2.5 px-3 text-xs sm:text-sm font-bold font-mono tracking-wider min-h-[44px]",
                style: {
                  borderColor: "#666",
                  color: "#888"
                },
                onMouseEnter: () => {
                  eo.init(), eo.playMenuHover()
                },
                children: "MAIN MENU"
              })]
            })]
          })
        })
      })
    }
    var e9 = e.i(37902);

    function e7({
      filled: e,
      delay: t
    }) {
      let [l, r] = (0, a.useState)(!1);
      return (0, a.useEffect)(() => {
        let e = setTimeout(() => r(!0), t);
        return () => clearTimeout(e)
      }, [t]), (0, o.jsx)("span", {
        className: "inline-block text-2xl sm:text-4xl transition-all duration-500",
        style: {
          opacity: +!!l,
          transform: l ? "scale(1) rotate(0deg)" : "scale(0) rotate(-180deg)",
          color: e ? "#ffd700" : "#333333",
          textShadow: e ? "0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 40px #ff8c00" : "none",
          filter: e ? "drop-shadow(0 0 6px #ffd700)" : "none",
          animation: e && l ? "star-pulse 1.5s ease-in-out infinite" : "none"
        },
        children: "★"
      })
    }

    function te() {
      let e = ea(e => e.currentLevel),
        t = ea(e => e.score),
        l = ea(e => e.totalScore),
        r = ea(e => e.saveData),
        n = ea(e => e.nextLevel),
        i = ea(e => e.retryLevel),
        s = ea(e => e.backToMenu),
        c = ea(e => e.setGamePhase),
        d = ea(e => e.lastLevelStars),
        h = ea(e => e.lastLevelKills),
        f = ea(e => e.lastLevelMaxCombo),
        u = ea(e => e.lastLevelCoinsEarned),
        m = ea(e => e.lastLevelHealthPct),
        x = ea(e => e.lastLevelTotalEnemies),
        p = P.filter(t => "level" === t.unlockMethod && t.unlockLevel === e),
        [g, y] = (0, a.useState)(() => {
          let e = ey.getInstance().onLevelComplete();
          return e && eo.init(), e
        }),
        [b, v] = (0, a.useState)(0),
        [w, k] = (0, a.useState)(!1),
        [C, S] = (0, a.useState)(!1),
        [T, M] = (0, a.useState)(!1),
        [j, N] = (0, a.useState)(0),
        A = e <= G.length ? G.find(t => t.id === e) : U(e),
        R = e >= 100,
        I = u || Math.floor(t / 5);
      (0, a.useEffect)(() => {
        if (!g) return;
        let e = ey.getInstance(),
          t = !1;
        return e.showInterstitialAd(e => {
          !t && (v(e), e >= 20 && k(!0))
        }).then(() => {
          t || (y(!1), eo.init(), eo.playCoinCollect())
        }), () => {
          t = !0
        }
      }, [g]);
      let E = (0, a.useCallback)(() => {
          C || T || (M(!0), N(0), eo.init(), ey.getInstance().showRewardedAdWithCallbacks(() => {
            M(!1), S(!0), eo.playCoinCollect()
          }, e => {
            M(!1), console.log("Bonus ad skipped:", e)
          }, e => {
            N(e)
          }))
        }, [C, T]),
        L = Math.max(0, Math.ceil((100 - b) / 20));
      return g ? (0, o.jsx)("div", {
        className: "absolute inset-0 z-30 flex items-center justify-center",
        style: {
          backgroundColor: "rgba(0,0,0,0.92)"
        },
        children: (0, o.jsxs)("div", {
          className: "text-center px-4",
          children: [(0, o.jsx)("div", {
            className: "text-base sm:text-lg font-mono font-bold mb-3",
            style: {
              color: "#ffd700",
              textShadow: "0 0 10px #ffd700"
            },
            children: "🎬 ADVERTISEMENT"
          }), (0, o.jsx)("div", {
            className: "w-64 sm:w-72 h-32 sm:h-40 rounded-lg mx-auto mb-3 flex items-center justify-center",
            style: {
              backgroundColor: "#111",
              border: "1px solid #333"
            },
            children: (0, o.jsxs)("div", {
              children: [(0, o.jsx)("div", {
                className: "text-xl sm:text-2xl font-bold font-mono mb-1",
                style: {
                  color: "#00ffff",
                  textShadow: "0 0 10px #00ffff"
                },
                children: "NEON STICKMAN"
              }), (0, o.jsx)("div", {
                className: "text-[10px] sm:text-xs font-mono",
                style: {
                  color: "#888"
                },
                children: "Stick War — Coming Soon"
              })]
            })
          }), (0, o.jsx)("div", {
            className: "w-64 sm:w-72 h-2 rounded-full overflow-hidden mx-auto mb-2",
            style: {
              backgroundColor: "#222"
            },
            children: (0, o.jsx)("div", {
              className: "h-full rounded-full transition-all",
              style: {
                width: `${b}%`,
                backgroundColor: "#ffd700",
                boxShadow: "0 0 8px #ffd700"
              }
            })
          }), w ? (0, o.jsx)("button", {
            onClick: () => {
              y(!1), eo.init(), eo.playCoinCollect()
            },
            className: "text-xs font-mono px-4 py-1.5 rounded min-h-[44px]",
            style: {
              color: "#888",
              border: "1px solid #444"
            },
            children: "SKIP AD ▶"
          }) : (0, o.jsxs)("div", {
            className: "text-xs font-mono",
            style: {
              color: "#555"
            },
            children: ["Ad playing... ", L, "s"]
          })]
        })
      }) : T ? (0, o.jsx)("div", {
        className: "absolute inset-0 z-30 flex items-center justify-center",
        style: {
          backgroundColor: "rgba(0,0,0,0.92)"
        },
        children: (0, o.jsxs)("div", {
          className: "text-center px-4",
          children: [(0, o.jsx)("div", {
            className: "text-base sm:text-lg font-mono font-bold mb-3",
            style: {
              color: "#ffd700",
              textShadow: "0 0 10px #ffd700"
            },
            children: "🎬 WATCHING AD FOR 2X COINS"
          }), (0, o.jsx)("div", {
            className: "w-64 sm:w-72 h-32 sm:h-40 rounded-lg mx-auto mb-3 flex items-center justify-center",
            style: {
              backgroundColor: "#111",
              border: "1px solid #333"
            },
            children: (0, o.jsxs)("div", {
              children: [(0, o.jsx)("div", {
                className: "text-xl sm:text-2xl font-bold font-mono mb-1",
                style: {
                  color: "#ffd700",
                  textShadow: "0 0 10px #ffd700"
                },
                children: "2X BONUS"
              }), (0, o.jsx)("div", {
                className: "text-[10px] sm:text-xs font-mono",
                style: {
                  color: "#888"
                },
                children: "Double your coins!"
              })]
            })
          }), (0, o.jsx)("div", {
            className: "w-64 sm:w-72 h-3 rounded-full mx-auto mb-3",
            style: {
              backgroundColor: "#222",
              border: "1px solid #444"
            },
            children: (0, o.jsx)("div", {
              className: "h-full rounded-full transition-all duration-100",
              style: {
                width: `${j}%`,
                backgroundColor: "#00ffff",
                boxShadow: "0 0 10px #00ffff"
              }
            })
          }), (0, o.jsx)("div", {
            className: "text-sm font-mono",
            style: {
              color: "#888"
            },
            children: j < 100 ? "Please wait..." : "✅ 2x Bonus unlocked!"
          })]
        })
      }) : (0, o.jsxs)("div", {
        style: {
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          maxHeight: "100dvh",
          overscrollBehavior: "contain"
        },
        className: "jsx-64a063c0fb59431f absolute inset-0 z-20 overflow-y-auto",
        children: [(0, o.jsx)("div", {
          style: {
            minHeight: "100dvh",
            paddingBottom: "calc(env(safe-area-inset-bottom, 20px) + 2.5rem)"
          },
          className: "jsx-64a063c0fb59431f text-center pointer-events-auto px-3 max-w-md w-full mx-auto flex flex-col items-center",
          children: (0, o.jsxs)("div", {
            className: "jsx-64a063c0fb59431f my-auto w-full py-6",
            children: [(0, o.jsx)("h1", {
              style: {
                color: "#00ff66",
                textShadow: "0 0 20px #00ff66, 0 0 40px #00ff66, 0 0 80px #00ff66",
                animation: "neon-pulse 2s ease-in-out infinite"
              },
              className: "jsx-64a063c0fb59431f text-2xl sm:text-4xl font-bold tracking-wider mb-1 sm:mb-2",
              children: "ZONE CLEARED"
            }), (0, o.jsxs)("p", {
              style: {
                color: "#00ffff",
                textShadow: "0 0 5px #00ffff"
              },
              className: "jsx-64a063c0fb59431f font-mono text-xs sm:text-sm mb-2",
              children: [A?.chapter, " — ", A?.name]
            }), (0, o.jsxs)("div", {
              className: "jsx-64a063c0fb59431f flex justify-center gap-1 sm:gap-2 mb-2",
              children: [(0, o.jsx)(e7, {
                filled: d >= 1,
                delay: 300
              }), (0, o.jsx)(e7, {
                filled: d >= 2,
                delay: 600
              }), (0, o.jsx)(e7, {
                filled: d >= 3,
                delay: 900
              })]
            }), (0, o.jsxs)("div", {
              className: "jsx-64a063c0fb59431f grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-0.5 sm:gap-y-1 mb-2 mx-auto max-w-xs",
              children: [(0, o.jsxs)("div", {
                style: {
                  color: "#ff6600",
                  textShadow: "0 0 5px #ff6600"
                },
                className: "jsx-64a063c0fb59431f text-right font-mono text-xs sm:text-sm",
                children: ["Kills: ", h, "/", x]
              }), (0, o.jsxs)("div", {
                style: {
                  color: "#00ff66",
                  textShadow: "0 0 5px #00ff66"
                },
                className: "jsx-64a063c0fb59431f text-left font-mono text-xs sm:text-sm",
                children: ["Health: ", m, "%"]
              }), (0, o.jsxs)("div", {
                style: {
                  color: "#ffff00",
                  textShadow: "0 0 5px #ffff00"
                },
                className: "jsx-64a063c0fb59431f text-right font-mono text-xs sm:text-sm",
                children: ["Combo: ", f, "x"]
              }), (0, o.jsxs)("div", {
                style: {
                  color: "#ffd700",
                  textShadow: "0 0 5px #ffd700"
                },
                className: "jsx-64a063c0fb59431f text-left font-mono text-xs sm:text-sm",
                children: ["Coins: +", I]
              })]
            }), (0, o.jsxs)("p", {
              style: {
                color: "#ff6600",
                textShadow: "0 0 10px #ff6600"
              },
              className: "jsx-64a063c0fb59431f font-mono text-base sm:text-lg mb-0.5",
              children: ["Score: ", t]
            }), (0, o.jsxs)("p", {
              style: {
                color: "#ffd700",
                textShadow: "0 0 10px #ffd700"
              },
              className: "jsx-64a063c0fb59431f font-mono text-xs sm:text-sm mb-0.5",
              children: ["+", I, " COINS", C && (0, o.jsxs)("span", {
                style: {
                  color: "#ff6600"
                },
                className: "jsx-64a063c0fb59431f",
                children: [" +", I, " BONUS!"]
              })]
            }), (0, o.jsxs)("p", {
              style: {
                color: "#aa00ff",
                textShadow: "0 0 5px #aa00ff"
              },
              className: "jsx-64a063c0fb59431f font-mono text-[10px] sm:text-xs mb-2",
              children: ["Total: ", l, " | Coins: ", r.totalCoins + (C ? I : 0)]
            }), !C && !R && (0, o.jsx)("button", {
              onClick: E,
              style: {
                borderColor: "#ffd700",
                color: "#ffd700",
                textShadow: "0 0 8px #ffd700, 0 0 16px #ffd700",
                background: "linear-gradient(135deg, rgba(255,215,0,0.12), rgba(255,102,0,0.08))",
                boxShadow: "0 0 12px rgba(255,215,0,0.2)"
              },
              onMouseEnter: () => {
                eo.init(), eo.playMenuHover()
              },
              className: "jsx-64a063c0fb59431f neon-btn w-56 sm:w-64 py-2.5 px-3 text-xs sm:text-sm font-bold font-mono tracking-wider mb-2 min-h-[44px]",
              children: "🎬 WATCH AD FOR 2X COINS"
            }), C && (0, o.jsx)("div", {
              style: {
                color: "#00ff66"
              },
              className: "jsx-64a063c0fb59431f font-mono text-xs sm:text-sm mb-2",
              children: "BONUS CLAIMED!"
            }), p.length > 0 && (0, o.jsxs)("div", {
              style: {
                backgroundColor: "rgba(255,102,0,0.1)",
                border: "1px solid rgba(255,102,0,0.4)"
              },
              className: "jsx-64a063c0fb59431f mb-2 p-2 sm:p-3 rounded-lg mx-auto max-w-sm",
              children: [(0, o.jsx)("div", {
                style: {
                  color: "#ff6600",
                  textShadow: "0 0 8px #ff6600"
                },
                className: "jsx-64a063c0fb59431f text-[10px] sm:text-xs font-mono font-bold mb-1",
                children: "NEW SKILL UNLOCKED!"
              }), p.map(e => (0, o.jsxs)("div", {
                className: "jsx-64a063c0fb59431f flex items-center gap-1.5 sm:gap-2 mb-0.5",
                children: [(0, o.jsx)("div", {
                  style: {
                    backgroundColor: e.color,
                    boxShadow: `0 0 8px ${e.glowColor}`
                  },
                  className: "jsx-64a063c0fb59431f w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                }), (0, o.jsxs)("div", {
                  className: "jsx-64a063c0fb59431f text-left",
                  children: [(0, o.jsx)("span", {
                    style: {
                      color: e.color
                    },
                    className: "jsx-64a063c0fb59431f font-mono text-[10px] sm:text-xs font-bold",
                    children: e.name
                  }), (0, o.jsx)("span", {
                    style: {
                      color: "#888"
                    },
                    className: "jsx-64a063c0fb59431f font-mono text-[8px] sm:text-[9px] ml-1",
                    children: e.element.toUpperCase()
                  }), (0, o.jsx)("p", {
                    style: {
                      color: "#666"
                    },
                    className: "jsx-64a063c0fb59431f font-mono text-[7px] sm:text-[8px]",
                    children: e.description
                  })]
                })]
              }, e.id)), (0, o.jsx)("div", {
                style: {
                  color: "#aaa"
                },
                className: "jsx-64a063c0fb59431f font-mono text-[8px] sm:text-[9px] mt-1",
                children: "Go to SKILLS to equip!"
              })]
            }), (0, o.jsxs)("div", {
              className: "jsx-64a063c0fb59431f flex flex-col gap-1.5 sm:gap-2 items-center",
              children: [!R && (0, o.jsx)("button", {
                onClick: () => {
                  eo.init(), eo.playMenuClick(), n()
                },
                style: {
                  borderColor: "#00ff66",
                  color: "#00ff66",
                  textShadow: "0 0 10px #00ff66, 0 0 20px #00ff66, 0 0 40px #00ff66",
                  boxShadow: "0 0 20px rgba(0,255,102,0.4), 0 0 40px rgba(0,255,102,0.15), inset 0 0 20px rgba(0,255,102,0.1)",
                  background: "linear-gradient(135deg, rgba(0,255,102,0.15), rgba(0,255,102,0.05))",
                  animation: "neon-pulse 2s ease-in-out infinite"
                },
                onMouseEnter: () => {
                  eo.init(), eo.playMenuHover()
                },
                className: "jsx-64a063c0fb59431f neon-btn w-56 sm:w-64 py-3 px-4 text-lg sm:text-2xl font-bold font-mono tracking-wider min-h-[44px]",
                children: "▶ PLAY NEXT"
              }), (0, o.jsx)("button", {
                onClick: () => {
                  eo.init(), eo.playMenuClick(), i()
                },
                style: {
                  borderColor: "#ff6600",
                  color: "#ff6600",
                  textShadow: "0 0 8px #ff6600"
                },
                onMouseEnter: () => {
                  eo.init(), eo.playMenuHover()
                },
                className: "jsx-64a063c0fb59431f neon-btn w-40 sm:w-48 py-2.5 px-3 text-sm sm:text-base font-bold font-mono tracking-wider min-h-[44px]",
                children: "↻ RETRY"
              }), (0, o.jsx)("button", {
                onClick: () => {
                  eo.init(), eo.playMenuClick(), c("level-map")
                },
                style: {
                  borderColor: "#00ffff",
                  color: "#00ffff",
                  textShadow: "0 0 8px #00ffff"
                },
                onMouseEnter: () => {
                  eo.init(), eo.playMenuHover()
                },
                className: "jsx-64a063c0fb59431f neon-btn w-40 sm:w-48 py-2.5 px-3 text-sm sm:text-base font-bold font-mono tracking-wider min-h-[44px]",
                children: "LEVEL MAP"
              }), r.unlockedSkills.length > 0 && (0, o.jsx)("button", {
                onClick: () => {
                  eo.init(), eo.playMenuClick(), c("skill-shop")
                },
                style: {
                  borderColor: "#ff6600",
                  color: "#ff6600",
                  textShadow: "0 0 8px #ff6600"
                },
                onMouseEnter: () => {
                  eo.init(), eo.playMenuHover()
                },
                className: "jsx-64a063c0fb59431f neon-btn w-40 sm:w-48 py-2.5 px-3 text-sm sm:text-base font-bold font-mono tracking-wider min-h-[44px]",
                children: "SKILLS"
              }), (0, o.jsx)("button", {
                onClick: () => {
                  eo.init(), eo.playMenuClick(), s()
                },
                style: {
                  borderColor: "#666",
                  color: "#888"
                },
                onMouseEnter: () => {
                  eo.init(), eo.playMenuHover()
                },
                className: "jsx-64a063c0fb59431f neon-btn w-32 sm:w-40 py-2 px-3 text-xs sm:text-sm font-bold font-mono tracking-wider mt-0.5 min-h-[44px]",
                children: "MAIN MENU"
              })]
            })]
          })
        }), (0, o.jsx)(e9.default, {
          id: "64a063c0fb59431f",
          children: "@keyframes star-pulse{0%,to{transform:scale(1)}50%{transform:scale(1.15)}}"
        })]
      })
    }

    function tt() {
      let e = ea(e => e.totalScore),
        t = ea(e => e.currentLevel),
        a = ea(e => e.backToMenu),
        l = ea(e => e.nextLevel);
      return ea(e => e.setGamePhase), (0, o.jsx)("div", {
        className: "absolute inset-0 z-20 flex items-center justify-center pointer-events-none",
        children: (0, o.jsxs)("div", {
          className: "text-center pointer-events-auto",
          children: [(0, o.jsx)("h1", {
            className: "text-5xl sm:text-7xl font-bold tracking-wider mb-4",
            style: {
              color: "#00ff66",
              textShadow: "0 0 20px #00ff66, 0 0 40px #00ff66, 0 0 80px #00ff66",
              animation: "neon-pulse 2s ease-in-out infinite"
            },
            children: "VICTORY"
          }), (0, o.jsx)("p", {
            className: "font-mono text-sm mb-2",
            style: {
              color: "#00ffff",
              textShadow: "0 0 5px #00ffff"
            },
            children: '"Lights back on. Grid\'s running. I could use a reboot."      '
          }), (0, o.jsx)("p", {
            className: "font-mono text-xs mb-6",
            style: {
              color: "#aa00ff",
              textShadow: "0 0 5px #aa00ff"
            },
            children: "— Spark"
          }), (0, o.jsxs)("p", {
            className: "font-mono text-2xl mb-8",
            style: {
              color: "#ff6600",
              textShadow: "0 0 10px #ff6600"
            },
            children: ["Final Score: ", e]
          }), (0, o.jsxs)("div", {
            className: "flex flex-col gap-3 items-center",
            children: [t >= 100 ? (0, o.jsx)("button", {
              onClick: a,
              className: "neon-btn w-64 py-4 px-8 text-2xl font-bold font-mono tracking-wider",
              style: {
                borderColor: "#ffaa00",
                color: "#ffaa00",
                textShadow: "0 0 10px #ffaa00, 0 0 20px #ffaa00",
                boxShadow: "0 0 20px rgba(255,170,0,0.4), 0 0 40px rgba(255,170,0,0.15)",
                background: "linear-gradient(135deg, rgba(255,170,0,0.15), rgba(255,170,0,0.05))"
              },
              onMouseEnter: () => {
                eo.init(), eo.playMenuHover()
              },
              children: "🏆 ALL LEVELS COMPLETE"
            }) : (0, o.jsx)("button", {
              onClick: () => {
                eo.init(), eo.playMenuClick(), l()
              },
              className: "neon-btn w-64 py-4 px-8 text-2xl font-bold font-mono tracking-wider",
              style: {
                borderColor: "#00ff66",
                color: "#00ff66",
                textShadow: "0 0 10px #00ff66, 0 0 20px #00ff66, 0 0 40px #00ff66",
                boxShadow: "0 0 20px rgba(0,255,102,0.4), 0 0 40px rgba(0,255,102,0.15), inset 0 0 20px rgba(0,255,102,0.1)",
                background: "linear-gradient(135deg, rgba(0,255,102,0.15), rgba(0,255,102,0.05))",
                animation: "neon-pulse 2s ease-in-out infinite"
              },
              onMouseEnter: () => {
                eo.init(), eo.playMenuHover()
              },
              children: "▶ PLAY NEXT"
            }), (0, o.jsx)("button", {
              onClick: a,
              className: "neon-btn w-48 py-3 px-6 text-lg font-bold font-mono tracking-wider",
              style: {
                borderColor: "#666",
                color: "#888"
              },
              onMouseEnter: () => {
                eo.init(), eo.playMenuHover()
              },
              children: "MAIN MENU"
            })]
          })]
        })
      })
    }
    let to = {
      cityPan: {
        bg: "#050520",
        accent: n,
        icon: "🌆"
      },
      kidnapping: {
        bg: "#200510",
        accent: f,
        icon: "⚡"
      },
      blueWakes: {
        bg: "#050515",
        accent: n,
        icon: "💙"
      },
      blueAngry: {
        bg: "#150505",
        accent: f,
        icon: "🔥"
      },
      shadowAppears: {
        bg: "#100515",
        accent: h,
        icon: "👤"
      },
      handshake: {
        bg: "#051010",
        accent: n,
        icon: "🤝"
      },
      gangForming: {
        bg: "#050a10",
        accent: m,
        icon: "⚔️"
      },
      lunaCaptured: {
        bg: "#150510",
        accent: x,
        icon: "🔒"
      },
      blueSeesLuna: {
        bg: "#050a10",
        accent: n,
        icon: "💫"
      },
      motherThreat: {
        bg: "#100505",
        accent: c,
        icon: "⚠️"
      },
      protectMother: {
        bg: "#050510",
        accent: n,
        icon: "🛡️"
      },
      bossIntro: {
        bg: "#150505",
        accent: f,
        icon: "💀"
      },
      bossDefeated: {
        bg: "#051005",
        accent: s,
        icon: "🏆"
      },
      reunion: {
        bg: "#050510",
        accent: x,
        icon: "💖"
      },
      victoryCelebration: {
        bg: "#050a05",
        accent: m,
        icon: "🎉"
      },
      revive: {
        bg: "#050510",
        accent: n,
        icon: "⚡"
      },
      gangJoin: {
        bg: "#050a10",
        accent: s,
        icon: "✊"
      },
      walking: {
        bg: "#050510",
        accent: n,
        icon: "🚶"
      },
      warScene: {
        bg: "#150505",
        accent: c,
        icon: "⚔️"
      },
      darkRevelation: {
        bg: "#100510",
        accent: h,
        icon: "👁️"
      },
      betrayal: {
        bg: "#150505",
        accent: f,
        icon: "💔"
      },
      flashback: {
        bg: "#0a0515",
        accent: "#8888ff",
        icon: "💭"
      },
      lunaVision: {
        bg: "#050510",
        accent: x,
        icon: "🔮"
      },
      shadowPast: {
        bg: "#0a0515",
        accent: h,
        icon: "🌑"
      },
      motherSecret: {
        bg: "#050a0a",
        accent: "#44ddaa",
        icon: "🤫"
      },
      voidRift: {
        bg: "#0a0515",
        accent: i,
        icon: "🌀"
      },
      mysteryFigure: {
        bg: "#050510",
        accent: "#ff0044",
        icon: "❓"
      },
      sacrifice: {
        bg: "#150505",
        accent: m,
        icon: "🕊️"
      },
      truthRevealed: {
        bg: "#050510",
        accent: m,
        icon: "💡"
      },
      darkCorridor: {
        bg: "#050508",
        accent: "#666",
        icon: "🚪"
      },
      explosion: {
        bg: "#150800",
        accent: c,
        icon: "💥"
      },
      silentPrayer: {
        bg: "#050510",
        accent: n,
        icon: "🙏"
      },
      stormApproaching: {
        bg: "#050510",
        accent: d,
        icon: "⛈️"
      },
      hiddenBase: {
        bg: "#050808",
        accent: "#44ddaa",
        icon: "🏗️"
      },
      theDeal: {
        bg: "#100505",
        accent: m,
        icon: "🤝"
      },
      lastStand: {
        bg: "#150505",
        accent: f,
        icon: "🗡️"
      },
      newDawn: {
        bg: "#050a05",
        accent: m,
        icon: "🌅"
      },
      gangOath: {
        bg: "#050510",
        accent: n,
        icon: "✊"
      },
      redKingPlan: {
        bg: "#150505",
        accent: f,
        icon: "👑"
      }
    };

    function ta() {
      let e = ea(e => e.currentCutscene),
        t = ea(e => e.cutsceneFrameIndex),
        l = ea(e => e.advanceCutscene),
        r = ea(e => e.skipCutscene),
        [i, s] = (0, a.useState)(0),
        [c, d] = (0, a.useState)(!0),
        [h, f] = (0, a.useState)("in"),
        u = (0, a.useRef)(null),
        m = (0, a.useRef)(null),
        x = (0, a.useRef)(!0),
        p = (0, a.useRef)(void 0),
        g = e?.frames[t];
      e?.frames.length;
      let y = g && to[g.scene] || {
        bg: "#050510",
        accent: n,
        icon: "🎬"
      };
      p.current = g, x.current = c;
      let b = (0, a.useCallback)(() => {
        let e = p.current;
        if (e) {
          if (x.current) {
            s(e.dialogue.length), d(!1), x.current = !1, u.current && clearTimeout(u.current), u.current =
              setTimeout(() => {
                f("out"), setTimeout(() => l(), 200)
              }, 1500);
            return
          }
          f("out"), setTimeout(() => l(), 200)
        }
      }, [l]);
      if ((0, a.useEffect)(() => {
          if (!g) return;
          s(0), d(!0), x.current = !0, f("in");
          let e = g.dialogue,
            t = 0;
          m.current && clearInterval(m.current), m.current = setInterval(() => {
            s(++t), t >= e.length && (m.current && clearInterval(m.current), d(!1), x.current = !1)
          }, 30);
          let o = setTimeout(() => f("visible"), 300);
          return u.current && clearTimeout(u.current), u.current = setTimeout(() => {
            b()
          }, g.duration * (1e3 / 60)), () => {
            m.current && clearInterval(m.current), clearTimeout(o), u.current && clearTimeout(u.current)
          }
        }, [t, e?.id, g, b]), !e || !g) return null;
      let v = g.dialogue.slice(0, i),
        w = g.speakerColor || y.accent;
      return (0, o.jsxs)("div", {
        className: "absolute inset-0 z-40 flex flex-col items-center justify-center cursor-pointer select-none",
        style: {
          backgroundColor: y.bg,
          opacity: "in" === h ? .7 : "out" === h ? .3 : 1,
          transition: "opacity 0.3s ease"
        },
        onClick: b,
        onTouchStart: e => {
          e.preventDefault(), b()
        },
        role: "button",
        "aria-label": "Tap to advance cutscene",
        children: [(0, o.jsx)("div", {
          className: "absolute inset-0 pointer-events-none",
          style: {
            background: `radial-gradient(ellipse at center, ${y.accent}08 0%, transparent 70%)`
          }
        }), (0, o.jsx)("div", {
          className: "absolute inset-0 pointer-events-none overflow-hidden",
          children: Array.from({
            length: 12
          }).map((e, t) => (0, o.jsx)("div", {
            className: "absolute rounded-full",
            style: {
              left: `${10+7*t%80}%`,
              bottom: "-10px",
              width: 2 + t % 3,
              height: 2 + t % 3,
              backgroundColor: t % 2 == 0 ? y.accent : `${y.accent}80`,
              boxShadow: `0 0 ${4+t%4}px ${y.accent}40`,
              animation: `particle-float ${6+t%8}s linear ${t%5}s infinite`,
              "--drift": `${-10+7*t%20}px`
            }
          }, t))
        }), (0, o.jsx)("div", {
          className: "text-4xl sm:text-5xl mb-4",
          style: {
            filter: `drop-shadow(0 0 15px ${y.accent})`,
            animation: "neon-pulse 3s ease-in-out infinite"
          },
          children: y.icon
        }), (0, o.jsx)("div", {
          className: "text-sm sm:text-base font-bold font-mono tracking-widest mb-2 px-3 py-1 rounded",
          style: {
            color: w,
            textShadow: `0 0 10px ${w}, 0 0 20px ${w}40`,
            backgroundColor: `${w}10`,
            border: `1px solid ${w}30`
          },
          children: g.speaker
        }), (0, o.jsx)("div", {
          className: "text-center px-8 max-w-lg",
          children: (0, o.jsxs)("p", {
            className: "text-lg sm:text-2xl font-bold font-mono tracking-wide leading-relaxed",
            style: {
              color: "#e0e0e0",
              textShadow: `0 0 8px ${y.accent}40`
            },
            children: [v, c && (0, o.jsx)("span", {
              className: "inline-block w-2 h-5 ml-1 align-middle",
              style: {
                backgroundColor: y.accent,
                animation: "blink 0.6s step-end infinite"
              }
            })]
          })
        }), (0, o.jsx)("div", {
          className: "flex gap-2 mt-6",
          children: e.frames.map((e, a) => (0, o.jsx)("div", {
            className: "w-2 h-2 rounded-full transition-all duration-300",
            style: {
              backgroundColor: a < t || a === t ? y.accent : "#333",
              boxShadow: a === t ? `0 0 8px ${y.accent}` : "none",
              transform: a === t ? "scale(1.3)" : "scale(1)"
            }
          }, a))
        }), (0, o.jsx)("div", {
          className: "text-xs font-mono mt-8",
          style: {
            color: "#444",
            animation: "neon-pulse 2s ease-in-out infinite"
          },
          children: "TAP TO CONTINUE"
        }), (0, o.jsx)("button", {
          className: "absolute top-3 right-3 text-[10px] font-mono px-2 py-1 rounded z-50",
          style: {
            color: "#555",
            border: "1px solid #333",
            backgroundColor: "rgba(0,0,0,0.3)"
          },
          onClick: e => {
            e.stopPropagation(), r()
          },
          onTouchStart: e => {
            e.stopPropagation(), e.preventDefault(), r()
          },
          children: "SKIP ▸▸"
        })]
      })
    }
    let tl = {
        common: "#888888",
        rare: n,
        epic: i,
        legendary: m
      },
      tr = {
        common: "COM",
        rare: "RAR",
        epic: "EPC",
        legendary: "LEG"
      };

    function tn({
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
            children: t < 100 ? "Please wait..." : "✅ Reward unlocked!"
          })]
        })
      })
    }

    function ti({
      color: e,
      glowColor: t
    }) {
      return (0, o.jsxs)("svg", {
        width: "36",
        height: "56",
        viewBox: "0 0 40 64",
        style: {
          filter: `drop-shadow(0 0 4px ${t})`,
          animation: "stickman-bob 2s ease-in-out infinite"
        },
        children: [(0, o.jsx)("circle", {
          cx: "20",
          cy: "10",
          r: "7",
          fill: "none",
          stroke: e,
          strokeWidth: "2.5"
        }), (0, o.jsx)("circle", {
          cx: "22",
          cy: "9",
          r: "1.5",
          fill: e
        }), (0, o.jsx)("line", {
          x1: "20",
          y1: "17",
          x2: "20",
          y2: "36",
          stroke: e,
          strokeWidth: "2.5"
        }), (0, o.jsx)("line", {
          x1: "20",
          y1: "23",
          x2: "9",
          y2: "30",
          stroke: e,
          strokeWidth: "2"
        }), (0, o.jsx)("line", {
          x1: "20",
          y1: "23",
          x2: "31",
          y2: "30",
          stroke: e,
          strokeWidth: "2"
        }), (0, o.jsx)("line", {
          x1: "20",
          y1: "36",
          x2: "12",
          y2: "54",
          stroke: e,
          strokeWidth: "2"
        }), (0, o.jsx)("line", {
          x1: "20",
          y1: "36",
          x2: "28",
          y2: "54",
          stroke: e,
          strokeWidth: "2"
        })]
      })
    }

    function ts({
      color: e,
      glowColor: t
    }) {
      return (0, o.jsxs)("svg", {
        width: "32",
        height: "32",
        viewBox: "0 0 40 40",
        style: {
          filter: `drop-shadow(0 0 3px ${t})`
        },
        children: [(0, o.jsx)("circle", {
          cx: "20",
          cy: "15",
          r: "8",
          fill: "none",
          stroke: e,
          strokeWidth: "2"
        }), (0, o.jsx)("circle", {
          cx: "22",
          cy: "13",
          r: "2",
          fill: t
        }), (0, o.jsx)("ellipse", {
          cx: "20",
          cy: "30",
          rx: "10",
          ry: "6",
          fill: "none",
          stroke: e,
          strokeWidth: "2"
        }), (0, o.jsx)("line", {
          x1: "12",
          y1: "34",
          x2: "8",
          y2: "39",
          stroke: e,
          strokeWidth: "1.5"
        }), (0, o.jsx)("line", {
          x1: "28",
          y1: "34",
          x2: "32",
          y2: "39",
          stroke: e,
          strokeWidth: "1.5"
        })]
      })
    }

    function tc() {
      let e = ea(e => e.saveData),
        t = ea(e => e.buySkin),
        l = ea(e => e.selectSkin),
        r = ea(e => e.buyPetSkin),
        c = ea(e => e.selectPetSkin),
        d = ea(e => e.addCoinsReward),
        h = ea(e => e.backToMenu),
        [f, u] = (0, a.useState)("character"),
        [x, p] = (0, a.useState)(!1),
        [g, y] = (0, a.useState)(null),
        b = (0, a.useCallback)(e => {
          eo.init(), eo.playMenuClick(), e()
        }, []),
        k = (0, a.useCallback)(e => {
          p(!0), y(() => e)
        }, []),
        S = (0, a.useCallback)(() => {
          p(!1), d(200), eo.playCoinCollect(), g && (g(), y(null))
        }, [g, d]),
        T = (0, a.useCallback)(() => {
          k(() => {})
        }, [k]),
        M = (0, a.useMemo)(() => {
          let e = {};
          for (let t of w) e[t.petId] || (e[t.petId] = []), e[t.petId].push(t);
          return e
        }, []),
        j = (0, a.useMemo)(() => new Set(e.unlockedPets), [e.unlockedPets]),
        N = (0, a.useCallback)(a => {
          let r = e.unlockedSkins.includes(a.id),
            c = e.currentSkin === a.id,
            d = e.totalCoins >= a.price,
            h = 0 === a.price,
            f = tl[a.rarity] || "#888888";
          return (0, o.jsxs)("div", {
            className: "rounded-lg flex flex-col items-center p-2 relative",
            style: {
              width: "120px",
              minWidth: "120px",
              backgroundColor: c ? `${a.color}15` : r ? `${a.color}08` : "rgba(0,0,0,0.3)",
              border: `2px solid ${c?a.color:r?`${a.color}60`:"#333"}`,
              boxShadow: c ? `0 0 12px ${a.color}40, inset 0 0 12px ${a.color}10` : "none"
            },
            children: [(0, o.jsx)("div", {
              className: "absolute top-1 right-1 text-[7px] font-bold font-mono px-1.5 py-0.5 rounded-full",
              style: {
                backgroundColor: `${f}30`,
                color: f,
                border: `1px solid ${f}60`
              },
              children: tr[a.rarity]
            }), (0, o.jsx)("div", {
              className: "flex justify-center mb-1 mt-1",
              children: (0, o.jsx)(ti, {
                color: a.color,
                glowColor: a.glowColor
              })
            }), (0, o.jsx)("div", {
              className: "font-bold text-[10px] font-mono mb-1 text-center leading-tight",
              style: {
                color: a.color
              },
              children: a.name
            }), a.effect && (0, o.jsxs)("div", {
              className: "text-[7px] font-mono font-bold mb-1 px-1.5 py-0.5 rounded-full",
              style: {
                backgroundColor: `${i}15`,
                color: i,
                border: `1px solid ${i}40`
              },
              children: ["✨ ", a.effect.toUpperCase()]
            }), (0, o.jsx)("div", {
              className: "w-full mt-auto",
              children: c ? (0, o.jsx)("div", {
                className: "text-[10px] font-mono font-bold py-2 px-2 rounded text-center",
                style: {
                  color: s,
                  backgroundColor: "rgba(0,255,102,0.12)",
                  border: "2px solid rgba(0,255,102,0.5)",
                  textShadow: "0 0 8px rgba(0,255,102,0.6)",
                  boxShadow: "0 0 10px rgba(0,255,102,0.2), inset 0 0 8px rgba(0,255,102,0.05)",
                  minHeight: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                },
                children: "✓ EQUIPPED"
              }) : r ? (0, o.jsx)("button", {
                onClick: () => b(() => l(a.id)),
                className: "w-full text-[11px] font-mono font-bold py-2 px-2 rounded",
                style: {
                  minHeight: 36,
                  backgroundColor: "rgba(0,255,102,0.12)",
                  border: "2px solid rgba(0,255,102,0.7)",
                  color: "#ffffff",
                  textShadow: "0 0 6px rgba(0,255,102,0.5)",
                  boxShadow: "0 0 8px rgba(0,255,102,0.15)",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                },
                onMouseEnter: e => {
                  e.currentTarget.style.backgroundColor = "rgba(0,255,102,0.2)", e.currentTarget
                    .style.boxShadow = "0 0 15px rgba(0,255,102,0.3)"
                },
                onMouseLeave: e => {
                  e.currentTarget.style.backgroundColor = "rgba(0,255,102,0.12)", e.currentTarget
                    .style.boxShadow = "0 0 8px rgba(0,255,102,0.15)"
                },
                children: "▶ EQUIP"
              }) : (0, o.jsxs)("div", {
                className: "flex flex-col gap-1",
                children: [(0, o.jsx)("button", {
                  onClick: () => {
                    (d || h) && b(() => {
                      t(a.id) && (l(a.id), eo.playCoinCollect())
                    })
                  },
                  className: "w-full text-[9px] font-mono font-bold py-1.5 px-1 rounded",
                  style: {
                    minHeight: 32,
                    backgroundColor: d || h ? "rgba(255,215,0,0.12)" : "rgba(0,0,0,0.2)",
                    border: `2px solid ${d||h?"#ffd700":"#444"}`,
                    color: d || h ? "#ffd700" : "#555",
                    textShadow: d || h ? "0 0 6px rgba(255,215,0,0.4)" : "none",
                    cursor: d || h ? "pointer" : "default",
                    transition: "all 0.15s ease",
                    opacity: h ? 1 : void 0
                  },
                  children: h ? "🪙 FREE" : `BUY ${a.price} 🪙`
                }), (0, o.jsx)("button", {
                  onClick: () => {
                    k(() => {
                      b(() => {
                        t(a.id) && (l(a.id), eo.playCoinCollect())
                      })
                    })
                  },
                  className: "w-full text-[9px] font-mono font-bold py-1.5 px-1 rounded",
                  style: {
                    minHeight: 32,
                    backgroundColor: "rgba(0,255,255,0.08)",
                    border: "2px solid rgba(0,255,255,0.5)",
                    color: n,
                    textShadow: "0 0 6px rgba(0,255,255,0.4)",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  },
                  onMouseEnter: e => {
                    e.currentTarget.style.backgroundColor = "rgba(0,255,255,0.15)", e
                      .currentTarget.style.boxShadow = "0 0 12px rgba(0,255,255,0.2)"
                  },
                  onMouseLeave: e => {
                    e.currentTarget.style.backgroundColor = "rgba(0,255,255,0.08)", e
                      .currentTarget.style.boxShadow = "none"
                  },
                  children: "🎬 WATCH AD"
                })]
              })
            })]
          }, a.id)
        }, [e, b, k, t, l]),
        P = (0, a.useCallback)(t => {
          let a = e.unlockedPetSkins.includes(t.id),
            l = e.currentPetSkin === t.id,
            d = e.totalCoins >= t.price,
            h = 0 === t.price,
            f = tl[t.rarity] || "#888888",
            u = v.find(e => e.id === t.petId),
            m = j.has(t.petId);
          return (0, o.jsxs)("div", {
            className: "rounded-lg flex flex-col items-center p-2 relative",
            style: {
              width: "120px",
              minWidth: "120px",
              backgroundColor: l ? `${t.color}15` : a ? `${t.color}08` : "rgba(0,0,0,0.3)",
              border: `2px solid ${l?t.color:a?`${t.color}60`:"#333"}`,
              boxShadow: l ? `0 0 12px ${t.color}40, inset 0 0 12px ${t.color}10` : "none",
              opacity: m ? 1 : .5
            },
            children: [(0, o.jsx)("div", {
              className: "absolute top-1 right-1 text-[7px] font-bold font-mono px-1.5 py-0.5 rounded-full",
              style: {
                backgroundColor: `${f}30`,
                color: f,
                border: `1px solid ${f}60`
              },
              children: tr[t.rarity]
            }), (0, o.jsx)("div", {
              className: "flex justify-center mb-1 mt-1",
              children: (0, o.jsx)(ts, {
                color: t.color,
                glowColor: t.glowColor
              })
            }), (0, o.jsx)("div", {
              className: "font-bold text-[10px] font-mono mb-0.5 text-center leading-tight",
              style: {
                color: t.color
              },
              children: t.name
            }), (0, o.jsx)("div", {
              className: "text-[7px] font-mono mb-1 text-center",
              style: {
                color: "#666"
              },
              children: u?.name || t.petId
            }), t.effect && (0, o.jsxs)("div", {
              className: "text-[7px] font-mono font-bold mb-1 px-1.5 py-0.5 rounded-full",
              style: {
                backgroundColor: `${i}15`,
                color: i,
                border: `1px solid ${i}40`
              },
              children: ["✨ ", t.effect.toUpperCase()]
            }), (0, o.jsx)("div", {
              className: "w-full mt-auto",
              children: m ? l ? (0, o.jsx)("div", {
                className: "text-[10px] font-mono font-bold py-2 px-2 rounded text-center",
                style: {
                  color: s,
                  backgroundColor: "rgba(0,255,102,0.12)",
                  border: "2px solid rgba(0,255,102,0.5)",
                  textShadow: "0 0 8px rgba(0,255,102,0.6)",
                  boxShadow: "0 0 10px rgba(0,255,102,0.2), inset 0 0 8px rgba(0,255,102,0.05)",
                  minHeight: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                },
                children: "✓ EQUIPPED"
              }) : a ? (0, o.jsx)("button", {
                onClick: () => b(() => c(t.id)),
                className: "w-full text-[11px] font-mono font-bold py-2 px-2 rounded",
                style: {
                  minHeight: 36,
                  backgroundColor: "rgba(0,255,102,0.12)",
                  border: "2px solid rgba(0,255,102,0.7)",
                  color: "#ffffff",
                  textShadow: "0 0 6px rgba(0,255,102,0.5)",
                  boxShadow: "0 0 8px rgba(0,255,102,0.15)",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                },
                children: "▶ EQUIP"
              }) : (0, o.jsxs)("div", {
                className: "flex flex-col gap-1",
                children: [(0, o.jsx)("button", {
                  onClick: () => {
                    (d || h) && b(() => {
                      r(t.id) && (c(t.id), eo.playCoinCollect())
                    })
                  },
                  className: "w-full text-[9px] font-mono font-bold py-1.5 px-1 rounded",
                  style: {
                    minHeight: 32,
                    backgroundColor: d || h ? "rgba(255,215,0,0.12)" : "rgba(0,0,0,0.2)",
                    border: `2px solid ${d||h?"#ffd700":"#444"}`,
                    color: d || h ? "#ffd700" : "#555",
                    textShadow: d || h ? "0 0 6px rgba(255,215,0,0.4)" : "none",
                    cursor: d || h ? "pointer" : "default",
                    transition: "all 0.15s ease"
                  },
                  children: h ? "🪙 FREE" : `BUY ${t.price} 🪙`
                }), (0, o.jsx)("button", {
                  onClick: () => {
                    k(() => {
                      b(() => {
                        r(t.id) && (c(t.id), eo.playCoinCollect())
                      })
                    })
                  },
                  className: "w-full text-[9px] font-mono font-bold py-1.5 px-1 rounded",
                  style: {
                    minHeight: 32,
                    backgroundColor: "rgba(0,255,255,0.08)",
                    border: "2px solid rgba(0,255,255,0.5)",
                    color: n,
                    textShadow: "0 0 6px rgba(0,255,255,0.4)",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  },
                  children: "🎬 WATCH AD"
                })]
              }) : (0, o.jsx)("div", {
                className: "text-[8px] font-mono text-center py-1.5 rounded",
                style: {
                  color: "#555",
                  backgroundColor: "rgba(0,0,0,0.2)",
                  border: "1px solid #333",
                  minHeight: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                },
                children: "🔒 UNLOCK PET FIRST"
              })
            })]
          }, t.id)
        }, [e, j, b, k, r, c]);
      return (0, o.jsxs)("div", {
        className: "absolute inset-0 z-20 flex flex-col pointer-events-auto",
        style: {
          backgroundColor: "rgba(5, 5, 20, 0.97)"
        },
        children: [x && (0, o.jsx)(tn, {
          onComplete: S
        }), (0, o.jsxs)("div", {
          className: "flex items-center justify-between px-3 py-1.5 flex-shrink-0",
          style: {
            borderBottom: "1px solid rgba(0,255,255,0.12)",
            backgroundColor: "rgba(0,0,0,0.4)"
          },
          children: [(0, o.jsx)("div", {
            className: "text-base sm:text-lg font-bold tracking-wider font-mono",
            style: {
              color: n,
              textShadow: "0 0 10px #00ffff, 0 0 20px rgba(0,255,255,0.3)"
            },
            children: "🎨 SKIN SHOP"
          }), (0, o.jsxs)("div", {
            className: "font-mono text-sm font-bold px-3 py-1 rounded-lg",
            style: {
              color: m,
              backgroundColor: "rgba(255,215,0,0.08)",
              border: "1px solid rgba(255,215,0,0.2)",
              textShadow: "0 0 8px #ffd700"
            },
            children: ["🪙 ", e.totalCoins.toLocaleString()]
          }), (0, o.jsx)("button", {
            onClick: () => b(() => h()),
            className: "neon-btn py-1.5 px-4 text-xs font-bold tracking-wider font-mono",
            style: {
              borderColor: "#555",
              color: "#ccc",
              minHeight: 36
            },
            children: "← BACK"
          })]
        }), (0, o.jsx)("div", {
          className: "flex flex-shrink-0",
          style: {
            backgroundColor: "rgba(0,0,0,0.25)"
          },
          children: [{
            id: "character",
            label: "CHARACTER SKINS",
            color: n,
            icon: "🤺"
          }, {
            id: "pet",
            label: "PET SKINS",
            color: s,
            icon: "🐾"
          }].map(e => (0, o.jsxs)("button", {
            onClick: () => b(() => u(e.id)),
            className: "flex-1 py-2.5 text-xs sm:text-sm font-bold font-mono tracking-wider text-center transition-all duration-200",
            style: {
              backgroundColor: f === e.id ? `${e.color}15` : "transparent",
              borderBottom: f === e.id ? `3px solid ${e.color}` : "3px solid transparent",
              color: f === e.id ? e.color : "#555",
              textShadow: f === e.id ? `0 0 8px ${e.color}` : "none",
              cursor: "pointer"
            },
            children: [e.icon, " ", e.label]
          }, e.id))
        }), (0, o.jsx)("div", {
          className: "flex-1 overflow-y-auto overflow-x-hidden p-3 dark-scroll allow-scroll",
          "data-scrollable": !0,
          children: "character" === f ? (0, o.jsx)("div", {
            className: "grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 justify-items-center",
            children: C.map(e => N(e))
          }) : (0, o.jsx)("div", {
            className: "space-y-4",
            children: v.map(e => {
              let t = M[e.id];
              if (!t || 0 === t.length) return null;
              let a = j.has(e.id);
              return (0, o.jsxs)("div", {
                children: [(0, o.jsxs)("div", {
                  className: "flex items-center gap-2 mb-2 pb-1",
                  style: {
                    borderBottom: `1px solid ${e.color}20`
                  },
                  children: [(0, o.jsx)(ts, {
                    color: e.color,
                    glowColor: e.glowColor
                  }), (0, o.jsx)("div", {
                    className: "text-xs font-bold font-mono",
                    style: {
                      color: a ? e.color : "#555",
                      textShadow: a ? `0 0 6px ${e.color}` : "none"
                    },
                    children: e.name
                  }), !a && (0, o.jsx)("span", {
                    className: "text-[8px] font-mono px-1.5 py-0.5 rounded",
                    style: {
                      color: "#666",
                      backgroundColor: "rgba(0,0,0,0.2)",
                      border: "1px solid #333"
                    },
                    children: "🔒 LOCKED"
                  })]
                }), (0, o.jsx)("div", {
                  className: "grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 justify-items-center",
                  children: t.map(e => P(e))
                })]
              }, e.id)
            })
          })
        }), (0, o.jsxs)("div", {
          className: "flex items-center justify-between px-4 py-2 flex-shrink-0",
          style: {
            borderTop: "1px solid rgba(0,255,255,0.12)",
            backgroundColor: "rgba(0,0,0,0.4)"
          },
          children: [(0, o.jsxs)("div", {
            className: "text-[10px] sm:text-xs font-mono",
            style: {
              color: "#888"
            },
            children: ["🎬 Watch any ad for ", (0, o.jsx)("span", {
              style: {
                color: m,
                fontWeight: "bold"
              },
              children: "+200"
            }), " Coins!"]
          }), (0, o.jsx)("button", {
            onClick: () => b(T),
            className: "neon-btn py-1.5 px-4 text-xs font-bold tracking-wider font-mono",
            style: {
              borderColor: n,
              color: n,
              textShadow: "0 0 8px #00ffff",
              minHeight: 36,
              backgroundImage: "linear-gradient(90deg, transparent, rgba(0,255,255,0.06), transparent)",
              backgroundSize: "200% 100%",
              animation: "ad-shimmer 3s linear infinite"
            },
            children: "🎬 WATCH AD +200 🪙"
          })]
        })]
      })
    }
    let td = ["fire", "frost", "shadow", "summon", "death", "lightning", "void", "blood"],
      th = {
        fire: "#ff4400",
        frost: "#88eeff",
        shadow: "#8800ff",
        summon: "#aa00ff",
        death: "#330033",
        lightning: "#ffff00",
        void: "#ff00ff",
        blood: "#cc0000"
      },
      tf = {
        fire: "FIRE",
        frost: "FROST",
        shadow: "SHADOW",
        summon: "SUMMON",
        death: "DEATH",
        lightning: "LIGHTNING",
        void: "VOID",
        blood: "BLOOD"
      },
      tu = {
        common: "#aaaaaa",
        rare: "#4488ff",
        epic: "#aa00ff",
        legendary: "#ffaa00"
      },
      tm = ["DASH", "SHIELD", "SPECIAL"],
      tx = ["Shift/Q", "E", "F/R"];

    function tp({
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
            children: t < 100 ? "Please wait..." : "✅ Reward unlocked!"
          })]
        })
      })
    }

    function tg() {
      let e = ea(e => e.saveData),
        t = ea(e => e.setGamePhase),
        l = ea(e => e.buySkill),
        r = ea(e => e.equipSkill),
        i = ea(e => e.unequipSkill),
        d = ea(e => e.upgradeSkill),
        h = ea(e => e.addCoinsReward),
        [f, u] = (0, a.useState)("all"),
        [x, p] = (0, a.useState)(!1),
        [g, y] = (0, a.useState)(null),
        [b, v] = (0, a.useState)(null),
        [w, k] = (0, a.useState)(null),
        [C, N] = (0, a.useState)(null),
        A = e => {
          eo.init(), eo.playMenuClick(), e()
        },
        R = (0, a.useCallback)(e => {
          p(!0), y(() => e)
        }, []),
        I = (0, a.useCallback)(() => {
          p(!1), h(200), g && (g(), y(null))
        }, [g, h]),
        E = (e, t) => {
          A(() => {
            i(e), eo.playDamage(), N(t), setTimeout(() => N(null), 800)
          })
        },
        L = "all" === f ? P : P.filter(e => e.element === f),
        D = e.equippedSkills;
      return (0, o.jsxs)("div", {
        className: "absolute inset-0 z-30 flex flex-col items-center bg-[#050510ee] overflow-hidden",
        children: [x && (0, o.jsx)(tp, {
          onComplete: I
        }), (0, o.jsxs)("div", {
          className: "w-full max-w-2xl px-4 pt-4 pb-2",
          children: [(0, o.jsxs)("div", {
            className: "flex items-center justify-between mb-3",
            children: [(0, o.jsx)("h2", {
              className: "text-3xl font-bold tracking-wider",
              style: {
                color: c,
                textShadow: "0 0 15px #ff6600, 0 0 30px #ff6600"
              },
              children: "⚡ SKILLS"
            }), (0, o.jsx)("div", {
              className: "flex items-center gap-3 font-mono text-sm",
              children: (0, o.jsxs)("span", {
                style: {
                  color: m,
                  textShadow: "0 0 8px #ffd700"
                },
                children: ["🪙 ", e.totalCoins]
              })
            })]
          }), (0, o.jsxs)("div", {
            className: "mb-3 p-3 rounded-lg",
            style: {
              backgroundColor: "rgba(255,102,0,0.08)",
              border: "1px solid #ff660030"
            },
            children: [(0, o.jsxs)("div", {
              className: "text-xs font-mono mb-2 flex items-center gap-2",
              style: {
                color: c
              },
              children: [(0, o.jsx)("span", {
                children: "⚔️ EQUIPPED SKILLS"
              }), (0, o.jsx)("span", {
                style: {
                  color: "#666"
                },
                children: "(3 slots — tap UNEQUIP to remove)"
              })]
            }), (0, o.jsx)("div", {
              className: "flex gap-2",
              children: [0, 1, 2].map(t => {
                let a = D[t],
                  l = a ? P.find(e => e.id === a) : null,
                  r = a ? e.skillUpgrades[a] ?? 1 : 0;
                return (0, o.jsx)("div", {
                  className: "flex-1 p-2 rounded text-center",
                  style: {
                    backgroundColor: l ? `${l.color}15` : "rgba(0,0,0,0.3)",
                    border: `2px solid ${l?l.color+"80":"#33333340"}`,
                    minHeight: 70,
                    transition: "all 0.3s ease",
                    boxShadow: l ? `0 0 12px ${l.color}30` : "none"
                  },
                  children: l ? (0, o.jsxs)("div", {
                    className: "flex flex-col items-center",
                    children: [(0, o.jsx)("div", {
                      className: "text-[10px] font-mono font-bold",
                      style: {
                        color: l.color
                      },
                      children: l.name
                    }), (0, o.jsxs)("div", {
                      className: "text-[9px] font-mono mt-0.5",
                      style: {
                        color: "#ffaa00"
                      },
                      children: ["LV ", r, "/", 5]
                    }), (0, o.jsxs)("div", {
                      className: "text-[8px] font-mono mt-0.5",
                      style: {
                        color: "#888"
                      },
                      children: ["[Slot ", t + 1, ": ", tm[t], "]"]
                    }), (0, o.jsx)("button", {
                      onClick: () => E(t, a),
                      className: "mt-1.5 text-[8px] font-mono font-bold px-2 py-0.5 rounded",
                      style: {
                        backgroundColor: "rgba(255,51,51,0.15)",
                        border: "1px solid rgba(255,51,51,0.5)",
                        color: "#ff5555",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      },
                      onMouseEnter: e => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(255,51,51,0.3)", e.currentTarget.style
                          .transform = "scale(1.05)"
                      },
                      onMouseLeave: e => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(255,51,51,0.15)", e.currentTarget.style
                          .transform = "scale(1)"
                      },
                      children: "✕ UNEQUIP"
                    })]
                  }) : (0, o.jsxs)("div", {
                    className: "flex flex-col items-center",
                    children: [(0, o.jsx)("span", {
                      className: "text-[10px] font-mono font-bold",
                      style: {
                        color: "#555"
                      },
                      children: tm[t]
                    }), (0, o.jsxs)("span", {
                      className: "text-[8px] font-mono mt-0.5",
                      style: {
                        color: "#444"
                      },
                      children: ["[", tx[t], "]"]
                    }), (0, o.jsx)("span", {
                      className: "text-[8px] font-mono mt-1.5 px-2 py-0.5 rounded",
                      style: {
                        color: "#555",
                        backgroundColor: "rgba(0,255,255,0.05)",
                        border: "1px solid rgba(0,255,255,0.15)"
                      },
                      children: "Empty Slot"
                    })]
                  })
                }, t)
              })
            })]
          }), (0, o.jsxs)("div", {
            className: "flex gap-1.5 mb-2 flex-wrap",
            children: [(0, o.jsx)("button", {
              onClick: () => A(() => u("all")),
              className: "px-2.5 py-1 rounded text-[10px] font-mono font-bold",
              style: {
                backgroundColor: "all" === f ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.3)",
                border: `1px solid ${"all"===f?"#ffffff60":"#33333340"}`,
                color: "all" === f ? "#ffffff" : "#666"
              },
              children: "ALL"
            }), td.map(e => (0, o.jsx)("button", {
              onClick: () => A(() => u(e)),
              className: "px-2.5 py-1 rounded text-[10px] font-mono font-bold",
              style: {
                backgroundColor: f === e ? `${th[e]}25` : "rgba(0,0,0,0.3)",
                border: `1px solid ${f===e?th[e]+"60":"#33333340"}`,
                color: f === e ? th[e] : "#666"
              },
              children: tf[e]
            }, e))]
          })]
        }), (0, o.jsx)("div", {
          className: "flex-1 w-full max-w-2xl px-4 overflow-y-auto pb-4",
          style: {
            scrollbarWidth: "none"
          },
          children: (0, o.jsx)("div", {
            className: "flex flex-col gap-2",
            children: L.map(t => {
              let a = e.unlockedSkills.includes(t.id),
                i = D.indexOf(t.id),
                c = i >= 0,
                h = e.totalCoins >= t.unlockCost,
                f = "ad" === t.unlockMethod,
                u = ("purchase" === t.unlockMethod || "chest" === t.unlockMethod) && !a && h,
                m = a ? e.skillUpgrades[t.id] ?? 1 : 0,
                x = m >= 5,
                p = m + 1,
                g = a && !x ? M[p - 1] ?? 0 : 0,
                y = !!a && !x && (j[p - 1] ?? !1),
                N = e.totalCoins >= g,
                I = a ? S[m - 1] : 1,
                L = a ? T[m - 1] : 1,
                W = b === t.id,
                O = w === t.id,
                B = C === t.id;
              return (0, o.jsxs)("div", {
                className: "p-3 rounded-lg flex gap-3",
                style: {
                  backgroundColor: a ? `${t.color}08` : "rgba(0,0,0,0.2)",
                  border: `2px solid ${c?t.color:a?t.color+"40":"#33333330"}`,
                  boxShadow: c ? `0 0 15px ${t.color}30, inset 0 0 15px ${t.color}08` :
                    "none",
                  transition: "all 0.3s ease",
                  transform: O ? "scale(1.02)" : B ? "scale(0.98)" : "scale(1)"
                },
                children: [(0, o.jsxs)("div", {
                  className: "w-12 h-12 rounded flex items-center justify-center flex-shrink-0 relative",
                  style: {
                    backgroundColor: `${t.color}15`,
                    border: `1px solid ${t.color}40`
                  },
                  children: [(0, o.jsx)("div", {
                    className: "w-6 h-6 rounded-full",
                    style: {
                      backgroundColor: t.color,
                      boxShadow: `0 0 10px ${t.glowColor}`
                    }
                  }), a && (0, o.jsxs)("div", {
                    className: "absolute -top-1 -right-1 text-[7px] font-mono font-bold px-1 rounded",
                    style: {
                      backgroundColor: m >= 4 ? "#ffaa00" : "#333",
                      color: m >= 4 ? "#000" : "#ccc",
                      border: `1px solid ${m>=4?"#ffaa00":"#555"}`
                    },
                    children: ["LV", m]
                  })]
                }), (0, o.jsxs)("div", {
                  className: "flex-1 min-w-0",
                  children: [(0, o.jsxs)("div", {
                    className: "flex items-center gap-2 flex-wrap",
                    children: [(0, o.jsx)("span", {
                      className: "font-bold text-sm font-mono",
                      style: {
                        color: a ? t.color : "#555"
                      },
                      children: t.name
                    }), a && (0, o.jsxs)("span", {
                      className: "text-[8px] font-mono px-1.5 py-0.5 rounded",
                      style: {
                        backgroundColor: `${tu[t.rarity]}20`,
                        border: `1px solid ${tu[t.rarity]}40`,
                        color: tu[t.rarity]
                      },
                      children: ["LV ", m, "/", 5]
                    }), (0, o.jsx)("span", {
                      className: "text-[8px] font-mono px-1.5 py-0.5 rounded",
                      style: {
                        backgroundColor: `${tu[t.rarity]}20`,
                        border: `1px solid ${tu[t.rarity]}40`,
                        color: tu[t.rarity]
                      },
                      children: t.rarity.toUpperCase()
                    }), (0, o.jsx)("span", {
                      className: "text-[8px] font-mono px-1.5 py-0.5 rounded",
                      style: {
                        backgroundColor: `${th[t.element]}15`,
                        border: `1px solid ${th[t.element]}30`,
                        color: th[t.element]
                      },
                      children: tf[t.element]
                    })]
                  }), (0, o.jsx)("div", {
                    className: "text-[10px] font-mono mt-0.5",
                    style: {
                      color: a ? "#888" : "#444"
                    },
                    children: t.description
                  }), (0, o.jsxs)("div", {
                    className: "flex items-center gap-3 mt-1 text-[9px] font-mono",
                    style: {
                      color: "#666"
                    },
                    children: [(0, o.jsxs)("span", {
                      children: ["DMG: ", (0, o.jsx)("span", {
                        style: {
                          color: t.color
                        },
                        children: a ? Math.round(t.damage * I) : t
                          .damage
                      }), a && I > 1 && (0, o.jsxs)("span", {
                        style: {
                          color: "#ffaa00"
                        },
                        children: [" (×", I, ")"]
                      })]
                    }), (0, o.jsxs)("span", {
                      children: ["CD: ", (0, o.jsxs)("span", {
                        style: {
                          color: "#aaa"
                        },
                        children: [(t.cooldown * L / 60).toFixed(1),
                          "s"
                        ]
                      }), a && L < 1 && (0, o.jsxs)("span", {
                        style: {
                          color: "#00ff66"
                        },
                        children: [" (×", L, ")"]
                      })]
                    }), (0, o.jsxs)("span", {
                      children: ["Type: ", (0, o.jsx)("span", {
                        style: {
                          color: "#aaa"
                        },
                        children: t.effectType.toUpperCase()
                      })]
                    })]
                  }), a && !x && (0, o.jsxs)("div", {
                    className: "mt-1.5 flex items-center gap-2",
                    children: [(0, o.jsx)("div", {
                      className: "flex gap-0.5",
                      children: Array.from({
                        length: 5
                      }).map((e, a) => (0, o.jsx)("div", {
                        className: "w-5 h-1.5 rounded-sm",
                        style: {
                          backgroundColor: a < m ? t.color : "#222",
                          border: `1px solid ${a<m?t.color:"#444"}`
                        }
                      }, a))
                    }), (0, o.jsx)("button", {
                      onClick: () => {
                        var o;
                        let a, l, r, n;
                        return o = t.id, l = M[(a = (e.skillUpgrades[o] ??
                            1) + 1) - 1] ?? 0, r = j[a - 1] ?? !1, n = e
                          .totalCoins >= l, void(r && !n ? R(() => {
                            A(() => {
                              d(o) && (eo.playCoinCollect(), v(o),
                                setTimeout(() => v(null), 1e3))
                            })
                          }) : A(() => {
                            d(o) && (eo.playCoinCollect(), v(o),
                              setTimeout(() => v(null), 1e3))
                          }))
                      },
                      className: "text-[9px] font-mono font-bold px-2 py-0.5 rounded",
                      style: {
                        backgroundColor: W ? `${t.color}40` : y && !N ?
                          "rgba(0,255,255,0.1)" : N ?
                          "rgba(255,215,0,0.15)" : "rgba(0,0,0,0.3)",
                        border: `1px solid ${W?t.color:y&&!N?n:N?"#ffd700":"#333"}`,
                        color: W ? "#fff" : y && !N ? n : N ? "#ffd700" :
                          "#555",
                        transition: "all 0.3s",
                        transform: W ? "scale(1.1)" : "scale(1)"
                      },
                      children: W ? "✨ UPGRADED!" : y && !N ? "🎬 WATCH AD" :
                        `${g} 🪙`
                    })]
                  }), a && x && (0, o.jsxs)("div", {
                    className: "mt-1.5 text-[9px] font-mono font-bold",
                    style: {
                      color: "#ffaa00",
                      textShadow: "0 0 5px #ffaa00"
                    },
                    children: ["✨ MAX LEVEL — DMG ×", S[4], " | CD ×", T[4]]
                  })]
                }), (0, o.jsx)("div", {
                  className: "flex flex-col gap-1.5 items-end flex-shrink-0 justify-center",
                  children: a ? (0, o.jsxs)(o.Fragment, {
                    children: [c && (0, o.jsxs)("div", {
                      className: "flex flex-col items-end gap-1",
                      children: [(0, o.jsxs)("span", {
                        className: "text-[9px] font-mono font-bold px-2 py-0.5 rounded",
                        style: {
                          color: s,
                          backgroundColor: "rgba(0,255,102,0.12)",
                          border: "1px solid rgba(0,255,102,0.4)",
                          textShadow: "0 0 5px rgba(0,255,102,0.3)"
                        },
                        children: ["✓ SLOT ", i + 1]
                      }), (0, o.jsx)("button", {
                        onClick: () => E(i, t.id),
                        className: "text-[9px] font-mono font-bold px-2.5 py-1 rounded cursor-pointer",
                        style: {
                          backgroundColor: B ? "rgba(255,51,51,0.3)" :
                            "rgba(255,51,51,0.1)",
                          border: `1px solid ${B?"#ff3333":"rgba(255,51,51,0.4)"}`,
                          color: "#ff5555",
                          transition: "all 0.2s",
                          transform: B ? "scale(0.9)" : "scale(1)"
                        },
                        onMouseEnter: e => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(255,51,51,0.25)", e.currentTarget
                            .style.transform = "scale(1.05)"
                        },
                        onMouseLeave: e => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(255,51,51,0.1)", e.currentTarget
                            .style.transform = "scale(1)"
                        },
                        children: "✕ UNEQUIP"
                      })]
                    }), !c && (0, o.jsxs)("div", {
                      className: "flex flex-col items-end gap-1",
                      children: [(0, o.jsx)("span", {
                        className: "text-[8px] font-mono font-bold",
                        style: {
                          color: t.color
                        },
                        children: "EQUIP TO →"
                      }), (0, o.jsx)("div", {
                        className: "flex gap-1",
                        children: [0, 1, 2].map(e => {
                          let a = D[e],
                            l = a ? P.find(e => e.id === a) : null;
                          return (0, o.jsxs)("button", {
                            onClick: () => {
                              var o;
                              return o = t.id, void A(() => {
                                r(o, e), eo
                                  .playCoinCollect(), k(
                                  o), setTimeout(() => k(
                                    null), 800)
                              })
                            },
                            className: "text-[8px] font-mono font-bold px-2 py-1 rounded cursor-pointer",
                            style: {
                              backgroundColor: O ?
                                `${t.color}35` : a ?
                                `${t.color}15` : `${t.color}20`,
                              border: `1px solid ${O?t.color:a?t.color+"60":t.color+"50"}`,
                              color: t.color,
                              transition: "all 0.2s",
                              transform: O ? "scale(1.1)" :
                                "scale(1)"
                            },
                            title: a ?
                              `Replace ${l?.name??"skill"} in Slot ${e+1}` :
                              `Equip to Slot ${e+1} (${tm[e]})`,
                            onMouseEnter: e => {
                              e.currentTarget.style
                                .backgroundColor =
                                `${t.color}30`, e
                                .currentTarget.style
                                .transform = "scale(1.08)"
                            },
                            onMouseLeave: e => {
                              e.currentTarget.style
                                .backgroundColor = O ?
                                `${t.color}35` :
                                `${t.color}20`, e
                                .currentTarget.style
                                .transform = "scale(1)"
                            },
                            children: ["Slot ", e + 1, a && (0,
                              o.jsx)("span", {
                              style: {
                                color: "#ff5555"
                              },
                              children: " ⚡"
                            })]
                          }, e)
                        })
                      }), (0, o.jsx)("div", {
                        className: "text-[7px] font-mono",
                        style: {
                          color: "#555"
                        },
                        children: tm.map((e, t) => `${t+1}:${e}`).join(
                          " ")
                      })]
                    })]
                  }) : f ? (0, o.jsx)("button", {
                    onClick: () => h ? A(() => {
                      l(t.id), eo.playCoinCollect()
                    }) : R(() => A(() => {
                      l(t.id), eo.playCoinCollect()
                    })),
                    className: "text-[10px] font-mono font-bold px-2 py-1 rounded",
                    style: {
                      backgroundColor: h ? "rgba(255,215,0,0.15)" :
                        "rgba(0,255,255,0.1)",
                      border: `1px solid ${h?"#ffd700":n}`,
                      color: h ? "#ffd700" : n
                    },
                    children: h ? `${t.unlockCost} 🪙` : "🎬 WATCH AD"
                  }) : "purchase" === t.unlockMethod || "chest" === t.unlockMethod ? (
                    0, o.jsxs)("button", {
                    onClick: () => u && A(() => {
                      l(t.id), eo.playCoinCollect()
                    }),
                    className: "text-[10px] font-mono font-bold px-2 py-1 rounded",
                    style: {
                      backgroundColor: h ? "rgba(255,215,0,0.15)" :
                        "rgba(0,0,0,0.3)",
                      border: `1px solid ${h?"#ffd700":"#333"}`,
                      color: h ? "#ffd700" : "#555"
                    },
                    children: [t.unlockCost, " 🪙"]
                  }) : (0, o.jsx)("span", {
                    className: "text-[9px] font-mono",
                    style: {
                      color: "#555"
                    },
                    children: function(e) {
                      switch (e.unlockMethod) {
                        case "level":
                          return `Reach Lv.${e.unlockLevel}`;
                        case "boss":
                          return `Defeat ${e.unlockBoss||"Boss"}`;
                        case "chest":
                          return e.unlockCost > 0 ? `${e.unlockCost} Coins` :
                            "Find in Chest";
                        case "purchase":
                          return `${e.unlockCost} Coins`;
                        case "ad":
                          return `🎬 Watch Ad — ${e.unlockCost} Coins`;
                        case "story":
                          return "Story Unlock";
                        default:
                          return "???"
                      }
                    }(t)
                  })
                })]
              }, t.id)
            })
          })
        }), (0, o.jsx)("div", {
          className: "w-full max-w-2xl px-4 pb-4",
          children: (0, o.jsx)("button", {
            onClick: () => A(() => {
              ea.getState().currentLevel > 0 ? t("level-map") : t("menu")
            }),
            className: "neon-btn w-full py-2 px-4 text-sm tracking-wider",
            style: {
              borderColor: "#666",
              color: "#888"
            },
            children: "BACK"
          })
        })]
      })
    }

    function ty() {
      let e = ea(e => e.soundSettings),
        t = ea(e => e.setSoundSettings),
        a = ea(e => e.backToMenu),
        l = ea(e => e.setGamePhase),
        r = ea(e => e.currentLevel > 0),
        f = (e, o) => {
          t({
            [e]: o / 100
          }), eo.init(), eo.playMenuClick()
        },
        u = (e, o) => {
          t({
            [e]: o
          }), eo.init(), eo.playMenuClick()
        },
        m = e => ({
          WebkitAppearance: "none",
          appearance: "none",
          width: "100%",
          height: 6,
          borderRadius: 3,
          background: `linear-gradient(to right, ${e} 0%, ${e} var(--value), #222 var(--value), #222 100%)`,
          outline: "none",
          cursor: "pointer"
        });
      return (0, o.jsx)("div", {
        className: "absolute inset-0 z-20 flex items-center justify-center pointer-events-none",
        children: (0, o.jsxs)("div", {
          className: "w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg p-6 pointer-events-auto mx-4",
          style: {
            backgroundColor: "rgba(5, 5, 20, 0.97)",
            border: "2px solid #00ffff",
            boxShadow: "0 0 30px #00ffff20"
          },
          children: [(0, o.jsx)("h1", {
            className: "text-3xl font-bold text-center tracking-wider mb-6 font-mono",
            style: {
              color: s,
              textShadow: "0 0 10px #00ff66"
            },
            children: r ? "PAUSED" : "SETTINGS"
          }), (0, o.jsxs)("div", {
            className: "space-y-5 mb-6",
            children: [(0, o.jsxs)("div", {
              children: [(0, o.jsxs)("div", {
                className: "flex justify-between items-center mb-2",
                children: [(0, o.jsx)("label", {
                  className: "text-sm font-mono font-bold",
                  style: {
                    color: n,
                    textShadow: "0 0 5px #00ffff"
                  },
                  children: "MASTER VOLUME"
                }), (0, o.jsxs)("span", {
                  className: "text-sm font-mono",
                  style: {
                    color: n
                  },
                  children: [Math.round(100 * e.masterVolume), "%"]
                })]
              }), (0, o.jsx)("input", {
                type: "range",
                min: "0",
                max: "100",
                value: Math.round(100 * e.masterVolume),
                onChange: e => f("masterVolume", parseInt(e.target.value)),
                className: "w-full",
                style: {
                  ...m(n),
                  "--value": `${100*e.masterVolume}%`
                }
              })]
            }), (0, o.jsxs)("div", {
              children: [(0, o.jsxs)("div", {
                className: "flex justify-between items-center mb-2",
                children: [(0, o.jsx)("label", {
                  className: "text-sm font-mono font-bold",
                  style: {
                    color: c,
                    textShadow: "0 0 5px #ff6600"
                  },
                  children: "SFX VOLUME"
                }), (0, o.jsxs)("div", {
                  className: "flex items-center gap-3",
                  children: [(0, o.jsxs)("span", {
                    className: "text-sm font-mono",
                    style: {
                      color: c
                    },
                    children: [Math.round(100 * e.sfxVolume), "%"]
                  }), (0, o.jsx)("button", {
                    onClick: () => u("sfxEnabled", !e.sfxEnabled),
                    className: "px-2 py-0.5 text-xs font-mono font-bold rounded",
                    style: {
                      border: `1px solid ${e.sfxEnabled?s:"#555"}`,
                      color: e.sfxEnabled ? s : "#555",
                      backgroundColor: e.sfxEnabled ? "rgba(0,255,102,0.1)" :
                        "transparent"
                    },
                    children: e.sfxEnabled ? "ON" : "OFF"
                  })]
                })]
              }), (0, o.jsx)("input", {
                type: "range",
                min: "0",
                max: "100",
                value: Math.round(100 * e.sfxVolume),
                onChange: e => f("sfxVolume", parseInt(e.target.value)),
                className: "w-full",
                style: {
                  ...m(c),
                  "--value": `${100*e.sfxVolume}%`
                }
              })]
            }), (0, o.jsxs)("div", {
              children: [(0, o.jsxs)("div", {
                className: "flex justify-between items-center mb-2",
                children: [(0, o.jsx)("label", {
                  className: "text-sm font-mono font-bold",
                  style: {
                    color: i,
                    textShadow: "0 0 5px #ff00ff"
                  },
                  children: "MUSIC VOLUME"
                }), (0, o.jsxs)("div", {
                  className: "flex items-center gap-3",
                  children: [(0, o.jsxs)("span", {
                    className: "text-sm font-mono",
                    style: {
                      color: i
                    },
                    children: [Math.round(100 * e.musicVolume), "%"]
                  }), (0, o.jsx)("button", {
                    onClick: () => u("musicEnabled", !e.musicEnabled),
                    className: "px-2 py-0.5 text-xs font-mono font-bold rounded",
                    style: {
                      border: `1px solid ${e.musicEnabled?s:"#555"}`,
                      color: e.musicEnabled ? s : "#555",
                      backgroundColor: e.musicEnabled ?
                        "rgba(0,255,102,0.1)" : "transparent"
                    },
                    children: e.musicEnabled ? "ON" : "OFF"
                  })]
                })]
              }), (0, o.jsx)("input", {
                type: "range",
                min: "0",
                max: "100",
                value: Math.round(100 * e.musicVolume),
                onChange: e => f("musicVolume", parseInt(e.target.value)),
                className: "w-full",
                style: {
                  ...m(i),
                  "--value": `${100*e.musicVolume}%`
                }
              })]
            })]
          }), (0, o.jsxs)("div", {
            className: "rounded-lg p-4 mb-6",
            style: {
              backgroundColor: "rgba(0,255,255,0.03)",
              border: "1px solid rgba(0,255,255,0.15)"
            },
            children: [(0, o.jsx)("h3", {
              className: "text-sm font-mono font-bold mb-3",
              style: {
                color: d,
                textShadow: "0 0 5px #ffff00"
              },
              children: "CONTROLS"
            }), (0, o.jsxs)("div", {
              className: "grid grid-cols-2 gap-4",
              children: [(0, o.jsxs)("div", {
                children: [(0, o.jsx)("div", {
                  className: "text-xs font-mono font-bold mb-1.5",
                  style: {
                    color: n
                  },
                  children: "TOUCH CONTROLS"
                }), (0, o.jsxs)("div", {
                  className: "text-[10px] font-mono space-y-0.5",
                  style: {
                    color: "#888"
                  },
                  children: [(0, o.jsx)("p", {
                    children: "Joystick — Move"
                  }), (0, o.jsx)("p", {
                    children: "⬆ — Jump"
                  }), (0, o.jsx)("p", {
                    children: "🔥 — Shoot"
                  }), (0, o.jsx)("p", {
                    children: "⚡ — Dash/Skill 1"
                  }), (0, o.jsx)("p", {
                    children: "🛡 — Shield/Skill 2"
                  }), (0, o.jsx)("p", {
                    children: "✦ — Special/Skill 3"
                  })]
                })]
              }), (0, o.jsxs)("div", {
                children: [(0, o.jsx)("div", {
                  className: "text-xs font-mono font-bold mb-1.5",
                  style: {
                    color: h
                  },
                  children: "TIPS"
                }), (0, o.jsxs)("div", {
                  className: "text-[10px] font-mono space-y-0.5",
                  style: {
