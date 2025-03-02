import React, { useState } from "react";
import "./admin-styles/AdminLogin.css";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div className="authform-error">{errors.email}</div>}

          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <div className="authform-error">{errors.password}</div>}

          <button type="submit" className="auth-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
