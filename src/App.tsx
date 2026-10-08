import React, { useState, useEffect, useMemo } from 'react';
import { ClientProposalRoute } from './routes/proposal';
import { PartnerJourneyRoute } from './routes/partner';
import {
  INITIAL_PARTNER_FEE_INPUTS,
  PLATFORM_FUNCTIONS,
  FEATURE_MODULES,
  RelationshipModelId,
  PartnerRoleFeeInput,
  CostingRingId,
  calculateNonLinearScope,
} from './lib/proposal-data';
import { CRM_SNAPSHOT_STATS } from './lib/crm-data';
import { ArrowRight, ShieldCheck, Users, Briefcase } from 'lucide-react';

export default function App() {
  // Journey routing: 'client' | 'partner' | null (gateway screen if no URL param)
  const [journey, setJourney] = useState<'client' | 'partner' | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const p = params.get('path');
      if (p === 'partner') return 'partner';
      if (p === 'client') return 'client';
      if (window.location.hash === '#partner') return 'partner';
      if (window.location.hash === '#client') return 'client';
    }
    return null;
  });

  // Step routing: 'description' -> 'calculations' -> 'workspace'
  const [step, setStep] = useState<'description' | 'calculations' | 'workspace'>('description');

  // Commercial relationship model (Model A, B, C)
  const [relationshipModelId, setRelationshipModelId] = useState<RelationshipModelId>('founding-partner');

  // Partner role fee inputs (internal rates, immediately update client totals)
  const [partnerFees, setPartnerFees] = useState<PartnerRoleFeeInput[]>(INITIAL_PARTNER_FEE_INPUTS);

  // Enabled function IDs across the 4 rings
  const [enabledFunctionIds, setEnabledFunctionIds] = useState<string[]>(() =>
    PLATFORM_FUNCTIONS.map((f) => f.id)
  );

  // Confirmed feature modules in Block 2 cascade
  const [confirmedModuleIds, setConfirmedModuleIds] = useState<string[]>([
    'mod-foundation-crm',
    'mod-mvp-directory',
  ]);

  // Approved technical stacks in Block 3 cascade
  const [techConfirmedModuleIds, setTechConfirmedModuleIds] = useState<string[]>([
    'mod-foundation-crm',
  ]);

  // Preliminary client budget ceiling
  const [budgetCeiling, setBudgetCeiling] = useState<number | null>(null);

  // Listen for browser popstate or hash change
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const p = params.get('path');
      if (p === 'partner') {
        setJourney('partner');
      } else if (p === 'client') {
        setJourney('client');
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  // Update browser URL query without reload when journey changes
  const handleSelectJourney = (selected: 'client' | 'partner') => {
    setJourney(selected);
    setStep('description');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('path', selected);
      window.history.pushState({}, '', url.toString());
    }
  };

  // Recalculate non-linear pricing whenever inputs change
  const calculation = useMemo(() => {
    return calculateNonLinearScope(
      enabledFunctionIds,
      partnerFees,
      relationshipModelId,
      budgetCeiling
    );
  }, [enabledFunctionIds, partnerFees, relationshipModelId, budgetCeiling]);

  // Handle partner fee input updates (immediately recomputes connected client lines)
  const handleUpdatePartnerFee = (
    roleId: string,
    ringId: CostingRingId,
    value: number
  ) => {
    setPartnerFees((prev) =>
      prev.map((item) => {
        if (item.id === roleId) {
          return {
            ...item,
            ringAllocations: {
              ...item.ringAllocations,
              [ringId]: value,
            },
          };
        }
        return item;
      })
    );
  };

  // Toggle function inclusion
  const handleToggleFunction = (fnId: string) => {
    const fn = PLATFORM_FUNCTIONS.find((f) => f.id === fnId);
    if (!fn || fn.isFoundation) return;

    setEnabledFunctionIds((prev) =>
      prev.includes(fnId) ? prev.filter((id) => id !== fnId) : [...prev, fnId]
    );
  };

  // Confirm whole module (enrolls all its functions)
  const handleConfirmModule = (moduleId: string) => {
    const mod = FEATURE_MODULES.find((m) => m.id === moduleId);
    if (!mod) return;

    setConfirmedModuleIds((prev) =>
      prev.includes(moduleId) ? prev : [...prev, moduleId]
    );

    // Enroll all functions belonging to this module
    setEnabledFunctionIds((prev) => {
      const toAdd = mod.functionIds.filter((fid) => !prev.includes(fid));
      return [...prev, ...toAdd];
    });
  };

  // Reject / exclude module (removes all its non-foundation functions)
  const handleRejectModule = (moduleId: string) => {
    const mod = FEATURE_MODULES.find((m) => m.id === moduleId);
    if (!mod || mod.isFoundation) return;

    setConfirmedModuleIds((prev) => prev.filter((id) => id !== moduleId));
    setTechConfirmedModuleIds((prev) => prev.filter((id) => id !== moduleId));

    // Remove non-foundation functions of this module
    setEnabledFunctionIds((prev) =>
      prev.filter((fid) => {
        const fn = PLATFORM_FUNCTIONS.find((f) => f.id === fid);
        if (fn?.isFoundation) return true;
        return !mod.functionIds.includes(fid);
      })
    );
  };

  // Confirm tech stack for module
  const handleConfirmTechStack = (moduleId: string) => {
    setTechConfirmedModuleIds((prev) =>
      prev.includes(moduleId) ? prev : [...prev, moduleId]
    );
  };

  // GATEWAY LANDING SCREEN: Shown if no ?path= param is set
  if (!journey) {
    return (
      <div className="surface-sand-narrative min-h-screen flex flex-col justify-between p-4 sm:p-8">
        <header className="max-w-5xl mx-auto w-full pt-6 pb-4 border-b-2 border-[#123C3A]/20">
          <div className="font-mono-tech text-xs uppercase tracking-widest text-[#B5481A]">
            INSTITUTE OF STRATEGIC RISK MANAGEMENT · ISRM UKRAINE & GLOBAL CHAPTERS
          </div>
          <div className="heading-plate-sand mt-3">
            <h1 className="font-display-oswald text-3xl sm:text-5xl uppercase tracking-wide text-[#123C3A]">
              ISRM Insight Hub & Platform Configurator
            </h1>
          </div>
          <p className="text-base sm:text-lg text-[#13302C]/80 max-w-3xl mt-4 leading-relaxed">
            Please select the target journey below. Each path operates in full isolation with its own sequential description, dedicated calculations view, and single-screen interactive graph workspace.
          </p>
        </header>

        <main className="max-w-5xl mx-auto w-full my-auto py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pathway 1: Client Journey */}
          <div className="bg-white border-2 border-[#123C3A] rounded-xl p-6 sm:p-8 shadow-xl flex flex-col justify-between hover:shadow-2xl transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono-tech text-xs uppercase px-2.5 py-1 rounded bg-[#123C3A]/10 text-[#0B544C] font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0B544C]" /> CLIENT JOURNEY
                </span>
                <span className="font-mono-tech text-xs text-[#13302C]/60">Client-Safe View</span>
              </div>
              <h2 className="font-isrm-heading font-bold text-2xl text-[#0B544C]">
                Client Scope & Service Configurator
              </h2>
              <p className="text-sm text-[#7A7A7A] mt-2 leading-relaxed">
                For ISRM Leadership, Board, and Chapter Decision-Makers. Contains client-safe package descriptions, the 4-ring Service Deck, bounded pilot governance (Cohort 1 & 2), non-linear budget corridors, and the Stage 1 Validated Scope document. Contains zero internal partner fees.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-[#13302C]/85 font-mono-tech">
                <li>• Step 1: Client Description & Governance</li>
                <li>• Step 2: Indicative Sequential Package Calculations</li>
                <li>• Step 3: Single-Screen Interactive Graph Workspace</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleSelectJourney('client')}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded font-display-oswald text-base uppercase tracking-wider bg-[#123C3A] hover:bg-[#1C4F52] text-[#FCE9B0] font-bold cursor-pointer shadow-md transition-colors"
            >
              Launch Client Journey <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pathway 2: Partner Journey */}
          <div className="bg-[#123C3A] border-2 border-[#0B2422] rounded-xl p-6 sm:p-8 shadow-xl text-[#F2EADB] flex flex-col justify-between hover:shadow-2xl transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono-tech text-xs uppercase px-2.5 py-1 rounded bg-[#E3A22E]/20 text-[#FCE9B0] font-semibold flex items-center gap-1.5 border border-[#E3A22E]/40">
                  <Briefcase className="w-4 h-4 text-[#E3A22E]" /> PARTNER JOURNEY
                </span>
                <span className="font-mono-tech text-xs text-[#F2EADB]/60">Internal Architecture</span>
              </div>
              <h2 className="font-display-oswald text-2xl uppercase tracking-wide text-[#FCE9B0]">
                Internal Partner Governance & Fee Matrix
              </h2>
              <p className="text-sm text-[#F2EADB]/80 mt-2 leading-relaxed">
                For Technical Architecture, Frishberg & Partners (F&P) legal track, and Research Leads. Details partner role boundaries, compensation inputs across Packages 1–4, and live client-safe aggregate recalculation.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-[#FCE9B0]/90 font-mono-tech">
                <li>• Step 1: Partner Description & Read-Only Client Offer</li>
                <li>• Step 2: Editable Partner Fees + Live Client Totals</li>
                <li>• Step 3: Partner Graph with CRM Engagement Pipeline</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleSelectJourney('partner')}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded font-display-oswald text-base uppercase tracking-wider bg-[#E3A22E] hover:bg-[#EBB13A] text-[#0B2422] font-bold cursor-pointer shadow-md transition-colors"
            >
              Launch Partner Journey <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </main>

        <footer className="max-w-5xl mx-auto w-full pt-4 border-t border-[#123C3A]/20 flex flex-wrap items-center justify-between text-xs text-[#13302C]/65 font-mono-tech">
          <span>ISRM Ukraine Baseline: 178 Records · 45 Verified Profiles · 8 Controlled Sectors</span>
          <span>Snapshot Date: {CRM_SNAPSHOT_STATS.snapshotDate}</span>
        </footer>
      </div>
    );
  }

  // RENDER ISOLATED JOURNEY BASED ON STATE
  if (journey === 'client') {
    return (
      <ClientProposalRoute
        step={step}
        onSetStep={setStep}
        relationshipModelId={relationshipModelId}
        onSelectRelationshipModel={setRelationshipModelId}
        partnerFees={partnerFees}
        onUpdatePartnerFee={handleUpdatePartnerFee}
        enabledFunctionIds={enabledFunctionIds}
        confirmedModuleIds={confirmedModuleIds}
        techConfirmedModuleIds={techConfirmedModuleIds}
        onToggleFunction={handleToggleFunction}
        onConfirmModule={handleConfirmModule}
        onRejectModule={handleRejectModule}
        onConfirmTechStack={handleConfirmTechStack}
        calculation={calculation}
        budgetCeiling={budgetCeiling}
        onUpdateBudgetCeiling={setBudgetCeiling}
      />
    );
  }

  return (
    <PartnerJourneyRoute
      step={step}
      onSetStep={setStep}
      relationshipModelId={relationshipModelId}
      onSelectRelationshipModel={setRelationshipModelId}
      partnerFees={partnerFees}
      onUpdatePartnerFee={handleUpdatePartnerFee}
      enabledFunctionIds={enabledFunctionIds}
      confirmedModuleIds={confirmedModuleIds}
      techConfirmedModuleIds={techConfirmedModuleIds}
      onToggleFunction={handleToggleFunction}
      onConfirmModule={handleConfirmModule}
      onRejectModule={handleRejectModule}
      onConfirmTechStack={handleConfirmTechStack}
      calculation={calculation}
      budgetCeiling={budgetCeiling}
      onUpdateBudgetCeiling={setBudgetCeiling}
    />
  );
}
