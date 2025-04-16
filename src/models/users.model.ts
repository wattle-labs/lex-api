import { model } from 'mongoose';

import { MongooseModel } from './interfaces/document.interface';
import { User } from './interfaces/user';
import { userSchema } from './schemas/user.schema';

const UserModel = model<MongooseModel<User>>('User', userSchema, 'users');

export default UserModel;
