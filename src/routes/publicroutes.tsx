import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/public/Homepage";
import About from "../pages/public/About";
import FAQ from "../pages/public/FAQ";
import ContactPage from "../pages/public/ContactPage";

const PublicRoutes = () => (

    <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/ContactPage" element={<ContactPage />} />
    </Routes>

);

export default PublicRoutes;
