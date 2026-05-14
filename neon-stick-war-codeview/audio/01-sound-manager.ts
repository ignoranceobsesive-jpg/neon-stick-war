              .shortNoiseBuffer = this.createNoiseBuffer(2205)
          } catch {}
        }
        createNoiseBuffer(e) {
          if (!this.ctx) return null;
          let t = this.ctx.createBuffer(1, e, this.ctx.sampleRate),
            o = t.getChannelData(0);
          for (let t = 0; t < e; t++) o[t] = 2 * Math.random() - 1;
          return t
        }
        ensureCtx() {
          if (this.ctx || this.init(), this.ctx?.state === "suspended") {
            let e = performance.now();
            e - this.lastResumeTime >= this.RESUME_THROTTLE_MS && (this.lastResumeTime = e, this.ctx.resume())
          }
        }
        canPlaySfx(e) {
          let t = performance.now();
          return !(t - (this.lastSfxTime[e] || 0) < this.SFX_THROTTLE_MS) && (this.lastSfxTime[e] = t, !0)
        }
        setMasterVolume(e) {
          this.masterVolume = e, this.masterGain && (this.masterGain.gain.value = e), this.saveSettings()
        }
        setSfxVolume(e) {
          this.sfxVolume = e, this.sfxGain && (this.sfxGain.gain.value = e), this.saveSettings()
        }
        setMusicVolume(e) {
          this.musicVolume = e, this.musicGain && (this.musicGain.gain.value = e), this.saveSettings()
        }
        setMusicEnabled(e) {
          this.musicEnabled = e, e ? this.ctx && this.startMusic() : this.stopMusic(), this.saveSettings()
        }
        setSfxEnabled(e) {
          this.sfxEnabled = e, this.saveSettings()
        }
        playTone(e, t, o = "square", a = .3, l) {
          if (this.sfxEnabled && this.ctx && this.sfxGain && !(this.activeNodeCount >= this.MAX_ACTIVE_NODES) && (
              this.ensureCtx(), "running" === this.ctx.state)) try {
            this.activeNodeCount++;
            let r = this.ctx.createOscillator(),
              n = this.ctx.createGain();
            r.type = o, r.frequency.setValueAtTime(e, this.ctx.currentTime), void 0 !== l && r.frequency
              .linearRampToValueAtTime(l, this.ctx.currentTime + t), n.gain.setValueAtTime(a, this.ctx
                .currentTime), n.gain.exponentialRampToValueAtTime(.001, this.ctx.currentTime + t), r.connect(
              n), n.connect(this.sfxGain), r.start(this.ctx.currentTime), r.stop(this.ctx.currentTime + t), r
              .onended = () => {
                this.activeNodeCount = Math.max(0, this.activeNodeCount - 1)
              }
          } catch {
            this.activeNodeCount = Math.max(0, this.activeNodeCount - 1)
          }
        }
        playNoise(e, t = .3, o) {
          if (this.sfxEnabled && this.ctx && this.sfxGain && !(this.activeNodeCount >= this.MAX_ACTIVE_NODES) && (
              this.ensureCtx(), "running" === this.ctx.state)) try {
            this.activeNodeCount++;
            let a = this.ctx.createBufferSource(),
              l = this.noiseBuffer || this.shortNoiseBuffer;
            if (!l) {
              this.activeNodeCount = Math.max(0, this.activeNodeCount - 1);
              return
            }
            a.buffer = l;
            let r = this.ctx.createGain();
            if (r.gain.setValueAtTime(t, this.ctx.currentTime), r.gain.exponentialRampToValueAtTime(.001, this
                .ctx.currentTime + e), o) {
              let e = this.ctx.createBiquadFilter();
              e.type = "bandpass", e.frequency.value = o, e.Q.value = 2, a.connect(e), e.connect(r)
            } else a.connect(r);
            r.connect(this.sfxGain), a.start(this.ctx.currentTime), a.stop(this.ctx.currentTime + e), a
              .onended = () => {
                this.activeNodeCount = Math.max(0, this.activeNodeCount - 1)
              }
          } catch {
            this.activeNodeCount = Math.max(0, this.activeNodeCount - 1)
          }
        }
        playToneNoise(e, t, o = "sine", a = .2, l = .15, r) {
          this.playTone(e, t, o, a), this.playNoise(r ?? t, l)
        }
        playShoot() {
          this.canPlaySfx("shoot") && this.playTone(800, .15, "square", .15, 400)
        }
        playDash() {
          this.canPlaySfx("dash") && this.playNoise(.15, .2, 2e3)
        }
        playShield() {
          this.canPlaySfx("shield") && (this.playTone(220, .12, "sine", .12), this.playTone(330, .12, "sine", .1),
            setTimeout(() => {
              this.playTone(220, .1, "sine", .08), this.playTone(330, .1, "sine", .06)
            }, 120))
        }
        playSpecial() {
          this.playTone(200, .3, "square", .15, 800)
        }
        playHit() {
          this.canPlaySfx("hit") && this.playToneNoise(100, .08, "sine", .12, .15, .06)
        }
        playExplosion() {
          this.canPlaySfx("explosion") && (this.playNoise(.4, .25, 200), this.playTone(60, .4, "sine", .2, 20))
