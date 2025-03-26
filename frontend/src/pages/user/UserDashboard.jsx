import { useState } from "react";
import UserformValidate from "./UserformValidation";
import axios from "axios";
export default function UserDashboard() {
  const [formData, setFormData] = useState({
    name: "",
    roomNo: "",
    contactNo: "",
    subject: "",
    department: "",
    model: "",
    description: "",
    priority: "",
  });
  const [errors, seterrors] = useState({});

  // Description & Model options based on Subject
  const options = {
    printer: {
      descriptions: ["Printer refilling", "Printer repair"],
      models: ["LaserJet Printer", "OfficeJet Printer"]
    },
    cctv: {
      descriptions: ["Camera not working", "CCTV wiring issue"],
      models: ["Dome Camera", "Bullet Camera"]
    }
  };

  // ----- OLD CODE - (Kapil) -----
  // const handleChange = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // ----- NEW CODE - (Naitik) -----
  // Modify handleChange function to reset description & model when subject changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "subject" ? { description: "", model: "" } : {}) // Reset description & model if subject changes
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log("Form Submitted", formData);
    const checkerr = UserformValidate(formData);
    seterrors(checkerr);
    console.log(Object.entries(checkerr).length);
    if (Object.entries(checkerr).length === 0) {
      axios.post("http://localhost:3000/user/complain", {
        name: formData.name,
        roomno: formData.roomNo,
        contactno: formData.contactNo,
        subject: formData.subject,
        department: formData.department,
        model: formData.model,
        description: formData.description,
        priority: formData.priority,
      }).then(res => {
        console.log(res);
        if (res.data.status) {
          alert(res.data.message);
          window.location.reload();
        }
      }).catch(err => {
        console.log(err);
      })
    } else {
      setTimeout(() => seterrors({}), 3000); // Clear errors after 3 seconds
    }
  };


  return (
    <main className="main_content">

      {/* Header */}
      <header>
        <section className="page_content_header">
          <h1>User Dashboard</h1>
          <p>Raise Issues with Ease – Get Quick Resolutions Fast!</p>
        </section>
      </header>

      {/* User Form */}
      <section className="form_section">
        <form onSubmit={handleSubmit} className="issue_form">

          <div className="input_area_wrapper">
            <section className="input_area_columns">

              <section className="input_area_two_columns">

                <section>
                  <div className="input_label">
                    <label htmlFor="name">Name:</label>
                  </div>
                  <input type="text" id="name" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} />
                  {errors.name && <div className='userform-error'>{errors.name}</div>}
                </section>

                <section>
                  <div className="input_label">
                    <label htmlFor="roomNo">Room No:</label>
                  </div>
                  <input type="text" id="roomNo" name="roomNo" placeholder="Enter your room number" value={formData.roomNo} onChange={handleChange} />
                  {errors.roomNo && <div className='userform-error'>{errors.roomNo}</div>}
                </section>
              </section>

              <section>
                <div className="input_label">
                  <label htmlFor="contactNo">Contact No:</label>
                </div>
                <input type="number" id="contactNo" name="contactNo" placeholder="Enter your contact number" value={formData.contactNo} onChange={handleChange} />
                {errors.contactNo && <div className='userform-error'>{errors.contactNo}</div>}
              </section>

              <section>
                <div className="input_label">
                  <label htmlFor="department">Department:</label>
                </div>
                <div className="select_container">
                  <select id="department" name="department" value={formData.department} onChange={handleChange}>
                    <option value="" disabled hidden>Select department</option>
                    <option value="applied-mechanics">Applied Mechanics</option>
                    <option value="artificial-intelligence">Artificial Intelligence and Machine Learning</option>
                    <option value="automobile-engineering">Automobile Engineering</option>
                    <option value="biomedical-engineering">Biomedical Engineering</option>
                    <option value="chemical-engineering">Chemical Engineering</option>
                    <option value="civil-engineering">Civil Engineering</option>
                    <option value="computer-engineering">Computer Engineering</option>
                    <option value="electrical-engineering">Electrical Engineering</option>
                    <option value="electronics-communication">Electronics and Communication Engineering</option>
                    <option value="environment-engineering">Environment Engineering</option>
                    <option value="information-technology">Information Technology</option>
                    <option value="instrumentation-control">Instrumentation & Control Engineering</option>
                    <option value="mechanical-engineering">Mechanical Engineering</option>
                    <option value="plastic-technology">Plastic Technology</option>
                    <option value="robotics-automation">Robotics and Automation</option>
                    <option value="rubber-technology">Rubber Technology</option>
                    <option value="science-humanities">Science and Humanities</option>
                    <option value="textile-technology">Textile Technology</option>
                  </select>

                </div>
                {errors.department && <div className='userform-error'>{errors.department}</div>}
              </section>

              <section>
                <div className="input_label">
                  <label htmlFor="subject">Subject:</label>
                </div>
                <div className="select_container">
                  <select id="subject" name="subject" value={formData.subject} onChange={handleChange}>
                    <option value="" disabled hidden selected>Select Subject</option>
                    <option value="printer">Printer</option>
                    <option value="cctv">CCTV</option>
                  </select>
                </div>
                {errors.subject && <div className='userform-error'>{errors.subject}</div>}
              </section>

              <section>
                <div className="input_label">
                  <label htmlFor="description">Description:</label>
                </div>
                <div className="select_container">
                  <select
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={!formData.subject}
                    style={{ cursor: formData.subject ? "default" : "not-allowed" }}
                  >
                    <option value="" disabled hidden>Select Description</option>
                    {formData.subject && options[formData.subject].descriptions.map((desc, index) => (
                      <option key={index} value={desc}>{desc}</option>
                    ))}
                  </select>

                </div>
                {errors.description && <div className='userform-error'>{errors.description}</div>}
              </section>

              <section>
                <div className="input_label">
                  <label htmlFor="model">Model:</label>
                </div>
                <div className="select_container">
                  <select
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    disabled={!formData.subject}
                    style={{ cursor: formData.subject ? "default" : "not-allowed" }}
                  >
                    <option value="" disabled hidden>Select Model</option>
                    {formData.subject && options[formData.subject].models.map((mdl, index) => (
                      <option key={index} value={mdl}>{mdl}</option>
                    ))}
                  </select>
                </div>
                {errors.model && <div className='userform-error'>{errors.model}</div>}
              </section>


              {/* OLD - Prioriy Select Input */}
              {/* <section>
                <div className="input_label">
                  <label htmlFor="priority">Priority:</label>
                </div>
                <div className="select_container">
                  <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
                    <option value="" disabled hidden selected>Select Issue Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                {errors.priority && <div className='userform-error'>{errors.priority}</div>}
              </section> */}
              
              {/* NEW - Prioriy Select Input */}
              <section>
                <div className="input_label">
                  <label htmlFor="priority">Priority:</label>
                </div>
                <div className="select_container">
                  <select id="priority" name="priority" value={formData.priority} onChange={handleChange} disabled className="cursor-not-allowed">
                    <option value="High" selected>High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low" >Low</option>
                  </select>
                </div>
                {errors.priority && <div className='userform-error'>{errors.priority}</div>}
              </section>

            </section>
          </div>

          <section className="buttons_area_columns">
            <section className="btn_fill_primary">
              <button type="submit" className="main_button">
                <span>Add</span>
              </button>
            </section>
          </section>

        </form>
      </section>

    </main>
  );
}
