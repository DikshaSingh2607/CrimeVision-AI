/**
 * CrimeVision AI - Chronological Case Timeline
 * Tactical scrub bar, vertical timeline, citation links, unanchored events drawer
 */

import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  AlertTriangle,
  FileText,
  Filter,
  Search,
  CheckCircle2,
  ChevronRight,
  Layers,
  HelpCircle
} from 'lucide-react';
import { TimelineEvent } from '../../types/forensic';

interface TimelineViewProps {
  timeline: TimelineEvent[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ timeline }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [activeScrubIndex, setActiveScrubIndex] = useState<number>(0);

  // Separate dated events from unknown dates
  const datedEvents = timeline.filter(t => t.time !== 'UNKNOWN' && t.date !== 'UNKNOWN');
  const undatedEvents = timeline.filter(t => t.time === 'UNKNOWN' || t.date === 'UNKNOWN');

  // Filter dated events
  const filteredDated = datedEvents.filter(t => {
    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesSrc = selectedSource === 'ALL' || t.evidenceSource.fileName === selectedSource;
    return matchesCat && matchesSrc;
  });

  const uniqueSources = Array.from(new Set(timeline.map(t => t.evidenceSource.fileName)));

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-[#29312c] border border-[#465047] rounded-[6px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-sm font-semibold text-[#eae9e1] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#c16c4b]" />
            Chronological Forensic Timeline
          </h1>
          <p className="text-xs text-[#a5aaa0] mt-0.5 font-mono">
            Interactive reconstruction from sensor alarms, witness statements, and physical logs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-1 bg-[#181d1a] border border-[#465047] text-[#d6c9aa] rounded-[4px]">
            {datedEvents.length} TIME-ANCHORED
          </span>
          <span className="px-2 py-1 bg-[#181d1a] border border-[#c16c4b]/50 text-[#ffdbcf] rounded-[4px]">
            {undatedEvents.length} UNANCHORED
          </span>
        </div>
      </div>

      {/* Tactical Timeline Scrub Bar (Obsidian & Oxide Specification) */}
      <div className="bg-[#1b211e] border border-[#465047] p-3 rounded-[6px] space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#a5aaa0]">
          <span className="flex items-center gap-1.5 text-[#d6c9aa]">
            <Layers className="w-3.5 h-3.5" />
            CHRONOLOGICAL SCRUB RAIL // 2026-10-14 INCIDENT WINDOW
          </span>
          <span className="text-[#81977d]">20:30 UTC — 21:15 UTC</span>
        </div>

        {/* Track */}
        <div className="relative h-6 bg-[#202522] border border-[#465047] rounded-[4px] flex items-center px-4">
          <div className="absolute inset-x-4 h-1 bg-[#181d1a] border-t border-b border-[#465047]/60" />

          {/* Tick markers */}
          <div className="relative w-full flex items-center justify-between z-0">
            {datedEvents.map((ev, i) => {
              const isSelected = activeScrubIndex === i;
              const isCritical = ev.category === 'INCIDENT' || ev.isContradicted;
              return (
                <button
                  key={ev.id}
                  onClick={() => setActiveScrubIndex(i)}
                  className="relative group focus:outline-none"
                  title={`${ev.time}: ${ev.description}`}
                >
                  {/* Scrubber pin */}
                  <div
                    className={`w-3 h-3 rounded-[2px] transition-transform ${
                      isSelected
                        ? 'bg-[#c16c4b] ring-2 ring-[#d6c9aa] scale-125'
                        : isCritical
                        ? 'bg-[#c16c4b]'
                        : 'bg-[#d6c9aa]'
                    }`}
                  />
                  {/* Time popup tooltip on hover */}
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden group-hover:block bg-[#101412] border border-[#465047] text-[10px] font-mono text-[#eae9e1] px-1.5 py-0.5 rounded whitespace-nowrap z-20 shadow-md">
                    {ev.time}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Scrubber Preview */}
        {datedEvents[activeScrubIndex] && (
          <div className="bg-[#202522] border border-[#465047]/60 p-2.5 rounded-[4px] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 truncate">
              <span className="text-[#c16c4b] font-bold">
                [{datedEvents[activeScrubIndex].time}]
              </span>
              <span className="text-[#eae9e1] truncate">
                {datedEvents[activeScrubIndex].description}
              </span>
            </div>
            <span className="text-[10px] text-[#a5aaa0] shrink-0 ml-2">
              SOURCE: {datedEvents[activeScrubIndex].evidenceSource.fileName}
            </span>
          </div>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#202522] p-2.5 border border-[#465047] rounded-[6px] text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-[#a5aaa0]" />
          <span className="text-[#a5aaa0] uppercase text-[10px]">Filter Modality:</span>
          {['ALL', 'INCIDENT', 'WITNESS_OBSERVATION', 'RECORDED_ACTIVITY', 'MOVEMENT'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 text-[10px] rounded-[3px] border transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#303b35] text-[#d6c9aa] border-[#d6c9aa]'
                  : 'bg-[#181d1a] text-[#a5aaa0] border-[#465047]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[#a5aaa0] uppercase text-[10px]">Source:</span>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="bg-[#181d1a] border border-[#465047] text-xs text-[#eae9e1] px-2 py-0.5 rounded-[3px] focus:outline-none"
          >
            <option value="ALL">ALL SOURCES</option>
            {uniqueSources.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Vertical Tactical Timeline Stream */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-[#465047]">
        {filteredDated.map((ev, index) => {
          const isCritical = ev.category === 'INCIDENT' || ev.isContradicted;
          return (
            <div key={ev.id} className="relative group">
              {/* Timeline Node Reticle */}
              <div
                className={`absolute -left-6 top-3.5 w-3 h-3 rounded-[2px] border ${
                  isCritical
                    ? 'bg-[#c16c4b] border-[#ffdbcf]'
                    : 'bg-[#1b211e] border-[#d6c9aa]'
                }`}
              />

              {/* Event Card */}
              <div
                className={`bg-[#29312c] border rounded-[6px] p-3 space-y-2 transition-all ${
                  ev.isContradicted
                    ? 'border-[#c16c4b] shadow-[0_0_0_1px_rgba(193,108,75,0.4)]'
                    : 'border-[#465047] hover:border-[#a5aaa0]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#c16c4b]">
                      {ev.time}
                    </span>
                    <span className="text-[10px] font-mono text-[#a5aaa0]">
                      ({ev.date})
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-mono bg-[#202522] border border-[#465047] text-[#a5aaa0] rounded-[3px]">
                      {ev.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#81977d]">
                    <span className="w-1.5 h-1.5 rounded-sm bg-[#81977d]" />
                    {ev.reviewStatus}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs font-medium text-[#eae9e1] leading-relaxed">
                  {ev.description}
                </p>

                {/* Contradiction Alert Box */}
                {ev.isContradicted && (
                  <div className="bg-[#1b211e] border border-[#c16c4b]/60 p-2 rounded-[4px] flex items-start gap-2 text-xs font-mono text-[#ffdbcf]">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#c16c4b] shrink-0 mt-0.5" />
                    <span>
                      CONTRADICTION DETECTED: {ev.contradictionNote}
                    </span>
                  </div>
                )}

                {/* Entity Tags & Evidence Citation */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#465047]/40 text-[10px] font-mono">
                  <div className="flex flex-wrap items-center gap-1">
                    <span className="text-[#a5aaa0]">ENTITIES:</span>
                    {ev.relatedEntities.map((ent, i) => (
                      <span key={i} className="px-1.5 py-0.5 bg-[#202522] border border-[#465047] text-[#d6c9aa] rounded-[3px]">
                        {ent}
                      </span>
                    ))}
                  </div>

                  <div className="text-[#a5aaa0] flex items-center gap-1">
                    <FileText className="w-3 h-3 text-[#d6c9aa]" />
                    Source: <span className="text-[#eae9e1]">{ev.evidenceSource.fileName}</span> ({ev.evidenceSource.locationRef})
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Undated / Unanchored Forensic Observations Drawer (Section 11 Requirement) */}
      {undatedEvents.length > 0 && (
        <div className="bg-[#181d1a] border border-[#465047] rounded-[6px] p-4 space-y-2 mt-6">
          <div className="flex items-center justify-between border-b border-[#465047] pb-2">
            <h2 className="text-xs font-semibold text-[#eae9e1] flex items-center gap-2 font-mono">
              <HelpCircle className="w-4 h-4 text-[#d3a15d]" />
              Unanchored Forensic Observations (Unknown Timestamps)
            </h2>
            <span className="text-[10px] font-mono text-[#d3a15d]">
              NO FABRICATED TIMESTAMPS APPLIED
            </span>
          </div>

          <p className="text-[11px] text-[#a5aaa0]">
            In strict compliance with forensic integrity, events without exact recorded dates or times are segregated here rather than assigned speculative clock times.
          </p>

          <div className="space-y-2 pt-1">
            {undatedEvents.map(ev => (
              <div key={ev.id} className="bg-[#202522] border border-[#465047] p-2.5 rounded-[4px] space-y-1 text-xs">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#a5aaa0]">
                  <span className="text-[#d3a15d] font-semibold">{ev.category}</span>
                  <span>SOURCE: {ev.evidenceSource.fileName} ({ev.evidenceSource.locationRef})</span>
                </div>
                <div className="text-[#eae9e1] font-medium">{ev.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
