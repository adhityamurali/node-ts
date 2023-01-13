import mongoose from 'mongoose';
import { BaseModel } from '.';

export interface Product extends BaseModel {
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  discount_percentage: number;
  weight_in_grams: number;
}

const schema = new mongoose.Schema(
  {
    title: { type: String, minlength: 1, maxlength: 50, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, minlength: 5, maxlength: 500, required: true },
    discount_percentage: { type: Number, required: true },
    weight_in_grams: { type: Number, required: true },
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

export const Product = mongoose.model<Product>('Product', schema);
