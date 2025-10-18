import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/public/Homepage";
import Servicespage from "../pages/public/Servicespage";

const PublicRoutes = () => (
  <Routes>
    <Route path="/" element={<Homepage />} />
    <Route path="/services" element={<Servicespage />} />
  </Routes>
);

export default PublicRoutes;
