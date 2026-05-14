        }
        playJump() {
          this.canPlaySfx("jump") && this.playTone(300, .08, "sine", .12, 600)
        }
        playEnemyDeath() {
          this.canPlaySfx("enemyDeath") && this.playTone(600, .15, "square", .1, 100)
        }
        playBossHit() {
          this.canPlaySfx("bossHit") && (this.playTone(80, .2, "sawtooth", .15, 40), this.playNoise(.1, .15, 500))
        }
        playWaveComplete() {
          [440, 554, 659].forEach((e, t) => {
            setTimeout(() => this.playTone(e, .15, "sine", .15), 150 * t)
          })
        }
        playLevelComplete() {
          [440, 554, 659, 880].forEach((e, t) => {
            setTimeout(() => this.playTone(e, .2, "sine", .2), 150 * t)
          })
        }
        playVersusVictory() {
          [523, 659, 784].forEach((e, t) => {
            setTimeout(() => this.playTone(e, .3, "sine", .12), 200 * t)
          })
        }
        playGameOver() {
          this.playTone(300, .8, "sawtooth", .15, 50)
        }
        playMenuClick() {
          this.playTone(1e3, .04, "sine", .1)
        }
        playMenuHover() {
          this.playTone(600, .02, "sine", .06)
        }
        playCoinCollect() {
          this.canPlaySfx("coin") && (this.playTone(1200, .08, "sine", .1), setTimeout(() => this.playTone(1500,
            .08, "sine", .08), 40))
        }
        playAbilityReady() {
          this.playTone(800, .12, "sine", .1, 1e3)
        }
        playDamage() {
          this.canPlaySfx("damage") && (this.playNoise(.1, .15), this.playTone(80, .08, "sine", .12))
        }
        playPetShoot() {
          this.canPlaySfx("petShoot") && this.playTone(1400, .06, "square", .08, 900)
        }
        playPetDeath() {
          this.playTone(500, .4, "sine", .12, 100), setTimeout(() => this.playTone(350, .2, "sine", .08, 150),
            150)
        }
        playPetRespawn() {
          this.playTone(400, .12, "sine", .1, 800)
        }
        playDramaticMoment() {
          [220, 330, 440, 660].forEach((e, t) => {
            setTimeout(() => this.playTone(e, .25, "sine", .15), 80 * t)
          })
        }
        playReinforcement() {
          this.playTone(440, .12, "sine", .15), setTimeout(() => this.playTone(554, .12, "sine", .12), 80),
            setTimeout(() => this.playTone(880, .2, "sine", .18), 160)
        }
        playBossEnrage() {
          this.playTone(100, .4, "sawtooth", .2, 50), this.playNoise(.2, .15, 300)
        }
        playVictoryFanfare() {
          this.sfxEnabled && this.ctx && this.sfxGain && ([523, 659, 784, 1047, 1319].forEach((e, t) => {
            setTimeout(() => {
              this.playTone(e, .3, "sine", .18), t < 3 && this.playTone(1.5 * e, .25, "sine", .06)
            }, 180 * t)
          }), setTimeout(() => {
            this.playTone(523, .6, "sine", .12), this.playTone(659, .6, "sine", .1), this.playTone(784, .6,
              "sine", .1)
          }, 1e3))
        }
        startMusic() {
          if (!this.musicEnabled || this.musicPlaying || this.bossMusicPlaying || this.menuMusicPlaying || !this
            .ctx || !this.musicGain) return;
          this.ensureCtx(), this.musicPlaying = !0;
          let e = () => {
              if (!this.ctx || !this.musicGain) return;
              let e = this.ctx.createOscillator(),
                t = this.ctx.createGain();
              e.type = "sine", e.frequency.setValueAtTime(150, this.ctx.currentTime), e.frequency
                .exponentialRampToValueAtTime(30, this.ctx.currentTime + .12), t.gain.setValueAtTime(.4, this.ctx
                  .currentTime), t.gain.exponentialRampToValueAtTime(.001, this.ctx.currentTime + .15), e.connect(
                  t), t.connect(this.musicGain), e.start(this.ctx.currentTime), e.stop(this.ctx.currentTime + .15)
            },
            t = () => {
              if (!this.ctx || !this.musicGain || !this.shortNoiseBuffer) return;
              let e = this.ctx.createBufferSource();
              e.buffer = this.shortNoiseBuffer;
              let t = this.ctx.createGain();
              t.gain.setValueAtTime(.08, this.ctx.currentTime), t.gain.exponentialRampToValueAtTime(.001, this.ctx
                .currentTime + .04);
              let o = this.ctx.createBiquadFilter();
              o.type = "highpass", o.frequency.value = 8e3, e.connect(o), o.connect(t), t.connect(this.musicGain),
                e.start(this.ctx.currentTime), e.stop(this.ctx.currentTime + .04)
            },
            o = () => {
              if (!this.ctx || !this.musicGain || !this.shortNoiseBuffer) return;
              let e = this.ctx.createBufferSource();
              e.buffer = this.shortNoiseBuffer;
              let t = this.ctx.createGain();
              t.gain.setValueAtTime(.12, this.ctx.currentTime), t.gain.exponentialRampToValueAtTime(.001, this.ctx
                .currentTime + .1);
              let o = this.ctx.createBiquadFilter();
              o.type = "bandpass", o.frequency.value = 3e3, o.Q.value = 1, e.connect(o), o.connect(t), t.connect(
                this.musicGain), e.start(this.ctx.currentTime), e.stop(this.ctx.currentTime + .1);
              let a = this.ctx.createOscillator(),
                l = this.ctx.createGain();
              a.type = "triangle", a.frequency.value = 180, l.gain.setValueAtTime(.1, this.ctx.currentTime), l
                .gain.exponentialRampToValueAtTime(.001, this.ctx.currentTime + .06), a.connect(l), l.connect(this
                  .musicGain), a.start(this.ctx.currentTime), a.stop(this.ctx.currentTime + .06)
            },
            a = (e, t = .15) => {
              if (!this.ctx || !this.musicGain) return;
              let o = this.ctx.createOscillator(),
                a = this.ctx.createGain();
              o.type = "sawtooth", o.frequency.value = e, a.gain.setValueAtTime(.15, this.ctx.currentTime), a.gain
                .exponentialRampToValueAtTime(.001, this.ctx.currentTime + t);
              let l = this.ctx.createBiquadFilter();
              l.type = "lowpass", l.frequency.setValueAtTime(400, this.ctx.currentTime), l.frequency
                .exponentialRampToValueAtTime(200, this.ctx.currentTime + t), l.Q.value = 5, o.connect(l), l
                .connect(a), a.connect(this.musicGain), o.start(this.ctx.currentTime), o.stop(this.ctx
                  .currentTime + t)
            },
            l = e => {
              if (!this.ctx || !this.musicGain) return;
              let t = this.ctx.createOscillator(),
                o = this.ctx.createGain();
              t.type = "square", t.frequency.value = e, o.gain.setValueAtTime(.04, this.ctx.currentTime), o.gain
                .exponentialRampToValueAtTime(.001, this.ctx.currentTime + .1);
              let a = this.ctx.createBiquadFilter();
              a.type = "lowpass", a.frequency.value = 2500, a.Q.value = 2, t.connect(a), a.connect(o), o.connect(
                this.musicGain), t.start(this.ctx.currentTime), t.stop(this.ctx.currentTime + .1)
            },
            r = e => {
              if (!this.ctx || !this.musicGain) return;
              let t = this.ctx.createOscillator(),
                o = this.ctx.createGain();
              t.type = "sine", t.frequency.value = e, o.gain.setValueAtTime(.03, this.ctx.currentTime), o.gain
                .exponentialRampToValueAtTime(.001, this.ctx.currentTime + .08), t.connect(o), o.connect(this
                  .musicGain), t.start(this.ctx.currentTime), t.stop(this.ctx.currentTime + .08)
            },
            n = [55, 55, 55, 65, 55, 55, 73, 55, 55, 55, 55, 65, 73, 73, 65, 55],
            i = [330, 0, 392, 0, 440, 0, 392, 330, 330, 0, 0, 392, 440, 0, 392, 0],
            s = [220, 277, 330, 277, 220, 277, 330, 370, 220, 277, 330, 277, 370, 330, 277, 220],
            c = 0;
          this.musicInterval = setInterval(() => {
            if (!this.musicPlaying) return;
            let d = c % 16;
            (0 === d || 4 === d || 8 === d || 12 === d) && e(), (4 === d || 12 === d) && o(), d % 2 == 0 &&
              t(), (d % 2 == 0 || 3 === d || 7 === d || 11 === d || 15 === d) && a(n[d], d % 4 == 0 ? .2 :
              .1), i[d] > 0 && d % 2 == 0 && l(i[d]), d % 2 == 0 && r(s[d]), c++
          }, .42857142857142855 * 1e3 / 2)
        }
        stopMusic() {
          this.musicPlaying = !1, this.musicInterval && (clearInterval(this.musicInterval), this.musicInterval =
            null)
        }
        startMenuMusic() {
          if (!this.musicEnabled || this.menuMusicPlaying || this.musicPlaying || this.bossMusicPlaying || !this
            .ctx || !this.musicGain) return;
          this.ensureCtx(), this.menuMusicPlaying = !0;
          let e = (e, t) => {
              if (!this.ctx || !this.musicGain) return;
              let o = this.ctx.createOscillator(),
                a = this.ctx.createGain();
              o.type = "sine", o.frequency.value = e, a.gain.setValueAtTime(.04, this.ctx.currentTime), a.gain
                .linearRampToValueAtTime(.06, this.ctx.currentTime + .3 * t), a.gain.exponentialRampToValueAtTime(
                  .001, this.ctx.currentTime + t);
              let l = this.ctx.createBiquadFilter();
              l.type = "lowpass", l.frequency.value = 800, l.Q.value = 1, o.connect(l), l.connect(a), a.connect(
                this.musicGain), o.start(this.ctx.currentTime), o.stop(this.ctx.currentTime + t)
            },
            t = e => {
              if (!this.ctx || !this.musicGain) return;
              let t = this.ctx.createOscillator(),
                o = this.ctx.createGain();
              t.type = "triangle", t.frequency.value = e, o.gain.setValueAtTime(.08, this.ctx.currentTime), o.gain
                .exponentialRampToValueAtTime(.001, this.ctx.currentTime + .4);
              let a = this.ctx.createBiquadFilter();
              a.type = "lowpass", a.frequency.value = 250, t.connect(a), a.connect(o), o.connect(this.musicGain),
                t.start(this.ctx.currentTime), t.stop(this.ctx.currentTime + .4)
            },
            o = () => {
              if (!this.ctx || !this.musicGain) return;
              let e = this.ctx.createOscillator(),
                t = this.ctx.createGain();
              e.type = "sine", e.frequency.setValueAtTime(100, this.ctx.currentTime), e.frequency
                .exponentialRampToValueAtTime(25, this.ctx.currentTime + .15), t.gain.setValueAtTime(.2, this.ctx
                  .currentTime), t.gain.exponentialRampToValueAtTime(.001, this.ctx.currentTime + .15), e.connect(
                  t), t.connect(this.musicGain), e.start(this.ctx.currentTime), e.stop(this.ctx.currentTime + .15)
            },
            a = [
              [110, 165, 220],
              [87, 131, 175],
              [65, 98, 131],
              [98, 147, 196]
            ],
            l = [55, 43, 65, 49],
            r = 0;
          this.menuMusicInterval = setInterval(() => {
            if (!this.menuMusicPlaying) return;
            let n = r % 16;
            if ((0 === n || 8 === n) && o(), (0 === n || 4 === n || 8 === n || 12 === n) && t(l[Math.floor(n /
                4)]), 0 === n)
              for (let t of a[Math.floor(r / 4) % 4]) e(t, 2.5);
            if (2 === n || 6 === n || 10 === n || 14 === n) {
              if (!this.ctx || !this.musicGain) return;
              let e = this.ctx.createOscillator(),
                t = this.ctx.createGain();
              e.type = "sine", e.frequency.value = 880 + 100 * Math.sin(.1 * r), t.gain.setValueAtTime(.02,
                  this.ctx.currentTime), t.gain.exponentialRampToValueAtTime(.001, this.ctx.currentTime +
                .15), e.connect(t), t.connect(this.musicGain), e.start(this.ctx.currentTime), e.stop(this.ctx
                  .currentTime + .15)
            }
            r++
          }, .6666666666666666 * 1e3)
        }
        stopMenuMusic() {
          this.menuMusicPlaying = !1, this.menuMusicInterval && (clearInterval(this.menuMusicInterval), this
            .menuMusicInterval = null)
        }
        startBossMusic() {
          if (!this.musicEnabled || this.bossMusicPlaying || !this.ctx || !this.musicGain) return;
          this.ensureCtx(), this.stopMusic(), this.stopMenuMusic(), this.bossMusicPlaying = !0;
          let e = () => {
              if (!this.ctx || !this.musicGain) return;
              let e = this.ctx.createOscillator(),
                t = this.ctx.createGain();
              e.type = "sine", e.frequency.setValueAtTime(200, this.ctx.currentTime), e.frequency
                .exponentialRampToValueAtTime(25, this.ctx.currentTime + .1), t.gain.setValueAtTime(.45, this.ctx
                  .currentTime), t.gain.exponentialRampToValueAtTime(.001, this.ctx.currentTime + .12), e.connect(
                  t), t.connect(this.musicGain), e.start(this.ctx.currentTime), e.stop(this.ctx.currentTime + .12)
            },
            t = () => {
              if (!this.ctx || !this.musicGain || !this.shortNoiseBuffer) return;
              let e = this.ctx.createBufferSource();
              e.buffer = this.shortNoiseBuffer;
              let t = this.ctx.createGain();
              t.gain.setValueAtTime(.1, this.ctx.currentTime), t.gain.exponentialRampToValueAtTime(.001, this.ctx
                .currentTime + .025);
              let o = this.ctx.createBiquadFilter();
              o.type = "highpass", o.frequency.value = 1e4, e.connect(o), o.connect(t), t.connect(this.musicGain),
                e.start(this.ctx.currentTime), e.stop(this.ctx.currentTime + .025)
            },
            o = e => {
              if (!this.ctx || !this.musicGain) return;
              let t = this.ctx.createOscillator(),
                o = this.ctx.createGain();
              t.type = "sawtooth", t.frequency.value = e, o.gain.setValueAtTime(.18, this.ctx.currentTime), o.gain
                .exponentialRampToValueAtTime(.001, this.ctx.currentTime + .12);
              let a = this.ctx.createBiquadFilter();
              a.type = "lowpass", a.frequency.setValueAtTime(600, this.ctx.currentTime), a.frequency
                .exponentialRampToValueAtTime(300, this.ctx.currentTime + .12), a.Q.value = 4, t.connect(a), a
                .connect(o), o.connect(this.musicGain), t.start(this.ctx.currentTime), t.stop(this.ctx
                  .currentTime + .12)
            },
            a = e => {
              if (!this.ctx || !this.musicGain) return;
              let t = this.ctx.createOscillator(),
                o = this.ctx.createGain();
              t.type = "square", t.frequency.value = e, o.gain.setValueAtTime(.05, this.ctx.currentTime), o.gain
                .exponentialRampToValueAtTime(.001, this.ctx.currentTime + .08);
              let a = this.ctx.createBiquadFilter();
              a.type = "lowpass", a.frequency.value = 2e3, t.connect(a), a.connect(o), o.connect(this.musicGain),
                t.start(this.ctx.currentTime), t.stop(this.ctx.currentTime + .08)
            },
            l = [41, 41, 49, 41, 55, 55, 49, 41],
            r = [330, 0, 440, 0, 330, 0, 494, 440],
            n = 0;
          this.bossMusicInterval = setInterval(() => {
            if (!this.bossMusicPlaying) return;
            let i = n % 8;
            (0 === i || 2 === i || 4 === i || 6 === i) && e(), t(), i % 2 == 0 && o(l[i]), r[i] > 0 && i %
              2 == 0 && a(r[i]), n++
          }, .3333333333333333 * 1e3)
        }
        stopBossMusic() {
          this.bossMusicPlaying = !1, this.bossMusicInterval && (clearInterval(this.bossMusicInterval), this
            .bossMusicInterval = null)
        }
        isBossMusicPlaying() {
          return this.bossMusicPlaying
        }
        stopAll() {
          this.stopMusic(), this.stopBossMusic(), this.stopMenuMusic()
        }
        saveSettings() {
          try {
            let e = {
              masterVolume: this.masterVolume,
              sfxVolume: this.sfxVolume,
              musicVolume: this.musicVolume,
              musicEnabled: this.musicEnabled,
              sfxEnabled: this.sfxEnabled
            };
            localStorage.setItem(et, JSON.stringify(e))
          } catch {}
        }
        loadSettings() {
          try {
            let e = localStorage.getItem(et);
            if (!e) return {
              ...ee
            };
            let t = JSON.parse(e),
              o = {
                ...ee,
                ...t
              };
            return this.masterVolume = o.masterVolume, this.sfxVolume = o.sfxVolume, this.musicVolume = o
              .musicVolume, this.musicEnabled = o.musicEnabled, this.sfxEnabled = o.sfxEnabled, this.masterGain &&
              (this.masterGain.gain.value = this.masterVolume), this.sfxGain && (this.sfxGain.gain.value = this
                .sfxVolume), this.musicGain && (this.musicGain.gain.value = this.musicVolume), o
          } catch {
            return {
              ...ee
            }
          }
        }
      },
      ea = (t = (e, t) => ({
        gamePhase: "menu",
        gameMode: "single",
        currentLevel: 1,
        score: 0,
        totalScore: 0,
        currentWave: 0,
        totalWaves: 0,
        isBossLevel: !1,
        canRevive: !0,
        hasUsedRevive: !1,
        revivedWithFullPower: !1,
        currentStoryChapter: 1,
        currentCutscene: null,
        cutsceneFrameIndex: 0,
        cutsceneTextProgress: 0,
        voiceLine: null,
        dramaticMoment: null,
        introText: null,
        introColor: "#00ffff",
        introTimer: 0,
        saveData: J(),
        soundSettings: eo.loadSettings(),
        lastLevelStars: 0,
        lastLevelKills: 0,
        lastLevelMaxCombo: 0,
        lastLevelCoinsEarned: 0,
        lastLevelHealthPct: 0,
        lastLevelTotalEnemies: 0,
        versusP1Wins: 0,
        versusP2Wins: 0,
        versusCurrentRound: 1,
        versusTotalRounds: 3,
        versusRoundWinner: 0,
        versusMatchWinner: 0,
        dashCooldown: 0,
        shieldCooldown: 0,
        specialCooldown: 0,
        waitingForTap: !1,
        setGamePhase: t => e({
          gamePhase: t
        }),
        setGameMode: t => e({
          gameMode: t
        }),
        startVersus: () => {
          e({
            gameMode: "versus",
            gamePhase: "playing",
            currentLevel: -1,
            score: 0,
            currentWave: 0,
            totalWaves: 0,
            isBossLevel: !1,
            canRevive: !1,
            hasUsedRevive: !1,
            versusP1Wins: 0,
            versusP2Wins: 0,
            versusCurrentRound: 1,
            versusTotalRounds: 3,
            versusRoundWinner: 0,
            versusMatchWinner: 0,
            introText: "FIGHT!",
            introColor: "#ffd700",
            introTimer: 90,
            voiceLine: null,
            waitingForTap: !1
          })
        },
        versusRoundWin: o => {
          let a = t();
          if (3 === o) return void e({
            versusRoundWinner: 3,
            versusCurrentRound: a.versusCurrentRound + 1
          });
          let l = 1 === o ? a.versusP1Wins + 1 : a.versusP1Wins,
            r = 2 === o ? a.versusP2Wins + 1 : a.versusP2Wins,
            n = Math.ceil(a.versusTotalRounds / 2);
          l >= n ? e({
            versusP1Wins: l,
            versusP2Wins: r,
            versusRoundWinner: o,
            versusMatchWinner: 1
          }) : r >= n ? e({
            versusP1Wins: l,
            versusP2Wins: r,
            versusRoundWinner: o,
            versusMatchWinner: 2
          }) : e({
            versusP1Wins: l,
            versusP2Wins: r,
            versusRoundWinner: o,
            versusCurrentRound: a.versusCurrentRound + 1
          })
        },
        versusResetRound: () => {
          e({
            versusRoundWinner: 0,
            gamePhase: "playing",
            introText: `ROUND ${t().versusCurrentRound} — FIGHT!`,
            introColor: "#ffd700",
            introTimer: 90,
            waitingForTap: !1
          })
        },
        versusMatchEnd: t => {
          e({
            versusMatchWinner: t,
            gamePhase: "level-complete"
          })
        },
        startGame: () => {
          let e = t().saveData;
          e.highestLevel >= 1 ? t().startLevel(e.highestLevel) : t().startCutscene("ch1-intro")
        },
        startLevel: o => {
          let a = G.find(e => e.id === o) || U(o);
          if (!a) return;
          let l = a.waves.length + +!!a.bossWave,
            r = function(e) {
              if (1 !== e && e % 10 != 0) return null;
              if (F[e]) return F[e];
              if (e > 250 && e % 10 == 0) {
                let t = Math.floor((e - 1) / 100) + 6;
                return `ch${t}-zone`
              }
              return 1 === e ? "ch1-intro" : null
            }(o),
            n = 1 === o && !t().saveData.hasSeenTapToStart;
          r && z[r] ? (e({
            currentLevel: o,
            score: 0,
            currentWave: 0,
            totalWaves: l,
            isBossLevel: !1,
            canRevive: !0,
            hasUsedRevive: !1,
            voiceLine: null
          }), t().startCutscene(r)) : e({
            currentLevel: o,
            score: 0,
            currentWave: 0,
            totalWaves: l,
            isBossLevel: !1,
            canRevive: !0,
            hasUsedRevive: !1,
            gamePhase: "playing",
            voiceLine: null,
            introText: a.introText,
            introColor: a.introColor,
            introTimer: 60,
            waitingForTap: n
          })
        },
        showVoiceLine: (t, o, a = 90) => {
          e({
            voiceLine: {
              text: t,
              color: o,
              timer: a
            }
          })
        },
        triggerDramaticMoment: (t, o, a = 150) => {
          e({
            dramaticMoment: {
              text: t,
              color: o,
              timer: a
            }
          })
        },
        advanceWave: () => {
          let {
            currentWave: o,
            totalWaves: a,
            currentLevel: l
          } = t(), r = o + 1, n = G.find(e => e.id === l) || U(l);
          if (r >= a) {
            let e = t().score + 200;
            t().completeLevel(e);
            return
          }
          n?.bossWave && r === a - 1 && e({
            isBossLevel: !0
          }), e({
            currentWave: r
          })
        },
        completeLevel: o => {
          let {
            currentLevel: a,
            totalScore: l,
            saveData: r,
            lastLevelStars: n,
            lastLevelKills: i,
            lastLevelMaxCombo: s,
            lastLevelHealthPct: c,
            lastLevelTotalEnemies: d
          } = t(), h = l + o, f = Math.floor(o / 5), u = n;
          0 === u && d > 0 ? (u = 1, (c > 40 || i >= .5 * d) && (u = 2), c > 70 && i >= .8 * d && (u = 3)) :
            0 === u && (u = 1);
          let m = {
            ...r
          };
          (m = X(m = function(e, t) {
            let o = {
              ...e
            };
            for (let e of C) {
              var a, l;
              e.unlockLevel && e.unlockLevel <= t && !o.unlockedSkins.includes(e.id) && (a = o, l = e.id,
                o = a.unlockedSkins.includes(l) ? a : {
                  ...a,
                  unlockedSkins: [...a.unlockedSkins, l]
                })
            }
            for (let e of P) "level" === e.unlockMethod && e.unlockLevel && e.unlockLevel <= t && !o
              .unlockedSkills.includes(e.id) && (o.unlockedSkills = [...o.unlockedSkills, e.id]);
            return t > o.highestLevel && (o.highestLevel = t), o
          }(m, a), f)).totalScore = h, m.missionsCompleted.includes(String(a)) || (m.missionsCompleted = [...m
            .missionsCompleted, String(a)
          ]);
          let x = String(a);
          u > (m.levelStars?.[x] ?? 0) && (m.levelStars = {
            ...m.levelStars,
            [x]: u
          });
          let p = G.find(e => e.id === a) || U(a);
          if (p) {
            for (let e of p.gangMembersAvailable)
              if (!m.gangMembersUnlocked.includes(e)) {
                let t = k.find(t => t.id === e);
                t && t.joinChapter <= parseInt(p.chapter.replace("CH.", "")) && (m.gangMembersUnlocked = [...m
                  .gangMembersUnlocked, e
                ])
              }
          }
          if (a <= 2 ? m.currentChapter = 1 : a <= 4 ? m.currentChapter = 2 : a <= 6 ? m.currentChapter = 3 :
            a <= 7 ? m.currentChapter = 4 : m.currentChapter = 5, a >= m.highestLevel && (m.highestLevel = a +
              1), a > 8) {
            let o = Math.min(Math.floor((a - 1) / 100) + 6, 200);
            o > t().currentStoryChapter && e({
              currentStoryChapter: o
            })
          }
          Z(m), e({
            score: o,
            totalScore: h,
            saveData: m,
            gamePhase: "level-complete"
          })
        },
        gameOver: () => {
          let {
            saveData: o,
            hasUsedRevive: a
          } = t(), l = {
            ...o,
            totalDeaths: o.totalDeaths + 1
          };
          Z(l), eo.stopAll(), e({
            gamePhase: "game-over",
            saveData: l,
            canRevive: !a
          })
        },
        nextLevel: () => {
          let o = t().currentLevel + 1;
          o <= 100 ? t().startLevel(o) : e({
            gamePhase: "menu"
          })
        },
        retryLevel: () => {
          t().startLevel(t().currentLevel)
        },
        backToMenu: () => {
          eo.stopAll(), e({
            gamePhase: "menu",
            gameMode: "single",
            voiceLine: null,
            dramaticMoment: null,
            introText: null,
            introTimer: 0,
            currentCutscene: null,
            versusP1Wins: 0,
            versusP2Wins: 0,
            versusCurrentRound: 1,
            versusRoundWinner: 0,
            versusMatchWinner: 0,
            waitingForTap: !1
          })
        },
        revive: () => {
          let {
            hasUsedRevive: o,
            saveData: a
          } = t();
          o || (e({
            hasUsedRevive: !0,
            canRevive: !1,
            revivedWithFullPower: !0
          }), z.revive ? t().startCutscene("revive") : e({
            gamePhase: "playing",
            waitingForTap: !1
          }))
        },
        startCutscene: o => {
          let a = null;
          if (!a) {
            let o = t().currentLevel,
              a = G.find(e => e.id === o) || U(o);
            e({
              gamePhase: "playing",
              waitingForTap: !1,
              introText: a.introText || "GET READY!",
              introColor: a.introColor || n,
              introTimer: 60
            });
            return
          }
          e({
            currentCutscene: a,
            cutsceneFrameIndex: 0,
            cutsceneTextProgress: 0,
            gamePhase: "cutscene"
          })
        },
        advanceCutscene: () => {
          let {
            currentCutscene: o,
            cutsceneFrameIndex: a
          } = t();
          if (!o) return;
          let l = a + 1;
          if (l < o.frames.length) e({
            cutsceneFrameIndex: l,
            cutsceneTextProgress: 0
          });
          else {
            e({
              currentCutscene: null,
              cutsceneFrameIndex: 0,
              cutsceneTextProgress: 0
            });
            let o = t().currentLevel,
              a = G.find(e => e.id === o) || U(o);
            e({
              gamePhase: "playing",
              introText: a.introText,
              introColor: a.introColor,
              introTimer: 60,
              waitingForTap: !1
            })
          }
        },
        skipCutscene: () => {
          let {
            currentCutscene: o
          } = t();
          if (!o) return;
          e({
            currentCutscene: null,
            cutsceneFrameIndex: 0,
            cutsceneTextProgress: 0
          });
          let a = t().currentLevel,
            l = G.find(e => e.id === a) || U(a);
          l ? e({
            gamePhase: "playing",
            introText: l.introText,
            introColor: l.introColor,
            introTimer: 60,
            waitingForTap: !1
          }) : a >= 100 ? e({
            gamePhase: "victory"
          }) : e({
            gamePhase: "level-complete"
          })
        },
        saveGame: () => {
          Z(t().saveData)
        },
        loadGame: () => {
          e({
            saveData: J()
          })
        },
        buySkin: o => {
          let a, {
              saveData: l
            } = t(),
            r = !(a = C.find(e => e.id === o)) || l.unlockedSkins.includes(o) || l.totalCoins < a.price ?
            null : {
              ...l,
              totalCoins: l.totalCoins - a.price,
              unlockedSkins: [...l.unlockedSkins, o]
            };
          return !!r && (Z(r), e({
            saveData: r
          }), !0)
        },
        selectSkin: o => {
          let {
            saveData: a
          } = t(), l = a.unlockedSkins.includes(o) ? {
            ...a,
            currentSkin: o
          } : a;
          Z(l), e({
            saveData: l
          })
        },
        buyPet: o => {
          let a, {
              saveData: l
            } = t(),
            r = (a = v.find(e => e.id === o)) ? l.unlockedPets.includes(o) ? l : l.totalCoins < a.price ?
            null : {
              ...l,
              totalCoins: l.totalCoins - a.price,
              unlockedPets: [...l.unlockedPets, o]
            } : null;
          return !!r && (Z(r), e({
            saveData: r
          }), !0)
        },
        selectPet: o => {
          let {
            saveData: a
          } = t(), l = a.unlockedPets.includes(o) ? {
            ...a,
            currentPet: o
          } : a;
          Z(l), e({
            saveData: l
          })
        },
        buyPetSkin: o => {
          let a, {
              saveData: l
            } = t(),
            r = !(a = w.find(e => e.id === o)) || l.unlockedPetSkins.includes(o) || l.totalCoins < a.price ?
            null : {
              ...l,
              totalCoins: l.totalCoins - a.price,
              unlockedPetSkins: [...l.unlockedPetSkins, o]
            };
          return !!r && (Z(r), e({
            saveData: r
          }), !0)
        },
        selectPetSkin: o => {
          let {
            saveData: a
          } = t(), l = function(e, t) {
            if (!e.unlockedPetSkins.includes(t)) return e;
            let o = w.find(e => e.id === t);
            return o ? {
              ...e,
              currentPetSkin: t,
              currentPet: o.petId
            } : e
          }(a, o);
          Z(l), e({
            saveData: l
          })
        },
        addCoinsFromScore: o => {
          let a = Math.floor(o / 5),
            {
              saveData: l
            } = t();
          e({
            saveData: X(l, a)
          })
        },
        addCoinsReward: o => {
          let {
            saveData: a
          } = t(), l = X(a, o);
          Z(l), e({
            saveData: l
          })
        },
        setSoundSettings: o => {
          e({
              soundSettings: {
                ...t().soundSettings,
                ...o
              }
            }), void 0 !== o.masterVolume && eo.setMasterVolume(o.masterVolume), void 0 !== o.sfxVolume && eo
            .setSfxVolume(o.sfxVolume), void 0 !== o.musicVolume && eo.setMusicVolume(o.musicVolume),
            void 0 !== o.musicEnabled && eo.setMusicEnabled(o.musicEnabled), void 0 !== o.sfxEnabled && eo
            .setSfxEnabled(o.sfxEnabled)
        },
        updateProfile: o => {
          let {
            saveData: a
          } = t(), l = {
            ...a,
            ...o
          };
          Z(l), e({
            saveData: l
          })
        },
        updateRanking: o => {
          let {
            saveData: a
          } = t(), l = {
            ...a.rankingData
          };
          o ? (l.wins++, l.elo += 25) : (l.losses++, l.elo = Math.max(0, l.elo - 15));
          let r = {
            ...a,
            rankingData: l
          };
          Z(r), e({
            saveData: r
          })
        },
        buySkill: o => {
          let {
            saveData: a
          } = t(), l = P.find(e => e.id === o);
          if (!l || a.unlockedSkills.includes(o)) return !1;
          if ("ad" === l.unlockMethod || "purchase" === l.unlockMethod || "chest" === l.unlockMethod) {
            if (l.unlockCost > 0 && a.totalCoins < l.unlockCost) return !1;
            let t = {
              ...a,
              totalCoins: l.unlockCost > 0 ? a.totalCoins - l.unlockCost : a.totalCoins,
              unlockedSkills: [...a.unlockedSkills, o]
            };
            return Z(t), e({
              saveData: t
            }), !0
          }
          return !1
        },
        equipSkill: (o, a) => {
          let {
            saveData: l
          } = t();
          if (!l.unlockedSkills.includes(o) || a < 0 || a > 2) return;
          let r = [...l.equippedSkills],
            n = r.indexOf(o);
          for (n >= 0 && (r[n] = ""), r[a] = o; r.length > 3;) r.pop();
          for (; r.length < 3;) r.push("");
          let i = {
            ...l,
            equippedSkills: r
          };
          Z(i), e({
            saveData: i
          })
        },
        unequipSkill: o => {
          let {
            saveData: a
          } = t();
          if (o < 0 || o > 2) return;
          let l = [...a.equippedSkills];
          for (l[o] = ""; l.length > 3;) l.pop();
          for (; l.length < 3;) l.push("");
          let r = {
            ...a,
            equippedSkills: l
          };
          Z(r), e({
            saveData: r
          })
        },
        upgradeSkill: o => {
          let {
            saveData: a
          } = t(), l = function(e, t) {
            if (!e.unlockedSkills.includes(t)) return null;
            let o = e.skillUpgrades[t] ?? 1;
            if (o >= 5) return null;
            let a = M[o];
            if (a > 0 && e.totalCoins < a) return null;
            let l = {
              ...e.skillUpgrades,
              [t]: o + 1
            };
            return {
              ...e,
              totalCoins: a > 0 ? e.totalCoins - a : e.totalCoins,
              skillUpgrades: l
            }
          }(a, o);
          return !!l && (Z(l), e({
            saveData: l
          }), !0)
        },
        claimDailyReward: () => {
          let {
            saveData: o
          } = t(), a = function(e) {
            let t;
            if (!Q(e)) return null;
            let o = new Date().toISOString().split("T")[0],
              a = new Date(Date.now() - 864e5).toISOString().split("T")[0];
            if ("" === e.lastDailyRewardDay || e.lastDailyRewardDay === a) t = Math.min(e
              .dailyRewardStreak + 1, 7);
            else {
              if (e.lastDailyRewardDay === o) return null;
              t = 1
            }
            let l = Math.min(t - 1, N.length - 1),
              r = N[l];
            return {
              save: {
                ...e,
                totalCoins: e.totalCoins + r.coins,
                lastDailyRewardDay: o,
                dailyRewardStreak: t
              },
              coins: r.coins,
              day: t
            }
          }(o);
          return a ? (Z(a.save), e({
            saveData: a.save
          }), {
            coins: a.coins,
            day: a.day
          }) : null
        },
        canClaimDaily: () => {
          let {
            saveData: e
          } = t();
          return Q(e)
        },
        upgradeWeapon: o => {
          let {
            saveData: a
          } = t(), l = a.weaponUpgrades[o] ?? 0;
          if (l >= y[o].maxLevel) return !1;
          let r = b(o, l);
          if (false) return !1;
          let n = {
              ...a.weaponUpgrades,
              [o]: l + 1
            },
            i = {
              ...a,
              totalCoins: a.totalCoins - r,
              weaponUpgrades: n
            };
          return Z(i), e({
            saveData: i
          }), !0
        },
        upgradeWeaponByAd: o => {
          let {
            saveData: a
          } = t(), l = a.weaponUpgrades[o] ?? 0;
          if (l >= y[o].maxLevel) return;
          let r = {
              ...a.weaponUpgrades,
              [o]: l + 1
            },
            n = {
              ...a,
              weaponUpgrades: r
            };
          Z(n), e({
            saveData: n
          })
        },
        updateCooldowns: (t, o, a) => {
          e({
            dashCooldown: t,
            shieldCooldown: o,
            specialCooldown: a
          })
        },
        tapToStart: () => {
          let {
            saveData: o
          } = t(), a = {
            ...o,
            hasSeenTapToStart: !0
          };
          Z(a), e({
            waitingForTap: !1,
            saveData: a
          }), "u" > typeof navigator && navigator.vibrate && navigator.vibrate(30)
        },
        upgradeSkinPower: o => {
          let {
            saveData: a
          } = t(), l = C.find(e => e.id === o);
          if (!l || !a.unlockedSkins.includes(o)) return !1;
          let r = a.skinUpgrades?.[o] ?? 0,
            n = Math.floor((l.price > 0 ? l.price : 500) * Math.pow(2, r + 1));
          if (a.totalCoins < n) return !1;
          let i = {
              ...a.skinUpgrades,
              [o]: r + 1
            },
            s = {
              ...a,
              totalCoins: a.totalCoins - n,
              skinUpgrades: i
            };
          return Z(s), e({
            saveData: s
          }), !0
        },
        upgradeSkinPowerByAd: o => {
          let {
            saveData: a
          } = t();
          if (!C.find(e => e.id === o) || !a.unlockedSkins.includes(o)) return;
          let l = a.skinUpgrades?.[o] ?? 0,
            r = {
              ...a.skinUpgrades,
              [o]: l + 1
            },
            n = {
              ...a,
              skinUpgrades: r
            };
          Z(n), e({
            saveData: n
          })
        },
        setCloudSync: e => {
          q = e
        },
        loadCloudSave: o => {
          let a, l = t().saveData,
            r = l.totalScore,
            n = o.totalScore,
            i = l.highestLevel,
            s = o.highestLevel;
          Z(a = s > i || s === i && n > r ? {
            ...o,
            totalCoins: Math.max(l.totalCoins, o.totalCoins)
          } : l), e({
            saveData: a
          })
        },
        resetSave: () => {
          try {
            localStorage.removeItem(K), localStorage.removeItem("neonStickman_sound_v1")
          } catch {}
          e({
            saveData: {
              ...B,
              rankingData: {
                ...D
              }
            },
            soundSettings: {
              ...ee
            }
          })
        }
      })) ? r(t) : r,
      el = new Set,
      er = {
        user: null,
        loading: !0,
        error: null,
        isAnonymous: !1
      },
      en = !1;
    async function ei() {
      if (en) return;
      let {
        getFirebaseAuth: t
      } = await e.A(76207), o = await t(), {
        onAuthStateChanged: a
      } = await e.A(3975);
      en = !0, a(o, e => {
        er = {
          user: e,
          loading: !1,
          error: null,
          isAnonymous: e?.isAnonymous ?? !1
        }, el.forEach(e => e(er))
      })
    }

    function es(e) {
      return el.add(e), e(er), ei(), () => el.delete(e)
    }
    let ec = !1;
    async function ed() {
      if (ec) return er.user;
      ec = !0;
      let {
        getFirebaseAuth: t
      } = await e.A(76207), o = await t();
      if (o.currentUser) return o.currentUser;
      try {
        let {
          signInAnonymously: t
        } = await e.A(3975);
        return (await t(o)).user
      } catch (e) {
        return console.error("Auto anonymous sign-in failed:", e), ec = !1, null
      }
    }
    async function eh() {
      let {
        getFirebaseAuth: t
      } = await e.A(76207), o = await t(), {
        signInAnonymously: a
      } = await e.A(3975);
      try {
        return (await a(o)).user
      } catch (e) {
        return console.error("Anonymous sign-in failed:", e), null
      }
    }
    async function ef() {
      let {
        getFirebaseAuth: t
      } = await e.A(76207), o = await t(), {
        signInWithPopup: a,
        signInWithRedirect: l,
        GoogleAuthProvider: r
      } = await e.A(3975), n = new r;
      try {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window
          .matchMedia("(hover: none) and (pointer: coarse)").matches) return await l(o, n), null;
        return (await a(o, n)).user
      } catch (e) {
        if ("auth/popup-closed-by-user" === e.code) return null;
        return console.error("Google sign-in failed:", e), null
      }
    }
    async function eu() {
      let {
        getFirebaseAuth: t
      } = await e.A(76207), o = await t(), {
        getRedirectResult: a
      } = await e.A(3975);
      try {
        let e = await a(o);
        return e?.user ?? null
      } catch (e) {
        return console.error("Redirect sign-in failed:", e), null
      }
    }
    async function em() {
      let {
        getFirebaseAuth: t
      } = await e.A(76207), o = await t(), {
        signOut: a
      } = await e.A(3975);
      try {
        await a(o)
      } catch (e) {
        console.error("Sign out failed:", e)
      }
    }
    async function ex() {
      let {
        getFirebaseAuth: t
      } = await e.A(76207), o = (await t()).currentUser;
      return o ? {
        uid: o.uid,
        displayName: o.displayName || "NeonWarrior",
        email: o.email,
        photoURL: o.photoURL,
        isAnonymous: o.isAnonymous
      } : null
    }
    var ep = e.i(47053);

    function eg() {
      return !!window.Capacitor?.isNativePlatform?.()
    }
    class ey {
      static instance;
      levelsCompleted = 0;
      INTERSTITIAL_INTERVAL = 2;
      bannerVisible = !1;
      lastAdTime = 0;
      AD_COOLDOWN_MS = 3e3;
      adsWatchedCount = 0;
      lastInterstitialTime = 0;
      admobReady = !1;
      isTesting = !1;
      static getInstance() {
        return ey.instance || (ey.instance = new ey), ey.instance
      }
      async initialize() {
        if (!eg()) {
          console.log("[AdManager] Web mode - using simulated ads"), this.admobReady = !1;
          return
        }
        try {
          let {
            AdMob: t
          } = await e.A(31982);
          await t.initialize({
            initializeForTesting: this.isTesting
          }), this.admobReady = !0, console.log("[AdManager] Native AdMob initialized")
        } catch (e) {
          console.error("[AdManager] Native AdMob init failed; using fallback ads:", e), this.admobReady = !1
        }
      }
      onLevelComplete() {
        return this.levelsCompleted++, this.levelsCompleted % this.INTERSTITIAL_INTERVAL == 0
      }
      canShowInterstitial() {
        return Date.now() - this.lastInterstitialTime > 6e4
      }
      async showInterstitial(t) {
        if (!this.canShowInterstitial()) return !1;
        if (this.lastInterstitialTime = Date.now(), this.adsWatchedCount++, eg() && this.admobReady) try {
          let {
            AdMob: t
          } = await e.A(31982);
          return await t.prepareInterstitial({
            adId: "ca-app-pub-6439599735010649/8990244364",
            isTesting: this.isTesting
          }), await t.showInterstitial(), !0
        } catch (e) {
          return console.error("[AdManager] Interstitial failed:", e), !1
        }
        return new Promise(e => {
          let o = Date.now(),
            a = setInterval(() => {
              let l = Date.now() - o,
                r = Math.min(100, l / 2e3 * 100);
              t?.(r, l), l >= 2e3 && (clearInterval(a), e(!0))
            }, 50)
        })
      }
      async showRewardedAd(t) {
        if (Date.now() - this.lastAdTime < this.AD_COOLDOWN_MS) return {
          rewarded: !1,
          reason: "cooldown",
          durationMs: 0
        };
        if (this.lastAdTime = Date.now(), this.adsWatchedCount++, eg() && this.admobReady) try {
          let {
            AdMob: t
          } = await e.A(31982);
          await t.prepareRewardVideoAd({
            adId: "ca-app-pub-6439599735010649/4027131683",
            isTesting: this.isTesting
          });
          let o = await t.showRewardVideoAd();
          if ("earned" === o.type) return {
            rewarded: !0,
            durationMs: 0
          };
          return {
            rewarded: !1,
            reason: "closed_early",
            durationMs: 0
          }
        } catch (e) {
          return console.error("[AdManager] Rewarded ad failed:", e), {
            rewarded: !1,
            reason: "error",
            durationMs: 0
          }
        }
        let o = 3e3 + 2e3 * Math.random(),
          a = Date.now();
        return new Promise(e => {
          let l = setInterval(() => {
            let r = Date.now() - a,
              n = Math.min(100, r / o * 100);
            t?.(n, r), r >= o && (clearInterval(l), e({
              rewarded: !0,
              durationMs: r
            }))
          }, 50)
        })
      }
      async showRewardedAdWithCallbacks(e, t, o) {
        let a = await this.showRewardedAd(o);
        a.rewarded ? e() : t && a.reason && t(a.reason)
      }
      async showBannerAd() {
        if (this.bannerVisible = !0, eg() && this.admobReady) try {
          let {
            AdMob: t
          } = await e.A(31982);
          await t.prepareBanner({
            adId: "ca-app-pub-6439599735010649/7774805003",
            isTesting: this.isTesting,
            position: "BOTTOM_CENTER",
            adSize: "ADAPTIVE_BANNER"
          }), await t.showBanner()
        } catch (e) {
          console.error("[AdManager] Banner failed:", e)
        }
      }
      async hideBannerAd() {
        if (this.bannerVisible = !1, eg() && this.admobReady) try {
          let {
            AdMob: t
          } = await e.A(31982);
          await t.hideBanner()
        } catch (e) {
          console.error("[AdManager] Hide banner failed:", e)
        }
      }
      isBannerVisible() {
        return this.bannerVisible
      }
      getLevelsCompleted() {
        return this.levelsCompleted
      }
      getAdsWatched() {
        return this.adsWatchedCount
      }
      reset() {
        this.levelsCompleted = 0, this.adsWatchedCount = 0, this.lastInterstitialTime = 0
      }
    }
    let eb = ey.getInstance();
    async function ev() {
      try {
        let e = document.documentElement;
        e.requestFullscreen && await e.requestFullscreen()
      } catch {}
      try {
        let e = screen.orientation;
        e && e.lock && await e.lock("landscape")
      } catch {}
    }

    function ew() {
      return window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
        /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
    let ek = () => () => {};

    function eC() {
      let e, t = (0, a.useSyncExternalStore)(ek, () => ew(), () => !1),
        l = (e = (0, a.useCallback)(e => {
          let t = () => e();
          return window.addEventListener("resize", t), window.addEventListener("orientationchange", t), () => {
            window.removeEventListener("resize", t), window.removeEventListener("orientationchange", t)
          }
        }, []), (0, a.useSyncExternalStore)(e, () => window.innerHeight > 1.4 * window.innerWidth && !
      function() {
          try {
            return screen.orientation.type.includes("landscape")
          } catch (e) {
            return !1
          }
        }(), () => !1));
      return ((0, a.useEffect)(() => {
        ew() && ev()
      }, []), !1) ? (0, o.jsxs)("div", {
        className: "fixed inset-0 z-[9999] bg-[#050510] flex flex-col items-center justify-center gap-6",
        children: [(0, o.jsxs)("div", {
          className: "relative w-20 h-32 border-2 border-cyan-400 rounded-lg rotate-90 transition-transform",
          style: {
            animation: "landscape-hint 2s ease-in-out infinite",
            boxShadow: "0 0 20px rgba(0, 255, 255, 0.4), inset 0 0 10px rgba(0, 255, 255, 0.1)"
          },
          children: [(0, o.jsx)("div", {
            className: "absolute inset-2 border border-cyan-400/40 rounded",
            style: {
              boxShadow: "0 0 8px rgba(0, 255, 255, 0.2)"
            },
            children: (0, o.jsx)("div", {
              className: "flex items-center justify-center h-full",
              children: (0, o.jsxs)("svg", {
                width: "16",
                height: "30",
                viewBox: "0 0 16 30",
                stroke: "#00ffff",
                strokeWidth: "1.5",
                fill: "none",
                children: [(0, o.jsx)("circle", {
                  cx: "8",
                  cy: "5",
                  r: "4"
                }), (0, o.jsx)("line", {
                  x1: "8",
                  y1: "9",
                  x2: "8",
                  y2: "20"
                }), (0, o.jsx)("line", {
                  x1: "8",
                  y1: "13",
                  x2: "3",
                  y2: "17"
                }), (0, o.jsx)("line", {
                  x1: "8",
                  y1: "13",
                  x2: "13",
                  y2: "17"
                }), (0, o.jsx)("line", {
                  x1: "8",
                  y1: "20",
                  x2: "4",
                  y2: "28"
                }), (0, o.jsx)("line", {
                  x1: "8",
                  y1: "20",
                  x2: "12",
                  y2: "28"
                })]
              })
            })
          }), (0, o.jsx)("div", {
            className: "absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-cyan-400/30"
          })]
        }), (0, o.jsx)("div", {
          className: "absolute",
          style: {
            top: "50%",
            right: "20%",
            transform: "translateY(-50%)",
            animation: "arrow-bounce 1.5s ease-in-out infinite"
          },
          children: (0, o.jsxs)("svg", {
            width: "40",
            height: "40",
            viewBox: "0 0 40 40",
            stroke: "#00ffff",
            strokeWidth: "2",
            fill: "none",
            children: [(0, o.jsx)("path", {
              d: "M10 20 A10 10 0 0 1 30 20"
            }), (0, o.jsx)("path", {
              d: "M28 14 L30 20 L24 18",
              stroke: "#00ffff",
              strokeWidth: "2",
              fill: "none"
            })]
          })
        }), (0, o.jsxs)("div", {
          className: "text-center",
          children: [(0, o.jsx)("p", {
            className: "text-cyan-400 text-lg font-bold tracking-wider",
            style: {
              textShadow: "0 0 10px rgba(0, 255, 255, 0.6)"
            },
            children: "ROTATE YOUR DEVICE"
          }), (0, o.jsx)("p", {
            className: "text-cyan-400/60 text-sm mt-2 tracking-wide",
            children: "Best played in landscape mode"
          })]
        }), (0, o.jsx)("div", {
          className: "absolute bottom-0 left-0 right-0 h-16 overflow-hidden opacity-20",
          children: (0, o.jsx)("div", {
            className: "w-full h-full",
            style: {
              backgroundImage: `
              linear-gradient(90deg, rgba(0,255,255,0.3) 1px, transparent 1px),
              linear-gradient(0deg, rgba(0,255,255,0.3) 1px, transparent 1px)
            `,
              backgroundSize: "40px 20px",
              transform: "perspective(200px) rotateX(60deg)",
              transformOrigin: "bottom"
            }
          })
        })]
      }) : null
    }
    let eS = {
        fire: "#ff4400",
        frost: "#88eeff",
        shadow: "#8800ff",
        summon: "#aa00ff",
        death: "#330033",
        lightning: "#ffff00",
        void: "#ff00ff",
        blood: "#cc0000"
      },
      eT = {
        fire: "FIRE",
        frost: "FROST",
        shadow: "SHADOW",
        summon: "SUMMON",
        death: "DEATH",
        lightning: "LIGHTNING",
        void: "VOID",
        blood: "BLOOD"
      },
      eM = {
        common: "#888888",
        rare: n,
        epic: i,
        legendary: m
      },
      ej = {
        common: "#888888",
        rare: n,
        epic: i,
        legendary: m
      };

    function eN({
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

    function eP() {
      let e = (0, a.useMemo)(() => Array.from({
        length: 30
      }, (e, t) => ({
        id: t,
        left: `${100*Math.random()}%`,
        size: 2 + 4 * Math.random(),
        duration: 6 + 10 * Math.random(),
        delay: 8 * Math.random(),
        color: [n, i, s, m, h][Math.floor(5 * Math.random())],
        drift: -20 + 40 * Math.random()
      })), []);
      return (0, o.jsxs)("div", {
        className: "absolute inset-0 overflow-hidden pointer-events-none",
        "aria-hidden": "true",
        children: [e.map(e => (0, o.jsx)("div", {
          className: "absolute rounded-full",
          style: {
            left: e.left,
            bottom: "-10px",
            width: e.size,
            height: e.size,
            backgroundColor: e.color,
            boxShadow: `0 0 ${2*e.size}px ${e.color}, 0 0 ${4*e.size}px ${e.color}40`,
            animation: `particle-float ${e.duration}s linear ${e.delay}s infinite`,
            "--drift": `${e.drift}px`
          }
        }, e.id)), (0, o.jsx)("div", {
          className: "absolute bottom-0 left-0 right-0 h-20 opacity-15",
          children: (0, o.jsx)("div", {
            className: "w-full h-full",
            style: {
              backgroundImage: `
              linear-gradient(90deg, rgba(0,255,255,0.2) 1px, transparent 1px),
              linear-gradient(0deg, rgba(0,255,255,0.2) 1px, transparent 1px)
            `,
              backgroundSize: "30px 15px",
              transform: "perspective(150px) rotateX(60deg)",
              transformOrigin: "bottom"
            }
          })
        })]
      })
    }

    function eA({
      color: e,
      glowColor: t,
      width: a = 40,
      height: l = 64
    }) {
      return (0, o.jsxs)("svg", {
        width: a,
        height: l,
        viewBox: "0 0 40 64",
        style: {
          animation: "stickman-bob 2s ease-in-out infinite",
          filter: `drop-shadow(0 0 4px ${t})`
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

    function eR({
      color: e,
      glowColor: t,
      size: a = 28
    }) {
      return (0, o.jsxs)("svg", {
        width: a,
        height: a,
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

    function eI() {
      let e, t, l = ea(e => e.startGame),
        r = ea(e => e.saveData),
        d = ea(e => e.setGamePhase),
        u = ea(e => e.setGameMode),
        x = ea(e => e.selectPet),
        p = ea(e => e.buyPet),
        g = ea(e => e.buySkin),
        y = ea(e => e.selectSkin),
        b = ea(e => e.buyPetSkin),
        k = ea(e => e.selectPetSkin),
        S = ea(e => e.buySkill),
        T = ea(e => e.equipSkill),
        M = ea(e => e.unequipSkill);
      ea(e => e.upgradeSkill);
      let j = ea(e => e.addCoinsReward),
        [N, A] = (0, a.useState)(!1),
        [R, I] = (0, a.useState)("skins"),
        [E, L] = (0, a.useState)(!1),
        [D, W] = (0, a.useState)(null),
        [B, G] = (0, a.useState)("all"),
        [$, F] = (0, a.useState)(""),
        H = (0, a.useMemo)(() => O(r.rankingData.elo), [r.rankingData.elo]),
        U = (0, a.useMemo)(() => C.find(e => e.id === r.currentSkin) || C[0], [r.currentSkin]),
        V = (0, a.useMemo)(() => v.find(e => e.id === r.currentPet) || v[0], [r.currentPet]),
        z = (0, a.useCallback)(e => {
          eo.init(), eo.playMenuClick(), e()
        }, []),
        _ = (0, a.useCallback)(e => {
          L(!0), W(() => e)
        }, []),
        K = (0, a.useCallback)(() => {
          L(!1), j(200), D && (D(), W(null))
        }, [D, j]),
        q = (0, a.useCallback)(() => {
          _(() => {
            eo.playCoinCollect()
          })
        }, [_]),
        Y = (0, a.useCallback)(() => {
          F("animate-slide-in-right"), z(() => A(!0))
        }, [z]),
        J = (0, a.useCallback)(() => {
          F("animate-slide-in-left"), z(() => A(!1))
        }, [z]),
        Z = (0, a.useMemo)(() => [{
          icon: "🔫",
          label: "",
          color: f,
          action: () => d("weapon-shop")
        }, {
          icon: "🗺️",
          label: "LEVEL MAP",
          color: c,
          action: () => d("level-map")
        }, {
          icon: "🎨",
          label: "",
          color: s,
          action: () => Y()
        }, {
          icon: "🌐",
          label: "",
          color: m,
          action: () => d("online-arena")
        }, {
          icon: "👤",
          label: "",
          color: h,
          action: () => d("profile")
        }, {
          icon: "⚙️",
          label: "",
          color: "#555",
          action: () => d("settings")
        }], [d, Y]);
      return (0, o.jsxs)("div", {
        className: "absolute inset-0 z-20 flex flex-col pointer-events-none",
        style: {
          backgroundColor: "rgba(5,5,20,0.95)"
        },
        children: [E && (0, o.jsx)(eN, {
          onComplete: K
        }), (0, o.jsx)(eP, {}), N ? (0, o.jsxs)("div", {
          className: "flex-1 flex flex-col pointer-events-auto overflow-hidden",
          children: [(0, o.jsxs)("div", {
            className: "flex items-center justify-between px-4 py-2",
            style: {
              borderBottom: "1px solid rgba(0,255,255,0.1)",
              backgroundColor: "rgba(0,0,0,0.3)"
            },
            children: [(0, o.jsx)("button", {
              onClick: J,
              className: "neon-btn py-1.5 px-3 text-xs font-bold tracking-wider font-mono",
              style: {
                borderColor: "#555",
                color: "#888",
                minHeight: 36
              },
              children: "← BACK"
            }), (0, o.jsx)("h2", {
              className: "text-sm font-bold tracking-wider font-mono",
              style: {
                color: s,
                textShadow: "0 0 10px #00ff66"
              },
              children: "🎨 CUSTOMIZATION"
            }), (0, o.jsxs)("div", {
              className: "font-mono text-xs",
              style: {
                color: m,
                textShadow: "0 0 8px #ffd700"
              },
              children: ["🪙 ", r.totalCoins.toLocaleString()]
            })]
          }), (0, o.jsx)("div", {
            className: "flex gap-1 px-4 py-2",
            style: {
              backgroundColor: "rgba(0,0,0,0.2)"
            },
            children: [{
              id: "skins",
              label: "",
              color: n
            }, {
              id: "pets",
              label: "",
              color: s
            }, {
              id: "skills",
              label: "",
              color: c
            }].map(e => (0, o.jsx)("button", {
              onClick: () => z(() => I(e.id)),
              className: "flex-1 py-2 text-[10px] font-bold font-mono tracking-wider rounded",
              style: {
                backgroundColor: R === e.id ? `${e.color}20` : "rgba(0,0,0,0.3)",
                border: `1px solid ${R===e.id?e.color:"#333"}`,
                color: R === e.id ? e.color : "#666",
                textShadow: R === e.id ? `0 0 8px ${e.color}` : "none",
                minHeight: 36
              },
              children: e.label
            }, e.id))
          }), (0, o.jsxs)("div", {
            className: "flex-1 overflow-y-auto px-4 py-2 dark-scroll",
            style: {
              scrollbarWidth: "thin",
              WebkitOverflowScrolling: "touch"
            },
            children: ["skins" === R && (0, o.jsxs)("div", {
              className: "space-y-3",
              children: [(0, o.jsx)("div", {
                className: "text-[10px] font-mono font-bold mb-1",
                style: {
                  color: n,
                  textShadow: "0 0 5px rgba(0,255,255,0.3)"
                },
                children: "CHARACTER SKINS"
              }), (0, o.jsx)("div", {
                className: "grid grid-cols-3 gap-1.5",
                children: C.map(e => {
                  let t = r.unlockedSkins.includes(e.id),
                    a = r.currentSkin === e.id,
                    l = r.totalCoins >= e.price,
                    i = e.price >= 2e3;
                  return (0, o.jsxs)("div", {
                    className: "rounded-lg p-1.5 text-center",
                    style: {
                      backgroundColor: a ? `${e.color}15` : "rgba(0,0,0,0.3)",
                      border: `1px solid ${a?e.color:t?`${e.color}60`:"#333"}`,
                      boxShadow: a ?
                        `0 0 8px ${e.color}30, inset 0 0 8px ${e.color}10` :
                        "none"
                    },
                    children: [(0, o.jsxs)("div", {
                      className: "relative mx-auto mb-0.5 flex justify-center",
                      children: [(0, o.jsx)(eA, {
                        color: e.color,
                        glowColor: e.glowColor,
                        width: 20,
                        height: 32
                      }), (0, o.jsx)("div", {
                        className: "absolute -top-0.5 -right-0.5 text-[5px] font-bold font-mono px-0.5 rounded",
                        style: {
                          backgroundColor: ej[e.rarity],
                          color: "#000"
                        },
                        children: e.rarity.slice(0, 3).toUpperCase()
                      })]
                    }), (0, o.jsx)("div", {
                      className: "font-bold text-[8px] font-mono mb-0.5",
                      style: {
                        color: e.color
                      },
                      children: e.name
                    }), a ? (0, o.jsx)("div", {
                      className: "text-[7px] font-mono font-bold",
                      style: {
                        color: s,
                        textShadow: "0 0 5px rgba(0,255,102,0.4)"
                      },
                      children: "EQUIPPED"
                    }) : t ? (0, o.jsx)("button", {
                      onClick: () => z(() => y(e.id)),
                      className: "text-[7px] font-mono font-bold px-1.5 py-0.5 rounded min-h-[22px]",
                      style: {
                        backgroundColor: `${e.color}20`,
                        border: `1px solid ${e.color}60`,
                        color: e.color
                      },
                      children: "EQUIP"
                    }) : i ? (0, o.jsx)("button", {
                      onClick: () => l ? z(() => {
                        g(e.id), y(e.id), eo.playCoinCollect()
                      }) : _(() => {
                        z(() => {
                          g(e.id), y(e.id), eo.playCoinCollect()
                        })
                      }),
                      className: "text-[7px] font-mono font-bold px-1 py-0.5 rounded min-h-[22px]",
                      style: {
                        backgroundColor: l ? "rgba(255,215,0,0.15)" :
                          "rgba(0,255,255,0.1)",
                        border: `1px solid ${l?"#ffd700":n}`,
                        color: l ? "#ffd700" : n
                      },
                      children: l ? `${e.price} 🪙` : "🔒 WATCH AD"
                    }) : (0, o.jsxs)("button", {
                      onClick: () => l && z(() => {
                        g(e.id), y(e.id), eo.playCoinCollect()
                      }),
                      className: "text-[7px] font-mono font-bold px-1 py-0.5 rounded min-h-[22px]",
                      style: {
                        backgroundColor: l ? "rgba(255,215,0,0.15)" :
                          "rgba(0,0,0,0.3)",
                        border: `1px solid ${l?"#ffd700":"#333"}`,
                        color: l ? "#ffd700" : "#555"
                      },
                      children: [e.price, " 🪙"]
                    })]
                  }, e.id)
                })
              }), (0, o.jsxs)("div", {
                className: "text-[10px] font-mono font-bold mb-1 mt-3",
                style: {
                  color: s,
                  textShadow: "0 0 5px rgba(0,255,102,0.3)"
                },
                children: ["PET SKINS — ", V.name]
              }), (0, o.jsx)("div", {
                className: "grid grid-cols-3 gap-1.5",
                children: w.filter(e => e.petId === r.currentPet).map(e => {
                  let t = r.unlockedPetSkins.includes(e.id),
                    a = r.currentPetSkin === e.id,
                    l = r.totalCoins >= e.price,
                    i = e.price >= 800;
                  return (0, o.jsxs)("div", {
                    className: "rounded-lg p-1.5 text-center",
                    style: {
                      backgroundColor: a ? `${e.color}15` : "rgba(0,0,0,0.3)",
                      border: `1px solid ${a?e.color:t?`${e.color}60`:"#333"}`
                    },
                    children: [(0, o.jsxs)("div", {
                      className: "relative mx-auto mb-0.5 flex justify-center",
                      children: [(0, o.jsx)(eR, {
                        color: e.color,
                        glowColor: e.glowColor,
                        size: 22
                      }), (0, o.jsx)("div", {
                        className: "absolute -top-0.5 -right-0.5 text-[5px] font-bold font-mono px-0.5 rounded",
                        style: {
                          backgroundColor: ej[e.rarity],
                          color: "#000"
                        },
                        children: e.rarity.slice(0, 3).toUpperCase()
                      })]
                    }), (0, o.jsx)("div", {
                      className: "font-bold text-[8px] font-mono mb-0.5",
                      style: {
                        color: e.color
                      },
                      children: e.name
                    }), a ? (0, o.jsx)("div", {
                      className: "text-[7px] font-mono font-bold",
                      style: {
                        color: s
                      },
                      children: "EQUIPPED"
                    }) : t ? (0, o.jsx)("button", {
                      onClick: () => z(() => k(e.id)),
                      className: "text-[7px] font-mono font-bold px-1.5 py-0.5 rounded min-h-[22px]",
                      style: {
                        backgroundColor: `${e.color}20`,
                        border: `1px solid ${e.color}60`,
                        color: e.color
                      },
                      children: "EQUIP"
                    }) : i ? (0, o.jsx)("button", {
                      onClick: () => l ? z(() => {
                        b(e.id), k(e.id), eo.playCoinCollect()
                      }) : _(() => {
                        z(() => {
                          b(e.id), k(e.id), eo.playCoinCollect()
                        })
                      }),
                      className: "text-[7px] font-mono font-bold px-1 py-0.5 rounded min-h-[22px]",
                      style: {
                        backgroundColor: l ? "rgba(255,215,0,0.15)" :
                          "rgba(0,255,255,0.1)",
                        border: `1px solid ${l?"#ffd700":n}`,
                        color: l ? "#ffd700" : n
                      },
                      children: l ? `${e.price} 🪙` : "🔒 WATCH AD"
                    }) : (0, o.jsxs)("button", {
                      onClick: () => l && z(() => {
                        b(e.id), k(e.id), eo.playCoinCollect()
                      }),
                      className: "text-[7px] font-mono font-bold px-1 py-0.5 rounded min-h-[22px]",
                      style: {
                        backgroundColor: l ? "rgba(255,215,0,0.15)" :
                          "rgba(0,0,0,0.3)",
                        border: `1px solid ${l?"#ffd700":"#333"}`,
                        color: l ? "#ffd700" : "#555"
                      },
                      children: [e.price, " 🪙"]
                    })]
                  }, e.id)
                })
              })]
            }), "pets" === R && (0, o.jsx)("div", {
              className: "space-y-1.5",
              children: v.map(e => {
                let t = r.unlockedPets.includes(e.id),
                  a = r.currentPet === e.id,
                  l = r.totalCoins >= e.price,
                  i = e.price >= 1500;
                return (0, o.jsxs)("div", {
                  className: "flex items-center gap-2 p-2 rounded-lg",
                  style: {
                    backgroundColor: a ? `${e.color}15` : t ? `${e.color}08` :
                      "rgba(0,0,0,0.2)",
                    border: `1px solid ${a?e.color:t?`${e.color}40`:"#33333340"}`,
                    boxShadow: a ? `0 0 8px ${e.color}20` : "none"
                  },
                  children: [(0, o.jsx)("div", {
                    className: "flex-shrink-0",
                    children: (0, o.jsx)(eR, {
                      color: e.color,
                      glowColor: e.glowColor,
                      size: 32
                    })
                  }), (0, o.jsxs)("div", {
                    className: "flex-1 min-w-0",
                    children: [(0, o.jsx)("div", {
                      className: "font-bold text-[9px] font-mono",
                      style: {
                        color: t ? e.color : "#555"
                      },
                      children: e.name
                    }), (0, o.jsx)("div", {
                      className: "text-[8px] font-mono truncate",
                      style: {
                        color: t ? "#888" : "#444"
                      },
                      children: e.description
                    }), (0, o.jsxs)("div", {
                      className: "text-[7px] font-mono mt-0.5",
                      style: {
                        color: "#666"
                      },
                      children: ["DMG:", e.damage, " | SPD:", e
                        .shootRate > 0 ? (60 / e.shootRate).toFixed(1) :
                        "0", "/s"
                      ]
                    })]
                  }), (0, o.jsx)("div", {
                    className: "flex-shrink-0 min-w-[60px] text-right",
                    children: a ? (0, o.jsx)("span", {
                      className: "text-[8px] font-mono font-bold px-2 py-1 rounded inline-block",
                      style: {
                        color: s,
                        backgroundColor: "rgba(0,255,102,0.1)",
                        border: "1px solid rgba(0,255,102,0.3)"
                      },
                      children: "ACTIVE"
                    }) : t ? (0, o.jsx)("button", {
                      onClick: () => z(() => x(e.id)),
                      className: "text-[8px] font-mono font-bold px-2 py-1 rounded min-h-[28px]",
                      style: {
                        backgroundColor: `${e.color}20`,
                        border: `1px solid ${e.color}60`,
                        color: e.color
                      },
                      children: "SELECT"
                    }) : i ? (0, o.jsx)("button", {
                      onClick: () => l ? z(() => {
                        p(e.id), eo.playCoinCollect()
                      }) : _(() => {
                        z(() => {
                          p(e.id), eo.playCoinCollect()
                        })
                      }),
                      className: "text-[8px] font-mono font-bold px-1.5 py-1 rounded min-h-[28px]",
                      style: {
                        backgroundColor: l ? "rgba(255,215,0,0.15)" :
                          "rgba(0,255,255,0.1)",
                        border: `1px solid ${l?"#ffd700":n}`,
                        color: l ? "#ffd700" : n
                      },
                      children: l ? `${e.price} 🪙` : "🔒 WATCH AD"
                    }) : (0, o.jsxs)("button", {
                      onClick: () => l && z(() => {
                        p(e.id), eo.playCoinCollect()
                      }),
                      className: "text-[8px] font-mono font-bold px-1.5 py-1 rounded min-h-[28px]",
                      style: {
                        backgroundColor: l ? "rgba(255,215,0,0.15)" :
                          "rgba(0,0,0,0.3)",
                        border: `1px solid ${l?"#ffd700":"#333"}`,
                        color: l ? "#ffd700" : "#555"
                      },
                      children: [e.price, " 🪙"]
                    })
                  })]
                }, e.id)
              })
            }), "skills" === R && (e = "all" === B ? P : P.filter(e => e.element === B), t = r
              .equippedSkills, (0, o.jsxs)("div", {
                className: "space-y-2",
                children: [(0, o.jsxs)("div", {
                  className: "p-2 rounded-lg",
                  style: {
                    backgroundColor: "rgba(255,102,0,0.06)",
                    border: "1px solid #ff660020"
                  },
                  children: [(0, o.jsx)("div", {
                    className: "text-[8px] font-mono font-bold mb-1.5",
                    style: {
                      color: c,
                      textShadow: "0 0 5px rgba(255,102,0,0.3)"
                    },
                    children: "EQUIPPED SKILLS"
                  }), (0, o.jsx)("div", {
                    className: "flex gap-1.5",
                    children: [0, 1, 2].map(e => {
                      let a = t[e],
                        l = a ? P.find(e => e.id === a) : null,
                        n = a ? r.skillUpgrades[a] || 1 : 0;
                      return (0, o.jsx)("div", {
                        className: "flex-1 p-1.5 rounded text-center cursor-pointer min-h-[48px] flex flex-col items-center justify-center",
                        style: {
                          backgroundColor: l ? `${l.color}15` :
                            "rgba(0,0,0,0.3)",
                          border: `1px solid ${l?l.color+"60":"#33333340"}`
                        },
                        onClick: () => z(() => M(e)),
                        role: "button",
                        "aria-label": l ?
                          `Unequip ${l.name} from slot ${e+1}` :
                          `Empty skill slot ${e+1}`,
                        children: l ? (0, o.jsxs)(o.Fragment, {
                          children: [(0, o.jsx)("div", {
                            className: "text-[8px] font-mono font-bold",
                            style: {
                              color: l.color
                            },
                            children: l.name
                          }), (0, o.jsxs)("div", {
                            className: "text-[7px] font-mono",
                            style: {
                              color: "#666"
                            },
                            children: ["CD:", (l.cooldown / 60)
                              .toFixed(1), "s Lv.", n
                            ]
                          }), (0, o.jsx)("div", {
                            className: "w-full h-1 rounded-full mt-0.5",
                            style: {
                              backgroundColor: "#222"
                            },
                            children: (0, o.jsx)("div", {
                              className: "h-full rounded-full",
                              style: {
                                width: `${Math.min(100,l.cooldown/600*100)}%`,
                                backgroundColor: l.color,
                                opacity: .6
                              }
                            })
                          })]
                        }) : (0, o.jsx)("div", {
                          className: "text-[8px] font-mono",
                          style: {
                            color: "#555"
                          },
                          children: ["⚡", "🛡", "✨"][e]
                        })
                      }, e)
                    })
                  })]
                }), (0, o.jsxs)("div", {
                  className: "flex gap-0.5 flex-wrap",
                  children: [(0, o.jsx)("button", {
                    onClick: () => z(() => G("all")),
                    className: "px-1.5 py-0.5 rounded text-[7px] font-mono font-bold min-h-[22px]",
                    style: {
                      backgroundColor: "all" === B ? "rgba(255,255,255,0.12)" :
                        "rgba(0,0,0,0.3)",
                      border: `1px solid ${"all"===B?"#ffffff50":"#333"}`,
                      color: "all" === B ? "#fff" : "#666"
                    },
                    children: "ALL"
                  }), ["fire", "frost", "shadow", "summon", "death", "lightning",
                    "void", "blood"
                  ].map(e => (0, o.jsx)("button", {
                    onClick: () => z(() => G(e)),
                    className: "px-1.5 py-0.5 rounded text-[7px] font-mono font-bold min-h-[22px]",
                    style: {
                      backgroundColor: B === e ? `${eS[e]}25` :
                        "rgba(0,0,0,0.3)",
                      border: `1px solid ${B===e?eS[e]+"60":"#333"}`,
                      color: B === e ? eS[e] : "#666"
                    },
                    children: eT[e]
                  }, e))]
                }), (0, o.jsx)("div", {
                  className: "flex flex-col gap-1.5 max-h-[50vh] overflow-y-auto",
                  style: {
                    scrollbarWidth: "none"
                  },
                  children: e.map(e => {
                    let a = r.unlockedSkills.includes(e.id),
                      l = t.includes(e.id),
                      i = r.totalCoins >= e.unlockCost,
                      c = "ad" === e.unlockMethod,
                      d = r.skillUpgrades[e.id] || 1;
                    return (0, o.jsxs)("div", {
                      className: "p-1.5 rounded-lg flex gap-1.5 items-center",
                      style: {
                        backgroundColor: a ? `${e.color}08` : "rgba(0,0,0,0.2)",
                        border: `1px solid ${l?e.color:a?e.color+"40":"#33333330"}`,
                        boxShadow: l ? `0 0 6px ${e.color}15` : "none"
                      },
                      children: [(0, o.jsx)("div", {
                        className: "w-8 h-8 rounded flex items-center justify-center flex-shrink-0",
                        style: {
                          backgroundColor: `${e.color}15`,
                          border: `1px solid ${e.color}40`
                        },
                        children: (0, o.jsx)("div", {
                          className: "w-3.5 h-3.5 rounded-full",
                          style: {
                            backgroundColor: e.color,
                            boxShadow: `0 0 8px ${e.glowColor}`
                          }
                        })
                      }), (0, o.jsxs)("div", {
                        className: "flex-1 min-w-0",
                        children: [(0, o.jsxs)("div", {
                          className: "flex items-center gap-1",
                          children: [(0, o.jsx)("span", {
                            className: "font-bold text-[8px] font-mono",
                            style: {
                              color: a ? e.color : "#555"
                            },
                            children: e.name
                          }), (0, o.jsx)("span", {
                            className: "text-[6px] font-mono px-0.5 rounded",
                            style: {
                              backgroundColor: `${eM[e.rarity]}20`,
                              color: eM[e.rarity]
                            },
                            children: e.rarity.slice(0, 3)
                              .toUpperCase()
                          }), (0, o.jsx)("span", {
                            className: "text-[6px] font-mono px-0.5 rounded",
                            style: {
                              backgroundColor: `${eS[e.element]}15`,
                              color: eS[e.element]
                            },
                            children: eT[e.element]
                          }), a && d > 1 && (0, o.jsxs)(
                          "span", {
                            className: "text-[6px] font-mono font-bold",
                            style: {
                              color: m
                            },
                            children: ["★", d]
                          })]
                        }), (0, o.jsx)("div", {
                          className: "text-[7px] font-mono truncate",
                          style: {
                            color: a ? "#777" : "#444"
                          },
                          children: e.description
                        }), (0, o.jsxs)("div", {
                          className: "flex items-center gap-1 mt-0.5",
                          children: [(0, o.jsx)("div", {
                            className: "flex-1 h-1 rounded-full",
                            style: {
                              backgroundColor: "#222"
                            },
                            children: (0, o.jsx)("div", {
                              className: "h-full rounded-full",
                              style: {
                                width: `${Math.min(100,e.cooldown/600*100)}%`,
                                backgroundColor: e.color,
                                opacity: .6
                              }
                            })
                          }), (0, o.jsxs)("span", {
                            className: "text-[6px] font-mono flex-shrink-0",
                            style: {
                              color: "#666"
                            },
                            children: [(e.cooldown / 60)
                              .toFixed(1), "s"
                            ]
                          })]
                        })]
                      }), (0, o.jsx)("div", {
                        className: "flex-shrink-0",
                        children: a ? l ? (0, o.jsx)("span", {
                            className: "text-[8px] font-mono font-bold px-2 py-1 rounded inline-block",
                            style: {
                              color: s,
                              backgroundColor: "rgba(0,255,102,0.1)",
                              border: "1px solid rgba(0,255,102,0.3)"
                            },
                            children: "EQUIPPED"
                          }) : (0, o.jsx)("div", {
                            className: "flex gap-0.5",
                            children: [0, 1, 2].map(t => (0, o.jsx)(
                              "button", {
                                onClick: () => z(() => T(e.id, t)),
                                className: "text-[7px] font-mono font-bold px-1.5 py-0.5 rounded min-h-[24px]",
                                style: {
                                  backgroundColor: `${e.color}20`,
                                  border: `1px solid ${e.color}50`,
                                  color: e.color
                                },
                                children: ["1", "2", "3"][t]
                              }, t))
                          }) : c ? (0, o.jsx)("button", {
                            onClick: () => i ? z(() => {
                              S(e.id), eo.playCoinCollect()
                            }) : _(() => {
                              z(() => {
                                S(e.id), eo.playCoinCollect()
                              })
                            }),
                            className: "text-[7px] font-mono font-bold px-1.5 py-1 rounded min-h-[24px]",
                            style: {
                              backgroundColor: i ?
                                "rgba(255,215,0,0.15)" :
                                "rgba(0,255,255,0.1)",
                              border: `1px solid ${i?"#ffd700":n}`,
                              color: i ? "#ffd700" : n
                            },
                            children: i ? `${e.unlockCost} 🪙` :
                              "🔒 WATCH AD"
                          }) : "purchase" === e.unlockMethod ||
                          "chest" === e.unlockMethod ? (0, o.jsxs)(
                            "button", {
                              onClick: () => i && z(() => {
                                S(e.id), eo.playCoinCollect()
                              }),
                              className: "text-[7px] font-mono font-bold px-1.5 py-1 rounded min-h-[24px]",
                              style: {
                                backgroundColor: i ?
                                  "rgba(255,215,0,0.15)" :
                                  "rgba(0,0,0,0.3)",
                                border: `1px solid ${i?"#ffd700":"#333"}`,
                                color: i ? "#ffd700" : "#555"
                              },
                              children: [e.unlockCost, " 🪙"]
                            }) : (0, o.jsx)("span", {
                            className: "text-[6px] font-mono",
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
                                  return e.unlockCost > 0 ?
                                    `${e.unlockCost} Coins` :
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
                            }(e)
                          })
                      })]
                    }, e.id)
                  })
                })]
              }))]
          }), (0, o.jsx)("div", {
            className: "text-center py-1.5 text-[7px] font-mono",
            style: {
              color: "rgba(255,255,255,0.2)",
              borderTop: "1px solid rgba(255,255,255,0.05)"
            },
            children: "Watch ads to earn coins • Complete levels to unlock more"
          })]
        }) : (0, o.jsxs)("div", {
          className: "flex-1 flex pointer-events-auto",
          children: [(0, o.jsxs)("div", {
            className: "flex-1 flex flex-col items-center justify-center p-4 gap-2",
            children: [(0, o.jsxs)("div", {
              className: "flex items-center gap-3 mb-1",
              children: [(0, o.jsx)("div", {
                className: "hidden sm:block",
                children: (0, o.jsx)(eA, {
                  color: U.color,
                  glowColor: U.glowColor,
                  width: 44,
                  height: 70
                })
              }), (0, o.jsxs)("div", {
                children: [(0, o.jsx)("h1", {
                  className: "text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider leading-tight font-mono",
                  style: {
                    color: n,
                    textShadow: "0 0 15px #00ffff, 0 0 30px #00ffff, 0 0 60px rgba(0,255,255,0.3)",
                    animation: "neon-pulse 3s ease-in-out infinite"
                  },
                  children: "NEON STICKMAN"
                }), (0, o.jsx)("p", {
                  className: "text-sm sm:text-lg md:text-xl tracking-widest leading-tight font-mono",
                  style: {
                    color: i,
                    textShadow: "0 0 10px #ff00ff, 0 0 25px #ff00ff, 0 0 50px rgba(255,0,255,0.3)",
                    animation: "neon-pulse 3s ease-in-out infinite 0.5s"
                  },
                  children: "STICK WAR"
                })]
              })]
            }), (0, o.jsx)("div", {
              className: "sm:hidden",
              children: (0, o.jsx)(eA, {
                color: U.color,
                glowColor: U.glowColor,
                width: 32,
                height: 50
              })
            }), (0, o.jsxs)("div", {
              className: "flex items-center justify-center gap-3 font-mono text-xs px-3 py-1.5 rounded-lg",
              style: {
                backgroundColor: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,215,0,0.15)"
              },
              children: [(0, o.jsxs)("span", {
                style: {
                  color: m,
                  textShadow: "0 0 8px #ffd700"
                },
                children: ["🪙 ", r.totalCoins.toLocaleString()]
              }), (0, o.jsx)("span", {
                style: {
                  color: "#444"
                },
                children: "│"
              }), (0, o.jsxs)("span", {
                style: {
                  color: c,
                  textShadow: "0 0 5px #ff6600"
                },
                children: [H.icon, " ", H.rank]
              }), (0, o.jsx)("span", {
                style: {
                  color: "#444"
                },
                children: "│"
              }), (0, o.jsxs)("span", {
                style: {
                  color: "rgba(255,255,255,0.5)"
                },
                children: ["LV ", r.highestLevel, "/", 100]
              })]
            }), (0, o.jsx)("div", {
              className: "w-full max-w-[260px]",
              children: (0, o.jsx)("div", {
                className: "h-1.5 rounded-full",
                style: {
                  backgroundColor: "rgba(0,0,0,0.4)",
                  border: "1px solid #222"
                },
                children: (0, o.jsx)("div", {
                  className: "h-full rounded-full transition-all duration-500",
                  style: {
                    width: `${Math.min(100,r.highestLevel)}%`,
                    backgroundColor: n,
                    boxShadow: "0 0 6px #00ffff"
                  }
                })
              })
            }), (0, o.jsx)("button", {
              onClick: () => z(() => {
                ev(), u("single"), l()
              }),
              className: "neon-btn w-full max-w-[280px] py-3 px-6 text-lg font-bold tracking-wider font-mono",
              style: {
                borderColor: r.highestLevel > 0 ? s : n,
                color: r.highestLevel > 0 ? s : n,
                textShadow: r.highestLevel > 0 ? "0 0 15px #00ff66, 0 0 30px #00ff66" :
                  "0 0 15px #00ffff, 0 0 30px #00ffff",
                animation: "continue-pulse 2s ease-in-out infinite",
                minHeight: 56
              },
              children: r.highestLevel > 0 ? "▶ CONTINUE" : "⚔️ PLAY"
            }), (0, o.jsx)("button", {
              onClick: () => z(q),
              className: "neon-btn w-full max-w-[280px] py-2 px-4 text-sm font-bold tracking-wider font-mono",
              style: {
                borderColor: m,
                color: m,
                textShadow: "0 0 8px #ffd700",
                backgroundImage: "linear-gradient(90deg, transparent, rgba(255,215,0,0.06), transparent)",
                backgroundSize: "200% 100%",
                animation: "ad-shimmer 3s linear infinite",
                minHeight: 44
              },
              children: "🎬 WATCH AD +200 🪙"
            })]
          }), (0, o.jsx)("div", {
            className: "flex-1 flex items-center justify-center p-4",
            children: (0, o.jsxs)("div", {
              className: "w-full max-w-[320px] rounded-xl p-3",
              style: {
                border: "1px solid rgba(0,255,255,0.15)",
                animation: "neon-border-glow 4s ease-in-out infinite",
                backgroundColor: "rgba(0,0,0,0.3)"
              },
              children: [(0, o.jsx)("div", {
                className: "grid grid-cols-2 gap-2",
                children: Z.map(e => (0, o.jsxs)("button", {
                  onClick: () => z(e.action),
                  className: "neon-btn py-2.5 px-3 text-xs font-bold tracking-wider font-mono flex items-center justify-center gap-1.5",
                  style: {
                    borderColor: e.color,
                    color: e.color,
                    textShadow: `0 0 8px ${e.color}`,
                    minHeight: 48
                  },
                  children: [(0, o.jsx)("span", {
                    className: "text-base",
                    children: e.icon
                  }), (0, o.jsx)("span", {
                    children: e.label
                  })]
                }, e.label))
              }), (0, o.jsxs)("div", {
                className: "mt-2 text-center text-[8px] font-mono",
                style: {
                  color: "rgba(255,255,255,0.25)"
                },
                children: [H.icon, " ELO ", r.rankingData.elo, " • ", r.rankingData.wins,
                  "W/", r.rankingData.losses, "L"
                ]
              })]
            })
          })]
        })]
      })
    }

    function eE(e, t, o, a, l, r, n, i, s = 1, c = "neutral", d = !1, h = !1, f = 0, u = "") {
      let m = Math.abs(f) > 6,
        x = Math.min(Math.abs(f) / 10, 1.5),
        p = m ? .45 : .3;
      if (h) {
        e.save(), e.translate(t, o), e.globalAlpha = .3 + .2 * Math.sin(.1 * r), e.shadowBlur = 20, e.shadowColor =
          l, e.strokeStyle = l, e.lineWidth = 2 * s;
        let a = .5 * r;
        e.beginPath(), e.arc(Math.sin(.3 * r) * a, -38 * s + Math.cos(.2 * r) * a, 8 * s, 0, 2 * Math.PI), e
        .stroke(), e.beginPath(), e.moveTo(Math.sin(.4 * r) * a * .5, -30 * s), e.lineTo(Math.cos(.3 * r) * a *
          .5, -10 * s), e.stroke(), e.restore();
        return
      }
      e.save(), e.translate(t, o), e.shadowBlur = 15, e.shadowColor = l;
      let g = d && i ? 3 * Math.abs(Math.sin(r * p)) * s * x : Math.sin(.06 * r) * s;
      e.beginPath(), e.arc(0, -38 * s - g, 9 * s, 0, 2 * Math.PI), e.strokeStyle = l, e.lineWidth = 2.5 * s, e
        .globalAlpha = 1, e.stroke(),
        function(e, t, o, a, l) {
          switch (e.shadowBlur = 8, e.shadowColor = a, e.lineWidth = 1.5 * o, l) {
            case "angry":
              e.strokeStyle = a, e.beginPath(), e.moveTo(-5 * t * o, -43 * o), e.lineTo(t * o, -41 * o), e.stroke(),
                e.beginPath(), e.moveTo(5 * t * o, -43 * o), e.lineTo(t * o, -41 * o), e.stroke(), e.fillStyle =
                "#ffffff", e.beginPath(), e.arc(3 * t * o, -39 * o, 2 * o, 0, 2 * Math.PI), e.fill(), e.fillStyle =
                a, e.beginPath(), e.arc(3 * t * o, -39 * o, 1.2 * o, 0, 2 * Math.PI), e.fill();
              break;
            case "smirk":
              e.strokeStyle = a, e.beginPath(), e.moveTo(-5 * t * o, -42 * o), e.lineTo(t * o, -43 * o), e.stroke(),
                e.fillStyle = "#ffffff", e.beginPath(), e.arc(3 * t * o, -39 * o, 2 * o, 0, 2 * Math.PI), e.fill(),
                e.fillStyle = a, e.beginPath(), e.arc(3.5 * t * o, -39 * o, +o, 0, 2 * Math.PI), e.fill(), e
                .strokeStyle = a, e.beginPath(), e.moveTo(-2 * t * o, -35 * o), e.lineTo(4 * t * o, -35.5 * o), e
                .lineTo(5 * t * o, -36.5 * o), e.stroke();
              break;
            case "determined":
              e.strokeStyle = a, e.beginPath(), e.moveTo(-4 * t * o, -42 * o), e.lineTo(5 * t * o, -42 * o), e
                .stroke(), e.fillStyle = "#ffffff", e.beginPath(), e.arc(3 * t * o, -39 * o, 2 * o, 0, 2 * Math.PI),
                e.fill(), e.fillStyle = a, e.beginPath(), e.arc(3 * t * o, -39 * o, 1.2 * o, 0, 2 * Math.PI), e
                .fill(), e.strokeStyle = a, e.lineWidth = 1.5 * o, e.beginPath(), e.moveTo(-2 * t * o, -35 * o), e
                .lineTo(3 * t * o, -35 * o), e.stroke();
              break;
            case "hurt": {
              e.strokeStyle = a;
              let l = 3 * t * o,
                r = -39 * o;
              e.beginPath(), e.moveTo(l - 2 * o, r - 2 * o), e.lineTo(l + 2 * o, r + 2 * o), e.stroke(), e
                .beginPath(), e.moveTo(l + 2 * o, r - 2 * o), e.lineTo(l - 2 * o, r + 2 * o), e.stroke(), e
                .beginPath(), e.moveTo(-2 * t * o, -35 * o), e.lineTo(0 * t * o, -34 * o), e.lineTo(3 * t * o, -
                  35.5 * o), e.stroke();
              break
            }
            case "victory":
              e.fillStyle = "#ffffff", e.beginPath(), e.arc(t * o, -39 * o, 2 * o, 0, 2 * Math.PI), e.fill(), e
                .beginPath(), e.arc(5 * t * o, -39 * o, 2 * o, 0, 2 * Math.PI), e.fill(), e.strokeStyle = a, e
                .lineWidth = 1.5 * o, e.beginPath(), e.arc(3 * t * o, -37 * o, 5 * o, .1, Math.PI - .1), e.stroke();
              break;
            default:
              e.fillStyle = a, e.globalAlpha = .8, e.beginPath(), e.arc(3 * t * o, -39.5 * o, 2 * o, 0, 2 * Math
                .PI), e.fill(), e.globalAlpha = .5, e.strokeStyle = a, e.lineWidth = +o, e.beginPath(), e.moveTo(0 *
                  t * o, -35 * o), e.lineTo(3 * t * o, -35.2 * o), e.stroke()
          }
          e.globalAlpha = 1
        }(e, a, s, l, c);
      let y = d ? a * (m ? 5 * s : 2 * s) * Math.min(x + .5, 1.2) : 0;
      e.globalAlpha = .3, e.lineWidth = 5 * s, e.beginPath(), e.moveTo(y, -29 * s - .5 * g), e.lineTo(0, -10 * s), e
        .stroke(), e.globalAlpha = 1, e.lineWidth = 2.5 * s, e.beginPath(), e.moveTo(y, -29 * s - .5 * g), e.lineTo(
          0, -10 * s), e.stroke(), e.globalAlpha = .4 + .2 * Math.sin(.08 * r), e.fillStyle = l, e.shadowBlur = 12,
        e.beginPath(), e.arc(.5 * y, -22 * s - .3 * g, 3 * s, 0, 2 * Math.PI), e.fill(), e.globalAlpha = 1;
      let b = -25 * s - .5 * g;
      if (n) {
        let t = 3 * Math.sin(.8 * r) * s;
        e.globalAlpha = .3, e.lineWidth = 5 * s, e.beginPath(), e.moveTo(y - .3 * t, b), e.lineTo(-(15 * s * a), b +
            5 * s), e.stroke(), e.globalAlpha = 1, e.lineWidth = 2.5 * s, e.beginPath(), e.moveTo(y - .3 * t, b), e
          .lineTo(-(15 * s * a), b + 5 * s), e.stroke(), e.globalAlpha = .3, e.lineWidth = 5 * s, e.beginPath(), e
          .moveTo(y - .3 * t, b), e.lineTo(25 * s * a - t * a * .5, b - 3 * s), e.stroke(), e.globalAlpha = 1, e
          .lineWidth = 2.5 * s, e.beginPath(), e.moveTo(y - .3 * t, b), e.lineTo(25 * s * a - t * a * .5, b - 3 *
          s), e.stroke(), e.globalAlpha = .9, e.fillStyle = "#ffffff", e.shadowColor = "#ffffff", e.shadowBlur = 30,
          e.beginPath(), e.arc(28 * a * s, b - 3 * s, 5 * s, 0, 2 * Math.PI), e.fill(), e.globalAlpha = .5, e
          .fillStyle = l, e.shadowColor = l, e.shadowBlur = 25, e.beginPath(), e.arc(28 * a * s, b - 3 * s, 9 * s,
            0, 2 * Math.PI), e.fill(), e.globalAlpha = .7, e.fillStyle = "#ffffff";
        for (let t = 0; t < 4; t++) {
          let t = (a > 0 ? 0 : Math.PI) + (Math.random() - .5) * 1.2,
            o = 10 + 10 * Math.random();
          e.beginPath(), e.arc(28 * a * s + Math.cos(t) * o * s, b - 3 * s + Math.sin(t) * o * s, (1 + 1.5 * Math
            .random()) * s, 0, 2 * Math.PI), e.fill()
        }
        e.globalAlpha = 1
      } else {
        let t = m ? 22 * s : d ? 16 * s : 3 * s,
          o = i ? Math.sin(r * p) * t * x : -8 * s,
          l = m ? 15 * s : 12 * s;
        e.globalAlpha = .3, e.lineWidth = 5 * s, e.beginPath(), e.moveTo(y, b), e.lineTo(-a * l, b + o), e.stroke(),
          e.globalAlpha = 1, e.lineWidth = 2.5 * s, e.beginPath(), e.moveTo(y, b), e.lineTo(-a * l, b + o), e
          .stroke(), !d && i ? (e.globalAlpha = .3, e.lineWidth = 5 * s, e.beginPath(), e.moveTo(y, b), e.lineTo(8 *
              s * a, b + 12 * s + 2 * Math.sin(.05 * r) * s), e.stroke(), e.globalAlpha = 1, e.lineWidth = 2.5 * s,
            e.beginPath(), e.moveTo(y, b), e.lineTo(8 * s * a, b + 12 * s + 2 * Math.sin(.05 * r) * s)) : (e
            .globalAlpha = .3, e.lineWidth = 5 * s, e.beginPath(), e.moveTo(y, b), e.lineTo(a * l, b - o), e
            .stroke(), e.globalAlpha = 1, e.lineWidth = 2.5 * s, e.beginPath(), e.moveTo(y, b), e.lineTo(a * l, b -
              o)), e.stroke()
      }
      if (i)
        if (d) {
          let t = Math.sin(r * p) * (m ? 20 * s : 14 * s) * Math.max(x, .6),
            o = m ? 12 * s : 8 * s;
          e.globalAlpha = .3, e.lineWidth = 5 * s, e.beginPath(), e.moveTo(0, -10 * s), e.lineTo(-(.5 * o) + .3 * t,
              -10 * s + 12 * s), e.lineTo(-o + .5 * t, -10 * s + 22 * s + .6 * t), e.stroke(), e.beginPath(), e
            .moveTo(0, -10 * s), e.lineTo(.5 * o - .3 * t, -10 * s + 12 * s), e.lineTo(o - .5 * t, -10 * s + 22 *
              s - .6 * t), e.stroke(), e.globalAlpha = 1, e.lineWidth = 2.5 * s, e.beginPath(), e.moveTo(0, -10 *
            s), e.lineTo(-(.5 * o) + .3 * t, -10 * s + 12 * s), e.lineTo(-o + .5 * t, -10 * s + 22 * s + .6 * t), e
            .stroke(), e.beginPath(), e.moveTo(0, -10 * s), e.lineTo(.5 * o - .3 * t, -10 * s + 12 * s), e.lineTo(
              o - .5 * t, -10 * s + 22 * s - .6 * t), e.stroke()
        } else {
          let t = 1.5 * Math.sin(.06 * r) * s;
          e.globalAlpha = .3, e.lineWidth = 5 * s, e.beginPath(), e.moveTo(0, -10 * s), e.lineTo(-9 * s, -10 * s +
              20 * s + t), e.stroke(), e.beginPath(), e.moveTo(0, -10 * s), e.lineTo(9 * s, -10 * s + 20 * s + t), e
            .stroke(), e.globalAlpha = 1, e.lineWidth = 2.5 * s, e.beginPath(), e.moveTo(0, -10 * s), e.lineTo(-9 *
              s, -10 * s + 20 * s + t), e.stroke(), e.beginPath(), e.moveTo(0, -10 * s), e.lineTo(9 * s, -10 * s +
              20 * s + t), e.stroke()
        }
      else e.globalAlpha = .3, e.lineWidth = 5 * s, e.beginPath(), e.moveTo(0, -10 * s), e.lineTo(-10 * s, -10 * s +
          14 * s), e.stroke(), e.beginPath(), e.moveTo(0, -10 * s), e.lineTo(10 * s, -10 * s + 14 * s), e.stroke(),
        e.globalAlpha = 1, e.lineWidth = 2.5 * s, e.beginPath(), e.moveTo(0, -10 * s), e.lineTo(-10 * s, -10 * s +
          14 * s), e.stroke(), e.beginPath(), e.moveTo(0, -10 * s), e.lineTo(10 * s, -10 * s + 14 * s), e.stroke();
      if (d && i) {
        let t = m ? 5 : 3,
          o = m ? 10 * s : 8 * s;
        e.strokeStyle = l, e.lineWidth = m ? 2 * s : 1.5 * s;
        for (let l = 1; l <= t; l++) {
          let t = -a * l * o;
          e.globalAlpha = Math.max(.15 - .03 * l, .02), e.beginPath(), e.moveTo(t, -38 * s - g), e.lineTo(t + y, -
            29 * s - .5 * g), e.lineTo(t, -10 * s), e.stroke()
        }
        if (m) {
          e.lineWidth = +s;
          for (let t = 0; t < 3; t++) {
            let o = -32 * s + 10 * t * s,
              l = (8 + 12 * Math.random()) * s;
            e.globalAlpha = .1 + .1 * Math.random(), e.beginPath(), e.moveTo(-a * (15 + 5 * t) * s, o), e.lineTo(-
              a * (15 + 5 * t + l / s) * s, o), e.stroke()
          }
        }
      }
      if (e.shadowBlur = 0, e.globalAlpha = 1, u && !h) {
        switch (e.save(), u) {
          case "rainbow": {
            let t = 3 * r % 360,
              o = `hsl(${t}, 100%, 60%)`;
            e.globalAlpha = .15 + .08 * Math.sin(.08 * r), e.shadowBlur = 25, e.shadowColor = o, e.fillStyle = o, e
              .beginPath(), e.arc(0, -20 * s, 35 * s, 0, 2 * Math.PI), e.fill(), e.globalAlpha = .6;
            for (let o = 0; o < 5; o++) {
              let a = o / 5 * Math.PI * 2 + .05 * r,
                l = 30 * s + 8 * Math.sin(.06 * r + o) * s,
                n = (t + 72 * o) % 360;
              e.fillStyle = `hsl(${n}, 100%, 70%)`, e.beginPath(), e.arc(Math.cos(a) * l, -20 * s + Math.sin(a) *
                l * .5, 1.5 * s, 0, 2 * Math.PI), e.fill()
            }
            break
          }
          case "sparkle":
            if (r % 8 < 2) {
              e.globalAlpha = .4, e.fillStyle = "#ffffff", e.shadowBlur = 20, e.shadowColor = "#ffffff";
              let t = 15 * Math.sin(.7 * r) * s,
                o = (-20 + 15 * Math.cos(.5 * r)) * s;
              e.beginPath(), e.arc(t, o, 3 * s, 0, 2 * Math.PI), e.fill()
            }
            e.globalAlpha = .08 + .05 * Math.sin(.1 * r), e.fillStyle = "#ffffff", e.shadowBlur = 15, e
              .shadowColor = "#88ffff", e.beginPath(), e.arc(0, -20 * s, 30 * s, 0, 2 * Math.PI), e.fill();
            break;
          case "shadow":
            e.globalAlpha = .3, e.strokeStyle = "#333344", e.lineWidth = 2 * s;
            for (let t = 1; t <= 3; t++) e.globalAlpha = Math.max(.2 - .06 * t, .02), e.beginPath(), e.arc(-a * t *
              10 * s, -38 * s, 8 * s, 0, 2 * Math.PI), e.stroke(), e.beginPath(), e.moveTo(-a * t * 10 * s, -29 *
              s), e.lineTo(-a * t * 10 * s, -10 * s), e.stroke();
            e.globalAlpha = .1 + .05 * Math.sin(.07 * r), e.fillStyle = "#222233", e.shadowBlur = 20, e
              .shadowColor = "#444466", e.beginPath(), e.arc(0, -20 * s, 25 * s, 0, 2 * Math.PI), e.fill();
            break;
          case "plasma":
            e.globalAlpha = .2 + .1 * Math.sin(.12 * r), e.fillStyle = "#ff44ff", e.shadowBlur = 20, e.shadowColor =
              "#ff88ff", e.beginPath(), e.arc(0, -20 * s, 28 * s + 5 * Math.sin(.1 * r) * s, 0, 2 * Math.PI), e
              .fill(), e.strokeStyle = "#ff88ff", e.lineWidth = 1.5 * s, e.globalAlpha = .5;
            for (let t = 0; t < 3; t++) {
              let o = .1 * r + 2 * t;
              e.beginPath(), e.moveTo(10 * Math.cos(o) * s, -20 * s + 10 * Math.sin(o) * s), e.lineTo(25 * Math.cos(
                o + .5) * s, -20 * s + 25 * Math.sin(o + .5) * s), e.stroke()
            }
