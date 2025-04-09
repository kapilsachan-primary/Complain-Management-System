import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ComplaintStatus = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, seterrors] = useState({});
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const fetchComplaints = () => {
    axios.post('http://localhost:3000/admin/details', {
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
    const lowerCaseSearch = searchText.toLowerCase();
    let filtered = data.filter(
      (item) =>
        item.department.toLowerCase().includes(lowerCaseSearch) ||
        item.category.toLowerCase().includes(lowerCaseSearch) ||
        item.status.toLowerCase().includes(lowerCaseSearch) ||
        //item.priority.toLowerCase().includes(lowerCaseSearch) ||
        item.tokenno.toString().includes(lowerCaseSearch) ||
        item.technician.toLowerCase().includes(lowerCaseSearch)
    );

    if (statusFilter !== "All") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    setFilteredData(filtered);
  }, [searchText, statusFilter, data]);

  useEffect(() => {
    axios.get("http://localhost:3000/coordinator/status").then((res) => {
      if (res.data.Status === "Success") {
        setName(res.data.name);
        setId(res.data.id);
      } else {
        navigate("/coordinator-login");
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
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
    seterrors({});
  };

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
      name: <span className="column_header">View</span>,
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
                  <p className="text-2xl"><span className="font-bold"> Faculty Email:</span>{selectedComplaint.email}</p>
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
                        id="services"
                        name="services"
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
                  ></textarea>
                </section>

                  <div className="input_area_two_columns">
                    <section>
                      <div className="input_label">
                        <label htmlFor="technician_name">Technician Name:</label>
                      </div>
                      <input
                        type="text"
                        id="technician"
                        name="technician"
                        className="custom-input"
                        readOnly={true}
                        value={selectedComplaint.technician}
                      />
                    </section>
                    <section>
                      <div className="input_label">
                        <label htmlFor="technician_contact">Technician Contact:</label>
                      </div>
                      <input type="tel" id="technician_contact" name="technician_contact" className="custom-input"
                        value={selectedComplaint.technicianno} readOnly={true} />
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
            </form>

          </div>
        </div>
      )}

    </section>
  );
};

export default ComplaintStatus;
