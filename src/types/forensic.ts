/**
 * CrimeVision AI - Core TypeScript Types & Data Schemas
 * Obsidian & Oxide Forensic Workspace
 */

export type UserRole = 'INVESTIGATOR' | 'SUPERVISOR' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  badgeNumber: string;
  email: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
}

export type CaseStatus = 'ACTIVE' | 'UNDER_REVIEW' | 'PENDING_SUPERVISOR' | 'CLOSED' | 'ARCHIVED';

export interface Case {
  id: string; // e.g. CV-DEMO-001
  title: string;
  description: string;
  category: string;
  incidentDate: string; // ISO UTC
  incidentLocation: string;
  status: CaseStatus;
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  assignedInvestigators: string[];
  assignedSupervisorId?: string;
  evidenceCount: number;
  findingsCount: number;
  conflictsCount: number;
}

export type EvidenceType = 'DOCUMENT' | 'IMAGE' | 'AUDIO' | 'VIDEO' | 'FORENSIC_NOTE';
export type ProcessingStatus = 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface EvidenceChunk {
  id: string;
  evidenceId: string;
  chunkIndex: number;
  pageNumber?: number;
  timestampOffset?: string; // e.g. "01:24"
  content: string;
  keywords: string[];
}

export interface BoundingBox {
  id: string;
  label: string;
  confidence: number;
  x: number; // percentage 0-100
  y: number;
  width: number;
  height: number;
  notes?: string;
}

export interface VideoKeyframe {
  timestamp: string;
  timeOffsetSeconds: number;
  imageUrl: string;
  caption: string;
  detectedObjects: string[];
}

export interface EvidenceItem {
  id: string; // e.g. EVD-101
  caseId: string;
  fileName: string;
  fileType: string; // MIME or ext
  category: EvidenceType;
  fileSizeBytes: number;
  sha256Hash: string;
  uploadedById: string;
  uploadedByName: string;
  uploadedAt: string;
  processingStatus: ProcessingStatus;
  sourceDescription: string;
  textContent?: string;
  mediaUrl?: string;
  chunks?: EvidenceChunk[];
  ocrConfidence?: number;
  audioDurationSeconds?: number;
  audioTranscript?: Array<{
    timestamp: string;
    speaker: string;
    text: string;
    confidence: number;
  }>;
  boundingBoxes?: BoundingBox[];
  videoFrames?: VideoKeyframe[];
  metadata: Record<string, any>;
}

export type FindingCategory = 'PERSON' | 'LOCATION' | 'VEHICLE' | 'OBJECT' | 'DATE' | 'TIME' | 'EVENT';
export type ReviewStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Finding {
  id: string; // e.g. FND-001
  caseId: string;
  evidenceId: string;
  evidenceFileName: string;
  chunkId?: string;
  category: FindingCategory;
  extractedInformation: string;
  originalTextExcerpt: string;
  locationReference: string; // e.g. "Page 1, Para 2" or "01:14"
  confidenceIndicator: number; // 0.0 to 1.0 (extraction indicator)
  reviewStatus: ReviewStatus;
  reviewedById?: string;
  reviewedByName?: string;
  reviewedAt?: string;
  previousValue?: string;
  investigatorNotes?: string;
  isFlaggedForConflict?: boolean;
}

export type ConflictSeverity = 'CRITICAL' | 'MODERATE' | 'LOW';

export interface ConflictFlag {
  id: string; // e.g. FLG-001
  caseId: string;
  title: string;
  description: string;
  category: FindingCategory;
  severity: ConflictSeverity;
  sourceA: {
    evidenceId: string;
    fileName: string;
    excerpt: string;
    locationRef: string;
    findingId?: string;
  };
  sourceB: {
    evidenceId: string;
    fileName: string;
    excerpt: string;
    locationRef: string;
    findingId?: string;
  };
  status: 'DETECTED' | 'UNDER_INVESTIGATION' | 'RESOLVED';
  resolutionNotes?: string;
  resolvedById?: string;
  resolvedByName?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  date: string; // YYYY-MM-DD or "UNKNOWN"
  time: string; // HH:MM:SS UTC or "UNKNOWN"
  datetimeSort: string;
  description: string;
  category: 'INCIDENT' | 'WITNESS_OBSERVATION' | 'RECORDED_ACTIVITY' | 'MOVEMENT' | 'FORENSIC_COLLECTION';
  relatedEntities: string[];
  evidenceSource: {
    evidenceId: string;
    fileName: string;
    locationRef: string;
  };
  reviewStatus: ReviewStatus;
  findingId?: string;
  isContradicted?: boolean;
  contradictionNote?: string;
}

export interface QACitation {
  evidenceId: string;
  fileName: string;
  locationRef: string;
  excerpt: string;
  confidenceScore: number;
}

export interface QAMessage {
  id: string;
  caseId: string;
  sender: 'INVESTIGATOR' | 'AI';
  content: string;
  timestamp: string;
  citations?: QACitation[];
  isRefusal?: boolean;
  retrievedChunksCount?: number;
}

export type ReportStatus = 'DRAFT' | 'INVESTIGATOR_APPROVED' | 'SUPERVISOR_APPROVED' | 'REJECTED';

export interface ForensicReport {
  id: string;
  caseId: string;
  version: string; // "v1.0"
  title: string;
  status: ReportStatus;
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  investigatorApproval?: {
    approvedById: string;
    approvedByName: string;
    timestamp: string;
  };
  supervisorReview?: {
    reviewedById: string;
    reviewedByName: string;
    timestamp: string;
    decision: 'APPROVED' | 'REJECTED';
    comments: string;
  };
  sections: {
    caseOverview: string;
    caseDetails: Record<string, string>;
    evidenceInventorySummary: string;
    evidenceProcessingSummary: string;
    relevantFindings: Array<{
      category: FindingCategory;
      detail: string;
      source: string;
      locationRef: string;
    }>;
    chronologicalTimeline: Array<{
      time: string;
      event: string;
      source: string;
    }>;
    inconsistenciesIdentified: Array<{
      title: string;
      description: string;
      resolutionStatus: string;
      notes?: string;
    }>;
    investigatorReviewNotes: string;
    conclusionAndLimitations: string;
    evidenceCryptographicReferences: Array<{
      fileName: string;
      sha256: string;
      byteSize: number;
      category: string;
    }>;
  };
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  caseId?: string;
  action: string;
  targetResource: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface BenchmarkMetrics {
  evaluatedAt: string;
  datasetName: string;
  totalGroundTruthSamples: number;
  ocrAccuracy: number; // e.g. 98.4%
  transcriptionAccuracy: number; // e.g. 96.1%
  entityPrecision: number; // e.g. 94.2%
  entityRecall: number; // e.g. 91.8%
  retrievalTop3Accuracy: number; // e.g. 95.0%
  citationCorrectness: number; // e.g. 97.5%
  correctRefusalRate: number; // e.g. 100.0%
  conflictDetectionRecall: number; // e.g. 100.0%
  unanswerableQueriesRefusedCount: number;
  handLabeledCasesTested: number;
}
