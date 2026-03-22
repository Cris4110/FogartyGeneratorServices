import { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Link,
  Box
} from "@mui/material";

export default function AdminCreateInvoice() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    description: "",
    amount: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      const res = await fetch("/api/invoices/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      setResult(data);

    } catch (err) {
      console.error(err);
      alert("Invoice creation failed");
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>

      <Card elevation={4}>
        <CardContent>

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Create Client Invoice
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Generate Wave Inovice.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>

            <Grid container spacing={2}>

              <Grid item xs={12}>
                <TextField
                  label="Client Name"
                  name="name"
                  fullWidth
                  required
                  value={form.name}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Client Email"
                  name="email"
                  type="email"
                  fullWidth
                  required
                  value={form.email}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Invoice Description"
                  name="description"
                  fullWidth
                  multiline
                  rows={3}
                  required
                  value={form.description}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} offset={{ md: 0.45 }}>
                <TextField
                  label="Amount"
                  name="amount"
                  type="number"
                  inputProps={{ step: "0.01" }}
                  fullWidth
                  required
                  value={form.amount}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Creating Invoice...
                    </>
                  ) : (
                    "Create & Send Invoice"
                  )}
                </Button>
              </Grid>

            </Grid>

          </Box>

          {result && (
            <Alert severity="success" sx={{ mt: 3 }}>
              <Typography fontWeight="bold">
                Invoice Created
              </Typography>

              Invoice #: {result.invoiceNumber}

              <br />

              <Link
                href={result.viewUrl}
                target="_blank"
                rel="noopener"
              >
                View Invoice
              </Link>
            </Alert>
          )}

        </CardContent>
      </Card>

    </Container>
  );
}