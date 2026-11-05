/**
 * CrimeVision AI - Conflict & Consistency Detection Workspace
 * Cross-evidence discrepancy flags, side-by-side excerpts, investigator resolution
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  FileText,
  Save,
  ShieldAlert,
  ArrowRightLeft,
  ChevronDown,
  Layers
} from 'lucide-react';
import { ConflictFlag, ConflictSeverity } from '../../types/forensic';

interface ConflictDetectionViewProps {
  flags: ConflictFlag[];
  onUpdateFlag: (
    flagId: string,
    data: {
      status: ConflictFlag['status'];
      resolutionNotes?: string;
    }
  ) => Promise<void>;
}

export const ConflictDetectionView: React.FC<ConflictDetectionViewProps> = ({
  flags,
  onUpdateFlag
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [resolutionDrafts, setResolutionDrafts] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const filteredFlags = flags.filter(fl => {
    return selectedStatus === 'ALL' || fl.status === selectedStatus;
  });

  const handleNotesChange = (flagId: string, text: string) => {
    setResolutionDrafts(prev => ({ ...prev, [flagId]: text }));
  };

  const handleSaveResolution = async (flag: ConflictFlag, newStatus: ConflictFlag['status']) => {
    setSavingId(flag.id);
    const notes = resolutionDrafts[flag.id] !== undefined ? resolutionDrafts[flag.id] : flag.resolutionNotes;
    try {
      await onUpdateFlag(flag.id, {
        status: newStatus,
        resolutionNotes: notes
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  const getSeverityBadge = (sev: ConflictSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#c16c4b]/20 border border-[#c16c4b]/60 text-[#ffdbcf] rounded-[3px]">
            CRITICAL CONFLICT
          </span>
        );
      case 'MODERATE':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#d3a15d]/20 border border-[#d3a15d]/60 text-[#efe1c1] rounded-[3px]">
            MODERATE DISCREPANCY
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#202522] border border-[#465047] text-[#a5aaa0] rounded-[3px]">
            ADVISORY
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#29312c] border border-[#465047] rounded-[6px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-sm font-semibold text-[#eae9e1] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#c16c4b]" />
            AI-Assisted Cross-Source Conflict Detection
          </h1>
          <p className="text-xs text-[#a5aaa0] mt-0.5 font-mono">
            Flags evidentiary inconsistencies without taking sides. Human investigator holds sole resolution authority.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-1 bg-[#181d1a] border border-[#c16c4b]/60 text-[#ffdbcf] rounded-[4px]">
            DETECTED: {flags.filter(f => f.status === 'DETECTED').length}
          </span>
          <span className="px-2 py-1 bg-[#181d1a] border border-[#81977d]/60 text-[#81977d] rounded-[4px]">
            RESOLVED: {flags.filter(f => f.status === 'RESOLVED').length}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5">
        {['ALL', 'DETECTED', 'UNDER_INVESTIGATION', 'RESOLVED'].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-3 py-1 text-xs font-mono rounded-[4px] border transition-colors ${
              selectedStatus === st
                ? 'bg-[#303b35] text-[#d6c9aa] border-[#d6c9aa]'
                : 'bg-[#202522] text-[#a5aaa0] border-[#465047] hover:text-[#eae9e1]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Conflict Flags List */}
      <div className="space-y-4">
        {filteredFlags.map((flag) => {
          const currentNotes = resolutionDrafts[flag.id] !== undefined
            ? resolutionDrafts[flag.id]
            : (flag.resolutionNotes || '');

          return (
            <div
              key={flag.id}
              className={`bg-[#29312c] border rounded-[6px] p-4 space-y-3 transition-colors ${
                flag.status === 'RESOLVED'
                  ? 'border-[#81977d]/60'
                  : 'border-[#c16c4b]'
              }`}
            >
              {/* Top Meta Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#1b211e] text-[#d6c9aa] border border-[#465047] rounded-[3px]">
                    {flag.id}
                  </span>
                  {getSeverityBadge(flag.severity)}
                  <span className="text-[10px] font-mono text-[#a5aaa0] uppercase">
                    MODALITY: {flag.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-[3px] border ${
                    flag.status === 'RESOLVED'
                      ? 'bg-[#81977d]/20 text-[#81977d] border-[#81977d]/60'
                      : 'bg-[#c16c4b]/20 text-[#ffdbcf] border-[#c16c4b]/60'
                  }`}>
                    {flag.status}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-[#eae9e1]">{flag.title}</h2>
                <p className="text-xs text-[#a5aaa0] leading-relaxed">{flag.description}</p>
              </div>

              {/* Side-by-Side Contradicting Excerpts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                {/* Source A */}
                <div className="bg-[#181d1a] border border-[#465047] p-3 rounded-[6px] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#c16c4b]">
                    <span className="font-bold flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      SOURCE A: {flag.sourceA.fileName}
                    </span>
                    <span className="text-[#a5aaa0]">({flag.sourceA.locationRef})</span>
                  </div>
                  <blockquote className="text-[11px] text-[#eae9e1] italic border-l-2 border-[#c16c4b] pl-2 leading-relaxed">
                    "{flag.sourceA.excerpt}"
                  </blockquote>
                </div>

                {/* Source B */}
                <div className="bg-[#181d1a] border border-[#465047] p-3 rounded-[6px] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#d6c9aa]">
                    <span className="font-bold flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      SOURCE B: {flag.sourceB.fileName}
                    </span>
                    <span className="text-[#a5aaa0]">({flag.sourceB.locationRef})</span>
                  </div>
                  <blockquote className="text-[11px] text-[#eae9e1] italic border-l-2 border-[#d6c9aa] pl-2 leading-relaxed">
                    "{flag.sourceB.excerpt}"
                  </blockquote>
                </div>
              </div>

              {/* Investigator Resolution Notes & Controls */}
              <div className="bg-[#202522] border border-[#465047] p-3 rounded-[6px] space-y-2 text-xs">
                <label className="block text-[11px] font-mono text-[#a5aaa0] uppercase">
                  Investigator Corroboration & Resolution Rationale
                </label>
                <textarea
                  rows={2}
                  value={currentNotes}
                  onChange={(e) => handleNotesChange(flag.id, e.target.value)}
                  placeholder="Record reconciliation hypothesis (e.g. ambient lighting distortion, dwell time between arrival and departure)..."
                  className="w-full bg-[#181d1a] border border-[#465047] focus:border-[#d6c9aa] px-3 py-1.5 rounded-[4px] text-[#eae9e1] focus:outline-none font-mono text-xs"
                />

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="text-[10px] font-mono text-[#a5aaa0]">
                    {flag.resolvedByName && (
                      <span>Resolved by {flag.resolvedByName} on {new Date(flag.resolvedAt || '').toLocaleDateString()}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSaveResolution(flag, 'UNDER_INVESTIGATION')}
                      disabled={savingId === flag.id}
                      className="px-2.5 py-1 bg-[#29312c] hover:bg-[#303b35] text-[#d6c9aa] border border-[#465047] rounded-[4px] text-[11px] font-mono transition-colors"
                    >
                      Mark Under Investigation
                    </button>
                    <button
                      onClick={() => handleSaveResolution(flag, 'RESOLVED')}
                      disabled={savingId === flag.id}
                      className="px-3 py-1 bg-[#81977d] hover:bg-[#6c8268] text-[#1b211e] font-bold rounded-[4px] text-[11px] font-mono flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark As Resolved
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
