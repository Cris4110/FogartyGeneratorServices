import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import logo from "../../assets/logo_notext.png";
import type { Theme } from "@emotion/react";
import {
  Box,
  Button,
  type SxProps,
  Typography,
} from "@mui/material";

const pages = ['Home', 'About', 'Services', 'Contact', 'FAQ'];

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
                key={page}
                sx={{ my: 2, color: 'black', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Button color="inherit">Login</Button>
          <Button color="inherit">Cart</Button>
          
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;