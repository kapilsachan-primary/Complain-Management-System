import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import MyProfile from "./components/MyProfile";
import Technicians from "./components/Technicians";

const AdminDashboard = () => {
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
      default:
        return <Dashboard />;
    }
  };

  return (
    <section className="body-wrapper">
      {/* Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content */}
      <main className="main_content">
        {/* Header */}
        <Header activePage={activePage} />

        {/* Dynamic Content */}
        <div>{renderPage()}</div>
      </main>
    </section>
  );
};

export default AdminDashboard;
