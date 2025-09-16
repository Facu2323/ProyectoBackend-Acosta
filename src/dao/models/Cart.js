import { Cart } from "../models/cart.js";

export default class CartManagerMongo {
  // Crear un carrito vacío
  async createCart() {
    return await Cart.create({ products: [] });
  }

  // Obtener carrito por ID con populate
  async getCartById(cid) {
    return await Cart.findById(cid).populate("products.product");
  }

  // Agregar un producto al carrito
  async addProductToCart(cid, pid, quantity = 1) {
    const cart = await Cart.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const item = cart.products.find(p => p.product.toString() === pid);

    if (item) {
      item.quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }

    await cart.save();
    return await cart.populate("products.product");
  }

  // Eliminar un producto del carrito
  async removeProductFromCart(cid, pid) {
    const cart = await Cart.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = cart.products.filter(p => p.product.toString() !== pid);

    await cart.save();
    return await cart.populate("products.product");
  }

  // Vaciar carrito
  async clearCart(cid) {
    const cart = await Cart.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = [];
    await cart.save();
    return cart;
  }
}

