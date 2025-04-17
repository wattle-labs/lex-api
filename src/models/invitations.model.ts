import { Model, model } from 'mongoose';

import { MongooseModel } from './interfaces/document.interface';
import { Invitation } from './interfaces/invitation';
import { invitationSchema } from './schemas/invitation.schema';

interface InvitationModel extends Model<MongooseModel<Invitation>> {
  generateToken(): { token: string; tokenHash: string };
}

const InvitationModel = model<MongooseModel<Invitation>, InvitationModel>(
  'Invitation',
  invitationSchema,
  'invitations',
);

export default InvitationModel;
