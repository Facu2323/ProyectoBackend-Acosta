import { Cart } from "../dao/models/cart.js";
import { Product } from "../dao/models/product.js";

// CID fijo para pruebas (puede eliminarse o reemplazarse luego)
const TEST_CART_ID = "64f123abc456def789012345";

/**
 * POST /api/carts → crear un carrito nuevo
 */
export const createCart = async (req, res, next) => {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.json({ status: "success", payload: newCart });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/carts/:cid → obtener carrito por ID con populate
 */
export const getCartById = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product");

    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    res.json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/carts/:cid/products/:pid → agregar producto a carrito
 */
export const addProductToCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ status: "error", message: "Producto no encontrado" });

    const index = cart.products.findIndex(p => p.product.toString() === pid);

    if (index !== -1) {
      cart.products[index].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/carts/:cid/products/:pid → actualizar cantidad de producto
 */
export const updateProductQuantity = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    const index = cart.products.findIndex(p => p.product.toString() === pid);
    if (index === -1) return res.status(404).json({ status: "error", message: "Producto no encontrado en carrito" });

    cart.products[index].quantity = quantity;
    await cart.save();

    res.json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/carts/:cid/products/:pid → eliminar producto del carrito
 */
export const removeProductFromCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;

    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();

    res.json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/carts/:cid → actualizar todos los productos del carrito
 */
export const updateCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if (!Array.isArray(products))
      return res.status(400).json({ status: "error", message: "El body debe contener un arreglo de productos" });

    const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true }).populate("products.product");

    res.json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/carts/:cid → vaciar carrito
 */
export const clearCart = async (req, res, next) => {
  try {
    const { cid } = req.params;

    const cart = await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
    res.json({ status: "success", payload: cart });
  } catch (error) {
    next(error);
  }
};

