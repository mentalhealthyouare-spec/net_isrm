import React, { useState, useEffect } from 'react';
import {
  PlatformFunctionItem,
  FeatureModuleDossier,
  COSTING_RINGS,
  NonLinearCalculationResult,
} from '../lib/proposal-data';
import {
  Layers,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Cpu,
  Calculator,
  ArrowRight,
  Lock,
  Sparkles,
  FileCheck2,
  X,
  RefreshCw,
} from 'lucide-react';

interface ServiceDeckCascadeProps {
  selectedFunction: PlatformFunctionItem | null;
  selectedModule: FeatureModuleDossier | null;
  enabledFunctionIds: string[];
  confirmedModuleIds: string[];
  techConfirmedModuleIds: string[];
  calculation: NonLinearCalculationResult;
  onToggleFunction: (fnId: string) => void;
  onConfirmModule: (moduleId: string) => void;
  onRejectModule: (moduleId: string) => void;
  onConfirmTechStack: (moduleId: string) => void;
  onOpenValidatedScope: () => void;
  onCloseOverlay: () => void;
}

export const ServiceDeckCascade: React.FC<ServiceDeckCascadeProps> = ({
  selectedFunction,
  selectedModule,
  enabledFunctionIds,
  confirmedModuleIds,
  techConfirmedModuleIds,
  calculation,
  onToggleFunction,
  onConfirmModule,
  onRejectModule,
  onConfirmTechStack,
  onOpenValidatedScope,
  onCloseOverlay,
}) => {
  const [streamedTechText, setStreamedTechText] = useState('');
  const [isStreamingTech, setIsStreamingTech] = useState(false);
  const [displayedLeanTotal, setDisplayedLeanTotal] = useState(calculation.totalConfiguredLean);
  const [displayedExpandedTotal, setDisplayedExpandedTotal] = useState(calculation.totalConfiguredExpanded);
  const [rejectedState, setRejectedState] = useState<boolean>(false);

  const activeModule = selectedModule;
  const isModuleConfirmed = activeModule ? confirmedModuleIds.includes(activeModule.id) : false;
  const isTechConfirmed = activeModule ? techConfirmedModuleIds.includes(activeModule.id) : false;

  // Stream AI-speed tech stack narrative when module is confirmed
  useEffect(() => {
    if (!activeModule) {
      setStreamedTechText('');
      setIsStreamingTech(false);
      setRejectedState(false);
      return;
    }

    if (isModuleConfirmed && !isTechConfirmed) {
      setIsStreamingTech(true);
      setStreamedTechText('');
      const fullText = activeModule.techStackNarrative;
      let idx = 0;
      const timer = setInterval(() => {
        idx += 4;
        if (idx >= fullText.length) {
          setStreamedTechText(fullText);
          setIsStreamingTech(false);
          clearInterval(timer);
        } else {
          setStreamedTechText(fullText.slice(0, idx));
        }
      }, 25);
      return () => clearInterval(timer);
    } else if (isTechConfirmed) {
      setStreamedTechText(activeModule.techStackNarrative);
      setIsStreamingTech(false);
    }
  }, [activeModule, isModuleConfirmed, isTechConfirmed]);

  // Stepwise price counter animation while tech block is active
  useEffect(() => {
    const targetLean = calculation.totalConfiguredLean;
    const targetExpanded = calculation.totalConfiguredExpanded;

    if (displayedLeanTotal === targetLean && displayedExpandedTotal === targetExpanded) {
      return;
    }

    const steps = 14;
    let currentStep = 0;
    const startLean = displayedLeanTotal;
    const startExpanded = displayedExpandedTotal;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayedLeanTotal(targetLean);
        setDisplayedExpandedTotal(targetExpanded);
        clearInterval(interval);
      } else {
        const progress = currentStep / steps;
        setDisplayedLeanTotal(Math.round(startLean + (targetLean - startLean) * progress));
        setDisplayedExpandedTotal(Math.round(startExpanded + (targetExpanded - startExpanded) * progress));
      }
    }, 30);

    return () => clearInterval(interval);
  }, [calculation.totalConfiguredLean, calculation.totalConfiguredExpanded]);

  if (!activeModule) return null;

  const ringSpec = COSTING_RINGS.find((r) => r.id === activeModule.ringId);
  const moduleFunctions = activeModule.functionIds;
  const activeCountInModule = moduleFunctions.filter((fid) => enabledFunctionIds.includes(fid)).length;

  return (
    <div
      role="dialog"
      aria-label={`Feature Module Configurator Overlay: ${activeModule.title}`}
      className="fixed inset-x-0 bottom-14 z-40 mx-auto max-w-[96vw] xl:max-w-[1480px] pointer-events-auto transition-all duration-200 px-2 sm:px-6"
    >
      {/* Translucent wide overlay (>1.4x standard reading frame width on desktop) preserving continuous graph behind */}
      <div className="bg-[#0B2422]/88 backdrop-blur-md border-2 border-[#E3A22E]/70 rounded-xl shadow-2xl text-[#F2EADB] overflow-hidden max-h-[78vh] flex flex-col">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 bg-[#123C3A]/95 border-b border-[#E3A22E]/30">
          <div className="flex items-center gap-3">
            <span className="font-mono-tech text-xs tracking-widest uppercase px-2.5 py-1 rounded bg-[#E3A22E]/20 text-[#FCE9B0] border border-[#E3A22E]/50">
              {ringSpec?.code || 'RING'} · {activeModule.status}
            </span>
            <h3 className="font-display-oswald text-lg sm:text-xl uppercase tracking-wide text-[#FCE9B0]">
              {activeModule.title}
            </h3>
            {activeModule.hasRepeatableExpertCycle && (
              <span className="hidden md:inline-flex items-center gap-1.5 font-mono-tech text-xs text-[#E8741E] bg-[#8A3410]/30 border border-[#E8741E]/50 px-2.5 py-0.5 rounded">
                <RefreshCw className="w-3.5 h-3.5" /> REPEATABLE EXPERT CYCLE (PACKAGE 3 ONLY)
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono-tech text-xs text-[#F2EADB]/70">
              Graph Context Visible Behind Overlay · Functions Active: {activeCountInModule}/{moduleFunctions.length}
            </span>
            <button
              type="button"
              onClick={onCloseOverlay}
              aria-label="Close Module Overlay"
              className="p-1.5 rounded bg-[#0E302E] hover:bg-[#1C4F52] text-[#F2EADB] border border-[#F2EADB]/20 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4-Block Progressive Cascade Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 sm:p-5 overflow-y-auto">
          {/* BLOCK 1 & 2: Feature Mini-Dossier & Function Cascade (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#0E302E]/90 border border-[#2A6E78]/60 rounded-lg p-4">
            <div>
              <div className="flex items-center justify-between border-b border-[#2A6E78]/40 pb-2 mb-3">
                <span className="font-mono-tech text-xs uppercase tracking-wider text-[#E3A22E]">
                  BLOCK 01–02 · FEATURE DOSSIER & COMMUNITY FUNCTIONS
                </span>
                {activeModule.isFoundation && (
                  <span className="inline-flex items-center gap-1 font-mono-tech text-[11px] text-[#FCE9B0]">
                    <Lock className="w-3 h-3 text-[#E3A22E]" /> NON-REMOVABLE FOUNDATION
                  </span>
                )}
              </div>

              <p className="text-sm text-[#F2EADB]/90 leading-relaxed mb-3">
                {activeModule.description}
              </p>

              {/* If Rejected / Excluded State is triggered, highlight losses in Signal Red / Orange */}
              {rejectedState && !activeModule.isFoundation ? (
                <div className="p-3 rounded bg-[#E50914]/15 border-l-4 border-[#E50914] mb-3">
                  <div className="flex items-center gap-2 font-display-oswald text-sm uppercase text-[#FCE9B0]">
                    <AlertTriangle className="w-4 h-4 text-[#E50914]" />
                    Consequence of Excluding Module
                  </div>
                  <p className="text-xs text-[#F2EADB]/90 mt-1 leading-relaxed">
                    {activeModule.exclusionImpact}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs mb-3">
                  <div className="p-2.5 rounded bg-[#123C3A]/70 border border-[#2A6E78]/40">
                    <div className="font-mono-tech text-[10px] uppercase text-[#E3A22E]">Community Function</div>
                    <div className="text-[#F2EADB]/90 mt-1">{activeModule.communityFunctionSummary}</div>
                  </div>
                  <div className="p-2.5 rounded bg-[#123C3A]/70 border border-[#2A6E78]/40">
                    <div className="font-mono-tech text-[10px] uppercase text-[#E3A22E]">Expected Result & KPI</div>
                    <div className="text-[#F2EADB]/90 mt-1">{activeModule.expectedResult}</div>
                  </div>
                </div>
              )}

              {activeModule.hasRepeatableExpertCycle && (
                <div className="p-2.5 rounded bg-[#8A3410]/25 border border-[#E8741E]/50 text-xs text-[#FCE9B0] mb-3">
                  <strong className="font-mono-tech uppercase text-[#E8741E]">Closed-Loop Pilot Cycle: </strong>
                  {ringSpec?.cycleDescription}
                </div>
              )}

              <div className="text-xs text-[#F2EADB]/80 space-y-1 mb-4">
                <div>
                  <span className="font-mono-tech text-[#E3A22E]">Target Users: </span>
                  {activeModule.targetUsers.join(' · ')}
                </div>
                <div>
                  <span className="font-mono-tech text-[#E3A22E]">Dependencies: </span>
                  {activeModule.dependencies.join(' → ')}
                </div>
              </div>
            </div>

            {/* Action Buttons for Block 2: Confirm Whole Feature Module or Exclude */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#2A6E78]/40">
              <button
                type="button"
                onClick={() => {
                  setRejectedState(false);
                  onConfirmModule(activeModule.id);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded font-display-oswald text-sm uppercase tracking-wider bg-[#E3A22E] text-[#0B2422] hover:bg-[#EBB13A] transition-colors cursor-pointer font-semibold"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isModuleConfirmed ? 'Feature Module Enrolled (All Functions Active)' : 'Confirm Feature & Enroll Functions'}
              </button>

              {!activeModule.isFoundation && (
                <button
                  type="button"
                  onClick={() => {
                    setRejectedState(true);
                    onRejectModule(activeModule.id);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded font-display-oswald text-sm uppercase tracking-wider bg-[#8A3410]/60 text-[#FCE9B0] hover:bg-[#B5481A] border border-[#E8741E]/60 transition-colors cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  Exclude Module (View Losses)
                </button>
              )}
            </div>
          </div>

          {/* BLOCK 3: AI-Speed Technical Stack Unfolding & Validation State (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-[#0E302E]/90 border border-[#2A6E78]/60 rounded-lg p-4">
            <div>
              <div className="flex items-center justify-between border-b border-[#2A6E78]/40 pb-2 mb-3">
                <span className="font-mono-tech text-xs uppercase tracking-wider text-[#3E91A2] flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#E3A22E]" />
                  BLOCK 03 · TECHNICAL ARCHITECTURE & STACK
                </span>
                <span className="font-mono-tech text-[10px] text-[#FCE9B0]/80">
                  {isTechConfirmed ? 'STACK LOCKED' : isStreamingTech ? 'STREAMING SPEC...' : 'READY'}
                </span>
              </div>

              {/* Streamed AI-speed Technical Narrative */}
              <div className="p-3 rounded bg-[#0B2422] border border-[#1C4F52] font-mono-tech text-xs text-[#FCE9B0] min-h-[78px] leading-relaxed mb-3">
                {isModuleConfirmed ? (
                  <>
                    {streamedTechText}
                    {isStreamingTech && <span className="inline-block w-2 h-3.5 bg-[#E3A22E] ml-1 animate-pulse" />}
                  </>
                ) : (
                  <span className="text-[#F2EADB]/60">
                    Confirm the Feature Module in Block 02 to unfold the full technical specification and lock linked function dependencies.
                  </span>
                )}
              </div>

              {/* Honest Separation of Prototype vs Proposed vs Integration Candidate */}
              <div className="space-y-2 mb-3">
                {activeModule.techStackComponents.map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-[#123C3A]/80 border border-[#2A6E78]/40 flex flex-col gap-0.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#FCE9B0]">{comp.layer}</span>
                      <span className="font-mono-tech text-[10px] text-[#E3A22E]">{comp.validationState}</span>
                    </div>
                    <div className="text-xs text-[#F2EADB]/80">{comp.spec}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#2A6E78]/40">
              <button
                type="button"
                disabled={!isModuleConfirmed}
                onClick={() => onConfirmTechStack(activeModule.id)}
                className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded font-display-oswald text-sm uppercase tracking-wider transition-colors cursor-pointer ${
                  isTechConfirmed
                    ? 'bg-[#1C4F52] text-[#FCE9B0] border border-[#E3A22E]'
                    : isModuleConfirmed
                    ? 'bg-[#2A6E78] hover:bg-[#3E91A2] text-white'
                    : 'bg-[#123C3A]/50 text-[#F2EADB]/40 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#E3A22E]" />
                {isTechConfirmed
                  ? 'Tech Stack Approved & Stacked with Feature'
                  : 'Approve Technical Stack & Lock Counter'}
              </button>
            </div>
          </div>

          {/* BLOCK 4: Stepwise Non-Linear Price Counter, MVP Floor & Generate Proposal (3 cols) */}
          <div className="lg:col-span-3 flex flex-col justify-between bg-[#123C3A] border-2 border-[#E3A22E]/60 rounded-lg p-4">
            <div>
              <div className="flex items-center justify-between border-b border-[#E3A22E]/30 pb-2 mb-3">
                <span className="font-mono-tech text-xs uppercase tracking-wider text-[#FCE9B0] flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-[#E3A22E]" />
                  BLOCK 04 · NON-LINEAR BUDGET
                </span>
                <span className="font-mono-tech text-[10px] text-[#E8741E]">INDICATIVE</span>
              </div>

              {/* Stepwise Animated Counter */}
              <div className="p-3 rounded bg-[#0B2422] border border-[#E3A22E]/40 mb-3">
                <div className="font-mono-tech text-[10px] uppercase text-[#F2EADB]/70">
                  Configured Scope Range (Packages 1–4)
                </div>
                <div className="font-display-archivo font-light text-2xl sm:text-3xl text-[#FCE9B0] tabular-nums mt-1">
                  £{displayedLeanTotal.toLocaleString()} – £{displayedExpandedTotal.toLocaleString()}
                </div>
                <div className="font-mono-tech text-[10px] text-[#E3A22E] mt-1">
                   Lean Delivery Model → Expanded Delivery Model
                </div>
              </div>

              {/* MVP Baseline & Non-Linear Team Capacity Note */}
              <div className="space-y-2 text-xs text-[#F2EADB]/90 mb-3">
                <div className="flex items-center justify-between py-1 border-b border-[#2A6E78]/40">
                  <span className="text-[#F2EADB]/75">MVP Baseline (Pkg 1 + Pkg 2):</span>
                  <span className="font-mono-tech tabular-nums text-[#FCE9B0]">
                    £{calculation.mvpBaselineLean.toLocaleString()} – £{calculation.mvpBaselineExpanded.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#2A6E78]/40">
                  <span className="text-[#F2EADB]/75">Initial Mobilisation (30%+):</span>
                  <span className="font-mono-tech tabular-nums text-[#E3A22E]">
                    from £{calculation.mobilisationMinimumLean.toLocaleString()}
                  </span>
                </div>
                <div className="p-2 rounded bg-[#0E302E] text-[11px] text-[#F2EADB]/80 leading-snug">
                  <strong className="text-[#FCE9B0]">Essential Conditions:</strong> Core team capacity is non-linear. Removing a single optional checkbox does not disband the baseline engineering team. Excludes external commercial APIs, cloud hosting consumption, and post-launch retainer.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenValidatedScope}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded font-display-oswald text-sm uppercase tracking-wider bg-gradient-to-r from-[#C8901A] to-[#E3A22E] text-[#0B2422] font-bold hover:brightness-110 transition-all cursor-pointer shadow-lg"
            >
              <FileCheck2 className="w-4 h-4" />
              Generate Validated Scope
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
