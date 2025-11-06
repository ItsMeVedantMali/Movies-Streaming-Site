import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(role)) {                // If logged in but not authorized for this route
    if (role === "admin") return <Navigate to="/admin-dashboard" replace />; // Redirect admin to admin dashboard if trying to open user dashboard
    return <Navigate to="/dashboard" replace />;        // Redirect normal user to user dashboard if trying to open admin routes
  }

  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />   {/*  Public Routes */}
        <Route path="/login" element={<Login />} />

        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>         {/* User Dashboard (accessible by users and admins)*/}
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>        {/* Admin Dashboard (accessible by admins only)*/} 
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} /> {/* Redirect unknown routes to login */}
      </Routes>
    </Router>
  );
}

export default App;
