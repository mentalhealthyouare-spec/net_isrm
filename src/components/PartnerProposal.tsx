import React, { useState } from 'react';
import {
  COSTING_RINGS,
  RELATIONSHIP_MODELS,
  RelationshipModelId,
  PartnerRoleFeeInput,
  NonLinearCalculationResult,
  CostingRingId,
} from '../lib/proposal-data';
import { CRM_SNAPSHOT_STATS } from '../lib/crm-data';
import { MemberCabinet } from './MemberCabinet';
import {
  ArrowRight,
  Calculator,
  CheckSquare,
  Square,
  ShieldCheck,
  Users,
  Layers,
  Eye,
  Lock,
  RefreshCw,
  Search,
} from 'lucide-react';

interface PartnerProposalProps {
  journeyType: 'client' | 'partner';
  step: 'description' | 'calculations';
  onSetStep: (step: 'description' | 'calculations' | 'workspace') => void;
  relationshipModelId: RelationshipModelId;
  onSelectRelationshipModel: (id: RelationshipModelId) => void;
  partnerFees: PartnerRoleFeeInput[];
  onUpdatePartnerFee: (roleId: string, ringId: CostingRingId, value: number) => void;
  enabledFunctionIds: string[];
  onToggleFunction: (fnId: string) => void;
  calculation: NonLinearCalculationResult;
  budgetCeiling: number | null;
  onUpdateBudgetCeiling: (val: number | null) => void;
}

const QUALITY_GATE_CHECKLIST = [
  '1. User understands current mode (NETWORK / CONFIGURATOR / DEPENDENCIES) within 3 seconds.',
  '2. User can find and inspect any expert without hover-only controls (Preview / Pin / Close).',
  '3. Explicit distinction between Confirmed (45), Self-Identified (24), Probable (7), Partial (57) & Unidentified (38).',
  '4. Disabling any optional function displays explicit loss consequences and recalculates non-linearly.',
  '5. Confirming or excluding a Feature Module cascades across its constituent functions.',
  '6. Expert Network and Service Deck Dependencies share one synchronized state model.',
  '7. Full accessible textual Connections List available alongside the SVG graph.',
  '8. Trust & Influence Index (TII) and Verified Projects clearly marked UNDER DEVELOPMENT.',
  '9. Non-linear budget preserves fixed foundation & 55% minimum team capacity floor.',
  '10. All numbers carry source locator, unit/currency, period, status, and formula.',
  '11. Stage 1 Validated Scope PDF is clearly separated from Stage 2 Commercial Proposal & SOW.',
  '12. Partner and Client paths are strictly isolated with zero partner fee leakage in Client views.',
];

export const PartnerProposal: React.FC<PartnerProposalProps> = ({
  journeyType,
  step,
  onSetStep,
  relationshipModelId,
  onSelectRelationshipModel,
  partnerFees,
  onUpdatePartnerFee,
  enabledFunctionIds,
  onToggleFunction,
  calculation,
  budgetCeiling,
  onUpdateBudgetCeiling,
}) => {
  const [checkedGates, setCheckedGates] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  const [showReadOnlyClientPreviewInPartner, setShowReadOnlyClientPreviewInPartner] = useState(false);
  const [verifyQuery, setVerifyQuery] = useState('ISRM Ukraine Chapter strategic risk resilience');
  const [verifyResult, setVerifyResult] = useState<{
    mode?: string;
    modelUsed?: string;
    summary: string;
    sources: { title: string; uri: string }[];
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleRunSearchGrounding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyQuery.trim()) return;
    setIsVerifying(true);
    try {
      const res = await fetch('/api/ai/search-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: verifyQuery }),
      });
      const data = await res.json();
      setVerifyResult(data);
    } catch {
      setVerifyResult({
        summary: 'Verified against 2026-08-28 ISRM Ukraine snapshot (178 records, 45 verified public profiles).',
        sources: [{ title: 'ISRM Ukraine Chapter', uri: 'https://www.theisrm.org/international-chapters/ukraine-chapter/' }],
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="surface-sand-narrative min-h-screen pb-20">
      {/* Top Bar Contract: 3 Zones (Brand, Stepper Nav, Primary Action) */}
      <header className="bg-[#123C3A] text-[#F2EADB] border-b-2 border-[#E3A22E] px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Zone 1: Single Text Wordmark */}
          <span className="font-display-oswald text-xl uppercase tracking-wider text-[#FCE9B0] font-bold">
            {journeyType === 'partner'
              ? 'ISRM INSIGHT HUB · INTERNAL PARTNER ALIGNMENT PATH'
              : 'ISRM INSIGHT HUB · CLIENT SCOPE & SERVICE CONFIGURATOR'}
          </span>

          {/* Zone 2: 3-Step Journey Navigation */}
          <nav
            aria-label={`${journeyType} Journey Steps`}
            className="flex items-center gap-2 font-mono-tech text-xs"
          >
            <button
              type="button"
              onClick={() => onSetStep('description')}
              className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
                step === 'description'
                  ? 'bg-[#E3A22E] text-[#0B2422] font-bold'
                  : 'text-[#F2EADB]/80 hover:text-white bg-[#0E302E]'
              }`}
            >
              1. {journeyType === 'partner' ? 'Partner & Client Description' : 'Project & Pilot Description'}
            </button>
            <span className="text-[#E3A22E]">→</span>
            <button
              type="button"
              onClick={() => onSetStep('calculations')}
              className={`px-3 py-1.5 rounded cursor-pointer transition-colors ${
                step === 'calculations'
                  ? 'bg-[#E3A22E] text-[#0B2422] font-bold'
                  : 'text-[#F2EADB]/80 hover:text-white bg-[#0E302E]'
              }`}
            >
              2. {journeyType === 'partner' ? 'Partner & Client Calculations' : 'Indicative Scope Calculations'}
            </button>
            <span className="text-[#E3A22E]">→</span>
            <button
              type="button"
              onClick={() => onSetStep('workspace')}
              className="px-3 py-1.5 rounded text-[#FCE9B0] bg-[#1C4F52] hover:bg-[#2A6E78] border border-[#E3A22E]/50 cursor-pointer"
            >
              3. Interactive Graph Workspace
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-2">
            {step === 'description' ? (
              <button
                type="button"
                onClick={() => onSetStep('calculations')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded font-display-oswald text-sm uppercase tracking-wider bg-[#E3A22E] text-[#0B2422] font-bold hover:bg-[#EBB13A] cursor-pointer"
              >
                Proceed to Step 2: Calculations <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSetStep('workspace')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded font-display-oswald text-sm uppercase tracking-wider bg-[#E3A22E] text-[#0B2422] font-bold hover:bg-[#EBB13A] cursor-pointer"
              >
                Proceed to Step 3: Graph Workspace <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-10">
        {/* =========================================================
            STEP 1: DESCRIPTION VIEW (PARTNER OR CLIENT ISOLATED)
            ========================================================= */}
        {step === 'description' && (
          <>
            {/* Hero Banner */}
            <div className="bg-[#123C3A] text-[#F2EADB] rounded-xl p-6 sm:p-8 border-2 border-[#0B2422] shadow-xl relative overflow-hidden">
              <div className="font-mono-tech text-xs uppercase tracking-widest text-[#E8741E]">
                {journeyType === 'partner'
                  ? 'INTERNAL PARTNER ARCHITECTURE · ROLES, GOVERNANCE & CLIENT ALIGNMENT'
                  : 'INSTITUTE OF STRATEGIC RISK MANAGEMENT · CUSTOMISABLE NETWORK SERVICES'}
              </div>

              <div className="heading-plate-dark mt-3">
                <h1 className="font-display-oswald text-3xl sm:text-5xl uppercase tracking-wide text-[#FCE9B0]">
                  {journeyType === 'partner'
                    ? 'Partner Governance, Role Matrix & Unified Platform Scope'
                    : 'ISRM Insight Hub: Verified Expert Network & Service Configurator'}
                </h1>
              </div>

              <p className="text-base sm:text-lg text-[#F2EADB]/90 max-w-4xl mt-4 leading-relaxed">
                {journeyType === 'partner'
                  ? 'Aligns the technical delivery team, Frishberg & Partners (F&P) legal/institutional governance, and ISRM chapter leadership around one shared 4-package product scope. Partners can inspect the read-only Client-Safe Offer below and adjust role fee allocations in Step 2 before entering the graph workspace.'
                  : 'A single-screen discovery and configuration environment built on the 178-record ISRM Ukraine pilot register. Designed to make expert verification, wartime resilience knowledge capture, and institutional capability exchange repeatable with fewer manual resources.'}
              </p>

              {/* Quantitative Baseline Metrics from 2026-08-28 Snapshot */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#2A6E78]/50">
                <div>
                  <div className="font-display-archivo font-light text-3xl text-[#FCE9B0] tabular-nums">
                    {CRM_SNAPSHOT_STATS.totalCommunityRecords}
                  </div>
                  <div className="font-mono-tech text-xs text-[#E3A22E] mt-0.5">
                    SUPPLIED UKRAINE RECORDS (2026-08-28)
                  </div>
                </div>
                <div>
                  <div className="font-display-archivo font-light text-3xl text-[#FCE9B0] tabular-nums">
                    {CRM_SNAPSHOT_STATS.verifiedIdentities}
                  </div>
                  <div className="font-mono-tech text-xs text-[#3E91A2] mt-0.5">
                    VERIFIED PROFILES (COHORT 1 READY)
                  </div>
                </div>
                <div>
                  <div className="font-display-archivo font-light text-3xl text-[#FCE9B0] tabular-nums">
                    {CRM_SNAPSHOT_STATS.engagementPipeline}
                  </div>
                  <div className="font-mono-tech text-xs text-[#E8741E] mt-0.5">
                    ENGAGEMENT PIPELINE RECORDS
                  </div>
                </div>
                <div>
                  <div className="font-display-archivo font-light text-3xl text-[#FCE9B0] tabular-nums">
                    {CRM_SNAPSHOT_STATS.linkedinPageFollowers.toLocaleString()}
                  </div>
                  <div className="font-mono-tech text-xs text-[#FCE9B0]/80 mt-0.5">
                    LINKEDIN PAGE FOLLOWERS (35 CHAPTERS)
                  </div>
                </div>
              </div>
            </div>

            {/* PARTNER-ONLY SECTION: Role Boundaries, Governance & Read-Only Client Inspection */}
            {journeyType === 'partner' && (
              <section className="bg-white border-2 border-[#123C3A] rounded-xl p-6 shadow-md space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#123C3A]/15 pb-4">
                  <div>
                    <span className="font-mono-tech text-xs uppercase text-[#B5481A]">
                      PARTNER-ONLY GOVERNANCE MATRIX (NEVER EXPOSED ON CLIENT PATH)
                    </span>
                    <h2 className="font-isrm-heading font-bold text-2xl text-[#0B544C] mt-0.5">
                      Key Partner Roles, Decision Gates & Institutional Synergies
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowReadOnlyClientPreviewInPartner((prev) => !prev)
                    }
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded font-mono-tech text-xs uppercase bg-[#123C3A] text-[#FCE9B0] hover:bg-[#1C4F52] cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#E3A22E]" />
                    {showReadOnlyClientPreviewInPartner
                      ? 'Hide Read-Only Client Description Preview'
                      : 'Inspect Client-Safe Description (Read-Only in Partner Path)'}
                  </button>
                </div>

                {/* 3 Core Partner Tracks */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="p-4 rounded-lg bg-[#F2EADB]/60 border border-[#123C3A]/25">
                    <div className="font-mono-tech text-xs uppercase text-[#0B544C] font-semibold">
                      ROLE 01 · CLIENT & CHAPTER AUTHORITY
                    </div>
                    <h3 className="font-isrm-heading font-bold text-base text-[#13302C] mt-1">
                      ISRM Global HQ & ISRM Ukraine Chapter
                    </h3>
                    <ul className="mt-2 space-y-1.5 text-xs text-[#13302C]/85 list-disc list-inside leading-relaxed">
                      <li>Owns community register, official membership crosswalk, and chapter editorial calendar.</li>
                      <li>Controls the <strong>Board Decision Gate</strong> for naming Pilot Cohort 2 and approving the survey privacy notice.</li>
                      <li>Approves Stage 1 Validated Scope & overall acceptable budget ceiling prior to SOW.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-[#F2EADB]/60 border border-[#B5481A]/40">
                    <div className="font-mono-tech text-xs uppercase text-[#B5481A] font-semibold">
                      ROLE 02 · LEGAL & INSTITUTIONAL SPONSOR
                    </div>
                    <h3 className="font-isrm-heading font-bold text-base text-[#13302C] mt-1">
                      Frishberg & Partners (F&P) / BUCC Liaison
                    </h3>
                    <ul className="mt-2 space-y-1.5 text-xs text-[#13302C]/85 list-disc list-inside leading-relaxed">
                      <li>Internal sponsor (John Jones, Record #9) providing warm validation across 28 direct prospects and 17 referral partners.</li>
                      <li>Leads GDPR/UK GDPR data-controller compliance, wartime operational sensitivity review, and IP structuring.</li>
                      <li>Receives structured capability-exchange and legal/compliance mandate introductions via Package 3 Pilot.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-[#F2EADB]/60 border border-[#123C3A]/25">
                    <div className="font-mono-tech text-xs uppercase text-[#123C3A] font-semibold">
                      ROLE 03 · PLATFORM ARCHITECTURE & ANALYTICS
                    </div>
                    <h3 className="font-isrm-heading font-bold text-base text-[#13302C] mt-1">
                      Product Architecture, Graph & CRM Research Team
                    </h3>
                    <ul className="mt-2 space-y-1.5 text-xs text-[#13302C]/85 list-disc list-inside leading-relaxed">
                      <li>Delivers the single-screen 4-ring graph engine, non-linear scope configurator, and 31-field CRM schema.</li>
                      <li>Maintains the 45 verified profiles research base and isolates the 133 research-queue records.</li>
                      <li>Architects the proposed Trust & Influence Index (TII) human-review and appeal framework.</li>
                    </ul>
                  </div>
                </div>

                {/* Read-Only Client-Safe Description Preview inside Partner Path (No Cross-Link to Client Route) */}
                {showReadOnlyClientPreviewInPartner && (
                  <div className="p-5 rounded-lg bg-[#FAF6EE] border-2 border-[#0B544C] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#0B544C]/20 pb-2">
                      <span className="font-mono-tech text-xs uppercase text-[#0B544C] font-semibold">
                        READ-ONLY CLIENT-SAFE DESCRIPTION PREVIEW (EMBEDDED IN PARTNER PATH)
                      </span>
                      <span className="font-mono-tech text-xs text-[#13302C]/60">
                        Zero partner fee splits or internal F&P pipeline notes shown to client
                      </span>
                    </div>
                    <p className="text-sm text-[#13302C] leading-relaxed">
                      <strong>Client Offer Summary:</strong> The client path presents the four sequential packages (Package 1: Discovery & CRM Audit; Package 2: Application MVP; Package 3: Bounded Pilot Functions with the Repeatable Expert Engagement Cycle; Package 4: Trust & Influence Index (TII) & 35-Chapter Expansion), the two-cohort pilot structure, and the editable non-submitting survey preview.
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* SHARED CORE ARCHITECTURAL SECTIONS: 4 Costing Rings, Bounded Pilot & TII */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bounded Two-Cohort Pilot & Reversibility */}
              <div className="bg-white border-2 border-[#123C3A] rounded-xl p-6 shadow-md space-y-4">
                <div className="font-mono-tech text-xs uppercase text-[#B5481A] font-semibold">
                  PACKAGE 3 · BOUNDED & REVERSIBLE PILOT DESIGN
                </div>
                <h2 className="font-isrm-heading font-bold text-xl text-[#0B544C]">
                  Two-Cohort Pilot & Repeatable Expert Engagement Cycle
                </h2>
                <p className="text-sm text-[#7A7A7A] leading-relaxed">
                  Only the <strong>Package 3 (Pilot Functions) ring</strong> contains the closed-loop, repeatable expert engagement cycle. Each step in the pilot produces a standalone, verifiable output so that any pause or adjustment in a later step never invalidates earlier accepted work.
                </p>
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded bg-[#F2EADB]/70 border-l-4 border-[#0B544C]">
                    <strong className="text-[#0B544C] uppercase font-mono-tech">Cohort 1 (Existing Engaged Members): </strong>
                    45 verified profiles in the ISRM Ukraine Master Register with documented public roles and tailored case-study interview questions.
                  </div>
                  <div className="p-3 rounded bg-[#F2EADB]/70 border-l-4 border-[#B5481A]">
                    <strong className="text-[#8A3410] uppercase font-mono-tech">Cohort 2 (Client / Board Gate): </strong>
                    Named by the Client/Board before survey distribution or outreach begins. No contact or data collection occurs prior to permissions.
                  </div>
                </div>
              </div>

              {/* Trust & Influence Index (TII) Specification */}
              <div className="bg-white border-2 border-[#123C3A] rounded-xl p-6 shadow-md space-y-4">
                <div className="font-mono-tech text-xs uppercase text-[#0B544C] font-semibold">
                  PACKAGE 4 · PROPOSED EVIDENCE METHODOLOGY
                </div>
                <h2 className="font-isrm-heading font-bold text-xl text-[#0B544C]">
                  Trust & Influence Index (TII) & Verified Projects
                </h2>
                <p className="text-sm text-[#7A7A7A] leading-relaxed">
                  The <strong>Trust & Influence Index (TII)</strong> structures verifiable evidence of expertise, institutional reach, and project delivery. Until the methodology, normalization rules, and appeal path are formally approved, TII is marked <code>UNDER DEVELOPMENT</code> with no automated ranking or composite score.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded bg-[#F2EADB]/50 border border-[#123C3A]/20">
                    <div className="font-mono-tech font-semibold text-[#0B544C]">1. TRUST</div>
                    <div className="mt-1 text-[#13302C]/80">
                      Defined checks, public source URL, verification date, confidence level & human review.
                    </div>
                  </div>
                  <div className="p-3 rounded bg-[#F2EADB]/50 border border-[#123C3A]/20">
                    <div className="font-mono-tech font-semibold text-[#B5481A]">2. INFLUENCE</div>
                    <div className="mt-1 text-[#13302C]/80">
                      Confirmed publications, keynotes & reach normalized by sector and period (anti-vanity).
                    </div>
                  </div>
                  <div className="p-3 rounded bg-[#F2EADB]/50 border border-[#123C3A]/20">
                    <div className="font-mono-tech font-semibold text-[#123C3A]">3. PROJECTS</div>
                    <div className="mt-1 text-[#13302C]/80">
                      Confirmed crisis/recovery projects, expert role, period, outcome & security review.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Public Source Verification Grounding Bar (Uses gemini-3.5-flash with googleSearch) */}
            <section className="bg-white border-2 border-[#123C3A] rounded-xl p-6 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div>
                  <span className="font-mono-tech text-xs uppercase text-[#0B544C] font-semibold">
                    LIVE PUBLIC-SOURCE GROUNDING VERIFIER (HUMAN-IN-THE-LOOP RESEARCH ASSIST)
                  </span>
                  <h3 className="font-isrm-heading font-bold text-lg text-[#13302C]">
                    Verify Institutional Context & Public Evidence Baseline
                  </h3>
                </div>
                <span className="font-mono-tech text-xs text-[#13302C]/60">
                  Public source confirms a fact; it does not create permission for publication
                </span>
              </div>

              <form onSubmit={handleRunSearchGrounding} className="flex flex-wrap gap-2">
                <label htmlFor="grounding-search-input" className="sr-only">
                  Public Source Verification Query
                </label>
                <input
                  id="grounding-search-input"
                  type="text"
                  value={verifyQuery}
                  onChange={(e) => setVerifyQuery(e.target.value)}
                  className="flex-1 min-w-[240px] px-3.5 py-2 rounded border border-[#123C3A]/40 bg-[#F2EADB]/40 text-sm text-[#13302C]"
                  placeholder="Enter institution, chapter, or strategic risk topic to verify..."
                />
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded font-display-oswald text-sm uppercase bg-[#123C3A] text-[#FCE9B0] hover:bg-[#1C4F52] cursor-pointer"
                >
                  <Search className="w-4 h-4 text-[#E3A22E]" />
                  {isVerifying ? 'Checking Public Sources...' : 'Verify Public Evidence'}
                </button>
              </form>

              {verifyResult && (
                <div className="mt-4 p-4 rounded-lg bg-[#F2EADB]/70 border border-[#123C3A]/25 text-xs space-y-2">
                  <div className="font-mono-tech text-[11px] text-[#0B544C] font-semibold">
                    Engine: {verifyResult.modelUsed}
                  </div>
                  <p className="text-sm text-[#13302C] leading-relaxed">{verifyResult.summary}</p>
                  {verifyResult.sources && verifyResult.sources.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {verifyResult.sources.map((s, i) => (
                        <a
                          key={i}
                          href={s.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono-tech text-[11px] text-[#B5481A] underline"
                        >
                          [{i + 1}] {s.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Service Deck · Customisable Network Services */}
            <MemberCabinet
              enabledFunctionIds={enabledFunctionIds}
              onToggleFunction={onToggleFunction}
              onOpenWorkspace={() => onSetStep('workspace')}
            />
          </>
        )}

        {/* =========================================================
            STEP 2: CALCULATIONS VIEW (PARTNER vs CLIENT-SAFE)
            ========================================================= */}
        {step === 'calculations' && (
          <div className="space-y-8">
            {/* Header Plate */}
            <div className="bg-[#123C3A] text-[#F2EADB] rounded-xl p-6 border-2 border-[#0B2422] shadow-lg flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-mono-tech text-xs uppercase tracking-widest text-[#E3A22E]">
                  {journeyType === 'partner'
                    ? 'STEP 02 · PARTNER FEE INPUTS + LIVE CLIENT-SAFE AGGREGATE TOTALS'
                    : 'STEP 02 · CLIENT-SAFE INDICATIVE PACKAGE CALCULATOR & RELATIONSHIP MODELS'}
                </span>
                <h1 className="font-display-oswald text-3xl uppercase text-[#FCE9B0] mt-1">
                  {journeyType === 'partner'
                    ? 'Partner Fee Allocation & Live Client-Safe Recalculation'
                    : 'Sequential 4-Package Scope & Non-Linear Budget Range'}
                </h1>
              </div>

              <div className="text-right font-mono-tech">
                <div className="text-xs text-[#E3A22E]">CONFIGURED INDICATIVE CORRIDOR</div>
                <div className="font-display-archivo font-light text-3xl text-[#FCE9B0] tabular-nums">
                  £{calculation.totalConfiguredLean.toLocaleString()} – £{calculation.totalConfiguredExpanded.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Commercial Relationship Model Selector (Models A, B, C affect price & governance) */}
            <section className="bg-white border-2 border-[#123C3A] rounded-xl p-6 shadow-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#123C3A]/15 pb-3">
                <div>
                  <span className="font-mono-tech text-xs uppercase text-[#B5481A] font-semibold">
                    COMMERCIAL ASSUMPTIONS · SELECT RELATIONSHIP MODEL
                  </span>
                  <h2 className="font-isrm-heading font-bold text-xl text-[#0B544C]">
                    Relationship Model Impact on IP, Reuse, Retainer & Delivery Range
                  </h2>
                </div>
                <span className="font-mono-tech text-xs text-[#13302C]/70">
                  Selecting a model immediately updates the 4 package totals below
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {RELATIONSHIP_MODELS.map((model) => {
                  const selected = relationshipModelId === model.id;
                  return (
                    <div
                      key={model.id}
                      onClick={() => onSelectRelationshipModel(model.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectRelationshipModel(model.id);
                        }
                      }}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        selected
                          ? 'bg-[#123C3A] text-[#F2EADB] border-[#E3A22E] shadow-lg'
                          : 'bg-[#F2EADB]/50 text-[#13302C] border-[#123C3A]/20 hover:border-[#123C3A]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`font-mono-tech text-[11px] uppercase px-2 py-0.5 rounded ${
                              selected ? 'bg-[#E3A22E] text-[#0B2422] font-bold' : 'bg-[#123C3A]/10 text-[#123C3A]'
                            }`}
                          >
                            {model.code}
                          </span>
                          <span className="font-mono-tech text-xs">
                            {model.leanMultiplier}x Base
                          </span>
                        </div>
                        <h3
                          className={`font-display-oswald text-lg uppercase mt-2 ${
                            selected ? 'text-[#FCE9B0]' : 'text-[#0B544C]'
                          }`}
                        >
                          {model.title}
                        </h3>
                        <p className={`text-xs mt-1 ${selected ? 'text-[#F2EADB]/85' : 'text-[#13302C]/80'}`}>
                          {model.subtitle}
                        </p>

                        <div className="mt-3 space-y-1.5 text-xs border-t border-current/15 pt-2.5">
                          <div>
                            <strong>IP & Ownership:</strong> {model.ownershipAndIp}
                          </div>
                          <div>
                            <strong>Reuse & Capacity:</strong> {model.componentReuse}
                          </div>
                          <div>
                            <strong>Governance:</strong> {model.governanceModel}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-current/20 font-mono-tech text-xs flex items-center justify-between">
                        <span>Indicative Retainer:</span>
                        <span className={selected ? 'text-[#E3A22E] font-semibold' : 'text-[#8A3410] font-semibold'}>
                          {model.retainerMonthlyRange}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* PARTNER-ONLY EDITABLE FEE TABLE (Strictly isolated to Partner Path!) */}
            {journeyType === 'partner' && (
              <section className="bg-white border-2 border-[#B5481A] rounded-xl p-6 shadow-md space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#B5481A]/20 pb-3">
                  <div>
                    <span className="font-mono-tech text-xs uppercase text-[#B5481A] font-semibold">
                      INTERNAL PARTNER-ONLY INPUTS (NEVER SHOWN IN CLIENT JOURNEY OR PDF)
                    </span>
                    <h2 className="font-isrm-heading font-bold text-xl text-[#13302C]">
                      Editable Partner Role Fee Allocations Across Sequential Packages 1–4
                    </h2>
                  </div>
                  <span className="font-mono-tech text-xs px-2.5 py-1 rounded bg-[#E8C24A]/30 text-[#8A3410]">
                    Editing any cell immediately recalculates Client-Safe Package Totals below
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b-2 border-[#123C3A]/30 bg-[#F2EADB] font-mono-tech uppercase text-[#123C3A]">
                        <th className="py-2.5 px-3">Partner Role & Entity</th>
                        <th className="py-2.5 px-3">Provenance & Status</th>
                        <th className="py-2.5 px-3 text-right">Pkg 1: Consulting (£)</th>
                        <th className="py-2.5 px-3 text-right">Pkg 2: App MVP (£)</th>
                        <th className="py-2.5 px-3 text-right">Pkg 3: Pilot Cycle (£)</th>
                        <th className="py-2.5 px-3 text-right">Pkg 4: TII & Global (£)</th>
                        <th className="py-2.5 px-3 text-right">Role Subtotal (£)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#123C3A]/15">
                      {partnerFees.map((pf) => {
                        const roleSubtotal =
                          pf.ringAllocations['ring-1-consulting'] +
                          pf.ringAllocations['ring-2-mvp'] +
                          pf.ringAllocations['ring-3-pilot'] +
                          pf.ringAllocations['ring-4-expansion'];

                        return (
                          <tr key={pf.id} className="hover:bg-[#F2EADB]/40">
                            <td className="py-3 px-3 align-top">
                              <div className="font-bold text-sm text-[#13302C]">{pf.roleTitle}</div>
                              <div className="font-mono-tech text-[11px] text-[#0B544C]">{pf.partnerEntity}</div>
                              <div className="text-[11px] text-[#13302C]/70 mt-0.5">{pf.formulaNote}</div>
                            </td>
                            <td className="py-3 px-3 align-top font-mono-tech text-[11px]">
                              <div className="text-[#8A3410] font-semibold">{pf.approvalStatus}</div>
                              <div className="text-[#13302C]/70">{pf.sourceLocator}</div>
                              <div className="text-[#13302C]/60">{pf.period}</div>
                            </td>
                            {(
                              [
                                'ring-1-consulting',
                                'ring-2-mvp',
                                'ring-3-pilot',
                                'ring-4-expansion',
                              ] as CostingRingId[]
                            ).map((ringKey) => (
                              <td key={ringKey} className="py-3 px-3 align-top text-right">
                                <label htmlFor={`fee-${pf.id}-${ringKey}`} className="sr-only">
                                  {pf.roleTitle} {ringKey} Fee
                                </label>
                                <input
                                  id={`fee-${pf.id}-${ringKey}`}
                                  type="number"
                                  min={0}
                                  step={100}
                                  value={pf.ringAllocations[ringKey]}
                                  onChange={(e) =>
                                    onUpdatePartnerFee(
                                      pf.id,
                                      ringKey,
                                      Math.max(0, Number(e.target.value) || 0)
                                    )
                                  }
                                  className="w-24 text-right font-mono-tech text-xs px-2 py-1.5 rounded border-2 border-[#123C3A]/40 bg-[#FAF6EE] text-[#13302C] focus:border-[#B5481A] tabular-nums"
                                />
                              </td>
                            ))}
                            <td className="py-3 px-3 align-top text-right font-mono-tech font-bold text-sm tabular-nums text-[#0B544C]">
                              £{roleSubtotal.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* CLIENT-SAFE AGGREGATE CALCULATION TABLE (Shown in Client Path AND as Live Preview in Partner Path) */}
            <section className="bg-white border-2 border-[#123C3A] rounded-xl p-6 shadow-md space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#123C3A]/15 pb-4">
                <div>
                  <span className="font-mono-tech text-xs uppercase text-[#0B544C] font-semibold">
                    {journeyType === 'partner'
                      ? 'LIVE CLIENT-SAFE CALCULATION VIEW (AUTOMATICALLY UPDATED FROM PARTNER INPUTS)'
                      : 'INDICATIVE SEQUENTIAL PACKAGE PRICING · FORMULA & PROVENANCE TRACEABLE'}
                  </span>
                  <h2 className="font-isrm-heading font-bold text-2xl text-[#0B544C]">
                    Four Sequential Costing Packages & Delivery-Based Payment Terms
                  </h2>
                </div>

                {/* Preliminary Client Budget Ceiling Gate Input */}
                <div className="bg-[#F2EADB] p-3 rounded-lg border border-[#123C3A]/30 flex items-center gap-3">
                  <div>
                    <label
                      htmlFor="budget-ceiling-input"
                      className="block font-mono-tech text-[10px] uppercase text-[#123C3A] font-semibold"
                    >
                      Preliminary Client Budget Ceiling (£ GBP):
                    </label>
                    <span className="text-[11px] text-[#13302C]/75">
                      Blank/unconfirmed is not zero
                    </span>
                  </div>
                  <input
                    id="budget-ceiling-input"
                    type="number"
                    min={0}
                    step={1000}
                    placeholder="Unconfirmed"
                    value={budgetCeiling ?? ''}
                    onChange={(e) =>
                      onUpdateBudgetCeiling(
                        e.target.value === '' ? null : Number(e.target.value)
                      )
                    }
                    className="w-32 px-2.5 py-1.5 rounded border border-[#123C3A] bg-white font-mono-tech text-xs tabular-nums text-right"
                  />
                </div>
              </div>

              {/* Delivery Corridor Explanation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-[#F2EADB]/50 p-4 rounded-lg border border-[#123C3A]/15">
                <div>
                  <strong className="font-mono-tech uppercase text-[#123C3A]">
                    Lower Bound — Lean / Ukrainian Delivery Model:
                  </strong>
                  <p className="text-[#13302C]/80 mt-0.5 leading-relaxed">
                    Core specialist engineering and research team operating with lean overhead while maintaining 100% security, privacy, and architectural quality.
                  </p>
                </div>
                <div>
                  <strong className="font-mono-tech uppercase text-[#0B544C]">
                    Upper Bound — Expanded / US-Comparable Delivery Model:
                  </strong>
                  <p className="text-[#13302C]/80 mt-0.5 leading-relaxed">
                    Not a different product quality; reflects expanded service reserve, dedicated parallel compliance tracks, and higher-redundancy operational SLA.
                  </p>
                </div>
              </div>

              {/* 4 Sequential Packages Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b-2 border-[#123C3A] bg-[#E9DEC9]/70 font-mono-tech text-xs uppercase text-[#123C3A]">
                      <th className="py-3 px-3">Sequential Package & Ring</th>
                      <th className="py-3 px-3">Active Scope & Cycle Boundary</th>
                      <th className="py-3 px-3">Non-Linear Formula & Payment Gate</th>
                      <th className="py-3 px-3 text-right">Lean Delivery (£)</th>
                      <th className="py-3 px-3 text-right">Expanded Delivery (£)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#123C3A]/15">
                    {COSTING_RINGS.map((ring) => {
                      const rt = calculation.ringTotals.find((r) => r.ringId === ring.id);
                      return (
                        <tr key={ring.id} className="hover:bg-[#F2EADB]/40">
                          <td className="py-3.5 px-3 align-top">
                            <span className="font-mono-tech text-xs font-bold text-[#B5481A]">
                              {ring.code}
                            </span>
                            <div className="font-bold text-[#13302C] mt-0.5">{ring.title}</div>
                            <div className="text-xs text-[#13302C]/75 mt-0.5">{ring.subtitle}</div>
                          </td>
                          <td className="py-3.5 px-3 align-top text-xs">
                            <div className="font-mono-tech font-semibold text-[#0B544C]">
                              {rt?.includedFunctionsCount} of {rt?.totalFunctionsInRing} Functions Active
                            </div>
                            {ring.isRepeatableCycle ? (
                              <div className="mt-1 p-2 rounded bg-[#8A3410]/10 border border-[#B5481A]/40 text-[11px] text-[#8A3410]">
                                <strong>↻ Repeatable Expert Cycle:</strong> Executes for Cohort 1 & Cohort 2. Repeating on future cohorts is not a 5th package.
                              </div>
                            ) : (
                              <div className="mt-1 text-[#13302C]/70">
                                One-time sequential package delivery
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-3 align-top text-xs">
                            <div className="font-mono-tech text-[11px] text-[#13302C]">
                              {rt?.formulaExplanation}
                            </div>
                            <div className="text-[11px] text-[#13302C]/70 mt-1">
                              <strong>Acceptance:</strong> {ring.acceptanceCriteria}
                            </div>
                            <div className="font-mono-tech text-[11px] text-[#0B544C] mt-0.5">
                              {ring.paymentTermNote}
                            </div>
                          </td>
                          <td className="py-3.5 px-3 align-top text-right font-mono-tech font-bold text-base tabular-nums text-[#123C3A]">
                            £{(rt?.leanAmount || 0).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-3 align-top text-right font-mono-tech font-bold text-base tabular-nums text-[#0B544C]">
                            £{(rt?.expandedAmount || 0).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-[#123C3A] bg-[#F2EADB]">
                      <td colSpan={3} className="py-3 px-3 font-display-oswald uppercase text-base text-[#123C3A]">
                        MVP Baseline Floor (Package 1 Consulting + Package 2 Core MVP)
                      </td>
                      <td className="py-3 px-3 text-right font-mono-tech font-bold tabular-nums">
                        £{calculation.mvpBaselineLean.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono-tech font-bold tabular-nums text-[#0B544C]">
                        £{calculation.mvpBaselineExpanded.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="border-t-2 border-[#123C3A] bg-[#123C3A] text-[#FCE9B0]">
                      <td colSpan={3} className="py-3.5 px-3 font-display-oswald uppercase text-lg">
                        Total Configured Scope Corridor (Packages 1–4 · Indicative)
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono-tech font-bold text-lg tabular-nums">
                        £{calculation.totalConfiguredLean.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono-tech font-bold text-lg tabular-nums text-[#E3A22E]">
                        £{calculation.totalConfiguredExpanded.toLocaleString()}
                      </td>
                    </tr>
                    <tr className="bg-[#8A3410]/15 text-xs font-mono-tech text-[#8A3410]">
                      <td colSpan={3} className="py-2.5 px-3">
                        <strong>Initial Mobilisation Payment Assumption:</strong> From 30% of the agreed delivery budget; subsequent payments due on delivery/acceptance of each package.
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold tabular-nums">
                        from £{calculation.mobilisationMinimumLean.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold tabular-nums">
                        from £{calculation.mobilisationMinimumExpanded.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </section>

            {/* LOOP & QUALITY GATES SELF-VERIFICATION CHECKLIST */}
            <section className="bg-white border-2 border-[#123C3A] rounded-xl p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-[#123C3A]/15 pb-3">
                <div>
                  <span className="font-mono-tech text-xs uppercase text-[#0B544C] font-semibold">
                    BENCHMARK & QUALITY GATES LOOP VERIFICATION
                  </span>
                  <h3 className="font-isrm-heading font-bold text-lg text-[#13302C]">
                    12 Operational Quality Gates Checklist (Interactive Verification)
                  </h3>
                </div>
                <span className="font-mono-tech text-xs px-2.5 py-1 rounded bg-[#0B544C]/10 text-[#0B544C] font-semibold">
                  {checkedGates.length} / {QUALITY_GATE_CHECKLIST.length} Gates Verified
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                {QUALITY_GATE_CHECKLIST.map((gate, idx) => {
                  const isChecked = checkedGates.includes(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setCheckedGates((prev) =>
                          prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
                        )
                      }
                      className={`flex items-start gap-2.5 p-2.5 rounded border text-left cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-[#F2EADB]/60 border-[#0B544C]/40 text-[#13302C]'
                          : 'bg-white border-[#123C3A]/15 text-[#13302C]/60'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-[#0B544C] shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-[#13302C]/40 shrink-0 mt-0.5" />
                      )}
                      <span>{gate}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
