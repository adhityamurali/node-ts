import { DefaultMongoDBRepository } from './defaultMongoDBRepository';
import { Cart } from '@src/models/cart';
import { CartRepository } from '.';

export class CartMongoDBRepository
  extends DefaultMongoDBRepository<Cart>
  implements CartRepository
{
  constructor(cartModel = Cart) {
    super(cartModel);
  }

  async getAllCarts() {
    return await this.find({});
  }

  async addItemToCart(cart: Cart) {
    return await this.create(cart);
  }

  async updateItemToCart(id: string, cart: Cart) {
    return await this.update({ id }, cart);
  }

  async deleteCart() {
    return await this.deleteAll();
  }
}
