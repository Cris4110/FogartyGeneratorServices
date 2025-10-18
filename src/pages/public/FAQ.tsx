import Navbar from "./Navbar";
import Footer from "./Footer";
import { Container, Grid, Typography } from "@mui/material";

function Homepage() {
  return (
    <>
      <Navbar />
      {/* Container for questions and answsers*/}
      <Container maxWidth="lg" sx={{ mt: 15, mb: 10 }}>
        
        {/* Styling and sizing for container*/}
        <Grid container spacing={0} alignItems="left">
          <Grid size={{ xs: 12, md: 15}}>

            {/* Title with sizing and alignment */}
            <Typography variant="h3" fontWeight={700} gutterBottom align="center">
              Frequently Asked Questions
            </Typography>

            <Typography variant="h5" fontWeight={700} gutterBottom>
              Which areas do we service?
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              We service all areas but cost of the repair will change based off the distance from our headquarters.
            </Typography>

            <Typography variant="h5" fontWeight={700} gutterBottom>
              Can the price change during the service?
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Yes, if we encounter other issues that need to be fixed or if we have to order parts, the price may increase but we will notify you prior.
            </Typography>
            
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Is there a warranty on the service?
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Depending on the service performed, there may be a warranty. On all our repairs that use official manufacture parts we offer a 1 year service warranty. For third party parts we do not offer warranty.
            </Typography>

            <Typography variant="h5" fontWeight={700} gutterBottom>
              What if I need to reschedule my appointment?
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              No worries! Just use the contact tab and reschedule the appointment! This will let us know the original appointment no longer works for you.
            </Typography>

            <Typography variant="h5" fontWeight={700} gutterBottom>
              What if I dont want the service after the inspection?
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              In cases where the service is declined after the inspection the only thing you will be charged for is the travel costs.
            </Typography>

            <Typography variant="h5" fontWeight={700} gutterBottom>
              What kind of generators do we service?
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              We service all generators big or small, residential or industrial, we cover it all!
            </Typography>

            <Typography variant="h5" fontWeight={700} gutterBottom>
              Is there a way to track my service history?
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              Of course! If you create an account you can see your previous service history as well as your purchase history.
            </Typography>

           
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default Homepage;