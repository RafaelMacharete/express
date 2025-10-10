import { Router } from "express";

const router = Router();

router.get('/api/products', (request, response) => {
    console.log(request.headers);
    
    console.log(request.signedCookies.hello);

    if (request.signedCookies.hello && request.signedCookies.hello === 'world') {
        response.send([{ id: 123, name: "Bread", price: 1.01 }]);
    }
    
    return response.status(403)
        .send({ msg: 'Sorry, you need the correct cookie!' });
})

router.post('/api/cart', (request, response) => {
   if (!request.session.user) return response.sendStatus(401);
   const { body: item } = request;
   const { cart } = request.session;
   if (cart) { // If car is already defined, just push into.
      cart.push(item);
   } else { // If not, create it instance within session of request
      request.session.cart = [item]
   }

   return response.status(201).send(item);
});

router.get('/api/cart', (request, response) => {
   if (!request.session.user) return response.sendStatus(401);
   return response.send(request.session.cart ?? []);
});

export default router;