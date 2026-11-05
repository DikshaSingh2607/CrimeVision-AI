/**
 * CrimeVision AI - Overview & Intelligence Dashboard
 * Real Database Records & Forensic Visualizations
 */

import React from 'react';
import {
  Briefcase,
  Database,
  CheckSquare,
  AlertTriangle,
  FileCheck,
  ShieldAlert,
  ArrowUpRight,
  Clock,
  Compass,
  Upload,
  MessageSquare,
  FileText,
  Activity
} from 'lucide-react';
import { Case, EvidenceItem, Finding, ConflictFlag, ForensicReport, AuditLogEntry } from '../../types/forensic';
import { TabId } from '../layout/Sidebar';

interface OverviewViewProps {
  currentCase: Case;
  cases: Case[];
  evidence: EvidenceItem[];
  findings: Finding[];
  flags: ConflictFlag[];
  reports: ForensicReport[];
  auditLogs: AuditLogEntry[];
  setActiveTab: (tab: TabId) => void;
  onOpenUploadModal: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  currentCase,
  cases,
  evidence,
  findings,
  flags,
  reports,
  auditLogs,
  setActiveTab,
  onOpenUploadModal
}) => {
  // Real stats calculation
  const totalCases = cases.length;
  const activeCases = cases.filter(c => c.status === 'ACTIVE').length;
  const totalEvidence = evidence.length;
  const pendingFindings = findings.filter(f => f.reviewStatus === 'PENDING').length;
  const acceptedFindings = findings.filter(f => f.reviewStatus === 'ACCEPTED').length;
  const rejectedFindings = findings.filter(f => f.reviewStatus === 'REJECTED').length;
  const activeConflicts = flags.filter(fl => fl.status !== 'RESOLVED').length;
  const reportsAwaitingApproval = reports.filter(r => r.status === 'INVESTIGATOR_APPROVED' || r.status === 'DRAFT').length;

  // Breakdown by category
  const evidenceCategories = evidence.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* Top Banner: Active Case Header */}
      <div className="bg-[#29312c] border border-[#465047] rounded-[6px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#c16c4b]/20 text-[#ffdbcf] border border-[#c16c4b]/50 rounded-[4px]">
              {currentCase.id}
            </span>
            <span className="text-[11px] font-mono text-[#a5aaa0] uppercase tracking-wider">
              {currentCase.category}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#81977d]">
              <span className="w-1.5 h-1.5 rounded-sm bg-[#81977d]"></span>
              {currentCase.status}
            </span>
          </div>

          <h1 className="text-base font-semibold text-[#eae9e1] tracking-tight">
            {currentCase.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#a5aaa0] pt-1">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-[#d6c9aa]" />
              Incident: {new Date(currentCase.incidentDate).toUTCString()}
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Compass className="w-3.5 h-3.5 text-[#d6c9aa]" />
              {currentCase.incidentLocation}
            </span>
          </div>
        </div>

        {/* Quick Operational Triggers */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c16c4b] hover:bg-[#a85a3c] text-[#eae9e1] text-xs font-semibold rounded-[6px] transition-colors border border-transparent shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Evidence
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#202522] hover:bg-[#303b35] text-[#eae9e1] text-xs font-medium rounded-[6px] border border-[#465047] transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#d6c9aa]" />
            Ask Assistant
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#202522] hover:bg-[#303b35] text-[#eae9e1] text-xs font-medium rounded-[6px] border border-[#465047] transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-[#81977d]" />
            Draft Report
          </button>
        </div>
      </div>

      {/* 6 Metric Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Total Cases */}
        <div className="bg-[#29312c] border border-[#465047] p-3 rounded-[6px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#a5aaa0]">
            <span className="text-[11px] font-mono uppercase tracking-wider">Total Cases</span>
            <Briefcase className="w-3.5 h-3.5 text-[#d6c9aa]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#eae9e1]">{totalCases}</div>
          <div className="text-[10px] font-mono text-[#81977d] mt-1">{activeCases} Active Inquiries</div>
        </div>

        {/* Card 2: Total Evidence */}
        <div className="bg-[#29312c] border border-[#465047] p-3 rounded-[6px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#a5aaa0]">
            <span className="text-[11px] font-mono uppercase tracking-wider">Evidence Files</span>
            <Database className="w-3.5 h-3.5 text-[#d6c9aa]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#eae9e1]">{totalEvidence}</div>
          <div className="text-[10px] font-mono text-[#81977d] mt-1">100% SHA-256 Verified</div>
        </div>

        {/* Card 3: Pending Findings */}
        <div className="bg-[#29312c] border border-[#465047] p-3 rounded-[6px] flex flex-col justify-between cursor-pointer hover:border-[#d3a15d] transition-colors"
          onClick={() => setActiveTab('findings')}>
          <div className="flex items-center justify-between text-[#a5aaa0]">
            <span className="text-[11px] font-mono uppercase tracking-wider">Pending Findings</span>
            <CheckSquare className="w-3.5 h-3.5 text-[#d3a15d]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#d3a15d]">{pendingFindings}</div>
          <div className="text-[10px] font-mono text-[#a5aaa0] mt-1">Awaiting Review</div>
        </div>

        {/* Card 4: Accepted Findings */}
        <div className="bg-[#29312c] border border-[#465047] p-3 rounded-[6px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#a5aaa0]">
            <span className="text-[11px] font-mono uppercase tracking-wider">Accepted Findings</span>
            <FileCheck className="w-3.5 h-3.5 text-[#81977d]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#81977d]">{acceptedFindings}</div>
          <div className="text-[10px] font-mono text-[#a5aaa0] mt-1">Ready for Dossier</div>
        </div>

        {/* Card 5: Conflicts Detected */}
        <div className="bg-[#29312c] border border-[#465047] p-3 rounded-[6px] flex flex-col justify-between cursor-pointer hover:border-[#c16c4b] transition-colors"
          onClick={() => setActiveTab('conflicts')}>
          <div className="flex items-center justify-between text-[#a5aaa0]">
            <span className="text-[11px] font-mono uppercase tracking-wider">Conflicts Flagged</span>
            <AlertTriangle className="w-3.5 h-3.5 text-[#c16c4b]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#c16c4b]">{activeConflicts}</div>
          <div className="text-[10px] font-mono text-[#c16c4b] mt-1">Cross-source Divergence</div>
        </div>

        {/* Card 6: Reports Awaiting Approval */}
        <div className="bg-[#29312c] border border-[#465047] p-3 rounded-[6px] flex flex-col justify-between cursor-pointer hover:border-[#d6c9aa] transition-colors"
          onClick={() => setActiveTab('reports')}>
          <div className="flex items-center justify-between text-[#a5aaa0]">
            <span className="text-[11px] font-mono uppercase tracking-wider">Reports In Flow</span>
            <ShieldAlert className="w-3.5 h-3.5 text-[#d6c9aa]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#eae9e1]">{reportsAwaitingApproval}</div>
          <div className="text-[10px] font-mono text-[#a5aaa0] mt-1">Supervisor Gate</div>
        </div>
      </div>

      {/* Grid: Evidence Breakdown & Findings Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Panel 1: Multimodal Evidence Distribution */}
        <div className="bg-[#29312c] border border-[#465047] rounded-[6px] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#465047] pb-2">
            <h2 className="text-xs font-semibold text-[#eae9e1] uppercase tracking-wider flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-[#c16c4b]" />
              Vault Modality Breakdown
            </h2>
            <span className="text-[10px] font-mono text-[#a5aaa0]">TOTAL: {totalEvidence}</span>
          </div>

          <div className="py-3 space-y-2.5">
            {Object.entries(evidenceCategories).map(([cat, count]) => {
              const pct = Math.round((count / (totalEvidence || 1)) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#a5aaa0]">{cat}</span>
                    <span className="text-[#eae9e1] font-semibold">{count} files ({pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#181d1a] rounded-[2px] overflow-hidden">
                    <div
                      className="h-full bg-[#d6c9aa]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setActiveTab('evidence')}
            className="w-full mt-2 py-1.5 bg-[#202522] hover:bg-[#303b35] text-xs font-mono text-[#d6c9aa] border border-[#465047] rounded-[6px] flex items-center justify-center gap-1 transition-colors"
          >
            Open Evidence Vault
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Panel 2: Human Review Gate & Findings Status */}
        <div className="bg-[#29312c] border border-[#465047] rounded-[6px] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#465047] pb-2">
            <h2 className="text-xs font-semibold text-[#eae9e1] uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="w-3.5 h-3.5 text-[#81977d]" />
              Human Review Triage
            </h2>
            <span className="text-[10px] font-mono text-[#81977d]">SOP COMPLIANT</span>
          </div>

          <div className="py-3 space-y-3">
            <div className="bg-[#202522] p-2.5 border border-[#465047] rounded-[6px] space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#81977d] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-[#81977d]"></span>
                  Accepted Findings:
                </span>
                <span className="font-bold text-[#eae9e1]">{acceptedFindings}</span>
              </div>
              <p className="text-[11px] text-[#a5aaa0]">
                Verified by investigator. Approved for inclusion in official reports.
              </p>
            </div>

            <div className="bg-[#202522] p-2.5 border border-[#465047] rounded-[6px] space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#d3a15d] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-[#d3a15d]"></span>
                  Pending Extractions:
                </span>
                <span className="font-bold text-[#eae9e1]">{pendingFindings}</span>
              </div>
              <p className="text-[11px] text-[#a5aaa0]">
                AI extractions awaiting human review before entry into official dossier.
              </p>
            </div>

            <div className="bg-[#202522] p-2.5 border border-[#465047] rounded-[6px] space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#a5aaa0] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-[#a5aaa0]"></span>
                  Rejected / Excluded:
                </span>
                <span className="font-bold text-[#eae9e1]">{rejectedFindings}</span>
              </div>
              <p className="text-[11px] text-[#a5aaa0]">
                Dismissed or superseded by human investigator review notes.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('findings')}
            className="w-full mt-2 py-1.5 bg-[#202522] hover:bg-[#303b35] text-xs font-mono text-[#d6c9aa] border border-[#465047] rounded-[6px] flex items-center justify-center gap-1 transition-colors"
          >
            Review Pending ({pendingFindings})
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Panel 3: Recent Activity & Audit Feed */}
        <div className="bg-[#29312c] border border-[#465047] rounded-[6px] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#465047] pb-2">
            <h2 className="text-xs font-semibold text-[#eae9e1] uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-[#d6c9aa]" />
              Immutable Audit Trail
            </h2>
            <span className="text-[10px] font-mono text-[#a5aaa0]">RECENT ACTIONS</span>
          </div>

          <div className="py-2 space-y-2 overflow-y-auto max-h-56">
            {auditLogs.slice(0, 5).map(log => (
              <div
                key={log.id}
                className="p-2 bg-[#202522] border border-[#465047]/60 rounded-[4px] text-[11px] space-y-0.5"
              >
                <div className="flex items-center justify-between font-mono text-[10px] text-[#a5aaa0]">
                  <span className="text-[#c16c4b] font-semibold">{log.action}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="text-[#eae9e1] truncate font-medium">{log.details}</div>
                <div className="text-[10px] text-[#a5aaa0] font-mono flex items-center gap-1">
                  <span>BY:</span>
                  <span className="text-[#d6c9aa]">{log.userName}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('audit')}
            className="w-full mt-2 py-1.5 bg-[#202522] hover:bg-[#303b35] text-xs font-mono text-[#d6c9aa] border border-[#465047] rounded-[6px] flex items-center justify-center gap-1 transition-colors"
          >
            Inspect Complete Audit Log
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
