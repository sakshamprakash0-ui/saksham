// src/world.js - Procedural 3D Tri Nagar & KV Keshav Puram Open-World Delhi Environment

import * as THREE from 'three';

export class World {
  constructor(scene) {
    this.scene = scene;
    this.buildings = [];
    this.streetlights = [];
    this.windowMeshes = [];
    this.waypointMesh = null;
    this.waypointRing = null;

    // Lighting
    this.sunLight = null;
    this.ambientLight = null;
    this.hemiLight = null;

    this.buildLighting();
    this.buildGroundAndRoads();
    this.buildFamilyHome();
    this.buildKVSchool();
    this.buildShopsAndMarkets();
    this.buildCNGStation();
    this.buildResidentialBuildings();
    this.buildStreetDetails();
    this.buildWaypoint();
  }

  buildLighting() {
    this.ambientLight = new THREE.AmbientLight(0xfff3e0, 0.45);
    this.scene.add(this.ambientLight);

    this.hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x546e7a, 0.4);
    this.scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xfffaed, 1.2);
    this.sunLight.position.set(60, 90, 50);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 250;
    this.sunLight.shadow.camera.left = -120;
    this.sunLight.shadow.camera.right = 120;
    this.sunLight.shadow.camera.top = 120;
    this.sunLight.shadow.camera.bottom = -120;
    this.scene.add(this.sunLight);

    // Fog for Delhi atmospheric haze
    this.scene.fog = new THREE.FogExp2(0xd7ccc8, 0.0035);
  }

  buildGroundAndRoads() {
    // 1. Base Terrain Ground (Paved / Dusty Delhi ground)
    const groundGeo = new THREE.PlaneGeometry(400, 400);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x9e9d24, // Warm dusty Delhi soil/grass
      roughness: 0.95
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x263238, // Asphalt road
      roughness: 0.85
    });

    const curbMat = new THREE.MeshStandardMaterial({
      color: 0xb0bec5,
      roughness: 0.9
    });

    const markingMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const yellowLineMat = new THREE.MeshBasicMaterial({ color: 0xffd600 });

    // Main East-West Road (Z: -6 to 6, Length: 380m)
    const mainRoadGeo = new THREE.PlaneGeometry(380, 14);
    const mainRoad = new THREE.Mesh(mainRoadGeo, roadMat);
    mainRoad.rotation.x = -Math.PI / 2;
    mainRoad.position.set(0, 0.02, 0);
    mainRoad.receiveShadow = true;
    this.scene.add(mainRoad);

    // Road Sidewalks (North and South)
    [-8, 8].forEach(zPos => {
      const walkGeo = new THREE.BoxGeometry(380, 0.25, 2.5);
      const walkMesh = new THREE.Mesh(walkGeo, curbMat);
      walkMesh.position.set(0, 0.125, zPos);
      this.scene.add(walkMesh);
    });

    // White dashed center line for Main Road
    for (let x = -180; x < 180; x += 10) {
      const dashGeo = new THREE.PlaneGeometry(4.5, 0.35);
      const dashMesh = new THREE.Mesh(dashGeo, markingMat);
      dashMesh.rotation.x = -Math.PI / 2;
      dashMesh.position.set(x, 0.03, 0);
      this.scene.add(dashMesh);
    }

    // North-South Road towards School & Market (X: 45 to 55)
    const nsRoadGeo = new THREE.PlaneGeometry(12, 380);
    const nsRoad = new THREE.Mesh(nsRoadGeo, roadMat);
    nsRoad.rotation.x = -Math.PI / 2;
    nsRoad.position.set(50, 0.025, 0);
    nsRoad.receiveShadow = true;
    this.scene.add(nsRoad);

    // School Avenue Road (Z: 95 to 105, leading west to KV School)
    const schoolRoadGeo = new THREE.PlaneGeometry(240, 10);
    const schoolRoad = new THREE.Mesh(schoolRoadGeo, roadMat);
    schoolRoad.rotation.x = -Math.PI / 2;
    schoolRoad.position.set(-60, 0.026, 100);
    schoolRoad.receiveShadow = true;
    this.scene.add(schoolRoad);

    // Tri Nagar Residential Gully (connecting family home)
    const gullyGeo = new THREE.PlaneGeometry(8, 90);
    const gully = new THREE.Mesh(gullyGeo, roadMat);
    gully.rotation.x = -Math.PI / 2;
    gully.position.set(0, 0.024, -45);
    gully.receiveShadow = true;
    this.scene.add(gully);

    // Zebra crossing at Main Intersection (X: 50, Z: 0)
    for (let i = -5; i <= 5; i += 1.8) {
      const zGeo = new THREE.PlaneGeometry(0.8, 11);
      const zMesh = new THREE.Mesh(zGeo, markingMat);
      zMesh.rotation.x = -Math.PI / 2;
      zMesh.position.set(50 + i, 0.035, 8.5);
      this.scene.add(zMesh);
    }

    // Speed Breakers (Rumble Strips)
    [-30, 90].forEach(bx => {
      const bumpGeo = new THREE.CylinderGeometry(0.4, 0.4, 13, 8, 1, false, 0, Math.PI);
      const bumpMesh = new THREE.Mesh(bumpGeo, yellowLineMat);
      bumpMesh.rotation.z = Math.PI / 2;
      bumpMesh.position.set(bx, 0.08, 0);
      this.scene.add(bumpMesh);
    });
  }

  buildFamilyHome() {
    // Kuldeep & Mamta's Family Home at (0, 0, -14)
    // Detailed 2-story building with explorable ground-floor interior!
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xffe0b2, roughness: 0.8 }); // Peach Delhi plaster
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xd7ccc8, roughness: 0.6 }); // Marble floor
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.7 });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x1976d2, roughness: 0.5 });

    // Exterior Walls (leaving front doorway open at X: 0, Z: -6)
    // Left Wall
    this.addStaticBox(-5, 3, -14, 0.5, 6, 12, wallMat);
    // Right Wall
    this.addStaticBox(5, 3, -14, 0.5, 6, 12, wallMat);
    // Back Wall
    this.addStaticBox(0, 3, -20, 10, 6, 0.5, wallMat);
    // Front Wall Left
    this.addStaticBox(-3, 3, -8, 4, 6, 0.5, wallMat);
    // Front Wall Right
    this.addStaticBox(3, 3, -8, 4, 6, 0.5, wallMat);

    // Ground Floor Interior
    const interiorFloor = new THREE.Mesh(new THREE.PlaneGeometry(9.6, 11.6), floorMat);
    interiorFloor.rotation.x = -Math.PI / 2;
    interiorFloor.position.set(0, 0.04, -14);
    interiorFloor.receiveShadow = true;
    this.scene.add(interiorFloor);

    // Ceiling / Second Floor
    const roofGeo = new THREE.BoxGeometry(10.5, 0.4, 12.5);
    const roofMesh = new THREE.Mesh(roofGeo, wallMat);
    roofMesh.position.set(0, 6, -14);
    this.scene.add(roofMesh);

    // House Nameplate: "KULDEEP & MAMTA NIWAS - TRI NAGAR"
    const plateCanvas = document.createElement('canvas');
    plateCanvas.width = 256;
    plateCanvas.height = 64;
    const pCtx = plateCanvas.getContext('2d');
    pCtx.fillStyle = '#b71c1c';
    pCtx.fillRect(0, 0, 256, 64);
    pCtx.fillStyle = '#ffd600';
    pCtx.font = 'bold 22px sans-serif';
    pCtx.textAlign = 'center';
    pCtx.fillText('KULDEEP NIWAS', 128, 28);
    pCtx.fillStyle = '#ffffff';
    pCtx.font = '16px sans-serif';
    pCtx.fillText('Tri Nagar, Delhi', 128, 50);

    const plateTex = new THREE.CanvasTexture(plateCanvas);
    const plateMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.4), new THREE.MeshBasicMaterial({ map: plateTex }));
    plateMesh.position.set(1.5, 2.4, -7.7);
    this.scene.add(plateMesh);

    // --- INTERIOR FURNITURE ---
    // 1. Living Room Sofa
    const sofaMat = new THREE.MeshStandardMaterial({ color: 0x8e24aa, roughness: 0.7 });
    const sofa = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 1.0), sofaMat);
    sofa.position.set(-3.2, 0.35, -12);
    this.scene.add(sofa);

    // Tea Table with Chai Cups
    const table = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.45, 0.7), woodMat);
    table.position.set(-1.4, 0.22, -12);
    this.scene.add(table);

    // 2. Television on cabinet
    const tvStand = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.6, 0.5), woodMat);
    tvStand.position.set(-3.2, 0.3, -17);
    const tvScreen = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.9, 0.1), new THREE.MeshBasicMaterial({ color: 0x0d47a1 }));
    tvScreen.position.set(-3.2, 1.1, -17);
    this.scene.add(tvStand, tvScreen);

    // 3. Kitchen Counter for Mamta
    const kitchenMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.5 });
    const counter = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.85, 1.2), kitchenMat);
    counter.position.set(2.8, 0.42, -17);
    this.scene.add(counter);

    // Gas Stove with Pots
    const stove = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.5), new THREE.MeshStandardMaterial({ color: 0x212121 }));
    stove.position.set(2.8, 0.9, -17);
    this.scene.add(stove);

    // 4. Pooja Mandir Shelf with Glowing Diya
    const mandir = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.0, 0.4), woodMat);
    mandir.position.set(4.2, 1.8, -13);
    const diyaLight = new THREE.PointLight(0xffa726, 1.5, 6);
    diyaLight.position.set(4.2, 2.0, -12.7);
    this.scene.add(mandir, diyaLight);

    // 5. Rooftop Sintex Water Tank (Black plastic tank)
    const tankGeo = new THREE.CylinderGeometry(1.0, 1.0, 1.6, 16);
    const tankMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 });
    const tank = new THREE.Mesh(tankGeo, tankMat);
    tank.position.set(2.5, 7.0, -16);
    this.scene.add(tank);

    // Desert Air Cooler on Balcony
    const coolerGeo = new THREE.BoxGeometry(1.1, 1.2, 0.9);
    const coolerMat = new THREE.MeshStandardMaterial({ color: 0x00897b, roughness: 0.7 });
    const cooler = new THREE.Mesh(coolerGeo, coolerMat);
    cooler.position.set(-3.5, 4.0, -7.5);
    this.scene.add(cooler);
  }

  buildKVSchool() {
    // Kendriya Vidyalaya Keshav Puram School Complex
    // Located at X: -110 to -170, Z: 100 to 180
    const schoolWallMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.7 });
    const trimMat = new THREE.MeshStandardMaterial({ color: 0x1565c0, roughness: 0.5 }); // KV Blue Trim

    // 1. Boundary Walls
    this.addStaticBox(-110, 1.6, 140, 0.4, 3.2, 80, schoolWallMat); // East wall
    this.addStaticBox(-170, 1.6, 140, 0.4, 3.2, 80, schoolWallMat); // West wall
    this.addStaticBox(-140, 1.6, 180, 60, 3.2, 0.4, schoolWallMat); // South wall
    // North wall with Gate Opening
    this.addStaticBox(-145, 1.6, 100, 30, 3.2, 0.4, schoolWallMat);
    this.addStaticBox(-115, 1.6, 100, 10, 3.2, 0.4, schoolWallMat);

    // Blue Main Gate
    const gateGeo = new THREE.BoxGeometry(6, 3.0, 0.2);
    const gateMesh = new THREE.Mesh(gateGeo, trimMat);
    gateMesh.position.set(-124, 1.5, 100);
    this.scene.add(gateMesh);

    // KV School Signboard Banner
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 512;
    signCanvas.height = 128;
    const sCtx = signCanvas.getContext('2d');
    sCtx.fillStyle = '#0d47a1';
    sCtx.fillRect(0, 0, 512, 128);
    sCtx.fillStyle = '#ffffff';
    sCtx.font = 'bold 30px sans-serif';
    sCtx.textAlign = 'center';
    sCtx.fillText('KENDRIYA VIDYALAYA', 256, 45);
    sCtx.fillStyle = '#ffd600';
    sCtx.font = 'bold 26px sans-serif';
    sCtx.fillText('KESHAV PURAM, DELHI', 256, 95);

    const signTex = new THREE.CanvasTexture(signCanvas);
    const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.5), new THREE.MeshBasicMaterial({ map: signTex }));
    signMesh.position.set(-124, 3.8, 99.8);
    this.scene.add(signMesh);

    // 2. Main 3-Story School Building
    this.addStaticBox(-140, 6, 125, 45, 12, 16, schoolWallMat);
    // School Building Blue Trim Roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(46, 0.6, 17), trimMat);
    roof.position.set(-140, 12.3, 125);
    this.scene.add(roof);

    // School Assembly Flagpole (Tiranga colors)
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 8, 8), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    pole.position.set(-125, 4, 115);
    this.scene.add(pole);

    // 3. Playground & Cricket Ground
    const pitchMat = new THREE.MeshStandardMaterial({ color: 0xd7ccc8, roughness: 0.9 });
    const pitch = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 20), pitchMat);
    pitch.rotation.x = -Math.PI / 2;
    pitch.position.set(-142, 0.03, 155);
    this.scene.add(pitch);

    // Cricket Wickets / Stumps
    [-142, -142].forEach((wx, i) => {
      const wz = i === 0 ? 146 : 164;
      const stumpGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.75, 6);
      const stumpMat = new THREE.MeshStandardMaterial({ color: 0xffeb3b });
      [-0.15, 0, 0.15].forEach(sx => {
        const s = new THREE.Mesh(stumpGeo, stumpMat);
        s.position.set(wx + sx, 0.38, wz);
        this.scene.add(s);
      });
    });
  }

  buildShopsAndMarkets() {
    // 1. Gupta General Store / Kirana Shop at (-40, 0, -50)
    const storeMat = new THREE.MeshStandardMaterial({ color: 0xffcc80, roughness: 0.8 });
    this.addStaticBox(-40, 2.5, -55, 12, 5, 8, storeMat);

    // Shop Awning Canopy (Red & Yellow Stripes)
    const awningGeo = new THREE.BoxGeometry(10, 0.1, 2.5);
    const awningMat = new THREE.MeshStandardMaterial({ color: 0xd32f2f, roughness: 0.6 });
    const awning = new THREE.Mesh(awningGeo, awningMat);
    awning.position.set(-40, 3.2, -50);
    awning.rotation.x = 0.2;
    this.scene.add(awning);

    // Signboard: "GUPTA GENERAL STORE - TRI NAGAR"
    const storeCanvas = document.createElement('canvas');
    storeCanvas.width = 256;
    storeCanvas.height = 64;
    const sCtx = storeCanvas.getContext('2d');
    sCtx.fillStyle = '#ffd600';
    sCtx.fillRect(0, 0, 256, 64);
    sCtx.fillStyle = '#b71c1c';
    sCtx.font = 'bold 22px sans-serif';
    sCtx.textAlign = 'center';
    sCtx.fillText('GUPTA GENERAL STORE', 128, 28);
    sCtx.fillStyle = '#1b5e20';
    sCtx.font = '16px sans-serif';
    sCtx.fillText('Cold Drinks & Daily Kirana', 128, 50);

    const storeSign = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 0.8),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(storeCanvas) })
    );
    storeSign.position.set(-40, 3.8, -48.9);
    this.scene.add(storeSign);

    // 2. Sharma Tea Stall / Chai Tapri at (35, 0, -35)
    const teaStallMat = new THREE.MeshStandardMaterial({ color: 0x795548, roughness: 0.9 });
    const stall = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.4, 2.2), teaStallMat);
    stall.position.set(35, 1.2, -35);
    this.scene.add(stall);

    // Tea bench
    const bench = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 0.5), teaStallMat);
    bench.position.set(35, 0.22, -32.5);
    this.scene.add(bench);

    // 3. Keshav Puram Local Market Complex at (120, 0, -80)
    const marketMat = new THREE.MeshStandardMaterial({ color: 0xffab91, roughness: 0.8 });
    this.addStaticBox(120, 4, -85, 30, 8, 14, marketMat);

    // Market Signboard
    const mCanvas = document.createElement('canvas');
    mCanvas.width = 256;
    mCanvas.height = 64;
    const mCtx = mCanvas.getContext('2d');
    mCtx.fillStyle = '#1565c0';
    mCtx.fillRect(0, 0, 256, 64);
    mCtx.fillStyle = '#ffd600';
    mCtx.font = 'bold 24px sans-serif';
    mCtx.textAlign = 'center';
    mCtx.fillText('KESHAV PURAM MARKET', 128, 40);

    const mSign = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 1.5),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(mCanvas) })
    );
    mSign.position.set(120, 7.5, -77.8);
    this.scene.add(mSign);

    // Fruit and Vegetable Thelas (Wooden Handcarts with Umbrella)
    [112, 122, 130].forEach((tx, idx) => {
      const thela = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 1.4), new THREE.MeshStandardMaterial({ color: 0x8d6e63 }));
      thela.position.set(tx, 0.4, -75);
      this.scene.add(thela);

      // Umbrella
      const umbrellaGeo = new THREE.ConeGeometry(1.4, 0.6, 8);
      const umbrellaMat = new THREE.MeshStandardMaterial({
        color: idx % 2 === 0 ? 0x00e676 : 0xff1744,
        roughness: 0.6
      });
      const umbrella = new THREE.Mesh(umbrellaGeo, umbrellaMat);
      umbrella.position.set(tx, 2.2, -75);
      this.scene.add(umbrella);
    });
  }

  buildCNGStation() {
    // IGL Green CNG Filling Station at (80, 0, 90)
    const cngGreenMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.5 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.6 });

    // Station Canopy Roof
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(22, 0.8, 16), cngGreenMat);
    canopy.position.set(80, 5.5, 90);
    this.scene.add(canopy);

    // Canopy Pillars
    [[-8, -6], [8, -6], [-8, 6], [8, 6]].forEach(p => {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 5.5, 12), whiteMat);
      pillar.position.set(80 + p[0], 2.75, 90 + p[1]);
      this.scene.add(pillar);
    });

    // CNG Dispensers / Fuel Pumps
    [-4, 4].forEach(px => {
      const pump = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.2, 0.8), cngGreenMat);
      pump.position.set(80 + px, 1.1, 90);
      this.scene.add(pump);
    });

    // Station Office / Building
    this.addStaticBox(80, 2.5, 102, 16, 5, 6, whiteMat);

    // Signboard: "IGL GREEN CNG PUMP - TRI NAGAR"
    const cngCanvas = document.createElement('canvas');
    cngCanvas.width = 256;
    cngCanvas.height = 64;
    const cCtx = cngCanvas.getContext('2d');
    cCtx.fillStyle = '#1b5e20';
    cCtx.fillRect(0, 0, 256, 64);
    cCtx.fillStyle = '#ffffff';
    cCtx.font = 'bold 22px sans-serif';
    cCtx.textAlign = 'center';
    cCtx.fillText('IGL GREEN CNG', 128, 28);
    cCtx.fillStyle = '#ffd600';
    cCtx.font = '16px sans-serif';
    cCtx.fillText('Clean Fuel For Delhi', 128, 50);

    const cngSign = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 1.25),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cngCanvas) })
    );
    cngSign.position.set(80, 6.2, 81.9);
    this.scene.add(cngSign);
  }

  buildResidentialBuildings() {
    // Variety of colorful Delhi brick and plaster apartment houses
    const colors = [0xe0e0e0, 0xffccbc, 0xc8e6c9, 0xb3e5fc, 0xffecb3, 0xd1c4e9];

    const buildingData = [
      // Along Main Road (North side)
      { x: -90, z: -25, w: 20, h: 14, d: 16, c: 0 },
      { x: -60, z: -25, w: 22, h: 16, d: 16, c: 1 },
      { x: -20, z: -25, w: 18, h: 12, d: 16, c: 2 },
      { x: 90, z: -25, w: 24, h: 18, d: 16, c: 3 },
      { x: 150, z: -25, w: 26, h: 15, d: 16, c: 4 },

      // Along Main Road (South side)
      { x: -90, z: 25, w: 20, h: 15, d: 16, c: 5 },
      { x: -50, z: 25, w: 24, h: 17, d: 16, c: 0 },
      { x: -10, z: 25, w: 18, h: 13, d: 16, c: 1 },
      { x: 100, z: 25, w: 22, h: 16, d: 16, c: 2 },
      { x: 145, z: 25, w: 24, h: 14, d: 16, c: 3 },

      // Deep Tri Nagar Residential Neighborhood
      { x: -35, z: -90, w: 16, h: 11, d: 14, c: 4 },
      { x: 10, z: -90, w: 20, h: 15, d: 16, c: 5 },
      { x: 45, z: -90, w: 18, h: 13, d: 14, c: 0 },
      { x: -80, z: -85, w: 22, h: 14, d: 16, c: 1 }
    ];

    buildingData.forEach(b => {
      const mat = new THREE.MeshStandardMaterial({
        color: colors[b.c % colors.length],
        roughness: 0.8
      });
      this.addStaticBox(b.x, b.h / 2, b.z, b.w, b.h, b.d, mat);

      // Rooftop water tank
      const tank = new THREE.Mesh(
        new THREE.CylinderGeometry(0.9, 0.9, 1.4, 12),
        new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 })
      );
      tank.position.set(b.x + 2, b.h + 0.7, b.z);
      this.scene.add(tank);
    });

    // Elevated Delhi Metro Pillar & Viaduct section at world border (Z: 140)
    for (let x = -80; x <= 160; x += 30) {
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.2, 14, 12),
        new THREE.MeshStandardMaterial({ color: 0x90a4ae, roughness: 0.7 })
      );
      pillar.position.set(x, 7, 140);
      this.scene.add(pillar);
    }
    const metroTrack = new THREE.Mesh(
      new THREE.BoxGeometry(260, 2, 8),
      new THREE.MeshStandardMaterial({ color: 0x78909c, roughness: 0.6 })
    );
    metroTrack.position.set(40, 14, 140);
    this.scene.add(metroTrack);
  }

  buildStreetDetails() {
    // 1. Streetlights along Main Road
    for (let x = -160; x <= 160; x += 40) {
      this.addStreetLight(x, 7.5);
      this.addStreetLight(x, -7.5, true);
    }

    // 2. Trees (Neem / Ashoka style)
    const treePositions = [
      [-15, 10], [15, 10], [-70, 10], [70, 10],
      [-25, -10], [25, -10], [-65, -10], [65, -10],
      [-120, 88], [-100, 88], [-80, 88],
      [35, -45], [45, -45]
    ];

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.9 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.8 });

    treePositions.forEach(tp => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 3.5, 8), trunkMat);
      trunk.position.set(tp[0], 1.75, tp[1]);
      trunk.castShadow = true;

      const crown = new THREE.Mesh(new THREE.SphereGeometry(1.8, 8, 8), leafMat);
      crown.position.set(tp[0], 4.2, tp[1]);
      crown.castShadow = true;

      this.scene.add(trunk, crown);
    });
  }

  addStreetLight(x, z, flip = false) {
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x37474f, roughness: 0.7 });
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xfffae0 });

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 6.5, 8), poleMat);
    pole.position.set(x, 3.25, z);

    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 1.6), poleMat);
    arm.position.set(x, 6.4, z + (flip ? 0.8 : -0.8));

    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), lampMat);
    lamp.position.set(x, 6.3, z + (flip ? 1.4 : -1.4));

    const light = new THREE.PointLight(0xfffae0, 0.8, 22, 1.6);
    light.position.copy(lamp.position);
    light.visible = false; // Initially daylight

    this.scene.add(pole, arm, lamp, light);
    this.streetlights.push({ light, lamp });
  }

  buildWaypoint() {
    // 3D Visual Waypoint Beacon Pillar
    const beaconGeo = new THREE.CylinderGeometry(0.2, 0.2, 35, 12);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0x00e676,
      transparent: true,
      opacity: 0.55
    });
    this.waypointMesh = new THREE.Mesh(beaconGeo, beaconMat);
    this.waypointMesh.position.set(0, 17.5, 0);

    // Glowing ground ring
    const ringGeo = new THREE.RingGeometry(2.0, 2.5, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00e676,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    this.waypointRing = new THREE.Mesh(ringGeo, ringMat);
    this.waypointRing.rotation.x = -Math.PI / 2;
    this.waypointRing.position.set(0, 0.08, 0);

    this.scene.add(this.waypointMesh, this.waypointRing);
  }

  setWaypoint(x, z, label = '') {
    this.waypointMesh.position.set(x, 17.5, z);
    this.waypointRing.position.set(x, 0.08, z);
  }

  addStaticBox(x, y, z, w, h, d, material) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);

    // Bounding box for collision
    this.buildings.push({
      minX: x - w / 2,
      maxX: x + w / 2,
      minZ: z - d / 2,
      maxZ: z + d / 2,
      height: h
    });
    return mesh;
  }

  updateTimeOfDay(timeHours) {
    // timeHours: 0.0 to 24.0 (e.g. 8.5 is 8:30 AM)
    const normTime = ((timeHours % 24) / 24);
    const sunAngle = (normTime * Math.PI * 2) - Math.PI / 2;

    const sunX = Math.cos(sunAngle) * 120;
    const sunY = Math.sin(sunAngle) * 120;
    this.sunLight.position.set(sunX, Math.max(sunY, -20), 40);

    const isDay = sunY > 5;
    const isSunset = sunY > -5 && sunY <= 25;

    if (isDay) {
      if (isSunset) {
        // Warm Delhi evening sunset
        this.sunLight.color.setHex(0xff7043);
        this.sunLight.intensity = 0.9;
        this.ambientLight.color.setHex(0xffab91);
        this.ambientLight.intensity = 0.4;
        this.scene.fog.color.setHex(0xd7ccc8);
      } else {
        // Bright Delhi afternoon
        this.sunLight.color.setHex(0xfffaed);
        this.sunLight.intensity = 1.3;
        this.ambientLight.color.setHex(0xfff3e0);
        this.ambientLight.intensity = 0.5;
        this.scene.fog.color.setHex(0xb0bec5);
      }
    } else {
      // Delhi Night
      this.sunLight.intensity = 0.05;
      this.ambientLight.color.setHex(0x1a237e);
      this.ambientLight.intensity = 0.15;
      this.scene.fog.color.setHex(0x0a1128);
    }

    // Toggle streetlights based on night/sunset
    const needStreetlights = !isDay || isSunset;
    this.streetlights.forEach(sl => {
      sl.light.visible = needStreetlights;
      sl.lamp.material.color.setHex(needStreetlights ? 0xfffae0 : 0x78909c);
    });

    // Animate waypoint ring pulse
    if (this.waypointRing) {
      const scale = 1.0 + Math.sin(Date.now() * 0.005) * 0.15;
      this.waypointRing.scale.set(scale, scale, scale);
    }
  }
}
