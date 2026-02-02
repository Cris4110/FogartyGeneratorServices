import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import {
  Backdrop,
  Button,
  CircularProgress,
  Fab,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, type GridColDef, type GridRowSelectionModel } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";



interface GeneratorRow {
  id: string;
  Serial_Number: string;
  name: string;
  description: string;
  stock: number;
}

function GeneratorTable() {

  const [rows, setRows] = useState<GeneratorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  //const [rowSelectionModel, setRowSelectionModel] = useState<string[]>([]);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>();

  
  //const selectedIds = rowSelectionModel;
  //const selectedIds = getSelectedIds();


  const getSelectedIds = (): string[] => {
  if (!rowSelectionModel) return [];

  // v7+ object shape
  if ("ids" in rowSelectionModel) {
    return Array.from(rowSelectionModel.ids).map(String);
  }

  // v6 array shape fallback
  return rowSelectionModel.map(String);
};
  const selectedIds = getSelectedIds();





  const handleCloseDelete = () => {
    setOpenDelete(false); // Closes the delete confirmation
  };
  const navigate = useNavigate();

  const getGens = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/generators");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const formattedRows: GeneratorRow[] = data.map((gen: any) => ({
        id: gen._id ?? gen.genID,
        Serial_Number: gen.Serial_Number,
        name: gen.name,
        description: gen.Description,
        stock: Number(gen.Stock) || 0
      }));

      setRows(formattedRows);
    } catch (err) {
      console.error("Error fetching generators:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGens();
  }, []);


const updateLocalStock = (id: string, delta: number) => {
  setRows((prev) =>
    prev.map((row) =>
      row.id === id
        ? { ...row, stock: Math.max(0, row.stock + delta) }
        : row
    )
  );
};

const saveStock = async (id: string, stock: number) => {
  try {
    const res = await fetch(`http://localhost:3000/api/generators/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Stock: stock }) 
    });

    if (!res.ok) throw new Error("Failed to update generator");

    const updatedGen = await res.json();

    // Sync UI with DB response
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, stock: Number(updatedGen.Stock) }
          : row
      )
    );
  } catch (err) {
    console.error("Stock update error:", err);
  }
};



  const columns: GridColDef[] = [
    { field: "Serial_Number", headerName: "Serial Number", width: 150, editable: true },
    { field: "name", headerName: "Name", width: 150, editable: true },
    { field: "description", headerName: "Description", width: 250, editable: true },
    {
  field: "stock",
  headerName: "Stock",
  width: 300,
  sortable: false,
  renderCell: (params) => (
    <Stack direction="row" spacing={1} alignItems="center">
      <Button
        size="small"
        variant="outlined"
        onClick={() => updateLocalStock(params.row.id, -1)}
      >
        −
      </Button>

      <Typography minWidth={24} textAlign="center">
        {params.row.stock}
      </Typography>

      <Button
        size="small"
        variant="outlined"
        onClick={() => updateLocalStock(params.row.id, 1)}
      >
        +
      </Button>

      <Button
        size="small"
        variant="contained"
        onClick={() => saveStock(params.row.id, params.row.stock)}
      >
        Save
      </Button>
    </Stack>
  )
}
 ];

const handleDeleteRows = async () => {
  const ids = getSelectedIds();
  if (ids.length === 0) return;

  try {
    await Promise.all(
      ids.map(async (genId) => {
        const res = await fetch(
          `http://localhost:3000/api/generators/${genId}`,
          { method: "DELETE" }
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message);
        }
      })
    );

    // optimistic UI update
    setRows((prev) => prev.filter((row) => !ids.includes(row.id)));

    setRowSelectionModel(undefined);
    handleCloseDelete();
  } catch (err) {
    console.error("Delete error:", err);
  }
};


  

  return (
    <>
      <Box sx={{ height: 600, width: "100%" }}>
        {loading ? (
          <Stack sx={{ height: "100%" }} justifyContent="center" alignItems="center">
            <CircularProgress />
          </Stack>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
        
            onRowSelectionModelChange={(newSelection) =>
            setRowSelectionModel(newSelection)
            }
          />
        )}
      </Box>

      {/* Delete Confirmation */}
      <Backdrop open={openDelete} sx={{ color: "#fff", zIndex: 1300 }}>
        <Paper sx={{ width: 400, p: 4 }}>
          <Typography align="center" fontWeight="bold">
            Delete {selectedIds.length} generators?
          </Typography>
          <Stack direction="row" spacing={4} mt={3} justifyContent="center">
            <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={handleDeleteRows}>
              Confirm
            </Button>
          </Stack>
        </Paper>
      </Backdrop>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ position: "fixed", top: 32, right: 32 }}>
        <Fab color="primary" onClick={() => navigate("/admin/create-gen")}>
          <AddIcon />
        </Fab>
        <Fab
          color="secondary"
          disabled={selectedIds.length === 0}
          onClick={() => setOpenDelete(true)}
        >
          <DeleteIcon />
        </Fab>
      </Stack>
    </>
  );
}
export default GeneratorTable;