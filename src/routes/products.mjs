import { Router } from "express";

const router = Router();

router.get('api/products', (request, response) => {
    response.send([{ id: 123, name: "Bread", price: 1.01}])
})

export default router;