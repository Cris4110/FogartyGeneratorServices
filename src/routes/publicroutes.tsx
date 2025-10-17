import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/public/Homepage";
import About from "../pages/public/About";


const PublicRoutes = () => (

    <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
    </Routes>

);

export default PublicRoutes;
