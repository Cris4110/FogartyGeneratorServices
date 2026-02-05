import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import UserManagementPage from "../pages/admin/UserManagementPage";
import AppointmentRequest from "../pages/admin/AppointmentRequest";
import InventoryManagement from "../pages/admin/InventoryManagement";
//import CreateItem from "../pages/admin/CreateItem";
import ReviewedAppointments from "../pages/admin/ReviewedAppointments";
import CreateGenerator from "../pages/admin/CreateGen";
import CreatePart from "../pages/admin/CreatePart";
import QuoteRequests from "../pages/admin/QuoteRequests";

const AdminRoutes = () => (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/user-management" element={<UserManagementPage/>} />
      <Route path="/incoming/appointments" element={<AppointmentRequest />} />
      <Route path="/inven-management" element={<InventoryManagement />} />
      
      <Route path="/reviewed" element={<ReviewedAppointments />} />
      <Route path="/create-gen" element={<CreateGenerator />} />
      <Route path="/incoming/quotes" element={<QuoteRequests />} />
      <Route path="/create-part" element={<CreatePart />} />
  
    </Routes>

);

export default AdminRoutes;
