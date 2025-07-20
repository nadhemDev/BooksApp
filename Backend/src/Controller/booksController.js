import BooksModel from "../Models/Books.js";

// Create a new book
export const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      description,
      image,
      price,
      stock,
      category,
      caption,
    } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!author) missingFields.push("author");
    if (!price) missingFields.push("price");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missingFields,
        example: {
          title: "Book Title",
          author: "Author Name",
          price: 19.99,
          image: "https://example.com/book-cover.jpg",
          description: "Optional description",
          caption: "Short catchy phrase about the book", // Added caption example
          stock: 10,
          category: "fiction",
        },
      });
    }

    // Validate price
    if (isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: "Price must be a number",
        received: price,
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0",
        received: price,
      });
    }

    // Validate image URL if provided
    if (image && !/^https?:\/\/.+\/.+$/.test(image)) {
      return res.status(400).json({
        success: false,
        message: "Image must be a valid URL",
        received: image,
      });
    }

    const newBook = new BooksModel({
      title,
      author,
      description: description || "",
      image: image || "https://via.placeholder.com/150",
      price: Number(price),
      stock: stock || 0,
      category: category || "general",
      caption: caption || "", // Added caption with default empty string
    });

    const savedBook = await newBook.save();

    // Success response
    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: {
        id: savedBook._id,
        title: savedBook.title,
        author: savedBook.author,
        price: savedBook.price,
        stock: savedBook.stock,
        image: savedBook.image,
        category: savedBook.category,
        caption: savedBook.caption, // Added caption to response
        links: {
          view: `/books/${savedBook._id}`,
          update: `/books/${savedBook._id}`,
          delete: `/books/${savedBook._id}`,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
      errorCode: "BOOK_CREATION_ERROR",
    });
  }
};

// Get all books
export const getAllBooks = async (req, res) => {
  try {
    const books = await BooksModel.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single book by ID
export const getBookById = async (req, res) => {
  try {
    const book = await BooksModel.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a book
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove any attempt to update createdAt or updatedAt
    if (updateData.createdAt || updateData.updatedAt) {
      return res
        .status(400)
        .json({ message: "Cannot update timestamp fields" });
    }

    const updatedBook = await BooksModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a book
export const deleteBook = async (req, res) => {
  try {
    const deletedBook = await BooksModel.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search books (by title, author, or category)
export const searchBooks = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const books = await BooksModel.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get books by category
export const getBooksByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const books = await BooksModel.find({
      category: new RegExp(category, "i"),
    });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
