import { Product } from '@src/models/product';

describe('Product functional tests', () => {
  beforeEach(async () => {
    await Product.deleteMany({});
  });

  describe('When creating a new product', () => {
    it('should create a product with success', async () => {
      const newProduct = {
        title: 'WD 2TB Elements Portable External Hard Drive',
        price: 64,
        category: 'electronics',
        image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
        description:
          'USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system',
        discount_percentage: 9,
        weight_in_grams: 2050,
      };

      const response = await global.testRequest
        .post('/product')
        .send(newProduct);
      expect(response.status).toBe(201);
      //Object containing matches the keys and values, even if includes other keys such as id.
      expect(response.body).toEqual(expect.objectContaining(newProduct));
    });

    it('should return validation error when a field is invalid', async () => {
      const newProduct = {
        title: 'WD 2TB Elements Portable External Hard Drive',
        price: '64', //invalid field
        category: 'electronics',
        image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
        description:
          'USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system',
        discount_percentage: 9,
        weight_in_grams: 2050,
      };
      const response = await global.testRequest
        .post('/product')
        .send(newProduct);

      //tests will be broken, not middleware
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        code: 400,
        error: 'Bad Request',
        message: 'request.body.price should be number',
      });
    });

    it('should return 500 when there is any error other than validation error', async () => {
      jest
        .spyOn(Product.prototype, 'save')
        .mockRejectedValueOnce('fail to create product');
      const newProduct = {
        title: 'WD 2TB Elements Portable External Hard Drive',
        price: 64,
        category: 'electronics',
        image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
        description:
          'USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system',
        discount_percentage: 9,
        weight_in_grams: 2050,
      };

      const response = await global.testRequest
        .post('/product')
        .send(newProduct);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        code: 500,
        error: 'Internal Server Error',
        message: 'Something went wrong!',
      });
    });
  });
});
