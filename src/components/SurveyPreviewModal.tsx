import React, { useState } from 'react';
import {
  INITIAL_SURVEY_DRAFT_QUESTIONS,
  SurveyQuestionDraft,
} from '../lib/proposal-data';
import {
  ShieldAlert,
  Edit3,
  CheckCircle2,
  Lock,
  Users,
  FileText,
  X,
} from 'lucide-react';

interface SurveyPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SurveyPreviewModal: React.FC<SurveyPreviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [questions, setQuestions] = useState<SurveyQuestionDraft[]>(
    INITIAL_SURVEY_DRAFT_QUESTIONS
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cohortTwoNotes, setCohortTwoNotes] = useState<string>(
    'Pending Board/Client Definition Gate — Do not infer or launch until Cohort 2 segment, data controller, and privacy notice are formally approved.'
  );
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleQuestionChange = (id: string, newText: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, questionText: newText } : q))
    );
    setSavedNotice(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Editable Application-Need Survey Preview & Pilot Cohort Gate"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div className="bg-[#F2EADB] text-[#13302C] border-2 border-[#123C3A] rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#123C3A] text-[#F2EADB] px-6 py-4 flex items-center justify-between border-b-2 border-[#E3A22E]">
          <div>
            <div className="font-mono-tech text-xs uppercase tracking-widest text-[#E3A22E]">
              SOURCE: ISRM_Community_Member_Survey_Draft.md · NON-SUBMITTING PREVIEW
            </div>
            <h2 className="font-display-oswald text-2xl uppercase tracking-wide text-[#FCE9B0] mt-0.5">
              Pilot Cohort Governance & Editable Survey Preview
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Survey Preview"
            className="p-2 rounded bg-[#0E302E] hover:bg-[#1C4F52] text-[#F2EADB] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Mandatory Non-Launch Governance Banner */}
          <div className="p-4 rounded-lg bg-[#8A3410]/10 border-l-4 border-[#B5481A] flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-[#B5481A] shrink-0 mt-0.5" />
            <div className="text-sm leading-relaxed">
              <div className="font-display-oswald uppercase text-base text-[#8A3410] font-semibold">
                Strict Governance Gate: Preview Only — Distribution & Response Collection Locked
              </div>
              <p className="text-[#13302C]/90 mt-1">
                This screen provides a client-editable preview of the application-need survey to refine questions and workflow priorities. <strong>No survey may be launched, distributed, or used to collect member responses</strong> until the ISRM Board/Client formally approves: (1) Purpose, (2) Cohort 2 definition, (3) Data Controller, (4) Privacy Notice, (5) Distribution Channel, and (6) Retention Policy.
              </p>
            </div>
          </div>

          {/* Two-Cohort Pilot Structure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white border border-[#123C3A]/20 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono-tech text-xs uppercase text-[#0B544C] font-semibold flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> PILOT COHORT 01 · IDENTIFIED
                </span>
                <span className="font-mono-tech text-xs px-2 py-0.5 rounded bg-[#123C3A]/10 text-[#123C3A]">
                  45 Verified Profiles
                </span>
              </div>
              <h3 className="font-isrm-heading font-bold text-base text-[#0B544C]">
                Existing Engaged ISRM Ukraine Members
              </h3>
              <p className="text-sm text-[#13302C]/80 mt-1 leading-relaxed">
                Comprises the 45 verified profiles in the ISRM Ukraine Master Register (chapter organisers, verified NGO security directors, risk advisers, and academic liaisons) who are already engaged in chapter activities.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-white border-2 border-dashed border-[#B5481A]/60 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono-tech text-xs uppercase text-[#B5481A] font-semibold flex items-center gap-1.5">
                  <Lock className="w-4 h-4" /> PILOT COHORT 02 · BOARD DECISION GATE
                </span>
                <span className="font-mono-tech text-xs px-2 py-0.5 rounded bg-[#E8C24A]/30 text-[#8A3410]">
                  Client Gate Pending
                </span>
              </div>
              <h3 className="font-isrm-heading font-bold text-base text-[#13302C]">
                Second Expert Cohort (Client / Board to Define)
              </h3>
              <label
                htmlFor="cohort-two-definition-input"
                className="block font-mono-tech text-[11px] text-[#13302C]/70 mt-2 mb-1"
              >
                Client / Board Notes for Cohort 2 Selection Criteria (Editable Proposal Note):
              </label>
              <textarea
                id="cohort-two-definition-input"
                rows={2}
                value={cohortTwoNotes}
                onChange={(e) => {
                  setCohortTwoNotes(e.target.value);
                  setSavedNotice(true);
                }}
                className="w-full p-2 text-xs rounded border border-[#123C3A]/30 bg-[#F2EADB]/50 text-[#13302C] focus:outline-none focus:border-[#123C3A]"
              />
            </div>
          </div>

          {/* Editable Survey Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#123C3A]/20 pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0B544C]" />
                <h3 className="font-display-oswald text-lg uppercase text-[#123C3A]">
                  Editable Application-Need Survey Questions (Draft v1.3)
                </h3>
              </div>
              {savedNotice && (
                <span className="font-mono-tech text-xs text-[#0B544C] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Draft Edits Retained in Session Scope
                </span>
              )}
            </div>

            {questions.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-lg bg-white border border-[#123C3A]/15 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-tech text-xs uppercase text-[#B5481A] font-semibold">
                    {q.section}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingId(editingId === q.id ? null : q.id)}
                    className="inline-flex items-center gap-1 font-mono-tech text-xs px-2.5 py-1 rounded bg-[#E9DEC9] hover:bg-[#C9B591] text-[#123C3A] cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    {editingId === q.id ? 'Done Editing' : 'Edit Question Wording'}
                  </button>
                </div>

                {editingId === q.id ? (
                  <div>
                    <label htmlFor={`edit-${q.id}`} className="sr-only">
                      Edit Question {q.id}
                    </label>
                    <textarea
                      id={`edit-${q.id}`}
                      rows={2}
                      value={q.questionText}
                      onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                      className="w-full p-2.5 text-sm rounded border-2 border-[#123C3A] bg-[#F2EADB]/40 text-[#13302C]"
                    />
                  </div>
                ) : (
                  <p className="font-semibold text-base text-[#13302C]">
                    {q.questionText}
                  </p>
                )}

                {q.options && (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                    {q.options.map((opt, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-xs text-[#13302C]/85 bg-[#F2EADB]/50 px-2.5 py-1.5 rounded border border-[#123C3A]/10"
                      >
                        <span className="w-3 h-3 rounded-xs border border-[#123C3A]/50 shrink-0" />
                        <span>{opt}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="font-mono-tech text-[11px] text-[#13302C]/65 pt-1">
                  Methodology Purpose: {q.purposeNote}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer — Non-Submitting State */}
        <div className="bg-[#E9DEC9] px-6 py-4 border-t border-[#123C3A]/20 flex flex-wrap items-center justify-between gap-3">
          <div className="font-mono-tech text-xs text-[#13302C]/80">
            Status: <strong>NON-SUBMITTING PREVIEW</strong> · 0 responses collected · Awaits Board Gate
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="px-4 py-2 rounded font-display-oswald text-xs uppercase tracking-wider bg-[#13302C]/20 text-[#13302C]/50 cursor-not-allowed"
            >
              Launch / Distribute Locked Until Board Sign-Off
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded font-display-oswald text-sm uppercase tracking-wider bg-[#123C3A] text-[#FCE9B0] hover:bg-[#1C4F52] cursor-pointer"
            >
              Save Question Edits & Return to Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
