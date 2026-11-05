/**
 * CrimeVision AI - Left Sidebar Navigation
 * Obsidian & Oxide Forensic Workspace
 */

import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Database,
  Cpu,
  CheckSquare,
  Clock,
  AlertTriangle,
  MessageSquareText,
  FileText,
  ShieldCheck,
  BarChart3,
  Settings
} from 'lucide-react';
import { UserRole } from '../../types/forensic';

export type TabId =
  | 'overview'
  | 'cases'
  | 'evidence'
  | 'analysis'
  | 'findings'
  | 'timeline'
  | 'conflicts'
  | 'qa'
  | 'reports'
  | 'audit'
  | 'benchmark'
  | 'settings';

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  userRole: UserRole;
  pendingFindingsCount: number;
  conflictsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingFindingsCount,
  conflictsCount
}) => {
  const navItems: Array<{
    id: TabId;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeVariant?: 'terracotta' | 'amber' | 'bone';
  }> = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'cases', label: 'Cases', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'evidence', label: 'Evidence Vault', icon: <Database className="w-4 h-4" /> },
    { id: 'analysis', label: 'AI Analysis', icon: <Cpu className="w-4 h-4" /> },
    {
      id: 'findings',
      label: 'Findings Review',
      icon: <CheckSquare className="w-4 h-4" />,
      badge: pendingFindingsCount > 0 ? pendingFindingsCount : undefined,
      badgeVariant: 'amber'
    },
    { id: 'timeline', label: 'Case Timeline', icon: <Clock className="w-4 h-4" /> },
    {
      id: 'conflicts',
      label: 'Conflict Detection',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: conflictsCount > 0 ? conflictsCount : undefined,
      badgeVariant: 'terracotta'
    },
    { id: 'qa', label: 'Evidence Q&A', icon: <MessageSquareText className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit Logs', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'benchmark', label: 'Benchmark Eval', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <aside className="w-64 bg-[#1b211e] border-r border-[#465047] flex flex-col shrink-0 select-none">
      {/* Brand & Platform Header */}
      <div className="h-14 px-4 flex items-center gap-3 border-b border-[#465047] bg-[#181d1a]">
        <div className="w-7 h-7 bg-[#29312c] border border-[#c16c4b] rounded-[6px] flex items-center justify-center text-[#c16c4b] font-bold text-xs tracking-wider shadow-inner">
          CV
        </div>
        <div>
          <div className="font-semibold text-xs tracking-wide text-[#eae9e1] flex items-center gap-1.5">
            CRIMEVISION AI
            <span className="w-1.5 h-1.5 rounded-sm bg-[#81977d] animate-pulse"></span>
          </div>
          <div className="text-[10px] font-mono text-[#a5aaa0] uppercase tracking-wider">
            Forensic Suite v2.4
          </div>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        <div className="px-2 py-1 text-[10px] uppercase font-mono tracking-widest text-[#a5aaa0]/70">
          Command Rail
        </div>

        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-[6px] transition-all text-left ${
                isActive
                  ? 'bg-[#303b35] text-[#eae9e1] border-l-2 border-[#c16c4b] pl-2.5 font-semibold shadow-sm'
                  : 'text-[#a5aaa0] hover:text-[#eae9e1] hover:bg-[#29312c]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-[#c16c4b]' : 'text-[#a5aaa0]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-[3px] border ${
                    item.badgeVariant === 'terracotta'
                      ? 'bg-[#c16c4b]/20 text-[#ffdbcf] border-[#c16c4b]/60'
                      : 'bg-[#d3a15d]/20 text-[#efe1c1] border-[#d3a15d]/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Security Telemetry Footer */}
      <div className="p-3 border-t border-[#465047] bg-[#181d1a] space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#a5aaa0]">
          <span>EVIDENTIARY HASH</span>
          <span className="text-[#81977d] font-semibold">ENFORCED</span>
        </div>
        <div className="text-[10px] font-mono text-[#a5aaa0]/80 truncate">
          SHA-256 // ZERO-HALLUCINATION
        </div>
        <div className="text-[9px] text-[#a5aaa0]/60 leading-tight">
          Decision-support only. Biometric recognition strictly prohibited.
        </div>
      </div>
    </aside>
  );
};
