
import AdminNavbar from './AdminNavbar';
import { Box, Container, Fab } from '@mui/material';
import ItemTabs from './ItemTabs';

// admin inventory management page
function InventoryManagement() {
  return (
    <>
      <AdminNavbar />
      <Container
          maxWidth="lg"
          sx={{
          ml: "13vw",
          mt: 4,
          }}
      >
        <Box 
          sx={{
          position: "relative",
          }}
        >
        {/* allows user to switch between the generator table and parts table */}
        <ItemTabs></ItemTabs>
        </Box>
      </Container>
    </>
  );
}

export default InventoryManagement;