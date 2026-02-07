import { useState, useEffect } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Typography,
  Container,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import logo from "../../assets/logo.png";

interface Generator {
  _id: string;
  name?: string;
  Description?: string;
  Stock: number;
}

interface Part {
  _id: string;
  Part_Name?: string;
  Stock: number;
}

function CurrentStockPage() {
  const [generators, setGenerators] = useState<Generator[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState("");
  
  // Fetch Generators
  useEffect(() => {
    fetch("http://localhost:3000/api/generators")
      .then((res) => res.json())
      .then((data) => setGenerators(data))
      .catch((err) => console.error("Error fetching generators:", err));
  }, []);

  // Fetch Parts
  useEffect(() => {
    fetch("http://localhost:3000/api/parts")
      .then((res) => res.json())
      .then((data) => setParts(data))
      .catch((err) => console.error("Error fetching parts:", err));
  }, []);

  // Filter + Sort Generators
  const filteredGenerators = generators
  .filter((gen) =>
    (gen.name ?? "").toLowerCase().includes(searchText.toLowerCase())
  )
  .sort((a, b) => {
    if (!a.name || !b.name) return 0;
    if (sortOption === "a-z") return a.name.localeCompare(b.name);
    if (sortOption === "z-a") return b.name.localeCompare(a.name);
    return 0;
  });


  // Filter + Sort Parts
  const filteredParts = parts
  .filter((part) =>
    (part.Part_Name ?? "").toLowerCase().includes(searchText.toLowerCase())
  )
  .sort((a, b) => {
    if (!a.Part_Name || !b.Part_Name) return 0;
    if (sortOption === "a-z") return a.Part_Name.localeCompare(b.Part_Name);
    if (sortOption === "z-a") return b.Part_Name.localeCompare(a.Part_Name);
    return 0;
  });

  return (
    <>
      {/* ===== Navbar Section ===== */}
      <Navbar />
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

        {/* Search + Sort Bar */}
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
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <TextField
            select
            label="Sort By:"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            sx={{ width: "30%", backgroundColor: "white", borderRadius: 1 }}
          >
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="a-z">A-Z</MenuItem>
            <MenuItem value="z-a">Price Low-High <Low-High></Low-High></MenuItem>
          </TextField>
        </Box>

        {/* Generators Section */}
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Generators
        </Typography>
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {filteredGenerators.length === 0 ? (
            <Typography>No generators available</Typography>
          ) : (
            filteredGenerators.map((gen) => (
              <Grid item xs={12} sm={6} md={4} key={gen._id}>
                <Card sx={{ textAlign: "center", boxShadow: 2, borderRadius: 3, p: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: "#FFFACD",
                      height: 150,
                      borderRadius: 2,
                      mb: 2,
                    }}
                  ></Box>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {gen.name}
                    </Typography>
                    <Typography variant="body2">
                      {gen.Description ?? "No description"}
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
              </Grid>
            ))
          )}
        </Grid>

        {/* Parts Section */}
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Parts
        </Typography>
        <Grid container spacing={4}>
          {filteredParts.length === 0 ? (
            <Typography>No parts available</Typography>
          ) : (
            filteredParts.map((part) => (
              <Grid item xs={12} sm={6} md={4} key={part._id}>
                <Card sx={{ textAlign: "center", boxShadow: 2, borderRadius: 3, p: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: "#FFCDD2",
                      height: 150,
                      borderRadius: 2,
                      mb: 2,
                    }}
                  ></Box>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {part.Part_Name}
                    </Typography>
                    <Typography variant="body2">
                      In stock: {part.Stock}
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
              </Grid>
            ))
          )}
        </Grid>
      </Container>

      <Footer />
    </>
  );
}

export default CurrentStockPage;
