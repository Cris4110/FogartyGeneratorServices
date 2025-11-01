import Navbar from "../admin/AdminNavbar";
import { Box } from "@mui/material";

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Box sx={{ marginLeft: "13vw", flexGrow: 1, p: 4 }}>
        <h1></h1>
      </Box>
    </Box>
  );
};

export default Dashboard;