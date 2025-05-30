import { Model } from 'mongoose';

import commonClauses from '../../static/key-terms-common.json';
// Remove _* prefix when ready
import dpaClauses from '../../static/key-terms-dpa.json';
import msaClauses from '../../static/key-terms-msa.json';
import _ndaClauses from '../../static/key-terms-nda.json';
import { QUERY_CONFIG } from '../config/api.config';
import { findAllOptions } from '../interfaces/repository.interface';
import { mongoService } from '../lib/mongo';
import ClauseDefinitionModel from '../models/clauseDefinitions.model';
import { ClauseDefinition } from '../models/interfaces/clauseDefinition';
import { MongooseModel } from '../models/interfaces/document.interface';
import { contractTypeService } from '../services/contractTypes.service';
import { BaseRepository } from './base.repository';

// Helper functions
function isClauseForContractType(
  clause: ClauseDefinition,
  contractTypeId: string,
) {
  return (
    !clause.contractTypes ||
    clause.contractTypes?.some(ctId => ctId.toString() === contractTypeId)
  );
}

export class ClauseDefinitionRepository extends BaseRepository<
  MongooseModel<ClauseDefinition>
> {
  constructor(model: Model<MongooseModel<ClauseDefinition>>) {
    super(model);
  }

  async initialize() {
    const allContractTypes = await contractTypeService.findAll({});
    const allContractTypeIds = allContractTypes.map(ct => ct.id);

    //1. Add all contract types to all common clauses
    // If no contract types are specified, add to all contract types
    const _commonClauses: ClauseDefinition[] = commonClauses.map(clause => {
      return {
        contractTypes: allContractTypeIds,
        ...clause,
      };
    });

    //1b. Add correct contract type to each clause
    const _msaClauses: ClauseDefinition[] = msaClauses.map(clause => {
      return {
        ...clause,
        contractTypes: allContractTypes
          .filter(ct => ct.shortName.toLowerCase() === 'msa')
          .map(ct => ct.id),
      };
    });

    const _dpaClauses: ClauseDefinition[] = dpaClauses.map(clause => {
      return {
        ...clause,
        contractTypes: allContractTypes
          .filter(ct => ct.shortName.toLowerCase() === 'dpa')
          .map(ct => ct.id),
      };
    });

    //2. Insert clauses
    const insertedClauses = await this.createMany({
      data: [..._commonClauses, ..._msaClauses, ..._dpaClauses],
    });

    //3. Add relevant clauses to contract types
    const promises = allContractTypeIds.map(ctId => {
      const applicableClauseIds = insertedClauses
        .filter(clause => isClauseForContractType(clause, ctId))
        .map(clause => clause.id);
      if (!applicableClauseIds.length) return;
      return contractTypeService.updateById(ctId, {
        clauses: applicableClauseIds,
      });
    });

    await Promise.all(promises);
  }

  find = async ({
    filter,
    fields,
    options,
    limit,
    skip,
    sort,
  }: findAllOptions<ClauseDefinition>): Promise<
    MongooseModel<ClauseDefinition>[]
  > => {
    const result = await this.model
      .find(filter ?? {}, fields, options)
      .populate('contractTypes', 'shortName longName', 'ContractType')
      .limit(limit ?? QUERY_CONFIG.DEFAULT_PAGE_SIZE)
      .skip(skip ?? 0)
      .sort(sort);

    console.log(result);
    return result;
  };
}

export const clauseDefinitionRepository = mongoService.createRepository(
  ClauseDefinitionRepository,
  ClauseDefinitionModel,
);
