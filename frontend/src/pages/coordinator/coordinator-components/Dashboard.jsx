import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import ReportValidate from "./ReportValidation";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
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


const ComplaintTable = ({ data }) => {
  // const [data, setData] = useState([]);

  // useEffect(() => {
  //   fetch("/data/report-data.json")
  //     .then((response) => response.json())
  //     .then(setData)
  //     .catch((error) => console.error("Error loading JSON data:", error));
  // }, []);


  const columns = [
    {
      name: <span className="column_header">Token no.</span>,
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
    //   cell: (row) => (
    //     <span className={`priority ${row.priority.toLowerCase()}`}>
    //       {row.priority}
    //     </span>
    //   ),
    // },
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
  axios.defaults.withCredentials = true;
  const [showPopup, setShowPopup] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [closeDate, setCloseDate] = useState("");
  const [isGenerateDisabled, setIsGenerateDisabled] = useState(true);
  const [isReportButtonDisabled, setIsReportButtonDisabled] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [complains, setComplains] = useState([]);
  const [errors, seterrors] = useState({});
  const [values, setValues] = useState({
    najobs: 0,
    pendingjobs: 0,
    resolvedjobs: 0,
    onholdjobs: 0,
  });

  const [name, setName] = useState("");
    const [id, setId] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/coordinator/status`).then((res) => {
            if (res.data.Status === "Success") {
                setName(res.data.name);
                setId(res.data.id);
            } else {
                navigate("/coordinator-login");
            }
        });
    }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/coordinator/countjobs`)
      .then((res) => setValues(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setIsGenerateDisabled(!(startDate && closeDate));
  }, [startDate, closeDate]);

  const filteredComplains = selectedStatus === "All"
    ? complains
    : complains.filter((item) => item.status.toLowerCase().trim() === selectedStatus.toLowerCase().trim());

  const getLocalDate = () => {
    const now = new Date(); const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${date}`;
  }

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
    seterrors(ReportValidate(startDate, closeDate))
    const checkerr = ReportValidate(startDate, closeDate);
    //console.log(checkerr)
    if (Object.entries(checkerr).length === 0) {
      //console.log("Lets roll!")
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/coordinator/report`, {
        params: { startDate, closeDate }
      }
      ).then(res => {
        //console.log(res.data);
        setComplains(res.data);
        setShowPopup(false);
        setShowDownload(true);
      }).catch(err => { console.log(err) })
    } else {
      setTimeout(() => seterrors({}), 3000); // Clear errors after 3 seconds
    }
  };

  // OLD CODE 
  // const handleDownloadClick = () => {
  //   const doc = new jsPDF();

  //   // Title
  //   doc.setFontSize(18);
  //   doc.text(`Coordinator ${selectedStatus} Complaints Report`, 20, 20);

  //   // Define table headers and data
  //   const tableColumn = ['Token No.', 'Issue Date', 'Closure Date', 'Technician', 'Category', 'Status'];
  //   const tableRows = filteredComplains.map(complaint => [
  //     complaint.tokenno,
  //     new Date(complaint.issuedate).toLocaleDateString(),
  //     complaint.closuredate?new Date(complaint.closuredate).toLocaleDateString():"MM/DD/YYYY",
  //     complaint.technician,
  //     complaint.category,
  //     complaint.status
  //   ]);

  //   // Create table using autoTable
  //   autoTable(doc, {
  //     head: [tableColumn],
  //     body: tableRows,
  //     startY: 30
  //   });

  //   // Format date
  //   const issue = new Date(startDate).toLocaleDateString();
  //   const close = new Date(closeDate).toLocaleDateString();

  //   // Save the PDF
  //   doc.save(`Coordinator Report (${selectedStatus}) from ${issue} to ${close}.pdf`);

  //   // Reset
  //   setSelectedStatus("All");
  //   setShowDownload(false);
  // };

  // NEW CODE 
  const handleDownloadClick = () => {
    const doc = new jsPDF();

    // Add logo image (Make sure to include the correct path or base64 encoded image)
    const logoPath = '/assets/logos/ldce-logo.png'; // Replace with actual path or base64 encoded logo
    doc.addImage(logoPath, 'PNG', 20, 10, 20, 20); // Adjust the position and size of the logo

    // Add Logo Name
    doc.setFontSize(20); // Adjusted size for better readability
    doc.text("L.D. College Of Engineering", 50, 22); // Position the name near the logo

    // Add Role, Name, Status
    doc.setFontSize(12);
    doc.text(`Role: Coordinator`, 20, 40); // Adjusted Y position for better spacing
    doc.text(`Name: ${name}`, 20, 50); // Replace with actual name variable
    doc.text(`Status: ${selectedStatus}`, 20, 60); // Replace with actual status variable

    // Add Report Summary (Date Range)
    const issue = new Date(startDate).toLocaleDateString();
    const close = new Date(closeDate).toLocaleDateString();
    doc.text(`Report Summary: ${issue} to ${close}`, 20, 70); // Adjusted Y position for better spacing

    // Define table headers and data
    const tableColumn = ['Token No.', 'Issue Date', 'Closure Date', 'Technician', 'Category', 'Status'];
    const tableRows = filteredComplains.map(complaint => [
      complaint.tokenno,
      new Date(complaint.issuedate).toLocaleDateString(),
      complaint.closuredate ? new Date(complaint.closuredate).toLocaleDateString() : "MM/DD/YYYY",
      complaint.technician,
      complaint.category,
      complaint.status
    ]);

    // Create table using autoTable
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 80 // Adjusted to provide space between report summary and table
    });

    // Save the PDF
    doc.save(`Coordinator Report (${selectedStatus}) from ${issue} to ${close}.pdf`);

    // Reset
    setSelectedStatus("All");
    // setShowDownload(false);
  };



  const handleExcelDownload = () => {
    //Step 1: Formatting data into rows.
    const formattedData = filteredComplains.map((c) => ({
      Token_No: c.tokenno,
      Issue_Date: new Date(c.issuedate).toLocaleDateString(),
      Closure_Date: c.closuredate ? new Date(c.closuredate).toLocaleDateString() : "MM/DD/YYYY",
      Technician: c.technician,
      Category: c.category,
      Status: c.status
    }))

    //Step 2: Create a worksheet from the formatted data
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    //Adding basic styling
    worksheet['!cols'] = [
      { wch: 13 }, //Token no
      { wch: 12 }, //Issue date
      { wch: 12 }, //Closure date
      { wch: 10 }, //Technician
      { wch: 45 }, //category
      { wch: 8 }, //Status
    ];

    //Step 3: Create a workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    //Have to clean the sheet name as character like / []\ are not allowed 
    XLSX.utils.book_append_sheet(workbook, worksheet, `Coordinator ${selectedStatus !== 'Y/A' ? selectedStatus : 'Y-A'} Report`)

    //Step 5: Trigger download of the file 
    // Format date
    const issue = new Date(startDate).toLocaleDateString();
    const close = new Date(closeDate).toLocaleDateString();
    XLSX.writeFile(workbook, `Coordinater Report (${selectedStatus}) from ${issue} to ${close}.xlsx`)

    // Reset
    setSelectedStatus("All");
    // setShowDownload(false);
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
              <i className="fa-solid fa-file-arrow-down"></i>
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
                        max={getLocalDate()}
                      />
                      {errors.startDate && <div style={{ color: 'red' }}>{errors.startDate}</div>}
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
                        max={getLocalDate()}
                      />
                      {errors.closeDate && <div style={{ color: 'red' }}>{errors.closeDate}</div>}
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
            <section className="report_head_container relative flex flex-col sm:flex-row justify-start !items-start gap-8 sm:gap-4">
              <section className="head_container">
                <h2>Report</h2>
                <p>Overview</p>
              </section>
              <div className="w-full sm:w-fit flex justify-center items-center flex-col sm:flex-row gap-8">
                <div className="select_container w-full sm:!w-60">
                  <select
                    className="w-full sm:!w-60 !h-[5rem]"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="All" selected>All</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Pending">Pending</option>
                    <option value="OnHold">On Hold</option>
                    <option value="Y/A">Y/A</option>
                  </select>
                </div>
                <button
                  id="download_report_btn"
                  className={`icon_btn_fill_primary ${complains.length === 0 ? 'disabled_button' : ''} w-full sm:w-fit`}
                  onClick={handleDownloadClick}
                  disabled={complains.length === 0}
                >
                  <i className="fa-solid fa-file-pdf"></i>
                  <span className="whitespace-nowrap">Download PDF</span>
                </button>
                <button
                  id="download_report_btn"
                  className={`icon_btn_fill_primary ${complains.length === 0 ? 'disabled_button' : ''} w-full sm:w-fit`}
                  onClick={handleExcelDownload}
                  disabled={complains.length === 0}
                >
                  <i class="fa-solid fa-file-excel"></i>
                  <span className="whitespace-nowrap">Download Excel</span>
                </button>
                <div className="x_icon absolute sm:relative top-10 right-10 sm:top-0 sm:right-0" onClick={() => setShowDownload(false)}>
                  <button className="close_popup">
                    <img src="/assets/icons/x-icon.svg" alt="Close Sidebar" className="w-14 h-14" />
                  </button>
                </div>
              </div>
            </section>
          </section>
          <ComplaintTable data={filteredComplains} />
        </section>
      )}
    </>
  );
};

export default Dashboard;
