import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));

        // 🔥 Check token expiry
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.clear();
          setAuth({ token: null, role: null, loading: false });
        } else {
          setAuth({ token, role, loading: false });
        }
      } catch {
        localStorage.clear();
        setAuth({ token: null, role: null, loading: false });
      }
    } else {
      setAuth({ token: null, role: null, loading: false });
    }
  }, []);

  const login = (token) => {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    localStorage.setItem("token", token);
    localStorage.setItem("role", decoded.role);
    setAuth({ token, role: decoded.role, loading: false });
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ token: null, role: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
