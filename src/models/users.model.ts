import { model } from 'mongoose';

import { MongooseModel } from './interfaces/document';
import { User } from './interfaces/user';
import { userSchema } from './schemas/users.schema';

const UserModel = model<MongooseModel<User>>('User', userSchema, 'users');

export default UserModel;
