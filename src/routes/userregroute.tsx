import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/public/UserRegistration";
import LeaveReview from "../pages/public/LeaveReview";
import { protectedroute } from "./protectedroute";

const UserReg: React.FC = () => (
    <Routes>
      <Route path="/userreg" element={<Dashboard />} />
      <Route path="/leavereview" element={<protectedroute component={LeaveReview} />} />
    </Routes>

);

export default UserReg;
