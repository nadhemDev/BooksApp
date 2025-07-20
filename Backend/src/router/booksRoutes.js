import express from "express";
import {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  searchBooks,
  getBooksByCategory
} from '../Controller/booksController.js';

const router = express.Router();

// Create a new book
router.post("/create", createBook);

// Get all books (with optional query parameters)
router.get("/", getAllBooks);

// Search books (by title, author, or category)
// Example: /books/search?query=harry
router.get("/search", searchBooks);

// Get books by category
// Example: /books/category/fiction
router.get("/category/:category", getBooksByCategory);

// Get a single book by ID
router.get("/:id", getBookById);

// Update a book
router.put("/:id", updateBook);

// Delete a book
router.delete("/:id", deleteBook);

export default router;