import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
    const [view, setView] = useState("users");
    const [users, setUsers] = useState([]);
    const [movies, setMovies] = useState([]);
    const [newMovie, setNewMovie] = useState({ title: "", release_year: "", created_by: "" });
    const [userMessage, setUserMessage] = useState("");
    const [movieMessage, setMovieMessage] = useState("");


    const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            setUserMessage("User deleted successfully!");

            return;
        }
        view === "users" ? fetchUsers() : fetchMovies();
    }, [view]);

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${backendURL}/api/admin/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(res.data.users);
        } catch {
            setUserMessage("Failed to load or delete users.");

        }
    };

    const fetchMovies = async () => {
        try {
            const res = await axios.get(`${backendURL}/api/admin/movies`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMovies(res.data.movies);
        } catch {
            setMovieMessage("Failed to load movies.");
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`${backendURL}/api/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUserMessage("User deleted successfully!");
            fetchUsers();
        } catch (error) {
            console.error("Delete user error:", error.response?.data || error.message);
            setUserMessage(error.response?.data?.message || "Failed to delete user.");
        }
    };

    const handleDeleteMovie = async (movie_id) => {
        try {
            const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
            const token = localStorage.getItem("token");

            console.log("Deleting movie with ID:", movie_id); // 🧠 check ID

            await axios.delete(`${backendURL}/api/admin/movies/${movie_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMovieMessage("Movie deleted successfully!");
            fetchMovies();
        } catch (error) {
            console.error("Delete movie error:", error.response?.data || error.message);
            setMovieMessage(error.response?.data?.message || "❌ Failed to delete movie.");
        }
    };



    const handleAddMovie = async (e) => {
        e.preventDefault();

        try {
            const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
            const token = localStorage.getItem("token");

            if (!newMovie.title || !newMovie.release_year) {
                console.log("Validation failed:", newMovie);
                setMovieMessage("Please enter both title and release year.");
                return;
            }

            const payload = {
                title: newMovie.title.trim(),
                release_year: newMovie.release_year.trim(),
                created_by: newMovie.created_by.trim() || "Admin",
            };

            console.log("Sending movie payload:", payload);

            await axios.post(`${backendURL}/api/admin/movies`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMovieMessage("Movie added successfully!");
            setNewMovie({ title: "", release_year: "" });
            fetchMovies();
        } catch (error) {
            console.error("Add movie error:", error.response?.data || error.message);
            setMovieMessage(error.response?.data?.message || "Failed to add movie.");
        }
    };




    return (
        <div style={{ display: "flex" }}>
            {/* Sidebar */}
            <div
                style={{
                    width: "220px",
                    backgroundColor: "#1f2937",
                    color: "white",
                    height: "100vh",
                    padding: "1rem",
                }}
            >
                <h4 style={{ marginBottom: "2rem" }}>Admin Panel</h4>
                <button
                    onClick={() => setView("users")}
                    className="btn btn-outline-light w-100 mb-2"
                >
                    User List
                </button>
                <button
                    onClick={() => setView("movies")}
                    className="btn btn-outline-light w-100 mb-2"
                >
                    Movies List
                </button>
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/";
                    }}
                    className="btn btn-danger w-100"
                >
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: "2rem" }}>
                <h2>Admin Dashboard</h2>
                {userMessage && <div className="alert alert-info">{userMessage}</div>}
                {movieMessage && <div className="alert alert-info">{movieMessage}</div>}


                {view === "users" ? (
                    <>
                        <h4>User List</h4>
                        <table className="table table-bordered mt-3">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id}>
                                        <td>{u.id}</td>
                                        <td>{u.fullname}</td>
                                        <td>{u.email}</td>
                                        <td>{u.role}</td>
                                        <td>
                                            <button
                                                onClick={() => handleDeleteUser(u.id)}
                                                className="btn btn-danger btn-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <>
                        <h4>Add Movie</h4>
                        <form onSubmit={handleAddMovie} className="mb-4">
                            <input
                                type="text"
                                placeholder="Title"
                                className="form-control mb-2"
                                value={newMovie.title}
                                onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Year of Release"
                                className="form-control mb-2"
                                value={newMovie.release_year}
                                onChange={(e) => setNewMovie({ ...newMovie, release_year: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Created By"
                                className="form-control mb-2"
                                value={newMovie.created_by}
                                onChange={(e) => setNewMovie({ ...newMovie, created_by: e.target.value })}
                            />
                            <button type="submit" className="btn btn-success w-100">
                                Add Movie
                            </button>
                        </form>

                        <h4>Movies List</h4>
                        <table className="table table-bordered mt-3">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Release Year</th>
                                    <th>Created By</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movies.map((movie) => (
                                    <tr key={movie.movie_id}>
                                        <td>{movie.movie_id}</td>
                                        <td>{movie.title}</td>
                                        <td>{movie.release_year}</td>
                                        <td>{movie.created_by}</td>
                                        <td>
                                            <button
                                                onClick={() => handleDeleteMovie(movie.movie_id)}
                                                className="btn btn-danger btn-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
}
