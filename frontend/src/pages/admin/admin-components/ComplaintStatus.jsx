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
  const [selectedtechid, setselectedtechid] = useState('');
  const [contact, setcontact] = useState('');
  const [isAssigned, setIsAssigned] = useState(false);
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, seterrors] = useState({});
  const [loading,setLoading] =useState(false);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const fetchComplaints = () => {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/details`, {
      fetch: 'complain',
    })
      .then(res => {
        setData(res.data);
        console.log(res.data);
        setFilteredData(res.data);
      })
      .catch(err => { console.log(res.data.message) });
  };
  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/details`, {
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
    setselectedtechid(technician ? technician._id : '');
  };
  useEffect(() => {
    const lowerCaseSearch = searchText.toLowerCase();
    let filtered = data.filter(
      (item) =>
        item.department.toLowerCase().includes(lowerCaseSearch) ||
        item.category.toLowerCase().includes(lowerCaseSearch) ||
        item.status.toLowerCase().includes(lowerCaseSearch) ||
        // item.priority.toLowerCase().includes(lowerCaseSearch) ||
        item.tokenno.toString().includes(lowerCaseSearch) ||
        item.technician.toLowerCase().includes(lowerCaseSearch)
    );

    if (statusFilter !== "All") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    setFilteredData(filtered);
  }, [searchText, statusFilter, data]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/status`).then((res) => {
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
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/complains/${complaint._id}`)
      .then((res) => {
        // console.log("working "+ res.data.roomno);
        setselectedtechnician(res.data.technician);
        setcontact(res.data.technicianno);
        setIsAssigned(res.data.technician !== "");//Disable if technician name is assigned
        setselectedtechid(res.data.technicianid);
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
    if(isAssigned){ return;}
    const checkerr = actionValidate(selectedtechnician, contact);
    seterrors(checkerr);
    if (Object.entries(checkerr).length === 0) {
      setLoading(true);
      axios.put(`${import.meta.env.VITE_BACKEND_URL}/admin/assigntechnician`, {
        id: selectedComplaint._id,
        technician: selectedtechnician,
        technicianno: contact,
        techid: selectedtechid,
      }).then(res => {
        if (res.data.Status === true) {
          alert(res.data.message)
          setIsModalOpen(false);
          fetchComplaints();
        }
        else {
          alert(res.data.message)
        }
      }).catch(err => console.log(err)
    ).finally(() =>{
      setLoading(false);
    })
    } else {
      setTimeout(() => seterrors({}), 3000);
    }
  }
  const columns = [
    {
      name: <span className="column_header">Token no</span>,
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
      name: <span className="column_header">Category</span>,
      selector: (row) => row.category,
      sortable: true,
      center: true,
    },
    {
      name: <span className="column_header">Agent</span>,
      selector: (row) => row.technician,
      sortable: true,
      center: true,
    },
    // {
    //   name: <span className="column_header">Priority</span>,
    //   selector: (row) => row.priority,
    //   sortable: true,
    //   center: true,
    //   cell: (row) => <span className={`priority ${row.priority.toLowerCase()}`}>{row.priority}</span>,
    // },
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
          {["All", "Resolved", "Pending", "OnHold", "Y/A"].map((status) => (
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
                <div className="flex flex-col gap-4">
                  <div className="token_no_component">
                    <p>
                      Token No: <span>{selectedComplaint.tokenno}</span>
                    </p>
                  </div>
                  <p className="text-2xl"><span className="font-bold">Faculty Email:</span>{selectedComplaint.email}</p>
                </div>
                <div className="status_component">
                  <div>
                    <p>Status:</p>
                    <span className={`status ${selectedComplaint.status.toLowerCase()}`}>
                      {selectedComplaint.status}
                    </span>
                  </div>
                  {/* <div>
                    <p>Priority:</p>
                    <span className={`priority ${selectedComplaint.priority.toLowerCase()}`}>
                      {selectedComplaint.priority}
                    </span>
                  </div> */}
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
                        value={getDate(selectedComplaint.issuedate)}
                        readOnly={true}
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
                        value={getDate(selectedComplaint.closuredate)}
                        readOnly={true}
                      />
                    </section>
                  </div>

                  <div className="input_area_two_columns">
                    <section>
                      <div className="input_label">
                        <label htmlFor="facility_name">Facility Name:</label>
                      </div>
                      <input type="text" id="facility_name" name="facility_name" readOnly={true} className="custom-input" value={selectedComplaint.name} />
                    </section>
                    <section>
                      <div className="input_label">
                        <label htmlFor="facility_no">Facility No:</label>
                      </div>
                      <input type="text" id="facility_no" name="facility_no" className="custom-input" readOnly={true} value={selectedComplaint.contactno} />
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
                        readOnly={true}
                        value={selectedComplaint.department}
                      />
                    </section>
                    <section>
                      <div className="input_label">
                        <label htmlFor="room_no">Room No:</label>
                      </div>
                      <input type="text" id="room_no" name="room_no" className="custom-input" readOnly={true} value={selectedComplaint.roomno} />
                    </section>
                  </div>

                  <div className="input_area_two_columns">
                    <section>
                      <div className="input_label">
                        <label htmlFor="category">Category:</label>
                      </div>
                      <input
                        type="text"
                        id="category"
                        name="category"
                        className="custom-input"
                        readOnly={true}
                        value={selectedComplaint.category}
                      />
                    </section>
                    <section>
                      <div className="input_label">
                        <label htmlFor="department">Services:</label>
                      </div>
                      <input
                        type="text"
                        id="department"
                        name="department"
                        readOnly={true}
                        value={selectedComplaint.services}
                      />
                    </section>
                  </div>

                  <section>
                    <div className="input_label">
                      <label htmlFor="complaintDes">Product Description:</label>
                    </div>
                    <input
                      type="text"
                      name="complaintDes"
                      id="complaintDes"
                      className="custom-textarea"
                      readOnly={true}
                      value={selectedComplaint.productdescription}
                    ></input>
                  </section>

                  <section>
                  <div className="input_label">
                    <label htmlFor="descriptionRemarks">Description/Remarks:</label>
                  </div>
                  <textarea
                    name="descriptionRemarks"
                    id="descriptionRemarks"
                    className="custom-textarea"
                    placeholder="Remarks"
                    readOnly={true}
                    value={selectedComplaint.remarks}
                  ></textarea>
                </section>

                  <div className="input_area_two_columns">

                    {/* ---------- OLD CODE ---------- */}
                    {/* <section>
                      <div className="input_label">
                        <label htmlFor="technician_name">Technician Name:</label>
                      </div>
                      <div className="select_container">
                        <select id="technician_name" name="technician_name" value={selectedtechnician}
                          onChange={handleTechnicianChange} disabled={isAssigned} // disable dropdown if technician is assigned
                        >
                          <option value="" disabled hidden >
                            Select Technician
                          </option>
                          {technicians.map((tech) => (
                            <option key={tech._id} value={tech.name}>{tech.name}</option>
                          ))}
                        </select>
                      </div>
                      {errors.technician && <div className='authform-error'>{errors.technician}</div>}
                    </section> */}

                    {/* ---------- NEW CODE "Naitik" ---------- */}
                    <section>
                      <div className="input_label">
                        <label htmlFor="technician_name">Technician Name:</label>
                      </div>
                      {isAssigned ? (
                        <input
                          type="text"
                          id="technician_name"
                          name="technician_name"
                          className="custom-input cursor-no-drop"
                          readOnly={true}
                          value={selectedtechnician}
                        />
                      ) : (
                        <div className="select_container">
                          <select id="technician_name" name="technician_name" className="cursor-pointer" value={selectedtechnician}
                            onChange={handleTechnicianChange} disabled={isAssigned} // disable dropdown if technician is assigned
                          >
                            <option value="" disabled hidden >
                              Select Technician
                            </option>
                            {technicians.map((tech) => (
                              <option key={tech._id} value={tech.name}>{tech.name}</option>
                            ))}
                          </select>
                        </div>
                      )
                      }
                      {errors.technician && <div className='authform-error'>{errors.technician}</div>}
                    </section>



                    <section>
                      <div className="input_label">
                        <label htmlFor="technician_contact">Technician Contact:</label>
                      </div>
                      <input type="tel" id="technician_contact" name="technician_contact" className="custom-input cursor-no-drop"
                        value={contact} readOnly={true} />
                      {errors.contact && <div className='authform-error'>{errors.contact}</div>}
                    </section>
                  </div>
                  <section>
                    <div className="input_label">
                      <label htmlFor="complaintAction">Action:</label>
                    </div>
                    <textarea
                      name="complaintAction"
                      id="complaintAction"
                      className="custom-textarea"
                      value={selectedComplaint.action}
                      readOnly={true}
                    ></textarea>
                  </section>
                </section>
              </div>

              <section className="buttons_area_columns popup_button">
                <section className="btn_fill_primary">
                  <button type="submit" className="main_button" onClick={handlesubmit} disabled={loading || isAssigned}>
                    <span>{loading?"Submitting":"Submit"}</span>
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
