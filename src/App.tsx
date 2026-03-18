import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/publicroutes";
import AdminRoutes from "./routes/adminroutes";
<<<<<<< Updated upstream
import Login from "./pages/public/UserLogin";
import ProtectedRoute from "./component/ProtectedRoute";
=======
import Login from "./auth/admin/Login"; 
import ProtectedRoute from "./component/ProtectedRoute"; 
import AdminRegistration from "./routes/userregroute";
>>>>>>> Stashed changes
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ForgotPassword from "./pages/public/ForgotPassword";



const App: React.FC = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <Routes>
          {/* Public portal: Home, Request Quote, etc. */}
          <Route path="/*" element={<PublicRoutes />} />
<<<<<<< Updated upstream

=======
          
>>>>>>> Stashed changes
          {/* Login page */}
          <Route path="/userlogin" element={<Login />} />

<<<<<<< Updated upstream
          {/* ADD THIS LINE HERE */}
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* PROTECTED: Admin routes */}
          <Route
            path="/admin/*"
=======
          {/* PROTECTED: Admin Registration */}
          <Route 
            path="/adminreg" 
>>>>>>> Stashed changes
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminRegistration />
              </ProtectedRoute>
            } 
          />

          {/* PROTECTED: Admin Dashboard and sub-routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminRoutes />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
};

export default App;