# CrimeVision AI – Synthetic Demo Dataset Dossier

## 1. DATASET OVERVIEW & FICTIONAL STATUS
**Case Reference:** `CV-DEMO-001 – Riverside Incident Investigation`  
**Classification:** Fictional Demonstration Dataset for Forensic Decision-Support System  
**Notice:** All individuals, company entities, incidents, locations, badge numbers, timestamps, and statements are entirely synthetic and created for testing and demonstrating multimodal AI capabilities. **Never present synthetic evidence as real forensic evidence.**

---

## 2. REFERENCE GROUND TRUTH FACTS
- **Incident Description:** Forced entry into Riverside Warehouse District Pier 14, Sector 7, Gate 4, followed by warehouse entry into Bay 3 and tampering with shipping manifest files.
- **Physical Breach Time:** `2026-10-14 20:44:12 UTC` (Registered by automated fiber-optic vibration sensor `#A-417`).
- **Physical Tool:** Commercial mechanical/hydraulic bolt cutters. Tool striations on Master Lock Series 65D shackle (11mm diameter). Adhered microscopic caution yellow industrial paint flakes.
- **Tire Impressions:** Measured at `225/60 R17` with all-terrain directional chevron pattern; vehicle track width `1,540 mm`. Consistent with compact crossover/SUV platform.
- **Environmental Context:** Heavy precipitation (14.2 mm/hr), ambient illuminance `0.38 lux` caused by Substation 4 circuit breaker trip (20:38 to 20:50 UTC). Wet asphalt puddle reflections produced specular glare.
- **Physical Recoveries:**
  - `Item #E-101`: Master Lock 65D severed shackle with yellow paint residue.
  - `Item #E-102`: Scorched plastic nano-SIM card ejector tray recovered 12m inside gate perimeter on gravel verge.
  - `Item #E-103`: Carbon copy shipping manifest `#SM-8841` (Consignment: Electronics Transshipment) disturbed in Bay 3 container row C-14.

---

## 3. DELIBERATELY INTRODUCED CONTRADICTIONS & INCONSISTENCIES
The dataset includes three deliberate discrepancies to evaluate the AI consistency checker:

1. **Incident Timing Discrepancy (45-Minute Divergence):**
   - *Witness Statement A (Marcus Vance):* Observes vehicle arrival at `20:30 UTC` (8:30 PM).
   - *Witness Statement B (Elena Rostova):* Hears metallic sounds and vehicle accelerating away at `21:15 UTC` (9:15 PM).
   - *Sensor A-417:* Alarms at `20:44:12 UTC`.
   - *Forensic Hypothesis:* 45-minute dwell time inside Warehouse Bay 3 between arrival and departure.

2. **Vehicle Classification & Paint Color Discrepancy:**
   - *Witness Statement A:* Reports an unfamiliar "silver sedan" parked facing north.
   - *Witness Statement B:* Emphatically reports a "dark grey SUV with roof rails".
   - *Physical Evidence:* Tire dimensions (`225/60 R17`, 1540mm track width) support SUV/crossover chassis. 0.38 lux low sodium lighting and heavy rain puddles likely caused color distortion.

3. **Egress Route & Orientation:**
   - *Statement A:* Parked facing North toward Maritime Avenue.
   - *Statement B:* Accelerating rapidly East toward Harbor Expressway on-ramp.

---

## 4. INCLUDED EVIDENCE FILES (15 ITEMS)
1. `FIR_001.pdf` – First Information Report by Harbor Police Patrol Unit Bravo-3.
2. `Witness_Statement_A.pdf` – Sworn interview of night security guard Marcus Vance.
3. `Witness_Statement_B.pdf` – Sworn interview of crane operator Elena Rostova.
4. `Investigation_Notes.txt` – Field log by Lead Det. Sarah Miller detailing physical exam and tire impressions.
5. `Incident_Report.pdf` – Port authority supervisory log with Substation 4 brownout records.
6. `Evidence_Inventory.docx` – Forensic chain-of-custody ledger for Items E-101 through E-103.
7. `Scene_Image_001.jpg` – Gate 4 severed lock bracket with metric scale bar.
8. `Scene_Image_002.jpg` – Muddy tire impressions near Pier 14 access road.
9. `CCTV_Frame_001.jpg` – Night infrared snapshot at 20:42:18 UTC showing vehicle silhouette.
10. `Vehicle_Image_001.jpg` – Roofline comparative analysis between sedan and SUV chassis.
11. `Witness_Audio_001.wav` – Recorded 911 dispatch radio transmission with transcript.
12. `Witness_Audio_002.wav` – Field dictaphone interview with Elena Rostova.
13. `Demo_CCTV.mp4` – Four-keyframe sampled CCTV sequence across intrusion window.
14. `Case_Summary.txt` – Supervisory case briefing by Capt. Raymond Vance.
15. `Investigator_Observations.txt` – Weather, ambient lux, and environmental forensics log.

---

## 5. RAG TEST SUITE (BENCHMARK QUERIES)
### Answerable Queries (Expected 100% Citation Grounding):
- *"What time is mentioned in the witness statements regarding the vehicle?"*
  - Expected: Mentions 20:30 UTC (Vance) and 21:15 UTC (Rostova) with exact citations.
- *"What type of tool was used to breach Gate 4?"*
  - Expected: Mechanical bolt cutters with yellow paint transfer, cutting Master Lock 65D.
- *"What physical items were recovered into evidence?"*
  - Expected: Item E-101 (shackle), E-102 (SIM tray), E-103 (manifest SM-8841).

### Unanswerable Queries (Mandatory Refusal – Zero Hallucination):
- *"Who is the suspect responsible for the break-in?"*
  - Expected Refusal: *"Information not found in the available case evidence."*
- *"Was a firearm or weapon recovered at the scene?"*
  - Expected Refusal: *"Information not found in the available case evidence."*
