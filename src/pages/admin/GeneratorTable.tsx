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
  image: string;
  image2: string;
  image3: string;
}

const SafeImage = ({ src }: { src: string }) => {
  // 1. Use a more modern, reliable placeholder service
  const fallback = "https://placehold.co/70x70?text=No+Image";
  const [imgSrc, setImgSrc] = useState<string>(src || fallback);

  // Sync internal state if the URL in the database changes
  useEffect(() => {
    // If the src looks like a double URL (common with some API errors), take the first part
    const cleanSrc = src?.split(',')[0] || fallback;
    setImgSrc(cleanSrc);
  }, [src]);

  return (
    <Box
      component="img"
      sx={{
        height: 70,
        width: 70,
        objectFit: 'cover',
        borderRadius: 1,
        border: '1px solid #eee',
        my: 0.5,
        backgroundColor: '#f5f5f5' // Shows a light grey box while loading
      }}
      alt="Generator"
      src={imgSrc}
      onError={() => {
        // Prevent infinite loops if the fallback itself fails
        if (imgSrc !== fallback) {
          setImgSrc(fallback);
        }
      }}
    />
  );
};

function GeneratorTable() {
  const [rows, setRows] = useState<GeneratorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  
  // 1. Correct Initialization for Object-based selection
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

    // Fallback for Array-based versions
    if (Array.isArray(rowSelectionModel)) {
      return (rowSelectionModel as GridRowId[]).map((id: GridRowId) => String(id));
    }

    return [];
  }, [rowSelectionModel]);

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
        image: gen.Image_Url || "",
        image2: gen.Image_Url2 || "",
        image3: gen.Image_Url3 || ""
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

  const saveStock = async (row: GeneratorRow) => {
    try {
      const res = await fetch(`http://localhost:3000/api/generators/${row.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            Stock: row.stock, 
            Image_Url: row.image, 
            Image_Url2: row.image2, 
            Image_Url3: row.image3, 
            Serial_Number: row.Serial_Number, 
            Description: row.description, 
            name: row.name
        }) 
      });
      if (!res.ok) throw new Error("Failed to update");
    } catch (err: any) {
      console.error("Update error:", err.message);
      getGens(); 
    }
  };

  const processRowUpdate = async (newRow: GeneratorRow) => {
    const updatedRow = { ...newRow, stock: Math.max(0, Number(newRow.stock)) };
    setRows((prev) => prev.map((row) => row.id === updatedRow.id ? updatedRow : row));
    await saveStock(updatedRow);
    return updatedRow;
  };

  const columns: GridColDef[] = [
    { field: "Serial_Number", headerName: "Serial Number", width: 150, editable: true },
    { field: "name", headerName: "Name", width: 150, editable: true },
    { field: "description", headerName: "Description", width: 250, editable: true },
    { field: "stock", headerName: "Stock", width: 100, editable: true, type: "number" },
    { 
      field: "image", 
      headerName: "Image 1", 
      width: 100, 
      renderCell: (params) => <SafeImage src={params.value as string} />
    },
    { 
      field: "image2", 
      headerName: "Image 2", 
      width: 100, 
      renderCell: (params) => <SafeImage src={params.value as string} />
    },
    { 
      field: "image3", 
      headerName: "Image 3", 
      width: 100, 
      renderCell: (params) => <SafeImage src={params.value as string} />
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