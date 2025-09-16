import { Router } from "express";
import Product from "../dao/models/Product.js";

const router = Router();

// ----------------------
// OBTENER TODOS LOS PRODUCTOS (con filtros, paginación y ordenamiento)
// GET /api/products?limit=10&page=1&sort=asc&query=category:libros
// ----------------------
router.get("/", async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit) || 10;
    page = parseInt(page) || 1;

    const filter = {};

    // Filtrado por categoría o disponibilidad
    if (query) {
      const [field, value] = query.split(":");
      if (field === "disponible") filter.stock = { $gt: 0 };
      else if (field === "agotado") filter.stock = 0;
      else filter[field] = value;
    }

    // Ordenamiento por precio
    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const queryString = (param) => param ? param : "";

    res.json({
      status: "success",
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${queryString(sort)}&query=${queryString(query)}` : null,
      nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}&sort=${queryString(sort)}&query=${queryString(query)}` : null
    });

  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ----------------------
// OBTENER PRODUCTO POR ID
// GET /api/products/:pid
// ----------------------
router.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    res.json({ status: "success", payload: product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;





