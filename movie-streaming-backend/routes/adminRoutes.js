import express from "express";
import {getAllUsers,deleteUser,getAllMovies,addMovie,deleteMovie} from "../controllers/admincontroller.js";
import { verifyToken, checkAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// USERS
router.get("/users", verifyToken, checkAdmin, getAllUsers);
router.delete("/users/:id", verifyToken, checkAdmin, deleteUser);


// MOVIES
router.get("/movies", verifyToken, checkAdmin, getAllMovies);
router.post("/movies", verifyToken, checkAdmin, addMovie);
router.delete("/movies/:id", verifyToken, checkAdmin, deleteMovie);

export default router;
