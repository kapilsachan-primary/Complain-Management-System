import React, { useState } from "react";
import Sidebar from "./technician-components/Sidebar";
import Header from "./technician-components/Header";
import Dashboard from "./technician-components/Dashboard";
import MyProfile from "./technician-components/MyProfile";
import ComplaintStatus from "./technician-components/ComplaintStatus";

const TechnicianDashboard = () => {
  // Sidebar Toggle
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Pages Content Toggle
  const [activePage, setActivePage] = useState("Dashboard");

  // Function to render the selected content
  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;
      case "MyProfile":
        return <MyProfile />;
      case "ComplaintStatus":
        return <ComplaintStatus />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <section className="admin-dashboard-wrapper">
      {/* Overlay (only visible when sidebar is open) */}
      {isSidebarOpen && <div className="sidebar_overlay" onClick={toggleSidebar}></div>}

      {/* Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <main className="main_content">
        {/* Header */}
        <Header activePage={activePage} toggleSidebar={toggleSidebar} />

        {/* Dynamic Content */}
        <div>{renderPage()}</div>
      </main>
    </section>
  );
};

export default TechnicianDashboard;
