import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Stack,
  type SxProps,
  TextField,
  Typography,
} from "@mui/material";
import type { Theme } from "@emotion/react";
import { useNavigate } from "react-router-dom";
//import logo from "../assets/admin/logo.png"; // update path to your actual logo
//import { AuthContext } from "../../App"; // or adjust import path if your context differs
//import { AuthContext } from "../../context/Appcontext";
import logo from "../../assets/logo.png";
import { AuthContext } from "../../context/Appcontext";

const ContainerStyle: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  backgroundColor: "white",
  borderRadius: "32px",
  padding: "50px 30px",
  maxWidth: "350px",
};

const TitleStyle: SxProps<Theme> = {
  alignSelf: "center",
};

const ImageStyle: SxProps<Theme> = {
  width: "100px",
  height: "100px",
  alignSelf: "center",
};

const FormStyle: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const TextFieldStyle: SxProps<Theme> = {
  width: "350px",
  height: "90px",
};

const SubmitButtonStyle: SxProps<Theme> = {
  width: "150px",
  height: "50px",
};


const Login: React.FC = () => {
  const firstRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  //const auth = useContext(AuthContext);
  const { setCurrentUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    firstRef.current?.focus();
  }, []);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // non-api validation replace with real api using mongo later 
    if (username === "admin" && password === "password") {
      const user = { id: 1, name: "Admin User", role: "admin" };
      setCurrentUser(user);
      localStorage.setItem("user", JSON.stringify(user)); // keep it on refresh
      navigate("/admin");
    } 
    else {
      setIsError(true);
      setErrorMsg("Incorrect username or password. Try again.");
    }
  };

  const handleClearError = () => {
    setIsError(false);
    setErrorMsg("");
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Stack direction="column" spacing="20px" sx={ContainerStyle}>
        <Box component="img" src={logo} alt="logo" sx={ImageStyle} />
          <Typography variant="h4" sx={TitleStyle}>
          Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={FormStyle}>
          <TextField
            ref={firstRef}
            sx={TextFieldStyle}
            label="Username"
            placeholder="Enter Username"
            name="user"
            value={username}
            onChange={handleUsernameChange}
            onFocus={handleClearError}
            error={isError}
          />
          <TextField
            sx={TextFieldStyle}
            label="Password"
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            onFocus={handleClearError}
            error={isError}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={SubmitButtonStyle}
          >
            SIGN IN
          </Button>
        </Box>
        {errorMsg && (
          <Typography variant="body1" color="red">
            {errorMsg}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default Login;
