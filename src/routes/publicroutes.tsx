import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/public/Homepage";
import Servicespage from "../pages/public/Servicespage";
import About from "../pages/public/About";
import FAQ from "../pages/public/FAQ";
import ContactPage from "../pages/public/ContactPage";
import RequestQuote from "../pages/public/RequestQuote";
import UserSettings from "../pages/public/UserSettings";
import Appointment from "../pages/public/Appointment";
import YourAccount from "../pages/public/YourAccount";
import YourOrders from "../pages/public/YourOrders";
import ReturnPage from "../pages/public/ReturnPage";


const PublicRoutes = () => (

    <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/ContactPage" element={<ContactPage />} />
        <Route path="/services" element={<Servicespage />} />
        <Route path="/RequestQuote" element={<RequestQuote />} />

        <Route path="/UserSettings" element={<UserSettings />} />
        <Route path="/Appointment" element={<Appointment />} />
        <Route path="/YourAccount" element={<YourAccount />} />
        <Route path="/YourOrders" element={<YourOrders />} />
        <Route path="/ReturnPage" element={<ReturnPage />} />

    </Routes>

);

export default PublicRoutes;
