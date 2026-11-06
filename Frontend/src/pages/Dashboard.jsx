import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  FaBook,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch all books from the backend
  const fetchBooks = async () => {
    try {
      setLoading(true);

      const response = await api.get("/books");

      setBooks(response.data);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Unable to load books. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // Load books when the Dashboard opens
  useEffect(() => {
    fetchBooks();
  }, []);

  // Delete a book permanently
  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete "${name}"?`
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/books/${id}`);

      // Remove the deleted book from the screen immediately
      setBooks((currentBooks) =>
        currentBooks.filter((book) => book._id !== id)
      );

      alert("Book deleted successfully!");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Unable to delete book."
      );
    }
  };

  // Calculate available books
  const available = books.filter(
    (book) => book.availabilityStatus === "Available"
  ).length;

  const unavailable = books.length - available;

  return (
    <div className="page">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">
            LIBRARY MANAGEMENT SYSTEM
          </p>

          <h1>Book Dashboard</h1>

          <p className="subtitle">
            Manage your library books and availability efficiently.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/add-book")}
        >
          <FaBook />
          Add New Book
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">
            <FaBook />
          </div>

          <div>
            <p>Total Books</p>
            <h2>{books.length}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <FaCheckCircle />
          </div>

          <div>
            <p>Available</p>
            <h2>{available}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon danger">
            <FaTimesCircle />
          </div>

          <div>
            <p>Unavailable</p>
            <h2>{unavailable}</h2>
          </div>
        </div>

      </div>

      {/* Books Table */}
      <div className="table-card">

        <div className="table-header">
          <h2>Library Books</h2>

          <p>
            View, update, or permanently delete book records.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="loading">
            Loading books...
          </div>
        ) : books.length === 0 ? (

          /* Empty State */
          <div className="empty-state">
            <FaBook />

            <h3>No books available</h3>

            <p>
              Start by adding your first book.
            </p>

            <button
              className="primary-btn"
              onClick={() => navigate("/add-book")}
            >
              Add Book
            </button>
          </div>

        ) : (

          /* Books Table */
          <div className="table-wrapper">
            <table>

              <thead>
                <tr>
                  <th>Book ID</th>
                  <th>Book Name</th>
                  <th>Author Name</th>
                  <th>Category</th>
                  <th>Published Year</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {books.map((book) => (
                  <tr key={book._id}>

                    {/* Book ID */}
                    <td>
                      <span className="book-id">
                        {book._id.slice(-6).toUpperCase()}
                      </span>
                    </td>

                    {/* Book Name */}
                    <td className="book-name">
                      {book.bookName}
                    </td>

                    {/* Author Name */}
                    <td>
                      {book.authorName}
                    </td>

                    {/* Category */}
                    <td>
                      <span className="category-tag">
                        {book.category}
                      </span>
                    </td>

                    {/* Published Year */}
                    <td>
                      {book.publishedYear}
                    </td>

                    {/* Availability */}
                    <td>
                      <span
                        className={`status ${book.availabilityStatus === "Available"
                            ? "available"
                            : "unavailable"
                          }`}
                      >
                        {book.availabilityStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="action-buttons">

                        <button
                          className="edit-btn"
                          onClick={() =>
                            navigate(`/edit-book/${book._id}`)
                          }
                        >
                          <FaEdit />
                          Update
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(
                              book._id,
                              book.bookName
                            )
                          }
                        >
                          <FaTrash />
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;