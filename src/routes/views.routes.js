import { Router } from "express";
import { Product } from "../dao/models/product.js";
import { Cart } from "../dao/models/cart.js";

const router = Router();

// ID fijo para pruebas, puedes usarlo dinámicamente luego
const TEST_CART_ID = "64f123abc456def789012345";

// Home
router.get("/", (req, res) => {
  res.render("home", { title: "Bienvenido a la tienda" });
});

// Vista productos con paginación, filtros y sort
router.get("/products", async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);

    let filter = {};
    if (query) {
      filter = {
        $or: [
          { category: { $regex: query, $options: "i" } },
          { status: query === "true" }
        ]
      };
    }

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

    res.render("products", {
      products,
      pagination: {
        totalPages,
        page,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages
      },
      TEST_CART_ID
    });
  } catch (err) {
    res.status(500).send("Error al cargar productos: " + err.message);
  }
});

// Vista detalle de producto
router.get("/products/:pid", async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).lean();
    if (!product) return res.status(404).send("Producto no encontrado");
    res.render("productDetail", { product, TEST_CART_ID });
  } catch (err) {
    res.status(500).send("Error al cargar producto: " + err.message);
  }
});

// Vista carrito con populate
router.get("/cart/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product").lean();
    if (!cart) return res.status(404).send("Carrito no encontrado");

    res.render("cart", { cart, TEST_CART_ID });
  } catch (err) {
    res.status(500).send("Error al cargar carrito: " + err.message);
  }
});

export default router;

