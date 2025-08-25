import { promises as fs } from "fs";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  // Obtener todos los productos
  async getProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  // Agregar un producto nuevo
  async addProduct(product) {
    const products = await this.getProducts();
    const newProduct = {
      id: products.length ? products[products.length - 1].id + 1 : 1,
      ...product,
    };
    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  // Eliminar producto por id
  async deleteProduct(id) {
    const products = await this.getProducts();
    const updatedProducts = products.filter((p) => p.id !== id);
    await fs.writeFile(this.path, JSON.stringify(updatedProducts, null, 2));
  }
}

export default ProductManager;
