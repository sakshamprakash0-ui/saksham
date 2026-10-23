// src/autoRickshaw.js - Playable Green-and-Yellow Indian Auto-Rickshaw with Physics

import * as THREE from 'three';

export class AutoRickshaw {
  constructor(scene, audio) {
    this.scene = scene;
    this.audio = audio;

    // Vehicle state
    this.position = new THREE.Vector3(0, 0, 8);
    this.rotation = 0; // Yaw angle in radians
    this.speed = 0; // Current velocity in units/sec
    this.steeringAngle = 0;
    this.fuel = 85; // 0 - 100%
    this.isDriven = false;
    this.headlightsOn = false;

    // Physics parameters
    this.maxSpeed = 16.0; // ~55 km/h
    this.maxReverseSpeed = -5.5;
    this.accel = 11.0;
    this.brakeForce = 18.0;
    this.friction = 5.5;
    this.turnSpeed = 2.4;
    this.rollTilt = 0; // Body tilt when cornering

    // Model components
    this.group = new THREE.Group();
    this.wheels = [];
    this.frontWheelGroup = new THREE.Group();
    this.headlightBeam = null;
    this.taillightMeshes = [];

    this.buildModel();
    this.scene.add(this.group);
  }

  buildModel() {
    const greenMat = new THREE.MeshStandardMaterial({
      color: 0x008037, // Classic Indian Auto green
      roughness: 0.35,
      metalness: 0.2
    });

    const yellowMat = new THREE.MeshStandardMaterial({
      color: 0xffd600, // Vibrant Indian Auto yellow roof
      roughness: 0.4,
      metalness: 0.1
    });

    const blackMat = new THREE.MeshStandardMaterial({
      color: 0x1f1f1f,
      roughness: 0.8
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      roughness: 0.2,
      metalness: 0.85
    });

    const seatMat = new THREE.MeshStandardMaterial({
      color: 0x3e2723, // Faux brown leather seat
      roughness: 0.7
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xa0e0ff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      transmission: 0.8
    });

    // 1. Lower Body (Green Tub)
    const baseGeo = new THREE.BoxGeometry(1.6, 0.6, 2.6);
    const baseMesh = new THREE.Mesh(baseGeo, greenMat);
    baseMesh.position.y = 0.55;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    this.group.add(baseMesh);

    // Front Nose / Engine cover (slanted towards front)
    const noseGeo = new THREE.BoxGeometry(1.1, 0.65, 0.9);
    const noseMesh = new THREE.Mesh(noseGeo, greenMat);
    noseMesh.position.set(0, 0.6, 1.4);
    noseMesh.rotation.x = -0.15;
    noseMesh.castShadow = true;
    this.group.add(noseMesh);

    // 2. Yellow Canopy Roof (Iconic curved auto roof)
    const roofCurveGeo = new THREE.CylinderGeometry(0.9, 0.9, 2.4, 16, 1, false, 0, Math.PI);
    const roofMesh = new THREE.Mesh(roofCurveGeo, yellowMat);
    roofMesh.rotation.z = Math.PI / 2;
    roofMesh.rotation.y = Math.PI / 2;
    roofMesh.position.set(0, 1.7, -0.1);
    roofMesh.scale.set(1, 0.9, 0.85);
    roofMesh.castShadow = true;
    this.group.add(roofMesh);

    // Front roof overhang
    const frontRoofGeo = new THREE.BoxGeometry(1.4, 0.1, 0.9);
    const frontRoofMesh = new THREE.Mesh(frontRoofGeo, yellowMat);
    frontRoofMesh.position.set(0, 1.7, 1.0);
    frontRoofMesh.rotation.x = -0.18;
    this.group.add(frontRoofMesh);

    // 3. Canopy Pillars (Black steel tubular frame)
    const pillarPositions = [
      [-0.7, 1.25, -1.2],
      [0.7, 1.25, -1.2],
      [-0.7, 1.25, 0.2],
      [0.7, 1.25, 0.2],
      [-0.6, 1.25, 1.1],
      [0.6, 1.25, 1.1]
    ];
    pillarPositions.forEach(p => {
      const pGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.0, 8);
      const pMesh = new THREE.Mesh(pGeo, blackMat);
      pMesh.position.set(p[0], p[1], p[2]);
      this.group.add(pMesh);
    });

    // 4. Windshield & Frame
    const frameGeo = new THREE.BoxGeometry(1.25, 0.65, 0.05);
    const frameMesh = new THREE.Mesh(frameGeo, blackMat);
    frameMesh.position.set(0, 1.25, 1.35);
    frameMesh.rotation.x = -0.2;
    this.group.add(frameMesh);

    const glassGeo = new THREE.PlaneGeometry(1.15, 0.55);
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.set(0, 1.25, 1.38);
    glassMesh.rotation.x = -0.2;
    this.group.add(glassMesh);

    // Single windshield wiper
    const wiperGeo = new THREE.BoxGeometry(0.02, 0.4, 0.02);
    const wiperMesh = new THREE.Mesh(wiperGeo, blackMat);
    wiperMesh.position.set(0.1, 1.25, 1.4);
    wiperMesh.rotation.z = -0.35;
    this.group.add(wiperMesh);

    // 5. Seats & Interior
    // Passenger rear bench seat
    const seatGeo = new THREE.BoxGeometry(1.4, 0.25, 0.6);
    const seatMesh = new THREE.Mesh(seatGeo, seatMat);
    seatMesh.position.set(0, 0.75, -0.7);
    this.group.add(seatMesh);

    const seatBackGeo = new THREE.BoxGeometry(1.4, 0.55, 0.15);
    const seatBackMesh = new THREE.Mesh(seatBackGeo, seatMat);
    seatBackMesh.position.set(0, 1.05, -1.0);
    this.group.add(seatBackMesh);

    // Driver front seat
    const driverSeatGeo = new THREE.BoxGeometry(0.65, 0.2, 0.45);
    const driverSeatMesh = new THREE.Mesh(driverSeatGeo, seatMat);
    driverSeatMesh.position.set(0, 0.7, 0.4);
    this.group.add(driverSeatMesh);

    // Handlebars & Console
    const barGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.7, 8);
    const barMesh = new THREE.Mesh(barGeo, chromeMat);
    barMesh.rotation.z = Math.PI / 2;
    barMesh.position.set(0, 1.0, 1.0);
    this.group.add(barMesh);

    // Grips
    [-0.32, 0.32].forEach(x => {
      const gripGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.12, 8);
      const gripMesh = new THREE.Mesh(gripGeo, blackMat);
      gripMesh.rotation.z = Math.PI / 2;
      gripMesh.position.set(x, 1.0, 1.0);
      this.group.add(gripMesh);
    });

    // Speedometer / Meter Box on handlebar
    const meterGeo = new THREE.BoxGeometry(0.18, 0.1, 0.12);
    const meterMesh = new THREE.Mesh(meterGeo, yellowMat);
    meterMesh.position.set(0, 1.05, 0.95);
    this.group.add(meterMesh);

    // 6. Wheels (1 Front, 2 Rear)
    const tireGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.16, 16);
    const rimGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.17, 12);

    // Front Steerable Wheel Group
    this.frontWheelGroup.position.set(0, 0.26, 1.6);
    const fTire = new THREE.Mesh(tireGeo, blackMat);
    fTire.rotation.z = Math.PI / 2;
    fTire.castShadow = true;
    const fRim = new THREE.Mesh(rimGeo, yellowMat);
    fRim.rotation.z = Math.PI / 2;
    this.frontWheelGroup.add(fTire, fRim);

    // Front mudguard
    const mudGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 12, 1, false, 0, Math.PI);
    const mudMesh = new THREE.Mesh(mudGeo, yellowMat);
    mudMesh.rotation.z = Math.PI / 2;
    mudMesh.rotation.y = Math.PI / 2;
    mudMesh.position.y = 0.08;
    this.frontWheelGroup.add(mudMesh);

    this.group.add(this.frontWheelGroup);
    this.wheels.push(fTire);

    // Rear Left & Right Wheels
    [-0.75, 0.75].forEach(x => {
      const rWheelGroup = new THREE.Group();
      rWheelGroup.position.set(x, 0.26, -0.6);
      const rTire = new THREE.Mesh(tireGeo, blackMat);
      rTire.rotation.z = Math.PI / 2;
      rTire.castShadow = true;
      const rRim = new THREE.Mesh(rimGeo, yellowMat);
      rRim.rotation.z = Math.PI / 2;
      rWheelGroup.add(rTire, rRim);
      this.group.add(rWheelGroup);
      this.wheels.push(rTire);
    });

    // 7. Headlight & Taillights
    const headGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.1, 16);
    const headMesh = new THREE.Mesh(headGeo, chromeMat);
    headMesh.rotation.x = Math.PI / 2;
    headMesh.position.set(0, 0.7, 1.85);
    this.group.add(headMesh);

    const lightLensGeo = new THREE.CircleGeometry(0.1, 16);
    const lightLensMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lightLensMesh = new THREE.Mesh(lightLensGeo, lightLensMat);
    lightLensMesh.position.set(0, 0.7, 1.91);
    this.group.add(lightLensMesh);

    // Spotlight beam
    this.headlightBeam = new THREE.SpotLight(0xfffae0, 2.5, 30, Math.PI / 6, 0.4, 1.2);
    this.headlightBeam.position.set(0, 0.8, 2.0);
    const targetObj = new THREE.Object3D();
    targetObj.position.set(0, 0.3, 10);
    this.group.add(targetObj);
    this.headlightBeam.target = targetObj;
    this.headlightBeam.visible = false;
    this.group.add(this.headlightBeam);

    // Rear Taillights & License Plate
    [-0.6, 0.6].forEach(x => {
      const tailGeo = new THREE.BoxGeometry(0.12, 0.08, 0.04);
      const tailMat = new THREE.MeshStandardMaterial({
        color: 0xcc1100,
        emissive: 0x550000
      });
      const tailMesh = new THREE.Mesh(tailGeo, tailMat);
      tailMesh.position.set(x, 0.55, -1.32);
      this.group.add(tailMesh);
      this.taillightMeshes.push(tailMesh);
    });

    // Indian Auto Rear Slogan Decal: "HORN OK PLEASE"
    const sloganCanvas = document.createElement('canvas');
    sloganCanvas.width = 256;
    sloganCanvas.height = 64;
    const ctx = sloganCanvas.getContext('2d');
    ctx.fillStyle = '#ffd600';
    ctx.fillRect(0, 0, 256, 64);
    ctx.fillStyle = '#cc1100';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('HORN  OK  PLEASE', 128, 42);

    const sloganTex = new THREE.CanvasTexture(sloganCanvas);
    const sloganGeo = new THREE.PlaneGeometry(1.2, 0.28);
    const sloganMat = new THREE.MeshBasicMaterial({ map: sloganTex });
    const sloganMesh = new THREE.Mesh(sloganGeo, sloganMat);
    sloganMesh.position.set(0, 0.4, -1.32);
    sloganMesh.rotation.y = Math.PI;
    this.group.add(sloganMesh);
  }

  update(dt, input, buildings = []) {
    if (this.isDriven) {
      // Throttle and Braking
      let throttle = 0;
      if (input.forward) throttle += 1;
      if (input.backward) throttle -= 1;

      if (throttle > 0) {
        if (this.speed < 0) {
          this.speed += this.brakeForce * dt;
        } else {
          this.speed += this.accel * dt;
          if (this.speed > this.maxSpeed) this.speed = this.maxSpeed;
        }
      } else if (throttle < 0) {
        if (this.speed > 0) {
          this.speed -= this.brakeForce * dt;
        } else {
          this.speed -= (this.accel * 0.6) * dt;
          if (this.speed < this.maxReverseSpeed) this.speed = this.maxReverseSpeed;
        }
      } else {
        // Natural friction decay
        if (this.speed > 0) {
          this.speed -= this.friction * dt;
          if (this.speed < 0) this.speed = 0;
        } else if (this.speed < 0) {
          this.speed += this.friction * dt;
          if (this.speed > 0) this.speed = 0;
        }
      }

      // Handbrake
      if (input.handbrake) {
        if (Math.abs(this.speed) > 0.5) this.audio.playBrake();
        if (this.speed > 0) {
          this.speed -= (this.brakeForce * 1.8) * dt;
          if (this.speed < 0) this.speed = 0;
        } else if (this.speed < 0) {
          this.speed += (this.brakeForce * 1.8) * dt;
          if (this.speed > 0) this.speed = 0;
        }
      }

      // Steering
      let targetSteer = 0;
      if (input.left) targetSteer += 0.55;
      if (input.right) targetSteer -= 0.55;
      this.steeringAngle += (targetSteer - this.steeringAngle) * dt * 8.0;

      // Turning is proportional to speed
      const speedFactor = Math.abs(this.speed) / this.maxSpeed;
      if (Math.abs(this.speed) > 0.1) {
        const turnDir = this.speed >= 0 ? 1 : -1;
        this.rotation += this.steeringAngle * this.turnSpeed * dt * turnDir;
      }

      // Three-wheeler cornering roll/lean effect
      const targetRoll = -this.steeringAngle * speedFactor * 0.18;
      this.rollTilt += (targetRoll - this.rollTilt) * dt * 6.0;

      // Fuel consumption
      if (Math.abs(this.speed) > 0.2) {
        this.fuel = Math.max(0, this.fuel - dt * 0.06);
      }

      // Engine sound update
      const speedKmh = this.getSpeedKmh();
      this.audio.updateEngine(speedKmh, throttle);

      // Horn
      if (input.horn) {
        this.audio.playHorn(true);
      } else {
        this.audio.playHorn(false);
      }
    } else {
      // Parked deceleration
      if (Math.abs(this.speed) > 0.05) {
        this.speed -= Math.sign(this.speed) * this.friction * dt;
      } else {
        this.speed = 0;
      }
      this.rollTilt += (0 - this.rollTilt) * dt * 5.0;
    }

    // Move forward along heading vector
    const moveDist = this.speed * dt;
    const forwardVec = new THREE.Vector3(
      Math.sin(this.rotation),
      0,
      Math.cos(this.rotation)
    );

    const nextPos = this.position.clone().addScaledVector(forwardVec, moveDist);

    // Collision detection with buildings
    if (!this.checkBuildingCollision(nextPos, buildings)) {
      this.position.copy(nextPos);
    } else {
      this.speed = -this.speed * 0.25; // Gentle bounce
    }

    // World boundary clamp
    this.position.x = Math.max(-190, Math.min(190, this.position.x));
    this.position.z = Math.max(-190, Math.min(190, this.position.z));

    // Update 3D Transform
    this.group.position.copy(this.position);
    this.group.rotation.y = this.rotation;
    this.group.rotation.z = this.rollTilt;

    // Steer front wheel
    this.frontWheelGroup.rotation.y = this.steeringAngle;

    // Rotate all wheels forward/backward
    const wheelRot = moveDist / 0.26;
    this.wheels.forEach(w => {
      w.rotation.x += wheelRot;
    });

    // Taillight brake glow
    const isBraking = input?.backward && this.speed > 0;
    this.taillightMeshes.forEach(m => {
      m.material.emissive.setHex(isBraking ? 0xff0000 : 0x550000);
    });
  }

  checkBuildingCollision(pos, buildings) {
    const autoRadius = 1.3;
    for (let i = 0; i < buildings.length; i++) {
      const b = buildings[i];
      if (
        pos.x + autoRadius > b.minX &&
        pos.x - autoRadius < b.maxX &&
        pos.z + autoRadius > b.minZ &&
        pos.z - autoRadius < b.maxZ
      ) {
        return true;
      }
    }
    return false;
  }

  setHeadlights(on) {
    this.headlightsOn = on;
    if (this.headlightBeam) this.headlightBeam.visible = on;
  }

  resetPosition() {
    this.position.set(0, 0, 8);
    this.rotation = 0;
    this.speed = 0;
    this.rollTilt = 0;
  }

  refuel() {
    this.fuel = 100;
  }

  getSpeedKmh() {
    return Math.round(Math.abs(this.speed) * 3.6);
  }
}
