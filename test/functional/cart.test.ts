import { Cart } from '@source/models/cart';

describe('Product functional tests', () => {
  beforeEach(async () => {
    await Cart.deleteMany({});
  });

  describe('When creating a new cart', () => {
    it('should create a cart with the product', async () => {
      const newProduct = {
        productId: '63badf6e31889e5a80e1d46d',
        quantity: 1,
      };

      const expectedResponse = [
        {
          items: [
            {
              productId: '63badf6e31889e5a80e1d46d',
              quantity: 1,
              price: 10.99,
              total: 10.99,
              discount_percentage: 5,
              weight_in_grams: 670,
              id: '63c02e089a5c1013e30e98b1',
            },
          ],
          subTotal: 10.99,
          id: '63c02d199a5c1013e30e989e',
        },
      ];

      const response = await global.testRequest.post('/cart').send(newProduct);
      expect(response.status).toBe(201);
      //Object containing matches the keys and values, even if includes other keys such as id.
      expect(response.body).toEqual(expectedResponse);
    });

    it('should return validation error when a field is invalid', async () => {
      const newProduct = {
        productId: '63badf6e31889e5a80e1d46d',
        quantity: 0, //invalid field
      };

      const response = await global.testRequest.post('/cart').send(newProduct);

      //tests will be broken, not middleware
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        code: 400,
        error: 'Bad Request',
        message: 'request.body.quantity is invalid',
      });
    });

    it('should return 500 when there is any error other than validation error', async () => {
      jest
        .spyOn(Cart.prototype, 'save')
        .mockRejectedValueOnce('fail to create product');
      const newProduct = {
        productId: '63badf6e31889e5a80e1d46d',
        quantity: 0, //invalid field
      };

      const response = await global.testRequest.post('/cart').send(newProduct);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        code: 500,
        error: 'Internal Server Error',
        message: 'Something went wrong!',
      });
    });
  });
});
