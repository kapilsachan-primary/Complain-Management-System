import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";

const TechnicianDashboard = () => {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

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

  // Filter data based on search input
  useEffect(() => {
    const lowerCaseSearch = searchText.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.subject.toLowerCase().includes(lowerCaseSearch) ||
        item.status.toLowerCase().includes(lowerCaseSearch) ||
        item.priority.toLowerCase().includes(lowerCaseSearch) ||
        item.complaintId.toString().includes(lowerCaseSearch)
    );
    setFilteredData(filtered);
  }, [searchText, data]);

const columns = [
  { name: "ID", selector: (row) => row.complaintId, sortable: true, center: true },
  {
    name: "Status",
    selector: (row) => row.status,
    sortable: true,
    center: true,
    cell: (row) => (
      <span
        className={`cadd-status ${
          row.status === "Pending"
            ? "cadd-status-pending"
            : row.status === "Resolved"
            ? "cadd-status-resolved"
            : row.status === "In Progress"
            ? "cadd-status-progress"
            : "cadd-status-default" // Default for unknown statuses
        }`}
      >
        {row.status}
      </span>
    ),
  },
  { name: "Subject", selector: (row) => row.subject, sortable: true, center: true },
  {
    name: "Priority",
    selector: (row) => row.priority,
    sortable: true,
    center: true,
    cell: (row) => (
      <span
        className={`cadd-priority ${
          row.priority === "High"
            ? "cadd-priority-high"
            : row.priority === "Medium"
            ? "cadd-priority-medium"
            : row.priority === "Low"
            ? "cadd-priority-low"
            : "cadd-priority-default"
        }`}
      >
        {row.priority}
      </span>
    ),
  },
  {
    name: "Actions",
    center: true,
    cell: (row) => (
      <button className="cadd-btn-view " onClick={() => alert(`Complaint ID: ${row.complaintId}`)}>
        <i className="fa-regular fa-eye"></i>
      </button>
    ),
  },
];

  

  const customStyles = {
    searchContainer: {
      marginBottom: "4rem",
      textAlign: "center",
    },
    table: {
      style: {
        borderCollapse: "separate",
        borderSpacing: "0 0.3rem",
      },
    },
    headCells: {
      style: {
        backgroundColor: "var(--color-aliceblue)",
        borderTop: "0.1rem solid var(--color-whitesmoke)",
        borderBottom: "0.1rem solid var(--color-whitesmoke)",
        fontSize: "1.5rem",
        fontWeight: "500",
        color: "var(--color-black)",
        textAlign: "center",
        justifyContent: "center",
      },
    },
    cells: {
      style: {
        padding: "0 2rem",
        fontSize: "1.4rem",
        fontWeight: "500",
        color: "var(--color-slategray)",
        textAlign: "center",
        justifyContent: "center",
        display: "flex",
        alignItems: "center",
      },
    },
    rows: {
      style: {
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: "var(--shadow-datatable-row)",
        },
      },
    },
  };

  return (
    <main className="main_content">
      {/* Header */}
      <header>
        <section className="page_content_header">
          <h1>Technician Dashboard</h1>
          <p>Track, Update & Complete Your Service Requests</p>
        </section>
      </header>

      {/* Search Input */}
      <div className="search-container" style={customStyles.searchContainer}>
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* DataTable Component */}
      <div className="datatable_container">
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          striped
          responsive
          customStyles={customStyles}
          className="table_content"
        />
      </div>
    </main>
  );
};

export default TechnicianDashboard;
