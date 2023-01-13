import { Warehouse } from '@src/models/warehouse';

describe('Product functional tests', () => {
  beforeEach(async () => {
    await Warehouse.deleteMany({});
  });

  describe('When creating a new cart', () => {
    it('should create a cart with the product', async () => {
      const expectedResponse = {
        postal_code: 465538,
        distance_in_kilometers: 250,
        id: '63c0272a7a27369edcca6ed2',
      };

      const response = await global.testRequest.get(
        '/warehouse/distance?postal_code=465538'
      );
      expect(response.status).toBe(201);
      //Object containing matches the keys and values, even if includes other keys such as id.
      expect(response.body).toEqual(expectedResponse);
    });

    it('should return validation error when a field is invalid', async () => {
      const response = await global.testRequest.get(
        '/warehouse/distance?postal_code=465538'
      );

      //tests will be broken, not middleware
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        code: 400,
        error: 'Bad Request',
        message: 'request.body.quantity is invalid',
      });
    });

    it('should return 500 when there is any error other than validation error', async () => {
      const response = await global.testRequest.get(
        '/warehouse/distance?postal_code=465538'
      );
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        code: 500,
        error: 'Internal Server Error',
        message: 'Something went wrong!',
      });
    });
  });
});
