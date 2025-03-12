import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";

const StatusCard = ({ count, head, icon, link }) => (
  <section className="stats_card_wrapper">
    <section className="stats_card">
      <section className="card__details">
        <p className="card__count">{count}</p>
        <p className="card__head">{head}</p>
      </section>
      <a href={link} className="card__more_info">
        <div className="info_right_icon">
          <i className="fa-solid fa-angle-right"></i>
        </div>
        <span>More Info</span>
      </a>
      <div className="stats_card_icon">
        <i className={icon}></i>
      </div>
    </section>
  </section>
);

const ComplaintTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/data/report-data.json")
      .then((response) => response.json())
      .then(setData)
      .catch((error) => console.error("Error loading JSON data:", error));
  }, []);


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
      cell: (row) => (
        <span className={`status ${row.status.toLowerCase().replace(/\s+/g, "-")}`}>
          {row.status}
        </span>
      ),
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
      cell: (row) => (
        <span className={`priority ${row.priority.toLowerCase()}`}>
          {row.priority}
        </span>
      ),
    },
  ];

  return (
    <div className="datatable-container">
      <DataTable
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        striped
        responsive
        className="table-content"
      />
    </div>
  );
};

const Dashboard = () => {
  const [values, setValues] = useState({
    najobs: 0,
    pendingjobs: 0,
    resolvedjobs: 0,
    onholdjobs: 0,
  });

  const [showPopup, setShowPopup] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [closeDate, setCloseDate] = useState("");
  const [isGenerateDisabled, setIsGenerateDisabled] = useState(true);
  const [isReportButtonDisabled, setIsReportButtonDisabled] = useState(false);
  const [showDownload, setShowDownload] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/coordinator/countjobs")
      .then((res) => setValues(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setIsGenerateDisabled(!(startDate && closeDate));
  }, [startDate, closeDate]);

  const handleOpenPopup = () => {
    setShowPopup(true);
    setIsReportButtonDisabled(false);
    setStartDate("");
    setCloseDate("");
    setIsGenerateDisabled(true);
  };


  const handleClosePopup = () => {
    setShowPopup(false);
    setIsReportButtonDisabled(false);
    setStartDate("");
    setCloseDate("");
  };

  const handleGenerateReport = (e) => {
    e.preventDefault();
    setShowPopup(false);
    setShowDownload(true);
  };

  const handleDownloadClick = () => {
    alert("Report Downloaded");
    setShowDownload(false);
  };

  const statusCards = [
    { count: values.resolvedjobs, head: "Resolved Jobs", icon: "fa-solid fa-check-double", link: "./coordinator/dashboard" },
    { count: values.pendingjobs, head: "Pending Jobs", icon: "fa-solid fa-clock-rotate-left", link: "./coordinator/dashboard" },
    { count: values.onholdjobs, head: "On Hold Jobs", icon: "fa-solid fa-pause", link: "./coordinator/dashboard" },
    { count: values.najobs, head: "Not Assigned", icon: "fa-solid fa-hourglass", link: "./coordinator/dashboard" },
  ];

  return (
    <>
      <section className="page_content_section dashboard_content">
        <section className="dashboard_overview">
          <section className="coordinator_head_container">
            <section className="head_container">
              <h2>Dashboard</h2>
              <p>Overview</p>
            </section>
            <div
              id="generate_report_btn"
              className={`icon_btn_fill_primary ${isReportButtonDisabled ? "disabled" : ""}`}
              onClick={!isReportButtonDisabled ? handleOpenPopup : undefined}
            >
              <i className="fa-solid fa-file-pdf"></i>
              <button disabled={isReportButtonDisabled}>
                <span>Generate Report</span>
              </button>
            </div>
          </section>
          <section className="overview_cards">
            {statusCards.map((card, index) => (
              <StatusCard key={index} {...card} />
            ))}
          </section>
        </section>
      </section>

      {showPopup && (
        <div className="popup_container">
          <div className="popup_content">
            <div className="x_icon" onClick={handleClosePopup}>
              <button className="close_popup">
                <img src="/assets/icons/x-icon.svg" alt="Close Sidebar" />
              </button>
            </div>
            <form className="popup_components" onSubmit={handleGenerateReport}>
              <h1 className="popup_primary_header">Generate Report</h1>
              <div className="input_area_wrapper">
                <section className="input_area_columns">
                  <div className="input_area_two_columns">
                    <section>
                      <div className="input_label">
                        <label htmlFor="start_date">Start Date:</label>
                      </div>
                      <input
                        type="date"
                        id="start_date"
                        name="start_date"
                        onChange={(e) => setStartDate(e.target.value)}
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
                        onChange={(e) => setCloseDate(e.target.value)}
                      />
                    </section>
                  </div>
                </section>
              </div>

              {/* Generate button only activates when both inputs are filled */}
              <section id="generate_btn" className="buttons_area_columns popup_button">
                <section className="btn_fill_primary">
                  <button
                    type="submit"
                    className={`main_button ${isGenerateDisabled ? "disabled_button" : ""}`}
                    disabled={isGenerateDisabled}
                  >
                    <span>Generate</span>
                  </button>
                </section>
              </section>
            </form>
          </div>
        </div>
      )}

      {showDownload && (
        <section className="download_report_cont">
          <section className="report_overview">
            <section className="coordinator_report_head_container">
              <section className="head_container">
                <h2>Report</h2>
                <p>Overview</p>
              </section>
              <div id="download_report_btn" className="icon_btn_fill_primary" onClick={handleDownloadClick}>
                <i className="fa-solid fa-file-arrow-down"></i>
                <button>
                  <span>Download Report</span>
                </button>
              </div>
            </section>
          </section>
          <ComplaintTable />
        </section>
      )}
    </>
  );
};

export default Dashboard;
