import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import AppointmentRequest from "../pages/admin/AppointmentRequest";

const AdminRoutes = () => (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/appointmentrequest" element={<AppointmentRequest />} />
    </Routes>

);

export default AdminRoutes;
