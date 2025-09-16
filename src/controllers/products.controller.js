import ProductManagerMongo from "../dao/managers/ProductManagerMongo.js";
const productManager = new ProductManagerMongo();

/**
 * GET /api/products → con paginación, filtros y ordenamiento
 */
export const getProducts = async (req, res, next) => {
  try {
    const { limit, page, sort, query } = req.query;
    const result = await productManager.getProducts({ limit, page, sort, query });
    res.json({ status: "success", ...result });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/:pid → obtener un producto por ID
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    res.json({ status: "success", payload: product });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/products → crear producto nuevo
 */
export const createProduct = async (req, res, next) => {
  try {
    const newProduct = await productManager.createProduct(req.body);
    res.json({ status: "success", payload: newProduct });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

/**
 * PUT /api/products/:pid → actualizar producto
 */
export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
    if (!updatedProduct) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    res.json({ status: "success", payload: updatedProduct });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

/**
 * DELETE /api/products/:pid → eliminar producto
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await productManager.deleteProduct(req.params.pid);
    if (!deletedProduct) return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    res.json({ status: "success", payload: deletedProduct });
  } catch (error) {
    next(error);
  }
};

