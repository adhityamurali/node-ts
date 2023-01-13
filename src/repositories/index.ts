import { Cart } from '@src/models/cart';
import { Product } from '@src/models/product';
import { Warehouse } from '@src/models/warehouse';

export type FilterOptions = Record<string, unknown>;

export type WithId<T> = { id: string } & T;

export interface BaseRepository<T> {
  create(data: T): Promise<WithId<T>>;
  findOne(options: FilterOptions): Promise<WithId<T> | undefined>;
  find(options: FilterOptions): Promise<WithId<T>[]>;
  deleteAll(): Promise<void>;
}

export interface CartRepository extends BaseRepository<Cart> {
  getAllCarts(): Promise<WithId<Cart>[] | undefined>;
  addItemToCart(cartData: Cart): Promise<unknown> | undefined;
  updateItemToCart(id: string, cartData: Cart): Promise<unknown> | undefined;
  deleteCart(): Promise<void>;
}

export interface ProductRepository extends BaseRepository<Product> {
  addProduct(product: Product): Promise<Product> | undefined;
  getProducts(): Promise<WithId<Product>[] | undefined>;
  getProductById(id: string): Promise<WithId<Product> | undefined>;
}

export interface WarehouseRepository extends BaseRepository<Warehouse> {
  getDistance(postal_code: number): Promise<any> | undefined;
}
