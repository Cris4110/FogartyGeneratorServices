import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import InventoryManagement from "../pages/admin/InventoryManagement";
import CreateGenerator from "../pages/admin/CreateGen";
import CreatePart from "../pages/admin/CreatePart";

const AdminRoutes = () => (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/inven-management" element={<InventoryManagement />} />
      <Route path="/create-gen" element={<CreateGenerator />} />
      <Route path="/create-part" element={<CreatePart />} />
    </Routes>

);

export default AdminRoutes;
