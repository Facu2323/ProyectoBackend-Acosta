import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnails: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

// 👇 habilitamos la paginación
productSchema.plugin(mongoosePaginate);

export const Product = mongoose.model("Product", productSchema);

