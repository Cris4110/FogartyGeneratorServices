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
  description: string;
  images: string[];
  name: string;
}

// displays parts table for the inventory-management page
function PartsTable() {

  // Tracks if they press the delete button
  const [openDelete, setOpenDelete] = useState(false);
  const handleCloseDelete = () => {
    setOpenDelete(false); // Closes the delete confirmation
  };
  const handleConfirmDelete = () => {
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

    let tmp = new Array(data.length);
    // Converts the parts to the list format
    for (let i = 0; i < data.length; i++) {
      let part = data[i];
      tmp[i] = {
        id:           part._id ?? part.partID,
        Part_Name:    part.Part_Name,
        description: part.Description,
        stock: Number(part.Stock) || 0,
        images: part.images || []

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
    description: newRow.description,
    images: newRow.images,
    name: newRow.name
  };

  // Optimistic UI update
  updateRows((prev) =>
    prev.map((row) =>
      row.id === updatedRow.id ? updatedRow : row
    )
  );

  // Persist to backend
  await saveStock(updatedRow.id, updatedRow.stock, updatedRow.description, updatedRow.images, updatedRow.Part_Name);

  return updatedRow;
};


  /* declares name of columns and settings */
    const columns: GridColDef[] = [
    { field: "Part_Name", headerName: "Name", width: 200, editable: true },
    { field: "stock", headerName: "Stock", width: 150, editable: true, type: "number" },
    { field: "description", headerName: "Description", width: 200, editable: true },
    { 
      field: "images",
      headerName: "Images",
      width: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {params.value.map((img: string, idx: number) => (
            <Box
              key={idx}
              component="img"
              src={img}
              sx={{ height: 70, width: 70, objectFit: "cover" }}
              alt="No Image"
            />
          ))}
        </Stack>
      )
    }
  ];

  /* row data */
  const [rows, updateRows] = useState<PartRow[]>([]);

  // Tracks state of the selected parts/rows
  const [rowSelectionModel, setRowSelectionModel] = useState({
    type: 'include',
    ids: new Set(),
  });


const saveStock = async ( id: string, stock: number, description: string,images: string[],Part_Name: string) => {
  try {
    const formData = new FormData();
    formData.append("Stock", stock.toString());
    formData.append("Description", description);
    formData.append("Part_Name", Part_Name);
    images.forEach((img, idx) => {
      formData.append(`image${idx + 1}`, img);
    });

    const res = await fetch(`http://localhost:3000/api/parts/${id}`, {
      method: "PUT",
      body: formData,
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
          ? { ...row, 
            stock: Number(updatedPart.Stock),
            description: updatedPart.Description,
            images: updatedPart.images || [],
            Part_Name: updatedPart.Part_Name
          }
          : row
      )
    );
  } catch (err) {
    console.error("table update error:", err);
  }
};


  const navigate = useNavigate();
  /* create button routes to form to create another item, 
  currently form doesn't actually add to the database and doesn't actually add to the table */
  const handleCreatePart = () => {
    navigate("/admin/create-part");
  };

  /* delete button function */
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
    <Box sx={{ height: '65vh', width: '80vw' } }>
      {/* While it is fetching the data a loading icon appears */}
      {
        rowsLoaded ? 
        <DataGrid
          // removed check all since it bugs with the delete function
          sx={{
            "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
              display: "none"
            }
          }}
          rows={rows}
          columns={columns}
          getRowHeight={() => 'auto'}
          disableColumnResize={false} 
          hideFooterPagination={true}
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

    </Box>
    
    {/* Popup for delete confirmation */}
    <Backdrop
      sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
      open={openDelete}
    >
      <Paper sx={{width: 400, padding: 4}}>
        <Box padding={2} sx={{textAlign: "center"}}>
          <Typography sx={{fontWeight: 'bold', fontSize: 'h6.fontSize'}}>Delete {rowSelectionModel.ids.size} parts?</Typography>
        </Box>
        <Stack direction="row" spacing={2} sx={{justifyContent: "center", alignItems: "center"}}>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteRows}>Confirm</Button>
        </Stack>
        
      </Paper>
    </Backdrop>   
    <Stack direction="row" spacing={2} sx={{ position: "fixed", top: 32, right: 32 }}>
      <Fab color="primary" aria-label="add" onClick={handleCreatePart}>
        <AddIcon />
      </Fab>
      <Fab color="secondary" aria-label="delete" onClick={handleConfirmDelete}>
        <DeleteIcon />
      </Fab>
    </Stack>
  </>
  );
}
export default PartsTable;