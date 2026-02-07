import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";

import { Backdrop, Box, Button, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface User {
  id: string;
  userID: string;
  name?: string;
  email: string;
  phoneNumber?: string;
  address: Address;
};

interface Address {
  street: string;
  city: string;
  state: string;
  zipcode: string;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api",
  withCredentials: true, // so the JWT cookie goes with requests
});

const UserSettings = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  // On first render, try to hydrate from cookie via /users/me
  // User settings to update
  let fullAddress = currentUser?.address.street + ", " + currentUser?.address.city + ", " + currentUser?.address.state
                      + " " + currentUser?.address.zipcode
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [userID, setUserID] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [curPassword, setcurPassword] = useState("");
  const [newPassword, setnewPassword] = useState(""); 
  //Address Fields
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const userAddress = {
    street:street,
    city: city,
    state: state,
    zipcode: zipcode,
  };

  const [responseMsg, setResponseMsg] = useState("");

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

  // Returns the text field for the specific setting/row
  const getTextField = (label: string) => {
    let inputField;
    switch(label) {
      case "Name": {
        inputField = 
        <>
          < TextField placeholder="First Name" variant="outlined"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
          />
          < TextField placeholder="Last Name" variant="outlined"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
          />
        </>
        break;
      }
      case "Username": {
        inputField = 
        < TextField placeholder="Username" variant="outlined"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
        />
        break;
      }
      case "Email": {
        inputField = 
        < TextField placeholder="Email" variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        break;
      }
      case "Phone Number": {
        inputField = 
        < input placeholder="Phone Number" type="number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        break;
      }
      case "Password": {
        inputField =
        <>
          < TextField placeholder="Current Password" variant="outlined" type="password"
            value={curPassword}
            onChange={(e) => setcurPassword(e.target.value)}
          /> 
          < TextField placeholder="New Password" variant="outlined" type="password"
            value={newPassword}
            onChange={(e) => setnewPassword(e.target.value)}
          />
        </>
        break;
      }
      case "Address": {
        inputField = 
        <>
          < TextField placeholder="Street" variant="outlined"
            value={userAddress.street}
            onChange={(e) => setStreet(e.target.value)}
          />
          < TextField placeholder="City" variant="outlined"
            value={userAddress.city}
            onChange={(e) => setCity(e.target.value)}
          />
          < TextField placeholder="State" variant="outlined"
            value={userAddress.state}
            onChange={(e) => setState(e.target.value)}
          />
          < TextField placeholder="ZIP Code" variant="outlined"
            value={userAddress.zipcode}
            onChange={(e) => setZipcode(e.target.value)}
          />
        </>
        break;
      }
      default: {
        break;
      }
    }
    return inputField;
  }

  // Helper function that creates a row for each user setting
  // label defines the setting and value defines the user's information
  const settingRow = (label: string, value: string) => {
    // Tracks if they press the edit button
    const [openUpdate, setOpenUpdate] = useState(false);
    const handleCloseUpdate = () => {
      setOpenUpdate(false); // Closes the update confirmation
      setFname(""); // Sets the text fields to empty
      setLname("");
      setUserID("");
      setEmail("");
      setPhoneNumber("");
      setcurPassword("");
      setnewPassword("");
      setStreet("");
      setCity("");
      setState("");
      setZipcode("");
    };
    const handleOpenUpdate = () => {
      setOpenUpdate(true);  // Brings up the update confirmation
    };
    
    // Create all of the input fields depending on the setting/label
    const inputField = getTextField(label);

    // Switch to detect which setting's backdrop opened and then change the value in the DB
    const handleUpdateUser = async () => {
      if (currentUser != null) {
        let reqBody = {};
        switch(label) {
          case "Name": {
            currentUser.name = fname + " " + lname;
            reqBody = { name: currentUser.name }
            setFname("");
            setLname("");
            break;
          }
          case "Username": {
            currentUser.userID = userID;
            reqBody = { userID: currentUser.userID }
            setUserID("");
            break;
          }
          case "Email": {
            currentUser.email = email;
            reqBody = { email: currentUser.email }
            setEmail("");
            break;
          }
          case "Phone Number": {
            currentUser.phoneNumber = phoneNumber;
            reqBody = { phoneNumber: currentUser.phoneNumber }
            setPhoneNumber("");
            break;
          }
          case "Password": {
            reqBody = { password: newPassword }
            setcurPassword("");
            setnewPassword("");
            break;
          }
          case "Address": {
            currentUser.address.street = street;
            currentUser.address.city = city;
            currentUser.address.state = state;
            currentUser.address.zipcode = zipcode;
            reqBody = { address: userAddress }
            setStreet("");
            setCity("");
            setState("");
            setZipcode("");
            break;
          }
          default: {
            break;
          }
        }

        // Password validation
        let correctPassword = true;
        if (label == "Password") {
          try {
            const payload = { email: currentUser.email.toLowerCase().trim(), password: curPassword.trim() };
            await api.post("/users/login", payload);     // sets HttpOnly cookie
          } catch(err: any) {
            correctPassword = false;
            setResponseMsg(err.response.data.message);
          }
        }

        if (correctPassword) {
          // Update the user's information in the DB
          try {
            const response = await fetch("http://localhost:3000/api/users/" + currentUser.id, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({reqBody}),
            });

            const result = await response.json();
            if (!response.ok) {
              // Show the backend error directly
              setResponseMsg(result.message || "Error updating user.");
            } else {
              setResponseMsg(result.message || "User updated successfully!");
            }

          } catch (error) {
            console.log("Error updating user: ", error);
          }
        }
      }

      handleCloseUpdate(); // close the backdrop
    };


    return (
      <>
        {/* Contains each setting to one box/row */}
        <Box>
          {/* Each line is a label and a button */}
          <Grid container spacing={2} sx={{ alignItems: "center", justifyContent: "center" }}>
            {/* Label */}
            <Grid size={8} padding={3}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {label}
              </Typography>
              <Typography variant="h5" fontWeight={300} gutterBottom>
                {value}
              </Typography>
            </Grid>
            {/* Button to edit setting */}
            <Grid container size={2} padding={5} direction="row" sx={{ justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={handleOpenUpdate}>
                Edit
              </Button>
            </Grid>
          </Grid>
        </Box>
        {/* Popup for update confirmation */}
        <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={openUpdate}
        >
          <Paper sx={{width: '30%', padding: 10}}>
            <Box padding={2} sx={{textAlign: "center"}}>
              <Typography sx={{fontWeight: 'bold', fontSize: 'h6.fontSize'}}>Confirm changes?</Typography>
              {inputField}
            </Box>
            <Stack direction="row" spacing={20} sx={{justifyContent: "center", alignItems: "center"}}>
              <Button variant="contained" onClick={handleCloseUpdate}>Decline</Button>
              <Button variant="contained" onClick={handleUpdateUser}>Confirm</Button>
            </Stack>
          </Paper>
        </Backdrop>
      </>
    );
  }

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
        {responseMsg && <p style={{ textAlign: "center", marginTop: "1rem" }}>{responseMsg}</p>}
        {/* Setting container */}
        <Box border={1} borderRadius={5}>
          <Stack>
            {settingRow("Name", currentUser?.name ?? "")}
            {settingRow("Username", currentUser?.userID ?? "")}
            {settingRow("Email", currentUser?.email ?? "")}
            {settingRow("Phone Number", currentUser?.phoneNumber ?? "")}
            {settingRow("Password", "***********")}
            {settingRow("Address", fullAddress ?? "")}
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
