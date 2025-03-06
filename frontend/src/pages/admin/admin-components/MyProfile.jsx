import { useState,useEffect } from "react";
import { Editform } from "./ProfileValidate";
import { Resetpass } from "./ProfileValidate";
import axios from "axios";
const MyProfile = () => {
  const [formData, setFormData] = useState([]);
  axios.defaults.withCredentials=true;
  const [errors, seterrors] = useState({});
  const [activeForm, setActiveForm] = useState("edit"); // Default to "edit"
  const [name, setname] = useState('');
  const [id, setid] = useState('');
  const [password,setpassword]=useState('');
  useEffect(() => {
    axios.get('http://localhost:3000/admin/status')
      .then(res => {
        if (res.data.Status === "Success") {
          setname(res.data.name);
          setid(res.data.id);
          axios.post("http://localhost:3000/admin/profile",{
            id:res.data.id
          }).then(res =>{
            console.log(res.data);
            setFormData(res.data);
          }).catch(err => console.log(err))
        }
        else {
          navigate("/admin-login");
        }
      })
  }, [])
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(activeForm=="edit"){
      const checkerr = Editform(formData);
      seterrors(checkerr);
      console.log(Object.entries(checkerr).length);
      console.log(checkerr)
      if (Object.entries(checkerr).length === 0) {
        axios.put("http://localhost:3000/admin/editprofile",{
          id:id,
          name:formData.name,
          email:formData.email,
          contactno:formData.contactno,
      }).then(res => {
        if(res.data.Status === true){
          alert(res.data.message)
        }
        else{
          alert(res.data.message)
        }
      }).catch(err => console.log(err));

      }
    }
    else{
      const checkerr = Resetpass(password);
      seterrors(checkerr);
      console.log(Object.entries(checkerr).length);
      console.log(checkerr)
      if (Object.entries(checkerr).length === 0) {
        axios.put("http://localhost:3000/admin/resetpassword",{
          id:id,
          password:password,
      }).then(res => {
        if(res.data.Status === true){
          alert(res.data.message)
          setpassword('');
        }
        else{
          alert(res.data.message)
        }
      }).catch(err => console.log(err));
      }
    }
  };

  return (
    <section className="admin_myprofile_content">
      
      <section className="buttons_area_columns">
        {/* Edit Profile Button */}
        <section className={activeForm === "edit" ? "btn_fill_primary" : "btn_outlined_primary"}>
          <button className="main_button" onClick={() => {setActiveForm("edit"); seterrors({});}}>
            <span>Edit Profile</span>
          </button>
        </section>

        {/* Reset Password Button */}
        <section className={activeForm === "reset" ? "btn_fill_primary" : "btn_outlined_primary"}>
          <button className="main_button" onClick={() => {setActiveForm("reset");seterrors({});}}>
            <span>Reset Password</span>
          </button>
        </section>
      </section>

      <section>
        {/* Edit Profile Form (Default) */}
        {activeForm === "edit" && (
          <section className="form_section">
            <form onSubmit={handleSubmit} className="issue_form">
              <div className="input_area_wrapper">
                <section className="input_area_columns">
                  <section>
                    <div className="input_label">
                      <label htmlFor="name">Name:</label>
                    </div>
                    <input type="text" id="name" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} />
                    {errors.name && <div className="userform-error">{errors.name}</div>}
                  </section>

                  <section>
                    <div className="input_label">
                      <label htmlFor="email">Email:</label>
                    </div>
                    <input type="email" id="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
                    {errors.email && <div className="userform-error">{errors.email}</div>}
                  </section>

                  <section>
                    <div className="input_label">
                      <label htmlFor="contactNo">Contact No:</label>
                    </div>
                    <input type="number" id="contactNo" name="contactno" placeholder="Enter your contact number" value={formData.contactno} onChange={handleChange} />
                    {errors.contactno && <div className="userform-error">{errors.contactno}</div>}
                  </section>
                </section>
              </div>

              <section className="buttons_area_columns">
                <section className="btn_fill_primary">
                  <button type="submit" className="main_button">
                    <span>Submit</span>
                  </button>
                </section>
              </section>
            </form>
          </section>
        )}

        {/* Reset Password Form */}
        {activeForm === "reset" && (
          <section className="form_section">
            <form onSubmit={handleSubmit} className="issue_form">
              <div className="input_area_wrapper">
                <section className="input_area_columns">
                  <section>
                    <div className="input_label">
                      <label htmlFor="password">Reset Password:</label>
                    </div>
                    <input type="password" id="password" name="password" placeholder="Enter your password" value={password} onChange={(e)=>{setpassword(e.target.value)}} />
                    {errors.password && <div className="authform-error">{errors.password}</div>}
                  </section>
                </section>
              </div>

              <section className="buttons_area_columns">
                <section className="btn_fill_primary">
                  <button type="submit" className="main_button">
                    <span>Submit</span>
                  </button>
                </section>
              </section>
            </form>
          </section>
        )}
      </section>
    </section>
  );
};

export default MyProfile;
