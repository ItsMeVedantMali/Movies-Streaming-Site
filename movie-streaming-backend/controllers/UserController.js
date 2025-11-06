import { db } from "../config/db.js";
import bcrypt from "bcryptjs";

// GET LOGGED-IN USER PROFILE
export const getUserProfile = (req, res) => {
  const userId = req.user.id;
  const query = "SELECT fullname, email, password FROM users WHERE id = ?";

  db.query(query, [userId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "User not found" });

    const user = result[0];
    res.status(200).json({
      success: true,
      user: {
        fullname: user.fullname,
        email: user.email,
        password: user.password, // hashed password
      },
    });
  });
};

// UPDATE LOGGED-IN USER PROFILE
export const updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { fullname, password } = req.body;

  
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;      // Password Regex 

 
  if (password && !passwordRegex.test(password)) {                    // Validating password 
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long, include one uppercase, one lowercase, one number, and one special character.",
    });
  }

  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const query = password
      ? "UPDATE users SET fullname = ?, password = ? WHERE id = ?"
      : "UPDATE users SET fullname = ? WHERE id = ?";

    const params = password
      ? [fullname, hashedPassword, userId]
      : [fullname, userId];

    db.query(query, params, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
      });
    });
  } catch (err) {
    console.error("Error updating user:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
