/**
 * CrimeVision AI - Immutable Audit Log Console
 * Compliance tracking, chain of custody logs, user action auditing
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Layers,
  Terminal
} from 'lucide-react';
import { AuditLogEntry } from '../../types/forensic';

interface AuditLogsViewProps {
  logs: AuditLogEntry[];
  caseId: string;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs, caseId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  const filteredLogs = logs.filter(log => {
    const matchesSearch =
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetResource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'ALL' || log.action.includes(actionFilter);
    return matchesSearch && matchesAction;
  });

  const exportAuditCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'User', 'Role', 'Case ID', 'Action', 'Target', 'Details'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      l.userName,
      l.userRole,
      l.caseId || 'N/A',
      l.action,
      l.targetResource,
      `"${l.details.replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CrimeVision_Audit_Log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-[#29312c] border border-[#465047] rounded-[6px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-sm font-semibold text-[#eae9e1] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#81977d]" />
            Immutable Forensic Audit & Compliance Ledger
          </h1>
          <p className="text-xs text-[#a5aaa0] mt-0.5 font-mono">
            Every user login, file upload, AI query, finding edit, and supervisory signoff is permanently recorded.
          </p>
        </div>

        <button
          onClick={exportAuditCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#202522] hover:bg-[#303b35] text-[#d6c9aa] text-xs font-mono rounded-[6px] border border-[#465047] transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export Audit Ledger (CSV)
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
            placeholder="Search audit trail by user, target resource, or action keyword..."
            className="w-full bg-[#1b211e] border border-[#465047] focus:border-[#d6c9aa] text-xs text-[#eae9e1] placeholder-[#a5aaa0]/60 pl-8 pr-3 py-1.5 rounded-[6px] focus:outline-none font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', 'LOGIN', 'EVIDENCE', 'FINDING', 'REPORT', 'AI'].map(act => (
            <button
              key={act}
              onClick={() => setActionFilter(act)}
              className={`px-2.5 py-1 text-[10px] font-mono rounded-[4px] border transition-colors ${
                actionFilter === act
                  ? 'bg-[#303b35] text-[#d6c9aa] border-[#d6c9aa]'
                  : 'bg-[#202522] text-[#a5aaa0] border-[#465047] hover:text-[#eae9e1]'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#29312c] border border-[#465047] rounded-[6px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1b211e] border-b border-[#465047] text-[10px] font-mono text-[#a5aaa0] uppercase tracking-wider h-8">
                <th className="px-3 py-1">Log ID</th>
                <th className="px-3 py-1">UTC Timestamp</th>
                <th className="px-3 py-1">Officer / User</th>
                <th className="px-3 py-1">Action Type</th>
                <th className="px-3 py-1">Target Resource</th>
                <th className="px-3 py-1">Details & Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#465047]/40 text-xs">
              {filteredLogs.map((log, index) => (
                <tr
                  key={log.id}
                  className={`hover:bg-[#303b35] transition-colors ${
                    index % 2 === 0 ? 'bg-[#202522]' : 'bg-[#242a26]'
                  }`}
                >
                  <td className="px-3 py-2 font-mono text-[11px] text-[#d6c9aa] whitespace-nowrap">
                    {log.id}
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] text-[#a5aaa0] whitespace-nowrap">
                    {new Date(log.timestamp).toUTCString()}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap font-mono text-[11px]">
                    <div className="text-[#eae9e1] font-semibold">{log.userName}</div>
                    <div className="text-[10px] text-[#a5aaa0]">[{log.userRole}]</div>
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] whitespace-nowrap">
                    <span className="px-1.5 py-0.5 bg-[#1b211e] border border-[#465047] rounded text-[#c16c4b] font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] text-[#d6c9aa] whitespace-nowrap">
                    {log.targetResource}
                  </td>
                  <td className="px-3 py-2 text-[#eae9e1] text-[11px] max-w-md truncate" title={log.details}>
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
