import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginPage from "./components/LoginPage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ChooseAlgo from "./components/ChooseAlgo.jsx";
import { useState, useEffect } from "react";
import './style.css';

function App() {
  const [user, setUser] = useState(null);
  const [selectedAlgo, setSelectedAlgo] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/auth/session", { credentials: "include" })
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
          // element={user ? <Dashboard user={user} setUser={setUser}/> : <LoginPage user={user} setUser={setUser} /> }
          element={user ? <ChooseAlgo user={user} setUser={setUser} setSelectedAlgo={setSelectedAlgo}/> : <LoginPage user={user} setUser={setUser} /> }
        />
        <Route path="/dashboard" element={user ? <Dashboard user={user} selectedAlgo={selectedAlgo} /> : <LoginPage setUser={setUser} />} />
      </Routes>
    </Router>
  );
}

export default App;