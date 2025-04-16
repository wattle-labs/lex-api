import { model } from 'mongoose';

import { MongooseModel } from './interfaces/document.interface';
import { ProjectAccess } from './interfaces/projectAccess';
import { projectAccessSchema } from './schemas/projectAccess.schema';

const ProjectAccessModel = model<MongooseModel<ProjectAccess>>(
  'ProjectAccess',
  projectAccessSchema,
  'projectAccess',
);

export default ProjectAccessModel;
