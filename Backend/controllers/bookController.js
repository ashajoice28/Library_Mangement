const Book = require("../models/Book");

const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch books", error: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ message: "Invalid book ID", error: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const { bookName, authorName, isbnNumber, category, publishedYear, availabilityStatus } = req.body;

    if (!bookName || !authorName || !isbnNumber || !category || !publishedYear || !availabilityStatus) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingBook = await Book.findOne({ isbnNumber });
    if (existingBook) return res.status(400).json({ message: "A book with this ISBN already exists" });

    const book = await Book.create({
      bookName, authorName, isbnNumber, category,
      publishedYear: Number(publishedYear), availabilityStatus
    });

    res.status(201).json({ message: "Book added successfully", book });
  } catch (error) {
    res.status(500).json({ message: "Unable to add book", error: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { bookName, authorName, isbnNumber, category, publishedYear, availabilityStatus } = req.body;

    const duplicateBook = await Book.findOne({
      isbnNumber,
      _id: { $ne: req.params.id }
    });
    if (duplicateBook) return res.status(400).json({ message: "Another book already uses this ISBN" });

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { bookName, authorName, isbnNumber, category, publishedYear: Number(publishedYear), availabilityStatus },
      { new: true, runValidators: true }
    );

    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book updated successfully", book });
  } catch (error) {
    res.status(400).json({ message: "Unable to update book", error: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book deleted permanently" });
  } catch (error) {
    res.status(400).json({ message: "Unable to delete book", error: error.message });
  }
};

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };
