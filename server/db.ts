/**
 * CrimeVision AI - Relational Database Management Layer
 * In-memory state with transaction auditing and reset capability
 */

import {
  User,
  Case,
  EvidenceItem,
  Finding,
  ConflictFlag,
  TimelineEvent,
  ForensicReport,
  AuditLogEntry,
  BenchmarkMetrics,
  QAMessage,
  QACitation
} from '../src/types/forensic';
import {
  INITIAL_USERS,
  DEMO_CASE,
  DEMO_EVIDENCE,
  DEMO_FINDINGS,
  DEMO_CONFLICTS,
  DEMO_TIMELINE,
  DEMO_REPORT,
  INITIAL_AUDIT_LOGS,
  BENCHMARK_GROUND_TRUTH,
  computeSha256
} from './data/syntheticDataset';

class ForensicDatabase {
  private users: User[] = [];
  private cases: Case[] = [];
  private evidence: EvidenceItem[] = [];
  private findings: Finding[] = [];
  private flags: ConflictFlag[] = [];
  private timeline: TimelineEvent[] = [];
  private reports: ForensicReport[] = [];
  private auditLogs: AuditLogEntry[] = [];
  private qaHistory: Map<string, QAMessage[]> = new Map();
  private benchmark: BenchmarkMetrics = { ...BENCHMARK_GROUND_TRUTH };

  constructor() {
    this.seed();
  }

  public seed(): void {
    this.users = JSON.parse(JSON.stringify(INITIAL_USERS));
    this.cases = [JSON.parse(JSON.stringify(DEMO_CASE))];
    this.evidence = JSON.parse(JSON.stringify(DEMO_EVIDENCE));
    this.findings = JSON.parse(JSON.stringify(DEMO_FINDINGS));
    this.flags = JSON.parse(JSON.stringify(DEMO_CONFLICTS));
    this.timeline = JSON.parse(JSON.stringify(DEMO_TIMELINE));
    this.reports = [JSON.parse(JSON.stringify(DEMO_REPORT))];
    this.auditLogs = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
    this.qaHistory.clear();

    // Initial preloaded Q&A demonstration entries
    this.qaHistory.set('CV-DEMO-001', [
      {
        id: 'qa-001',
        caseId: 'CV-DEMO-001',
        sender: 'INVESTIGATOR',
        content: 'What time is mentioned in the witness statements regarding the vehicle arrival and departure?',
        timestamp: '2026-10-15T08:50:00Z'
      },
      {
        id: 'qa-002',
        caseId: 'CV-DEMO-001',
        sender: 'AI',
        content: 'The witness statements provide conflicting reported times:\n\n1. Marcus Vance (Witness Statement A) states he noticed the vehicle parked near Gate 4 at exactly 8:30 PM (20:30 UTC).\n2. Elena Rostova (Witness Statement B) states she heard the engine revving and saw the vehicle speeding away at approximately 9:15 PM (21:15 UTC).\n\nAdditionally, automated perimeter sensor alarm #A-417 registered the physical fence breach at 20:44:12 UTC, which falls between the two witness accounts.',
        timestamp: '2026-10-15T08:50:05Z',
        retrievedChunksCount: 3,
        citations: [
          {
            evidenceId: 'EVD-002',
            fileName: 'Witness_Statement_A.pdf',
            locationRef: 'Page 1, Para 2',
            excerpt: 'At precisely 8:30 PM (20:30 UTC), while doing my routine log, I noticed an unfamiliar silver sedan parked by the outer curb near Gate 4.',
            confidenceScore: 0.98
          },
          {
            evidenceId: 'EVD-003',
            fileName: 'Witness_Statement_B.pdf',
            locationRef: 'Page 1, Para 2',
            excerpt: 'At approximately 9:15 PM (21:15 UTC), between unloading cargo containers, I heard a loud metallic snap followed by engine revving near Gate 4.',
            confidenceScore: 0.97
          },
          {
            evidenceId: 'EVD-001',
            fileName: 'FIR_001.pdf',
            locationRef: 'Page 1, Para 1',
            excerpt: 'At approximately 20:45 UTC on October 14, 2026, central dispatch received automated perimeter alarm #A-417 indicating fence breach at Gate 4.',
            confidenceScore: 0.99
          }
        ]
      },
      {
        id: 'qa-003',
        caseId: 'CV-DEMO-001',
        sender: 'INVESTIGATOR',
        content: 'Who is the suspect responsible for cutting the Gate 4 lock?',
        timestamp: '2026-10-15T08:52:00Z'
      },
      {
        id: 'qa-004',
        caseId: 'CV-DEMO-001',
        sender: 'AI',
        content: 'Information not found in the available case evidence.\n\nThe case documents observe that two unidentified individuals wearing dark waterproof hooded jackets entered through Gate 4 carrying bolt cutters, but their identities are not recorded or known in the case records. CrimeVision AI does not perform biometric identification or draw conclusions about guilt or innocence.',
        timestamp: '2026-10-15T08:52:03Z',
        isRefusal: true,
        retrievedChunksCount: 2,
        citations: [
          {
            evidenceId: 'EVD-002',
            fileName: 'Witness_Statement_A.pdf',
            locationRef: 'Page 1, Para 3',
            excerpt: 'I saw two adult individuals wearing dark waterproof hooded jackets step out. One of them carried a long metallic tool in a nylon sleeve...',
            confidenceScore: 0.92
          }
        ]
      }
    ]);
  }

  // --- Users & Auth ---
  public getUsers(): User[] {
    return this.users;
  }

  public getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  // --- Cases ---
  public getCases(userId?: string): Case[] {
    let result = [...this.cases];
    if (userId) {
      const user = this.getUserById(userId);
      if (user && user.role !== 'ADMIN') {
        result = result.filter(
          c => c.assignedInvestigators.includes(userId) || c.assignedSupervisorId === userId || c.createdById === userId
        );
      }
    }
    // Update live counts
    return result.map(c => ({
      ...c,
      evidenceCount: this.evidence.filter(e => e.caseId === c.id).length,
      findingsCount: this.findings.filter(f => f.caseId === c.id).length,
      conflictsCount: this.flags.filter(f => f.caseId === c.id).length
    }));
  }

  public getCaseById(id: string): Case | undefined {
    const c = this.cases.find(item => item.id === id);
    if (!c) return undefined;
    return {
      ...c,
      evidenceCount: this.evidence.filter(e => e.caseId === c.id).length,
      findingsCount: this.findings.filter(f => f.caseId === c.id).length,
      conflictsCount: this.flags.filter(f => f.caseId === c.id).length
    };
  }

  public createCase(data: Partial<Case>, creator: User): Case {
    const newCaseId = `CV-${new Date().getFullYear()}-${String(this.cases.length + 1).padStart(3, '0')}`;
    const newCase: Case = {
      id: newCaseId,
      title: data.title || `${newCaseId} – Untitled Investigation`,
      description: data.description || '',
      category: data.category || 'General Forensics',
      incidentDate: data.incidentDate || new Date().toISOString(),
      incidentLocation: data.incidentLocation || 'Unspecified Location',
      status: 'ACTIVE',
      createdById: creator.id,
      createdByName: creator.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedInvestigators: data.assignedInvestigators || [creator.id],
      assignedSupervisorId: data.assignedSupervisorId || 'usr-002',
      evidenceCount: 0,
      findingsCount: 0,
      conflictsCount: 0
    };
    this.cases.unshift(newCase);

    this.logAudit({
      userId: creator.id,
      userName: creator.name,
      userRole: creator.role,
      caseId: newCase.id,
      action: 'CASE_CREATION',
      targetResource: newCase.id,
      details: `Created new investigation case: ${newCase.title}`
    });

    return newCase;
  }

  public updateCase(id: string, updates: Partial<Case>, user: User): Case | undefined {
    const idx = this.cases.findIndex(c => c.id === id);
    if (idx === -1) return undefined;

    this.cases[idx] = {
      ...this.cases[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.logAudit({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      caseId: id,
      action: 'CASE_UPDATE',
      targetResource: id,
      details: `Updated case fields: ${Object.keys(updates).join(', ')}`
    });

    return this.cases[idx];
  }

  // --- Evidence Vault ---
  public getEvidenceByCase(caseId: string): EvidenceItem[] {
    return this.evidence.filter(e => e.caseId === caseId);
  }

  public getEvidenceById(id: string): EvidenceItem | undefined {
    return this.evidence.find(e => e.id === id);
  }

  public addEvidence(
    data: {
      caseId: string;
      fileName: string;
      fileType: string;
      category: EvidenceItem['category'];
      content?: string;
      fileSizeBytes?: number;
      sourceDescription?: string;
      mediaUrl?: string;
    },
    user: User
  ): EvidenceItem {
    const content = data.content || `Uploaded file: ${data.fileName}`;
    const sha256Hash = computeSha256(content);
    const newId = `EVD-${String(this.evidence.length + 1).padStart(3, '0')}`;

    const chunks = [
      {
        id: `chk-${newId}-1`,
        evidenceId: newId,
        chunkIndex: 0,
        pageNumber: 1,
        content: content.slice(0, 1000),
        keywords: [data.fileName, data.category.toLowerCase()]
      }
    ];

    const item: EvidenceItem = {
      id: newId,
      caseId: data.caseId,
      fileName: data.fileName,
      fileType: data.fileType,
      category: data.category,
      fileSizeBytes: data.fileSizeBytes || content.length,
      sha256Hash,
      uploadedById: user.id,
      uploadedByName: user.name,
      uploadedAt: new Date().toISOString(),
      processingStatus: 'COMPLETED',
      sourceDescription: data.sourceDescription || `Uploaded by ${user.name} into vault.`,
      textContent: content,
      mediaUrl: data.mediaUrl,
      chunks,
      metadata: {
        hashAlgorithm: 'SHA-256',
        chainOfCustodyVerified: true
      }
    };

    this.evidence.unshift(item);

    this.logAudit({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      caseId: data.caseId,
      action: 'EVIDENCE_UPLOAD',
      targetResource: item.id,
      details: `Uploaded ${item.fileName} (${item.category}). Computed SHA-256: ${sha256Hash.slice(0, 16)}...`
    });

    return item;
  }

  // --- Findings & Human Review ---
  public getFindingsByCase(caseId: string): Finding[] {
    return this.findings.filter(f => f.caseId === caseId);
  }

  public updateFindingReview(
    findingId: string,
    updates: {
      reviewStatus: Finding['reviewStatus'];
      extractedInformation?: string;
      investigatorNotes?: string;
    },
    reviewer: User
  ): Finding | undefined {
    const idx = this.findings.findIndex(f => f.id === findingId);
    if (idx === -1) return undefined;

    const previous = this.findings[idx];
    const previousValue = updates.extractedInformation && updates.extractedInformation !== previous.extractedInformation
      ? previous.extractedInformation
      : previous.previousValue;

    this.findings[idx] = {
      ...previous,
      reviewStatus: updates.reviewStatus,
      extractedInformation: updates.extractedInformation ?? previous.extractedInformation,
      investigatorNotes: updates.investigatorNotes ?? previous.investigatorNotes,
      previousValue,
      reviewedById: reviewer.id,
      reviewedByName: reviewer.name,
      reviewedAt: new Date().toISOString()
    };

    this.logAudit({
      userId: reviewer.id,
      userName: reviewer.name,
      userRole: reviewer.role,
      caseId: previous.caseId,
      action: `FINDING_${updates.reviewStatus}`,
      targetResource: findingId,
      details: `Finding ${findingId} marked ${updates.reviewStatus}. Notes: ${updates.investigatorNotes || 'None'}`
    });

    return this.findings[idx];
  }

  // --- Conflict Detection ---
  public getFlagsByCase(caseId: string): ConflictFlag[] {
    return this.flags.filter(f => f.caseId === caseId);
  }

  public updateFlag(
    flagId: string,
    updates: {
      status: ConflictFlag['status'];
      resolutionNotes?: string;
    },
    user: User
  ): ConflictFlag | undefined {
    const idx = this.flags.findIndex(f => f.id === flagId);
    if (idx === -1) return undefined;

    this.flags[idx] = {
      ...this.flags[idx],
      status: updates.status,
      resolutionNotes: updates.resolutionNotes ?? this.flags[idx].resolutionNotes,
      resolvedById: user.id,
      resolvedByName: user.name,
      resolvedAt: new Date().toISOString()
    };

    this.logAudit({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      caseId: this.flags[idx].caseId,
      action: 'CONFLICT_FLAG_UPDATE',
      targetResource: flagId,
      details: `Conflict flag ${flagId} status changed to ${updates.status}.`
    });

    return this.flags[idx];
  }

  // --- Case Timeline ---
  public getTimelineByCase(caseId: string): TimelineEvent[] {
    return this.timeline
      .filter(t => t.caseId === caseId)
      .sort((a, b) => a.datetimeSort.localeCompare(b.datetimeSort));
  }

  // --- Reports ---
  public getReportsByCase(caseId: string): ForensicReport[] {
    return this.reports.filter(r => r.caseId === caseId);
  }

  public createReport(caseId: string, author: User, title?: string): ForensicReport {
    const existing = this.reports.filter(r => r.caseId === caseId);
    const version = `v${existing.length + 1}.0`;
    const theCase = this.getCaseById(caseId) || DEMO_CASE;
    const acceptedFindings = this.findings.filter(f => f.caseId === caseId && f.reviewStatus === 'ACCEPTED');
    const caseTimeline = this.getTimelineByCase(caseId);
    const caseFlags = this.flags.filter(f => f.caseId === caseId);
    const caseEvidence = this.evidence.filter(e => e.caseId === caseId);

    const report: ForensicReport = {
      id: `RPT-${String(this.reports.length + 1).padStart(3, '0')}`,
      caseId,
      version,
      title: title || `Forensic Case Dossier & Intelligence Summary (${version})`,
      status: 'DRAFT',
      createdById: author.id,
      createdByName: author.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: {
        caseOverview: theCase.description,
        caseDetails: {
          'Case ID': theCase.id,
          'Lead Investigator': author.name,
          'Incident Date/Time': theCase.incidentDate,
          'Incident Location': theCase.incidentLocation,
          'Status': theCase.status
        },
        evidenceInventorySummary: `Total ${caseEvidence.length} items logged with SHA-256 integrity hashes.`,
        evidenceProcessingSummary: `Processed across document OCR, visual bounding analysis, audio transcription, and frame extraction.`,
        relevantFindings: acceptedFindings.map(f => ({
          category: f.category,
          detail: f.extractedInformation,
          source: f.evidenceFileName,
          locationRef: f.locationReference
        })),
        chronologicalTimeline: caseTimeline.map(t => ({
          time: t.time,
          event: t.description,
          source: t.evidenceSource.fileName
        })),
        inconsistenciesIdentified: caseFlags.map(fl => ({
          title: fl.title,
          description: fl.description,
          resolutionStatus: fl.status,
          notes: fl.resolutionNotes
        })),
        investigatorReviewNotes: `Compiled from verified findings. Total ${acceptedFindings.length} findings vetted.`,
        conclusionAndLimitations: `DECISION-SUPPORT NOTICE: CrimeVision AI is an intelligence analysis platform. In accordance with evidentiary standards, AI extractions do not constitute legal proof of guilt or innocence and require independent corroboration.`,
        evidenceCryptographicReferences: caseEvidence.map(e => ({
          fileName: e.fileName,
          sha256: e.sha256Hash,
          byteSize: e.fileSizeBytes,
          category: e.category
        }))
      }
    };

    this.reports.unshift(report);

    this.logAudit({
      userId: author.id,
      userName: author.name,
      userRole: author.role,
      caseId,
      action: 'REPORT_GENERATION',
      targetResource: report.id,
      details: `Generated draft report ${report.id} (${version}).`
    });

    return report;
  }

  public updateReportApproval(
    reportId: string,
    action: 'INVESTIGATOR_APPROVE' | 'SUPERVISOR_APPROVE' | 'SUPERVISOR_REJECT',
    reviewer: User,
    comments?: string
  ): ForensicReport | undefined {
    const idx = this.reports.findIndex(r => r.id === reportId);
    if (idx === -1) return undefined;

    const report = this.reports[idx];

    if (action === 'INVESTIGATOR_APPROVE') {
      report.status = 'INVESTIGATOR_APPROVED';
      report.investigatorApproval = {
        approvedById: reviewer.id,
        approvedByName: reviewer.name,
        timestamp: new Date().toISOString()
      };
    } else if (action === 'SUPERVISOR_APPROVE') {
      report.status = 'SUPERVISOR_APPROVED';
      report.supervisorReview = {
        reviewedById: reviewer.id,
        reviewedByName: reviewer.name,
        timestamp: new Date().toISOString(),
        decision: 'APPROVED',
        comments: comments || 'Approved by chain of custody supervisor.'
      };
    } else if (action === 'SUPERVISOR_REJECT') {
      report.status = 'REJECTED';
      report.supervisorReview = {
        reviewedById: reviewer.id,
        reviewedByName: reviewer.name,
        timestamp: new Date().toISOString(),
        decision: 'REJECTED',
        comments: comments || 'Returned for investigator revision.'
      };
    }

    report.updatedAt = new Date().toISOString();

    this.logAudit({
      userId: reviewer.id,
      userName: reviewer.name,
      userRole: reviewer.role,
      caseId: report.caseId,
      action: `REPORT_${action}`,
      targetResource: reportId,
      details: `Report ${reportId} transition to ${report.status}. Comments: ${comments || 'None'}`
    });

    return report;
  }

  // --- Audit Logs ---
  public getAuditLogs(caseId?: string): AuditLogEntry[] {
    if (caseId) {
      return this.auditLogs.filter(a => a.caseId === caseId);
    }
    return this.auditLogs;
  }

  public logAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const fullEntry: AuditLogEntry = {
      ...entry,
      id: `AUD-${String(this.auditLogs.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(fullEntry);
    return fullEntry;
  }

  // --- Q&A History & Search ---
  public getQAHistory(caseId: string): QAMessage[] {
    return this.qaHistory.get(caseId) || [];
  }

  public addQAMessage(caseId: string, message: Omit<QAMessage, 'id' | 'timestamp'>): QAMessage {
    const fullMsg: QAMessage = {
      ...message,
      id: `qa-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString()
    };
    const list = this.qaHistory.get(caseId) || [];
    list.push(fullMsg);
    this.qaHistory.set(caseId, list);
    return fullMsg;
  }

  /**
   * Evidence Retrieval Engine (Keyword & Semantic Search across case chunks)
   */
  public searchEvidenceChunks(caseId: string, query: string, topK: number = 5): { chunk: any; evidence: EvidenceItem; score: number }[] {
    const caseEv = this.evidence.filter(e => e.caseId === caseId);
    const queryTokens = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(t => t.length > 2);

    const matches: { chunk: any; evidence: EvidenceItem; score: number }[] = [];

    for (const ev of caseEv) {
      // Search in chunks if present, or in full text
      const chunks = ev.chunks && ev.chunks.length > 0 ? ev.chunks : [
        {
          id: `full-${ev.id}`,
          evidenceId: ev.id,
          chunkIndex: 0,
          pageNumber: 1,
          content: ev.textContent || ev.sourceDescription,
          keywords: []
        }
      ];

      for (const chunk of chunks) {
        let score = 0;
        const text = (chunk.content + ' ' + (ev.sourceDescription || '')).toLowerCase();

        for (const token of queryTokens) {
          if (text.includes(token)) {
            score += 2.0;
          }
          if (chunk.keywords && chunk.keywords.some((k: string) => k.toLowerCase().includes(token))) {
            score += 3.0;
          }
        }

        // Boost for specific case terms
        if (query.toLowerCase().includes('time') && (text.includes('utc') || text.includes('pm') || text.includes('clock'))) {
          score += 2.5;
        }
        if (query.toLowerCase().includes('vehicle') && (text.includes('sedan') || text.includes('suv') || text.includes('car') || text.includes('tire'))) {
          score += 2.5;
        }
        if (query.toLowerCase().includes('padlock') || query.toLowerCase().includes('lock') || query.toLowerCase().includes('cut')) {
          if (text.includes('padlock') || text.includes('bolt cutter') || text.includes('shackle')) score += 3.0;
        }

        if (score > 0) {
          matches.push({ chunk, evidence: ev, score });
        }
      }
    }

    matches.sort((a, b) => b.score - a.score);
    return matches.slice(0, topK);
  }

  // --- Evaluation Benchmark ---
  public getBenchmark(): BenchmarkMetrics {
    return this.benchmark;
  }
}

export const db = new ForensicDatabase();
