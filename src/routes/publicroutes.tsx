import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/public/Homepage";
import Servicespage from "../pages/public/Servicespage";
import About from "../pages/public/About";
import FAQ from "../pages/public/FAQ";
import ContactPage from "../pages/public/ContactPage";
import RequestQuote from "../pages/public/RequestQuote";

const PublicRoutes = () => (

    <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/ContactPage" element={<ContactPage />} />
        <Route path="/services" element={<Servicespage />} />
        <Route path="/RequestQuote" element={<RequestQuote />} />

    </Routes>

);

export default PublicRoutes;
