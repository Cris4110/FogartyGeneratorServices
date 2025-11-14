import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  TextField,
  MenuItem,
  // Import Dialog components for deletion confirmation
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Navbar from "./AdminNavbar";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  fullname: string;
  email: string;
  phoneNumber: string;
  address: Address;
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
  const parts = [addr.street, addr.city, addr.state, addr.zipcode].filter(
    Boolean
  );
  return parts.length ? parts.join(", ") : "No address";
};

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add search state
  const [searchQuery, setSearchQuery] = useState("");
  // Add sort state
  const [sortBy, setSortBy] = useState<"a-z" | "z-a" | "none">("a-z");

  // State for the confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>(
          "http://localhost:3000/api/users"
        );
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

  // 1. Open Dialog function
  const confirmDelete = (user: User) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  // 2. Handle API Call and State Update
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    // Close the dialog and show loading (optional, for visual feedback)
    setOpenDeleteDialog(false);

    try {
      // API call to delete the user by ID
      await axios.delete(`http://localhost:3000/api/users/${userToDelete._id}`);

      // SUCCESS: Update the local state by filtering out the deleted user
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== userToDelete._id)
      );

      console.log(`User ${userToDelete.name} deleted successfully.`);
    } catch (err: any) {
      console.error("Error deleting user:", err);
      // Handle error display
      setError(`Failed to delete user: ${userToDelete.name}.`);
    } finally {
      setUserToDelete(null); // Clear the user being tracked
    }
  };

  // Derive a sorted copy (non-mutating)
  let sortedUsers = useMemo(() => {
    const filtered = users.filter((user) => {
      const query = searchQuery.toLowerCase();
      const name = (user.name ?? user.fullname ?? "").toLowerCase();
      return name.includes(query);
    });

    const copy = [...filtered];
    const getName = (u: User) => u.name ?? (u as any).fullname ?? "";
    if (sortBy === "a-z") {
      return copy.sort((a, b) => getName(a).localeCompare(getName(b)));
    } else if (sortBy === "z-a") {
      return copy.sort((a, b) => getName(b).localeCompare(getName(a)));
    }
    return copy;
  }, [users, sortBy, searchQuery]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Navbar />

      <Box
        sx={{
          flexGrow: 1,
          marginLeft: "13vw",
          p: 8,
          backgroundColor: "#fafafa",
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mb: 4, color: "#000000ff" }}
        >
          User Management
        </Typography>

        {/* Search + Sort Bar: */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            placeholder="Search..."
            variant="outlined"
            fullWidth
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            sx={{ backgroundColor: "white", borderRadius: 1 }}
          />
          <TextField
            select
            label="Sort By:"
            value={sortBy} // use state
            onChange={(e) => setSortBy(e.target.value as any)}
            sx={{ width: "30%", backgroundColor: "white", borderRadius: 1 }}
          >
            <MenuItem value="a-z">Name A-Z</MenuItem>
            <MenuItem value="z-a">Name Z-A</MenuItem>
            <MenuItem value="none">None</MenuItem>
          </TextField>
        </Box>

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
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                      Email
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                      Phone Number
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                      Address
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedUsers.map((user) => (
                    <TableRow key={user._id} hover>
                      <TableCell>{user.name || user.fullname}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phoneNumber}</TableCell>
                      <TableCell>{formatAddress(user.address)}</TableCell>
                      {/*<TableCell>{user.address}</TableCell>*/}
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => confirmDelete(user)}
                        >
                          Delete User
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {sortedUsers.length === 0 && (
                <Box sx={{ textAlign: "center", p: 4 }}>
                  <Typography variant="subtitle1" color="textSecondary">
                    No users found matching your criteria.
                  </Typography>
                </Box>
              )}
            </TableContainer>
          )}
        </Paper>
      </Box>
      {/* User Deletion Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to permanently delete user:
            <Typography component="span" sx={{ fontWeight: "bold" }}>
              {userToDelete?.name || userToDelete?.fullname}?
            </Typography>
            <p>This action cannot be undone.</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteUser}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagementPage;
