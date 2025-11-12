import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Backdrop, Button, CircularProgress, Fab, Paper, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";

// displays parts table for the inventory-management page
function PartsTable() {

  // Tracks if they press the delete button
  const [openDelete, setOpenDelete] = useState(false);
  const handleCloseDelete = () => {
    setOpenDelete(false); // Closes the delete confirmation
  };
  const handleConfrimDelete = () => {
    setOpenDelete(true);  // Brings up the delete confirmation
  };

  // Tracks if the rows are loaded or not
  const [rowsLoaded, setRowLoaded] = useState(false);
  const handleRowsLoading = () => {
    setRowLoaded(false);
  }
  const handleRowsLoaded = () => {
    setRowLoaded(true);
  }


    // async function that fetches the parts and parses into the list format
   async function fetchParts() {
    try {
      const res =  await fetch("http://localhost:3000/api/parts", {
        method: "GET"
      });

      // Array of generators is returned
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      let tmp = [];
      // Converts the generators to the list format
      for (let i = 0; i < data.length; i++) {
        let part = data[i];
        tmp[i] = {
            id:           part.partID,
            name:         part.name||"",
            type:         part.type||"",
            stock:        part.stock||"",
            availability: part.availability||"",
            cost:         part.cost||"",
            image:        part.image||'https://img.freepik.com/premium-photo/section-industrial-electric-motor-3d-rendering_823159-1461.jpg?semt=ais_hybrid&w=740&q=80'
        }
      }
      updateRows(tmp);
      handleRowsLoaded();
    } catch (err: any) {
      console.error("Fetch error:", err);
      return {};
    }
  }


  /* declares name of columns and settings */
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150, editable: true },
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
  const [rows, updateRows] = useState([
  { id: "1", name: 'name1', type: 'type1', stock: 'stock', availability: 'avail', cost: '123', image: 'https://img.freepik.com/premium-photo/section-industrial-electric-motor-3d-rendering_823159-1461.jpg?semt=ais_hybrid&w=740&q=80'},
  { id: "2", name: 'name2', type: 'type2', stock: 'stock', availability: 'avail', cost: '567', image: 'https://img.freepik.com/premium-photo/section-industrial-electric-motor-3d-rendering_823159-1461.jpg?semt=ais_hybrid&w=740&q=80'},
  { id: "3", name: 'name3', type: 'type3', stock: 'stock', availability: 'avail', cost: '345', image: 'https://img.freepik.com/premium-photo/section-industrial-electric-motor-3d-rendering_823159-1461.jpg?semt=ais_hybrid&w=740&q=80'},
  ]);

  // Tracks state of the selected parts/rows
  const [rowSelectionModel, setRowSelectionModel] = useState({
    type: 'include',
    ids: new Set(),
  });

  const navigate = useNavigate();
  /* create button routes to form to create another item, 
  currently form doesn't actually add to the database and doesn't actually add to the table */
  const handleCreate = () => {
    navigate("/admin/create-item");
  };

  /* delete button has no functionality as of yet */
  const handleDeleteRows = () => {
    handleRowsLoading();
    (rowSelectionModel.ids).forEach(async part => {
      try {
        let api = "http://localhost:3000/api/parts/" + part
        const res = await fetch(api, {
          method: "DELETE"
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    });

    
    fetchParts(); // Update the rows by fetching again
    handleCloseDelete(); // close the backdrop
  };


  // Updates the rows
  fetchParts();
  return (
    <>
    <Box sx={{ height: 600, width: '100%'} }>
      {/* While it is fetching the data a loading icon appears */}
      <div>
      {
        rowsLoaded ? 
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
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
        />
        :
        <Stack direction="row" spacing={20} sx={{justifyContent: "center", alignItems: "center"}}>
          <CircularProgress color="inherit" />
        </Stack>
      }
      </div>
    </Box>
    
    {/* Popup for delete confirmation */}
    <Backdrop
      sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
      open={openDelete}
    >
      <Paper sx={{width: '30%', padding: 10}}>
        <Box padding={2} sx={{textAlign: "center"}}>
          <Typography sx={{fontWeight: 'bold', fontSize: 'h6.fontSize'}}>Delete {rowSelectionModel.ids.size} generators?</Typography>
        </Box>
        <Stack direction="row" spacing={20} sx={{justifyContent: "center", alignItems: "center"}}>
          <Button variant="contained" onClick={handleCloseDelete}>Decline</Button>
          <Button variant="contained" onClick={handleDeleteRows}>Confirm</Button>
        </Stack>
        
      </Paper>
    </Backdrop>
    <Stack direction="row" spacing={2} sx={{ position: "fixed", top: 32, right: 32 }}>
      <Fab color="primary" aria-label="add" onClick={handleCreate}>
        <AddIcon />
      </Fab>
      <Fab color="secondary" aria-label="delete" onClick={handleConfrimDelete}>
        <DeleteIcon />
      </Fab>
    </Stack>
  </>
  );
}
export default PartsTable;