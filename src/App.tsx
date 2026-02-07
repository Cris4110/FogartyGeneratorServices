import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicRoutes from "./routes/publicroutes";
import AdminRoutes from "./routes/adminroutes";
import Login from "./auth/admin/Login";
import ProtectedRoute from "./routes/protectedroute";
import AdminRegistration from "./routes/userregroute";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const App: React.FC = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <Routes>
          {/* Public portal */}
          <Route path="/*" element={<PublicRoutes />} />

          {/* Admin User Reg */}
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
    </LocalizationProvider>
  );
};

export default App;
