import { Cart, Item } from '@source/models/cart';
import { Product } from '@source/models/product';

export class CartService {
  public async appendToCart(
    productDetails: Product,
    productId: string,
    quantity: number,
    allcarts: Cart[]
  ): Promise<any> {
    const cart = allcarts[0];
    //---- Check if index exists ----//
    const indexFound = cart?.items.findIndex(
      (item) => item.productId === productId
    );
    /*------This removes an item from the the cart if the quantity is set to zero, 
    We can use this method to remove an item from the list  ------- */
    if (indexFound !== -1 && quantity <= 0) {
      cart?.items.splice(indexFound, 1);
      if (cart?.items.length === 0) {
        cart.subTotal = 0;
      } else {
        cart.subTotal = cart?.items
          .map((item) => item.total)
          .reduce((acc, next) => acc + next);
      }
    }

    //----------Check if product exist, just add the previous quantity with the new quantity and update the total price-------//
    else if (indexFound !== -1) {
      cart.items[indexFound].quantity =
        cart.items[indexFound].quantity + quantity;
      cart.items[indexFound].total =
        cart.items[indexFound].quantity * productDetails?.price;
      cart.items[indexFound].price = productDetails.price;
      cart.subTotal = cart.items
        .map((item) => item.total)
        .reduce((acc, next) => acc + next);
    }
    //----Check if quantity is greater than 0 then add item to items array ----//
    else if (quantity > 0) {
      cart.items.push({
        productId: productId,
        quantity: quantity,
        price: productDetails.price,
        total: productDetails.price * quantity,
        discount_percentage: productDetails.discount_percentage,
        weight_in_grams: Number(productDetails.weight_in_grams),
      });
      cart.subTotal = cart.items
        .map((item) => item.total)
        .reduce((acc, next) => acc + next);
    } else {
      return {
        type: 'Invalid',
        msg: 'Invalid request',
      };
    }
    return cart;
  }

  public async getCheckOutValue(
    allcarts: Cart[],
    distance: number,
    postal_code: number
  ) {
    const cart = allcarts[0];
    const sum = cart.items
      .map(
        (item: Item) =>
          item.total - item.total * (item.discount_percentage / 100)
      )
      .reduce((prev: any, next: any) => prev + next);
    const weight = cart.items
      .map((item: Item) => Number(item.weight_in_grams))
      .reduce((prev, next) => prev + next);
    const charge = await this.getShippingAmount(weight / 1000, distance);
    const data = {
      postal_code: postal_code,
      total_amount: Math.round(sum),
      distance_in_kilometers: distance,
      weight: weight / 1000,
      shipping_charge: charge ? charge.amount : 0,
      currency: 'Dollar',
    };

    const res = {
      Status: true,
      StatusCode: 200,
      message: 'Data available',
      data: data,
    };

    return res;
  }

  public async getShippingAmount(weight: number, distance: number) {
    const weightDistanceMap = [
      {
        weightFrom: 0.1,
        weightTo: 2,
        distanceFrom: 1,
        distanceTo: 5,
        amount: 12,
      },
      {
        weightFrom: 0.1,
        weightTo: 2,
        distanceFrom: 5,
        distanceTo: 20,
        amount: 15,
      },
      {
        weightFrom: 0.1,
        weightTo: 2,
        distanceFrom: 20,
        distanceTo: 50,
        amount: 20,
      },
      {
        weightFrom: 0.1,
        weightTo: 2,
        distanceFrom: 50,
        distanceTo: 500,
        amount: 50,
      },
      {
        weightFrom: 0.1,
        weightTo: 2,
        distanceFrom: 500,
        distanceTo: 800,
        amount: 100,
      },
      {
        weightFrom: 2.01,
        weightTo: 5,
        distanceFrom: 800,
        distanceTo: 800000000,
        amount: 220,
      },
      {
        weightFrom: 2.01,
        weightTo: 5,
        distanceFrom: 1,
        distanceTo: 5,
        amount: 14,
      },
      {
        weightFrom: 2.01,
        weightTo: 5,
        distanceFrom: 5,
        distanceTo: 20,
        amount: 18,
      },
      {
        weightFrom: 2.01,
        weightTo: 5,
        distanceFrom: 20,
        distanceTo: 50,
        amount: 24,
      },
      {
        weightFrom: 2.01,
        weightTo: 5,
        distanceFrom: 50,
        distanceTo: 500,
        amount: 55,
      },
      {
        weightFrom: 2.01,
        weightTo: 5,
        distanceFrom: 500,
        distanceTo: 800,
        amount: 110,
      },
      {
        weightFrom: 2.01,
        weightTo: 5,
        distanceFrom: 800,
        distanceTo: 800000000,
        amount: 250,
      },
      {
        weightFrom: 5.01,
        weightTo: 20,
        distanceFrom: 1,
        distanceTo: 5,
        amount: 16,
      },
      {
        weightFrom: 5.01,
        weightTo: 20,
        distanceFrom: 5,
        distanceTo: 20,
        amount: 25,
      },
      {
        weightFrom: 5.01,
        weightTo: 20,
        distanceFrom: 20,
        distanceTo: 50,
        amount: 30,
      },
      {
        weightFrom: 5.01,
        weightTo: 20,
        distanceFrom: 50,
        distanceTo: 500,
        amount: 80,
      },
      {
        weightFrom: 5.01,
        weightTo: 20,
        distanceFrom: 500,
        distanceTo: 800,
        amount: 130,
      },
      {
        weightFrom: 5.01,
        weightTo: 20,
        distanceFrom: 800,
        distanceTo: 800000000,
        amount: 270,
      },
      {
        weightFrom: 20.01,
        weightTo: 20000000,
        distanceFrom: 1,
        distanceTo: 5,
        amount: 21,
      },
      {
        weightFrom: 20.01,
        weightTo: 20000000,
        distanceFrom: 5,
        distanceTo: 20,
        amount: 35,
      },
      {
        weightFrom: 20.01,
        weightTo: 20000000,
        distanceFrom: 20,
        distanceTo: 50,
        amount: 50,
      },
      {
        weightFrom: 20.01,
        weightTo: 20000000,
        distanceFrom: 50,
        distanceTo: 500,
        amount: 90,
      },
      {
        weightFrom: 20.01,
        weightTo: 20000000,
        distanceFrom: 500,
        distanceTo: 800,
        amount: 150,
      },
      {
        weightFrom: 20.01,
        weightTo: 20000000,
        distanceFrom: 800,
        distanceTo: 800000000,
        amount: 300,
      },
    ];

    const amount = weightDistanceMap.find(
      (item) =>
        item.weightFrom < weight &&
        item.weightTo > weight &&
        item.distanceFrom < distance &&
        item.distanceTo > distance
    );
    return amount;
  }
}
