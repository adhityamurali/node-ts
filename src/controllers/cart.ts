import { Controller, Post, Get, Delete } from '@overnightjs/core';
import { Request, Response } from 'express';
import { BaseController } from '.';
import { CartRepository, WarehouseRepository } from 'src/repositories';
import { ProductRepository } from 'src/repositories';
import { Cart } from 'src/models/cart';
import { CartService } from 'src/services/Cart';
const cartService = new CartService();

@Controller('cart')
export class CartController extends BaseController {
  constructor(
    private cartRepository: CartRepository,
    private productRepository: ProductRepository,
    private warehouseRepository: WarehouseRepository
  ) {
    super();
  }
  @Get()
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.cartRepository.getAllCarts();
      res.status(201).send(result);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Get('checkout-value/:postal_code')
  public async getCheckoutValue(req: Request, res: Response): Promise<void> {
    try {
      const postal_code = Number(req.params.postal_code);
      const { distance_in_kilometers } =
        await this.warehouseRepository.getDistance(postal_code);
      const cart = await this.cartRepository.getAllCarts();
      const result = await cartService.getCheckOutValue(
        cart as Cart[],
        distance_in_kilometers,
        postal_code
      );
      res.status(201).send(result);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.body;
      const quantity = Number.parseInt(req.body.quantity);
      const cart = await this.cartRepository.getAllCarts();
      const productDetails = await this.productRepository.getProductById(
        productId
      );
      if (!productDetails) {
        res.status(500).json({
          type: 'Not Found',
          msg: 'Invalid request',
        });
      }

      if (cart?.length !== 0) {
        const cartData = await cartService.appendToCart(
          productDetails!,
          productId,
          quantity,
          cart as Cart[]
        );
        const result = await this.cartRepository.updateItemToCart(
          cartData.id,
          cartData
        );
        res.status(201).send(result);
      } else {
        const cartData: Cart = {
          items: [
            {
              productId: productId,
              quantity: quantity,
              total: (productDetails?.price || 0) * quantity,
              price: productDetails?.price || 0,
              discount_percentage: productDetails?.discount_percentage || 0,
              weight_in_grams: Number(productDetails?.weight_in_grams) || 0,
            },
          ],
          subTotal: (productDetails?.price || 0) * quantity,
        };
        const result = await this.cartRepository.addItemToCart(cartData);
        res.status(201).send(result);
      }
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Delete()
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.cartRepository.deleteCart();
      res.status(200).send(result);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }
}
