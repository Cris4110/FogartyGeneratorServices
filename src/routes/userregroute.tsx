import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/public/UserRegistration";

const UserRegistration: React.FC = () => (
    <Routes>
      <Route path="/UserRegistration" element={<Dashboard />} />
    </Routes>

);

export default UserRegistration;
