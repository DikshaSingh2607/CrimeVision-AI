/**
 * CrimeVision AI - Top Header Bar
 * Tactical Obsidian & Oxide Aesthetic
 */

import React from 'react';
import {
  Search,
  Shield,
  Layers,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { Case, User } from '../../types/forensic';

interface TopNavProps {
  cases: Case[];
  activeCaseId: string;
  onSelectCase: (caseId: string) => void;
  currentUser: User;
  availableUsers: User[];
  onSwitchUser: (userId: string) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  cases,
  activeCaseId,
  onSelectCase,
  currentUser,
  availableUsers,
  onSwitchUser,
  globalSearchQuery,
  setGlobalSearchQuery
}) => {
  const activeCase = cases.find(c => c.id === activeCaseId) || cases[0];

  return (
    <header className="h-14 bg-[#1b211e] border-b border-[#465047] flex items-center justify-between px-4 z-10 shrink-0">
      {/* Active Case Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-[#202522] border border-[#465047] px-2.5 py-1.5 rounded-[6px] max-w-sm">
          <Layers className="w-3.5 h-3.5 text-[#c16c4b] shrink-0" />
          <span className="text-[10px] uppercase font-mono text-[#a5aaa0] tracking-wider shrink-0">CASE:</span>
          <select
            value={activeCaseId}
            onChange={(e) => onSelectCase(e.target.value)}
            className="bg-transparent text-xs font-semibold text-[#eae9e1] focus:outline-none cursor-pointer truncate max-w-[220px]"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#202522] text-[#eae9e1]">
                {c.id} – {c.title.replace(`${c.id} – `, '')}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-[#a5aaa0] shrink-0 pointer-events-none" />
        </div>

        <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 bg-[#202522] border border-[#465047] rounded-[6px] text-[11px] font-mono text-[#81977d]">
          <Shield className="w-3 h-3 text-[#81977d]" />
          <span>CHAIN-OF-CUSTODY ACTIVE</span>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="flex-1 max-w-md mx-4">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#a5aaa0]" />
          <input
            type="text"
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            placeholder="Search evidence chunks, findings, witnesses, timestamps... [Enter]"
            className="w-full bg-[#101412] border border-[#465047] focus:border-[#d6c9aa] text-xs text-[#eae9e1] placeholder-[#a5aaa0]/60 pl-8 pr-12 py-1.5 rounded-[6px] focus:outline-none transition-colors font-mono"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#a5aaa0]/50 border border-[#465047]/60 px-1 rounded-[3px]">
            ESC
          </span>
        </div>
      </div>

      {/* Right Controls: Role & User Profile Switcher */}
      <div className="flex items-center gap-3">
        {/* Role Indicator Badge */}
        <div className="flex items-center gap-1.5 bg-[#202522] border border-[#465047] px-2 py-1 rounded-[6px]">
          <span className="w-1.5 h-1.5 rounded-sm bg-[#c16c4b]" />
          <span className="text-[10px] font-mono font-bold tracking-wider text-[#d6c9aa] uppercase">
            {currentUser.role}
          </span>
        </div>

        {/* User Switcher Dropdown */}
        <div className="flex items-center gap-2 bg-[#202522] border border-[#465047] pl-1.5 pr-2 py-1 rounded-[6px]">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'}
            alt={currentUser.name}
            className="w-6 h-6 rounded-[4px] object-cover border border-[#465047]"
          />
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-[#eae9e1] leading-none">
              {currentUser.name}
            </div>
            <div className="text-[10px] font-mono text-[#a5aaa0] leading-none mt-0.5">
              {currentUser.badgeNumber}
            </div>
          </div>

          <select
            value={currentUser.id}
            onChange={(e) => onSwitchUser(e.target.value)}
            title="Switch User / Role"
            className="bg-transparent text-xs text-[#a5aaa0] focus:outline-none cursor-pointer ml-1"
          >
            {availableUsers.map((u) => (
              <option key={u.id} value={u.id} className="bg-[#202522] text-[#eae9e1]">
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};
