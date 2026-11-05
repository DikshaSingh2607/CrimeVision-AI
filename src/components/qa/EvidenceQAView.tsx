/**
 * CrimeVision AI - Evidence Grounded Question Answering Assistant
 * Zero-hallucination RAG chat, exact source citations, refusal badges
 */

import React, { useState } from 'react';
import {
  MessageSquareText,
  Send,
  ShieldCheck,
  FileText,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Bot,
  User,
  ExternalLink,
  Info
} from 'lucide-react';
import { QAMessage, QACitation } from '../../types/forensic';

interface EvidenceQAViewProps {
  caseId: string;
  qaHistory: QAMessage[];
  onAskQuestion: (question: string) => Promise<void>;
  onInspectEvidence?: (evidenceId: string) => void;
}

export const EvidenceQAView: React.FC<EvidenceQAViewProps> = ({
  caseId,
  qaHistory,
  onAskQuestion,
  onInspectEvidence
}) => {
  const [questionInput, setQuestionInput] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [citationModal, setCitationModal] = useState<QACitation | null>(null);

  const sampleQuestions = [
    'What time is mentioned in the witness statements regarding the vehicle?',
    'What information is available about the padlock cutting tool and paint marks?',
    'Which physical items were recovered and logged into evidence?',
    'Who is the suspect responsible for breaking into the warehouse?', // Unanswerable / Refusal test
    'Summarize the environmental and weather conditions during the incident window.'
  ];

  const handleSend = async (qToSend?: string) => {
    const text = qToSend || questionInput;
    if (!text.trim() || isAsking) return;

    setIsAsking(true);
    setQuestionInput('');
    try {
      await onAskQuestion(text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-[#29312c] border border-[#465047] rounded-[6px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-sm font-semibold text-[#eae9e1] flex items-center gap-2">
            <MessageSquareText className="w-4 h-4 text-[#c16c4b]" />
            Evidence-Grounded AI Assistant // Case {caseId}
          </h1>
          <p className="text-xs text-[#a5aaa0] mt-0.5 font-mono">
            Answers exclusively from retrieved case files. Every factual assertion is bound to traceable citations.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-1 bg-[#181d1a] border border-[#81977d]/60 rounded-[4px] text-[11px] font-mono text-[#81977d]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ZERO-HALLUCINATION PROTOCOL</span>
        </div>
      </div>

      {/* Suggested Forensic Inquiries */}
      <div className="bg-[#1b211e] border border-[#465047] p-3 rounded-[6px] space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-wider text-[#a5aaa0] flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#d6c9aa]" />
          Benchmark Test Inquiries (Answerable & Grounded Refusals):
        </div>
        <div className="flex flex-wrap gap-1.5">
          {sampleQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              className="text-[11px] font-mono text-left px-2.5 py-1 bg-[#202522] hover:bg-[#303b35] hover:text-[#eae9e1] text-[#d6c9aa] border border-[#465047] rounded-[4px] transition-colors"
            >
              "{sq}"
            </button>
          ))}
        </div>
      </div>

      {/* Conversational Stream */}
      <div className="bg-[#181d1a] border border-[#465047] rounded-[6px] p-4 min-h-[420px] max-h-[580px] overflow-y-auto space-y-4">
        {qaHistory.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center text-[#a5aaa0] space-y-2">
            <Bot className="w-8 h-8 text-[#465047]" />
            <div className="text-xs font-mono">No queries in case log yet.</div>
            <div className="text-[11px]">Select a suggested inquiry above or enter a question below.</div>
          </div>
        ) : (
          qaHistory.map((msg) => {
            const isAI = msg.sender === 'AI';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isAI ? 'items-start' : 'items-start justify-end'}`}
              >
                {isAI && (
                  <div className="w-7 h-7 rounded-[4px] bg-[#29312c] border border-[#c16c4b] text-[#c16c4b] flex items-center justify-center text-xs shrink-0 font-mono font-bold">
                    CV
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-[6px] p-3.5 space-y-2.5 text-xs ${
                    isAI
                      ? 'bg-[#29312c] border border-[#465047] text-[#eae9e1]'
                      : 'bg-[#303b35] border border-[#d6c9aa]/40 text-[#eae9e1]'
                  }`}
                >
                  {/* Top Bar for Message */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#a5aaa0]">
                    <span className="font-semibold text-[#d6c9aa]">
                      {isAI ? 'CRIMEVISION GROUNDED ENGINE' : 'INVESTIGATOR QUERY'}
                    </span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>

                  {/* Refusal Notice Badge */}
                  {msg.isRefusal && (
                    <div className="bg-[#1b211e] border border-[#d3a15d]/60 p-2 rounded-[4px] flex items-start gap-2 text-xs font-mono text-[#efe1c1]">
                      <Info className="w-3.5 h-3.5 text-[#d3a15d] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-[#d3a15d]">MANDATORY FORENSIC REFUSAL</div>
                        <div className="text-[11px] text-[#a5aaa0]">
                          Target fact is absent from verified case files. System refused to extrapolate or infer guilt.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message Content */}
                  <div className="leading-relaxed whitespace-pre-wrap font-sans text-xs">
                    {msg.content}
                  </div>

                  {/* Citations Box (Section 10 Requirement) */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2 border-t border-[#465047]/60 space-y-1.5">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[#a5aaa0] flex items-center gap-1">
                        <FileText className="w-3 h-3 text-[#d6c9aa]" />
                        Traceable Evidence Citations ({msg.citations.length}):
                      </div>

                      <div className="grid grid-cols-1 gap-1.5">
                        {msg.citations.map((cite, cIdx) => (
                          <div
                            key={cIdx}
                            className="bg-[#1b211e] border border-[#465047] p-2 rounded-[4px] space-y-1 text-[11px] font-mono"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[#c16c4b] font-semibold truncate">
                                [{cIdx + 1}] {cite.fileName} ({cite.locationRef})
                              </span>
                              <span className="text-[10px] text-[#81977d]">
                                {Math.round(cite.confidenceScore * 100)}% Match
                              </span>
                            </div>
                            <p className="text-[10px] text-[#a5aaa0] italic truncate">
                              "{cite.excerpt}"
                            </p>
                            <button
                              onClick={() => setCitationModal(cite)}
                              className="text-[10px] text-[#d6c9aa] hover:underline flex items-center gap-1 pt-0.5"
                            >
                              Inspect Full Citation Excerpt
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {!isAI && (
                  <div className="w-7 h-7 rounded-[4px] bg-[#303b35] border border-[#d6c9aa] text-[#d6c9aa] flex items-center justify-center text-xs shrink-0 font-mono">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isAsking && (
          <div className="flex items-center gap-2 text-xs font-mono text-[#a5aaa0] p-2 bg-[#202522] border border-[#465047] rounded-[4px]">
            <div className="w-3 h-3 border-2 border-white/20 border-t-[#c16c4b] rounded-full animate-spin" />
            <span>Retrieving case evidence chunks and evaluating citations with Gemini...</span>
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={questionInput}
          onChange={(e) => setQuestionInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything about the uploaded evidence (e.g., conflicting times, vehicle details)..."
          className="flex-1 bg-[#101412] border border-[#465047] focus:border-[#d6c9aa] text-xs text-[#eae9e1] placeholder-[#a5aaa0]/60 px-3 py-2 rounded-[6px] focus:outline-none font-mono"
        />
        <button
          onClick={() => handleSend()}
          disabled={!questionInput.trim() || isAsking}
          className="px-4 py-2 bg-[#c16c4b] hover:bg-[#a85a3c] text-[#eae9e1] font-semibold text-xs rounded-[6px] border border-transparent shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-50 font-mono"
        >
          <Send className="w-3.5 h-3.5" />
          Query Evidence
        </button>
      </div>

      {/* Citation Full Excerpt Modal */}
      {citationModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#202522] border border-[#465047] rounded-[8px] max-w-lg w-full p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#465047] pb-2">
              <div className="text-xs font-mono font-bold text-[#c16c4b] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Evidence Citation // {citationModal.fileName}
              </div>
              <button
                onClick={() => setCitationModal(null)}
                className="text-xs text-[#a5aaa0] hover:text-[#eae9e1] font-mono"
              >
                [ESC]
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="text-[#a5aaa0] text-[11px]">
                LOCATION: <span className="text-[#eae9e1]">{citationModal.locationRef}</span>
              </div>
              <div className="bg-[#181d1a] border border-[#465047] p-3 rounded-[4px] text-xs text-[#eae9e1] whitespace-pre-wrap leading-relaxed">
                "{citationModal.excerpt}"
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#465047]">
              <button
                onClick={() => setCitationModal(null)}
                className="px-3 py-1 bg-[#29312c] hover:bg-[#303b35] text-xs font-mono text-[#eae9e1] border border-[#465047] rounded-[4px]"
              >
                Close Citation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
