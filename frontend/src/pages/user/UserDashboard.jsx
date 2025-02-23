import { useState } from "react";
// import "./UserDashboard.css";

export default function UserDashboard() {
  const [formData, setFormData] = useState({
    name: "",
    roomNo: "",
    contactNo: "",
    subject: "",
    description: "",
    priority: "Low",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
  };

  return (
    <div className="page">
      <header className="page-header">User Dashboard</header>
      <main className="page-content">
        <div className="form-container">
          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="input"
            />
            <input
              type="text"
              name="roomNo"
              placeholder="Room No."
              value={formData.roomNo}
              onChange={handleChange}
              className="input"
            />
            <input
              type="text"
              name="contactNo"
              placeholder="Contact No."
              value={formData.contactNo}
              onChange={handleChange}
              className="input"
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className="input"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="textarea"
            ></textarea>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="select"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <button type="submit" className="button">
              Submit
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
