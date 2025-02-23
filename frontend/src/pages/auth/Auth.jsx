import React, { useState } from "react";
import "./Auth.css"; // Import the CSS file

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);

  const toggleForm = () => {
    setIsSignup(!isSignup);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>
        <form>
          {isSignup && (
            <input type="text" placeholder="Full Name" className="auth-input" />
          )}
          <input type="email" placeholder="Email" className="auth-input" />
          <input type="password" placeholder="Password" className="auth-input" />
          <button type="submit" className="auth-button">
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <p className="toggle-text" onClick={toggleForm}>
          {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </p>
      </div>
    </div>
  );
};

export default Auth;
