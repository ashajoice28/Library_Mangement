import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { FaArrowLeft, FaSave } from "react-icons/fa";

const initialForm = {
  bookName: "",
  authorName: "",
  isbnNumber: "",
  category: "",
  publishedYear: "",
  availabilityStatus: "Available",
};

function AddBook() {
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  // Fetch book details when updating a book
  useEffect(() => {
    if (!isEditMode) return;

    const fetchBook = async () => {
      try {
        setPageLoading(true);

        const response = await api.get(`/books/${id}`);
        const book = response.data;

        setFormData({
          bookName: book.bookName || "",
          authorName: book.authorName || "",
          isbnNumber: book.isbnNumber || "",
          category: book.category || "",
          publishedYear: book.publishedYear || "",
          availabilityStatus:
            book.availabilityStatus || "Available",
        });
      } catch (error) {
        console.error(error);
        alert("Unable to load book details.");
        navigate("/");
      } finally {
        setPageLoading(false);
      }
    };

    fetchBook();
  }, [id, isEditMode, navigate]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Add or update book
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const data = {
        ...formData,
        publishedYear: Number(formData.publishedYear),
      };

      if (isEditMode) {
        await api.put(`/books/${id}`, data);
        alert("Book updated successfully!");
      } else {
        await api.post("/books", data);
        alert("Book added successfully!");
      }

      navigate("/");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading while fetching book details
  if (pageLoading) {
    return (
      <div className="page">
        <div className="loading">
          Loading book details...
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="form-page-header">

        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          <FaArrowLeft />
          Back to Dashboard
        </button>

        <p className="eyebrow">
          {isEditMode ? "UPDATE BOOK" : "NEW BOOK"}
        </p>

        <h1>
          {isEditMode
            ? "Update Book Details"
            : "Add a New Book"}
        </h1>

        <p className="subtitle">
          Enter the information below and save your changes.
        </p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            {/* Book Name */}
            <div className="form-group">
              <label>Book Name</label>

              <input
                type="text"
                name="bookName"
                value={formData.bookName}
                onChange={handleChange}
                placeholder="Enter book name"
                required
              />
            </div>

            {/* Author Name */}
            <div className="form-group">
              <label>Author Name</label>

              <input
                type="text"
                name="authorName"
                value={formData.authorName}
                onChange={handleChange}
                placeholder="Enter author name"
                required
              />
            </div>

            {/* ISBN */}
            <div className="form-group">
              <label>ISBN Number</label>

              <input
                type="text"
                name="isbnNumber"
                value={formData.isbnNumber}
                onChange={handleChange}
                placeholder="Enter ISBN number"
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label>Category</label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Example: Fiction"
                required
              />
            </div>

            {/* Published Year */}
            <div className="form-group">
              <label>Published Year</label>

              <input
                type="number"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleChange}
                min="1000"
                max={new Date().getFullYear()}
                placeholder="Example: 2024"
                required
              />
            </div>

            {/* Availability Status */}
            <div className="form-group">
              <label>Availability Status</label>

              <select
                name="availabilityStatus"
                value={formData.availabilityStatus}
                onChange={handleChange}
              >
                <option value="Available">
                  Available
                </option>

                <option value="Unavailable">
                  Unavailable
                </option>
              </select>
            </div>

          </div>

          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              <FaSave />

              {loading
                ? "Saving..."
                : isEditMode
                  ? "Update Book"
                  : "Save Book"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default AddBook;