import { useEffect, useState } from "react";
import axios from "axios";

export default function UserDashboard() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("Access Denied. There is No token provided.");
        return;
      }
      try {
        const backendURL =
          process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
        const res = await axios.get(`${backendURL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          fullname: res.data.user.fullname,
          email: res.data.user.email,
          password: res.data.user.password, // hashed password
        });
      } catch {
        setMessage("Error fetching user details.");
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    // Frontend regex validation (same as backend)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (formData.password && !passwordRegex.test(formData.password)) {
      setMessage(
        "Password must be at least 8 characters long, include one uppercase, one lowercase, one number, and one special character."
      );
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const backendURL =
        process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      await axios.put(`${backendURL}/api/user/update`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Details updated successfully!");
    } catch {
      setMessage("Failed to update details.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        textAlign: "center",
        marginTop: "5rem",
        backgroundColor: "#fff",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ color: "#1976d2" }}>User Dashboard</h2>
      <form onSubmit={handleEdit}>
        <input
          type="text"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
          placeholder="Full Name"
          className="form-control mb-3"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          className="form-control mb-3"
          disabled
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter new password"
          className="form-control mb-3"
        />
        <button type="submit" className="btn btn-warning w-100">
          Save Changes
        </button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
