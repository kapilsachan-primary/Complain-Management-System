import React from "react";

const Header = ({ activePage }) => {
  return (
    <header>
      <section className="page_content_header">
        <h1>Admin Dashboard</h1>
        <p>Track, Update & Complete Your Service Requests</p>
      </section>
      <button className="logout_btn">
        Log Out
      </button>
    </header>
  );
};

export default Header;
