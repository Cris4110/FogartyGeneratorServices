import Footer from "./Footer";
import Navbar from "./Navbar";
import {AppBar,Toolbar,Box,Button,Typography,Container,TextField,MenuItem,Grid,Card,CardContent,CardActions} from "@mui/material";
import logo from "../../assets/logo.png";

function CurrentStockPage() {
  return (
    <>
      {/* ===== Navbar Section ===== */}
      <Navbar />

      {/* ===== Top Navigation ===== */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Left: Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              component="img"
              src={logo}
              alt="Fogarty Logo"
              sx={{ height: 45, width: 45, borderRadius: "50%" }}
            />
            <Typography variant="h6" fontWeight={700} color="text.primary">
              Fogarty Online Generator Service
            </Typography>
          </Box>

          {/* Right: Sign In + Cart */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="text">Sign In</Button>
            <Button variant="text">Cart</Button>
          </Box>
        </Toolbar>

        {/* Navbar Links */}
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            borderTop: "1px solid #ddd",
            borderBottom: "1px solid #ddd",
          }}
        >
          {["Home", "About", "Services", "Contact", "FAQ"].map((item) => (
            <Button key={item} color="inherit" sx={{ fontWeight: 600 }}>
              {item}
            </Button>
          ))}
        </Toolbar>
      </AppBar>

      {/* ===== Main Content ===== */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 12 }}>
        {/* Page Title */}
        <Typography
          variant="h5"
          fontWeight={700}
          align="center"
          sx={{
            backgroundColor: "#FFEB3B",
            display: "inline-block",
            px: 2,
            py: 0.5,
            mb: 4,
            borderRadius: "4px",
            mx: "auto",
          }}
        >
          Current Stock
        </Typography>

        {/* Search + Sort Bar: */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 4,
          }}
        >
          <TextField
            placeholder="Search..."
            variant="outlined"
            fullWidth
            sx={{ backgroundColor: "white", borderRadius: 1 }}
          />
          <TextField
            select
            label="Sort By:"
            defaultValue=""
            sx={{ width: "30%", backgroundColor: "white", borderRadius: 1 }}
          >
            <MenuItem value="a-z">Name A-Z</MenuItem>
            <MenuItem value="z-a">Name Z-A</MenuItem>
          </TextField>
        </Box>

        {/* Stock Grid */}
        <Grid container spacing={4}>
          {[...Array(9)].map((_, index) => (
           
              <Card
                sx={{
                  textAlign: "center",
                  boxShadow: 2,
                  borderRadius: 3,
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#B3E5FC",
                    height: 150,
                    borderRadius: 2,
                    mb: 2,
                  }}
                ></Box>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>
                    PART
                  </Typography>
                  <Typography variant="h6" fontWeight={500}>
                    $500
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "black",
                      color: "white",
                      textTransform: "none",
                      "&:hover": { backgroundColor: "#333" },
                    }}
                  >
                    Add to cart
                  </Button>
                </CardActions>
              </Card>

          ))}
        </Grid>
      </Container>

      <Footer />
    </>
  );
}

export default CurrentStockPage;
