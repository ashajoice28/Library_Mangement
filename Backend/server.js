require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const bookRoutes = require("./routes/bookRoutes");

const app = express();

if (!process.env.MONGODB_URI) {
  console.error("Missing MONGODB_URI. Create Backend/.env using .env.example.");
  process.exit(1);
}

connectDB();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Library Management System API is running" });
});

app.use("/api/books", bookRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
