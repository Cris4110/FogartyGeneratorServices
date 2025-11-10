import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Fab, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";

// displays generators table for the inventory-management page
function GeneratorTable() {
  /* declares name of columns and settings */
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 150, editable: true },
    { field: "type", headerName: "Type", width: 150, editable: true },
    { field: "serial", headerName: "Serial Number", width: 150, editable: true },
    { field: "power", headerName: "Power", width: 150, editable: true },
    { field: "fuel", headerName: "Fuel", width: 150, editable: true },
    { field: "manufactuer", headerName: "Manufacturer", width: 150, editable: true },
    { field: "stock", headerName: "Stock", width: 150, editable: true },
    { field: "availability", headerName: "Availability", width: 150, editable: true },
    { field: "sale", headerName: "Sale", width: 150, editable: true },
  ];

  /* random data, to be replaced with data from database */
  const [rows] = useState([
  { id: 1, name: 'name1', type: 'type1', serial: '93SG44H3', power: 'power1', fuel: 'fuel1', manufactuer: 'manufactuer', stock: 'stock', availability: 'avail', sale: 'sale' },
  { id: 2, name: 'name2', type: 'type2', serial: '6D54F74', power: 'power2', fuel: 'fuel2', manufactuer: 'manufactuer', stock: 'stock', availability: 'avail', sale: 'sale' },
  { id: 3, name: 'name3', type: 'type3', serial: '23F4hD53', power: 'power3', fuel: 'fuel3', manufactuer: 'manufactuer', stock: 'stock', availability: 'avail', sale: 'sale' },

  ]);

  const navigate = useNavigate();
  /* create button routes to form to create another item, 
  currently form doesn't actually add to the database and doesn't actually add to the table */
  const handleCreate = () => {
    navigate("/admin/create-item");
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
      <Fab color="primary" aria-label="add" onClick={handleCreate}>
        <AddIcon />
      </Fab>
      <Fab color="secondary" aria-label="delete" onClick={handleDeleteRows}>
        <DeleteIcon />
      </Fab>
    </Stack>
  </>
  );
}
export default GeneratorTable;