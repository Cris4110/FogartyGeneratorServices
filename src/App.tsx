import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/publicroutes";
import AdminRoutes from "./routes/adminroutes";
import Login from "./auth/admin/Login"; 
import ProtectedRoute from "./component/ProtectedRoute"; 
import AdminRegistration from "./routes/userregroute";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const App: React.FC = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <Routes>
          {/* Public portal: Home, Request Quote, etc. */}
          <Route path="/*" element={<PublicRoutes />} />
          
          {/* Login page */}
          <Route path="/login" element={<Login />} />

          {/* PROTECTED: Admin Registration */}
          <Route 
            path="/adminreg" 
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