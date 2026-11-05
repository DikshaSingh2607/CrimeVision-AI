/**
 * CrimeVision AI - Human Review & Approval Workspace
 * Mandatory human-in-the-loop triage for extracted AI findings
 */

import React, { useState } from 'react';
import {
  CheckSquare,
  Check,
  X,
  Edit3,
  Search,
  Filter,
  AlertTriangle,
  History,
  FileText,
  ShieldAlert,
  Save
} from 'lucide-react';
import { Finding, FindingCategory, ReviewStatus } from '../../types/forensic';

interface FindingsReviewViewProps {
  findings: Finding[];
  onReviewFinding: (
    findingId: string,
    data: {
      reviewStatus: ReviewStatus;
      extractedInformation?: string;
      investigatorNotes?: string;
    }
  ) => Promise<void>;
}

export const FindingsReviewView: React.FC<FindingsReviewViewProps> = ({
  findings,
  onReviewFinding
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Editing state
  const [editingFinding, setEditingFinding] = useState<Finding | null>(null);
  const [editText, setEditText] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const filteredFindings = findings.filter(f => {
    const matchesStatus = statusFilter === 'ALL' || f.reviewStatus === statusFilter;
    const matchesCat = categoryFilter === 'ALL' || f.category === categoryFilter;
    const matchesSearch =
      f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.extractedInformation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.evidenceFileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.originalTextExcerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesCat && matchesSearch;
  });

  const handleStartEdit = (f: Finding) => {
    setEditingFinding(f);
    setEditText(f.extractedInformation);
    setEditNotes(f.investigatorNotes || '');
  };

  const handleSaveEdit = async () => {
    if (!editingFinding) return;
    setSaving(true);
    try {
      await onReviewFinding(editingFinding.id, {
        reviewStatus: 'ACCEPTED', // Editing implies accepting the corrected version
        extractedInformation: editText,
        investigatorNotes: editNotes
      });
      setEditingFinding(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleQuickAction = async (f: Finding, status: ReviewStatus) => {
    await onReviewFinding(f.id, {
      reviewStatus: status,
      investigatorNotes: status === 'ACCEPTED' ? 'Verified by investigator.' : 'Dismissed as uncorroborated.'
    });
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#29312c] border border-[#465047] rounded-[6px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-sm font-semibold text-[#eae9e1] flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#81977d]" />
            Human Review & Approval Workspace
          </h1>
          <p className="text-xs text-[#a5aaa0] mt-0.5 font-mono">
            Mandatory gate: Only ACCEPTED findings enter official forensic reports.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-1 bg-[#181d1a] border border-[#d3a15d] text-[#d3a15d] rounded-[4px]">
            PENDING: {findings.filter(f => f.reviewStatus === 'PENDING').length}
          </span>
          <span className="px-2 py-1 bg-[#181d1a] border border-[#81977d] text-[#81977d] rounded-[4px]">
            ACCEPTED: {findings.filter(f => f.reviewStatus === 'ACCEPTED').length}
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#a5aaa0]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search findings by ID, extracted text, or evidence source..."
            className="w-full bg-[#1b211e] border border-[#465047] focus:border-[#d6c9aa] text-xs text-[#eae9e1] placeholder-[#a5aaa0]/60 pl-8 pr-3 py-1.5 rounded-[6px] focus:outline-none font-mono"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5">
          {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 text-[10px] font-mono rounded-[4px] border transition-colors ${
                statusFilter === st
                  ? 'bg-[#303b35] text-[#d6c9aa] border-[#d6c9aa]'
                  : 'bg-[#202522] text-[#a5aaa0] border-[#465047] hover:text-[#eae9e1]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#202522] border border-[#465047] text-xs font-mono text-[#eae9e1] px-2 py-1 rounded-[4px] focus:outline-none"
          >
            <option value="ALL">ALL CATEGORIES</option>
            <option value="PERSON">PERSON</option>
            <option value="LOCATION">LOCATION</option>
            <option value="VEHICLE">VEHICLE</option>
            <option value="OBJECT">OBJECT</option>
            <option value="TIME">TIME</option>
            <option value="DATE">DATE</option>
            <option value="EVENT">EVENT</option>
          </select>
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {filteredFindings.map((f) => (
          <div
            key={f.id}
            className={`bg-[#29312c] border rounded-[6px] p-4 space-y-3 transition-colors ${
              f.reviewStatus === 'ACCEPTED'
                ? 'border-[#81977d]/60'
                : f.reviewStatus === 'REJECTED'
                ? 'border-[#465047] opacity-60'
                : 'border-[#d3a15d]'
            }`}
          >
            {/* Finding Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#1b211e] text-[#d6c9aa] border border-[#465047] rounded-[3px]">
                  {f.id}
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono bg-[#202522] border border-[#465047] text-[#a5aaa0] rounded-[3px]">
                  {f.category}
                </span>
                <span className="text-[10px] font-mono text-[#81977d] border border-[#81977d]/40 px-1.5 py-0.5 rounded-[3px]">
                  {Math.round(f.confidenceIndicator * 100)}% CONF
                </span>

                {f.isFlaggedForConflict && (
                  <span className="px-1.5 py-0.5 text-[10px] font-mono bg-[#c16c4b]/20 border border-[#c16c4b]/60 text-[#ffdbcf] rounded-[3px] flex items-center gap-1 font-bold">
                    <AlertTriangle className="w-3 h-3 text-[#c16c4b]" />
                    CONFLICT FLAGGED
                  </span>
                )}
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-[3px] border ${
                    f.reviewStatus === 'ACCEPTED'
                      ? 'bg-[#81977d]/20 text-[#81977d] border-[#81977d]/60'
                      : f.reviewStatus === 'REJECTED'
                      ? 'bg-red-950/40 text-red-400 border-red-800'
                      : 'bg-[#d3a15d]/20 text-[#d3a15d] border-[#d3a15d]/60'
                  }`}
                >
                  STATUS: {f.reviewStatus}
                </span>

                {/* Quick Triage Buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleQuickAction(f, 'ACCEPTED')}
                    className="p-1 bg-[#202522] hover:bg-[#81977d]/20 text-[#81977d] border border-[#465047] hover:border-[#81977d] rounded-[4px] transition-colors"
                    title="Accept Finding"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleStartEdit(f)}
                    className="p-1 bg-[#202522] hover:bg-[#d6c9aa]/20 text-[#d6c9aa] border border-[#465047] hover:border-[#d6c9aa] rounded-[4px] transition-colors"
                    title="Edit Finding & Notes"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleQuickAction(f, 'REJECTED')}
                    className="p-1 bg-[#202522] hover:bg-red-950/40 text-red-400 border border-[#465047] hover:border-red-800 rounded-[4px] transition-colors"
                    title="Reject Finding"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Extracted Information Statement */}
            <div className="space-y-1">
              <div className="text-[11px] font-mono text-[#a5aaa0] uppercase">Extracted Fact / Observation:</div>
              <div className="text-xs font-semibold text-[#eae9e1] bg-[#202522] p-2.5 border border-[#465047]/60 rounded-[4px]">
                {f.extractedInformation}
              </div>
            </div>

            {/* Source Reference & Raw Excerpt */}
            <div className="bg-[#181d1a] p-2.5 border border-[#465047]/60 rounded-[4px] space-y-1 text-xs">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#a5aaa0]">
                <span className="text-[#d6c9aa] flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Source: {f.evidenceFileName} ({f.locationReference})
                </span>
                <span>ID: {f.evidenceId}</span>
              </div>
              <blockquote className="text-[11px] text-[#a5aaa0] italic border-l-2 border-[#465047] pl-2">
                "{f.originalTextExcerpt}"
              </blockquote>
            </div>

            {/* Investigator Notes / History */}
            {f.investigatorNotes && (
              <div className="text-[11px] font-mono text-[#81977d] flex items-start gap-1.5 pt-0.5">
                <History className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  Investigator Review Note ({f.reviewedByName || 'Investigator'}): {f.investigatorNotes}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Finding Modal */}
      {editingFinding && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#202522] border border-[#465047] rounded-[8px] max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#465047] pb-2">
              <h2 className="text-sm font-semibold text-[#eae9e1] flex items-center gap-2 font-mono">
                <Edit3 className="w-4 h-4 text-[#d6c9aa]" />
                Edit Finding // {editingFinding.id}
              </h2>
              <button
                onClick={() => setEditingFinding(null)}
                className="text-xs text-[#a5aaa0] hover:text-[#eae9e1] font-mono"
              >
                [ESC]
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#a5aaa0] font-mono uppercase mb-1">
                  Adjust Extracted Information
                </label>
                <textarea
                  rows={3}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full bg-[#181d1a] border border-[#465047] focus:border-[#d6c9aa] px-3 py-1.5 rounded-[6px] text-[#eae9e1] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[#a5aaa0] font-mono uppercase mb-1">
                  Investigator Corroboration Notes
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="State justification for edit or reference corroborating evidence..."
                  className="w-full bg-[#181d1a] border border-[#465047] focus:border-[#d6c9aa] px-3 py-1.5 rounded-[6px] text-[#eae9e1] focus:outline-none font-mono"
                />
              </div>

              <div className="bg-[#181d1a] p-2 rounded-[4px] text-[10px] font-mono text-[#a5aaa0]">
                Original AI Extraction: "{editingFinding.extractedInformation}"
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#465047]">
                <button
                  type="button"
                  onClick={() => setEditingFinding(null)}
                  className="px-3 py-1.5 bg-[#29312c] hover:bg-[#303b35] text-[#eae9e1] rounded-[6px] border border-[#465047] font-mono"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handleSaveEdit}
                  className="px-4 py-1.5 bg-[#81977d] hover:bg-[#6c8268] text-[#1b211e] font-bold rounded-[6px] font-mono transition-colors"
                >
                  {saving ? 'Saving...' : 'Accept Edited Finding'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
