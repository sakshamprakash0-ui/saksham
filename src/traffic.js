// src/traffic.js - Dynamic Delhi Street Traffic (DTC Bus, Cars, Scooters, Autos)

import * as THREE from 'three';

export class TrafficManager {
  constructor(scene) {
    this.scene = scene;
    this.vehicles = [];
  }

  init() {
    // Defined traffic circuits on Delhi main roads
    // Circuit 1: Main East-West Road (z = 0)
    // Circuit 2: North-South Road (x = 50)
    // Circuit 3: Market Loop (z = -80)

    // 1. Red Delhi DTC Bus
    this.spawnVehicle('bus', -120, 0, 0, 1, 0xd32f2f, 6.5);

    // 2. White Maruti Swift Car
    this.spawnVehicle('car', -40, 0, 0, 1, 0xf5f5f5, 9.0);

    // 3. Blue Sedan
    this.spawnVehicle('car', 120, 0, Math.PI, -1, 0x1976d2, 8.5);

    // 4. Another Green Auto-Rickshaw
    this.spawnVehicle('auto', 40, 0, Math.PI, -1, 0x008037, 7.5);

    // 5. Royal Enfield Bullet Motorcycle
    this.spawnVehicle('bike', 50, -100, Math.PI / 2, 1, 0x212121, 10.0, true);

    // 6. Honda Activa Scooter
    this.spawnVehicle('scooter', 50, 80, -Math.PI / 2, -1, 0xff7043, 8.0, true);
  }

  spawnVehicle(type, x, z, rot, dir, color, speed, isNorthSouth = false) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rot;

    const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.3 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x81d4fa, roughness: 0.2 });

    if (type === 'bus') {
      // Long Delhi DTC Bus
      const bodyGeo = new THREE.BoxGeometry(2.4, 2.2, 8.5);
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      bodyMesh.position.y = 1.4;
      bodyMesh.castShadow = true;

      // Windows band
      const winGeo = new THREE.BoxGeometry(2.44, 0.7, 7.5);
      const winMesh = new THREE.Mesh(winGeo, glassMat);
      winMesh.position.y = 1.6;

      // Wheels
      [-1.15, 1.15].forEach(wx => {
        [-2.5, 2.5].forEach(wz => {
          const wGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.25, 12);
          const wMesh = new THREE.Mesh(wGeo, blackMat);
          wMesh.rotation.z = Math.PI / 2;
          wMesh.position.set(wx, 0.45, wz);
          group.add(wMesh);
        });
      });

      group.add(bodyMesh, winMesh);
    } else if (type === 'car') {
      // Maruti Swift Style Car
      const lowerGeo = new THREE.BoxGeometry(1.8, 0.7, 3.8);
      const lowerMesh = new THREE.Mesh(lowerGeo, bodyMat);
      lowerMesh.position.y = 0.55;
      lowerMesh.castShadow = true;

      const cabinGeo = new THREE.BoxGeometry(1.5, 0.65, 2.0);
      const cabinMesh = new THREE.Mesh(cabinGeo, glassMat);
      cabinMesh.position.set(0, 1.1, -0.2);

      [-0.85, 0.85].forEach(wx => {
        [-1.1, 1.1].forEach(wz => {
          const wGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.2, 12);
          const wMesh = new THREE.Mesh(wGeo, blackMat);
          wMesh.rotation.z = Math.PI / 2;
          wMesh.position.set(wx, 0.32, wz);
          group.add(wMesh);
        });
      });

      group.add(lowerMesh, cabinMesh);
    } else if (type === 'bike' || type === 'scooter') {
      // Two-wheeler
      const frameGeo = new THREE.BoxGeometry(0.4, 0.6, 1.6);
      const frameMesh = new THREE.Mesh(frameGeo, bodyMat);
      frameMesh.position.y = 0.55;

      const seatGeo = new THREE.BoxGeometry(0.35, 0.15, 0.8);
      const seatMesh = new THREE.Mesh(seatGeo, blackMat);
      seatMesh.position.set(0, 0.85, -0.1);

      [-0.7, 0.7].forEach(wz => {
        const wGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 12);
        const wMesh = new THREE.Mesh(wGeo, blackMat);
        wMesh.rotation.z = Math.PI / 2;
        wMesh.position.set(0, 0.3, wz);
        group.add(wMesh);
      });

      group.add(frameMesh, seatMesh);
    } else {
      // Other Auto-rickshaw
      const autoGeo = new THREE.BoxGeometry(1.5, 1.4, 2.5);
      const autoMesh = new THREE.Mesh(autoGeo, bodyMat);
      autoMesh.position.y = 1.0;
      autoMesh.castShadow = true;
      group.add(autoMesh);
    }

    this.scene.add(group);

    this.vehicles.push({
      group,
      type,
      speed,
      dir,
      isNorthSouth
    });
  }

  update(dt, playerPos) {
    this.vehicles.forEach(v => {
      const move = v.speed * dt * v.dir;
      if (!v.isNorthSouth) {
        // Move along East-West road (X axis)
        v.group.position.x += move;
        if (v.group.position.x > 180) v.group.position.x = -180;
        if (v.group.position.x < -180) v.group.position.x = 180;
      } else {
        // Move along North-South road (Z axis)
        v.group.position.z += move;
        if (v.group.position.z > 180) v.group.position.z = -180;
        if (v.group.position.z < -180) v.group.position.z = 180;
      }
    });
  }
}
