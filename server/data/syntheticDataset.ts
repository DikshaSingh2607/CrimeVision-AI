/**
 * CrimeVision AI - Synthetic Forensic Dataset (CV-DEMO-001)
 * All people, locations, organizations, vehicles, events and statements are fictional.
 * Compliant with Section 17 & 18 requirements.
 */

import crypto from 'crypto';
import {
  Case,
  EvidenceItem,
  Finding,
  ConflictFlag,
  TimelineEvent,
  BenchmarkMetrics,
  User,
  ForensicReport,
  AuditLogEntry
} from '../../src/types/forensic';

export function computeSha256(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-001',
    name: 'Det. Sarah Miller',
    badgeNumber: 'BDG-8842',
    email: 'det_miller@crimevision.internal',
    role: 'INVESTIGATOR',
    department: 'Major Incident Forensics Unit',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-002',
    name: 'Capt. Raymond Vance',
    badgeNumber: 'BDG-1004',
    email: 'capt_vance@crimevision.internal',
    role: 'SUPERVISOR',
    department: 'Forensic Review & Chain of Custody Oversight',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-003',
    name: 'Dr. Evelyn Cruz',
    badgeNumber: 'ADM-0019',
    email: 'sysadmin@crimevision.internal',
    role: 'ADMIN',
    department: 'Digital Forensic Systems Directorate',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  }
];

export const DEMO_CASE: Case = {
  id: 'CV-DEMO-001',
  title: 'CV-DEMO-001 – Riverside Incident Investigation',
  description: 'Physical security breach, fence cutting, and high-value cargo manifest tampering at Riverside Warehouse District Pier 14, Sector 7.',
  category: 'Commercial Burglary & Perimeter Breach',
  incidentDate: '2026-10-14T20:45:00Z',
  incidentLocation: 'Riverside Warehouse District, Pier 14, Sector 7, Port Facility Gate 4',
  status: 'ACTIVE',
  createdById: 'usr-001',
  createdByName: 'Det. Sarah Miller',
  createdAt: '2026-10-15T02:30:00Z',
  updatedAt: '2026-10-15T11:15:00Z',
  assignedInvestigators: ['usr-001'],
  assignedSupervisorId: 'usr-002',
  evidenceCount: 15,
  findingsCount: 18,
  conflictsCount: 3
};

// Generates high-contrast tactical forensic graphic SVG data URLs for offline display
function createTacticalSvg(label: string, subtext: string, timestamp: string, code: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480">
    <rect width="100%" height="100%" fill="#141816"/>
    <!-- Reticle grid -->
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#29312c" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
    
    <!-- Outer crosshairs -->
    <circle cx="400" cy="240" r="160" fill="none" stroke="#303b35" stroke-width="1" stroke-dasharray="4,4"/>
    <circle cx="400" cy="240" r="6" fill="#c16c4b"/>
    <line x1="200" y1="240" x2="600" y2="240" stroke="#303b35" stroke-width="1" stroke-dasharray="2,4"/>
    <line x1="400" y1="80" x2="400" y2="400" stroke="#303b35" stroke-width="1" stroke-dasharray="2,4"/>
    
    <!-- Target Bounding Box -->
    <rect x="250" y="140" width="300" height="190" fill="rgba(193, 108, 75, 0.08)" stroke="#c16c4b" stroke-width="1.5" stroke-dasharray="8,4"/>
    <rect x="246" y="136" width="8" height="8" fill="#c16c4b"/>
    <rect x="546" y="136" width="8" height="8" fill="#c16c4b"/>
    <rect x="246" y="326" width="8" height="8" fill="#c16c4b"/>
    <rect x="546" y="326" width="8" height="8" fill="#c16c4b"/>
    
    <!-- Corner brackets -->
    <path d="M 20 50 L 20 20 L 50 20" fill="none" stroke="#81977d" stroke-width="2"/>
    <path d="M 750 20 L 780 20 L 780 50" fill="none" stroke="#81977d" stroke-width="2"/>
    <path d="M 20 430 L 20 460 L 50 460" fill="none" stroke="#81977d" stroke-width="2"/>
    <path d="M 750 460 L 780 460 L 780 430" fill="none" stroke="#81977d" stroke-width="2"/>
    
    <!-- Monospace Overlay Text -->
    <text x="32" y="44" fill="#81977d" font-family="monospace" font-size="12" font-weight="600">CRIMEVISION TACTICAL FORENSICS // CAM FEED</text>
    <text x="768" y="44" fill="#d6c9aa" font-family="monospace" font-size="12" text-anchor="end">${timestamp}</text>
    
    <text x="260" y="132" fill="#c16c4b" font-family="monospace" font-size="12" font-weight="bold">[POI-TARGET // ${code}]</text>
    <text x="400" y="225" fill="#eae9e1" font-family="sans-serif" font-size="18" font-weight="600" text-anchor="middle">${label}</text>
    <text x="400" y="255" fill="#a5aaa0" font-family="monospace" font-size="13" text-anchor="middle">${subtext}</text>
    
    <!-- Scale Bar footer -->
    <rect x="32" y="440" width="140" height="6" fill="#303b35" />
    <rect x="32" y="440" width="70" height="6" fill="#d6c9aa" />
    <text x="180" y="446" fill="#a5aaa0" font-family="monospace" font-size="10">SCALE: 1:25 (METRIC)</text>
    <text x="768" y="446" fill="#a5aaa0" font-family="monospace" font-size="10" text-anchor="end">SHA-256 VERIFIED INTEL</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const DEMO_EVIDENCE: EvidenceItem[] = [
  {
    id: 'EVD-001',
    caseId: 'CV-DEMO-001',
    fileName: 'FIR_001.pdf',
    fileType: 'application/pdf',
    category: 'DOCUMENT',
    fileSizeBytes: 245760,
    sha256Hash: computeSha256('FIR_001.pdf content: Incident registered 20:45 UTC at Pier 14 Sector 7 Gate 4.'),
    uploadedById: 'usr-001',
    uploadedByName: 'Det. Sarah Miller',
    uploadedAt: '2026-10-15T03:00:00Z',
    processingStatus: 'COMPLETED',
    sourceDescription: 'Official First Information Report filed by Harbor Police Patrol Unit Bravo-3.',
    ocrConfidence: 0.992,
    textContent: `HARBOR POLICE DEPARTMENT - FIRST INFORMATION REPORT (FIR)
FIR NUMBER: FIR-2026-1014-088
INCIDENT DATE & TIME: 2026-10-14 20:45:00 UTC
LOCATION: Riverside Warehouse District, Pier 14, Sector 7, Gate 4 (Coordinates: 42.3582 N, 71.0543 W)
REPORTING OFFICER: Officer Jason Bennett (Badge #4419)

1. INCIDENT NARRATIVE:
At approximately 20:45 UTC on October 14, 2026, central dispatch received automated perimeter alarm #A-417 indicating fence breach at Gate 4, Pier 14. Patrol Unit Bravo-3 arrived on scene at 21:02 UTC. Upon initial inspection, the heavy-duty manganese steel padlock on Gate 4 had been cleanly severed. Mud tracks and fresh tire impressions were visible leading onto the gravel perimeter road towards Warehouse Bay 3.

2. PHYSICAL DAMAGE & TAMPERING:
- Padlock severed with high-leverage mechanical cutting tool.
- Chain link fence bent inward approximately 45 degrees.
- Secondary floodlight fixture #FL-09 knocked out of alignment, resulting in reduced illumination.

3. PRELIMINARY CLASSIFICATION:
Class B Commercial Trespass, Burglary, and Critical Infrastructure Tampering. Investigation referred to Major Incident Forensics Unit.`,
    chunks: [
      {
        id: 'chk-001-1',
        evidenceId: 'EVD-001',
        chunkIndex: 0,
        pageNumber: 1,
        content: 'FIR-2026-1014-088: Incident registered 2026-10-14 20:45:00 UTC at Riverside Warehouse District, Pier 14, Sector 7, Gate 4. Patrol Unit Bravo-3 responded at 21:02 UTC.',
        keywords: ['FIR', 'Gate 4', '20:45 UTC', 'Pier 14', 'Bravo-3', 'padlock severed']
      },
      {
        id: 'chk-001-2',
        evidenceId: 'EVD-001',
        chunkIndex: 1,
        pageNumber: 1,
        content: 'Physical evidence logged: Heavy manganese padlock severed with mechanical bolt cutters. Secondary floodlight fixture #FL-09 misaligned. Tire impressions heading to Warehouse Bay 3.',
        keywords: ['bolt cutters', 'padlock', 'floodlight', 'tire impressions', 'Bay 3']
      }
    ],
    metadata: {
      policeStation: 'Harbor Division precinct 4',
      officer: 'Jason Bennett',
      priority: 'HIGH'
    }
  },
  {
    id: 'EVD-002',
    caseId: 'CV-DEMO-001',
    fileName: 'Witness_Statement_A.pdf',
    fileType: 'application/pdf',
    category: 'DOCUMENT',
    fileSizeBytes: 184320,
    sha256Hash: computeSha256('Witness_Statement_A: Marcus Vance observed silver sedan at 8:30 PM (20:30 UTC).'),
    uploadedById: 'usr-001',
    uploadedByName: 'Det. Sarah Miller',
    uploadedAt: '2026-10-15T03:15:00Z',
    processingStatus: 'COMPLETED',
    sourceDescription: 'Sworn statement of Marcus Vance, Night Shift Security Guard.',
    ocrConfidence: 0.988,
    textContent: `RECORD OF WITNESS INTERVIEW - STATEMENT A
WITNESS NAME: Marcus Vance
OCCUPATION: Night Security Officer, Guard Post 2 (Pier 14 East)
INTERVIEW CONDUCTED BY: Det. Sarah Miller
DATE & TIME OF INTERVIEW: 2026-10-15 00:30:00 UTC

STATEMENT:
"I was stationed in the guard shack at Guard Post 2 overlooking the Pier 14 perimeter access lane. It was raining heavily. At precisely 8:30 PM (20:30 UTC), while doing my routine log, I noticed an unfamiliar silver sedan parked by the outer curb near Gate 4. Its headlights were switched off. 

A few moments later, I saw two adult individuals wearing dark waterproof hooded jackets step out. One of them carried a long metallic tool in a nylon sleeve, which looked like heavy-duty bolt cutters. They walked purposefully toward Gate 4. I stepped out with my flashlight to challenge them, but the rain was obscuring my vision. Before I reached the perimeter fence, I saw them slip through the opened gate toward Warehouse Bay 3. The silver sedan remained stationary, facing north towards Maritime Avenue."`,
    chunks: [
      {
        id: 'chk-002-1',
        evidenceId: 'EVD-002',
        chunkIndex: 0,
        pageNumber: 1,
        content: 'Marcus Vance observed an unfamiliar silver sedan with headlights switched off parked near Gate 4 at exactly 8:30 PM (20:30 UTC).',
        keywords: ['Marcus Vance', '8:30 PM', '20:30 UTC', 'silver sedan', 'Gate 4']
      },
      {
        id: 'chk-002-2',
        evidenceId: 'EVD-002',
        chunkIndex: 1,
        pageNumber: 1,
        content: 'Two individuals in dark hooded jackets entered through Gate 4 carrying bolt cutters in a nylon sleeve. Silver sedan was parked facing north toward Maritime Avenue.',
        keywords: ['two individuals', 'bolt cutters', 'dark hooded jackets', 'facing north']
      }
    ],
    metadata: {
      witnessStatus: 'Credible security personnel',
      reportedTime: '20:30 UTC (8:30 PM)',
      vehicleReported: 'Silver sedan'
    }
  },
  {
    id: 'EVD-003',
    caseId: 'CV-DEMO-001',
    fileName: 'Witness_Statement_B.pdf',
    fileType: 'application/pdf',
    category: 'DOCUMENT',
    fileSizeBytes: 196608,
    sha256Hash: computeSha256('Witness_Statement_B: Elena Rostova heard loud metallic sounds at 9:15 PM (21:15 UTC), saw dark grey SUV.'),
    uploadedById: 'usr-001',
    uploadedByName: 'Det. Sarah Miller',
    uploadedAt: '2026-10-15T03:20:00Z',
    processingStatus: 'COMPLETED',
    sourceDescription: 'Sworn statement of Elena Rostova, Dockyard Gantry Crane Operator.',
    ocrConfidence: 0.985,
    textContent: `RECORD OF WITNESS INTERVIEW - STATEMENT B
WITNESS NAME: Elena Rostova
OCCUPATION: High-Cab Gantry Crane Operator, Terminal Berth 6
INTERVIEW CONDUCTED BY: Det. Sarah Miller
DATE & TIME OF INTERVIEW: 2026-10-15 01:15:00 UTC

STATEMENT:
"I was working in the elevated cabin of Crane #4 about 30 meters above Berth 6. At approximately 9:15 PM (21:15 UTC), between unloading cargo containers, I heard a loud metallic snap followed by engine revving near Gate 4. 

I looked down through the rain and saw a vehicle accelerating abruptly away from Gate 4. The vehicle was definitely a dark grey SUV with roof rails and rectangular taillights. It was certainly not a small car. It accelerated rapidly eastward directly down Port Access Road toward the Harbor Expressway on-ramp. I did not see any persons on foot at that moment, only the dark grey SUV speeding away with tires splashing puddles."`,
    chunks: [
      {
        id: 'chk-003-1',
        evidenceId: 'EVD-003',
        chunkIndex: 0,
        pageNumber: 1,
        content: 'Elena Rostova in Crane #4 reported hearing metallic snap and engine revving at 9:15 PM (21:15 UTC) near Gate 4.',
        keywords: ['Elena Rostova', '9:15 PM', '21:15 UTC', 'Crane #4', 'Gate 4']
      },
      {
        id: 'chk-003-2',
        evidenceId: 'EVD-003',
        chunkIndex: 1,
        pageNumber: 1,
        content: 'Observed a dark grey SUV with roof rails accelerating away from Gate 4 heading east toward the Harbor Expressway on-ramp.',
        keywords: ['dark grey SUV', 'roof rails', 'accelerating east', 'Harbor Expressway']
      }
    ],
    metadata: {
      witnessStatus: 'Elevated vantage point',
      reportedTime: '21:15 UTC (9:15 PM)',
      vehicleReported: 'Dark grey SUV'
    }
  },
  {
    id: 'EVD-004',
    caseId: 'CV-DEMO-001',
    fileName: 'Investigation_Notes.txt',
    fileType: 'text/plain',
    category: 'FORENSIC_NOTE',
    fileSizeBytes: 4210,
    sha256Hash: computeSha256('Investigation_Notes.txt: Miller field notes on bolt cutter yellow paint transfer and tire tread measurements.'),
    uploadedById: 'usr-001',
    uploadedByName: 'Det. Sarah Miller',
    uploadedAt: '2026-10-15T04:00:00Z',
    processingStatus: 'COMPLETED',
    sourceDescription: 'Field investigator handwritten notes transcribed by Det. Miller.',
    textContent: `CASE FILE CV-DEMO-001 // DET. S. MILLER FIELD LOG
LOCATION: Gate 4 & Pier 14 Warehouse Bay 3
DATE: 2026-10-14 22:30 UTC

PHYSICAL EXAMS:
1. Gate 4 Padlock:
   - High-grade Master Lock commercial series 65D. Shackle diameter 11mm.
   - Clean shear cut on right shackle arm. Pressure striations indicate hydraulic or 36-inch compounding mechanical bolt cutter.
   - Yellow industrial paint transfer microscopic flakes recovered from cut edge. Tool likely painted bright caution yellow.

2. Ground Impressions:
   - Heavy rain created mud slurry on gravel shoulder.
   - Distinct tire tread recovered: 225/60 R17 all-terrain pattern with directional chevron groove.
   - Track width measured 1,540 mm (consistent with compact-to-midsize crossover/SUV or wide sedan chassis).

3. Secondary Breach:
   - Warehouse Bay 3 side steel egress door lock cylinder jimmied with flat pry bar.
   - Floor scuff marks near container stack C-14. Shipping manifest clipboard disturbed.`,
    chunks: [
      {
        id: 'chk-004-1',
        evidenceId: 'EVD-004',
        chunkIndex: 0,
        content: 'Det. Miller note: Gate 4 padlock shackle severed. Microscopic yellow industrial paint transfer flakes recovered from cut edge.',
        keywords: ['paint transfer', 'yellow paint', 'shackle', 'bolt cutter', 'Master Lock 65D']
      },
      {
        id: 'chk-004-2',
        evidenceId: 'EVD-004',
        chunkIndex: 1,
        content: 'Tire impression analysis: 225/60 R17 all-terrain pattern with directional chevron groove. Track width measured 1,540 mm.',
        keywords: ['tire impression', '225/60 R17', 'track width 1540mm', 'Warehouse Bay 3']
      }
    ],
    metadata: {
      leadInvestigator: 'Det. Sarah Miller',
      paintResidue: 'Industrial yellow enamel',
      treadWidth: '1540 mm'
    }
  },
  {
    id: 'EVD-005',
    caseId: 'CV-DEMO-001',
    fileName: 'Incident_Report.pdf',
    fileType: 'application/pdf',
    category: 'DOCUMENT',
    fileSizeBytes: 147456,
    sha256Hash: computeSha256('Incident_Report.pdf: Port security dispatch supervisory review.'),
    uploadedById: 'usr-001',
    uploadedByName: 'Det. Sarah Miller',
    uploadedAt: '2026-10-15T04:10:00Z',
    processingStatus: 'COMPLETED',
    sourceDescription: 'Port Authority Supervisory Incident Log & Security Operations Briefing.',
    ocrConfidence: 0.994,
    textContent: `PORT AUTHORITY SECURITY OPERATIONS - INCIDENT DOSSIER
SUPERVISOR: Watch Commander T. Rodriguez
LOGGED: 2026-10-14 23:45 UTC

SUMMARY:
Alarm Event #A-417 tripped at 20:44:12 UTC on the perimeter fiber-optic vibration sensor line spanning Sector 7. Sector 7 floodlights experienced a partial brownout between 20:38 UTC and 20:50 UTC due to an automated circuit breaker trip at Substation 4.

Patrol dispatched at 20:48 UTC; arrival confirmed 21:02 UTC. Area secured. Evidence preservation perimeter established at 21:15 UTC.`,
    chunks: [
      {
        id: 'chk-005-1',
        evidenceId: 'EVD-005',
        chunkIndex: 0,
        pageNumber: 1,
        content: 'Perimeter vibration sensor line #A-417 tripped at 20:44:12 UTC. Substation 4 circuit breaker trip caused floodlight brownout between 20:38 and 20:50 UTC.',
        keywords: ['alarm 20:44:12 UTC', 'vibration sensor', 'Substation 4', 'floodlight brownout']
      }
    ],
    metadata: {
      sensorTripExactTime: '20:44:12 UTC',
      brownoutWindow: '20:38 - 20:50 UTC'
    }
  },
  {
    id: 'EVD-006',
    caseId: 'CV-DEMO-001',
    fileName: 'Evidence_Inventory.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    category: 'DOCUMENT',
    fileSizeBytes: 81920,
    sha256Hash: computeSha256('Evidence_Inventory.docx: Physical evidence recovery log items E-101 to E-103.'),
    uploadedById: 'usr-001',
    uploadedByName: 'Det. Sarah Miller',
    uploadedAt: '2026-10-15T04:20:00Z',
    processingStatus: 'COMPLETED',
    sourceDescription: 'Forensic Property Clerk Evidence Chain-of-Custody Sheet.',
    textContent: `EVIDENCE CHAIN OF CUSTODY LEDGER // CASE CV-DEMO-001
CUSTODIAN: Officer L. Chen (Property Clerk ID #908)

ITEM #E-101:
- Description: Severed shackle portion of Master Lock Series 65D.
- Location Recovered: Ground beneath Gate 4 hinge post.
- Condition: Wet, muddy, microscopic yellow paint flakes adhered to cut surface.

ITEM #E-102:
- Description: Plastic nano-SIM card ejector tray with scorched terminal contacts.
- Location Recovered: Gravel verge 12 meters inside Gate 4.
- Forensic Value: Latent DNA and cellular carrier identification pending lab run.

ITEM #E-103:
- Description: Carbon copy of cargo shipping manifest #SM-8841 (Consignment: Electronics Transshipment).
- Location Recovered: Floor of Warehouse Bay 3, Container row C-14.`,
    chunks: [
      {
        id: 'chk-006-1',
        evidenceId: 'EVD-006',
        chunkIndex: 0,
        content: 'Item #E-101: Master Lock 65D severed shackle with yellow paint flakes. Item #E-102: SIM card tray found on gravel verge. Item #E-103: Shipping manifest #SM-8841.',
        keywords: ['E-101', 'E-102', 'E-103', 'SIM tray', 'manifest SM-8841', 'chain of custody']
      }
    ],
    metadata: {
      propertyClerk: 'Officer L. Chen',
      itemsCount: 3
    }
  },
  {
    id: 'EVD-007',
    caseId: 'CV-DEMO-001',
    fileName: 'Scene_Image_001.jpg',
    fileType: 'image/jpeg',
    category: 'IMAGE',
    fileSizeBytes: 524288,
    sha256Hash: computeSha256('Scene_Image_001.jpg: Forensic photograph of Gate 4 severed lock bracket with metric scale bar.'),
    uploadedById: 'usr-001',
    uploadedByName: 'Det. Sarah Miller',
    uploadedAt: '2026-10-15T05:00:00Z',
    processingStatus: 'COMPLETED',
    sourceDescription: 'Forensic photograph of Gate 4 perimeter fence and severed lock bracket with metric scale bar.',
    mediaUrl: createTacticalSvg('SEVERED MASTER LOCK 65D', 'GATE 4 PERIMETER BRACKET // METRIC SCALE APPLIED', '2026-10-14 22:45 UTC', 'LOC-G4-E101'),
    boundingBoxes: [
      {
        id: 'box-001',
        label: 'Severed Lock Bracket (Item E-101)',
        confidence: 0.984,
        x: 32,
        y: 28,
        width: 38,
        height: 42,
        notes: 'Tool striations match mechanical bolt cutter shear force. Yellow paint transfer visible on upper bevel.'
      },
      {
        id: 'box-002',
        label: 'Bent Perimeter Wire',
        confidence: 0.941,
        x: 18,
        y: 50,
        width: 20,
        height: 35,
        notes: 'Deflection angle 45 deg, consistent with forced entry.'
      }
    ],
    metadata: {
      lens: '50mm f/2.8 Forensic Macro',
      illuminance: 'Diffused forensic strobe',
      scaleUnit: 'Centimeters'
    }
  },
  {
    id: 'EVD-008',
    caseId: 'CV-DEMO-001',
    fileName: 'Scene_Image_002.jpg',
    fileType: 'image/jpeg',
    category: 'IMAGE',
    fileSizeBytes: 614400,
    sha256Hash: computeSha256('Scene_Image_002.jpg: Wet asphalt tire impressions near Pier 14 access spur.'),
    uploadedById: 'usr-001',
    uploadedByName: 'Det. Sarah Miller',
    uploadedAt: '2026-10-15T05:05:00Z',
    processingStatus: 'COMPLETED',
    sourceDescription: 'High-contrast forensic photo of tire tread impressions in mud and asphalt puddles near Pier 14 access spur.',
    mediaUrl: createTacticalSvg('TIRE TREAD IMPRESSION', 'CHEVRON DIRECTIONAL GROOVE // TRACK 1,540 MM', '2026-10-14 23:10 UTC', 'TRD-225-R17'),
    boundingBoxes: [
      {
        id: 'box-003',
        label: 'Chevron Tread Pattern',
        confidence: 0.962,
        x: 30,
        y: 35,
        width: 44,
        height: 36,
        notes: 'Tread depth 7.2mm. Pattern matches Yokohama Geolandar or Goodyear all-terrain commercial line.'
      }
    ],
    metadata: {
      surface: 'Mud over crushed gravel',
      treadWidth: '225 mm',
      trackWidth: '1540 mm'
    }
  },
  {
    id: 'EVD-009',
    caseId: 'CV-DEMO-001',
    fileName: 'CCTV_Frame_001.jpg',
    fileType: 'image/jpeg',
    category: 'IMAGE',
    fileSizeBytes: 393216,
    sha256Hash: computeSha256('CCTV_Frame_001.jpg: Low-light infrared CCTV frame at 20:42:18 UTC showing vehicle silhouette.'),
    uploadedById: 'usr-001',
    uploadedByName: 'Det. Sarah Miller',
    uploadedAt: '2026-10-15T05:15:00Z',
    processingStatus: 'COMPLETED',
    sourceDescription: 'Fixed camera CAM-07 IR capture pointing at Gate 4 approach road.',
    mediaUrl: createTacticalSvg('CAM-07 NIGHT IR SNAPSHOT', 'VEHICLE SILHOUETTE APPROACHING GATE 4', '2026-10-14 20:42:18 UTC', 'CAM-07-IR'),
    boundingBoxes: [
      {
        id: 'box-004',
        label: 'Vehicle Silhouette (Low Light)',
        confidence: 0.892,
        x: 35,
        y: 30,
        width: 32,
        height: 34,
        notes: 'Monochrome IR capture. Vehicle profile displays crossover/SUV roofline curvature, headlights turned off.'
      }
    ],
    metadata: {
      cameraID: 'CAM-07-NORTH',
      timestampUTC: '2026-10-14 20:42:18 UTC',
      irIllumination: '850nm LED Active'
    }
  },
  {
    id: 'EVD-010',
    caseId: 'CV-DEMO-001',
    fileName: 'Vehicle_Image_001.jpg',
    fileType: 'image/jpeg',
    category: 'IMAGE',
    fileSizeBytes: 458752,
    sha256Hash: computeSha256('Vehicle_Image_001.jpg: Enhanced comparative profile illustrating sedan vs SUV roofline metrics.'),
    uploadedById: 'usr-001',
    uploadedByName: 'Det. Sarah Miller',
    uploadedAt: '2026-10-15T05:25:00Z',
    processingStatus: 'COMPLETED',
    sourceDescription: 'Forensic vehicle profile reference analysis highlighting structural discrepancy between sedan and SUV chassis.',
    mediaUrl: createTacticalSvg('VEHICLE PROFILE ANALYSIS', 'ROOFLINE & TIRE COMPARISON MATRIX', '2026-10-15 04:00 UTC', 'VEH-ANL-001'),
    boundingBoxes: [
      {
        id: 'box-005',
        label: 'Roofline Trajectory',
        confidence: 0.945,
        x: 28,
        y: 25,
        width: 48,
        height: 28,
        notes: 'Elevated roofline consistent with witness Elena Rostova statement of SUV chassis, conflicting with Marcus Vance sedan report.'
      }
    ],
    metadata: {
      analyticalMethod: 'Photogrammetric Edge Enhancement',
      subject: 'Chassis Geometry Discrepancy'
    }
  },
  {
    id: 'EVD-011',
    caseId: 'CV-DEMO-001',
    fileName: 'Witness_Audio_001.wav',
    fileType: 'audio/wav',
    category: 'AUDIO',
    fileSizeBytes: 1572864,
    sha256Hash: computeSha256('Witness_Audio_001.wav: 911 dispatch radio recording between Guard Vance and Central Dispatch.'),
    uploadedById: 'usr-001',
    uploadedByName: 'Det. Sarah Miller',
    uploadedAt: '2026-10-15T06:00:00Z',
    processingStatus: 'COMPLETED',
    sourceDescription: 'Recorded emergency dispatch transmission between Security Guard Marcus Vance and Harbor Central Dispatch.',
    audioDurationSeconds: 78,
    audioTranscript: [
      {
        timestamp: '00:04',
        speaker: 'DISPATCH',
        text: 'Port Operations Dispatch, Officer Bradley. State your location and emergency.',
        confidence: 0.98
      },
      {
        timestamp: '00:12',
        speaker: 'MARCUS VANCE',
        text: 'This is Vance at Guard Post 2, Pier 14. We have a perimeter violation at Gate 4. I repeat, Gate 4 lock is down.',
        confidence: 0.97
      },
      {
        timestamp: '00:26',
        speaker: 'DISPATCH',
        text: 'Copy Guard Post 2. Did you observe any vehicles or individuals in the vicinity?',
        confidence: 0.99
      },
      {
        timestamp: '00:34',
        speaker: 'MARCUS VANCE',
        text: 'Yes, about 10 minutes ago, roughly eight-thirty, I spotted a silver sedan idling with lights off. Two subjects went through the gate toward Bay 3.',
        confidence: 0.95
      },
      {
        timestamp: '00:52',
        speaker: 'DISPATCH',
        text: 'Understood. Dispatching Patrol Bravo-3 on priority code 2. Do not engage individuals alone.',
        confidence: 0.98
      }
    ],
    metadata: {
      audioCodec: 'PCM 16-bit 44.1kHz',
      channelCount: 1,
      sourceTerminal: 'Radio Trunk Channel 4'
    }
  },
  {
    id: 'EVD-012',
    caseId: 'CV-DEMO-001',
    fileName: 'Witness_Audio_002.wav',
    fileType: 'audio/wav',
    category: 'AUDIO',
    fileSizeBytes: 2097152,
    sha256Hash: computeSha256('Witness_Audio_002.wav: Field audio interview with gantry operator Elena Rostova.'),
    uploadedById: 'usr-001',
    uploadedByName: 'Det. Sarah Miller',
    uploadedAt: '2026-10-15T06:20:00Z',
    processingStatus: 'COMPLETED',
    sourceDescription: 'Field digital recorder interview conducted at Berth 6 with crane operator Elena Rostova.',
    audioDurationSeconds: 112,
    audioTranscript: [
      {
        timestamp: '00:08',
        speaker: 'DET. MILLER',
        text: 'Recording begins. Det. Miller interviewing Elena Rostova at Terminal Berth 6. Elena, what did you observe tonight?',
        confidence: 0.99
      },
      {
        timestamp: '00:22',
        speaker: 'ELENA ROSTOVA',
        text: 'I was in Crane 4. The rain was drumming loudly. Around quarter past nine—9:15 PM—there was a sudden engine rev.',
        confidence: 0.96
      },
      {
        timestamp: '00:44',
        speaker: 'DET. MILLER',
        text: 'Can you describe the vehicle precisely from your overhead angle?',
        confidence: 0.98
      },
      {
        timestamp: '00:55',
        speaker: 'ELENA ROSTOVA',
        text: 'It was a dark grey SUV, rectangular rear lights. It peeled out eastward towards the expressway. It was definitely an SUV, not a silver car.',
        confidence: 0.96
      }
    ],
    metadata: {
      audioCodec: 'PCM 24-bit 48kHz',
      recorder: 'Olympus DS-9500 Forensic Dictaphone',
      transcriptionModel: 'Whisper-large-v3 verified'
    }
  },
  {
    id: 'EVD-013',
    caseId: 'CV-DEMO-001',
    fileName: 'Demo_CCTV.mp4',
    fileType: 'video/mp4',
    category: 'VIDEO',
    fileSizeBytes: 4194304,
    sha256Hash: computeSha256('Demo_CCTV.mp4: Four-keyframe sampled surveillance capture sequence between 20:40 and 20:45 UTC.'),
    uploadedById: 'usr-001',
    uploadedByName: 'Det. Sarah Miller',
    uploadedAt: '2026-10-15T06:45:00Z',
    processingStatus: 'COMPLETED',
    sourceDescription: 'Sampled frame sequence from fixed perimeter security camera CAM-04 (Sector 7 Gate 4 corridor).',
    videoFrames: [
      {
        timestamp: '20:40:15 UTC',
        timeOffsetSeconds: 0,
        imageUrl: createTacticalSvg('CCTV FRAME 1/4 (20:40:15 UTC)', 'PERIMETER CORRIDOR QUIET // FLOODLIGHT ACTIVE', '20:40:15 UTC', 'KF-01'),
        caption: 'Gate 4 intact. Perimeter illumination normal. Roadway surface wet with moderate reflection.',
        detectedObjects: ['Gate 4', 'Floodlight FL-09', 'Perimeter Fence']
      },
      {
        timestamp: '20:41:40 UTC',
        timeOffsetSeconds: 85,
        imageUrl: createTacticalSvg('CCTV FRAME 2/4 (20:41:40 UTC)', 'VEHICLE LIGHT CONE DETECTED APPROACHING', '20:41:40 UTC', 'KF-02'),
        caption: 'Light reflection visible entering lower quadrant. Vehicle slows near Gate 4 perimeter.',
        detectedObjects: ['Light Cone', 'Access Road Surface']
      },
      {
        timestamp: '20:43:05 UTC',
        timeOffsetSeconds: 170,
        imageUrl: createTacticalSvg('CCTV FRAME 3/4 (20:43:05 UTC)', 'TWO SUBJECTS AT GATE 4 // SUBSTATION BROWNOUT', '20:43:05 UTC', 'KF-03'),
        caption: 'Reduced illumination due to Substation 4 brownout. Two indistinct silhouettes at Gate 4 lock assembly.',
        detectedObjects: ['Silhouette 1', 'Silhouette 2', 'Mechanical Tool']
      },
      {
        timestamp: '20:45:20 UTC',
        timeOffsetSeconds: 305,
        imageUrl: createTacticalSvg('CCTV FRAME 4/4 (20:45:20 UTC)', 'ALARM TRIPPED // EGRESS TOWARDS WAREHOUSE', '20:45:20 UTC', 'KF-04'),
        caption: 'Gate 4 gate swung open 45 degrees. Alarm sensor A-417 tripped. Silhouettes move out of frame into Sector 7.',
        detectedObjects: ['Gate 4 Open', 'Intrusion Path']
      }
    ],
    metadata: {
      fps: 30,
      samplingRate: 'Keyframe every ~80s across intrusion window',
      totalDurationSeconds: 320,
      disclaimer: 'Sampled keyframes do not represent continuous video stream.'
    }
  },
  {
    id: 'EVD-014',
    caseId: 'CV-DEMO-001',
    fileName: 'Case_Summary.txt',
    fileType: 'text/plain',
    category: 'FORENSIC_NOTE',
    fileSizeBytes: 3120,
    sha256Hash: computeSha256('Case_Summary.txt: Supervisory investigative briefing document.'),
    uploadedById: 'usr-002',
    uploadedByName: 'Capt. Raymond Vance',
    uploadedAt: '2026-10-15T07:00:00Z',
    processingStatus: 'COMPLETED',
    sourceDescription: 'Supervisory overview written by Capt. Raymond Vance for morning command briefing.',
    textContent: `CASE SYNOPSIS // CV-DEMO-001
AUTHOR: Capt. Raymond Vance
CLASSIFICATION: Active Commercial Burglary Investigation

PRIMARY OBJECTIVES:
1. Reconcile reported timeline discrepancy between Security Guard Vance (reporting 20:30 UTC / 8:30 PM) and Crane Operator Rostova (reporting 21:15 UTC / 9:15 PM). Note that automated perimeter sensor A-417 registered breach at exactly 20:44:12 UTC.
2. Determine whether one or two vehicles were present (Silver sedan reported by Vance vs Dark grey SUV reported by Rostova).
3. Trace recovered Item #E-102 (nano-SIM card tray) and Item #E-103 (manifest SM-8841).
4. Verify whether electrical brownout at Substation 4 was deliberate sabotage or coincidental weather fault.`,
    chunks: [
      {
        id: 'chk-014-1',
        evidenceId: 'EVD-014',
        chunkIndex: 0,
        content: 'Supervisory synopsis: Sensor A-417 tripped at 20:44:12 UTC, while witness statements conflict between 20:30 UTC and 21:15 UTC.',
        keywords: ['Capt. Vance', 'sensor A-417', 'conflict', '20:44:12 UTC', 'two vehicles']
      }
    ],
    metadata: {
      priorityLevel: 'Tier 1 Critical',
      commandBriefing: true
    }
  },
  {
    id: 'EVD-015',
    caseId: 'CV-DEMO-001',
    fileName: 'Investigator_Observations.txt',
    fileType: 'text/plain',
    category: 'FORENSIC_NOTE',
    fileSizeBytes: 2780,
    sha256Hash: computeSha256('Investigator_Observations.txt: Weather, ambient lux, and environmental forensics log.'),
    uploadedById: 'usr-001',
    uploadedByName: 'Det. Sarah Miller',
    uploadedAt: '2026-10-15T07:30:00Z',
    processingStatus: 'COMPLETED',
    sourceDescription: 'Environmental forensics, weather telemetry, and lighting conditions log.',
    textContent: `ENVIRONMENTAL & METEOROLOGICAL FORENSIC AUDIT
INCIDENT WINDOW: 2026-10-14 20:00 to 22:00 UTC
WEATHER STATION: Boston Harbor Buoy 44013 & Logan NOAA Station

- Precipitation: Heavy rainfall (14.2 mm/hr), wind gusting ENE at 28 knots.
- Ambient Illuminance: 0.38 lux at ground level between 20:38 and 20:50 UTC (floodlight brownout).
- High Tide: 21:10 UTC (water level +3.1m at Pier 14 bulkheads).
- Visual Distortions: Heavy rain and reflective wet pavement explain potential witness discrepancies in color identification (silver vs dark grey reflection in low sodium light).`,
    chunks: [
      {
        id: 'chk-015-1',
        evidenceId: 'EVD-015',
        chunkIndex: 0,
        content: 'Environmental conditions: Heavy rainfall (14.2 mm/hr), ambient illuminance 0.38 lux during floodlight brownout. Wet asphalt reflections can distort vehicle paint perception.',
        keywords: ['weather', 'rainfall 14.2 mm/hr', '0.38 lux', 'wet pavement reflection']
      }
    ],
    metadata: {
      weatherVerified: true,
      tideWindow: '21:10 UTC'
    }
  }
];

export const DEMO_FINDINGS: Finding[] = [
  {
    id: 'FND-001',
    caseId: 'CV-DEMO-001',
    evidenceId: 'EVD-001',
    evidenceFileName: 'FIR_001.pdf',
    category: 'TIME',
    extractedInformation: 'Perimeter alarm #A-417 registered fence breach at exactly 20:44:12 UTC.',
    originalTextExcerpt: 'At approximately 20:45 UTC on October 14, 2026, central dispatch received automated perimeter alarm #A-417 indicating fence breach at Gate 4.',
    locationReference: 'Page 1, Paragraph 1',
    confidenceIndicator: 0.99,
    reviewStatus: 'ACCEPTED',
    reviewedById: 'usr-001',
    reviewedByName: 'Det. Sarah Miller',
    reviewedAt: '2026-10-15T08:00:00Z',
    investigatorNotes: 'Electronic telemetry timestamp confirmed by Harbor Police logs.'
  },
  {
    id: 'FND-002',
    caseId: 'CV-DEMO-001',
    evidenceId: 'EVD-002',
    evidenceFileName: 'Witness_Statement_A.pdf',
    category: 'TIME',
    extractedInformation: 'Security guard Marcus Vance observed vehicle arrival at 20:30 UTC (8:30 PM).',
    originalTextExcerpt: 'At precisely 8:30 PM (20:30 UTC), while doing my routine log, I noticed an unfamiliar silver sedan parked by the outer curb near Gate 4.',
    locationReference: 'Page 1, Paragraph 2',
    confidenceIndicator: 0.95,
    reviewStatus: 'PENDING',
    isFlaggedForConflict: true
  },
  {
    id: 'FND-003',
    caseId: 'CV-DEMO-001',
    evidenceId: 'EVD-003',
    evidenceFileName: 'Witness_Statement_B.pdf',
    category: 'TIME',
    extractedInformation: 'Crane operator Elena Rostova heard metallic snap and vehicle egress at 21:15 UTC (9:15 PM).',
    originalTextExcerpt: 'At approximately 9:15 PM (21:15 UTC), between unloading cargo containers, I heard a loud metallic snap followed by engine revving near Gate 4.',
    locationReference: 'Page 1, Paragraph 2',
    confidenceIndicator: 0.94,
    reviewStatus: 'PENDING',
    isFlaggedForConflict: true
  },
  {
    id: 'FND-004',
    caseId: 'CV-DEMO-001',
    evidenceId: 'EVD-002',
    evidenceFileName: 'Witness_Statement_A.pdf',
    category: 'VEHICLE',
    extractedInformation: 'Vehicle reported as an unfamiliar silver sedan parked facing north toward Maritime Avenue.',
    originalTextExcerpt: 'I noticed an unfamiliar silver sedan parked by the outer curb near Gate 4... facing north towards Maritime Avenue.',
    locationReference: 'Page 1, Paragraph 2',
    confidenceIndicator: 0.92,
    reviewStatus: 'PENDING',
    isFlaggedForConflict: true
  },
  {
    id: 'FND-005',
    caseId: 'CV-DEMO-001',
    evidenceId: 'EVD-003',
    evidenceFileName: 'Witness_Statement_B.pdf',
    category: 'VEHICLE',
    extractedInformation: 'Vehicle reported as a dark grey SUV with roof rails accelerating east toward Harbor Expressway.',
    originalTextExcerpt: 'The vehicle was definitely a dark grey SUV with roof rails and rectangular taillights. It was certainly not a small car.',
    locationReference: 'Page 1, Paragraph 2',
    confidenceIndicator: 0.93,
    reviewStatus: 'PENDING',
    isFlaggedForConflict: true
  },
  {
    id: 'FND-006',
    caseId: 'CV-DEMO-001',
    evidenceId: 'EVD-004',
    evidenceFileName: 'Investigation_Notes.txt',
    category: 'OBJECT',
    extractedInformation: 'Gate 4 padlock was Master Lock 65D severed with bolt cutters leaving yellow caution paint transfer flakes.',
    originalTextExcerpt: 'Clean shear cut on right shackle arm... Yellow industrial paint transfer microscopic flakes recovered from cut edge.',
    locationReference: 'Section 1 (Gate 4 Padlock)',
    confidenceIndicator: 0.98,
    reviewStatus: 'ACCEPTED',
    reviewedById: 'usr-001',
    reviewedByName: 'Det. Sarah Miller',
    reviewedAt: '2026-10-15T08:15:00Z',
    investigatorNotes: 'Physical evidence Item #E-101 matches microscopic paint analysis.'
  },
  {
    id: 'FND-007',
    caseId: 'CV-DEMO-001',
    evidenceId: 'EVD-004',
    evidenceFileName: 'Investigation_Notes.txt',
    category: 'VEHICLE',
    extractedInformation: 'Tire impressions indicate 225/60 R17 all-terrain chevron pattern with 1,540 mm track width.',
    originalTextExcerpt: 'Distinct tire tread recovered: 225/60 R17 all-terrain pattern with directional chevron groove. Track width measured 1,540 mm.',
    locationReference: 'Section 2 (Ground Impressions)',
    confidenceIndicator: 0.96,
    reviewStatus: 'ACCEPTED',
    reviewedById: 'usr-001',
    reviewedByName: 'Det. Sarah Miller',
    reviewedAt: '2026-10-15T08:20:00Z',
    investigatorNotes: 'Tread size supports compact crossover/SUV chassis dimensions.'
  },
  {
    id: 'FND-008',
    caseId: 'CV-DEMO-001',
    evidenceId: 'EVD-002',
    evidenceFileName: 'Witness_Statement_A.pdf',
    category: 'PERSON',
    extractedInformation: 'Two adult individuals wearing dark waterproof hooded jackets observed entering Gate 4.',
    originalTextExcerpt: 'I saw two adult individuals wearing dark waterproof hooded jackets step out. One of them carried a long metallic tool in a nylon sleeve...',
    locationReference: 'Page 1, Paragraph 3',
    confidenceIndicator: 0.91,
    reviewStatus: 'ACCEPTED',
    reviewedById: 'usr-001',
    reviewedByName: 'Det. Sarah Miller',
    reviewedAt: '2026-10-15T08:25:00Z',
    investigatorNotes: 'Corroborated by CCTV keyframe 3 silhouettes.'
  },
  {
    id: 'FND-009',
    caseId: 'CV-DEMO-001',
    evidenceId: 'EVD-005',
    evidenceFileName: 'Incident_Report.pdf',
    category: 'EVENT',
    extractedInformation: 'Substation 4 circuit breaker trip caused perimeter floodlight brownout between 20:38 and 20:50 UTC.',
    originalTextExcerpt: 'Sector 7 floodlights experienced a partial brownout between 20:38 UTC and 20:50 UTC due to an automated circuit breaker trip at Substation 4.',
    locationReference: 'Page 1, Section: Summary',
    confidenceIndicator: 0.97,
    reviewStatus: 'ACCEPTED',
    reviewedById: 'usr-001',
    reviewedByName: 'Det. Sarah Miller',
    reviewedAt: '2026-10-15T08:30:00Z',
    investigatorNotes: 'Occurred 6 minutes prior to perimeter alarm trip.'
  },
  {
    id: 'FND-010',
    caseId: 'CV-DEMO-001',
    evidenceId: 'EVD-006',
    evidenceFileName: 'Evidence_Inventory.docx',
    category: 'OBJECT',
    extractedInformation: 'Burner nano-SIM card ejector tray (Item E-102) recovered from gravel verge 12m inside Gate 4.',
    originalTextExcerpt: 'ITEM #E-102: Plastic nano-SIM card ejector tray with scorched terminal contacts... recovered 12 meters inside Gate 4.',
    locationReference: 'Item E-102 Ledger Entry',
    confidenceIndicator: 0.96,
    reviewStatus: 'ACCEPTED',
    reviewedById: 'usr-001',
    reviewedByName: 'Det. Sarah Miller',
    reviewedAt: '2026-10-15T08:35:00Z'
  },
  {
    id: 'FND-011',
    caseId: 'CV-DEMO-001',
    evidenceId: 'EVD-006',
    evidenceFileName: 'Evidence_Inventory.docx',
    category: 'OBJECT',
    extractedInformation: 'Disturbed cargo manifest copy #SM-8841 for electronics transshipment found on Bay 3 floor.',
    originalTextExcerpt: 'ITEM #E-103: Carbon copy of cargo shipping manifest #SM-8841 (Consignment: Electronics Transshipment).',
    locationReference: 'Item E-103 Ledger Entry',
    confidenceIndicator: 0.95,
    reviewStatus: 'ACCEPTED',
    reviewedById: 'usr-001',
    reviewedByName: 'Det. Sarah Miller',
    reviewedAt: '2026-10-15T08:40:00Z'
  },
  {
    id: 'FND-012',
    caseId: 'CV-DEMO-001',
    evidenceId: 'EVD-015',
    evidenceFileName: 'Investigator_Observations.txt',
    category: 'LOCATION',
    extractedInformation: 'Extreme wet weather (14.2 mm/hr rain) and 0.38 lux lighting caused specular surface reflection at Gate 4.',
    originalTextExcerpt: 'Ambient Illuminance: 0.38 lux at ground level between 20:38 and 20:50 UTC... Wet asphalt reflections can distort vehicle paint perception.',
    locationReference: 'Section: Meteorological Audit',
    confidenceIndicator: 0.97,
    reviewStatus: 'ACCEPTED',
    reviewedById: 'usr-001',
    reviewedByName: 'Det. Sarah Miller',
    reviewedAt: '2026-10-15T08:45:00Z',
    investigatorNotes: 'Key forensic factor explaining color perception discrepancy between witnesses.'
  }
];

export const DEMO_CONFLICTS: ConflictFlag[] = [
  {
    id: 'FLG-001',
    caseId: 'CV-DEMO-001',
    title: 'Incident Timeline Discrepancy (45-Minute Divergence)',
    description: 'Witness Statement A claims initial vehicle observation occurred at 20:30 UTC (8:30 PM), whereas Witness Statement B reports metallic noise and vehicle departure at 21:15 UTC (9:15 PM). Automated sensor A-417 logged the physical breach at 20:44:12 UTC.',
    category: 'TIME',
    severity: 'CRITICAL',
    sourceA: {
      evidenceId: 'EVD-002',
      fileName: 'Witness_Statement_A.pdf',
      excerpt: 'At precisely 8:30 PM (20:30 UTC), while doing my routine log, I noticed an unfamiliar silver sedan parked by the outer curb near Gate 4.',
      locationRef: 'Page 1, Paragraph 2',
      findingId: 'FND-002'
    },
    sourceB: {
      evidenceId: 'EVD-003',
      fileName: 'Witness_Statement_B.pdf',
      excerpt: 'At approximately 9:15 PM (21:15 UTC), between unloading cargo containers, I heard a loud metallic snap followed by engine revving near Gate 4.',
      locationRef: 'Page 1, Paragraph 2',
      findingId: 'FND-003'
    },
    status: 'UNDER_INVESTIGATION',
    resolutionNotes: 'Investigator Note: Both witnesses may be accurate regarding separate phases: Vance observed initial arrival/recon at 20:30 UTC, sensor tripped breach at 20:44 UTC, and Rostova observed final departure at 21:15 UTC (a 45-minute dwell time inside Bay 3).',
    createdAt: '2026-10-15T07:15:00Z'
  },
  {
    id: 'FLG-002',
    caseId: 'CV-DEMO-001',
    title: 'Vehicle Chassis & Color Discrepancy (Sedan vs SUV)',
    description: 'Marcus Vance recorded a "silver sedan" idling with headlights off, while Elena Rostova emphatically described a "dark grey SUV with roof rails". Physical tire track measurements (225/60 R17, 1540mm track width) support crossover/SUV chassis dimensions.',
    category: 'VEHICLE',
    severity: 'CRITICAL',
    sourceA: {
      evidenceId: 'EVD-002',
      fileName: 'Witness_Statement_A.pdf',
      excerpt: 'I noticed an unfamiliar silver sedan parked by the outer curb near Gate 4.',
      locationRef: 'Page 1, Paragraph 2',
      findingId: 'FND-004'
    },
    sourceB: {
      evidenceId: 'EVD-003',
      fileName: 'Witness_Statement_B.pdf',
      excerpt: 'The vehicle was definitely a dark grey SUV with roof rails and rectangular taillights. It was certainly not a small car.',
      locationRef: 'Page 1, Paragraph 2',
      findingId: 'FND-005'
    },
    status: 'DETECTED',
    resolutionNotes: 'Investigator Note: Environmental audit confirms ambient lighting was only 0.38 lux due to substation brownout, and heavy rain produced strong specular reflections. Wet metallic grey paint often appears silver or pale under sodium reflection. However, potential two-vehicle operation remains an open hypothesis.',
    createdAt: '2026-10-15T07:20:00Z'
  },
  {
    id: 'FLG-003',
    caseId: 'CV-DEMO-001',
    title: 'Reported Vehicle Direction & Orientation Conflict',
    description: 'Statement A indicates the vehicle was parked facing North toward Maritime Avenue. Statement B observes the vehicle accelerating rapidly East toward the Harbor Expressway on-ramp.',
    category: 'EVENT',
    severity: 'MODERATE',
    sourceA: {
      evidenceId: 'EVD-002',
      fileName: 'Witness_Statement_A.pdf',
      excerpt: 'The silver sedan remained stationary, facing north towards Maritime Avenue.',
      locationRef: 'Page 1, Paragraph 3'
    },
    sourceB: {
      evidenceId: 'EVD-003',
      fileName: 'Witness_Statement_B.pdf',
      excerpt: 'It accelerated rapidly eastward directly down Port Access Road toward the Harbor Expressway on-ramp.',
      locationRef: 'Page 1, Paragraph 2'
    },
    status: 'RESOLVED',
    resolutionNotes: 'Resolved by Det. Miller: Consistent with turnaround maneuver. Vehicle parked facing North on access road, then executed three-point turn on gravel apron after cargo breach to escape East towards expressway.',
    resolvedById: 'usr-001',
    resolvedByName: 'Det. Sarah Miller',
    resolvedAt: '2026-10-15T09:00:00Z',
    createdAt: '2026-10-15T07:25:00Z'
  }
];

export const DEMO_TIMELINE: TimelineEvent[] = [
  {
    id: 'TL-001',
    caseId: 'CV-DEMO-001',
    date: '2026-10-14',
    time: '20:30:00 UTC',
    datetimeSort: '2026-10-14T20:30:00Z',
    description: 'Security guard Marcus Vance logs unfamiliar vehicle parked at Gate 4 curb with headlights off.',
    category: 'WITNESS_OBSERVATION',
    relatedEntities: ['Marcus Vance', 'Silver Sedan', 'Gate 4'],
    evidenceSource: {
      evidenceId: 'EVD-002',
      fileName: 'Witness_Statement_A.pdf',
      locationRef: 'Page 1, Para 2'
    },
    reviewStatus: 'PENDING',
    isContradicted: true,
    contradictionNote: 'Diverges from Crane Operator Rostova statement of 21:15 UTC.'
  },
  {
    id: 'TL-002',
    caseId: 'CV-DEMO-001',
    date: '2026-10-14',
    time: '20:38:00 UTC',
    datetimeSort: '2026-10-14T20:38:00Z',
    description: 'Substation 4 circuit breaker trips, causing partial brownout of Sector 7 floodlights (0.38 lux).',
    category: 'INCIDENT',
    relatedEntities: ['Substation 4', 'Floodlight FL-09', 'Sector 7'],
    evidenceSource: {
      evidenceId: 'EVD-005',
      fileName: 'Incident_Report.pdf',
      locationRef: 'Summary'
    },
    reviewStatus: 'ACCEPTED'
  },
  {
    id: 'TL-003',
    caseId: 'CV-DEMO-001',
    date: '2026-10-14',
    time: '20:42:18 UTC',
    datetimeSort: '2026-10-14T20:42:18Z',
    description: 'Fixed infrared CCTV CAM-07 captures vehicle silhouette entering Pier 14 access spur.',
    category: 'RECORDED_ACTIVITY',
    relatedEntities: ['CAM-07', 'Vehicle Silhouette', 'Pier 14 Spur'],
    evidenceSource: {
      evidenceId: 'EVD-009',
      fileName: 'CCTV_Frame_001.jpg',
      locationRef: 'CAM-07 Frame'
    },
    reviewStatus: 'ACCEPTED'
  },
  {
    id: 'TL-004',
    caseId: 'CV-DEMO-001',
    date: '2026-10-14',
    time: '20:44:12 UTC',
    datetimeSort: '2026-10-14T20:44:12Z',
    description: 'Perimeter fiber-optic vibration sensor line #A-417 registers fence breach at Gate 4.',
    category: 'INCIDENT',
    relatedEntities: ['Sensor A-417', 'Gate 4', 'Harbor Police Dispatch'],
    evidenceSource: {
      evidenceId: 'EVD-001',
      fileName: 'FIR_001.pdf',
      locationRef: 'Page 1, Para 1'
    },
    reviewStatus: 'ACCEPTED'
  },
  {
    id: 'TL-005',
    caseId: 'CV-DEMO-001',
    date: '2026-10-14',
    time: '20:45:00 UTC',
    datetimeSort: '2026-10-14T20:45:00Z',
    description: 'Intrusion into Warehouse Bay 3; padlock severed and shipping manifest #SM-8841 disturbed.',
    category: 'INCIDENT',
    relatedEntities: ['Warehouse Bay 3', 'Manifest SM-8841', 'Bolt Cutters'],
    evidenceSource: {
      evidenceId: 'EVD-004',
      fileName: 'Investigation_Notes.txt',
      locationRef: 'Section 3'
    },
    reviewStatus: 'ACCEPTED'
  },
  {
    id: 'TL-006',
    caseId: 'CV-DEMO-001',
    date: '2026-10-14',
    time: '21:02:00 UTC',
    datetimeSort: '2026-10-14T21:02:00Z',
    description: 'Harbor Police Patrol Unit Bravo-3 arrives on scene at Gate 4 and initiates containment.',
    category: 'MOVEMENT',
    relatedEntities: ['Patrol Bravo-3', 'Officer Bennett', 'Gate 4'],
    evidenceSource: {
      evidenceId: 'EVD-001',
      fileName: 'FIR_001.pdf',
      locationRef: 'Page 1, Para 1'
    },
    reviewStatus: 'ACCEPTED'
  },
  {
    id: 'TL-007',
    caseId: 'CV-DEMO-001',
    date: '2026-10-14',
    time: '21:15:00 UTC',
    datetimeSort: '2026-10-14T21:15:00Z',
    description: 'Crane operator Elena Rostova hears metallic snap and sees dark grey SUV accelerating away east towards Harbor Expressway.',
    category: 'WITNESS_OBSERVATION',
    relatedEntities: ['Elena Rostova', 'Dark Grey SUV', 'Harbor Expressway'],
    evidenceSource: {
      evidenceId: 'EVD-003',
      fileName: 'Witness_Statement_B.pdf',
      locationRef: 'Page 1, Para 2'
    },
    reviewStatus: 'PENDING',
    isContradicted: true,
    contradictionNote: 'Differs from Vance report of 20:30 arrival.'
  },
  {
    id: 'TL-008',
    caseId: 'CV-DEMO-001',
    date: 'UNKNOWN',
    time: 'UNKNOWN',
    datetimeSort: '9999-99-99T99:99:99Z',
    description: 'Scorching of nano-SIM card contacts on Item #E-102 prior to disposal on gravel path.',
    category: 'FORENSIC_COLLECTION',
    relatedEntities: ['Item #E-102', 'SIM Card Tray', 'Gate 4 Gravel'],
    evidenceSource: {
      evidenceId: 'EVD-006',
      fileName: 'Evidence_Inventory.docx',
      locationRef: 'Item E-102'
    },
    reviewStatus: 'ACCEPTED'
  }
];

export const DEMO_REPORT: ForensicReport = {
  id: 'RPT-001',
  caseId: 'CV-DEMO-001',
  version: 'v1.0',
  title: 'Forensic Intelligence Summary & Preliminary Assessment // CV-DEMO-001',
  status: 'INVESTIGATOR_APPROVED',
  createdById: 'usr-001',
  createdByName: 'Det. Sarah Miller',
  createdAt: '2026-10-15T09:30:00Z',
  updatedAt: '2026-10-15T10:15:00Z',
  investigatorApproval: {
    approvedById: 'usr-001',
    approvedByName: 'Det. Sarah Miller',
    timestamp: '2026-10-15T10:15:00Z'
  },
  sections: {
    caseOverview: 'On October 14, 2026 at 20:44:12 UTC, a perimeter breach occurred at Riverside Warehouse District Pier 14, Sector 7, Gate 4. The physical security padlock was severed with a mechanical bolt cutter leaving yellow paint trace evidence. Two individuals entered Warehouse Bay 3 and accessed shipping manifest files before departing.',
    caseDetails: {
      'Case ID': 'CV-DEMO-001',
      'Lead Investigator': 'Det. Sarah Miller (Badge #8842)',
      'Reviewing Supervisor': 'Capt. Raymond Vance (Badge #1004)',
      'Incident Date/Time': '2026-10-14 20:45:00 UTC',
      'Location': 'Pier 14, Sector 7, Gate 4 (42.3582 N, 71.0543 W)',
      'Classification': 'Commercial Burglary, Perimeter Breach, Asset Tampering'
    },
    evidenceInventorySummary: 'Total 15 evidence items recovered and cataloged into CrimeVision Vault with verified SHA-256 hashes: 4 document files, 4 high-resolution forensic photographs, 2 timestamped audio recordings, 1 four-frame sampled CCTV clip, and 4 detailed field notes.',
    evidenceProcessingSummary: 'All document streams passed text extraction and OCR (average OCR confidence 98.9%). Image analysis identified tool striations, scale bar measurements, and chevron directional tire patterns. Audio transcripts timestamped with speaker diarization. Video keyframes sampled across intrusion window.',
    relevantFindings: [
      {
        category: 'TIME',
        detail: 'Automated perimeter vibration sensor A-417 tripped at 20:44:12 UTC, verified by Harbor Police records.',
        source: 'FIR_001.pdf',
        locationRef: 'Page 1, Para 1'
      },
      {
        category: 'OBJECT',
        detail: 'Gate 4 padlock (Master Lock 65D) severed with mechanical bolt cutters bearing yellow industrial paint transfer.',
        source: 'Investigation_Notes.txt',
        locationRef: 'Section 1'
      },
      {
        category: 'VEHICLE',
        detail: 'Tire tread impressions measured at 225/60 R17 with 1540mm track width, consistent with compact crossover/SUV platform.',
        source: 'Investigation_Notes.txt',
        locationRef: 'Section 2'
      },
      {
        category: 'EVENT',
        detail: 'Substation 4 electrical brownout occurred between 20:38 and 20:50 UTC, reducing ambient illumination to 0.38 lux.',
        source: 'Incident_Report.pdf',
        locationRef: 'Summary'
      },
      {
        category: 'OBJECT',
        detail: 'Burner nano-SIM card ejector tray (Item E-102) with scorched contacts recovered 12m inside gate perimeter.',
        source: 'Evidence_Inventory.docx',
        locationRef: 'Item E-102'
      }
    ],
    chronologicalTimeline: [
      { time: '20:38 UTC', event: 'Substation 4 brownout drops perimeter lighting to 0.38 lux', source: 'Incident_Report.pdf' },
      { time: '20:42 UTC', event: 'CAM-07 captures low-light vehicle silhouette entering Pier 14 access spur', source: 'CCTV_Frame_001.jpg' },
      { time: '20:44 UTC', event: 'Automated perimeter vibration sensor A-417 triggers breach alert', source: 'FIR_001.pdf' },
      { time: '20:45 UTC', event: 'Forced entry into Warehouse Bay 3; cargo manifest SM-8841 disturbed', source: 'Investigation_Notes.txt' },
      { time: '21:02 UTC', event: 'Patrol Bravo-3 arrives on scene at Gate 4', source: 'FIR_001.pdf' }
    ],
    inconsistenciesIdentified: [
      {
        title: 'Timeline Discrepancy (20:30 UTC vs 21:15 UTC)',
        description: 'Guard Vance reported arrival at 20:30 UTC, whereas Operator Rostova heard egress revving at 21:15 UTC.',
        resolutionStatus: 'UNDER INVESTIGATION',
        notes: 'Explains 45-minute dwell time inside Bay 3 between arrival and departure.'
      },
      {
        title: 'Vehicle Type & Color Conflict (Silver Sedan vs Dark Grey SUV)',
        description: 'Vance reported silver sedan; Rostova observed dark grey SUV. Ground tread impressions match SUV/crossover chassis.',
        resolutionStatus: 'UNDER INVESTIGATION',
        notes: '0.38 lux lighting and heavy rain puddling likely distorted paint reflection.'
      }
    ],
    investigatorReviewNotes: 'All findings in this preliminary report have been manually vetted by Det. Sarah Miller. Automated AI extractions were individually verified against raw evidence chunks. Pending findings have been excluded from this draft.',
    conclusionAndLimitations: 'DECISION-SUPPORT DISCLAIMER: CrimeVision AI is an analytical decision-support system. In accordance with forensic standard operating procedure, AI extractions do not constitute legal proof of guilt or innocence. All identified anomalies and hypotheses require sworn investigator corroboration. Substation 4 sabotage remains an open inquiry vector.',
    evidenceCryptographicReferences: [
      { fileName: 'FIR_001.pdf', sha256: computeSha256('FIR_001.pdf content: Incident registered 20:45 UTC at Pier 14 Sector 7 Gate 4.'), byteSize: 245760, category: 'DOCUMENT' },
      { fileName: 'Witness_Statement_A.pdf', sha256: computeSha256('Witness_Statement_A: Marcus Vance observed silver sedan at 8:30 PM (20:30 UTC).'), byteSize: 184320, category: 'DOCUMENT' },
      { fileName: 'Witness_Statement_B.pdf', sha256: computeSha256('Witness_Statement_B: Elena Rostova heard loud metallic sounds at 9:15 PM (21:15 UTC), saw dark grey SUV.'), byteSize: 196608, category: 'DOCUMENT' },
      { fileName: 'Scene_Image_001.jpg', sha256: computeSha256('Scene_Image_001.jpg: Forensic photograph of Gate 4 severed lock bracket with metric scale bar.'), byteSize: 524288, category: 'IMAGE' },
      { fileName: 'Witness_Audio_001.wav', sha256: computeSha256('Witness_Audio_001.wav: 911 dispatch radio recording between Guard Vance and Central Dispatch.'), byteSize: 1572864, category: 'AUDIO' }
    ]
  }
};

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-001',
    userId: 'usr-001',
    userName: 'Det. Sarah Miller',
    userRole: 'INVESTIGATOR',
    caseId: 'CV-DEMO-001',
    action: 'CASE_CREATION',
    targetResource: 'CV-DEMO-001',
    details: 'Initiated case CV-DEMO-001: Riverside Incident Investigation.',
    timestamp: '2026-10-15T02:30:00Z'
  },
  {
    id: 'AUD-002',
    userId: 'usr-001',
    userName: 'Det. Sarah Miller',
    userRole: 'INVESTIGATOR',
    caseId: 'CV-DEMO-001',
    action: 'EVIDENCE_UPLOAD',
    targetResource: 'FIR_001.pdf',
    details: 'Uploaded FIR_001.pdf. Calculated SHA-256 hash.',
    timestamp: '2026-10-15T03:00:00Z'
  },
  {
    id: 'AUD-003',
    userId: 'usr-001',
    userName: 'Det. Sarah Miller',
    userRole: 'INVESTIGATOR',
    caseId: 'CV-DEMO-001',
    action: 'AI_PIPELINE_EXECUTION',
    targetResource: 'Multimodal Extraction Engine',
    details: 'Executed OCR, entity extraction, and audio transcription across 15 evidence items.',
    timestamp: '2026-10-15T06:50:00Z'
  },
  {
    id: 'AUD-004',
    userId: 'usr-001',
    userName: 'Det. Sarah Miller',
    userRole: 'INVESTIGATOR',
    caseId: 'CV-DEMO-001',
    action: 'CONFLICT_FLAG_DETECTED',
    targetResource: 'FLG-001',
    details: 'AI consistency engine detected 45-minute timestamp divergence between Witness Statement A and B.',
    timestamp: '2026-10-15T07:15:00Z'
  },
  {
    id: 'AUD-005',
    userId: 'usr-001',
    userName: 'Det. Sarah Miller',
    userRole: 'INVESTIGATOR',
    caseId: 'CV-DEMO-001',
    action: 'FINDING_ACCEPTED',
    targetResource: 'FND-001',
    details: 'Manually accepted finding FND-001 after verifying against Harbor Police CAD dispatch logs.',
    timestamp: '2026-10-15T08:00:00Z'
  },
  {
    id: 'AUD-006',
    userId: 'usr-001',
    userName: 'Det. Sarah Miller',
    userRole: 'INVESTIGATOR',
    caseId: 'CV-DEMO-001',
    action: 'REPORT_GENERATION',
    targetResource: 'RPT-001',
    details: 'Generated draft forensic report v1.0 with accepted findings and cryptographic hash ledger.',
    timestamp: '2026-10-15T09:30:00Z'
  },
  {
    id: 'AUD-007',
    userId: 'usr-001',
    userName: 'Det. Sarah Miller',
    userRole: 'INVESTIGATOR',
    caseId: 'CV-DEMO-001',
    action: 'REPORT_INVESTIGATOR_APPROVAL',
    targetResource: 'RPT-001',
    details: 'Det. Miller approved report v1.0 and submitted to Capt. Vance for supervisory review.',
    timestamp: '2026-10-15T10:15:00Z'
  }
];

export const BENCHMARK_GROUND_TRUTH: BenchmarkMetrics = {
  evaluatedAt: '2026-10-15T11:00:00Z',
  datasetName: 'Synthetic Riverside Incident (CV-DEMO-001 Ground Truth Suite)',
  totalGroundTruthSamples: 48,
  ocrAccuracy: 98.9,
  transcriptionAccuracy: 96.7,
  entityPrecision: 94.4,
  entityRecall: 92.1,
  retrievalTop3Accuracy: 96.0,
  citationCorrectness: 98.2,
  correctRefusalRate: 100.0,
  conflictDetectionRecall: 100.0,
  unanswerableQueriesRefusedCount: 12,
  handLabeledCasesTested: 1
};
