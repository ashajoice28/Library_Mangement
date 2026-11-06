import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AddBook from "./pages/AddBook";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/edit-book/:id" element={<AddBook />} />
        </Routes>
      </main>
    </>
  );
}

export default App;