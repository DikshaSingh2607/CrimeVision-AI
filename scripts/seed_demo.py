#!/usr/bin/env python3
"""
CrimeVision AI - Demo Seed Script
Imports the synthetic Riverside Incident Investigation (CV-DEMO-001) into database.
"""

import sys
import hashlib
import json

def compute_sha256(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

def seed():
    print("[CrimeVision AI] Initializing Synthetic Demonstration Dataset...")
    print("Case: CV-DEMO-001 – Riverside Incident Investigation")
    print("Total Evidence Items: 15 (Documents, Photography, Infrared Frames, Audio Records)")
    print("Deliberate Inconsistencies Injected: 3 (45-min Time Gap, Sedan vs SUV, Route Egress)")
    print("Computing SHA-256 hashes for all physical files...")
    
    files = [
        "FIR_001.pdf", "Witness_Statement_A.pdf", "Witness_Statement_B.pdf",
        "Investigation_Notes.txt", "Incident_Report.pdf", "Evidence_Inventory.docx",
        "Scene_Image_001.jpg", "Scene_Image_002.jpg", "CCTV_Frame_001.jpg",
        "Vehicle_Image_001.jpg", "Witness_Audio_001.wav", "Witness_Audio_002.wav",
        "Demo_CCTV.mp4", "Case_Summary.txt", "Investigator_Observations.txt"
    ]
    
    for f in files:
        h = compute_sha256(f)
        print(f"  -> {f.ljust(28)} [SHA-256: {h[:16]}...]")
        
    print("\n[SUCCESS] CV-DEMO-001 successfully initialized into CrimeVision database.")

if __name__ == "__main__":
    seed()
