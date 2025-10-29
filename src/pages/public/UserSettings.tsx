import Navbar from "./Navbar";
import Footer from "./Footer";

import { Box, Button, Grid, Stack, Typography } from "@mui/material";


// Helper function that creates a row for each user setting
// label defines the setting and value defines the user's information
function settingRow(label: String, value: String) {
    return (
        <>
            {/* Contains each setting to one box/row */}
            <Box >
                {/* Each line is a label and a button */}
                <Grid container spacing={2} sx={{alignItems: "center", justifyContent: "center"}}>
                    {/* Label */}
                    <Grid size={8} padding={3} >
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
                    <Grid container size={2} padding={5} direction="row" sx={{justifyContent: "flex-end"}}>
                        <Button variant="outlined">Edit</Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}


// Main function that sets up the "Login & Security" page
function UserSettings() {
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
                    <Stack >
                        {/* Each setting: label, value */}
                        {settingRow("Username", "user123")}
                        {settingRow("Name", "John Doe")}
                        {settingRow("Email", "email@email.com")}
                        {settingRow("Phone", "+1 (555) 111-1111")}
                        {settingRow("Password", "*******")}
                    </Stack>
                </Box>
            </Stack>
        <Footer/>
        </>
    );
}


export default UserSettings;