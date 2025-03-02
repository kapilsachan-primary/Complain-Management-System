import React, { useState } from "react";
import "./admin-styles/AdminProfileAuth.css";

const AdminProfileAuth = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
        <h2>Admin Profile</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            className="auth-input"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <div className='authform-error'>{errors.name}</div>}

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
            type="tel"
            placeholder="Phone Number"
            className="auth-input"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.contactNo && <div className='authform-error'>{errors.contactNo}</div>}

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
            Go to Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfileAuth;
