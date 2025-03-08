import React, { useState,useEffect } from "react";
import LoginValidate from "./LoginValidation";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const CoordinatorLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  axios.defaults.withCredentials=true;
  const [errors, seterrors] = useState({});
  const [name,setName]=useState('');
  const [id,setId]=useState('');
  const navigate=useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(()=>{
    axios.get("http://localhost:3000/coordinator/status").then((res) => {
      if (res.data.Status === "Success") {
        setName(res.data.name);
        setId(res.data.id);
        navigate('/coordinator/dashboard');
      }
    });
  },[])

  const handleSubmit = (e) => {
    e.preventDefault();
    const checkerr = LoginValidate(formData);
    seterrors(checkerr);
    console.log(Object.entries(checkerr).length);

    if (Object.entries(checkerr).length === 0) {
      axios.post("http://localhost:3000/coordinator/login",{
        email:formData.email,
        password:formData.password,
      }).then(res =>{
            //console.log(res);
            if(res.data.status){
            alert(res.data.message);
            navigate("/coordinator/dashboard");
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
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Coordinator Login</h2>
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

export default CoordinatorLogin;
