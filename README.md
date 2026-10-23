# HARSH — DELHI AUTO LIFE SIMULATOR 3D

A 3D open-world Indian auto-rickshaw driving and life simulator set in **Tri Nagar** and **Kendriya Vidyalaya, Keshav Puram**, Delhi. Built with HTML5, CSS3, JavaScript and Three.js.

---

## 🎮 How to Run on Windows / Desktop

```bash
# 1. Install dependencies
npm install

# 2. Start local Vite development server
npm run dev
```

Open the local server URL (e.g., `http://localhost:5173/`) printed in your terminal.

---

## 🕹️ Controls Guide

| Action | Keyboard | Touch / Mobile |
| :--- | :--- | :--- |
| **Drive / Walk Forward** | `W` or `Up Arrow` | `▲` D-Pad |
| **Reverse / Walk Backward** | `S` or `Down Arrow` | `▼` D-Pad |
| **Steer / Walk Left** | `A` or `Left Arrow` | `◀` D-Pad |
| **Steer / Walk Right** | `D` or `Right Arrow` | `▶` D-Pad |
| **Handbrake / Jump** | `Space` | `✋` Brake button |
| **Enter / Exit Auto & Interact** | `E` | `E` button / On-screen prompt |
| **Delhi Street Horn** | `H` | `📢` Horn button |
| **Toggle Camera Mode** | `C` | 🎥 Camera button |
| **Sprint (On Foot)** | `Shift` (Hold) | Automatic when moving |
| **Flip / Reset Auto** | `R` | 🔄 Reset button |
| **Pause & Settings** | `Escape` | ⏸️ Pause button |
| **Look Around** | Click & Drag Mouse | Touch & Drag Screen |

---

## 🏙️ Key Features & Neighborhood

1. **Tri Nagar Open World**:
   - Indian residential streets, gullies, multi-story brick/peach houses with rooftop black Sintex water tanks, air coolers, and drying balconies.
   - **Kuldeep & Mamta's Family Home**: Fully explorable interior featuring the living room, sofa, TV, kitchen counter with gas stove, pooja mandir shelf with glowing diya, and family nameplate.
   - **Kendriya Vidyalaya Keshav Puram**: School boundary wall, blue main gate, "KENDRIYA VIDYALAYA KESHAV PURAM" signboard, 3-story school building, morning assembly courtyard, and playground with a cricket pitch, wickets, and goalposts.
   - **Shops & Markets**: Sharma Tea Stall (Chai Tapri), Gupta General Store, Keshav Puram Local Market handcarts with umbrellas, and IGL Green CNG station with refuel bay.
   - **Delhi Metro**: Elevated metro pillars and viaduct running along the northern perimeter.
   - **Delhi Traffic**: Red DTC buses, Maruti cars, sedans, Royal Enfield Bullet, scooters, and other auto-rickshaws.

2. **Playable Bajaj Auto-Rickshaw**:
   - Iconic curved yellow roof, green lower tub, front steering fork with mudguard, rotating handlebars, and rearview mirrors.
   - Working rotating wheels with custom physics (acceleration, reverse, turning lean, and collision bounce).
   - "HORN OK PLEASE" and "BURI NAZAR WALE TERA MUH KALA" rear decals.
   - Procedural 2-stroke engine sound, pneumatic pressure horn ("peep-peep-paa"), and brake screeching via Web Audio.
   - Functional fuel gauge (refills at CNG pump) and speedometer (0-80 km/h).

3. **Two Playable Modes & Characters**:
   - **Mode A: Kuldeep's Auto Driver Life**: Pick up passengers, follow waypoints, earn cash fares in ₹, track fuel expenses, and navigate rush hour.
   - **Mode B: Harsh's Open-World Life**: Walk around Tri Nagar, explore home, talk with Mamta, visit KV Keshav Puram, and meet classmates.
   - Interactive dialogue with **Mamta**, **Kuldeep**, **Krish**, **Manav**, **Saksham**, and classmates (**Abhinav, Amaan, Ayaan, Divyanshi, Honey, Kinshuk, Krishna**).

4. **10 Story Missions**:
   1. *Morning in Tri Nagar*: Wake up, talk to Mamta in kitchen, get tiffin and blessings.
   2. *Help Papa (Kuldeep) with Auto*: Meet Kuldeep outside, inspect auto, hop in.
   3. *First Passenger of the Day*: Drive auto to pick up Sharma Ji at Colony Corner.
   4. *Drop at Keshav Puram Market*: Navigate Delhi traffic to drop passenger at market (+ ₹120).
   5. *CNG Refuel Station*: Drive to IGL Green CNG Pump on Main Avenue and refuel.
   6. *Groceries for Mamta*: Visit Gupta General Store, buy tea and snacks for home.
   7. *Reach KV Keshav Puram School*: Switch to Harsh, meet Krish, Manav, and Saksham at the gate.
   8. *Meet Classmates at Playground*: Hangout with classmates at the cricket pitch.
   9. *Evening Rush Passenger*: Switch to Kuldeep, transport an evening metro commuter (+ ₹180).
   10. *Return Home & Family Dinner*: Park auto, enter home for dinner, save progress.

5. **Storage & Performance**:
   - LocalStorage auto-save for Cash (₹), Mission Progress, Fuel, and Day/Time.
   - Dual support: runs natively in Web browsers via Vite and inside Android via hardware-accelerated WebView.
