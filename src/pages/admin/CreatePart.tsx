import { useState } from "react";

const CreatePart: React.FC = () => {
    const [partID, setPartid] = useState("");
    const [type, setType] = useState("");
    const [cost, setCost] = useState("");
    const [responseMsg, setResponseMsg] = useState("");


const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        const response = await fetch("http://localhost:3000/api/parts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ partID, type, cost: parseInt(cost, 10) }),
        });

        const result = await response.json();

        if (!response.ok) {
            // Show the backend error directly
            setResponseMsg(result.message || "Error adding Generator.");
            } else {
            setResponseMsg(result.message || "Generator added successfully!");
            // Clear form fields after success
            setPartid("");
            setType("");
            setCost("");
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
            <h3>Add a part</h3>
            </div>

            <input
            type="text"
            placeholder="ID"
            value={partID}
            onChange={(e) => setPartid(e.target.value)}
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
            placeholder="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
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
            placeholder="Cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
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
            <button type="submit">Add Part</button>
        </div>
    </form>
    {responseMsg && <p style={{ textAlign: "center", marginTop: "1rem" }}>{responseMsg}</p>}
    </div>

    </>
  );
};

export default CreatePart;