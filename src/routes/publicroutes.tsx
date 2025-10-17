import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/public/Homepage";


const PublicRoutes = () => (

    <Routes>
        <Route path="/" element={<Homepage />} />
    </Routes>

);

export default PublicRoutes;
