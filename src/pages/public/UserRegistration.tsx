import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
//import {AppBar, Toolbar, Box, Button, Typography, Container} from "@mui/material";


const UserRegistration: React.FC = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [userID, setUserID] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [responseMsg, setResponseMsg] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const name = `${fname} ${lname}`;
  try {
    const response = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, userID, email, phoneNumber, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      // Show the backend error directly
      setResponseMsg(result.message || "Error creating admin.");
    } else {
      setResponseMsg(result.message || "Admin created successfully!");
      // Clear form fields after success
      setFname("");
      setLname("");
      setUserID("");
      setEmail("");
      setPhoneNumber("");
      setPassword("");
    }
  } catch (error) {
    setResponseMsg("Error connecting to server.");
    console.error(error);
  }
};

  return (
    <>
      {/* ===== Navbar Section ===== */}
      <Navbar />
      <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem", background: "#f9f9f9" }}>
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
          <h3>Create an account</h3>
          <h5>
            Already have an account? <u>Login</u>
          </h5>
        </div>

        <input
          type="text"
          placeholder="First Name"
          value={fname}
          onChange={(e) => setFname(e.target.value)}
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
          placeholder="Last Name"
          value={lname}
          onChange={(e) => setLname(e.target.value)}
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
          placeholder="User ID"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          type="number"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
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
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          <button type="submit">Create Admin</button>
        </div>
      </form>

      {responseMsg && <p style={{ textAlign: "center", marginTop: "1rem" }}>{responseMsg}</p>}
      </div>
    <Footer />
    </>
  );
};

export default UserRegistration;
