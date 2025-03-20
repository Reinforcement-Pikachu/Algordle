import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./components/LoginPage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import { useState, useEffect } from "react";
import './styles/style.css';
import { ThemeProvider } from "./styles/ThemeContext";

function App() {
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    setIsDarkMode(isDark);
    document.body.classList.toggle("dark", isDark);
    document.body.classList.toggle("light", !isDark);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
    document.body.classList.toggle("light", !isDarkMode);
  }, [isDarkMode]);

   // Toggle dark mode & save to localStorage
  const toggleTheme = () => {
  setIsDarkMode((prev) => {
    const newTheme = !prev;
    localStorage.setItem("theme", newTheme ? "dark" : "light");
    return newTheme;
  });
};

  useEffect(() => {
    fetch("http://localhost:8000/api/auth/session", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.error || `HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Session Response:", data); // Debugging
        if (data?.user) setUser(data.user);
      })
      .catch((error) => console.error("Session Fetch Error:", error.message));
  }, []);
  

  return (
    <ThemeProvider>
    <Router>
      
      <Routes>
      <Route
          path="/"
          element={user ? <Dashboard user={user} setUser={setUser} isDarkMode={isDarkMode} toggleTheme={toggleTheme} /> : <LoginPage setUser={setUser} />}
        />
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;