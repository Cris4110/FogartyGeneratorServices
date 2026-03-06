import { useState } from "react";
import { useNavigate } from "react-router-dom";
const CreateGen: React.FC = () => {
    const [genID, setGenid] = useState("");
    const [Serial_Number, setSerial_Number] = useState("");
    const [name, setName] = useState("");
    const [Description, setDescription] = useState("");
    const [Stock, setStock] = useState("");
    const [responseMsg, setResponseMsg] = useState("");

      // Logic for stacking up to 10 images
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles].slice(0, 10));
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
        // Use FormData for file uploads
    const formData = new FormData();
    formData.append("genID", genID);
    formData.append("name", name);
    formData.append("Description", Description);
    formData.append("Stock", Stock);
    formData.append("Serial_Number", Serial_Number);

    // Append each stacked file
    selectedFiles.forEach((file) => {
      formData.append("images", file); // Must match backend key for generators
    });

    try {
        const response = await fetch("http://localhost:3000/api/generators", {
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
            setGenid("");
            setName("");
            setDescription("");
            setStock("");
            setSerial_Number("");
            setSelectedFiles([]);
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
            {/* Image Upload Section */}
          <div style={{ width: "80%", margin: "1rem auto" }}>
            <label style={{ fontSize: "0.8rem", color: "#666" }}>
              Upload Images ({selectedFiles.length}/10):
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "block", marginTop: "0.5rem" }}
            />

            {/* List of files ready for upload */}
            <div style={{ marginTop: "10px" }}>
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  style={{
                    fontSize: "0.75rem",
                    display: "flex",
                    justifyContent: "space-between",
                    background: "#f4f4f4",
                    padding: "4px",
                    marginBottom: "3px",
                    border: "1px solid #ddd",
                  }}
                >
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "180px" }}>
                    {file.name}
                  </span>
                  <span
                    onClick={() => removeFile(index)}
                    style={{ color: "red", cursor: "pointer", fontWeight: "bold" }}
                  >
                    X
                  </span>
                </div>
              ))}
            </div>
          </div>
        
        <div style={{ textAlign: "center" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "#d32f2f", // OG Red
                color: "white",
                border: "none",
                borderRadius: "0px", // Red Square button
                padding: "0.75rem 1.5rem",
                width: "80%",
                fontWeight: "bold",
                cursor: "pointer",
                textTransform: "uppercase",
                marginTop: "1rem"
              }}
            >
              Add Generator
            </button>
          </div>
        </form>
        {responseMsg && (
          <p style={{ textAlign: "center", marginTop: "1rem" }}>{responseMsg}</p>
        )}
      </div>
    </>

  );
};

export default CreateGen;