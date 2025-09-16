import { Cart } from "../models/cart.js";
import { Product } from "../models/product.js";

class CartManagerMongo {
  async createCart() {
    const newCart = new Cart({ products: [] });
    return await newCart.save();
  }

  async getCartById(cid) {
    return await Cart.findById(cid).populate("products.product");
  }

  async addProductToCart(cid, pid) {
    const cart = await Cart.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const product = await Product.findById(pid);
    if (!product) throw new Error("Producto no encontrado");

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    return await cart.save();
  }

  async removeProductFromCart(cid, pid) {
    const cart = await Cart.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    return await cart.save();
  }

  async updateCartProducts(cid, products) {
    if (!Array.isArray(products)) throw new Error("El body debe contener un arreglo de productos");

    return await Cart.findByIdAndUpdate(cid, { products }, { new: true }).populate("products.product");
  }

  async updateProductQuantity(cid, pid, quantity) {
    const cart = await Cart.findById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex === -1) throw new Error("Producto no encontrado en carrito");

    cart.products[productIndex].quantity = quantity;
    return await cart.save();
  }

  async clearCart(cid) {
    return await Cart.findByIdAndUpdate(cid, { products: [] }, { new: true });
  }
}

export default CartManagerMongo;

