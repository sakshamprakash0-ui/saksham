// src/camera.js - Smooth Multi-Mode Follow & Cockpit Camera

import * as THREE from 'three';

export class CameraController {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    this.mode = 'THIRD_PERSON'; // 'THIRD_PERSON' or 'FIRST_PERSON'
    this.cameraDistance = 7.0;
    this.cameraHeight = 3.2;
    this.orbitYaw = 0;
    this.orbitPitch = 0.25;

    this.currentPos = new THREE.Vector3(0, 5, -15);
    this.currentTarget = new THREE.Vector3(0, 1.5, 0);

    // Mouse drag controls
    this.isDragging = false;
    this.prevMouseX = 0;
    this.prevMouseY = 0;

    this.setupListeners();
  }

  setupListeners() {
    this.domElement.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.prevMouseX;
      const dy = e.clientY - this.prevMouseY;
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;

      this.orbitYaw -= dx * 0.005;
      this.orbitPitch = Math.max(-0.4, Math.min(1.1, this.orbitPitch + dy * 0.005));
    });

    // Touch drag for mobile / emulator
    this.domElement.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.prevMouseX = e.touches[0].clientX;
        this.prevMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    this.domElement.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const dx = e.touches[0].clientX - this.prevMouseX;
        const dy = e.touches[0].clientY - this.prevMouseY;
        this.prevMouseX = e.touches[0].clientX;
        this.prevMouseY = e.touches[0].clientY;

        this.orbitYaw -= dx * 0.005;
        this.orbitPitch = Math.max(-0.4, Math.min(1.1, this.orbitPitch + dy * 0.005));
      }
    }, { passive: true });
  }

  toggleCameraMode() {
    this.mode = this.mode === 'THIRD_PERSON' ? 'FIRST_PERSON' : 'THIRD_PERSON';
    return this.mode;
  }

  update(dt, targetObject, isAuto = false) {
    if (!targetObject) return;

    const targetPos = targetObject.position;
    const targetRot = targetObject.rotation?.y ?? (typeof targetObject.rotation === 'number' ? targetObject.rotation : 0);

    if (this.mode === 'FIRST_PERSON') {
      if (isAuto) {
        // Cockpit camera looking forward over the auto handlebars
        const forward = new THREE.Vector3(Math.sin(targetRot), 0, Math.cos(targetRot));
        const eyePos = targetPos.clone().add(new THREE.Vector3(0, 1.25, 0)).addScaledVector(forward, 0.4);
        const lookTarget = eyePos.clone().addScaledVector(forward, 10);
        this.camera.position.copy(eyePos);
        this.camera.lookAt(lookTarget);
      } else {
        // First person character eyes
        const forward = new THREE.Vector3(Math.sin(targetRot), 0, Math.cos(targetRot));
        const eyePos = targetPos.clone().add(new THREE.Vector3(0, 1.45, 0));
        const lookTarget = eyePos.clone().addScaledVector(forward, 10);
        this.camera.position.copy(eyePos);
        this.camera.lookAt(lookTarget);
      }
      return;
    }

    // Third-person chase camera
    const effectiveYaw = targetRot + this.orbitYaw + Math.PI;
    const effectivePitch = this.orbitPitch;

    const dist = isAuto ? this.cameraDistance + (Math.abs(targetObject.speed || 0) * 0.12) : 4.5;
    const height = isAuto ? this.cameraHeight : 2.2;

    const offsetX = Math.sin(effectiveYaw) * Math.cos(effectivePitch) * dist;
    const offsetZ = Math.cos(effectiveYaw) * Math.cos(effectivePitch) * dist;
    const offsetY = Math.sin(effectivePitch) * dist + height;

    const desiredCamPos = targetPos.clone().add(new THREE.Vector3(offsetX, offsetY, offsetZ));
    const desiredTarget = targetPos.clone().add(new THREE.Vector3(0, isAuto ? 1.0 : 1.2, 0));

    // Smooth spring lerp
    const lerpRate = Math.min(1.0, dt * 7.0);
    this.currentPos.lerp(desiredCamPos, lerpRate);
    this.currentTarget.lerp(desiredTarget, lerpRate);

    this.camera.position.copy(this.currentPos);
    this.camera.lookAt(this.currentTarget);
  }
}
