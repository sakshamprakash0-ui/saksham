// src/ui.js - Complete Open-World Game HUD, Mini-Map, Speedometer & Dialogue UI

export class UIManager {
  constructor(game) {
    this.game = game;
    this.container = document.getElementById('ui-container');
    this.elements = {};

    this.initDOM();
    this.initMiniMap();
    this.setupEventListeners();
  }

  initDOM() {
    this.container.innerHTML = `
      <!-- Top Header Bar -->
      <div class="hud-top-bar">
        <div class="hud-status-group">
          <button id="char-switch-btn" class="hud-btn mode-btn">
            <span class="btn-icon">🔄</span>
            <div class="mode-text">
              <span class="mode-label">CURRENT ROLE</span>
              <strong id="mode-val">HARSH [School]</strong>
            </div>
          </button>
          <div class="time-card">
            <span class="clock-icon">🕒</span>
            <span id="time-val">08:30 AM</span>
            <span class="location-tag">Tri Nagar, Delhi</span>
          </div>
        </div>

        <div class="hud-cash-group">
          <div class="cash-badge">
            <span class="rupee-sym">₹</span>
            <span id="cash-val">450</span>
          </div>
          <button id="camera-btn" class="hud-icon-btn" title="Toggle Camera (C)">🎥</button>
          <button id="audio-btn" class="hud-icon-btn" title="Mute/Unmute Audio">🔊</button>
          <button id="pause-btn" class="hud-icon-btn" title="Pause Menu (Esc)">⏸️</button>
        </div>
      </div>

      <!-- Active Mission Card -->
      <div class="mission-card" id="mission-card">
        <div class="mission-header">
          <span class="mission-tag">ACTIVE MISSION</span>
          <span id="mission-reward-val" class="reward-tag">+ ₹50</span>
        </div>
        <h3 id="mission-title-val">1. Morning in Tri Nagar</h3>
        <p id="mission-desc-val">Walk into the kitchen and talk to Mummy (Mamta)</p>
        <div class="mission-distance">
          <span class="dist-icon">📍</span>
          <span id="mission-dist-val">Calculating...</span>
        </div>
      </div>

      <!-- Contextual Interaction Prompt -->
      <div id="interaction-prompt" class="interaction-prompt hidden">
        <span class="prompt-key">[ E ]</span>
        <span id="prompt-text">Interact</span>
      </div>

      <!-- Mini-Map Radar (Bottom Left) -->
      <div class="minimap-container">
        <canvas id="minimap-canvas" width="160" height="160"></canvas>
        <div class="minimap-compass">N</div>
      </div>

      <!-- Vehicle Dashboard (Bottom Right - Visible when driving) -->
      <div id="vehicle-hud" class="vehicle-hud hidden">
        <div class="speedo-container">
          <div class="speedo-dial">
            <div id="speedo-needle" class="speedo-needle"></div>
            <div class="speedo-center">
              <span id="speedo-num">0</span>
              <small>KM/H</small>
            </div>
          </div>
          <div class="fuel-group">
            <div class="fuel-label">
              <span>CNG FUEL</span>
              <span id="fuel-val">85%</span>
            </div>
            <div class="fuel-track">
              <div id="fuel-bar" class="fuel-fill" style="width: 85%;"></div>
            </div>
          </div>
        </div>
        <div class="vehicle-actions">
          <button id="hud-horn-btn" class="v-btn horn-btn">📢 HORN (H)</button>
          <button id="hud-exit-btn" class="v-btn exit-btn">🚪 EXIT (E)</button>
          <button id="hud-reset-btn" class="v-btn reset-btn" title="Flip / Reset Auto">🔄 RESET</button>
        </div>
      </div>

      <!-- On-Foot Actions (Bottom Right - Visible when walking) -->
      <div id="foot-hud" class="foot-hud">
        <button id="hud-enter-btn" class="v-btn enter-btn">🛺 ENTER AUTO (E)</button>
      </div>

      <!-- Mobile Touch Controls -->
      <div id="touch-controls" class="touch-controls">
        <div class="touch-dpad">
          <button id="touch-up" class="touch-btn dpad-up">▲</button>
          <div class="dpad-middle">
            <button id="touch-left" class="touch-btn dpad-left">◀</button>
            <button id="touch-down" class="touch-btn dpad-down">▼</button>
            <button id="touch-right" class="touch-btn dpad-right">▶</button>
          </div>
        </div>
        <div class="touch-actions">
          <button id="touch-e" class="touch-btn action-e">E</button>
          <button id="touch-horn" class="touch-btn action-horn">📢</button>
          <button id="touch-brake" class="touch-btn action-brake">✋</button>
        </div>
      </div>

      <!-- Dialogue Modal Box -->
      <div id="dialogue-box" class="dialogue-box hidden">
        <div class="dialogue-header">
          <div id="dialogue-avatar" class="dialogue-avatar">👤</div>
          <div>
            <strong id="dialogue-speaker">Speaker</strong>
            <span id="dialogue-role" class="dialogue-role">Role</span>
          </div>
        </div>
        <div id="dialogue-text" class="dialogue-content">Dialogue line goes here...</div>
        <div class="dialogue-footer">
          <button id="dialogue-next-btn" class="hud-btn primary-btn">CONTINUE [Space / Tap]</button>
        </div>
      </div>

      <!-- Mission Complete Celebration Modal -->
      <div id="mission-modal" class="modal-overlay hidden">
        <div class="modal-card">
          <div class="modal-stars">⭐⭐⭐</div>
          <h2 class="modal-title">MISSION COMPLETE!</h2>
          <h3 id="modal-mission-title" class="modal-subtitle">Morning in Tri Nagar</h3>
          <div class="modal-reward-badge">
            <span>EARNED:</span>
            <strong id="modal-reward-val">+ ₹120</strong>
          </div>
          <button id="modal-continue-btn" class="hud-btn primary-btn btn-large">NEXT OBJECTIVE</button>
        </div>
      </div>

      <!-- Pause Menu Modal -->
      <div id="pause-modal" class="modal-overlay hidden">
        <div class="modal-card pause-card">
          <h2>DELHI AUTO SIMULATOR</h2>
          <p class="pause-tagline">Tri Nagar & KV Keshav Puram 3D</p>
          <div class="pause-menu-items">
            <button id="resume-btn" class="hud-btn primary-btn">RESUME GAME</button>
            <button id="switch-role-pause-btn" class="hud-btn">SWITCH TO KULDEEP / HARSH</button>
            <button id="toggle-sound-pause-btn" class="hud-btn">TOGGLE SOUND</button>
            <button id="reset-game-btn" class="hud-btn danger-btn">RESET PROGRESS</button>
          </div>
          <div class="controls-cheatsheet">
            <strong>Controls Cheatsheet:</strong>
            <div>WASD / Arrow Keys : Drive Auto / Walk</div>
            <div>Space : Handbrake / Jump</div>
            <div>E : Enter / Exit Vehicle & Talk to People</div>
            <div>C : Change Camera (Chase / Cockpit)</div>
            <div>H : Delhi Street Horn</div>
            <div>Shift : Sprint on Foot</div>
          </div>
        </div>
      </div>
    `;

    // Cache elements
    this.elements = {
      modeVal: document.getElementById('mode-val'),
      timeVal: document.getElementById('time-val'),
      cashVal: document.getElementById('cash-val'),
      missionCard: document.getElementById('mission-card'),
      missionTitle: document.getElementById('mission-title-val'),
      missionDesc: document.getElementById('mission-desc-val'),
      missionDist: document.getElementById('mission-dist-val'),
      missionReward: document.getElementById('mission-reward-val'),
      interactionPrompt: document.getElementById('interaction-prompt'),
      promptText: document.getElementById('prompt-text'),
      vehicleHud: document.getElementById('vehicle-hud'),
      footHud: document.getElementById('foot-hud'),
      speedoNeedle: document.getElementById('speedo-needle'),
      speedoNum: document.getElementById('speedo-num'),
      fuelVal: document.getElementById('fuel-val'),
      fuelBar: document.getElementById('fuel-bar'),
      dialogueBox: document.getElementById('dialogue-box'),
      dialogueSpeaker: document.getElementById('dialogue-speaker'),
      dialogueRole: document.getElementById('dialogue-role'),
      dialogueText: document.getElementById('dialogue-text'),
      dialogueAvatar: document.getElementById('dialogue-avatar'),
      dialogueNextBtn: document.getElementById('dialogue-next-btn'),
      missionModal: document.getElementById('mission-modal'),
      modalMissionTitle: document.getElementById('modal-mission-title'),
      modalRewardVal: document.getElementById('modal-reward-val'),
      modalContinueBtn: document.getElementById('modal-continue-btn'),
      pauseModal: document.getElementById('pause-modal'),
      minimapCanvas: document.getElementById('minimap-canvas')
    };
  }

  initMiniMap() {
    this.miniCtx = this.elements.minimapCanvas.getContext('2d');
  }

  setupEventListeners() {
    document.getElementById('char-switch-btn').addEventListener('click', () => {
      this.game.switchCharacterMode();
    });

    document.getElementById('camera-btn').addEventListener('click', () => {
      this.game.toggleCamera();
    });

    document.getElementById('audio-btn').addEventListener('click', () => {
      const muted = this.game.audio.toggleMute();
      document.getElementById('audio-btn').textContent = muted ? '🔇' : '🔊';
    });

    document.getElementById('pause-btn').addEventListener('click', () => {
      this.togglePause();
    });

    document.getElementById('resume-btn').addEventListener('click', () => {
      this.togglePause(false);
    });

    document.getElementById('switch-role-pause-btn').addEventListener('click', () => {
      this.game.switchCharacterMode();
      this.togglePause(false);
    });

    document.getElementById('toggle-sound-pause-btn').addEventListener('click', () => {
      const muted = this.game.audio.toggleMute();
      document.getElementById('audio-btn').textContent = muted ? '🔇' : '🔊';
    });

    document.getElementById('reset-game-btn').addEventListener('click', () => {
      if (confirm('Are you sure you want to restart your day in Tri Nagar?')) {
        this.game.resetProgress();
        this.togglePause(false);
      }
    });

    document.getElementById('hud-horn-btn')?.addEventListener('click', () => {
      this.game.audio.playHorn(true);
      setTimeout(() => this.game.audio.playHorn(false), 400);
    });

    document.getElementById('hud-exit-btn')?.addEventListener('click', () => {
      this.game.toggleVehicle();
    });

    document.getElementById('hud-enter-btn')?.addEventListener('click', () => {
      this.game.toggleVehicle();
    });

    document.getElementById('hud-reset-btn')?.addEventListener('click', () => {
      this.game.autoRickshaw.resetPosition();
    });

    this.elements.dialogueNextBtn.addEventListener('click', () => {
      this.game.dialogue.next();
    });

    // Touch Controls setup
    const bindTouch = (id, key, val) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => { e.preventDefault(); this.game.input[key] = val; });
      el.addEventListener('touchend', (e) => { e.preventDefault(); this.game.input[key] = !val; });
      el.addEventListener('mousedown', (e) => { e.preventDefault(); this.game.input[key] = val; });
      el.addEventListener('mouseup', (e) => { e.preventDefault(); this.game.input[key] = !val; });
    };

    bindTouch('touch-up', 'forward', true);
    bindTouch('touch-down', 'backward', true);
    bindTouch('touch-left', 'left', true);
    bindTouch('touch-right', 'right', true);
    bindTouch('touch-brake', 'handbrake', true);

    document.getElementById('touch-horn')?.addEventListener('touchstart', () => {
      this.game.audio.playHorn(true);
    });
    document.getElementById('touch-horn')?.addEventListener('touchend', () => {
      this.game.audio.playHorn(false);
    });

    document.getElementById('touch-e')?.addEventListener('click', () => {
      this.game.handleInteract();
    });
  }

  updateHUD(state) {
    // Mode
    this.elements.modeVal.textContent = state.mode === 'HARSH' ? 'HARSH [School]' : 'KULDEEP [Auto Driver]';

    // Time
    const hours = Math.floor(state.timeOfDay);
    const minutes = Math.floor((state.timeOfDay % 1) * 60);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const dispHours = hours % 12 === 0 ? 12 : hours % 12;
    const dispMins = minutes < 10 ? `0${minutes}` : minutes;
    this.elements.timeVal.textContent = `${dispHours}:${dispMins} ${ampm}`;

    // Cash
    this.elements.cashVal.textContent = state.cash;

    // Vehicle vs Foot HUD
    if (state.inVehicle) {
      this.elements.vehicleHud.classList.remove('hidden');
      this.elements.footHud.classList.add('hidden');

      // Speedometer update
      const speed = state.speedKmh;
      this.elements.speedoNum.textContent = speed;
      // Needle rotates -120deg (0 km/h) to +120deg (80 km/h)
      const angle = -120 + (Math.min(speed, 80) / 80) * 240;
      this.elements.speedoNeedle.style.transform = `rotate(${angle}deg)`;

      // Fuel update
      const fuel = Math.round(state.fuel);
      this.elements.fuelVal.textContent = `${fuel}%`;
      this.elements.fuelBar.style.width = `${fuel}%`;
      if (fuel < 20) {
        this.elements.fuelBar.style.backgroundColor = '#ff1744';
      } else if (fuel < 45) {
        this.elements.fuelBar.style.backgroundColor = '#ffd600';
      } else {
        this.elements.fuelBar.style.backgroundColor = '#00e676';
      }
    } else {
      this.elements.vehicleHud.classList.add('hidden');
      this.elements.footHud.classList.remove('hidden');
    }
  }

  updateMissionUI(data) {
    this.elements.missionTitle.textContent = data.title;
    this.elements.missionDesc.textContent = data.objective;
    this.elements.missionDist.textContent = data.distance;
    this.elements.missionReward.textContent = data.reward;
  }

  updateMissionDistance(meters) {
    this.elements.missionDist.textContent = `${meters}m away`;
  }

  showInteractionPrompt(text) {
    this.elements.promptText.textContent = text;
    this.elements.interactionPrompt.classList.remove('hidden');
  }

  hideInteractionPrompt() {
    this.elements.interactionPrompt.classList.add('hidden');
  }

  showDialogue(data) {
    this.elements.dialogueSpeaker.textContent = data.speaker;
    this.elements.dialogueRole.textContent = data.role ? `• ${data.role}` : '';
    this.elements.dialogueText.textContent = data.text;
    this.elements.dialogueAvatar.style.backgroundColor = data.avatarColor;
    this.elements.dialogueBox.classList.remove('hidden');
    this.game.audio.playDialogueBlip();
  }

  hideDialogue() {
    this.elements.dialogueBox.classList.add('hidden');
  }

  showMissionCompleteModal(data) {
    this.elements.modalMissionTitle.textContent = data.title;
    this.elements.modalRewardVal.textContent = `+ ₹${data.reward}`;
    this.elements.missionModal.classList.remove('hidden');

    this.elements.modalContinueBtn.onclick = () => {
      this.elements.missionModal.classList.add('hidden');
      if (data.onContinue) data.onContinue();
    };
  }

  togglePause(forceState = null) {
    const isPaused = forceState !== null ? forceState : this.elements.pauseModal.classList.contains('hidden');
    if (isPaused) {
      this.elements.pauseModal.classList.remove('hidden');
    } else {
      this.elements.pauseModal.classList.add('hidden');
    }
  }

  renderMiniMap(playerPos, playerRot, autoPos, waypointPos) {
    const ctx = this.miniCtx;
    if (!ctx) return;

    const w = 160;
    const h = 160;
    ctx.clearRect(0, 0, w, h);

    // Background circle
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(80, 80, 78, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#00e676';
    ctx.stroke();

    const worldScale = 0.35; // 1 world unit = 0.35 mini-map px

    // Draw Roads on radar
    ctx.fillStyle = '#334155';
    // Main East-West road
    const ry = 80 - (0 - playerPos.z) * worldScale;
    ctx.fillRect(10, ry - 3, 140, 6);

    // North-South road (X: 50)
    const rx = 80 + (50 - playerPos.x) * worldScale;
    ctx.fillRect(rx - 3, 10, 6, 140);

    // School Area (X: -140, Z: 140)
    const sx = 80 + (-140 - playerPos.x) * worldScale;
    const sz = 80 - (140 - playerPos.z) * worldScale;
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(sx - 8, sz - 8, 16, 16);

    // Home (X: 0, Z: -14)
    const hx = 80 + (0 - playerPos.x) * worldScale;
    const hz = 80 - (-14 - playerPos.z) * worldScale;
    ctx.fillStyle = '#b45309';
    ctx.fillRect(hx - 5, hz - 5, 10, 10);

    // Auto-Rickshaw icon
    const ax = 80 + (autoPos.x - playerPos.x) * worldScale;
    const az = 80 - (autoPos.z - playerPos.z) * worldScale;
    ctx.fillStyle = '#ffd600';
    ctx.beginPath();
    ctx.arc(ax, az, 4, 0, Math.PI * 2);
    ctx.fill();

    // Mission Waypoint Beacon blip
    if (waypointPos) {
      const wx = 80 + (waypointPos.x - playerPos.x) * worldScale;
      const wz = 80 - (waypointPos.z - playerPos.z) * worldScale;
      ctx.fillStyle = '#ff1744';
      ctx.beginPath();
      ctx.arc(wx, wz, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
    }

    // Player arrow in center
    ctx.save();
    ctx.translate(80, 80);
    ctx.rotate(-playerRot);
    ctx.fillStyle = '#00e676';
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(5, 6);
    ctx.lineTo(-5, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
