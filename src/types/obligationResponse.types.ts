import { ClauseDefinition } from '../models/interfaces/clauseDefinition';

export interface ObligationResponse extends ClauseDefinition {
  contractId: string;
  partyId: string;
  contractDetails: {
    id: string;
    label: string;
    summary: string;
  };
  partyDetails: {
    id: string;
    name: string;
  } | null;
}
