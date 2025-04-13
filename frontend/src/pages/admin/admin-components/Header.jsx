import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Header = ({ activePage, toggleSidebar }) => {
  axios.defaults.withCredentials = true;
  const navigate=useNavigate();
  const handleLogout = () => {
    console.log("clicked");
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/admin/logout`)
      .then((res) => {
        if (res.data.Status === "Success") {
         // location.reload(true);
         localStorage.removeItem('atoken');
          navigate('admin-login');
        } else alert("error");
      })
      .catch((err) => console.log(err));
  };

  return (
    <header>
      <section className="page_content_header">
        <h1>Admin Dashboard</h1>
        <p>Manage users and track service requests.</p>
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
