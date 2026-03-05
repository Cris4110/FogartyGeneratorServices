import { useState } from "react";
import { useNavigate } from "react-router-dom";
// 1. Import your API helper
import { apiRequest } from "../../utils/api"; 

const CreateGen: React.FC = () => {
    const [genID, setGenid] = useState("");
    const [Serial_Number, setSerial_Number] = useState("");
    const [name, setName] = useState("");
    const [Description, setDescription] = useState("");
    const [Stock, setStock] = useState("");
    const [responseMsg, setResponseMsg] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // 2. Use apiRequest instead of fetch
            // This automatically handles the "http://localhost:3000/api" prefix and Auth headers
            const result = await apiRequest("/generators", {
                method: "POST",
                body: JSON.stringify({ genID, name, Description, Stock, Serial_Number }),
            });

            // If apiRequest doesn't throw, it was successful
            setResponseMsg(result.message || "Generator added successfully!");
            
            // Clear form fields
            setGenid("");
            setName("");
            setDescription("");
            setStock("");
            setSerial_Number("");
            
            // Redirect after a short delay or immediately
            navigate("/admin/inven-management");
            
        } catch (error) {
            // 3. Catch errors from apiRequest (including 401 Unauthorized)
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
                    <h3>Add a generator</h3>
                </div>

                <input
                    type="text"
                    placeholder="Serial Number"
                    value={Serial_Number}
                    onChange={(e) => setSerial_Number(e.target.value)}
                    required
                    style={inputStyle}
                />
                <input
                    type="text"
                    placeholder="Generator Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={inputStyle}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={Description}
                    onChange={(e) => setDescription(e.target.value)}
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
                    <button type="submit">Add Generator</button>
                </div>
            </form>
            {responseMsg && <p style={{ textAlign: "center", marginTop: "1rem" }}>{responseMsg}</p>}
        </div>
    );
};

// Extracted style for cleaner code
const inputStyle = {
    display: "block",
    width: "80%",
    margin: "0.5rem auto",
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
};

export default CreateGen;