import { ContractObligation } from '../models/interfaces/contract';

export interface ObligationResponse extends ContractObligation {
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
