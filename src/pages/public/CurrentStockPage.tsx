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
import StockCard from "../public/StockCard";


interface Generator {
  Image_Url: string | string[] | undefined;
  _id: string;
  name?: string;
  Description?: string;
  Stock: number;
}

interface Part {
  Image_Url: string | string[] | undefined;
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
            <MenuItem value="z-a">Price Low-High </MenuItem>
          </TextField>
        </Box>

        {/* Generators Section */}
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Generators
        </Typography>
       <Grid container spacing={4}>
  {filteredGenerators.map((gen) => (
    <Grid item key={gen._id} display="flex" justifyContent="center">
      <StockCard
        id={gen._id}
        type="generator"
        title={gen.name ?? "Unnamed Generator"}
        stock={gen.Stock}
        Image_Url={gen.Image_Url} 
      />
    </Grid>
  ))}
</Grid>

        {/* Parts Section */}
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Parts
        </Typography>
        <Grid container spacing={4}>
  {filteredParts.map((part) => (
    <Grid item key={part._id} display="flex" justifyContent="center">
      <StockCard
        id={part._id}
        type="part"
        title={part.Part_Name ?? "Unnamed Part"}
        stock={part.Stock}
        Image_Url={part.Image_Url}
      />
    </Grid>
  ))}
</Grid>
      </Container>

      <Footer />
    </>
  );
}

export default CurrentStockPage;
