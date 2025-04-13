import React, { useState,useEffect } from "react";
import LoginValidate from "./LoginValidation";
import RegisterValidate from "./RegistrationValidation";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  axios.defaults.withCredentials=true;
  const navigate=useNavigate();
  const [name,setName]=useState('');
  const [id,setId]=useState('');
  const [errors, seterrors] = useState({});
  const [loading,setLoading]= useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const toggleForm = () => {
  //   setIsSignup(!isSignup);
  //   seterrors({});
  //   setFormData({
  //     ...formData,
  //     name: "", email: "", contactNo: "", password: "", confirmpass: "",
  //   })
  // };

  useEffect(()=>{
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/technician/status`).then((res) => {
      if (res.data.Status === "Success") {
        setName(res.data.name);
        setId(res.data.id);
        navigate('/technician/dashboard');
      }
    });
  },[])

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log("Form Submitted", formData);

    // if (isSignup) {
    //   const checkerr = RegisterValidate(formData);
    //   seterrors(checkerr);
    //   console.log(Object.entries(checkerr).length);

    //   if (Object.entries(checkerr).length === 0) {
    //     axios.post("${import.meta.env.VITE_BACKEND_URL}/technician/register",{
    //       name:formData.name,
    //       email:formData.email,
    //       contactno:formData.contactNo,
    //       password:formData.password,
    //     }).then(res =>{
    //          // console.log(res);
    //           if(res.data.status){
    //           alert(res.data.message);
    //           }
    //           else
    //           alert(res.data.message);
    //     }).catch(err =>{
    //       console.log(err);
    //     })
    //     toggleForm();
    //   } else {
    //     setTimeout(() => seterrors({}), 3000); // Clear errors after 3 seconds
    //   }
    // } else {
      const checkerr = LoginValidate(formData);
      seterrors(checkerr);
      console.log(Object.entries(checkerr).length);

      if (Object.entries(checkerr).length === 0) {
        setLoading(true);
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/technician/login`,{
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
        }).finally(() =>{
          setLoading(false);
        })
      } else {
        setTimeout(() => seterrors({}), 3000); // Clear errors after 3 seconds
      }
    //}
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Technician Login</h2>
        <form>
          {/* {isSignup && (
            <input type="text" placeholder="Full Name" className="auth-input" name="name" value={formData.name} onChange={handleChange} />
          )}
          {errors.name && <div className='authform-error'>{errors.name}</div>} */}

          <input type="email" placeholder="Email" className="auth-input" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <div className='authform-error'>{errors.email}</div>}

          {/* {isSignup && (
            <input type="tel" placeholder="Phone Number" className="auth-input" name="contactNo" value={formData.contactNo} onChange={handleChange} />
          )}
          {errors.contactNo && <div className='authform-error'>{errors.contactNo}</div>} */}

          <input type="password" placeholder="Password" className="auth-input" name="password" value={formData.password} onChange={handleChange} />
          {errors.password && <div className='authform-error'>{errors.password}</div>}

          {/* {isSignup && (
            <input type="password" placeholder="Confirm Password" className="auth-input" name="confirmpass" value={formData.confirmpass} onChange={handleChange} />
          )}
          {errors.confirmpass && <div className='authform-error'>{errors.confirmpass}</div>} */}

          <button type="submit" className="auth-button" onClick={handleSubmit} disabled={loading}>
            {loading?"Verifing":"Login"}
          </button>
        </form>
        {/* <p className="toggle-text" onClick={toggleForm}>
          {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
        </p> */}
      </div>
    </div>
  );
};

export default Auth;
