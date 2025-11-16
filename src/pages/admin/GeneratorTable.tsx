import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Backdrop, Button, CircularProgress, Fab, Paper, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";


// displays generators table for the inventory-management page
function GeneratorTable() {

  // Tracks if they press the delete button
  const [openDelete, setOpenDelete] = useState(false);
  const handleCloseDelete = () => {
    setOpenDelete(false); // Closes the delete confirmation
  };
  const handleConfrimDelete = () => {
    setOpenDelete(true);  // Brings up the delete confirmation
  };

  const [rowsLoaded, setRowLoaded] = useState(false);
  const handleRowsLoading = () => {
    setRowLoaded(false);
  }
  const handleRowsLoaded = () => {
    setRowLoaded(true);
  }
  
  const getGens = async () => {
    const res = await fetch("http://localhost:3000/api/generators", {
      method: "GET"
    });

    // Array of generators is returned
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    let tmp = [data.length];
    // Converts the generators to the list format
    for (let i = 0; i < data.length; i++) {
      let gen = data[i];
      tmp[i] = {
          id:           gen.genID,
          name:         gen.name||"",
          type:         gen.type||"",
          serial:       gen.serial||"",
          power:        gen.power||"",
          fuel:         gen.fuel||"",
          manufactuer:  gen.manufactuer||"",
          stock:        gen.stock||"",
          availability: gen.availability||"",
          sale:         gen.sale||""
      }
    }
    updateRows(tmp);
    handleRowsLoaded();
  }


  useEffect(() => {
    const fetchGenerators = async () => {
      try {
        getGens();
      } catch (err: any) {
        console.error("Error fetching generators:", err);
      }
    };
    fetchGenerators();
  }, []);

  /* declares name of columns and settings */
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150, editable: true },
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
  const [rows, updateRows] = useState([
  { id: "1", name: 'name1', type: 'type1', serial: '93SG44H3', power: 'power1', fuel: 'fuel1', manufactuer: 'manufactuer', stock: 'stock', availability: 'avail', sale: 'sale' },
  { id: "2", name: 'name2', type: 'type2', serial: '6D54F74', power: 'power2', fuel: 'fuel2', manufactuer: 'manufactuer', stock: 'stock', availability: 'avail', sale: 'sale' },
  { id: "3", name: 'name3', type: 'type3', serial: '23F4hD53', power: 'power3', fuel: 'fuel3', manufactuer: 'manufactuer', stock: 'stock', availability: 'avail', sale: 'sale' },
  ]);

  // Tracks state of the selected gens/rows
  const [rowSelectionModel, setRowSelectionModel] = useState({
    type: 'include',
    ids: new Set(),
  });

  const navigate = useNavigate();
  /* create button routes to form to create another item, 
  currently form doesn't actually add to the database and doesn't actually add to the table */
  const handleCreateGen = () => {
    navigate("/admin/create-gen");
  };

  /* Delete button goes through the Set of selected rows and deletes them */
  const handleDeleteRows = () => {
    handleRowsLoading();
    (rowSelectionModel.ids).forEach(async gens => {
      try {
        let api = "http://localhost:3000/api/generators/" + gens
        const res = await fetch(api, {
          method: "DELETE"
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        getGens();
        handleCloseDelete(); // close the backdrop
      }
    });
  };

  return (
    <>
    <Box sx={{ height: 600, width: '100%'}}>
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
      <Fab color="primary" aria-label="add" onClick={handleCreateGen}>
        <AddIcon />
      </Fab>
      <Fab color="secondary" aria-label="delete" onClick={handleConfrimDelete}>
        <DeleteIcon />
      </Fab>
    </Stack>
  </>
  );
}
export default GeneratorTable;