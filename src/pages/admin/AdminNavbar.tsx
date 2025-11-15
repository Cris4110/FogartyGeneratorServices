import { Box, Typography, Button, Stack, Collapse } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/Appcontext";
import logo from "../../assets/logo.png";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const SubmitButtonStyle: SxProps<Theme> = {
  width: "150px",
  height: "50px",
};

const AdminNavbar = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [openIncoming, setOpenIncoming] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/admins/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        auth?.setCurrentUser(null);
        navigate("/login");
      } else {
        console.error("Failed to logout:", await res.text());
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleToggleIncoming = () => {
    setOpenIncoming((prev) => !prev);
  };

  return (
    <Box
      sx={{
        width: "13vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        backgroundColor: "#f5f5f5",
        p: 4,
        position: "fixed",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          mb: 6,
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={{
            width: 200,
            height: 200,
          }}
        />
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            whiteSpace: "nowrap",
            position: "relative",
            top: "-100px",
          }}
        >
          Admin Portal
        </Typography>
      </Box>

      <Stack spacing={3} sx={{ ml: 3, width: "100%" }}>
        {/* Dashboard */}
        <Typography
          variant="h5"
          sx={{
            whiteSpace: "pre-line",
            cursor: "pointer",
            transition: "0.3s",
            "&:hover": { color: "#1976d2" },
          }}
          onClick={() => handleNavigation("/admin/")}
        >
          Dashboard
        </Typography>

        {/* Incoming Requests */}
        <Box sx={{ width: "100%" }}>
          <Box
            onClick={handleToggleIncoming}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "0.3s",
              "&:hover": { color: "#1976d2" },
            }}
          >
            <Typography variant="h5" sx={{ whiteSpace: "pre-line" }}>
              {"Incoming\nRequests"}
            </Typography>
            {openIncoming ? <ExpandLess /> : <ExpandMore />}
          </Box>

          <Collapse in={openIncoming} timeout="auto" unmountOnExit>
            <Stack spacing={2} sx={{ ml: 4, mt: 1 }}>
              <Typography
                variant="body1"
                sx={{ cursor: "pointer", "&:hover": { color: "#1976d2" } }}
                onClick={() => handleNavigation("/admin/incoming/quotes")}
              >
                Quote Requests
              </Typography>

              <Typography
                variant="body1"
                sx={{ cursor: "pointer", "&:hover": { color: "#1976d2" } }}
                onClick={() => handleNavigation("/admin/incoming/appointments")}
              >
                Appointment Requests
              </Typography>

              <Typography
                variant="body1"
                sx={{ cursor: "pointer", "&:hover": { color: "#1976d2" } }}
                onClick={() => handleNavigation("/admin/incoming/parts")}
              >
                Parts Request
              </Typography>
            </Stack>
          </Collapse>
        </Box>

        
        <Typography
          variant="h5"
          sx={{
            whiteSpace: "pre-line",
            cursor: "pointer",
            transition: "0.3s",
            "&:hover": { color: "#1976d2" },
          }}
          onClick={() => handleNavigation("/admin/reviewed")}
        >
          {"Reviewed\nAppointments"}
        </Typography>

        {/* Catalog Management */}
        <Typography
          variant="h5"
          sx={{
            whiteSpace: "pre-line",
            cursor: "pointer",
            transition: "0.3s",
            "&:hover": { color: "#1976d2" },
          }}
          onClick={() => handleNavigation("/admin/catalog-management")}
        >
          {"Catalog\nManagement"}
        </Typography>

        {/* User Management */}
        <Typography
          variant="h5"
          sx={{
            whiteSpace: "pre-line",
            cursor: "pointer",
            transition: "0.3s",
            "&:hover": { color: "#1976d2" },
          }}
          onClick={() => handleNavigation("/admin/user-management")}
        >
          {"User\nManagement"}
        </Typography>

        {/* Inventory Management */}
        <Typography
          variant="h5"
          sx={{
            whiteSpace: "pre-line",
            cursor: "pointer",
            transition: "0.3s",
            "&:hover": { color: "#1976d2" },
          }}
          onClick={() => handleNavigation("/admin/inven-management")}
        >
          {"Inventory\nManagement"}
        </Typography>
      </Stack>

      {/* Logout */}
      <Box
        sx={{
          position: "absolute",
          bottom: 50,
          left: 50,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={SubmitButtonStyle}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default AdminNavbar;
