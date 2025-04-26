import { model } from 'mongoose';

import { MongooseModel } from './interfaces/document';
import { Project } from './interfaces/project';
import { projectSchema } from './schemas/project.schema';

const ProjectModel = model<MongooseModel<Project>>(
  'Project',
  projectSchema,
  'projects',
);

export default ProjectModel;
