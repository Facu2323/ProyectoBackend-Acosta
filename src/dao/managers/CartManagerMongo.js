import { Cart } from "../models/Cart.js";

export default class CartManagerMongo {
  async createCart() {
    return Cart.create({ products: [] });
  }

  async getCartById(cid) {
    return Cart.findById(cid).populate("products.product");
  }

  async addProductToCart(cid, productId, quantity = 1) {
    const cart = await Cart.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const existingProduct = cart.products.find(
      (p) => p.product.toString() === productId
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return cart.populate("products.product");
  }

  async updateCartProducts(cid, productsArray) {
    const cart = await Cart.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = productsArray.map((p) => ({
      product: p.product,
      quantity: p.quantity,
    }));

    await cart.save();
    return cart.populate("products.product");
  }

  async updateProductQuantity(cid, productId, quantity) {
    const cart = await Cart.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const productInCart = cart.products.find(
      (p) => p.product.toString() === productId
    );
    if (!productInCart) throw new Error("Producto no encontrado en el carrito");

    productInCart.quantity = quantity;
    await cart.save();
    return cart.populate("products.product");
  }

  async removeProductFromCart(cid, productId) {
    const cart = await Cart.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    );

    await cart.save();
    return cart.populate("products.product");
  }

  async clearCart(cid) {
    const cart = await Cart.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = [];
    await cart.save();
    return cart;
  }
}
