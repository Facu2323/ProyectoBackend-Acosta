import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import ProductManager from "./dao/ProductManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public"))); // Para archivos JS/CSS del frontend

// Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", join(__dirname, "views"));

// Rutas API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Instancia ProductManager
const manager = new ProductManager(join(__dirname, "data", "products.json"));

// Rutas vistas
app.get("/", async (req, res) => {
  const products = await manager.getProducts();
  res.render("home", { products });
});

app.get("/realtimeproducts", async (req, res) => {
  const products = await manager.getProducts();
  res.render("realTimeProducts", { products });
});

// Servidor HTTP
const httpServer = app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});

// Socket.io
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("✅ Nuevo cliente conectado");

  // Agregar producto
  socket.on("newProduct", async (product) => {
    await manager.addProduct(product);
    const products = await manager.getProducts();
    io.emit("updateProducts", products);
  });

  // Eliminar producto
  socket.on("deleteProduct", async (id) => {
    await manager.deleteProduct(Number(id));
    const products = await manager.getProducts();
    io.emit("updateProducts", products);
  });
});



