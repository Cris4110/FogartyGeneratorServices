import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import InventoryManagement from "../pages/admin/InventoryManagement";
import CreateItem from "../pages/admin/CreateItem";

const AdminRoutes = () => (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/inven-management" element={<InventoryManagement />} />
      <Route path="/create-item" element={<CreateItem />} />
    </Routes>

);

export default AdminRoutes;
