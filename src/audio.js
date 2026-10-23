// src/audio.js - Procedural Web Audio Engine for Delhi Auto Life Simulator

class AudioManager {
  constructor() {
    this.ctx = null;
    this.initialized = false;
    this.engineNode = null;
    this.engineGain = null;
    this.engineFilter = null;
    this.isEngineRunning = false;
    this.isMuted = false;
    this.hornOscs = [];
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio not supported or blocked:', e);
    }
  }

  ensureContext() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- Auto-Rickshaw Engine Sound ---
  startEngine() {
    if (!this.initialized) this.init();
    if (!this.ctx || this.isEngineRunning) return;
    this.ensureContext();

    try {
      // 2-stroke engine simulation with pulse oscillator and lowpass filter
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(26, this.ctx.currentTime); // Low idle rpm

      const subOsc = this.ctx.createOscillator();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(13, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);
      filter.Q.setValueAtTime(3, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.isMuted ? 0 : 0.28, this.ctx.currentTime);

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      subOsc.start();

      this.engineOsc = osc;
      this.subOsc = subOsc;
      this.engineFilter = filter;
      this.engineGain = gain;
      this.isEngineRunning = true;
    } catch (e) {
      console.warn('Engine audio error:', e);
    }
  }

  updateEngine(speedKmh, throttle = 0) {
    if (!this.isEngineRunning || !this.ctx || this.isMuted) return;
    const normSpeed = Math.min(Math.abs(speedKmh) / 60, 1.0);
    // Base frequency increases with speed and throttle
    const targetFreq = 26 + normSpeed * 75 + (throttle > 0 ? 15 : 0);
    const filterFreq = 320 + normSpeed * 700 + (throttle > 0 ? 250 : 0);

    const now = this.ctx.currentTime;
    this.engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.08);
    this.subOsc.frequency.setTargetAtTime(targetFreq * 0.5, now, 0.08);
    this.engineFilter.frequency.setTargetAtTime(filterFreq, now, 0.08);

    const targetGain = 0.22 + normSpeed * 0.15 + (throttle > 0 ? 0.08 : 0);
    this.engineGain.gain.setTargetAtTime(targetGain, now, 0.1);
  }

  stopEngine() {
    if (!this.isEngineRunning) return;
    try {
      if (this.engineGain && this.ctx) {
        this.engineGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      }
      setTimeout(() => {
        try {
          this.engineOsc?.stop();
          this.subOsc?.stop();
        } catch (_) {}
        this.isEngineRunning = false;
      }, 120);
    } catch (e) {
      this.isEngineRunning = false;
    }
  }

  // --- Classic Indian Pressure Horn ("Peep-Peep / Paa-Paa") ---
  playHorn(start = true) {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;

    if (!start) {
      this.stopHorn();
      return;
    }

    if (this.hornOscs.length > 0) return; // Already honking

    try {
      // Classic Delhi high-pitch dual-tone pneumatic horn (approx 440Hz & 520Hz)
      const freqs = [440, 523, 880];
      const now = this.ctx.currentTime;
      const hornGain = this.ctx.createGain();
      hornGain.gain.setValueAtTime(0, now);
      hornGain.gain.linearRampToValueAtTime(0.35, now + 0.03);
      hornGain.connect(this.ctx.destination);
      this.activeHornGain = hornGain;

      freqs.forEach(freq => {
        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        // Slight frequency vibrato
        const mod = this.ctx.createOscillator();
        const modGain = this.ctx.createGain();
        mod.frequency.setValueAtTime(14, now);
        modGain.gain.setValueAtTime(6, now);
        mod.connect(modGain);
        modGain.connect(osc.frequency);
        mod.start();

        osc.connect(hornGain);
        osc.start();
        this.hornOscs.push(osc, mod);
      });
    } catch (e) {
      console.warn('Horn error:', e);
    }
  }

  stopHorn() {
    if (!this.ctx || this.hornOscs.length === 0) return;
    try {
      const now = this.ctx.currentTime;
      if (this.activeHornGain) {
        this.activeHornGain.gain.linearRampToValueAtTime(0.001, now + 0.05);
      }
      setTimeout(() => {
        this.hornOscs.forEach(osc => {
          try { osc.stop(); } catch (_) {}
        });
        this.hornOscs = [];
        this.activeHornGain = null;
      }, 60);
    } catch (_) {
      this.hornOscs = [];
    }
  }

  // --- Sound Effects ---
  playBrake() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.25);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch (_) {}
  }

  playCash() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      // High bell chimes
      [1046.5, 1318.5, 1567.98, 2093].forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.06);
        gain.gain.setValueAtTime(0, now + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.2, now + i * 0.06 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.36);
      });
    } catch (_) {}
  }

  playMissionComplete() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, C (Major fanfare)
      const now = this.ctx.currentTime;
      notes.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + (idx === 3 ? 0.8 : 0.3));

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + (idx === 3 ? 0.82 : 0.32));
      });
    } catch (_) {}
  }

  playDialogueBlip() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480 + Math.random() * 80, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.045);
    } catch (_) {}
  }

  playFootstep() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.06);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.065);
    } catch (_) {}
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.engineGain && this.ctx) {
      this.engineGain.gain.setValueAtTime(this.isMuted ? 0 : 0.25, this.ctx.currentTime);
    }
    return this.isMuted;
  }
}

export const audio = new AudioManager();
