import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";

const AdminRoutes = () => (
    <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>

);

export default AdminRoutes;
