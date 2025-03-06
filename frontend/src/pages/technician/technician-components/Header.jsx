import React, { useState } from "react";
import axios from "axios";

const Header = ({ activePage, toggleSidebar }) => {
  axios.defaults.withCredentials = true;

  const handleLogout = () => {
    console.log("clicked");
    axios.get("http://localhost:3000/technician/logout")
      .then((res) => {
        if (res.data.Status === "Success") {
          location.reload(true);
        } else alert("error");
      })
      .catch((err) => console.log(err));
  };

  return (
    <header>
      <section className="page_content_header">
        <h1>Technician Dashboard</h1>
        <p>Track, Update & Complete Your Service Requests</p>
      </section>
      <div className="head_action_btns">
        <button className="logout_btn_fill_primary" onClick={handleLogout}>
          Log Out
        </button>
        <button id="hamburger_Menu" className="hamburger_Menu" onClick={toggleSidebar}>
          <i className="fa-solid fa-bars"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
