import { Clause } from '../models/interfaces/clause';

export interface ObligationResponse extends Clause {
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
