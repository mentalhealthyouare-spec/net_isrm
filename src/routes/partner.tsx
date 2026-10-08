import React from 'react';
import { PartnerProposal } from '../components/PartnerProposal';
import { PartnerGraph } from '../components/PartnerGraph';
import { JourneyRouteProps } from './proposal';

export const PartnerJourneyRoute: React.FC<JourneyRouteProps> = (props) => {
  if (props.step === 'workspace') {
    return (
      <PartnerGraph
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
      journeyType="partner"
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
