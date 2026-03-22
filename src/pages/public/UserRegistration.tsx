import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
// 1. Import Firebase Auth
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const UserRegistration: React.FC = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [userID, setUserID] = useState(""); // This can now be the Firebase UID
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  // Address Fields
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");

  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponseMsg("Creating account...");

    try {
      // 2. Create User in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // 3. Prepare the data for MongoDB
      const name = `${fname} ${lname}`;
      const address = {
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        zipcode: zipcode.trim(),
      };

      const newUser = {
        _id: firebaseUser.uid, // Use Firebase UID as the primary key for MongoDB
        name,
        userID: firebaseUser.uid, // Linking the two systems
        email,
        phoneNumber,
        address,
      };
      const idToken = await firebaseUser.getIdToken();
      // 4. Send the data to your Node.js API
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}` // 👈 ADD THIS HEADER
        },
        body: JSON.stringify(newUser),
      })
      const result = await response.json();

      if (!response.ok) {
        setResponseMsg(result.message || "Firebase account created, but database sync failed.");
      } else {
        setResponseMsg("Account created successfully!");
        // Clear fields
        setFname("");
        setLname("");
        setEmail("");
        setPhoneNumber("");
        setPassword("");
        setStreet("");
        setCity("");
        setState("");
        setZipcode("");
      }
    } catch (error: any) {
      // Handle Firebase-specific errors (e.g., email already in use)
      setResponseMsg(error.message || "Error connecting to server.");
      console.error(error);
    }
  };

  return (
    <>
      {/* ===== Navbar Section ===== */}
      <Navbar />
      <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem", background: "#f9f9f9" }}>
        <div style={{ textAlign: "center" }}>
          <h1>Request An Account</h1>
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

          <input
            type="text"
            placeholder="Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
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
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            style={{
              display: "block",
              width: "80%",       // set width
              margin: "0.5rem auto", // center horizontally and add spacing
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }} />
          <input
            type="text"
            placeholder="State (e.g., CA)"
            value={state}
            onChange={(e) => setState(e.target.value.toUpperCase())}
            required
            style={{
              display: "block",
              width: "80%",       // set width
              margin: "0.5rem auto", // center horizontally and add spacing
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }} />
          <input
            type="text"
            placeholder="ZIP Code"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            required
            style={{
              display: "block",
              width: "80%",       // set width
              margin: "0.5rem auto", // center horizontally and add spacing
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }} />


          <div style={{ textAlign: "center" }}>
            <button type="submit">Create User</button>
          </div>
        </form>

        {responseMsg && <p style={{ textAlign: "center", marginTop: "1rem" }}>{responseMsg}</p>}
      </div>
      <Footer />
    </>
  );
};

export default UserRegistration;
