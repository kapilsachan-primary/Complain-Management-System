import React from "react";
import axios from "axios";
const Header = ({ activePage }) => {
  axios.defaults.withCredentials=true;
  const handlelogout=()=>{
    console.log("clicked");
    axios.get('http://localhost:3000/admin/logout')
    .then(res =>{
      if(res.data.Status === "Success"){
      location.reload(true);
      }
      else
      alert("error");
    }).catch(err => console.log(err))
  }
  return (
    <header>
      <section className="page_content_header">
        <h1>Admin Dashboard</h1>
        <p>Track, Update & Complete Your Service Requests</p>
      </section>
      <button className="logout_btn" onClick={handlelogout}>
        Log Out
      </button>
    </header>
  );
};

export default Header;
