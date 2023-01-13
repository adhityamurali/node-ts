import { DefaultMongoDBRepository } from './defaultMongoDBRepository';
import { Product } from '@source/models/product';
import { ProductRepository } from '.';

export class ProductMongoDBRepository
  extends DefaultMongoDBRepository<Product>
  implements ProductRepository
{
  constructor(productModel = Product) {
    super(productModel);
  }

  async addProduct(product: Product) {
    return await this.create(product);
  }

  async getProducts() {
    return await this.find({});
  }

  async getProductById(id: string) {
    return this.findOne({ _id: id });
  }
}
