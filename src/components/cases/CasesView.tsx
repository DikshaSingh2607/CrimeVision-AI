/**
 * CrimeVision AI - Case Management Workspace
 * Isolated case collections, assigned personnel, status management
 */

import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Calendar,
  MapPin,
  Users,
  Shield,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FolderGit2
} from 'lucide-react';
import { Case, User } from '../../types/forensic';

interface CasesViewProps {
  cases: Case[];
  activeCaseId: string;
  onSelectCase: (caseId: string) => void;
  currentUser: User;
  availableUsers: User[];
  onCreateCase: (data: Partial<Case>) => Promise<void>;
  onUpdateCaseStatus: (caseId: string, status: Case['status']) => Promise<void>;
}

export const CasesView: React.FC<CasesViewProps> = ({
  cases,
  activeCaseId,
  onSelectCase,
  currentUser,
  availableUsers,
  onCreateCase,
  onUpdateCaseStatus
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Case Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Commercial Burglary & Perimeter Breach');
  const [incidentDate, setIncidentDate] = useState('2026-10-14T20:45');
  const [incidentLocation, setIncidentLocation] = useState('Riverside Warehouse District, Pier 14, Sector 7');
  const [assignedInvestigator, setAssignedInvestigator] = useState(currentUser.id);
  const [assignedSupervisor, setAssignedSupervisor] = useState('usr-002');
  const [submitting, setSubmitting] = useState(false);

  const filteredCases = cases.filter(c => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.incidentLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmitNewCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onCreateCase({
        title,
        description,
        category,
        incidentDate: new Date(incidentDate).toISOString(),
        incidentLocation,
        assignedInvestigators: [assignedInvestigator],
        assignedSupervisorId: assignedSupervisor
      });
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#29312c] p-4 border border-[#465047] rounded-[6px]">
        <div>
          <h1 className="text-sm font-semibold text-[#eae9e1] flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#c16c4b]" />
            Case Registry & Isolation Vault
          </h1>
          <p className="text-xs text-[#a5aaa0] mt-0.5">
            Cryptographically partitioned evidence dossiers with role-based access control.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c16c4b] hover:bg-[#a85a3c] text-[#eae9e1] text-xs font-semibold rounded-[6px] border border-transparent shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Initiate New Case
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#a5aaa0]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search cases by ID, title, or location..."
            className="w-full bg-[#1b211e] border border-[#465047] focus:border-[#d6c9aa] text-xs text-[#eae9e1] placeholder-[#a5aaa0]/60 pl-8 pr-3 py-1.5 rounded-[6px] focus:outline-none font-mono"
          />
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {['ALL', 'ACTIVE', 'UNDER_REVIEW', 'PENDING_SUPERVISOR', 'CLOSED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 text-[11px] font-mono rounded-[4px] border transition-colors ${
                statusFilter === st
                  ? 'bg-[#303b35] text-[#d6c9aa] border-[#d6c9aa]'
                  : 'bg-[#202522] text-[#a5aaa0] border-[#465047] hover:text-[#eae9e1]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredCases.map((c) => {
          const isSelected = c.id === activeCaseId;
          return (
            <div
              key={c.id}
              className={`bg-[#29312c] border rounded-[6px] p-4 space-y-3 transition-all ${
                isSelected
                  ? 'border-[#c16c4b] shadow-[0_0_0_1px_#c16c4b] bg-[#303b35]'
                  : 'border-[#465047] hover:border-[#a5aaa0]'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#1b211e] text-[#d6c9aa] border border-[#465047] rounded-[3px]">
                      {c.id}
                    </span>
                    <span className="text-[10px] font-mono text-[#81977d] uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-sm bg-[#81977d]" />
                      {c.status}
                    </span>
                  </div>
                  <h2 className="text-xs font-bold text-[#eae9e1] mt-1 line-clamp-1">{c.title}</h2>
                </div>

                {isSelected ? (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-[#c16c4b]/20 text-[#ffdbcf] border border-[#c16c4b]/60 rounded-[3px]">
                    ACTIVE WORKSPACE
                  </span>
                ) : (
                  <button
                    onClick={() => onSelectCase(c.id)}
                    className="px-2.5 py-1 text-[11px] font-mono font-medium bg-[#202522] hover:bg-[#1b211e] text-[#eae9e1] border border-[#465047] rounded-[4px] transition-colors"
                  >
                    Load Case
                  </button>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-[#a5aaa0] line-clamp-2">{c.description}</p>

              {/* Metadata Details */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#a5aaa0] bg-[#202522] p-2 border border-[#465047]/60 rounded-[4px]">
                <div className="flex items-center gap-1.5 truncate">
                  <Calendar className="w-3 h-3 text-[#d6c9aa] shrink-0" />
                  <span className="truncate">{new Date(c.incidentDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3 h-3 text-[#d6c9aa] shrink-0" />
                  <span className="truncate">{c.incidentLocation}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Users className="w-3 h-3 text-[#81977d] shrink-0" />
                  <span className="truncate">Lead: {c.createdByName}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Layers className="w-3 h-3 text-[#c16c4b] shrink-0" />
                  <span className="truncate">{c.evidenceCount} Evd // {c.conflictsCount} Confl</span>
                </div>
              </div>

              {/* Status Selector */}
              <div className="flex items-center justify-between pt-1 text-[11px] font-mono">
                <span className="text-[#a5aaa0]">SET STATUS:</span>
                <select
                  value={c.status}
                  onChange={(e) => onUpdateCaseStatus(c.id, e.target.value as Case['status'])}
                  className="bg-[#202522] border border-[#465047] text-xs text-[#eae9e1] px-2 py-0.5 rounded-[4px] focus:outline-none"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                  <option value="PENDING_SUPERVISOR">PENDING_SUPERVISOR</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Case Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#202522] border border-[#465047] rounded-[8px] max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#465047] pb-2">
              <h2 className="text-sm font-semibold text-[#eae9e1] flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-[#c16c4b]" />
                Initiate New Investigation Case
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs text-[#a5aaa0] hover:text-[#eae9e1] font-mono"
              >
                [ESC]
              </button>
            </div>

            <form onSubmit={handleSubmitNewCase} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#a5aaa0] font-mono uppercase mb-1">Case Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CV-2026-002 – Waterfront Perimeter Tampering"
                  className="w-full bg-[#181d1a] border border-[#465047] focus:border-[#d6c9aa] px-3 py-1.5 rounded-[6px] text-[#eae9e1] focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#a5aaa0] font-mono uppercase mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#181d1a] border border-[#465047] focus:border-[#d6c9aa] px-2 py-1.5 rounded-[6px] text-[#eae9e1] focus:outline-none font-mono"
                  >
                    <option value="Commercial Burglary & Perimeter Breach">Commercial Burglary & Perimeter Breach</option>
                    <option value="Cargo Manifest Theft & Tampering">Cargo Manifest Theft & Tampering</option>
                    <option value="Critical Infrastructure Sabotage">Critical Infrastructure Sabotage</option>
                    <option value="Homicide / Unattended Death">Homicide / Unattended Death</option>
                    <option value="Digital Cyber Forensics">Digital Cyber Forensics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#a5aaa0] font-mono uppercase mb-1">Incident Date & Time</label>
                  <input
                    type="datetime-local"
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full bg-[#181d1a] border border-[#465047] focus:border-[#d6c9aa] px-2 py-1.5 rounded-[6px] text-[#eae9e1] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#a5aaa0] font-mono uppercase mb-1">Incident Location</label>
                <input
                  type="text"
                  value={incidentLocation}
                  onChange={(e) => setIncidentLocation(e.target.value)}
                  placeholder="Specific address, GPS coordinates, or facility gate"
                  className="w-full bg-[#181d1a] border border-[#465047] focus:border-[#d6c9aa] px-3 py-1.5 rounded-[6px] text-[#eae9e1] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[#a5aaa0] font-mono uppercase mb-1">Investigative Synopsis / Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Primary incident description, initial dispatch findings, and forensic priority..."
                  className="w-full bg-[#181d1a] border border-[#465047] focus:border-[#d6c9aa] px-3 py-1.5 rounded-[6px] text-[#eae9e1] focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#a5aaa0] font-mono uppercase mb-1">Lead Investigator</label>
                  <select
                    value={assignedInvestigator}
                    onChange={(e) => setAssignedInvestigator(e.target.value)}
                    className="w-full bg-[#181d1a] border border-[#465047] px-2 py-1.5 rounded-[6px] text-[#eae9e1] focus:outline-none font-mono"
                  >
                    {availableUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.badgeNumber})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[#a5aaa0] font-mono uppercase mb-1">Supervising Officer</label>
                  <select
                    value={assignedSupervisor}
                    onChange={(e) => setAssignedSupervisor(e.target.value)}
                    className="w-full bg-[#181d1a] border border-[#465047] px-2 py-1.5 rounded-[6px] text-[#eae9e1] focus:outline-none font-mono"
                  >
                    {availableUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#465047]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-[#29312c] hover:bg-[#303b35] text-[#eae9e1] rounded-[6px] border border-[#465047] font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-[#c16c4b] hover:bg-[#a85a3c] text-[#eae9e1] font-semibold rounded-[6px] font-mono border border-transparent shadow-sm"
                >
                  {submitting ? 'Registering...' : 'Confirm Case Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
