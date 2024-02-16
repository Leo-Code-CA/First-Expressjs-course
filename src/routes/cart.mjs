import { Router } from "express";
// import session from 'express-session';

const router = Router();

// POST AND GET REQUEST FOR USERS AND CART SESSIONS

router.post('/api/cart', (req, res) => {

    if (!req.session.user) return res.sendStatus(401);

    const { body: item } = req;

    const { cart } = req.session;

    if (cart) {
        cart.push(item);
    } else {
        req.session.cart = [item];
    }
    return res.status(201).send(item);
});

router.get('/api/cart', (req, res) => {

    if(!req.session.user) return res.sendStatus(401);
    return res.send(req.session.cart ?? []);
})

export default router;