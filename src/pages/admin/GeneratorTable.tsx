import React, { useEffect, useState, useMemo } from "react";
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
import { DataGrid, type GridColDef, type GridRowSelectionModel, type GridRowId } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

interface GeneratorRow {
  id: string;
  Serial_Number: string;
  name: string;
  description: string;
  stock: number;
  images: string[];
}

function GeneratorTable() {
  const [rows, setRows] = useState<GeneratorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>(
    { type: 'row', ids: new Set<GridRowId>() } as unknown as GridRowSelectionModel
  );
  
  const navigate = useNavigate();

  // 2. Optimized and typed selectedIds extraction
  const selectedIds = useMemo(() => {
    if (!rowSelectionModel) return [];

    // MUI X v7+ logic (Object with ids Set)
    if (rowSelectionModel && 'ids' in rowSelectionModel) {
      const idsSet = rowSelectionModel.ids as Set<GridRowId>;
      return Array.from(idsSet).map((id: GridRowId) => String(id));
    }

    return [];
  }, [rowSelectionModel]);

  const handleCloseDelete = () => {
    setOpenDelete(false); // Closes the delete confirmation
  };


  const getGens = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/generators");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      const formattedRows: GeneratorRow[] = data.map((gen: any) => ({
        id: gen._id ?? gen.genID,
        Serial_Number: gen.Serial_Number || "",
        name: gen.name || "",
        description: gen.Description || "",
        stock: Number(gen.Stock) || 0,
        images: gen.images || []
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

  const processRowUpdate = async (newRow: GeneratorRow) => {
  // prevent negatives
  const updatedRow = {
    ...newRow,
    stock: Math.max(0, Number(newRow.stock)),
    Serial_Number: newRow.Serial_Number,
    description: newRow.description,
    name: newRow.name,
    images: newRow.images
  };

  // optimistic UI update
  setRows((prev) =>
    prev.map((row) =>
      row.id === updatedRow.id ? updatedRow : row
    )
  );

  // save to DB
  await saveStock(updatedRow.id, updatedRow.Serial_Number, updatedRow.description, updatedRow.name, updatedRow.stock, updatedRow.images);

  return updatedRow;
};

const saveStock = async (id: string, Serial_Number: string, description: string, name: string, stock: number, images: string[]) => {
  try {
    const formData = new FormData();
    formData.append("Stock", stock.toString());
    formData.append("Serial_Number", Serial_Number);
    formData.append("Description", description);
    formData.append("name", name);
    images.forEach((img, idx) => {
      formData.append(`image${idx + 1}`, img);
    });

    const res = await fetch(`http://localhost:3000/api/generators/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to update generator");

    const updatedGen = await res.json();

    // Sync UI with DB response
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, 
            stock: Number(updatedGen.Stock),
            images: updatedGen.images || [],
            Serial_Number: updatedGen.Serial_Number,
            description: updatedGen.Description,
            name: updatedGen.name
          }
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
    { field: "stock", headerName: "Stock", width: 150, editable: true, type: "number" },
    { 
      field: "images",
      headerName: "Images",
      width: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          {params.value.map((img: string, idx: number) => (
            <Box key={idx} component="img" src={img} sx={{ height: 70, width: 70, objectFit: "cover" }} alt="No Image" />
          ))}
        </Stack>
      )
    }
  ];


  const handleDeleteRows = async () => {
    try {
      await Promise.all(
        selectedIds.map(id => fetch(`http://localhost:3000/api/generators/${id}`, { method: "DELETE" }))
      );
      setRows((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
      setRowSelectionModel({ type: 'row', ids: new Set<GridRowId>() } as unknown as GridRowSelectionModel);
      setOpenDelete(false);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>Inventory Management</Typography>
      
      <Box sx={{ height: '70vh', width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        {loading ? (
          <Stack sx={{ height: "100%" }} justifyContent="center" alignItems="center">
            <CircularProgress />
          </Stack>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            getRowHeight={() => 85}
            checkboxSelection
            onRowSelectionModelChange={(newSelection) => setRowSelectionModel(newSelection)}
            rowSelectionModel={rowSelectionModel}
            processRowUpdate={processRowUpdate}
            slotProps={{
              toolbar: { showQuickFilter: true }
            }}
          />
        )}
      </Box>

      <Backdrop open={openDelete} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h6" align="center">Delete {selectedIds.length} generators?</Typography>
          <Stack direction="row" spacing={2} mt={3} justifyContent="center">
            <Button onClick={() => setOpenDelete(false)} variant="outlined">Cancel</Button>
            <Button color="error" variant="contained" onClick={handleDeleteRows}>Confirm Delete</Button>
          </Stack>
        </Paper>
      </Backdrop>

      <Stack direction="row" spacing={2} sx={{ position: "fixed", bottom: 32, right: 32 }}>
        <Fab color="primary" variant="extended" onClick={() => navigate("/admin/create-gen")}>
          <AddIcon sx={{ mr: 1 }} /> Add New
        </Fab>
        <Fab 
          color="secondary" 
          variant="extended"
          disabled={selectedIds.length === 0} 
          onClick={() => setOpenDelete(true)}
        >
          <DeleteIcon sx={{ mr: 1 }} /> Delete Selected
        </Fab>
      </Stack>
    </Box>
  );
}

export default GeneratorTable;