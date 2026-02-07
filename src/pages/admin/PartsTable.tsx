import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Backdrop, Button, CircularProgress, Fab, Paper, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";


interface PartRow {
  id: string;
  stock: number;
}

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

  const getParts = async () => {
    const res = await fetch("http://localhost:3000/api/parts", {
      method: "GET"
    });

    // Array of parts is returned
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    let tmp = [data.length];
    // Converts the parts to the list format
    for (let i = 0; i < data.length; i++) {
      let part = data[i];
      tmp[i] = {
        id:           part._id ?? part.partID,
        Part_Name:    part.Part_Name,
        stock: Number(part.Stock) || 0,

      }
    }
    updateRows(tmp);
    handleRowsLoaded();
  }

  useEffect(() => {
    const fetchDB = async () => {
      try {
          getParts();
      } catch (err: any) {
        console.error("Error fetching parts:", err);
      }
    };
    fetchDB();
  }, []);

  const processRowUpdate = async (newRow: any) => {
  const updatedRow = {
    ...newRow,
    stock: Math.max(0, Number(newRow.stock)),
  };

  // Optimistic UI update
  updateRows((prev) =>
    prev.map((row) =>
      row.id === updatedRow.id ? updatedRow : row
    )
  );

  // Persist to backend
  await saveStock(updatedRow.id, updatedRow.stock);

  return updatedRow;
};


  /* declares name of columns and settings */
  const columns: GridColDef[] = [
    { field: "Part_Name", headerName: "Name", width: 150, editable: true },
    { field: "stock", headerName: "Stock", width: 150, editable: true, type: "number", description: "Click to edit stock quantity",}

  ];

  /* random data, to be replaced with data from database */
  const [rows, updateRows] = useState<PartRow[]>([]);

  // Tracks state of the selected parts/rows
  const [rowSelectionModel, setRowSelectionModel] = useState({
    type: 'include',
    ids: new Set(),
  });


const saveStock = async (id: string, stock: number) => {
  try {
    const res = await fetch(`http://localhost:3000/api/parts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Stock: stock }) // matches DB field
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message);
    }

    const updatedPart = await res.json();

    // Sync UI with DB response
    updateRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, stock: Number(updatedPart.Stock) }
          : row
      )
    );
  } catch (err) {
    console.error("Stock update error:", err);
  }
};


  const navigate = useNavigate();
  /* create button routes to form to create another item, 
  currently form doesn't actually add to the database and doesn't actually add to the table */
  const handleCreatePart = () => {
    navigate("/admin/create-part");
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

        const deletedGen = await res.json();
        if (!res.ok) throw new Error(deletedGen.message);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        getParts(); // Update the rows by fetching again
        handleCloseDelete(); // close the backdrop
      }
    });
  };

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
          processRowUpdate={processRowUpdate}
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
      <Fab color="primary" aria-label="add" onClick={handleCreatePart}>
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