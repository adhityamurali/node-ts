import mongoose from 'mongoose';
import { BaseModel } from '.';

export interface Item extends BaseModel {
  productId: string;
  quantity: number;
  discount_percentage: number;
  weight_in_grams: number;
  price: number;
  total: number;
}

export interface ItemPayload {
  productId: string;
  quantity: number;
  discount_percentage: number;
  weight_in_grams: number;
}

export interface Cart extends BaseModel {
  items: Item[];
  subTotal: number;
}

export const ItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true }, //{ type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity can not be less then 1.'],
    },
    price: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    discount_percentage: {
      type: Number,
      required: true,
    },
    weight_in_grams: {
      type: Number,
      required: true,
    },
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

const CartSchema = new mongoose.Schema(
  {
    items: [ItemSchema],
    subTotal: {
      default: 0,
      type: Number,
    },
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

export const Cart = mongoose.model<Cart>('cart', CartSchema, 'carts');
