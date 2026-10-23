// src/missions.js - 10 Engaging Story Missions for Delhi Auto Life Simulator

export const MISSIONS = [
  {
    id: 1,
    title: "Morning in Tri Nagar",
    subtitle: "Home Sweet Home",
    objective: "Walk into the kitchen and talk to Mummy (Mamta)",
    targetPos: { x: 4, z: -10, radius: 4, label: "Mamta in Kitchen" },
    requiredMode: "HARSH",
    inVehicle: false,
    reward: 50,
    introDialogue: {
      lines: [
        { speaker: "Harsh", role: "School Boy", text: "Good morning! The sun is up over Tri Nagar. Let me check on Mummy in the kitchen before school.", avatarColor: "#00e676" },
        { speaker: "Mamta", role: "Mummy", text: "Arre Harsh beta, uth gaya? Come here, take your fresh aloo paratha tiffin and pocket money!", avatarColor: "#ff7043" },
        { speaker: "Mamta", role: "Mummy", text: "Your Papa is outside cleaning his auto-rickshaw. Go say Namaste to him before you leave for school.", avatarColor: "#ff7043" }
      ]
    }
  },
  {
    id: 2,
    title: "Help Papa (Kuldeep) with Auto",
    subtitle: "Delhi Auto Driver Duty",
    objective: "Exit the house and meet Papa (Kuldeep) outside near the auto",
    targetPos: { x: 0, z: 8, radius: 5, label: "Kuldeep & Auto" },
    requiredMode: "HARSH",
    inVehicle: false,
    reward: 50,
    introDialogue: {
      lines: [
        { speaker: "Kuldeep", role: "Papa (Auto Driver)", text: "Ram Ram beta Harsh! Today is going to be a busy day in Tri Nagar and Keshav Puram.", avatarColor: "#ffd600" },
        { speaker: "Kuldeep", role: "Papa (Auto Driver)", text: "I wiped down the windshield and polished the brass Om symbol. Press [E] to hop into the driver seat!", avatarColor: "#ffd600" },
        { speaker: "Harsh", role: "Son", text: "Papa, can I learn to drive the auto today?", avatarColor: "#00e676" },
        { speaker: "Kuldeep", role: "Papa", text: "Haha! You focus on your studies at KV school, but today you can assist me on my morning passenger route!", avatarColor: "#ffd600" }
      ]
    }
  },
  {
    id: 3,
    title: "First Passenger of the Day",
    subtitle: "Tri Nagar Colony Corner",
    objective: "Drive the green-and-yellow auto to pick up Sharma Ji at Colony Corner",
    targetPos: { x: -60, z: 20, radius: 8, label: "Sharma Ji Pickup" },
    requiredMode: "KULDEEP",
    inVehicle: true,
    reward: 40,
    introDialogue: {
      lines: [
        { speaker: "Sharma Ji", role: "Passenger", text: "Bhaiya! Auto chalegi? Keshav Puram Market tak chalna hai, jaldi hai!", avatarColor: "#42a5f5" },
        { speaker: "Kuldeep", role: "Auto Driver", text: "Haan ji Sharma ji! Bilkul baithiye. Meter se chalenge ekdum badhiya!", avatarColor: "#ffd600" }
      ]
    }
  },
  {
    id: 4,
    title: "Drop at Keshav Puram Market",
    subtitle: "Navigate Delhi Traffic",
    objective: "Drive through the main road and drop Sharma Ji at Keshav Puram Market",
    targetPos: { x: 120, z: -80, radius: 9, label: "Market Drop-Off" },
    requiredMode: "KULDEEP",
    inVehicle: true,
    reward: 120,
    introDialogue: {
      lines: [
        { speaker: "Sharma Ji", role: "Passenger", text: "Bahut badhiya chalayi bhaiya! No jerks at all. Yeh lijiye aapka kiraya ₹120. Khush raho!", avatarColor: "#42a5f5" },
        { speaker: "Kuldeep", role: "Auto Driver", text: "Dhanyawaad Sharma ji! Have a wonderful day at the market.", avatarColor: "#ffd600" }
      ]
    }
  },
  {
    id: 5,
    title: "CNG Refuel Station",
    subtitle: "Clean Green Delhi",
    objective: "Drive to the IGL Green CNG Pump on Main Avenue and refuel the auto",
    targetPos: { x: 80, z: 90, radius: 9, label: "CNG Pump Bay" },
    requiredMode: "KULDEEP",
    inVehicle: true,
    reward: 60,
    introDialogue: {
      lines: [
        { speaker: "Station Attendant", role: "IGL CNG Pump", text: "Full tank kar du bhaiya? ₹80 ka CNG aayega.", avatarColor: "#26a69a" },
        { speaker: "Kuldeep", role: "Auto Driver", text: "Haan bhai, full tank kar do. Pressure achha aana chahiye!", avatarColor: "#ffd600" },
        { speaker: "Station Attendant", role: "IGL CNG Pump", text: "Hogaya bhaiya! Tank full 100%. Safe driving in Delhi!", avatarColor: "#26a69a" }
      ]
    }
  },
  {
    id: 6,
    title: "Groceries for Mamta",
    subtitle: "Gupta General Store",
    objective: "Drive or walk to Gupta Kirana Store to buy tea leaves and biscuits",
    targetPos: { x: -40, z: -50, radius: 7, label: "Gupta General Store" },
    requiredMode: "ANY",
    inVehicle: null,
    reward: 80,
    introDialogue: {
      lines: [
        { speaker: "Gupta Ji", role: "Shopkeeper", text: "Namaste Kuldeep bhai! Mamta bhabhi ka phone aaya tha. Yeh lo Taj Mahal Chai patti aur Parle-G biscuits.", avatarColor: "#ab47bc" },
        { speaker: "Kuldeep", role: "Papa", text: "Dhanyawaad Gupta ji! Mamta will be pleased. Let's deliver this home quickly.", avatarColor: "#ffd600" }
      ]
    }
  },
  {
    id: 7,
    title: "Reach KV Keshav Puram School",
    subtitle: "School Bell Calling",
    objective: "Switch to Harsh and reach the school gate before the morning bell",
    targetPos: { x: -110, z: 110, radius: 8, label: "KV School Gate" },
    requiredMode: "HARSH",
    inVehicle: null,
    reward: 70,
    introDialogue: {
      lines: [
        { speaker: "Krish", role: "Best Friend", text: "Arre Harsh! You made it just in time! Manav and Saksham are already here at the gate.", avatarColor: "#29b6f6" },
        { speaker: "Manav", role: "Friend", text: "Did you finish the science homework? The teacher is in a strict mood today!", avatarColor: "#26a69a" },
        { speaker: "Saksham", role: "Friend", text: "Forget homework, who's ready for cricket after the final bell?", avatarColor: "#ffa726" }
      ]
    }
  },
  {
    id: 8,
    title: "Meet Classmates at Playground",
    subtitle: "Kendriya Vidyalaya Keshav Puram",
    objective: "Head to the school playground and meet the classmates",
    targetPos: { x: -140, z: 150, radius: 10, label: "School Playground" },
    requiredMode: "HARSH",
    inVehicle: false,
    reward: 90,
    introDialogue: {
      lines: [
        { speaker: "Abhinav", role: "Classmate", text: "Hey Harsh! Divyanshi, Honey, and Krishna are forming teams for cricket!", avatarColor: "#ab47bc" },
        { speaker: "Divyanshi", role: "Classmate", text: "Harsh, you bat first! Amaan and Ayaan are already fielding near the boundary.", avatarColor: "#ec407a" },
        { speaker: "Kinshuk", role: "Classmate", text: "Let's make sure we hit some sixes over the Keshav Puram school wall!", avatarColor: "#7e57c2" }
      ]
    }
  },
  {
    id: 9,
    title: "Evening Rush Passenger",
    subtitle: "Delhi Metro Commuter Run",
    objective: "Switch to Kuldeep and pick up an evening passenger from Metro Station to Tri Nagar Colony",
    targetPos: { x: 130, z: 40, radius: 9, label: "Metro Passenger" },
    requiredMode: "KULDEEP",
    inVehicle: true,
    reward: 180,
    introDialogue: {
      lines: [
        { speaker: "Metro Commuter", role: "Passenger", text: "Bhaiya! Tri Nagar colony chalna hai. Delhi traffic is crazy today, can you get me home quickly?", avatarColor: "#42a5f5" },
        { speaker: "Kuldeep", role: "Auto Driver", text: "Chinta mat karo bhaiya! I know all the shortcut gullies of Tri Nagar. Seat belt laga lijiye!", avatarColor: "#ffd600" }
      ]
    }
  },
  {
    id: 10,
    title: "Return Home & Family Dinner",
    subtitle: "End of a Successful Day",
    objective: "Park the auto outside the Tri Nagar house and enter for dinner",
    targetPos: { x: 2, z: -6, radius: 5, label: "Family Home Door" },
    requiredMode: "ANY",
    inVehicle: false,
    reward: 250,
    introDialogue: {
      lines: [
        { speaker: "Mamta", role: "Mummy", text: "Arre aagaye sabhi! Chai aur garam samosa tayyar hai. Kuldeep, how was your day with the auto?", avatarColor: "#ff7043" },
        { speaker: "Kuldeep", role: "Papa", text: "Very fruitful! All passengers reached on time and we earned good money for the family.", avatarColor: "#ffd600" },
        { speaker: "Harsh", role: "Son", text: "And I met Krish, Manav, Saksham and all classmates at school! Delhi auto life is truly special.", avatarColor: "#00e676" }
      ]
    }
  }
];

export class MissionManager {
  constructor(game) {
    this.game = game;
    this.currentIndex = 0;
    this.currentMission = null;
    this.markerMesh = null;
    this.isCompleted = false;
  }

  init(savedIndex = 0) {
    this.currentIndex = Math.min(Math.max(0, savedIndex), MISSIONS.length - 1);
    this.loadMission(this.currentIndex);
  }

  loadMission(index) {
    if (index >= MISSIONS.length) {
      this.currentMission = null;
      this.isCompleted = true;
      this.game.ui.updateMissionUI({
        title: "All Missions Completed!",
        objective: "Free Roam Delhi: Drive, explore, and enjoy Tri Nagar!",
        distance: "--",
        reward: "₹ 0"
      });
      return;
    }

    this.currentIndex = index;
    this.currentMission = MISSIONS[index];
    this.isCompleted = false;

    // Trigger dialogue if present
    if (this.currentMission.introDialogue) {
      this.game.dialogue.start(this.currentMission.introDialogue);
    }

    this.updateMarker();
    this.game.ui.updateMissionUI({
      title: `${this.currentIndex + 1}. ${this.currentMission.title}`,
      objective: this.currentMission.objective,
      distance: "Calculating...",
      reward: `+ ₹${this.currentMission.reward}`
    });
  }

  updateMarker() {
    if (!this.currentMission || !this.game.world) return;
    const pos = this.currentMission.targetPos;
    this.game.world.setWaypoint(pos.x, pos.z, pos.label);
  }

  update(playerPos, inVehicle, currentMode) {
    if (!this.currentMission) return;

    const target = this.currentMission.targetPos;
    const dx = playerPos.x - target.x;
    const dz = playerPos.z - target.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    this.game.ui.updateMissionDistance(Math.round(dist));

    // Check completion criteria
    if (dist <= target.radius) {
      let modeOk = true;
      if (this.currentMission.requiredMode !== "ANY" && this.currentMission.requiredMode !== currentMode) {
        modeOk = false;
      }

      let vehicleOk = true;
      if (this.currentMission.inVehicle !== null && this.currentMission.inVehicle !== inVehicle) {
        vehicleOk = false;
      }

      if (modeOk && vehicleOk) {
        this.completeMission();
      }
    }
  }

  completeMission() {
    const mission = this.currentMission;
    if (!mission) return;

    this.game.audio.playMissionComplete();
    this.game.addCash(mission.reward);

    this.game.ui.showMissionCompleteModal({
      title: mission.title,
      reward: mission.reward,
      onContinue: () => {
        this.loadMission(this.currentIndex + 1);
        this.game.save();
      }
    });

    this.currentMission = null;
  }
}
