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

export default router;