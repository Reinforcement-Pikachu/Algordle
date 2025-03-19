import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./components/LoginPage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import { useState, useEffect } from "react";

function App() {
  const [user, setUser] = useState(null);

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
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Dashboard user={user} setUser={setUser}/> : <LoginPage user={user} setUser={setUser} /> }
        />
      </Routes>
    </Router>
  );
}

export default App;