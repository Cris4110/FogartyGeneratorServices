
import { Container, Box, Typography, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

//defines forms input values as strings
interface FormData {
    name: string;
    type: string;
    serial: string;
    power: string;
    fuel: string;
    manufactuer: string;
    stock: string;
    availability: string;
    sale: string;


}

function CreateItem() {
    //formData holds current state of form, setFormData updates state of form, strings set inital value of fields
    const [ formData, setFormData ] = useState<FormData>({
        name: "",
        type: "",
        serial: "",
        power: "",
        fuel: "",
        manufactuer: "",
        stock: "",
        availability: "",
        sale: "",
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
        if (!formData.name.trim()) newErrors.name = "name is required";
        if (!formData.type.trim()) newErrors.type = "type is required";
        if (!formData.serial.trim()) newErrors.serial = "serial number is required";
        if (!formData.power.trim()) newErrors.power = "power type is required";
        if (!formData.fuel.trim()) newErrors.fuel = "fuel type is required";
        if (!formData.manufactuer.trim()) newErrors.manufactuer = "manufactuer is required";
        if (!formData.stock.trim()) newErrors.stock = "stock number is required";
        if (!formData.availability.trim()) newErrors.availability = "availability is required";
        if (!formData.sale.trim()) newErrors.sale = "sale is required";

        setErrors(newErrors); // sets new errors

        // prevents form from submitting if there are errors
        if(Object.keys(newErrors).length > 0) {
            return;
        }
        alert("Item Added!");
        // navigates to homepage once form is submitted
        navigate("/admin/inven-management");
    };

    return (
    <>
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
                Create an Item
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
                    name="type"
                    label="Type"
                    value={formData.type}
                    onChange={handleChange}
                    error={!!errors.type}
                    helperText={errors.type}
                />

                <TextField
                    required
                    name="serial"
                    label="Serial Number"
                    value={formData.serial}
                    onChange={handleChange}
                    error={!!errors.serial}
                    helperText={errors.serial}
                />

                <TextField
                    required
                    name="power"
                    label="Power"
                    value={formData.power}
                    onChange={handleChange}
                    error={!!errors.power}
                    helperText={errors.power}
                />

                <TextField
                    required
                    name="fuel"
                    label="Fuel Type"
                    value={formData.fuel}
                    onChange={handleChange}
                    error={!!errors.fuel}
                    helperText={errors.fuel}
                />

                <TextField
                    required
                    name="manufactuer"
                    label="Manufactuer"
                    value={formData.manufactuer}
                    onChange={handleChange}
                    error={!!errors.manufactuer}
                    helperText={errors.manufactuer}
                />

                <TextField
                    required
                    name="stock"
                    label="Stock"
                    value={formData.stock}
                    onChange={handleChange}
                    error={!!errors.stock}
                    helperText={errors.stock}
                />

                <TextField
                    required
                    name="availability"
                    label="Availability"
                    value={formData.availability}
                    onChange={handleChange}
                    error={!!errors.availability}
                    helperText={errors.availability}
                />

                <TextField
                    required
                    name="sale"
                    label="Sale"
                    value={formData.sale}
                    onChange={handleChange}
                    error={!!errors.sale}
                    helperText={errors.sale}
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
    </>
    );
}

export default CreateItem;