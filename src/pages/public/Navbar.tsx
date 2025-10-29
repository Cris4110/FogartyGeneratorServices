import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import logo from "../../assets/logo_notext.png";
import type { Theme } from "@emotion/react";
import { NavLink } from "react-router-dom";
import {
  Box,
  Button,
  type SxProps,
  Typography,
} from "@mui/material";

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

          <Button //route button to login page
            color="inherit"
            //When login oage is ready, uncomment below and add correct to 'path'
            component={NavLink}
            to="/UserRegistration"
            end
            >Login
          </Button>
          
          <Button color="inherit"
            //When cart page is ready, uncomment below and add correct to 'path'
            //component={NavLink}
            //to="/cart"
            //end 
            >Cart
          </Button>
            

        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;