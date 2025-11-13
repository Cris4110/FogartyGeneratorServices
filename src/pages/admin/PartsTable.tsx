import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Fab, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";

// displays parts table for the inventory-management page
function PartsTable() {
  /* declares name of columns and settings */
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 150, editable: true },
    { field: "type", headerName: "Type", width: 150, editable: true },
    { field: "stock", headerName: "Stock", width: 150, editable: true },
    { field: "availability", headerName: "Availability", width: 150, editable: true },
    { field: "cost", headerName: "Cost", width: 150, editable: true },
    { field: "image", headerName: "Image", width: 150,
      renderCell: (params) => (
      <img
        src={params.value || ""}
        alt="thumbnail"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          borderRadius: 8,
        }}
      />
      ),
    },
  ];

  /* random data, to be replaced with data from database */
  const [rows] = useState([
  { id: 1, name: 'name1', type: 'type1', stock: 'stock', availability: 'avail', cost: '123', image: 'https://img.freepik.com/premium-photo/section-industrial-electric-motor-3d-rendering_823159-1461.jpg?semt=ais_hybrid&w=740&q=80'},
  { id: 2, name: 'name2', type: 'type2', stock: 'stock', availability: 'avail', cost: '567', image: 'https://img.freepik.com/premium-photo/section-industrial-electric-motor-3d-rendering_823159-1461.jpg?semt=ais_hybrid&w=740&q=80'},
  { id: 3, name: 'name3', type: 'type3', stock: 'stock', availability: 'avail', cost: '345', image: 'https://img.freepik.com/premium-photo/section-industrial-electric-motor-3d-rendering_823159-1461.jpg?semt=ais_hybrid&w=740&q=80'},

  ]);

  const navigate = useNavigate();
  /* create button routes to form to create another item, 
  currently form doesn't actually add to the database and doesn't actually add to the table */
  const handleCreatePart = () => {
    navigate("/admin/create-part");
  };

  /* delete button has no functionality as of yet */
  const handleDeleteRows = () => {
    
  };

  return (
    <>
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>

    <Stack direction="row" spacing={2} sx={{ position: "fixed", top: 32, right: 32 }}>
      <Fab color="primary" aria-label="add" onClick={handleCreatePart}>
        <AddIcon />
      </Fab>
      <Fab color="secondary" aria-label="delete" onClick={handleDeleteRows}>
        <DeleteIcon />
      </Fab>
    </Stack>
  </>
  );
}
export default PartsTable;