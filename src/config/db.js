import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("❌ No se encontró la variable MONGO_URI en .env");
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};
