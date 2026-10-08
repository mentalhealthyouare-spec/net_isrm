import React, { useState, useMemo, useEffect } from 'react';
import {
  CRM_MASTER_RECORDS,
  CONTROLLED_SECTORS,
  CONTROLLED_TERRITORIES,
  UNVERIFIED_CLUSTERS,
  CrmRecord,
} from '../lib/crm-data';
import {
  COSTING_RINGS,
  FEATURE_MODULES,
  PLATFORM_FUNCTIONS,
  PlatformFunctionItem,
  FeatureModuleDossier,
  NonLinearCalculationResult,
} from '../lib/proposal-data';
import { ServiceDeckCascade } from './ServiceDeckCascade';
import { SurveyPreviewModal } from './SurveyPreviewModal';
import { ValidatedScopeModal } from './ValidatedScopeModal';
import {
  Filter,
  Globe,
  Briefcase,
  Users,
  Layers,
  Cpu,
  GitBranch,
  FileCheck2,
  ListTree,
  Pin,
  X,
  RotateCcw,
  CheckSquare,
  Square,
  ShieldCheck,
  AlertCircle,
  Search,
  RefreshCw,
  ArrowLeft,
  ClipboardList,
  ExternalLink,
} from 'lucide-react';

export type WorkspaceMode = 'NETWORK' | 'CONFIGURATOR' | 'DEPENDENCIES';
export type UpperPanelId = 'FILTERS' | 'SECTORS' | 'TERRITORIES' | 'EXPERT_NETWORK' | null;
export type LowerPanelId = 'FOUNDATION' | 'FEATURES' | 'DEPENDENCIES' | 'PROPOSAL' | null;

export interface NetworkGraphProps {
  journeyType: 'client' | 'partner';
  enabledFunctionIds: string[];
  confirmedModuleIds: string[];
  techConfirmedModuleIds: string[];
  calculation: NonLinearCalculationResult;
  budgetCeiling: number | null;
  onToggleFunction: (fnId: string) => void;
  onConfirmModule: (moduleId: string) => void;
  onRejectModule: (moduleId: string) => void;
  onConfirmTechStack: (moduleId: string) => void;
  onNavigateBackToDescription: () => void;
  onNavigateBackToCalculations: () => void;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  journeyType,
  enabledFunctionIds,
  confirmedModuleIds,
  techConfirmedModuleIds,
  calculation,
  budgetCeiling,
  onToggleFunction,
  onConfirmModule,
  onRejectModule,
  onConfirmTechStack,
  onNavigateBackToDescription,
  onNavigateBackToCalculations,
}) => {
  // 1. Interaction Mode (what user works with)
  const [activeMode, setActiveMode] = useState<WorkspaceMode>('NETWORK');

  // 2. Layer Visibility (what is visible on the graph — independent from activeMode!)
  const [visibleLayers, setVisibleLayers] = useState({
    experts: true,
    features: true,
    relationships: true,
    clusters: false,
  });

  // 3. Upper 4 Drawers (Preview / Pinned / Closed)
  const [pinnedUpperPanel, setPinnedUpperPanel] = useState<UpperPanelId>(null);
  const [previewUpperPanel, setPreviewUpperPanel] = useState<UpperPanelId>(null);

  // 4. Lower 4 Drawers (Preview / Pinned / Closed)
  const [pinnedLowerPanel, setPinnedLowerPanel] = useState<LowerPanelId>(null);
  const [previewLowerPanel, setPreviewLowerPanel] = useState<LowerPanelId>(null);

  // 5. Filter & Cohort State (shared across all modes)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedTerritories, setSelectedTerritories] = useState<string[]>([]);
  const [selectedIdentityStatuses, setSelectedIdentityStatuses] = useState<string[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<string[]>([]);
  const [selectedExpertIds, setSelectedExpertIds] = useState<number[]>([4, 6, 48, 78, 141, 162, 174]);
  const [inspectedExpert, setInspectedExpert] = useState<CrmRecord | null>(CRM_MASTER_RECORDS[1]); // Jamie Macpherson default

  // 6. Active Service Deck Function / Module for 4-Block Cascade Overlay
  const [activeFunctionId, setActiveFunctionId] = useState<string | null>(null);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  // 7. Accessible Connections List View & Modals
  const [showConnectionsList, setShowConnectionsList] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showValidatedScopeModal, setShowValidatedScopeModal] = useState(false);
  const [underDevActionNotice, setUnderDevActionNotice] = useState<{
    title: string;
    unavailable: string;
    whyNeeded: string;
    futureCapability: string;
    belongsToModule: string;
    nextStep: string;
  } | null>(null);

  // Escape key closes open panels or overlays
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPinnedUpperPanel(null);
        setPreviewUpperPanel(null);
        setPinnedLowerPanel(null);
        setPreviewLowerPanel(null);
        setActiveModuleId(null);
        setUnderDevActionNotice(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredExperts = useMemo(() => {
    return CRM_MASTER_RECORDS.filter((rec) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          rec.contactName.toLowerCase().includes(q) ||
          rec.organisation.toLowerCase().includes(q) ||
          rec.role.toLowerCase().includes(q) ||
          rec.sector.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (selectedSectors.length > 0 && !selectedSectors.includes(rec.sector)) {
        return false;
      }
      if (selectedTerritories.length > 0 && !selectedTerritories.includes(rec.phoneCodeCountry)) {
        return false;
      }
      if (selectedIdentityStatuses.length > 0 && !selectedIdentityStatuses.includes(rec.identityStatus)) {
        return false;
      }
      if (selectedPriority.length > 0 && !selectedPriority.includes(rec.priority)) {
        return false;
      }
      return true;
    });
  }, [searchQuery, selectedSectors, selectedTerritories, selectedIdentityStatuses, selectedPriority]);

  const selectedExpertsList = useMemo(
    () => CRM_MASTER_RECORDS.filter((r) => selectedExpertIds.includes(r.recordId)),
    [selectedExpertIds]
  );

  const activeFunction = useMemo(
    () => PLATFORM_FUNCTIONS.find((f) => f.id === activeFunctionId) || null,
    [activeFunctionId]
  );

  const activeModule = useMemo(() => {
    if (activeModuleId) {
      return FEATURE_MODULES.find((m) => m.id === activeModuleId) || null;
    }
    if (activeFunction) {
      return FEATURE_MODULES.find((m) => m.id === activeFunction.moduleId) || null;
    }
    return null;
  }, [activeModuleId, activeFunction]);

  // Experts matching the currently selected function in DEPENDENCIES mode
  const dependencyMatchedExpertIds = useMemo(() => {
    if (!activeFunction) return [];
    // If permittedExpertCount is null (no verified/permitted interest data), return empty to trigger explicit no-data state
    if (activeFunction.permittedExpertCount === null) return [];
    return filteredExperts
      .filter((e) => activeFunction.matchingSectors.includes(e.sector))
      .map((e) => e.recordId);
  }, [activeFunction, filteredExperts]);

  const currentUpperPanel = pinnedUpperPanel || previewUpperPanel;
  const currentLowerPanel = pinnedLowerPanel || previewLowerPanel;

  const toggleExpertInGroup = (recordId: number) => {
    setSelectedExpertIds((prev) =>
      prev.includes(recordId) ? prev.filter((id) => id !== recordId) : [...prev, recordId]
    );
  };

  const handleSelectFunctionNode = (fn: PlatformFunctionItem) => {
    setActiveFunctionId(fn.id);
    setActiveModuleId(fn.moduleId);
  };

  // Mode-specific visual framing & legend
  const modeMeta = {
    NETWORK: {
      badge: 'MODE 01 · NETWORK / PROTOTYPE',
      title: 'ISRM Ukraine Verified Expert Network & Research Clusters',
      subtitle: 'Explore 45 verified profiles, 8 sectors, 15 territories, and 133 cluster-isolated records on one shared state.',
      borderClass: 'border-[#3E91A2]',
      accentColor: '#3E91A2',
    },
    CONFIGURATOR: {
      badge: 'MODE 02 · PLATFORM CONFIGURATOR (SERVICE DECK)',
      title: '4 Sequential Costing Rings · Functions → Feature Modules → Stack',
      subtitle: 'Configure Consulting (Ring 1), MVP (Ring 2), Bounded Pilot Cycle (Ring 3), and TII/Global Expansion (Ring 4).',
      borderClass: 'border-[#E3A22E]',
      accentColor: '#E3A22E',
    },
    DEPENDENCIES: {
      badge: 'MODE 03 · DEPENDENCIES & EXPERT PROJECTION',
      title: 'Expert-to-Service Dependency Overlay & Reach Projection',
      subtitle: 'Projects selected Service Deck functions onto verified experts and sectors using permitted source data only.',
      borderClass: 'border-[#E8741E]',
      accentColor: '#E8741E',
    },
  }[activeMode];

  return (
    <div className="surface-petrol-workspace min-h-screen flex flex-col justify-between relative overflow-x-hidden select-none">
      {/* Screen-reader live region for filter count announcements */}
      <div className="sr-only" aria-live="polite">
        Active mode {activeMode}. Showing {filteredExperts.length} verified or named expert profiles and {selectedExpertIds.length} profiles in selected cohort.
      </div>

      {/* TOP NAVIGATION & JOURNEY RETURN BAR */}
      <header className="z-30 bg-[#0B2422]/95 border-b border-[#E3A22E]/30 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono-tech text-xs tracking-widest uppercase px-2.5 py-1 rounded bg-[#123C3A] text-[#E3A22E] border border-[#E3A22E]/50">
            {journeyType === 'partner' ? 'PARTNER WORKSPACE' : 'CLIENT WORKSPACE'}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onNavigateBackToDescription}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono-tech text-[#F2EADB]/85 hover:text-[#FCE9B0] hover:bg-[#123C3A] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#E3A22E]" />
              1. {journeyType === 'partner' ? 'Partner Description' : 'Client Description'}
            </button>
            <span className="text-[#F2EADB]/30">·</span>
            <button
              type="button"
              onClick={onNavigateBackToCalculations}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono-tech text-[#F2EADB]/85 hover:text-[#FCE9B0] hover:bg-[#123C3A] transition-colors cursor-pointer"
            >
              2. {journeyType === 'partner' ? 'Partner & Client Calculations' : 'Indicative Calculations'}
            </button>
            <span className="text-[#F2EADB]/30">·</span>
            <span className="px-2.5 py-1 rounded text-xs font-mono-tech bg-[#E3A22E]/20 text-[#FCE9B0] border border-[#E3A22E]/40">
              3. Interactive Graph Workspace
            </span>
          </div>
        </div>

        {/* SEPARATE CONTROLS: (A) Interaction Mode Switcher vs (B) Layer Visibility Toggles */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Interaction Mode Switcher */}
          <div
            role="group"
            aria-label="Interaction Mode Switcher"
            className="flex items-center bg-[#0E302E] p-1 rounded-lg border border-[#2A6E78]/60"
          >
            {(['NETWORK', 'CONFIGURATOR', 'DEPENDENCIES'] as WorkspaceMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setActiveMode(m)}
                className={`px-3 py-1 rounded-md font-display-oswald text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  activeMode === m
                    ? m === 'DEPENDENCIES'
                      ? 'bg-[#E8741E] text-[#0B2422] font-bold shadow-xs'
                      : m === 'CONFIGURATOR'
                      ? 'bg-[#E3A22E] text-[#0B2422] font-bold shadow-xs'
                      : 'bg-[#3E91A2] text-[#0B2422] font-bold shadow-xs'
                    : 'text-[#F2EADB]/75 hover:text-[#FCE9B0]'
                }`}
              >
                {m === 'NETWORK' ? 'EXPERTS (NETWORK)' : m === 'CONFIGURATOR' ? 'FEATURES (PLATFORM)' : 'DEPENDENCIES (MIX)'}
              </button>
            ))}
          </div>

          {/* Layer Visibility Checkboxes */}
          <div
            role="group"
            aria-label="Graph Layer Visibility Controls"
            className="flex items-center gap-2 bg-[#0E302E] px-3 py-1.5 rounded-lg border border-[#2A6E78]/50 font-mono-tech text-[11px]"
          >
            <span className="text-[#E3A22E] uppercase mr-1">Layers:</span>
            {(
              [
                { key: 'experts', label: 'EXPERTS' },
                { key: 'features', label: 'FEATURES' },
                { key: 'relationships', label: 'RELATIONSHIPS' },
                { key: 'clusters', label: 'CLUSTERS (133)' },
              ] as const
            ).map((layer) => (
              <button
                key={layer.key}
                type="button"
                onClick={() =>
                  setVisibleLayers((prev) => ({ ...prev, [layer.key]: !prev[layer.key] }))
                }
                aria-pressed={visibleLayers[layer.key]}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded cursor-pointer transition-colors ${
                  visibleLayers[layer.key]
                    ? 'bg-[#1C4F52] text-[#FCE9B0] border border-[#E3A22E]/40'
                    : 'text-[#F2EADB]/50 hover:text-[#F2EADB]/80'
                }`}
              >
                {visibleLayers[layer.key] ? (
                  <CheckSquare className="w-3 h-3 text-[#E3A22E]" />
                ) : (
                  <Square className="w-3 h-3" />
                )}
                {layer.label}
              </button>
            ))}
          </div>

          {/* Accessible Connections List & Survey Preview Triggers */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSurveyModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded font-mono-tech text-xs bg-[#123C3A] hover:bg-[#1C4F52] text-[#FCE9B0] border border-[#E8741E]/60 cursor-pointer"
            >
              <ClipboardList className="w-3.5 h-3.5 text-[#E8741E]" />
              Survey Preview (Cohort Gate)
            </button>
            <button
              type="button"
              onClick={() => setShowConnectionsList((prev) => !prev)}
              aria-expanded={showConnectionsList}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded font-mono-tech text-xs border cursor-pointer ${
                showConnectionsList
                  ? 'bg-[#E3A22E] text-[#0B2422] border-[#E3A22E] font-semibold'
                  : 'bg-[#123C3A] text-[#FCE9B0] border-[#2A6E78]'
              }`}
            >
              <ListTree className="w-3.5 h-3.5" />
              {showConnectionsList ? 'Hide Text Connections List' : 'Text Connections List (A11y)'}
            </button>
          </div>
        </div>
      </header>

      {/* UPPER ROW: 4 EXPERT NETWORK CONTROL PANELS (FILTERS, SECTORS, TERRITORIES, EXPERT NETWORK) */}
      <div
        className="z-30 bg-[#0E302E]/90 border-b border-[#2A6E78]/40 px-4 py-2 relative"
        onMouseLeave={() => setPreviewUpperPanel(null)}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono-tech text-[11px] uppercase tracking-wider text-[#3E91A2] mr-2">
              UPPER LAYER · EXPERT NETWORK CONTROLS:
            </span>
            {(
              [
                { id: 'FILTERS', label: '1. FILTERS', icon: Filter, count: selectedIdentityStatuses.length + selectedPriority.length + (searchQuery ? 1 : 0) },
                { id: 'SECTORS', label: '2. SECTORS', icon: Briefcase, count: selectedSectors.length || CONTROLLED_SECTORS.length },
                { id: 'TERRITORIES', label: '3. TERRITORIES', icon: Globe, count: selectedTerritories.length || CONTROLLED_TERRITORIES.length },
                { id: 'EXPERT_NETWORK', label: '4. EXPERT NETWORK', icon: Users, count: `${filteredExperts.length} / Cohort: ${selectedExpertIds.length}` },
              ] as const
            ).map((btn) => {
              const Icon = btn.icon;
              const isPinned = pinnedUpperPanel === btn.id;
              const isPreview = previewUpperPanel === btn.id && !pinnedUpperPanel;
              return (
                <button
                  key={btn.id}
                  type="button"
                  onMouseEnter={() => {
                    if (!pinnedUpperPanel) setPreviewUpperPanel(btn.id);
                  }}
                  onClick={() => {
                    if (pinnedUpperPanel === btn.id) {
                      setPinnedUpperPanel(null);
                      setPreviewUpperPanel(null);
                    } else {
                      setPinnedUpperPanel(btn.id);
                      setPreviewUpperPanel(null);
                    }
                  }}
                  aria-expanded={isPinned || isPreview}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded font-display-oswald text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                    isPinned
                      ? 'bg-[#E3A22E] text-[#0B2422] border-[#FCE9B0] font-bold shadow-md'
                      : isPreview
                      ? 'bg-[#1C4F52] text-[#FCE9B0] border-[#E3A22E]'
                      : 'bg-[#123C3A] text-[#F2EADB] border-[#2A6E78]/60 hover:border-[#3E91A2]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{btn.label}</span>
                  <span className="font-mono-tech text-[10px] px-1.5 py-0.2 rounded bg-black/25">
                    {btn.count}
                  </span>
                  {isPinned && <Pin className="w-3 h-3 fill-current" />}
                </button>
              );
            })}
          </div>

          {/* Quick Reset All Upper Filters */}
          {(selectedSectors.length > 0 ||
            selectedTerritories.length > 0 ||
            selectedIdentityStatuses.length > 0 ||
            selectedPriority.length > 0 ||
            searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedSectors([]);
                setSelectedTerritories([]);
                setSelectedIdentityStatuses([]);
                setSelectedPriority([]);
                setSearchQuery('');
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded font-mono-tech text-xs bg-[#8A3410]/40 hover:bg-[#B5481A] text-[#FCE9B0] border border-[#E8741E]/50 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset All Network Filters
            </button>
          )}
        </div>

        {/* UPPER SLIDE-OUT DRAWER (Preview / Pinned / Closed) */}
        {currentUpperPanel && (
          <div
            role="region"
            aria-label={`Upper Network Drawer: ${currentUpperPanel}`}
            className="mt-2 max-w-7xl mx-auto bg-[#0B2422]/95 backdrop-blur-md border-2 border-[#3E91A2] rounded-xl p-4 shadow-2xl text-[#F2EADB]"
          >
            <div className="flex items-center justify-between border-b border-[#2A6E78]/50 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-display-oswald text-base uppercase tracking-wider text-[#FCE9B0]">
                  {currentUpperPanel.replace('_', ' ')} PANEL
                </span>
                <span className="font-mono-tech text-[11px] px-2 py-0.5 rounded bg-[#123C3A] text-[#E3A22E]">
                  {pinnedUpperPanel ? 'STATE: PINNED (Click or Esc to close)' : 'STATE: PREVIEW (Click button to pin)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!pinnedUpperPanel && (
                  <button
                    type="button"
                    onClick={() => setPinnedUpperPanel(currentUpperPanel)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded font-mono-tech text-xs bg-[#E3A22E] text-[#0B2422] font-semibold cursor-pointer"
                  >
                    <Pin className="w-3 h-3" /> Pin Drawer
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setPinnedUpperPanel(null);
                    setPreviewUpperPanel(null);
                  }}
                  aria-label="Close Upper Drawer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded font-mono-tech text-xs bg-[#123C3A] hover:bg-[#1C4F52] text-[#F2EADB] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Close
                </button>
              </div>
            </div>

            {/* 1. FILTERS CONTENT */}
            {currentUpperPanel === 'FILTERS' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="expert-search-input" className="block font-mono-tech text-xs uppercase text-[#E3A22E] mb-1.5">
                    Search Name, Organisation or Expertise
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#F2EADB]/50 absolute left-3 top-2.5" />
                    <input
                      id="expert-search-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="e.g., Control Risks, INSO, Mercy Corps..."
                      className="w-full pl-9 pr-3 py-2 rounded bg-[#0E302E] border border-[#2A6E78] text-sm text-[#F2EADB] focus:outline-none focus:border-[#E3A22E]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono-tech text-xs uppercase text-[#E3A22E]">
                      Verification Status (Explicit Text + Shape)
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedIdentityStatuses([])}
                      className="font-mono-tech text-[11px] text-[#3E91A2] hover:underline cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Confirmed', 'Confirmed — phone matched', 'Probable', 'Self-identified', 'Partial'].map((st) => {
                      const active = selectedIdentityStatuses.includes(st);
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() =>
                            setSelectedIdentityStatuses((prev) =>
                              prev.includes(st) ? prev.filter((x) => x !== st) : [...prev, st]
                            )
                          }
                          className={`px-2.5 py-1 rounded text-xs font-mono-tech border cursor-pointer ${
                            active
                              ? 'bg-[#E3A22E] text-[#0B2422] border-[#FCE9B0] font-semibold'
                              : 'bg-[#123C3A] text-[#F2EADB]/85 border-[#2A6E78]/50'
                          }`}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono-tech text-xs uppercase text-[#E3A22E]">
                      CRM Engagement Priority
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedPriority([])}
                      className="font-mono-tech text-[11px] text-[#3E91A2] hover:underline cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['High', 'Medium', 'Internal'].map((pr) => {
                      const active = selectedPriority.includes(pr);
                      return (
                        <button
                          key={pr}
                          type="button"
                          onClick={() =>
                            setSelectedPriority((prev) =>
                              prev.includes(pr) ? prev.filter((x) => x !== pr) : [...prev, pr]
                            )
                          }
                          className={`px-2.5 py-1 rounded text-xs font-mono-tech border cursor-pointer ${
                            active
                              ? 'bg-[#E8741E] text-[#0B2422] border-[#FCE9B0] font-semibold'
                              : 'bg-[#123C3A] text-[#F2EADB]/85 border-[#2A6E78]/50'
                          }`}
                        >
                          Priority: {pr}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 2. SECTORS CONTENT */}
            {currentUpperPanel === 'SECTORS' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#F2EADB]/80">
                    Controlled Sector Taxonomy (aligned with LinkedIn Industry Crosswalk)
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedSectors([])}
                    className="font-mono-tech text-xs text-[#E3A22E] hover:underline cursor-pointer"
                  >
                    Reset Sectors
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {CONTROLLED_SECTORS.map((sec) => {
                    const count = CRM_MASTER_RECORDS.filter((r) => r.sector === sec).length;
                    const active = selectedSectors.includes(sec);
                    return (
                      <button
                        key={sec}
                        type="button"
                        onClick={() =>
                          setSelectedSectors((prev) =>
                            prev.includes(sec) ? prev.filter((s) => s !== sec) : [...prev, sec]
                          )
                        }
                        className={`flex items-center justify-between p-2 rounded border text-left text-xs cursor-pointer transition-colors ${
                          active
                            ? 'bg-[#E3A22E] text-[#0B2422] border-[#FCE9B0] font-semibold'
                            : 'bg-[#123C3A]/80 text-[#F2EADB] border-[#2A6E78]/50 hover:border-[#3E91A2]'
                        }`}
                      >
                        <span className="truncate pr-2">{sec}</span>
                        <span className="font-mono-tech text-[11px] px-1.5 py-0.5 rounded bg-black/20">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. TERRITORIES CONTENT */}
            {currentUpperPanel === 'TERRITORIES' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#F2EADB]/80">
                    Jurisdiction & Calling-Code Geography (Note: Calling code is separated from verified professional location)
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedTerritories([])}
                    className="font-mono-tech text-xs text-[#E3A22E] hover:underline cursor-pointer"
                  >
                    Reset Territories
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {CONTROLLED_TERRITORIES.map((ter) => {
                    const count = CRM_MASTER_RECORDS.filter((r) => r.phoneCodeCountry === ter).length;
                    if (count === 0) return null;
                    const active = selectedTerritories.includes(ter);
                    return (
                      <button
                        key={ter}
                        type="button"
                        onClick={() =>
                          setSelectedTerritories((prev) =>
                            prev.includes(ter) ? prev.filter((t) => t !== ter) : [...prev, ter]
                          )
                        }
                        className={`flex items-center justify-between p-2 rounded border text-left text-xs cursor-pointer ${
                          active
                            ? 'bg-[#3E91A2] text-[#0B2422] border-[#FCE9B0] font-semibold'
                            : 'bg-[#123C3A]/80 text-[#F2EADB] border-[#2A6E78]/50 hover:border-[#3E91A2]'
                        }`}
                      >
                        <span className="truncate pr-2">{ter}</span>
                        <span className="font-mono-tech text-[11px] px-1.5 py-0.5 rounded bg-black/20">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. EXPERT NETWORK LISTING & SELECTED COHORT GROUP */}
            {currentUpperPanel === 'EXPERT_NETWORK' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-8 max-h-64 overflow-y-auto space-y-1.5 pr-1">
                  {filteredExperts.map((exp) => {
                    const inGroup = selectedExpertIds.includes(exp.recordId);
                    return (
                      <div
                        key={exp.recordId}
                        className={`flex items-center justify-between p-2 rounded border text-xs ${
                          inspectedExpert?.recordId === exp.recordId
                            ? 'bg-[#1C4F52] border-[#E3A22E]'
                            : 'bg-[#123C3A]/70 border-[#2A6E78]/40'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button
                            type="button"
                            onClick={() => toggleExpertInGroup(exp.recordId)}
                            aria-label={`Toggle ${exp.contactName} in selected cohort`}
                            className="text-[#E3A22E] cursor-pointer"
                          >
                            {inGroup ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                          </button>
                          <div className="truncate">
                            <span className="font-semibold text-[#FCE9B0]">{exp.contactName}</span>
                            <span className="text-[#F2EADB]/70"> · {exp.organisation} · {exp.role}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono-tech text-[10px] px-1.5 py-0.5 rounded bg-[#0B2422] text-[#3E91A2]">
                            {exp.identityStatus}
                          </span>
                          <button
                            type="button"
                            onClick={() => setInspectedExpert(exp)}
                            className="px-2 py-0.5 rounded bg-[#E3A22E]/20 hover:bg-[#E3A22E] text-[#FCE9B0] hover:text-[#0B2422] font-mono-tech text-[10px] cursor-pointer"
                          >
                            Inspect Dossier
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="lg:col-span-4 bg-[#123C3A] p-3 rounded-lg border border-[#E3A22E]/40 flex flex-col justify-between">
                  <div>
                    <div className="font-mono-tech text-xs uppercase text-[#E3A22E] mb-1">
                      Selected Working Group ({selectedExpertIds.length} Experts)
                    </div>
                    <p className="text-xs text-[#F2EADB]/80 mb-2">
                      Retained across NETWORK, CONFIGURATOR, and DEPENDENCIES modes for pilot projection.
                    </p>
                    <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto mb-3">
                      {selectedExpertsList.map((s) => (
                        <span
                          key={s.recordId}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0B2422] text-[11px] text-[#FCE9B0] border border-[#E3A22E]/30"
                        >
                          {s.contactName}
                          <button
                            type="button"
                            onClick={() => toggleExpertInGroup(s.recordId)}
                            aria-label={`Remove ${s.contactName}`}
                            className="text-[#E8741E] hover:text-white cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setUnderDevActionNotice({
                        title: 'Save Persistent Multi-Chapter Cohort Group',
                        unavailable: 'Cloud multi-tenant cohort persistence & automated email notification.',
                        whyNeeded: 'Allows chapter chairs to save named working groups and trigger consensual invitations.',
                        futureCapability: 'Server-side cohort snapshots with role-based sharing and consent logs.',
                        belongsToModule: 'Package 3: Bounded Pilot Engine & Repeatable Expert Cycle',
                        nextStep: 'Switch to CONFIGURATOR or click Generate Validated Scope to include this capability.',
                      })
                    }
                    className="w-full py-2 px-3 rounded font-display-oswald text-xs uppercase tracking-wider bg-[#8A3410]/50 hover:bg-[#B5481A] text-[#FCE9B0] border border-[#E8741E] cursor-pointer"
                  >
                    Save Cohort Group · [UNDER DEVELOPMENT]
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MAIN SINGLE-SCREEN WORKSPACE SURFACE */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT / CENTER GRAPH CANVAS & 4 COSTING RINGS (8 cols on desktop) */}
        <div className={`lg:col-span-8 rounded-xl border-2 ${modeMeta.borderClass} bg-[#0B2422]/90 shadow-2xl overflow-hidden flex flex-col`}>
          {/* Active Mode Header Banner */}
          <div className="px-5 py-3 bg-[#123C3A]/90 border-b border-[#2A6E78]/50 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-mono-tech text-xs uppercase tracking-widest" style={{ color: modeMeta.accentColor }}>
                {modeMeta.badge}
              </div>
              <h1 className="font-display-oswald text-xl sm:text-2xl uppercase tracking-wide text-[#FCE9B0]">
                {modeMeta.title}
              </h1>
              <p className="text-xs text-[#F2EADB]/80">{modeMeta.subtitle}</p>
            </div>

            {/* Legend with Non-Color Cues (Shape + Text + Border) */}
            <div className="flex flex-wrap items-center gap-3 font-mono-tech text-[11px] bg-[#0E302E] px-3 py-2 rounded border border-[#2A6E78]/50">
              <span className="flex items-center gap-1.5 text-[#FCE9B0]">
                <span className="w-3 h-3 rounded-full bg-[#3E91A2] border border-white inline-block" />
                ● Verified Expert ({filteredExperts.filter((e) => e.identityStatus.startsWith('Confirmed')).length})
              </span>
              <span className="flex items-center gap-1.5 text-[#E8C24A]">
                <span className="w-3 h-3 rotate-45 bg-[#E8C24A] inline-block" />
                ◆ In Review / Probable ({filteredExperts.filter((e) => !e.identityStatus.startsWith('Confirmed')).length})
              </span>
              <span className="flex items-center gap-1.5 text-[#E3A22E]">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#E3A22E] text-[#0B2422] font-bold inline-flex items-center justify-center text-[9px]">
                  F
                </span>
                ■ Service Function ({ enabledFunctionIds.length }/{ PLATFORM_FUNCTIONS.length })
              </span>
            </div>
          </div>

          {/* Mandatory Disclaimer in DEPENDENCIES Mode */}
          {activeMode === 'DEPENDENCIES' && (
            <div className="bg-[#8A3410]/35 border-b border-[#E8741E]/60 px-5 py-2 flex items-center justify-between gap-3 text-xs text-[#FCE9B0]">
              <div>
                <strong className="font-mono-tech uppercase text-[#E8741E]">PROJECTION NOTICE: </strong>
                Potential expert reach based on the current demonstration dataset (2026-08-28 ISRM Ukraine snapshot). Not a forecast of actual demand, commercial revenue, or guaranteed usage.
              </div>
              {activeFunction && (
                <span className="font-mono-tech text-xs px-2.5 py-0.5 rounded bg-[#0B2422] text-[#E3A22E] shrink-0">
                  Selected Function Reach:{' '}
                  {activeFunction.permittedExpertCount !== null
                    ? `${dependencyMatchedExpertIds.length} filtered / ${activeFunction.permittedExpertCount} dataset total`
                    : 'NO VERIFIED INTEREST DATA YET (0 / NULL)'}
                </span>
              )}
            </div>
          )}

          {/* INTERACTIVE SVG FOUR-RING SERVICE & EXPERT GRAPH */}
          <div className="relative w-full h-[540px] sm:h-[600px] bg-[#0B2422] overflow-hidden">
            <svg
              viewBox="0 0 1000 620"
              className="w-full h-full"
              role="img"
              aria-label="Interactive ISRM Four-Ring Costing & Expert Network Graph"
            >
              <defs>
                <radialGradient id="bunkerGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1C4F52" stopOpacity="0.38" />
                  <stop offset="70%" stopColor="#0E302E" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0B2422" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Ambient Center Glow */}
              <circle cx="500" cy="310" r="290" fill="url(#bunkerGlow)" />

              {/* Crosshair Blueprint Registration Lines */}
              <line x1="500" y1="15" x2="500" y2="605" stroke="#E3A22E" strokeOpacity="0.18" strokeDasharray="4 6" />
              <line x1="40" y1="310" x2="960" y2="310" stroke="#E3A22E" strokeOpacity="0.18" strokeDasharray="4 6" />

              {/* THE 4 SEQUENTIAL COSTING RINGS (Always rendered for structural orientation) */}
              {[
                { r: 95, label: 'RING 1 · PKG 01: CONSULTING & CRM AUDIT', stroke: '#3E91A2', dash: 'none' },
                { r: 165, label: 'RING 2 · PKG 02: APPLICATION MVP FOUNDATION', stroke: '#2A6E78', dash: 'none' },
                { r: 230, label: 'RING 3 · PKG 03: PILOT FUNCTIONS (REPEATABLE EXPERT CYCLE ↻)', stroke: '#E8741E', dash: '6 4' },
                { r: 288, label: 'RING 4 · PKG 04: TII INDEX & GLOBAL EXPANSION', stroke: '#E3A22E', dash: '3 5' },
              ].map((ring, idx) => (
                <g key={idx}>
                  <circle
                    cx="500"
                    cy="310"
                    r={ring.r}
                    fill="none"
                    stroke={ring.stroke}
                    strokeWidth={idx === 2 ? 2.2 : 1.3}
                    strokeOpacity={activeMode === 'CONFIGURATOR' || activeMode === 'DEPENDENCIES' ? 0.65 : 0.3}
                    strokeDasharray={ring.dash}
                  />
                  <text
                    x="506"
                    y={310 - ring.r + 13}
                    fill={ring.stroke}
                    fontSize="9.5"
                    fontFamily="Spline Sans Mono, monospace"
                    letterSpacing="1.2"
                  >
                    {ring.label}
                  </text>
                </g>
              ))}

              {/* Repeatable Cycle Indicator Arrows Exclusively on Ring 3 (r=230) */}
              <g opacity={activeMode === 'NETWORK' ? 0.45 : 0.95}>
                <path
                  d="M 272 280 A 230 230 0 0 1 295 205"
                  fill="none"
                  stroke="#E8741E"
                  strokeWidth="3"
                />
                <text
                  x="210"
                  y="240"
                  fill="#E8741E"
                  fontSize="9"
                  fontFamily="Spline Sans Mono, monospace"
                >
                  ↻ COHORT 1 → COHORT 2 CYCLE
                </text>
              </g>

              {/* RELATIONSHIP EDGES (Expert-to-Sector and Function-to-Expert in DEPENDENCIES) */}
              {visibleLayers.relationships && (
                <g>
                  {/* In DEPENDENCIES mode, draw lines from selected Function to matching Experts */}
                  {activeFunction &&
                    visibleLayers.experts &&
                    visibleLayers.features &&
                    filteredExperts.map((exp, idx) => {
                      const isMatched = dependencyMatchedExpertIds.includes(exp.recordId);
                      if (!isMatched) return null;
                      const fnIndex = PLATFORM_FUNCTIONS.findIndex((f) => f.id === activeFunction.id);
                      const fnAngle = (fnIndex / PLATFORM_FUNCTIONS.length) * Math.PI * 2 - Math.PI / 2;
                      const ringOrder =
                        activeFunction.ringId === 'ring-1-consulting'
                          ? 95
                          : activeFunction.ringId === 'ring-2-mvp'
                          ? 165
                          : activeFunction.ringId === 'ring-3-pilot'
                          ? 230
                          : 288;
                      const fx = 500 + Math.cos(fnAngle) * ringOrder;
                      const fy = 310 + Math.sin(fnAngle) * ringOrder;

                      const expAngle = (idx / Math.max(filteredExperts.length, 1)) * Math.PI * 2;
                      const expRadius = 125 + (idx % 3) * 48;
                      const ex = 500 + Math.cos(expAngle) * expRadius;
                      const ey = 310 + Math.sin(expAngle) * expRadius - (activeMode === 'DEPENDENCIES' ? 12 : 0);

                      return (
                        <line
                          key={`dep-${exp.recordId}`}
                          x1={fx}
                          y1={fy}
                          x2={ex}
                          y2={ey}
                          stroke="#E8741E"
                          strokeWidth="1.6"
                          strokeOpacity="0.75"
                          strokeDasharray="3 3"
                        />
                      );
                    })}

                  {/* In NETWORK mode, connect experts in the Selected Working Group to the Hub */}
                  {visibleLayers.experts &&
                    filteredExperts.map((exp, idx) => {
                      if (!selectedExpertIds.includes(exp.recordId)) return null;
                      const expAngle = (idx / Math.max(filteredExperts.length, 1)) * Math.PI * 2;
                      const expRadius = 125 + (idx % 3) * 48;
                      const ex = 500 + Math.cos(expAngle) * expRadius;
                      const ey = 310 + Math.sin(expAngle) * expRadius;
                      return (
                        <line
                          key={`hub-${exp.recordId}`}
                          x1="500"
                          y1="310"
                          x2={ex}
                          y2={ey}
                          stroke="#3E91A2"
                          strokeWidth="1.2"
                          strokeOpacity="0.45"
                        />
                      );
                    })}
                </g>
              )}

              {/* CLUSTER LAYER NODES (133 Unverified / Partial Records in 3 Governed Clusters) */}
              {visibleLayers.clusters &&
                UNVERIFIED_CLUSTERS.map((cl, i) => {
                  const positions = [
                    { x: 135, y: 110 },
                    { x: 135, y: 500 },
                    { x: 865, y: 500 },
                  ];
                  const pos = positions[i] || { x: 150, y: 300 };
                  return (
                    <g key={cl.clusterId} transform={`translate(${pos.x}, ${pos.y})`}>
                      <rect
                        x="-95"
                        y="-28"
                        width="190"
                        height="56"
                        rx="8"
                        fill="#123C3A"
                        stroke="#E8C24A"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                      />
                      <text
                        x="0"
                        y="-6"
                        textAnchor="middle"
                        fill="#FCE9B0"
                        fontSize="10"
                        fontFamily="Oswald, sans-serif"
                      >
                        CLUSTER: {cl.identityStatus.toUpperCase()} ({cl.count})
                      </text>
                      <text
                        x="0"
                        y="12"
                        textAnchor="middle"
                        fill="#E8C24A"
                        fontSize="8.5"
                        fontFamily="Spline Sans Mono, monospace"
                      >
                        Queue Isolated · Human Review Gate
                      </text>
                    </g>
                  );
                })}

              {/* SERVICE DECK FUNCTION NODES (Positioned on their respective Costing Rings 1–4) */}
              {visibleLayers.features &&
                PLATFORM_FUNCTIONS.map((fn, idx) => {
                  const angle = (idx / PLATFORM_FUNCTIONS.length) * Math.PI * 2 - Math.PI / 2;
                  const ringRadius =
                    fn.ringId === 'ring-1-consulting'
                      ? 95
                      : fn.ringId === 'ring-2-mvp'
                      ? 165
                      : fn.ringId === 'ring-3-pilot'
                      ? 230
                      : 288;
                  const x = 500 + Math.cos(angle) * ringRadius;
                  const y = 310 + Math.sin(angle) * ringRadius;
                  const isEnabled = fn.isFoundation || enabledFunctionIds.includes(fn.id);
                  const isSelected = activeFunctionId === fn.id;

                  return (
                    <g
                      key={fn.id}
                      transform={`translate(${x}, ${y})`}
                      onClick={() => handleSelectFunctionNode(fn)}
                      className="cursor-pointer"
                      role="button"
                      tabIndex={0}
                      aria-label={`Service Function: ${fn.title} (${isEnabled ? 'Included' : 'Excluded'})`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelectFunctionNode(fn);
                        }
                      }}
                    >
                      <rect
                        x="-13"
                        y="-13"
                        width="26"
                        height="26"
                        rx="5"
                        fill={isSelected ? '#FCE9B0' : isEnabled ? '#E3A22E' : '#123C3A'}
                        stroke={isSelected ? '#E8741E' : '#FCE9B0'}
                        strokeWidth={isSelected ? '2.5' : '1.2'}
                      />
                      <text
                        x="0"
                        y="4"
                        textAnchor="middle"
                        fill={isEnabled || isSelected ? '#0B2422' : '#F2EADB'}
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="Spline Sans Mono, monospace"
                      >
                        F{idx + 1}
                      </text>
                      {(activeMode !== 'NETWORK' || isSelected) && (
                        <text
                          x="0"
                          y="26"
                          textAnchor="middle"
                          fill={isSelected ? '#FCE9B0' : '#E3A22E'}
                          fontSize="9.5"
                          fontWeight={isSelected ? 'bold' : 'normal'}
                          fontFamily="Source Sans 3, sans-serif"
                        >
                          {fn.title.slice(0, 24)}
                        </text>
                      )}
                    </g>
                  );
                })}

              {/* EXPERT NODES (45 Verified / Named Profiles) */}
              {visibleLayers.experts &&
                filteredExperts.map((exp, idx) => {
                  const angle = (idx / Math.max(filteredExperts.length, 1)) * Math.PI * 2;
                  const baseRadius = 125 + (idx % 3) * 48;
                  const isMatchedInDeps =
                    activeMode === 'DEPENDENCIES' && dependencyMatchedExpertIds.includes(exp.recordId);
                  // Visual rise/settling of expert nodes when matched by actual permitted data in DEPENDENCIES mode
                  const x = 500 + Math.cos(angle) * baseRadius;
                  const y = 310 + Math.sin(angle) * baseRadius - (isMatchedInDeps ? 12 : 0);

                  const isConfirmed = exp.identityStatus.startsWith('Confirmed');
                  const isSelected = inspectedExpert?.recordId === exp.recordId;
                  const inCohort = selectedExpertIds.includes(exp.recordId);

                  return (
                    <g
                      key={exp.recordId}
                      transform={`translate(${x}, ${y})`}
                      onClick={() => setInspectedExpert(exp)}
                      className="cursor-pointer transition-transform duration-200"
                      role="button"
                      tabIndex={0}
                      aria-label={`Expert Profile: ${exp.contactName}, ${exp.organisation}, Status: ${exp.identityStatus}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setInspectedExpert(exp);
                        }
                      }}
                    >
                      {/* Outer halo if in Selected Working Group or Dependency Match */}
                      {(inCohort || isMatchedInDeps) && (
                        <circle
                          r="15"
                          fill="none"
                          stroke={isMatchedInDeps ? '#E8741E' : '#FCE9B0'}
                          strokeWidth="2"
                          strokeDasharray={isMatchedInDeps ? 'none' : '3 2'}
                        />
                      )}

                      {/* Shape Differentiation: Circle for Confirmed, Diamond for Probable/Self-Identified */}
                      {isConfirmed ? (
                        <circle
                          r={isSelected ? '10' : '8'}
                          fill={isSelected ? '#FCE9B0' : isMatchedInDeps ? '#E8741E' : '#3E91A2'}
                          stroke="#0B2422"
                          strokeWidth="1.5"
                        />
                      ) : (
                        <polygon
                          points="0,-9 9,0 0,9 -9,0"
                          fill={isSelected ? '#FCE9B0' : '#E8C24A'}
                          stroke="#0B2422"
                          strokeWidth="1.5"
                        />
                      )}

                      <text
                        x="0"
                        y="-13"
                        textAnchor="middle"
                        fill={isSelected || isMatchedInDeps ? '#FCE9B0' : '#F2EADB'}
                        fontSize={isSelected ? '10.5' : '9'}
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        fontFamily="Source Sans 3, sans-serif"
                      >
                        {exp.contactName.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}

              {/* Center Hub Node */}
              <g transform="translate(500, 310)">
                <circle r="34" fill="#123C3A" stroke="#E3A22E" strokeWidth="2" />
                <text
                  x="0"
                  y="-4"
                  textAnchor="middle"
                  fill="#FCE9B0"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="Oswald, sans-serif"
                >
                  ISRM HUB
                </text>
                <text
                  x="0"
                  y="10"
                  textAnchor="middle"
                  fill="#E3A22E"
                  fontSize="8.5"
                  fontFamily="Spline Sans Mono, monospace"
                >
                  178 RECORDS
                </text>
              </g>
            </svg>

            {/* Quick Interactive Overlay Bar at Bottom of Canvas */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 bg-[#0B2422]/90 border border-[#2A6E78]/60 px-3.5 py-2 rounded-lg text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono-tech text-[#E3A22E]">CLICK ANY NODE:</span>
                <span className="text-[#F2EADB]/85">
                  Click ● Expert node for Mini-Dossier, or click ■ F1–F14 node to launch the 4-Block Feature Configurator Overlay.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectFunctionNode(PLATFORM_FUNCTIONS[6])}
                  className="px-2.5 py-1 rounded font-mono-tech text-[11px] bg-[#E3A22E] text-[#0B2422] font-semibold hover:bg-[#EBB13A] cursor-pointer"
                >
                  Open Service Deck Cascade Overlay
                </button>
              </div>
            </div>
          </div>

          {/* ACCESSIBLE TEXTUAL CONNECTIONS LIST (DOM Twin for Screen Readers & Keyboard Users) */}
          {showConnectionsList && (
            <div
              role="region"
              aria-label="Accessible Textual Connections List"
              className="p-4 bg-[#0E302E] border-t-2 border-[#E3A22E] max-h-80 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display-oswald text-base uppercase text-[#FCE9B0]">
                  Accessible Connections List (Textual Graph Equivalent · {filteredExperts.length} Profiles)
                </h2>
                <span className="font-mono-tech text-xs text-[#E3A22E]">
                  Full keyboard & screen-reader parity
                </span>
              </div>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#2A6E78] font-mono-tech text-[#E3A22E] uppercase">
                    <th className="py-1.5 px-2">Expert Contact</th>
                    <th className="py-1.5 px-2">Organisation & Role</th>
                    <th className="py-1.5 px-2">Controlled Sector</th>
                    <th className="py-1.5 px-2">Verification Status</th>
                    <th className="py-1.5 px-2">Relationship Type</th>
                    <th className="py-1.5 px-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A6E78]/30">
                  {filteredExperts.map((exp) => (
                    <tr key={exp.recordId} className="hover:bg-[#123C3A]">
                      <td className="py-1.5 px-2 font-semibold text-[#FCE9B0]">{exp.contactName}</td>
                      <td className="py-1.5 px-2 text-[#F2EADB]/85">
                        {exp.organisation} — {exp.role}
                      </td>
                      <td className="py-1.5 px-2 font-mono-tech text-[#3E91A2]">{exp.sector}</td>
                      <td className="py-1.5 px-2 font-mono-tech">{exp.identityStatus}</td>
                      <td className="py-1.5 px-2">{exp.relationshipType}</td>
                      <td className="py-1.5 px-2">
                        <button
                          type="button"
                          onClick={() => setInspectedExpert(exp)}
                          className="px-2 py-0.5 rounded bg-[#E3A22E] text-[#0B2422] font-mono-tech font-semibold cursor-pointer"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: EXPERT MINI-DOSSIER + SERVICE DECK QUICK SELECTOR (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Inspected Expert Mini-Dossier */}
          {inspectedExpert && (
            <div className="bg-[#0E302E] border-2 border-[#2A6E78] rounded-xl p-4 shadow-xl text-[#F2EADB]">
              <div className="flex items-center justify-between border-b border-[#2A6E78]/50 pb-2 mb-3">
                <span className="font-mono-tech text-xs uppercase text-[#3E91A2]">
                  EXPERT MINI-DOSSIER · RECORD #{inspectedExpert.recordId}
                </span>
                <span
                  className={`font-mono-tech text-[11px] px-2 py-0.5 rounded font-semibold ${
                    inspectedExpert.identityStatus.startsWith('Confirmed')
                      ? 'bg-[#3E91A2]/25 text-[#FCE9B0] border border-[#3E91A2]'
                      : 'bg-[#E8C24A]/20 text-[#E8C24A] border border-[#E8C24A]/50'
                  }`}
                >
                  {inspectedExpert.identityStatus} ({inspectedExpert.confidence})
                </span>
              </div>

              <h2 className="font-display-oswald text-xl uppercase text-[#FCE9B0]">
                {inspectedExpert.contactName}
              </h2>
              <div className="text-sm text-[#E3A22E] font-semibold mt-0.5">
                {inspectedExpert.role} · {inspectedExpert.organisation}
              </div>

              <div className="flex flex-wrap items-center gap-2 font-mono-tech text-xs text-[#F2EADB]/70 mt-2">
                <span>{inspectedExpert.sector}</span>
                <span>·</span>
                <span>{inspectedExpert.phoneCodeCountry}</span>
                <span>·</span>
                <span>Completeness: {inspectedExpert.dataCompleteness}%</span>
              </div>

              {inspectedExpert.documentedUkraineExperience && (
                <div className="mt-3 p-2.5 rounded bg-[#0B2422] border border-[#1C4F52] text-xs leading-relaxed">
                  <div className="font-mono-tech text-[10px] uppercase text-[#E3A22E] mb-0.5">
                    Documented Ukraine Experience & Evidence
                  </div>
                  {inspectedExpert.documentedUkraineExperience}
                </div>
              )}

              {inspectedExpert.caseStudyTheme && (
                <div className="mt-2.5 p-2.5 rounded bg-[#123C3A]/70 border border-[#2A6E78]/40 text-xs">
                  <div className="font-mono-tech text-[10px] uppercase text-[#3E91A2]">
                    Proposed Case Study / Knowledge Theme
                  </div>
                  <div className="mt-0.5 text-[#FCE9B0]">{inspectedExpert.caseStudyTheme}</div>
                  {inspectedExpert.priorityInterviewQuestion && (
                    <div className="mt-1 text-[#F2EADB]/75 italic">
                      Q: “{inspectedExpert.priorityInterviewQuestion}”
                    </div>
                  )}
                </div>
              )}

              {/* Partner-Only CRM Relevance Note */}
              {journeyType === 'partner' && (
                <div className="mt-2.5 p-2.5 rounded bg-[#8A3410]/25 border border-[#E8741E]/50 text-xs">
                  <div className="font-mono-tech text-[10px] uppercase text-[#E8741E]">
                    INTERNAL PARTNER PIPELINE NOTE (HIDDEN FROM CLIENT)
                  </div>
                  <div className="mt-0.5 text-[#FCE9B0]">{inspectedExpert.relevanceNote}</div>
                  <div className="mt-1 text-[#F2EADB]/80">
                    <strong>Next Action:</strong> {inspectedExpert.nextAction}
                  </div>
                </div>
              )}

              {/* TII Index Status inside Dossier */}
              <div className="mt-3 p-2.5 rounded bg-[#0B2422]/80 border border-[#E3A22E]/30 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono-tech text-[10px] uppercase text-[#E3A22E] block">
                    Trust & Influence Index (TII)
                  </span>
                  <span className="text-[#F2EADB]/75 text-[11px]">
                    No automated score — Pending Package 4 human-review methodology
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveFunctionId('fn-trust-verification-ledger');
                    setActiveModuleId('mod-tii-index');
                  }}
                  className="px-2.5 py-1 rounded bg-[#123C3A] hover:bg-[#1C4F52] text-[#E3A22E] font-mono-tech text-[10px] border border-[#E3A22E]/40 cursor-pointer shrink-0"
                >
                  Configure TII
                </button>
              </div>

              <div className="mt-3 pt-3 border-t border-[#2A6E78]/40 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => toggleExpertInGroup(inspectedExpert.recordId)}
                  className={`flex-1 py-1.5 px-3 rounded font-display-oswald text-xs uppercase tracking-wider cursor-pointer ${
                    selectedExpertIds.includes(inspectedExpert.recordId)
                      ? 'bg-[#3E91A2] text-[#0B2422] font-bold'
                      : 'bg-[#123C3A] text-[#FCE9B0] border border-[#3E91A2]'
                  }`}
                >
                  {selectedExpertIds.includes(inspectedExpert.recordId)
                    ? '✓ In Working Group Cohort'
                    : '+ Add to Working Group Cohort'}
                </button>

                {(inspectedExpert.linkedinUrl || inspectedExpert.otherPublicSource) && (
                  <a
                    href={inspectedExpert.linkedinUrl || inspectedExpert.otherPublicSource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 py-1.5 px-3 rounded bg-[#0B2422] hover:bg-[#123C3A] text-[#E3A22E] font-mono-tech text-xs border border-[#E3A22E]/40"
                  >
                    Public Source <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Service Deck · Customisable Network Services Quick Stack */}
          <div className="bg-[#0E302E] border-2 border-[#E3A22E]/60 rounded-xl p-4 shadow-xl text-[#F2EADB]">
            <div className="flex items-center justify-between border-b border-[#E3A22E]/30 pb-2 mb-3">
              <div>
                <span className="font-mono-tech text-[10px] uppercase text-[#E3A22E]">
                  SERVICE DECK · CUSTOMISABLE NETWORK SERVICES
                </span>
                <h3 className="font-display-oswald text-base uppercase text-[#FCE9B0]">
                  Functions → Feature Modules (Click to Unfold)
                </h3>
              </div>
              <span className="font-mono-tech text-xs text-[#E3A22E] tabular-nums">
                £{calculation.totalConfiguredLean.toLocaleString()}–£{calculation.totalConfiguredExpanded.toLocaleString()}
              </span>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {FEATURE_MODULES.map((mod) => {
                const modFns = PLATFORM_FUNCTIONS.filter((f) => f.moduleId === mod.id);
                const activeCount = modFns.filter((f) => f.isFoundation || enabledFunctionIds.includes(f.id)).length;
                const isConfirmed = confirmedModuleIds.includes(mod.id);
                const isTechOk = techConfirmedModuleIds.includes(mod.id);

                return (
                  <div
                    key={mod.id}
                    className={`p-2.5 rounded-lg border transition-colors ${
                      activeModule?.id === mod.id
                        ? 'bg-[#123C3A] border-[#E3A22E]'
                        : 'bg-[#0B2422]/80 border-[#2A6E78]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveModuleId(mod.id);
                          setActiveFunctionId(mod.functionIds[0]);
                        }}
                        className="text-left font-display-oswald text-sm uppercase text-[#FCE9B0] hover:text-[#E3A22E] cursor-pointer"
                      >
                        Ring {mod.ringOrder}: {mod.title}
                      </button>
                      <span className="font-mono-tech text-[10px] px-1.5 py-0.5 rounded bg-[#123C3A] text-[#E3A22E] shrink-0">
                        {activeCount}/{modFns.length} Fns {isTechOk ? '· STACK OK' : isConfirmed ? '· CONFIRMED' : ''}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {modFns.map((fn) => {
                        const on = fn.isFoundation || enabledFunctionIds.includes(fn.id);
                        return (
                          <button
                            key={fn.id}
                            type="button"
                            onClick={() => {
                              if (!fn.isFoundation) onToggleFunction(fn.id);
                              handleSelectFunctionNode(fn);
                            }}
                            className={`px-2 py-0.5 rounded font-mono-tech text-[10px] border cursor-pointer ${
                              on
                                ? 'bg-[#1C4F52] text-[#FCE9B0] border-[#3E91A2]'
                                : 'bg-[#0B2422] text-[#F2EADB]/45 border-[#2A6E78]/30 line-through'
                            }`}
                          >
                            {fn.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-[#E3A22E]/30">
              <button
                type="button"
                onClick={() => setShowValidatedScopeModal(true)}
                className="w-full py-2 px-4 rounded font-display-oswald text-sm uppercase tracking-wider bg-[#E3A22E] hover:bg-[#EBB13A] text-[#0B2422] font-bold cursor-pointer shadow-md"
              >
                Open Validated Scope & Stage 1 PDF
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 4-BLOCK PROGRESSIVE SERVICE DECK CASCADE OVERLAY (>1.4x desktop reading width, translucent) */}
      <ServiceDeckCascade
        selectedFunction={activeFunction}
        selectedModule={activeModule}
        enabledFunctionIds={enabledFunctionIds}
        confirmedModuleIds={confirmedModuleIds}
        techConfirmedModuleIds={techConfirmedModuleIds}
        calculation={calculation}
        onToggleFunction={onToggleFunction}
        onConfirmModule={onConfirmModule}
        onRejectModule={onRejectModule}
        onConfirmTechStack={onConfirmTechStack}
        onOpenValidatedScope={() => setShowValidatedScopeModal(true)}
        onCloseOverlay={() => {
          setActiveModuleId(null);
          setActiveFunctionId(null);
        }}
      />

      {/* UNDER-DEVELOPMENT ACTION EXPLANATION MODAL (5 Mandatory Fields per Prompt Rules) */}
      {underDevActionNotice && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Under Development Capability Explanation"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
        >
          <div className="bg-[#0E302E] border-2 border-[#E3A22E] rounded-xl max-w-lg w-full p-5 text-[#F2EADB] shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#2A6E78] pb-2">
              <span className="font-mono-tech text-xs uppercase text-[#E8741E]">
                STATUS: UNDER DEVELOPMENT · HONEST PROTOTYPE BOUNDARY
              </span>
              <button
                type="button"
                onClick={() => setUnderDevActionNotice(null)}
                className="p-1 rounded bg-[#123C3A] text-[#F2EADB] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-display-oswald text-lg uppercase text-[#FCE9B0]">
              {underDevActionNotice.title}
            </h3>
            <div className="space-y-2 text-xs leading-relaxed">
              <div>
                <strong className="text-[#E3A22E]">1. Currently Unavailable in Live Demo: </strong>
                {underDevActionNotice.unavailable}
              </div>
              <div>
                <strong className="text-[#E3A22E]">2. Operational Purpose: </strong>
                {underDevActionNotice.whyNeeded}
              </div>
              <div>
                <strong className="text-[#E3A22E]">3. Future Production Capability: </strong>
                {underDevActionNotice.futureCapability}
              </div>
              <div>
                <strong className="text-[#E3A22E]">4. Parent Feature Module: </strong>
                {underDevActionNotice.belongsToModule}
              </div>
              <div>
                <strong className="text-[#E3A22E]">5. Next Step: </strong>
                {underDevActionNotice.nextStep}
              </div>
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setUnderDevActionNotice(null);
                  setActiveMode('CONFIGURATOR');
                  setActiveModuleId('mod-pilot-cycle');
                }}
                className="px-4 py-1.5 rounded font-display-oswald text-xs uppercase bg-[#E3A22E] text-[#0B2422] font-bold cursor-pointer"
              >
                Configure in Package 3
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOWER ROW: 4 PLATFORM CONFIGURATOR PANELS (FOUNDATION, FEATURES, DEPENDENCIES, PROPOSAL) */}
      <footer
        className="z-30 bg-[#0B2422]/95 border-t border-[#E3A22E]/40 px-4 py-2 relative"
        onMouseLeave={() => setPreviewLowerPanel(null)}
      >
        {currentLowerPanel && (
          <div
            role="region"
            aria-label={`Lower Platform Drawer: ${currentLowerPanel}`}
            className="mb-2 max-w-7xl mx-auto bg-[#0E302E]/95 backdrop-blur-md border-2 border-[#E3A22E] rounded-xl p-4 shadow-2xl text-[#F2EADB]"
          >
            <div className="flex items-center justify-between border-b border-[#2A6E78]/50 pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-display-oswald text-base uppercase tracking-wider text-[#FCE9B0]">
                  LOWER LAYER · {currentLowerPanel} PANEL
                </span>
                <span className="font-mono-tech text-[11px] px-2 py-0.5 rounded bg-[#123C3A] text-[#E3A22E]">
                  {pinnedLowerPanel ? 'PINNED' : 'PREVIEW'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPinnedLowerPanel(null);
                  setPreviewLowerPanel(null);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded font-mono-tech text-xs bg-[#123C3A] text-[#F2EADB] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Close
              </button>
            </div>

            {currentLowerPanel === 'FOUNDATION' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {COSTING_RINGS.slice(0, 2).map((ring) => (
                  <div key={ring.id} className="p-3 rounded bg-[#123C3A] border border-[#3E91A2]/50">
                    <div className="font-mono-tech text-[#E3A22E] font-semibold">{ring.code} · MANDATORY BASE</div>
                    <div className="font-display-oswald text-base text-[#FCE9B0] uppercase mt-0.5">{ring.title}</div>
                    <p className="text-[#F2EADB]/80 mt-1">{ring.subtitle}</p>
                    <div className="mt-2 font-mono-tech text-[11px] text-[#3E91A2]">
                      Acceptance Gate: {ring.acceptanceCriteria}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {currentLowerPanel === 'FEATURES' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {FEATURE_MODULES.filter((m) => !m.isFoundation).map((mod) => (
                  <div key={mod.id} className="p-3 rounded bg-[#123C3A] border border-[#E3A22E]/40 flex flex-col justify-between">
                    <div>
                      <span className="font-mono-tech text-[10px] text-[#E8741E]">{mod.status}</span>
                      <div className="font-display-oswald text-sm uppercase text-[#FCE9B0] mt-0.5">{mod.title}</div>
                      <p className="text-[#F2EADB]/75 mt-1">{mod.subtitle}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModuleId(mod.id);
                        setActiveFunctionId(mod.functionIds[0]);
                      }}
                      className="mt-2 py-1.5 px-3 rounded bg-[#E3A22E] text-[#0B2422] font-display-oswald uppercase text-xs font-bold cursor-pointer"
                    >
                      Inspect Feature Dossier
                    </button>
                  </div>
                ))}
              </div>
            )}

            {currentLowerPanel === 'DEPENDENCIES' && (
              <div className="space-y-2 text-xs">
                <div className="text-[#FCE9B0] font-semibold">
                  Select any Service Deck function below to project its expert reach onto the graph in DEPENDENCIES mode:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {PLATFORM_FUNCTIONS.map((fn) => (
                    <button
                      key={fn.id}
                      type="button"
                      onClick={() => {
                        setActiveMode('DEPENDENCIES');
                        handleSelectFunctionNode(fn);
                      }}
                      className={`px-2.5 py-1 rounded font-mono-tech text-xs border cursor-pointer ${
                        activeFunctionId === fn.id
                          ? 'bg-[#E8741E] text-[#0B2422] border-[#FCE9B0] font-bold'
                          : 'bg-[#123C3A] text-[#F2EADB] border-[#2A6E78]'
                      }`}
                    >
                      {fn.title} ({fn.permittedExpertCount !== null ? `${fn.permittedExpertCount} verified` : 'No data yet'})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentLowerPanel === 'PROPOSAL' && (
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <div className="font-display-oswald text-base uppercase text-[#FCE9B0]">
                    Stage 1: Validated Scope & Indicative Budget Range (£{calculation.totalConfiguredLean.toLocaleString()} – £{calculation.totalConfiguredExpanded.toLocaleString()})
                  </div>
                  <p className="text-[#F2EADB]/80 mt-0.5">
                    Initial mobilisation from 30% (£{calculation.mobilisationMinimumLean.toLocaleString()}+); balance payable upon delivery/acceptance of each sequential package.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowValidatedScopeModal(true)}
                  className="px-4 py-2 rounded font-display-oswald text-sm uppercase bg-[#E3A22E] text-[#0B2422] font-bold cursor-pointer"
                >
                  Open Validated Scope & Print PDF
                </button>
              </div>
            )}
          </div>
        )}

        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono-tech text-[11px] uppercase tracking-wider text-[#E3A22E] mr-2">
              LOWER LAYER · PLATFORM & SCOPE CONTROLS:
            </span>
            {(
              [
                { id: 'FOUNDATION', label: '1. FOUNDATION', icon: Layers },
                { id: 'FEATURES', label: '2. FEATURES', icon: Cpu },
                { id: 'DEPENDENCIES', label: '3. DEPENDENCIES', icon: GitBranch },
                { id: 'PROPOSAL', label: '4. PROPOSAL / VALIDATED SCOPE', icon: FileCheck2 },
              ] as const
            ).map((btn) => {
              const Icon = btn.icon;
              const isPinned = pinnedLowerPanel === btn.id;
              const isPreview = previewLowerPanel === btn.id && !pinnedLowerPanel;
              return (
                <button
                  key={btn.id}
                  type="button"
                  onMouseEnter={() => {
                    if (!pinnedLowerPanel) setPreviewLowerPanel(btn.id);
                  }}
                  onClick={() => {
                    if (pinnedLowerPanel === btn.id) {
                      setPinnedLowerPanel(null);
                      setPreviewLowerPanel(null);
                    } else {
                      setPinnedLowerPanel(btn.id);
                      setPreviewLowerPanel(null);
                    }
                  }}
                  aria-expanded={isPinned || isPreview}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded font-display-oswald text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                    isPinned
                      ? 'bg-[#E3A22E] text-[#0B2422] border-[#FCE9B0] font-bold'
                      : isPreview
                      ? 'bg-[#1C4F52] text-[#FCE9B0] border-[#E3A22E]'
                      : 'bg-[#123C3A] text-[#F2EADB] border-[#E3A22E]/40 hover:border-[#E3A22E]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{btn.label}</span>
                  {isPinned && <Pin className="w-3 h-3 fill-current" />}
                </button>
              );
            })}
          </div>

          <div className="font-mono-tech text-xs text-[#FCE9B0] flex items-center gap-3">
            <span>
              Indicative Range: <strong>£{calculation.totalConfiguredLean.toLocaleString()} – £{calculation.totalConfiguredExpanded.toLocaleString()}</strong>
            </span>
            <button
              type="button"
              onClick={() => setShowValidatedScopeModal(true)}
              className="px-3 py-1 rounded bg-[#E3A22E] text-[#0B2422] font-bold hover:bg-[#EBB13A] cursor-pointer"
            >
              Generate Scope PDF
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SurveyPreviewModal isOpen={showSurveyModal} onClose={() => setShowSurveyModal(false)} />
      <ValidatedScopeModal
        isOpen={showValidatedScopeModal}
        onClose={() => setShowValidatedScopeModal(false)}
        enabledFunctionIds={enabledFunctionIds}
        selectedExperts={selectedExpertsList}
        calculation={calculation}
        budgetCeiling={budgetCeiling}
      />
    </div>
  );
};
