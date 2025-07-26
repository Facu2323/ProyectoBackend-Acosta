import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const pm = new ProductManager();

// 📌 Obtener todos los productos
router.get('/', async (req, res) => {
  res.json(await pm.getAll());
});

// 📌 Obtener un producto por ID
router.get('/:pid', async (req, res) => {
  const product = await pm.getById(req.params.pid);
  product
    ? res.json(product)
    : res.status(404).json({ error: 'Producto no encontrado' });
});

// 📌 Crear un nuevo producto
router.post('/', async (req, res) => {
  console.log('Body recibido:', req.body); // ✅ VERIFICACIÓN

  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

  // Validación de campos obligatorios
  if (!title || !description || !code || !price || stock == null || !category) {
    return res.status(400).json({ error: 'Campos incompletos' });
  }

  const newProduct = await pm.addProduct({
    title,
    description,
    code,
    price,
    status: status ?? true,
    stock,
    category,
    thumbnails
  });

  res.status(201).json(newProduct);
});

// 📌 Actualizar un producto por ID
router.put('/:pid', async (req, res) => {
  const updated = await pm.updateProduct(req.params.pid, req.body);
  updated
    ? res.json(updated)
    : res.status(404).json({ error: 'Producto no encontrado' });
});

// 📌 Eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
  await pm.deleteProduct(req.params.pid);
  res.json({ status: 'Producto eliminado' });
});

export default router;

