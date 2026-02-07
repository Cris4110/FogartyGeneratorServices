import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/public/UserRegistration";
import LeaveReview from "../pages/public/LeaveReview";
import { ProtectedRoute } from "./protectedroute";

const UserReg: React.FC = () => (
    <Routes>
      <Route path="/userreg" element={<Dashboard />} />
      <Route path="/leavereview" element={<ProtectedRoute component={LeaveReview} />} />
    </Routes>

);

export default UserReg;
