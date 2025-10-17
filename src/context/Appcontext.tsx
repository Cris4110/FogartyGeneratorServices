import React, { createContext, useState, type ReactNode } from "react";

export interface User {
  id: number;
  name: string;
  role: string;
}

export interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  setCurrentUser: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};