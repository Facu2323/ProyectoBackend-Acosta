import { Router } from "express";
import Cart from "../dao/models/Cart.js";
import Product from "../dao/models/Product.js";

const router = Router();

// ----------------------
// AGREGAR PRODUCTO AL CARRITO
// POST /api/carts/:cid/products/:pid
// ----------------------
router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

    const index = cart.products.findIndex(p => p.product.equals(pid));
    if (index === -1) cart.products.push({ product: pid, quantity: 1 });
    else cart.products[index].quantity++;

    await cart.save();
    const populatedCart = await cart.populate("products.product");
    res.json({ status: "success", message: "Producto agregado al carrito", payload: populatedCart });

  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ----------------------
// ELIMINAR PRODUCTO DEL CARRITO
// DELETE /api/carts/:cid/products/:pid
// ----------------------
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    cart.products = cart.products.filter(p => !p.product.equals(pid));
    await cart.save();

    const populatedCart = await cart.populate("products.product");
    res.json({ status: "success", message: "Producto eliminado del carrito", payload: populatedCart });

  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ----------------------
// ACTUALIZAR CANTIDAD DE UN PRODUCTO
// PUT /api/carts/:cid/products/:pid
// ----------------------
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!Number.isInteger(quantity) || quantity < 1) 
      return res.status(400).json({ status: "error", message: "Cantidad inválida" });

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    const index = cart.products.findIndex(p => p.product.equals(pid));
    if (index === -1) return res.status(404).json({ status: "error", message: "Producto no encontrado en el carrito" });

    cart.products[index].quantity = quantity;
    await cart.save();

    const populatedCart = await cart.populate("products.product");
    res.json({ status: "success", message: "Cantidad actualizada", payload: populatedCart });

  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ----------------------
// REEMPLAZAR TODOS LOS PRODUCTOS DEL CARRITO
// PUT /api/carts/:cid
// ----------------------
router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body; // [{ product: ObjectId, quantity: number }]

    if (!Array.isArray(products)) 
      return res.status(400).json({ status: "error", message: "Formato inválido" });

    for (let p of products) {
      if (!p.product || !Number.isInteger(p.quantity) || p.quantity < 1)
        return res.status(400).json({ status: "error", message: "Producto con formato inválido" });
    }

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    cart.products = products;
    await cart.save();

    const populatedCart = await cart.populate("products.product");
    res.json({ status: "success", message: "Carrito actualizado", payload: populatedCart });

  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ----------------------
// VACIAR CARRITO
// DELETE /api/carts/:cid
// ----------------------
router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    cart.products = [];
    await cart.save();

    res.json({ status: "success", message: "Carrito vaciado", payload: cart });

  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ----------------------
// OBTENER CARRITO CON PRODUCTOS (populate)
// GET /api/carts/:cid
// ----------------------
router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid).populate("products.product");
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    res.json({ status: "success", payload: cart });

  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;

