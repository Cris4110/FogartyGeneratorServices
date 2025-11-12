import { Box, Typography, Button, Stack, AppBar, Drawer } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/Appcontext";
import logo from "../../assets/logo.png";

const SubmitButtonStyle: SxProps<Theme> = {
  width: "150px",
  height: "50px",
};

const navItems = [
  { label: "Dashboard", path: "/admin/" },
  { label: "Incoming\nRequests", path: "/admin/incoming-requests" },
  { label: "Catalog\nManagement", path: "/admin/catalog-management" },
  { label: "User\nManagement", path: "/admin/user-management" },
  { label: "Inventory\nManagement", path: "/admin/inven-management" },
];

const AdminNavbar = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

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

  return (
    <>
    <Typography
      variant="h3"
      sx={{
        mt: 6,
        ml: 35,
        fontWeight: "bold",
        color: "#1976d2",
        whiteSpace: "nowrap",
      }}
    >
      Admin Portal
    </Typography>
   
    <AppBar>
    <Drawer
        sx={{
          width: "13vw",
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: "13vw",
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        
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
        </Box>

        <Stack spacing={4} sx={{ ml: 3 }}>
          {navItems.map((item) => (
            <Typography
              key={item.label}
              variant="h5"
              sx={{
                whiteSpace: "pre-line",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": { color: "#1976d2" },
              }}
              onClick={() => handleNavigation(item.path)}
            >
              {item.label}
            </Typography>
          ))}
        </Stack>
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
    </Drawer>
    </AppBar>
    </>
  );
};

export default AdminNavbar;