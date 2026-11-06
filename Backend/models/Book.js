const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  bookName: { type: String, required: true, trim: true },
  authorName: { type: String, required: true, trim: true },
  isbnNumber: { type: String, required: true, unique: true, trim: true },
  category: { type: String, required: true, trim: true },
  publishedYear: { type: Number, required: true },
  availabilityStatus: {
    type: String,
    enum: ["Available", "Unavailable"],
    default: "Available"
  }
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
