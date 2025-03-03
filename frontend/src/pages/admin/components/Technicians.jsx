import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
// import "./Technician.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Technician = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [name, setname] = useState('');
  const [id, setid] = useState('');
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/technician-data.json");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const lowerCaseSearch = searchText.toLowerCase();
    let filtered = data.filter(
      (item) =>
        item.department.toLowerCase().includes(lowerCaseSearch) ||
        item.subject.toLowerCase().includes(lowerCaseSearch) ||
        item.status.toLowerCase().includes(lowerCaseSearch) ||
        item.priority.toLowerCase().includes(lowerCaseSearch) ||
        item.complaintId.toString().includes(lowerCaseSearch)
    );

    if (statusFilter !== "All") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    setFilteredData(filtered);
  }, [searchText, statusFilter, data]);

  useEffect(() => {
    axios.get('http://localhost:3000/technician/status')
      .then(res => {
        if (res.data.Status === "Success") {
          setname(res.data.name);
          setid(res.data.id);
        }
        else {
          navigate("/auth");
        }
      })
  }, [])

  const columns = [
    {
      name: <span className="column_header">ID</span>,
      selector: (row) => row.complaintId,
      sortable: true,
      center: true,
      wrap: true,
    },
    {
      name: <span className="column_header">Department</span>,
      selector: (row) => row.department, 
      sortable: true, 
      center: true
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
      center: true
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
        <button className="btn-view" onClick={() => alert(`Complaint ID: ${row.complaintId}`)}>
          <i className="fa-regular fa-eye"></i>
        </button>
      ),
    },
  ];

  return (
    <>

      <div className="controls">
        <div className="filter-buttons">
          {['All', 'Resolved', 'Pending'].map((status) => (
            <button key={status} className={statusFilter === status ? "active" : ""} onClick={() => setStatusFilter(status)}>
              {status}
            </button>
          ))}
        </div>

        <div className="dfr gap-12">

          <div className="add_btn">
            <i class="fa-solid fa-plus"></i>
            <button>
              <span>Add Technician</span>
            </button>
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
      </div>

      <div className="datatable-container">
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          striped
          responsive
          className="table-content"
        />
      </div>

    </>
  );
};

export default Technician;
