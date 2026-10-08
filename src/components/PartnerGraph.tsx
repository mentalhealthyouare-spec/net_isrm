import React from 'react';
import { NetworkGraph, NetworkGraphProps } from './NetworkGraph';

export const PartnerGraph: React.FC<Omit<NetworkGraphProps, 'journeyType'>> = (props) => {
  return <NetworkGraph {...props} journeyType="partner" />;
};
