import Navbar from "../admin/AdminNavbar";
// Import the standard Grid that works in all MUI v5 versions
<<<<<<< Updated upstream
import { Box, Typography, CircularProgress, Grid, Card, CardContent, Button } from "@mui/material";
=======
import { Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
>>>>>>> Stashed changes
import { useAuth } from "../../context/Appcontext"; 
import { Navigate, useNavigate } from "react-router-dom";
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import EventNoteIcon from '@mui/icons-material/EventNote';
<<<<<<< Updated upstream
=======
import React, { useEffect, useMemo, useState } from 'react';
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";

interface ReviewedAppointment {
  _id: string;
  appointmentDateTime: string;
  name: string;
  phone: string;
  email: string; 
  rescheduledDateTime?: string | null;
}
const formatISO = (iso?: string | null) => {
  if (!iso) return "-";
  const dt = dayjs(iso);
  return dt.isValid() ? dt.format("MMM DD, YYYY @ h:mm A") : "-";
};

const formatISO2 = (iso?: string | null) => {
  if (!iso) return "-";
  const dt = dayjs(iso);
  return dt.isValid() ? dt.format("MMM DD, YYYY") : "-";
};

interface ReviewRow {
      id: string;
      name: string;
      rating: string | number;
      comment: string;
      date: string;
      isVerified: boolean;
      service: string;
};
>>>>>>> Stashed changes


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
<<<<<<< Updated upstream
=======

  if (!currentUser) {
    return <Navigate to="/userlogin" replace />;
  }

   const [pendingAppointCount, setAppointPendingCount] = useState<number>(0); // displays appointments that are status: pending
  const [pendingQuoteCount, setQuotePendingCount] = useState<number>(0); // displays quote requests that are not acknowledged (acknowledged = false)
  const [pendingPartCount, setPartPendingCount] = useState<number>(0); // displays part requests with status: To-do
>>>>>>> Stashed changes

  if (!currentUser) {
    return <Navigate to="/userlogin" replace />;
  }

  const quickActions = [
    { title: "Manage Users", icon: <PeopleIcon fontSize="large" color="primary" />, path: "/admin/user-management" },
    { title: "Inventory", icon: <InventoryIcon fontSize="large" color="primary" />, path: "/admin/inven-management" },
    { title: "Appointments", icon: <EventNoteIcon fontSize="large" color="primary" />, path: "/admin/incoming/appointments" },
  ];

<<<<<<< Updated upstream
  return (
    <Box sx={{ display: "flex", backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
=======
  // useEffect and table for reviews
    const getReviews = async () => {
      const res = await fetch("http://localhost:3000/api/reviews", {method: "GET"});
      // array of reviews is returned
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
  
      const tmp: ReviewRow[] = data.map((review: any) => ({
        id: String(review.id || review._id),
        name: review.name ?? "",
        rating: review.rating ?? "",
        comment: review.comment ?? "",
        date: review.createdAt ? new Date(review.createdAt).toISOString().slice(0, 10) : "",
        isVerified: review.verified ?? false,
        service: review.service ?? "N/A",
      }));
      setRowsReview(tmp);
      setLoading(true);
    };
    
    useEffect(() => {
      (async () => {
        try {
          setLoading(false);
          await getReviews(); 
        } catch (err: any) {
          console.error("Error fetching reviews:", err);
          setLoading(true);
        }
      })();
    }, []);

  // filtering logic for reviews
  const filteredReviews = useMemo(() => {
    if (timeframe === 'all') return rowsReview;

    const now = new Date();
    const cutoff = new Date();

    if (timeframe === 'week') cutoff.setDate(now.getDate() - 7);
    else if (timeframe === 'month') cutoff.setMonth(now.getMonth() - 1);
    else if (timeframe === 'year') cutoff.setFullYear(now.getFullYear() - 1);

    return rowsReview.filter((row) => {
      if (!row.date) return false;
      const reviewDate = new Date(row.date);
      return reviewDate >= cutoff;
    });
  }, [timeframe, rowsReview]);
    
    // view card for reviews
    const [openReview, setOpenReview] = useState(false);
    const [activeReview, setActiveReview] = useState<ReviewRow | null>(null);
    const handleOpenReview = (row: ReviewRow) => {
      setActiveReview(row);
      setOpenReview(true);
    };

    const handleCloseReview = () => {
      setOpenReview(false);
      setActiveReview(null);
    };

    const columnReview: GridColDef[] = [
      { field: "date", headerName: "Date Created", width: 150, editable: false,
        valueFormatter: (value) => {
          if (!value) return '';
          return formatISO2(value); 
        }, 
      },
      { field: "name", headerName: "Name", width: 200, editable: false },
      { field: "view", headerName: "View", width: 90, sortable: false, filterable: false,
        renderCell: (params: any) => (
          <Button
            size="small"
            variant="outlined"
            onClick={() => handleOpenReview(params.row as ReviewRow)}
          >
            View
          </Button>
        ),
      },
      { field: "rating", headerName: "Rating", width: 150, editable: false },
      { field: "service", headerName: "Service", width: 150, editable: false },      
    ];

   return (
    <Box sx={{ display: "flex", backgroundColor: "#fafafa" }}>
>>>>>>> Stashed changes
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