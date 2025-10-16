import { Box, Typography, Button, Stack } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/Appcontext";
import logo from "../../assets/logo.png";

const SubmitButtonStyle: SxProps<Theme> = {
  width: "150px",
  height: "50px",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleLogout = () => {
    auth?.setCurrentUser(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Box 
      sx={{
        width: "10vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        backgroundColor: "#f5f5f5",
        p: 4,
      }} >
      <Box 
        sx={{ 
          display: "flex", 
          alignItems: "center", 
          gap: 4, 
          mb: 6 
        }}>
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{
            width: 200,
            height: 200,
          }}/>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            whiteSpace: "nowrap",
            position: 'relative', top: '-100px' 
          }}>
          Admin Portal
        </Typography>
      </Box>

      <Stack spacing={4} sx={{ ml: 3 }}>
        <Typography variant="h5" sx={{ whiteSpace: "pre-line" }}>
          {"Dashboard"}
        </Typography>
        <Typography variant="h5" sx={{ whiteSpace: "pre-line" }}>
          {"Incoming\nRequests"}
        </Typography>
        <Typography variant="h5" sx={{ whiteSpace: "pre-line" }}>
          {"Catalog\nManagement"}
        </Typography>
        <Typography variant="h5" sx={{ whiteSpace: "pre-line" }}>
          {"User\nManagement"}
        </Typography>
      </Stack>
      
      <Box
        sx={{
          position: "absolute",
          bottom: 50,
          left: 50,
        }}>
        <Button
          variant="contained"
          color="primary"
          sx={SubmitButtonStyle}
          onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;