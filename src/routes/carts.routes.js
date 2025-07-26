import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cm = new CartManager();

router.post('/', async (req, res) => {
  const cart = await cm.createCart();
  res.status(201).json(cart);
});

router.get('/:cid', async (req, res) => {
  const cart = await cm.getById(req.params.cid);
  cart ? res.json(cart.products) : res.status(404).json({ error: 'Carrito no encontrado' });
});

router.post('/:cid/product/:pid', async (req, res) => {
  const updatedCart = await cm.addProductToCart(req.params.cid, parseInt(req.params.pid));
  updatedCart ? res.json(updatedCart) : res.status(404).json({ error: 'No se pudo agregar el producto' });
});

export default router;
