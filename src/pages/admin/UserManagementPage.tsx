import {Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress} from "@mui/material";
import Navbar from "./AdminNavbar";
import { useState, useEffect } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  fullname: string;
  email: string;
  phoneNumber: string;
  address: Address
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipcode: string;
}

const formatAddress = (addr: Address) => {
  if (!addr) return "No address";
  if (typeof addr === "string") return addr || "No address";
  const parts = [addr.street, addr.city, addr.state, addr.zipcode].filter(Boolean);
  return parts.length ? parts.join(", ") : "No address";
};

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>("http://localhost:3000/api/users");
        setUsers(response.data);
      } catch (err: any) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Navbar />

      <Box sx={{ flexGrow: 1, marginLeft: "13vw", p: 8, backgroundColor: "#fafafa" }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mb: 4, color: "#000000ff" }}
        >
          User Management
        </Typography>

        <Paper
          elevation={3}
          sx={{
            width: "100%",
            height: "75vh",
            overflowY: "auto",
            p: 3,
            borderRadius: 3,
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: loading ? "center" : "flex-start",
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Phone Number</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>Address</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id} hover>
                      
                      <TableCell>{user.name || user.fullname}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phoneNumber}</TableCell>
                      <TableCell>{formatAddress(user.address)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default UserManagementPage;