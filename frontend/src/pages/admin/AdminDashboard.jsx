import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import MyProfile from "./components/MyProfile";
import Technicians from "./components/Technicians";
import ComplaintStatus from "./components/ComplaintStatus";

const AdminDashboard = () => {
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
      case "Technicians":
        return <Technicians />;
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

export default AdminDashboard;
