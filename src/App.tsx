import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/publicroutes";
import AdminRoutes from "./routes/adminroutes";
import Login from "./auth/admin/Login";
import ProtectedRoute from "./routes/protectedroute";
import { AuthProvider } from "./context/Appcontext"; // ensure AuthProvider is imported
import AdminRegistration from "./routes/userregroute";

const App: React.FC = () => {
  return (

      <BrowserRouter>
        <Routes>
          {/* Public portal */}
          <Route path="/*" element={<PublicRoutes />} />
          {/*Admin User Reg*/}
          <Route path="/adminreg" element={<AdminRegistration />} />
          {/* Login page */}
          <Route path="/login" element={<Login />} />

          {/* Admin portal (protected) */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminRoutes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>

  );
};

export default App;