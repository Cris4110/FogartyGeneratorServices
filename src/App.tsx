
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./routes/protectedroute";
import { AuthProvider } from "./context/Appcontext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<Login />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;