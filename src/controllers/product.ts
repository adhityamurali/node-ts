import { Controller, Post, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { BaseController } from '.';
import { ProductRepository } from '@src/repositories';

@Controller('product')
export class ProductController extends BaseController {
  constructor(private productRepository: ProductRepository) {
    super();
  }
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.productRepository.addProduct(req.body);
      res.status(201).send(result);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Get()
  public async getAll(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.productRepository.getProducts();
      res.status(201).send(result);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Get(':id')
  public async get(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.productRepository.getProductById(req.params.id);
      res.status(201).send(result);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }
}
