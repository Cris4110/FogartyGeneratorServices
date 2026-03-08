import Navbar from "../admin/AdminNavbar";
// Import the standard Grid that works in all MUI v5 versions
import { Box, Typography, CircularProgress, Grid, Card, CardContent, Button } from "@mui/material";
import { useAuth } from "../../context/Appcontext"; 
import { Navigate, useNavigate } from "react-router-dom";
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import EventNoteIcon from '@mui/icons-material/EventNote';

const Dashboard = () => {
  const { currentUser, authReady } = useAuth(); // Using authReady as discussed
  const navigate = useNavigate();

  if (!authReady) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentUser) {
    return <Navigate to="/userlogin" replace />;
  }

  const quickActions = [
    { title: "Manage Users", icon: <PeopleIcon fontSize="large" color="primary" />, path: "/admin/user-management" },
    { title: "Inventory", icon: <InventoryIcon fontSize="large" color="primary" />, path: "/admin/inven-management" },
    { title: "Appointments", icon: <EventNoteIcon fontSize="large" color="primary" />, path: "/admin/incoming/appointments" },
  ];

  return (
    <Box sx={{ display: "flex", backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Navbar />
      
      <Box sx={{ marginLeft: "15vw", flexGrow: 1, p: 6 }}>
        <Typography variant="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Welcome back, {currentUser.name}!
        </Typography>

        {/* Legacy Grid Syntax: container + item */}
<Grid container spacing={4}>
  {quickActions.map((action) => (
    <Grid 
      key={action.title} 
    
      size={{ xs: 12, sm: 6, md: 4 }} 
    >
      <Card sx={{ textAlign: 'center', p: 3, borderRadius: 3, boxShadow: 2 }}>
        <CardContent>
          <Box sx={{ mb: 2 }}>{action.icon}</Box>
          <Typography variant="h6" gutterBottom>
            {action.title}
          </Typography>
          <Button 
            variant="contained" 
            fullWidth
            onClick={() => navigate(action.path)}
            sx={{ mt: 2, textTransform: 'none' }}
          >
            Open Page
          </Button>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;