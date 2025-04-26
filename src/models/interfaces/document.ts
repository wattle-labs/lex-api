import { Document, ObjectId } from 'mongoose';

export interface MongoDocument extends Document {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type MongooseModel<T> = T & MongoDocument;
