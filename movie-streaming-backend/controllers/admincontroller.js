import { db } from "../config/db.js";

// ---------------- USERS ----------------
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await db
      .promise()
      .query("SELECT id, fullname, email, role FROM users");
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Error fetching users." });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.promise().query("DELETE FROM users WHERE id = ?", [id]);
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
  } catch (err) {
    console.error("Error deleting user:", err.message);
    res.status(500).json({ message: "Error deleting user." });
  }
};

// ---------------- MOVIES ----------------
export const getAllMovies = async (req, res) => {
  try {
    const [movies] = await db
      .promise()
      .query("SELECT * FROM movies ORDER BY release_year DESC");
    res.status(200).json({ success: true, movies });
  } catch (err) {
    console.error("Error fetching movies:", err.message);
    res.status(500).json({ message: "Error fetching movies." });
  }
};

export const addMovie = async (req, res) => {
  try {
    const { title, release_year, created_by } = req.body;

    // Validate
    if (!title || !release_year) {
      return res
        .status(400)
        .json({ message: "Title and release year are required." });
    }

    // Insert movie
    await db
      .promise()
      .query(
        "INSERT INTO movies (title, release_year, created_by) VALUES (?, ?, ?)",
        [title, release_year, created_by || "admin"]
      );

    res
      .status(201)
      .json({ success: true, message: "Movie added successfully!" });
  } catch (err) {
    console.error("Error adding movie:", err.message);
    res.status(500).json({ message: "Error adding movie." });
  }
};

export const deleteMovie = async (req, res) => {
  const { id } = req.params;
  try {
    // Use movie_id column 
    await db.promise().query("DELETE FROM movies WHERE movie_id = ?", [id]);
    res.status(200).json({ success: true, message: "Movie deleted successfully." });
  } catch (err) {
    console.error("Error deleting movie:", err.message);
    res.status(500).json({ message: "Error deleting movie." });
  }
};
