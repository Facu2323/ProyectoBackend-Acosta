import { Product } from "../models/product.js";
import mongoosePaginate from "mongoose-paginate-v2";

// 🔹 Aseguramos que el schema tenga paginate
if (!Product.schema.plugins.find(p => p.fn === mongoosePaginate)) {
  Product.schema.plugin(mongoosePaginate);
}

class ProductManagerMongo {
  async getProducts({ limit = 10, page = 1, sort, query }) {
    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true,
    };

    if (sort === "asc") options.sort = { price: 1 };
    if (sort === "desc") options.sort = { price: -1 };

    let filter = {};
    if (query) {
      // Permite buscar por categoría o disponibilidad
      filter = {
        $or: [
          { category: { $regex: query, $options: "i" } },
          { status: query === "true" } // true o false para disponibilidad
        ]
      };
    }

    const result = await Product.paginate(filter, options);

    return {
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null
    };
  }

  async getProductById(pid) {
    return await Product.findById(pid);
  }

  async createProduct(data) {
    const newProduct = new Product(data);
    return await newProduct.save();
  }

  async updateProduct(pid, data) {
    return await Product.findByIdAndUpdate(pid, data, { new: true });
  }

  async deleteProduct(pid) {
    return await Product.findByIdAndDelete(pid);
  }
}

export default ProductManagerMongo;
