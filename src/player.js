// src/player.js - Playable Characters (Harsh & Kuldeep) with Locomotion & Animations

import * as THREE from 'three';

export class Player {
  constructor(scene, audio) {
    this.scene = scene;
    this.audio = audio;

    this.position = new THREE.Vector3(0, 0, -6);
    this.rotation = 0;
    this.speed = 0;
    this.currentMode = 'HARSH'; // 'HARSH' or 'KULDEEP'
    this.inVehicle = false;

    // Movement params
    this.walkSpeed = 4.2;
    this.runSpeed = 7.0;
    this.jumpVelocity = 0;
    this.isGrounded = true;
    this.gravity = 18.0;

    // Animation state
    this.walkCycle = 0;
    this.footstepTimer = 0;

    // 3D Model containers
    this.group = new THREE.Group();
    this.harshMesh = null;
    this.kuldeepMesh = null;
    this.limbs = {};

    this.buildCharacterModels();
    this.setMode('HARSH');
    this.scene.add(this.group);
  }

  buildCharacterModels() {
    // Shared materials
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xc68642, roughness: 0.6 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });

    // --- 1. HARSH (KV School Uniform) ---
    this.harshGroup = new THREE.Group();
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.7 }); // White shirt
    const pantMat = new THREE.MeshStandardMaterial({ color: 0x1a237e, roughness: 0.8 }); // Navy blue pants
    const bagMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.8 }); // Red school bag

    // Head
    const headGeo = new THREE.BoxGeometry(0.32, 0.35, 0.32);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.45;
    head.castShadow = true;

    // Hair
    const hairGeo = new THREE.BoxGeometry(0.34, 0.12, 0.34);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 1.6, 0);

    // Torso (Shirt)
    const torsoGeo = new THREE.BoxGeometry(0.44, 0.52, 0.28);
    const torso = new THREE.Mesh(torsoGeo, shirtMat);
    torso.position.y = 1.05;
    torso.castShadow = true;

    // School Bag Backpack
    const bagGeo = new THREE.BoxGeometry(0.36, 0.44, 0.18);
    const bag = new THREE.Mesh(bagGeo, bagMat);
    bag.position.set(0, 1.05, -0.22);
    torso.add(bag);

    // Limbs for animation
    const limbGeo = new THREE.BoxGeometry(0.14, 0.46, 0.14);

    // Left Arm
    const lArm = new THREE.Mesh(limbGeo, shirtMat);
    lArm.position.set(-0.31, 1.05, 0);
    // Right Arm
    const rArm = new THREE.Mesh(limbGeo, shirtMat);
    rArm.position.set(0.31, 1.05, 0);

    // Left Leg
    const lLeg = new THREE.Mesh(limbGeo, pantMat);
    lLeg.position.set(-0.13, 0.48, 0);
    lLeg.castShadow = true;
    // Right Leg
    const rLeg = new THREE.Mesh(limbGeo, pantMat);
    rLeg.position.set(0.13, 0.48, 0);
    rLeg.castShadow = true;

    // Shoes
    const footGeo = new THREE.BoxGeometry(0.15, 0.1, 0.22);
    const lFoot = new THREE.Mesh(footGeo, shoeMat);
    lFoot.position.set(0, -0.24, 0.04);
    lLeg.add(lFoot);
    const rFoot = new THREE.Mesh(footGeo, shoeMat);
    rFoot.position.set(0, -0.24, 0.04);
    rLeg.add(rFoot);

    this.harshGroup.add(head, hair, torso, lArm, rArm, lLeg, rLeg);
    this.group.add(this.harshGroup);

    // --- 2. KULDEEP (Auto Driver Khaki Outfit) ---
    this.kuldeepGroup = new THREE.Group();
    const khakiMat = new THREE.MeshStandardMaterial({ color: 0xc3b091, roughness: 0.7 }); // Khaki uniform
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.5 });

    // Head
    const kHead = new THREE.Mesh(headGeo, skinMat);
    kHead.position.y = 1.55;
    kHead.castShadow = true;

    // Mustache
    const stacheGeo = new THREE.BoxGeometry(0.18, 0.04, 0.04);
    const stache = new THREE.Mesh(stacheGeo, hairMat);
    stache.position.set(0, 1.46, 0.17);
    kHead.add(stache);

    // Hair
    const kHair = new THREE.Mesh(hairGeo, hairMat);
    kHair.position.set(0, 1.7, 0);

    // Torso (Khaki Shirt)
    const kTorsoGeo = new THREE.BoxGeometry(0.5, 0.58, 0.32);
    const kTorso = new THREE.Mesh(kTorsoGeo, khakiMat);
    kTorso.position.y = 1.12;
    kTorso.castShadow = true;

    // Belt
    const kBeltGeo = new THREE.BoxGeometry(0.52, 0.08, 0.34);
    const kBelt = new THREE.Mesh(kBeltGeo, beltMat);
    kBelt.position.set(0, 0.88, 0);

    // Khaki Arms
    const kLArm = new THREE.Mesh(limbGeo, khakiMat);
    kLArm.position.set(-0.35, 1.12, 0);
    const kRArm = new THREE.Mesh(limbGeo, khakiMat);
    kRArm.position.set(0.35, 1.12, 0);

    // Khaki Pants
    const kLegGeo = new THREE.BoxGeometry(0.16, 0.52, 0.16);
    const kLLeg = new THREE.Mesh(kLegGeo, khakiMat);
    kLLeg.position.set(-0.15, 0.52, 0);
    kLLeg.castShadow = true;
    const kRLeg = new THREE.Mesh(kLegGeo, khakiMat);
    kRLeg.position.set(0.15, 0.52, 0);
    kRLeg.castShadow = true;

    kLLeg.add(lFoot.clone());
    kRLeg.add(rFoot.clone());

    this.kuldeepGroup.add(kHead, kHair, kTorso, kBelt, kLArm, kRArm, kLLeg, kRLeg);
    this.group.add(this.kuldeepGroup);

    // Store limb references for animation
    this.limbs = {
      harsh: { lArm, rArm, lLeg, rLeg },
      kuldeep: { lArm: kLArm, rArm: kRArm, lLeg: kLLeg, rLeg: kRLeg }
    };
  }

  setMode(mode) {
    this.currentMode = mode;
    if (mode === 'HARSH') {
      this.harshGroup.visible = true;
      this.kuldeepGroup.visible = false;
    } else {
      this.harshGroup.visible = false;
      this.kuldeepGroup.visible = true;
    }
  }

  switchMode() {
    this.setMode(this.currentMode === 'HARSH' ? 'KULDEEP' : 'HARSH');
    return this.currentMode;
  }

  update(dt, input, buildings = []) {
    if (this.inVehicle) {
      this.group.visible = false;
      return;
    }
    this.group.visible = true;

    // Movement input
    let moveX = 0;
    let moveZ = 0;
    if (input.forward) moveZ += 1;
    if (input.backward) moveZ -= 1;
    if (input.left) moveX += 1;
    if (input.right) moveX -= 1;

    const isMoving = moveX !== 0 || moveZ !== 0;
    const isRunning = input.shift && isMoving;
    const currentSpeed = isRunning ? this.runSpeed : this.walkSpeed;

    if (isMoving) {
      // Calculate angle
      const targetAngle = Math.atan2(moveX, moveZ);
      this.rotation = targetAngle;

      const forwardVec = new THREE.Vector3(moveX, 0, moveZ).normalize();
      const nextPos = this.position.clone().addScaledVector(forwardVec, currentSpeed * dt);

      // Building collision detection
      if (!this.checkBuildingCollision(nextPos, buildings)) {
        this.position.copy(nextPos);
      }

      // Procedural walking animation
      this.walkCycle += dt * (isRunning ? 14 : 9);
      const swing = Math.sin(this.walkCycle) * (isRunning ? 0.65 : 0.45);

      const activeLimbs = this.currentMode === 'HARSH' ? this.limbs.harsh : this.limbs.kuldeep;
      activeLimbs.lLeg.rotation.x = swing;
      activeLimbs.rLeg.rotation.x = -swing;
      activeLimbs.lArm.rotation.x = -swing;
      activeLimbs.rArm.rotation.x = swing;

      // Footstep audio
      this.footstepTimer += dt;
      if (this.footstepTimer > (isRunning ? 0.28 : 0.42)) {
        this.audio.playFootstep();
        this.footstepTimer = 0;
      }
    } else {
      // Return limbs to idle
      const activeLimbs = this.currentMode === 'HARSH' ? this.limbs.harsh : this.limbs.kuldeep;
      activeLimbs.lLeg.rotation.x *= 0.8;
      activeLimbs.rLeg.rotation.x *= 0.8;
      activeLimbs.lArm.rotation.x *= 0.8;
      activeLimbs.rArm.rotation.x *= 0.8;
    }

    // Jump / Gravity
    if (input.jump && this.isGrounded) {
      this.jumpVelocity = 6.5;
      this.isGrounded = false;
    }

    if (!this.isGrounded) {
      this.position.y += this.jumpVelocity * dt;
      this.jumpVelocity -= this.gravity * dt;
      if (this.position.y <= 0) {
        this.position.y = 0;
        this.jumpVelocity = 0;
        this.isGrounded = true;
      }
    }

    // Boundary clamp
    this.position.x = Math.max(-190, Math.min(190, this.position.x));
    this.position.z = Math.max(-190, Math.min(190, this.position.z));

    this.group.position.copy(this.position);
    this.group.rotation.y = this.rotation;
  }

  checkBuildingCollision(pos, buildings) {
    const playerRadius = 0.4;
    for (let i = 0; i < buildings.length; i++) {
      const b = buildings[i];
      if (
        pos.x + playerRadius > b.minX &&
        pos.x - playerRadius < b.maxX &&
        pos.z + playerRadius > b.minZ &&
        pos.z - playerRadius < b.maxZ
      ) {
        return true;
      }
    }
    return false;
  }
}
