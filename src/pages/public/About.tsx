import Navbar from "./Navbar";
import Footer from "./Footer";

import { Box, Grid, Stack, Typography } from "@mui/material";
import logo from "../../assets/logo.png";

{/* Placeholder text for the client's introduction*/}
const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et 
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
                deserunt mollit anim id est laborum.`;


function About() {
    return (
        <>
        <Navbar />
        {/* Component for the page's body - Grid layout*/}
        <Grid
            container
            padding={15}
            spacing={15}
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            {/* Child of the component - image*/}
            <Grid>
                <Box
                    component="img"
                    src={logo}  // Placeholder image
                    alt="Logo"
                sx={{
                    width: 200,
                    height: 200,
                }}/>
            </Grid>
             {/* Child of the component - stack*/}
            <Grid>
                <Stack
                    spacing={5}
                    maxWidth={500}
                    >
                    {/* Child of the component - typography*/}
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Introduction
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        {text}
                    </Typography>
                </Stack>
            </Grid>
        </Grid>
        <Footer/>
        </>
    );
}


export default About;