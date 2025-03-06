<main className="main_content">

{/* Header */}
<header>
  <section className="page_content_header">
    <h1>Technician Dashboard</h1>
    <p>Track, Update & Complete Your Service Requests</p>
  </section>
</header>

<section>
  <div className="controls">
    <div className="filter-buttons">
      {["All", "Resolved", "Pending"].map((status) => (
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
                Token No: <span>{selectedComplaint.complaintId}</span>
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

</main>