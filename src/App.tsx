/**
 * CrimeVision AI – Intelligent Multimodal Forensic Analysis
 * Obsidian & Oxide Forensic Workspace Application Entry
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, TabId } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { OverviewView } from './components/overview/OverviewView';
import { CasesView } from './components/cases/CasesView';
import { EvidenceVaultView } from './components/evidence/EvidenceVaultView';
import { AnalysisView } from './components/analysis/AnalysisView';
import { FindingsReviewView } from './components/findings/FindingsReviewView';
import { TimelineView } from './components/timeline/TimelineView';
import { ConflictDetectionView } from './components/conflicts/ConflictDetectionView';
import { EvidenceQAView } from './components/qa/EvidenceQAView';
import { ReportsView } from './components/reports/ReportsView';
import { AuditLogsView } from './components/audit/AuditLogsView';
import { BenchmarkView } from './components/benchmark/BenchmarkView';
import { SettingsView } from './components/settings/SettingsView';

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
  QAMessage,
  EvidenceType
} from './types/forensic';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Core Forensic State
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'usr-001',
    name: 'Det. Sarah Miller',
    badgeNumber: 'BDG-8842',
    email: 'det_miller@crimevision.internal',
    role: 'INVESTIGATOR',
    department: 'Major Incident Forensics Unit'
  });
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [activeCaseId, setActiveCaseId] = useState<string>('CV-DEMO-001');

  // Case-specific data
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [flags, setFlags] = useState<ConflictFlag[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [reports, setReports] = useState<ForensicReport[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [qaHistory, setQAHistory] = useState<QAMessage[]>([]);
  const [benchmark, setBenchmark] = useState<BenchmarkMetrics | null>(null);

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, []);

  // Reload case-specific records when activeCaseId changes
  useEffect(() => {
    if (activeCaseId) {
      loadCaseData(activeCaseId);
    }
  }, [activeCaseId]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [authRes, casesRes, benchRes] = await Promise.all([
        api.getAuthMe(),
        api.getCases(),
        api.getEvaluation()
      ]);
      setCurrentUser(authRes.user);
      setAvailableUsers(authRes.availableUsers);
      setCases(casesRes);
      setBenchmark(benchRes);

      const targetCaseId = casesRes.length > 0 ? casesRes[0].id : 'CV-DEMO-001';
      setActiveCaseId(targetCaseId);
      await loadCaseData(targetCaseId);
    } catch (err) {
      console.error('[CrimeVision] Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCaseData = async (cId: string) => {
    try {
      const [evRes, fndRes, flgRes, timeRes, rptRes, audRes, qaRes] = await Promise.all([
        api.getEvidence(cId),
        api.getFindings(cId),
        api.getFlags(cId),
        api.getTimeline(cId),
        api.getReports(cId),
        api.getAuditLogs(cId),
        api.getQAHistory(cId)
      ]);
      setEvidence(evRes);
      setFindings(fndRes);
      setFlags(flgRes);
      setTimeline(timeRes);
      setReports(rptRes);
      setAuditLogs(audRes);
      setQAHistory(qaRes);
    } catch (err) {
      console.error('[CrimeVision] Error loading case data:', err);
    }
  };

  // Switch User Persona
  const handleSwitchUser = async (userId: string) => {
    api.setUserId(userId);
    const target = availableUsers.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      // Refresh case access list
      const casesRes = await api.getCases();
      setCases(casesRes);
    }
  };

  // Case Actions
  const handleCreateCase = async (data: Partial<Case>) => {
    const created = await api.createCase(data);
    setCases(prev => [created, ...prev]);
    setActiveCaseId(created.id);
  };

  const handleUpdateCaseStatus = async (caseId: string, status: Case['status']) => {
    const updated = await api.updateCase(caseId, { status });
    setCases(prev => prev.map(c => (c.id === caseId ? updated : c)));
  };

  // Evidence Upload Action
  const handleUploadEvidence = async (data: {
    fileName: string;
    fileType: string;
    category: EvidenceType;
    content?: string;
    sourceDescription?: string;
    mediaUrl?: string;
  }) => {
    const created = await api.uploadEvidence(activeCaseId, data);
    setEvidence(prev => [created, ...prev]);
    // Refresh audit
    const updatedLogs = await api.getAuditLogs(activeCaseId);
    setAuditLogs(updatedLogs);
  };

  // AI Pipeline Action
  const handleRunAnalysis = async () => {
    await api.runAnalysis(activeCaseId);
    await loadCaseData(activeCaseId);
  };

  // Grounded Q&A Action
  const handleAskQuestion = async (question: string) => {
    const res = await api.askQuestion(activeCaseId, question);
    const updatedHistory = await api.getQAHistory(activeCaseId);
    setQAHistory(updatedHistory);
    // Refresh audit
    const updatedLogs = await api.getAuditLogs(activeCaseId);
    setAuditLogs(updatedLogs);
  };

  // Findings Review Action
  const handleReviewFinding = async (
    findingId: string,
    data: {
      reviewStatus: Finding['reviewStatus'];
      extractedInformation?: string;
      investigatorNotes?: string;
    }
  ) => {
    const updated = await api.updateFindingReview(findingId, data);
    setFindings(prev => prev.map(f => (f.id === findingId ? updated : f)));
    const updatedLogs = await api.getAuditLogs(activeCaseId);
    setAuditLogs(updatedLogs);
  };

  // Conflict Flag Action
  const handleUpdateFlag = async (
    flagId: string,
    data: {
      status: ConflictFlag['status'];
      resolutionNotes?: string;
    }
  ) => {
    const updated = await api.updateFlag(flagId, data);
    setFlags(prev => prev.map(fl => (fl.id === flagId ? updated : fl)));
    const updatedLogs = await api.getAuditLogs(activeCaseId);
    setAuditLogs(updatedLogs);
  };

  // Report Creation & Approval Actions
  const handleCreateReport = async (cId: string, title?: string) => {
    const newReport = await api.createReport(cId, title);
    setReports(prev => [newReport, ...prev]);
    const updatedLogs = await api.getAuditLogs(activeCaseId);
    setAuditLogs(updatedLogs);
  };

  const handleApproveReport = async (
    reportId: string,
    action: 'INVESTIGATOR_APPROVE' | 'SUPERVISOR_APPROVE' | 'SUPERVISOR_REJECT',
    comments?: string
  ) => {
    const updated = await api.updateReportApproval(reportId, action, comments);
    setReports(prev => prev.map(r => (r.id === reportId ? updated : r)));
    const updatedLogs = await api.getAuditLogs(activeCaseId);
    setAuditLogs(updatedLogs);
  };

  // Reset Demo Action
  const handleResetDemo = async () => {
    await api.resetDemo();
    await loadInitialData();
  };

  const activeCase = cases.find(c => c.id === activeCaseId) || cases[0] || {
    id: 'CV-DEMO-001',
    title: 'CV-DEMO-001 – Riverside Incident Investigation',
    description: '',
    category: '',
    incidentDate: new Date().toISOString(),
    incidentLocation: '',
    status: 'ACTIVE',
    createdById: '',
    createdByName: '',
    createdAt: '',
    updatedAt: '',
    assignedInvestigators: [],
    evidenceCount: 0,
    findingsCount: 0,
    conflictsCount: 0
  };

  const pendingFindingsCount = findings.filter(f => f.reviewStatus === 'PENDING').length;
  const conflictsCount = flags.filter(fl => fl.status !== 'RESOLVED').length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#101412] text-[#eae9e1]">
      {/* Tactical Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={currentUser.role}
        pendingFindingsCount={pendingFindingsCount}
        conflictsCount={conflictsCount}
      />

      {/* Main Analytical Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <TopNav
          cases={cases}
          activeCaseId={activeCaseId}
          onSelectCase={setActiveCaseId}
          currentUser={currentUser}
          availableUsers={availableUsers}
          onSwitchUser={handleSwitchUser}
          globalSearchQuery={globalSearchQuery}
          setGlobalSearchQuery={setGlobalSearchQuery}
        />

        {/* Scrollable Main Stage */}
        <main className="flex-1 p-4 overflow-y-auto bg-[#202522] reticle-grid">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 font-mono text-xs text-[#a5aaa0]">
              <div className="w-8 h-8 border-2 border-[#465047] border-t-[#c16c4b] rounded-full animate-spin" />
              <div>INITIALIZING CRIMEVISION FORENSIC REGISTRY...</div>
              <div className="text-[10px] text-[#81977d]">Verifying SHA-256 Vault Checksums</div>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <OverviewView
                  currentCase={activeCase}
                  cases={cases}
                  evidence={evidence}
                  findings={findings}
                  flags={flags}
                  reports={reports}
                  auditLogs={auditLogs}
                  setActiveTab={setActiveTab}
                  onOpenUploadModal={() => setIsUploadModalOpen(true)}
                />
              )}

              {activeTab === 'cases' && (
                <CasesView
                  cases={cases}
                  activeCaseId={activeCaseId}
                  onSelectCase={setActiveCaseId}
                  currentUser={currentUser}
                  availableUsers={availableUsers}
                  onCreateCase={handleCreateCase}
                  onUpdateCaseStatus={handleUpdateCaseStatus}
                />
              )}

              {activeTab === 'evidence' && (
                <EvidenceVaultView
                  evidence={evidence}
                  caseId={activeCaseId}
                  onUploadEvidence={handleUploadEvidence}
                  isUploadModalOpen={isUploadModalOpen}
                  setIsUploadModalOpen={setIsUploadModalOpen}
                />
              )}

              {activeTab === 'analysis' && (
                <AnalysisView
                  caseId={activeCaseId}
                  evidence={evidence}
                  onRunAnalysis={handleRunAnalysis}
                />
              )}

              {activeTab === 'findings' && (
                <FindingsReviewView
                  findings={findings}
                  onReviewFinding={handleReviewFinding}
                />
              )}

              {activeTab === 'timeline' && (
                <TimelineView timeline={timeline} />
              )}

              {activeTab === 'conflicts' && (
                <ConflictDetectionView
                  flags={flags}
                  onUpdateFlag={handleUpdateFlag}
                />
              )}

              {activeTab === 'qa' && (
                <EvidenceQAView
                  caseId={activeCaseId}
                  qaHistory={qaHistory}
                  onAskQuestion={handleAskQuestion}
                  onInspectEvidence={() => setActiveTab('evidence')}
                />
              )}

              {activeTab === 'reports' && (
                <ReportsView
                  caseId={activeCaseId}
                  reports={reports}
                  currentUser={currentUser}
                  onCreateReport={handleCreateReport}
                  onApproveReport={handleApproveReport}
                />
              )}

              {activeTab === 'audit' && (
                <AuditLogsView logs={auditLogs} caseId={activeCaseId} />
              )}

              {activeTab === 'benchmark' && benchmark && (
                <BenchmarkView benchmark={benchmark} />
              )}

              {activeTab === 'settings' && (
                <SettingsView
                  currentUser={currentUser}
                  availableUsers={availableUsers}
                  onSwitchUser={handleSwitchUser}
                  onResetDemo={handleResetDemo}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
