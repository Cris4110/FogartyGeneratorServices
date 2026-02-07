import React, { useEffect, useState } from "react";
import {
  Box, Typography, Toolbar, Alert, CircularProgress, Stack, Switch, IconButton, } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRowId, GridSortModel } from "@mui/x-data-grid";
import CheckIcon from "@mui/icons-material/Check";
import UndoIcon from "@mui/icons-material/Undo";
import AdminNavbar from "./AdminNavbar";
import dayjs from "dayjs";


const createdFromObjectId = (id?: string) => {
  if (!id || id.length < 8) return undefined;
  const seconds = parseInt(id.substring(0, 8), 16);
  return new Date(seconds * 1000).toISOString();
};

type Quote = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string; // normalize to string for display
  genModel: string;
  genSerialNumber: string;
  additionalInfo: string;
  acknowledged?: boolean;
  createdAt?: string;
};

export default function QuoteRequests() {
  const [rows, setRows] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch list
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:3000/api/quotes", {
          credentials: "include",
        });

        const text = await res.text();
        let data: Quote[];
        try {
          data = JSON.parse(text);
        } catch {
          console.error("Non-JSON response:", text);
          throw new Error(
            `Expected JSON, got ${res.headers.get("content-type") || "unknown"} (HTTP ${res.status})`
          );
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        // normalize shape
        const normalized = data.map((q) => ({
          ...q,
          phoneNumber: (q as any).phoneNumber?.toString?.() ?? "",
          acknowledged: !!q.acknowledged,
          createdAt: q.createdAt ?? createdFromObjectId(q._id),

        }));

        if (mounted) setRows(normalized);
      } catch (e: any) {
        if (mounted) setError(e.message || "Failed to load quotes");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Toggle handler
  const handleToggleAck = async (id: GridRowId, next: boolean) => {
    setRows((prev) => prev.map((r) => (r._id === id ? { ...r, acknowledged: next } : r)));
    try {
      const res = await fetch(`http://localhost:3000/api/quotes/${id}/acknowledge`, {
        method: "PATCH", // if PATCH isn’t available, change to POST and add matching route
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ acknowledged: next }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      // rollback
      setRows((prev) => prev.map((r) => (r._id === id ? { ...r, acknowledged: !next } : r)));
    }
  };

  const columns: GridColDef<Quote>[] = [
    {
      field: "acknowledged",
      headerName: "Ack",
      type: "boolean",
      minWidth: 110,
      sortable: true,
      renderCell: (params) => {
        const id = params.id as string;
        const ack = Boolean(params.value);
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <Switch
              size="small"
              checked={ack}
              onChange={(e) => handleToggleAck(id, e.target.checked)}
            />
            <IconButton
              size="small"
              color={ack ? "success" : "default"}
              onClick={() => handleToggleAck(id, !ack)}
            >
              {ack ? <CheckIcon fontSize="small" /> : <UndoIcon fontSize="small" />}
            </IconButton>
          </Stack>
        );
      },
    },
      {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      minWidth: 160,
      sortable: false, // controller already handles order
      // v6-style valueGetter: (_value, row)
      valueGetter: (_value: string | undefined, row: Quote): string => {
        const iso = row.createdAt ?? createdFromObjectId(row._id);
        return iso && dayjs(iso).isValid()
          ? dayjs(iso).format("MMM DD, YYYY @ h:mm A")
          : "-";
      },
    },
   
    { field: "name",            headerName: "Name",             flex: 1,   minWidth: 160 },
    { field: "email",           headerName: "Email",            flex: 1.2, minWidth: 220 },
    { field: "phoneNumber",     headerName: "Phone",            flex: 1,   minWidth: 140 },
    { field: "genModel",        headerName: "Generator Model",  flex: 1,   minWidth: 160 },
    { field: "genSerialNumber", headerName: "Serial Number",    flex: 1,   minWidth: 160 },
    { field: "additionalInfo",  headerName: "Additional Info",  flex: 1.6, minWidth: 260 },
  ];

  // Put unacknowledged on top
  const sortModel: GridSortModel = [
    { field: "acknowledged", sort: "asc" },
    { field: "createdAt", sort: "asc" }
  ];

  return (
    <>
      <AdminNavbar />
      <Box sx={{ ml: "13vw", px: 4 }}>
        <Toolbar />
        <Typography variant="h4" gutterBottom>Quote Requests</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ height: 600, width: "100%", position: "relative" }}>
          {loading && (
            <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", zIndex: 1 }}>
              <CircularProgress />
            </Box>
          )}

          <DataGrid
            rows={rows}
            getRowId={(r) => r._id}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            checkboxSelection={false}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              sorting: { sortModel },
              pagination: { paginationModel: { page: 0, pageSize: 25 } },
            }}
          />
        </Box>
      </Box>
    </>
  );
}