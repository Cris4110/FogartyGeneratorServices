import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Import the central API helper you created
import { apiRequest } from "../../utils/api"; 

const CreatePart: React.FC = () => {
    const [partID, setPartid] = useState("");
    const [Stock, setStock] = useState("");
    const [Part_Name, setPart_Name] = useState("");
    const [Description, setDescription] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [responseMsg, setResponseMsg] = useState("");
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...newFiles].slice(0, 10));
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
        const formData = new FormData();
        formData.append("Part_Name", Part_Name);
        formData.append("Stock", Stock);
        formData.append("Description", Description);

        selectedFiles.forEach((file) => {
            formData.append("images", file); // Must match backend key
        });

    try {
        const response = await fetch("http://localhost:3000/api/parts", {
            method: "POST",
            body: formData,
        });
        const result = await response.json();

        if (!response.ok) {
            // Show the backend error directly
            setResponseMsg(result.message || "Error adding Generator.");
            } else {
            setResponseMsg(result.message || "Generator added successfully!");
            // Clear form fields after success
            setPartid("");
            setStock("");
            setPart_Name("");
            
            // Redirect back to inventory management
            navigate("/admin/inven-management");
        } catch (error) {
            // apiRequest throws an Error if response.ok is false
            setResponseMsg(error instanceof Error ? error.message : "Error connecting to server.");
            console.error(error);
        }
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem" }}>
            <div style={{ textAlign: "center" }}>
                <h1>Fogarty Onsite</h1>
                <h1>Generator Service</h1>
            </div>

            <form
                onSubmit={handleSubmit}
                style={{
                    background: "white",
                    padding: "2rem",
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    maxWidth: "400px",
                    margin: "auto",
                }}
            />
            {/* File Upload Section - Centered to match text inputs */}
                <div style={{ width: "80%", margin: "1rem auto" }}>
                    <label style={{ fontSize: "0.8rem", color: "#666" }}>
                        Images ({selectedFiles.length}/10):
                    </label>
                    <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        style={{ marginTop: "0.5rem", display: "block" }} 
                    />
                    
                    {/* Visual list of chosen files */}
                    <div style={{ marginTop: "10px" }}>
                        {selectedFiles.map((file, index) => (
                            <div key={index} style={{ fontSize: "0.75rem", display: "flex", justifyContent: "space-between", background: "#f4f4f4", padding: "4px", marginBottom: "3px", border: "1px solid #ddd" }}>
                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "180px" }}>{file.name}</span>
                                <span onClick={() => removeFile(index)} style={{ color: "red", cursor: "pointer", fontWeight: "bold" }}>X</span>
                            </div>
                        ))}
                    </div>
                </div>
        
        <div style={{ textAlign: "center" }}>
                    <button 
                        type="submit"
                        style={{
                            backgroundColor: "#d32f2f", // Red
                            color: "white",             // White text
                            border: "none",
                            borderRadius: "0px",        // Square
                            padding: "0.75rem 1.5rem",
                            width: "80%",
                            fontWeight: "bold",
                            cursor: "pointer",
                            textTransform: "uppercase"
                        }}
                    >
                        Add Part
                    </button>
                </div>
            </form>
            {responseMsg && <p style={{ textAlign: "center", marginTop: "1rem" }}>{responseMsg}</p>}
        </div>

// Reusable style for your inputs
const inputStyle = {
    display: "block",
    width: "80%",
    margin: "0.5rem auto",
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
};

export default CreatePart;