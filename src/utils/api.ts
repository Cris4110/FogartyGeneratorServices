import { auth } from "../firebase";

const BASE_URL = "http://localhost:3000/api";

// Make sure 'export' is at the very beginning of the const
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  // Get the token from Firebase
  const token = await auth.currentUser?.getIdToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API Request failed");
  }

  return response.json();
};