import React, { useState } from "react";
import "./Auth.css"; // Import the CSS file
import LoginValidate from "./LoginValidation";
import RegisterValidate from "./RegistrationValidation";
const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    password: "",
    confirmpass: "",
  });
  const [errors,seterrors]=useState({});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleForm = () => {
    setIsSignup(!isSignup);
    seterrors({});
    setFormData({
      ...formData,
      name:"",email:"",contactNo:"",password:"",confirmpass:"",
    })
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Form Submitted", formData);
      if(isSignup){
        seterrors(RegisterValidate(formData));
        const checkerr=RegisterValidate(formData);
        console.log(Object.entries(checkerr).length)
        if(Object.entries(checkerr).length=== 0){
          alert("Every Thing OK.");
          toggleForm();
        }
        }
        else{
            seterrors(LoginValidate(formData));
            const checkerr=LoginValidate(formData);
            console.log(Object.entries(checkerr).length)
            if(Object.entries(checkerr).length=== 0){
              alert("Every Thing OK.");
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
          {errors.name && <div className='userform-error'>{errors.name}</div>}

          <input type="email" placeholder="Email" className="auth-input" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <div className='userform-error'>{errors.email}</div>}

          {isSignup && (
            <input type="tel" placeholder="Phone Number" className="auth-input" name="contactNo" value={formData.contactNo} onChange={handleChange}/>
          )}
          {errors.contactNo && <div className='userform-error'>{errors.contactNo}</div>}

          <input type="password" placeholder="Password" className="auth-input" name="password" value={formData.password} onChange={handleChange}/>
          {errors.password && <div className='userform-error'>{errors.password}</div>}

          {isSignup && (
            <input type="password" placeholder="Confirm Password" className="auth-input" name="confirmpass"  value={formData.confirmpass} onChange={handleChange}/>
          )}
          {errors.confirmpass && <div className='userform-error'>{errors.confirmpass}</div>}

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
