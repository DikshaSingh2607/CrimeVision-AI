/**
 * CrimeVision AI - Frontend API Service Client
 * Connects directly to server REST endpoints
 */

import {
  Case,
  EvidenceItem,
  Finding,
  ConflictFlag,
  TimelineEvent,
  ForensicReport,
  AuditLogEntry,
  BenchmarkMetrics,
  User,
  QAMessage
} from '../types/forensic';

class ForensicApiClient {
  private currentUserId: string = 'usr-001';

  public setUserId(id: string) {
    this.currentUserId = id;
  }

  public getUserId(): string {
    return this.currentUserId;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = {
      'Content-Type': 'application/json',
      'x-user-id': this.currentUserId,
      ...(options.headers || {})
    };

    const res = await fetch(endpoint, {
      ...options,
      headers
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(errBody.error || `HTTP ${res.status}`);
    }

    return res.json();
  }

  // Auth & Current User
  async getAuthMe(): Promise<{ user: User; availableUsers: User[] }> {
    return this.request('/api/auth/me');
  }

  async login(email: string): Promise<{ token: string; user: User }> {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  // Cases
  async getCases(): Promise<Case[]> {
    return this.request('/api/cases');
  }

  async getCaseById(id: string): Promise<Case> {
    return this.request(`/api/cases/${id}`);
  }

  async createCase(data: Partial<Case>): Promise<Case> {
    return this.request('/api/cases', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateCase(id: string, updates: Partial<Case>): Promise<Case> {
    return this.request(`/api/cases/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  // Evidence
  async getEvidence(caseId: string): Promise<EvidenceItem[]> {
    return this.request(`/api/cases/${caseId}/evidence`);
  }

  async getEvidenceById(id: string): Promise<EvidenceItem> {
    return this.request(`/api/evidence/${id}`);
  }

  async uploadEvidence(
    caseId: string,
    data: {
      fileName: string;
      fileType: string;
      category: EvidenceItem['category'];
      content?: string;
      fileSizeBytes?: number;
      sourceDescription?: string;
      mediaUrl?: string;
    }
  ): Promise<EvidenceItem> {
    return this.request(`/api/cases/${caseId}/evidence`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // AI Pipeline & Grounded Q&A
  async runAnalysis(caseId: string): Promise<any> {
    return this.request(`/api/cases/${caseId}/analyze`, {
      method: 'POST'
    });
  }

  async askQuestion(caseId: string, question: string): Promise<{
    message: QAMessage;
    citations: any[];
    isRefusal: boolean;
    engineUsed: string;
  }> {
    return this.request(`/api/cases/${caseId}/ask`, {
      method: 'POST',
      body: JSON.stringify({ question })
    });
  }

  async getQAHistory(caseId: string): Promise<QAMessage[]> {
    return this.request(`/api/cases/${caseId}/qa`);
  }

  // Findings & Human Review
  async getFindings(caseId: string): Promise<Finding[]> {
    return this.request(`/api/cases/${caseId}/findings`);
  }

  async updateFindingReview(
    findingId: string,
    data: {
      reviewStatus: Finding['reviewStatus'];
      extractedInformation?: string;
      investigatorNotes?: string;
    }
  ): Promise<Finding> {
    return this.request(`/api/findings/${findingId}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  // Timeline & Flags
  async getTimeline(caseId: string): Promise<TimelineEvent[]> {
    return this.request(`/api/cases/${caseId}/timeline`);
  }

  async getFlags(caseId: string): Promise<ConflictFlag[]> {
    return this.request(`/api/cases/${caseId}/flags`);
  }

  async updateFlag(
    flagId: string,
    data: {
      status: ConflictFlag['status'];
      resolutionNotes?: string;
    }
  ): Promise<ConflictFlag> {
    return this.request(`/api/flags/${flagId}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  // Reports
  async getReports(caseId: string): Promise<ForensicReport[]> {
    return this.request(`/api/cases/${caseId}/reports`);
  }

  async createReport(caseId: string, title?: string): Promise<ForensicReport> {
    return this.request(`/api/cases/${caseId}/report`, {
      method: 'POST',
      body: JSON.stringify({ title })
    });
  }

  async updateReportApproval(
    reportId: string,
    action: 'INVESTIGATOR_APPROVE' | 'SUPERVISOR_APPROVE' | 'SUPERVISOR_REJECT',
    comments?: string
  ): Promise<ForensicReport> {
    return this.request(`/api/reports/${reportId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ action, comments })
    });
  }

  // Audit Logs & Evaluation
  async getAuditLogs(caseId?: string): Promise<AuditLogEntry[]> {
    const url = caseId ? `/api/cases/${caseId}/audit` : '/api/audit';
    return this.request(url);
  }

  async getEvaluation(): Promise<BenchmarkMetrics> {
    return this.request('/api/evaluation');
  }

  async resetDemo(): Promise<any> {
    return this.request('/api/reset-demo', {
      method: 'POST'
    });
  }
}

export const api = new ForensicApiClient();
