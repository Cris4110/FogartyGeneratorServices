import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        bgcolor: "Gray",
        color: "white",
        py: 3,
        px: 30,
        textAlign: "left",
        mt: "auto",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Fogarty Onsite Generator Service
      </Typography>
      <Typography variant="body2">Contact Hours:</Typography>
      <Typography variant="body2">Phone: (971) 244-2450</Typography>
      <Typography variant="body2">© {new Date().getFullYear()} Fogarty Onsite Generator Service. All rights reserved.</Typography>
    </Box>
  );
}

export default Footer;