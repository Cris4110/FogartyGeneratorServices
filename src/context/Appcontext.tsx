import React, { createContext, useState, useEffect, type ReactNode } from "react";

export interface User {
  id: number;
  name: string;
  role: string;
}

export interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/admins/checkAuth", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.admin);

        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error("Auth check failed:", err);

        setCurrentUser(null);
      } finally {

        setLoading(false);
      }
    };

    checkAuth();
  }, [])

const logout = async () => {
  try {
    await fetch("http://localhost:3000/api/admins/logout", {
      method: "POST",
      credentials: "include", // must include cookies
    });
  } catch (err) {
    console.error("Logout failed:", err);
  } finally {
    setCurrentUser(null); // clear context
  }
};
  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};