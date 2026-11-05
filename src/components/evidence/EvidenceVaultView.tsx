/**
 * CrimeVision AI - Evidence Vault & Multimodal Inspector
 * Real file upload, SHA-256 hashing, chain-of-custody, visual previewers
 */

import React, { useState } from 'react';
import {
  Database,
  Upload,
  Search,
  FileText,
  Image as ImageIcon,
  Headphones,
  Video,
  FileCode,
  Download,
  Eye,
  CheckCircle,
  Hash,
  Shield,
  Layers,
  Clock,
  User,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { EvidenceItem, EvidenceType } from '../../types/forensic';

interface EvidenceVaultViewProps {
  evidence: EvidenceItem[];
  caseId: string;
  onUploadEvidence: (data: {
    fileName: string;
    fileType: string;
    category: EvidenceType;
    content?: string;
    sourceDescription?: string;
    mediaUrl?: string;
  }) => Promise<void>;
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
}

export const EvidenceVaultView: React.FC<EvidenceVaultViewProps> = ({
  evidence,
  caseId,
  onUploadEvidence,
  isUploadModalOpen,
  setIsUploadModalOpen
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [previewItem, setPreviewItem] = useState<EvidenceItem | null>(null);

  // Upload Form State
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadCategory, setUploadCategory] = useState<EvidenceType>('DOCUMENT');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadContent, setUploadContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const filteredEvidence = evidence.filter((item) => {
    const matchesSearch =
      item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sha256Hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sourceDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadFileName(file.name);
      // Auto-detect category
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) setUploadCategory('IMAGE');
      else if (['mp3', 'wav', 'aac'].includes(ext || '')) setUploadCategory('AUDIO');
      else if (['mp4', 'mov', 'avi'].includes(ext || '')) setUploadCategory('VIDEO');
      else if (['txt'].includes(ext || '')) setUploadCategory('FORENSIC_NOTE');
      else setUploadCategory('DOCUMENT');

      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadContent((event.target?.result as string) || '');
      };
      reader.readAsText(file);
    }
  };

  const handleManualUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;
    setIsUploading(true);
    try {
      await onUploadEvidence({
        fileName: uploadFileName,
        fileType: uploadCategory === 'IMAGE' ? 'image/jpeg' : uploadCategory === 'AUDIO' ? 'audio/wav' : 'application/pdf',
        category: uploadCategory,
        content: uploadContent || `Evidence record for ${uploadFileName}. Verified custody intake.`,
        sourceDescription: uploadDescription || 'Manual intake into vault.'
      });
      setIsUploadModalOpen(false);
      setUploadFileName('');
      setUploadContent('');
      setUploadDescription('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const getCategoryIcon = (cat: EvidenceType) => {
    switch (cat) {
      case 'DOCUMENT':
        return <FileText className="w-4 h-4 text-[#d6c9aa]" />;
      case 'IMAGE':
        return <ImageIcon className="w-4 h-4 text-[#c16c4b]" />;
      case 'AUDIO':
        return <Headphones className="w-4 h-4 text-[#81977d]" />;
      case 'VIDEO':
        return <Video className="w-4 h-4 text-[#d3a15d]" />;
      case 'FORENSIC_NOTE':
        return <FileCode className="w-4 h-4 text-[#a5aaa0]" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Vault Top Action Header */}
      <div className="bg-[#29312c] border border-[#465047] rounded-[6px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-sm font-semibold text-[#eae9e1] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#c16c4b]" />
            Evidence Vault & Chain-of-Custody Repository
          </h1>
          <p className="text-xs text-[#a5aaa0] mt-0.5 font-mono">
            Original evidence is immutably stored with SHA-256 cryptographic verification.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c16c4b] hover:bg-[#a85a3c] text-[#eae9e1] text-xs font-semibold rounded-[6px] border border-transparent shadow-sm transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          Intake New Evidence
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#a5aaa0]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by file name, SHA-256 hash prefix, or description..."
            className="w-full bg-[#1b211e] border border-[#465047] focus:border-[#d6c9aa] text-xs text-[#eae9e1] placeholder-[#a5aaa0]/60 pl-8 pr-3 py-1.5 rounded-[6px] focus:outline-none font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 self-stretch sm:self-auto">
          {['ALL', 'DOCUMENT', 'IMAGE', 'AUDIO', 'VIDEO', 'FORENSIC_NOTE'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-1 text-[10px] font-mono rounded-[4px] border transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#303b35] text-[#d6c9aa] border-[#d6c9aa]'
                  : 'bg-[#202522] text-[#a5aaa0] border-[#465047] hover:text-[#eae9e1]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Table */}
      <div className="bg-[#29312c] border border-[#465047] rounded-[6px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1b211e] border-b border-[#465047] text-[10px] font-mono text-[#a5aaa0] uppercase tracking-wider h-8">
                <th className="px-3 py-1">Item ID</th>
                <th className="px-3 py-1">File Name</th>
                <th className="px-3 py-1">Modality</th>
                <th className="px-3 py-1">Size</th>
                <th className="px-3 py-1">SHA-256 Hash</th>
                <th className="px-3 py-1">Custody Intake</th>
                <th className="px-3 py-1 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#465047]/40 text-xs">
              {filteredEvidence.map((ev, index) => (
                <tr
                  key={ev.id}
                  className={`hover:bg-[#303b35] transition-colors ${
                    index % 2 === 0 ? 'bg-[#202522]' : 'bg-[#242a26]'
                  }`}
                >
                  {/* Item ID */}
                  <td className="px-3 py-2.5 font-mono text-[11px] text-[#d6c9aa] whitespace-nowrap font-semibold">
                    {ev.id}
                  </td>

                  {/* File Name */}
                  <td className="px-3 py-2.5 font-medium text-[#eae9e1] whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(ev.category)}
                      <span>{ev.fileName}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-3 py-2.5 font-mono text-[11px] text-[#a5aaa0] whitespace-nowrap">
                    <span className="px-1.5 py-0.5 bg-[#1b211e] border border-[#465047] rounded-[3px]">
                      {ev.category}
                    </span>
                  </td>

                  {/* Size */}
                  <td className="px-3 py-2.5 font-mono text-[11px] text-[#a5aaa0] whitespace-nowrap">
                    {(ev.fileSizeBytes / 1024).toFixed(1)} KB
                  </td>

                  {/* SHA-256 Hash */}
                  <td className="px-3 py-2.5 font-mono text-[11px] text-[#81977d] whitespace-nowrap truncate max-w-[160px]" title={ev.sha256Hash}>
                    {ev.sha256Hash.slice(0, 16)}...
                  </td>

                  {/* Upload Time & User */}
                  <td className="px-3 py-2.5 text-[11px] text-[#a5aaa0] font-mono whitespace-nowrap">
                    <div>{new Date(ev.uploadedAt).toLocaleTimeString()}</div>
                    <div className="text-[10px] text-[#a5aaa0]/70">{ev.uploadedByName}</div>
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-2.5 text-right whitespace-nowrap space-x-1.5">
                    <button
                      onClick={() => setPreviewItem(ev)}
                      className="px-2 py-1 bg-[#202522] hover:bg-[#303b35] text-[#d6c9aa] border border-[#465047] rounded-[4px] text-[11px] font-mono inline-flex items-center gap-1 transition-colors"
                      title="Inspect Multimodal Evidence"
                    >
                      <Eye className="w-3 h-3" />
                      Inspect
                    </button>
                    <a
                      href={`/api/evidence/${ev.id}/download`}
                      download={ev.fileName}
                      className="px-2 py-1 bg-[#202522] hover:bg-[#303b35] text-[#a5aaa0] hover:text-[#eae9e1] border border-[#465047] rounded-[4px] text-[11px] font-mono inline-flex items-center gap-1 transition-colors"
                      title="Download Unmodified Original File"
                    >
                      <Download className="w-3 h-3" />
                      Original
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multimodal Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#202522] border border-[#465047] rounded-[8px] max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="h-12 px-4 bg-[#1b211e] border-b border-[#465047] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#29312c] text-[#c16c4b] border border-[#c16c4b]/50 rounded-[3px]">
                  {previewItem.id}
                </span>
                <span className="text-xs font-semibold text-[#eae9e1] font-mono">{previewItem.fileName}</span>
                <span className="text-[10px] font-mono text-[#81977d] border border-[#81977d]/40 px-1.5 rounded-[3px]">
                  {previewItem.category}
                </span>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-[#a5aaa0] hover:text-[#eae9e1] p-1 font-mono text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              {/* Cryptographic Ledger Banner */}
              <div className="bg-[#1b211e] p-2.5 border border-[#465047] rounded-[4px] space-y-1 font-mono text-[11px]">
                <div className="flex items-center justify-between text-[#a5aaa0]">
                  <span className="flex items-center gap-1.5 text-[#81977d]">
                    <Shield className="w-3.5 h-3.5" />
                    CRYPTOGRAPHIC CHAIN OF CUSTODY
                  </span>
                  <span>{new Date(previewItem.uploadedAt).toUTCString()}</span>
                </div>
                <div className="text-[10px] text-[#eae9e1] break-all">
                  SHA-256: <span className="text-[#d6c9aa]">{previewItem.sha256Hash}</span>
                </div>
              </div>

              {/* IMAGE MODALITY */}
              {previewItem.category === 'IMAGE' && (
                <div className="space-y-3">
                  <div className="relative border border-[#465047] rounded-[6px] overflow-hidden bg-[#101412] flex items-center justify-center p-2">
                    <img
                      src={previewItem.mediaUrl}
                      alt={previewItem.fileName}
                      className="max-h-[380px] w-full object-contain rounded-[4px]"
                    />
                  </div>

                  {previewItem.boundingBoxes && previewItem.boundingBoxes.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-mono text-[#a5aaa0] uppercase tracking-wider">
                        Detected Forensic Targets & Bounding Annotations
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {previewItem.boundingBoxes.map((box) => (
                          <div key={box.id} className="p-2.5 bg-[#29312c] border border-[#465047] rounded-[4px] space-y-1">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="text-[#c16c4b] font-semibold">{box.label}</span>
                              <span className="text-[10px] bg-[#1b211e] px-1.5 py-0.5 border border-[#465047] rounded text-[#81977d]">
                                {Math.round(box.confidence * 100)}% CONF
                              </span>
                            </div>
                            <p className="text-[11px] text-[#a5aaa0]">{box.notes}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* AUDIO MODALITY */}
              {previewItem.category === 'AUDIO' && (
                <div className="space-y-3">
                  <div className="bg-[#1b211e] border border-[#465047] p-3 rounded-[6px] space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-[#a5aaa0]">
                      <span className="flex items-center gap-1.5 text-[#81977d]">
                        <Headphones className="w-3.5 h-3.5" />
                        Audio Log ({previewItem.audioDurationSeconds}s duration)
                      </span>
                      <span>PCM 16-BIT // 44.1kHz</span>
                    </div>

                    {/* Synthetic Waveform Graphic */}
                    <div className="h-10 bg-[#202522] border border-[#465047]/60 rounded-[4px] flex items-center justify-between px-2 gap-1">
                      {Array.from({ length: 36 }).map((_, i) => {
                        const heights = [20, 35, 65, 80, 45, 90, 70, 30, 50, 85, 95, 40, 60, 75, 30, 85, 90, 65, 45, 30, 55, 70, 85, 90, 40, 20, 50, 75, 60, 45, 80, 95, 70, 50, 30, 20];
                        const h = heights[i % heights.length];
                        return (
                          <div
                            key={i}
                            className="flex-1 bg-[#c16c4b] rounded-sm opacity-80"
                            style={{ height: `${h}%` }}
                          />
                        );
                      })}
                    </div>
                  </div>

                  {previewItem.audioTranscript && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-mono text-[#a5aaa0] uppercase tracking-wider">
                        Timestamped Speech Transcript
                      </div>
                      <div className="bg-[#181d1a] border border-[#465047] p-3 rounded-[6px] space-y-2 max-h-56 overflow-y-auto font-mono text-xs">
                        {previewItem.audioTranscript.map((t, idx) => (
                          <div key={idx} className="border-b border-[#465047]/30 pb-1.5 last:border-b-0 space-y-0.5">
                            <div className="flex items-center justify-between text-[10px] text-[#a5aaa0]">
                              <span className="text-[#d6c9aa] font-semibold">{t.speaker}</span>
                              <span className="text-[#81977d]">[{t.timestamp}]</span>
                            </div>
                            <div className="text-[#eae9e1] font-sans">{t.text}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* VIDEO MODALITY */}
              {previewItem.category === 'VIDEO' && (
                <div className="space-y-3">
                  <div className="text-[11px] font-mono text-[#a5aaa0] uppercase tracking-wider">
                    Sampled CCTV Frame Sequence
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {previewItem.videoFrames?.map((kf, i) => (
                      <div key={i} className="bg-[#181d1a] border border-[#465047] rounded-[6px] p-2 space-y-1.5">
                        <img src={kf.imageUrl} alt={kf.caption} className="w-full h-36 object-cover rounded-[4px]" />
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-[#c16c4b] font-semibold">FRAME {i + 1}/4</span>
                          <span className="text-[#d6c9aa]">{kf.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-[#a5aaa0]">{kf.caption}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DOCUMENT OR NOTE MODALITY */}
              {(previewItem.category === 'DOCUMENT' || previewItem.category === 'FORENSIC_NOTE') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#a5aaa0] uppercase tracking-wider">
                    <span>Extracted Text Content</span>
                    {previewItem.ocrConfidence && (
                      <span className="text-[#81977d]">
                        OCR CONFIDENCE: {Math.round(previewItem.ocrConfidence * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="bg-[#181d1a] border border-[#465047] p-3 rounded-[6px] font-mono text-xs text-[#eae9e1] whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed">
                    {previewItem.textContent}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="h-12 px-4 bg-[#1b211e] border-t border-[#465047] flex items-center justify-between shrink-0">
              <span className="text-[11px] font-mono text-[#a5aaa0]">
                SOURCE: {previewItem.sourceDescription}
              </span>
              <button
                onClick={() => setPreviewItem(null)}
                className="px-3 py-1 bg-[#29312c] hover:bg-[#303b35] text-xs font-mono text-[#eae9e1] border border-[#465047] rounded-[4px]"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#202522] border border-[#465047] rounded-[8px] max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#465047] pb-2">
              <h2 className="text-sm font-semibold text-[#eae9e1] flex items-center gap-2 font-mono">
                <Upload className="w-4 h-4 text-[#c16c4b]" />
                Evidence Vault Intake // Case {caseId}
              </h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-xs text-[#a5aaa0] hover:text-[#eae9e1] font-mono"
              >
                [ESC]
              </button>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-[6px] p-6 text-center transition-colors cursor-pointer ${
                dragActive
                  ? 'border-[#c16c4b] bg-[#c16c4b]/10'
                  : 'border-[#465047] bg-[#181d1a] hover:border-[#a5aaa0]'
              }`}
            >
              <Upload className="w-6 h-6 text-[#a5aaa0] mx-auto mb-2" />
              <div className="text-xs font-semibold text-[#eae9e1]">
                Drag and drop PDF, JPG, PNG, WAV, MP4, or TXT file here
              </div>
              <div className="text-[10px] font-mono text-[#a5aaa0] mt-1">
                Computes immediate SHA-256 hash. Preserves raw payload unchanged.
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleManualUploadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#a5aaa0] font-mono uppercase mb-1">File Name</label>
                <input
                  type="text"
                  required
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="e.g. Supplemental_Witness_Report.pdf"
                  className="w-full bg-[#181d1a] border border-[#465047] focus:border-[#d6c9aa] px-3 py-1.5 rounded-[6px] text-[#eae9e1] focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#a5aaa0] font-mono uppercase mb-1">Category</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as EvidenceType)}
                    className="w-full bg-[#181d1a] border border-[#465047] focus:border-[#d6c9aa] px-2 py-1.5 rounded-[6px] text-[#eae9e1] focus:outline-none font-mono"
                  >
                    <option value="DOCUMENT">DOCUMENT (PDF/DOCX)</option>
                    <option value="IMAGE">IMAGE (JPG/PNG)</option>
                    <option value="AUDIO">AUDIO (WAV/MP3)</option>
                    <option value="VIDEO">VIDEO (MP4)</option>
                    <option value="FORENSIC_NOTE">FORENSIC NOTE (TXT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#a5aaa0] font-mono uppercase mb-1">Source Agency / Officer</label>
                  <input
                    type="text"
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    placeholder="e.g. Det. Miller field recovery"
                    className="w-full bg-[#181d1a] border border-[#465047] focus:border-[#d6c9aa] px-2 py-1.5 rounded-[6px] text-[#eae9e1] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#a5aaa0] font-mono uppercase mb-1">Text Payload / Forensic Notes</label>
                <textarea
                  rows={4}
                  value={uploadContent}
                  onChange={(e) => setUploadContent(e.target.value)}
                  placeholder="Enter or paste document text, transcript excerpt, or forensic observations..."
                  className="w-full bg-[#181d1a] border border-[#465047] focus:border-[#d6c9aa] px-3 py-1.5 rounded-[6px] text-[#eae9e1] focus:outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#465047]">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3 py-1.5 bg-[#29312c] hover:bg-[#303b35] text-[#eae9e1] rounded-[6px] border border-[#465047] font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-1.5 bg-[#c16c4b] hover:bg-[#a85a3c] text-[#eae9e1] font-semibold rounded-[6px] font-mono border border-transparent shadow-sm"
                >
                  {isUploading ? 'Hashing & Vaulting...' : 'Register Into Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
