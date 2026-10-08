export type CostingRingId = 'ring-1-consulting' | 'ring-2-mvp' | 'ring-3-pilot' | 'ring-4-expansion';

export type ImplementationStatus =
  | 'LIVE DEMO'
  | 'PROPOSED'
  | 'UNDER DEVELOPMENT'
  | 'REQUIRES CONFIGURATION'
  | 'REQUIRES ORDER';

export type RelationshipModelId = 'community-product' | 'founding-partner' | 'platform-service';

export interface PlatformFunctionItem {
  id: string;
  title: string;
  communityPerspective: string;
  moduleId: string;
  ringId: CostingRingId;
  isFoundation: boolean;
  status: ImplementationStatus;
  baseHoursLean: number;
  baseHoursExpanded: number;
  techStack: string[];
  excludedLossWarning: string;
  matchingSectors: string[];
  permittedExpertCount: number | null; // null if no verified/permitted interest data exists
  evidenceBasis: string;
}

export interface FeatureModuleDossier {
  id: string;
  title: string;
  subtitle: string;
  ringId: CostingRingId;
  ringOrder: 1 | 2 | 3 | 4;
  isFoundation: boolean;
  status: ImplementationStatus;
  description: string;
  communityFunctionSummary: string;
  targetUsers: string[];
  kpiMetrics: string[];
  kpiMetrics_note?: string;
  expectedResult: string;
  dependencies: string[];
  exclusionImpact: string;
  techStackNarrative: string;
  techStackComponents: {
    layer: string;
    spec: string;
    validationState: 'Implemented in Prototype' | 'Proposed Architecture' | 'Integration Candidate' | 'Requires Technical Validation';
  }[];
  functionIds: string[];
  hasRepeatableExpertCycle?: boolean;
}

export interface CostingRingSpec {
  id: CostingRingId;
  order: 1 | 2 | 3 | 4;
  code: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  isRepeatableCycle: boolean;
  cycleDescription?: string;
  deliverables: string[];
  acceptanceCriteria: string;
  paymentTermNote: string;
}

export interface PartnerRoleFeeInput {
  id: string;
  roleTitle: string;
  partnerEntity: string;
  ringAllocations: {
    'ring-1-consulting': number;
    'ring-2-mvp': number;
    'ring-3-pilot': number;
    'ring-4-expansion': number;
  };
  currency: 'GBP' | 'USD' | 'EUR';
  unit: string;
  period: string;
  sourceLocator: string;
  approvalStatus: 'Indicative — Pending Partner Alignment' | 'Recovered from Draft Workbook' | 'Requires Partner Confirmation';
  formulaNote: string;
}

export const COSTING_RINGS: CostingRingSpec[] = [
  {
    id: 'ring-1-consulting',
    order: 1,
    code: 'PKG-01 · RING 1',
    title: 'Package 1: Discovery, CRM Audit & Governance Consulting',
    shortTitle: '01 · Consulting & Discovery',
    subtitle: 'Sequential Package 1 — Taxonomy alignment, 178-record Ukraine CRM audit, LinkedIn crosswalk & privacy baseline',
    isRepeatableCycle: false,
    deliverables: [
      'Validated ISRM Ukraine 178-record Master Register & Data Dictionary',
      'Crosswalk taxonomy between CRM sectors/roles and LinkedIn Page aggregate analytics',
      'Data controller, privacy notice, and human-review governance protocol',
      'Board decision gate package for Cohort 2 selection and survey approval',
    ],
    acceptanceCriteria: 'Signed-off Data Dictionary, Governance Protocol, and Validated Scope Baseline.',
    paymentTermNote: 'Payable on delivery/acceptance of Package 1; initial mobilisation payment from 30% of agreed total scope.',
  },
  {
    id: 'ring-2-mvp',
    order: 2,
    code: 'PKG-02 · RING 2',
    title: 'Package 2: Core Application MVP & Structural Foundation',
    shortTitle: '02 · Application MVP',
    subtitle: 'Sequential Package 2 — Non-removable structural foundation, single-screen graph workspace & verified directory',
    isRepeatableCycle: false,
    deliverables: [
      'Single-screen interactive Network & Service Graph workspace (Experts, Sectors, Territories, Clusters)',
      'Role-based access control, consent state tracking, and PII isolation',
      'Accessible Connections List text equivalent and responsive mobile drawer system',
      'Core relational schema and import pipeline for official ISRM chapter registers',
    ],
    acceptanceCriteria: 'Deployed MVP workspace passing all 15 accessibility, security, and state synchronization gates.',
    paymentTermNote: 'Payable upon delivery and formal client acceptance of the Application MVP.',
  },
  {
    id: 'ring-3-pilot',
    order: 3,
    code: 'PKG-03 · RING 3',
    title: 'Package 3: Bounded Pilot Functions & Repeatable Expert Cycle',
    shortTitle: '03 · Pilot Functions (Repeatable Cycle)',
    subtitle: 'Sequential Package 3 — Contains the closed-loop repeatable expert engagement cycle for Cohort 1 & Cohort 2',
    isRepeatableCycle: true,
    cycleDescription: 'REPEATABLE EXPERT ENGAGEMENT CYCLE: 1. Cohort Selection → 2. Consensual Verification & Survey → 3. Case Interview & Security Review → 4. Knowledge & Referral Output. Can be repeated across subsequent chapters/cohorts without rebuilding Package 1 or 2.',
    deliverables: [
      'Cohort 1 (45 verified ISRM Ukraine profiles) & Cohort 2 (Board-defined) engagement pipeline workflow',
      'Editable Application-Need Survey configuration & consensual profile update workflow',
      'Case-study interview capture, publication sensitivity gate, and F&P/ISRM referral routing',
      'Pilot evaluation report measuring repeatability and resource reduction vs. manual outreach',
    ],
    acceptanceCriteria: 'Each pilot step produces an independent, reversible deliverable; completion of Cohort 1 & 2 cycle.',
    paymentTermNote: 'Payable on delivery/acceptance of the Pilot Function package. Subsequent cohort repetitions do not require a 5th software package.',
  },
  {
    id: 'ring-4-expansion',
    order: 4,
    code: 'PKG-04 · RING 4',
    title: 'Package 4: Trust & Influence Index (TII) & Global Public Continuation',
    shortTitle: '04 · TII & Global Expansion',
    subtitle: 'Sequential Package 4 — Proposed Trust & Influence Index (TII), Verified Projects ledger & multi-chapter SaaS scale',
    isRepeatableCycle: false,
    deliverables: [
      'Trust & Influence Index (TII) evidence framework with human review and appeal path',
      'Verified Projects & Case Studies repository with international transferability tagging',
      'Global 35-Chapter federation adapters and official LinkedIn Page aggregate analytics bridge',
      'Long-term SaaS / sustainable platform retainer & automated OSINT assistant (human-gated)',
    ],
    acceptanceCriteria: 'Approved TII methodology, human-review audit log, and multi-chapter production readiness.',
    paymentTermNote: 'Payable on delivery/acceptance of selected expansion modules or structured under an agreed platform retainer.',
  },
];

export const FEATURE_MODULES: FeatureModuleDossier[] = [
  {
    id: 'mod-foundation-crm',
    title: 'Structural Foundation & Verified CRM Core',
    subtitle: 'Non-removable platform base, controlled taxonomy & single-screen graph engine',
    ringId: 'ring-1-consulting',
    ringOrder: 1,
    isFoundation: true,
    status: 'LIVE DEMO',
    description: 'Forms the mandatory technical and governance backbone of the ISRM Insight Hub. Separates raw source records from verified identities, enforces privacy and consent rules, and renders the interactive network graph.',
    communityFunctionSummary: 'Allows chapter administrators and authorised leads to explore verified members, filter by controlled sectors and territories, and inspect evidence-backed mini-dossiers without exposing raw closed-group phone data.',
    targetUsers: ['ISRM Chapter Chairs & Admins', 'Institutional Partnership Leads', 'Authorised Research Curators'],
    kpiMetrics: [
      '178 Ukraine pilot records structured with 0% unauthorized PII leakage',
      '100% separation between phone-code country and verified professional location',
      '< 3s mode comprehension and full keyboard/screen-reader parity',
    ],
    expectedResult: 'A production-grade, auditable community register and interactive graph workspace ready for immediate chapter leadership use.',
    dependencies: ['Mandatory Base — All other modules depend on this foundation'],
    exclusionImpact: 'CANNOT BE EXCLUDED: Removing the Structural Foundation disables the entire platform, database schema, authentication, and graph rendering.',
    techStackNarrative: 'Engineered on React 19 + TypeScript with a deterministic force-directed & radial SVG/Canvas graph engine, strict RBAC/consent state guards, and accessible DOM twin (Connections List).',
    techStackComponents: [
      { layer: 'Frontend & Graph Surface', spec: 'React 19, TypeScript, Tailwind CSS, Custom Radial/Network SVG Engine', validationState: 'Implemented in Prototype' },
      { layer: 'Data & Identity Schema', spec: 'Controlled 31-field CRM Schema with Identity Confidence & Sensitivity Gates', validationState: 'Implemented in Prototype' },
      { layer: 'Accessibility & Fallback', spec: 'WCAG AA Contrast, Keyboard Drawer Pinning, Textual Connections List', validationState: 'Implemented in Prototype' },
    ],
    functionIds: ['fn-identity-verification', 'fn-graph-explorer', 'fn-privacy-consent-gate'],
  },
  {
    id: 'mod-mvp-directory',
    title: 'Application MVP: Sector, Territory & Cluster Workspace',
    subtitle: 'Four upper control drawers, cluster isolation for unverified records & cohort builder',
    ringId: 'ring-2-mvp',
    ringOrder: 2,
    isFoundation: true,
    status: 'LIVE DEMO',
    description: 'Delivers the core operational workspace for working with both verified experts (45 profiles) and the 133 unverified/partial records held safely in the Cluster Layer.',
    communityFunctionSummary: 'Enables members and organisers to assemble thematic expert groups, inspect cross-sector bridges, and prepare targeted capability exchanges.',
    targetUsers: ['ISRM Global & Chapter Leadership', 'Risk & Resilience Practitioners', 'Working Group Convenors'],
    kpiMetrics: [
      '45 verified profiles mapped with public-source evidence & research questions',
      '133 unverified/partial records isolated into 3 governed research clusters',
      '8 controlled sectors and 15 territories with real-time filter counters',
    ],
    kpiMetrics_note: 'Derived directly from the 2026-08-28 ISRM Ukraine Master Register.',
    expectedResult: 'Immediate operational visibility into community composition without conflating unverified group participants with confirmed senior experts.',
    dependencies: ['mod-foundation-crm'],
    exclusionImpact: 'CANNOT BE EXCLUDED FROM MVP: Core minimum team capacity is anchored here. Disabling individual sub-functions does not proportionally reduce the core engineering team.',
    techStackNarrative: 'Implements synchronized state across the 4 upper panels (FILTERS, SECTORS, TERRITORIES, EXPERT NETWORK), dynamic cohort selection, and print/PDF scope generation.',
    techStackComponents: [
      { layer: 'State Synchronizer', spec: 'Unified Store linking Graph Nodes, Upper Drawers, Dossier & Scope Calculator', validationState: 'Implemented in Prototype' },
      { layer: 'Cluster Layer Engine', spec: 'Aggregated Node Rendering for Self-Identified (24), Partial (57) & Unidentified (38) queues', validationState: 'Implemented in Prototype' },
      { layer: 'Document Export', spec: 'Client-Safe Validated Scope & Budget Range Print/PDF Surface', validationState: 'Implemented in Prototype' },
    ],
    functionIds: ['fn-sector-territory-matrix', 'fn-cluster-queue-isolation', 'fn-cohort-group-builder'],
  },
  {
    id: 'mod-pilot-cycle',
    title: 'Bounded Pilot Engine & Repeatable Expert Engagement Cycle',
    subtitle: 'Cohort 1 & Cohort 2 workflow, editable Application-Need Survey preview & engagement pipeline',
    ringId: 'ring-3-pilot',
    ringOrder: 3,
    isFoundation: false,
    status: 'REQUIRES CONFIGURATION',
    hasRepeatableExpertCycle: true,
    description: 'Powers the bounded, reversible pilot across two expert cohorts: Cohort 1 (existing engaged ISRM Ukraine members) and Cohort 2 (to be named by the Client/Board prior to launch). Includes the repeatable 4-step expert cycle.',
    communityFunctionSummary: 'Guides selected experts through consensual profile verification, application-need survey feedback, structured case-study interviews, and institutional partnership matching.',
    targetUsers: ['Pilot Cohort 1 (Engaged Members)', 'Pilot Cohort 2 (Board-Selected Gate)', 'ISRM & Partner Delivery Team'],
    kpiMetrics: [
      '89 engagement pipeline records triaged into Client (28), Partner (17), and Connector (22) tracks',
      '100% independent acceptance gate per pilot step (reversible without invalidating prior steps)',
      'Repeatable cycle architecture ready to clone for UK, EU, or global chapters',
    ],
    expectedResult: 'Measured empirical proof of whether the platform makes expert discovery, knowledge capture, and referral orchestration more repeatable with fewer manual resources.',
    dependencies: ['mod-foundation-crm', 'mod-mvp-directory'],
    exclusionImpact: 'EXCLUDING THIS MODULE removes the Engagement Pipeline, disables the Repeatable Expert Cycle in Ring 3, and prevents structured validation of Cohort 1 and Cohort 2.',
    techStackNarrative: 'Provides a stage-gated workflow state machine, non-submitting editable survey sandbox (awaiting Board controller/privacy sign-off), and interview-to-case-study publishing controls.',
    techStackComponents: [
      { layer: 'Repeatable Cycle State Machine', spec: '4-Stage Bounded Workflow (Identify → Survey/Verify → Interview → Publish/Route)', validationState: 'Implemented in Prototype' },
      { layer: 'Survey Preview Sandbox', spec: 'Interactive Non-Submitting Preview of ISRM_Community_Member_Survey_Draft.md', validationState: 'Implemented in Prototype' },
      { layer: 'Outreach & Referral Tracker', spec: 'Consensual Warm-Intro Queue & Institutional Relevance Tagging', validationState: 'Proposed Architecture' },
    ],
    functionIds: ['fn-engagement-pipeline', 'fn-survey-preview-sandbox', 'fn-case-interview-workflow'],
  },
  {
    id: 'mod-tii-index',
    title: 'Trust & Influence Index (TII) & Verified Projects Ledger',
    subtitle: 'Proposed evidence-based methodology for objective trust verification, activity reach & verified projects',
    ringId: 'ring-4-expansion',
    ringOrder: 4,
    isFoundation: false,
    status: 'UNDER DEVELOPMENT',
    description: 'Structures objective evidence of expert trustworthiness, professional influence, and confirmed project delivery. Strictly avoids opaque automated rankings or unverified composite scores until methodology, normalization, and appeal procedures are approved.',
    communityFunctionSummary: 'Enables members to present verified credentials, peer-confirmed crisis projects, and thought-leadership reach—creating a high-trust alternative to self-reported social profiles.',
    targetUsers: ['Senior Risk Advisors & Academics', 'Institutional Buyers & Donors', 'Research & Standards Committees'],
    kpiMetrics: [
      '3 distinct evidence pillars: Trust (Verified Credentials), Influence (Normalized Reach), Projects (Confirmed Delivery)',
      'Mandatory human-review & right-of-appeal/correction workflow before any index display',
      'Zero automated access blocking or hidden black-box scoring',
    ],
    expectedResult: 'A defensible, consulting-grade Trust & Influence Index (TII) that differentiates verified operational expertise from mere media visibility.',
    dependencies: ['mod-foundation-crm', 'mod-mvp-directory', 'mod-pilot-cycle'],
    exclusionImpact: 'EXCLUDING THIS MODULE removes the Trust & Influence Index (TII), the Verified Projects ledger, and institutional credential auditing from Package 4.',
    techStackNarrative: 'Combines multi-source provenance records (source URL, verification date, evidence type, confidence level) with human-in-the-loop review queues and temporal decay normalization.',
    techStackComponents: [
      { layer: 'TII Evidence Ledger', spec: 'Cryptographically timestamped source, evidence type, confidence & reviewer sign-off', validationState: 'Proposed Architecture' },
      { layer: 'Projects & Role Matrix', spec: 'Relational mapping of Confirmed Projects, Expert Role, Period & Outcome Evidence', validationState: 'Proposed Architecture' },
      { layer: 'AI/OSINT Research Assistant', spec: 'Human-gated public source discovery & conflict-of-interest flagging', validationState: 'Requires Technical Validation' },
    ],
    functionIds: ['fn-trust-verification-ledger', 'fn-influence-reach-normalizer', 'fn-verified-projects-registry'],
  },
  {
    id: 'mod-global-integrations',
    title: 'LinkedIn Analytics Crosswalk & Global 35-Chapter Federation',
    subtitle: 'Aggregate LinkedIn Page XLS comparison, official membership import & multi-chapter scaling',
    ringId: 'ring-4-expansion',
    ringOrder: 4,
    isFoundation: false,
    status: 'REQUIRES ORDER',
    description: 'Bridges the named, verified CRM with aggregate LinkedIn Page exports (8,742 followers, 44 associated profiles) and scales the schema across ISRM’s 35 global chapters.',
    communityFunctionSummary: 'Shows leadership where community expertise is concentrated geographically and sectorally, and which case-study themes generate genuine executive engagement.',
    targetUsers: ['ISRM HQ Executive Team', 'Global Chapter Chairs (35 Chapters)', 'Editorial & Communications Leads'],
    kpiMetrics: [
      '8,742 LinkedIn Page followers compared by Country, Industry, Seniority & Job Function',
      'Cross-chapter federation ready for 35 stated global chapters',
      'Strict compliance with LinkedIn boundary (no fake follower-name scraping)',
    ],
    expectedResult: 'Unified strategic intelligence across internal membership registers and external public audience analytics.',
    dependencies: ['mod-foundation-crm', 'mod-mvp-directory'],
    exclusionImpact: 'EXCLUDING THIS MODULE restricts the platform to a single-chapter register without LinkedIn audience comparison or multi-chapter federation.',
    techStackNarrative: 'Uses official LinkedIn Page Admin XLS export parsers, controlled taxonomy crosswalk tables, and multi-tenant chapter data isolation.',
    techStackComponents: [
      { layer: 'LinkedIn XLS Analytics Parser', spec: 'Ingests official Follower, Visitor & Content aggregate XLS exports', validationState: 'Integration Candidate' },
      { layer: 'Taxonomy Crosswalk Engine', spec: 'Maps CRM Sectors/Roles to LinkedIn Industries, Seniority & Job Functions', validationState: 'Implemented in Prototype' },
      { layer: 'Multi-Chapter Federation', spec: 'Chapter-level tenant boundaries with global HQ executive roll-up', validationState: 'Proposed Architecture' },
    ],
    functionIds: ['fn-linkedin-aggregate-bridge', 'fn-global-chapter-federation'],
  },
];

export const PLATFORM_FUNCTIONS: PlatformFunctionItem[] = [
  {
    id: 'fn-identity-verification',
    title: 'Multi-Tier Identity & Confidence Ledger',
    communityPerspective: 'Distinguishes Confirmed (45), Self-Identified (24), Probable (7), Partial (57) & Unidentified (38) records.',
    moduleId: 'mod-foundation-crm',
    ringId: 'ring-1-consulting',
    isFoundation: true,
    status: 'LIVE DEMO',
    baseHoursLean: 45,
    baseHoursExpanded: 70,
    techStack: ['TypeScript Strict Schema', 'Provenance Audit Trail', 'Human Review Gate'],
    excludedLossWarning: 'Core Foundation: Cannot disable identity status separation without violating data governance rules.',
    matchingSectors: ['Security / risk / resilience', 'Legal / governance / institutions', 'Business / advisory', 'Humanitarian / NGO', 'Academia / research'],
    permittedExpertCount: 45,
    evidenceBasis: '45 verified identities in ISRM Ukraine Master Register (2026-08-28).',
  },
  {
    id: 'fn-graph-explorer',
    title: 'Single-Screen Multi-Layer Network Graph',
    communityPerspective: 'Interactive exploration of experts, sectors, territories, and service dependencies with textual Connections List.',
    moduleId: 'mod-foundation-crm',
    ringId: 'ring-2-mvp',
    isFoundation: true,
    status: 'LIVE DEMO',
    baseHoursLean: 80,
    baseHoursExpanded: 120,
    techStack: ['SVG/Canvas Radial & Force Layout', 'WCAG AA Accessible DOM Twin', 'Preview/Pin Drawer Mechanics'],
    excludedLossWarning: 'Core Foundation: Disabling removes visual network discovery and dependency projection.',
    matchingSectors: ['Security / risk / resilience', 'Business / advisory', 'Humanitarian / NGO', 'Academia / research', 'Energy / infrastructure / logistics', 'Legal / governance / institutions', 'Media / communications', 'Technology / cyber'],
    permittedExpertCount: 83,
    evidenceBasis: '83 usable named profiles in ISRM Ukraine Master Register (2026-08-28).',
  },
  {
    id: 'fn-privacy-consent-gate',
    title: 'Closed-Group Privacy & Consent Controller',
    communityPerspective: 'Protects WhatsApp phone records as internal-only until explicit contact/publication consent is recorded.',
    moduleId: 'mod-foundation-crm',
    ringId: 'ring-1-consulting',
    isFoundation: true,
    status: 'LIVE DEMO',
    baseHoursLean: 40,
    baseHoursExpanded: 65,
    techStack: ['RBAC Policy Engine', 'PII Field Masking', 'Publication Sensitivity Flagging'],
    excludedLossWarning: 'Core Foundation: Required by GDPR/UK GDPR and wartime operational security constraints.',
    matchingSectors: ['Legal / governance / institutions', 'Security / risk / resilience', 'Humanitarian / NGO'],
    permittedExpertCount: 45,
    evidenceBasis: 'Applies to all 178 records; 45 verified profiles currently marked Internal Research Only.',
  },
  {
    id: 'fn-sector-territory-matrix',
    title: 'Controlled Sector & Territory Crosswalk Filters',
    communityPerspective: '4 upper workspace panels (FILTERS, SECTORS, TERRITORIES, EXPERT NETWORK) with live counts & reset.',
    moduleId: 'mod-mvp-directory',
    ringId: 'ring-2-mvp',
    isFoundation: true,
    status: 'LIVE DEMO',
    baseHoursLean: 55,
    baseHoursExpanded: 85,
    techStack: ['Reactive Filter Reducers', 'Country vs. Phone-Code Separation', '8 Controlled Sector Taxonomy'],
    excludedLossWarning: 'MVP Core: Disabling removes multi-dimensional filtering across sectors and territories.',
    matchingSectors: ['Security / risk / resilience', 'Business / advisory', 'Humanitarian / NGO', 'Academia / research', 'Energy / infrastructure / logistics', 'Legal / governance / institutions', 'Media / communications', 'Technology / cyber'],
    permittedExpertCount: 77,
    evidenceBasis: '77 records with known organisations mapped across 8 controlled sectors (2026-08-28).',
  },
  {
    id: 'fn-cluster-queue-isolation',
    title: 'Unverified & Partial Profile Cluster Layer',
    communityPerspective: 'Isolates 133 unverified/partial records into governed research clusters instead of cluttering the verified graph.',
    moduleId: 'mod-mvp-directory',
    ringId: 'ring-2-mvp',
    isFoundation: true,
    status: 'LIVE DEMO',
    baseHoursLean: 35,
    baseHoursExpanded: 55,
    techStack: ['Cluster Node Aggregation', 'Research Queue Triage', 'Consensual Verification Workflow'],
    excludedLossWarning: 'MVP Core: Without cluster isolation, 133 unverified records either pollute the expert graph or are lost.',
    matchingSectors: ['To classify', 'Security / risk / resilience', 'Business / advisory', 'Humanitarian / NGO'],
    permittedExpertCount: 45,
    evidenceBasis: 'Separates 45 verified profiles from 133 research-queue records (57 partial, 38 unidentified, 24 self-identified, 14 probable).',
  },
  {
    id: 'fn-cohort-group-builder',
    title: 'Working Group & Pilot Cohort Builder',
    communityPerspective: 'Selects and pins specific experts into a working group for capability exchange or pilot projection.',
    moduleId: 'mod-mvp-directory',
    ringId: 'ring-2-mvp',
    isFoundation: true,
    status: 'LIVE DEMO',
    baseHoursLean: 40,
    baseHoursExpanded: 60,
    techStack: ['Shared Selection State', 'Mini-Dossier Inspector', 'Cross-Mode Cohort Persistence'],
    excludedLossWarning: 'MVP Core: Required to retain selected experts when switching between NETWORK, CONFIGURATOR, and DEPENDENCIES.',
    matchingSectors: ['Security / risk / resilience', 'Business / advisory', 'Humanitarian / NGO', 'Academia / research', 'Legal / governance / institutions'],
    permittedExpertCount: 45,
    evidenceBasis: '45 high-priority records identified for immediate cohort assembly.',
  },
  {
    id: 'fn-engagement-pipeline',
    title: 'Dual-Track Engagement & Referral Pipeline',
    communityPerspective: 'Coordinates warm introductions across 28 Potential Clients, 17 Institutional Partners & 22 Connectors.',
    moduleId: 'mod-pilot-cycle',
    ringId: 'ring-3-pilot',
    isFoundation: false,
    status: 'REQUIRES CONFIGURATION',
    baseHoursLean: 65,
    baseHoursExpanded: 105,
    techStack: ['Stage-Gated CRM Pipeline', 'Accountable Owner Assignment', 'Warm-Intro Protocol'],
    excludedLossWarning: 'Disabling removes structured tracking of the 89 engagement pipeline records and F&P/ISRM joint opportunities.',
    matchingSectors: ['Security / risk / resilience', 'Business / advisory', 'Humanitarian / NGO', 'Energy / infrastructure / logistics', 'Legal / governance / institutions'],
    permittedExpertCount: 89,
    evidenceBasis: '89 records in the ISRM Ukraine Engagement Pipeline (28 potential clients, 17 partners, 22 connectors, 22 verify).',
  },
  {
    id: 'fn-survey-preview-sandbox',
    title: 'Editable Application-Need Survey & Board Gate',
    communityPerspective: 'Interactive preview of the member survey to validate platform demand before Board-approved distribution.',
    moduleId: 'mod-pilot-cycle',
    ringId: 'ring-3-pilot',
    isFoundation: false,
    status: 'LIVE DEMO',
    baseHoursLean: 45,
    baseHoursExpanded: 70,
    techStack: ['Editable Survey Question Editor', 'Board Gate Lock (Non-Submitting Preview)', 'Cohort 1 & 2 Targeting'],
    excludedLossWarning: 'Disabling removes the instrument for capturing member workflow priorities and consent during the Pilot.',
    matchingSectors: ['Security / risk / resilience', 'Humanitarian / NGO', 'Academia / research', 'Business / advisory'],
    permittedExpertCount: null, // Explicitly null: survey has not been distributed yet, so 0/null responses exist!
    evidenceBasis: 'Draft ready (ISRM_Community_Member_Survey_Draft.md); 0 responses collected pending Board approval gate.',
  },
  {
    id: 'fn-case-interview-workflow',
    title: 'Wartime Case-Study & Knowledge Capture Workflow',
    communityPerspective: 'Converts verified practitioner lessons into structured case studies with security review and consent.',
    moduleId: 'mod-pilot-cycle',
    ringId: 'ring-3-pilot',
    isFoundation: false,
    status: 'REQUIRES CONFIGURATION',
    baseHoursLean: 60,
    baseHoursExpanded: 95,
    techStack: ['Research Question Prompting', 'Operational Security Review Gate', 'International Transferability Tagging'],
    excludedLossWarning: 'Disabling prevents systematic capture of post-2022 Ukrainian resilience lessons for global ISRM programmes.',
    matchingSectors: ['Security / risk / resilience', 'Humanitarian / NGO', 'Academia / research', 'Energy / infrastructure / logistics', 'Media / communications'],
    permittedExpertCount: 45,
    evidenceBasis: '45 verified profiles researched with specific priority interview questions and case-study themes.',
  },
  {
    id: 'fn-trust-verification-ledger',
    title: 'TII Pillar 1: Objective Trust & Credential Verification',
    communityPerspective: 'Records verifiable evidence basis, source URL, date, confidence level, and human-review status.',
    moduleId: 'mod-tii-index',
    ringId: 'ring-4-expansion',
    isFoundation: false,
    status: 'UNDER DEVELOPMENT',
    baseHoursLean: 75,
    baseHoursExpanded: 120,
    techStack: ['Evidence Provenance Store', 'Human Reviewer Sign-Off', 'Appeal & Correction Workflow'],
    excludedLossWarning: 'Disabling removes the Trust pillar of the Trust & Influence Index (TII) and disables entire TII module.',
    matchingSectors: ['Security / risk / resilience', 'Legal / governance / institutions', 'Academia / research', 'Business / advisory'],
    permittedExpertCount: 45,
    evidenceBasis: '45 profiles have initial public-source evidence mapped; formal TII methodology under development.',
  },
  {
    id: 'fn-influence-reach-normalizer',
    title: 'TII Pillar 2: Activity, Publications & Normalized Reach',
    communityPerspective: 'Evaluates peer-recognized publications, keynote contributions, and network centrality without vanity bias.',
    moduleId: 'mod-tii-index',
    ringId: 'ring-4-expansion',
    isFoundation: false,
    status: 'UNDER DEVELOPMENT',
    baseHoursLean: 85,
    baseHoursExpanded: 135,
    techStack: ['Citation & Keynote Registry', 'Sector/Period Normalization', 'Anti-Vanity Weighting'],
    excludedLossWarning: 'Disabling removes the Influence pillar of the Trust & Influence Index (TII) and disables entire TII module.',
    matchingSectors: ['Academia / research', 'Media / communications', 'Security / risk / resilience', 'Legal / governance / institutions'],
    permittedExpertCount: null, // Methodology pending validation
    evidenceBasis: 'Methodology under development; requires Board approval of normalization rules before scoring.',
  },
  {
    id: 'fn-verified-projects-registry',
    title: 'TII Pillar 3: Confirmed Projects & Role Registry',
    communityPerspective: 'Links experts to confirmed crisis/reconstruction projects, their specific role, period, and outcome.',
    moduleId: 'mod-tii-index',
    ringId: 'ring-4-expansion',
    isFoundation: false,
    status: 'UNDER DEVELOPMENT',
    baseHoursLean: 70,
    baseHoursExpanded: 110,
    techStack: ['Relational Project-Expert Graph', 'Multi-Party Confirmation', 'Security-Sensitive Redaction'],
    excludedLossWarning: 'Disabling removes the Verified Projects pillar and disables the complete Trust & Influence Index (TII) module.',
    matchingSectors: ['Energy / infrastructure / logistics', 'Humanitarian / NGO', 'Security / risk / resilience', 'Business / advisory'],
    permittedExpertCount: null, // Project-level consent not yet requested
    evidenceBasis: 'Public project clues identified for 28 records; interview & publication consent not yet requested.',
  },
  {
    id: 'fn-linkedin-aggregate-bridge',
    title: 'LinkedIn Page Aggregate Analytics Crosswalk',
    communityPerspective: 'Compares verified chapter profiles against ISRM’s 8,742 LinkedIn followers via official XLS admin exports.',
    moduleId: 'mod-global-integrations',
    ringId: 'ring-4-expansion',
    isFoundation: false,
    status: 'REQUIRES ORDER',
    baseHoursLean: 50,
    baseHoursExpanded: 80,
    techStack: ['Official LinkedIn XLS Parser', 'Demographic Crosswalk Matrix', 'Content Theme Performance Tracker'],
    excludedLossWarning: 'Disabling removes external audience benchmarking against the 8,742 LinkedIn Page follower base.',
    matchingSectors: ['Security / risk / resilience', 'Business / advisory', 'Academia / research', 'Media / communications'],
    permittedExpertCount: 18,
    evidenceBasis: '18 direct LinkedIn URLs linked in Ukraine pilot; 8,742 aggregate Page followers in 2026-08-28 snapshot.',
  },
  {
    id: 'fn-global-chapter-federation',
    title: 'Global 35-Chapter Multi-Tenant Federation',
    communityPerspective: 'Scales the Ukraine CRM pilot architecture across ISRM’s 35 global chapters and official membership register.',
    moduleId: 'mod-global-integrations',
    ringId: 'ring-4-expansion',
    isFoundation: false,
    status: 'REQUIRES ORDER',
    baseHoursLean: 95,
    baseHoursExpanded: 150,
    techStack: ['Multi-Chapter Tenant Isolation', 'Global Taxonomy Harmonizer', 'HQ Executive Roll-Up Dashboard'],
    excludedLossWarning: 'Disabling restricts the deployment to a single chapter without global cross-chapter search.',
    matchingSectors: ['Security / risk / resilience', 'Business / advisory', 'Humanitarian / NGO', 'Academia / research', 'Legal / governance / institutions', 'Energy / infrastructure / logistics'],
    permittedExpertCount: 44,
    evidenceBasis: '35 Global Chapters stated & 44 associated profiles on ISRM public LinkedIn snapshot (2026-08-28).',
  },
];

export const RELATIONSHIP_MODELS: {
  id: RelationshipModelId;
  code: string;
  title: string;
  subtitle: string;
  ownershipAndIp: string;
  componentReuse: string;
  supportAndOperations: string;
  governanceModel: string;
  commercialImpactNote: string;
  leanMultiplier: number;
  expandedMultiplier: number;
  retainerMonthlyRange: string;
}[] = [
  {
    id: 'community-product',
    code: 'MODEL A · BESPOKE DEDICATED',
    title: 'A. Product for This Community (Dedicated Custom Build)',
    subtitle: 'Maximum customization for ISRM with dedicated IP handover and restricted component reuse',
    ownershipAndIp: 'Full bespoke codebase handover to client upon final package acceptance; custom schemas Exclusive to ISRM.',
    componentReuse: 'Restricted reuse of custom domain workflows; higher initial engineering load absorbed by single commissioning entity.',
    supportAndOperations: 'One-time sequential package delivery + separate optional post-launch SLA support agreement.',
    governanceModel: 'Client-led steering committee; formal change-control required for any post-scope additions.',
    commercialImpactNote: 'Carries full baseline engineering and customisation load (+15% dedicated IP & handover premium).',
    leanMultiplier: 1.15,
    expandedMultiplier: 1.2,
    retainerMonthlyRange: '£1,800 – £3,200 / mo (Optional SLA Support)',
  },
  {
    id: 'founding-partner',
    code: 'MODEL B · FOUNDING PARTNER / SHARED',
    title: 'B. Founding Partner / Shared Development Model',
    subtitle: 'Joint validation of the first cycle (ISRM Ukraine + F&P); reusable core architecture with shared governance',
    ownershipAndIp: 'ISRM owns all community data, registers, and brand assets; platform core engine remains reusable by delivery partners.',
    componentReuse: 'Reusable graph and CRM foundation reduces initial fixed-team overhead while preserving full pilot customisation.',
    supportAndOperations: 'Joint operational validation during Package 3 Pilot; shared iterative refinement.',
    governanceModel: 'Joint Partner–Client Pilot Board (ISRM + Frishberg & Partners + Technical Lead) with step-by-step acceptance gates.',
    commercialImpactNote: 'Optimises upfront capital commitment (baseline 1.0x delivery corridor) by sharing core architectural reusability.',
    leanMultiplier: 1.0,
    expandedMultiplier: 1.0,
    retainerMonthlyRange: '£1,200 – £2,400 / mo (Shared Operations & Hosting)',
  },
  {
    id: 'platform-service',
    code: 'MODEL C · MANAGED PLATFORM SERVICE',
    title: 'C. Platform Service / Sustainable Development',
    subtitle: 'Lower initial barrier with continuous managed platform retainer, modular upgrades & long-term roadmap',
    ownershipAndIp: 'Client retains 100% ownership and export rights over all CRM and knowledge data; software licensed as managed platform.',
    componentReuse: 'Standardised core modules with configurable chapter adapters.',
    supportAndOperations: 'Continuous managed hosting, security patching, human-gated OSINT tooling, and quarterly feature releases included in retainer.',
    governanceModel: 'Service-level governance with quarterly roadmap prioritisation and bounded pilot checkpoints.',
    commercialImpactNote: 'Reduces initial package build fee (-12% upfront build adjustment) paired with a structured monthly platform & operations retainer.',
    leanMultiplier: 0.88,
    expandedMultiplier: 0.9,
    retainerMonthlyRange: '£2,500 – £4,500 / mo (Managed Platform & Continuous Evolution)',
  },
];

export const INITIAL_PARTNER_FEE_INPUTS: PartnerRoleFeeInput[] = [
  {
    id: 'pf-arch-lead',
    roleTitle: 'Product Architecture, Graph Engine & Technical Lead',
    partnerEntity: 'Core Platform Engineering Partner',
    ringAllocations: {
      'ring-1-consulting': 4200,
      'ring-2-mvp': 14800,
      'ring-3-pilot': 8600,
      'ring-4-expansion': 16400,
    },
    currency: 'GBP',
    unit: 'Sequential Package Allocation',
    period: 'Packages 1–4 Delivery Cycle (2026–2027)',
    sourceLocator: 'ISRM Service Deck & Non-Linear Minimum Team Capacity Model (v1.3)',
    approvalStatus: 'Indicative — Pending Partner Alignment',
    formulaNote: 'Covers non-linear core engineering team floor (cannot be proportionally reduced by single checkbox removal) + variable feature effort.',
  },
  {
    id: 'pf-research-crm',
    roleTitle: 'CRM Research, Taxonomy Crosswalk & TII Methodology Lead',
    partnerEntity: 'Analytical & OSINT Governance Partner',
    ringAllocations: {
      'ring-1-consulting': 3800,
      'ring-2-mvp': 3200,
      'ring-3-pilot': 6400,
      'ring-4-expansion': 7800,
    },
    currency: 'GBP',
    unit: 'Sequential Package Allocation',
    period: 'Packages 1–4 Delivery Cycle (2026–2027)',
    sourceLocator: 'ISRM Ukraine 178-Record Audit & TII Specification',
    approvalStatus: 'Indicative — Pending Partner Alignment',
    formulaNote: 'Covers 178-record taxonomy verification, LinkedIn crosswalk design, Cohort 1/2 survey analysis, and TII human-review rules.',
  },
  {
    id: 'pf-legal-governance',
    roleTitle: 'Legal, Institutional Governance, Privacy & Partner Liaison',
    partnerEntity: 'Frishberg & Partners (F&P) / Legal Governance Track',
    ringAllocations: {
      'ring-1-consulting': 2500,
      'ring-2-mvp': 1800,
      'ring-3-pilot': 4500,
      'ring-4-expansion': 3600,
    },
    currency: 'GBP',
    unit: 'Sequential Package Allocation',
    period: 'Packages 1–4 Delivery Cycle (2026–2027)',
    sourceLocator: 'ISRM_Partner_Work_Proposal_Draft & GDPR/Wartime Sensitivity Gate',
    approvalStatus: 'Requires Partner Confirmation',
    formulaNote: 'Covers data-controller governance, privacy notices, publication consent protocols, and institutional partner introductions.',
  },
];

export interface SurveyQuestionDraft {
  id: string;
  section: string;
  questionText: string;
  questionType: 'single-choice' | 'multi-choice' | 'open-text' | 'consent-gate';
  options?: string[];
  purposeNote: string;
  editableByClient: boolean;
}

export const INITIAL_SURVEY_DRAFT_QUESTIONS: SurveyQuestionDraft[] = [
  {
    id: 'sq-01',
    section: '1. Role & Operational Context',
    questionText: 'Which controlled sector best describes your primary professional activity in or connected to Ukraine?',
    questionType: 'single-choice',
    options: [
      'Security / risk / resilience',
      'Humanitarian / NGO',
      'Business / advisory',
      'Energy / infrastructure / logistics',
      'Legal / governance / institutions',
      'Academia / research',
      'Media / communications',
      'Technology / cyber',
    ],
    purposeNote: 'Aligns member self-identification with the 8 controlled CRM sectors and LinkedIn industry crosswalk.',
    editableByClient: true,
  },
  {
    id: 'sq-02',
    section: '2. Platform & Workflow Priorities (Service Deck Validation)',
    questionText: 'Which platform capabilities would provide the highest practical value to your work over the next 6 months? (Select up to 3)',
    questionType: 'multi-choice',
    options: [
      'Verified peer directory with filterable sector and regional expertise',
      'Warm, consensual introductions for project partnerships, legal/compliance support, or consortium bids',
      'Structured Ukraine wartime case studies and transferable resilience lessons',
      'Trust & Influence Index (TII) profile showcasing verified projects and publications',
      'Thematic roundtables, tabletop exercises, and Young Professionals mentoring',
    ],
    purposeNote: 'Directly measures demand for the Service Deck functions prior to Package 4 expansion.',
    editableByClient: true,
  },
  {
    id: 'sq-03',
    section: '3. Knowledge Capture & Case Contribution',
    questionText: 'What is the single most important operational or strategic risk lesson your organisation has learned since 2022 that international peers still misunderstand?',
    questionType: 'open-text',
    purposeNote: 'Seeds the Expertise & Knowledge Map case-study pipeline (subject to human security review).',
    editableByClient: true,
  },
  {
    id: 'sq-04',
    section: '4. Explicit Consent & Visibility Boundary (Mandatory Gate)',
    questionText: 'How may ISRM Ukraine and the authorised project team use the professional profile information you confirm in this form?',
    questionType: 'consent-gate',
    options: [
      'Internal ISRM chapter coordination and research only (no public profile display)',
      'Internal coordination + consensual warm introductions to vetted partners/peers',
      'Approved for inclusion in the verified ISRM Insight Hub directory (subject to final text sign-off before any case publication)',
    ],
    purposeNote: 'Transforms records from "Not recorded — internal CRM only" to explicit, auditable permission states.',
    editableByClient: true,
  },
];

export interface NonLinearCalculationResult {
  relationshipModel: typeof RELATIONSHIP_MODELS[0];
  ringTotals: {
    ringId: CostingRingId;
    leanAmount: number;
    expandedAmount: number;
    partnerAllocatedBase: number;
    fixedTeamFloorApplied: boolean;
    includedFunctionsCount: number;
    totalFunctionsInRing: number;
    formulaExplanation: string;
  }[];
  mvpBaselineLean: number;
  mvpBaselineExpanded: number;
  totalConfiguredLean: number;
  totalConfiguredExpanded: number;
  mobilisationMinimumLean: number;
  mobilisationMinimumExpanded: number;
}

/**
 * Non-linear resource & pricing calculator:
 * - Incorporates Partner Role Fee Inputs (when updated in Partner path, immediately updates Client-safe aggregates).
 * - Enforces Minimum Team Capacity Floor: removing a single optional function does not linearly slash core engineering capacity.
 * - Structural Foundation (Ring 1 & Ring 2 core) cannot be zeroed out.
 */
export function calculateNonLinearScope(
  enabledFunctionIds: string[],
  partnerFees: PartnerRoleFeeInput[],
  relationshipModelId: RelationshipModelId,
  budgetCeilingInput: number | null
): NonLinearCalculationResult {
  const relModel = RELATIONSHIP_MODELS.find((r) => r.id === relationshipModelId) || RELATIONSHIP_MODELS[1];

  const ringTotals = COSTING_RINGS.map((ring) => {
    const ringFunctions = PLATFORM_FUNCTIONS.filter((f) => f.ringId === ring.id);
    const activeRingFunctions = ringFunctions.filter((f) => f.isFoundation || enabledFunctionIds.includes(f.id));

    // Sum partner baseline allocations for this ring
    const partnerAllocatedBase = partnerFees.reduce(
      (sum, pf) => sum + (pf.ringAllocations[ring.id] || 0),
      0
    );

    const totalPossibleLeanHours = ringFunctions.reduce((s, f) => s + f.baseHoursLean, 0) || 1;
    const activeLeanHours = activeRingFunctions.reduce((s, f) => s + f.baseHoursLean, 0);
    const rawRatio = activeLeanHours / totalPossibleLeanHours;

    // Non-linear team capacity law:
    // If any function in a ring is active, a minimum 55% team mobilisation floor applies for that package,
    // plus 45% variable scaling. For Rings 1 & 2 (Foundation/MVP), 100% is locked.
    let effectiveRatio = 0;
    let fixedTeamFloorApplied = false;

    if (ring.id === 'ring-1-consulting' || ring.id === 'ring-2-mvp') {
      effectiveRatio = 1.0;
      fixedTeamFloorApplied = true;
    } else if (activeRingFunctions.length > 0) {
      effectiveRatio = 0.55 + 0.45 * rawRatio;
      fixedTeamFloorApplied = rawRatio < 1.0;
    } else {
      effectiveRatio = 0;
    }

    const leanAmount = Math.round(partnerAllocatedBase * effectiveRatio * relModel.leanMultiplier);
    // Expanded / US-comparable delivery corridor reflects broader service reserve, compliance & dedicated redundancy (~1.65x lean)
    const expandedAmount = Math.round(partnerAllocatedBase * effectiveRatio * 1.65 * relModel.expandedMultiplier);

    const formulaExplanation =
      ring.id === 'ring-1-consulting' || ring.id === 'ring-2-mvp'
        ? `Fixed Foundation Floor (100% core capacity) × ${relModel.code} multiplier (${relModel.leanMultiplier.toFixed(2)}x)`
        : activeRingFunctions.length === 0
        ? `Package excluded (0 active functions)`
        : `Non-Linear Team Capacity: [55% Minimum Core Team Floor + 45% × (${activeLeanHours}h / ${totalPossibleLeanHours}h variable effort)] × ${relModel.leanMultiplier.toFixed(2)}x`;

    return {
      ringId: ring.id,
      leanAmount,
      expandedAmount,
      partnerAllocatedBase,
      fixedTeamFloorApplied,
      includedFunctionsCount: activeRingFunctions.length,
      totalFunctionsInRing: ringFunctions.length,
      formulaExplanation,
    };
  });

  const mvpBaselineLean =
    (ringTotals.find((r) => r.ringId === 'ring-1-consulting')?.leanAmount || 0) +
    (ringTotals.find((r) => r.ringId === 'ring-2-mvp')?.leanAmount || 0);

  const mvpBaselineExpanded =
    (ringTotals.find((r) => r.ringId === 'ring-1-consulting')?.expandedAmount || 0) +
    (ringTotals.find((r) => r.ringId === 'ring-2-mvp')?.expandedAmount || 0);

  const totalConfiguredLean = ringTotals.reduce((s, r) => s + r.leanAmount, 0);
  const totalConfiguredExpanded = ringTotals.reduce((s, r) => s + r.expandedAmount, 0);

  return {
    relationshipModel: relModel,
    ringTotals,
    mvpBaselineLean,
    mvpBaselineExpanded,
    totalConfiguredLean,
    totalConfiguredExpanded,
    mobilisationMinimumLean: Math.round(totalConfiguredLean * 0.3),
    mobilisationMinimumExpanded: Math.round(totalConfiguredExpanded * 0.3),
  };
}
