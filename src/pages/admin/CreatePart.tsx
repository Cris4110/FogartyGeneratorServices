import { useState } from "react";
import { useNavigate } from "react-router-dom";
// Import the central API helper you created
import { apiRequest } from "../../utils/api"; 

const CreatePart: React.FC = () => {
    const [partID, setPartid] = useState("");
    const [Stock, setStock] = useState("");
    const [Part_Name, setPart_Name] = useState("");
    const [responseMsg, setResponseMsg] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // apiRequest handles the BASE_URL and injects the Firebase Bearer token
            const result = await apiRequest("/parts", {
                method: "POST",
                body: JSON.stringify({ partID, Part_Name, Stock }),
            });

            // If the request is successful, apiRequest returns the parsed JSON
            setResponseMsg(result.message || "Part added successfully!");
            
            // Reset form
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
            >
                <div style={{ textAlign: "center" }}>
                    <h3>Add a part</h3>
                </div>

                <input
                    type="text"
                    placeholder="Name"
                    value={Part_Name}
                    onChange={(e) => setPart_Name(e.target.value)}
                    required
                    style={inputStyle}
                />
                <input
                    type="text"
                    placeholder="Stock"
                    value={Stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                    style={inputStyle}
                />
            
                <div style={{ textAlign: "center" }}>
                    <button type="submit">Add Part</button>
                </div>
            </form>
            {responseMsg && <p style={{ textAlign: "center", marginTop: "1rem" }}>{responseMsg}</p>}
        </div>
    );
};

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