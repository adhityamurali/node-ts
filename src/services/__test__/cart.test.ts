import { CartService } from '../Cart';

describe('Cart Service', () => {
  const allcart = [
    {
        "items": [
            {
                "productId": "63badf6e31889e5a80e1d46d",
                "quantity": 1,
                "price": 10.99,
                "total": 10.99,
                "discount_percentage": 5,
                "weight_in_grams": 670,
                "id": "63c02e089a5c1013e30e98b1"
            }
        ],
        "subTotal": 10.99,
        "id": "63c02d199a5c1013e30e989e"
    }
];
const cartService = new CartService()
describe('Append to Cart', () => {
    let cart:any;
    const productDetails =     {
        "title": "Pierced Owl Rose Gold Plated",
        "price": 10.99,
        "category": "jewelery",
        "image": "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg",
        "description": "Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel",
        "discount_percentage": 5,
        "weight_in_grams": 670,
        "id": "63badf6e31889e5a80e1d46d"
    }
    const productId = "63badf6e31889e5a80e1d46d"
    const quantity = 1
    it('should increase the quantity in the existing product',async () => {
       cart = await cartService.appendToCart(productDetails,productId,quantity,allcart)
      expect(cart?.items[0].quantity).toBe(2);
    });

    it('should increase the total',async () => {
        expect(cart?.items[0].total).toBe(21.98);
    });
    it('should increase the subtotal',async () => {
        expect(cart?.items[0].total).toBe(21.98);
    });

  });

  describe('Checkout Value calculation', () => {
    let res:any;
    const distance = 250
    const postal_code = 465538
    it('should calculate the total amount for given postal code',async () => {
        res = await cartService.getCheckOutValue(allcart,distance,postal_code)
      expect(res?.data.total_amount).toBe(21);
    });

    it('should calculate the weight',async () => {
      expect(res?.data.weight).toBe(0.67);
    });

  });

  describe('shipping amount calculation', () => {
    let res:any;
    const distance = 250
    const weight = 0.67
    it('should calculate the total amount for given postal code',async () => {
        res = await cartService.getShippingAmount(weight,distance)
      expect(res.amount).toBe(50);
    });

    it('should display distance from',async () => {
      expect(res?.distanceFrom).toBe(50);
    });


    it('should display distance to',async () => {
        expect(res?.distanceTo).toBe(500);
      });

  });

});
