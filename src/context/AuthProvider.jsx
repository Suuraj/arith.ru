import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (username, token) => {
    localStorage.setItem('token', token);
    setUsername(username);
  };

  const logout = () => {
    localStorage.clear();
    setUsername(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('https://arith-ru.onrender.com/auth', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(res.data.username);
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ username, login, logout, loading, isAuth: !!username }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
