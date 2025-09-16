// src/app.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";
import mongoose from "mongoose";
import dotenv from "dotenv";

import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => console.error("❌ Error conectando a MongoDB:", err));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use("/static", express.static(path.join(__dirname, "src/public")));

// Handlebars con helpers
app.engine("handlebars", engine({
  helpers: {
    formatCurrency: (value) => {
      if (typeof value === "number") return `$${value.toFixed(2)}`;
      return value;
    },
    add: (a, b) => a + b,
    subtract: (a, b) => a - b
  }
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Rutas API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Rutas Vistas
app.use("/", viewsRouter);

export default app;






