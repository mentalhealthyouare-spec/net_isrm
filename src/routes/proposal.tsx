import React from 'react';
import { PartnerProposal } from '../components/PartnerProposal';
import { NetworkGraph } from '../components/NetworkGraph';
import {
  RelationshipModelId,
  PartnerRoleFeeInput,
  NonLinearCalculationResult,
  CostingRingId,
} from '../lib/proposal-data';

export interface JourneyRouteProps {
  step: 'description' | 'calculations' | 'workspace';
  onSetStep: (step: 'description' | 'calculations' | 'workspace') => void;
  relationshipModelId: RelationshipModelId;
  onSelectRelationshipModel: (id: RelationshipModelId) => void;
  partnerFees: PartnerRoleFeeInput[];
  onUpdatePartnerFee: (roleId: string, ringId: CostingRingId, value: number) => void;
  enabledFunctionIds: string[];
  confirmedModuleIds: string[];
  techConfirmedModuleIds: string[];
  onToggleFunction: (fnId: string) => void;
  onConfirmModule: (moduleId: string) => void;
  onRejectModule: (moduleId: string) => void;
  onConfirmTechStack: (moduleId: string) => void;
  calculation: NonLinearCalculationResult;
  budgetCeiling: number | null;
  onUpdateBudgetCeiling: (val: number | null) => void;
}

export const ClientProposalRoute: React.FC<JourneyRouteProps> = (props) => {
  if (props.step === 'workspace') {
    return (
      <NetworkGraph
        journeyType="client"
        enabledFunctionIds={props.enabledFunctionIds}
        confirmedModuleIds={props.confirmedModuleIds}
        techConfirmedModuleIds={props.techConfirmedModuleIds}
        calculation={props.calculation}
        budgetCeiling={props.budgetCeiling}
        onToggleFunction={props.onToggleFunction}
        onConfirmModule={props.onConfirmModule}
        onRejectModule={props.onRejectModule}
        onConfirmTechStack={props.onConfirmTechStack}
        onNavigateBackToDescription={() => props.onSetStep('description')}
        onNavigateBackToCalculations={() => props.onSetStep('calculations')}
      />
    );
  }

  return (
    <PartnerProposal
      journeyType="client"
      step={props.step}
      onSetStep={props.onSetStep}
      relationshipModelId={props.relationshipModelId}
      onSelectRelationshipModel={props.onSelectRelationshipModel}
      partnerFees={props.partnerFees}
      onUpdatePartnerFee={props.onUpdatePartnerFee}
      enabledFunctionIds={props.enabledFunctionIds}
      onToggleFunction={props.onToggleFunction}
      calculation={props.calculation}
      budgetCeiling={props.budgetCeiling}
      onUpdateBudgetCeiling={props.onUpdateBudgetCeiling}
    />
  );
};
