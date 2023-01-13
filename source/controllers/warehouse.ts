import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';
import { BaseController } from '.';
import { WarehouseRepository } from '@source/repositories';

@Controller('warehouse')
export class WarehouseController extends BaseController {
  constructor(private warehouseRepository: WarehouseRepository) {
    super();
  }
  @Get('distance')
  public async get(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.warehouseRepository.getDistance(
        Number(req.query.postal_code)
      );
      res.status(200).send(result);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }
}
