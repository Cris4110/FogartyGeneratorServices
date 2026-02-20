import React, { useEffect, useState } from "react";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { CircularProgress, Stack, Typography, Box  } from "@mui/material";
import Navbar from "./AdminNavbar";

// admin review management page
function ReviewManagement() {
    // tracks if the rows are loaded or not
    const [rowsLoaded, setRowLoaded] = useState(false);
    const handleRowsLoading = () => {
      setRowLoaded(false);
    }
    const handleRowsLoaded = () => {
      setRowLoaded(true);
    }

  const getReviews = async () => {
    const res = await fetch("http://localhost:3000/api/reviews", {
      method: "GET"
    });

    // array of reviews is returned
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    let tmp = new Array(data.length);
    // converts the reviews to the list format
    for (let i = 0; i < data.length; i++) {
      let review = data[i];
      tmp[i] = {
        id: review.id || review._id,
        name: review.name ?? "",
        rating: review.rating ?? "",
        comment: review.comment ?? "",
        date: review.createdAt ?? "",
        isVerified: review.verified ?? false,
      }
    }
    updateRows(tmp);
    handleRowsLoaded();
  }

  useEffect(() => {
    const fetchReviews = async () => {
      try {
          getReviews();
      } catch (err: any) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  // column headings for table
  const columns: GridColDef[] = [
      { field: "name", headerName: "Name", width: 200, editable: false },
      { field: "rating", headerName: "Rating", width: 150, editable: false },
      { field: "date", headerName: "Date Created", width: 150, editable: false },
      { field: "isVerified", headerName: "Verified", width: 150, editable: false },
      { field: "comment", headerName: "Review", width: 500, editable: false },
    ];
    
  // used to set up rows and update according to db
  const [rows, updateRows] = useState([
    { name: '', rating: 1, comment: '', date: 2022-12-12, isVerified: false },
  ]);

  return ( 
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Navbar />
      <Box
          sx={{ flexGrow: 1, marginLeft: "13vw", p: 8, backgroundColor: "#fafafa" }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mb: 4, color: "#000000ff" }}
        >
          Review Management
        </Typography>
        
        <Box>
          {/* Table settings */}
          <div>
          {
            rowsLoaded ? 
            <DataGrid
              style={{ height: '80vh' }}
              rows={rows}
              columns={columns}
              getEstimatedRowHeight={() => 200}
              getRowHeight={() => 'auto'} 
              hideFooterPagination={true}
              sx={{
                '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
                  py: 1,
                },
                '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
                  py: '15px',
                },
                '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
                  py: '22px',
                },
              }}
              pageSizeOptions={[5]}
              disableRowSelectionOnClick
            />
            :
            //While it is fetching the data a loading icon appears
            <Stack direction="row" spacing={20} sx={{justifyContent: "center", alignItems: "center"}}>
              <CircularProgress color="inherit" />
            </Stack>
          }
          </div>
        </Box>
      </Box>
    </Box>
  );
}

export default ReviewManagement;