import React, { useState } from "react";
import "./auth-styles/Auth.css"; // Import the CSS file
import LoginValidate from "./LoginValidation";
import RegisterValidate from "./RegistrationValidation";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    password: "",
    confirmpass: "",
  });
  axios.defaults.withCredentials=true;
  const navigate=useNavigate();
  const [errors, seterrors] = useState({});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleForm = () => {
    setIsSignup(!isSignup);
    seterrors({});
    setFormData({
      ...formData,
      name: "", email: "", contactNo: "", password: "", confirmpass: "",
    })
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log("Form Submitted", formData);

    if (isSignup) {
      const checkerr = RegisterValidate(formData);
      seterrors(checkerr);
      console.log(Object.entries(checkerr).length);

      if (Object.entries(checkerr).length === 0) {
        axios.post("http://localhost:3000/technician/register",{
          name:formData.name,
          email:formData.email,
          contactno:formData.contactNo,
          password:formData.password,
        }).then(res =>{
             // console.log(res);
              if(res.data.status){
              alert(res.data.message);
              }
              else
              alert(res.data.message);
        }).catch(err =>{
          console.log(err);
        })
        toggleForm();
      } else {
        setTimeout(() => seterrors({}), 3000); // Clear errors after 3 seconds
      }
    } else {
      const checkerr = LoginValidate(formData);
      seterrors(checkerr);
      console.log(Object.entries(checkerr).length);

      if (Object.entries(checkerr).length === 0) {
        axios.post("http://localhost:3000/technician/login",{
          email:formData.email,
          password:formData.password,
        }).then(res =>{
              //console.log(res);
              if(res.data.status){
              alert(res.data.message);
              navigate("/technician/dashboard");
              }
              else{
              alert(res.data.message);
              window.location.reload();
            }
        }).catch(err =>{
          console.log(err);
        })
      } else {
        setTimeout(() => seterrors({}), 3000); // Clear errors after 3 seconds
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>
        <form>
          {isSignup && (
            <input type="text" placeholder="Full Name" className="auth-input" name="name" value={formData.name} onChange={handleChange} />
          )}
          {errors.name && <div className='authform-error'>{errors.name}</div>}

          <input type="email" placeholder="Email" className="auth-input" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <div className='authform-error'>{errors.email}</div>}

          {isSignup && (
            <input type="tel" placeholder="Phone Number" className="auth-input" name="contactNo" value={formData.contactNo} onChange={handleChange} />
          )}
          {errors.contactNo && <div className='authform-error'>{errors.contactNo}</div>}

          <input type="password" placeholder="Password" className="auth-input" name="password" value={formData.password} onChange={handleChange} />
          {errors.password && <div className='authform-error'>{errors.password}</div>}

          {isSignup && (
            <input type="password" placeholder="Confirm Password" className="auth-input" name="confirmpass" value={formData.confirmpass} onChange={handleChange} />
          )}
          {errors.confirmpass && <div className='authform-error'>{errors.confirmpass}</div>}

          <button type="submit" className="auth-button" onClick={handleSubmit}>
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
