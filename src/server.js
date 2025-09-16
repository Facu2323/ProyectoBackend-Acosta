// src/server.js
import dotenv from "dotenv";
dotenv.config();

import { Server } from "socket.io";
import mongoose from "mongoose";
import app from "./app.js";
import { Cart } from "./dao/models/cart.js";

const PORT = process.env.PORT || 8080;

const httpServer = app.listen(PORT, async () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);

  // Crear carrito de prueba si no existe
  try {
    const existingCart = await Cart.findOne();
    if (!existingCart) {
      const testCart = new Cart({ products: [] });
      await testCart.save();
      console.log("✅ Carrito de prueba creado:", testCart._id.toString());
    }
  } catch (err) {
    console.error("❌ Error creando carrito de prueba:", err);
  }
});

const io = new Server(httpServer);
io.on("connection", socket => {
  console.log("✅ Nuevo cliente conectado con Socket.io");
  socket.on("disconnect", () => console.log("❌ Cliente desconectado"));
});
