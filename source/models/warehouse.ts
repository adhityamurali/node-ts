import mongoose from 'mongoose';
import { BaseModel } from '.';

export interface Warehouse extends BaseModel {
  postal_code: number;
  distance_in_kilometers: number;
}

const schema = new mongoose.Schema(
  {
    postal_code: { type: Number, minlength: 1, maxlength: 50, required: true },
    distance_in_kilometersr: { type: Number, required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const Warehouse = mongoose.model<Warehouse>('Warehouse', schema);
