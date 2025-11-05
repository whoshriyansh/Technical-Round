import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Home from "./components/Home";
import Login from "./components/Login";
import { useAuth } from "./hooks/AuthContext";
import Dashboard from "./components/Dashboard";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />; // No? Kick to login!
  }

  return children;
};

const AuthRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route
          path="/dashboard" // Locked room
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />{" "}
      </Routes>
    </BrowserRouter>
  );
};

export default AuthRoutes;
