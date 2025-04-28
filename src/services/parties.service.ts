import { ContractObligation } from '../models/interfaces/contract';
import { Contract } from '../models/interfaces/contract';
import { MongooseModel } from '../models/interfaces/document';
import { Party } from '../models/interfaces/party';
import {
  PartyRepository,
  contractRepository as _contractRepository,
  partyRepository,
} from '../repositories';
import { ObligationResponse } from '../types/obligationResponse.types';
import { BaseService } from './base.service';

export class PartyService extends BaseService<MongooseModel<Party>> {
  constructor(repository: PartyRepository) {
    super(repository, 'party');
  }

  async findByName(name: string): Promise<Party[]> {
    const repository = this.repository as PartyRepository;
    return await repository.findByName(name);
  }

  async getAllContractsForParty(partyId: string): Promise<Contract[]> {
    const contractRepository = _contractRepository;
    return await contractRepository.find({
      filter: {
        parties: { $in: [partyId] },
      },
    });
  }

  /**
   * Get all obligations for a party
   * @returns All obligations for a party
   *
   * 1. Get all contracts for a party
   * 2. Get all obligations for each contract
   * 3. Flatten the obligations into a single array, removing duplicates, and adding the contract id, contract details, and party id to each obligation
   * 4. Return the obligations
   */
  async getAllObligationsForParty(
    partyId: string,
  ): Promise<ObligationResponse[]> {
    const party = await this.findById(partyId);

    if (!party) {
      throw new Error('Party not found');
    }

    const obligationsSet = new Set<ObligationResponse>();
    const contracts = await this.getAllContractsForParty(partyId);

    contracts.forEach((contract: Contract) => {
      const obligations = contract.obligations ?? {};
      Object.values(obligations).forEach((obligation: ContractObligation) => {
        const contractSummary = {
          id: contract.id?.toString() ?? '',
          label: contract.label,
          summary: contract.summary ?? 'No summary available',
        };
        const o = {
          ...obligation,
          contractId: contract.id?.toString() ?? '',
          contractDetails: contractSummary,
          partyId: partyId,
          partyDetails: {
            id: party.id,
            name: party.name,
          },
        };
        obligationsSet.add(o);
      });
    });

    return Array.from(obligationsSet);
  }
}

export const partyService = new PartyService(partyRepository);
