import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const RequestQuote: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [genModel, setGenModel] = useState("");
  const [genSerialNumber, setGenSerialNumber] = useState("");
  const [additionalInfo, setAdditionalNotes] = useState("");

  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = `${firstName} ${lastName}`.trim();

    const newQuote = {
      name,
      email,
      phoneNumber,
      genModel,
      genSerialNumber,
      additionalInfo,
    };

    try {
      const response = await fetch("http://localhost:3000/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuote),
      });

      const result = await response.json();

      if (!response.ok) {
        // Show the backend error directly
        setResponseMsg(result.message || "Error creating quote.");
      } else {
        setResponseMsg(result.message || "Quote created successfully!");
        // Clear form fields after success
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhoneNumber("");
        setGenModel("");
        setGenSerialNumber("");
        setAdditionalNotes("");
      }
    } catch (error) {
      setResponseMsg("Error connecting to server.");
      console.error(error);
    }
  };

  // Upon opening the page, check if user is logged in; if so, prefill form, otherwise redirect
  useEffect(() => {
    let cancelled = false;
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/users/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          if (!cancelled) navigate("/userlogin");
          return;
        }

        const data = await res.json();
        const user = data.user;
        if (!user) {
          if (!cancelled) navigate("/userlogin");
          return;
        }

        // Prefill fields
        if (!cancelled) {
          const fullName = (user.name || "").trim();
          if (fullName) {
            const parts = fullName.split(" ");
            setFirstName(parts.shift() || "");
            setLastName(parts.join(" ") || "");
          }
          if (user.email) setEmail(user.email);
          if (user.phoneNumber) setPhoneNumber(user.phoneNumber);
        }
      } catch (err) {
        if (!cancelled) navigate("/userlogin");
      }
    };

    checkAuth();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <>
      {/* ===== Navbar Section ===== */}
      <Navbar />
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          padding: "2rem",
          background: "#f9f9f9",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1>Request A Quote</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "white",
            padding: "3rem",
            borderRadius: "12px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
            maxWidth: "600px",
            width: "100%",
            margin: "2rem auto",
          }}
        >
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            style={{
              display: "block",
              width: "80%", // set width
              margin: "0.5rem auto", // center horizontally and add spacing
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            style={{
              display: "block",
              width: "80%", // set width
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
              width: "80%", // set width
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
              width: "80%", // set width
              margin: "0.5rem auto", // center horizontally and add spacing
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Generator Model"
            value={genModel}
            onChange={(e) => setGenModel(e.target.value)}
            required
            style={{
              display: "block",
              width: "80%", // set width
              margin: "0.5rem auto", // center horizontally and add spacing
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />

          <input
            type="text"
            placeholder="Generator Serial Number"
            value={genSerialNumber}
            onChange={(e) => setGenSerialNumber(e.target.value)}
            required
            style={{
              display: "block",
              width: "80%", // set width
              margin: "0.5rem auto", // center horizontally and add spacing
              padding: "0.5rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <textarea
            placeholder="Additional Infromation"
            value={additionalInfo}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            required
            style={{
              display: "block",
              width: "80%", // set width
              margin: "0.5rem auto", // center horizontally and add spacing
              padding: "0.75rem",
              borderRadius: "4px",
              border: "1px solid #ccc",
              minHeight: "120px",
              resize: "vertical",
              fontFamily: "Arial, sans-serif",
            }}
          />

          <div style={{ textAlign: "center" }}>
            <button type="submit">Submit</button>
          </div>
        </form>

        {responseMsg && (
          <p style={{ textAlign: "center", marginTop: "1rem" }}>
            {responseMsg}
          </p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default RequestQuote;
