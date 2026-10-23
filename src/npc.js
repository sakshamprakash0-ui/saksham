// src/npc.js - Interactive 3D NPCs for Tri Nagar and KV Keshav Puram

import * as THREE from 'three';

export class NPCManager {
  constructor(scene) {
    this.scene = scene;
    this.npcs = [];
  }

  init() {
    // 1. Family: Mamta (Mother) inside house
    this.addNPC({
      id: 'mamta',
      name: 'Mamta (Mummy)',
      role: 'Loving Mother',
      x: 4, z: -10,
      color: 0xff7043, // Coral/Orange Indian Kurti
      hairColor: 0x111111,
      dialogue: {
        lines: [
          { speaker: "Mamta", role: "Mummy", text: "Namaste beta! I packed your tiffin with fresh parathas. Have a great day at school!", avatarColor: "#ff7043" },
          { speaker: "Mamta", role: "Mummy", text: "Take care on the roads, Delhi traffic in Tri Nagar is always bustling.", avatarColor: "#ff7043" }
        ]
      }
    });

    // 2. Friends at KV School Gate
    this.addNPC({
      id: 'krish',
      name: 'Krish',
      role: 'Best Friend',
      x: -108, z: 112,
      color: 0x29b6f6, // Bright Blue T-shirt
      dialogue: {
        lines: [
          { speaker: "Krish", role: "Best Friend", text: "Harsh bro! Ready for the math test? Manav said it's super tough!", avatarColor: "#29b6f6" },
          { speaker: "Krish", role: "Best Friend", text: "Let's play cricket after school on the Keshav Puram ground!", avatarColor: "#29b6f6" }
        ]
      }
    });

    this.addNPC({
      id: 'manav',
      name: 'Manav',
      role: 'Studious Friend',
      x: -112, z: 114,
      color: 0x66bb6a, // Green Shirt
      dialogue: {
        lines: [
          { speaker: "Manav", role: "Friend", text: "I finished all science diagrams yesterday! Did you revise Chapter 4?", avatarColor: "#66bb6a" }
        ]
      }
    });

    this.addNPC({
      id: 'saksham',
      name: 'Saksham',
      role: 'Cricket Captain',
      x: -110, z: 118,
      color: 0xffa726, // Orange T-shirt
      dialogue: {
        lines: [
          { speaker: "Saksham", role: "Friend", text: "Today I brought my tennis ball and Kashmir willow bat. We'll challenge the 10th graders!", avatarColor: "#ffa726" }
        ]
      }
    });

    // 3. Classmates on the School Playground
    const classmates = [
      { id: 'abhinav', name: 'Abhinav', x: -136, z: 148, color: 0xab47bc, text: "Hey Harsh! Nice to see your Papa's auto outside earlier!" },
      { id: 'divyanshi', name: 'Divyanshi', x: -142, z: 152, color: 0xec407a, text: "Good morning Harsh! We are setting up wickets on the pitch." },
      { id: 'ayaan', name: 'Ayaan', x: -145, z: 145, color: 0x26c6da, text: "I'll do spin bowling today, nobody can hit my off-break!" },
      { id: 'amaan', name: 'Amaan', x: -133, z: 155, color: 0x8d6e63, text: "Let's win the match before the school bell rings!" },
      { id: 'honey', name: 'Honey', x: -138, z: 160, color: 0xffee58, text: "I brought extra water bottles for the whole team!" },
      { id: 'kinshuk', name: 'Kinshuk', x: -148, z: 156, color: 0x7e57c2, text: "Keshav Puram playground has the best pitch in Delhi!" },
      { id: 'krishna', name: 'Krishna', x: -144, z: 162, color: 0x42a5f5, text: "Harsh, you take strike first, show us some big boundaries!" }
    ];

    classmates.forEach(c => {
      this.addNPC({
        id: c.id,
        name: c.name,
        role: 'Classmate',
        x: c.x, z: c.z,
        color: c.color,
        dialogue: {
          lines: [
            { speaker: c.name, role: "Classmate", text: c.text, avatarColor: `#${c.color.toString(16)}` }
          ]
        }
      });
    });

    // 4. Shopkeeper & Street Characters
    this.addNPC({
      id: 'guptaji',
      name: 'Gupta Ji',
      role: 'Kirana Store',
      x: -40, z: -52,
      color: 0x795548,
      dialogue: {
        lines: [
          { speaker: "Gupta Ji", role: "Shopkeeper", text: "Namaste! Everything from fresh milk to spices is available at Gupta General Store.", avatarColor: "#795548" }
        ]
      }
    });

    this.addNPC({
      id: 'sharmaji',
      name: 'Sharma Ji',
      role: 'Passenger',
      x: -60, z: 18,
      color: 0x5c6bc0,
      dialogue: {
        lines: [
          { speaker: "Sharma Ji", role: "Passenger", text: "Bhaiya! Keshav Puram Market drop kar do. Great service!", avatarColor: "#5c6bc0" }
        ]
      }
    });

    this.addNPC({
      id: 'chaiwala',
      name: 'Ramu Kaka',
      role: 'Chai Tapri',
      x: 35, z: -35,
      color: 0xd84315,
      dialogue: {
        lines: [
          { speaker: "Ramu Kaka", role: "Tea Stall", text: "Garam adrak wali chai tayyar hai! Kuldeep bhai, have a cup before your shift!", avatarColor: "#d84315" }
        ]
      }
    });
  }

  addNPC(data) {
    const group = new THREE.Group();
    group.position.set(data.x, 0, data.z);

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xc68642, roughness: 0.6 });
    const clothesMat = new THREE.MeshStandardMaterial({ color: data.color || 0x2196f3, roughness: 0.7 });
    const hairMat = new THREE.MeshStandardMaterial({ color: data.hairColor || 0x111111, roughness: 0.9 });
    const pantMat = new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.8 });

    // Head
    const headGeo = new THREE.BoxGeometry(0.3, 0.32, 0.3);
    const head = new THREE.Mesh(headGeo, skinMat);
    head.position.y = 1.45;
    head.castShadow = true;

    // Hair
    const hairGeo = new THREE.BoxGeometry(0.32, 0.1, 0.32);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 1.58, 0);

    // Torso
    const torsoGeo = new THREE.BoxGeometry(0.42, 0.5, 0.26);
    const torso = new THREE.Mesh(torsoGeo, clothesMat);
    torso.position.y = 1.05;
    torso.castShadow = true;

    // Legs
    const legGeo = new THREE.BoxGeometry(0.14, 0.48, 0.14);
    const lLeg = new THREE.Mesh(legGeo, pantMat);
    lLeg.position.set(-0.12, 0.48, 0);
    lLeg.castShadow = true;
    const rLeg = new THREE.Mesh(legGeo, pantMat);
    rLeg.position.set(0.12, 0.48, 0);
    rLeg.castShadow = true;

    // Arms
    const armGeo = new THREE.BoxGeometry(0.12, 0.44, 0.12);
    const lArm = new THREE.Mesh(armGeo, clothesMat);
    lArm.position.set(-0.28, 1.05, 0);
    const rArm = new THREE.Mesh(armGeo, clothesMat);
    rArm.position.set(0.28, 1.05, 0);

    group.add(head, hair, torso, lLeg, rLeg, lArm, rArm);

    // 3D Name Billboard Tag
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.roundRect ? ctx.roundRect(4, 4, 248, 56, 12) : ctx.rect(4, 4, 248, 56);
    ctx.fill();
    ctx.strokeStyle = '#ffd600';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(data.name, 128, 32);
    ctx.fillStyle = '#00e676';
    ctx.font = '16px sans-serif';
    ctx.fillText(data.role, 128, 50);

    const tex = new THREE.CanvasTexture(canvas);
    const tagGeo = new THREE.PlaneGeometry(1.4, 0.35);
    const tagMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
    const tagMesh = new THREE.Mesh(tagGeo, tagMat);
    tagMesh.position.y = 1.95;
    group.add(tagMesh);

    this.scene.add(group);

    this.npcs.push({
      id: data.id,
      name: data.name,
      role: data.role,
      position: new THREE.Vector3(data.x, 0, data.z),
      group,
      tagMesh,
      dialogue: data.dialogue,
      animOffset: Math.random() * Math.PI * 2
    });
  }

  update(dt, camera, playerPos) {
    const time = Date.now() * 0.002;
    this.npcs.forEach(npc => {
      // Billboard name tag towards camera
      npc.tagMesh.quaternion.copy(camera.quaternion);

      // Subtle idle breathing
      const idle = Math.sin(time + npc.animOffset) * 0.015;
      npc.group.position.y = idle;

      // Turn towards player when close
      const dist = npc.position.distanceTo(playerPos);
      if (dist < 8.0) {
        const dx = playerPos.x - npc.position.x;
        const dz = playerPos.z - npc.position.z;
        npc.group.rotation.y = Math.atan2(dx, dz);
      }
    });
  }

  getNearestNPC(playerPos, maxDist = 3.5) {
    let nearest = null;
    let minDist = maxDist;
    for (let i = 0; i < this.npcs.length; i++) {
      const npc = this.npcs[i];
      const d = npc.position.distanceTo(playerPos);
      if (d < minDist) {
        minDist = d;
        nearest = npc;
      }
    }
    return nearest;
  }
}
