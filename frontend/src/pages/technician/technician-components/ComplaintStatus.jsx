import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ComplaintStatus = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [technicians, settechnicians] = useState([]);
  const [selectedtechnician, setselectedtechnician] = useState('');
  const [contact, setcontact] = useState('');
  const [isAssigned, setIsAssigned] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, seterrors] = useState({});
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  useEffect(() => {
    axios.post('http://localhost:3000/admin/details', {
      fetch: 'complain',
    })
      .then(res => {
        setData(res.data);
        console.log(res.data);
        setFilteredData(res.data);
      })
      .catch(err => { console.log(res.data.message) });
  }, []);

  useEffect(() => {
    axios.post('http://localhost:3000/admin/details', {
      fetch: 'selecttech',
    })
      .then(res => {
        settechnicians(res.data);
        console.log("Technician= " + res.data);
      })
      .catch(err => { console.log(res.data.message) });
  }, []);

  const handleTechnicianChange = (event) => {
    const selectedname = event.target.value;
    setselectedtechnician(selectedname);
    const technician = technicians.find(t => t.name === selectedname);
    setcontact(technician ? technician.contactno : '');
  };
  useEffect(() => {
    const lowerCaseSearch = searchText.toLowerCase();
    let filtered = data.filter(
      (item) =>
        item.department.toLowerCase().includes(lowerCaseSearch) ||
        item.subject.toLowerCase().includes(lowerCaseSearch) ||
        item.status.toLowerCase().includes(lowerCaseSearch) ||
        item.priority.toLowerCase().includes(lowerCaseSearch) ||
        item.tokenno.toString().includes(lowerCaseSearch) ||
        item.technician.toLowerCase().includes(lowerCaseSearch)
    );

    if (statusFilter !== "All") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    setFilteredData(filtered);
  }, [searchText, statusFilter, data]);

  useEffect(() => {
    axios.get("http://localhost:3000/admin/status").then((res) => {
      if (res.data.Status === "Success") {
        setName(res.data.name);
        setId(res.data.id);
      } else {
        navigate("/admin-login");
      }
    });
  }, []);

  const getDate = (issuedate) => {
    if (issuedate != null) {
      const now = new Date(issuedate);
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const date = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${date}`;
    }
    else {
      return "";
    }
  }

  const handleViewComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    axios.get(`http://localhost:3000/admin/complains/${complaint._id}`)
      .then((res) => {
        // console.log("working "+ res.data.roomno);
        setselectedtechnician(res.data.technician);
        setcontact(res.data.technicianno);
        setIsAssigned(res.data.technician !== ""); //Disable if technician name is assigned
      }).catch(error => console.error('Error here:', error));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
    seterrors({});
  };
  function actionValidate(selectedtechnician, contact) {
    const errors = {};
    if (selectedtechnician === "") {
      errors.technician = "Technician hasn't been assigned yet";
    }
    if (contact === "") {
      errors.contact = "Technician hasn't been assigned yet";
    }
    return errors;
  }
  const handlesubmit = (e) => {
    e.preventDefault();
    const checkerr = actionValidate(selectedtechnician, contact);
    seterrors(checkerr);
    if (Object.entries(checkerr).length === 0) {
      axios.put("http://localhost:3000/admin/assigntechnician", {
        id: selectedComplaint._id,
        technician: selectedtechnician,
        technicianno: contact,
      }).then(res => {
        if (res.data.Status === true) {
          alert(res.data.message)
          setIsModalOpen(false);
        }
        else {
          alert(res.data.message)
        }
      }).catch(err => console.log(err));
    } else {
      setTimeout(() => seterrors({}), 3000);
    }
  }
  const columns = [
    {
      name: <span className="column_header">ID</span>,
      selector: (row) => row.tokenno,
      sortable: true,
      center: true,
      wrap: true,
    },
    {
      name: <span className="column_header">Department</span>,
      selector: (row) => row.department,
      sortable: true,
      center: true,
    },
    {
      name: <span className="column_header">Status</span>,
      selector: (row) => row.status,
      sortable: true,
      center: true,
      cell: (row) => <span className={`status ${row.status.toLowerCase().replace(" ", "-")}`}>{row.status}</span>,
    },
    {
      name: <span className="column_header">Subject</span>,
      selector: (row) => row.subject,
      sortable: true,
      center: true,
    },
    {
      name: <span className="column_header">Agent</span>,
      selector: (row) => row.technician,
      sortable: true,
      center: true,
    },
    {
      name: <span className="column_header">Priority</span>,
      selector: (row) => row.priority,
      sortable: true,
      center: true,
      cell: (row) => <span className={`priority ${row.priority.toLowerCase()}`}>{row.priority}</span>,
    },
    {
      name: <span className="column_header">Actions</span>,
      center: true,
      cell: (row) => (
        <button className="btn-view" onClick={() => handleViewComplaint(row)}>
          <i className="fa-regular fa-eye"></i>
        </button>
      ),
    },
  ];

  return (
    <section>
      <div className="controls">
        <div className="filter-buttons">
          {["All", "Resolved", "Pending", "OnHold"].map((status) => (
            <button key={status} className={statusFilter === status ? "active" : ""} onClick={() => setStatusFilter(status)}>
              {status}
            </button>
          ))}
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>

      <div className="datatable-container">
        <DataTable columns={columns} data={filteredData} pagination highlightOnHover striped responsive className="table-content" />
      </div>

      {isModalOpen && selectedComplaint && (
        <div className="popup_container active_scroll">
          <div className="popup_content">

            <div className="x_icon" onClick={closeModal}>
              <button className="close_popup">
                <img src="/assets/icons/x-icon.svg" alt="Close Sidebar" />
              </button>
            </div>

            <form className="popup_components">
              <h1 className="popup_primary_header">Complaint Status Details</h1>

              <div className="top_cont">
                <div className="token_no_component">
                  <p>
                    Token No: <span>{selectedComplaint.tokenno}</span>
                  </p>
                </div>
                <div className="status_component">
                  <div>
                    <p>Status:</p>
                    <span className={`status ${selectedComplaint.status.toLowerCase()}`}>
                      {selectedComplaint.status}
                    </span>
                  </div>
                  <div>
                    <p>Priority:</p>
                    <span className={`priority ${selectedComplaint.priority.toLowerCase()}`}>
                      {selectedComplaint.priority}
                    </span>
                  </div>
                </div>
              </div>

              <div className="input_area_wrapper">
                <section className="input_area_columns">
                  <div className="input_area_two_columns">
                    <section>
                      <div className="input_label">
                        <label htmlFor="issue_date">Issue Date:</label>
                      </div>
                      <input
                        type="date"
                        id="issue_date"
                        name="issue_date"
                      />
                    </section>
                    <section>
                      <div className="input_label">
                        <label htmlFor="close_date">Close Date:</label>
                      </div>
                      <input
                        type="date"
                        id="close_date"
                        name="close_date"
                      />
                    </section>
                  </div>


                  <div className="input_area_two_columns">
                    <section>
                      <div className="input_label">
                        <label htmlFor="department">Department:</label>
                      </div>
                      <input
                        type="text"
                        id="department"
                        name="department"
                        value={selectedComplaint.department}
                      />
                    </section>
                    <section>
                      <div className="input_label">
                        <label htmlFor="room_no">Room No:</label>
                      </div>
                      <input type="text" id="room_no" name="room_no" className="custom-input" />
                    </section>
                  </div>

                  <section>
                    <div className="input_label">
                      <label htmlFor="subject">Subject:</label>
                    </div>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="custom-input"
                      value={selectedComplaint.subject}
                    />
                  </section>

                  <section>
                    <div className="input_label">
                      <label htmlFor="complaintDes">Description:</label>
                    </div>
                    <textarea
                      name="complaintDes"
                      id="complaintDes"
                      className="custom-textarea"
                    ></textarea>
                  </section>

                  <section>
                    <div className="input_label">
                      <label htmlFor="status">Status: </label>
                    </div>
                    <div className="select_container">
                      <select id="status" name="status" value={selectedComplaint.status}>
                        <option value="" disabled hidden selected>Issue Priority</option>
                        <option value="Pending">Pending</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </section>

                  <section>
                    <div className="input_label">
                      <label htmlFor="complaintAction">Action:</label>
                    </div>
                    <textarea
                      name="complaintAction"
                      id="complaintAction"
                      className="custom-textarea"
                    ></textarea>
                  </section>
                </section>
              </div>

              <section className="buttons_area_columns popup_button">
                <section className="btn_fill_primary">
                  <button type="submit" className="main_button">
                    <span>Submit</span>
                  </button>
                </section>
                <section className="btn_outlined_primary">
                  <button type="submit" className="main_button">
                    <span>Forward To Admin</span>
                  </button>
                </section>
              </section>
            </form>


          </div>
        </div>
      )}

    </section>
  );
};

export default ComplaintStatus;
