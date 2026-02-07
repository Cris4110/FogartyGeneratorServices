import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import UserManagementPage from "../pages/admin/UserManagementPage";
import AppointmentRequest from "../pages/admin/AppointmentRequest";
import InventoryManagement from "../pages/admin/InventoryManagement";
//import CreateItem from "../pages/admin/CreateItem";
import ReviewedAppointments from "../pages/admin/ReviewedAppointments";
import CreateGenerator from "../pages/admin/CreateGen";
import CreatePart from "../pages/admin/CreatePart";
import ReviewManagement from "../pages/admin/ReviewManagement";

const AdminRoutes = () => (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/user-management" element={<UserManagementPage/>} />
      <Route path="/incoming/appointments" element={<AppointmentRequest />} />
      <Route path="/inven-management" element={<InventoryManagement />} />
      
      <Route path="/reviewed" element={<ReviewedAppointments />} />
      <Route path="/create-gen" element={<CreateGenerator />} />
      <Route path="/create-part" element={<CreatePart />} />
      <Route path="/review-management" element={<ReviewManagement />} />
    </Routes>

);

export default AdminRoutes;
