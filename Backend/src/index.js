import express from "express";
import "dotenv/config";
const app = express();
import authRoutes from "./router/authRoutes.js";
import booksRoutes from "./router/booksRoutes.js";
import connectDB from "./Config/db.js";

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);

// console.log({ PORT });

connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
