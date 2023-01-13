import { DefaultMongoDBRepository } from './defaultMongoDBRepository';
import { Warehouse } from '@source/models/warehouse';
import { WarehouseRepository } from '.';

export class WarehouseMongoDBRepository
  extends DefaultMongoDBRepository<Warehouse>
  implements WarehouseRepository
{
  constructor(warehouseModel = Warehouse) {
    super(warehouseModel);
  }

  async getDistance(postal_code: number) {
    return await this.findOne({ postal_code });
  }
}
