/**
 * CrimeVision AI - System Settings & RBAC Permissions
 * Role switcher, environment diagnostic, and synthetic database reset
 */

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  UserCheck,
  RefreshCw,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Database,
  Lock
} from 'lucide-react';
import { User, UserRole } from '../../types/forensic';

interface SettingsViewProps {
  currentUser: User;
  availableUsers: User[];
  onSwitchUser: (userId: string) => void;
  onResetDemo: () => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  availableUsers,
  onSwitchUser,
  onResetDemo
}) => {
  const [resetting, setResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    setResetSuccess(false);
    try {
      await onResetDemo();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setResetting(false);
    }
  };

  const rolePermissions: Record<UserRole, string[]> = {
    INVESTIGATOR: [
      'Create and manage assigned investigation cases',
      'Upload evidence files and compute SHA-256 hashes',
      'Run multimodal document OCR, image analysis, and audio transcription',
      'Query evidence with grounded AI assistant',
      'Review, edit, accept, or reject AI-generated findings',
      'Generate and approve preliminary forensic draft reports'
    ],
    SUPERVISOR: [
      'Access and inspect all active precinct cases',
      'Review investigator-approved forensic reports',
      'Grant official supervisor sign-off or return for revision',
      'Audit evidentiary chain-of-custody and user action logs',
      'Evaluate consistency flags and cross-source discrepancies'
    ],
    ADMIN: [
      'Full administrative oversight across all cases and vaults',
      'Manage user credentials, badge assignments, and role-based permissions',
      'Re-seed synthetic forensic demo datasets',
      'Inspect low-level pipeline telemetry and system diagnostics',
      'Export cryptographic audit logs for legal compliance'
    ]
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-[#29312c] border border-[#465047] rounded-[6px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-sm font-semibold text-[#eae9e1] flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#c16c4b]" />
            System Configuration & Access Governance
          </h1>
          <p className="text-xs text-[#a5aaa0] mt-0.5 font-mono">
            Role-based permissions (RBAC), environment diagnostics, and demo vault management.
          </p>
        </div>

        <button
          onClick={handleReset}
          disabled={resetting}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#202522] hover:bg-[#303b35] text-[#d6c9aa] text-xs font-mono rounded-[6px] border border-[#465047] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
          {resetting ? 'Re-seeding...' : 'Reset Demo Dataset (CV-DEMO-001)'}
        </button>
      </div>

      {resetSuccess && (
        <div className="bg-[#181d1a] border border-[#81977d] p-3 rounded-[6px] flex items-center gap-2 text-xs font-mono text-[#81977d]">
          <CheckCircle2 className="w-4 h-4" />
          <span>Synthetic demo case CV-DEMO-001 re-seeded successfully with all 15 pristine evidence files!</span>
        </div>
      )}

      {/* Active User Persona Switcher */}
      <div className="bg-[#29312c] border border-[#465047] rounded-[6px] p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-[#465047] pb-2">
          <h2 className="text-xs font-semibold text-[#eae9e1] uppercase tracking-wider font-mono flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#d6c9aa]" />
            Active Forensic User Persona (RBAC Testing)
          </h2>
          <span className="text-[10px] font-mono text-[#81977d]">SWITCH INSTANTLY</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {availableUsers.map((u) => {
            const isCurrent = u.id === currentUser.id;
            return (
              <div
                key={u.id}
                onClick={() => onSwitchUser(u.id)}
                className={`p-3 rounded-[6px] border cursor-pointer transition-all space-y-2 ${
                  isCurrent
                    ? 'bg-[#303b35] border-[#c16c4b] shadow-sm'
                    : 'bg-[#202522] border-[#465047] hover:border-[#a5aaa0]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={u.avatarUrl}
                    alt={u.name}
                    className="w-8 h-8 rounded-[4px] object-cover border border-[#465047]"
                  />
                  <div>
                    <div className="text-xs font-bold text-[#eae9e1]">{u.name}</div>
                    <div className="text-[10px] font-mono text-[#a5aaa0]">{u.badgeNumber}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-[#465047]/40">
                  <span className="text-[#d6c9aa] font-bold">{u.role}</span>
                  {isCurrent ? (
                    <span className="text-[#81977d] font-semibold">ACTIVE SESSION</span>
                  ) : (
                    <span className="text-[#a5aaa0]">Click to Switch</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role Permissions Matrix */}
      <div className="bg-[#29312c] border border-[#465047] rounded-[6px] p-4 space-y-3">
        <h2 className="text-xs font-semibold text-[#eae9e1] uppercase tracking-wider font-mono flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#81977d]" />
          Role Permission Entitlements ({currentUser.role})
        </h2>

        <div className="space-y-1.5">
          {rolePermissions[currentUser.role].map((perm, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 bg-[#202522] border border-[#465047]/40 rounded-[4px] text-xs font-mono text-[#eae9e1]"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#81977d] shrink-0" />
              <span>{perm}</span>
            </div>
          ))}
        </div>
      </div>

      {/* System Architecture & Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#29312c] border border-[#465047] rounded-[6px] p-4 space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#d6c9aa] font-semibold border-b border-[#465047] pb-2">
            <Cpu className="w-4 h-4 text-[#c16c4b]" />
            AI Model & Pipeline Configuration
          </div>
          <div className="space-y-1 pt-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#a5aaa0]">Text & Multimodal Model:</span>
              <span className="text-[#eae9e1] font-semibold">gemini-3.8-flash</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a5aaa0]">Server Integration:</span>
              <span className="text-[#81977d] font-semibold">@google/genai (Secure Server-Side)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a5aaa0]">Evidence Grounding:</span>
              <span className="text-[#81977d] font-semibold">Strict System Instruction Enforced</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a5aaa0]">Biometric Recognition:</span>
              <span className="text-red-400 font-semibold">Strictly Prohibited & Refused</span>
            </div>
          </div>
        </div>

        <div className="bg-[#29312c] border border-[#465047] rounded-[6px] p-4 space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#d6c9aa] font-semibold border-b border-[#465047] pb-2">
            <Database className="w-4 h-4 text-[#81977d]" />
            Storage & Cryptography Ledger
          </div>
          <div className="space-y-1 pt-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-[#a5aaa0]">Integrity Checksum:</span>
              <span className="text-[#81977d] font-semibold">SHA-256 Pre-computed & Validated</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a5aaa0]">Original Evidence:</span>
              <span className="text-[#eae9e1] font-semibold">Unchanged Raw Storage</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a5aaa0]">Audit Logging:</span>
              <span className="text-[#81977d] font-semibold">Append-Only Immutable Ledger</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#a5aaa0]">Standalone Backend:</span>
              <span className="text-[#d6c9aa] font-semibold">FastAPI + Docker Compose Provided</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
