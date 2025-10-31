import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/Appcontext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [isChecking, setIsChecking] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/admins/checkAuth", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Token invalid or expired");
        }

        const data = await res.json();
        setCurrentUser(data.admin); 
        setIsValid(true);
      } catch (err) {
        console.warn("Auth check failed:", err);
        setIsValid(false);
        setCurrentUser(null);
      } finally {
        setIsChecking(false);
      }
    };


    if (!currentUser) {
      checkToken();
    } else {
      setIsValid(true);
      setIsChecking(false);
    }
  }, [currentUser, setCurrentUser]);

  if (isChecking) {
    return <div>Checking authentication...</div>;
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
