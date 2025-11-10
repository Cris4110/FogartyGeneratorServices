import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import UserManagementPage from "../pages/admin/UserManagementPage";

const AdminRoutes = () => (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/user-management" element={<UserManagementPage/>} />
    </Routes>

);

export default AdminRoutes;
