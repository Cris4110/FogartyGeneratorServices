import React, { useEffect, useMemo, useState } from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { CircularProgress, Stack, Typography, Box, Button } from "@mui/material";
import Navbar from "./AdminNavbar";
import axios from "axios";

type Row = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api",
  withCredentials: true,
});

function ReviewManagement() {
  const [rowsLoaded, setRowsLoaded] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});

  const getReviews = async () => {
    setRowsLoaded(false);
    const res = await api.get("/reviews"); // adjust if you have an admin-only endpoint

    const data = Array.isArray(res.data) ? res.data : [];
    const mapped: Row[] = data.map((review: any) => ({
      id: review._id,
      name: review.name ?? "",
      rating: Number(review.rating ?? 0),
      comment: review.comment ?? "",
      date: review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "",
      isVerified: Boolean(review.verified),
    }));

    setRows(mapped);
    setRowsLoaded(true);
  };

  useEffect(() => {
    (async () => {
      try {
        await getReviews();
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setRowsLoaded(true);
      }
    })();
  }, []);

  const setSaving = (id: string, val: boolean) =>
    setSavingIds((prev) => ({ ...prev, [id]: val }));

  const updateVerified = async (id: string, verified: boolean) => {
    setSaving(id, true);
    try {
      // backend expects PUT /api/reviews/:id
      const res = await api.put(`/reviews/${id}`, { verified });

      // If your backend returns the updated doc:
      const updated = res.data;

      // Update UI row
      setRows((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                isVerified: Boolean(updated.verified ?? verified),
                // optionally refresh date if you want:
                // date: updated.createdAt ? new Date(updated.createdAt).toLocaleDateString() : r.date,
              }
            : r
        )
      );
    } catch (err) {
      console.error("Failed to update review:", err);
      // optionally show a snackbar
    } finally {
      setSaving(id, false);
    }
  };

  // OPTION A: "Deny" means mark verified=false
  const denyReview = async (id: string) => updateVerified(id, false);

  // OPTION B: "Deny" means delete the review (uncomment if you want this behavior)
  /*
  const denyReview = async (id: string) => {
    setSaving(id, true);
    try {
      await api.delete(`/reviews/${id}`);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete review:", err);
    } finally {
      setSaving(id, false);
    }
  };
  */

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "name", headerName: "Name", width: 200 },
      { field: "rating", headerName: "Rating", width: 110 },
      { field: "date", headerName: "Date Created", width: 160 },
      { field: "isVerified", headerName: "Verified", width: 120, type: "boolean" },
      { field: "comment", headerName: "Review", width: 520 },

      // ✅ Actions column
      {
        field: "actions",
        headerName: "Actions",
        width: 220,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const id = params.row.id as string;
          const verified = params.row.isVerified as boolean;
          const saving = Boolean(savingIds[id]);

          return (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                variant="contained"
                disabled={saving || verified}
                onClick={() => updateVerified(id, true)}
              >
                Verify
              </Button>

              <Button
                size="small"
                variant="outlined"
                color="error"
                disabled={saving || !verified}
                onClick={() => denyReview(id)}
              >
                Deny
              </Button>
            </Box>
          );
        },
      },
    ],
    [savingIds]
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Navbar />
      <Box sx={{ flexGrow: 1, marginLeft: "13vw", p: 8, backgroundColor: "#fafafa" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4, color: "#000" }}>
          Review Management
        </Typography>

        {rowsLoaded ? (
          <DataGrid
            style={{ height: "80vh" }}
            rows={rows}
            columns={columns}
            getRowHeight={() => "auto"}
            hideFooterPagination
            disableRowSelectionOnClick
          />
        ) : (
          <Stack direction="row" sx={{ justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <CircularProgress color="inherit" />
          </Stack>
        )}
      </Box>
    </Box>
  );
}

export default ReviewManagement;