import Navbar from "./Navbar";
import Footer from "./Footer";
import { Container, Box, Typography, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//defines forms input values as strings
interface FormData {
  name: string;
  email: string;
  phone: string;
  model: string;
  serial: string;
}

function RequestQuote() {
    //formData holds current state of form, setFormData updates state of form, strings set inital value of fields
    const [ formData, setFormData ] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        model: "",
        serial: "",
    });

    //creates state objects for errors
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

    //handles form change, only overwrites field that is changed, leaving everything else the same
    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    // allows use of navigate function to change routes
    const navigate = useNavigate();
    //handles form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // prevents page from refreshing when pressing submit
        // valdiates inputs and shows errors
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone is required";
        if (!formData.model.trim()) newErrors.model = "Model is required";
        if (!formData.serial.trim()) newErrors.serial = "Serial number is required";

        setErrors(newErrors); // sets new errors

        // prevents form from submitting if there are errors
        if(Object.keys(newErrors).length > 0) {
            return;
        }
        alert("Quote request submitted!");
        // navigates to homepage once form is submitted
        navigate("/");
    };

    return (
    <>
        <Navbar />
        <Container maxWidth="sm" sx={{ 
            border: '3px solid #dbdbdbff', 
            borderRadius: '8px', 
            padding: 4, 
            mt: 15, 
            mb: 15,
            display: "flex",
            justifyContent: "center",
            }}>

            {/* 
            box is a form component, 
            noValidate = allows handleSubmit to handle errors, 
            autoComplete = stops suggesting previously entered inputs
            onSumbit = connects to handleSubmit function
            */}
            <Box 
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    textAlign: 'center', 
                    '& .MuiTextField-root': { m: 1, width: '50ch' } 
                }}
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit}
            >
                <Typography variant="h5" fontWeight={25}>
                Request a Free Quote
                </Typography>

                {/* Input fields */}
                <TextField
                    required
                    name="name"
                    label="Name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                />

                <TextField
                    required
                    name="email"
                    label="Email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                />

                <TextField
                    required
                    name="phone"
                    label="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                />

                <TextField
                    required
                    name="model"
                    label="Generator Model"
                    value={formData.model}
                    onChange={handleChange}
                    error={!!errors.model}
                    helperText={errors.model}
                />

                <TextField
                    required
                    name="serial"
                    label="Generator Serial Number"
                    value={formData.serial}
                    onChange={handleChange}
                    error={!!errors.serial}
                    helperText={errors.serial}
                />
                {/* submit button */}
                <Box sx={{ mt: 4, display: "flex", justifyContent: 'center', gap: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{width:"50%"}}
                    >
                        Submit
                    </Button>
                </Box>
            </Box>
        </Container>
        <Footer />
    </>
    );
}

export default RequestQuote;