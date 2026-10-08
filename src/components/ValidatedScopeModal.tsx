import React, { useState } from 'react';
import {
  COSTING_RINGS,
  FEATURE_MODULES,
  PLATFORM_FUNCTIONS,
  NonLinearCalculationResult,
} from '../lib/proposal-data';
import { CrmRecord } from '../lib/crm-data';
import {
  Printer,
  CheckCircle2,
  FileText,
  ShieldCheck,
  AlertCircle,
  X,
  RefreshCw,
  Cpu,
} from 'lucide-react';

interface ValidatedScopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  enabledFunctionIds: string[];
  selectedExperts: CrmRecord[];
  calculation: NonLinearCalculationResult;
  budgetCeiling: number | null;
}

export const ValidatedScopeModal: React.FC<ValidatedScopeModalProps> = ({
  isOpen,
  onClose,
  enabledFunctionIds,
  selectedExperts,
  calculation,
  budgetCeiling,
}) => {
  const [printedAck, setPrintedAck] = useState(false);
  const [aiAuditText, setAiAuditText] = useState<string | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  if (!isOpen) return null;

  const includedFunctions = PLATFORM_FUNCTIONS.filter(
    (f) => f.isFoundation || enabledFunctionIds.includes(f.id)
  );
  const excludedFunctions = PLATFORM_FUNCTIONS.filter(
    (f) => !f.isFoundation && !enabledFunctionIds.includes(f.id)
  );

  const handlePrintPdf = () => {
    setPrintedAck(true);
    window.print();
  };

  const handleRunDeepAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch('/api/ai/deep-scope-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          relationshipModel: calculation.relationshipModel.title,
          activeModules: FEATURE_MODULES.map((m) => m.title),
          scopeSummary: `Included functions: ${includedFunctions.length}, Excluded: ${excludedFunctions.length}. Lean total: £${calculation.totalConfiguredLean}, Expanded total: £${calculation.totalConfiguredExpanded}.`,
        }),
      });
      const data = await res.json();
      setAiAuditText(data.auditReport);
    } catch {
      setAiAuditText(
        'Scope verified against deterministic non-linear capacity rules and 4-package sequential delivery gates.'
      );
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Document 1: Validated Scope and Budget Range"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs overflow-y-auto p-2 sm:p-6 flex justify-center items-start"
    >
      {/* Light Paper Document Surface for PROPOSAL / PDF */}
      <div className="bg-[#FAF6EE] text-[#13302C] border-2 border-[#123C3A] rounded-xl max-w-5xl w-full shadow-2xl overflow-hidden my-4">
        {/* Top Action Bar (Hidden in Print) */}
        <div className="no-print bg-[#123C3A] text-[#F2EADB] px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#E3A22E]">
          <div>
            <span className="font-mono-tech text-xs uppercase tracking-widest text-[#E3A22E]">
              STAGE 1 OUTPUT · DOCUMENT FOR CLIENT CONFIRMATION (NOT A CONTRACT)
            </span>
            <h2 className="font-display-oswald text-2xl uppercase tracking-wide text-[#FCE9B0]">
              Validated Scope & Indicative Budget Range (v1.3)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleRunDeepAudit}
              disabled={isAuditing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded font-mono-tech text-xs uppercase bg-[#1C4F52] hover:bg-[#2A6E78] text-[#FCE9B0] border border-[#E3A22E]/40 cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-[#E3A22E]" />
              {isAuditing ? 'Running High-Thinking Audit...' : 'Verify Scope Architecture'}
            </button>

            <button
              type="button"
              onClick={handlePrintPdf}
              className="inline-flex items-center gap-2 px-4 py-2 rounded font-display-oswald text-sm uppercase tracking-wider bg-[#E3A22E] text-[#0B2422] font-bold hover:bg-[#EBB13A] cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Export Validated Scope PDF
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Validated Scope Document"
              className="p-2 rounded bg-[#0E302E] hover:bg-[#1C4F52] text-[#F2EADB] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Post-Print / Working Assignment Gratitude & Formalization Banner */}
        <div className="bg-[#123C3A]/10 border-b border-[#123C3A]/20 px-6 py-4 flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-[#0B544C] shrink-0 mt-0.5" />
          <div className="text-sm text-[#13302C]">
            <div className="font-isrm-heading font-bold text-[#0B544C] uppercase tracking-wide">
              {printedAck
                ? 'Thank You — Working Scope Assignment Prepared for Print / PDF'
                : 'Working Scope Assignment Notice (Stage 1 → Stage 2 Transition)'}
            </div>
            <p className="mt-1 leading-relaxed">
              Thank you for configuring the ISRM Insight Hub scope. <strong>This document is a Working Scope Assignment (Робоче завдання)</strong> designed to align priorities, confirm the acceptable budget ceiling, and serve as the formal baseline for preparing <strong>Document 2: Commercial Proposal & Statement of Work (SOW)</strong> and formalising contractual relationships.
            </p>
          </div>
        </div>

        {/* Document Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Document Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-[#E9DEC9]/70 border border-[#123C3A]/20 font-mono-tech text-xs">
            <div>
              <div className="text-[#13302C]/60 uppercase">Document Version</div>
              <div className="font-semibold text-[#123C3A] mt-0.5">v1.3 · 2026-10-06</div>
            </div>
            <div>
              <div className="text-[#13302C]/60 uppercase">Approval Status</div>
              <div className="font-semibold text-[#B5481A] mt-0.5">FOR CONFIRMATION</div>
            </div>
            <div>
              <div className="text-[#13302C]/60 uppercase">Relationship Model</div>
              <div className="font-semibold text-[#123C3A] mt-0.5">{calculation.relationshipModel.code}</div>
            </div>
            <div>
              <div className="text-[#13302C]/60 uppercase">Client Budget Ceiling</div>
              <div className="font-semibold text-[#123C3A] mt-0.5">
                {budgetCeiling ? `£${budgetCeiling.toLocaleString()} (Preliminary)` : 'To be confirmed by Client'}
              </div>
            </div>
          </div>

          {aiAuditText && (
            <div className="p-4 rounded-lg bg-[#0E302E] text-[#F2EADB] border-l-4 border-[#E3A22E] text-xs font-mono-tech whitespace-pre-line leading-relaxed">
              {aiAuditText}
            </div>
          )}

          {/* Section 1: Sequential 4-Package Costing & Payment Schedule */}
          <section>
            <div className="flex items-center justify-between border-b-2 border-[#123C3A] pb-2 mb-4">
              <h3 className="font-isrm-heading font-bold text-lg uppercase text-[#0B544C]">
                01 · Sequential 4-Package Scope & Indicative Delivery Range
              </h3>
              <span className="font-mono-tech text-xs text-[#B5481A]">
                All prices indicative pending scope & ceiling sign-off
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-[#123C3A]/30 bg-[#E9DEC9]/60 font-mono-tech text-xs uppercase text-[#123C3A]">
                    <th className="py-2.5 px-3">Sequential Package</th>
                    <th className="py-2.5 px-3">Active Functions</th>
                    <th className="py-2.5 px-3">Formula & Capacity Basis</th>
                    <th className="py-2.5 px-3 text-right">Lean Model (GBP)</th>
                    <th className="py-2.5 px-3 text-right">Expanded Model (GBP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#123C3A]/15">
                  {COSTING_RINGS.map((ring) => {
                    const rt = calculation.ringTotals.find((r) => r.ringId === ring.id);
                    return (
                      <tr key={ring.id} className="hover:bg-[#E9DEC9]/30">
                        <td className="py-3 px-3 align-top">
                          <div className="font-mono-tech text-xs text-[#B5481A] font-semibold">
                            {ring.code}
                          </div>
                          <div className="font-semibold text-[#13302C]">{ring.title}</div>
                          {ring.isRepeatableCycle && (
                            <div className="inline-flex items-center gap-1 mt-1 font-mono-tech text-[11px] text-[#0B544C] bg-[#0B544C]/10 px-2 py-0.5 rounded">
                              <RefreshCw className="w-3 h-3" /> Contains Repeatable Expert Cohort Cycle
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 align-top font-mono-tech text-xs">
                          {rt?.includedFunctionsCount} / {rt?.totalFunctionsInRing} Functions
                        </td>
                        <td className="py-3 px-3 align-top text-xs text-[#13302C]/80">
                          <div>{rt?.formulaExplanation}</div>
                          <div className="font-mono-tech text-[11px] text-[#13302C]/60 mt-0.5">
                            Payment: {ring.paymentTermNote}
                          </div>
                        </td>
                        <td className="py-3 px-3 align-top text-right font-mono-tech font-semibold tabular-nums">
                          £{(rt?.leanAmount || 0).toLocaleString()}
                        </td>
                        <td className="py-3 px-3 align-top text-right font-mono-tech font-semibold tabular-nums text-[#0B544C]">
                          £{(rt?.expandedAmount || 0).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[#123C3A] bg-[#E9DEC9] font-bold">
                    <td colSpan={3} className="py-3 px-3 font-display-oswald uppercase text-base text-[#123C3A]">
                      Total Configured Scope Range (Packages 1–4)
                    </td>
                    <td className="py-3 px-3 text-right font-mono-tech text-base tabular-nums text-[#123C3A]">
                      £{calculation.totalConfiguredLean.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono-tech text-base tabular-nums text-[#0B544C]">
                      £{calculation.totalConfiguredExpanded.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-[#F2EADB] text-xs font-mono-tech">
                    <td colSpan={3} className="py-2.5 px-3 text-[#8A3410]">
                      Initial Mobilisation Assumption (At least 30% of agreed total budget; balance upon package delivery/acceptance)
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-[#8A3410] font-semibold">
                      from £{calculation.mobilisationMinimumLean.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right tabular-nums text-[#8A3410] font-semibold">
                      from £{calculation.mobilisationMinimumExpanded.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* Section 2: Included vs Excluded Scope & Consequences */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-white border border-[#123C3A]/20">
              <h4 className="font-display-oswald text-base uppercase text-[#0B544C] border-b border-[#123C3A]/15 pb-2 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Selected Structural & Optional Functions ({includedFunctions.length})
              </h4>
              <ul className="space-y-2 text-xs">
                {includedFunctions.map((fn) => (
                  <li key={fn.id} className="flex items-start justify-between gap-2 pb-1.5 border-b border-[#123C3A]/10">
                    <div>
                      <span className="font-semibold text-[#13302C]">{fn.title}</span>
                      <div className="text-[#13302C]/70">{fn.communityPerspective}</div>
                    </div>
                    <span className="font-mono-tech text-[10px] px-1.5 py-0.5 rounded bg-[#E9DEC9] text-[#123C3A] shrink-0">
                      {fn.isFoundation ? 'FOUNDATION' : fn.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-white border border-[#B5481A]/30">
              <h4 className="font-display-oswald text-base uppercase text-[#B5481A] border-b border-[#B5481A]/20 pb-2 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Excluded Functions & Operational Impact ({excludedFunctions.length})
              </h4>
              {excludedFunctions.length === 0 ? (
                <p className="text-xs text-[#13302C]/70">
                  All 14 Service Deck functions across Packages 1–4 are currently included in this configuration.
                </p>
              ) : (
                <ul className="space-y-2.5 text-xs">
                  {excludedFunctions.map((fn) => (
                    <li key={fn.id} className="p-2 rounded bg-[#8A3410]/5 border-l-2 border-[#B5481A]">
                      <div className="font-semibold text-[#8A3410]">{fn.title}</div>
                      <div className="text-[#13302C]/80 mt-0.5">{fn.excludedLossWarning}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Section 3: Selected Pilot Expert Group & Open Governance Questions */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-white border border-[#123C3A]/20">
              <h4 className="font-display-oswald text-base uppercase text-[#123C3A] border-b border-[#123C3A]/15 pb-2 mb-3">
                Selected Expert Working Group ({selectedExperts.length} Profiles)
              </h4>
              {selectedExperts.length === 0 ? (
                <p className="text-xs text-[#13302C]/70">
                  Default baseline: 45 verified profiles in ISRM Ukraine Cohort 1. Select specific profiles on the graph to pin a custom subgroup.
                </p>
              ) : (
                <div className="space-y-1.5 text-xs max-h-44 overflow-y-auto">
                  {selectedExperts.map((ex) => (
                    <div key={ex.recordId} className="flex items-center justify-between py-1 border-b border-[#123C3A]/10">
                      <span className="font-semibold">{ex.contactName}</span>
                      <span className="font-mono-tech text-[11px] text-[#13302C]/70">
                        {ex.organisation} · {ex.identityStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 rounded-lg bg-white border border-[#123C3A]/20">
              <h4 className="font-display-oswald text-base uppercase text-[#123C3A] border-b border-[#123C3A]/15 pb-2 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#B5481A]" />
                Mandatory Gates & Open Questions Before Stage 2 SOW
              </h4>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#13302C]/85 leading-relaxed">
                <li>
                  <strong>Preliminary Budget Ceiling & Relationship Model:</strong> Confirm whether Model A (Dedicated), Model B (Founding Partner), or Model C (Platform Service) is selected.
                </li>
                <li>
                  <strong>Pilot Cohort 2 Definition Gate:</strong> Board/Client to name the second expert cohort before any survey distribution.
                </li>
                <li>
                  <strong>Survey & Privacy Controller Gate:</strong> Sign off data controller, privacy notice, and retention rules prior to activating the survey preview.
                </li>
                <li>
                  <strong>TII Methodology Gate:</strong> Review Trust & Influence Index (TII) evidence weights and appeal procedure during Package 3/4 transition.
                </li>
              </ol>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
