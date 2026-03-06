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
  images: string[];
}
function GeneratorTable() {

  const [rows, setRows] = useState<GeneratorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>();
  const navigate = useNavigate();
  
  const getSelectedIds = (): string[] => {
  if (!rowSelectionModel) return [];
  if ("ids" in rowSelectionModel) {
    return Array.from(rowSelectionModel.ids).map(String);
  }

  return rowSelectionModel.map(String);
  };

  const selectedIds = getSelectedIds();

  const handleCloseDelete = () => {
    setOpenDelete(false); // Closes the delete confirmation
  };


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
      <Box sx={{ height: '65vh', width: '80vw' }}>
        {loading ? (
          <Stack sx={{ height: "100%" }} justifyContent="center" alignItems="center">
            <CircularProgress />
          </Stack>
        ) : (
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
            checkboxSelection            
            disableRowSelectionOnClick
            processRowUpdate={processRowUpdate}
            onRowSelectionModelChange={(newSelection) => {
              setRowSelectionModel(newSelection);
            }}
          />
        )}
      </Box>

      {/* Delete Confirmation */}
      <Backdrop open={openDelete} sx={{ color: "#fff", zIndex: 1300 }}>
        <Paper sx={{ width: 400, p: 4 }}>
          <Typography align="center" sx = {{ fontWeight:"bold", fontSize: 'h6.fontSize' }}>
            Delete {selectedIds.length} generators?
          </Typography>
          <Stack direction="row" spacing={4} mt={3} justifyContent="center">
            <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={handleDeleteRows}>Confirm</Button>
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