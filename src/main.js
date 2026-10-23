// src/main.js - Master Game Loop & Core Controller for Delhi Auto Life Simulator

import * as THREE from 'three';
import { World } from './world.js';
import { AutoRickshaw } from './autoRickshaw.js';
import { Player } from './player.js';
import { CameraController } from './camera.js';
import { NPCManager } from './npc.js';
import { TrafficManager } from './traffic.js';
import { UIManager } from './ui.js';
import { DialogueSystem } from './dialogue.js';
import { MissionManager } from './missions.js';
import { SaveSystem } from './saveSystem.js';
import { audio } from './audio.js';

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.audio = audio;

    // Game State
    this.saveData = SaveSystem.load();
    this.cash = this.saveData.cash;
    this.timeOfDay = this.saveData.timeOfDay;
    this.inVehicle = false;
    this.currentMode = this.saveData.characterMode || 'HARSH';
    this.isPaused = false;

    // Input state
    this.input = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      handbrake: false,
      jump: false,
      shift: false,
      horn: false
    };

    this.initThree();
    this.initSystems();
    this.setupKeyboard();
    this.setupResize();

    // Start game loop
    this.clock = new THREE.Clock();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initThree() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);

    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      600
    );

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }

  initSystems() {
    this.ui = new UIManager(this);
    this.dialogue = new DialogueSystem(this.ui);
    this.cameraController = new CameraController(this.camera, this.canvas);

    this.world = new World(this.scene);
    this.autoRickshaw = new AutoRickshaw(this.scene, this.audio);
    this.player = new Player(this.scene, this.audio);
    this.player.setMode(this.currentMode);

    this.npcs = new NPCManager(this.scene);
    this.npcs.init();

    this.traffic = new TrafficManager(this.scene);
    this.traffic.init();

    this.missions = new MissionManager(this);
    this.missions.init(this.saveData.currentMissionIndex);

    // Initial HUD update
    this.updateHUD();
  }

  setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (this.dialogue.isActive()) {
        if (e.code === 'Space' || e.code === 'KeyE') {
          this.dialogue.next();
          return;
        }
      }

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.input.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.input.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.input.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.input.right = true;
          break;
        case 'Space':
          this.input.handbrake = true;
          this.input.jump = true;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.input.shift = true;
          break;
        case 'KeyH':
          this.input.horn = true;
          break;
        case 'KeyE':
          this.handleInteract();
          break;
        case 'KeyC':
          this.toggleCamera();
          break;
        case 'KeyR':
          if (this.inVehicle) this.autoRickshaw.resetPosition();
          break;
        case 'Escape':
          this.ui.togglePause();
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.input.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.input.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.input.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.input.right = false;
          break;
        case 'Space':
          this.input.handbrake = false;
          this.input.jump = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          this.input.shift = false;
          break;
        case 'KeyH':
          this.input.horn = false;
          this.audio.playHorn(false);
          break;
      }
    });
  }

  handleInteract() {
    // 1. If inside auto -> Exit auto
    if (this.inVehicle) {
      this.toggleVehicle();
      return;
    }

    // 2. If near auto -> Enter auto
    const distToAuto = this.player.position.distanceTo(this.autoRickshaw.position);
    if (distToAuto < 3.2) {
      this.toggleVehicle();
      return;
    }

    // 3. If near NPC -> Talk
    const nearNPC = this.npcs.getNearestNPC(this.player.position, 3.2);
    if (nearNPC && nearNPC.dialogue) {
      this.dialogue.start(nearNPC.dialogue);
      return;
    }

    // 4. If near CNG Station pump -> Refuel
    const cngDist = this.player.position.distanceTo(new THREE.Vector3(80, 0, 90));
    if (cngDist < 6.0 && this.autoRickshaw.fuel < 98) {
      this.refuelAuto();
      return;
    }
  }

  toggleVehicle() {
    if (this.inVehicle) {
      // Exit auto
      this.inVehicle = false;
      this.autoRickshaw.isDriven = false;
      this.audio.stopEngine();

      // Place player on left side of auto
      const exitOffset = new THREE.Vector3(-1.8, 0, 0).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        this.autoRickshaw.rotation
      );
      this.player.position.copy(this.autoRickshaw.position).add(exitOffset);
      this.player.position.y = 0;
      this.player.inVehicle = false;
    } else {
      // Enter auto
      const dist = this.player.position.distanceTo(this.autoRickshaw.position);
      if (dist < 4.0) {
        this.inVehicle = true;
        this.autoRickshaw.isDriven = true;
        this.player.inVehicle = true;
        // If Harsh enters auto, automatically switch role to Kuldeep driver or ride along
        if (this.currentMode === 'HARSH') {
          this.currentMode = 'KULDEEP';
          this.player.setMode('KULDEEP');
        }
        this.audio.startEngine();
      }
    }
    this.updateHUD();
  }

  toggleCamera() {
    const newMode = this.cameraController.toggleCameraMode();
  }

  switchCharacterMode() {
    this.currentMode = this.player.switchMode();
    this.save();
    this.updateHUD();
  }

  addCash(amount) {
    this.cash += amount;
    this.audio.playCash();
    this.save();
    this.updateHUD();
  }

  refuelAuto() {
    if (this.cash >= 60) {
      this.cash -= 60;
      this.autoRickshaw.refuel();
      this.audio.playCash();
      this.save();
      this.updateHUD();
    }
  }

  save() {
    SaveSystem.save({
      cash: this.cash,
      fuel: this.autoRickshaw.fuel,
      currentMissionIndex: this.missions.currentIndex,
      characterMode: this.currentMode,
      timeOfDay: this.timeOfDay
    });
  }

  resetProgress() {
    SaveSystem.reset();
    location.reload();
  }

  setupResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  updateHUD() {
    this.ui.updateHUD({
      mode: this.currentMode,
      timeOfDay: this.timeOfDay,
      cash: this.cash,
      inVehicle: this.inVehicle,
      speedKmh: this.autoRickshaw.getSpeedKmh(),
      fuel: this.autoRickshaw.fuel
    });
  }

  animate() {
    requestAnimationFrame(this.animate);
    const dt = Math.min(this.clock.getDelta(), 0.1);

    // Advance time of day slowly (1 game hour = 90 real seconds)
    this.timeOfDay = (this.timeOfDay + (dt / 90)) % 24;
    this.world.updateTimeOfDay(this.timeOfDay);

    // Update Auto & Player
    const buildings = this.world.buildings;
    this.autoRickshaw.update(dt, this.inVehicle ? this.input : {}, buildings);
    this.player.update(dt, this.inVehicle ? {} : this.input, buildings);

    // Active tracking target for camera
    const activeTarget = this.inVehicle ? this.autoRickshaw : this.player;
    this.cameraController.update(dt, activeTarget, this.inVehicle);

    // Update Traffic & NPCs
    const playerPos = this.inVehicle ? this.autoRickshaw.position : this.player.position;
    this.traffic.update(dt, playerPos);
    this.npcs.update(dt, this.camera, playerPos);

    // Mission Progression
    this.missions.update(playerPos, this.inVehicle, this.currentMode);

    // Contextual Interaction Prompts
    this.checkContextualPrompts(playerPos);

    // Mini-map Radar Render
    const activeRot = this.inVehicle ? this.autoRickshaw.rotation : this.player.rotation;
    const waypointPos = this.missions.currentMission ? this.missions.currentMission.targetPos : null;
    this.ui.renderMiniMap(playerPos, activeRot, this.autoRickshaw.position, waypointPos);

    // Update HUD
    this.updateHUD();

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }

  checkContextualPrompts(playerPos) {
    if (this.dialogue.isActive()) {
      this.ui.hideInteractionPrompt();
      return;
    }

    if (this.inVehicle) {
      // Near CNG Pump
      const cngDist = playerPos.distanceTo(new THREE.Vector3(80, 0, 90));
      if (cngDist < 8.0 && this.autoRickshaw.fuel < 98) {
        this.ui.showInteractionPrompt("Press [E] to Refuel CNG Tank (₹60)");
        return;
      }
      this.ui.hideInteractionPrompt();
      return;
    }

    // On foot: Near Auto
    const distToAuto = playerPos.distanceTo(this.autoRickshaw.position);
    if (distToAuto < 3.2) {
      this.ui.showInteractionPrompt("Press [E] or tap to Enter Auto-Rickshaw");
      return;
    }

    // Near NPC
    const nearNPC = this.npcs.getNearestNPC(playerPos, 3.2);
    if (nearNPC) {
      this.ui.showInteractionPrompt(`Press [E] to Talk to ${nearNPC.name}`);
      return;
    }

    this.ui.hideInteractionPrompt();
  }
}

// Start Game on window load
window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});
