import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import axios from "axios";

import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

type User = {
  id: string;
  userID: string;
  name?: string;
  email: string;
  role?: string;
  phoneNumber?: string;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api",
  withCredentials: true, // so the JWT cookie goes with requests
});

// Helper function that creates a row for each user setting
// label defines the setting and value defines the user's information
function settingRow(label: String, value: String, editLink: string) {
  return (
    <>
      {/* Contains each setting to one box/row */}
      <Box>
        {/* Each line is a label and a button */}
        <Grid
          container
          spacing={2}
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          {/* Label */}
          <Grid size={8} padding={3}>
            {/* Name of the setting the user may change */}
            <Typography variant="h5" fontWeight={700} gutterBottom>
              {label}
            </Typography>
            {/* Current value for the setting */}
            <Typography variant="h5" fontWeight={300} gutterBottom>
              {value}
            </Typography>
          </Grid>
          {/* Button to change setting */}
          <Grid
            container
            size={2}
            padding={5}
            direction="row"
            sx={{ justifyContent: "flex-end" }}
          >
            <Button variant="outlined" component={Link} to={editLink}>
              Edit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

function UserSettings() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  // On first render, try to hydrate from cookie via /users/me
  useEffect(() => {
    let cancelled = false;
    api
      .get("/users/me")
      .then((res) => !cancelled && setCurrentUser(res.data.user as User))
      .catch(() => !cancelled && setCurrentUser(null))
      .finally(() => !cancelled && setAuthReady(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
      setCurrentUser(null);
      alert("You have successfully been logged out.");
      window.location.href = "/"; // hard redirect to homepage after logout
    } catch {
      // ignore; keep UI as logged out
      setCurrentUser(null);
    }
  };

  return (
    <>
      <Navbar />
      {/* Main container - stack */}
      <Stack
        paddingTop={5}
        paddingBottom={5}
        paddingLeft={15}
        paddingRight={15}
      >
        {/* Title */}
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Login & Security
        </Typography>
        {/* Setting container */}
        <Box border={1} borderRadius={5}>
          <Stack>
            {/* Each setting: label, value */}
            {settingRow(
              "Username",
              currentUser?.userID ?? "",
              "/UsernameChange"
            )}
            {settingRow("Name", currentUser?.name ?? "", "/NameChange")}
            {settingRow("Email", currentUser?.email ?? "", "/EmailChange")}
            {settingRow(
              "Phone",
              currentUser?.phoneNumber ?? "",
              "/PhoneNumberChange"
            )}
            {settingRow("Password", "*******", "/PasswordChange")}
          </Stack>
        </Box>
        <Button
          variant="contained"
          onClick={handleLogout}
          sx={{ marginTop: 2 }}
        >
          Log Out
        </Button>
      </Stack>
      <Footer />
    </>
  );
}

export default UserSettings;
