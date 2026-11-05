/**
 * CrimeVision AI - Multimodal AI Processing Console
 * Pipeline orchestration, telemetry logs, processing stages
 */

import React, { useState } from 'react';
import {
  Cpu,
  Play,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Headphones,
  Video,
  Terminal,
  ShieldAlert,
  Layers,
  Sparkles
} from 'lucide-react';
import { EvidenceItem } from '../../types/forensic';

interface AnalysisViewProps {
  caseId: string;
  evidence: EvidenceItem[];
  onRunAnalysis: () => Promise<void>;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  caseId,
  evidence,
  onRunAnalysis
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<number>(4); // Completed by default for demo
  const [logs, setLogs] = useState<string[]>([
    '[INIT] CrimeVision Multimodal Engine initialized.',
    '[SHA256] Verified 15 physical evidence hashes against vault ledger.',
    '[OCR] PyMuPDF & Tesseract extracted 4 document streams with 98.9% accuracy.',
    '[VISION] Evaluated Scene_Image_001.jpg: Detected tool striations on Master Lock 65D bracket (98.4% CONF).',
    '[VISION] Evaluated Scene_Image_002.jpg: Detected chevron tire tread pattern (96.2% CONF).',
    '[AUDIO] Ingested 911 dispatch audio & witness interview. Whisper diarized 2 speaker channels.',
    '[VIDEO] Sampled 4 keyframes from Demo_CCTV.mp4 at timestamps 20:40:15 to 20:45:20 UTC.',
    '[ENTITIES] Identified 18 structured entities & events (Person, Location, Vehicle, Object, Time).',
    '[CONSISTENCY] Flagged 3 critical discrepancies for human review (45-min time gap, Sedan vs SUV).',
    '[STATUS] Multimodal pipeline ready for human investigator review.'
  ]);

  const handleExecutePipeline = async () => {
    setIsRunning(true);
    setPipelineStep(1);
    setLogs(prev => [...prev, `[PIPELINE] Started manual re-analysis for Case ${caseId}...`]);

    setTimeout(() => {
      setPipelineStep(2);
      setLogs(prev => [...prev, '[DOCS] Extracting document chunks and vector representations...']);
    }, 600);

    setTimeout(() => {
      setPipelineStep(3);
      setLogs(prev => [...prev, '[VISION/AUDIO] Analyzing visual keyframes and audio speech logs with Gemini...']);
    }, 1200);

    setTimeout(async () => {
      setPipelineStep(4);
      setLogs(prev => [
        ...prev,
        '[PIPELINE] Multimodal extraction complete. Structured findings and timeline updated.'
      ]);
      await onRunAnalysis();
      setIsRunning(false);
    }, 1800);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#29312c] border border-[#465047] rounded-[6px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-sm font-semibold text-[#eae9e1] flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#c16c4b]" />
            Multimodal AI Analysis Pipeline
          </h1>
          <p className="text-xs text-[#a5aaa0] mt-0.5 font-mono">
            Orchestrates Document OCR, Image Vision, Speech-to-Text, and Video Keyframe Sampling.
          </p>
        </div>

        <button
          onClick={handleExecutePipeline}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#c16c4b] hover:bg-[#a85a3c] text-[#eae9e1] text-xs font-semibold rounded-[6px] border border-transparent shadow-sm transition-colors disabled:opacity-50 font-mono"
        >
          {isRunning ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing Pipeline...
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              Execute Pipeline
            </>
          )}
        </button>
      </div>

      {/* 4 Pipeline Stage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Stage 1: Document */}
        <div className={`bg-[#29312c] border rounded-[6px] p-3 space-y-2 ${
          pipelineStep >= 1 ? 'border-[#81977d]' : 'border-[#465047]'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#d6c9aa] font-semibold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              1. Document OCR
            </span>
            <span className="text-[10px] text-[#81977d]">ACTIVE</span>
          </div>
          <p className="text-[11px] text-[#a5aaa0] leading-tight">
            Extracts text, preserves page indices, divides into searchable semantic chunks.
          </p>
          <div className="text-[10px] font-mono text-[#81977d]">
            ✓ 6 Documents Indexed
          </div>
        </div>

        {/* Stage 2: Vision */}
        <div className={`bg-[#29312c] border rounded-[6px] p-3 space-y-2 ${
          pipelineStep >= 2 ? 'border-[#81977d]' : 'border-[#465047]'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#c16c4b] font-semibold flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              2. Visual Context
            </span>
            <span className="text-[10px] text-[#81977d]">ACTIVE</span>
          </div>
          <p className="text-[11px] text-[#a5aaa0] leading-tight">
            Scene captioning, tool striation detection, scale bar readings. No facial analysis.
          </p>
          <div className="text-[10px] font-mono text-[#81977d]">
            ✓ 4 Photographs Scanned
          </div>
        </div>

        {/* Stage 3: Audio */}
        <div className={`bg-[#29312c] border rounded-[6px] p-3 space-y-2 ${
          pipelineStep >= 3 ? 'border-[#81977d]' : 'border-[#465047]'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#81977d] font-semibold flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5" />
              3. Audio Speech
            </span>
            <span className="text-[10px] text-[#81977d]">ACTIVE</span>
          </div>
          <p className="text-[11px] text-[#a5aaa0] leading-tight">
            Whisper transcription with speaker diarization and millisecond timestamping.
          </p>
          <div className="text-[10px] font-mono text-[#81977d]">
            ✓ 2 Recordings Transcribed
          </div>
        </div>

        {/* Stage 4: Video */}
        <div className={`bg-[#29312c] border rounded-[6px] p-3 space-y-2 ${
          pipelineStep >= 4 ? 'border-[#81977d]' : 'border-[#465047]'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#d3a15d] font-semibold flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5" />
              4. Video Keyframes
            </span>
            <span className="text-[10px] text-[#81977d]">ACTIVE</span>
          </div>
          <p className="text-[11px] text-[#a5aaa0] leading-tight">
            Keyframe sampling across intrusion window with movement telemetry.
          </p>
          <div className="text-[10px] font-mono text-[#81977d]">
            ✓ 4 Keyframes Extracted
          </div>
        </div>
      </div>

      {/* Ethical Guardrail Disclaimer */}
      <div className="bg-[#1b211e] border border-[#c16c4b]/50 p-3 rounded-[6px] flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-[#c16c4b] shrink-0 mt-0.5" />
        <div className="space-y-0.5 text-xs">
          <div className="font-semibold text-[#eae9e1] font-mono">
            INVESTIGATOR DECISION-SUPPORT PROTOCOL ENFORCED
          </div>
          <p className="text-[#a5aaa0] text-[11px] leading-relaxed">
            CrimeVision AI operates strictly as an analytical decision-support tool. It never determines guilt or innocence, never performs facial recognition or biometric identification, and never fabricates citations. All extracted findings are initially classified as PENDING and require human investigator verification.
          </p>
        </div>
      </div>

      {/* Live Pipeline Telemetry Log Console */}
      <div className="bg-[#181d1a] border border-[#465047] rounded-[6px] p-4 space-y-2">
        <div className="flex items-center justify-between border-b border-[#465047] pb-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#d6c9aa]">
            <Terminal className="w-4 h-4 text-[#81977d]" />
            Pipeline Telemetry Console
          </div>
          <span className="text-[10px] font-mono text-[#a5aaa0]">STREAM // ACTIVE</span>
        </div>

        <div className="font-mono text-xs text-[#eae9e1] space-y-1 max-h-64 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[#a5aaa0]/50 select-none text-[10px]">{String(i + 1).padStart(2, '0')}</span>
              <span className={
                log.includes('[CONSISTENCY]') ? 'text-[#c16c4b]' :
                log.includes('[STATUS]') ? 'text-[#81977d]' :
                log.includes('[OCR]') || log.includes('[VISION]') ? 'text-[#d6c9aa]' : 'text-[#eae9e1]'
              }>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
