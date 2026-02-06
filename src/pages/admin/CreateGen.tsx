import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        const response = await fetch("http://localhost:3000/api/generators", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ genID, name, Description, Stock, Serial_Number }),
        });

        const result = await response.json();
        

        if (!response.ok) {
            // Show the backend error directly
            setResponseMsg(result.message || "Error adding Generator.");
            } else {
            setResponseMsg(result.message || "Generator added successfully!");
            // Clear form fields after success
            setGenid("");
            setName("");
            setDescription("");
            setStock("");
            setSerial_Number("");
            navigate("/admin/inven-management")
        }
    } catch (error) {
        setResponseMsg("Error connecting to server.");
        console.error(error);
    }
};

  return (
    <>
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
            style={{
                display: "block",
                width: "80%",       // set width
                margin: "0.5rem auto", // center horizontally and add spacing
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                }}
            />
            <input
            type="text"
            placeholder="Generator Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
                display: "block",
                width: "80%",       // set width
                margin: "0.5rem auto", // center horizontally and add spacing
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                }}
            />
            <input
            type="text"
            placeholder="Description"
            value={Description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{
                display: "block",
                width: "80%",       // set width
                margin: "0.5rem auto", // center horizontally and add spacing
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                }}
            />
            <input
            type="text"
            placeholder="Stock"
            value={Stock}
            onChange={(e) => setStock(e.target.value)}
            required
            style={{
                display: "block",
                width: "80%",       // set width
                margin: "0.5rem auto", // center horizontally and add spacing
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                }}
            />
        
        <div style={{ textAlign: "center" }}>
            <button type="submit">Add Generator</button>
        </div>
    </form>
    {responseMsg && <p style={{ textAlign: "center", marginTop: "1rem" }}>{responseMsg}</p>}
    </div>

    </>
  );
};

export default CreateGen;