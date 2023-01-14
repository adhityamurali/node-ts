# Square Shift E-commerce

E-commerce app backend with REST API, Clean Code, a bit of TDD

## Tech

- NodeJS
- TypeScript
- Express
- OvernightJS
- Jest

## Installation and Build

App requires [Node.js](https://nodejs.org/) v14+ to run.

Install the dependencies and devDependencies and start the server.

```sh
npm install
npm run start:local
```

For production environments...

```sh
npm install && npm run build
npm run start
```

## Endpoints

### Product

#### GET

http://localhost:5050/product - Returns the list of products availbale
http://localhost:5050/product/:id - Returns the product based on id

### POST
http://localhost:5050/product - Adds the product to the db

#### req.body 

    {
        "title": "Pierced Owl Rose Gold Plated",
        "price": 10.99,
        "category": "jewelery",
        "image": "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg",
        "description": "Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel",
        "discount_percentage": 5,
        "weight_in_grams": 670,
    }

### Cart

#### GET

http://localhost:5050/cart - Returns the list of carts available

### POST
http://localhost:5050/cart - Adds the product to the cart

#### req.body 

    {
        "productId":"id",
        "quantity": 1
    }

### DELETE
http://localhost:5050/cart - Delete All Cart

### Warehouse

#### GET

http://localhost:5050/warehouse/distance?postal_code=465538 - Returns the distance for the particular postalCode

### Checkout Value

#### GET

http://localhost:5050/cart/checkout-value/465538 - Returns the Final amount, Shipping Charges After applying discounts for the particular Postcal code

## License

MIT
