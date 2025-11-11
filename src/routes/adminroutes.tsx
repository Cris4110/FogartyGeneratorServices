import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import UserManagementPage from "../pages/admin/UserManagementPage";
import AppointmentRequest from "../pages/admin/AppointmentRequest";

const AdminRoutes = () => (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/user-management" element={<UserManagementPage/>} />
      <Route path="/incoming/appointments" element={<AppointmentRequest />} />
    </Routes>

);

export default AdminRoutes;
