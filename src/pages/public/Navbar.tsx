import { useEffect, useState } from "react";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import logo from "../../assets/logo_notext.png";
import type { Theme } from "@emotion/react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  type SxProps,
  Typography,
} from "@mui/material";

type User = { id: string; name?: string; email: string; role?: string };

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api",
  withCredentials: true, // so the JWT cookie goes with requests
});

//const pages = ['Home', 'About', 'Services', 'Contact', 'FAQ'];
//updated pages to include labels and paths,
const pages = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/Contactpage" },
  { label: "FAQ", to: "/faq" },
];


function Navbar() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  // On first render, try to hydrate from cookie via /users/me
  useEffect(() => {
  let cancelled = false;
  api.get("/users/me")
    .then(res => !cancelled && setCurrentUser(res.data.user as User))
    .catch(() => !cancelled && setCurrentUser(null))
    .finally(() => !cancelled && setAuthReady(true));
  return () => { cancelled = true; };
}, []);

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
      setCurrentUser(null);
      // optional: window.location.href = "/"; // hard redirect if you want
    } catch {
      // ignore; keep UI as logged out
      setCurrentUser(null);
    }
  };
  const ImageStyle: SxProps<Theme> = {
    width: "100px",
    height: "100px",
    alignSelf: "center",
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box component="img" src={logo} alt="logo" sx={ImageStyle} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Fogarty Onsite Generator Service
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.label}//updated to use page.label
                component={NavLink}//added NavLink component for routing
                to={page.to}//updated to use page.to, the route path per label
                end={page.to === '/'} //ensures exact matching for home route
                sx={{ my: 2, color: 'black', display: 'block' }}
              >
                {page.label} 
              </Button>
            ))}
          </Box>
          {!authReady ? (
          // this part needed cause navbar flashes log in button before hiding it
          null
        ) : currentUser ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <Button
                    color="inherit"
                    component={NavLink}
                    to="/usersettings"
                    end
                    sx={{ textTransform: "none" }}
                  >
                    Settings
                  </Button>
                  <Typography variant="caption" sx={{ mt: 0.5, color: "text.secondary" }}>
                    Hello,&nbsp;<strong>{currentUser.name ?? currentUser.email}</strong>
                  </Typography>
                </Box>
              </Box>

              {/* Cart only when logged in, and last */}
              <Button
                 color="inherit"
                onClick={handleLogout}
                //disabled={loggingOut}
              >
                Cart
              </Button>
            </>
          ) : (
            <Button
              color="inherit"
              component={NavLink}
              to="/userlogin"
              end
              sx={{ textTransform: "none" }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;