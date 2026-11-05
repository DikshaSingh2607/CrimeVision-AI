/**
 * CrimeVision AI - Official Forensic Report Generation & Chain-of-Custody Approval
 * 10 mandatory forensic sections, versioning, supervisor signoff, and PDF export
 */

import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  XCircle,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Layers,
  ChevronRight,
  ShieldAlert,
  Edit2
} from 'lucide-react';
import { ForensicReport, User } from '../../types/forensic';
import { jsPDF } from 'jspdf';

interface ReportsViewProps {
  caseId: string;
  reports: ForensicReport[];
  currentUser: User;
  onCreateReport: (caseId: string, title?: string) => Promise<void>;
  onApproveReport: (
    reportId: string,
    action: 'INVESTIGATOR_APPROVE' | 'SUPERVISOR_APPROVE' | 'SUPERVISOR_REJECT',
    comments?: string
  ) => Promise<void>;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  caseId,
  reports,
  currentUser,
  onCreateReport,
  onApproveReport
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string>(
    reports.length > 0 ? reports[0].id : ''
  );
  const [supervisorComments, setSupervisorComments] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const activeReport = reports.find(r => r.id === selectedReportId) || reports[0];

  const handleCreateNewDraft = async () => {
    setIsGenerating(true);
    try {
      await onCreateReport(caseId, `Forensic Intelligence Dossier (${caseId} - Rev ${reports.length + 1})`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = () => {
    if (!activeReport) return;
    const doc = new jsPDF();
    const margin = 15;
    let y = 20;

    // Header
    doc.setFont('courier', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(30, 30, 30);
    doc.text('CRIMEVISION AI // OFFICIAL FORENSIC INTELLIGENCE DOSSIER', margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('courier', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`REPORT ID: ${activeReport.id} | VERSION: ${activeReport.version} | STATUS: ${activeReport.status}`, margin, y);
    y += 6;
    doc.text(`GENERATED: ${new Date(activeReport.createdAt).toUTCString()}`, margin, y);
    y += 10;
    doc.line(margin, y, 195, y);
    y += 10;

    // Section 1: Overview
    doc.setFont('courier', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 20);
    doc.text('1. CASE OVERVIEW', margin, y);
    y += 6;
    doc.setFont('courier', 'normal');
    doc.setFontSize(9);
    const splitOverview = doc.splitTextToSize(activeReport.sections.caseOverview, 180);
    doc.text(splitOverview, margin, y);
    y += splitOverview.length * 5 + 6;

    // Section 2: Details
    doc.setFont('courier', 'bold');
    doc.setFontSize(12);
    doc.text('2. CASE REGISTRY DETAILS', margin, y);
    y += 6;
    doc.setFont('courier', 'normal');
    doc.setFontSize(9);
    Object.entries(activeReport.sections.caseDetails).forEach(([k, v]) => {
      doc.text(`${k.padEnd(24, ' ')}: ${v}`, margin, y);
      y += 5;
    });
    y += 6;

    // Section 5: Relevant Findings
    doc.setFont('courier', 'bold');
    doc.setFontSize(12);
    doc.text('3. ACCEPTED FORENSIC FINDINGS', margin, y);
    y += 6;
    doc.setFont('courier', 'normal');
    doc.setFontSize(9);
    activeReport.sections.relevantFindings.forEach((rf, i) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(`[${i + 1}] [${rf.category}] ${rf.detail}`, margin, y);
      y += 4;
      doc.setTextColor(120, 120, 120);
      doc.text(`    Source: ${rf.source} (${rf.locationRef})`, margin, y);
      doc.setTextColor(20, 20, 20);
      y += 6;
    });
    y += 4;

    // Limitations & Disclaimer
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('courier', 'bold');
    doc.setFontSize(11);
    doc.text('LEGAL LIMITATIONS & FORENSIC NOTICE:', margin, y);
    y += 6;
    doc.setFont('courier', 'italic');
    doc.setFontSize(8);
    const splitDisclaimer = doc.splitTextToSize(activeReport.sections.conclusionAndLimitations, 180);
    doc.text(splitDisclaimer, margin, y);

    doc.save(`${activeReport.id}_Forensic_Dossier.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-[#29312c] border border-[#465047] rounded-[6px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 no-print">
        <div>
          <h1 className="text-sm font-semibold text-[#eae9e1] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#c16c4b]" />
            Official Forensic Dossier & Report Drafting
          </h1>
          <p className="text-xs text-[#a5aaa0] mt-0.5 font-mono">
            Compiles verified accepted findings into structured intelligence dossiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateNewDraft}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#202522] hover:bg-[#303b35] text-[#eae9e1] text-xs font-mono font-semibold rounded-[6px] border border-[#465047] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Generate New Draft
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c16c4b] hover:bg-[#a85a3c] text-[#eae9e1] text-xs font-mono font-semibold rounded-[6px] border border-transparent shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Official PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#202522] hover:bg-[#303b35] text-[#d6c9aa] text-xs font-mono rounded-[6px] border border-[#465047] transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>
        </div>
      </div>

      {/* Version Selector Bar */}
      <div className="flex items-center gap-2 no-print bg-[#202522] p-2.5 border border-[#465047] rounded-[6px]">
        <span className="text-[11px] font-mono text-[#a5aaa0] uppercase">Dossier Versions:</span>
        <div className="flex items-center gap-2 overflow-x-auto">
          {reports.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedReportId(r.id)}
              className={`px-2.5 py-1 text-xs font-mono rounded-[4px] border transition-colors flex items-center gap-1.5 ${
                r.id === activeReport.id
                  ? 'bg-[#303b35] text-[#d6c9aa] border-[#d6c9aa]'
                  : 'bg-[#181d1a] text-[#a5aaa0] border-[#465047] hover:text-[#eae9e1]'
              }`}
            >
              <span>{r.version} ({r.id})</span>
              <span className={`text-[10px] ${
                r.status === 'SUPERVISOR_APPROVED' ? 'text-[#81977d]' :
                r.status === 'INVESTIGATOR_APPROVED' ? 'text-[#d3a15d]' : 'text-[#a5aaa0]'
              }`}>
                [{r.status}]
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeReport ? (
        <div className="space-y-4">
          {/* Approval Action Bar */}
          <div className="bg-[#1b211e] border border-[#465047] p-3.5 rounded-[6px] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 no-print">
            <div className="space-y-1">
              <div className="text-xs font-mono font-semibold text-[#eae9e1] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#81977d]" />
                Chain-of-Custody Approval Gate:
                <span className="text-[#d6c9aa]">[{activeReport.status}]</span>
              </div>
              <p className="text-[11px] text-[#a5aaa0] font-mono">
                Workflow: Investigator generates draft → Investigator approves → Supervisor grants final signoff.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Investigator Approval Button */}
              {activeReport.status === 'DRAFT' && (
                <button
                  onClick={() => onApproveReport(activeReport.id, 'INVESTIGATOR_APPROVE')}
                  className="px-3 py-1.5 bg-[#81977d] hover:bg-[#6c8268] text-[#1b211e] font-bold text-xs font-mono rounded-[4px] flex items-center gap-1 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approve as Investigator
                </button>
              )}

              {/* Supervisor Review Actions */}
              {(currentUser.role === 'SUPERVISOR' || currentUser.role === 'ADMIN') && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={supervisorComments}
                    onChange={(e) => setSupervisorComments(e.target.value)}
                    placeholder="Supervisor sign-off notes..."
                    className="bg-[#202522] border border-[#465047] text-xs font-mono text-[#eae9e1] px-2.5 py-1 rounded-[4px] focus:outline-none"
                  />
                  <button
                    onClick={() => onApproveReport(activeReport.id, 'SUPERVISOR_APPROVE', supervisorComments)}
                    className="px-3 py-1.5 bg-[#81977d] hover:bg-[#6c8268] text-[#1b211e] font-bold text-xs font-mono rounded-[4px] flex items-center gap-1 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Supervisor Sign-Off
                  </button>
                  <button
                    onClick={() => onApproveReport(activeReport.id, 'SUPERVISOR_REJECT', supervisorComments)}
                    className="px-2.5 py-1.5 bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800 text-xs font-mono rounded-[4px] flex items-center gap-1 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Official Forensic Report Sheet (Print Ready) */}
          <div className="report-sheet bg-[#29312c] border border-[#465047] rounded-[6px] p-6 space-y-6 shadow-md text-xs">
            {/* Report Header */}
            <div className="border-b-2 border-[#465047] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-[10px] font-mono text-[#c16c4b] font-bold tracking-widest uppercase">
                  CONFIDENTIAL // LAW ENFORCEMENT DECISION-SUPPORT DOSSIER
                </div>
                <h1 className="text-base font-bold text-[#eae9e1] font-mono mt-0.5">
                  {activeReport.title}
                </h1>
                <div className="text-[11px] font-mono text-[#a5aaa0] mt-1">
                  Report ID: {activeReport.id} | Version: {activeReport.version} | Case Reference: {activeReport.caseId}
                </div>
              </div>

              <div className="text-right font-mono text-[10px] text-[#a5aaa0] shrink-0">
                <div>CREATED: {new Date(activeReport.createdAt).toUTCString()}</div>
                <div>PREPARED BY: {activeReport.createdByName}</div>
                <div className="text-[#81977d] font-bold mt-1">STATUS: {activeReport.status}</div>
              </div>
            </div>

            {/* SECTION 1: Case Overview */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold font-mono text-[#d6c9aa] uppercase tracking-wider border-b border-[#465047]/40 pb-1">
                1. Case Overview & Incident Summary
              </h2>
              <p className="text-xs text-[#eae9e1] leading-relaxed">
                {activeReport.sections.caseOverview}
              </p>
            </div>

            {/* SECTION 2: Case Details */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold font-mono text-[#d6c9aa] uppercase tracking-wider border-b border-[#465047]/40 pb-1">
                2. Case Details & Registry Metadata
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-[#202522] p-3 border border-[#465047]/60 rounded-[4px] font-mono text-[11px]">
                {Object.entries(activeReport.sections.caseDetails).map(([k, v]) => (
                  <div key={k}>
                    <div className="text-[#a5aaa0] text-[10px]">{k}</div>
                    <div className="text-[#eae9e1] font-semibold">{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3 & 4: Evidence Inventory & Processing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <h2 className="text-xs font-bold font-mono text-[#d6c9aa] uppercase tracking-wider border-b border-[#465047]/40 pb-1">
                  3. Evidence Inventory Summary
                </h2>
                <p className="text-[11px] text-[#a5aaa0] leading-relaxed">
                  {activeReport.sections.evidenceInventorySummary}
                </p>
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xs font-bold font-mono text-[#d6c9aa] uppercase tracking-wider border-b border-[#465047]/40 pb-1">
                  4. Processing Pipeline Execution
                </h2>
                <p className="text-[11px] text-[#a5aaa0] leading-relaxed">
                  {activeReport.sections.evidenceProcessingSummary}
                </p>
              </div>
            </div>

            {/* SECTION 5: Relevant Accepted Findings */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold font-mono text-[#d6c9aa] uppercase tracking-wider border-b border-[#465047]/40 pb-1 flex items-center justify-between">
                <span>5. Verified Findings (Human Investigator Vetted)</span>
                <span className="text-[10px] text-[#81977d]">ACCEPTED ONLY</span>
              </h2>

              <div className="space-y-2">
                {activeReport.sections.relevantFindings.map((rf, i) => (
                  <div key={i} className="bg-[#202522] p-2.5 border border-[#465047]/60 rounded-[4px] space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-[#c16c4b] font-bold">[{rf.category}]</span>
                      <span className="text-[#a5aaa0]">Source: {rf.source} ({rf.locationRef})</span>
                    </div>
                    <div className="text-xs text-[#eae9e1]">{rf.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 6: Chronological Timeline */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold font-mono text-[#d6c9aa] uppercase tracking-wider border-b border-[#465047]/40 pb-1">
                6. Chronological Incident Sequence
              </h2>
              <div className="space-y-1.5 font-mono text-[11px]">
                {activeReport.sections.chronologicalTimeline.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-1.5 bg-[#202522] border border-[#465047]/40 rounded-[3px]">
                    <span className="text-[#c16c4b] font-bold shrink-0">{item.time}</span>
                    <span className="text-[#eae9e1] flex-1">{item.event}</span>
                    <span className="text-[#a5aaa0] shrink-0 text-[10px]">{item.source}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 7: Inconsistencies & Conflict Analysis */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold font-mono text-[#d6c9aa] uppercase tracking-wider border-b border-[#465047]/40 pb-1">
                7. Identified Inconsistencies & Investigator Resolutions
              </h2>
              <div className="space-y-2">
                {activeReport.sections.inconsistenciesIdentified.map((incon, idx) => (
                  <div key={idx} className="bg-[#202522] border border-[#465047] p-2.5 rounded-[4px] space-y-1 text-xs">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-[#c16c4b] font-bold">{incon.title}</span>
                      <span className="text-[#d6c9aa]">STATUS: {incon.resolutionStatus}</span>
                    </div>
                    <div className="text-[#a5aaa0] text-[11px]">{incon.description}</div>
                    {incon.notes && (
                      <div className="text-[11px] font-mono text-[#81977d] pt-1 border-t border-[#465047]/30">
                        Resolution Notes: {incon.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 8: Investigator Review Notes */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold font-mono text-[#d6c9aa] uppercase tracking-wider border-b border-[#465047]/40 pb-1">
                8. Investigator Review Notes
              </h2>
              <p className="text-xs text-[#a5aaa0] leading-relaxed">
                {activeReport.sections.investigatorReviewNotes}
              </p>
            </div>

            {/* SECTION 9: Conclusion & Forensic Limitations */}
            <div className="bg-[#181d1a] border border-[#c16c4b]/40 p-3 rounded-[4px] space-y-1.5">
              <h2 className="text-xs font-bold font-mono text-[#ffdbcf] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#c16c4b]" />
                9. Legal Limitations & Decision-Support Notice
              </h2>
              <p className="text-[11px] text-[#a5aaa0] leading-relaxed">
                {activeReport.sections.conclusionAndLimitations}
              </p>
            </div>

            {/* SECTION 10: Cryptographic Hash Ledger */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold font-mono text-[#d6c9aa] uppercase tracking-wider border-b border-[#465047]/40 pb-1">
                10. Evidentiary References & Cryptographic SHA-256 Ledger
              </h2>
              <div className="bg-[#181d1a] border border-[#465047] p-3 rounded-[4px] font-mono text-[10px] space-y-1 max-h-48 overflow-y-auto">
                {activeReport.sections.evidenceCryptographicReferences.map((ref, idx) => (
                  <div key={idx} className="flex justify-between border-b border-[#465047]/30 pb-1 last:border-b-0">
                    <span className="text-[#eae9e1]">{ref.fileName} ({ref.category})</span>
                    <span className="text-[#81977d]">{ref.sha256}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Signatures Block */}
            <div className="pt-4 border-t border-[#465047] grid grid-cols-2 gap-4 font-mono text-[11px]">
              <div className="p-3 bg-[#202522] border border-[#465047] rounded-[4px] space-y-1">
                <div className="text-[10px] text-[#a5aaa0]">INVESTIGATOR APPROVAL SIGNATURE:</div>
                <div className="text-[#eae9e1] font-bold">
                  {activeReport.investigatorApproval?.approvedByName || activeReport.createdByName}
                </div>
                <div className="text-[10px] text-[#81977d]">
                  Timestamp: {activeReport.investigatorApproval?.timestamp ? new Date(activeReport.investigatorApproval.timestamp).toUTCString() : 'Pending final review'}
                </div>
              </div>

              <div className="p-3 bg-[#202522] border border-[#465047] rounded-[4px] space-y-1">
                <div className="text-[10px] text-[#a5aaa0]">SUPERVISORY OVERSIGHT SIGN-OFF:</div>
                <div className="text-[#eae9e1] font-bold">
                  {activeReport.supervisorReview?.reviewedByName || 'Capt. Raymond Vance'}
                </div>
                <div className="text-[10px] text-[#81977d]">
                  Decision: {activeReport.supervisorReview?.decision || 'Under Supervisory Review'}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-[#a5aaa0] font-mono text-xs">
          No reports generated yet. Click "Generate New Draft" above to create an official dossier.
        </div>
      )}
    </div>
  );
};
