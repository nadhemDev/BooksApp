import mongoose from "mongoose";

const BooksSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    description: String,
    image: String,
    price: Number,
    stock: Number,
    category: String,
  },
  { timestamps: true }
);

const BooksModel = mongoose.model("Books", BooksSchema);
export default BooksModel;
