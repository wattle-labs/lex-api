import { model } from 'mongoose';

import { AuthProvider } from './interfaces/authProvider';
import { MongooseModel } from './interfaces/document.interface';
import { authProviderSchema } from './schemas/authProvider.schema';

const AuthProviderModel = model<MongooseModel<AuthProvider>>(
  'AuthProvider',
  authProviderSchema,
  'authProviders',
);

export default AuthProviderModel;
