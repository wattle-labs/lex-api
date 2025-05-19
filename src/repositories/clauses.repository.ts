import { Model } from 'mongoose';

import commonClauses from '../../static/key-terms-common.json';
import { mongoService } from '../lib/mongo';
import ClauseModel from '../models/clauses.model';
import { Clause } from '../models/interfaces/clause';
import { MongooseModel } from '../models/interfaces/document.interface';
import { contractTypeService } from '../services/contractTypes.service';
import { BaseRepository } from './base.repository';

// Helper functions
function isClauseForContractType(clause: Clause, contractTypeId: string) {
  return (
    !clause.contractTypes ||
    clause.contractTypes?.some(ctId => ctId.toString() === contractTypeId)
  );
}

export class ClauseRepository extends BaseRepository<MongooseModel<Clause>> {
  constructor(model: Model<MongooseModel<Clause>>) {
    super(model);
  }

  async initialize() {
    const allContractTypeIds = (await contractTypeService.findAll({})).map(
      ct => ct.id,
    );
    console.log(allContractTypeIds);

    //1. Add all contract types to all common clauses
    // If no contract types are specified, add to all contract types
    const _commonClauses: Clause[] = commonClauses.map(clause => {
      return {
        contractTypes: allContractTypeIds,
        ...clause,
      };
    });

    //2. Insert clauses
    const insertedClauses = await this.createMany({ data: _commonClauses });

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
}

export const clauseRepository = mongoService.createRepository(
  ClauseRepository,
  ClauseModel,
);
