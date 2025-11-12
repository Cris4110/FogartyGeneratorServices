import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import UserManagementPage from "../pages/admin/UserManagementPage";
import AppointmentRequest from "../pages/admin/AppointmentRequest";
import InventoryManagement from "../pages/admin/InventoryManagement";
import CreateItem from "../pages/admin/CreateItem";

const AdminRoutes = () => (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/user-management" element={<UserManagementPage/>} />
      <Route path="/incoming/appointments" element={<AppointmentRequest />} />
      <Route path="/inven-management" element={<InventoryManagement />} />
      <Route path="/create-item" element={<CreateItem />} />
    </Routes>

);

export default AdminRoutes;
