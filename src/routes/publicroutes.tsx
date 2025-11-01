import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/public/Homepage";
import Servicespage from "../pages/public/Servicespage";
import About from "../pages/public/About";
import FAQ from "../pages/public/FAQ";
import ContactPage from "../pages/public/ContactPage";
import RequestQuote from "../pages/public/RequestQuote";
import UserSettings from "../pages/public/UserSettings";
import UserRegistration from "../pages/public/UserRegistration";
import UserLogin from "../pages/public/UserLogin";
import Appointment from "../pages/public/Appointment";
import CurrentStockPage from "../pages/public/CurrentStockPage";
import YourAccount from "../pages/public/YourAccount";
import YourOrders from "../pages/public/YourOrders";
import ReturnPage from "../pages/public/ReturnPage";
import UsernameChange from "../pages/public/UsernameChange";
import NameChange from "../pages/public/NameChange"
import EmailChange from "../pages/public/EmailChange"
import PhoneNumberChange from "../pages/public/PhoneNumberChange"
import PasswordChange from "../pages/public/PasswordChange"


const PublicRoutes = () => (

    <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/FAQ" element={<FAQ />} />
        <Route path="/ContactPage" element={<ContactPage />} />
        <Route path="/services" element={<Servicespage />} />
        <Route path="/RequestQuote" element={<RequestQuote />} />

        <Route path="/UserSettings" element={<UserSettings />} />
        <Route path="/UserRegistration" element={<UserRegistration />} />
        <Route path="/UserLogin" element={<UserLogin />} />
        <Route path="/Appointment" element={<Appointment />} />
        <Route path="/CurrentStockPage" element={<CurrentStockPage />} />
        <Route path="/YourAccount" element={<YourAccount />} />
        <Route path="/YourOrders" element={<YourOrders />} />
        <Route path="/ReturnPage" element={<ReturnPage />} />

        <Route path="/UsernameChange" element={<UsernameChange />} />
        <Route path="/NameChange" element={<NameChange />} />
        <Route path="/EmailChange" element={<EmailChange />} />
        <Route path="/PhoneNumberChange" element={<PhoneNumberChange />} />
        <Route path="/PasswordChange" element={<PasswordChange />} />

    </Routes>

);

export default PublicRoutes;
