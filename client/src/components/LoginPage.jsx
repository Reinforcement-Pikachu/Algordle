import React, { useRef, useState } from 'react';
import '../styles/LoginPage.css';

function LoginPage({ setUser, user }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Toggle state

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSignUp 
        ? "http://localhost:3000/api/auth/signup" 
        : "http://localhost:3000/api/auth/login";
  
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
  
      setUser(data.user);
    } catch (error) {
      console.error("Login/Signup Error:", error.message);
    }
  };
  


 

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{isSignUp ? "Signup" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-btn" type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
        </form>
        <button className="toggle-btn" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Already have an account? Login" : "Need an account? Sign up"}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
